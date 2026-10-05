import { Section, UserProfile, PortfolioItem } from '../types/portfolio';

export const defaultSections: Section[] = [
  {
    id: 'activities',
    name: 'Activities I Did',
    description: 'School clubs, events, volunteering, leadership, sports, and milestones.',
    iconName: 'activity',
  },
  {
    id: 'hobbies',
    name: 'My Hobbies',
    description: 'Personal passions, creative interests, instruments, sports, and things I enjoy doing.',
    iconName: 'heart',
  },
  {
    id: 'projects',
    name: 'Projects & Builds',
    description: 'Things I coded, engineered, built, created, or researched.',
    iconName: 'code',
  },
];

export const initialProfile: UserProfile = {
  name: 'Sai Varshith Vemuri',
  bio: '',
  avatarUrl: '',
  school: '',
  major: '',
  email: '',
  website: '',
  github: '',
  linkedin: '',
};

export const defaultItems: PortfolioItem[] = [];

export const initialBlankProfile = initialProfile;
