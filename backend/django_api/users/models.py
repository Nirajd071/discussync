
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
import uuid

class User(AbstractUser):
    """Custom User model that uses UUID as primary key"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    bio = models.TextField(blank=True)
    
    def __str__(self):
        return self.username

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')
