
import { User, Discussion, Comment, Notification, Tag, Attachment } from '@/types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    username: 'johndoe',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'Full-stack developer passionate about React and Node.js',
    joinedAt: new Date('2023-01-15'),
    isAdmin: true
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    username: 'janesmith',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    bio: 'UX/UI Designer with 5 years of experience',
    joinedAt: new Date('2023-02-20')
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    username: 'mikej',
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
    bio: 'DevOps engineer and cloud specialist',
    joinedAt: new Date('2023-03-10')
  },
  {
    id: '4',
    name: 'Emily Wilson',
    email: 'emily@example.com',
    username: 'emilyw',
    avatar: 'https://randomuser.me/api/portraits/women/23.jpg',
    joinedAt: new Date('2023-04-05')
  },
  {
    id: '5',
    name: 'David Chen',
    email: 'david@example.com',
    username: 'davidc',
    avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
    joinedAt: new Date('2023-05-18')
  }
];

// Mock Tags
export const mockTags: Tag[] = [
  { id: '1', name: 'React', description: 'React.js related topics', count: 145 },
  { id: '2', name: 'Python', description: 'Python programming language', count: 98 },
  { id: '3', name: 'DevOps', description: 'DevOps practices and tools', count: 67 },
  { id: '4', name: 'UI/UX', description: 'User interface and experience design', count: 54 },
  { id: '5', name: 'Database', description: 'Database related topics', count: 36 },
  { id: '6', name: 'JavaScript', description: 'JavaScript programming', count: 124 },
  { id: '7', name: 'Beginner', description: 'Topics suitable for beginners', count: 89 },
  { id: '8', name: 'Cloud', description: 'Cloud computing topics', count: 72 }
];

// Mock Attachments
export const mockAttachments: Attachment[] = [
  {
    id: '1',
    name: 'project-proposal.pdf',
    url: '/files/project-proposal.pdf',
    size: 2456000,
    type: 'application/pdf',
    uploadedAt: new Date('2023-06-15')
  },
  {
    id: '2',
    name: 'wireframe.png',
    url: '/files/wireframe.png',
    size: 1245000,
    type: 'image/png',
    uploadedAt: new Date('2023-06-16')
  },
  {
    id: '3',
    name: 'code-sample.zip',
    url: '/files/code-sample.zip',
    size: 3567000,
    type: 'application/zip',
    uploadedAt: new Date('2023-06-17')
  }
];

// Mock Discussions
export const mockDiscussions: Discussion[] = [
  {
    id: '1',
    title: 'Best practices for React performance optimization',
    content: 'I\'ve been working on a large-scale React application and noticed some performance issues. What are some best practices you follow to optimize React applications?',
    author: mockUsers[0],
    createdAt: new Date('2023-06-20T14:30:00'),
    tags: ['React', 'JavaScript', 'Performance'],
    upvotes: 24,
    commentCount: 8,
    hasUpvoted: false
  },
  {
    id: '2',
    title: 'Django vs FastAPI for building APIs',
    content: 'I\'m starting a new project and need to choose between Django and FastAPI for building the API. What are the pros and cons of each?',
    author: mockUsers[1],
    createdAt: new Date('2023-06-21T10:15:00'),
    tags: ['Python', 'Django', 'FastAPI', 'API'],
    upvotes: 18,
    commentCount: 12,
    hasUpvoted: true
  },
  {
    id: '3',
    title: 'Implementing CI/CD pipeline with GitHub Actions',
    content: 'Has anyone implemented a CI/CD pipeline using GitHub Actions? I\'m looking for examples and best practices.',
    author: mockUsers[2],
    createdAt: new Date('2023-06-22T09:45:00'),
    tags: ['DevOps', 'CI/CD', 'GitHub'],
    upvotes: 15,
    commentCount: 6,
    hasUpvoted: false,
    attachments: [mockAttachments[2]]
  },
  {
    id: '4',
    title: 'User research methods for mobile applications',
    content: 'I\'m designing a mobile application and want to conduct user research. What methods do you recommend for effective user research?',
    author: mockUsers[3],
    createdAt: new Date('2023-06-23T16:20:00'),
    tags: ['UI/UX', 'Mobile', 'User Research'],
    upvotes: 10,
    commentCount: 4,
    hasUpvoted: false,
    attachments: [mockAttachments[1]]
  },
  {
    id: '5',
    title: 'MongoDB vs PostgreSQL for a social media application',
    content: 'I\'m building a social media application and trying to decide between MongoDB and PostgreSQL. What would you recommend based on your experience?',
    author: mockUsers[4],
    createdAt: new Date('2023-06-24T11:30:00'),
    tags: ['Database', 'MongoDB', 'PostgreSQL'],
    upvotes: 12,
    commentCount: 9,
    hasUpvoted: false
  },
  {
    id: '6',
    title: 'Learning path for becoming a full-stack developer',
    content: 'I\'m new to web development and want to become a full-stack developer. What learning path would you recommend?',
    author: mockUsers[1],
    createdAt: new Date('2023-06-25T13:40:00'),
    tags: ['Beginner', 'Full-Stack', 'Learning'],
    upvotes: 28,
    commentCount: 15,
    hasUpvoted: true
  },
  {
    id: '7',
    title: 'Implementing real-time features with WebSockets',
    content: 'I want to add real-time features to my application. What\'s the best way to implement WebSockets in a React/Node.js stack?',
    author: mockUsers[0],
    createdAt: new Date('2023-06-26T15:10:00'),
    tags: ['WebSockets', 'Real-time', 'React', 'Node.js'],
    upvotes: 16,
    commentCount: 7,
    hasUpvoted: false
  },
  {
    id: '8',
    title: 'Securing AWS Lambda functions',
    content: 'What are the best practices for securing AWS Lambda functions? I\'m concerned about potential security vulnerabilities.',
    author: mockUsers[2],
    createdAt: new Date('2023-06-27T09:20:00'),
    tags: ['AWS', 'Lambda', 'Security', 'Cloud'],
    upvotes: 14,
    commentCount: 5,
    hasUpvoted: false,
    attachments: [mockAttachments[0]]
  }
];

// Mock Comments
export const mockComments: Record<string, Comment[]> = {
  '1': [
    {
      id: '1',
      content: 'I recommend using React.memo for functional components that render often but with the same props.',
      author: mockUsers[1],
      createdAt: new Date('2023-06-20T15:00:00'),
      upvotes: 8,
      hasUpvoted: true,
      replies: []
    },
    {
      id: '2',
      content: 'Have you tried using the React Profiler to identify performance bottlenecks?',
      author: mockUsers[2],
      createdAt: new Date('2023-06-20T15:30:00'),
      upvotes: 5,
      hasUpvoted: false,
      replies: [
        {
          id: '3',
          content: 'The Profiler has been extremely helpful for me in identifying unnecessary renders.',
          author: mockUsers[3],
          createdAt: new Date('2023-06-20T16:00:00'),
          upvotes: 3,
          hasUpvoted: false,
          parentId: '2'
        }
      ]
    },
    {
      id: '4',
      content: '@johndoe I found that code splitting and lazy loading components can significantly improve initial load time.',
      author: mockUsers[4],
      createdAt: new Date('2023-06-20T16:30:00'),
      upvotes: 7,
      hasUpvoted: false,
      mentionedUsers: ['johndoe'],
      replies: []
    }
  ],
  '2': [
    {
      id: '5',
      content: 'Django is more batteries-included, while FastAPI is more lightweight and faster. Depends on your project needs.',
      author: mockUsers[0],
      createdAt: new Date('2023-06-21T11:00:00'),
      upvotes: 10,
      hasUpvoted: true,
      replies: []
    },
    {
      id: '6',
      content: 'I\'ve used both, and I prefer FastAPI for APIs due to its speed and automatic documentation with Swagger.',
      author: mockUsers[2],
      createdAt: new Date('2023-06-21T11:45:00'),
      upvotes: 6,
      hasUpvoted: false,
      replies: []
    }
  ]
};

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'mention',
    message: 'Jane Smith mentioned you in a comment',
    isRead: false,
    createdAt: new Date('2023-06-27T10:30:00'),
    link: '/discussions/1',
    from: mockUsers[1]
  },
  {
    id: '2',
    type: 'reply',
    message: 'Mike Johnson replied to your comment',
    isRead: false,
    createdAt: new Date('2023-06-26T14:45:00'),
    link: '/discussions/2',
    from: mockUsers[2]
  },
  {
    id: '3',
    type: 'upvote',
    message: 'Your discussion received 5 new upvotes',
    isRead: true,
    createdAt: new Date('2023-06-25T09:15:00'),
    link: '/discussions/3'
  },
  {
    id: '4',
    type: 'system',
    message: 'Welcome to our discussion forum!',
    isRead: true,
    createdAt: new Date('2023-06-20T08:00:00')
  }
];

export const currentUser = mockUsers[0];
