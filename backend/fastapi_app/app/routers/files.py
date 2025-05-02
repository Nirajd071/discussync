
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
    try:
        print(f"Processing file upload: {file.filename}, size: {file.size if hasattr(file, 'size') else 'unknown'}, type: {file.content_type}")

        # Validate file
        if not file.filename:
            raise HTTPException(status_code=400, detail="File has no filename")

        # Create uploads directory if it doesn't exist
        uploads_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads", "attachments")
        os.makedirs(uploads_dir, exist_ok=True)
        print(f"Upload directory: {uploads_dir}")

        # Generate unique filename
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(uploads_dir, unique_filename)

        # Save file
        try:
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            # Get file size
            file_size = os.path.getsize(file_path)
            print(f"File saved successfully: {file_path}, size: {file_size}")
        except Exception as e:
            print(f"Error saving file: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to save file: {str(e)}"
            )

        # Create a temporary discussion for the attachment
        try:
            temp_discussion = models.Discussion(
                title="Temporary File Upload",
                content="Temporary discussion for file upload",
                author_id=current_user.id
            )
            db.add(temp_discussion)
            db.commit()
            db.refresh(temp_discussion)
            print(f"Created temporary discussion with ID: {temp_discussion.id}")
        except Exception as e:
            print(f"Error creating temporary discussion: {str(e)}")
            # Clean up the file if discussion creation fails
            if os.path.exists(file_path):
                os.remove(file_path)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create temporary discussion: {str(e)}"
            )

        # Create attachment record
        try:
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
            print(f"Created attachment record with ID: {db_attachment.id}")
        except Exception as e:
            print(f"Error creating attachment record: {str(e)}")
            # Clean up the file and discussion if attachment creation fails
            if os.path.exists(file_path):
                os.remove(file_path)
            db.delete(temp_discussion)
            db.commit()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create attachment record: {str(e)}"
            )

        # Set URL for response
        db_attachment.url = db_attachment.file_path

        return db_attachment
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        print(f"Unexpected error in upload_file: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {str(e)}"
        )
