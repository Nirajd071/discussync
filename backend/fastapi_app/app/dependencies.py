
from fastapi import Depends, HTTPException, status, WebSocket, Query, Request
from fastapi.security import OAuth2PasswordBearer
from fastapi.websockets import WebSocketDisconnect
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from .database import get_db
from . import models, schemas

# Load environment variables
load_dotenv()

# JWT Configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", 1440))  # Default to 24 hours if not set

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

# Optional OAuth2 scheme that doesn't raise an exception
class OptionalOAuth2PasswordBearer(OAuth2PasswordBearer):
    async def __call__(self, request: Request = None):
        try:
            return await super().__call__(request)
        except HTTPException:
            return None

optional_oauth2_scheme = OptionalOAuth2PasswordBearer(tokenUrl="api/auth/login")

# Function to create access token
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Function to get current user
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise credentials_exception

    return user

# Function to get current user (optional)
def get_optional_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(optional_oauth2_scheme),
):
    if not token:
        return None

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            return None
    except JWTError:
        return None

    user = db.query(models.User).filter(models.User.id == user_id).first()
    return user

# Function to get current user from WebSocket
async def get_current_user_ws(websocket: WebSocket, token: str = Query(...), db: Session = Depends(get_db)):
    credentials_exception = WebSocketDisconnect(code=1008)  # Policy violation

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise credentials_exception

    return user

# Function to get current active user
def get_current_active_user(current_user: schemas.User = Depends(get_current_user)):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

# Function to check if user is admin
def get_admin_user(current_user: schemas.User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    return current_user
