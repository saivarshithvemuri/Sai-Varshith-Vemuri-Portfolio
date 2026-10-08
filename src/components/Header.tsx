import React, { useState } from 'react';
import {
  Lock,
  Printer,
  Plus,
  Download,
  Upload,
  Trash2,
  Check,
  Share2,
  FolderPlus,
  Search,
  Globe,
  ShieldCheck,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  name: string;
  isOwner: boolean;
  onOpenOwnerAuth: () => void;
  onLockOwner: () => void;
  onAddNew: () => void;
  onAddSection: () => void;
  onOpenPublishModal: () => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onEditProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  name,
  isOwner,
  onOpenOwnerAuth,
  onLockOwner,
  onAddNew,
  onAddSection,
  onOpenPublishModal,
  onExport,
  onImport,
  onClear,
  searchQuery,
  onSearchChange,
  onEditProfile,
}) => {
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const displayName = name && name.trim() ? name : 'Sai Varshith Vemuri';

  // Compute initials for avatar (e.g., "SV" for Sai Varshith Vemuri)
  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0]?.slice(0, 2).toUpperCase() || 'SV';
  };

  const initials = getInitials(displayName);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/92 backdrop-blur-md border-b border-stone-200/80 transition-all no-print">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-3">
        {/* Left Side: Editorial Crest & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-stone-900 via-stone-850 to-stone-950 text-amber-300 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-[0_2px_8px_rgba(28,25,23,0.12)]">
            <span className="font-serif-display text-lg font-bold tracking-wider text-amber-200">
              SV
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-serif-display font-bold text-stone-900 truncate tracking-tight">
                {displayName}
              </span>
              {isOwner && (
                <span className="hidden lg:inline-flex items-center gap-1 bg-amber-50 text-amber-900 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md border border-amber-300/60 font-semibold shadow-2xs">
                  <ShieldCheck className="w-3 h-3 text-amber-700" />
                  <span>Curator Mode</span>
                </span>
              )}
            </div>
            <span className="text-[11px] font-mono text-stone-600 tracking-wider uppercase hidden sm:block">
              Candidate Dossier & Portfolio
            </span>
          </div>
        </div>

        {/* Center: Search Bar with luxury catalog style */}
        <div className="hidden md:flex items-center relative flex-1 max-w-xs mx-3">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search activities, hobbies, archives..."
            className="w-full pl-8.5 pr-3 py-1.5 bg-white/90 hover:bg-white focus:bg-white border border-stone-200 focus:border-stone-400 rounded-xl text-xs text-stone-900 focus:outline-none placeholder:text-stone-400 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-stone-400 hover:text-stone-700 w-4 h-4 rounded-full flex items-center justify-center hover:bg-stone-100"
            >
              ✕
            </button>
          )}
        </div>

        {/* Right Side: Actions + Prominent Name Badge */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Share Button */}
          <button
            onClick={handleShare}
            className="hidden lg:flex px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-950 bg-white/80 hover:bg-white border border-stone-200 rounded-xl transition-all items-center gap-1.5 shadow-2xs cursor-pointer hover:border-stone-300"
            title="Copy shareable portfolio link"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-stone-500" />}
            <span>{copied ? 'Copied Link' : 'Share'}</span>
          </button>

          {/* Print / PDF Dossier */}
          <button
            onClick={() => window.print()}
            className="hidden sm:flex px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-950 bg-white/80 hover:bg-white border border-stone-200 rounded-xl transition-all items-center gap-1.5 shadow-2xs cursor-pointer hover:border-stone-300"
            title="Generate print document or save as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-stone-500" />
            <span className="hidden xl:inline">Print / PDF</span>
          </button>

          {/* OWNER CONTROLS (Only visible if isOwner is true) */}
          {isOwner ? (
            <>
              {/* Primary Add Button with luxury styling */}
              <button
                onClick={onAddNew}
                className="px-3.5 py-1.5 text-xs font-semibold text-amber-200 bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 hover:from-stone-850 hover:to-stone-800 border border-amber-400/25 rounded-xl transition-all flex items-center gap-1.5 shadow-sm hover:shadow cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">Add Highlight</span>
                <span className="sm:hidden">Add</span>
              </button>

              {/* Lock Mode Button */}
              <button
                onClick={onLockOwner}
                className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-white/80 hover:bg-white border border-stone-200 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                title="Lock portfolio and view as public visitor"
              >
                <Lock className="w-3.5 h-3.5 text-amber-700" />
                <span className="hidden md:inline">Lock View</span>
              </button>

              {/* Data & Backup dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-1.5 sm:p-2 text-stone-500 hover:text-stone-900 rounded-xl hover:bg-white border border-transparent hover:border-stone-200 transition-colors cursor-pointer"
                  title="Archive & Sync Options"
                >
                  ···
                </button>

                {showSettings && (
                  <div
                    onClick={() => setShowSettings(false)}
                    className="absolute right-0 mt-2 w-52 bg-white border border-stone-200 rounded-2xl shadow-xl py-1.5 text-xs z-50 animate-fade-in"
                  >
                    <button
                      onClick={onOpenPublishModal}
                      className="w-full px-3.5 py-2 text-left text-stone-800 font-medium hover:bg-stone-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Globe className="w-3.5 h-3.5 text-amber-700" />
                      <span>Hosting & Export Guide</span>
                    </button>

                    <button
                      onClick={onAddSection}
                      className="w-full px-3.5 py-2 text-left text-stone-700 hover:bg-stone-50 flex items-center gap-2 cursor-pointer"
                    >
                      <FolderPlus className="w-3.5 h-3.5 text-stone-400" />
                      <span>Create New Section</span>
                    </button>

                    <button
                      onClick={onExport}
                      className="w-full px-3.5 py-2 text-left text-stone-700 hover:bg-stone-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-stone-400" />
                      <span>Export Archive (JSON)</span>
                    </button>

                    <label className="w-full px-3.5 py-2 text-left text-stone-700 hover:bg-stone-50 flex items-center gap-2 cursor-pointer">
                      <Upload className="w-3.5 h-3.5 text-stone-400" />
                      <span>Import Archive</span>
                      <input type="file" accept=".json" onChange={onImport} className="hidden" />
                    </label>

                    <div className="my-1 border-t border-stone-100" />

                    <button
                      onClick={onClear}
                      className="w-full px-3.5 py-2 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Reset Local Cache</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* VISITOR VIEW: Discreet Curator Access button */
            <button
              onClick={onOpenOwnerAuth}
              className="p-1.5 sm:px-3 sm:py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-white/80 hover:bg-white border border-stone-200 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer hover:border-stone-300"
              title="Curator sign-in (enter passcode to edit)"
            >
              <Lock className="w-3.5 h-3.5 text-stone-400" />
              <span className="hidden sm:inline">Curator Access</span>
            </button>
          )}

          {/* NAME ON THE TOP RIGHT HAND SIDE: Sai Varshith Vemuri */}
          <button
            type="button"
            onClick={isOwner ? onEditProfile : undefined}
            className={`flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-stone-200/90 text-left transition-all ${
              isOwner ? 'hover:opacity-90 cursor-pointer group' : 'cursor-default'
            }`}
            title={isOwner ? 'Click to edit your personal dossier' : `Portfolio of ${displayName}`}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-stone-900 via-stone-850 to-stone-950 text-amber-300 font-serif-display font-semibold flex items-center justify-center text-sm shrink-0 shadow-xs border border-amber-400/30 group-hover:border-amber-400 transition-colors">
              {initials}
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <span className="text-xs sm:text-sm font-semibold text-stone-900 whitespace-nowrap tracking-tight group-hover:text-amber-950 transition-colors">
                {displayName}
              </span>
              <span className="text-[10px] text-amber-800 font-mono font-medium leading-none tracking-wider uppercase hidden sm:block">
                {isOwner ? 'Verified Curator' : 'Candidate'}
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
