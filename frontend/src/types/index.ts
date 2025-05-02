
export interface User {
  id: string;
  first_name?: string;
  last_name?: string;
  name?: string; // Computed from first_name and last_name
  email: string;
  username: string;
  avatar?: string | null;
  bio?: string | null;
  joinedAt?: Date;
  created_at?: string;
  is_admin?: boolean;
  metadata?: string | Record<string, any>; // Additional profile data
  suppressToast?: boolean; // Used internally for controlling toast notifications
}

export interface Discussion {
  id: string;
  title: string;
  content: string;
  author: User;
  createdAt?: Date; // Legacy field
  created_at?: string; // New field from backend
  updatedAt?: Date; // Legacy field
  updated_at?: string; // New field from backend
  tags: (string | Tag)[];
  upvotes?: number; // Legacy field
  upvote_count?: number; // New field from backend
  commentCount?: number; // Legacy field
  comment_count?: number; // New field from backend
  hasUpvoted?: boolean;
  has_upvoted?: boolean; // New field from backend
  attachments?: Attachment[];
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: Date;
  updatedAt?: Date;
  upvotes: number;
  hasUpvoted?: boolean;
  parentId?: string;
  replies?: Comment[];
  mentionedUsers?: string[];
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

export interface Notification {
  id: string;
  type: 'mention' | 'reply' | 'upvote' | 'system';
  message: string;
  isRead: boolean;
  createdAt: Date;
  link?: string;
  from?: User;
}

export interface Tag {
  id: string;
  name: string;
  description?: string;
  count: number;
}
