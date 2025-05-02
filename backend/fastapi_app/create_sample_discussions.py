"""
Script to create sample discussions in the database
"""
from app.database import get_db, engine
from app import models, utils
import uuid
from datetime import datetime, timezone
import random

# Sample discussion data
SAMPLE_DISCUSSIONS = [
    {
        "title": "Welcome to DiscuSync - Getting Started Guide",
        "content": """
# Welcome to DiscuSync!

This platform is designed to facilitate meaningful discussions and collaboration. Here's how to get started:

## Creating Your First Discussion
1. Click the 'New Discussion' button
2. Add a descriptive title
3. Write your content using Markdown formatting
4. Add relevant tags
5. Submit and start the conversation!

## Tips for Engaging Discussions
- Be respectful and considerate
- Use clear, concise language
- Format your posts for readability
- Respond to comments promptly
- Use tags to categorize your discussions

We hope you enjoy using DiscuSync for your collaborative discussions!
        """,
        "tags": ["announcement", "help", "general"]
    },
    {
        "title": "How to use Markdown in your discussions?",
        "content": """
# Markdown Guide for DiscuSync

Markdown makes your discussions more readable and organized. Here's how to use it:

## Basic Formatting

**Bold text** is created with `**double asterisks**`
*Italic text* is created with `*single asterisks*`
~~Strikethrough~~ is created with `~~double tildes~~`

## Lists

Unordered lists:
- Item 1
- Item 2
  - Nested item

Ordered lists:
1. First item
2. Second item
3. Third item

## Code Blocks

Inline code: `const example = "hello world";`

Code blocks:
```javascript
function greet() {
  console.log("Hello, world!");
}
```

## Links and Images

[Link text](https://example.com)

![Image alt text](https://example.com/image.jpg)

## Quotes

> This is a blockquote
> It can span multiple lines

Hope this helps you create better formatted discussions!
        """,
        "tags": ["help", "question"]
    },
    {
        "title": "Feature Request: Dark Mode Support",
        "content": """
# Dark Mode Feature Request

I think it would be great if DiscuSync had a dark mode option. Many users (including myself) prefer dark interfaces, especially when using applications for extended periods.

## Benefits of Dark Mode:
- Reduces eye strain, especially in low-light environments
- Saves battery life on OLED/AMOLED screens
- Provides a modern aesthetic that many users prefer
- Helps users with certain visual impairments

## Implementation Suggestions:
1. Add a toggle in the user settings
2. Respect system preferences when possible
3. Consider using CSS variables for easy theming
4. Ensure proper contrast ratios for accessibility

What do others think about this feature? Would you use dark mode if it was available?
        """,
        "tags": ["feature", "idea", "feedback"]
    },
    {
        "title": "Bug Report: Profile Page Not Loading Images",
        "content": """
# Profile Image Loading Bug

I've noticed that profile images aren't loading correctly on the profile page. This seems to be happening consistently across different browsers.

## Steps to Reproduce:
1. Log in to your account
2. Navigate to your profile page
3. Notice that the profile image shows a broken image icon

## Environment Details:
- Browser: Chrome 98.0.4758.102
- OS: Windows 11
- Screen Resolution: 1920x1080

## Additional Notes:
- This started happening after the latest update
- Other images on the site load fine
- I've tried clearing my cache and cookies

Has anyone else experienced this issue? Any workarounds?
        """,
        "tags": ["bug", "help"]
    },
    {
        "title": "Discussion: What features would make DiscuSync better?",
        "content": """
# Brainstorming Session: Improving DiscuSync

I'd love to hear everyone's thoughts on what features would make DiscuSync an even better platform for discussions.

## Some ideas to start:
- Real-time collaborative editing
- Integrated video conferencing
- Advanced search capabilities
- Custom themes and personalization options
- Mobile app for on-the-go discussions
- Integration with other productivity tools
- AI-assisted moderation
- Polls and voting mechanisms

What features would you like to see implemented? What would make your experience better?

Let's collect ideas and maybe the developers will consider implementing some of them in future updates!
        """,
        "tags": ["discussion", "idea", "feedback"]
    },
    {
        "title": "Solved: How to embed YouTube videos in discussions",
        "content": """
# How to Embed YouTube Videos in Discussions

After some experimentation, I've figured out how to embed YouTube videos in discussions. I wanted to share this solution with everyone.

## The Solution:

1. Find the YouTube video you want to embed
2. Click the "Share" button
3. Click "Embed"
4. Copy the iframe code
5. Paste it directly into your discussion

For example:
```html
<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
```

This will embed the video directly in your discussion post!

**Note:** Make sure you're using the HTML editor mode, not the Markdown editor, when inserting the iframe code.

Hope this helps everyone who wants to include video content in their discussions!
        """,
        "tags": ["solved", "help"]
    }
]

def create_sample_discussions():
    db = next(get_db())
    try:
        # Get admin and test users
        admin = db.query(models.User).filter(models.User.email == "admin@discussync.com").first()
        test_user = db.query(models.User).filter(models.User.email == "test@example.com").first()
        
        if not admin or not test_user:
            print("Admin or test user not found. Please run create_test_data.py first.")
            return
        
        users = [admin, test_user]
        
        # Create discussions
        for idx, discussion_data in enumerate(SAMPLE_DISCUSSIONS):
            # Check if discussion with this title already exists
            existing = db.query(models.Discussion).filter(models.Discussion.title == discussion_data["title"]).first()
            if existing:
                print(f"Discussion '{discussion_data['title']}' already exists. Skipping.")
                continue
                
            # Create discussion
            author = users[idx % len(users)]  # Alternate between users
            
            discussion = models.Discussion(
                title=discussion_data["title"],
                content=discussion_data["content"],
                author_id=author.id,
                created_at=datetime.now(timezone.utc)
            )
            
            db.add(discussion)
            db.flush()  # Flush to get the ID
            
            # Create or get tags and associate with discussion
            for tag_name in discussion_data["tags"]:
                # Check if tag exists
                tag = db.query(models.Tag).filter(models.Tag.name == tag_name).first()
                if not tag:
                    # Create tag
                    tag = models.Tag(name=tag_name)
                    db.add(tag)
                    db.flush()
                
                # Associate tag with discussion
                db.execute(
                    models.discussion_tag.insert().values(
                        discussion_id=discussion.id,
                        tag_id=tag.id
                    )
                )
            
            # Add some upvotes
            for _ in range(random.randint(0, 5)):
                upvote = models.Upvote(
                    user_id=random.choice(users).id,
                    discussion_id=discussion.id
                )
                try:
                    db.add(upvote)
                    db.flush()
                except:
                    db.rollback()  # In case of duplicate upvote
            
            print(f"Created discussion: {discussion_data['title']}")
        
        db.commit()
        print("Sample discussions created successfully!")
    except Exception as e:
        db.rollback()
        print(f"Error creating sample discussions: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_sample_discussions()
