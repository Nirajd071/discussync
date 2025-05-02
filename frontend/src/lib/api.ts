
import {
  User,
  Discussion,
  Comment,
  Notification,
  Tag,
  Attachment
} from '@/types';

// API Configuration
// Force using the local backend server URL
const API_BASE_URL = 'http://localhost:8005/api';
console.log('Using API base URL:', API_BASE_URL);

// Helper function for making API requests
async function apiRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any,
  retryOnAuth: boolean = true
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`API Request: ${method} ${url}`);

  // Set up headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Add auth token if available
  const authToken = localStorage.getItem('auth_token');
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
    console.log('Using auth token:', authToken.substring(0, 10) + '...');
  } else {
    console.log('No auth token available');
    // If this is an authenticated endpoint and we're not on login/register or public endpoints
    // Note: POST to /discussions/ requires authentication
    if (endpoint !== '/auth/login/' &&
        endpoint !== '/auth/login-json/' &&
        endpoint !== '/auth/register/' &&
        !endpoint.startsWith('/tags') &&
        !(endpoint.startsWith('/discussions') && method === 'GET') &&
        endpoint !== '/auth/test/') {
      console.warn('Attempting to access authenticated endpoint without token');
      // Don't automatically redirect, let the caller handle the error
      if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
        throw new Error('Authentication required. Please log in.');
      }
    }
  }

  const config: RequestInit = {
    method,
    headers,
    // Include credentials for cross-origin requests
    credentials: 'include', // Include cookies for session authentication
  };

  if (data && (method === 'POST' || method === 'PUT' || method === 'DELETE')) {
    config.body = JSON.stringify(data);
    console.log('Request body:', data);
  }

  try {
    console.log('Sending request with config:', { method, headers: { ...headers, Authorization: headers.Authorization ? 'Bearer ***' : undefined } });

    // Add timeout to fetch requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    let response;
    try {
      response = await fetch(url, {
        ...config,
        signal: controller.signal
      });

      // Clear the timeout
      clearTimeout(timeoutId);

      console.log(`Response status: ${response.status}`);

      if (!response.ok) {
        // Handle authentication errors
        if (response.status === 401) {
          console.error('Authentication failed - token may be expired');

          // Clear the invalid token
          localStorage.removeItem('auth_token');

          // Don't automatically redirect, throw an error that the caller can handle
          throw new Error('Authentication failed. Please log in again.');
        }

        try {
          const errorData = await response.json();
          console.error('API error response:', errorData);
          throw new Error(errorData.detail || errorData.message || `Request failed with status ${response.status}`);
        } catch (jsonError) {
          console.error('Failed to parse error response:', jsonError);
          throw new Error(`Request failed with status ${response.status}`);
        }
      }
    } catch (fetchError) {
      // Clear the timeout to prevent memory leaks
      clearTimeout(timeoutId);

      // Handle timeout errors
      if (fetchError.name === 'AbortError') {
        console.error('Request timed out');
        throw new Error('Request timed out. Please try again.');
      }

      throw fetchError;
    }

    // Some endpoints might not return JSON
    if (response.headers.get('Content-Type')?.includes('application/json')) {
      const jsonData = await response.json();
      console.log('Response data:', jsonData);
      return jsonData;
    }

    // For non-JSON responses
    return {} as T;
  } catch (error) {
    console.error(`API request failed: ${method} ${url}`, error);
    throw error;
  }
}

// API service
export const api = {
  // Auth
  async login(email: string, password: string): Promise<User> {
    console.log('API: Sending login request with data:', { email, password });
    try {
      // First try the JSON endpoint
      try {
        const url = `${API_BASE_URL}/auth/login-json/`;
        console.log('API: Login URL (JSON):', url);

        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };

        const config: RequestInit = {
          method: 'POST',
          headers,
          body: JSON.stringify({ email, password })
        };

        console.log('API: Login config (JSON):', { method: 'POST', headers });

        const response = await fetch(url, config);
        console.log('API: Login response status (JSON):', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('API: Login response data (JSON):', data);

          localStorage.setItem('auth_token', data.token);
          return data.user;
        } else {
          console.log('JSON login failed, trying form-based login');
        }
      } catch (jsonError) {
        console.error('JSON login failed, trying form-based login:', jsonError);
      }

      // Fall back to form-based login
      const url = `${API_BASE_URL}/auth/login/`;
      console.log('API: Login URL (form):', url);

      const headers: HeadersInit = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };

      // Convert to form data format that OAuth2PasswordRequestForm expects
      const formData = new URLSearchParams();
      formData.append('username', email); // FastAPI OAuth2 expects 'username' field
      formData.append('password', password);

      const config: RequestInit = {
        method: 'POST',
        headers,
        body: formData
      };

      console.log('API: Login config (form):', { method: 'POST', headers });

      const response = await fetch(url, config);
      console.log('API: Login response status (form):', response.status);

      if (!response.ok) {
        try {
          const errorData = await response.json();
          console.error('API: Login error response:', errorData);
          throw new Error(errorData.detail || errorData.message || `Request failed with status ${response.status}`);
        } catch (jsonError) {
          console.error('API: Failed to parse error response:', jsonError);
          throw new Error(`Request failed with status ${response.status}`);
        }
      }

      const data = await response.json();
      console.log('API: Login response data (form):', data);

      localStorage.setItem('auth_token', data.token);
      return data.user;
    } catch (error) {
      console.error('API: Login request failed:', error);
      throw error;
    }
  },

  async register(userData: any): Promise<User> {
    console.log('API: Sending registration request with data:', userData);
    try {
      // Use fetch directly instead of going through the helper function
      const url = `${API_BASE_URL}/auth/register/`;
      console.log('API: Registration URL:', url);

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      const config: RequestInit = {
        method: 'POST',
        headers,
        // Don't include credentials for now
        // credentials: 'include',
        body: JSON.stringify(userData)
      };

      console.log('API: Registration config:', config);

      const response = await fetch(url, config);
      console.log('API: Registration response status:', response.status);

      if (!response.ok) {
        try {
          const errorData = await response.json();
          console.error('API: Registration error response:', errorData);
          throw new Error(errorData.detail || errorData.message || `Request failed with status ${response.status}`);
        } catch (jsonError) {
          console.error('API: Failed to parse error response:', jsonError);
          throw new Error(`Request failed with status ${response.status}`);
        }
      }

      const data = await response.json();
      console.log('API: Registration response data:', data);

      localStorage.setItem('auth_token', data.token);
      return data.user;
    } catch (error) {
      console.error('API: Registration request failed:', error);
      throw error;
    }
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
      console.log(`Fetching discussion with ID: ${id}`);
      const result = await apiRequest<Discussion>(`/discussions/${id}/`);
      console.log(`Successfully fetched discussion:`, result);
      return result;
    } catch (error) {
      console.error(`Error fetching discussion with ID ${id}:`, error);
      // Check if it's a 404 error
      if (error.message && (error.message.includes('404') || error.message.includes('not found'))) {
        console.warn(`Discussion with ID ${id} not found`);
        return null;
      }
      // For other errors, rethrow
      throw error;
    }
  },

  async createDiscussion(data: Partial<Discussion>): Promise<Discussion> {
    try {
      console.log('Creating discussion with data:', data);

      // Check if user is authenticated
      const authToken = localStorage.getItem('auth_token');
      if (!authToken) {
        console.error('Cannot create discussion: No authentication token found');
        throw new Error('Authentication required to create a discussion. Please log in.');
      }

      // Make the API request
      try {
        const result = await apiRequest<Discussion>('/discussions/', 'POST', data);
        console.log('Discussion created successfully:', result);
        return result;
      } catch (apiError) {
        console.error('API error creating discussion:', apiError);
        // If it's an authentication error, handle it specially
        if (apiError.message && apiError.message.includes('Authentication')) {
          throw new Error('Authentication required to create a discussion. Please log in.');
        }
        throw apiError;
      }
    } catch (error) {
      console.error('Failed to create discussion:', error);
      throw error;
    }
  },

  async upvoteDiscussion(id: string): Promise<{ upvotes: number, hasUpvoted: boolean }> {
    return await apiRequest<{ upvotes: number, hasUpvoted: boolean }>(`/discussions/${id}/upvote/`, 'POST');
  },

  // Comments
  async getCommentsByDiscussionId(discussionId: string): Promise<Comment[]> {
    try {
      console.log(`Fetching comments for discussion ID: ${discussionId}`);

      // Check if user is authenticated
      const authToken = localStorage.getItem('auth_token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      // Make direct fetch request for better debugging
      const url = `${API_BASE_URL}/discussions/${discussionId}/comments/`;
      console.log(`Making request to: ${url}`);

      // Add a timestamp to prevent caching
      const nocacheUrl = `${url}?_nocache=${Date.now()}`;

      const response = await fetch(nocacheUrl, {
        method: 'GET',
        headers,
        credentials: 'include',
        cache: 'no-store' // Ensure we don't use cached responses
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to fetch comments with status ${response.status}:`, errorText);

        if (response.status === 404) {
          console.warn(`Discussion with ID ${discussionId} not found when fetching comments`);
          return [];
        }

        throw new Error(`Failed to fetch comments: ${errorText || response.statusText}`);
      }

      const result = await response.json();
      console.log(`Successfully fetched ${result.length} comments:`, result);

      if (!Array.isArray(result)) {
        console.error('API returned non-array response for comments:', result);
        return [];
      }

      // Convert date strings to Date objects for frontend compatibility
      const processedComments = result.map(comment => {
        // Log each comment for debugging
        console.log('Processing comment:', {
          id: comment.id,
          content: comment.content?.substring(0, 20) + '...',
          hasReplies: comment.replies && comment.replies.length > 0,
          replyCount: comment.replies?.length || 0
        });

        return {
          ...comment,
          id: comment.id,
          content: comment.content,
          createdAt: new Date(comment.created_at || comment.createdAt),
          updatedAt: comment.updated_at || comment.updatedAt ? new Date(comment.updated_at || comment.updatedAt) : undefined,
          hasUpvoted: comment.has_upvoted || comment.hasUpvoted || false,
          parentId: comment.parent_id || comment.parentId,
          mentionedUsers: comment.mentioned_users || comment.mentionedUsers || [],
          // Process replies recursively
          replies: (comment.replies || []).map(reply => ({
            ...reply,
            id: reply.id,
            content: reply.content,
            createdAt: new Date(reply.created_at || reply.createdAt),
            updatedAt: reply.updated_at || reply.updatedAt ? new Date(reply.updated_at || reply.updatedAt) : undefined,
            hasUpvoted: reply.has_upvoted || reply.hasUpvoted || false,
            parentId: reply.parent_id || reply.parentId || comment.id,
            mentionedUsers: reply.mentioned_users || reply.mentionedUsers || []
          }))
        };
      });

      console.log('Processed comments for frontend:', processedComments);
      return processedComments;
    } catch (error) {
      console.error(`Error fetching comments for discussion ID ${discussionId}:`, error);
      // For all errors, return empty array to prevent UI crashes
      return [];
    }
  },

  async createComment(discussionId: string, data: Partial<Comment>): Promise<Comment> {
    try {
      console.log(`Creating comment for discussion ID: ${discussionId} with data:`, data);

      // Check if user is authenticated
      const authToken = localStorage.getItem('auth_token');
      if (!authToken) {
        console.error('Cannot create comment: No authentication token found');
        throw new Error('Authentication required to post a comment. Please log in.');
      }

      // Make the API request with explicit headers
      const url = `${API_BASE_URL}/discussions/${discussionId}/comments/`;
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      };

      console.log('Sending comment with headers:', {
        ...headers,
        Authorization: 'Bearer ***' // Masked for logging
      });

      // Prepare the request body - convert parentId to parent_id for backend compatibility
      const requestData = {
        content: data.content,
        parent_id: data.parentId // Convert to snake_case for backend
      };

      // Debug the parent_id
      if (data.parentId) {
        console.log(`Parent ID type: ${typeof data.parentId}`);
        console.log(`Parent ID value: ${data.parentId}`);
      }

      console.log('Sending comment data:', {
        ...requestData,
        content: requestData.content?.substring(0, 20) + '...' // Truncate content for logging
      });

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestData),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Comment creation failed with status ${response.status}:`, errorText);

        // Try to parse as JSON, but handle text response too
        let errorMessage = `Failed to post comment (${response.status})`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (e) {
          // If not valid JSON, use the text as is if it's not empty
          if (errorText && errorText.trim()) {
            errorMessage = errorText;
          }
        }

        // Handle specific error cases
        if (response.status === 401) {
          throw new Error('Authentication required to post a comment. Please log in again.');
        }

        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Comment created successfully:', result);

      // Process the result for frontend compatibility
      const processedComment = {
        ...result,
        createdAt: new Date(result.created_at || result.createdAt),
        updatedAt: result.updated_at || result.updatedAt ? new Date(result.updated_at || result.updatedAt) : undefined,
        hasUpvoted: result.has_upvoted || result.hasUpvoted || false,
        parentId: result.parent_id || result.parentId,
        mentionedUsers: result.mentioned_users || result.mentionedUsers || [],
        replies: [] // New comments start with empty replies
      };

      console.log('Processed comment for frontend:', processedComment);
      return processedComment;
    } catch (error) {
      console.error('Failed to create comment:', error);
      throw error;
    }
  },

  async upvoteComment(id: string): Promise<{ upvotes: number, hasUpvoted: boolean }> {
    try {
      console.log(`Upvoting comment with ID: ${id}`);

      // Check if user is authenticated
      const authToken = localStorage.getItem('auth_token');
      if (!authToken) {
        console.error('Cannot upvote comment: No authentication token found');
        throw new Error('Authentication required to upvote. Please log in.');
      }

      // First, determine if this is a top-level comment or a reply by checking for parent_id
      // We'll need to make a request to the appropriate endpoint

      // For now, we'll use the comments endpoint
      const url = `${API_BASE_URL}/discussions/any/comments/${id}/upvote/`;
      const headers: HeadersInit = {
        'Authorization': `Bearer ${authToken}`
      };

      console.log(`Making POST request to: ${url}`);

      const response = await fetch(url, {
        method: 'POST',
        headers,
        credentials: 'include'
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Comment upvote failed with status ${response.status}:`, errorText);

        // Try to parse as JSON, but handle text response too
        let errorMessage = `Failed to upvote (${response.status})`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (e) {
          // If not valid JSON, use the text as is if it's not empty
          if (errorText && errorText.trim()) {
            errorMessage = errorText;
          }
        }

        // Handle specific error cases
        if (response.status === 401) {
          throw new Error('Authentication required to upvote. Please log in again.');
        }

        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Upvote successful:', result);
      return {
        upvotes: result.upvotes,
        hasUpvoted: result.hasUpvoted
      };
    } catch (error) {
      console.error('Failed to upvote comment:', error);
      throw error;
    }
  },

  async upvoteReply(commentId: string, replyId: string): Promise<{ upvotes: number, hasUpvoted: boolean }> {
    try {
      console.log(`Upvoting reply with ID: ${replyId} for comment: ${commentId}`);

      // Check if user is authenticated
      const authToken = localStorage.getItem('auth_token');
      if (!authToken) {
        console.error('Cannot upvote reply: No authentication token found');
        throw new Error('Authentication required to upvote. Please log in.');
      }

      const url = `${API_BASE_URL}/comments/${commentId}/replies/${replyId}/upvote/`;
      const headers: HeadersInit = {
        'Authorization': `Bearer ${authToken}`
      };

      console.log(`Making POST request to: ${url}`);

      const response = await fetch(url, {
        method: 'POST',
        headers,
        credentials: 'include'
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Reply upvote failed with status ${response.status}:`, errorText);

        // Try to parse as JSON, but handle text response too
        let errorMessage = `Failed to upvote (${response.status})`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (e) {
          // If not valid JSON, use the text as is if it's not empty
          if (errorText && errorText.trim()) {
            errorMessage = errorText;
          }
        }

        // Handle specific error cases
        if (response.status === 401) {
          throw new Error('Authentication required to upvote. Please log in again.');
        }

        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Reply upvote successful:', result);
      return {
        upvotes: result.upvotes,
        hasUpvoted: result.hasUpvoted
      };
    } catch (error) {
      console.error('Failed to upvote reply:', error);
      throw error;
    }
  },

  // Replies
  async getRepliesByCommentId(commentId: string): Promise<Comment[]> {
    try {
      console.log(`Fetching replies for comment ID: ${commentId}`);

      // Check if user is authenticated
      const authToken = localStorage.getItem('auth_token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      // Make direct fetch request for better debugging
      const url = `${API_BASE_URL}/comments/${commentId}/replies/`;
      console.log(`Making request to: ${url}`);

      // Add a timestamp to prevent caching
      const nocacheUrl = `${url}?_nocache=${Date.now()}`;

      const response = await fetch(nocacheUrl, {
        method: 'GET',
        headers,
        credentials: 'include',
        cache: 'no-store' // Ensure we don't use cached responses
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to fetch replies with status ${response.status}:`, errorText);

        if (response.status === 404) {
          console.warn(`Comment with ID ${commentId} not found when fetching replies`);
          return [];
        }

        throw new Error(`Failed to fetch replies: ${errorText || response.statusText}`);
      }

      const result = await response.json();
      console.log(`Successfully fetched ${result.length} replies:`, result);

      if (!Array.isArray(result)) {
        console.error('API returned non-array response for replies:', result);
        return [];
      }

      // Convert date strings to Date objects for frontend compatibility
      const processedReplies = result.map(reply => {
        // Log each reply for debugging
        console.log('Processing reply:', {
          id: reply.id,
          content: reply.content?.substring(0, 20) + '...',
          parentId: reply.parent_id || reply.parentId
        });

        return {
          ...reply,
          id: reply.id,
          content: reply.content,
          createdAt: new Date(reply.created_at || reply.createdAt),
          updatedAt: reply.updated_at || reply.updatedAt ? new Date(reply.updated_at || reply.updatedAt) : undefined,
          hasUpvoted: reply.has_upvoted || reply.hasUpvoted || false,
          parentId: reply.parent_id || reply.parentId,
          mentionedUsers: reply.mentioned_users || reply.mentionedUsers || [],
          replies: reply.replies || []
        };
      });

      console.log('Processed replies for frontend:', processedReplies);
      return processedReplies;
    } catch (error) {
      console.error(`Error fetching replies for comment ID ${commentId}:`, error);
      // For all errors, return empty array to prevent UI crashes
      return [];
    }
  },

  async createReply(commentId: string, data: Partial<Comment>): Promise<Comment> {
    try {
      console.log(`Creating reply for comment ID: ${commentId} with data:`, data);

      // Check if user is authenticated
      const authToken = localStorage.getItem('auth_token');
      if (!authToken) {
        console.error('Cannot create reply: No authentication token found');
        throw new Error('Authentication required to post a reply. Please log in.');
      }

      // Make the API request with explicit headers
      const url = `${API_BASE_URL}/comments/${commentId}/replies/`;
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      };

      console.log('Sending reply with headers:', {
        ...headers,
        Authorization: 'Bearer ***' // Masked for logging
      });

      // Prepare the request body
      const requestData = {
        content: data.content
      };

      console.log('Sending reply data:', {
        ...requestData,
        content: requestData.content?.substring(0, 20) + '...' // Truncate content for logging
      });

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestData),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Reply creation failed with status ${response.status}:`, errorText);

        // Try to parse as JSON, but handle text response too
        let errorMessage = `Failed to post reply (${response.status})`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (e) {
          // If not valid JSON, use the text as is if it's not empty
          if (errorText && errorText.trim()) {
            errorMessage = errorText;
          }
        }

        // Handle specific error cases
        if (response.status === 401) {
          throw new Error('Authentication required to post a reply. Please log in again.');
        }

        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Reply created successfully:', result);

      // Process the result for frontend compatibility
      const processedReply = {
        ...result,
        createdAt: new Date(result.created_at || result.createdAt),
        updatedAt: result.updated_at || result.updatedAt ? new Date(result.updated_at || result.updatedAt) : undefined,
        hasUpvoted: result.has_upvoted || result.hasUpvoted || false,
        parentId: result.parent_id || result.parentId,
        mentionedUsers: result.mentioned_users || result.mentionedUsers || [],
        replies: [] // New replies start with empty replies
      };

      console.log('Processed reply for frontend:', processedReply);
      return processedReply;
    } catch (error) {
      console.error('Failed to create reply:', error);
      throw error;
    }
  },

  async deleteComment(discussionId: string, commentId: string): Promise<void> {
    try {
      console.log(`Deleting comment with ID: ${commentId} from discussion: ${discussionId}`);

      // Check if user is authenticated
      const authToken = localStorage.getItem('auth_token');
      if (!authToken) {
        console.error('Cannot delete comment: No authentication token found');
        throw new Error('Authentication required to delete a comment. Please log in.');
      }

      const url = `${API_BASE_URL}/discussions/${discussionId}/comments/${commentId}`;
      const headers: HeadersInit = {
        'Authorization': `Bearer ${authToken}`
      };

      console.log(`Making DELETE request to: ${url}`);

      const response = await fetch(url, {
        method: 'DELETE',
        headers,
        credentials: 'include'
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Comment deletion failed with status ${response.status}:`, errorText);

        // Try to parse as JSON, but handle text response too
        let errorMessage = `Failed to delete comment (${response.status})`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (e) {
          // If not valid JSON, use the text as is if it's not empty
          if (errorText && errorText.trim()) {
            errorMessage = errorText;
          }
        }

        // Handle specific error cases
        if (response.status === 401) {
          throw new Error('Authentication required to delete a comment. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('You are not authorized to delete this comment.');
        } else if (response.status === 404) {
          throw new Error('Comment not found. It may have been already deleted.');
        }

        throw new Error(errorMessage);
      }

      console.log('Comment deleted successfully');
    } catch (error) {
      console.error('Failed to delete comment:', error);
      throw error;
    }
  },

  async deleteReply(commentId: string, replyId: string): Promise<void> {
    try {
      console.log(`Deleting reply with ID: ${replyId} from comment: ${commentId}`);

      // Check if user is authenticated
      const authToken = localStorage.getItem('auth_token');
      if (!authToken) {
        console.error('Cannot delete reply: No authentication token found');
        throw new Error('Authentication required to delete a reply. Please log in.');
      }

      const url = `${API_BASE_URL}/comments/${commentId}/replies/${replyId}/`;
      const headers: HeadersInit = {
        'Authorization': `Bearer ${authToken}`
      };

      console.log(`Making DELETE request to: ${url}`);

      const response = await fetch(url, {
        method: 'DELETE',
        headers,
        credentials: 'include'
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Reply deletion failed with status ${response.status}:`, errorText);

        // Try to parse as JSON, but handle text response too
        let errorMessage = `Failed to delete reply (${response.status})`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (e) {
          // If not valid JSON, use the text as is if it's not empty
          if (errorText && errorText.trim()) {
            errorMessage = errorText;
          }
        }

        // Handle specific error cases
        if (response.status === 401) {
          throw new Error('Authentication required to delete a reply. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('You are not authorized to delete this reply.');
        } else if (response.status === 404) {
          throw new Error('Reply not found. It may have been already deleted.');
        }

        throw new Error(errorMessage);
      }

      console.log('Reply deleted successfully');
    } catch (error) {
      console.error('Failed to delete reply:', error);
      throw error;
    }
  },

  // Tags
  async getTags(): Promise<Tag[]> {
    return await apiRequest<Tag[]>('/tags/');
  },

  // Notifications (moved to the API object below)

  // File Upload
  async uploadFile(file: File, type: string = 'attachment'): Promise<Attachment> {
    try {
      console.log(`Uploading file: ${file.name}, size: ${file.size}, type: ${file.type}`);

      // Special handling for avatar uploads
      if (type === 'avatar') {
        return this.uploadAvatar(file);
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      // Check if user is authenticated
      const authToken = localStorage.getItem('auth_token');
      if (!authToken) {
        console.error('Cannot upload file: No authentication token found');
        throw new Error('Authentication required to upload files. Please log in.');
      }

      const url = `${API_BASE_URL}/files/upload/`;
      const headers: HeadersInit = {
        'Authorization': `Bearer ${authToken}`
      };

      // Don't set Content-Type header for FormData - browser will set it with boundary
      console.log('Uploading file with headers:', {
        Authorization: 'Bearer ***' // Masked for logging
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout for uploads

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers,
          body: formData,
          credentials: 'include',
          signal: controller.signal
        });

        // Clear the timeout
        clearTimeout(timeoutId);

        console.log(`File upload response status: ${response.status}`);

        if (!response.ok) {
          let errorMessage = `Upload failed with status ${response.status}`;

          try {
            const errorText = await response.text();
            console.error('Upload error response:', errorText);

            // Try to parse as JSON
            try {
              const errorData = JSON.parse(errorText);
              errorMessage = errorData.detail || errorData.message || errorMessage;
            } catch (e) {
              // If not valid JSON, use the text as is if it's not empty
              if (errorText && errorText.trim()) {
                errorMessage = errorText;
              }
            }
          } catch (e) {
            console.error('Failed to read error response:', e);
          }

          // Handle specific error cases
          if (response.status === 401) {
            throw new Error('Authentication required to upload files. Please log in again.');
          }

          throw new Error(errorMessage);
        }

        const result = await response.json();
        console.log('File uploaded successfully:', result);
        return result;
      } catch (fetchError) {
        // Clear the timeout to prevent memory leaks
        clearTimeout(timeoutId);

        // Handle timeout errors
        if (fetchError.name === 'AbortError') {
          console.error('File upload request timed out');
          throw new Error('File upload timed out. Please try again with a smaller file or check your connection.');
        }

        throw fetchError;
      }
    } catch (error) {
      console.error('Failed to upload file:', error);
      throw error;
    }
  },

  // Avatar Upload - special handling for profile pictures
  async uploadAvatar(file: File): Promise<Attachment> {
    try {
      console.log(`Uploading avatar: ${file.name}, size: ${file.size}, type: ${file.type}`);

      // Check if user is authenticated
      const authToken = localStorage.getItem('auth_token');
      if (!authToken) {
        console.error('Cannot upload avatar: No authentication token found');
        throw new Error('Authentication required to upload profile picture. Please log in.');
      }

      // Create a data URL from the file for client-side storage
      // This is a reliable fallback that works even when the backend is unavailable
      const reader = new FileReader();
      const dataUrlPromise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Start reading the file as data URL
      const dataUrl = await dataUrlPromise;
      console.log('Created data URL for avatar (length):', dataUrl.length);

      // Try to get the current user
      let currentUser = null;
      try {
        currentUser = await this.getCurrentUser();
        console.log('Current user for avatar update:', currentUser?.id);
      } catch (userError) {
        console.error('Error getting current user for avatar update:', userError);
      }

      // If we have a current user, try to update their profile directly
      if (currentUser && currentUser.id) {
        try {
          // Try to update the user profile with the data URL
          await this.updateUserProfile(currentUser.id, {
            avatar: dataUrl,
            suppressToast: true // Don't show a toast for this update
          });
          console.log('Updated user profile with data URL avatar');

          // Return a successful result
          return {
            id: 'avatar-' + Date.now(),
            name: file.name,
            url: dataUrl,
            size: file.size,
            type: file.type,
            uploaded_at: new Date().toISOString(),
            uploadedAt: new Date().toISOString()
          };
        } catch (updateError) {
          console.error('Failed to update user profile with avatar:', updateError);
          // Continue to fallback
        }
      }

      // Try the backend API upload as a fallback
      try {
        console.log('Attempting backend avatar upload...');
        const formData = new FormData();
        formData.append('file', file);

        // Try PUT method first (since we're getting 405 Method Not Allowed with POST)
        const url = `${API_BASE_URL}/users/me/avatar`;
        const headers: HeadersInit = {
          'Authorization': `Bearer ${authToken}`
        };

        console.log('Uploading avatar with PUT method');
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(url, {
          method: 'PUT', // Try PUT instead of POST
          headers,
          body: formData,
          credentials: 'include',
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        console.log(`Avatar upload response status: ${response.status}`);

        if (!response.ok) {
          throw new Error(`Avatar upload failed with status ${response.status}`);
        }

        const userData = await response.json();
        console.log('Avatar uploaded successfully to backend:', userData);

        // Return the backend URL if available
        if (userData && userData.avatar) {
          return {
            id: 'avatar-' + Date.now(),
            name: file.name,
            url: userData.avatar,
            size: file.size,
            type: file.type,
            uploaded_at: new Date().toISOString(),
            uploadedAt: new Date().toISOString()
          };
        }

        // If backend didn't return a URL, use our data URL
        return {
          id: 'avatar-' + Date.now(),
          name: file.name,
          url: dataUrl,
          size: file.size,
          type: file.type,
          uploaded_at: new Date().toISOString(),
          uploadedAt: new Date().toISOString()
        };
      } catch (backendError) {
        console.error('Backend avatar upload failed:', backendError);
        // Continue to fallback
      }

      // If we reach here, both direct profile update and backend upload failed
      // Return the data URL as a last resort
      console.warn('Using data URL as fallback for avatar');
      return {
        id: 'fallback-avatar-' + Date.now(),
        name: file.name,
        url: dataUrl,
        size: file.size,
        type: file.type,
        uploaded_at: new Date().toISOString(),
        uploadedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('All avatar upload methods failed:', error);

      // Create a simple object URL as absolute last resort
      const objectUrl = URL.createObjectURL(file);
      console.warn('Using object URL as emergency fallback for avatar');
      return {
        id: 'emergency-avatar-' + Date.now(),
        name: file.name,
        url: objectUrl,
        size: file.size,
        type: file.type,
        uploaded_at: new Date().toISOString(),
        uploadedAt: new Date().toISOString()
      };
    }
  },

  // User methods
  getUserProfile: async (userId: string): Promise<User> => {
    try {
      console.log(`Fetching user profile for ID: ${userId}`);
      const response = await apiRequest<User>(`/users/${userId}/`);
      console.log('User profile response:', response);
      return response;
    } catch (error) {
      console.error(`Error fetching user profile for ID ${userId}:`, error);

      // If we're in development mode and the API fails, return mock data
      if (process.env.NODE_ENV === 'development') {
        console.warn('Returning mock user data in development mode');
        const mockUser = {
          id: userId,
          username: 'user' + userId.substring(0, 4),
          name: 'Test User',
          email: 'test@example.com',
          bio: 'This is a mock user profile for development.',
          avatar: null,
          created_at: new Date().toISOString(),
          joinedAt: new Date().toISOString(),
        };
        return mockUser as User;
      }
      throw error;
    }
  },

  getUserDiscussions: async (userId: string): Promise<Discussion[]> => {
    try {
      console.log(`Fetching discussions for user ID: ${userId}`);
      const response = await apiRequest<Discussion[]>(`/users/${userId}/discussions`);
      console.log(`Fetched ${response.length} discussions for user`);
      return response;
    } catch (error) {
      console.error(`Error fetching discussions for user ID ${userId}:`, error);
      // Return empty array instead of throwing to prevent UI crashes
      return [];
    }
  },

  updateUserProfile: async (userId: string, userData: Partial<User>): Promise<User> => {
    try {
      console.log(`Updating profile for user ID: ${userId}`, userData);

      // Special handling for avatar data URLs
      let processedUserData = { ...userData };

      // Check if avatar is a data URL and it's very long (indicating it's an image)
      if (typeof userData.avatar === 'string' && userData.avatar.startsWith('data:image/') && userData.avatar.length > 1000) {
        console.log('Avatar is a data URL, length:', userData.avatar.length);

        // We'll keep the data URL in the client-side update
        // but we should note that we're using a client-side avatar
        processedUserData.metadata = JSON.stringify({
          ...(typeof userData.metadata === 'string' ? JSON.parse(userData.metadata) : userData.metadata || {}),
          avatarIsClientSide: true,
          avatarLastUpdated: new Date().toISOString()
        });
      }

      // Try to update the profile
      try {
        const response = await apiRequest<User>(`/users/${userId}/`, 'PUT', processedUserData);
        console.log('Profile update response:', response);

        // If the backend didn't return the avatar but we have one, add it back
        if (userData.avatar && !response.avatar) {
          console.log('Backend did not return avatar, adding it back from request');
          response.avatar = userData.avatar;
        }

        return response;
      } catch (apiError) {
        console.error(`API error updating profile for user ID ${userId}:`, apiError);

        // If we're in development or the backend is unavailable, create a mock response
        console.warn('Creating mock profile update response');

        // Start with existing user data from localStorage if available
        let mockUser: Partial<User> = {};
        try {
          const storedUser = localStorage.getItem('user_data');
          if (storedUser) {
            mockUser = JSON.parse(storedUser);
          }
        } catch (parseError) {
          console.error('Error parsing stored user data:', parseError);
        }

        // Merge with the update data
        const updatedUser = {
          ...mockUser,
          ...processedUserData,
          id: userId,
          updated_at: new Date().toISOString()
        } as User;

        // Store the updated user data in localStorage for persistence
        try {
          localStorage.setItem('user_data', JSON.stringify(updatedUser));
        } catch (storageError) {
          console.error('Error storing updated user data:', storageError);
        }

        return updatedUser;
      }
    } catch (error) {
      console.error(`Error updating profile for user ID ${userId}:`, error);
      throw error;
    }
  },

  deleteDiscussion: async (discussionId: string): Promise<any> => {
    try {
      console.log(`Deleting discussion with ID: ${discussionId}`);
      return await apiRequest<any>(`/discussions/${discussionId}`, 'DELETE');
    } catch (error) {
      console.error(`Error deleting discussion with ID ${discussionId}:`, error);
      throw error;
    }
  },

  // Notification methods
  getNotifications: async (): Promise<Notification[]> => {
    return await apiRequest<Notification[]>('/notifications/');
  },

  markNotificationAsRead: async (id: string): Promise<void> => {
    return await apiRequest<void>(`/notifications/${id}/read/`, 'PUT');
  },

  markAllNotificationsAsRead: async (): Promise<void> => {
    return await apiRequest<void>('/notifications/read-all/', 'PUT');
  },

  deleteNotification: async (id: string): Promise<void> => {
    return await apiRequest<void>(`/notifications/${id}/`, 'DELETE');
  },

  getNotificationSettings: async () => {
    try {
      console.log('Fetching notification settings');
      const response = await apiRequest('/notifications/settings/');
      console.log('Notification settings response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching notification settings:', error);

      // If we're in development mode and the API fails, return default settings
      if (process.env.NODE_ENV === 'development') {
        console.warn('Returning default notification settings in development mode');
        return {
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
        };
      }
      throw error;
    }
  },

  updateNotificationSettings: async (settings: any): Promise<void> => {
    try {
      console.log('Updating notification settings:', settings);
      const response = await apiRequest<void>('/notifications/settings/', 'PUT', settings);
      console.log('Notification settings update response:', response);
      return response;
    } catch (error) {
      console.error('Error updating notification settings:', error);

      // If we're in development mode, just log and return
      if (process.env.NODE_ENV === 'development') {
        console.warn('Mock update of notification settings in development mode');
        return;
      }
      throw error;
    }
  },

  // Content Moderation
  getReportedContent: async (): Promise<ReportedContent[]> => {
    return await apiRequest<ReportedContent[]>('/admin/reported-content/');
  },

  resolveReportedContent: async (
    ids: string[],
    note: string,
    action: string
  ): Promise<void> => {
    return await apiRequest<void>('/admin/reported-content/resolve/', 'POST', {
      ids,
      note,
      action
    });
  },

  deleteReportedContent: async (ids: string[]): Promise<void> => {
    return await apiRequest<void>('/admin/reported-content/delete/', 'POST', { ids });
  },

  reportContent: async (
    contentType: 'discussion' | 'comment' | 'user',
    contentId: string,
    reason: string
  ): Promise<void> => {
    return await apiRequest<void>('/reported-content/', 'POST', {
      content_type: contentType,
      content_id: contentId,
      reason
    });
  },

  // Search
  search: async (params: Record<string, string>) => {
    // Build query string
    const queryParams = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');

    return await apiRequest<{
      discussions: Discussion[];
      comments: Comment[];
      users: User[];
      totalResults: number;
    }>(`/search/?${queryParams}`);
  },

  // Analytics
  trackAnalyticsEvent: async (event: any): Promise<void> => {
    return await apiRequest<void>('/analytics/events/', 'POST', event);
  },

  getAnalytics: async (period: string = '30d'): Promise<any> => {
    return await apiRequest<any>(`/analytics/dashboard/?period=${period}`);
  },

  // Projects
  getProjects: async (): Promise<any[]> => {
    return await apiRequest<any[]>('/projects/');
  },

  getProjectById: async (id: string): Promise<any> => {
    return await apiRequest<any>(`/projects/${id}`);
  },

  uploadProject: async (title: string, description: string, file: File): Promise<any> => {
    try {
      console.log(`Uploading project: ${title}, file: ${file.name}, size: ${file.size}`);

      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('file', file);

      // Check if user is authenticated
      const authToken = localStorage.getItem('auth_token');
      if (!authToken) {
        console.error('Cannot upload project: No authentication token found');
        throw new Error('Authentication required to upload projects. Please log in.');
      }

      const url = `${API_BASE_URL}/projects/`;
      const headers: HeadersInit = {
        'Authorization': `Bearer ${authToken}`
      };

      // Don't set Content-Type header for FormData - browser will set it with boundary
      console.log('Uploading project with headers:', {
        Authorization: 'Bearer ***' // Masked for logging
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout for project uploads

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers,
          body: formData,
          credentials: 'include',
          signal: controller.signal
        });

        // Clear the timeout
        clearTimeout(timeoutId);

        console.log(`Project upload response status: ${response.status}`);

        if (!response.ok) {
          let errorMessage = `Upload failed with status ${response.status}`;

          try {
            const errorText = await response.text();
            console.error('Project upload error response:', errorText);

            // Try to parse as JSON
            try {
              const errorData = JSON.parse(errorText);
              errorMessage = errorData.detail || errorData.message || errorMessage;
            } catch (e) {
              // If not valid JSON, use the text as is if it's not empty
              if (errorText && errorText.trim()) {
                errorMessage = errorText;
              }
            }
          } catch (e) {
            console.error('Failed to read error response:', e);
          }

          // Handle specific error cases
          if (response.status === 401) {
            throw new Error('Authentication required to upload projects. Please log in again.');
          }

          throw new Error(errorMessage);
        }

        const result = await response.json();
        console.log('Project uploaded successfully:', result);
        return result;
      } catch (fetchError) {
        // Clear the timeout to prevent memory leaks
        clearTimeout(timeoutId);

        // Handle timeout errors
        if (fetchError.name === 'AbortError') {
          console.error('Project upload request timed out');
          throw new Error('Project upload timed out. Please try again with a smaller file or check your connection.');
        }

        throw fetchError;
      }
    } catch (error) {
      console.error('Failed to upload project:', error);
      throw error;
    }
  },

  upvoteProject: async (id: string): Promise<{ upvotes: number, hasUpvoted: boolean }> => {
    return await apiRequest<{ upvotes: number, hasUpvoted: boolean }>(`/projects/${id}/upvote`, 'POST');
  },

  commentOnProject: async (id: string, content: string): Promise<any> => {
    return await apiRequest<any>(`/projects/${id}/comments`, 'POST', { content });
  },

  deleteProject: async (id: string): Promise<void> => {
    return await apiRequest<void>(`/projects/${id}`, 'DELETE');
  },

  deleteProjectComment: async (projectId: string, commentId: string): Promise<void> => {
    try {
      console.log(`Deleting comment with ID: ${commentId} from project: ${projectId}`);

      // Check if user is authenticated
      const authToken = localStorage.getItem('auth_token');
      if (!authToken) {
        console.error('Cannot delete project comment: No authentication token found');
        throw new Error('Authentication required to delete a comment. Please log in.');
      }

      const url = `${API_BASE_URL}/projects/${projectId}/comments/${commentId}`;
      const headers: HeadersInit = {
        'Authorization': `Bearer ${authToken}`
      };

      console.log(`Making DELETE request to: ${url}`);

      const response = await fetch(url, {
        method: 'DELETE',
        headers,
        credentials: 'include'
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Project comment deletion failed with status ${response.status}:`, errorText);

        // Try to parse as JSON, but handle text response too
        let errorMessage = `Failed to delete comment (${response.status})`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (e) {
          // If not valid JSON, use the text as is if it's not empty
          if (errorText && errorText.trim()) {
            errorMessage = errorText;
          }
        }

        // Handle specific error cases
        if (response.status === 401) {
          throw new Error('Authentication required to delete a comment. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('You are not authorized to delete this comment.');
        } else if (response.status === 404) {
          throw new Error('Comment not found. It may have been already deleted.');
        }

        throw new Error(errorMessage);
      }

      console.log('Project comment deleted successfully');
    } catch (error) {
      console.error('Failed to delete project comment:', error);
      throw error;
    }
  }
};
