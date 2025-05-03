#!/usr/bin/env python3

import os
import sys
import sqlite3
from pathlib import Path

# Path to the SQLite database
DB_PATH = Path("backend/fastapi_app/forum.db")

def delete_test_users():
    """Delete all users except the admin user."""
    if not DB_PATH.exists():
        print(f"Error: Database file not found at {DB_PATH}")
        sys.exit(1)
    
    print(f"Connecting to database at {DB_PATH}")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # First, get a list of all users
        cursor.execute("SELECT id, username, email, is_admin FROM users")
        users = cursor.fetchall()
        
        print(f"Found {len(users)} users in the database")
        print("Current users:")
        for user in users:
            user_id, username, email, is_admin = user
            admin_status = "ADMIN" if is_admin else "USER"
            print(f"  - {username} ({email}) [{admin_status}]")
        
        # Delete all users except admin
        cursor.execute("DELETE FROM users WHERE is_admin = 0")
        deleted_count = cursor.rowcount
        conn.commit()
        
        print(f"Deleted {deleted_count} test users")
        
        # Verify remaining users
        cursor.execute("SELECT id, username, email, is_admin FROM users")
        remaining_users = cursor.fetchall()
        
        print(f"Remaining users ({len(remaining_users)}):")
        for user in remaining_users:
            user_id, username, email, is_admin = user
            admin_status = "ADMIN" if is_admin else "USER"
            print(f"  - {username} ({email}) [{admin_status}]")
            
    except sqlite3.Error as e:
        print(f"Database error: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    delete_test_users()
    print("Done!")
