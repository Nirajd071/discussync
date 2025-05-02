"""
Script to create sample projects in the database
"""
from app.database import get_db, engine
from app import models
import uuid
from datetime import datetime, timezone
import os
import shutil
import random

# Sample project data
SAMPLE_PROJECTS = [
    {
        "title": "Django REST Framework API Boilerplate",
        "description": "A comprehensive boilerplate for Django REST Framework APIs with authentication, permissions, and documentation. Includes Docker setup for easy deployment and development.",
        "file_name": "django-rest-boilerplate.zip",
        "file_size": 1500000,  # 1.5 MB
        "file_type": "application/zip",
        "upvote_count": 32,
        "comment_count": 1
    },
    {
        "title": "FastAPI Microservices Starter Kit",
        "description": "A starter kit for building microservices with FastAPI. Includes authentication, database integration, and API documentation. Perfect for creating robust backend services.",
        "file_name": "fastapi-microservices.zip",
        "file_size": 1200000,  # 1.2 MB
        "file_type": "application/zip",
        "upvote_count": 28,
        "comment_count": 1
    },
    {
        "title": "React Component Library",
        "description": "A reusable React component library with TypeScript support, Storybook documentation, and comprehensive test coverage. Perfect for jumpstarting new projects.",
        "file_name": "react-component-lib.zip",
        "file_size": 2300000,  # 2.3 MB
        "file_type": "application/zip",
        "upvote_count": 45,
        "comment_count": 3
    },
    {
        "title": "Next.js E-commerce Starter",
        "description": "A complete e-commerce starter kit built with Next.js, including cart functionality, product filtering, and Stripe payment integration.",
        "file_name": "nextjs-ecommerce.zip",
        "file_size": 3700000,  # 3.7 MB
        "file_type": "application/zip",
        "upvote_count": 56,
        "comment_count": 7
    }
]

# Sample comments
SAMPLE_COMMENTS = [
    "Great project! This saved me a lot of time.",
    "I've been looking for something like this. Thanks for sharing!",
    "This is exactly what I needed for my new project.",
    "Very well organized code. Easy to understand and extend.",
    "I found a small bug in the authentication module, but overall it's excellent.",
    "Would be nice to have more documentation, but the code is clean and readable.",
    "This is a game-changer for my workflow. Thank you!",
    "I've made some modifications to fit my needs and it worked perfectly.",
    "The Docker setup is particularly helpful. Saved me hours of configuration.",
    "Looking forward to more projects like this!"
]

def create_sample_projects():
    db = next(get_db())
    try:
        # Get admin and test users
        admin = db.query(models.User).filter(models.User.email == "admin@discussync.com").first()
        test_user = db.query(models.User).filter(models.User.email == "test@example.com").first()
        
        if not admin or not test_user:
            print("Admin or test user not found. Please run create_test_data.py first.")
            return
        
        users = [admin, test_user]
        
        # Create uploads directory if it doesn't exist
        uploads_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads", "projects")
        os.makedirs(uploads_dir, exist_ok=True)
        
        # Create a dummy file to use for all projects
        dummy_file_path = os.path.join(uploads_dir, "dummy.zip")
        with open(dummy_file_path, "wb") as f:
            f.write(b"This is a dummy file for testing purposes.")
        
        # Create projects
        for idx, project_data in enumerate(SAMPLE_PROJECTS):
            # Check if project with this title already exists
            existing = db.query(models.Project).filter(models.Project.title == project_data["title"]).first()
            if existing:
                print(f"Project '{project_data['title']}' already exists. Skipping.")
                continue
                
            # Create project
            author = users[idx % len(users)]  # Alternate between users
            
            # Generate unique filename
            unique_filename = f"{uuid.uuid4()}.zip"
            file_path = os.path.join(uploads_dir, unique_filename)
            
            # Copy dummy file
            shutil.copy(dummy_file_path, file_path)
            
            project = models.Project(
                title=project_data["title"],
                description=project_data["description"],
                file_name=project_data["file_name"],
                file_path=f"/uploads/projects/{unique_filename}",
                file_size=project_data["file_size"],
                file_type=project_data["file_type"],
                author_id=author.id,
                upvote_count=project_data["upvote_count"],
                comment_count=project_data["comment_count"],
                created_at=datetime.now(timezone.utc)
            )
            
            db.add(project)
            db.flush()  # Flush to get the ID
            
            # Add some upvotes
            for _ in range(project_data["upvote_count"]):
                upvote = models.ProjectUpvote(
                    user_id=random.choice(users).id,
                    project_id=project.id
                )
                try:
                    db.add(upvote)
                    db.flush()
                except:
                    db.rollback()  # In case of duplicate upvote
            
            # Add some comments
            for _ in range(project_data["comment_count"]):
                comment = models.ProjectComment(
                    content=random.choice(SAMPLE_COMMENTS),
                    author_id=random.choice(users).id,
                    project_id=project.id,
                    created_at=datetime.now(timezone.utc)
                )
                db.add(comment)
            
            print(f"Created project: {project_data['title']}")
        
        db.commit()
        print("Sample projects created successfully!")
    except Exception as e:
        db.rollback()
        print(f"Error creating sample projects: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_sample_projects()
