"""
Script to list discussions in the database
"""
import sqlite3

# Connect to the database
conn = sqlite3.connect('forum.db')
cursor = conn.cursor()

# Get discussions
print("Discussions in the database:")
cursor.execute("""
    SELECT d.id, d.title, d.content, d.author_id, u.username, d.created_at
    FROM discussions d
    JOIN users u ON d.author_id = u.id
""")
discussions = cursor.fetchall()

for discussion in discussions:
    discussion_id = discussion[0]
    print(f"ID: {discussion_id}")
    print(f"Title: {discussion[1]}")
    print(f"Content: {discussion[2][:100]}..." if len(discussion[2]) > 100 else f"Content: {discussion[2]}")
    print(f"Author: {discussion[4]} (ID: {discussion[3]})")
    print(f"Created: {discussion[5]}")

    # Get tags for this discussion
    cursor.execute("""
        SELECT t.name FROM tags t
        JOIN discussion_tag dt ON t.id = dt.tag_id
        WHERE dt.discussion_id = ?
    """, (discussion_id,))
    tags = cursor.fetchall()
    if tags:
        print(f"Tags: {', '.join([tag[0] for tag in tags])}")
    else:
        print("Tags: None")

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
