"""
Script to create sample comments for existing discussions in the database
"""
from app.database import get_db, engine
from app import models
import uuid
from datetime import datetime, timezone
import random

# Sample comment content
SAMPLE_COMMENTS = [
    "This is a great discussion! Thanks for sharing.",
    "I have a question about this topic. Can you provide more details?",
    "I completely agree with your points. Very insightful!",
    "I've been looking for information on this topic. This is very helpful.",
    "Interesting perspective. I hadn't thought about it that way before.",
    "Thanks for starting this discussion. It's very relevant.",
    "I've been working on something similar. Would love to collaborate.",
    "This is exactly what I needed to know. Thanks!",
    "Great points! I would also add that...",
    "I'm new to this topic. Can someone explain more about...?"
]

# Sample reply content
SAMPLE_REPLIES = [
    "Thanks for your comment! I'm glad you found it helpful.",
    "Good question! Let me clarify that point...",
    "I appreciate your feedback. Let me know if you have any other questions.",
    "That's a great addition to the discussion. Thanks for sharing!",
    "I'd be happy to collaborate. Let's connect offline.",
    "You're welcome! Let me know if you need any more information.",
    "That's an interesting perspective. I'll consider that in my approach.",
    "I agree with your point. Thanks for contributing to the discussion.",
    "Let me know if you need any clarification on any part of it.",
    "Great suggestion! I'll incorporate that in the next version."
]

def create_sample_comments():
    db = next(get_db())
    try:
        # Get all users
        users = db.query(models.User).all()
        if not users:
            print("No users found in the database. Please run create_test_data.py first.")
            return
        
        # Get all discussions
        discussions = db.query(models.Discussion).all()
        if not discussions:
            print("No discussions found in the database. Please run create_sample_discussions.py first.")
            return
        
        print(f"Found {len(discussions)} discussions and {len(users)} users")
        
        # Create comments for each discussion
        for discussion in discussions:
            print(f"Creating comments for discussion: {discussion.title}")
            
            # Create 3-5 top-level comments for each discussion
            for _ in range(random.randint(3, 5)):
                author = random.choice(users)
                content = random.choice(SAMPLE_COMMENTS)
                
                comment = models.Comment(
                    id=str(uuid.uuid4()),
                    content=content,
                    author_id=author.id,
                    discussion_id=discussion.id,
                    created_at=datetime.now(timezone.utc)
                )
                
                db.add(comment)
                db.flush()  # Flush to get the ID
                
                print(f"  Added comment by {author.username}: {content[:30]}...")
                
                # Add 1-3 replies to each comment
                for _ in range(random.randint(1, 3)):
                    reply_author = random.choice(users)
                    reply_content = random.choice(SAMPLE_REPLIES)
                    
                    reply = models.Comment(
                        id=str(uuid.uuid4()),
                        content=reply_content,
                        author_id=reply_author.id,
                        discussion_id=discussion.id,
                        parent_id=comment.id,
                        created_at=datetime.now(timezone.utc)
                    )
                    
                    db.add(reply)
                    print(f"    Added reply by {reply_author.username}: {reply_content[:30]}...")
            
            # Update the comment count on the discussion
            comment_count = db.query(models.Comment).filter(
                models.Comment.discussion_id == discussion.id
            ).count()
            
            discussion.comment_count = comment_count
            print(f"  Updated discussion comment count to {comment_count}")
        
        db.commit()
        print("Sample comments created successfully!")
    except Exception as e:
        db.rollback()
        print(f"Error creating sample comments: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_sample_comments()
