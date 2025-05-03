
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { formatRelativeTime, formatDateTime } from '@/utils/dateUtils';
import {
  ChevronLeft,
  ArrowUp,
  MessageSquare,
  Share2,
  Paperclip,
  AlertCircle,
  Flag
} from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import MainLayout from '@/components/Layout/MainLayout';
import UserAvatar from '@/components/UserAvatar';
import TagBadge from '@/components/TagBadge';
import CommentCard from '@/components/CommentCard';
import CommentForm from '@/components/CommentForm';
import ReportContentDialog from '@/components/ReportContentDialog';
import { api } from '@/lib/api';
import { analytics } from '@/lib/analytics';
import { Discussion, Comment, Attachment } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const DiscussionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedAttachment, setSelectedAttachment] = useState<Attachment | null>(null);

  // Function to load comments separately
  const loadComments = async (discussionId: string) => {
    if (!discussionId) return;

    try {
      console.log(`Loading comments for discussion ID: ${discussionId} (separate function)`);
      const commentsData = await api.getCommentsByDiscussionId(discussionId);

      if (commentsData && Array.isArray(commentsData)) {
        console.log(`Successfully loaded ${commentsData.length} comments in separate function`);

        // Log each comment for debugging
        commentsData.forEach((comment, index) => {
          console.log(`Comment ${index + 1}:`, {
            id: comment.id,
            content: comment.content?.substring(0, 20) + '...',
            hasReplies: comment.replies && comment.replies.length > 0,
            replyCount: comment.replies?.length || 0
          });
        });

        setComments(commentsData);
      } else {
        console.warn('Comments data is not an array or is empty:', commentsData);
        setComments([]);
      }
    } catch (error) {
      console.error('Error loading comments in separate function:', error);
      setComments([]);
    }
  };

  useEffect(() => {
    const loadDiscussion = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        console.log(`Loading discussion with ID: ${id}`);

        // Load discussion details
        try {
          const discussionData = await api.getDiscussionById(id);
          console.log('Discussion data received:', discussionData);

          if (discussionData) {
            setDiscussion(discussionData);

            // Track discussion view
            analytics.trackDiscussionView(id, user?.id);

            // Load comments separately after a short delay to ensure discussion is set
            setTimeout(() => {
              loadComments(id);
            }, 100);
          } else {
            console.error('Discussion not found');
            // Discussion is null, will show the "not found" UI
          }
        } catch (discussionError) {
          console.error('Error loading discussion:', discussionError);

          // Check if it's a 404 error
          if (discussionError.message && (discussionError.message.includes('404') || discussionError.message.includes('not found'))) {
            // Discussion not found - we'll show the "not found" UI
          } else {
            // Other error
            toast({
              title: 'Error',
              description: 'Failed to load discussion details. Please try again.',
              variant: 'destructive',
            });
          }
        }
      } catch (error) {
        console.error('Unexpected error in loadDiscussion:', error);
        toast({
          title: 'Error',
          description: 'An unexpected error occurred. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDiscussion();

    // Load comments once initially
    if (id) {
      loadComments(id);
    }

    return () => {
      // Cleanup function
    };
  }, [id, toast, user?.id]);

  const handleSubmitComment = async (content: string) => {
    if (!id) return;

    try {
      console.log(`Submitting comment for discussion ID: ${id}`);

      // Check if user is authenticated
      if (!user) {
        console.log('User not authenticated, showing error');
        toast({
          title: 'Authentication required',
          description: 'You need to be logged in to post a comment',
          variant: 'destructive',
        });
        return;
      }

      try {
        const newComment = await api.createComment(id, { content });
        console.log('Comment created successfully:', newComment);

        // Refresh all comments instead of just adding the new one
        // This ensures we get the latest state from the server
        loadComments(id);

        // Update comment count
        if (discussion) {
          setDiscussion({
            ...discussion,
            commentCount: (discussion.commentCount || 0) + 1,
            comment_count: (discussion.comment_count || 0) + 1
          });
        }

        // Track comment creation
        analytics.trackCommentCreate(newComment.id, id, user?.id);

        toast({
          title: 'Comment added',
          description: 'Your comment has been posted successfully',
        });
      } catch (apiError) {
        console.error('API error creating comment:', apiError);

        // Handle authentication errors
        if (apiError.message && apiError.message.includes('Authentication')) {
          toast({
            title: 'Authentication required',
            description: 'Your session has expired. Please log in again to post a comment.',
            variant: 'destructive',
          });
          return;
        }

        // Handle other API errors
        toast({
          title: 'Error',
          description: apiError.message || 'Failed to post comment. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Unexpected error creating comment:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleReply = async (newReply: Comment) => {
    console.log('Handling reply:', newReply);

    // Get the parent comment ID
    const parentId = newReply.parentId;
    if (!parentId) {
      console.error('Reply has no parent ID:', newReply);
      return;
    }

    // Find the parent comment (could be a top-level comment or a nested reply)
    // We need to search recursively through all comments and their replies
    const findAndUpdateComment = (commentsList: Comment[]): Comment[] => {
      return commentsList.map(comment => {
        if (comment.id === parentId) {
          // This is the parent comment, add the reply
          const updatedReplies = [...(comment.replies || []), newReply];
          return {
            ...comment,
            replies: updatedReplies
          };
        } else if (comment.replies && comment.replies.length > 0) {
          // Check if the parent is in the replies
          return {
            ...comment,
            replies: findAndUpdateComment(comment.replies)
          };
        }
        return comment;
      });
    };

    // Update the comments state with the new reply
    const updatedComments = findAndUpdateComment(comments);
    setComments(updatedComments);

    // Update comment count
    if (discussion) {
      setDiscussion({
        ...discussion,
        commentCount: (discussion.commentCount || 0) + 1,
        comment_count: (discussion.comment_count || 0) + 1
      });
    }
  };

  const handleUpdateComment = (updatedComment: Comment) => {
    setComments(prev => {
      return prev.map(comment => {
        if (comment.id === updatedComment.id) {
          return updatedComment;
        } else if (comment.replies) {
          const updatedReplies = comment.replies.map(reply =>
            reply.id === updatedComment.id ? updatedComment : reply
          );
          return { ...comment, replies: updatedReplies };
        }
        return comment;
      });
    });
  };

  const handleDeleteComment = (commentId: string) => {
    console.log(`Handling deletion of comment/reply with ID: ${commentId}`);

    // First try to find in top-level comments
    let isTopLevel = false;
    let parentCommentId = null;

    // Check if it's a top-level comment
    const topLevelComment = comments.find(comment => comment.id === commentId);
    if (topLevelComment) {
      isTopLevel = true;
    } else {
      // Find which comment contains this reply
      for (const comment of comments) {
        if (comment.replies && comment.replies.some(reply => reply.id === commentId)) {
          parentCommentId = comment.id;
          break;
        }
      }
    }

    console.log(`Comment ${commentId} is ${isTopLevel ? 'top-level' : 'a reply'}`);
    if (parentCommentId) {
      console.log(`Parent comment ID: ${parentCommentId}`);
    }

    // Remove from state
    if (isTopLevel) {
      // Filter out the top-level comment
      setComments(comments.filter(comment => comment.id !== commentId));
    } else {
      // Filter out the reply from its parent comment
      const updatedComments = comments.map(comment => {
        if (comment.replies) {
          return {
            ...comment,
            replies: comment.replies.filter(reply => reply.id !== commentId)
          };
        }
        return comment;
      });

      setComments(updatedComments);
    }

    // Update comment count
    if (discussion) {
      setDiscussion({
        ...discussion,
        commentCount: Math.max(0, (discussion.commentCount || 0) - 1),
        comment_count: Math.max(0, (discussion.comment_count || 0) - 1)
      });
    }
  };

  const handleUpvoteComment = (id: string, newUpvotes: number, hasUpvoted: boolean) => {
    setComments(prev => {
      return prev.map(comment => {
        if (comment.id === id) {
          return { ...comment, upvotes: newUpvotes, hasUpvoted };
        } else if (comment.replies) {
          const updatedReplies = comment.replies.map(reply =>
            reply.id === id ? { ...reply, upvotes: newUpvotes, hasUpvoted } : reply
          );
          return { ...comment, replies: updatedReplies };
        }
        return comment;
      });
    });
  };

  const [isUpvoting, setIsUpvoting] = useState(false);

  const handleUpvoteDiscussion = async () => {
    if (!discussion) return;

    // Prevent multiple rapid clicks
    if (isUpvoting) return;

    try {
      setIsUpvoting(true);

      // Optimistically update UI
      const newHasUpvoted = !discussion.hasUpvoted;
      const newUpvoteCount = discussion.hasUpvoted ? (discussion.upvotes || 0) - 1 : (discussion.upvotes || 0) + 1;

      setDiscussion({
        ...discussion,
        upvotes: newUpvoteCount,
        hasUpvoted: newHasUpvoted
      });

      // Make API call
      const { upvotes, hasUpvoted } = await api.upvoteDiscussion(discussion.id);

      // Update with actual server response
      setDiscussion({
        ...discussion,
        upvotes,
        hasUpvoted
      });

      // Track upvote event
      if (hasUpvoted) {
        analytics.trackUpvote(discussion.id, 'discussion', user?.id);
      }

      toast({
        title: hasUpvoted ? 'Upvoted' : 'Upvote removed',
        description: hasUpvoted
          ? 'You upvoted this discussion'
          : 'You removed your upvote from this discussion',
      });
    } catch (error) {
      // Revert to original state on error
      toast({
        title: 'Error',
        description: 'Failed to update upvote',
        variant: 'destructive',
      });
    } finally {
      setIsUpvoting(false);
    }
  };

  const handleShareDiscussion = () => {
    navigator.clipboard.writeText(window.location.href);

    toast({
      title: 'Link copied',
      description: 'Discussion link copied to clipboard',
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getFileType = (type: string) => {
    if (type.startsWith('image/')) return 'Image';
    if (type.includes('pdf')) return 'PDF';
    if (type.includes('zip') || type.includes('archive')) return 'Archive';
    if (type.includes('word') || type.includes('document')) return 'Document';
    return 'File';
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="lg" text="Loading discussion..." />
        </div>
      </MainLayout>
    );
  }

  if (!discussion) {
    return (
      <MainLayout>
        <EmptyState
          icon={<AlertCircle className="h-12 w-12" />}
          title="Discussion not found"
          description="The discussion you're looking for might have been removed or doesn't exist."
          actionLabel="Back to discussions"
          onAction={() => window.location.href = '/discussions'}
          className="py-20"
        />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/discussions">
            <ChevronLeft className="mr-1 h-4 w-4" /> Back to discussions
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3 space-y-6">
          {/* Discussion Header */}
          <div className="bg-card rounded-lg border p-6">
            <div className="flex justify-between">
              <h1 className="text-2xl font-bold mb-3">{discussion.title}</h1>

              <div className="flex items-start space-x-2">
                <Button
                  variant={discussion.hasUpvoted ? "default" : "outline"}
                  size="sm"
                  className={`h-8 w-8 rounded-full p-0 ${
                    discussion.hasUpvoted
                      ? "bg-forum-primary hover:bg-forum-primary/90"
                      : "hover:bg-muted"
                  }`}
                  onClick={handleUpvoteDiscussion}
                  disabled={isUpvoting}
                >
                  <ArrowUp className={`h-4 w-4 ${isUpvoting ? 'animate-pulse' : ''}`} />
                </Button>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 rounded-full p-0"
                        onClick={handleShareDiscussion}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Share discussion</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <ReportContentDialog
                        contentType="discussion"
                        contentId={discussion.id}
                        trigger={
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 rounded-full p-0 text-muted-foreground hover:text-destructive"
                          >
                            <Flag className="h-4 w-4" />
                          </Button>
                        }
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Report discussion</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {discussion.tags && discussion.tags.map(tag => (
                <TagBadge
                  key={typeof tag === 'string' ? tag : tag.name}
                  tag={typeof tag === 'string' ? tag : tag.name}
                />
              ))}
            </div>

            <p className="text-muted-foreground mb-6">{discussion.content}</p>

            {discussion.attachments && discussion.attachments.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <Paperclip className="mr-1 h-4 w-4" /> Attachments
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {discussion.attachments.map(attachment => (
                    <div
                      key={attachment.id}
                      className="border rounded-md p-3 flex items-center justify-between cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelectedAttachment(attachment)}
                    >
                      <div className="flex items-center">
                        <Paperclip className="h-4 w-4 text-muted-foreground mr-2" />
                        <div>
                          <p className="text-sm font-medium">{attachment.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {getFileType(attachment.type)} • {formatFileSize(attachment.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7"
                      >
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <UserAvatar user={discussion.author} size="sm" showName />
                <span className="text-xs text-muted-foreground ml-2">
                  Posted {formatRelativeTime(discussion.createdAt || discussion.created_at)}
                </span>
              </div>

              <div className="flex items-center">
                <div className="flex items-center text-muted-foreground">
                  <ArrowUp className="mr-1 h-4 w-4" />
                  <span>{discussion.upvotes}</span>
                </div>
                <div className="ml-4 flex items-center text-muted-foreground">
                  <MessageSquare className="mr-1 h-4 w-4" />
                  <span>{discussion.commentCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-card rounded-lg border p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                Comments ({discussion.commentCount})
                {/* Debug info */}
                <span className="text-xs text-muted-foreground ml-2">
                  (Loaded: {comments ? comments.length : 0})
                </span>
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadComments(id || '')}
                className="flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </Button>
            </div>

            <div className="mb-6">
              <CommentForm onSubmit={handleSubmitComment} />
            </div>

            <Separator className="my-6" />

            {/* Debug info */}
            <div className="text-xs text-muted-foreground mb-4 p-2 bg-muted/30 rounded">
              Debug: Comments array is {comments ? `defined with length ${comments.length}` : 'undefined'}.
              Discussion has {discussion.commentCount} comments according to the database.
            </div>

            {comments && comments.length > 0 ? (
              <div className="space-y-6">
                {comments.map(comment => (
                  <CommentCard
                    key={comment.id}
                    comment={comment}
                    discussionId={discussion.id}
                    isDiscussionCreator={user?.id === discussion.author.id}
                    onReply={handleReply}
                    onUpdate={handleUpdateComment}
                    onDelete={handleDeleteComment}
                    onUpvote={handleUpvoteComment}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<MessageSquare className="h-12 w-12" />}
                title="No comments yet"
                description="Be the first to comment on this discussion"
                className="py-8"
              />
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-card rounded-lg border p-4">
            <h3 className="font-medium mb-4">Discussion Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Posted</span>
                <span className="text-sm font-medium">
                  {formatDateTime(discussion.createdAt || discussion.created_at)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Upvotes</span>
                <span className="text-sm font-medium">{discussion.upvotes}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Comments</span>
                <span className="text-sm font-medium">{discussion.commentCount}</span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-4">
            <h3 className="font-medium mb-4">About the Author</h3>
            <div className="flex flex-col items-center text-center">
              <UserAvatar user={discussion.author} size="lg" avatarOnly />
              <h4 className="font-medium mt-2">{discussion.author.name}</h4>
              <p className="text-sm text-muted-foreground mb-2">@{discussion.author.username}</p>
              {discussion.author.bio && (
                <p className="text-sm">{discussion.author.bio}</p>
              )}
              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-full"
                asChild
              >
                <Link to={`/users/${discussion.author.username}`}>
                  View Profile
                </Link>
              </Button>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-4">
            <h3 className="font-medium mb-4">Related Tags</h3>
            <div className="flex flex-wrap gap-2">
              {discussion.tags && discussion.tags.map(tag => (
                <TagBadge
                  key={typeof tag === 'string' ? tag : tag.name}
                  tag={typeof tag === 'string' ? tag : tag.name}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Attachment Preview Dialog */}
      {selectedAttachment && (
        <Dialog open={!!selectedAttachment} onOpenChange={() => setSelectedAttachment(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Paperclip className="h-4 w-4 mr-2" />
                {selectedAttachment.name}
              </DialogTitle>
            </DialogHeader>

            <div className="py-4">
              {selectedAttachment.type.startsWith('image/') ? (
                <img
                  src={selectedAttachment.url}
                  alt={selectedAttachment.name}
                  className="max-h-[70vh] mx-auto object-contain rounded-md"
                />
              ) : (
                <div className="text-center p-8 border rounded-md">
                  <Paperclip className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium mb-1">{selectedAttachment.name}</h3>
                  <p className="text-muted-foreground mb-4">
                    {getFileType(selectedAttachment.type)} • {formatFileSize(selectedAttachment.size)}
                  </p>
                  <Button asChild>
                    <a
                      href={selectedAttachment.url}
                      download={selectedAttachment.name}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download File
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </MainLayout>
  );
};

export default DiscussionDetailPage;
