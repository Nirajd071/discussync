
import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ArrowUp, Reply, Edit, Trash, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Comment } from '@/types';
import UserAvatar from './UserAvatar';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import CommentForm from './CommentForm';
import ReportContentDialog from './ReportContentDialog';

interface CommentCardProps {
  comment: Comment;
  discussionId: string;
  level?: number;
  isDiscussionCreator?: boolean;
  onReply?: (comment: Comment) => void;
  onUpdate?: (comment: Comment) => void;
  onDelete?: (commentId: string) => void;
  onUpvote?: (id: string, newUpvotes: number, hasUpvoted: boolean) => void;
}

const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  discussionId,
  level = 0,
  isDiscussionCreator = false,
  onReply,
  onUpdate,
  onDelete,
  onUpvote
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const isAuthor = user?.id === comment.author.id;
  const canDelete = isAuthor || isDiscussionCreator;
  const maxLevel = 3; // Maximum nesting level

  const handleUpvote = async () => {
    try {
      console.log(`Handling upvote for comment/reply with ID: ${comment.id}`);

      let upvoteResult;

      // Check if this is a reply or a top-level comment
      if (comment.parentId) {
        // This is a reply
        console.log(`This is a reply to comment ID: ${comment.parentId}`);
        upvoteResult = await api.upvoteReply(comment.parentId, comment.id);
      } else {
        // This is a top-level comment
        console.log(`This is a top-level comment in discussion: ${discussionId}`);
        upvoteResult = await api.upvoteComment(comment.id);
      }

      const { upvotes, hasUpvoted } = upvoteResult;

      if (onUpvote) {
        onUpvote(comment.id, upvotes, hasUpvoted);
      }

      toast({
        title: hasUpvoted ? 'Upvoted' : 'Upvote removed',
        description: hasUpvoted
          ? `You upvoted this ${comment.parentId ? 'reply' : 'comment'}`
          : `You removed your upvote from this ${comment.parentId ? 'reply' : 'comment'}`,
        variant: 'default',
      });
    } catch (error) {
      console.error('Error upvoting comment/reply:', error);
      toast({
        title: 'Error',
        description: error.message || `Failed to upvote ${comment.parentId ? 'reply' : 'comment'}`,
        variant: 'destructive',
      });
    }
  };

  const handleReplySubmit = async (content: string) => {
    try {
      console.log(`Submitting reply to comment ${comment.id} with content: ${content.substring(0, 20)}...`);

      // Add debug info to the content to help identify replies
      const replyContent = `Reply to @${comment.author.username}: ${content}`;

      console.log('Comment ID for reply:', comment.id);
      console.log('Discussion ID for reply:', discussionId);

      // Make sure we have a valid comment ID
      if (!comment.id) {
        console.error('Cannot reply: Comment ID is missing');
        toast({
          title: 'Error',
          description: 'Cannot reply to this comment. Missing comment ID.',
          variant: 'destructive',
        });
        return;
      }

      // Use the new dedicated reply API
      const newReply = await api.createReply(comment.id, {
        content: replyContent
      });

      console.log('Reply created successfully:', newReply);

      // Update the local state to show the new reply immediately
      if (level === 0) {
        // If this is a top-level comment, use the onReply callback
        if (onReply) {
          onReply(newReply);
        }
      } else {
        // If this is a nested reply, update the comment's replies directly
        comment.replies = [...(comment.replies || []), newReply];
      }

      setIsReplying(false);

      toast({
        title: 'Reply added',
        description: 'Your reply has been posted successfully',
      });
    } catch (error) {
      console.error('Error posting reply:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to post reply. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateSubmit = async (content: string) => {
    try {
      // In a real app, this would call an API to update the comment
      const updatedComment = { ...comment, content, updatedAt: new Date() };

      if (onUpdate) {
        onUpdate(updatedComment);
      }

      setIsEditing(false);

      toast({
        title: 'Comment updated',
        description: 'Your comment has been updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update comment',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    try {
      console.log(`Deleting comment/reply with ID: ${comment.id}`);

      // Check if this is a reply or a top-level comment
      if (comment.parentId) {
        // This is a reply
        console.log(`This is a reply to comment ID: ${comment.parentId}`);
        await api.deleteReply(comment.parentId, comment.id);
      } else {
        // This is a top-level comment
        console.log(`This is a top-level comment in discussion: ${discussionId}`);
        await api.deleteComment(discussionId, comment.id);
      }

      // Notify parent component
      if (onDelete) {
        onDelete(comment.id);
      }

      toast({
        title: comment.parentId ? 'Reply deleted' : 'Comment deleted',
        description: `Your ${comment.parentId ? 'reply' : 'comment'} has been deleted successfully`,
      });
    } catch (error) {
      console.error('Error deleting comment/reply:', error);
      toast({
        title: 'Error',
        description: error.message || `Failed to delete ${comment.parentId ? 'reply' : 'comment'}`,
        variant: 'destructive',
      });
    }
  };

  // Process content to highlight mentioned users
  const processContent = (content: string) => {
    if (!comment.mentionedUsers || comment.mentionedUsers.length === 0) {
      return content;
    }

    let processedContent = content;
    comment.mentionedUsers.forEach(username => {
      processedContent = processedContent.replace(
        new RegExp(`@${username}`, 'g'),
        `<span class="text-forum-primary font-medium">@${username}</span>`
      );
    });

    return processedContent;
  };

  return (
    <div className="mb-4">
      <div className={`p-4 rounded-lg border ${level > 0 ? 'bg-background' : 'bg-card'}`}>
        <div className="flex items-start space-x-3">
          <UserAvatar user={comment.author} size="md" avatarOnly />

          <div className="flex-1 min-w-0">
            <div className="flex items-center mb-1">
              <span className="font-medium text-sm">{comment.author.name}</span>
              <span className="text-xs text-muted-foreground ml-1">@{comment.author.username}</span>
              <span className="text-xs text-muted-foreground mx-1">•</span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
              </span>
              {comment.updatedAt && (
                <span className="text-xs text-muted-foreground ml-1">(edited)</span>
              )}
            </div>

            {isEditing ? (
              <CommentForm
                initialValue={comment.content}
                onSubmit={handleUpdateSubmit}
                onCancel={() => setIsEditing(false)}
                buttonText="Update"
              />
            ) : (
              <>
                {/* Debug info */}
                <div className="text-xs text-muted-foreground mb-1">
                  Comment ID: {comment.id.substring(0, 8)}...
                </div>
                <div
                  className="text-sm prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: processContent(comment.content || 'No content') }}
                />
              </>
            )}
          </div>

          <div className="flex flex-col items-center space-y-1 ml-2">
            <Button
              variant={comment.hasUpvoted ? "default" : "outline"}
              size="icon"
              className={`h-7 w-7 rounded-full ${
                comment.hasUpvoted
                  ? "bg-forum-primary hover:bg-forum-primary/90"
                  : "hover:bg-muted"
              }`}
              onClick={handleUpvote}
            >
              <ArrowUp className="h-3 w-3" />
            </Button>
            <span className="text-xs font-medium">{comment.upvotes}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 mt-3 ml-10">
          {level < maxLevel && (
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs bg-primary/5 hover:bg-primary/10 border-primary/20"
              onClick={() => setIsReplying(!isReplying)}
            >
              <Reply className="mr-1 h-3 w-3" />
              Reply to this comment
            </Button>
          )}

          {!isAuthor && (
            <ReportContentDialog
              contentType="comment"
              contentId={comment.id}
              trigger={
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-muted-foreground hover:text-destructive"
                >
                  <Flag className="mr-1 h-3 w-3" />
                  Report
                </Button>
              }
            />
          )}

          {/* Edit button - only for author */}
          {isAuthor && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="mr-1 h-3 w-3" />
              Edit
            </Button>
          )}

          {/* Delete button - for author or discussion creator */}
          {canDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-destructive hover:text-destructive"
              onClick={handleDelete}
            >
              <Trash className="mr-1 h-3 w-3" />
              Delete
            </Button>
          )}
        </div>

        {isReplying && (
          <div className="mt-4 ml-10">
            <CommentForm
              onSubmit={handleReplySubmit}
              onCancel={() => setIsReplying(false)}
              buttonText="Reply"
              placeholder={`Reply to ${comment.author.name}...`}
            />
          </div>
        )}
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 ml-8 border-l-2 border-primary/20 pl-4 bg-muted/10 rounded-r-md">
          <div className="text-xs font-medium text-primary mb-2 pt-2">
            {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'} to this comment
          </div>
          {comment.replies.map((reply) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              discussionId={discussionId}
              level={level + 1}
              isDiscussionCreator={isDiscussionCreator}
              onReply={onReply}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onUpvote={onUpvote}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentCard;
