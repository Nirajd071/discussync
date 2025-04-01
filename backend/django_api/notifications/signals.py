
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from discussions.models import Comment, Discussion, CommentUpvote, DiscussionUpvote
from .models import Notification

User = get_user_model()

@receiver(post_save, sender=Comment)
def create_comment_notification(sender, instance, created, **kwargs):
    """Create notification when a comment is created."""
    if created:
        # Notification for discussion author
        if instance.discussion.author != instance.author:
            Notification.objects.create(
                user=instance.discussion.author,
                type='reply',
                message=f"{instance.author.username} commented on your discussion.",
                from_user=instance.author,
                discussion=instance.discussion,
                comment=instance
            )
        
        # Notification for mentioned users
        if instance.mentioned_users.exists():
            for user in instance.mentioned_users.all():
                if user != instance.author:
                    Notification.objects.create(
                        user=user,
                        type='mention',
                        message=f"{instance.author.username} mentioned you in a comment.",
                        from_user=instance.author,
                        discussion=instance.discussion,
                        comment=instance
                    )
        
        # Notification for parent comment author
        if instance.parent and instance.parent.author != instance.author:
            Notification.objects.create(
                user=instance.parent.author,
                type='reply',
                message=f"{instance.author.username} replied to your comment.",
                from_user=instance.author,
                discussion=instance.discussion,
                comment=instance
            )

@receiver(post_save, sender=DiscussionUpvote)
def create_discussion_upvote_notification(sender, instance, created, **kwargs):
    """Create notification when a discussion is upvoted."""
    if created and instance.user != instance.discussion.author:
        Notification.objects.create(
            user=instance.discussion.author,
            type='upvote',
            message=f"{instance.user.username} upvoted your discussion.",
            from_user=instance.user,
            discussion=instance.discussion
        )

@receiver(post_save, sender=CommentUpvote)
def create_comment_upvote_notification(sender, instance, created, **kwargs):
    """Create notification when a comment is upvoted."""
    if created and instance.user != instance.comment.author:
        Notification.objects.create(
            user=instance.comment.author,
            type='upvote',
            message=f"{instance.user.username} upvoted your comment.",
            from_user=instance.user,
            discussion=instance.comment.discussion,
            comment=instance.comment
        )
