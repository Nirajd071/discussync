import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Award,
  Star,
  Shield,
  Zap,
  Heart,
  Flame,
  Lightbulb,
  Rocket,
  Coffee,
  Code,
  MessageSquare,
  ThumbsUp,
  Clock,
  Calendar,
  Bookmark,
  CheckCircle2,
  Crown,
  User
} from 'lucide-react';

export type BadgeType =
  | 'admin'
  | 'moderator'
  | 'contributor'
  | 'member'
  | 'new'
  | 'verified'
  | 'top_poster'
  | 'top_commenter'
  | 'top_voter'
  | 'early_adopter'
  | 'bug_hunter'
  | 'helpful'
  | 'solution_provider'
  | 'expert'
  | 'mentor'
  | 'custom';

interface BadgeConfig {
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  textColor: string;
  borderColor: string;
}

interface UserBadgeProps {
  type: BadgeType;
  customLabel?: string;
  customDescription?: string;
  customIcon?: React.ReactNode;
  customColor?: string;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

const badgeConfigs: Record<BadgeType, BadgeConfig> = {
  admin: {
    label: 'Admin',
    description: 'Site administrator with full privileges',
    icon: <Shield className="h-3 w-3" />,
    color: 'bg-red-100 dark:bg-red-900/20',
    textColor: 'text-red-800 dark:text-red-300',
    borderColor: 'border-red-200 dark:border-red-800/30'
  },
  moderator: {
    label: 'Mod',
    description: 'Community moderator who helps maintain quality discussions',
    icon: <Shield className="h-3 w-3" />,
    color: 'bg-orange-100 dark:bg-orange-900/20',
    textColor: 'text-orange-800 dark:text-orange-300',
    borderColor: 'border-orange-200 dark:border-orange-800/30'
  },
  contributor: {
    label: 'Contributor',
    description: 'Regular contributor to discussions and community',
    icon: <Star className="h-3 w-3" />,
    color: 'bg-yellow-100 dark:bg-yellow-900/20',
    textColor: 'text-yellow-800 dark:text-yellow-300',
    borderColor: 'border-yellow-200 dark:border-yellow-800/30'
  },
  member: {
    label: 'Member',
    description: 'Registered member of the community',
    icon: <User className="h-3 w-3" />,
    color: 'bg-blue-100 dark:bg-blue-900/20',
    textColor: 'text-blue-800 dark:text-blue-300',
    borderColor: 'border-blue-200 dark:border-blue-800/30'
  },
  new: {
    label: 'New',
    description: 'New member who recently joined',
    icon: <Zap className="h-3 w-3" />,
    color: 'bg-green-100 dark:bg-green-900/20',
    textColor: 'text-green-800 dark:text-green-300',
    borderColor: 'border-green-200 dark:border-green-800/30'
  },
  verified: {
    label: 'Verified',
    description: 'Verified user with confirmed identity',
    icon: <CheckCircle2 className="h-3 w-3" />,
    color: 'bg-emerald-100 dark:bg-emerald-900/20',
    textColor: 'text-emerald-800 dark:text-emerald-300',
    borderColor: 'border-emerald-200 dark:border-emerald-800/30'
  },
  top_poster: {
    label: 'Top Poster',
    description: 'Created many valuable discussions',
    icon: <MessageSquare className="h-3 w-3" />,
    color: 'bg-purple-100 dark:bg-purple-900/20',
    textColor: 'text-purple-800 dark:text-purple-300',
    borderColor: 'border-purple-200 dark:border-purple-800/30'
  },
  top_commenter: {
    label: 'Top Commenter',
    description: 'Contributed many helpful comments',
    icon: <MessageSquare className="h-3 w-3" />,
    color: 'bg-indigo-100 dark:bg-indigo-900/20',
    textColor: 'text-indigo-800 dark:text-indigo-300',
    borderColor: 'border-indigo-200 dark:border-indigo-800/30'
  },
  top_voter: {
    label: 'Top Voter',
    description: 'Actively upvotes quality content',
    icon: <ThumbsUp className="h-3 w-3" />,
    color: 'bg-pink-100 dark:bg-pink-900/20',
    textColor: 'text-pink-800 dark:text-pink-300',
    borderColor: 'border-pink-200 dark:border-pink-800/30'
  },
  early_adopter: {
    label: 'Early Adopter',
    description: 'Joined during the platform\'s early days',
    icon: <Clock className="h-3 w-3" />,
    color: 'bg-cyan-100 dark:bg-cyan-900/20',
    textColor: 'text-cyan-800 dark:text-cyan-300',
    borderColor: 'border-cyan-200 dark:border-cyan-800/30'
  },
  bug_hunter: {
    label: 'Bug Hunter',
    description: 'Helped identify and report bugs',
    icon: <Code className="h-3 w-3" />,
    color: 'bg-red-100 dark:bg-red-900/20',
    textColor: 'text-red-800 dark:text-red-300',
    borderColor: 'border-red-200 dark:border-red-800/30'
  },
  helpful: {
    label: 'Helpful',
    description: 'Recognized for being especially helpful to others',
    icon: <Heart className="h-3 w-3" />,
    color: 'bg-rose-100 dark:bg-rose-900/20',
    textColor: 'text-rose-800 dark:text-rose-300',
    borderColor: 'border-rose-200 dark:border-rose-800/30'
  },
  solution_provider: {
    label: 'Solution Provider',
    description: 'Regularly provides solutions to problems',
    icon: <Lightbulb className="h-3 w-3" />,
    color: 'bg-amber-100 dark:bg-amber-900/20',
    textColor: 'text-amber-800 dark:text-amber-300',
    borderColor: 'border-amber-200 dark:border-amber-800/30'
  },
  expert: {
    label: 'Expert',
    description: 'Recognized expert in specific topics',
    icon: <Award className="h-3 w-3" />,
    color: 'bg-violet-100 dark:bg-violet-900/20',
    textColor: 'text-violet-800 dark:text-violet-300',
    borderColor: 'border-violet-200 dark:border-violet-800/30'
  },
  mentor: {
    label: 'Mentor',
    description: 'Helps guide and mentor other community members',
    icon: <Coffee className="h-3 w-3" />,
    color: 'bg-brown-100 dark:bg-brown-900/20',
    textColor: 'text-amber-800 dark:text-amber-300',
    borderColor: 'border-amber-200 dark:border-amber-800/30'
  },
  custom: {
    label: 'Custom',
    description: 'Custom badge',
    icon: <Star className="h-3 w-3" />,
    color: 'bg-gray-100 dark:bg-gray-900/20',
    textColor: 'text-gray-800 dark:text-gray-300',
    borderColor: 'border-gray-200 dark:border-gray-800/30'
  }
};

const UserBadge: React.FC<UserBadgeProps> = ({
  type,
  customLabel,
  customDescription,
  customIcon,
  customColor,
  size = 'md',
  showTooltip = true
}) => {
  const config = badgeConfigs[type];

  const label = type === 'custom' && customLabel ? customLabel : config.label;
  const description = type === 'custom' && customDescription ? customDescription : config.description;
  const icon = type === 'custom' && customIcon ? customIcon : config.icon;
  const color = type === 'custom' && customColor ? customColor : config.color;
  const textColor = type === 'custom' && customColor ? 'text-white' : config.textColor;
  const borderColor = type === 'custom' && customColor ? 'border-transparent' : config.borderColor;

  const sizeClasses = {
    sm: 'text-[10px] py-0 px-1.5 h-4',
    md: 'text-xs py-0.5 px-2 h-5',
    lg: 'text-sm py-1 px-2.5 h-6'
  };

  const badge = (
    <Badge
      variant="outline"
      className={`
        ${color} ${textColor} ${borderColor} ${sizeClasses[size]}
        flex items-center gap-1 font-medium
      `}
    >
      {icon}
      {label}
    </Badge>
  );

  if (!showTooltip) {
    return badge;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badge}
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default UserBadge;
