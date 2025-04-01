
from rest_framework import serializers
from .models import Notification
from users.serializers import UserSerializer

class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for the Notification model"""
    from_user = UserSerializer(read_only=True)
    link = serializers.CharField(read_only=True)
    
    class Meta:
        model = Notification
        fields = ['id', 'type', 'message', 'is_read', 'created_at', 'from_user', 'link']
