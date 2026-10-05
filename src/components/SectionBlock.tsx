import React, { useState } from 'react';
import { Section, PortfolioItem } from '../types/portfolio';
import { ItemCard } from './ItemCard';
import {
  Plus,
  Heart,
  Activity,
  Code,
  Trophy,
  Palette,
  Star,
  BookOpen,
  Music,
  Camera,
  Sparkles,
  Pencil,
  Trash2,
  MoreVertical,
} from 'lucide-react';

interface SectionBlockProps {
  section: Section;
  items: PortfolioItem[];
  isOwner: boolean;
  onAddItem: (sectionId: string) => void;
  onEditItem: (item: PortfolioItem) => void;
  onDeleteItem: (id: string) => void;
  onOpenPhoto: (photos: string[], index: number) => void;
  onEditSection: (section: Section) => void;
  onDeleteSection: (sectionId: string) => void;
  isCustomSection: boolean;
}

const renderSectionIcon = (iconName: string, className = 'w-5 h-5') => {
  switch (iconName) {
    case 'heart':
      return <Heart className={`${className} text-rose-500`} />;
    case 'activity':
      return <Activity className={`${className} text-emerald-600`} />;
    case 'code':
      return <Code className={`${className} text-indigo-500`} />;
    case 'trophy':
      return <Trophy className={`${className} text-amber-500`} />;
    case 'palette':
      return <Palette className={`${className} text-fuchsia-500`} />;
    case 'book':
      return <BookOpen className={`${className} text-sky-600`} />;
    case 'music':
      return <Music className={`${className} text-violet-500`} />;
    case 'camera':
      return <Camera className={`${className} text-teal-500`} />;
    default:
      return <Sparkles className={`${className} text-amber-500`} />;
  }
};

export const SectionBlock: React.FC<SectionBlockProps> = ({
  section,
  items,
  isOwner,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onOpenPhoto,
  onEditSection,
  onDeleteSection,
  isCustomSection,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <section id={`sec-${section.id}`} className="space-y-4 scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/90">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center shrink-0">
            {renderSectionIcon(section.iconName, 'w-5 h-5')}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-serif-display font-bold text-slate-900 tracking-tight">
                {section.name}
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            {section.description && (
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {section.description}
              </p>
            )}
          </div>
        </div>

        {/* Section Actions (ONLY in Owner Mode) */}
        {isOwner && (
          <div className="flex items-center gap-2 self-start sm:self-center shrink-0 no-print">
            <button
              onClick={() => onAddItem(section.id)}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs flex items-center gap-1.5 transition-all hover:border-slate-400 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-600" />
              <span>Add to {section.name}</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
                title="Section Options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMenu && (
                <div
                  onClick={() => setShowMenu(false)}
                  className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-lg py-1 text-xs z-30"
                >
                  <button
                    onClick={() => onEditSection(section)}
                    className="w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5 text-slate-400" />
                    <span>Edit Section Details</span>
                  </button>
                  {isCustomSection && (
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            `Delete section "${section.name}"? Items in it will also be removed.`
                          )
                        ) {
                          onDeleteSection(section.id);
                        }
                      }}
                      className="w-full px-3 py-2 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Section</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Items Grid or Empty State */}
      {items.length === 0 ? (
        <div className="p-8 sm:p-10 border-2 border-dashed border-slate-200 rounded-2xl bg-white/70 text-center space-y-3 shadow-2xs">
          <div className="w-12 h-12 rounded-xl bg-slate-100/80 text-slate-400 flex items-center justify-center mx-auto">
            {renderSectionIcon(section.iconName, 'w-6 h-6')}
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-slate-800">
              No entries in {section.name} yet
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {isOwner
                ? 'Add photos, descriptions, milestones, and details of what you did.'
                : 'Entries will appear here once added.'}
            </p>
          </div>
          {isOwner && (
            <div className="pt-2">
              <button
                onClick={() => onAddItem(section.id)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-amber-300" />
                <span>+ Add to {section.name}</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              isOwner={isOwner}
              onEdit={onEditItem}
              onDelete={onDeleteItem}
              onOpenPhoto={onOpenPhoto}
            />
          ))}
        </div>
      )}
    </section>
  );
};
