import React from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0e3124]/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-rose-300 space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center gap-2.5 text-rose-700">
          <AlertTriangle className="w-6 h-6 text-rose-600" />
          <h3 className="text-base font-bold text-slate-900">
            Confirm Resetting Sample Data
          </h3>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Are you sure you want to replace current local records? This will restore the five default fictional sample listings (black water bottle, blue umbrella, black backpack, purple notebook, and keyring) and associated sample claims.
        </p>

        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-900">
          Any newly posted items or custom claims created in this browser will be replaced by the original prototype data.
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs transition"
          >
            Yes, Reset Sample Data
          </button>
        </div>
      </div>
    </div>
  );
};
