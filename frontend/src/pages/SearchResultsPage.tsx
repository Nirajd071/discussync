import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import AdvancedSearch from '@/components/AdvancedSearch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { EmptyState } from '@/components/ui/empty-state';
import {
  MessageSquare,
  User,
  Search,
  Tag as TagIcon,
  ThumbsUp,
  Calendar,
  ArrowRight,
  FileText
} from 'lucide-react';
import { api } from '@/lib/api';
import { analytics } from '@/lib/analytics';
import { Discussion, Comment, User as UserType } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

interface SearchResult {
  discussions: Discussion[];
  comments: Comment[];
  users: UserType[];
  totalResults: number;
}

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SearchResult>({
    discussions: [],
    comments: [],
    users: [],
    totalResults: 0
  });
  const [activeTab, setActiveTab] = useState('all');
  const { user } = useAuth();

  // Get search parameters
  const query = searchParams.get('q') || '';
  const tags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
  const from = searchParams.get('from') || undefined;
  const to = searchParams.get('to') || undefined;
  const types = searchParams.get('types')?.split(',').filter(Boolean) || ['discussions', 'comments'];
  const sort = searchParams.get('sort') || 'relevance';

  // Fetch search results
  useEffect(() => {
    const fetchResults = async () => {
      if (!query && tags.length === 0 && !from && !to) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Build search parameters
        const params: Record<string, string> = {};
        if (query) params.q = query;
        if (tags.length > 0) params.tags = tags.join(',');
        if (from) params.from = from;
        if (to) params.to = to;
        if (types.length > 0) params.types = types.join(',');
        if (sort !== 'relevance') params.sort = sort;

        // Call search API
        const searchResults = await api.search(params);
        setResults(searchResults);

        // Track search event
        if (query || tags.length > 0) {
          analytics.trackSearch(query, {
            tags,
            from,
            to,
            types,
            sort
          }, user?.id);
        }
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to fetch search results. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query, tags, from, to, types, sort]);

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Count results by type
  const discussionCount = results.discussions.length;
  const commentCount = results.comments.length;
  const userCount = results.users.length;
  const totalCount = discussionCount + commentCount + userCount;

  // Determine which results to show based on active tab
  const showDiscussions = activeTab === 'all' || activeTab === 'discussions';
  const showComments = activeTab === 'all' || activeTab === 'comments';
  const showUsers = activeTab === 'all' || activeTab === 'users';

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Search Results</h1>

        <div className="mb-8">
          <AdvancedSearch />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" text="Searching..." />
          </div>
        ) : error ? (
          <ErrorMessage
            title="Search Error"
            message={error}
            onRetry={() => window.location.reload()}
          />
        ) : totalCount === 0 ? (
          <EmptyState
            icon={<Search className="h-12 w-12" />}
            title="No results found"
            description={
              query
                ? `No results found for "${query}". Try different keywords or filters.`
                : "Use the search bar above to find discussions, comments, and users."
            }
            className="py-12"
          />
        ) : (
          <>
            <div className="mb-6">
              <p className="text-muted-foreground">
                Found {totalCount} results {query && `for "${query}"`}
              </p>
            </div>

            <Tabs defaultValue="all" onValueChange={handleTabChange}>
              <TabsList className="mb-6">
                <TabsTrigger value="all">
                  All Results ({totalCount})
                </TabsTrigger>
                <TabsTrigger value="discussions">
                  Discussions ({discussionCount})
                </TabsTrigger>
                <TabsTrigger value="comments">
                  Comments ({commentCount})
                </TabsTrigger>
                <TabsTrigger value="users">
                  Users ({userCount})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6">
                {/* Show all result types */}
                {showDiscussions && discussionCount > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">Discussions</h2>
                      {discussionCount > 3 && (
                        <Button variant="link" asChild>
                          <Link to="?tab=discussions">
                            View all {discussionCount} <ArrowRight className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                    </div>

                    {results.discussions.slice(0, 3).map(discussion => (
                      <DiscussionResult key={discussion.id} discussion={discussion} query={query} />
                    ))}
                  </div>
                )}

                {showComments && commentCount > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">Comments</h2>
                      {commentCount > 3 && (
                        <Button variant="link" asChild>
                          <Link to="?tab=comments">
                            View all {commentCount} <ArrowRight className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                    </div>

                    {results.comments.slice(0, 3).map(comment => (
                      <CommentResult key={comment.id} comment={comment} query={query} />
                    ))}
                  </div>
                )}

                {showUsers && userCount > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">Users</h2>
                      {userCount > 3 && (
                        <Button variant="link" asChild>
                          <Link to="?tab=users">
                            View all {userCount} <ArrowRight className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {results.users.slice(0, 3).map(user => (
                        <UserResult key={user.id} user={user} query={query} />
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="discussions" className="space-y-4">
                {discussionCount > 0 ? (
                  results.discussions.map(discussion => (
                    <DiscussionResult key={discussion.id} discussion={discussion} query={query} />
                  ))
                ) : (
                  <EmptyState
                    icon={<MessageSquare className="h-12 w-12" />}
                    title="No discussions found"
                    description="Try different search terms or filters."
                    className="py-8"
                  />
                )}
              </TabsContent>

              <TabsContent value="comments" className="space-y-4">
                {commentCount > 0 ? (
                  results.comments.map(comment => (
                    <CommentResult key={comment.id} comment={comment} query={query} />
                  ))
                ) : (
                  <EmptyState
                    icon={<MessageSquare className="h-12 w-12" />}
                    title="No comments found"
                    description="Try different search terms or filters."
                    className="py-8"
                  />
                )}
              </TabsContent>

              <TabsContent value="users" className="space-y-4">
                {userCount > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {results.users.map(user => (
                      <UserResult key={user.id} user={user} query={query} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={<User className="h-12 w-12" />}
                    title="No users found"
                    description="Try different search terms or filters."
                    className="py-8"
                  />
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </MainLayout>
  );
};

// Discussion Result Component
const DiscussionResult: React.FC<{ discussion: Discussion; query: string }> = ({
  discussion,
  query
}) => {
  // Highlight matching text in title and content
  const highlightMatch = (text: string) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-100 dark:bg-yellow-900/30">$1</mark>');
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <Link to={`/discussions/${discussion.id}`}>
          <CardTitle
            className="text-lg hover:text-emerald-600 transition-colors"
            dangerouslySetInnerHTML={{ __html: highlightMatch(discussion.title) }}
          />
        </Link>
        <CardDescription className="flex items-center gap-2">
          <Avatar className="h-5 w-5">
            <AvatarImage src={discussion.author.avatar} />
            <AvatarFallback>{discussion.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span>{discussion.author.name}</span>
          <span>•</span>
          <Calendar className="h-3 w-3" />
          <span>{formatDistanceToNow(new Date(discussion.createdAt), { addSuffix: true })}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div
          className="text-sm text-muted-foreground line-clamp-2"
          dangerouslySetInnerHTML={{ __html: highlightMatch(discussion.content) }}
        />
        <div className="flex flex-wrap gap-2 mt-3">
          {discussion.tags.map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              <TagIcon className="mr-1 h-3 w-3" />
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <ThumbsUp className="mr-1 h-3 w-3" />
            {discussion.upvotes} upvotes
          </div>
          <div className="flex items-center">
            <MessageSquare className="mr-1 h-3 w-3" />
            {discussion.commentCount} comments
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

// Comment Result Component
const CommentResult: React.FC<{ comment: Comment; query: string }> = ({
  comment,
  query
}) => {
  // Highlight matching text in content
  const highlightMatch = (text: string) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-100 dark:bg-yellow-900/30">$1</mark>');
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Avatar className="h-5 w-5">
            <AvatarImage src={comment.author.avatar} />
            <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span>{comment.author.name}</span>
          <span>•</span>
          <Calendar className="h-3 w-3" />
          <span>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <div
          className="text-sm"
          dangerouslySetInnerHTML={{ __html: highlightMatch(comment.content) }}
        />
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <ThumbsUp className="mr-1 h-3 w-3" />
            {comment.upvotes} upvotes
          </div>
          <div className="flex items-center">
            <MessageSquare className="mr-1 h-3 w-3" />
            {comment.replies?.length || 0} replies
          </div>
          <Button variant="link" size="sm" asChild className="p-0 h-auto">
            <Link to={`/discussions/${comment.parentId}#comment-${comment.id}`}>
              View in discussion <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

// User Result Component
const UserResult: React.FC<{ user: UserType; query: string }> = ({
  user,
  query
}) => {
  // Highlight matching text in name and bio
  const highlightMatch = (text: string) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-100 dark:bg-yellow-900/30">$1</mark>');
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-16 w-16 mb-3">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <Link to={`/users/${user.username}`}>
            <h3
              className="font-medium text-lg hover:text-emerald-600 transition-colors"
              dangerouslySetInnerHTML={{ __html: highlightMatch(user.name) }}
            />
          </Link>
          <p className="text-sm text-muted-foreground mb-1">@{user.username}</p>
          {user.bio && (
            <p
              className="text-sm text-muted-foreground line-clamp-2 mt-2"
              dangerouslySetInnerHTML={{ __html: highlightMatch(user.bio) }}
            />
          )}
          <Button variant="outline" size="sm" className="mt-4" asChild>
            <Link to={`/users/${user.username}`}>
              View Profile
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchResultsPage;
