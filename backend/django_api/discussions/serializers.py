
from rest_framework import serializers
from .models import Tag, Discussion, Comment, Upvote, Attachment
from users.serializers import UserSerializer

class TagSerializer(serializers.ModelSerializer):
    """Serializer for Tag model"""
    count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Tag
        fields = ['id', 'name', 'description', 'count']

class AttachmentSerializer(serializers.ModelSerializer):
    """Serializer for Attachment model"""
    url = serializers.SerializerMethodField()
    
    class Meta:
        model = Attachment
        fields = ['id', 'name', 'url', 'size', 'type', 'uploaded_at']
    
    def get_url(self, obj):
        return obj.file.url

class CommentSerializer(serializers.ModelSerializer):
    """Serializer for Comment model"""
    author = UserSerializer(read_only=True)
    upvotes = serializers.IntegerField(source='upvotes.count', read_only=True)
    has_upvoted = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()
    parent_id = serializers.UUIDField(source='parent.id', required=False, allow_null=True)
    mentioned_users = serializers.SlugRelatedField(
        many=True, 
        read_only=True,
        slug_field='username'
    )
    
    class Meta:
        model = Comment
        fields = ['id', 'content', 'author', 'created_at', 'updated_at', 
                  'upvotes', 'has_upvoted', 'parent_id', 'replies', 'mentioned_users']
    
    def get_has_upvoted(self, obj):
        """Check if request user has upvoted the comment"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.upvotes.filter(user=request.user).exists()
        return False
    
    def get_replies(self, obj):
        """Get replies to this comment"""
        if not hasattr(obj, 'replies'):
            return []
        
        replies = obj.replies.all()
        serializer = CommentSerializer(
            replies, many=True, context=self.context
        )
        return serializer.data

class DiscussionSerializer(serializers.ModelSerializer):
    """Serializer for Discussion model"""
    author = UserSerializer(read_only=True)
    tags = serializers.SlugRelatedField(
        many=True,
        slug_field='name',
        queryset=Tag.objects.all()
    )
    upvotes = serializers.IntegerField(source='upvotes.count', read_only=True)
    comment_count = serializers.IntegerField(read_only=True)
    has_upvoted = serializers.SerializerMethodField()
    attachments = AttachmentSerializer(many=True, read_only=True)
    
    class Meta:
        model = Discussion
        fields = ['id', 'title', 'content', 'author', 'created_at', 'updated_at', 
                  'tags', 'upvotes', 'comment_count', 'has_upvoted', 'attachments']
    
    def get_has_upvoted(self, obj):
        """Check if request user has upvoted the discussion"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.upvotes.filter(user=request.user).exists()
        return False
    
    def create(self, validated_data):
        tags_data = validated_data.pop('tags')
        discussion = Discussion.objects.create(
            author=self.context['request'].user,
            **validated_data
        )
        
        # Process tags
        for tag_name in tags_data:
            tag, _ = Tag.objects.get_or_create(name=tag_name)
            discussion.tags.add(tag)
            
        return discussion

class UpvoteSerializer(serializers.ModelSerializer):
    """Serializer for Upvote model"""
    class Meta:
        model = Upvote
        fields = ['id', 'user', 'discussion', 'comment', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

class FileUploadSerializer(serializers.Serializer):
    """Serializer for file uploads"""
    file = serializers.FileField()
    
    def create(self, validated_data):
        file = validated_data['file']
        request = self.context.get('request')
        
        attachment = Attachment.objects.create(
            name=file.name,
            file=file,
            size=file.size,
            type=file.content_type,
            discussion=validated_data.get('discussion')
        )
        
        return attachment
