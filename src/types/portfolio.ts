export interface Section {
  id: string;
  name: string;
  description: string;
  iconName: string; // 'activity' | 'heart' | 'code' | 'trophy' | 'palette' | 'star' | 'book' | 'music' | 'camera' | 'sparkles'
}

export interface PortfolioItem {
  id: string;
  sectionId: string;
  title: string;
  subtitle?: string;
  date?: string;
  description: string;
  photos: string[];
  tags?: string[];
  link?: string;
  createdAt: number;
}

export interface UserProfile {
  name: string;
  bio: string;
  avatarUrl?: string;
  school?: string;
  major?: string;
  email?: string;
  website?: string;
  github?: string;
  linkedin?: string;
}

export type Profile = UserProfile;
