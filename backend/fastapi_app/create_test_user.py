from app.database import SessionLocal
from app.models import User
import uuid
import bcrypt

def create_test_user():
    db = SessionLocal()
    try:
        # Create a test user with a known password
        hashed_password = bcrypt.hashpw('password123'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        new_user = User(
            id=str(uuid.uuid4()),
            email='testuser123@example.com',
            username='testuser123',
            hashed_password=hashed_password,
            first_name='Test',
            last_name='User'
        )
        db.add(new_user)
        db.commit()
        print('Created new user:', new_user.id, new_user.email)
    finally:
        db.close()

if __name__ == "__main__":
    create_test_user()
