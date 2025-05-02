import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Bell, BellOff, MessageSquare, ThumbsUp, AtSign, Users, Clock, Save, Loader2 } from 'lucide-react';

interface NotificationSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  notification_frequency: 'immediate' | 'daily' | 'weekly' | 'never';
  notify_on_new_comment: boolean;
  notify_on_comment_reply: boolean;
  notify_on_upvote: boolean;
  notify_on_mention: boolean;
  notify_on_follow: boolean;
  notify_on_new_discussion_in_followed_tag: boolean;
  notify_on_system_updates: boolean;
}

const NotificationSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<NotificationSettings>({
    email_notifications: true,
    push_notifications: true,
    notification_frequency: 'immediate',
    notify_on_new_comment: true,
    notify_on_comment_reply: true,
    notify_on_upvote: true,
    notify_on_mention: true,
    notify_on_follow: true,
    notify_on_new_discussion_in_followed_tag: true,
    notify_on_system_updates: true
  });

  // Load notification settings
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadSettings = async () => {
      setIsLoading(true);
      try {
        console.log('Loading notification settings for user:', user.id);
        const data = await api.getNotificationSettings();
        console.log('Loaded notification settings:', data);

        if (data) {
          setSettings(data);
          setError(null);
        } else {
          throw new Error('Notification settings data is empty');
        }
      } catch (err) {
        console.error('Failed to load notification settings:', err);
        setError('Failed to load notification settings. Please try again.');

        // In development mode, continue with default settings
        if (process.env.NODE_ENV === 'development') {
          console.warn('Using default notification settings in development mode');
          // Keep the default settings that were set in useState
          setError(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [user, navigate]);

  // Handle settings change
  const handleSettingChange = (key: keyof NotificationSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await api.updateNotificationSettings(settings);

      toast({
        title: 'Settings saved',
        description: 'Your notification preferences have been updated.',
      });
    } catch (err) {
      console.error('Failed to save notification settings:', err);
      toast({
        title: 'Save failed',
        description: 'Failed to update notification settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="lg" text="Loading notification settings..." />
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <ErrorMessage
          title="Failed to load settings"
          message={error}
          onRetry={() => window.location.reload()}
        />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Notification Settings</h1>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Delivery Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Preferences</CardTitle>
                <CardDescription>
                  Choose how you want to receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email_notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    id="email_notifications"
                    checked={settings.email_notifications}
                    onCheckedChange={(checked) => handleSettingChange('email_notifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push_notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications in your browser
                    </p>
                  </div>
                  <Switch
                    id="push_notifications"
                    checked={settings.push_notifications}
                    onCheckedChange={(checked) => handleSettingChange('push_notifications', checked)}
                  />
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  <Label htmlFor="notification_frequency">Notification Frequency</Label>
                  <RadioGroup
                    id="notification_frequency"
                    value={settings.notification_frequency}
                    onValueChange={(value) => handleSettingChange('notification_frequency', value)}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="immediate" id="immediate" />
                      <Label htmlFor="immediate" className="cursor-pointer">
                        Immediate - Send notifications as they happen
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="daily" id="daily" />
                      <Label htmlFor="daily" className="cursor-pointer">
                        Daily Digest - Send a daily summary
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="weekly" id="weekly" />
                      <Label htmlFor="weekly" className="cursor-pointer">
                        Weekly Digest - Send a weekly summary
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="never" id="never" />
                      <Label htmlFor="never" className="cursor-pointer">
                        Never - Don't send any notifications
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            {/* Notification Types */}
            <Card>
              <CardHeader>
                <CardTitle>Notification Types</CardTitle>
                <CardDescription>
                  Choose which types of notifications you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor="notify_on_new_comment">New comments on your discussions</Label>
                  </div>
                  <Switch
                    id="notify_on_new_comment"
                    checked={settings.notify_on_new_comment}
                    onCheckedChange={(checked) => handleSettingChange('notify_on_new_comment', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor="notify_on_comment_reply">Replies to your comments</Label>
                  </div>
                  <Switch
                    id="notify_on_comment_reply"
                    checked={settings.notify_on_comment_reply}
                    onCheckedChange={(checked) => handleSettingChange('notify_on_comment_reply', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ThumbsUp className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor="notify_on_upvote">Upvotes on your content</Label>
                  </div>
                  <Switch
                    id="notify_on_upvote"
                    checked={settings.notify_on_upvote}
                    onCheckedChange={(checked) => handleSettingChange('notify_on_upvote', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AtSign className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor="notify_on_mention">Mentions (@username)</Label>
                  </div>
                  <Switch
                    id="notify_on_mention"
                    checked={settings.notify_on_mention}
                    onCheckedChange={(checked) => handleSettingChange('notify_on_mention', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor="notify_on_follow">New followers</Label>
                  </div>
                  <Switch
                    id="notify_on_follow"
                    checked={settings.notify_on_follow}
                    onCheckedChange={(checked) => handleSettingChange('notify_on_follow', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor="notify_on_new_discussion_in_followed_tag">
                      New discussions in followed tags
                    </Label>
                  </div>
                  <Switch
                    id="notify_on_new_discussion_in_followed_tag"
                    checked={settings.notify_on_new_discussion_in_followed_tag}
                    onCheckedChange={(checked) => handleSettingChange('notify_on_new_discussion_in_followed_tag', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor="notify_on_system_updates">System updates and announcements</Label>
                  </div>
                  <Switch
                    id="notify_on_system_updates"
                    checked={settings.notify_on_system_updates}
                    onCheckedChange={(checked) => handleSettingChange('notify_on_system_updates', checked)}
                  />
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
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Settings
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            {/* Unsubscribe from All */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BellOff className="h-5 w-5 mr-2 text-muted-foreground" />
                  Unsubscribe from All
                </CardTitle>
                <CardDescription>
                  Turn off all notifications across all channels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  This will disable all notifications, including email and push notifications.
                  You can re-enable notifications at any time.
                </p>
                <Button
                  variant="destructive"
                  onClick={() => {
                    // Set all notification settings to false
                    const disabledSettings = Object.keys(settings).reduce((acc, key) => {
                      if (key === 'notification_frequency') {
                        return { ...acc, [key]: 'never' };
                      }
                      return { ...acc, [key]: false };
                    }, {} as NotificationSettings);

                    setSettings(disabledSettings as NotificationSettings);

                    toast({
                      title: 'All notifications disabled',
                      description: 'You have unsubscribed from all notifications. Remember to save your changes.',
                    });
                  }}
                >
                  Unsubscribe from All Notifications
                </Button>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default NotificationSettingsPage;
