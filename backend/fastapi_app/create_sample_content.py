"""
Script to create sample content in the database.
"""
from app.database import get_db
from app import models
import uuid
from datetime import datetime, timezone

def create_sample_content():
    db = next(get_db())
    try:
        # Get admin user
        admin = db.query(models.User).filter(models.User.email == "admin@discussync.com").first()
        if not admin:
            print("Admin user not found. Please run create_admin.py first.")
            return

        # Create sample tags
        tags = []
        for tag_name in ["Welcome", "Getting Started", "Help"]:
            tag = models.Tag(id=str(uuid.uuid4()), name=tag_name)
            db.add(tag)
            db.flush()  # Flush to get the ID
            tags.append(tag)

        # Create sample discussion
        discussion_id = str(uuid.uuid4())
        discussion = models.Discussion(
            id=discussion_id,
            title="Welcome to DiscuSync",
            content="This is a sample discussion to get you started with DiscuSync. Feel free to explore the platform and create your own discussions!\n\n## Features\n\n- Create and participate in discussions\n- Upload attachments\n- Tag discussions for better organization\n- Upvote content you like\n- Receive notifications for activity on your discussions",
            author_id=admin.id,
            created_at=datetime.now(timezone.utc)
        )

        # Add the discussion to the database
        db.add(discussion)
        db.flush()

        # Associate tags with discussion
        for tag in tags:
            # Create the association directly
            db.execute(
                models.discussion_tag.insert().values(
                    discussion_id=discussion_id,
                    tag_id=tag.id
                )
            )

        db.commit()
        print("Sample content created successfully!")
    except Exception as e:
        db.rollback()
        print(f"Error creating sample content: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_sample_content()
