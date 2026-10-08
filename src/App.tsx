import React, { useState, useEffect } from 'react';
import { Section, PortfolioItem, UserProfile } from './types/portfolio';
import { defaultSections, initialProfile, defaultItems } from './data/defaultPortfolio';
import { Header } from './components/Header';
import { ProfileBanner } from './components/ProfileBanner';
import { ProfileModal } from './components/ProfileModal';
import { SectionBlock } from './components/SectionBlock';
import { ClassyTabs } from './components/ClassyTabs';
import { ItemModal } from './components/ItemModal';
import { NewSectionModal } from './components/NewSectionModal';
import { PhotoLightbox } from './components/PhotoLightbox';
import { OwnerAuthModal } from './components/OwnerAuthModal';
import { PublishModal } from './components/PublishModal';
import {
  testFirestoreConnection,
  subscribeToProfile,
  subscribeToSections,
  subscribeToItems,
  syncSaveProfile,
  syncSaveSection,
  syncDeleteSection,
  syncSaveItem,
  syncDeleteItem,
  auth,
} from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
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
  Lock,
  Globe,
  ShieldCheck,
  CloudCheck,
} from 'lucide-react';

const SECTIONS_STORAGE_KEY = 'user_custom_sections_v2';
const ITEMS_STORAGE_KEY = 'user_portfolio_items_v2';
const PROFILE_STORAGE_KEY = 'user_portfolio_profile_v2';
const OWNER_PASSCODE_STORAGE_KEY = 'sai_portfolio_owner_passcode';
const OWNER_AUTH_STORAGE_KEY = 'sai_portfolio_is_owner_unlocked';

const DEFAULT_STARTING_PASSCODE = 'Pleasera**123';

export default function App() {
  // 1. Passcode & Owner Authentication State
  const [currentPasscode, setCurrentPasscode] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(OWNER_PASSCODE_STORAGE_KEY);
      if (!saved || saved === '1234') {
        localStorage.setItem(OWNER_PASSCODE_STORAGE_KEY, DEFAULT_STARTING_PASSCODE);
        return DEFAULT_STARTING_PASSCODE;
      }
      return saved;
    } catch {
      return DEFAULT_STARTING_PASSCODE;
    }
  });

  const [isOwner, setIsOwner] = useState<boolean>(() => {
    try {
      return localStorage.getItem(OWNER_AUTH_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // 2. Sections state
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

  // 3. Items state
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
    return defaultItems;
  });

  // 4. User profile state
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

  // Check URL query parameters for fast owner unlocking (e.g. ?passcode=Pleasera**123 or ?admin=true)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const paramPasscode = params.get('passcode') || params.get('pin');
      const isAdmin = params.get('admin') === 'true' || params.get('owner') === 'true';
      if (paramPasscode === currentPasscode || (isAdmin && currentPasscode === DEFAULT_STARTING_PASSCODE)) {
        setIsOwner(true);
        localStorage.setItem(OWNER_AUTH_STORAGE_KEY, 'true');
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentPasscode]);

  // Firebase Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsOwner(true);
        localStorage.setItem(OWNER_AUTH_STORAGE_KEY, 'true');
      }
    });
    return () => unsubscribe();
  }, []);

  // REAL-TIME FIRESTORE SUBSCRIPTIONS (Every device & visitor updates live!)
  useEffect(() => {
    testFirestoreConnection();

    // 1. Profile real-time listener
    const unsubProfile = subscribeToProfile((remoteProfile) => {
      if (remoteProfile) {
        setProfile((prev) => ({
          ...prev,
          ...remoteProfile,
          name: remoteProfile.name || 'Sai Varshith Vemuri',
        }));
        try {
          localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(remoteProfile));
        } catch (e) {
          console.error(e);
        }
      }
    });

    // 2. Sections real-time listener
    const unsubSections = subscribeToSections((remoteSections) => {
      if (remoteSections && remoteSections.length > 0) {
        setSections(remoteSections);
        try {
          localStorage.setItem(SECTIONS_STORAGE_KEY, JSON.stringify(remoteSections));
        } catch (e) {
          console.error(e);
        }
      }
    });

    // 3. Items real-time listener (all visitors immediately see new additions!)
    const unsubItems = subscribeToItems((remoteItems) => {
      setItems(remoteItems);
      try {
        localStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(remoteItems));
      } catch (e) {
        console.error(e);
      }
    });

    return () => {
      unsubProfile();
      unsubSections();
      unsubItems();
    };
  }, []);

  // Navigation & filter state
  const [activeSectionId, setActiveSectionId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [targetSectionId, setTargetSectionId] = useState<string>('activities');
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);

  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isOwnerAuthModalOpen, setIsOwnerAuthModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  // Lightbox state
  const [lightboxPhotos, setLightboxPhotos] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Owner Mode Auth handlers
  const handleUnlockOwner = () => {
    setIsOwner(true);
    try {
      localStorage.setItem(OWNER_AUTH_STORAGE_KEY, 'true');
    } catch (e) {
      console.error(e);
    }
    showToast('Unlocked Owner Mode. Your edits will update live for all visitors!');
  };

  const handleLockOwner = () => {
    setIsOwner(false);
    try {
      localStorage.removeItem(OWNER_AUTH_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
    showToast('Locked. Viewing website in Read-Only Visitor Mode.');
  };

  const handleUpdatePasscode = (newPasscode: string) => {
    setCurrentPasscode(newPasscode);
    try {
      localStorage.setItem(OWNER_PASSCODE_STORAGE_KEY, newPasscode);
    } catch (e) {
      console.error(e);
    }
    showToast('Passcode updated!');
  };

  // Item operations - Saves directly to Firestore cloud database
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

  const handleSaveItem = async (item: PortfolioItem) => {
    // 1. Optimistic local update
    const existingIndex = items.findIndex((i) => i.id === item.id);
    let updated: PortfolioItem[];
    if (existingIndex >= 0) {
      updated = [...items];
      updated[existingIndex] = item;
      showToast(`Updated "${item.title}" - syncing live...`);
    } else {
      updated = [item, ...items];
      showToast(`Added "${item.title}" - now live for all visitors!`);
    }
    setItems(updated);
    try {
      localStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    // 2. Real-time Cloud Save
    try {
      await syncSaveItem(item, currentPasscode);
    } catch (err) {
      console.error('Failed to sync item to Firestore:', err);
    }
  };

  const handleDeleteItem = async (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    try {
      localStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    showToast('Item deleted live.');

    try {
      await syncDeleteItem(id);
    } catch (err) {
      console.error('Failed to delete item from Firestore:', err);
    }
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

  const handleSaveSection = async (savedSection: Section) => {
    const existingIndex = sections.findIndex((s) => s.id === savedSection.id);
    let updated: Section[];
    if (existingIndex >= 0) {
      updated = [...sections];
      updated[existingIndex] = savedSection;
      showToast(`Updated section "${savedSection.name}" live.`);
    } else {
      updated = [...sections, savedSection];
      setActiveSectionId(savedSection.id);
      showToast(`Created section "${savedSection.name}" live.`);
    }
    setSections(updated);
    try {
      localStorage.setItem(SECTIONS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    try {
      await syncSaveSection(savedSection, currentPasscode);
    } catch (err) {
      console.error('Failed to sync section to Firestore:', err);
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    const updatedSections = sections.filter((s) => s.id !== sectionId);
    setSections(updatedSections);
    const updatedItems = items.filter((i) => i.sectionId !== sectionId);
    setItems(updatedItems);
    if (activeSectionId === sectionId) {
      setActiveSectionId('all');
    }
    showToast('Section and its items deleted live.');

    try {
      await syncDeleteSection(sectionId);
    } catch (err) {
      console.error('Failed to delete section from Firestore:', err);
    }
  };

  // Profile save
  const handleSaveProfile = async (newProfile: UserProfile) => {
    setProfile(newProfile);
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(newProfile));
      showToast('Profile updated live!');
    } catch (e) {
      console.error(e);
    }

    try {
      await syncSaveProfile(newProfile, currentPasscode);
    } catch (err) {
      console.error('Failed to sync profile to Firestore:', err);
    }
  };

  // Lightbox
  const handleOpenPhoto = (photos: string[], index: number) => {
    setLightboxPhotos(photos);
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  // Backup / Data export
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
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.profile) await handleSaveProfile(parsed.profile);
        if (Array.isArray(parsed.sections)) {
          for (const s of parsed.sections) {
            await syncSaveSection(s, currentPasscode);
          }
          setSections(parsed.sections);
        }
        if (Array.isArray(parsed.items)) {
          for (const i of parsed.items) {
            await syncSaveItem(i, currentPasscode);
          }
          setItems(parsed.items);
        }
        showToast('Backup restored and synced to cloud!');
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearAll = () => {
    if (confirm('Clear everything? This will remove all your entries and reset sections.')) {
      setSections(defaultSections);
      setItems([]);
      setProfile(initialProfile);
      localStorage.removeItem(SECTIONS_STORAGE_KEY);
      localStorage.removeItem(ITEMS_STORAGE_KEY);
      localStorage.removeItem(PROFILE_STORAGE_KEY);
      showToast('All local data cleared.');
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
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Curator Mode Status Banner */}
      {isOwner && (
        <aside aria-label="Curator status banner" className="bg-stone-900 text-stone-200 text-xs py-2 px-4 border-b border-stone-800 no-print">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="font-semibold text-emerald-300">Live Cloud Sync Active:</span>
              <span className="text-stone-300 hidden sm:inline">
                Anything you add or edit updates instantly for all visitors worldwide.
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPublishModalOpen(true)}
                className="text-xs text-amber-300 hover:text-amber-200 underline font-medium cursor-pointer flex items-center gap-1"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Hosting Guide</span>
              </button>
              <button
                onClick={handleLockOwner}
                className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 border border-stone-700"
              >
                <Lock className="w-3 h-3 text-amber-400" />
                <span>Lock View</span>
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Top Navigation */}
      <Header
        name={profile.name}
        isOwner={isOwner}
        onOpenOwnerAuth={() => setIsOwnerAuthModalOpen(true)}
        onLockOwner={handleLockOwner}
        onAddNew={() => handleOpenAddItem(sections[0]?.id)}
        onAddSection={handleOpenNewSection}
        onOpenPublishModal={() => setIsPublishModalOpen(true)}
        onExport={handleExportJSON}
        onImport={handleImportJSON}
        onClear={handleClearAll}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onEditProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 w-full space-y-8">
        {/* Profile Card / Header Banner */}
        <ProfileBanner
          profile={profile}
          isOwner={isOwner}
          onEditProfile={() => setIsProfileModalOpen(true)}
          totalItemsCount={items.length}
          totalSectionsCount={sections.length}
        />

        {/* Classy & Rich Navigation Tabs for Activities, Hobbies, etc. */}
        <ClassyTabs
          sections={sections}
          items={items}
          activeSectionId={activeSectionId}
          onSelectSection={setActiveSectionId}
          isOwner={isOwner}
          onOpenNewSection={handleOpenNewSection}
          onAddNewItem={handleOpenAddItem}
        />

        {/* Search Active Indicator */}
        {searchQuery.trim() && (
          <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl px-4 py-3 text-xs text-amber-950 flex items-center justify-between shadow-2xs">
            <div>
              Showing search results for <strong className="font-semibold">"{searchQuery}"</strong> (
              {totalMatchingItems} matching entries)
            </div>
            <button
              onClick={() => setSearchQuery('')}
              className="font-semibold underline hover:text-amber-900 ml-2 cursor-pointer"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Global Empty State */}
        {items.length === 0 && !searchQuery.trim() ? (
          isOwner ? (
            /* OWNER EMPTY STATE */
            <div className="p-8 sm:p-14 border border-stone-300 border-dashed rounded-3xl bg-white text-center space-y-6 max-w-xl mx-auto my-4 shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto border border-amber-200/70 shadow-2xs">
                <Sparkles className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-serif-display font-normal text-stone-900 tracking-tight">
                  Your portfolio is ready for curation
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-md mx-auto font-light">
                  Document your activities, milestones, creative hobbies, and photographs. Every addition is saved directly to the live cloud database and updates in real time for any visitor.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => handleOpenAddItem('activities')}
                  className="w-full sm:w-auto px-5 py-2.5 bg-stone-900 hover:bg-stone-850 text-amber-200 border border-amber-400/25 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
                >
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>+ Add to Activities I Did</span>
                </button>

                <button
                  onClick={() => handleOpenAddItem('hobbies')}
                  className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-stone-50 text-stone-900 border border-stone-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
                >
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>+ Add to My Hobbies</span>
                </button>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleOpenNewSection}
                  className="text-xs font-medium text-stone-500 hover:text-stone-900 inline-flex items-center gap-1 cursor-pointer"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                  <span>or curate a new custom section</span>
                </button>
              </div>
            </div>
          ) : (
            /* VISITOR EMPTY STATE (clean, dignified) */
            <div className="p-8 sm:p-14 border border-stone-200/90 rounded-3xl bg-white text-center space-y-4 max-w-lg mx-auto my-6 shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-[#F6F3ED] text-stone-700 flex items-center justify-center mx-auto border border-stone-200">
                <span className="font-serif-display text-2xl font-bold text-amber-800">SV</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif-display font-normal text-stone-900">
                Welcome to Sai Varshith Vemuri's Portfolio
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-sm mx-auto font-light">
                Activities, projects, and personal hobbies are currently being curated. Check back soon for published archives.
              </p>
            </div>
          )
        ) : null}

        {/* Render Each Visible Section */}
        <div className="space-y-14">
          {visibleSections.map((section) => {
            const sectionItems = getFilteredItemsForSection(section.id);
            const isCustom = !['activities', 'hobbies'].includes(section.id);

            // If searching and no items, hide section
            if (searchQuery.trim() && sectionItems.length === 0) {
              return null;
            }

            return (
              <SectionBlock
                key={section.id}
                section={section}
                items={sectionItems}
                isOwner={isOwner}
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
          <div className="text-center py-16 bg-white border border-stone-200 rounded-3xl p-8 space-y-3 shadow-xs">
            <p className="text-stone-600 font-medium text-sm">
              No entries found matching "{searchQuery}".
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 text-xs font-semibold text-amber-200 bg-stone-900 rounded-xl cursor-pointer"
            >
              Clear Search
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200/80 py-8 bg-[#FAF8F5] text-center text-xs text-stone-500 no-print">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif-display text-sm text-stone-800">
              {profile.name ? `${profile.name} · ` : ''}Digital Portfolio & Candidate Dossier
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-mono font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Synced
            </span>
          </div>
          <div className="flex items-center gap-4 text-stone-500 font-mono text-[11px]">
            <span>{sections.length} Collections</span>
            <span>·</span>
            <span>{items.length} Entries</span>
            {!isOwner ? (
              <button
                onClick={() => setIsOwnerAuthModalOpen(true)}
                className="text-stone-400 hover:text-stone-800 underline cursor-pointer"
              >
                Curator Sign-in
              </button>
            ) : (
              <button
                onClick={handleLockOwner}
                className="text-amber-800 hover:text-amber-950 font-medium underline cursor-pointer"
              >
                Lock Portfolio
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* Owner Authentication Modal */}
      <OwnerAuthModal
        isOpen={isOwnerAuthModalOpen}
        onClose={() => setIsOwnerAuthModalOpen(false)}
        onUnlock={handleUnlockOwner}
        currentPasscode={currentPasscode}
        onUpdatePasscode={handleUpdatePasscode}
      />

      {/* Publish & Hosting Helper Modal */}
      <PublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        profile={profile}
        sections={sections}
        items={items}
      />

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
        onSave={handleSaveProfile}
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
