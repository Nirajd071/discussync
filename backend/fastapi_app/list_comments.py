"""
Script to list comments in the database
"""
from app.database import get_db
from app import models
from sqlalchemy.orm import joinedload

def list_comments():
    db = next(get_db())
    try:
        # Get all discussions
        discussions = db.query(models.Discussion).all()

        for discussion in discussions:
            print(f"Discussion: {discussion.title} (ID: {discussion.id})")

            # Calculate comment count if attribute doesn't exist
            comment_count = getattr(discussion, 'comment_count', None)
            if comment_count is None:
                comment_count = db.query(models.Comment).filter(
                    models.Comment.discussion_id == discussion.id
                ).count()

            print(f"Comment Count: {comment_count}")

            # Get top-level comments for this discussion
            comments = db.query(models.Comment).filter(
                models.Comment.discussion_id == discussion.id,
                models.Comment.parent_id == None  # Only top-level comments
            ).options(
                joinedload(models.Comment.author),
                joinedload(models.Comment.replies).joinedload(models.Comment.author)
            ).all()

            print(f"Found {len(comments)} top-level comments")

            for i, comment in enumerate(comments, 1):
                print(f"  {i}. Comment ID: {comment.id}")
                print(f"     Author: {comment.author.username}")
                print(f"     Content: {comment.content[:50]}...")
                print(f"     Created: {comment.created_at}")

                # Handle case where replies might be None
                replies = comment.replies or []
                print(f"     Replies: {len(replies)}")

                for j, reply in enumerate(replies, 1):
                    print(f"       {j}. Reply ID: {reply.id}")
                    print(f"          Author: {reply.author.username}")
                    print(f"          Content: {reply.content[:50]}...")
                    print(f"          Created: {reply.created_at}")

                print()

            print("-" * 50)
    finally:
        db.close()

if __name__ == "__main__":
    list_comments()
