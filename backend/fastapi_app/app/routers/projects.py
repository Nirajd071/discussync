from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
import os
import uuid
import shutil
from .. import models, schemas
from ..database import get_db
from ..dependencies import get_current_user, get_admin_user

router = APIRouter(
    prefix="/api/projects",
    tags=["Projects"],
)

@router.get("/", response_model=List[schemas.Project])
async def get_projects(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Get all projects with pagination
    """
    projects = db.query(models.Project).offset(skip).limit(limit).all()

    # Format projects for response
    result = []
    for project in projects:
        # Get author
        author = db.query(models.User).filter(models.User.id == project.author_id).first()

        # Format author data
        author_data = {
            "id": author.id,
            "username": author.username,
            "email": author.email,
            "name": f"{author.first_name or ''} {author.last_name or ''}".strip(),
            "first_name": author.first_name,
            "last_name": author.last_name,
            "bio": author.bio,
            "avatar": author.avatar,
            "is_admin": author.is_admin,
            "created_at": author.created_at.isoformat() if author.created_at else None
        }

        # Format project data
        project_data = {
            "id": project.id,
            "title": project.title,
            "description": project.description,
            "file_name": project.file_name,
            "file_size": project.file_size,
            "file_type": project.file_type,
            "author": author_data,
            "upvote_count": project.upvote_count,
            "comment_count": project.comment_count,
            "created_at": project.created_at.isoformat() if project.created_at else None,
            "updated_at": project.updated_at.isoformat() if project.updated_at else None,
            "has_upvoted": False,  # Default value, will be updated if user is authenticated
            "comments": []  # Will be populated if requested
        }

        result.append(project_data)

    return result

@router.get("/{project_id}", response_model=schemas.Project)
async def get_project(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_current_user)
):
    """
    Get a specific project by ID
    """
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    # Get author
    author = db.query(models.User).filter(models.User.id == project.author_id).first()

    # Format author data
    author_data = {
        "id": author.id,
        "username": author.username,
        "email": author.email,
        "name": f"{author.first_name or ''} {author.last_name or ''}".strip(),
        "first_name": author.first_name,
        "last_name": author.last_name,
        "bio": author.bio,
        "avatar": author.avatar,
        "is_admin": author.is_admin,
        "created_at": author.created_at.isoformat() if author.created_at else None
    }

    # Check if user has upvoted this project
    has_upvoted = False
    if current_user:
        upvote = db.query(models.ProjectUpvote).filter(
            models.ProjectUpvote.project_id == project_id,
            models.ProjectUpvote.user_id == current_user.id
        ).first()
        has_upvoted = upvote is not None

    # Get comments
    comments = db.query(models.ProjectComment).filter(
        models.ProjectComment.project_id == project_id
    ).all()

    # Format comments
    comment_list = []
    for comment in comments:
        comment_author = db.query(models.User).filter(models.User.id == comment.author_id).first()
        comment_author_data = {
            "id": comment_author.id,
            "username": comment_author.username,
            "email": comment_author.email,
            "name": f"{comment_author.first_name or ''} {comment_author.last_name or ''}".strip(),
            "first_name": comment_author.first_name,
            "last_name": comment_author.last_name,
            "bio": comment_author.bio,
            "avatar": comment_author.avatar,
            "is_admin": comment_author.is_admin,
            "created_at": comment_author.created_at.isoformat() if comment_author.created_at else None
        }

        comment_data = {
            "id": comment.id,
            "content": comment.content,
            "author": comment_author_data,
            "created_at": comment.created_at.isoformat() if comment.created_at else None,
            "updated_at": comment.updated_at.isoformat() if comment.updated_at else None
        }

        comment_list.append(comment_data)

    # Format project data
    project_data = {
        "id": project.id,
        "title": project.title,
        "description": project.description,
        "file_name": project.file_name,
        "file_size": project.file_size,
        "file_type": project.file_type,
        "author": author_data,
        "upvote_count": project.upvote_count,
        "comment_count": project.comment_count,
        "created_at": project.created_at.isoformat() if project.created_at else None,
        "updated_at": project.updated_at.isoformat() if project.updated_at else None,
        "has_upvoted": has_upvoted,
        "comments": comment_list
    }

    return project_data

@router.post("/", response_model=schemas.Project)
async def create_project(
    title: str = Form(...),
    description: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Create a new project with file upload
    """
    # Create uploads directory if it doesn't exist
    uploads_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads", "projects")
    os.makedirs(uploads_dir, exist_ok=True)

    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(uploads_dir, unique_filename)

    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Create project in database
    db_project = models.Project(
        title=title,
        description=description,
        file_name=file.filename,
        file_path=f"/uploads/projects/{unique_filename}",
        file_size=os.path.getsize(file_path),
        file_type=file.content_type,
        author_id=current_user.id
    )

    db.add(db_project)
    db.commit()
    db.refresh(db_project)

    # Format response
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
        "created_at": current_user.created_at.isoformat() if current_user.created_at else None
    }

    project_data = {
        "id": db_project.id,
        "title": db_project.title,
        "description": db_project.description,
        "file_name": db_project.file_name,
        "file_size": db_project.file_size,
        "file_type": db_project.file_type,
        "author": author_data,
        "upvote_count": 0,
        "comment_count": 0,
        "created_at": db_project.created_at.isoformat() if db_project.created_at else None,
        "updated_at": None,
        "has_upvoted": False,
        "comments": []
    }

    return project_data

@router.post("/{project_id}/upvote", response_model=schemas.UpvoteResponse)
async def upvote_project(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Upvote a project
    """
    # Check if project exists
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    # Check if user has already upvoted this project
    existing_upvote = db.query(models.ProjectUpvote).filter(
        models.ProjectUpvote.project_id == project_id,
        models.ProjectUpvote.user_id == current_user.id
    ).first()

    if existing_upvote:
        # Remove upvote
        db.delete(existing_upvote)
        project.upvote_count = max(0, project.upvote_count - 1)
        db.commit()
        return {"upvotes": project.upvote_count, "hasUpvoted": False}
    else:
        # Add upvote
        new_upvote = models.ProjectUpvote(
            user_id=current_user.id,
            project_id=project_id
        )
        db.add(new_upvote)
        project.upvote_count += 1
        db.commit()
        return {"upvotes": project.upvote_count, "hasUpvoted": True}

@router.post("/{project_id}/comments", response_model=schemas.ProjectComment)
async def create_project_comment(
    project_id: str,
    content: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Add a comment to a project
    """
    # Check if project exists
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    # Create comment
    db_comment = models.ProjectComment(
        content=content,
        author_id=current_user.id,
        project_id=project_id
    )

    db.add(db_comment)

    # Update comment count
    project.comment_count += 1

    db.commit()
    db.refresh(db_comment)

    # Format response
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
        "created_at": current_user.created_at.isoformat() if current_user.created_at else None
    }

    comment_data = {
        "id": db_comment.id,
        "content": db_comment.content,
        "author": author_data,
        "created_at": db_comment.created_at.isoformat() if db_comment.created_at else None,
        "updated_at": None
    }

    return comment_data

@router.delete("/{project_id}/comments/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project_comment(
    project_id: str,
    comment_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Delete a project comment (only by author or admin)
    """
    # Check if project exists
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    # Check if comment exists
    comment = db.query(models.ProjectComment).filter(
        models.ProjectComment.id == comment_id,
        models.ProjectComment.project_id == project_id
    ).first()

    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )

    # Check if user is author or admin
    if comment.author_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this comment"
        )

    # Delete comment
    db.delete(comment)

    # Update comment count
    project.comment_count = max(0, project.comment_count - 1)

    db.commit()

    return None

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Delete a project (only by author or admin)
    """
    # Check if project exists
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    # Check if user is author or admin
    if project.author_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this project"
        )

    # Delete file
    if project.file_path and os.path.exists(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), project.file_path.lstrip('/'))):
        os.remove(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), project.file_path.lstrip('/')))

    # Delete upvotes
    db.query(models.ProjectUpvote).filter(models.ProjectUpvote.project_id == project_id).delete()

    # Delete comments
    db.query(models.ProjectComment).filter(models.ProjectComment.project_id == project_id).delete()

    # Delete project
    db.delete(project)
    db.commit()

    return None
