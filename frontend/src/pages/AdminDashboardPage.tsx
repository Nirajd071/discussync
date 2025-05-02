import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  MessageSquare,
  FileCode,
  Tag as TagIcon,
  Shield,
  Settings,
  LogOut,
  Search,
  AlertCircle,
  BarChart2,
  UserPlus,
  UserMinus,
  Flag,
  Trash2,
  Filter,
  Download,
  Calendar,
  Activity,
  TrendingUp,
  Bell,
  Mail,
  Lock,
  Eye,
  EyeOff,
  MoreHorizontal,
  Plus,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Progress } from "@/components/ui/progress";
import ContentModerationTab from "@/components/admin/ContentModerationTab";
import DevNavigation from '@/components/Layout/DevNavigation';

const AdminDashboardPage = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for demonstration
  const recentUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user', status: 'active', joined: '2024-03-15', lastActive: '2024-03-20', posts: 25, reports: 0 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'moderator', status: 'active', joined: '2024-03-14', lastActive: '2024-03-19', posts: 45, reports: 1 },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user', status: 'suspended', joined: '2024-03-13', lastActive: '2024-03-18', posts: 12, reports: 3 },
  ];

  const recentDiscussions = [
    { id: 1, title: 'React vs Vue', author: 'John Doe', status: 'active', reports: 0, views: 1200, comments: 45, createdAt: '2024-03-15' },
    { id: 2, title: 'Best Practices for API Design', author: 'Jane Smith', status: 'active', reports: 2, views: 800, comments: 32, createdAt: '2024-03-14' },
    { id: 3, title: 'Getting Started with TypeScript', author: 'Bob Johnson', status: 'flagged', reports: 5, views: 1500, comments: 67, createdAt: '2024-03-13' },
  ];

  const stats = [
    { label: 'Total Users', value: '10,234', icon: Users, change: '+12%', trend: 'up' },
    { label: 'Active Discussions', value: '5,678', icon: MessageSquare, change: '+8%', trend: 'up' },
    { label: 'Projects Shared', value: '2,345', icon: FileCode, change: '+15%', trend: 'up' },
    { label: 'Tags Created', value: '456', icon: TagIcon, change: '+5%', trend: 'up' },
  ];

  const activityLog = [
    { id: 1, action: 'User Suspended', user: 'Admin', target: 'Bob Johnson', timestamp: '2024-03-20 14:30', type: 'warning' },
    { id: 2, action: 'Discussion Flagged', user: 'Moderator', target: 'React vs Vue', timestamp: '2024-03-20 13:45', type: 'info' },
    { id: 3, action: 'New User Registered', user: 'System', target: 'Alice Brown', timestamp: '2024-03-20 12:15', type: 'success' },
  ];

  const handleAction = (action: string, id: number) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      toast({
        title: 'Action Performed',
        description: `${action} for item ${id}`,
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleExport = (type: string) => {
    toast({
      title: 'Export Started',
      description: `Exporting ${type} data...`,
    });
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate data refresh
    setTimeout(() => {
      toast({
        title: 'Data Refreshed',
        description: 'All data has been updated',
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-emerald-100 dark:border-emerald-800/30">
        <div className="container py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-emerald-600" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 border-emerald-200 dark:border-emerald-800/30 focus-visible:ring-emerald-500"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleRefresh}
                disabled={isLoading}
                className="border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800/30 dark:hover:bg-emerald-950/20"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800/30 dark:hover:bg-emerald-950/20">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link to="/admin/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/admin/notifications" className="flex items-center">
                      <Bell className="mr-2 h-4 w-4" />
                      Notifications
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/analytics" className="flex items-center">
                      <BarChart2 className="mr-2 h-4 w-4" />
                      Analytics
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to="/login" className="flex items-center text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 border-emerald-100 dark:border-emerald-800/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                  <p className={`text-sm ${stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'} mt-1`}>
                    {stat.change}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-white dark:bg-gray-900 border border-emerald-100 dark:border-emerald-800/30">
            <TabsTrigger value="users" className="data-[state=active]:bg-emerald-50 dark:data-[state=active]:bg-emerald-950/20">
              Users
            </TabsTrigger>
            <TabsTrigger value="discussions" className="data-[state=active]:bg-emerald-50 dark:data-[state=active]:bg-emerald-950/20">
              Discussions
            </TabsTrigger>
            <TabsTrigger value="moderation" className="data-[state=active]:bg-emerald-50 dark:data-[state=active]:bg-emerald-950/20">
              Moderation
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-emerald-50 dark:data-[state=active]:bg-emerald-950/20">
              Activity Log
            </TabsTrigger>
            <TabsTrigger value="devtools" className="data-[state=active]:bg-emerald-50 dark:data-[state=active]:bg-emerald-950/20">
              Developer Tools
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="border-emerald-100 dark:border-emerald-800/30">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">User Management</h2>
                  <div className="flex items-center gap-4">
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="w-[180px] border-emerald-200 dark:border-emerald-800/30">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      onClick={() => handleExport('users')}
                      className="border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800/30 dark:hover:bg-emerald-950/20"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add User
                    </Button>
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead>Posts</TableHead>
                      <TableHead>Reports</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.joined}</TableCell>
                        <TableCell>{user.lastActive}</TableCell>
                        <TableCell>{user.posts}</TableCell>
                        <TableCell>{user.reports}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleAction('View Profile', user.id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleAction('Send Message', user.id)}>
                                <Mail className="mr-2 h-4 w-4" />
                                Send Message
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleAction('Suspend', user.id)}>
                                <UserMinus className="mr-2 h-4 w-4" />
                                Suspend
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleAction('Delete', user.id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          {/* Discussions Tab */}
          <TabsContent value="discussions" className="space-y-6">
            <Card className="border-emerald-100 dark:border-emerald-800/30">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Discussion Management</h2>
                  <div className="flex items-center gap-4">
                    <DateRangePicker
                      value={selectedDateRange}
                      onChange={setSelectedDateRange}
                      className="border-emerald-200 dark:border-emerald-800/30"
                    />
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="w-[180px] border-emerald-200 dark:border-emerald-800/30">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="flagged">Flagged</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      onClick={() => handleExport('discussions')}
                      className="border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800/30 dark:hover:bg-emerald-950/20"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Reports</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Comments</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentDiscussions.map((discussion) => (
                      <TableRow key={discussion.id}>
                        <TableCell>{discussion.title}</TableCell>
                        <TableCell>{discussion.author}</TableCell>
                        <TableCell>
                          <Badge variant={discussion.status === 'active' ? 'default' : 'destructive'}>
                            {discussion.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{discussion.reports}</TableCell>
                        <TableCell>{discussion.views}</TableCell>
                        <TableCell>{discussion.comments}</TableCell>
                        <TableCell>{discussion.createdAt}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleAction('View Discussion', discussion.id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Discussion
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleAction('Flag', discussion.id)}>
                                <Flag className="mr-2 h-4 w-4" />
                                Flag
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleAction('Delete', discussion.id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          {/* Moderation Tab */}
          <TabsContent value="moderation" className="space-y-6">
            <ContentModerationTab />
          </TabsContent>

          {/* Activity Log Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card className="border-emerald-100 dark:border-emerald-800/30">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Activity Log</h2>
                  <Button
                    variant="outline"
                    onClick={() => handleExport('activity')}
                    className="border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800/30 dark:hover:bg-emerald-950/20"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export Log
                  </Button>
                </div>
                <div className="space-y-4">
                  {activityLog.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-emerald-100 dark:border-emerald-800/30"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          activity.type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                          activity.type === 'info' ? 'bg-blue-100 dark:bg-blue-900/20' :
                          'bg-emerald-100 dark:bg-emerald-900/20'
                        }`}>
                          {activity.type === 'warning' ? <AlertCircle className="h-5 w-5 text-yellow-600" /> :
                           activity.type === 'info' ? <Bell className="h-5 w-5 text-blue-600" /> :
                           <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                        </div>
                        <div>
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">
                            by {activity.user} • {activity.target}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{activity.timestamp}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Developer Tools Tab */}
          <TabsContent value="devtools" className="space-y-6">
            <Card className="border-emerald-100 dark:border-emerald-800/30">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Developer Tools</h2>
                  <Button
                    variant="outline"
                    onClick={handleRefresh}
                    disabled={isLoading}
                    className="border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800/30 dark:hover:bg-emerald-950/20"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
                <DevNavigation />
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboardPage;