import React, { useState } from 'react';
import { Lock, Unlock, Key, Check, X, ShieldAlert, ShieldCheck, Eye, EyeOff } from 'lucide-react';

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

  if (!isOpen) return null;

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeInput.trim() === currentPasscode) {
      setErrorMsg('');
      setPasscodeInput('');
      onUnlock();
      onClose();
    } else {
      setErrorMsg('Incorrect passcode. Please try again.');
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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {isChangingPasscode ? 'Change Passcode' : 'Owner Access'}
              </h2>
              <p className="text-[11px] text-slate-500">
                {isChangingPasscode ? 'Set a new secure PIN' : 'Enter passcode to edit website'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!isChangingPasscode ? (
          <form onSubmit={handleUnlockSubmit} className="p-6 space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">
                  Owner Passcode
                </label>
              </div>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
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
                  className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                  title={showPassword ? 'Hide passcode' : 'Show passcode'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-lg flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="submit"
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Unlock className="w-3.5 h-3.5 text-amber-300" />
                <span>Unlock Owner Mode</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsChangingPasscode(true);
                  setErrorMsg('');
                }}
                className="text-[11px] text-slate-500 hover:text-indigo-600 text-center font-medium mt-1"
              >
                Change passcode
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleChangePasscodeSubmit} className="p-6 space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Current Passcode</label>
              <input
                type="password"
                required
                value={oldPasscode}
                onChange={(e) => setOldPasscode(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                placeholder="Current passcode"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">New Passcode</label>
              <input
                type="password"
                required
                value={newPasscode}
                onChange={(e) => setNewPasscode(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                placeholder="At least 4 characters"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Confirm New Passcode</label>
              <input
                type="password"
                required
                value={confirmPasscode}
                onChange={(e) => setConfirmPasscode(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                placeholder="Confirm new passcode"
              />
            </div>

            {errorMsg && (
              <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2 rounded-lg">
                {errorMsg}
              </div>
            )}

            {changeSuccess && (
              <div className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 p-2 rounded-lg flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 shrink-0" />
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
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold"
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
