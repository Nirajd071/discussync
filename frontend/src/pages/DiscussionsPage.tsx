import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const DiscussionsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [popularTags, setPopularTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const selectedTag = searchParams.get('tag') || '';
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  
  const sortOptions = [
    { value: 'recent', label: 'Recent' },
    { value: 'upvotes', label: 'Most Upvoted' },
    { value: 'comments', label: 'Most Comments' }
  ];
  
  const [selectedSort, setSelectedSort] = useState('recent');

  useEffect(() => {
    const loadDiscussions = async () => {
      try {
        setIsLoading(true);
        
        // Get discussions based on filters
        const filters: { tag?: string, search?: string } = {};
        if (selectedTag) filters.tag = selectedTag;
        if (searchTerm) filters.search = searchTerm;
        
        const data = await api.getDiscussions(filters);
        
        // Apply client-side sorting
        let sortedData = [...data];
        if (selectedSort === 'upvotes') {
          sortedData.sort((a, b) => b.upvotes - a.upvotes);
        } else if (selectedSort === 'comments') {
          sortedData.sort((a, b) => b.commentCount - a.commentCount);
        }
        
        setDiscussions(sortedData);
        
        // Extract popular tags (in a real app, this would come from an API)
        const tags = data.flatMap(d => d.tags);
        const tagCounts = tags.reduce((acc, tag) => {
          acc[tag] = (acc[tag] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        const popular = Object.entries(tagCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([tag]) => tag);
        
        setPopularTags(popular);
      } catch (err) {
        setError('Failed to load discussions. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadDiscussions();
  }, [selectedTag, searchTerm, selectedSort, toast]);

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

  const handleTagClick = (tag: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (selectedTag === tag) {
      newParams.delete('tag');
    } else {
      newParams.set('tag', tag);
    }
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSearchParams({});
  };

  const handleSortChange = (sort: string) => {
    setSelectedSort(sort);
  };

  const handleUpvote = (id: string, newUpvotes: number, hasUpvoted: boolean) => {
    setDiscussions(prev => 
      prev.map(discussion => 
        discussion.id === id 
          ? { ...discussion, upvotes: newUpvotes, hasUpvoted } 
          : discussion
      )
    );
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Discussions
            </h1>
            <p className="text-muted-foreground mt-2">
              Join the conversation and share your thoughts with the community
            </p>
          </div>
          <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700" asChild>
            <Link to="/discussions/new">
              <Plus className="h-4 w-4 mr-2" /> New Discussion
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="p-6 space-y-4">
                <div className="h-6 bg-muted rounded animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
                </div>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : discussions.length === 0 ? (
          <Card className="p-12 text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No discussions yet</h3>
            <p className="text-muted-foreground mb-4">
              Be the first to start a discussion in the community
            </p>
            <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700" asChild>
              <Link to="/discussions/new">
                <Plus className="h-4 w-4 mr-2" /> Start a Discussion
              </Link>
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {discussions.map((discussion) => (
              <DiscussionCard 
                key={discussion.id} 
                discussion={discussion}
                onUpvote={handleUpvote}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default DiscussionsPage;
