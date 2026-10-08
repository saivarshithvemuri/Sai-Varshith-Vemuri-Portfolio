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
  FolderOpen,
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

const renderSectionIcon = (iconName: string, className = 'w-4 h-4') => {
  switch (iconName) {
    case 'heart':
      return <Heart className={`${className} text-rose-600`} />;
    case 'activity':
      return <Activity className={`${className} text-emerald-700`} />;
    case 'code':
      return <Code className={`${className} text-sky-700`} />;
    case 'trophy':
      return <Trophy className={`${className} text-amber-600`} />;
    case 'palette':
      return <Palette className={`${className} text-fuchsia-600`} />;
    case 'book':
      return <BookOpen className={`${className} text-amber-800`} />;
    case 'music':
      return <Music className={`${className} text-violet-600`} />;
    case 'camera':
      return <Camera className={`${className} text-teal-600`} />;
    default:
      return <Sparkles className={`${className} text-amber-600`} />;
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
    <section id={`sec-${section.id}`} className="space-y-5 scroll-mt-24 pt-2">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E7E2D9]">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-white border border-stone-200/90 shadow-2xs flex items-center justify-center shrink-0">
            {renderSectionIcon(section.iconName, 'w-5 h-5')}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-serif-display font-normal text-stone-900 tracking-tight">
                {section.name}
              </h2>
              <span className="text-xs font-mono text-stone-500 bg-stone-100/90 border border-stone-200/60 px-2.5 py-0.5 rounded-full">
                {items.length} {items.length === 1 ? 'entry' : 'entries'}
              </span>
            </div>
            {section.description && (
              <p className="text-xs sm:text-sm text-stone-600 mt-0.5 font-light max-w-3xl">
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
              className="px-3 py-1.5 bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 hover:border-stone-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-amber-700" />
              <span>Add Entry</span>
            </button>

            {/* Menu for Edit / Delete Section */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                title="Manage Section"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMenu && (
                <div
                  onClick={() => setShowMenu(false)}
                  className="absolute right-0 mt-1 w-44 bg-white border border-stone-200 rounded-xl shadow-lg py-1 text-xs z-30 animate-fade-in"
                >
                  <button
                    onClick={() => onEditSection(section)}
                    className="w-full px-3 py-1.5 text-left text-stone-700 hover:bg-stone-50 flex items-center gap-2 cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5 text-stone-400" />
                    <span>Edit Name / Icon</span>
                  </button>

                  <button
                    onClick={() => {
                      if (
                        confirm(
                          `Delete section "${section.name}" and all ${items.length} items inside it?`
                        )
                      ) {
                        onDeleteSection(section.id);
                      }
                    }}
                    className="w-full px-3 py-1.5 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    <span>Delete Section</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Grid of Items or Classy Empty State */}
      {items.length === 0 ? (
        <div className="bg-white/60 border border-[#E7E2D9] border-dashed rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-400">
            <FolderOpen className="w-6 h-6 text-stone-400" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-serif-display font-medium text-stone-800">
              No highlights in {section.name} yet
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed font-light">
              {isOwner
                ? `Click below to document an activity, project milestone, award, or passion in this collection.`
                : `This collection is currently undergoing curation. Check back soon for updates.`}
            </p>
          </div>

          {isOwner && (
            <button
              onClick={() => onAddItem(section.id)}
              className="mt-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-amber-200 border border-amber-400/25 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-amber-300" />
              <span>+ Curate First Highlight in {section.name}</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
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
