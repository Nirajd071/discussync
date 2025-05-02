"""
Script to reset the database by deleting all user-related data.
This will clear all users, discussions, comments, and related data.
"""
from app.database import engine, get_db
from app import models
from sqlalchemy.orm import Session

def reset_database():
    db = next(get_db())
    try:
        print("Deleting all notifications...")
        db.query(models.Notification).delete()
        
        print("Deleting all upvotes...")
        db.query(models.Upvote).delete()
        
        print("Deleting all comment mentions...")
        db.query(models.comment_mentioned_user).delete()
        
        print("Deleting all attachments...")
        db.query(models.Attachment).delete()
        
        print("Deleting all comments...")
        db.query(models.Comment).delete()
        
        print("Deleting all discussion-tag associations...")
        db.query(models.discussion_tag).delete()
        
        print("Deleting all discussions...")
        db.query(models.Discussion).delete()
        
        print("Deleting all tags...")
        db.query(models.Tag).delete()
        
        print("Deleting all users...")
        db.query(models.User).delete()
        
        db.commit()
        print("Database reset successfully!")
    except Exception as e:
        db.rollback()
        print(f"Error resetting database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    reset_database()
