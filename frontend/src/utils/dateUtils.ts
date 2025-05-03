/**
 * Utility functions for handling dates and times
 */

/**
 * Converts a date string or Date object to a Date object
 * @param date Date string or Date object
 * @returns Date object
 */
export function toDate(date: string | Date | undefined | null): Date {
  if (!date) {
    return new Date();
  }
  
  if (date instanceof Date) {
    return date;
  }
  
  // Try to parse the date string
  try {
    return new Date(date);
  } catch (error) {
    console.error('Error parsing date:', error);
    return new Date();
  }
}

/**
 * Formats a date as a relative time string (e.g., "5 minutes ago")
 * @param date Date string or Date object
 * @returns Formatted relative time string
 */
export function formatRelativeTime(date: string | Date | undefined | null): string {
  const dateObj = toDate(date);
  const now = new Date();
  
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
}

/**
 * Formats a date as a full date string (e.g., "January 1, 2023")
 * @param date Date string or Date object
 * @returns Formatted date string
 */
export function formatFullDate(date: string | Date | undefined | null): string {
  const dateObj = toDate(date);
  return dateObj.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Formats a date as a time string (e.g., "12:30 PM")
 * @param date Date string or Date object
 * @returns Formatted time string
 */
export function formatTime(date: string | Date | undefined | null): string {
  const dateObj = toDate(date);
  return dateObj.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Formats a date as a full date and time string (e.g., "January 1, 2023 at 12:30 PM")
 * @param date Date string or Date object
 * @returns Formatted date and time string
 */
export function formatDateTime(date: string | Date | undefined | null): string {
  const dateObj = toDate(date);
  return `${formatFullDate(dateObj)} at ${formatTime(dateObj)}`;
}
