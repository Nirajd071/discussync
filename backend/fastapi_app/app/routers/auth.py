
from fastapi import APIRouter, Depends, HTTPException, status, Request, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from .. import models, schemas, utils
from ..database import get_db
from ..dependencies import create_access_token, get_current_user
from typing import Optional
import json

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"],
    responses={401: {"description": "Unauthorized"}},
)

@router.post("/register/", response_model=schemas.Token)
async def register(user_create: schemas.UserCreate, db: Session = Depends(get_db)):
    # Debug logging
    print(f"Received registration data: {user_create.dict()}")

    # Check if username or email already exists
    existing_email = db.query(models.User).filter(models.User.email == user_create.email).first()
    if existing_email:
        print(f"Email already registered: {user_create.email}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Email already registered: {user_create.email}",
        )

    existing_username = db.query(models.User).filter(models.User.username == user_create.username).first()
    if existing_username:
        print(f"Username already taken: {user_create.username}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Username already taken: {user_create.username}",
        )

    # Debug: List all users in the database
    all_users = db.query(models.User).all()
    print(f"All users in database: {[(user.username, user.email) for user in all_users]}")

    # Create new user
    hashed_password = utils.get_password_hash(user_create.password)
    db_user = models.User(
        username=user_create.username,
        email=user_create.email,
        hashed_password=hashed_password,
        first_name=user_create.first_name,
        last_name=user_create.last_name,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # Create access token
    access_token = create_access_token(data={"sub": str(db_user.id)})

    # Format user data for frontend
    user_data = {
        "id": db_user.id,
        "username": db_user.username,
        "email": db_user.email,
        "name": f"{db_user.first_name or ''} {db_user.last_name or ''}".strip(),
        "first_name": db_user.first_name,
        "last_name": db_user.last_name,
        "bio": db_user.bio,
        "avatar": db_user.avatar,
        "is_admin": db_user.is_admin,
        "created_at": db_user.created_at.isoformat() if db_user.created_at else None
    }

    return {
        "token": access_token,
        "token_type": "bearer",
        "user": user_data
    }

@router.post("/login/", response_model=schemas.Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    # Debug logging
    print(f"Login attempt with username: {form_data.username}")

    # Authenticate user
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user:
        print(f"No user found with email: {form_data.username}, trying username")
        user = db.query(models.User).filter(models.User.username == form_data.username).first()

    if user:
        print(f"Found user: {user.username}, {user.email}")
        password_valid = utils.verify_password(form_data.password, user.hashed_password)
        print(f"Password verification result: {password_valid}")
    else:
        print(f"No user found with username or email: {form_data.username}")

    if not user or not utils.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token
    access_token = create_access_token(data={"sub": str(user.id)})
    print(f"Login successful for user: {user.username}, {user.email}")

    # Format user data for frontend
    user_data = {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "name": f"{user.first_name or ''} {user.last_name or ''}".strip(),
        "first_name": user.first_name,
        "last_name": user.last_name,
        "bio": user.bio,
        "avatar": user.avatar,
        "is_admin": user.is_admin,
        "created_at": user.created_at.isoformat() if user.created_at else None
    }

    return {
        "token": access_token,
        "token_type": "bearer",
        "user": user_data
    }

# Alternative login endpoint that accepts JSON data
@router.post("/login-json/", response_model=schemas.Token)
async def login_json(
    request: Request,
    db: Session = Depends(get_db)
):
    try:
        data = await request.json()
        email = data.get("email", "")
        password = data.get("password", "")

        print(f"Login attempt with email: {email}")

        # Authenticate user
        user = db.query(models.User).filter(models.User.email == email).first()
        if not user:
            print(f"No user found with email: {email}, trying username")
            user = db.query(models.User).filter(models.User.username == email).first()

        if user:
            print(f"Found user: {user.username}, {user.email}")
            password_valid = utils.verify_password(password, user.hashed_password)
            print(f"Password verification result: {password_valid}")
        else:
            print(f"No user found with username or email: {email}")

        if not user or not utils.verify_password(password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Create access token
        access_token = create_access_token(data={"sub": str(user.id)})
        print(f"Login successful for user: {user.username}, {user.email}")

        # Format user data for frontend
        user_data = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "name": f"{user.first_name or ''} {user.last_name or ''}".strip(),
            "first_name": user.first_name,
            "last_name": user.last_name,
            "bio": user.bio,
            "avatar": user.avatar,
            "is_admin": user.is_admin,
            "created_at": user.created_at.isoformat() if user.created_at else None
        }

        return {
            "token": access_token,
            "token_type": "bearer",
            "user": user_data
        }
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid JSON data",
        )

@router.get("/me/", response_model=schemas.User)
async def get_current_user_info(current_user: models.User = Depends(get_current_user)):
    # Format user data for frontend
    user_data = {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "name": f"{current_user.first_name or ''} {current_user.last_name or ''}".strip(),
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "bio": current_user.bio,
        "avatar": current_user.avatar,
        "is_admin": current_user.is_admin,
        "created_at": current_user.created_at.isoformat() if current_user.created_at else None
    }
    return user_data

@router.post("/refresh-token/", response_model=schemas.Token)
async def refresh_token(current_user: models.User = Depends(get_current_user)):
    # Create a new access token
    access_token = create_access_token(data={"sub": str(current_user.id)})

    # Format user data for frontend
    user_data = {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "name": f"{current_user.first_name or ''} {current_user.last_name or ''}".strip(),
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "bio": current_user.bio,
        "avatar": current_user.avatar,
        "is_admin": current_user.is_admin,
        "created_at": current_user.created_at.isoformat() if current_user.created_at else None
    }

    return {
        "token": access_token,
        "token_type": "bearer",
        "user": user_data
    }

# Test endpoint to verify connectivity
@router.get("/test/")
async def test_connection():
    return {"message": "FastAPI connection successful", "status": "ok"}
