"""
Script to create test data in the SQLite database
"""
from app.database import get_db, engine
from app import models, utils
import uuid
from datetime import datetime, timezone

# Create tables
models.Base.metadata.create_all(bind=engine)

def create_test_user():
    db = next(get_db())
    try:
        # Check if test user already exists
        test_user = db.query(models.User).filter(models.User.email == "test@example.com").first()
        if test_user:
            print("Test user already exists.")
            return test_user
        
        # Create test user
        hashed_password = utils.get_password_hash("password123")
        
        test_user = models.User(
            username="testuser",
            email="test@example.com",
            hashed_password=hashed_password,
            first_name="Test",
            last_name="User",
            is_admin=False
        )
        
        db.add(test_user)
        db.commit()
        db.refresh(test_user)
        
        print("Test user created successfully!")
        print("Username: testuser")
        print("Email: test@example.com")
        print("Password: password123")
        
        return test_user
    except Exception as e:
        db.rollback()
        print(f"Error creating test user: {e}")
        return None
    finally:
        db.close()

def create_admin_user():
    db = next(get_db())
    try:
        # Check if admin already exists
        admin = db.query(models.User).filter(models.User.email == "admin@discussync.com").first()
        if admin:
            print("Admin user already exists.")
            return admin
        
        # Create admin user
        hashed_password = utils.get_password_hash("admin123")
        
        admin = models.User(
            username="admin",
            email="admin@discussync.com",
            hashed_password=hashed_password,
            first_name="Admin",
            last_name="User",
            is_admin=True
        )
        
        db.add(admin)
        db.commit()
        db.refresh(admin)
        
        print("Admin user created successfully!")
        print("Username: admin")
        print("Email: admin@discussync.com")
        print("Password: admin123")
        
        return admin
    except Exception as e:
        db.rollback()
        print(f"Error creating admin user: {e}")
        return None
    finally:
        db.close()

def create_test_discussion(user):
    if not user:
        print("Cannot create discussion without a user")
        return
        
    db = next(get_db())
    try:
        # Create a test discussion
        discussion = models.Discussion(
            title="Welcome to DiscuSync",
            content="This is a test discussion to get you started with DiscuSync.",
            author_id=user.id
        )
        
        db.add(discussion)
        
        # Create a test tag
        tag = models.Tag(
            name="Welcome"
        )
        db.add(tag)
        db.flush()
        
        # Associate tag with discussion
        db.execute(
            models.discussion_tag.insert().values(
                discussion_id=discussion.id,
                tag_id=tag.id
            )
        )
        
        db.commit()
        print("Test discussion created successfully!")
    except Exception as e:
        db.rollback()
        print(f"Error creating test discussion: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    admin = create_admin_user()
    user = create_test_user()
    create_test_discussion(admin)
    create_test_discussion(user)
