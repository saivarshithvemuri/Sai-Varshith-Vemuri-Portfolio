import React from 'react';
import { UserProfile } from '../types/portfolio';
import { Pencil, User, GraduationCap, School } from 'lucide-react';

interface ProfileBannerProps {
  profile: UserProfile;
  isPreviewMode: boolean;
  onEditProfile: () => void;
}

export const ProfileBanner: React.FC<ProfileBannerProps> = ({
  profile,
  isPreviewMode,
  onEditProfile,
}) => {
  const isProfileEmpty = !profile.name && !profile.school && !profile.bio;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs relative">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
        {/* Avatar */}
        <div
          onClick={() => {
            if (!isPreviewMode) onEditProfile();
          }}
          className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 ${
            !isPreviewMode ? 'cursor-pointer group' : ''
          }`}
        >
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt={profile.name || 'User'} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-gradient-to-br from-slate-50 to-slate-100">
              <User className="w-8 h-8 mb-0.5" />
              {!isPreviewMode && <span className="text-[9px] text-slate-500 font-medium">Add Photo</span>}
            </div>
          )}

          {!isPreviewMode && profile.avatarUrl && (
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
              Change
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif-display font-bold text-slate-900 leading-tight">
                {profile.name || (isProfileEmpty ? 'My College Portfolio' : 'Student Portfolio')}
              </h1>

              {(profile.major || profile.school) && (
                <div className="text-xs sm:text-sm text-slate-600 font-medium flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
                  {profile.major && <span className="text-slate-900 font-semibold">{profile.major}</span>}
                  {profile.major && profile.school && <span className="text-slate-300">/</span>}
                  {profile.school && <span>{profile.school}</span>}
                </div>
              )}
            </div>

            {!isPreviewMode && (
              <button
                onClick={onEditProfile}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors no-print shrink-0"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>{isProfileEmpty ? 'Set Name & Bio' : 'Edit Profile'}</span>
              </button>
            )}
          </div>

          {/* Bio */}
          {profile.bio ? (
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl whitespace-pre-line">
              {profile.bio}
            </p>
          ) : isProfileEmpty && !isPreviewMode ? (
            <p
              onClick={onEditProfile}
              className="text-xs text-slate-400 italic cursor-pointer hover:text-slate-600"
            >
              + Click here to add your name, high school, and a short bio about what you are aiming for...
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};
