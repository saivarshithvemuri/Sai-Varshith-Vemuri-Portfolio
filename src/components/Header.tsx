import React, { useState } from 'react';
import {
  Lock,
  Unlock,
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

  const displayName = name || 'Sai Varshith Vemuri';

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
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-slate-200/80 no-print">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Left Side: Brand / Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-300 font-serif-display font-bold flex items-center justify-center shrink-0 text-base shadow-2xs">
            ★
          </div>
          <span className="text-sm sm:text-base font-serif-display font-bold text-slate-900 truncate">
            Digital Showcase
          </span>
          {isOwner && (
            <span className="hidden md:inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-[10px] font-semibold uppercase px-2 py-0.5 rounded border border-emerald-200">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Owner Mode</span>
            </span>
          )}
        </div>

        {/* Center: Search Bar on tablet/desktop */}
        <div className="hidden md:flex items-center relative flex-1 max-w-xs mx-2">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search hobbies, activities..."
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-slate-900 placeholder:text-slate-400 shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-700"
            >
              ✕
            </button>
          )}
        </div>

        {/* Right Side: Actions + Name */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Share */}
          <button
            onClick={handleShare}
            className="hidden lg:flex p-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors items-center gap-1.5 shadow-2xs cursor-pointer"
            title="Copy link"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Share'}</span>
          </button>

          {/* Print / PDF */}
          <button
            onClick={() => window.print()}
            className="hidden sm:flex p-2 md:px-3 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors items-center gap-1.5 shadow-2xs cursor-pointer"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden xl:inline">Print / PDF</span>
          </button>

          {/* OWNER CONTROLS (Only visible if isOwner is true) */}
          {isOwner ? (
            <>
              {/* Publish & Host Helper */}
              <button
                onClick={onOpenPublishModal}
                className="hidden sm:flex px-2.5 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors items-center gap-1.5 shadow-2xs cursor-pointer"
                title="Publish for Free Hoster (Vercel, Netlify, GitHub Pages)"
              >
                <Globe className="w-3.5 h-3.5 text-indigo-600" />
                <span>Publish</span>
              </button>

              {/* Add Section Button */}
              <button
                onClick={onAddSection}
                className="hidden xl:flex px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors items-center gap-1.5 shadow-2xs cursor-pointer"
                title="Add a new custom section"
              >
                <FolderPlus className="w-3.5 h-3.5 text-slate-500" />
                <span>+ Section</span>
              </button>

              {/* Primary Add Button */}
              <button
                onClick={onAddNew}
                className="px-3 sm:px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">Add Stuff</span>
                <span className="sm:hidden">Add</span>
              </button>

              {/* Lock Button */}
              <button
                onClick={onLockOwner}
                className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                title="Lock and view as visitor"
              >
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden md:inline">Lock</span>
              </button>

              {/* Data dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-1.5 sm:p-2 text-xs text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Backup & Options"
                >
                  ···
                </button>

                {showSettings && (
                  <div
                    onClick={() => setShowSettings(false)}
                    className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1 text-xs z-50 animate-fade-in"
                  >
                    <button
                      onClick={onOpenPublishModal}
                      className="w-full px-3 py-2 text-left text-indigo-700 font-medium hover:bg-indigo-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Globe className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Publish & Deploy Helper</span>
                    </button>

                    <button
                      onClick={onAddSection}
                      className="w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <FolderPlus className="w-3.5 h-3.5 text-slate-400" />
                      <span>Create New Section</span>
                    </button>

                    <button
                      onClick={onExport}
                      className="w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-400" />
                      <span>Export Backup (JSON)</span>
                    </button>

                    <label className="w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer">
                      <Upload className="w-3.5 h-3.5 text-slate-400" />
                      <span>Import Backup</span>
                      <input type="file" accept=".json" onChange={onImport} className="hidden" />
                    </label>

                    <div className="my-1 border-t border-slate-100" />

                    <button
                      onClick={onClear}
                      className="w-full px-3 py-2 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear All</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* VISITOR VIEW: Discreet Owner Login button */
            <button
              onClick={onOpenOwnerAuth}
              className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
              title="Owner access (enter passcode to edit)"
            >
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Owner Login</span>
            </button>
          )}

          {/* NAME ON THE TOP RIGHT HAND SIDE: Sai Varshith Vemuri */}
          <button
            type="button"
            onClick={isOwner ? onEditProfile : undefined}
            className={`flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200/90 text-left ${
              isOwner ? 'hover:opacity-85 cursor-pointer group' : 'cursor-default'
            }`}
            title={isOwner ? 'Click to edit profile details' : 'Sai Varshith Vemuri'}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-900 to-slate-800 text-amber-300 font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs border border-amber-300/30">
              {initials}
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-xs sm:text-sm font-bold text-slate-900 whitespace-nowrap tracking-tight">
                {displayName}
              </span>
              <span className="text-[10px] text-slate-500 font-medium leading-none hidden sm:block">
                Portfolio
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
