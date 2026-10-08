import React from 'react';
import { UserProfile } from '../types/portfolio';
import { Pencil, User, Globe, Github, Linkedin, Mail, Sparkles, CheckCircle2 } from 'lucide-react';

interface ProfileBannerProps {
  profile: UserProfile;
  isOwner: boolean;
  onEditProfile: () => void;
  totalItemsCount?: number;
  totalSectionsCount?: number;
}

export const ProfileBanner: React.FC<ProfileBannerProps> = ({
  profile,
  isOwner,
  onEditProfile,
  totalItemsCount = 0,
  totalSectionsCount = 0,
}) => {
  const displayName = profile.name && profile.name.trim() ? profile.name : 'Sai Varshith Vemuri';

  return (
    <div className="bg-white border border-[#E7E2D9] rounded-3xl p-6 sm:p-8 md:p-9 shadow-[0_4px_24px_-4px_rgba(28,25,23,0.03)] relative overflow-hidden transition-all">
      {/* Decorative subtle luxury background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-100/30 via-stone-50/20 to-transparent pointer-events-none rounded-bl-full" />

      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 sm:gap-8 relative z-10">
        {/* Portrait / Avatar */}
        <div
          onClick={() => {
            if (isOwner) onEditProfile();
          }}
          className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/90 shadow-sm shrink-0 ${
            isOwner ? 'cursor-pointer group ring-offset-2 hover:ring-2 hover:ring-amber-500/30 transition-all' : ''
          }`}
        >
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={displayName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 bg-gradient-to-br from-stone-50 via-stone-100 to-amber-50/40 p-2 text-center">
              <span className="font-serif-display text-2xl font-bold text-stone-700 tracking-wider">
                SV
              </span>
              {isOwner && (
                <span className="text-[10px] text-amber-900/80 font-medium mt-1">
                  + Add Photo
                </span>
              )}
            </div>
          )}

          {isOwner && profile.avatarUrl && (
            <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium backdrop-blur-2xs">
              Change
            </div>
          )}
        </div>

        {/* Dossier Information */}
        <div className="flex-1 space-y-3 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono tracking-widest text-amber-800 uppercase font-semibold">
                  Academic & Personal Dossier
                </span>
                <span className="text-stone-300">·</span>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif-display font-normal text-stone-900 tracking-tight leading-tight mt-0.5">
                {displayName}
              </h1>

              {(profile.major || profile.school) && (
                <div className="text-xs sm:text-sm text-stone-600 font-medium flex flex-wrap items-center gap-x-2 gap-y-1 mt-1.5">
                  {profile.major && <span className="text-stone-900 font-semibold">{profile.major}</span>}
                  {profile.major && profile.school && <span className="text-stone-300" aria-hidden="true">·</span>}
                  {profile.school && <span className="text-stone-600">{profile.school}</span>}
                </div>
              )}
            </div>

            {/* Owner Edit Action */}
            {isOwner && (
              <button
                onClick={onEditProfile}
                className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors no-print self-start shrink-0 cursor-pointer border border-stone-200/60"
              >
                <Pencil className="w-3.5 h-3.5 text-stone-500" />
                <span>Edit Dossier</span>
              </button>
            )}
          </div>

          {/* Bio / Mission Statement */}
          {profile.bio ? (
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-3xl whitespace-pre-line font-light">
              {profile.bio}
            </p>
          ) : isOwner ? (
            <p
              onClick={onEditProfile}
              className="text-xs text-stone-400 italic cursor-pointer hover:text-stone-600 bg-stone-50/80 p-2.5 rounded-xl border border-dashed border-stone-200 hover:border-stone-300 transition-colors"
            >
              + Click here to add your academic interests, aspirations, school details, and personal statement...
            </p>
          ) : (
            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed max-w-3xl font-light">
              Welcome to the official digital portfolio of Sai Varshith Vemuri, documenting extracurricular leadership, hobbies, milestones, and personal endeavors.
            </p>
          )}

          {/* Metrics & Social Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100 text-xs">
            {/* Quick Metrics */}
            <div className="flex items-center gap-4 text-stone-500 font-mono text-[11px]">
              <div>
                <span className="font-semibold text-stone-900 text-xs tabular-nums mr-1">
                  {totalItemsCount}
                </span>
                <span>Highlights</span>
              </div>
              <span className="text-stone-300" aria-hidden="true">/</span>
              <div>
                <span className="font-semibold text-stone-900 text-xs tabular-nums mr-1">
                  {totalSectionsCount}
                </span>
                <span>Collections</span>
              </div>
            </div>

            {/* Contact / Social Links for Visitors */}
            {(profile.email || profile.website || profile.github || profile.linkedin) && (
              <div className="flex flex-wrap items-center gap-2">
                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-xs text-stone-700 hover:text-stone-950 flex items-center gap-1.5 bg-stone-50/90 hover:bg-stone-100 border border-stone-200 px-2.5 py-1 rounded-lg transition-colors shadow-2xs"
                  >
                    <Mail className="w-3.5 h-3.5 text-stone-500" />
                    <span>Email</span>
                  </a>
                )}
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-stone-700 hover:text-stone-950 flex items-center gap-1.5 bg-stone-50/90 hover:bg-stone-100 border border-stone-200 px-2.5 py-1 rounded-lg transition-colors shadow-2xs"
                  >
                    <Globe className="w-3.5 h-3.5 text-stone-500" />
                    <span>Website</span>
                  </a>
                )}
                {profile.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-stone-700 hover:text-stone-950 flex items-center gap-1.5 bg-stone-50/90 hover:bg-stone-100 border border-stone-200 px-2.5 py-1 rounded-lg transition-colors shadow-2xs"
                  >
                    <Github className="w-3.5 h-3.5 text-stone-500" />
                    <span>GitHub</span>
                  </a>
                )}
                {profile.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-stone-700 hover:text-stone-950 flex items-center gap-1.5 bg-stone-50/90 hover:bg-stone-100 border border-stone-200 px-2.5 py-1 rounded-lg transition-colors shadow-2xs"
                  >
                    <Linkedin className="w-3.5 h-3.5 text-stone-500" />
                    <span>LinkedIn</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
