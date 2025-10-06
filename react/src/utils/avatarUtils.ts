/**
 * Utility functions for avatar handling
 */

/**
 * Checks if a string is a valid avatar URL
 */
export const isValidAvatarUrl = (url: string | null | undefined): boolean => {
  return Boolean(url && typeof url === 'string' && url.trim() !== '');
};

/**
 * Gets the best available avatar source from user data
 */
export const getAvatarSource = (user: {
  avatar_url?: string | null;
  image?: string | null;
}): string | null => {
  if (isValidAvatarUrl(user.avatar_url)) {
    return user.avatar_url!;
  }

  if (isValidAvatarUrl(user.image)) {
    return user.image!;
  }

  return null;
};

/**
 * Generates user initials from name
 */
export const getUserInitials = (user: {
  display_name?: string;
  username?: string;
}): string => {
  const name = user.display_name || user.username || 'User';
  return name.charAt(0).toUpperCase();
};

/**
 * Sample avatar URLs for fallback/demo purposes
 */
export const SAMPLE_AVATARS = [
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108755-2616b612b8bb?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
];

/**
 * Gets a random sample avatar URL
 */
export const getRandomSampleAvatar = (): string => {
  return SAMPLE_AVATARS[Math.floor(Math.random() * SAMPLE_AVATARS.length)];
};

/**
 * Gets a deterministic avatar based on user ID (same user always gets same avatar)
 */
export const getDeterministicAvatar = (userId: number): string => {
  const index = userId % SAMPLE_AVATARS.length;
  return SAMPLE_AVATARS[index];
};