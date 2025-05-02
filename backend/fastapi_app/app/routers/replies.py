from fastapi import APIRouter, Depends, HTTPException, status, Path
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from typing import List, Optional, Dict, Any
from uuid import UUID
from .. import models, schemas, utils
from ..database import get_db
from ..dependencies import get_current_user, get_optional_current_user

# Helper function to get nested replies (replies to replies)
def get_nested_replies(db: Session, parent_id: str, current_user: Optional[models.User] = None) -> List[Dict[str, Any]]:
    """Get all replies for a specific reply"""
    # Get nested replies
    nested_replies = db.query(models.Comment).filter(
        models.Comment.parent_id == parent_id
    ).options(
        joinedload(models.Comment.author)
    ).order_by(models.Comment.created_at.asc()).all()

    # If no nested replies, return empty list
    if not nested_replies:
        return []

    # Format nested replies
    result = []
    for reply in nested_replies:
        # Format author data
        author = reply.author
        author_dict = {
            "id": author.id,
            "username": author.username,
            "email": author.email,
            "name": f"{author.first_name or ''} {author.last_name or ''}".strip() or author.username,
            "first_name": author.first_name,
            "last_name": author.last_name,
            "bio": author.bio,
            "avatar": author.avatar,
            "is_admin": author.is_admin,
            "created_at": author.created_at.isoformat() if hasattr(author.created_at, 'isoformat') else str(author.created_at)
        }

        # Create a dictionary to hold reply data
        reply_dict = {
            "id": reply.id,
            "content": reply.content,
            "author": author_dict,
            "created_at": reply.created_at.isoformat() if hasattr(reply.created_at, 'isoformat') else str(reply.created_at),
            "updated_at": reply.updated_at.isoformat() if reply.updated_at and hasattr(reply.updated_at, 'isoformat') else str(reply.updated_at) if reply.updated_at else None,
            "parent_id": reply.parent_id,
            "upvotes": db.query(func.count(models.Upvote.id)).filter(
                models.Upvote.comment_id == reply.id
            ).scalar(),
            "has_upvoted": False,
            "mentioned_users": [user.username for user in reply.mentions] if hasattr(reply, 'mentions') else [],
            # Recursively get nested replies (replies to this reply)
            "replies": get_nested_replies(db, reply.id, current_user)
        }

        # Check if current user has upvoted
        if current_user:
            reply_dict["has_upvoted"] = db.query(models.Upvote).filter(
                models.Upvote.comment_id == reply.id,
                models.Upvote.user_id == current_user.id
            ).first() is not None

        result.append(reply_dict)

    return result

router = APIRouter(
    prefix="/api/comments/{comment_id}/replies",
    tags=["Replies"],
)

@router.get("/", response_model=List[schemas.Comment])
async def get_replies(
    comment_id: str = Path(...),
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_optional_current_user),
):
    """Get all replies for a specific comment"""
    # Check if comment exists
    comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    # Get replies
    replies = db.query(models.Comment).filter(
        models.Comment.parent_id == comment_id
    ).options(
        joinedload(models.Comment.author)
    ).order_by(models.Comment.created_at.asc()).all()

    # Debug info
    print(f"Found {len(replies)} replies for comment {comment_id}")

    # Process replies to add upvotes count and has_upvoted flag
    result_replies = []
    for reply in replies:
        # Process author data
        author_dict = {
            "id": reply.author.id,
            "username": reply.author.username,
            "email": reply.author.email,
            "first_name": reply.author.first_name,
            "last_name": reply.author.last_name,
            "bio": reply.author.bio,
            "avatar": reply.author.avatar,
            "is_admin": reply.author.is_admin,
            "created_at": reply.author.created_at.isoformat() if hasattr(reply.author.created_at, 'isoformat') else str(reply.author.created_at)
        }

        # Create a dictionary to hold reply data
        reply_dict = {
            "id": reply.id,
            "content": reply.content,
            "author": author_dict,
            "created_at": reply.created_at.isoformat() if hasattr(reply.created_at, 'isoformat') else str(reply.created_at),
            "updated_at": reply.updated_at.isoformat() if reply.updated_at and hasattr(reply.updated_at, 'isoformat') else str(reply.updated_at) if reply.updated_at else None,
            "parent_id": reply.parent_id,
            "upvotes": db.query(func.count(models.Upvote.id)).filter(
                models.Upvote.comment_id == reply.id
            ).scalar(),
            "has_upvoted": False,
            "mentioned_users": [user.username for user in reply.mentions] if hasattr(reply, 'mentions') else [],
            # Get nested replies (replies to this reply)
            "replies": get_nested_replies(db, reply.id, current_user)
        }

        # Check if current user has upvoted
        if current_user:
            reply_dict["has_upvoted"] = db.query(models.Upvote).filter(
                models.Upvote.comment_id == reply.id,
                models.Upvote.user_id == current_user.id
            ).first() is not None

        result_replies.append(reply_dict)

    return result_replies

@router.post("/", response_model=schemas.Comment, status_code=status.HTTP_201_CREATED)
async def create_reply(
    reply_create: schemas.CommentCreate,
    comment_id: str = Path(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Create a reply to a specific comment"""
    # Print debug info
    print(f"Creating reply for comment: {comment_id}")
    print(f"Reply content: {reply_create.content[:50]}...")

    # Check if parent comment exists
    parent_comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    if not parent_comment:
        print(f"Parent comment not found with ID: {comment_id}")
        raise HTTPException(status_code=404, detail="Parent comment not found")

    print(f"Parent comment found: {parent_comment.content[:50]}...")

    # Get the discussion ID from the parent comment
    discussion_id = parent_comment.discussion_id

    # Create reply
    db_reply = models.Comment(
        content=reply_create.content,
        author_id=current_user.id,
        discussion_id=discussion_id,
        parent_id=comment_id
    )
    db.add(db_reply)
    db.commit()
    db.refresh(db_reply)

    # Extract and process mentions
    mentioned_usernames = utils.extract_mentions(reply_create.content)

    for username in mentioned_usernames:
        user = db.query(models.User).filter(models.User.username == username).first()
        if user:
            # Add user to mentions
            db_reply.mentions.append(user)

            # Create mention notification
            if user.id != current_user.id:
                notification = models.Notification(
                    user_id=user.id,
                    from_user_id=current_user.id,
                    type=models.NotificationType.mention,
                    message=f"{current_user.username} mentioned you in a reply",
                    discussion_id=discussion_id,
                    comment_id=db_reply.id
                )
                db.add(notification)

    # Create notification for parent comment author
    parent_author_id = parent_comment.author_id
    if parent_author_id and parent_author_id != current_user.id:
        notification = models.Notification(
            user_id=parent_author_id,
            from_user_id=current_user.id,
            type=models.NotificationType.reply,
            message=f"{current_user.username} replied to your comment",
            discussion_id=discussion_id,
            comment_id=db_reply.id
        )
        db.add(notification)

    db.commit()
    db.refresh(db_reply)

    # Add computed fields for the response as a dictionary
    reply_dict = {
        "id": db_reply.id,
        "content": db_reply.content,
        "author": {
            "id": current_user.id,
            "username": current_user.username,
            "email": current_user.email,
            "first_name": current_user.first_name,
            "last_name": current_user.last_name,
            "bio": current_user.bio,
            "avatar": current_user.avatar,
            "is_admin": current_user.is_admin,
            "created_at": current_user.created_at.isoformat() if hasattr(current_user.created_at, 'isoformat') else str(current_user.created_at)
        },
        "created_at": db_reply.created_at.isoformat() if hasattr(db_reply.created_at, 'isoformat') else str(db_reply.created_at),
        "updated_at": db_reply.updated_at.isoformat() if db_reply.updated_at and hasattr(db_reply.updated_at, 'isoformat') else str(db_reply.updated_at) if db_reply.updated_at else None,
        "parent_id": db_reply.parent_id,
        "upvotes": 0,
        "has_upvoted": False,
        "mentioned_users": [user.username for user in db_reply.mentions],
        "replies": []
    }

    return reply_dict

@router.delete("/{reply_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_reply(
    reply_id: str,
    comment_id: str = Path(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Delete a reply (only by author or admin)"""
    # Check if reply exists
    reply = db.query(models.Comment).filter(
        models.Comment.id == reply_id,
        models.Comment.parent_id == comment_id
    ).first()

    if not reply:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reply not found"
        )

    # Get the parent comment to find the discussion
    parent_comment = db.query(models.Comment).filter(
        models.Comment.id == comment_id
    ).first()

    if parent_comment:
        # Get the discussion to check if the current user is the discussion creator
        discussion = db.query(models.Discussion).filter(
            models.Discussion.id == parent_comment.discussion_id
        ).first()

        # Check if user is author, admin, or the discussion creator
        if (reply.author_id != current_user.id and
            not current_user.is_admin and
            discussion and discussion.author_id != current_user.id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this reply"
            )
    else:
        # If we can't find the parent comment, fall back to the original check
        if reply.author_id != current_user.id and not current_user.is_admin:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this reply"
            )

    # Delete upvotes for the reply
    db.query(models.Upvote).filter(
        models.Upvote.comment_id == reply_id
    ).delete()

    # Delete notifications for the reply
    db.query(models.Notification).filter(
        models.Notification.comment_id == reply_id
    ).delete()

    # Delete the reply
    db.delete(reply)
    db.commit()

    return None

@router.post("/{reply_id}/upvote", response_model=schemas.UpvoteResponse)
async def upvote_reply(
    reply_id: str,
    comment_id: str = Path(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Upvote a reply"""
    # Check if reply exists
    reply = db.query(models.Comment).filter(
        models.Comment.id == reply_id,
        models.Comment.parent_id == comment_id
    ).first()

    if not reply:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reply not found"
        )

    # Get the discussion ID from the reply
    discussion_id = reply.discussion_id

    # Check if the user has already upvoted
    existing_upvote = db.query(models.Upvote).filter(
        models.Upvote.user_id == current_user.id,
        models.Upvote.comment_id == reply_id
    ).first()

    if existing_upvote:
        # Remove upvote if it exists
        db.delete(existing_upvote)
        db.commit()
        has_upvoted = False
    else:
        # Create new upvote
        upvote = models.Upvote(
            user_id=current_user.id,
            comment_id=reply_id
        )
        db.add(upvote)
        db.commit()

        # Create notification for reply author
        if reply.author_id != current_user.id:
            notification = models.Notification(
                user_id=reply.author_id,
                from_user_id=current_user.id,
                type=models.NotificationType.upvote,
                message=f"{current_user.username} upvoted your reply",
                discussion_id=discussion_id,
                comment_id=reply_id
            )
            db.add(notification)
            db.commit()

        has_upvoted = True

    # Count upvotes
    upvote_count = db.query(func.count(models.Upvote.id)).filter(
        models.Upvote.comment_id == reply_id
    ).scalar()

    return {
        "upvotes": upvote_count,
        "hasUpvoted": has_upvoted
    }
