
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import UserBadge from '@/components/UserBadge';
import UserAchievements, { Achievement, UserStats } from '@/components/UserAchievements';
import {
  Calendar,
  MessageSquare,
  ThumbsUp,
  AtSign,
  Mail,
  Edit,
  Award,
  Trophy,
  Target,
  Star,
  Zap,
  Bell
} from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import MainLayout from '@/components/Layout/MainLayout';
import DiscussionCard from '@/components/DiscussionCard';
import { api } from '@/lib/api';
import { User, Discussion } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { mockUsers, mockDiscussions } from '@/lib/mock-data';

// Achievement data - will be replaced with real data from API in the future
const getDefaultAchievements = (discussionCount: number, commentCount: number, upvotesReceived: number): Achievement[] => [
  {
    id: '1',
    title: 'First Discussion',
    description: 'Create your first discussion',
    icon: <MessageSquare className="h-4 w-4 text-emerald-600" />,
    progress: Math.min(discussionCount, 1),
    maxProgress: 1,
    completed: discussionCount >= 1,
    completedAt: discussionCount >= 1 ? 'recently' : undefined,
    badgeType: 'contributor'
  },
  {
    id: '2',
    title: 'Helpful Commenter',
    description: 'Post 10 comments',
    icon: <MessageSquare className="h-4 w-4 text-blue-600" />,
    progress: Math.min(commentCount, 10),
    maxProgress: 10,
    completed: commentCount >= 10,
    completedAt: commentCount >= 10 ? 'recently' : undefined,
    badgeType: 'top_commenter'
  },
  {
    id: '3',
    title: 'Discussion Starter',
    description: 'Create 5 discussions',
    icon: <MessageSquare className="h-4 w-4 text-purple-600" />,
    progress: Math.min(discussionCount, 5),
    maxProgress: 5,
    completed: discussionCount >= 5
  },
  {
    id: '4',
    title: 'Upvote Collector',
    description: 'Receive 50 upvotes on your content',
    icon: <ThumbsUp className="h-4 w-4 text-amber-600" />,
    progress: Math.min(upvotesReceived, 50),
    maxProgress: 50,
    completed: upvotesReceived >= 50
  },
  {
    id: '5',
    title: 'Early Bird',
    description: 'Join during the first month of launch',
    icon: <Zap className="h-4 w-4 text-yellow-600" />,
    progress: 1, // This is a special achievement that can't be calculated automatically
    maxProgress: 1,
    completed: true, // For now, we'll assume all users are early birds
    completedAt: 'at registration',
    badgeType: 'early_adopter'
  }
];

// Mock user stats
const mockUserStats: UserStats = {
  discussionsCreated: 3,
  commentsPosted: 27,
  upvotesGiven: 45,
  upvotesReceived: 32,
  daysActive: 87,
  memberSince: 'Mar 15, 2023',
  reputation: 124,
  badges: ['contributor', 'top_commenter', 'early_adopter', 'helpful']
};

const ProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [userDiscussions, setUserDiscussions] = useState<Discussion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const isCurrentUserProfile = !username || (currentUser && currentUser.username === username);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setIsLoading(true);
        let userData: User | undefined;

        if (isCurrentUserProfile && currentUser) {
          console.log('Loading current user profile:', currentUser.id);

          try {
            // Fetch the full user profile from the API
            userData = await api.getUserProfile(currentUser.id);
            console.log('Fetched current user profile:', userData);

            if (userData) {
              setUserProfile(userData);
            } else {
              // If API returns null/undefined, use the current user data
              console.warn('API returned empty profile, using current user data');
              setUserProfile(currentUser);
            }
          } catch (profileError) {
            console.error('Error fetching current user profile:', profileError);
            // Fallback to current user data from auth context
            console.warn('Using fallback user data from auth context');
            setUserProfile(currentUser);
          }

          // Fetch discussions by the current user
          try {
            const discussions = await api.getUserDiscussions(currentUser.id);
            console.log('Fetched user discussions:', discussions);
            setUserDiscussions(discussions);
          } catch (discussionError) {
            console.error('Error fetching user discussions:', discussionError);
            toast({
              title: 'Error',
              description: 'Failed to load your discussions',
              variant: 'destructive',
            });
          }
        } else if (username) {
          try {
            // Try to find user by username through API
            console.log('Looking up user by username:', username);

            // In a real implementation, we would fetch the user profile by username
            // For now, we'll use the mock data
            userData = mockUsers.find(u => u.username === username);

            if (userData) {
              try {
                // Once we have the user ID, fetch the full profile
                const fullProfile = await api.getUserProfile(userData.id);
                if (fullProfile) {
                  console.log('Fetched user profile by ID:', fullProfile);
                  setUserProfile(fullProfile);
                } else {
                  console.warn('API returned empty profile for user ID, using mock data');
                  setUserProfile(userData);
                }
              } catch (profileError) {
                console.error('Error fetching user profile by ID:', profileError);
                console.warn('Using mock user data as fallback');
                setUserProfile(userData);
              }

              // Fetch discussions by this user
              try {
                const discussions = await api.getUserDiscussions(userData.id);
                setUserDiscussions(discussions);
              } catch (discussionError) {
                console.error('Error fetching user discussions:', discussionError);
                // Fallback to mock data
                const userPosts = mockDiscussions.filter(d => d.author.id === userData?.id);
                setUserDiscussions(userPosts);
              }
            } else {
              toast({
                title: 'User not found',
                description: 'The requested user profile could not be found',
                variant: 'destructive',
              });
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
            toast({
              title: 'Error',
              description: 'Failed to load user profile',
              variant: 'destructive',
            });
          }
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        toast({
          title: 'Error',
          description: 'An unexpected error occurred',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [username, currentUser, isCurrentUserProfile, toast]);

  const handleUpvote = (id: string, newUpvotes: number, hasUpvoted: boolean) => {
    setUserDiscussions(prev =>
      prev.map(discussion =>
        discussion.id === id
          ? { ...discussion, upvotes: newUpvotes, hasUpvoted }
          : discussion
      )
    );
  };

  const handleDeleteDiscussion = async (id: string) => {
    if (!confirm('Are you sure you want to delete this discussion? This action cannot be undone.')) {
      return;
    }

    try {
      await api.deleteDiscussion(id);

      // Remove the discussion from the list
      setUserDiscussions(prev => prev.filter(discussion => discussion.id !== id));

      toast({
        title: 'Discussion deleted',
        description: 'Your discussion has been deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting discussion:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete discussion. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <div className="h-24 w-24 bg-muted rounded-full mx-auto mb-4 animate-pulse"></div>
            <div className="h-8 bg-muted rounded w-48 mx-auto mb-2 animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-32 mx-auto animate-pulse"></div>
          </div>

          <div className="h-32 bg-card rounded-lg border animate-pulse mb-6"></div>

          <div className="h-64 bg-card rounded-lg border animate-pulse"></div>
        </div>
      </MainLayout>
    );
  }

  if (!userProfile) {
    return (
      <MainLayout>
        <div className="text-center py-12 max-w-md mx-auto">
          <AtSign className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-40" />
          <h2 className="text-2xl font-bold mb-4">User not found</h2>
          <p className="text-muted-foreground mb-6">
            The user profile you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <a href="/discussions">Browse Discussions</a>
          </Button>
        </div>
      </MainLayout>
    );
  }

  // Generate achievements based on user stats
  const achievements = getDefaultAchievements(
    mockUserStats.discussionsCreated,
    mockUserStats.commentsPosted,
    mockUserStats.upvotesReceived
  );

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <Avatar className="h-24 w-24 mx-auto mb-4">
            <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
            <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <h1 className="text-2xl font-bold mb-1">{userProfile.name}</h1>
          <p className="text-muted-foreground mb-3">@{userProfile.username}</p>

          {/* User Badges */}
          <div className="flex justify-center gap-2 mb-4">
            {mockUserStats.badges.slice(0, 4).map((badge, index) => (
              <UserBadge key={index} type={badge} />
            ))}
            {mockUserStats.badges.length > 4 && (
              <Badge variant="outline" className="bg-gray-100 dark:bg-gray-900/20">
                +{mockUserStats.badges.length - 4} more
              </Badge>
            )}
          </div>

          {userProfile.bio && (
            <p className="mb-4 max-w-md mx-auto">{userProfile.bio}</p>
          )}

          {isCurrentUserProfile && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1" asChild>
                <Link to="/profile/edit">
                  <Edit className="h-3 w-3" /> Edit Profile
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="gap-1" asChild>
                <Link to="/notification-settings">
                  <Bell className="h-3 w-3" /> Notification Settings
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="bg-card rounded-lg border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
              <div>
                <p className="text-sm text-muted-foreground">Joined</p>
                <p className="font-medium">
                  {formatDistanceToNow(userProfile.joinedAt, { addSuffix: true })}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <MessageSquare className="h-5 w-5 text-muted-foreground mr-2" />
              <div>
                <p className="text-sm text-muted-foreground">Discussions</p>
                <p className="font-medium">{userDiscussions.length}</p>
              </div>
            </div>

            <div className="flex items-center">
              <ThumbsUp className="h-5 w-5 text-muted-foreground mr-2" />
              <div>
                <p className="text-sm text-muted-foreground">Upvotes Received</p>
                <p className="font-medium">
                  {userDiscussions.reduce((total, discussion) => total + discussion.upvotes, 0)}
                </p>
              </div>
            </div>
          </div>

          {isCurrentUserProfile && (
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-muted-foreground mr-2" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{userProfile.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tabs Content */}
        <Tabs defaultValue="discussions">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="discussions" className="flex-1">Discussions</TabsTrigger>
            <TabsTrigger value="comments" className="flex-1">Comments</TabsTrigger>
            <TabsTrigger value="upvoted" className="flex-1">Upvoted</TabsTrigger>
            <TabsTrigger value="achievements" className="flex-1">
              <Trophy className="h-4 w-4 mr-2" />
              Achievements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discussions">
            {userDiscussions.length > 0 ? (
              <div className="space-y-4">
                {userDiscussions.map(discussion => (
                  <DiscussionCard
                    key={discussion.id}
                    discussion={discussion}
                    onUpvote={handleUpvote}
                    onDelete={handleDeleteDiscussion}
                    showDeleteButton={isCurrentUserProfile}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-card rounded-lg border">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-40" />
                <h3 className="text-lg font-medium mb-2">No discussions yet</h3>
                <p className="text-muted-foreground mb-6">
                  {isCurrentUserProfile
                    ? "You haven't created any discussions yet."
                    : `${userProfile.name} hasn't created any discussions yet.`}
                </p>
                {isCurrentUserProfile && (
                  <Button asChild>
                    <a href="/discussions/new">Start a Discussion</a>
                  </Button>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="comments">
            <div className="text-center py-8 bg-card rounded-lg border">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-40" />
              <h3 className="text-lg font-medium mb-2">Comments will appear here</h3>
              <p className="text-muted-foreground">
                When you comment on discussions, they'll be listed here.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="upvoted">
            <div className="text-center py-8 bg-card rounded-lg border">
              <ThumbsUp className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-40" />
              <h3 className="text-lg font-medium mb-2">Upvoted content will appear here</h3>
              <p className="text-muted-foreground">
                When you upvote discussions or comments, they'll be listed here.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="achievements">
            <UserAchievements
              achievements={achievements}
              stats={mockUserStats}
              userId={userProfile.id}
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
