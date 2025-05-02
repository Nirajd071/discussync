
import os
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.websockets import WebSocketDisconnect
from .database import engine
from . import models
from .routers import auth, users, discussions, comments, tags, notifications, files, projects, replies

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Forum API",
    description="API for a discussion forum application",
    version="1.0.0",
)

# Configure CORS to allow all frontend ports during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5175",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],  # Frontend URLs on various ports
    allow_credentials=True,  # Allow credentials
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
app.include_router(projects.router)
app.include_router(replies.router)

@app.get("/")
async def root():
    return {"message": "Welcome to the Forum API"}

@app.websocket("/ws")
async def websocket_route(websocket: WebSocket):
    # For now, use a simple connection without authentication
    # to avoid the WebSocket errors
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"Message received: {data}")
    except WebSocketDisconnect:
        print("Client disconnected")
