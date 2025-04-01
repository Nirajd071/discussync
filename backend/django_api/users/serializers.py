
from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """Serializer for the User model"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name', 'avatar', 'bio', 'date_joined']
        read_only_fields = ['id', 'date_joined']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

    def to_representation(self, instance):
        """Transform date_joined to joinedAt for frontend compatibility"""
        ret = super().to_representation(instance)
        ret['joinedAt'] = ret.pop('date_joined')
        return ret

class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name']
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom JWT token serializer that includes user data"""
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        
        # Add custom user data
        data['user'] = {
            'id': str(user.id),
            'username': user.username,
            'name': f"{user.first_name} {user.last_name}".strip(),
            'email': user.email,
            'bio': user.bio,
            'joinedAt': user.date_joined.isoformat(),
            'avatar': user.avatar.url if user.avatar else None,
            'isAdmin': user.is_staff
        }
        
        return data
