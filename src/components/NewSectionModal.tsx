import React, { useState, useEffect } from 'react';
import { Section } from '../types/portfolio';
import { X, Check, Heart, Activity, Code, Trophy, Palette, Star, BookOpen, Music, Camera, Sparkles } from 'lucide-react';

interface NewSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (section: Section) => void;
  initialSection?: Section | null;
}

const AVAILABLE_ICONS = [
  { name: 'activity', label: 'Activities', icon: <Activity className="w-4 h-4" /> },
  { name: 'heart', label: 'Hobbies', icon: <Heart className="w-4 h-4" /> },
  { name: 'code', label: 'Projects', icon: <Code className="w-4 h-4" /> },
  { name: 'trophy', label: 'Awards', icon: <Trophy className="w-4 h-4" /> },
  { name: 'palette', label: 'Creative', icon: <Palette className="w-4 h-4" /> },
  { name: 'star', label: 'Highlights', icon: <Star className="w-4 h-4" /> },
  { name: 'book', label: 'Academic', icon: <BookOpen className="w-4 h-4" /> },
  { name: 'music', label: 'Music', icon: <Music className="w-4 h-4" /> },
  { name: 'camera', label: 'Visual Arts', icon: <Camera className="w-4 h-4" /> },
  { name: 'sparkles', label: 'Special', icon: <Sparkles className="w-4 h-4" /> },
];

export const NewSectionModal: React.FC<NewSectionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialSection,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('star');

  useEffect(() => {
    if (initialSection) {
      setName(initialSection.name);
      setDescription(initialSection.description);
      setIconName(initialSection.iconName);
    } else {
      setName('');
      setDescription('');
      setIconName('star');
    }
  }, [initialSection, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      id: initialSection ? initialSection.id : `sec-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      iconName,
    });
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl border border-stone-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-5 bg-[#FAF8F5] border-b border-stone-200">
          <div>
            <h2 className="text-xl font-serif-display font-normal text-stone-900 tracking-tight">
              {initialSection ? 'Edit Collection' : 'Curate New Collection'}
            </h2>
            <p className="text-xs text-stone-500 font-light mt-0.5">
              Create a dedicated tab for activities, hobbies, or specialized endeavors.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Collection Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Creative Arts, Volunteering, Sports, Honors..."
              className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium focus:bg-white focus:outline-none focus:border-stone-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Description (optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Passions, community work, creative experiments..."
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-none focus:border-stone-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-700">Collection Emblem</label>
            <div className="grid grid-cols-5 gap-2">
              {AVAILABLE_ICONS.map((item) => (
                <button
                  type="button"
                  key={item.name}
                  onClick={() => setIconName(item.name)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 text-xs transition-all cursor-pointer ${
                    iconName === item.name
                      ? 'border-stone-900 bg-stone-900 text-amber-200 shadow-sm ring-1 ring-amber-400/25'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                  }`}
                >
                  {item.icon}
                  <span className="text-[10px] truncate max-w-[50px] font-sans">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-amber-200 bg-stone-900 hover:bg-stone-850 border border-amber-400/25 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{initialSection ? 'Save Collection' : 'Create Collection'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
