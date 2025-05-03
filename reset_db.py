#!/usr/bin/env python3

import os
import sys
import sqlite3
from pathlib import Path

# Path to the SQLite database
DB_PATH = Path("backend/fastapi_app/forum.db")

def reset_database():
    """Reset the database by keeping only the admin user."""
    if not DB_PATH.exists():
        print(f"Error: Database file not found at {DB_PATH}")
        sys.exit(1)
    
    print(f"Connecting to database at {DB_PATH}")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # Begin transaction
        conn.execute("BEGIN TRANSACTION")
        
        # Check if admin user exists
        cursor.execute("SELECT id, username, email FROM users WHERE is_admin = 1")
        admin = cursor.fetchone()
        
        if admin:
            admin_id, admin_username, admin_email = admin
            print(f"Found admin user: {admin_username} ({admin_email}) with ID: {admin_id}")
            
            # Delete all notifications for non-admin users
            cursor.execute("DELETE FROM notifications WHERE user_id != ?", (admin_id,))
            deleted_notifications = cursor.rowcount
            print(f"Deleted {deleted_notifications} notifications for non-admin users")
            
            # Delete all upvotes from non-admin users
            cursor.execute("DELETE FROM upvotes WHERE user_id != ?", (admin_id,))
            deleted_upvotes = cursor.rowcount
            print(f"Deleted {deleted_upvotes} upvotes from non-admin users")
            
            # Delete all comments from non-admin users
            cursor.execute("DELETE FROM comments WHERE author_id != ?", (admin_id,))
            deleted_comments = cursor.rowcount
            print(f"Deleted {deleted_comments} comments from non-admin users")
            
            # Delete all discussions from non-admin users
            cursor.execute("DELETE FROM discussions WHERE author_id != ?", (admin_id,))
            deleted_discussions = cursor.rowcount
            print(f"Deleted {deleted_discussions} discussions from non-admin users")
            
            # Delete all non-admin users
            cursor.execute("DELETE FROM users WHERE is_admin = 0")
            deleted_users = cursor.rowcount
            print(f"Deleted {deleted_users} non-admin users")
            
            # Commit the transaction
            conn.commit()
            
            # Verify remaining users
            cursor.execute("SELECT id, username, email, is_admin FROM users")
            remaining_users = cursor.fetchall()
            
            print(f"Remaining users ({len(remaining_users)}):")
            for user in remaining_users:
                user_id, username, email, is_admin = user
                admin_status = "ADMIN" if is_admin else "USER"
                print(f"  - {username} ({email}) [{admin_status}]")
        else:
            print("No admin user found in the database.")
            conn.rollback()
            
    except sqlite3.Error as e:
        print(f"Database error: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    reset_database()
    print("Database reset complete!")
