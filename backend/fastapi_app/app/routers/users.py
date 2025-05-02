
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from typing import List
import os
import uuid
import shutil
from .. import models, schemas, utils
from ..database import get_db
from ..dependencies import get_current_user, get_admin_user

router = APIRouter(
    prefix="/api/users",
    tags=["Users"],
    responses={401: {"description": "Unauthorized"}},
)

@router.get("/", response_model=List[schemas.User])
async def get_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user),
):
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users

@router.get("/{user_id}", response_model=schemas.User)
async def get_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user),
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/{user_id}/discussions")
async def get_user_discussions(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user),
):
    # Check if user exists
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    # Get discussions by this user
    query = db.query(models.Discussion).filter(
        models.Discussion.author_id == user_id
    ).options(
        joinedload(models.Discussion.author),
        joinedload(models.Discussion.tags),
        joinedload(models.Discussion.attachments)
    ).order_by(models.Discussion.created_at.desc())

    discussions = query.all()

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
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "name": f"{user.first_name or ''} {user.last_name or ''}".strip(),
            "first_name": user.first_name,
            "last_name": user.last_name,
            "bio": user.bio,
            "avatar": user.avatar,
            "is_admin": user.is_admin,
            "isAdmin": user.is_admin,  # Duplicate for frontend compatibility
            "created_at": user.created_at.isoformat() if user.created_at else None,
            "joinedAt": user.created_at.isoformat() if user.created_at else None  # For frontend compatibility
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

        # Check if current user has upvoted this discussion
        has_upvoted = False
        if current_user:
            has_upvoted = db.query(models.Upvote).filter(
                models.Upvote.discussion_id == discussion.id,
                models.Upvote.user_id == current_user.id
            ).first() is not None

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
            "has_upvoted": has_upvoted,
            "hasUpvoted": has_upvoted,  # For frontend compatibility
            "attachments": attachments_data
        }

        result.append(discussion_data)

    return result

@router.patch("/me", response_model=schemas.User)
async def update_user(
    user_update: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # Update user data
    for key, value in user_update.dict(exclude_unset=True).items():
        if key == "password" and value:
            setattr(current_user, "hashed_password", utils.get_password_hash(value))
        elif hasattr(current_user, key):
            setattr(current_user, key, value)

    db.commit()
    db.refresh(current_user)
    return current_user

@router.post("/me/avatar", response_model=schemas.User)
async def upload_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # Check if file is an image
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be an image",
        )

    # Create uploads directory if it doesn't exist
    uploads_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads", "avatars")
    os.makedirs(uploads_dir, exist_ok=True)

    # Save file with unique name
    file_extension = os.path.splitext(file.filename)[1]
    filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(uploads_dir, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Update user avatar
    current_user.avatar = f"/uploads/avatars/{filename}"
    db.commit()
    db.refresh(current_user)

    return current_user

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_admin_user),  # Only admins can delete users
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    # Don't allow deleting self
    if str(current_user.id) == user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete own account",
        )

    db.delete(user)
    db.commit()
