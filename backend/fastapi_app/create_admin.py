"""
Script to create an admin user in the database.
"""
from app.database import get_db
from app import models, utils
import uuid

def create_admin_user():
    db = next(get_db())
    try:
        # Check if admin already exists
        admin = db.query(models.User).filter(models.User.email == "admin@discussync.com").first()
        if admin:
            print("Admin user already exists.")
            return
        
        # Create admin user
        admin_id = str(uuid.uuid4())
        hashed_password = utils.get_password_hash("admin123")
        
        admin = models.User(
            id=admin_id,
            username="admin",
            email="admin@discussync.com",
            hashed_password=hashed_password,
            first_name="Admin",
            last_name="User",
            is_admin=True
        )
        
        db.add(admin)
        db.commit()
        print("Admin user created successfully!")
        print("Username: admin")
        print("Email: admin@discussync.com")
        print("Password: admin123")
    except Exception as e:
        db.rollback()
        print(f"Error creating admin user: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_admin_user()
