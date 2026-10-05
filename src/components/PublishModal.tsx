import React, { useState } from 'react';
import { Section, PortfolioItem, UserProfile } from '../types/portfolio';
import { X, Download, Copy, Check, Globe, ShieldCheck, FileCode, ExternalLink } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-serif-display">
                Host & Publish Your Website
              </h2>
              <p className="text-xs text-slate-500">
                Lock edits and display your content to visitors on any free host
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Security Notice */}
          <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-900 leading-relaxed">
              <strong>Your site is now protected:</strong>
              <p className="mt-1">
                Anyone visiting your hosted link will see it in <strong>Read-Only Mode</strong>. They cannot edit your profile, add items, or delete sections. Only you can unlock it using your secret passcode (default: <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono font-bold">1234</code>).
              </p>
            </div>
          </div>

          {/* Publishing Steps */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              How to Publish Content to your Free Hoster (Vercel, Netlify, GitHub Pages)
            </h3>

            {/* Method 1: Download portfolioData.json */}
            <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold">1</span>
                  Recommended: Download Data File
                </span>
                <span className="text-[11px] bg-indigo-50 text-indigo-700 font-medium px-2 py-0.5 rounded">
                  Instant
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Download <code className="bg-white border px-1 py-0.5 rounded text-slate-800 font-mono">portfolioData.json</code> and place it inside your project's <code className="bg-white border px-1 py-0.5 rounded text-slate-800 font-mono">public/</code> directory. When deployed, your host will automatically serve your activities, hobbies, and photos to all visitors.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadJSON}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download portfolioData.json</span>
                </button>
                <button
                  onClick={handleCopyJSON}
                  className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  {copiedJSON ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedJSON ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>
            </div>

            {/* Method 2: Embed directly into defaultPortfolio.ts */}
            <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold">2</span>
                  Alternative: Embed Directly in Code
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Copy this code and replace the content of <code className="bg-white border px-1 py-0.5 rounded text-slate-800 font-mono">src/data/defaultPortfolio.ts</code>. Your items will be permanently bundled directly into the compiled app.
              </p>
              <button
                onClick={handleCopyCode}
                className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <FileCode className="w-3.5 h-3.5 text-indigo-600" />}
                <span>{copiedCode ? 'Code Copied to Clipboard!' : 'Copy Code for defaultPortfolio.ts'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
