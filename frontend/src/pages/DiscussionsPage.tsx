import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  Filter,
  Tag as TagIcon,
  ArrowUpDown,
  Plus,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import MainLayout from '@/components/Layout/MainLayout';
import DiscussionCard from '@/components/DiscussionCard';
import TagBadge from '@/components/TagBadge';
import { api } from '@/lib/api';
import { Discussion } from '@/types';
import { useToast } from '@/hooks/use-toast';

const DiscussionsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || '');
  const [popularTags, setPopularTags] = useState<string[]>([
    'general',
    'question',
    'announcement',
    'help',
    'discussion',
    'feedback',
    'bug',
    'feature',
    'idea',
    'solved'
  ]);

  const [selectedSort, setSelectedSort] = useState('recent');

  useEffect(() => {
    const loadDiscussions = async () => {
      try {
        setIsLoading(true);
        console.log('Loading discussions with token:', localStorage.getItem('auth_token'));

        // Get discussions based on filters
        const filters: { tag?: string, search?: string } = {};
        if (selectedTag) filters.tag = selectedTag;
        if (searchTerm) filters.search = searchTerm;

        try {
          console.log('Fetching discussions with filters:', filters);
          console.log('Auth token:', localStorage.getItem('auth_token'));

          // Direct fetch to debug
          const authToken = localStorage.getItem('auth_token');
          const headers: HeadersInit = {
            'Content-Type': 'application/json',
          };

          if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
          }

          const response = await fetch('http://localhost:8004/api/discussions/', {
            method: 'GET',
            headers
          });

          console.log('Discussions API response status:', response.status);

          if (!response.ok) {
            throw new Error(`Failed to fetch discussions: ${response.status}`);
          }

          const data = await response.json();
          console.log('Discussions loaded successfully:', data);

          // Apply client-side sorting
          let sortedData = [...data];
          if (selectedSort === 'upvotes') {
            sortedData.sort((a, b) => (b.upvote_count || 0) - (a.upvote_count || 0));
          } else if (selectedSort === 'comments') {
            sortedData.sort((a, b) => (b.comment_count || 0) - (a.comment_count || 0));
          }

          console.log('Setting discussions state with:', sortedData);
          setDiscussions(sortedData);

          // Extract popular tags
          const tags = data.flatMap(d => (d.tags || []).map(tag =>
            typeof tag === 'string' ? tag : tag.name
          ));
          const tagCounts = tags.reduce((acc, tag) => {
            acc[tag] = (acc[tag] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          const popular = Object.entries(tagCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([tag]) => tag);

          setPopularTags(popular);
        } catch (apiError) {
          console.error('Error fetching discussions:', apiError);
          throw apiError;
        }
      } catch (err) {
        console.error('Failed to load discussions:', err);
        setError('Failed to load discussions. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadDiscussions();
  }, [selectedTag, searchTerm, selectedSort, searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Update URL parameters and trigger useEffect
    const newParams = new URLSearchParams(searchParams);
    if (searchTerm) {
      newParams.set('search', searchTerm);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag === selectedTag ? '' : tag);

    // Update URL parameters and trigger useEffect
    const newParams = new URLSearchParams(searchParams);
    if (tag && tag !== selectedTag) {
      newParams.set('tag', tag);
    } else {
      newParams.delete('tag');
    }
    setSearchParams(newParams);
  };

  const handleSortChange = (sort: string) => {
    setSelectedSort(sort);
  };

  const handleCreateDiscussion = () => {
    navigate('/discussions/new');
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold">Discussions</h1>

          <div className="flex items-center gap-2">
            <form onSubmit={handleSearch} className="relative w-full md:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search discussions..."
                className="pl-8 w-full md:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>

            <Button onClick={handleCreateDiscussion} className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
              <Plus className="mr-2 h-4 w-4" /> New Discussion
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-6">
            {/* Sort options */}
            <div className="bg-card rounded-lg border p-4">
              <h3 className="font-medium mb-3 flex items-center">
                <ArrowUpDown className="mr-2 h-4 w-4" /> Sort By
              </h3>
              <div className="space-y-2">
                <Button
                  variant={selectedSort === 'recent' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => handleSortChange('recent')}
                >
                  Most Recent
                </Button>
                <Button
                  variant={selectedSort === 'upvotes' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => handleSortChange('upvotes')}
                >
                  Most Upvoted
                </Button>
                <Button
                  variant={selectedSort === 'comments' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => handleSortChange('comments')}
                >
                  Most Comments
                </Button>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-card rounded-lg border p-4">
              <h3 className="font-medium mb-3 flex items-center">
                <TagIcon className="mr-2 h-4 w-4" /> Popular Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <TagBadge
                    key={tag}
                    tag={tag}
                    selected={tag === selectedTag}
                    onClick={() => handleTagSelect(tag)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="md:col-span-3">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/20 rounded-lg p-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-3" />
                <div>
                  <h3 className="font-medium text-red-800 dark:text-red-400">Error</h3>
                  <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => window.location.reload()}
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            ) : discussions.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-lg border">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-40" />
                <h3 className="text-lg font-medium mb-2">No discussions found</h3>
                <p className="text-muted-foreground mb-4">
                  {selectedTag || searchTerm
                    ? "No discussions match your current filters."
                    : "Be the first to start a discussion!"}
                </p>
                {selectedTag || searchTerm ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedTag('');
                      setSearchTerm('');
                      setSearchParams({});
                    }}
                  >
                    Clear Filters
                  </Button>
                ) : (
                  <Button onClick={handleCreateDiscussion}>
                    <Plus className="mr-2 h-4 w-4" /> New Discussion
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {discussions.map((discussion) => (
                  <DiscussionCard
                    key={discussion.id}
                    discussion={discussion}
                    onTagClick={handleTagSelect}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DiscussionsPage;
