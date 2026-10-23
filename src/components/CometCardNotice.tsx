import React from 'react';
import { ShieldAlert, ExternalLink, CreditCard } from 'lucide-react';

interface CometCardNoticeProps {
  compact?: boolean;
}

export const CometCardNotice: React.FC<CometCardNoticeProps> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-xs text-orange-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-start gap-2">
          <CreditCard className="w-4 h-4 text-[#C75B12] shrink-0 mt-0.5" />
          <p className="leading-snug">
            <strong>Comet Card Privacy:</strong> Do not post a cardholder’s name, student ID number, or card photo. Visit the UT Dallas Comet Card website for official lost-card instructions.
          </p>
        </div>
        <a
          href="https://cometcard.utdallas.edu/"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-1 font-bold text-[#C75B12] hover:text-[#a64b0e] underline underline-offset-2 ml-6 sm:ml-0"
        >
          <span>Comet Card Office</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-300/80 rounded-2xl p-4 shadow-xs text-xs text-orange-950 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-bold text-sm text-[#C75B12]">
          <ShieldAlert className="w-4.5 h-4.5 text-[#C75B12]" />
          <span>Comet Card Privacy & Lost Card Guidelines</span>
        </div>
        <a
          href="https://cometcard.utdallas.edu/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-bold text-xs bg-[#C75B12] hover:bg-[#a64b0e] text-white px-3 py-1 rounded-lg transition shadow-xs"
        >
          <span>Official Comet Card Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
      <p className="leading-relaxed text-orange-900">
        <strong>Do not post a cardholder’s name, student ID number, or card photo.</strong> Visit the UT Dallas Comet Card website for official lost-card instructions.
      </p>
      <div className="text-[11px] text-orange-800/90 bg-white/70 p-2.5 rounded-lg border border-orange-200">
        🛡️ If you found a physical Comet Card, please take it immediately to the <strong>Student Union Information Desk</strong>, the <strong>Comet Card Office (Student Services Building)</strong>, or the nearest campus desk so staff can securely notify the student through official channels.
      </div>
    </div>
  );
};
