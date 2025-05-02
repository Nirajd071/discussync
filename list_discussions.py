"""
Script to list discussions in the database
"""
import sqlite3

# Connect to the database
conn = sqlite3.connect('forum.db')
cursor = conn.cursor()

# Get discussions
print("Discussions in the database:")
cursor.execute("SELECT id, title, author_id FROM discussions")
discussions = cursor.fetchall()

for discussion in discussions:
    print(f"ID: {discussion[0]}")
    print(f"Title: {discussion[1]}")
    print(f"Author ID: {discussion[2]}")
    print("-" * 50)

# Get users
print("\nUsers in the database:")
cursor.execute("SELECT id, username, email, is_admin FROM users")
users = cursor.fetchall()

for user in users:
    print(f"ID: {user[0]}")
    print(f"Username: {user[1]}")
    print(f"Email: {user[2]}")
    print(f"Is Admin: {user[3]}")
    print("-" * 50)

# Close the connection
conn.close()
