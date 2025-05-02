import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import MainLayout from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Loader2, User, Mail, AtSign, FileText, Camera, Link as LinkIcon,
  Github, Twitter, Linkedin, Globe, MapPin, Calendar, Briefcase,
  Trash, AlertCircle, CheckCircle
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ProfileEditPage: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [githubUsername, setGithubUsername] = useState('');
  const [twitterUsername, setTwitterUsername] = useState('');
  const [linkedinUsername, setLinkedinUsername] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [showDeleteAvatarDialog, setShowDeleteAvatarDialog] = useState(false);
  const [theme, setTheme] = useState('system');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load user data
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadUserProfile = async () => {
      setIsLoading(true);
      try {
        const profile = await api.getUserProfile(user.id);
        setName(profile.name || '');
        setUsername(profile.username || '');
        setEmail(profile.email || '');
        setBio(profile.bio || '');

        // Load additional profile data if available
        if (profile.metadata) {
          try {
            const metadata = typeof profile.metadata === 'string'
              ? JSON.parse(profile.metadata)
              : profile.metadata;

            setLocation(metadata.location || '');
            setWebsite(metadata.website || '');
            setCompany(metadata.company || '');
            setJobTitle(metadata.jobTitle || '');
            setGithubUsername(metadata.githubUsername || '');
            setTwitterUsername(metadata.twitterUsername || '');
            setLinkedinUsername(metadata.linkedinUsername || '');
            setTheme(metadata.theme || 'system');
            setEmailNotifications(metadata.emailNotifications !== false); // Default to true
          } catch (parseError) {
            console.error('Error parsing user metadata:', parseError);
          }
        }

        setError(null);
      } catch (err) {
        setError('Failed to load profile data. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [user, navigate]);

  // Handle avatar file selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Avatar image must be less than 5MB',
          variant: 'destructive',
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please select an image file',
          variant: 'destructive',
        });
        return;
      }

      setAvatarFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async () => {
    if (!avatarFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      console.log('Starting avatar upload process...');

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 5;
          return newProgress >= 90 ? 90 : newProgress;
        });
      }, 200);

      // Create a timeout promise to ensure the upload doesn't hang
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Avatar upload timed out')), 15000);
      });

      // Upload avatar using the specialized avatar upload function with timeout
      console.log('Calling uploadAvatar with file:', avatarFile.name);
      const uploadResult = await Promise.race([
        api.uploadAvatar(avatarFile),
        timeoutPromise
      ]) as Attachment;

      console.log('Upload result:', uploadResult);

      // Complete progress
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Store the avatar URL in localStorage as a backup
      try {
        localStorage.setItem('last_avatar_url', uploadResult.url);
        localStorage.setItem('last_avatar_timestamp', new Date().toISOString());
      } catch (storageError) {
        console.error('Failed to store avatar in localStorage:', storageError);
      }

      // Update user profile with new avatar URL
      if (user) {
        console.log('Updating user profile with new avatar URL');
        try {
          await updateUserProfile({
            avatar: uploadResult.url,
            suppressToast: true // Don't show a toast for this update
          });

          // Update the avatar preview with the new URL
          setAvatarPreview(uploadResult.url);

          toast({
            title: 'Avatar updated',
            description: 'Your profile picture has been updated successfully',
          });
        } catch (profileError) {
          console.error('Error updating profile with new avatar:', profileError);

          // Still update the preview even if profile update fails
          setAvatarPreview(uploadResult.url);

          toast({
            title: 'Avatar updated locally',
            description: 'Your profile picture was saved locally but not synced to the server',
            variant: 'warning',
          });
        }
      } else {
        // Just update the preview if we don't have a user
        setAvatarPreview(uploadResult.url);

        toast({
          title: 'Avatar updated locally',
          description: 'Your profile picture was saved locally',
        });
      }

      // Reset upload state but keep the preview
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setAvatarFile(null); // Clear the file selection after successful upload
      }, 500);

    } catch (error) {
      console.error('Error uploading avatar:', error);

      // Try to recover using the file reader as a last resort
      if (avatarFile) {
        try {
          console.log('Attempting emergency fallback for avatar upload');
          const reader = new FileReader();
          reader.onloadend = async () => {
            const dataUrl = reader.result as string;
            setAvatarPreview(dataUrl);

            // Try to update the profile with the data URL
            if (user) {
              try {
                await updateUserProfile({
                  avatar: dataUrl,
                  suppressToast: true
                });

                toast({
                  title: 'Avatar saved locally',
                  description: 'Your profile picture was saved as a local fallback',
                  variant: 'warning',
                });
              } catch (updateError) {
                console.error('Failed to update profile with fallback avatar:', updateError);
              }
            }

            setIsUploading(false);
            setUploadProgress(0);
          };

          reader.onerror = () => {
            console.error('Failed to read avatar file as data URL');
            setIsUploading(false);
            setUploadProgress(0);

            toast({
              title: 'Upload failed',
              description: 'Could not process the image file',
              variant: 'destructive',
            });
          };

          reader.readAsDataURL(avatarFile);
          return; // Exit early as we're handling the state updates in the callbacks
        } catch (fallbackError) {
          console.error('Emergency fallback failed:', fallbackError);
        }
      }

      // If we get here, all fallbacks failed
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload avatar',
        variant: 'destructive',
      });
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Handle avatar deletion
  const handleDeleteAvatar = async () => {
    try {
      console.log('Deleting avatar...');

      if (user) {
        // Call API to update user profile with null avatar
        console.log('Updating user profile to remove avatar');
        const updatedUser = await updateUserProfile({
          ...user,
          avatar: null
        });

        console.log('Avatar deletion successful:', updatedUser);
      }

      // Reset state
      setAvatarFile(null);
      setAvatarPreview(null);
      setShowDeleteAvatarDialog(false);

      toast({
        title: 'Avatar removed',
        description: 'Your profile picture has been removed successfully',
      });
    } catch (error) {
      console.error('Error deleting avatar:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to remove profile picture',
        variant: 'destructive',
      });
      setShowDeleteAvatarDialog(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      console.log('Submitting profile update form...');

      // Upload avatar if changed but not already uploaded via the dedicated button
      let avatarUrl = user?.avatar;
      let avatarUploadFailed = false;

      if (avatarFile) {
        console.log('Avatar file detected in form submission, uploading...');
        try {
          // Create a timeout promise to ensure the upload doesn't hang
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Avatar upload timed out')), 10000);
          });

          // Upload with timeout
          const uploadResult = await Promise.race([
            api.uploadAvatar(avatarFile),
            timeoutPromise
          ]) as Attachment;

          console.log('Avatar upload result during form submission:', uploadResult);
          avatarUrl = uploadResult.url;

          // Update the preview with the new URL
          setAvatarPreview(uploadResult.url);

          // Store in localStorage as backup
          try {
            localStorage.setItem('last_avatar_url', uploadResult.url);
            localStorage.setItem('last_avatar_timestamp', new Date().toISOString());
          } catch (storageError) {
            console.error('Failed to store avatar in localStorage:', storageError);
          }
        } catch (avatarError) {
          console.error('Failed to upload avatar during form submission:', avatarError);
          avatarUploadFailed = true;

          // Try emergency fallback with data URL
          try {
            console.log('Attempting emergency fallback for avatar upload');
            const reader = new FileReader();
            const dataUrlPromise = new Promise<string>((resolve, reject) => {
              reader.onloadend = () => resolve(reader.result as string);
              reader.onerror = reject;
            });
            reader.readAsDataURL(avatarFile);

            const dataUrl = await dataUrlPromise;
            console.log('Created data URL for avatar fallback (length):', dataUrl.length);

            avatarUrl = dataUrl;
            setAvatarPreview(dataUrl);

            // Store in localStorage as backup
            try {
              localStorage.setItem('last_avatar_url', dataUrl);
              localStorage.setItem('last_avatar_timestamp', new Date().toISOString());
            } catch (storageError) {
              console.error('Failed to store avatar in localStorage:', storageError);
            }

            // Continue with form submission with the data URL avatar
            toast({
              title: 'Using local avatar',
              description: 'Your profile will be updated with a locally stored avatar.',
              variant: 'warning',
            });
          } catch (fallbackError) {
            console.error('Emergency avatar fallback failed:', fallbackError);
            // Continue with form submission even if avatar upload fails
            toast({
              title: 'Avatar upload failed',
              description: 'Your profile will be updated without the new avatar.',
              variant: 'destructive',
            });
          }
        }
      } else if (avatarPreview && avatarPreview !== user?.avatar) {
        // If we have a preview but no file, it means the avatar was already uploaded
        console.log('Using previously uploaded avatar:', avatarPreview.substring(0, 50) + '...');
        avatarUrl = avatarPreview;
      }

      // Prepare metadata with additional profile fields
      const metadata = {
        location,
        website,
        company,
        jobTitle,
        githubUsername,
        twitterUsername,
        linkedinUsername,
        theme,
        emailNotifications,
        lastUpdated: new Date().toISOString(),
        // Add flag if we're using a client-side avatar
        avatarIsClientSide: avatarUrl && (avatarUrl.startsWith('data:') || avatarUrl.startsWith('blob:'))
      };

      console.log('Updating profile with data:', {
        name,
        username,
        email,
        bio,
        avatar: avatarUrl ? `${avatarUrl.substring(0, 30)}...` : null,
        metadata: JSON.stringify(metadata).substring(0, 50) + '...'
      });

      // Try to update profile
      try {
        // Update profile
        const updatedUser = await updateUserProfile({
          name,
          username,
          email,
          bio,
          avatar: avatarUrl,
          metadata: JSON.stringify(metadata)
        });

        console.log('Profile update successful:', updatedUser);

        toast({
          title: 'Profile updated',
          description: 'Your profile has been successfully updated.',
        });

        // Clear file selection after successful update
        setAvatarFile(null);

        // Navigate to profile page
        navigate('/profile');
      } catch (updateError) {
        console.error('Profile update API call failed:', updateError);

        // Try to save locally as a fallback
        try {
          // Store profile data in localStorage
          const localProfileData = {
            name,
            username,
            email,
            bio,
            avatar: avatarUrl,
            metadata: JSON.stringify(metadata),
            id: user?.id || 'local-user',
            updated_at: new Date().toISOString()
          };

          localStorage.setItem('user_profile_backup', JSON.stringify(localProfileData));
          console.log('Saved profile data to localStorage as fallback');

          // Update the UI state
          setAvatarPreview(avatarUrl || null);

          toast({
            title: 'Profile saved locally',
            description: 'Your profile was saved locally but could not be synced to the server.',
            variant: 'warning',
          });

          // Don't navigate away since the update wasn't fully successful
        } catch (localSaveError) {
          console.error('Failed to save profile locally:', localSaveError);
          throw updateError; // Re-throw the original error
        }
      }
    } catch (err) {
      console.error('Profile update failed:', err);
      toast({
        title: 'Update failed',
        description: err instanceof Error ? err.message : 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle theme change
  const handleThemeChange = (value: string) => {
    setTheme(value);
  };

  // Handle notification toggle
  const handleNotificationToggle = (checked: boolean) => {
    setEmailNotifications(checked);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="lg" text="Loading profile..." />
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <ErrorMessage
          title="Failed to load profile"
          message={error}
          onRetry={() => window.location.reload()}
        />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="social">Social & Contact</TabsTrigger>
            <TabsTrigger value="account">Account Settings</TabsTrigger>
          </TabsList>

          {/* Profile Information Tab */}
          <TabsContent value="profile">
            <Card>
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your profile information visible to other users
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Avatar Upload */}
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <Avatar className="h-32 w-32 cursor-pointer relative group" onClick={() => fileInputRef.current?.click()}>
                        <AvatarImage src={avatarPreview || user?.avatar} />
                        <AvatarFallback className="text-4xl">
                          {name.charAt(0)}
                        </AvatarFallback>
                        <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Camera className="h-10 w-10 text-white" />
                        </div>
                      </Avatar>

                      {/* Delete avatar button */}
                      {(avatarPreview || user?.avatar) && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
                          onClick={() => setShowDeleteAvatarDialog(true)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />

                    {/* Avatar upload controls */}
                    <div className="flex flex-col items-center gap-2 w-full max-w-xs">
                      {avatarFile && !isUploading ? (
                        <div className="flex gap-2 w-full">
                          <Button
                            type="button"
                            variant="default"
                            size="sm"
                            className="flex-1"
                            onClick={handleAvatarUpload}
                          >
                            <CheckCircle className="mr-2 h-3 w-3" />
                            Upload Avatar
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setAvatarFile(null);
                              setAvatarPreview(user?.avatar || null);
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-2 w-full">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                          >
                            {isUploading ? (
                              <>
                                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Camera className="mr-2 h-3 w-3" />
                                {user?.avatar || avatarPreview ? 'Change Picture' : 'Add Picture'}
                              </>
                            )}
                          </Button>

                          {(user?.avatar || avatarPreview) && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setShowDeleteAvatarDialog(true)}
                            >
                              <Trash className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      )}

                      {isUploading && (
                        <div className="w-full space-y-1">
                          <Progress value={uploadProgress} className="h-2" />
                          <p className="text-xs text-center text-muted-foreground">
                            {uploadProgress}% uploaded
                          </p>
                        </div>
                      )}

                      <p className="text-xs text-muted-foreground mt-1">
                        Recommended: Square image, max 5MB
                      </p>

                      {avatarFile && (
                        <p className="text-xs text-muted-foreground">
                          Selected: {avatarFile.name} ({Math.round(avatarFile.size / 1024)} KB)
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="h-4 w-4" /> Full Name
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                    />
                  </div>

                  {/* Username */}
                  <div className="space-y-2">
                    <Label htmlFor="username" className="flex items-center gap-2">
                      <AtSign className="h-4 w-4" /> Username
                    </Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Your username"
                    />
                    <p className="text-xs text-muted-foreground">
                      This will be your unique identifier across the platform
                    </p>
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" /> Bio
                    </Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about yourself"
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground">
                      {bio.length}/500 characters
                    </p>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label htmlFor="location" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> Location
                    </Label>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="City, Country"
                    />
                  </div>

                  {/* Company & Job Title */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company" className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" /> Company
                      </Label>
                      <Input
                        id="company"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Your company"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jobTitle" className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" /> Job Title
                      </Label>
                      <Input
                        id="jobTitle"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="Your job title"
                      />
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/profile')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          {/* Social & Contact Tab */}
          <TabsContent value="social">
            <Card>
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>Social & Contact Information</CardTitle>
                  <CardDescription>
                    Connect your social profiles and contact information
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Website */}
                  <div className="space-y-2">
                    <Label htmlFor="website" className="flex items-center gap-2">
                      <Globe className="h-4 w-4" /> Website
                    </Label>
                    <Input
                      id="website"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>

                  {/* GitHub */}
                  <div className="space-y-2">
                    <Label htmlFor="github" className="flex items-center gap-2">
                      <Github className="h-4 w-4" /> GitHub
                    </Label>
                    <div className="flex">
                      <div className="bg-muted flex items-center px-3 rounded-l-md border border-r-0 border-input">
                        github.com/
                      </div>
                      <Input
                        id="github"
                        value={githubUsername}
                        onChange={(e) => setGithubUsername(e.target.value)}
                        placeholder="username"
                        className="rounded-l-none"
                      />
                    </div>
                  </div>

                  {/* Twitter */}
                  <div className="space-y-2">
                    <Label htmlFor="twitter" className="flex items-center gap-2">
                      <Twitter className="h-4 w-4" /> Twitter
                    </Label>
                    <div className="flex">
                      <div className="bg-muted flex items-center px-3 rounded-l-md border border-r-0 border-input">
                        twitter.com/
                      </div>
                      <Input
                        id="twitter"
                        value={twitterUsername}
                        onChange={(e) => setTwitterUsername(e.target.value)}
                        placeholder="username"
                        className="rounded-l-none"
                      />
                    </div>
                  </div>

                  {/* LinkedIn */}
                  <div className="space-y-2">
                    <Label htmlFor="linkedin" className="flex items-center gap-2">
                      <Linkedin className="h-4 w-4" /> LinkedIn
                    </Label>
                    <div className="flex">
                      <div className="bg-muted flex items-center px-3 rounded-l-md border border-r-0 border-input">
                        linkedin.com/in/
                      </div>
                      <Input
                        id="linkedin"
                        value={linkedinUsername}
                        onChange={(e) => setLinkedinUsername(e.target.value)}
                        placeholder="username"
                        className="rounded-l-none"
                      />
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/profile')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          {/* Account Settings Tab */}
          <TabsContent value="account">
            <Card>
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Update your account email, password and preferences
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" /> Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                    />
                    <p className="text-xs text-muted-foreground">
                      This email will be used for notifications and account recovery
                    </p>
                  </div>

                  {/* Theme Preference */}
                  <div className="space-y-2">
                    <Label htmlFor="theme" className="flex items-center gap-2">
                      Theme Preference
                    </Label>
                    <Select value={theme} onValueChange={handleThemeChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Email Notifications */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email notifications for replies and mentions
                      </p>
                    </div>
                    <Switch
                      id="notifications"
                      checked={emailNotifications}
                      onCheckedChange={handleNotificationToggle}
                    />
                  </div>

                  {/* Password Change - Link to separate page */}
                  <div className="pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/change-password')}
                      className="w-full"
                    >
                      Change Password
                    </Button>
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/profile')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Avatar Confirmation Dialog */}
      <Dialog open={showDeleteAvatarDialog} onOpenChange={setShowDeleteAvatarDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Profile Picture</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your profile picture? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatarPreview || user?.avatar} />
              <AvatarFallback className="text-2xl">
                {name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteAvatarDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAvatar}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default ProfileEditPage;
