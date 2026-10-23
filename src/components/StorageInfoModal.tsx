import React from 'react';
import { X, Database, RefreshCw, CheckCircle2, Shield, HardDrive, AlertTriangle } from 'lucide-react';

interface StorageInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: () => void;
  itemsCount: number;
  claimsCount: number;
}

export const StorageInfoModal: React.FC<StorageInfoModalProps> = ({
  isOpen,
  onClose,
  onConfirmReset,
  itemsCount,
  claimsCount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0e3124]/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border-2 border-[#154734]/30 overflow-hidden my-8 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-[#154734] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#C75B12]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C75B12] text-white flex items-center justify-center shadow-xs">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Storage & Prototype Limits</h2>
              <p className="text-xs text-orange-200">Browser persistence & access control notice</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-emerald-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 text-xs text-slate-700">
          {/* Firebase & Local Browser Storage Notice */}
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-4 text-emerald-950 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-sm text-[#154734]">
              <HardDrive className="w-4 h-4 text-[#C75B12]" />
              <span>Firebase Cloud Firestore & Browser Persistence</span>
            </div>
            <p className="font-semibold text-xs leading-relaxed text-emerald-900">
              Cloud Storage: Active via Firebase Firestore (Project: <code>gen-lang-client-0882456909</code>). Real-time synchronization enables items and claims to persist across devices and browser sessions.
            </p>
            <div className="pt-1 font-mono text-[11px] text-emerald-800 space-y-0.5">
              <div>&bull; Firestore Collection: <code>items</code> ({itemsCount} records)</div>
              <div>&bull; Firestore Collection: <code>claims</code> ({claimsCount} records)</div>
              <div>&bull; Offline Fallback: Synchronized with <code>localStorage</code></div>
            </div>
          </div>

          {/* Exact required prototype & privacy limits explanation */}
          <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4 text-orange-950 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-sm text-[#C75B12]">
              <AlertTriangle className="w-4 h-4 text-[#C75B12]" />
              <span>Prototype & Privacy Limits Explanation</span>
            </div>
            <p className="leading-relaxed text-xs">
              This app demonstrates a lost-and-found process without real accounts. The reviewer screen is not restricted to a verified finder. Claim details and contact information are stored locally; hiding them in the interface is not secure access control. Use fictional information only.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-600 leading-relaxed text-[11px]">
            🛡️ <strong>Note on Authentication:</strong> This prototype does not provide verified ownership, secure authentication, or shared campus-wide records. No NetID or university sign-in is connected.
          </div>

          {/* Reset Action */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
            <div>
              <strong className="text-slate-900 block font-bold">Reset Sample Data</strong>
              <span className="text-[11px] text-slate-500">Restores the 5 original sample campus listings.</span>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onConfirmReset();
              }}
              className="px-3.5 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-300 rounded-lg transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Sample Data</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold bg-[#154734] hover:bg-[#0e3124] text-white rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
