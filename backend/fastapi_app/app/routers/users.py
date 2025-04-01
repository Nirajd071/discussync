
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import os
import uuid
import shutil
from .. import models, schemas
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
