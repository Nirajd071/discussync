
import os
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .database import engine
from . import models
from .routers import auth, users, discussions, comments, tags, notifications, files
from .dependencies import get_current_user

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Forum API",
    description="API for a discussion forum application",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory if it doesn't exist
uploads_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(uploads_dir, exist_ok=True)

# Mount static files
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

# Include routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(discussions.router)
app.include_router(comments.router)
app.include_router(tags.router)
app.include_router(notifications.router)
app.include_router(files.router)

@app.get("/")
async def root():
    return {"message": "Welcome to the Forum API"}
