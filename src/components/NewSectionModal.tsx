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
  { name: 'activity', label: 'Activity', icon: <Activity className="w-4 h-4" /> },
  { name: 'heart', label: 'Hobbies / Heart', icon: <Heart className="w-4 h-4" /> },
  { name: 'code', label: 'Code / Tech', icon: <Code className="w-4 h-4" /> },
  { name: 'trophy', label: 'Trophy / Awards', icon: <Trophy className="w-4 h-4" /> },
  { name: 'palette', label: 'Art & Design', icon: <Palette className="w-4 h-4" /> },
  { name: 'star', label: 'Highlights', icon: <Star className="w-4 h-4" /> },
  { name: 'book', label: 'Reading & Study', icon: <BookOpen className="w-4 h-4" /> },
  { name: 'music', label: 'Music & Arts', icon: <Music className="w-4 h-4" /> },
  { name: 'camera', label: 'Photography', icon: <Camera className="w-4 h-4" /> },
  { name: 'sparkles', label: 'Special Project', icon: <Sparkles className="w-4 h-4" /> },
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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-900">
            {initialSection ? 'Edit Section' : 'Create a New Section'}
          </h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Section Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Creative Arts, Volunteering, Sports, Competitions..."
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:bg-white focus:outline-slate-900"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Description (optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Things I do on weekends, creative works, and achievements..."
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Choose Section Icon</label>
            <div className="grid grid-cols-5 gap-1.5">
              {AVAILABLE_ICONS.map((item) => (
                <button
                  type="button"
                  key={item.name}
                  onClick={() => setIconName(item.name)}
                  className={`p-2 rounded-lg border flex flex-col items-center gap-1 text-xs transition-all ${
                    iconName === item.name
                      ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  {item.icon}
                  <span className="text-[9px] truncate max-w-[50px]">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>{initialSection ? 'Save Changes' : 'Create Section'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
