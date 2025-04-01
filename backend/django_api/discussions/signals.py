
from django.db.models.signals import m2m_changed, post_save
from django.dispatch import receiver
from .models import Comment
from notifications.models import Notification

@receiver(post_save, sender=Comment)
def create_comment_notifications(sender, instance, created, **kwargs):
    """Create notifications when a comment is created"""
    if created:
        # Notify discussion author of new comment
        if instance.author != instance.discussion.author:
            Notification.objects.create(
                user=instance.discussion.author,
                type='reply',
                message=f"{instance.author.username} commented on your discussion: {instance.discussion.title}",
                from_user=instance.author,
                discussion=instance.discussion,
                comment=instance
            )
            
        # Notify parent comment author of a reply
        if instance.parent and instance.parent.author != instance.author:
            Notification.objects.create(
                user=instance.parent.author,
                type='reply',
                message=f"{instance.author.username} replied to your comment",
                from_user=instance.author,
                discussion=instance.discussion,
                comment=instance
            )

@receiver(m2m_changed, sender=Comment.mentioned_users.through)
def create_mention_notifications(sender, instance, action, pk_set, **kwargs):
    """Create notifications when users are mentioned in a comment"""
    if action == 'post_add':
        for user_id in pk_set:
            from django.contrib.auth import get_user_model
            User = get_user_model()
            
            user = User.objects.get(id=user_id)
            if user != instance.author:
                Notification.objects.create(
                    user=user,
                    type='mention',
                    message=f"{instance.author.username} mentioned you in a comment",
                    from_user=instance.author,
                    discussion=instance.discussion,
                    comment=instance
                )
