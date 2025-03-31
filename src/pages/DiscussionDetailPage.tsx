
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { 
  ChevronLeft, 
  ArrowUp, 
  MessageSquare, 
  Share2,
  Paperclip
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import MainLayout from '@/components/Layout/MainLayout';
import UserAvatar from '@/components/UserAvatar';
import TagBadge from '@/components/TagBadge';
import CommentCard from '@/components/CommentCard';
import CommentForm from '@/components/CommentForm';
import { api } from '@/lib/api';
import { Discussion, Comment, Attachment } from '@/types';
import { useToast } from '@/hooks/use-toast';
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
  const [selectedAttachment, setSelectedAttachment] = useState<Attachment | null>(null);

  useEffect(() => {
    const loadDiscussion = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        
        // Load discussion details
        const discussionData = await api.getDiscussionById(id);
        if (discussionData) {
          setDiscussion(discussionData);
        }
        
        // Load comments
        const commentsData = await api.getCommentsByDiscussionId(id);
        setComments(commentsData);
        
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load discussion details',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDiscussion();
  }, [id, toast]);

  const handleSubmitComment = async (content: string) => {
    if (!id) return;
    
    try {
      const newComment = await api.createComment(id, { content });
      
      // Add the new comment to the list
      setComments(prev => [newComment, ...prev]);
      
      // Update comment count
      if (discussion) {
        setDiscussion({
          ...discussion,
          commentCount: discussion.commentCount + 1
        });
      }
      
      toast({
        title: 'Comment added',
        description: 'Your comment has been posted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to post comment',
        variant: 'destructive',
      });
    }
  };

  const handleReply = (newComment: Comment) => {
    // Find the parent comment and add the reply
    setComments(prev => {
      return prev.map(comment => {
        if (comment.id === newComment.parentId) {
          const replies = comment.replies || [];
          return {
            ...comment,
            replies: [...replies, newComment]
          };
        }
        return comment;
      });
    });
    
    // Update comment count
    if (discussion) {
      setDiscussion({
        ...discussion,
        commentCount: discussion.commentCount + 1
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
    // First try to find in top-level comments
    let isTopLevel = false;
    
    const filteredComments = comments.filter(comment => {
      if (comment.id === commentId) {
        isTopLevel = true;
        return false;
      }
      return true;
    });
    
    if (isTopLevel) {
      setComments(filteredComments);
    } else {
      // Search in replies
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
        commentCount: discussion.commentCount - 1
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

  const handleUpvoteDiscussion = async () => {
    if (!discussion) return;
    
    try {
      const { upvotes, hasUpvoted } = await api.upvoteDiscussion(discussion.id);
      
      setDiscussion({
        ...discussion,
        upvotes,
        hasUpvoted
      });
      
      toast({
        title: hasUpvoted ? 'Upvoted' : 'Upvote removed',
        description: hasUpvoted 
          ? 'You upvoted this discussion' 
          : 'You removed your upvote from this discussion',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update upvote',
        variant: 'destructive',
      });
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
        <div className="space-y-4">
          <div className="h-8 bg-muted rounded w-1/4 animate-pulse"></div>
          <div className="h-10 bg-muted rounded w-3/4 animate-pulse"></div>
          <div className="h-6 bg-muted rounded w-1/2 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-2/3 animate-pulse"></div>
        </div>
      </MainLayout>
    );
  }

  if (!discussion) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Discussion not found</h2>
          <p className="text-muted-foreground mb-6">
            The discussion you're looking for might have been removed or doesn't exist.
          </p>
          <Button asChild>
            <Link to="/discussions">
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to discussions
            </Link>
          </Button>
        </div>
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
                >
                  <ArrowUp className="h-4 w-4" />
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
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1.5 mb-4">
              {discussion.tags.map(tag => (
                <TagBadge key={tag} tag={tag} />
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
                  Posted {formatDistanceToNow(discussion.createdAt, { addSuffix: true })}
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
            <h2 className="text-xl font-bold mb-6">Comments ({discussion.commentCount})</h2>
            
            <div className="mb-6">
              <CommentForm onSubmit={handleSubmitComment} />
            </div>
            
            <Separator className="my-6" />
            
            {comments.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-40" />
                <h3 className="text-lg font-medium mb-1">No comments yet</h3>
                <p className="text-muted-foreground">Be the first to comment on this discussion</p>
              </div>
            ) : (
              <div className="space-y-6">
                {comments.map(comment => (
                  <CommentCard 
                    key={comment.id} 
                    comment={comment}
                    discussionId={discussion.id}
                    onReply={handleReply}
                    onUpdate={handleUpdateComment}
                    onDelete={handleDeleteComment}
                    onUpvote={handleUpvoteComment}
                  />
                ))}
              </div>
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
                  {formatDistanceToNow(discussion.createdAt, { addSuffix: true })}
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
              {discussion.tags.map(tag => (
                <TagBadge key={tag} tag={tag} />
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
