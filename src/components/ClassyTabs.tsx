import React from 'react';
import { Section, PortfolioItem } from '../types/portfolio';
import {
  Layers,
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
  Plus,
  Compass,
} from 'lucide-react';

interface ClassyTabsProps {
  sections: Section[];
  items: PortfolioItem[];
  activeSectionId: string;
  onSelectSection: (id: string) => void;
  isOwner: boolean;
  onOpenNewSection: () => void;
  onAddNewItem: (sectionId?: string) => void;
}

export const ClassyTabs: React.FC<ClassyTabsProps> = ({
  sections,
  items,
  activeSectionId,
  onSelectSection,
  isOwner,
  onOpenNewSection,
  onAddNewItem,
}) => {
  const getSectionIcon = (iconName: string, isActive: boolean) => {
    const baseClass = 'w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110';
    switch (iconName) {
      case 'heart':
        return <Heart className={`${baseClass} ${isActive ? 'text-rose-400 fill-rose-400/20' : 'text-rose-600'}`} />;
      case 'activity':
        return <Activity className={`${baseClass} ${isActive ? 'text-emerald-400' : 'text-emerald-700'}`} />;
      case 'code':
        return <Code className={`${baseClass} ${isActive ? 'text-sky-300' : 'text-sky-700'}`} />;
      case 'trophy':
        return <Trophy className={`${baseClass} ${isActive ? 'text-amber-300' : 'text-amber-600'}`} />;
      case 'palette':
        return <Palette className={`${baseClass} ${isActive ? 'text-fuchsia-300' : 'text-fuchsia-600'}`} />;
      case 'book':
        return <BookOpen className={`${baseClass} ${isActive ? 'text-amber-200' : 'text-stone-700'}`} />;
      case 'music':
        return <Music className={`${baseClass} ${isActive ? 'text-violet-300' : 'text-violet-600'}`} />;
      case 'camera':
        return <Camera className={`${baseClass} ${isActive ? 'text-teal-300' : 'text-teal-600'}`} />;
      default:
        return <Sparkles className={`${baseClass} ${isActive ? 'text-amber-300' : 'text-amber-600'}`} />;
    }
  };

  const currentSection = sections.find((s) => s.id === activeSectionId);

  return (
    <div className="space-y-4 pt-2">
      {/* Curator Bar Header */}
      <div className="flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-amber-800 font-semibold flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-amber-700" />
            Curated Collections
          </span>
          <span className="text-stone-300">·</span>
          <span className="text-stone-500 font-mono text-[11px]">
            {activeSectionId === 'all'
              ? `All (${items.length} works)`
              : `${currentSection?.name || 'Selected'} (${items.filter((i) => i.sectionId === activeSectionId).length} works)`}
          </span>
        </div>

        {isOwner && (
          <button
            onClick={onOpenNewSection}
            className="text-[11px] font-medium text-stone-600 hover:text-stone-900 flex items-center gap-1 cursor-pointer transition-colors px-2 py-1 rounded-lg hover:bg-stone-100"
          >
            <Plus className="w-3 h-3 text-amber-800" />
            <span>+ New Collection</span>
          </button>
        )}
      </div>

      {/* Main Luxury Tab Segmented Bar */}
      <div className="p-1.5 bg-[#F2EDE4]/80 backdrop-blur-xs border border-[#E3DDD4] rounded-2xl flex items-center justify-between gap-2 shadow-[inset_0_1px_3px_rgba(28,25,23,0.03)]">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none flex-1 py-0.5">
          {/* All Sections Tab */}
          <button
            onClick={() => onSelectSection('all')}
            className={`group px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeSectionId === 'all'
                ? 'bg-stone-900 text-stone-50 shadow-[0_4px_14px_rgba(28,25,23,0.18)] border border-stone-800 ring-1 ring-amber-400/25'
                : 'bg-white/80 hover:bg-white text-stone-700 hover:text-stone-950 border border-stone-200/60 hover:border-stone-300 shadow-2xs'
            }`}
          >
            <Layers
              className={`w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110 ${
                activeSectionId === 'all' ? 'text-amber-300' : 'text-stone-500'
              }`}
            />
            <span className="tracking-tight font-medium">All Works</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                activeSectionId === 'all'
                  ? 'bg-stone-800 text-amber-300 border border-stone-700/80'
                  : 'bg-stone-100 text-stone-500'
              }`}
            >
              {items.length}
            </span>
          </button>

          {/* Individual Section Tabs */}
          {sections.map((sec) => {
            const count = items.filter((i) => i.sectionId === sec.id).length;
            const isActive = activeSectionId === sec.id;

            return (
              <button
                key={sec.id}
                onClick={() => onSelectSection(sec.id)}
                className={`group px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-stone-900 text-stone-50 shadow-[0_4px_14px_rgba(28,25,23,0.18)] border border-stone-800 ring-1 ring-amber-400/25'
                    : 'bg-white/80 hover:bg-white text-stone-700 hover:text-stone-950 border border-stone-200/60 hover:border-stone-300 shadow-2xs'
                }`}
              >
                {getSectionIcon(sec.iconName, isActive)}
                <span className="tracking-tight font-medium">{sec.name}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                    isActive
                      ? 'bg-stone-800 text-amber-300 border border-stone-700/80'
                      : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Add Button on the right of the tab bar (Owner only) */}
        {isOwner && (
          <div className="shrink-0 pl-1 hidden sm:block">
            <button
              onClick={() => onAddNewItem(activeSectionId !== 'all' ? activeSectionId : sections[0]?.id)}
              className="px-3.5 py-2 bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-amber-300 hover:text-amber-200 border border-amber-400/25 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer hover:shadow"
            >
              <Plus className="w-3.5 h-3.5 text-amber-300" />
              <span>Add Entry</span>
            </button>
          </div>
        )}
      </div>

      {/* When a specific collection is active, showcase a rich gallery lead header */}
      {activeSectionId !== 'all' && currentSection && (
        <div className="bg-white/80 border border-[#E7E2D9] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs transition-all">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-serif-display text-xl sm:text-2xl font-normal text-stone-900 tracking-tight">
                {currentSection.name}
              </span>
              <span className="text-xs font-mono text-stone-500">
                ({items.filter((i) => i.sectionId === currentSection.id).length} highlights)
              </span>
            </div>
            {currentSection.description && (
              <p className="text-xs text-stone-600 max-w-2xl leading-relaxed">
                {currentSection.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <button
              onClick={() => onSelectSection('all')}
              className="text-xs font-medium text-stone-500 hover:text-stone-800 underline cursor-pointer"
            >
              View all works
            </button>
            {isOwner && (
              <button
                onClick={() => onAddNewItem(currentSection.id)}
                className="px-3 py-1.5 bg-stone-900 text-amber-200 hover:bg-stone-800 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>Add to {currentSection.name}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
