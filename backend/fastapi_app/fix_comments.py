"""
Script to fix comments and replies in the database
"""
from app.database import get_db, engine
from app import models
from sqlalchemy.orm import joinedload
import uuid
from datetime import datetime, timezone
import random

def fix_comments():
    db = next(get_db())
    try:
        # Get all discussions
        discussions = db.query(models.Discussion).all()
        
        for discussion in discussions:
            print(f"Fixing comments for discussion: {discussion.title} (ID: {discussion.id})")
            
            # Get all comments for this discussion
            all_comments = db.query(models.Comment).filter(
                models.Comment.discussion_id == discussion.id
            ).all()
            
            # Get top-level comments
            top_level_comments = db.query(models.Comment).filter(
                models.Comment.discussion_id == discussion.id,
                models.Comment.parent_id == None
            ).all()
            
            # Get replies
            replies = db.query(models.Comment).filter(
                models.Comment.discussion_id == discussion.id,
                models.Comment.parent_id != None
            ).all()
            
            print(f"  Found {len(all_comments)} total comments")
            print(f"  Found {len(top_level_comments)} top-level comments")
            print(f"  Found {len(replies)} replies")
            
            # If there are no replies but there are multiple comments, convert some to replies
            if len(replies) == 0 and len(top_level_comments) > 1:
                print("  No replies found. Converting some comments to replies...")
                
                # Convert half of the comments to replies
                comments_to_convert = top_level_comments[1:len(top_level_comments)//2 + 1]
                
                for comment in comments_to_convert:
                    # Choose a random parent from the remaining top-level comments
                    potential_parents = [c for c in top_level_comments if c.id != comment.id]
                    if potential_parents:
                        parent = random.choice(potential_parents)
                        
                        print(f"    Converting comment {comment.id} to a reply to {parent.id}")
                        
                        # Update the comment to be a reply
                        comment.parent_id = parent.id
                        db.commit()
            
            # Update comment count on the discussion
            comment_count = len(all_comments)
            
            # Add comment_count attribute if it doesn't exist
            if not hasattr(discussion, 'comment_count'):
                print(f"  Adding comment_count attribute to discussion")
                # Use raw SQL to add the column if it doesn't exist
                try:
                    db.execute("ALTER TABLE discussions ADD COLUMN comment_count INTEGER DEFAULT 0")
                    db.commit()
                except Exception as e:
                    print(f"  Column already exists or error: {e}")
            
            # Update the comment count
            try:
                discussion.comment_count = comment_count
                db.commit()
                print(f"  Updated discussion comment count to {comment_count}")
            except Exception as e:
                print(f"  Error updating comment count: {e}")
                # Try direct SQL update
                try:
                    db.execute(f"UPDATE discussions SET comment_count = {comment_count} WHERE id = '{discussion.id}'")
                    db.commit()
                    print(f"  Updated comment count via SQL")
                except Exception as e2:
                    print(f"  SQL update failed: {e2}")
        
        print("Comments fixed successfully!")
    except Exception as e:
        db.rollback()
        print(f"Error fixing comments: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    fix_comments()
