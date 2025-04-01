
from django.db import models
from django.conf import settings
import uuid

class Notification(models.Model):
    """Notification model for user notifications"""
    NOTIFICATION_TYPES = (
        ('mention', 'Mention'),
        ('reply', 'Reply'),
        ('upvote', 'Upvote'),
        ('system', 'System'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    type = models.CharField(max_length=10, choices=NOTIFICATION_TYPES)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Optional relationships
    from_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, 
                                  null=True, blank=True, related_name='sent_notifications')
    discussion = models.ForeignKey('discussions.Discussion', on_delete=models.SET_NULL, 
                                  null=True, blank=True, related_name='notifications')
    comment = models.ForeignKey('discussions.Comment', on_delete=models.SET_NULL, 
                               null=True, blank=True, related_name='notifications')
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.type} notification for {self.user.username}"
    
    @property
    def link(self):
        """Generate a link to the relevant content"""
        if self.discussion:
            if self.comment:
                return f"/discussions/{self.discussion.id}#comment-{self.comment.id}"
            return f"/discussions/{self.discussion.id}"
        return None
