import React from 'react';
import { PortfolioItem } from '../types/portfolio';
import { ExternalLink, Pencil, Trash2, Image as ImageIcon } from 'lucide-react';

interface ItemCardProps {
  item: PortfolioItem;
  isOwner: boolean;
  onEdit: (item: PortfolioItem) => void;
  onDelete: (id: string) => void;
  onOpenPhoto: (photos: string[], index: number) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  isOwner,
  onEdit,
  onDelete,
  onOpenPhoto,
}) => {
  const hasPhotos = item.photos && item.photos.length > 0;

  return (
    <article className="luxury-card rounded-2xl overflow-hidden flex flex-col group transition-all duration-300">
      {/* Photos */}
      {hasPhotos && (
        <div className="relative bg-stone-100 border-b border-stone-100 overflow-hidden">
          {/* Main Cover Image */}
          <div
            onClick={() => onOpenPhoto(item.photos, 0)}
            className="aspect-16/10 w-full overflow-hidden cursor-pointer relative bg-stone-200"
          >
            <img
              src={item.photos[0]}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-stone-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="bg-stone-950/80 text-amber-200 text-xs px-3 py-1.5 rounded-full backdrop-blur-xs flex items-center gap-1.5 border border-amber-300/20 shadow-md">
                <ImageIcon className="w-3.5 h-3.5 text-amber-300" />
                <span>View {item.photos.length > 1 ? `Gallery (${item.photos.length})` : 'Image'}</span>
              </span>
            </div>
          </div>

          {/* Additional thumbnails if more than 1 photo */}
          {item.photos.length > 1 && (
            <div className="p-2 bg-[#F9F7F3] flex items-center gap-1.5 overflow-x-auto border-t border-stone-200/60 scrollbar-none">
              {item.photos.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => onOpenPhoto(item.photos, idx)}
                  className="w-11 h-9 rounded-lg overflow-hidden border border-stone-200 hover:border-amber-500/60 shrink-0 transition-all opacity-85 hover:opacity-100 cursor-pointer shadow-2xs"
                >
                  <img src={p} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Top Date & Edit actions */}
          <div className="flex items-center justify-between gap-2 text-xs">
            {item.date ? (
              <span className="text-stone-400 font-mono text-[11px] tracking-wider uppercase">
                {item.date}
              </span>
            ) : (
              <span className="text-stone-300 text-[11px] font-mono">Portfolio Entry</span>
            )}

            {/* ONLY visible if unlocked as Owner */}
            {isOwner && (
              <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity no-print">
                <button
                  onClick={() => onEdit(item)}
                  className="p-1.5 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                  title="Edit item"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete "${item.title}"?`)) onDelete(item.id);
                  }}
                  className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl sm:text-2xl font-serif-display font-normal text-stone-900 group-hover:text-amber-950 transition-colors leading-snug">
            {item.title}
          </h3>

          {/* Subtitle / Role */}
          {item.subtitle && (
            <div className="text-xs font-medium text-stone-600 font-sans tracking-wide">
              {item.subtitle}
            </div>
          )}

          {/* Description */}
          {item.description && (
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed whitespace-pre-line font-light">
              {item.description}
            </p>
          )}
        </div>

        {/* Footer: Tags & Link */}
        {((item.tags && item.tags.length > 0) || item.link) && (
          <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            {item.tags && item.tags.length > 0 ? (
              <div className="flex flex-wrap items-center gap-1.5">
                {item.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] text-stone-500 bg-[#F4F1EA] px-2 py-0.5 rounded-md font-sans"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            ) : (
              <div />
            )}

            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-amber-900 hover:text-amber-950 font-medium hover:underline ml-auto"
              >
                <span>View Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
};
