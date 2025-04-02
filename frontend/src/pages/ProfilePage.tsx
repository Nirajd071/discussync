
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Calendar, 
  MessageSquare, 
  ThumbsUp,
  AtSign, 
  Mail,
  Edit
} from 'lucide-react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import MainLayout from '@/components/Layout/MainLayout';
import DiscussionCard from '@/components/DiscussionCard';
import { api } from '@/lib/api';
import { User, Discussion } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { mockUsers, mockDiscussions } from '@/lib/mock-data';

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
        
        // In a real app, fetch user profile from API
        // For now, we'll use the mock data
        let userData: User | undefined;
        
        if (isCurrentUserProfile && currentUser) {
          userData = currentUser;
        } else if (username) {
          userData = mockUsers.find(u => u.username === username);
        }
        
        if (userData) {
          setUserProfile(userData);
          
          // Get discussions by this user
          const userPosts = mockDiscussions.filter(d => d.author.id === userData?.id);
          setUserDiscussions(userPosts);
        } else {
          toast({
            title: 'User not found',
            description: 'The requested user profile could not be found',
            variant: 'destructive',
          });
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load user profile',
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
          
          {userProfile.bio && (
            <p className="mb-4 max-w-md mx-auto">{userProfile.bio}</p>
          )}
          
          {isCurrentUserProfile && (
            <Button variant="outline" size="sm" className="gap-1">
              <Edit className="h-3 w-3" /> Edit Profile
            </Button>
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
          </TabsList>
          
          <TabsContent value="discussions">
            {userDiscussions.length > 0 ? (
              <div className="space-y-4">
                {userDiscussions.map(discussion => (
                  <DiscussionCard 
                    key={discussion.id} 
                    discussion={discussion}
                    onUpvote={handleUpvote}
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
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
