from app.database import SessionLocal, engine, Base
from app.models import User, Discussion, Comment, Upvote, Notification, Attachment, Project, ProjectUpvote, ProjectComment
from app.utils import get_password_hash
import uuid

def reset_database():
    db = SessionLocal()
    try:
        print("Deleting all existing users and related data...")
        
        # Delete all notifications first (they reference users, discussions, and comments)
        db.query(Notification).delete()
        
        # Delete all upvotes (they reference users, discussions, and comments)
        db.query(Upvote).delete()
        db.query(ProjectUpvote).delete()
        
        # Delete all comments (they reference users and discussions)
        db.query(Comment).delete()
        db.query(ProjectComment).delete()
        
        # Delete all attachments (they reference discussions)
        db.query(Attachment).delete()
        
        # Delete all projects (they reference users)
        db.query(Project).delete()
        
        # Delete all discussions (they reference users)
        db.query(Discussion).delete()
        
        # Finally, delete all users
        db.query(User).delete()
        
        db.commit()
        print("All users and related data deleted successfully.")
        
        # Create a new admin user
        admin_password = "admin123"
        hashed_password = get_password_hash(admin_password)
        
        admin_user = User(
            id=str(uuid.uuid4()),
            username="admin",
            email="admin@discussync.com",
            hashed_password=hashed_password,
            first_name="Admin",
            last_name="User",
            is_admin=True
        )
        
        db.add(admin_user)
        db.commit()
        
        print(f"Created new admin user:")
        print(f"Username: admin")
        print(f"Email: admin@discussync.com")
        print(f"Password: {admin_password}")
        print(f"User ID: {admin_user.id}")
        
    except Exception as e:
        db.rollback()
        print(f"Error: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    reset_database()
