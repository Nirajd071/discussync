
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
    prefix="/api/discussions/{discussion_id}/comments",
    tags=["Comments"],
)

@router.get("/", response_model=List[schemas.Comment])
async def get_comments(
    discussion_id: str = Path(...),
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_optional_current_user),
):
    # Try both UUID and string formats
    try:
        uuid_id = UUID(discussion_id)
        discussion = db.query(models.Discussion).filter(
            models.Discussion.id == str(uuid_id)
        ).first()
    except ValueError:
        discussion = db.query(models.Discussion).filter(
            models.Discussion.id == discussion_id
        ).first()

    if not discussion:
        raise HTTPException(status_code=404, detail="Discussion not found")

    # Get only top-level comments (no parent)
    comments = db.query(models.Comment).filter(
        models.Comment.discussion_id == discussion_id,
        models.Comment.parent_id == None  # Only top-level comments
    ).options(
        joinedload(models.Comment.author),
        joinedload(models.Comment.replies).joinedload(models.Comment.author)
    ).order_by(models.Comment.created_at.desc()).all()

    # Debug SQL query
    print("SQL Query for comments:", str(db.query(models.Comment).filter(
        models.Comment.discussion_id == discussion_id,
        models.Comment.parent_id == None
    ).statement.compile(compile_kwargs={"literal_binds": True})))

    # Debug info
    print(f"Found {len(comments)} top-level comments for discussion {discussion_id}")
    for comment in comments:
        print(f"Comment {comment.id} has {len(comment.replies) if comment.replies else 0} replies")

    # Process comments to add upvotes count and has_upvoted flag
    result_comments = []
    for comment in comments:
        # Process author data
        author_dict = {
            "id": comment.author.id,
            "username": comment.author.username,
            "email": comment.author.email,
            "first_name": comment.author.first_name,
            "last_name": comment.author.last_name,
            "bio": comment.author.bio,
            "avatar": comment.author.avatar,
            "is_admin": comment.author.is_admin,
            "created_at": comment.author.created_at.isoformat() if hasattr(comment.author.created_at, 'isoformat') else str(comment.author.created_at)
        }

        # Create a dictionary to hold comment data
        comment_dict = {
            "id": comment.id,
            "content": comment.content,
            "author": author_dict,
            "created_at": comment.created_at.isoformat() if hasattr(comment.created_at, 'isoformat') else str(comment.created_at),
            "updated_at": comment.updated_at.isoformat() if comment.updated_at and hasattr(comment.updated_at, 'isoformat') else str(comment.updated_at) if comment.updated_at else None,
            "parent_id": comment.parent_id,
            "upvotes": db.query(func.count(models.Upvote.id)).filter(
                models.Upvote.comment_id == comment.id
            ).scalar(),
            "has_upvoted": False,
            "mentioned_users": [user.username for user in comment.mentions] if hasattr(comment, 'mentions') else [],
            "replies": []
        }

        # Check if current user has upvoted
        if current_user:
            comment_dict["has_upvoted"] = db.query(models.Upvote).filter(
                models.Upvote.comment_id == comment.id,
                models.Upvote.user_id == current_user.id
            ).first() is not None

        # Get replies for this comment using the helper function
        comment_dict["replies"] = get_nested_replies(db, comment.id, current_user)

        # Debug info
        print(f"Explicitly loaded {len(comment_dict['replies'])} replies for comment {comment.id}")

        result_comments.append(comment_dict)

    return result_comments

@router.post("/", response_model=schemas.Comment, status_code=status.HTTP_201_CREATED)
async def create_comment(
    comment_create: schemas.CommentCreate,
    discussion_id: str = Path(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # Print debug info
    print(f"Creating comment for discussion: {discussion_id}")
    print(f"Comment content: {comment_create.content[:50]}...")
    print(f"Parent ID: {comment_create.parent_id}")

    # Try both UUID and string formats
    try:
        uuid_id = UUID(discussion_id)
        discussion = db.query(models.Discussion).filter(
            models.Discussion.id == str(uuid_id)
        ).first()
    except ValueError:
        discussion = db.query(models.Discussion).filter(
            models.Discussion.id == discussion_id
        ).first()

    if not discussion:
        print(f"Discussion not found with ID: {discussion_id}")
        raise HTTPException(status_code=404, detail="Discussion not found")

    print(f"Discussion found: {discussion.title}")

    # Check if parent comment exists if provided
    if comment_create.parent_id:
        # Convert parent_id to string if it's a UUID
        parent_id_str = str(comment_create.parent_id)

        # Debug info
        print(f"Looking for parent comment with ID: {parent_id_str}")

        # Try to find the parent comment without discussion_id filter first
        parent_comment = db.query(models.Comment).filter(
            models.Comment.id == parent_id_str
        ).first()

        if not parent_comment:
            print(f"Parent comment not found with ID: {parent_id_str}")
            raise HTTPException(status_code=404, detail="Parent comment not found")

        # Verify the parent comment belongs to the same discussion
        if parent_comment.discussion_id != discussion_id:
            print(f"Parent comment found but belongs to different discussion: {parent_comment.discussion_id}")
            raise HTTPException(status_code=400, detail="Parent comment belongs to a different discussion")

    # Create comment
    db_comment = models.Comment(
        content=comment_create.content,
        author_id=current_user.id,
        discussion_id=discussion_id,
        parent_id=comment_create.parent_id
    )
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)

    # Extract and process mentions
    mentioned_usernames = utils.extract_mentions(comment_create.content)

    for username in mentioned_usernames:
        user = db.query(models.User).filter(models.User.username == username).first()
        if user:
            # Add user to mentions
            db_comment.mentions.append(user)

            # Create mention notification
            if user.id != current_user.id:
                notification = models.Notification(
                    user_id=user.id,
                    from_user_id=current_user.id,
                    type=models.NotificationType.mention,
                    message=f"{current_user.username} mentioned you in a comment",
                    discussion_id=discussion_id,
                    comment_id=db_comment.id
                )
                db.add(notification)

    # Create notification for parent comment author
    if comment_create.parent_id:
        parent_author_id = db.query(models.Comment.author_id).filter(
            models.Comment.id == comment_create.parent_id
        ).scalar()

        if parent_author_id and parent_author_id != current_user.id:
            notification = models.Notification(
                user_id=parent_author_id,
                from_user_id=current_user.id,
                type=models.NotificationType.reply,
                message=f"{current_user.username} replied to your comment",
                discussion_id=discussion_id,
                comment_id=db_comment.id
            )
            db.add(notification)

    # Create notification for discussion author if not already notified
    elif discussion.author_id != current_user.id:
        notification = models.Notification(
            user_id=discussion.author_id,
            from_user_id=current_user.id,
            type=models.NotificationType.reply,
            message=f"{current_user.username} commented on your discussion",
            discussion_id=discussion_id,
            comment_id=db_comment.id
        )
        db.add(notification)

    db.commit()
    db.refresh(db_comment)

    # Create a dictionary with computed fields for the response
    comment_dict = {
        "id": db_comment.id,
        "content": db_comment.content,
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
        "created_at": db_comment.created_at.isoformat() if hasattr(db_comment.created_at, 'isoformat') else str(db_comment.created_at),
        "updated_at": db_comment.updated_at.isoformat() if db_comment.updated_at and hasattr(db_comment.updated_at, 'isoformat') else str(db_comment.updated_at) if db_comment.updated_at else None,
        "parent_id": db_comment.parent_id,
        "upvotes": 0,
        "has_upvoted": False,
        "mentioned_users": [user.username for user in db_comment.mentions],
        "replies": []  # New comment won't have replies yet
    }

    return comment_dict

@router.put("/{comment_id}", response_model=schemas.Comment)
async def update_comment(
    comment_id: str,
    comment_update: schemas.CommentUpdate,
    discussion_id: str = Path(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # Get comment
    comment = db.query(models.Comment).filter(
        models.Comment.id == comment_id,
        models.Comment.discussion_id == discussion_id
    ).first()

    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    # Check if user is the author or an admin
    if comment.author_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this comment",
        )

    # Update comment
    if comment_update.content is not None:
        comment.content = comment_update.content

        # Update mentions
        new_mentioned_usernames = utils.extract_mentions(comment_update.content)
        old_mentions = [user for user in comment.mentions]

        # Clear existing mentions
        comment.mentions = []
        db.commit()

        # Add new mentions
        for username in new_mentioned_usernames:
            user = db.query(models.User).filter(models.User.username == username).first()
            if user:
                comment.mentions.append(user)

                # Create notification for new mentions
                if user.id != current_user.id and user not in old_mentions:
                    notification = models.Notification(
                        user_id=user.id,
                        from_user_id=current_user.id,
                        type=models.NotificationType.mention,
                        message=f"{current_user.username} mentioned you in a comment",
                        discussion_id=discussion_id,
                        comment_id=comment_id
                    )
                    db.add(notification)

    db.commit()
    db.refresh(comment)

    # Get upvotes count
    upvotes_count = db.query(func.count(models.Upvote.id)).filter(
        models.Upvote.comment_id == comment.id
    ).scalar()

    # Check if user has upvoted
    has_upvoted = db.query(models.Upvote).filter(
        models.Upvote.comment_id == comment.id,
        models.Upvote.user_id == current_user.id
    ).first() is not None

    # Get replies
    replies = db.query(models.Comment).filter(
        models.Comment.parent_id == comment.id
    ).options(
        joinedload(models.Comment.author)
    ).all()

    # Process replies
    reply_dicts = []
    for reply in replies:
        reply_upvotes = db.query(func.count(models.Upvote.id)).filter(
            models.Upvote.comment_id == reply.id
        ).scalar()

        reply_has_upvoted = db.query(models.Upvote).filter(
            models.Upvote.comment_id == reply.id,
            models.Upvote.user_id == current_user.id
        ).first() is not None

        reply_dict = {
            "id": reply.id,
            "content": reply.content,
            "author": {
                "id": reply.author.id,
                "username": reply.author.username,
                "email": reply.author.email,
                "first_name": reply.author.first_name,
                "last_name": reply.author.last_name,
                "bio": reply.author.bio,
                "avatar": reply.author.avatar,
                "is_admin": reply.author.is_admin,
                "created_at": reply.author.created_at.isoformat() if hasattr(reply.author.created_at, 'isoformat') else str(reply.author.created_at)
            },
            "created_at": reply.created_at.isoformat() if hasattr(reply.created_at, 'isoformat') else str(reply.created_at),
            "updated_at": reply.updated_at.isoformat() if reply.updated_at and hasattr(reply.updated_at, 'isoformat') else str(reply.updated_at) if reply.updated_at else None,
            "parent_id": reply.parent_id,
            "upvotes": reply_upvotes,
            "has_upvoted": reply_has_upvoted,
            "mentioned_users": [user.username for user in reply.mentions] if hasattr(reply, 'mentions') else [],
            # Get nested replies (replies to this reply)
            "replies": get_nested_replies(db, reply.id, current_user)
        }
        reply_dicts.append(reply_dict)

    # Create response dictionary
    comment_dict = {
        "id": comment.id,
        "content": comment.content,
        "author": {
            "id": comment.author.id,
            "username": comment.author.username,
            "email": comment.author.email,
            "first_name": comment.author.first_name,
            "last_name": comment.author.last_name,
            "bio": comment.author.bio,
            "avatar": comment.author.avatar,
            "is_admin": comment.author.is_admin,
            "created_at": comment.author.created_at.isoformat() if hasattr(comment.author.created_at, 'isoformat') else str(comment.author.created_at)
        },
        "created_at": comment.created_at.isoformat() if hasattr(comment.created_at, 'isoformat') else str(comment.created_at),
        "updated_at": comment.updated_at.isoformat() if comment.updated_at and hasattr(comment.updated_at, 'isoformat') else str(comment.updated_at) if comment.updated_at else None,
        "parent_id": comment.parent_id,
        "upvotes": upvotes_count,
        "has_upvoted": has_upvoted,
        "mentioned_users": [user.username for user in comment.mentions],
        "replies": reply_dicts
    }

    return comment_dict

@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comment(
    comment_id: str,
    discussion_id: str = Path(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """
    Delete a comment and all its replies (only by author or admin)
    """
    # Get comment
    comment = db.query(models.Comment).filter(
        models.Comment.id == comment_id
    ).first()

    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )

    # Get the discussion to check if the current user is the discussion creator
    discussion = db.query(models.Discussion).filter(
        models.Discussion.id == comment.discussion_id
    ).first()

    # Check if user is author, admin, or the discussion creator
    if (comment.author_id != current_user.id and
        not current_user.is_admin and
        discussion and discussion.author_id != current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this comment"
        )

    # Get all replies to this comment
    replies = db.query(models.Comment).filter(
        models.Comment.parent_id == comment_id
    ).all()

    # Delete all replies first
    for reply in replies:
        # Delete upvotes for the reply
        db.query(models.Upvote).filter(
            models.Upvote.comment_id == reply.id
        ).delete()

        # Delete notifications for the reply
        db.query(models.Notification).filter(
            models.Notification.comment_id == reply.id
        ).delete()

        # Delete the reply
        db.delete(reply)

    # Delete upvotes for the comment
    db.query(models.Upvote).filter(
        models.Upvote.comment_id == comment_id
    ).delete()

    # Delete notifications for the comment
    db.query(models.Notification).filter(
        models.Notification.comment_id == comment_id
    ).delete()

    # Delete the comment
    db.delete(comment)
    db.commit()

    return None

@router.post("/{comment_id}/upvote", response_model=schemas.UpvoteResponse)
async def upvote_comment(
    comment_id: str,
    discussion_id: str = Path(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # Get comment - if discussion_id is 'any', don't filter by discussion_id
    if discussion_id.lower() == 'any':
        comment = db.query(models.Comment).filter(
            models.Comment.id == comment_id
        ).first()
    else:
        comment = db.query(models.Comment).filter(
            models.Comment.id == comment_id,
            models.Comment.discussion_id == discussion_id
        ).first()

    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    # Check if the user has already upvoted
    existing_upvote = db.query(models.Upvote).filter(
        models.Upvote.user_id == current_user.id,
        models.Upvote.comment_id == comment_id
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
            comment_id=comment_id
        )
        db.add(upvote)
        db.commit()

        # Create notification for comment author
        if comment.author_id != current_user.id:
            notification = models.Notification(
                user_id=comment.author_id,
                from_user_id=current_user.id,
                type=models.NotificationType.upvote,
                message=f"{current_user.username} upvoted your comment",
                discussion_id=discussion_id,
                comment_id=comment_id
            )
            db.add(notification)
            db.commit()

        has_upvoted = True

    # Count upvotes
    upvote_count = db.query(func.count(models.Upvote.id)).filter(
        models.Upvote.comment_id == comment_id
    ).scalar()

    return {
        "upvotes": upvote_count,
        "hasUpvoted": has_upvoted
    }
