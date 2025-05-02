import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { FileUp, ThumbsUp, MessageSquare, Filter, Search, Upload, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const ProjectsPage = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await api.getProjects();
        setProjects(data);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        toast({
          title: 'Error',
          description: 'Failed to load projects. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [toast]);

  // Handle project upload
  const handleUploadProject = async () => {
    if (!uploadTitle || !uploadDescription || !uploadFile) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all fields and select a file to upload.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setUploading(true);
      const newProject = await api.uploadProject(uploadTitle, uploadDescription, uploadFile);

      // Add the new project to the list
      setProjects([newProject, ...projects]);

      // Reset form
      setUploadTitle('');
      setUploadDescription('');
      setUploadFile(null);
      setUploadDialogOpen(false);

      toast({
        title: 'Success',
        description: 'Project uploaded successfully!',
      });
    } catch (error) {
      console.error('Failed to upload project:', error);
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload project. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  // Handle upvote
  const handleUpvote = async (projectId: string) => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to upvote projects.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const result = await api.upvoteProject(projectId);

      // Update the project in the list
      setProjects(projects.map(project =>
        project.id === projectId
          ? { ...project, upvote_count: result.upvotes, has_upvoted: result.hasUpvoted }
          : project
      ));
    } catch (error) {
      console.error('Failed to upvote project:', error);
      toast({
        title: 'Error',
        description: 'Failed to upvote project. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Filter projects based on search query
  const filteredProjects = searchQuery
    ? projects.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : projects;

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 1) return 'today';
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
              Projects
            </h1>
            <p className="text-muted-foreground">
              Browse and download projects shared by our community members.
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800/30 dark:hover:bg-emerald-950/20"
            >
              <Filter className="h-4 w-4 mr-2" /> Filter
            </Button>

            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                  disabled={!isAuthenticated}
                  onClick={() => {
                    if (!isAuthenticated) {
                      toast({
                        title: 'Authentication required',
                        description: 'Please log in to upload projects.',
                        variant: 'destructive',
                      });
                    }
                  }}
                >
                  <Upload className="h-4 w-4 mr-2" /> Upload Project
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Upload Project</DialogTitle>
                  <DialogDescription>
                    Share your project with the community. Fill in the details and upload your file.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Title
                    </Label>
                    <Input
                      id="title"
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={uploadDescription}
                      onChange={(e) => setUploadDescription(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="file" className="text-right">
                      File
                    </Label>
                    <Input
                      id="file"
                      type="file"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setUploadFile(e.target.files[0]);
                        }
                      }}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleUploadProject}
                    disabled={uploading || !uploadTitle || !uploadDescription || !uploadFile}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      'Upload'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search projects..."
            className="pl-10 border-emerald-200 dark:border-emerald-800/30 focus-visible:ring-emerald-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            <span className="ml-2 text-lg text-muted-foreground">Loading projects...</span>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No projects found.</p>
            {searchQuery && (
              <p className="mt-2">
                Try a different search term or{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto text-emerald-600"
                  onClick={() => setSearchQuery('')}
                >
                  clear the search
                </Button>
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((project) => (
              <Card
                key={project.id}
                className="border-emerald-100 dark:border-emerald-800/30 shadow-lg dark:shadow-emerald-900/10 transition-all duration-300 hover:shadow-xl"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center mb-2">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={project.author.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{project.author.name?.charAt(0) || project.author.username?.charAt(0) || '?'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{project.author.name || project.author.username}</div>
                      <div className="text-xs text-muted-foreground">{formatDate(project.created_at)}</div>
                    </div>
                  </div>
                  <CardTitle className="text-xl text-emerald-900 dark:text-emerald-100">{project.title}</CardTitle>
                  <CardDescription className="mt-2">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/20 rounded-md p-3">
                    <div className="flex items-center">
                      <FileUp className="h-4 w-4 mr-2 text-emerald-600" />
                      <span className="text-sm">{project.file_name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatFileSize(project.file_size)}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center mr-4 p-0 h-auto hover:bg-transparent"
                      onClick={() => handleUpvote(project.id)}
                    >
                      <ThumbsUp className={`h-4 w-4 mr-1 ${project.has_upvoted ? 'text-emerald-600 fill-emerald-600' : ''}`} />
                      {project.upvote_count}
                    </Button>
                    <span className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1 text-emerald-600" /> {project.comment_count}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800/30 dark:hover:bg-emerald-950/20"
                    onClick={() => window.open(project.file_path, '_blank')}
                  >
                    Download
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ProjectsPage;
