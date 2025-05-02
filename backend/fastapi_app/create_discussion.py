from app.database import SessionLocal
from app.models import Discussion, User
import uuid

def create_sample_discussion():
    db = SessionLocal()
    try:
        # Check existing discussions
        discussions = db.query(Discussion).all()
        print('Discussions in database:', [(d.id, d.title) for d in discussions])
        
        # Get user
        user = db.query(User).filter(User.email == 'nirajdas6664521@gmail.com').first()
        print('User:', user.id if user else None)
        
        # Create a discussion if none exist
        if not discussions and user:
            new_discussion = Discussion(
                id=str(uuid.uuid4()),
                title='Welcome to DiscuSync',
                content='This is a sample discussion to get you started.',
                author_id=user.id
            )
            db.add(new_discussion)
            db.commit()
            print('Created new discussion:', new_discussion.id, new_discussion.title)
    finally:
        db.close()

if __name__ == "__main__":
    create_sample_discussion()
