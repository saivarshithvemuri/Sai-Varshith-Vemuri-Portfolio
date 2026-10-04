import React from 'react';
import { Activity, Heart, Code, Trophy, Palette, Star, BookOpen, Music, Folder } from 'lucide-react';

export const getSectionIcon = (iconName: string, className = 'w-5 h-5') => {
  switch (iconName) {
    case 'heart':
      return <Heart className={className} />;
    case 'activity':
      return <Activity className={className} />;
    case 'code':
      return <Code className={className} />;
    case 'trophy':
      return <Trophy className={className} />;
    case 'palette':
      return <Palette className={className} />;
    case 'star':
      return <Star className={className} />;
    case 'book':
      return <BookOpen className={className} />;
    case 'music':
      return <Music className={className} />;
    default:
      return <Folder className={className} />;
  }
};
