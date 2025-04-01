
from datetime import datetime
from typing import List, Optional, Union, Any
from pydantic import BaseModel, EmailStr, Field, validator, AnyHttpUrl
from uuid import UUID

# Base models
class UserBase(BaseModel):
    email: EmailStr
    username: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    bio: Optional[str] = None
    avatar: Optional[str] = None
    is_admin: bool = False
    
    @property
    def name(self) -> str:
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        elif self.first_name:
            return self.first_name
        elif self.last_name:
            return self.last_name
        return self.username

class TagBase(BaseModel):
    name: str
    description: Optional[str] = None

class DiscussionBase(BaseModel):
    title: str
    content: str
    tags: List[str] = []

class CommentBase(BaseModel):
    content: str
    parent_id: Optional[UUID] = None

class AttachmentBase(BaseModel):
    name: str
    type: str
    size: int

class NotificationBase(BaseModel):
    type: str
    message: str
    is_read: bool = False

# Create models
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None

class TagCreate(TagBase):
    pass

class DiscussionCreate(DiscussionBase):
    pass

class CommentCreate(CommentBase):
    pass

class AttachmentCreate(AttachmentBase):
    file_path: str
    discussion_id: UUID

class NotificationCreate(NotificationBase):
    user_id: UUID
    from_user_id: Optional[UUID] = None
    discussion_id: Optional[UUID] = None
    comment_id: Optional[UUID] = None

# Update models
class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    bio: Optional[str] = None
    password: Optional[str] = None

class TagUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class DiscussionUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    tags: Optional[List[str]] = None

class CommentUpdate(BaseModel):
    content: Optional[str] = None

class NotificationUpdate(BaseModel):
    is_read: Optional[bool] = None

# Response models
class User(UserBase):
    id: UUID
    created_at: datetime
    joinedAt: datetime = None
    
    @validator('joinedAt', pre=True, always=True)
    def set_joined_at(cls, v, values):
        return values.get('created_at')
    
    class Config:
        orm_mode = True
        from_attributes = True

class Tag(TagBase):
    id: UUID
    count: Optional[int] = 0
    
    class Config:
        orm_mode = True
        from_attributes = True

class Comment(CommentBase):
    id: UUID
    author: User
    created_at: datetime
    updated_at: Optional[datetime] = None
    upvotes: int = 0
    has_upvoted: bool = False
    replies: List['Comment'] = []
    mentioned_users: List[str] = []
    
    class Config:
        orm_mode = True
        from_attributes = True

class Attachment(AttachmentBase):
    id: UUID
    url: str
    uploaded_at: datetime
    
    class Config:
        orm_mode = True
        from_attributes = True

class Discussion(DiscussionBase):
    id: UUID
    author: User
    created_at: datetime
    updated_at: Optional[datetime] = None
    upvotes: int = 0
    comment_count: int = 0
    has_upvoted: bool = False
    attachments: List[Attachment] = []
    
    class Config:
        orm_mode = True
        from_attributes = True

class Notification(NotificationBase):
    id: UUID
    created_at: datetime
    from_user: Optional[User] = None
    link: Optional[str] = None
    
    class Config:
        orm_mode = True
        from_attributes = True

# Authentication models
class Token(BaseModel):
    token: str
    token_type: str
    user: User

class TokenData(BaseModel):
    user_id: Optional[str] = None

class UpvoteResponse(BaseModel):
    upvotes: int
    hasUpvoted: bool

# Helper models
class FileUpload(BaseModel):
    file_url: str
    name: str
    size: int
    type: str
