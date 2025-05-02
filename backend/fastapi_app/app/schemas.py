
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
    tags: List[Any] = []

class CommentBase(BaseModel):
    content: str
    parent_id: Optional[str] = None

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
class User(BaseModel):
    id: str
    username: str
    email: str
    name: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    bio: Optional[str] = None
    avatar: Optional[str] = None
    is_admin: bool = False
    created_at: Optional[str] = None
    joinedAt: Optional[str] = None
    isAdmin: Optional[bool] = None  # Duplicate of is_admin for frontend compatibility

    @validator('joinedAt', pre=True, always=True)
    def set_joined_at(cls, v, values):
        return values.get('created_at')

    @validator('isAdmin', pre=True, always=True)
    def set_is_admin(cls, v, values):
        return values.get('is_admin')

    @validator('name', pre=True, always=True)
    def set_name(cls, v, values):
        if v:
            return v
        first = values.get('first_name', '')
        last = values.get('last_name', '')
        if first and last:
            return f"{first} {last}"
        elif first:
            return first
        elif last:
            return last
        return values.get('username', '')

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
    id: str
    author: User
    created_at: str
    updated_at: Optional[str] = None
    createdAt: Optional[str] = None  # Legacy field for frontend compatibility
    updatedAt: Optional[str] = None  # Legacy field for frontend compatibility
    upvotes: int = 0
    has_upvoted: bool = False
    hasUpvoted: Optional[bool] = None  # Legacy field for frontend compatibility
    replies: List['Comment'] = []
    mentioned_users: List[str] = []
    parentId: Optional[str] = None  # Legacy field for frontend compatibility
    mentionedUsers: Optional[List[str]] = None  # Legacy field for frontend compatibility

    @validator('createdAt', pre=True, always=True)
    def set_created_at(cls, v, values):
        return values.get('created_at')

    @validator('updatedAt', pre=True, always=True)
    def set_updated_at(cls, v, values):
        return values.get('updated_at')

    @validator('hasUpvoted', pre=True, always=True)
    def set_has_upvoted(cls, v, values):
        return values.get('has_upvoted')

    @validator('parentId', pre=True, always=True)
    def set_parent_id(cls, v, values):
        return values.get('parent_id')

    @validator('mentionedUsers', pre=True, always=True)
    def set_mentioned_users(cls, v, values):
        return values.get('mentioned_users')

    class Config:
        orm_mode = True
        from_attributes = True

class Attachment(AttachmentBase):
    id: str
    url: str
    uploaded_at: str
    uploadedAt: Optional[str] = None  # Legacy field for frontend compatibility

    @validator('uploadedAt', pre=True, always=True)
    def set_uploaded_at(cls, v, values):
        return values.get('uploaded_at')

    class Config:
        orm_mode = True
        from_attributes = True

class Discussion(BaseModel):
    id: str
    title: str
    content: str
    tags: List[Tag] = []
    author: User
    created_at: str
    updated_at: Optional[str] = None
    createdAt: Optional[str] = None  # Legacy field for frontend compatibility
    updatedAt: Optional[str] = None  # Legacy field for frontend compatibility
    upvote_count: int = 0
    upvotes: Optional[int] = None  # Legacy field for frontend compatibility
    comment_count: int = 0
    commentCount: Optional[int] = None  # Legacy field for frontend compatibility
    has_upvoted: bool = False
    hasUpvoted: Optional[bool] = None  # Legacy field for frontend compatibility
    attachments: List[Attachment] = []

    @validator('createdAt', pre=True, always=True)
    def set_created_at(cls, v, values):
        return values.get('created_at')

    @validator('updatedAt', pre=True, always=True)
    def set_updated_at(cls, v, values):
        return values.get('updated_at')

    @validator('upvotes', pre=True, always=True)
    def set_upvotes(cls, v, values):
        return values.get('upvote_count')

    @validator('commentCount', pre=True, always=True)
    def set_comment_count(cls, v, values):
        return values.get('comment_count')

    @validator('hasUpvoted', pre=True, always=True)
    def set_has_upvoted(cls, v, values):
        return values.get('has_upvoted')

    class Config:
        orm_mode = True
        from_attributes = True

class Notification(NotificationBase):
    id: str
    created_at: str
    createdAt: Optional[str] = None  # Legacy field for frontend compatibility
    from_user: Optional[User] = None
    from_legacy: Optional[User] = Field(None, alias="from")  # Legacy field for frontend compatibility
    link: Optional[str] = None
    isRead: Optional[bool] = None  # Legacy field for frontend compatibility

    @validator('createdAt', pre=True, always=True)
    def set_created_at(cls, v, values):
        return values.get('created_at')

    @validator('from_legacy', pre=True, always=True)
    def set_from(cls, v, values):
        return values.get('from_user')

    @validator('isRead', pre=True, always=True)
    def set_is_read(cls, v, values):
        return values.get('is_read')

    class Config:
        orm_mode = True
        from_attributes = True

# Authentication models
class Token(BaseModel):
    token: str
    token_type: str
    user: Any

class TokenData(BaseModel):
    user_id: Optional[str] = None

class UpvoteResponse(BaseModel):
    upvotes: int
    hasUpvoted: bool

    @validator('upvotes', pre=True, always=True)
    def set_upvotes(cls, v, values):
        # Handle both upvotes and upvote_count
        return v

    @validator('hasUpvoted', pre=True, always=True)
    def set_has_upvoted(cls, v, values):
        # Handle both hasUpvoted and has_upvoted
        return v

# Project models
class ProjectBase(BaseModel):
    title: str
    description: str

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None

class ProjectComment(BaseModel):
    id: str
    content: str
    author: User
    created_at: str
    updated_at: Optional[str] = None

class Project(ProjectBase):
    id: str
    file_name: str
    file_size: int
    file_type: str
    author: User
    upvote_count: int = 0
    comment_count: int = 0
    created_at: str
    updated_at: Optional[str] = None
    has_upvoted: bool = False
    comments: List[ProjectComment] = []

    class Config:
        orm_mode = True
        from_attributes = True

# Helper models
class FileUpload(BaseModel):
    file_url: str
    name: str
    size: int
    type: str
