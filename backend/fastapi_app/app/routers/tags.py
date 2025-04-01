
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from .. import models, schemas
from ..database import get_db
from ..dependencies import get_current_user, get_admin_user

router = APIRouter(
    prefix="/api/tags",
    tags=["Tags"],
)

@router.get("/", response_model=List[schemas.Tag])
async def get_tags(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    # Get tags with discussion count
    tags = db.query(
        models.Tag,
        func.count(models.discussion_tag.c.discussion_id).label("count")
    ).outerjoin(
        models.discussion_tag,
        models.Tag.id == models.discussion_tag.c.tag_id
    ).group_by(
        models.Tag.id
    ).offset(skip).limit(limit).all()
    
    # Convert to response format
    result = []
    for tag, count in tags:
        tag_dict = {
            "id": tag.id,
            "name": tag.name,
            "description": tag.description,
            "count": count
        }
        result.append(tag_dict)
    
    return result

@router.post("/", response_model=schemas.Tag, status_code=status.HTTP_201_CREATED)
async def create_tag(
    tag_create: schemas.TagCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_admin_user),  # Only admins can create tags
):
    # Check if tag already exists
    existing_tag = db.query(models.Tag).filter(models.Tag.name == tag_create.name).first()
    if existing_tag:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Tag '{tag_create.name}' already exists",
        )
    
    # Create tag
    db_tag = models.Tag(**tag_create.dict())
    db.add(db_tag)
    db.commit()
    db.refresh(db_tag)
    
    # Add count field
    db_tag.count = 0
    
    return db_tag

@router.put("/{tag_id}", response_model=schemas.Tag)
async def update_tag(
    tag_id: str,
    tag_update: schemas.TagUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_admin_user),  # Only admins can update tags
):
    # Get tag
    tag = db.query(models.Tag).filter(models.Tag.id == tag_id).first()
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")
    
    # Check if name is being updated and it already exists
    if tag_update.name and tag_update.name != tag.name:
        existing_tag = db.query(models.Tag).filter(models.Tag.name == tag_update.name).first()
        if existing_tag:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Tag '{tag_update.name}' already exists",
            )
    
    # Update tag
    for key, value in tag_update.dict(exclude_unset=True).items():
        setattr(tag, key, value)
    
    db.commit()
    db.refresh(tag)
    
    # Get count
    count = db.query(func.count()).filter(
        models.discussion_tag.c.tag_id == tag.id
    ).scalar()
    
    # Add count field
    tag.count = count
    
    return tag

@router.delete("/{tag_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_tag(
    tag_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_admin_user),  # Only admins can delete tags
):
    # Get tag
    tag = db.query(models.Tag).filter(models.Tag.id == tag_id).first()
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")
    
    # Delete tag
    db.delete(tag)
    db.commit()
