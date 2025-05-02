from app.database import SessionLocal
from app.models import User
from app.utils import get_password_hash
import uuid

def create_test_user():
    db = SessionLocal()
    try:
        # Check if test user already exists by email
        test_user = db.query(User).filter(User.email == 'testuser@example.com').first()

        if test_user:
            print(f"Test user already exists: {test_user.email}")
            print(f"User ID: {test_user.id}")
            print(f"Username: {test_user.username}")
            print(f"Password: password123")
            return test_user

        # Also check by username
        test_user = db.query(User).filter(User.username == 'testuser').first()

        if test_user:
            print(f"Test user already exists with username 'testuser': {test_user.email}")
            print(f"User ID: {test_user.id}")
            print(f"Username: {test_user.username}")
            print(f"Password: password123")
            return test_user

        # Create a new test user with a unique username
        new_user = User(
            id=str(uuid.uuid4()),
            email='testuser@example.com',
            username='testuser123',
            first_name='Test',
            last_name='User',
            hashed_password=get_password_hash('password123'),
            is_admin=False
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        print(f"Created new test user: {new_user.email}")
        print(f"User ID: {new_user.id}")
        print(f"Username: {new_user.username}")
        print(f"Password: password123")

        return new_user
    except Exception as e:
        print(f"Error creating test user: {e}")
        db.rollback()

        # Try to find existing user to return
        existing_user = db.query(User).first()
        if existing_user:
            print(f"Using existing user: {existing_user.email}")
            print(f"User ID: {existing_user.id}")
            print(f"Username: {existing_user.username}")
            print(f"Use password: password123")
            return existing_user
        return None
    finally:
        db.close()

if __name__ == "__main__":
    create_test_user()
