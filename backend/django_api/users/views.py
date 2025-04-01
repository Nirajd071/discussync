
from django.contrib.auth import get_user_model
from rest_framework import status, viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import UserSerializer, UserRegistrationSerializer, CustomTokenObtainPairSerializer

User = get_user_model()

class CustomTokenObtainPairView(TokenObtainPairView):
    """Custom JWT token view with user data"""
    serializer_class = CustomTokenObtainPairSerializer

class UserViewSet(viewsets.ModelViewSet):
    """ViewSet for user operations"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        """Allow unauthenticated access to register endpoint"""
        if self.action == 'register':
            return [permissions.AllowAny()]
        return super().get_permissions()
    
    @action(detail=False, methods=['post'], serializer_class=UserRegistrationSerializer)
    def register(self, request):
        """Register a new user"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate token for the new user
        token_serializer = CustomTokenObtainPairSerializer(data={
            'username': request.data['username'],
            'password': request.data['password']
        })
        token_serializer.is_valid(raise_exception=True)
        
        return Response(token_serializer.validated_data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user data"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
