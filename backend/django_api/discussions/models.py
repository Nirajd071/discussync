
from django.db import models
from django.conf import settings
import uuid

class Tag(models.Model):
    """Tags for discussions"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return self.name

    @property
    def count(self):
        """Return the number of discussions with this tag"""
        return self.discussions.count()

class Discussion(models.Model):
    """Discussions model"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    content = models.TextField()
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='discussions')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)
    tags = models.ManyToManyField(Tag, related_name='discussions', blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title
    
    @property
    def comment_count(self):
        """Return the number of comments in the discussion"""
        return self.comments.count()

class Comment(models.Model):
    """Comments for discussions"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    discussion = models.ForeignKey(Discussion, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='comments')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, related_name='replies', null=True, blank=True)
    mentioned_users = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='mentions', blank=True)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f"Comment by {self.author.username} on {self.discussion.title}"

class Upvote(models.Model):
    """Upvotes for discussions and comments"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='upvotes')
    discussion = models.ForeignKey(Discussion, on_delete=models.CASCADE, related_name='upvotes', null=True, blank=True)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name='upvotes', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'discussion'],
                condition=models.Q(discussion__isnull=False),
                name='unique_discussion_upvote'
            ),
            models.UniqueConstraint(
                fields=['user', 'comment'],
                condition=models.Q(comment__isnull=False),
                name='unique_comment_upvote'
            ),
            models.CheckConstraint(
                check=(
                    models.Q(discussion__isnull=False, comment__isnull=True) | 
                    models.Q(discussion__isnull=True, comment__isnull=False)
                ),
                name='upvote_discussion_or_comment'
            )
        ]
        
    def __str__(self):
        if self.discussion:
            return f"Upvote by {self.user.username} on discussion: {self.discussion.title}"
        return f"Upvote by {self.user.username} on comment: {self.comment.id}"

class Attachment(models.Model):
    """File attachments for discussions"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to='attachments/')
    size = models.PositiveIntegerField()  # file size in bytes
    type = models.CharField(max_length=100)  # MIME type
    discussion = models.ForeignKey(Discussion, on_delete=models.CASCADE, related_name='attachments')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name
