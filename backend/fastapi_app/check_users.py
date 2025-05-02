from app.database import SessionLocal
from app.models import User
import uuid
import bcrypt

def check_users():
    db = SessionLocal()
    try:
        # Check existing users
        users = db.query(User).all()
        print('Users in database:', [(u.id, u.email, u.username) for u in users])
        
        # Create a test user if none exist
        if not users:
            hashed_password = bcrypt.hashpw('password123'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            new_user = User(
                id=str(uuid.uuid4()),
                email='testuser@example.com',
                username='testuser',
                password=hashed_password,
                first_name='Test',
                last_name='User'
            )
            db.add(new_user)
            db.commit()
            print('Created new user:', new_user.id, new_user.email)
    finally:
        db.close()

if __name__ == "__main__":
    check_users()
