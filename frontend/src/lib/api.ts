
import { 
  User, 
  Discussion, 
  Comment, 
  Notification, 
  Tag,
  Attachment
} from '@/types';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Helper function for making API requests
async function apiRequest<T>(
  endpoint: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', 
  data?: any
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Add auth token if available
  const authToken = localStorage.getItem('auth_token');
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const config: RequestInit = {
    method,
    headers,
    credentials: 'include', // Include cookies for session authentication
  };

  if (data && (method === 'POST' || method === 'PUT')) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }
  
  // Some endpoints might not return JSON
  if (response.headers.get('Content-Type')?.includes('application/json')) {
    return await response.json();
  }
  
  return {} as T;
}

// API service
export const api = {
  // Auth
  async login(email: string, password: string): Promise<User> {
    const response = await apiRequest<{token: string, user: User}>('/auth/login/', 'POST', { email, password });
    localStorage.setItem('auth_token', response.token);
    return response.user;
  },

  async register(userData: Partial<User>): Promise<User> {
    const response = await apiRequest<{token: string, user: User}>('/auth/register/', 'POST', userData);
    localStorage.setItem('auth_token', response.token);
    return response.user;
  },

  async getCurrentUser(): Promise<User> {
    return await apiRequest<User>('/auth/me/');
  },

  // Discussions
  async getDiscussions(filters?: { tag?: string, search?: string }): Promise<Discussion[]> {
    let endpoint = '/discussions/';
    const queryParams = [];
    
    if (filters?.tag) {
      queryParams.push(`tag=${encodeURIComponent(filters.tag)}`);
    }
    
    if (filters?.search) {
      queryParams.push(`search=${encodeURIComponent(filters.search)}`);
    }
    
    if (queryParams.length > 0) {
      endpoint += `?${queryParams.join('&')}`;
    }
    
    return await apiRequest<Discussion[]>(endpoint);
  },

  async getDiscussionById(id: string): Promise<Discussion | null> {
    try {
      return await apiRequest<Discussion>(`/discussions/${id}/`);
    } catch (error) {
      return null;
    }
  },

  async createDiscussion(data: Partial<Discussion>): Promise<Discussion> {
    return await apiRequest<Discussion>('/discussions/', 'POST', data);
  },

  async upvoteDiscussion(id: string): Promise<{ upvotes: number, hasUpvoted: boolean }> {
    return await apiRequest<{ upvotes: number, hasUpvoted: boolean }>(`/discussions/${id}/upvote/`, 'POST');
  },

  // Comments
  async getCommentsByDiscussionId(discussionId: string): Promise<Comment[]> {
    return await apiRequest<Comment[]>(`/discussions/${discussionId}/comments/`);
  },

  async createComment(discussionId: string, data: Partial<Comment>): Promise<Comment> {
    return await apiRequest<Comment>(`/discussions/${discussionId}/comments/`, 'POST', data);
  },

  async upvoteComment(id: string): Promise<{ upvotes: number, hasUpvoted: boolean }> {
    return await apiRequest<{ upvotes: number, hasUpvoted: boolean }>(`/comments/${id}/upvote/`, 'POST');
  },

  // Tags
  async getTags(): Promise<Tag[]> {
    return await apiRequest<Tag[]>('/tags/');
  },

  // Notifications
  async getNotifications(): Promise<Notification[]> {
    return await apiRequest<Notification[]>('/notifications/');
  },

  async markNotificationAsRead(id: string): Promise<void> {
    await apiRequest<void>(`/notifications/${id}/read/`, 'POST');
  },

  async markAllNotificationsAsRead(): Promise<void> {
    await apiRequest<void>('/notifications/read-all/', 'POST');
  },

  // File Upload
  async uploadFile(file: File): Promise<Attachment> {
    const formData = new FormData();
    formData.append('file', file);
    
    const url = `${API_BASE_URL}/files/upload/`;
    const headers: HeadersInit = {};
    
    const authToken = localStorage.getItem('auth_token');
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Upload failed with status ${response.status}`);
    }
    
    return await response.json();
  }
};
