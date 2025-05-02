
import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Boolean, Column, ForeignKey, String, Text,
    DateTime, Table, Integer, Enum, CheckConstraint, UniqueConstraint
)
from sqlalchemy.orm import relationship
import enum
from .database import Base

# Association tables
discussion_tag = Table(
    "discussion_tag",
    Base.metadata,
    Column("discussion_id", String, ForeignKey("discussions.id")),
    Column("tag_id", String, ForeignKey("tags.id")),
)

comment_mentioned_user = Table(
    "comment_mentioned_user",
    Base.metadata,
    Column("comment_id", String, ForeignKey("comments.id")),
    Column("user_id", String, ForeignKey("users.id")),
)

# Enum for notification types
class NotificationType(str, enum.Enum):
    mention = "mention"
    reply = "reply"
    upvote = "upvote"
    system = "system"

# Models
class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    avatar = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    discussions = relationship("Discussion", back_populates="author")
    comments = relationship("Comment", back_populates="author")
    upvotes = relationship("Upvote", back_populates="user")
    notifications = relationship("Notification", back_populates="user", foreign_keys="Notification.user_id")
    sent_notifications = relationship("Notification", back_populates="from_user", foreign_keys="Notification.from_user_id")
    projects = relationship("Project", back_populates="author")

class Tag(Base):
    __tablename__ = "tags"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, unique=True, index=True)
    description = Column(Text, nullable=True)

    # Relationships
    discussions = relationship("Discussion", secondary=discussion_tag, back_populates="tags")

class Discussion(Base):
    __tablename__ = "discussions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, index=True)
    content = Column(Text)
    author_id = Column(String, ForeignKey("users.id"))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, nullable=True, onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    author = relationship("User", back_populates="discussions")
    comments = relationship("Comment", back_populates="discussion")
    tags = relationship("Tag", secondary=discussion_tag, back_populates="discussions")
    upvotes = relationship("Upvote", back_populates="discussion")
    attachments = relationship("Attachment", back_populates="discussion")
    notifications = relationship("Notification", back_populates="discussion")

class Comment(Base):
    __tablename__ = "comments"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    content = Column(Text)
    author_id = Column(String, ForeignKey("users.id"))
    discussion_id = Column(String, ForeignKey("discussions.id"))
    parent_id = Column(String, ForeignKey("comments.id"), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, nullable=True, onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    author = relationship("User", back_populates="comments")
    discussion = relationship("Discussion", back_populates="comments")
    upvotes = relationship("Upvote", back_populates="comment")
    mentions = relationship("User", secondary=comment_mentioned_user)
    replies = relationship("Comment",
                          backref="parent",
                          remote_side=[id])
    notifications = relationship("Notification", back_populates="comment")

class Upvote(Base):
    __tablename__ = "upvotes"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    discussion_id = Column(String, ForeignKey("discussions.id"), nullable=True)
    comment_id = Column(String, ForeignKey("comments.id"), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    user = relationship("User", back_populates="upvotes")
    discussion = relationship("Discussion", back_populates="upvotes")
    comment = relationship("Comment", back_populates="upvotes")

    # Constraints
    __table_args__ = (
        CheckConstraint(
            'discussion_id IS NOT NULL OR comment_id IS NOT NULL',
            name='upvote_target_constraint'
        ),
        CheckConstraint(
            '(discussion_id IS NOT NULL AND comment_id IS NULL) OR (discussion_id IS NULL AND comment_id IS NOT NULL)',
            name='upvote_single_target_constraint'
        ),
        UniqueConstraint('user_id', 'discussion_id', name='unique_discussion_upvote'),
        UniqueConstraint('user_id', 'comment_id', name='unique_comment_upvote'),
    )

class Attachment(Base):
    __tablename__ = "attachments"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String)
    file_path = Column(String)
    size = Column(Integer)  # Size in bytes
    type = Column(String)   # MIME type
    discussion_id = Column(String, ForeignKey("discussions.id"))
    uploaded_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    discussion = relationship("Discussion", back_populates="attachments")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    from_user_id = Column(String, ForeignKey("users.id"), nullable=True)
    type = Column(Enum(NotificationType))
    message = Column(Text)
    is_read = Column(Boolean, default=False)
    discussion_id = Column(String, ForeignKey("discussions.id"), nullable=True)
    comment_id = Column(String, ForeignKey("comments.id"), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    user = relationship("User", foreign_keys=[user_id], back_populates="notifications")
    from_user = relationship("User", foreign_keys=[from_user_id], back_populates="sent_notifications")
    discussion = relationship("Discussion", back_populates="notifications")
    comment = relationship("Comment", back_populates="notifications")

# Project models for the Projects feature
class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, index=True)
    description = Column(Text)
    file_name = Column(String)
    file_path = Column(String)
    file_size = Column(Integer)  # Size in bytes
    file_type = Column(String)   # MIME type
    author_id = Column(String, ForeignKey("users.id"))
    upvote_count = Column(Integer, default=0)
    comment_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, nullable=True, onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    author = relationship("User", back_populates="projects")
    upvotes = relationship("ProjectUpvote", back_populates="project")
    comments = relationship("ProjectComment", back_populates="project")

class ProjectUpvote(Base):
    __tablename__ = "project_upvotes"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    project_id = Column(String, ForeignKey("projects.id"))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    user = relationship("User")
    project = relationship("Project", back_populates="upvotes")

    # Constraints
    __table_args__ = (
        UniqueConstraint('user_id', 'project_id', name='unique_project_upvote'),
    )

class ProjectComment(Base):
    __tablename__ = "project_comments"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    content = Column(Text)
    author_id = Column(String, ForeignKey("users.id"))
    project_id = Column(String, ForeignKey("projects.id"))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, nullable=True, onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    author = relationship("User")
    project = relationship("Project", back_populates="comments")
