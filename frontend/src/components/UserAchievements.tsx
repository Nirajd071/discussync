import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserBadge, { BadgeType } from './UserBadge';
import {
  Award,
  Trophy,
  Target,
  Star,
  Zap,
  MessageSquare,
  ThumbsUp,
  Calendar,
  Clock,
  Users,
  Bookmark,
  Heart
} from 'lucide-react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
  maxProgress: number;
  completed: boolean;
  completedAt?: string;
  badgeType?: BadgeType;
}

export interface UserStats {
  discussionsCreated: number;
  commentsPosted: number;
  upvotesGiven: number;
  upvotesReceived: number;
  daysActive: number;
  memberSince: string;
  reputation: number;
  badges: BadgeType[];
}

interface UserAchievementsProps {
  achievements: Achievement[];
  stats: UserStats;
  userId: string;
}

const UserAchievements: React.FC<UserAchievementsProps> = ({
  achievements,
  stats,
  userId
}) => {
  // Filter achievements by completion status
  const completedAchievements = achievements.filter(a => a.completed);
  const inProgressAchievements = achievements.filter(a => !a.completed);
  
  return (
    <Tabs defaultValue="achievements" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="achievements">Achievements</TabsTrigger>
        <TabsTrigger value="badges">Badges</TabsTrigger>
        <TabsTrigger value="stats">Stats</TabsTrigger>
      </TabsList>
      
      {/* Achievements Tab */}
      <TabsContent value="achievements" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Achievements</h3>
            <p className="text-sm text-muted-foreground">
              {completedAchievements.length} of {achievements.length} completed
            </p>
          </div>
          <div className="flex items-center space-x-1">
            <Trophy className="h-5 w-5 text-amber-500" />
            <span className="font-medium">{completedAchievements.length}</span>
          </div>
        </div>
        
        {/* Completed Achievements */}
        {completedAchievements.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Completed</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {completedAchievements.map(achievement => (
                <Card key={achievement.id} className="border-emerald-100 dark:border-emerald-800/30">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
                          {achievement.icon}
                        </div>
                        <div>
                          <CardTitle className="text-base">{achievement.title}</CardTitle>
                          <CardDescription className="text-xs">{achievement.description}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/30">
                        Completed
                      </Badge>
                    </div>
                  </CardHeader>
                  {achievement.completedAt && (
                    <CardContent className="pt-0">
                      <p className="text-xs text-muted-foreground flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        Completed {achievement.completedAt}
                      </p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {/* In Progress Achievements */}
        {inProgressAchievements.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">In Progress</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {inProgressAchievements.map(achievement => (
                <Card key={achievement.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start space-x-2">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        {achievement.icon}
                      </div>
                      <div>
                        <CardTitle className="text-base">{achievement.title}</CardTitle>
                        <CardDescription className="text-xs">{achievement.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span>{achievement.progress} / {achievement.maxProgress}</span>
                        <span>{Math.round((achievement.progress / achievement.maxProgress) * 100)}%</span>
                      </div>
                      <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </TabsContent>
      
      {/* Badges Tab */}
      <TabsContent value="badges" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Badges</h3>
            <p className="text-sm text-muted-foreground">
              {stats.badges.length} badges earned
            </p>
          </div>
          <div className="flex items-center space-x-1">
            <Award className="h-5 w-5 text-amber-500" />
            <span className="font-medium">{stats.badges.length}</span>
          </div>
        </div>
        
        {stats.badges.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {stats.badges.map((badge, index) => (
              <UserBadge key={index} type={badge} size="lg" />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-6 text-center">
              <Star className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No badges earned yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Participate in discussions to earn badges
              </p>
            </CardContent>
          </Card>
        )}
      </TabsContent>
      
      {/* Stats Tab */}
      <TabsContent value="stats" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Activity Stats</h3>
            <p className="text-sm text-muted-foreground">
              Member since {stats.memberSince}
            </p>
          </div>
          <div className="flex items-center space-x-1">
            <Target className="h-5 w-5 text-emerald-500" />
            <span className="font-medium">{stats.reputation}</span>
          </div>
        </div>
        
        <Card>
          <CardContent className="py-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center">
                  <MessageSquare className="mr-1 h-4 w-4" />
                  Discussions
                </p>
                <p className="text-2xl font-bold">{stats.discussionsCreated}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center">
                  <MessageSquare className="mr-1 h-4 w-4" />
                  Comments
                </p>
                <p className="text-2xl font-bold">{stats.commentsPosted}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center">
                  <ThumbsUp className="mr-1 h-4 w-4" />
                  Upvotes Given
                </p>
                <p className="text-2xl font-bold">{stats.upvotesGiven}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center">
                  <ThumbsUp className="mr-1 h-4 w-4" />
                  Upvotes Received
                </p>
                <p className="text-2xl font-bold">{stats.upvotesReceived}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  Days Active
                </p>
                <p className="text-2xl font-bold">{stats.daysActive}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center">
                  <Users className="mr-1 h-4 w-4" />
                  Reputation
                </p>
                <p className="text-2xl font-bold">{stats.reputation}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default UserAchievements;
