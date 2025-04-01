
from fastapi import APIRouter, Depends, HTTPException, status, Query
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

@router.get("/", response_model=List[schemas.Discussion])
async def get_discussions(
    tag: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_current_user),
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
    
    # Add additional fields
    for discussion in discussions:
        # Count comments
        discussion.comment_count = db.query(func.count(models.Comment.id)).filter(
            models.Comment.discussion_id == discussion.id
        ).scalar()
        
        # Count upvotes
        discussion.upvotes = db.query(func.count(models.Upvote.id)).filter(
            models.Upvote.discussion_id == discussion.id
        ).scalar()
        
        # Check if current user has upvoted
        if current_user:
            discussion.has_upvoted = db.query(models.Upvote).filter(
                models.Upvote.discussion_id == discussion.id,
                models.Upvote.user_id == current_user.id
            ).first() is not None
        else:
            discussion.has_upvoted = False
    
    return discussions

@router.post("/", response_model=schemas.Discussion, status_code=status.HTTP_201_CREATED)
async def create_discussion(
    discussion_create: schemas.DiscussionCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # Create the discussion
    db_discussion = models.Discussion(
        title=discussion_create.title,
        content=discussion_create.content,
        author_id=current_user.id
    )
    db.add(db_discussion)
    db.commit()
    db.refresh(db_discussion)
    
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
    
    # Refresh to get all relationships
    db.refresh(db_discussion)
    
    # Add computed fields
    db_discussion.comment_count = 0
    db_discussion.upvotes = 0
    db_discussion.has_upvoted = False
    
    return db_discussion

@router.get("/{discussion_id}", response_model=schemas.Discussion)
async def get_discussion(
    discussion_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_current_user),
):
    discussion = db.query(models.Discussion).filter(
        models.Discussion.id == discussion_id
    ).options(
        joinedload(models.Discussion.author),
        joinedload(models.Discussion.tags),
        joinedload(models.Discussion.attachments)
    ).first()
    
    if not discussion:
        raise HTTPException(status_code=404, detail="Discussion not found")
    
    # Count comments
    discussion.comment_count = db.query(func.count(models.Comment.id)).filter(
        models.Comment.discussion_id == discussion.id
    ).scalar()
    
    # Count upvotes
    discussion.upvotes = db.query(func.count(models.Upvote.id)).filter(
        models.Upvote.discussion_id == discussion.id
    ).scalar()
    
    # Check if current user has upvoted
    if current_user:
        discussion.has_upvoted = db.query(models.Upvote).filter(
            models.Upvote.discussion_id == discussion.id,
            models.Upvote.user_id == current_user.id
        ).first() is not None
    else:
        discussion.has_upvoted = False
    
    return discussion

@router.put("/{discussion_id}", response_model=schemas.Discussion)
async def update_discussion(
    discussion_id: str,
    discussion_update: schemas.DiscussionUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
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

@router.delete("/{discussion_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_discussion(
    discussion_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
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
    
    db.delete(discussion)
    db.commit()

@router.post("/{discussion_id}/upvote", response_model=schemas.UpvoteResponse)
async def upvote_discussion(
    discussion_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
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
    
    return {
        "upvotes": upvote_count,
        "hasUpvoted": has_upvoted
    }
