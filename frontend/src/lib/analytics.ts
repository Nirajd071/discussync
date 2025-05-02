import { api } from './api';

// Analytics event types
export type EventType = 
  | 'page_view'
  | 'discussion_view'
  | 'discussion_create'
  | 'comment_create'
  | 'upvote'
  | 'search'
  | 'login'
  | 'register'
  | 'file_upload'
  | 'profile_view'
  | 'tag_click';

// Analytics event data
export interface AnalyticsEvent {
  event_type: EventType;
  user_id?: string;
  content_id?: string;
  content_type?: 'discussion' | 'comment' | 'user' | 'tag';
  metadata?: Record<string, any>;
  timestamp?: string;
}

// Analytics service
export const analytics = {
  // Track an event
  trackEvent: async (eventType: EventType, data: Omit<AnalyticsEvent, 'event_type' | 'timestamp'> = {}) => {
    try {
      // Don't track events in development unless explicitly enabled
      if (process.env.NODE_ENV === 'development' && !localStorage.getItem('enable_analytics_in_dev')) {
        console.log('Analytics event (dev mode):', eventType, data);
        return;
      }
      
      const event: AnalyticsEvent = {
        event_type: eventType,
        timestamp: new Date().toISOString(),
        ...data
      };
      
      // Send event to API
      await api.trackAnalyticsEvent(event);
    } catch (error) {
      // Silently fail analytics to not disrupt user experience
      console.error('Analytics error:', error);
    }
  },
  
  // Track page view
  trackPageView: (path: string, title: string) => {
    analytics.trackEvent('page_view', {
      metadata: { path, title }
    });
  },
  
  // Track discussion view
  trackDiscussionView: (discussionId: string, userId?: string) => {
    analytics.trackEvent('discussion_view', {
      user_id: userId,
      content_id: discussionId,
      content_type: 'discussion'
    });
  },
  
  // Track discussion creation
  trackDiscussionCreate: (discussionId: string, userId?: string) => {
    analytics.trackEvent('discussion_create', {
      user_id: userId,
      content_id: discussionId,
      content_type: 'discussion'
    });
  },
  
  // Track comment creation
  trackCommentCreate: (commentId: string, discussionId: string, userId?: string) => {
    analytics.trackEvent('comment_create', {
      user_id: userId,
      content_id: commentId,
      content_type: 'comment',
      metadata: { discussion_id: discussionId }
    });
  },
  
  // Track upvote
  trackUpvote: (contentId: string, contentType: 'discussion' | 'comment', userId?: string) => {
    analytics.trackEvent('upvote', {
      user_id: userId,
      content_id: contentId,
      content_type: contentType
    });
  },
  
  // Track search
  trackSearch: (query: string, filters: Record<string, any> = {}, userId?: string) => {
    analytics.trackEvent('search', {
      user_id: userId,
      metadata: { query, filters }
    });
  },
  
  // Track login
  trackLogin: (userId: string) => {
    analytics.trackEvent('login', {
      user_id: userId
    });
  },
  
  // Track registration
  trackRegister: (userId: string) => {
    analytics.trackEvent('register', {
      user_id: userId
    });
  },
  
  // Track file upload
  trackFileUpload: (fileId: string, fileType: string, userId?: string) => {
    analytics.trackEvent('file_upload', {
      user_id: userId,
      content_id: fileId,
      metadata: { file_type: fileType }
    });
  },
  
  // Track profile view
  trackProfileView: (profileId: string, viewerId?: string) => {
    analytics.trackEvent('profile_view', {
      user_id: viewerId,
      content_id: profileId,
      content_type: 'user'
    });
  },
  
  // Track tag click
  trackTagClick: (tagName: string, userId?: string) => {
    analytics.trackEvent('tag_click', {
      user_id: userId,
      content_id: tagName,
      content_type: 'tag'
    });
  }
};
