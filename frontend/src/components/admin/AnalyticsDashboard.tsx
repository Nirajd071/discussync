import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Users, 
  MessageSquare, 
  ThumbsUp, 
  Search, 
  FileText, 
  Tag as TagIcon,
  Calendar,
  TrendingUp,
  Activity,
  RefreshCw,
  Download,
  Clock
} from 'lucide-react';
import { api } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

// Chart colors
const COLORS = ['#10b981', '#0ea5e9', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'];

const AnalyticsDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState('30d');
  const [analytics, setAnalytics] = useState<any>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Load analytics data
  useEffect(() => {
    const loadAnalytics = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await api.getAnalytics(period);
        setAnalytics(data);
        setLastUpdated(new Date());
      } catch (err) {
        console.error('Failed to load analytics:', err);
        setError('Failed to load analytics data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAnalytics();
  }, [period]);
  
  // Handle refresh
  const handleRefresh = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await api.getAnalytics(period);
      setAnalytics(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to refresh analytics:', err);
      setError('Failed to refresh analytics data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle export
  const handleExport = () => {
    if (!analytics) return;
    
    // Convert analytics data to CSV
    const csvData = [
      // Add CSV headers and data rows here
      'Date,Users,Discussions,Comments,Upvotes,Searches',
      ...analytics.dailyActivity.map((day: any) => 
        `${day.date},${day.users},${day.discussions},${day.comments},${day.upvotes},${day.searches}`
      )
    ].join('\n');
    
    // Create and download CSV file
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `discussync-analytics-${period}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  if (isLoading && !analytics) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner size="lg" text="Loading analytics data..." />
      </div>
    );
  }
  
  if (error && !analytics) {
    return (
      <ErrorMessage 
        title="Failed to load analytics" 
        message={error}
        onRetry={handleRefresh}
      />
    );
  }
  
  // If we have an error but also have data, show a toast or banner instead of full error page
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Track user engagement and platform activity
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isLoading}
            className="border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800/30 dark:hover:bg-emerald-950/20"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          
          <Button
            variant="outline"
            onClick={handleExport}
            className="border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800/30 dark:hover:bg-emerald-950/20"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      {/* Last updated */}
      <div className="text-sm text-muted-foreground flex items-center">
        <Clock className="mr-1 h-4 w-4" />
        Last updated: {formatDistanceToNow(lastUpdated, { addSuffix: true })}
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={analytics?.stats.totalUsers || 0}
          change={analytics?.stats.userGrowth || 0}
          icon={Users}
        />
        <StatCard
          title="Discussions"
          value={analytics?.stats.totalDiscussions || 0}
          change={analytics?.stats.discussionGrowth || 0}
          icon={MessageSquare}
        />
        <StatCard
          title="Comments"
          value={analytics?.stats.totalComments || 0}
          change={analytics?.stats.commentGrowth || 0}
          icon={MessageSquare}
        />
        <StatCard
          title="Upvotes"
          value={analytics?.stats.totalUpvotes || 0}
          change={analytics?.stats.upvoteGrowth || 0}
          icon={ThumbsUp}
        />
      </div>
      
      {/* Charts */}
      <Tabs defaultValue="activity" className="space-y-6">
        <TabsList>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>
        
        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Activity</CardTitle>
              <CardDescription>
                Overview of daily platform activity
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={analytics?.dailyActivity || []}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="users" stroke="#10b981" name="Active Users" />
                  <Line type="monotone" dataKey="discussions" stroke="#0ea5e9" name="Discussions" />
                  <Line type="monotone" dataKey="comments" stroke="#8b5cf6" name="Comments" />
                  <Line type="monotone" dataKey="upvotes" stroke="#f59e0b" name="Upvotes" />
                  <Line type="monotone" dataKey="searches" stroke="#ec4899" name="Searches" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity by Day of Week</CardTitle>
                <CardDescription>
                  User activity patterns by day
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analytics?.activityByDayOfWeek || []}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#10b981" name="Activity" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Activity by Hour</CardTitle>
                <CardDescription>
                  User activity patterns by hour
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analytics?.activityByHour || []}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#0ea5e9" name="Activity" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>New Users</CardTitle>
                <CardDescription>
                  User registration over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={analytics?.newUsers || []}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#10b981" name="New Users" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>User Retention</CardTitle>
                <CardDescription>
                  Percentage of users returning after registration
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={analytics?.userRetention || []}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="retention" stroke="#0ea5e9" name="Retention %" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Top Users</CardTitle>
              <CardDescription>
                Most active users by contributions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {(analytics?.topUsers || []).map((user: any, index: number) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Badge className="mr-2 h-6 w-6 rounded-full p-0 flex items-center justify-center">
                          {index + 1}
                        </Badge>
                        <span className="font-medium">{user.name}</span>
                        <span className="ml-2 text-muted-foreground">@{user.username}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {user.discussions} discussions, {user.comments} comments
                      </div>
                    </div>
                    <Progress value={user.score} max={100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Distribution</CardTitle>
                <CardDescription>
                  Breakdown of content types
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics?.contentDistribution || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {(analytics?.contentDistribution || []).map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Popular Tags</CardTitle>
                <CardDescription>
                  Most used tags in discussions
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={analytics?.popularTags || []}
                    margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8b5cf6" name="Usage Count" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Top Discussions</CardTitle>
              <CardDescription>
                Most popular discussions by views and engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {(analytics?.topDiscussions || []).map((discussion: any, index: number) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Badge className="mr-2 h-6 w-6 rounded-full p-0 flex items-center justify-center">
                          {index + 1}
                        </Badge>
                        <span className="font-medium">{discussion.title}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {discussion.views} views, {discussion.comments} comments
                      </div>
                    </div>
                    <Progress value={discussion.score} max={100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
                <CardDescription>
                  Key engagement indicators over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={analytics?.engagementMetrics || []}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="commentsPerDiscussion" stroke="#10b981" name="Comments per Discussion" />
                    <Line type="monotone" dataKey="upvotesPerDiscussion" stroke="#0ea5e9" name="Upvotes per Discussion" />
                    <Line type="monotone" dataKey="viewsPerDiscussion" stroke="#8b5cf6" name="Views per Discussion" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Search Analytics</CardTitle>
                <CardDescription>
                  Search volume and effectiveness
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={analytics?.searchAnalytics || []}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="searches" stroke="#f59e0b" name="Search Volume" />
                    <Line type="monotone" dataKey="clickRate" stroke="#ef4444" name="Click-through Rate" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Popular Search Terms</CardTitle>
              <CardDescription>
                Most frequently searched terms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {(analytics?.popularSearchTerms || []).map((term: any, index: number) => (
                  <Badge 
                    key={index} 
                    variant="outline"
                    className="text-sm py-1.5 px-3"
                  >
                    <Search className="mr-1 h-3 w-3" />
                    {term.term} ({term.count})
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Stat Card Component
interface StatCardProps {
  title: string;
  value: number;
  change: number;
  icon: React.FC<{ className?: string }>;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon }) => {
  const isPositive = change >= 0;
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value.toLocaleString()}</h3>
            <p className={`text-sm ${isPositive ? 'text-emerald-600' : 'text-red-600'} mt-1 flex items-center`}>
              {isPositive ? <TrendingUp className="mr-1 h-3 w-3" /> : <Activity className="mr-1 h-3 w-3" />}
              {isPositive ? '+' : ''}{change}%
            </p>
          </div>
          <div className="h-12 w-12 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
            <Icon className="h-6 w-6 text-emerald-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsDashboard;
