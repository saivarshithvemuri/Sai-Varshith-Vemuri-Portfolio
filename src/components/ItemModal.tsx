import React, { useState, useRef, useEffect } from 'react';
import { PortfolioItem, Section } from '../types/portfolio';
import { fileToCompressedDataUrl } from '../utils/imageUtils';
import { X, Upload, Trash2, Image as ImageIcon, Check, Plus, Link as LinkIcon, Sparkles } from 'lucide-react';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: PortfolioItem) => void;
  sections: Section[];
  initialSectionId: string;
  initialItem?: PortfolioItem | null;
}

export const ItemModal: React.FC<ItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  sections,
  initialSectionId,
  initialItem,
}) => {
  const [sectionId, setSectionId] = useState(initialSectionId);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [showPhotoUrlInput, setShowPhotoUrlInput] = useState(false);
  const [tagsInput, setTagsInput] = useState('');
  const [link, setLink] = useState('');
  const [isProcessingPhotos, setIsProcessingPhotos] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialItem) {
      setSectionId(initialItem.sectionId);
      setTitle(initialItem.title || '');
      setSubtitle(initialItem.subtitle || '');
      setDate(initialItem.date || '');
      setDescription(initialItem.description || '');
      setPhotos(initialItem.photos || []);
      setTagsInput(initialItem.tags ? initialItem.tags.join(', ') : '');
      setLink(initialItem.link || '');
    } else {
      setSectionId(initialSectionId || (sections[0]?.id ?? 'activities'));
      setTitle('');
      setSubtitle('');
      setDate('');
      setDescription('');
      setPhotos([]);
      setTagsInput('');
      setLink('');
    }
    setPhotoUrlInput('');
    setShowPhotoUrlInput(false);
  }, [initialItem, initialSectionId, isOpen, sections]);

  if (!isOpen) return null;

  const currentSection = sections.find((s) => s.id === sectionId);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessingPhotos(true);
    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const compressed = await fileToCompressedDataUrl(files[i], 1200, 0.82);
        newUrls.push(compressed);
      }
      setPhotos((prev) => [...prev, ...newUrls]);
    } catch (err) {
      alert('Could not process selected image.');
    } finally {
      setIsProcessingPhotos(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddPhotoByUrl = () => {
    const url = photoUrlInput.trim();
    if (!url) return;
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('data:image')) {
      alert('Please enter a valid image URL starting with http:// or https://');
      return;
    }
    setPhotos((prev) => [...prev, url]);
    setPhotoUrlInput('');
    setShowPhotoUrlInput(false);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a title for this portfolio entry.');
      return;
    }

    const cleanedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const savedItem: PortfolioItem = {
      id: initialItem ? initialItem.id : `item-${Date.now()}`,
      sectionId,
      title: title.trim(),
      subtitle: subtitle.trim() || undefined,
      date: date.trim() || undefined,
      description: description.trim(),
      photos,
      tags: cleanedTags.length > 0 ? cleanedTags : undefined,
      link: link.trim() || undefined,
      createdAt: initialItem ? initialItem.createdAt : Date.now(),
    };

    onSave(savedItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-3xl border border-stone-200 shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-6 py-5 bg-[#FAF8F5] border-b border-stone-200">
          <div>
            <h2 className="text-xl font-serif-display font-normal text-stone-900 tracking-tight">
              {initialItem ? 'Edit Portfolio Entry' : `Curate Entry into ${currentSection?.name || 'Collection'}`}
            </h2>
            <p className="text-xs text-stone-500 font-light mt-0.5">
              Add photographs and commentary to document this achievement or activity.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-sm">
          {/* Section selector */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Curated Collection</label>
            <select
              value={sectionId}
              onChange={(e) => setSectionId(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:bg-white focus:outline-none focus:border-stone-400 shadow-2xs"
            >
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-800">
              Title / Activity Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Classical Piano Solo Recital, Robotics Software Lead, Science Olympiad..."
              className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium focus:bg-white focus:outline-none focus:border-stone-400 shadow-2xs"
            />
          </div>

          {/* Subtitle / Role & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-800">Role / Subtitle (optional)</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Lead Developer / 4 Years / Regional Finalist"
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-none focus:border-stone-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-800">Timeline / Year (optional)</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. 2024 - 2026, Grade 11, Summer 2025"
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-none focus:border-stone-400"
              />
            </div>
          </div>

          {/* PHOTOS SECTION */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-stone-600" />
                <span>Visual Documentation & Gallery</span>
              </label>
              <span className="text-[11px] font-mono text-stone-400">Multiple photos supported</span>
            </div>

            {/* Photo Previews */}
            {photos.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-2">
                {photos.map((photoUrl, idx) => (
                  <div
                    key={idx}
                    className="relative group aspect-square rounded-xl overflow-hidden border border-stone-200 bg-stone-100 shadow-2xs"
                  >
                    <img src={photoUrl} alt="Upload preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute top-1 right-1 p-1 bg-stone-900/80 hover:bg-rose-600 text-white rounded-lg transition-colors cursor-pointer"
                      title="Remove photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 bg-stone-950/80 text-amber-200 text-[9px] font-semibold px-1.5 py-0.5 rounded">
                        Cover
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Upload Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <button
                type="button"
                disabled={isProcessingPhotos}
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-stone-200 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-stone-600" />
                <span>{isProcessingPhotos ? 'Processing images...' : '+ Upload Photos from Device'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowPhotoUrlInput(!showPhotoUrlInput)}
                className="px-3 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-50 rounded-xl transition-colors border border-stone-200 cursor-pointer"
              >
                + Paste Image URL
              </button>
            </div>

            {/* Direct Image URL input */}
            {showPhotoUrlInput && (
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="url"
                  value={photoUrlInput}
                  onChange={(e) => setPhotoUrlInput(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="flex-1 p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddPhotoByUrl}
                  className="px-3.5 py-2 bg-stone-900 text-amber-200 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Add URL
                </button>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1 pt-1 border-t border-stone-100">
            <label className="text-xs font-semibold text-stone-800">
              Description / Notes & Milestones
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail your responsibilities, breakthroughs, skills practiced, or artistic motivations..."
              className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-stone-400 leading-relaxed text-xs sm:text-sm shadow-2xs"
            />
          </div>

          {/* Tags & Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-stone-100">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">Tags / Skills (comma separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. Leadership, Python, Chamber Music, Outreach..."
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">Project / Portfolio Link URL</label>
              <input
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://github.com/... or https://..."
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-amber-200 bg-stone-900 hover:bg-stone-800 border border-amber-400/25 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{initialItem ? 'Save Updates' : 'Add to Collection'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
