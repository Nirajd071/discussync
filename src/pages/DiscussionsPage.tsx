import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search,
  Filter,
  Tag as TagIcon,
  ArrowUpDown
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

const DiscussionsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [popularTags, setPopularTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const selectedTag = searchParams.get('tag') || '';
  const { toast } = useToast();
  
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
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load discussions',
          variant: 'destructive',
        });
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Discussions</h1>
        {/* Removed duplicate New Discussion button from here */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
            <Input
              type="search"
              placeholder="Search discussions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
            <Button type="submit" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </form>

          {/* Filters */}
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium flex items-center">
                <Filter className="h-4 w-4 mr-2" /> Filters
              </h3>
              {(selectedTag || searchTerm) && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 text-xs"
                  onClick={handleClearFilters}
                >
                  Clear
                </Button>
              )}
            </div>
            
            <div className="space-y-4">
              {/* Tags */}
              <div>
                <h4 className="text-sm font-medium flex items-center mb-2">
                  <TagIcon className="h-4 w-4 mr-1" /> Tags
                </h4>
                <div className="flex flex-wrap gap-2 mb-2">
                  {popularTags.slice(0, 8).map(tag => (
                    <button
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      className={`rounded-md px-2 py-0.5 text-xs ${
                        selectedTag === tag
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                {popularTags.length > 8 && (
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="h-7 px-0 text-xs"
                    asChild
                  >
                    <Link to="/tags">
                      View all tags
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {selectedTag && (
                <div className="flex items-center">
                  <span className="text-sm mr-2">Filtered by:</span>
                  <TagBadge
                    tag={selectedTag}
                    asLink={false}
                    className="mr-2"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleTagClick(selectedTag)}
                  >
                    <span className="sr-only">Remove filter</span>
                    ×
                  </Button>
                </div>
              )}
            </div>
            
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground mr-2">Sort by:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    {sortOptions.find(o => o.value === selectedSort)?.label}
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {sortOptions.map(option => (
                    <DropdownMenuItem 
                      key={option.value}
                      onClick={() => handleSortChange(option.value)}
                      className={selectedSort === option.value ? "bg-accent" : ""}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {isLoading ? (
            // Loading skeleton
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-lg border border-border p-4 space-y-3">
                  <div className="h-6 bg-muted rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
                  <div className="flex space-x-2">
                    <div className="h-5 bg-muted rounded w-16 animate-pulse"></div>
                    <div className="h-5 bg-muted rounded w-16 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : discussions.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No discussions found</h3>
              <p className="text-muted-foreground mb-6">
                {selectedTag || searchTerm
                  ? "Try changing your filters or search term"
                  : "Be the first to start a discussion!"}
              </p>
              <Button asChild>
                <Link to="/discussions/new">
                  Start a new discussion
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
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
      </div>
    </MainLayout>
  );
};

export default DiscussionsPage;
