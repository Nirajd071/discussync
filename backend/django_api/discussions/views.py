
from django.db.models import Count, Q
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Tag, Discussion, Comment, Upvote, Attachment
from .serializers import (
    TagSerializer, 
    DiscussionSerializer, 
    CommentSerializer, 
    UpvoteSerializer,
    FileUploadSerializer,
    AttachmentSerializer
)

class TagViewSet(viewsets.ModelViewSet):
    """ViewSet for the Tag model"""
    queryset = Tag.objects.all().annotate(Count('discussions', distinct=True))
    serializer_class = TagSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class DiscussionViewSet(viewsets.ModelViewSet):
    """ViewSet for the Discussion model"""
    serializer_class = DiscussionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        """Return discussions with optional filtering"""
        queryset = Discussion.objects.annotate(upvote_count=Count('upvotes'))
        
        # Filter by tag if provided
        tag = self.request.query_params.get('tag', None)
        if tag is not None:
            queryset = queryset.filter(tags__name=tag)
        
        # Filter by search query if provided
        search = self.request.query_params.get('search', None)
        if search is not None:
            queryset = queryset.filter(
                Q(title__icontains=search) | 
                Q(content__icontains=search) |
                Q(tags__name__icontains=search)
            ).distinct()
            
        return queryset
    
    @action(detail=True, methods=['post'])
    def upvote(self, request, pk=None):
        """Upvote a discussion"""
        discussion = self.get_object()
        user = request.user
        
        # Check if the user has already upvoted
        upvote, created = Upvote.objects.get_or_create(
            user=user,
            discussion=discussion
        )
        
        if not created:
            # If upvote exists, remove it
            upvote.delete()
            has_upvoted = False
        else:
            has_upvoted = True
            
        upvotes_count = discussion.upvotes.count()
        
        return Response({
            'upvotes': upvotes_count,
            'hasUpvoted': has_upvoted
        })

class CommentViewSet(viewsets.ModelViewSet):
    """ViewSet for the Comment model"""
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        """Return comments for a specific discussion"""
        discussion_id = self.kwargs.get('discussion_pk')
        if discussion_id:
            # Only return top-level comments (no parent)
            return Comment.objects.filter(
                discussion_id=discussion_id,
                parent__isnull=True
            )
        return Comment.objects.all()
    
    def create(self, request, *args, **kwargs):
        """Create a new comment"""
        discussion_id = self.kwargs.get('discussion_pk')
        data = request.data.copy()
        
        try:
            discussion = Discussion.objects.get(id=discussion_id)
        except Discussion.DoesNotExist:
            return Response(
                {"detail": "Discussion not found."}, 
                status=status.HTTP_404_NOT_FOUND
            )
            
        # Set the discussion
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        
        # Create the comment
        comment = Comment.objects.create(
            discussion=discussion,
            content=serializer.validated_data['content'],
            author=request.user,
            parent_id=serializer.validated_data.get('parent', {}).get('id') if 'parent' in serializer.validated_data else None
        )
        
        # Process mentioned users (this is a simple implementation)
        # In a real app, you'd want to use a more robust mention detection system
        content = serializer.validated_data['content']
        mentioned_usernames = [
            word[1:] for word in content.split() 
            if word.startswith('@') and len(word) > 1
        ]
        
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        for username in mentioned_usernames:
            try:
                user = User.objects.get(username=username)
                comment.mentioned_users.add(user)
            except User.DoesNotExist:
                pass
        
        # Return the serialized comment
        serializer = self.get_serializer(comment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def upvote(self, request, pk=None, discussion_pk=None):
        """Upvote a comment"""
        comment = self.get_object()
        user = request.user
        
        # Check if the user has already upvoted
        upvote, created = Upvote.objects.get_or_create(
            user=user,
            comment=comment
        )
        
        if not created:
            # If upvote exists, remove it
            upvote.delete()
            has_upvoted = False
        else:
            has_upvoted = True
            
        upvotes_count = comment.upvotes.count()
        
        return Response({
            'upvotes': upvotes_count,
            'hasUpvoted': has_upvoted
        })

class FileUploadViewSet(viewsets.ViewSet):
    """ViewSet for file uploads"""
    permission_classes = [permissions.IsAuthenticated]
    
    def create(self, request, format=None):
        """Upload a file"""
        serializer = FileUploadSerializer(
            data=request.data, 
            context={'request': request}
        )
        
        if serializer.is_valid():
            # Create a temporary discussion if one wasn't provided
            # (This could be improved in a real application)
            discussion, created = Discussion.objects.get_or_create(
                title="File Upload",
                author=request.user,
                defaults={'content': 'File upload placeholder'}
            )
            
            file = request.data['file']
            attachment = Attachment.objects.create(
                name=file.name,
                file=file,
                size=file.size,
                type=file.content_type,
                discussion=discussion
            )
            
            return Response(AttachmentSerializer(attachment).data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
