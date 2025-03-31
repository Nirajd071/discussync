
export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar: string;
  bio?: string;
  joinedAt: Date;
  isAdmin?: boolean;
}

export interface Discussion {
  id: string;
  title: string;
  content: string;
  author: User;
  createdAt: Date;
  updatedAt?: Date;
  tags: string[];
  upvotes: number;
  commentCount: number;
  hasUpvoted?: boolean;
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
