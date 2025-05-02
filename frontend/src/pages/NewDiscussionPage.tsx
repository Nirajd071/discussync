
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, ChevronLeft, Save } from 'lucide-react';
import MainLayout from '@/components/Layout/MainLayout';
import FileUploader from '@/components/FileUploader';
import { api } from '@/lib/api';
import { Attachment } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const NewDiscussionPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // In a real app, fetch suggested tags from API
    const fetchSuggestedTags = async () => {
      try {
        const tagsData = await api.getTags();
        const tagNames = tagsData.map(tag => tag.name);
        setSuggestedTags(tagNames);
      } catch (error) {
        console.error('Failed to fetch tags:', error);
      }
    };

    fetchSuggestedTags();

    // Check for pending discussion data in sessionStorage
    const pendingDiscussion = sessionStorage.getItem('pendingDiscussion');
    if (pendingDiscussion) {
      try {
        const data = JSON.parse(pendingDiscussion);
        console.log('Restoring pending discussion data:', data);

        // Restore form data
        if (data.title) setTitle(data.title);
        if (data.content) setContent(data.content);
        if (data.tags) setTags(data.tags);
        if (data.attachments) setAttachments(data.attachments);

        // Don't remove the data yet - we'll remove it when the discussion is successfully created
      } catch (error) {
        console.error('Error restoring pending discussion data:', error);
        sessionStorage.removeItem('pendingDiscussion');
      }
    }
  }, []);

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      toast({
        title: 'Authentication required',
        description: 'You need to be logged in to create a discussion',
        variant: 'destructive',
      });
      navigate('/login');
    }
  }, [isAuthenticated, navigate, toast]);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();

      const trimmedTag = tagInput.trim();
      if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
        setTags([...tags, trimmedTag]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSuggestedTagClick = (tag: string) => {
    if (!tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
    }
  };

  const handleAttachmentUploaded = (attachment: Attachment) => {
    setAttachments(prev => [...prev, attachment]);
  };

  const handleAttachmentRemoved = (id: string) => {
    setAttachments(prev => prev.filter(attachment => attachment.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please provide both a title and content for your discussion',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Check authentication before submitting
      if (!isAuthenticated) {
        console.log('User not authenticated, redirecting to login');
        toast({
          title: 'Authentication required',
          description: 'You need to be logged in to create a discussion',
          variant: 'destructive',
        });
        // Store the current form data in sessionStorage so we can restore it after login
        sessionStorage.setItem('pendingDiscussion', JSON.stringify({
          title,
          content,
          tags,
          attachments
        }));
        navigate('/login?redirect=/new-discussion');
        return;
      }

      console.log('Submitting discussion with data:', { title, content, tags, attachments });

      try {
        const newDiscussion = await api.createDiscussion({
          title,
          content,
          tags,
          attachments
        });

        console.log('Discussion created successfully:', newDiscussion);

        toast({
          title: 'Discussion created',
          description: 'Your discussion has been posted successfully',
        });

        // Clear any stored pending discussion
        sessionStorage.removeItem('pendingDiscussion');

        // Navigate to the new discussion
        navigate(`/discussions/${newDiscussion.id}`);
      } catch (apiError) {
        console.error('API error creating discussion:', apiError);

        // Handle authentication errors
        if (apiError.message && apiError.message.includes('Authentication')) {
          console.log('Authentication error, redirecting to login');

          // Store the current form data in sessionStorage
          sessionStorage.setItem('pendingDiscussion', JSON.stringify({
            title,
            content,
            tags,
            attachments
          }));

          toast({
            title: 'Authentication required',
            description: 'Your session has expired. Please log in again.',
            variant: 'destructive',
          });

          navigate('/login?redirect=/new-discussion');
          return;
        }

        // Handle other API errors
        toast({
          title: 'Error creating discussion',
          description: apiError.message || 'Failed to create discussion. Please try again.',
          variant: 'destructive',
        });

        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Unexpected error creating discussion:', error);

      // Show generic error message
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });

      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <div onClick={() => navigate(-1)}>
            <ChevronLeft className="mr-1 h-4 w-4" /> Back
          </div>
        </Button>
        <h1 className="text-2xl font-bold">Create New Discussion</h1>
        <div className="w-24" /> {/* For alignment */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a descriptive title"
                className="text-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Describe your discussion in detail..."
                className="min-h-[200px] resize-none"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (up to 5)</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map(tag => (
                  <Badge key={tag} className="flex items-center gap-1 py-1">
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Add tags (press Enter or comma to add)"
                disabled={tags.length >= 5}
              />
              <p className="text-xs text-muted-foreground">
                Press Enter or comma to add a tag. {5 - tags.length} tags remaining.
              </p>

              {suggestedTags.length > 0 && tags.length < 5 && (
                <div className="mt-2">
                  <p className="text-xs font-medium mb-1">Suggested tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedTags
                      .filter(tag => !tags.includes(tag))
                      .slice(0, 10)
                      .map(tag => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="cursor-pointer hover:bg-secondary"
                          onClick={() => handleSuggestedTagClick(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                  </div>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full flex gap-2"
              disabled={isSubmitting || !title.trim() || !content.trim()}
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? 'Creating Discussion...' : 'Create Discussion'}
            </Button>
          </form>
        </div>

        <div className="md:col-span-1">
          <div className="bg-card rounded-lg border p-4 mb-6">
            <h3 className="font-medium mb-4">Attachments</h3>
            <FileUploader
              onFileUploaded={handleAttachmentUploaded}
              onFileRemoved={handleAttachmentRemoved}
              uploadedFiles={attachments}
            />
          </div>

          <div className="bg-card rounded-lg border p-4">
            <h3 className="font-medium mb-4">Tips for a great discussion</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <span className="font-bold text-primary">1.</span>
                <span>Be specific and clear in your title</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-primary">2.</span>
                <span>Provide all relevant details in the content</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-primary">3.</span>
                <span>Use appropriate tags to help others find your discussion</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-primary">4.</span>
                <span>Attach relevant files to provide context</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-primary">5.</span>
                <span>Be respectful and follow community guidelines</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default NewDiscussionPage;
