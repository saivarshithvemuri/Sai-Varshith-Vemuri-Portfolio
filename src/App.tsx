import React, { useState, useEffect } from 'react';
import { Section, PortfolioItem, UserProfile } from './types/portfolio';
import { defaultSections, initialProfile } from './data/defaultPortfolio';
import { Header } from './components/Header';
import { ProfileBanner } from './components/ProfileBanner';
import { ProfileModal } from './components/ProfileModal';
import { SectionBlock } from './components/SectionBlock';
import { ItemModal } from './components/ItemModal';
import { NewSectionModal } from './components/NewSectionModal';
import { PhotoLightbox } from './components/PhotoLightbox';
import {
  Plus,
  FolderPlus,
  Sparkles,
  Layers,
  Heart,
  Activity,
  Code,
  Trophy,
  Palette,
  BookOpen,
  Music,
  Camera,
} from 'lucide-react';

const SECTIONS_STORAGE_KEY = 'user_custom_sections_v2';
const ITEMS_STORAGE_KEY = 'user_portfolio_items_v2';
const PROFILE_STORAGE_KEY = 'user_portfolio_profile_v2';

export default function App() {
  // 1. Sections state
  const [sections, setSections] = useState<Section[]>(() => {
    try {
      const saved = localStorage.getItem(SECTIONS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return defaultSections;
  });

  // 2. Items state (starts empty as requested)
  const [items, setItems] = useState<PortfolioItem[]>(() => {
    try {
      const saved = localStorage.getItem(ITEMS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // 3. User profile state
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed) {
          return {
            ...parsed,
            name: parsed.name && parsed.name.trim() ? parsed.name : 'Sai Varshith Vemuri',
          };
        }
      }
    } catch (e) {
      console.error(e);
    }
    return initialProfile;
  });

  // Navigation & filter state
  const [activeSectionId, setActiveSectionId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);

  // Modals state
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [targetSectionId, setTargetSectionId] = useState<string>('activities');
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);

  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Lightbox state
  const [lightboxPhotos, setLightboxPhotos] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync to localStorage
  const saveSections = (newSections: Section[]) => {
    setSections(newSections);
    try {
      localStorage.setItem(SECTIONS_STORAGE_KEY, JSON.stringify(newSections));
    } catch (e) {
      console.error(e);
    }
  };

  const saveItems = (newItems: PortfolioItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(newItems));
    } catch (e) {
      console.error(e);
    }
  };

  const saveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(newProfile));
      showToast('Profile updated!');
    } catch (e) {
      console.error(e);
    }
  };

  // Item operations
  const handleOpenAddItem = (sectionId?: string) => {
    const defaultSec = sectionId || (sections[0]?.id ?? 'activities');
    setTargetSectionId(defaultSec);
    setEditingItem(null);
    setIsItemModalOpen(true);
  };

  const handleEditItem = (item: PortfolioItem) => {
    setTargetSectionId(item.sectionId);
    setEditingItem(item);
    setIsItemModalOpen(true);
  };

  const handleSaveItem = (item: PortfolioItem) => {
    const existingIndex = items.findIndex((i) => i.id === item.id);
    let updated: PortfolioItem[];
    if (existingIndex >= 0) {
      updated = [...items];
      updated[existingIndex] = item;
      showToast(`Updated "${item.title}"`);
    } else {
      updated = [item, ...items];
      showToast(`Added "${item.title}" with ${item.photos.length} photo(s)`);
    }
    saveItems(updated);
  };

  const handleDeleteItem = (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    saveItems(updated);
    showToast('Item deleted.');
  };

  // Section operations
  const handleOpenNewSection = () => {
    setEditingSection(null);
    setIsSectionModalOpen(true);
  };

  const handleEditSection = (section: Section) => {
    setEditingSection(section);
    setIsSectionModalOpen(true);
  };

  const handleSaveSection = (savedSection: Section) => {
    const existingIndex = sections.findIndex((s) => s.id === savedSection.id);
    if (existingIndex >= 0) {
      const updated = [...sections];
      updated[existingIndex] = savedSection;
      saveSections(updated);
      showToast(`Updated section "${savedSection.name}"`);
    } else {
      const updated = [...sections, savedSection];
      saveSections(updated);
      setActiveSectionId(savedSection.id);
      showToast(`Created section "${savedSection.name}"`);
    }
  };

  const handleDeleteSection = (sectionId: string) => {
    const updatedSections = sections.filter((s) => s.id !== sectionId);
    saveSections(updatedSections);
    // Also remove items in that section
    const updatedItems = items.filter((i) => i.sectionId !== sectionId);
    saveItems(updatedItems);
    if (activeSectionId === sectionId) {
      setActiveSectionId('all');
    }
    showToast('Section and its items deleted.');
  };

  // Lightbox
  const handleOpenPhoto = (photos: string[], index: number) => {
    setLightboxPhotos(photos);
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  // Backup / Data management
  const handleExportJSON = () => {
    const backup = {
      profile,
      sections,
      items,
      exportDate: new Date().toISOString(),
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute(
      'download',
      `${(profile.name || 'my_portfolio').toLowerCase().replace(/\s+/g, '_')}_backup.json`
    );
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.profile) saveProfile(parsed.profile);
        if (Array.isArray(parsed.sections)) saveSections(parsed.sections);
        if (Array.isArray(parsed.items)) saveItems(parsed.items);
        showToast('Backup restored successfully!');
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearAll = () => {
    if (confirm('Clear everything? This will remove all your entries and reset sections to default.')) {
      setSections(defaultSections);
      setItems([]);
      setProfile(initialProfile);
      localStorage.removeItem(SECTIONS_STORAGE_KEY);
      localStorage.removeItem(ITEMS_STORAGE_KEY);
      localStorage.removeItem(PROFILE_STORAGE_KEY);
      showToast('All data cleared.');
    }
  };

  // Filter items by search query
  const getFilteredItemsForSection = (sectionId: string) => {
    return items.filter((item) => {
      if (item.sectionId !== sectionId) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSub = (item.subtitle || '').toLowerCase().includes(q);
      const matchDesc = (item.description || '').toLowerCase().includes(q);
      const matchTags = (item.tags || []).some((t) => t.toLowerCase().includes(q));
      return matchTitle || matchSub || matchDesc || matchTags;
    });
  };

  // Filter visible sections
  const visibleSections = sections.filter((s) => {
    if (activeSectionId === 'all') return true;
    return s.id === activeSectionId;
  });

  const totalMatchingItems = sections.reduce(
    (acc, sec) => acc + getFilteredItemsForSection(sec.id).length,
    0
  );

  const getSectionIconSmall = (iconName: string) => {
    switch (iconName) {
      case 'heart':
        return <Heart className="w-3.5 h-3.5 text-rose-500" />;
      case 'activity':
        return <Activity className="w-3.5 h-3.5 text-emerald-600" />;
      case 'code':
        return <Code className="w-3.5 h-3.5 text-indigo-500" />;
      case 'trophy':
        return <Trophy className="w-3.5 h-3.5 text-amber-500" />;
      case 'palette':
        return <Palette className="w-3.5 h-3.5 text-fuchsia-500" />;
      case 'book':
        return <BookOpen className="w-3.5 h-3.5 text-sky-600" />;
      case 'music':
        return <Music className="w-3.5 h-3.5 text-violet-500" />;
      case 'camera':
        return <Camera className="w-3.5 h-3.5 text-teal-500" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-amber-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-slate-800 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Top Navigation */}
      <Header
        name={profile.name}
        isPreviewMode={isPreviewMode}
        onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
        onAddNew={() => handleOpenAddItem(sections[0]?.id)}
        onAddSection={handleOpenNewSection}
        onExport={handleExportJSON}
        onImport={handleImportJSON}
        onClear={handleClearAll}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onEditProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 w-full space-y-7">
        {/* Profile Card / Header Banner */}
        <ProfileBanner
          profile={profile}
          isPreviewMode={isPreviewMode}
          onEditProfile={() => setIsProfileModalOpen(true)}
        />

        {/* Section Navigation Tabs & Action Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-1 border-b border-slate-200/80 pb-4">
          {/* Scrollable Pills for Sections */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {/* All Sections Button */}
            <button
              onClick={() => setActiveSectionId('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap shadow-2xs ${
                activeSectionId === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Sections</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeSectionId === 'all' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {items.length}
              </span>
            </button>

            {/* Individual Section Pills */}
            {sections.map((sec) => {
              const secItemCount = items.filter((i) => i.sectionId === sec.id).length;
              const isActive = activeSectionId === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSectionId(sec.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap shadow-2xs ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {getSectionIconSmall(sec.iconName)}
                  <span>{sec.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {secItemCount}
                  </span>
                </button>
              );
            })}

            {/* + Add Section Button */}
            {!isPreviewMode && (
              <button
                onClick={handleOpenNewSection}
                className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 bg-transparent hover:bg-slate-200/60 transition-colors flex items-center gap-1 whitespace-nowrap border border-dashed border-slate-300"
                title="Create a new section"
              >
                <Plus className="w-3.5 h-3.5 text-slate-500" />
                <span>New Section</span>
              </button>
            )}
          </div>

          {/* Quick Action Button for Add Stuff */}
          {!isPreviewMode && (
            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              <button
                onClick={() =>
                  handleOpenAddItem(activeSectionId !== 'all' ? activeSectionId : sections[0]?.id)
                }
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-amber-300" />
                <span>+ Add Stuff</span>
              </button>
            </div>
          )}
        </div>

        {/* Search Active Indicator */}
        {searchQuery.trim() && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-xs text-amber-900 flex items-center justify-between">
            <div>
              Showing search results for <strong className="font-semibold">"{searchQuery}"</strong> (
              {totalMatchingItems} matching items)
            </div>
            <button
              onClick={() => setSearchQuery('')}
              className="font-semibold underline hover:text-amber-950 ml-2"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Global Empty State (when completely no items exist in entire app) */}
        {items.length === 0 && !searchQuery.trim() ? (
          <div className="p-8 sm:p-14 border-2 border-dashed border-slate-200 rounded-3xl bg-white text-center space-y-6 max-w-xl mx-auto my-4 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200/70 shadow-xs">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-serif-display font-bold text-slate-900">
                Your portfolio is ready for you to add stuff!
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
                Organize your hobbies, activities you did, events, creative works, and photos. Everything is saved automatically in your browser.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => handleOpenAddItem('activities')}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>+ Add to Activities I Did</span>
              </button>

              <button
                onClick={() => handleOpenAddItem('hobbies')}
                className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <Heart className="w-4 h-4 text-rose-500" />
                <span>+ Add to My Hobbies</span>
              </button>
            </div>

            <div className="pt-2">
              <button
                onClick={handleOpenNewSection}
                className="text-xs font-medium text-slate-500 hover:text-slate-900 inline-flex items-center gap-1"
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>or create a custom section</span>
              </button>
            </div>
          </div>
        ) : null}

        {/* Render Each Visible Section */}
        <div className="space-y-12">
          {visibleSections.map((section) => {
            const sectionItems = getFilteredItemsForSection(section.id);
            const isCustom = !['activities', 'hobbies'].includes(section.id);

            // If we are searching and there are no matching items in this section, hide it
            if (searchQuery.trim() && sectionItems.length === 0) {
              return null;
            }

            return (
              <SectionBlock
                key={section.id}
                section={section}
                items={sectionItems}
                isPreviewMode={isPreviewMode}
                onAddItem={(secId) => handleOpenAddItem(secId)}
                onEditItem={handleEditItem}
                onDeleteItem={handleDeleteItem}
                onOpenPhoto={handleOpenPhoto}
                onEditSection={handleEditSection}
                onDeleteSection={handleDeleteSection}
                isCustomSection={isCustom}
              />
            );
          })}
        </div>

        {/* When search yields 0 items */}
        {searchQuery.trim() && totalMatchingItems === 0 && (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl p-8 space-y-3">
            <p className="text-slate-600 font-medium text-sm">
              No hobbies or activities found matching "{searchQuery}".
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg"
            >
              Clear Search
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/80 py-8 bg-white text-center text-xs text-slate-400 no-print">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            {profile.name ? `${profile.name} · ` : ''}
            Digital Activity & Hobby Portfolio
          </p>
          <div className="flex items-center gap-4 text-slate-500">
            <span>{sections.length} Sections</span>
            <span>·</span>
            <span>{items.length} Total Items</span>
          </div>
        </div>
      </footer>

      {/* Item Form Modal (Add / Edit) */}
      <ItemModal
        isOpen={isItemModalOpen}
        onClose={() => {
          setIsItemModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
        sections={sections}
        initialSectionId={targetSectionId}
        initialItem={editingItem}
      />

      {/* New / Edit Section Modal */}
      <NewSectionModal
        isOpen={isSectionModalOpen}
        onClose={() => {
          setIsSectionModalOpen(false);
          setEditingSection(null);
        }}
        onSave={handleSaveSection}
        initialSection={editingSection}
      />

      {/* Profile Edit Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSave={saveProfile}
      />

      {/* Fullscreen Photo Lightbox */}
      <PhotoLightbox
        photos={lightboxPhotos}
        initialIndex={lightboxIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
      />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-medium px-4 py-2.5 rounded-lg shadow-lg border border-slate-700 flex items-center gap-2 animate-bounce-subtle">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
