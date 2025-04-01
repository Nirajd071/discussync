
from django.urls import path, include
from rest_framework_nested import routers
from .views import TagViewSet, DiscussionViewSet, CommentViewSet, FileUploadViewSet

router = routers.DefaultRouter()
router.register(r'tags', TagViewSet)
router.register(r'', DiscussionViewSet, basename='discussion')

# Nested routes for comments
discussion_router = routers.NestedSimpleRouter(router, r'', lookup='discussion')
discussion_router.register(r'comments', CommentViewSet, basename='discussion-comments')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(discussion_router.urls)),
    path('files/upload/', FileUploadViewSet.as_view({'post': 'create'}), name='file-upload'),
]
