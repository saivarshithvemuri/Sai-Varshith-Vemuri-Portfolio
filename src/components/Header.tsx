import React, { useState } from 'react';
import { Eye, EyeOff, Printer, Plus, Download, Upload, Trash2, Check, Share2, FolderPlus, Search, User } from 'lucide-react';

interface HeaderProps {
  name: string;
  isPreviewMode: boolean;
  onTogglePreview: () => void;
  onAddNew: () => void;
  onAddSection: () => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onEditProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  name,
  isPreviewMode,
  onTogglePreview,
  onAddNew,
  onAddSection,
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
          {isPreviewMode && (
            <span className="hidden md:inline-block bg-indigo-50 text-indigo-700 text-[10px] font-semibold uppercase px-2 py-0.5 rounded tracking-wider border border-indigo-200/60">
              Preview
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
            className="hidden lg:flex p-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors items-center gap-1.5 shadow-2xs"
            title="Copy link"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Share'}</span>
          </button>

          {/* Print / PDF */}
          <button
            onClick={() => window.print()}
            className="hidden sm:flex p-2 md:px-3 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors items-center gap-1.5 shadow-2xs"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden xl:inline">Print / PDF</span>
          </button>

          {/* Preview Toggle */}
          <button
            onClick={onTogglePreview}
            className={`px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 shadow-2xs ${
              isPreviewMode
                ? 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
            title={isPreviewMode ? 'Switch back to Edit Mode' : 'Preview as Admissions Officer / Visitor'}
          >
            {isPreviewMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-slate-500" />}
            <span className="hidden sm:inline">{isPreviewMode ? 'Exit' : 'Preview'}</span>
          </button>

          {/* Add Section Button (in edit mode) */}
          {!isPreviewMode && (
            <button
              onClick={onAddSection}
              className="hidden xl:flex px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors items-center gap-1.5 shadow-2xs"
              title="Add a new custom section"
            >
              <FolderPlus className="w-3.5 h-3.5 text-slate-500" />
              <span>+ Section</span>
            </button>
          )}

          {/* Primary Add Button (in edit mode) */}
          {!isPreviewMode && (
            <button
              onClick={onAddNew}
              className="px-3 sm:px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Add Stuff</span>
              <span className="sm:hidden">Add</span>
            </button>
          )}

          {/* Data dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1.5 sm:p-2 text-xs text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              title="Backup & Options"
            >
              ···
            </button>

            {showSettings && (
              <div
                onClick={() => setShowSettings(false)}
                className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1 text-xs z-50 animate-fade-in"
              >
                {!isPreviewMode && (
                  <button
                    onClick={onAddSection}
                    className="w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <FolderPlus className="w-3.5 h-3.5 text-slate-400" />
                    <span>Create New Section</span>
                  </button>
                )}

                <button
                  onClick={onExport}
                  className="w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2"
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
                  className="w-full px-3 py-2 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              </div>
            )}
          </div>

          {/* NAME ON THE TOP RIGHT HAND SIDE: Sai Varshith Vemuri */}
          <button
            type="button"
            onClick={onEditProfile}
            className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200/90 hover:opacity-85 transition-all text-left group cursor-pointer focus:outline-hidden"
            title="Sai Varshith Vemuri"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-900 to-slate-800 text-amber-300 font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs border border-amber-300/30 group-hover:scale-105 transition-transform">
              {initials}
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors whitespace-nowrap tracking-tight">
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
