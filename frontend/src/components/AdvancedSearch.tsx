import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import {
  Search,
  SlidersHorizontal,
  X,
  Calendar as CalendarIcon,
  Tag as TagIcon,
  User,
  MessageSquare,
  ThumbsUp,
  Clock,
  FileText,
  Check
} from 'lucide-react';
import { api } from '@/lib/api';
import { analytics } from '@/lib/analytics';
import { useAuth } from '@/contexts/AuthContext';
import { Tag } from '@/types';

interface AdvancedSearchProps {
  onSearch?: (params: Record<string, string>) => void;
  className?: string;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onSearch,
  className = ''
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Search state
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [isOpen, setIsOpen] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    searchParams.get('tags')?.split(',').filter(Boolean) || []
  );
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    searchParams.has('from') && searchParams.has('to')
      ? {
          from: new Date(searchParams.get('from')!),
          to: new Date(searchParams.get('to')!)
        }
      : undefined
  );
  const [contentTypes, setContentTypes] = useState<string[]>(
    searchParams.get('types')?.split(',').filter(Boolean) || ['discussions', 'comments']
  );
  const [sortBy, setSortBy] = useState<string>(
    searchParams.get('sort') || 'relevance'
  );

  // Load tags
  useEffect(() => {
    const loadTags = async () => {
      try {
        const tagsData = await api.getTags();
        setTags(tagsData);
      } catch (error) {
        console.error('Failed to load tags:', error);
      }
    };

    loadTags();
  }, []);

  // Handle search submission
  const handleSearch = () => {
    const params: Record<string, string> = {};

    if (searchTerm) params.q = searchTerm;
    if (selectedTags.length > 0) params.tags = selectedTags.join(',');
    if (dateRange?.from) params.from = format(dateRange.from, 'yyyy-MM-dd');
    if (dateRange?.to) params.to = format(dateRange.to, 'yyyy-MM-dd');
    if (contentTypes.length > 0) params.types = contentTypes.join(',');
    if (sortBy !== 'relevance') params.sort = sortBy;

    // Update URL search params
    setSearchParams(params);

    // Track search event
    if (searchTerm || selectedTags.length > 0) {
      analytics.trackSearch(searchTerm, {
        tags: selectedTags,
        from: dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
        to: dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
        types: contentTypes,
        sort: sortBy
      }, user?.id);
    }

    // Call the onSearch callback if provided
    if (onSearch) {
      onSearch(params);
    }

    // Close the advanced search popover
    setIsOpen(false);
  };

  // Handle tag selection
  const toggleTag = (tagName: string) => {
    const isAdding = !selectedTags.includes(tagName);

    setSelectedTags(prev =>
      isAdding
        ? [...prev, tagName]
        : prev.filter(t => t !== tagName)
    );

    // Track tag click when adding a tag
    if (isAdding) {
      analytics.trackTagClick(tagName, user?.id);
    }
  };

  // Handle content type selection
  const toggleContentType = (type: string) => {
    setContentTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
    setDateRange(undefined);
    setContentTypes(['discussions', 'comments']);
    setSortBy('relevance');
  };

  // Count active filters
  const activeFilterCount = [
    selectedTags.length > 0,
    dateRange !== undefined,
    contentTypes.length !== 2, // Default is 2 (discussions and comments)
    sortBy !== 'relevance'
  ].filter(Boolean).length;

  return (
    <div className={`relative ${className}`}>
      <div className="flex w-full items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search discussions, comments, users..."
            className="pl-8 pr-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-9 w-9"
              onClick={() => setSearchTerm('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="relative"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {activeFilterCount > 0 && (
                <Badge
                  className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                  variant="default"
                >
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Advanced Search</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-8 text-xs"
                >
                  Clear all
                </Button>
              </div>
            </div>

            <Separator />

            <div className="p-4 space-y-4">
              {/* Content Type */}
              <div className="space-y-2">
                <Label className="text-xs font-medium">Content Type</Label>
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="discussions"
                      checked={contentTypes.includes('discussions')}
                      onCheckedChange={() => toggleContentType('discussions')}
                    />
                    <Label htmlFor="discussions" className="text-sm cursor-pointer">
                      <MessageSquare className="h-3 w-3 inline mr-1" />
                      Discussions
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="comments"
                      checked={contentTypes.includes('comments')}
                      onCheckedChange={() => toggleContentType('comments')}
                    />
                    <Label htmlFor="comments" className="text-sm cursor-pointer">
                      <MessageSquare className="h-3 w-3 inline mr-1" />
                      Comments
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="users"
                      checked={contentTypes.includes('users')}
                      onCheckedChange={() => toggleContentType('users')}
                    />
                    <Label htmlFor="users" className="text-sm cursor-pointer">
                      <User className="h-3 w-3 inline mr-1" />
                      Users
                    </Label>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label className="text-xs font-medium">Tags</Label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1">
                  {tags.map(tag => (
                    <Badge
                      key={tag.id}
                      variant={selectedTags.includes(tag.name) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleTag(tag.name)}
                    >
                      {selectedTags.includes(tag.name) && (
                        <Check className="mr-1 h-3 w-3" />
                      )}
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div className="space-y-2">
                <Label className="text-xs font-medium">Date Range</Label>
                <div className="border rounded-md p-2">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={1}
                    className="w-full"
                  />
                </div>
                {dateRange?.from && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <CalendarIcon className="mr-1 h-3 w-3" />
                    {format(dateRange.from, 'PPP')}
                    {dateRange.to && (
                      <>
                        <span className="mx-1">-</span>
                        {format(dateRange.to, 'PPP')}
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1"
                      onClick={() => setDateRange(undefined)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <Label className="text-xs font-medium">Sort By</Label>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={sortBy === 'relevance' ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSortBy('relevance')}
                  >
                    <FileText className="mr-1 h-3 w-3" />
                    Relevance
                  </Badge>
                  <Badge
                    variant={sortBy === 'newest' ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSortBy('newest')}
                  >
                    <Clock className="mr-1 h-3 w-3" />
                    Newest
                  </Badge>
                  <Badge
                    variant={sortBy === 'oldest' ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSortBy('oldest')}
                  >
                    <Clock className="mr-1 h-3 w-3" />
                    Oldest
                  </Badge>
                  <Badge
                    variant={sortBy === 'most_upvoted' ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSortBy('most_upvoted')}
                  >
                    <ThumbsUp className="mr-1 h-3 w-3" />
                    Most Upvoted
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            <div className="p-4 pt-2">
              <Button
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                onClick={handleSearch}
              >
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Button
          onClick={handleSearch}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
        >
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedTags.map(tag => (
            <Badge
              key={tag}
              variant="secondary"
              className="flex items-center"
            >
              <TagIcon className="mr-1 h-3 w-3" />
              {tag}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 -mr-1"
                onClick={() => toggleTag(tag)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}

          {dateRange?.from && (
            <Badge
              variant="secondary"
              className="flex items-center"
            >
              <CalendarIcon className="mr-1 h-3 w-3" />
              {format(dateRange.from, 'MMM d, yyyy')}
              {dateRange.to && (
                <>
                  <span className="mx-1">-</span>
                  {format(dateRange.to, 'MMM d, yyyy')}
                </>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 -mr-1"
                onClick={() => setDateRange(undefined)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {contentTypes.length !== 2 && (
            <Badge
              variant="secondary"
              className="flex items-center"
            >
              {contentTypes.includes('discussions') && <MessageSquare className="h-3 w-3 mr-1" />}
              {contentTypes.includes('comments') && <MessageSquare className="h-3 w-3 mr-1" />}
              {contentTypes.includes('users') && <User className="h-3 w-3 mr-1" />}
              {contentTypes.join(', ')}
            </Badge>
          )}

          {sortBy !== 'relevance' && (
            <Badge
              variant="secondary"
              className="flex items-center"
            >
              {sortBy === 'newest' || sortBy === 'oldest' ? (
                <Clock className="mr-1 h-3 w-3" />
              ) : (
                <ThumbsUp className="mr-1 h-3 w-3" />
              )}
              Sort: {sortBy.replace('_', ' ')}
            </Badge>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs"
            onClick={clearFilters}
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;
