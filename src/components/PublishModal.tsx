import React, { useState } from 'react';
import { Section, PortfolioItem, UserProfile } from '../types/portfolio';
import { X, Download, Copy, Check, Globe, ShieldCheck, FileCode } from 'lucide-react';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  sections: Section[];
  items: PortfolioItem[];
}

export const PublishModal: React.FC<PublishModalProps> = ({
  isOpen,
  onClose,
  profile,
  sections,
  items,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedJSON, setCopiedJSON] = useState(false);

  if (!isOpen) return null;

  const portfolioExport = {
    profile,
    sections,
    items,
    publishedAt: new Date().toISOString(),
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(portfolioExport, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', 'portfolioData.json');
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const codeString = `import { Section, UserProfile, PortfolioItem } from '../types/portfolio';

export const defaultSections: Section[] = ${JSON.stringify(sections, null, 2)};

export const initialProfile: UserProfile = ${JSON.stringify(profile, null, 2)};

export const defaultItems: PortfolioItem[] = ${JSON.stringify(items, null, 2)};

export const initialBlankProfile = initialProfile;
`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeString);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(portfolioExport, null, 2));
    setCopiedJSON(true);
    setTimeout(() => setCopiedJSON(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-3xl border border-stone-200 shadow-2xl overflow-hidden my-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-[#FAF8F5] border-b border-stone-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-stone-900 text-amber-300 flex items-center justify-center border border-amber-400/30">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-serif-display font-medium text-stone-900">
                Hosting & Live Deployment Guide
              </h2>
              <p className="text-[11px] text-stone-500 font-light">
                Public read-only security and multi-device cloud synchronization
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Security Notice */}
          <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-950 leading-relaxed font-light">
              <strong className="font-semibold text-emerald-900">Zero-Tampering Security Active:</strong>
              <p className="mt-1">
                Anyone visiting your hosted domain (Vercel, Netlify, GitHub Pages, or free hoster) views this dossier in <strong>Curated Public Mode</strong>. Visitors cannot edit your profile, add entries, or delete sections. Only you can unlock it using your secret passcode (<code className="bg-emerald-100 px-1 py-0.5 rounded font-mono font-bold text-emerald-900">Pleasera**123</code>).
              </p>
            </div>
          </div>

          {/* Cloud Database Notice */}
          <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-start gap-3">
            <Globe className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-950 leading-relaxed font-light">
              <strong className="font-semibold text-amber-900">Real-Time Cloud Synchronization:</strong>
              <p className="mt-1">
                When you add or update a hobby, activity, or photograph, it writes to your cloud database in real time. Anyone opening the site on any browser or phone will immediately see the updated collection.
              </p>
            </div>
          </div>

          {/* Export Options */}
          <div className="space-y-3 pt-2 border-t border-stone-200">
            <h3 className="text-xs font-semibold text-stone-900 uppercase font-mono tracking-wider">
              Offline Backups & Source Data
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleDownloadJSON}
                className="p-3.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-2xl text-left transition-colors flex items-center justify-between group cursor-pointer shadow-2xs"
              >
                <div>
                  <div className="font-medium text-xs text-stone-900 flex items-center gap-1.5">
                    <Download className="w-4 h-4 text-stone-500" />
                    <span>Download JSON File</span>
                  </div>
                  <div className="text-[11px] text-stone-500 font-light mt-0.5">
                    Save a full archive of all entries
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={handleCopyJSON}
                className="p-3.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-2xl text-left transition-colors flex items-center justify-between group cursor-pointer shadow-2xs"
              >
                <div>
                  <div className="font-medium text-xs text-stone-900 flex items-center gap-1.5">
                    {copiedJSON ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-stone-500" />}
                    <span>{copiedJSON ? 'Copied JSON!' : 'Copy Raw JSON'}</span>
                  </div>
                  <div className="text-[11px] text-stone-500 font-light mt-0.5">
                    Copy export to clipboard
                  </div>
                </div>
              </button>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleCopyCode}
                className="w-full p-3 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-2xl text-left transition-colors flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-stone-500" />
                  <span className="text-xs font-medium text-stone-800">
                    Copy static code for <code className="font-mono text-stone-600">defaultPortfolio.ts</code>
                  </span>
                </div>
                {copiedCode && <span className="text-xs text-emerald-700 font-semibold font-mono">Copied!</span>}
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-stone-200 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-xs font-semibold text-amber-200 bg-stone-900 hover:bg-stone-850 rounded-xl border border-amber-400/25 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
