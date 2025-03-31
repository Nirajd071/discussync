
import { 
  mockDiscussions, 
  mockComments, 
  mockUsers, 
  mockNotifications, 
  mockTags,
  currentUser
} from './mock-data';
import { 
  User, 
  Discussion, 
  Comment, 
  Notification, 
  Tag,
  Attachment
} from '@/types';

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API service
export const api = {
  // Auth
  async login(email: string, password: string): Promise<User> {
    await delay(800);
    const user = mockUsers.find(u => u.email === email);
    if (!user || password !== 'password') {
      throw new Error('Invalid credentials');
    }
    return user;
  },

  async register(userData: Partial<User>): Promise<User> {
    await delay(1000);
    const newUser: User = {
      id: `${mockUsers.length + 1}`,
      name: userData.name || '',
      email: userData.email || '',
      username: userData.username || '',
      avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`,
      joinedAt: new Date(),
      ...userData
    };
    return newUser;
  },

  async getCurrentUser(): Promise<User> {
    await delay(500);
    return currentUser;
  },

  // Discussions
  async getDiscussions(filters?: { tag?: string, search?: string }): Promise<Discussion[]> {
    await delay(800);
    let filteredDiscussions = [...mockDiscussions];
    
    if (filters?.tag) {
      filteredDiscussions = filteredDiscussions.filter(d => 
        d.tags.some(tag => tag.toLowerCase() === filters.tag?.toLowerCase())
      );
    }
    
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filteredDiscussions = filteredDiscussions.filter(d => 
        d.title.toLowerCase().includes(searchLower) || 
        d.content.toLowerCase().includes(searchLower)
      );
    }
    
    return filteredDiscussions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  async getDiscussionById(id: string): Promise<Discussion | null> {
    await delay(600);
    return mockDiscussions.find(d => d.id === id) || null;
  },

  async createDiscussion(data: Partial<Discussion>): Promise<Discussion> {
    await delay(1000);
    const newDiscussion: Discussion = {
      id: `${mockDiscussions.length + 1}`,
      title: data.title || '',
      content: data.content || '',
      author: currentUser,
      createdAt: new Date(),
      tags: data.tags || [],
      upvotes: 0,
      commentCount: 0,
      hasUpvoted: false,
      attachments: data.attachments || [],
    };
    return newDiscussion;
  },

  async upvoteDiscussion(id: string): Promise<{ upvotes: number, hasUpvoted: boolean }> {
    await delay(500);
    const discussion = mockDiscussions.find(d => d.id === id);
    if (!discussion) throw new Error('Discussion not found');
    
    const newHasUpvoted = !discussion.hasUpvoted;
    const newUpvotes = discussion.upvotes + (newHasUpvoted ? 1 : -1);
    
    return { upvotes: newUpvotes, hasUpvoted: newHasUpvoted };
  },

  // Comments
  async getCommentsByDiscussionId(discussionId: string): Promise<Comment[]> {
    await delay(700);
    return mockComments[discussionId] || [];
  },

  async createComment(discussionId: string, data: Partial<Comment>): Promise<Comment> {
    await delay(800);
    const newComment: Comment = {
      id: `${Object.values(mockComments).flat().length + 1}`,
      content: data.content || '',
      author: currentUser,
      createdAt: new Date(),
      upvotes: 0,
      hasUpvoted: false,
      parentId: data.parentId,
      mentionedUsers: data.mentionedUsers,
      replies: [],
    };
    return newComment;
  },

  async upvoteComment(id: string): Promise<{ upvotes: number, hasUpvoted: boolean }> {
    await delay(500);
    const comment = Object.values(mockComments)
      .flat()
      .find(c => c.id === id || c.replies?.some(r => r.id === id));
    
    if (!comment) throw new Error('Comment not found');
    
    const newHasUpvoted = !comment.hasUpvoted;
    const newUpvotes = comment.upvotes + (newHasUpvoted ? 1 : -1);
    
    return { upvotes: newUpvotes, hasUpvoted: newHasUpvoted };
  },

  // Tags
  async getTags(): Promise<Tag[]> {
    await delay(600);
    return mockTags;
  },

  // Notifications
  async getNotifications(): Promise<Notification[]> {
    await delay(700);
    return mockNotifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  async markNotificationAsRead(id: string): Promise<void> {
    await delay(500);
    const notification = mockNotifications.find(n => n.id === id);
    if (notification) notification.isRead = true;
  },

  async markAllNotificationsAsRead(): Promise<void> {
    await delay(600);
    mockNotifications.forEach(n => n.isRead = true);
  },

  // File Upload
  async uploadFile(file: File): Promise<Attachment> {
    await delay(1500); // Simulate longer upload time
    
    return {
      id: `upload-${Date.now()}`,
      name: file.name,
      url: URL.createObjectURL(file), // Create temporary URL
      size: file.size,
      type: file.type,
      uploadedAt: new Date()
    };
  }
};
