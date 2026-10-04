import React from 'react';
import { PortfolioItem } from '../types/portfolio';
import { ExternalLink, Pencil, Trash2, Image as ImageIcon } from 'lucide-react';

interface ItemCardProps {
  item: PortfolioItem;
  isPreviewMode: boolean;
  onEdit: (item: PortfolioItem) => void;
  onDelete: (id: string) => void;
  onOpenPhoto: (photos: string[], index: number) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  isPreviewMode,
  onEdit,
  onDelete,
  onOpenPhoto,
}) => {
  const hasPhotos = item.photos && item.photos.length > 0;

  return (
    <article className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col group">
      {/* Photos */}
      {hasPhotos && (
        <div className="relative bg-slate-100 border-b border-slate-100">
          {/* Main Cover Image */}
          <div
            onClick={() => onOpenPhoto(item.photos, 0)}
            className="aspect-16/9 w-full overflow-hidden cursor-pointer relative"
          >
            <img
              src={item.photos[0]}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="bg-black/75 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-xs flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>View {item.photos.length > 1 ? `Photos (${item.photos.length})` : 'Photo'}</span>
              </span>
            </div>
          </div>

          {/* Additional thumbnails if more than 1 photo */}
          {item.photos.length > 1 && (
            <div className="p-2 bg-slate-50 flex items-center gap-2 overflow-x-auto border-t border-slate-100">
              {item.photos.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => onOpenPhoto(item.photos, idx)}
                  className="w-12 h-10 rounded-md overflow-hidden border border-slate-200 hover:border-slate-400 shrink-0 transition-all opacity-80 hover:opacity-100"
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
              <span className="text-slate-500 font-mono-data text-xs">{item.date}</span>
            ) : (
              <span />
            )}

            {!isPreviewMode && (
              <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity no-print">
                <button
                  onClick={() => onEdit(item)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                  title="Edit"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete "${item.title}"?`)) onDelete(item.id);
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg sm:text-xl font-serif-display font-bold text-slate-900 leading-snug">
            {item.title}
          </h3>

          {/* Subtitle / Role */}
          {item.subtitle && (
            <div className="text-xs font-medium text-slate-600">
              {item.subtitle}
            </div>
          )}

          {/* Description */}
          {item.description && (
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {item.description}
            </p>
          )}
        </div>

        {/* Footer: Tags & Link */}
        {((item.tags && item.tags.length > 0) || item.link) && (
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            {item.tags && item.tags.length > 0 ? (
              <div className="flex flex-wrap items-center gap-1.5">
                {item.tags.map((t) => (
                  <span
                    key={t}
                    className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            ) : <div />}

            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-slate-800 hover:text-indigo-600 flex items-center gap-1 transition-colors"
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
