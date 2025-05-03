#!/usr/bin/env python3
"""
Script to reset the database by deleting all user-related data except the admin user.
This will clear all non-admin users, discussions, comments, and related data.
"""
import sys
import os
from pathlib import Path

# Add the backend directory to the Python path
backend_path = Path("backend/fastapi_app")
sys.path.append(str(backend_path.absolute()))

# Import the necessary modules
try:
    from app.database import engine, get_db
    from app import models
    from sqlalchemy.orm import Session
    from sqlalchemy import and_, not_
except ImportError as e:
    print(f"Error importing modules: {e}")
    print("Make sure you're running this script from the project root directory.")
    sys.exit(1)

def reset_database_keep_admin():
    db = next(get_db())
    try:
        # Get admin user ID
        admin_user = db.query(models.User).filter(models.User.is_admin == True).first()
        if not admin_user:
            print("No admin user found. Creating a default admin user...")
            from app.utils import get_password_hash
            import uuid
            
            # Create a default admin user
            admin_user = models.User(
                id=str(uuid.uuid4()),
                username="admin",
                email="admin@discussync.com",
                hashed_password=get_password_hash("admin123"),
                first_name="Admin",
                last_name="User",
                is_admin=True
            )
            db.add(admin_user)
            db.commit()
            db.refresh(admin_user)
            print(f"Created admin user: {admin_user.username} ({admin_user.email})")
        
        admin_id = admin_user.id
        print(f"Admin user: {admin_user.username} (ID: {admin_id})")
        
        print("Deleting all notifications for non-admin users...")
        db.query(models.Notification).filter(models.Notification.user_id != admin_id).delete()
        
        print("Deleting all upvotes from non-admin users...")
        db.query(models.Upvote).filter(models.Upvote.user_id != admin_id).delete()
        
        print("Deleting all comment mentions...")
        # This is a many-to-many relationship, so we need to handle it differently
        # For simplicity, we'll delete all mentions
        db.query(models.comment_mentioned_user).delete()
        
        print("Deleting all attachments from non-admin users...")
        # Assuming attachments have an author_id field
        if hasattr(models.Attachment, 'author_id'):
            db.query(models.Attachment).filter(models.Attachment.author_id != admin_id).delete()
        else:
            # If there's no author_id, delete all attachments
            db.query(models.Attachment).delete()
        
        print("Deleting all comments from non-admin users...")
        db.query(models.Comment).filter(models.Comment.author_id != admin_id).delete()
        
        print("Deleting all discussion-tag associations for non-admin discussions...")
        # First, get all discussion IDs from admin
        admin_discussion_ids = [d.id for d in db.query(models.Discussion).filter(models.Discussion.author_id == admin_id).all()]
        
        # Delete all discussion-tag associations for non-admin discussions
        db.query(models.discussion_tag).filter(
            models.discussion_tag.c.discussion_id.notin_(admin_discussion_ids)
        ).delete(synchronize_session=False)
        
        print("Deleting all discussions from non-admin users...")
        db.query(models.Discussion).filter(models.Discussion.author_id != admin_id).delete()
        
        print("Deleting all non-admin users...")
        db.query(models.User).filter(models.User.id != admin_id).delete()
        
        db.commit()
        
        # Verify remaining users
        remaining_users = db.query(models.User).all()
        print(f"Remaining users ({len(remaining_users)}):")
        for user in remaining_users:
            admin_status = "ADMIN" if user.is_admin else "USER"
            print(f"  - {user.username} ({user.email}) [{admin_status}]")
        
        print("Database reset successfully!")
    except Exception as e:
        db.rollback()
        print(f"Error resetting database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    reset_database_keep_admin()
