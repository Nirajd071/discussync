
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from notifications.models import Notification

User = get_user_model()

@receiver(post_save, sender=User)
def create_welcome_notification(sender, instance, created, **kwargs):
    """Create a welcome notification when a user is created."""
    if created:
        Notification.objects.create(
            user=instance,
            type='system',
            message=f"Welcome to the forum, {instance.username}! We're glad to have you here."
        )
