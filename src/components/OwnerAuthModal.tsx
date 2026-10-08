import React, { useState } from 'react';
import { Lock, Unlock, Key, Check, X, ShieldAlert, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

interface OwnerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlock: () => void;
  currentPasscode: string;
  onUpdatePasscode: (newPasscode: string) => void;
}

export const OwnerAuthModal: React.FC<OwnerAuthModalProps> = ({
  isOpen,
  onClose,
  onUnlock,
  currentPasscode,
  onUpdatePasscode,
}) => {
  const [passcodeInput, setPasscodeInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isChangingPasscode, setIsChangingPasscode] = useState(false);
  const [oldPasscode, setOldPasscode] = useState('');
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [changeSuccess, setChangeSuccess] = useState(false);
  const [isSigningInGoogle, setIsSigningInGoogle] = useState(false);

  if (!isOpen) return null;

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeInput.trim() === currentPasscode) {
      setErrorMsg('');
      setPasscodeInput('');
      onUnlock();
      onClose();
    } else {
      setErrorMsg('Incorrect passcode. Please verify and try again.');
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSigningInGoogle(true);
    setErrorMsg('');
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        onUnlock();
        onClose();
      }
    } catch (err: unknown) {
      console.warn(err);
      setErrorMsg('Google sign-in was closed or unavailable. Please enter passcode.');
    } finally {
      setIsSigningInGoogle(false);
    }
  };

  const handleChangePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (oldPasscode.trim() !== currentPasscode) {
      setErrorMsg('Current passcode is incorrect.');
      return;
    }
    if (newPasscode.length < 4) {
      setErrorMsg('New passcode must be at least 4 characters.');
      return;
    }
    if (newPasscode !== confirmPasscode) {
      setErrorMsg('New passcodes do not match.');
      return;
    }

    onUpdatePasscode(newPasscode.trim());
    setChangeSuccess(true);
    setErrorMsg('');
    setTimeout(() => {
      setChangeSuccess(false);
      setIsChangingPasscode(false);
      setOldPasscode('');
      setNewPasscode('');
      setConfirmPasscode('');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl border border-stone-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-[#FAF8F5] border-b border-stone-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-stone-900 to-stone-850 text-amber-300 flex items-center justify-center shadow-xs border border-amber-400/30">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-serif-display font-medium text-stone-900">
                {isChangingPasscode ? 'Update Passcode' : 'Curator Authentication'}
              </h2>
              <p className="text-[11px] text-stone-500 font-light">
                {isChangingPasscode ? 'Set a new secure PIN' : 'Unlock to manage and publish highlights'}
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
        {!isChangingPasscode ? (
          <div className="p-6 space-y-4">
            <form onSubmit={handleUnlockSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">
                  Curator Passcode
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoFocus
                    required
                    value={passcodeInput}
                    onChange={(e) => {
                      setPasscodeInput(e.target.value);
                      setErrorMsg('');
                    }}
                    placeholder="Enter passcode..."
                    className="w-full pl-9 pr-10 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-stone-400 shadow-2xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
                    title={showPassword ? 'Hide passcode' : 'Show passcode'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {errorMsg && (
                <div className="text-xs text-rose-700 bg-rose-50 border border-rose-200 p-2.5 rounded-xl flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-stone-900 hover:bg-stone-850 text-amber-200 border border-amber-400/25 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Unlock className="w-3.5 h-3.5 text-amber-300" />
                <span>Unlock Curator Mode</span>
              </button>
            </form>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-stone-200"></div>
              <span className="flex-shrink mx-2 text-[10px] text-stone-400 uppercase tracking-widest font-mono">Or</span>
              <div className="flex-grow border-t border-stone-200"></div>
            </div>

            {/* Google Sign-in button */}
            <button
              type="button"
              disabled={isSigningInGoogle}
              onClick={handleGoogleSignIn}
              className="w-full py-2.5 bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isSigningInGoogle ? 'Connecting...' : 'Sign in with Google'}</span>
            </button>

            <div className="pt-1 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsChangingPasscode(true);
                  setErrorMsg('');
                }}
                className="text-[11px] text-stone-500 hover:text-amber-900 font-medium cursor-pointer underline"
              >
                Change curator passcode
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleChangePasscodeSubmit} className="p-6 space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">Current Passcode</label>
              <input
                type="password"
                required
                value={oldPasscode}
                onChange={(e) => setOldPasscode(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono"
                placeholder="Current passcode"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">New Passcode</label>
              <input
                type="password"
                required
                value={newPasscode}
                onChange={(e) => setNewPasscode(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono"
                placeholder="At least 4 characters"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">Confirm New Passcode</label>
              <input
                type="password"
                required
                value={confirmPasscode}
                onChange={(e) => setConfirmPasscode(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono"
                placeholder="Confirm new passcode"
              />
            </div>

            {errorMsg && (
              <div className="text-xs text-rose-700 bg-rose-50 border border-rose-200 p-2.5 rounded-xl">
                {errorMsg}
              </div>
            )}

            {changeSuccess && (
              <div className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Passcode updated successfully!</span>
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsChangingPasscode(false);
                  setErrorMsg('');
                }}
                className="px-3.5 py-1.5 text-xs text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-stone-900 text-amber-200 border border-amber-400/25 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Save New Passcode
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
