
from django.contrib import admin
from .models import Tag, Discussion, Comment, Upvote, Attachment

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)

@admin.register(Discussion)
class DiscussionAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'created_at')
    list_filter = ('created_at', 'tags')
    search_fields = ('title', 'content', 'author__username')
    date_hierarchy = 'created_at'

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('author', 'discussion', 'created_at', 'parent')
    list_filter = ('created_at',)
    search_fields = ('content', 'author__username', 'discussion__title')
    date_hierarchy = 'created_at'

@admin.register(Upvote)
class UpvoteAdmin(admin.ModelAdmin):
    list_display = ('user', 'get_target', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username',)
    
    def get_target(self, obj):
        if obj.discussion:
            return f"Discussion: {obj.discussion.title}"
        elif obj.comment:
            return f"Comment: {obj.comment.id}"
        return "Unknown"
    get_target.short_description = "Target"

@admin.register(Attachment)
class AttachmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'discussion', 'size', 'type', 'uploaded_at')
    list_filter = ('uploaded_at', 'type')
    search_fields = ('name', 'discussion__title')
