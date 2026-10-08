import React, { useState, useRef } from 'react';
import { Profile } from '../types/portfolio';
import { fileToCompressedDataUrl } from '../utils/imageUtils';
import { X, Camera, Trash2, Check, User } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
  onSave: (updated: Profile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const [formData, setFormData] = useState<Profile>(profile);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setFormData(profile);
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const dataUrl = await fileToCompressedDataUrl(file, 600, 0.85);
      setFormData((prev) => ({ ...prev, avatarUrl: dataUrl }));
    } catch (err) {
      alert('Could not process avatar image.');
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-3xl border border-stone-200 shadow-2xl overflow-hidden my-4 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-[#FAF8F5] border-b border-stone-200">
          <div>
            <h2 className="text-xl font-serif-display font-normal text-stone-900 tracking-tight">
              Edit Candidate Dossier
            </h2>
            <p className="text-xs text-stone-500 font-light mt-0.5">
              Update personal identity, academic background, bio, and contact links.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm max-h-[80vh] overflow-y-auto">
          {/* Avatar Upload */}
          <div className="flex items-center gap-4 pb-3 border-b border-stone-100">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0 shadow-2xs">
              {formData.avatarUrl ? (
                <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-400 font-serif-display font-bold text-lg">
                  SV
                </div>
              )}
            </div>

            <div className="space-y-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-stone-200 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-stone-600" />
                  <span>{uploadingAvatar ? 'Uploading...' : 'Upload Portrait'}</span>
                </button>
                {formData.avatarUrl && (
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, avatarUrl: '' }))}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Remove photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <p className="text-[11px] font-mono text-stone-400">Formal portrait or headshot</p>
            </div>
          </div>

          {/* Name & Major */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Sai Varshith Vemuri"
              className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-serif-display text-lg focus:bg-white focus:outline-none focus:border-stone-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">Intended Major / Discipline</label>
              <input
                type="text"
                value={formData.major}
                onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                placeholder="e.g. Computer Science, Mechanical Engineering..."
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-none focus:border-stone-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">School & Graduation Class</label>
              <input
                type="text"
                value={formData.school}
                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                placeholder="e.g. Oakridge High School · Class of 2026"
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-none focus:border-stone-400"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Statement / Personal Biography</label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="A concise summary of your intellectual passions, leadership responsibilities, and long-term aspirations..."
              className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-stone-400 leading-relaxed text-xs sm:text-sm font-light"
            />
          </div>

          {/* Contact & Links */}
          <div className="pt-2 border-t border-stone-100 space-y-2">
            <div className="text-xs font-semibold text-stone-500 uppercase font-mono tracking-wider">
              Communication & Social Channels
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email address"
                className="p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
              />
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="Personal website / demo"
                className="p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
              />
              <input
                type="url"
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                placeholder="GitHub profile URL"
                className="p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
              />
              <input
                type="url"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                placeholder="LinkedIn profile URL"
                className="p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-stone-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-amber-200 bg-stone-900 hover:bg-stone-850 border border-amber-400/25 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save Dossier</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
