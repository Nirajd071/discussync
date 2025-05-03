
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, MessageSquare, Paperclip, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Discussion } from '@/types';
import UserAvatar from './UserAvatar';
import TagBadge from './TagBadge';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { formatRelativeTime } from '@/utils/dateUtils';

interface DiscussionCardProps {
  discussion: Discussion;
  onUpvote?: (id: string, newUpvotes: number, hasUpvoted: boolean) => void;
  onDelete?: (id: string) => void;
  showDeleteButton?: boolean;
}

const DiscussionCard: React.FC<DiscussionCardProps> = ({
  discussion,
  onUpvote,
  onDelete,
  showDeleteButton = false
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const isAuthor = user?.id === discussion.author.id;

  // Track local upvote state for immediate feedback
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [localUpvoteCount, setLocalUpvoteCount] = useState(discussion.upvote_count || discussion.upvotes || 0);
  const [localHasUpvoted, setLocalHasUpvoted] = useState(discussion.hasUpvoted || discussion.has_upvoted || false);

  const handleUpvote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Prevent multiple rapid clicks
    if (isUpvoting) return;

    try {
      setIsUpvoting(true);

      // Optimistically update UI
      const newHasUpvoted = !localHasUpvoted;
      const newUpvoteCount = localHasUpvoted ? localUpvoteCount - 1 : localUpvoteCount + 1;

      setLocalHasUpvoted(newHasUpvoted);
      setLocalUpvoteCount(newUpvoteCount);

      // Make API call
      const { upvotes, hasUpvoted } = await api.upvoteDiscussion(discussion.id);

      // Update with actual server response
      setLocalUpvoteCount(upvotes);
      setLocalHasUpvoted(hasUpvoted);

      if (onUpvote) {
        onUpvote(discussion.id, upvotes, hasUpvoted);
      }
    } catch (error) {
      // Revert to original state on error
      setLocalHasUpvoted(discussion.hasUpvoted || discussion.has_upvoted || false);
      setLocalUpvoteCount(discussion.upvote_count || discussion.upvotes || 0);

      toast({
        title: 'Error',
        description: 'Failed to upvote discussion',
        variant: 'destructive',
      });
    } finally {
      setIsUpvoting(false);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (onDelete) {
      onDelete(discussion.id);
    }
  };

  return (
    <Card className="forum-card overflow-hidden hover:border-muted transition-all">
      <Link to={`/discussions/${discussion.id}`}>
        <CardContent className="p-4">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold line-clamp-1 mb-1">
                {discussion.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {discussion.content}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {discussion.tags && discussion.tags.map(tag => (
                  <TagBadge
                    key={typeof tag === 'string' ? tag : tag.name}
                    tag={typeof tag === 'string' ? tag : tag.name}
                    size="sm"
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center space-y-1">
              <Button
                variant={localHasUpvoted ? "default" : "outline"}
                size="icon"
                className={`h-8 w-8 rounded-full ${
                  localHasUpvoted
                    ? "bg-forum-primary hover:bg-forum-primary/90"
                    : "hover:bg-muted"
                }`}
                onClick={handleUpvote}
                disabled={isUpvoting}
              >
                <ArrowUp className={`h-4 w-4 ${isUpvoting ? 'animate-pulse' : ''}`} />
              </Button>
              <span className="text-xs font-medium">{localUpvoteCount}</span>
            </div>
          </div>
        </CardContent>
      </Link>

      <CardFooter className="p-4 pt-0 border-t flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center">
          <UserAvatar user={discussion.author} size="sm" />
          <span className="ml-2">
            <Link
              to={`/users/${discussion.author.username}`}
              className="text-xs font-medium hover:underline hover:text-foreground"
              onClick={(e) => e.stopPropagation()}
            >
              {discussion.author.name ||
                (discussion.author.first_name && discussion.author.last_name ?
                  `${discussion.author.first_name} ${discussion.author.last_name}` :
                  (discussion.author.first_name || discussion.author.username))}
            </Link>
            <span className="text-xs"> · </span>
            <span className="text-xs">
              {formatRelativeTime(discussion.createdAt || discussion.created_at)}
            </span>
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {discussion.attachments && discussion.attachments.length > 0 && (
            <div className="flex items-center text-xs">
              <Paperclip className="mr-1 h-3 w-3" />
              <span>{discussion.attachments.length}</span>
            </div>
          )}

          <div className="flex items-center text-xs">
            <MessageSquare className="mr-1 h-3 w-3" />
            <span>{discussion.comment_count || 0}</span>
          </div>

          {showDeleteButton && isAuthor && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={handleDelete}
              title="Delete discussion"
            >
              <Trash className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default DiscussionCard;
