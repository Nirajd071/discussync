
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
import os
import uuid
import shutil
from .. import models, schemas
from ..database import get_db
from ..dependencies import get_current_user

router = APIRouter(
    prefix="/api/files",
    tags=["Files"],
)

@router.post("/upload/", response_model=schemas.Attachment, status_code=status.HTTP_201_CREATED)
async def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # Create uploads directory if it doesn't exist
    uploads_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads", "attachments")
    os.makedirs(uploads_dir, exist_ok=True)
    
    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(uploads_dir, unique_filename)
    
    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Get file size
    file_size = os.path.getsize(file_path)
    
    # Create a temporary discussion for the attachment
    # (In a real app, you'd want to associate this with an existing discussion or store it temporarily)
    temp_discussion = models.Discussion(
        title="Temporary File Upload",
        content="Temporary discussion for file upload",
        author_id=current_user.id
    )
    db.add(temp_discussion)
    db.commit()
    db.refresh(temp_discussion)
    
    # Create attachment record
    db_attachment = models.Attachment(
        name=file.filename,
        file_path=f"/uploads/attachments/{unique_filename}",
        size=file_size,
        type=file.content_type,
        discussion_id=temp_discussion.id
    )
    db.add(db_attachment)
    db.commit()
    db.refresh(db_attachment)
    
    # Set URL for response
    db_attachment.url = db_attachment.file_path
    
    return db_attachment
