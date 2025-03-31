
import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ArrowUp, Reply, Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Comment } from '@/types';
import UserAvatar from './UserAvatar';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import CommentForm from './CommentForm';

interface CommentCardProps {
  comment: Comment;
  discussionId: string;
  level?: number;
  onReply?: (comment: Comment) => void;
  onUpdate?: (comment: Comment) => void;
  onDelete?: (commentId: string) => void;
  onUpvote?: (id: string, newUpvotes: number, hasUpvoted: boolean) => void;
}

const CommentCard: React.FC<CommentCardProps> = ({ 
  comment, 
  discussionId,
  level = 0,
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
  const maxLevel = 3; // Maximum nesting level
  
  const handleUpvote = async () => {
    try {
      const { upvotes, hasUpvoted } = await api.upvoteComment(comment.id);
      if (onUpvote) {
        onUpvote(comment.id, upvotes, hasUpvoted);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upvote comment',
        variant: 'destructive',
      });
    }
  };

  const handleReplySubmit = async (content: string) => {
    try {
      const newComment = await api.createComment(discussionId, { 
        content,
        parentId: comment.id
      });
      
      if (onReply) {
        onReply(newComment);
      }
      
      setIsReplying(false);
      
      toast({
        title: 'Reply added',
        description: 'Your reply has been posted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to post reply',
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
      // In a real app, this would call an API to delete the comment
      if (onDelete) {
        onDelete(comment.id);
      }
      
      toast({
        title: 'Comment deleted',
        description: 'Your comment has been deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete comment',
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
              <div 
                className="text-sm prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: processContent(comment.content) }}
              />
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
              variant="ghost" 
              size="sm" 
              className="h-7 text-xs"
              onClick={() => setIsReplying(!isReplying)}
            >
              <Reply className="mr-1 h-3 w-3" />
              Reply
            </Button>
          )}
          
          {isAuthor && (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-xs"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="mr-1 h-3 w-3" />
                Edit
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-xs text-destructive hover:text-destructive"
                onClick={handleDelete}
              >
                <Trash className="mr-1 h-3 w-3" />
                Delete
              </Button>
            </>
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
        <div className={`mt-2 ml-${Math.min(level + 1, 5) * 6}`}>
          {comment.replies.map((reply) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              discussionId={discussionId}
              level={level + 1}
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
