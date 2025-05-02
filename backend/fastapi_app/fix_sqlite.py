"""
Script to create a test user with SQLite compatibility
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
        user_id = str(uuid.uuid4())
        hashed_password = utils.get_password_hash("password123")
        
        test_user = models.User(
            id=user_id,
            username="testuser",
            email="test@example.com",
            hashed_password=hashed_password,
            first_name="Test",
            last_name="User",
            is_admin=False,
            created_at=datetime.now(timezone.utc)
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

def create_test_discussion(user):
    if not user:
        print("Cannot create discussion without a user")
        return
        
    db = next(get_db())
    try:
        # Create a test discussion
        discussion_id = str(uuid.uuid4())
        discussion = models.Discussion(
            id=discussion_id,
            title="Welcome to DiscuSync",
            content="This is a test discussion to get you started with DiscuSync.",
            author_id=user.id,
            created_at=datetime.now(timezone.utc)
        )
        
        db.add(discussion)
        
        # Create a test tag
        tag = models.Tag(
            id=str(uuid.uuid4()),
            name="Welcome"
        )
        db.add(tag)
        db.flush()
        
        # Associate tag with discussion
        db.execute(
            models.discussion_tag.insert().values(
                discussion_id=discussion_id,
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
    user = create_test_user()
    create_test_discussion(user)
