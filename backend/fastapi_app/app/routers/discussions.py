
from fastapi import APIRouter, Depends, HTTPException, status, Query
from uuid import UUID
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, desc
from typing import List, Optional
from .. import models, schemas
from ..database import get_db
from ..dependencies import get_current_user



router = APIRouter(
    prefix="/api/discussions",
    tags=["Discussions"],
)

@router.get("/")
async def get_discussions(
    tag: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    query = db.query(models.Discussion).options(
        joinedload(models.Discussion.author),
        joinedload(models.Discussion.tags),
        joinedload(models.Discussion.attachments)
    )

    # Filter by tag if provided
    if tag:
        query = query.join(models.Discussion.tags).filter(models.Tag.name == tag)

    # Filter by search term if provided
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (models.Discussion.title.ilike(search_term)) |
            (models.Discussion.content.ilike(search_term))
        )

    # Order by creation date (newest first)
    query = query.order_by(desc(models.Discussion.created_at))

    # Paginate results
    discussions = query.offset(skip).limit(limit).all()

    # Format response
    result = []
    for discussion in discussions:
        # Count comments
        comment_count = db.query(func.count(models.Comment.id)).filter(
            models.Comment.discussion_id == discussion.id
        ).scalar()

        # Count upvotes
        upvote_count = db.query(func.count(models.Upvote.id)).filter(
            models.Upvote.discussion_id == discussion.id
        ).scalar()

        # Format author data
        author_data = {
            "id": discussion.author.id,
            "username": discussion.author.username,
            "email": discussion.author.email,
            "name": f"{discussion.author.first_name or ''} {discussion.author.last_name or ''}".strip(),
            "first_name": discussion.author.first_name,
            "last_name": discussion.author.last_name,
            "bio": discussion.author.bio,
            "avatar": discussion.author.avatar,
            "is_admin": discussion.author.is_admin,
            "isAdmin": discussion.author.is_admin,  # Duplicate for frontend compatibility
            "created_at": discussion.author.created_at.isoformat() if discussion.author.created_at else None,
            "joinedAt": discussion.author.created_at.isoformat() if discussion.author.created_at else None  # For frontend compatibility
        }

        # Format tags
        tags_data = []
        for tag in discussion.tags:
            tags_data.append({
                "id": tag.id,
                "name": tag.name,
                "description": tag.description,
                "count": 0  # Placeholder, not used in list view
            })

        # Format attachments
        attachments_data = []
        for attachment in discussion.attachments:
            attachments_data.append({
                "id": attachment.id,
                "name": attachment.name,
                "url": attachment.file_path,
                "size": attachment.size,
                "type": attachment.type,
                "uploaded_at": attachment.uploaded_at.isoformat() if attachment.uploaded_at else None,
                "uploadedAt": attachment.uploaded_at.isoformat() if attachment.uploaded_at else None  # For frontend compatibility
            })

        # Format discussion data with both snake_case and camelCase for frontend compatibility
        created_at_iso = discussion.created_at.isoformat() if discussion.created_at else None
        updated_at_iso = discussion.updated_at.isoformat() if discussion.updated_at else None

        discussion_data = {
            "id": discussion.id,
            "title": discussion.title,
            "content": discussion.content,
            "author": author_data,
            "created_at": created_at_iso,
            "createdAt": created_at_iso,  # For frontend compatibility
            "updated_at": updated_at_iso,
            "updatedAt": updated_at_iso,  # For frontend compatibility
            "tags": tags_data,
            "upvote_count": upvote_count,
            "upvotes": upvote_count,  # For frontend compatibility
            "comment_count": comment_count,
            "commentCount": comment_count,  # For frontend compatibility
            "has_upvoted": False,  # Default value when not logged in
            "hasUpvoted": False,  # For frontend compatibility
            "attachments": attachments_data
        }

        result.append(discussion_data)

    return result

@router.post("/", response_model=schemas.Discussion, status_code=status.HTTP_201_CREATED)
async def create_discussion(
    discussion_create: schemas.DiscussionCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    try:
        print(f"Creating discussion with title: {discussion_create.title}")
        print(f"Tags: {discussion_create.tags}")
        print(f"Attachments: {discussion_create.attachments}")

        # Create the discussion
        db_discussion = models.Discussion(
            title=discussion_create.title,
            content=discussion_create.content,
            author_id=current_user.id
        )
        db.add(db_discussion)
        db.commit()
        db.refresh(db_discussion)
        print(f"Created discussion with ID: {db_discussion.id}")

        # Add tags
        if discussion_create.tags:
            for tag_name in discussion_create.tags:
                tag = db.query(models.Tag).filter(models.Tag.name == tag_name).first()
                if not tag:
                    tag = models.Tag(name=tag_name)
                    db.add(tag)
                    db.commit()
                    db.refresh(tag)
                db_discussion.tags.append(tag)
            db.commit()
            print(f"Added {len(discussion_create.tags)} tags to discussion")

        # Add attachments
        if discussion_create.attachments:
            print(f"Processing {len(discussion_create.attachments)} attachments")
            for attachment_id in discussion_create.attachments:
                # Find the attachment by ID
                attachment = db.query(models.Attachment).filter(models.Attachment.id == attachment_id).first()
                if attachment:
                    print(f"Found attachment: {attachment.name}")
                    # Update the attachment to link it to this discussion
                    attachment.discussion_id = db_discussion.id
                    db.commit()
                    print(f"Linked attachment {attachment.id} to discussion {db_discussion.id}")
                else:
                    print(f"Warning: Attachment with ID {attachment_id} not found")

            # Commit all attachment changes
            db.commit()
            print(f"Processed attachments for discussion {db_discussion.id}")

        # Refresh to get all relationships
        db.refresh(db_discussion)
    except Exception as e:
        print(f"Error creating discussion: {str(e)}")
        db.rollback()
        raise

    # Format author data
    author_data = {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "name": f"{current_user.first_name or ''} {current_user.last_name or ''}".strip(),
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "bio": current_user.bio,
        "avatar": current_user.avatar,
        "is_admin": current_user.is_admin,
        "isAdmin": current_user.is_admin,  # Duplicate for frontend compatibility
        "created_at": current_user.created_at.isoformat() if current_user.created_at else None,
        "joinedAt": current_user.created_at.isoformat() if current_user.created_at else None  # For frontend compatibility
    }

    # Format tags
    tags_data = []
    for tag in db_discussion.tags:
        tags_data.append({
            "id": tag.id,
            "name": tag.name,
            "description": tag.description,
            "count": 0  # Placeholder, not used in detail view
        })

    # Format attachments
    attachments_data = []
    for attachment in db_discussion.attachments:
        attachments_data.append({
            "id": attachment.id,
            "name": attachment.name,
            "url": attachment.file_path,
            "size": attachment.size,
            "type": attachment.type,
            "uploaded_at": attachment.uploaded_at.isoformat() if attachment.uploaded_at else None,
            "uploadedAt": attachment.uploaded_at.isoformat() if attachment.uploaded_at else None  # For frontend compatibility
        })

    # Format discussion data with both snake_case and camelCase for frontend compatibility
    created_at_iso = db_discussion.created_at.isoformat() if db_discussion.created_at else None
    updated_at_iso = db_discussion.updated_at.isoformat() if db_discussion.updated_at else None

    # Return a dictionary with the discussion data
    return {
        "id": db_discussion.id,
        "title": db_discussion.title,
        "content": db_discussion.content,
        "author": author_data,
        "created_at": created_at_iso,
        "createdAt": created_at_iso,  # For frontend compatibility
        "updated_at": updated_at_iso,
        "updatedAt": updated_at_iso,  # For frontend compatibility
        "tags": tags_data,
        "upvote_count": 0,
        "upvotes": 0,  # For frontend compatibility
        "comment_count": 0,
        "commentCount": 0,  # For frontend compatibility
        "has_upvoted": False,
        "hasUpvoted": False,  # For frontend compatibility
        "attachments": attachments_data
    }

@router.get("/{discussion_id}")
async def get_discussion(
    discussion_id: str,
    db: Session = Depends(get_db),
):
    # Try to parse the ID as a UUID
    try:
        # First try to convert to UUID if it's a valid UUID format
        try:
            uuid_id = UUID(discussion_id)
            discussion = db.query(models.Discussion).filter(
                models.Discussion.id == str(uuid_id)
            ).options(
                joinedload(models.Discussion.author),
                joinedload(models.Discussion.tags),
                joinedload(models.Discussion.attachments)
            ).first()
        except ValueError:
            # If not a valid UUID, try to find by string ID directly
            discussion = db.query(models.Discussion).filter(
                models.Discussion.id == discussion_id
            ).options(
                joinedload(models.Discussion.author),
                joinedload(models.Discussion.tags),
                joinedload(models.Discussion.attachments)
            ).first()
    except Exception as e:
        print(f"Error fetching discussion: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching discussion: {str(e)}")

    if not discussion:
        raise HTTPException(status_code=404, detail="Discussion not found")

    # Count comments
    comment_count = db.query(func.count(models.Comment.id)).filter(
        models.Comment.discussion_id == discussion.id
    ).scalar()

    # Count upvotes
    upvote_count = db.query(func.count(models.Upvote.id)).filter(
        models.Upvote.discussion_id == discussion.id
    ).scalar()

    # Format author data
    author_data = {
        "id": discussion.author.id,
        "username": discussion.author.username,
        "email": discussion.author.email,
        "name": f"{discussion.author.first_name or ''} {discussion.author.last_name or ''}".strip(),
        "first_name": discussion.author.first_name,
        "last_name": discussion.author.last_name,
        "bio": discussion.author.bio,
        "avatar": discussion.author.avatar,
        "is_admin": discussion.author.is_admin,
        "isAdmin": discussion.author.is_admin,  # Duplicate for frontend compatibility
        "created_at": discussion.author.created_at.isoformat() if discussion.author.created_at else None,
        "joinedAt": discussion.author.created_at.isoformat() if discussion.author.created_at else None  # For frontend compatibility
    }

    # Format tags
    tags_data = []
    for tag in discussion.tags:
        tags_data.append({
            "id": tag.id,
            "name": tag.name,
            "description": tag.description,
            "count": 0  # Placeholder, not used in detail view
        })

    # Format attachments
    attachments_data = []
    for attachment in discussion.attachments:
        attachments_data.append({
            "id": attachment.id,
            "name": attachment.name,
            "url": attachment.file_path,
            "size": attachment.size,
            "type": attachment.type,
            "uploaded_at": attachment.uploaded_at.isoformat() if attachment.uploaded_at else None,
            "uploadedAt": attachment.uploaded_at.isoformat() if attachment.uploaded_at else None  # For frontend compatibility
        })

    # Format discussion data with both snake_case and camelCase for frontend compatibility
    created_at_iso = discussion.created_at.isoformat() if discussion.created_at else None
    updated_at_iso = discussion.updated_at.isoformat() if discussion.updated_at else None

    discussion_data = {
        "id": discussion.id,
        "title": discussion.title,
        "content": discussion.content,
        "author": author_data,
        "created_at": created_at_iso,
        "createdAt": created_at_iso,  # For frontend compatibility
        "updated_at": updated_at_iso,
        "updatedAt": updated_at_iso,  # For frontend compatibility
        "tags": tags_data,
        "upvote_count": upvote_count,
        "upvotes": upvote_count,  # For frontend compatibility
        "comment_count": comment_count,
        "commentCount": comment_count,  # For frontend compatibility
        "has_upvoted": False,  # Default value when not logged in
        "hasUpvoted": False,  # For frontend compatibility
        "attachments": attachments_data
    }

    return discussion_data

@router.put("/{discussion_id}", response_model=schemas.Discussion)
async def update_discussion(
    discussion_id: str,
    discussion_update: schemas.DiscussionUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
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

    # Check if user is the author
    if discussion.author_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this discussion",
        )

    # Update fields
    if discussion_update.title is not None:
        discussion.title = discussion_update.title
    if discussion_update.content is not None:
        discussion.content = discussion_update.content

    # Update tags if provided
    if discussion_update.tags is not None:
        # Remove existing tags
        discussion.tags = []
        db.commit()

        # Add new tags
        for tag_name in discussion_update.tags:
            tag = db.query(models.Tag).filter(models.Tag.name == tag_name).first()
            if not tag:
                tag = models.Tag(name=tag_name)
                db.add(tag)
                db.commit()
                db.refresh(tag)
            discussion.tags.append(tag)

    db.commit()
    db.refresh(discussion)

    # Add computed fields
    discussion.comment_count = db.query(func.count(models.Comment.id)).filter(
        models.Comment.discussion_id == discussion.id
    ).scalar()

    discussion.upvotes = db.query(func.count(models.Upvote.id)).filter(
        models.Upvote.discussion_id == discussion.id
    ).scalar()

    discussion.has_upvoted = db.query(models.Upvote).filter(
        models.Upvote.discussion_id == discussion.id,
        models.Upvote.user_id == current_user.id
    ).first() is not None

    return discussion

@router.delete("/{discussion_id}", status_code=status.HTTP_200_OK)
async def delete_discussion(
    discussion_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    try:
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

        # Check if user is the author or an admin
        if discussion.author_id != current_user.id and not current_user.is_admin:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this discussion",
            )

        # First delete related records (comments, upvotes, etc.)
        # Delete upvotes
        db.query(models.Upvote).filter(
            models.Upvote.discussion_id == discussion.id
        ).delete(synchronize_session=False)

        # Delete comments
        db.query(models.Comment).filter(
            models.Comment.discussion_id == discussion.id
        ).delete(synchronize_session=False)

        # Delete attachments
        db.query(models.Attachment).filter(
            models.Attachment.discussion_id == discussion.id
        ).delete(synchronize_session=False)

        # Delete tags association
        discussion.tags = []

        # Now delete the discussion
        db.delete(discussion)
        db.commit()

        return {"success": True, "message": "Discussion deleted successfully"}
    except Exception as e:
        db.rollback()
        print(f"Error deleting discussion: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete discussion: {str(e)}"
        )

@router.post("/{discussion_id}/upvote", response_model=schemas.UpvoteResponse)
async def upvote_discussion(
    discussion_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
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

    # Check if the user has already upvoted
    existing_upvote = db.query(models.Upvote).filter(
        models.Upvote.user_id == current_user.id,
        models.Upvote.discussion_id == discussion_id
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
            discussion_id=discussion_id
        )
        db.add(upvote)
        db.commit()

        # Create notification for discussion author
        if discussion.author_id != current_user.id:
            notification = models.Notification(
                user_id=discussion.author_id,
                from_user_id=current_user.id,
                type=models.NotificationType.upvote,
                message=f"{current_user.username} upvoted your discussion: {discussion.title}",
                discussion_id=discussion_id
            )
            db.add(notification)
            db.commit()

        has_upvoted = True

    # Count upvotes
    upvote_count = db.query(func.count(models.Upvote.id)).filter(
        models.Upvote.discussion_id == discussion_id
    ).scalar()

    # Return both snake_case and camelCase for frontend compatibility
    return {
        "upvotes": upvote_count,
        "upvote_count": upvote_count,
        "hasUpvoted": has_upvoted,
        "has_upvoted": has_upvoted
    }
