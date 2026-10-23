import React, { useState } from 'react';
import {
  CreditCard,
  ExternalLink,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Building2,
  HelpCircle,
  Clock,
  Phone,
  DollarSign,
  IdCard,
} from 'lucide-react';

export type CometCardAssistanceType = 'lost' | 'found' | 'replacement';

interface CometCardGuidanceSectionProps {
  initialType?: CometCardAssistanceType;
  defaultExpanded?: boolean;
}

export const CometCardGuidanceSection: React.FC<CometCardGuidanceSectionProps> = ({
  initialType = 'lost',
  defaultExpanded = true,
}) => {
  const [assistanceType, setAssistanceType] = useState<CometCardAssistanceType>(initialType);
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);

  return (
    <section className="bg-white rounded-2xl border-2 border-orange-300 shadow-sm overflow-hidden space-y-0 transition-all">
      {/* Header & Quick Guidance */}
      <div className="bg-gradient-to-r from-orange-50 via-white to-amber-50 p-5 sm:p-6 border-b border-orange-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C75B12] text-white flex items-center justify-center shrink-0 shadow-xs">
              <CreditCard className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  UT Dallas Comet Card Guidance &amp; Official Protocols
                </h3>
                <span className="bg-orange-100 text-[#C75B12] border border-orange-300 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                  Official Policy
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                The Comet Card is your official campus credential. UT Dallas requires students, faculty, and staff to follow official university instructions for lost or found cards. Never post a cardholder’s name, student ID number, or card photo on student forums.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
            {/* 1. Visit the Comet Card Office Website button */}
            <a
              href="https://cometcard.utdallas.edu/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-[#154734] hover:bg-[#0e3124] text-white rounded-xl shadow-xs transition"
            >
              <span>Visit the Comet Card Office Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* 2. Replacement Information Button */}
            <a
              href="https://cometcard.utdallas.edu/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-[#C75B12] hover:bg-[#a64b0e] text-white rounded-xl shadow-xs transition"
            >
              <span>Request a Replacement / View Official Options</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Toggle Expand/Collapse */}
        <div className="mt-4 pt-3 border-t border-orange-200/80 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">
            Interactive Assistance Form &bull; Step-by-step campus instructions
          </span>
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="text-xs font-bold text-[#C75B12] hover:text-[#963e08] transition flex items-center gap-1 underline underline-offset-2"
          >
            <span>{isExpanded ? 'Hide Assistance Form' : 'Open Assistance Form'}</span>
          </button>
        </div>
      </div>

      {/* Expanded Interactive Assistance Form */}
      {isExpanded && (
        <div className="p-5 sm:p-6 space-y-6">
          {/* Important Non-Submission Advisory Banner */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-3.5 sm:p-4 text-xs text-amber-950 flex items-start gap-3 shadow-2xs">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-amber-900 block font-bold text-xs">
                Informational Guidance Only — No University Request Submitted:
              </strong>
              <p className="leading-relaxed text-[11px] sm:text-xs text-amber-950">
                This assistance form provides official UT Dallas protocol guidance and next steps. <strong>It does not submit a request to the university, order a replacement card, or alert campus staff.</strong> Comet Finder cannot place university orders or charge fees.
              </p>
              <p className="text-[11px] text-amber-800 font-semibold flex items-center gap-1 pt-0.5">
                <Lock className="w-3.5 h-3.5" />
                <span>Zero Data Collection: For your privacy, this form does not collect or request student ID numbers, card photos, passwords, NetIDs, or cardholder names.</span>
              </p>
            </div>
          </div>

          {/* Assistance Selection Radio Controls */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Select Your Comet Card Scenario:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Option 1: I lost my card */}
              <button
                type="button"
                onClick={() => setAssistanceType('lost')}
                className={`p-3.5 rounded-xl border-2 text-left transition flex items-start gap-3 ${
                  assistanceType === 'lost'
                    ? 'border-[#C75B12] bg-orange-50/80 shadow-xs ring-2 ring-orange-200'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                    assistanceType === 'lost'
                      ? 'border-[#C75B12] bg-[#C75B12]'
                      : 'border-slate-300'
                  }`}
                >
                  {assistanceType === 'lost' && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <div>
                  <strong className="text-xs sm:text-sm font-bold text-slate-900 block">
                    I lost my card
                  </strong>
                  <span className="text-[11px] text-slate-500 leading-snug block mt-0.5">
                    Deactivate card immediately &amp; locate custody
                  </span>
                </div>
              </button>

              {/* Option 2: I found a card */}
              <button
                type="button"
                onClick={() => setAssistanceType('found')}
                className={`p-3.5 rounded-xl border-2 text-left transition flex items-start gap-3 ${
                  assistanceType === 'found'
                    ? 'border-[#154734] bg-emerald-50/80 shadow-xs ring-2 ring-emerald-200'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                    assistanceType === 'found'
                      ? 'border-[#154734] bg-[#154734]'
                      : 'border-slate-300'
                  }`}
                >
                  {assistanceType === 'found' && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <div>
                  <strong className="text-xs sm:text-sm font-bold text-slate-900 block">
                    I found a card
                  </strong>
                  <span className="text-[11px] text-slate-500 leading-snug block mt-0.5">
                    Turn in safely &amp; protect student privacy
                  </span>
                </div>
              </button>

              {/* Option 3: I need replacement information */}
              <button
                type="button"
                onClick={() => setAssistanceType('replacement')}
                className={`p-3.5 rounded-xl border-2 text-left transition flex items-start gap-3 ${
                  assistanceType === 'replacement'
                    ? 'border-[#154734] bg-emerald-50/80 shadow-xs ring-2 ring-emerald-200'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                    assistanceType === 'replacement'
                      ? 'border-[#154734] bg-[#154734]'
                      : 'border-slate-300'
                  }`}
                >
                  {assistanceType === 'replacement' && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <div>
                  <strong className="text-xs sm:text-sm font-bold text-slate-900 block">
                    I need replacement info
                  </strong>
                  <span className="text-[11px] text-slate-500 leading-snug block mt-0.5">
                    Fees, location, hours &amp; required IDs
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Scenario 1: I lost my card */}
          {assistanceType === 'lost' && (
            <div className="bg-slate-50 border-2 border-orange-200 rounded-2xl p-5 space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 border-b border-orange-200 pb-3">
                <AlertTriangle className="w-4 h-4 text-[#C75B12]" />
                <h4 className="text-sm font-bold text-slate-900">
                  Step-by-Step Next Steps: If You Lost Your Comet Card
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 shadow-2xs">
                  <div className="flex items-center gap-2 font-bold text-[#C75B12]">
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-[#C75B12] flex items-center justify-center text-xs">1</span>
                    <span>Deactivate Card Immediately Online</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px] sm:text-xs">
                    Prevent unauthorized access to your <strong>Comet Cash</strong> balance, meal plans, and campus building entries. Log in to the <strong>UT Dallas GET Portal</strong> or GET Mobile app to immediately report the card missing.
                  </p>
                  <a
                    href="https://get.cbord.com/utdallas"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-[#C75B12] hover:text-[#a64b0e] underline text-xs pt-1"
                  >
                    <span>Open UT Dallas GET Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 shadow-2xs">
                  <div className="flex items-center gap-2 font-bold text-[#154734]">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#154734] flex items-center justify-center text-xs">2</span>
                    <span>Check Physical Building Service Desks</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px] sm:text-xs">
                    Staff at building customer service desks frequently hold found cards turned in by students. Check in person at:
                  </p>
                  <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5">
                    <li>Student Union Information Desk</li>
                    <li>Eugene McDermott Library Service Desk</li>
                    <li>Activity Center Front Desk</li>
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 shadow-2xs">
                  <div className="flex items-center gap-2 font-bold text-[#154734]">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#154734] flex items-center justify-center text-xs">3</span>
                    <span>Found Before Getting a Replacement?</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px] sm:text-xs">
                    If you recover your card <em>before</em> getting a new one printed, bring it in person to the <strong>Comet Card Office (SSA 12.324)</strong> to have it reactivated. For security, cards cannot be reactivated by phone.
                  </p>
                  <p className="text-[10px] text-amber-800 font-semibold bg-amber-50 p-1.5 rounded">
                    Notice: If a replacement was already printed, old cards are permanently void and cannot be reactivated.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 shadow-2xs">
                  <div className="flex items-center gap-2 font-bold text-[#C75B12]">
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-[#C75B12] flex items-center justify-center text-xs">4</span>
                    <span>Request an In-Person Replacement</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px] sm:text-xs">
                    If the card cannot be found, visit the Comet Card Office in person. A standard <strong>$20 replacement fee</strong> applies. Bring a valid government-issued photo ID.
                  </p>
                  <a
                    href="https://cometcard.utdallas.edu/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-[#154734] hover:text-[#0e3124] underline text-xs pt-1"
                  >
                    <span>View Official Replacement Policies</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Scenario 2: I found a card */}
          {assistanceType === 'found' && (
            <div className="bg-slate-50 border-2 border-emerald-200 rounded-2xl p-5 space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 border-b border-emerald-200 pb-3">
                <CheckCircle2 className="w-4 h-4 text-[#154734]" />
                <h4 className="text-sm font-bold text-slate-900">
                  Step-by-Step Next Steps: If You Found Someone's Comet Card
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 shadow-2xs">
                  <div className="flex items-center gap-2 font-bold text-rose-800">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 flex items-center justify-center text-xs">1</span>
                    <span>Do NOT Post Personal Information</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px] sm:text-xs">
                    Never post the student’s name, student ID number, or a photo of the card online. Exposing student ID cards violates UT Dallas guidelines and exposes the student to identity fraud.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 shadow-2xs">
                  <div className="flex items-center gap-2 font-bold text-[#154734]">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#154734] flex items-center justify-center text-xs">2</span>
                    <span>Hand Over to Official Campus Custody</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px] sm:text-xs">
                    Turn the physical card in to one of these verified campus locations:
                  </p>
                  <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5">
                    <li><strong>Comet Card Office:</strong> Student Services Addition, SSA 12.324 (Mon–Fri, 9am–5pm)</li>
                    <li><strong>Student Union Information Desk</strong></li>
                    <li><strong>Eugene McDermott Library Service Desk</strong></li>
                    <li><strong>UT Dallas Police Department</strong> (after hours)</li>
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 shadow-2xs">
                  <div className="flex items-center gap-2 font-bold text-[#154734]">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#154734] flex items-center justify-center text-xs">3</span>
                    <span>Official University Notification</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px] sm:text-xs">
                    When handed over to university staff or the Comet Card Office, officials securely look up the student in the internal university system and send an official notification directly to their <code>@utdallas.edu</code> email address without publicly exposing their identity.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 shadow-2xs">
                  <div className="flex items-center gap-2 font-bold text-[#C75B12]">
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-[#C75B12] flex items-center justify-center text-xs">4</span>
                    <span>Optional Notice on Comet Finder</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px] sm:text-xs">
                    If you post a notice on Comet Finder, select category <strong>Comet Cards</strong> and specify <em>only</em> where on campus it was found and which university service desk you turned it in to.
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono bg-slate-50 p-1.5 rounded">
                    Example: "Found card near McDermott Library 2nd floor; turned in to the Library Service Desk."
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Scenario 3: I need replacement information */}
          {assistanceType === 'replacement' && (
            <div className="bg-slate-50 border-2 border-emerald-200 rounded-2xl p-5 space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 border-b border-emerald-200 pb-3">
                <IdCard className="w-4 h-4 text-[#154734]" />
                <h4 className="text-sm font-bold text-slate-900">
                  Official UT Dallas Comet Card Replacement Process &amp; Guidelines
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 shadow-2xs">
                  <div className="flex items-center gap-2 font-bold text-[#154734]">
                    <Building2 className="w-4 h-4 text-[#154734]" />
                    <span>In-Person Issuance Required</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px] sm:text-xs">
                    Because your Comet Card grants physical access to secure campus buildings and labs, <strong>UT Dallas does not offer remote mailing or online ordering</strong> of replacement cards. All replacements must be verified and issued in person.
                  </p>
                  <div className="bg-emerald-50 text-emerald-950 p-2.5 rounded-lg text-[11px] space-y-0.5 font-medium">
                    <div>📍 <strong>Location:</strong> Student Services Addition (SSA), 2nd Floor, Room <strong>SSA 12.324</strong></div>
                    <div>🕒 <strong>Hours:</strong> Monday – Friday, 9:00 AM – 5:00 PM</div>
                    <div>📞 <strong>Phone:</strong> (972) 883-2495 &bull; (972) 883-4123</div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 shadow-2xs">
                  <div className="flex items-center gap-2 font-bold text-[#C75B12]">
                    <DollarSign className="w-4 h-4 text-[#C75B12]" />
                    <span>Fees &amp; Waivers</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px] sm:text-xs">
                    A standard <strong>$20 replacement fee</strong> applies to lost, stolen, or damaged cards (payable by debit/credit card or Comet Cash).
                  </p>
                  <div className="bg-slate-50 p-2.5 rounded-lg text-[11px] text-slate-700 space-y-1">
                    <div>&bull; <strong>Normal wear and tear:</strong> Eligible for free replacement if the old undamaged card is surrendered for inspection.</div>
                    <div>&bull; <strong>Legal name changes:</strong> Free if processed by the Registrar and the most recent card is turned in.</div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 shadow-2xs">
                  <div className="flex items-center gap-2 font-bold text-[#154734]">
                    <Lock className="w-4 h-4 text-[#154734]" />
                    <span>What to Bring to the Office</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px] sm:text-xs">
                    You <strong>must present a valid government-issued photo ID</strong> to obtain your replacement card. Acceptable identification includes:
                  </p>
                  <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5">
                    <li>U.S. Driver's License or State ID Card</li>
                    <li>U.S. or International Passport</li>
                    <li>U.S. Military Identification Card</li>
                  </ul>
                  <p className="text-[10px] text-slate-500 italic">
                    Note: A new card photo is taken if your current on-file photo is older than one year.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 shadow-2xs">
                  <div className="flex items-center gap-2 font-bold text-[#154734]">
                    <CheckCircle2 className="w-4 h-4 text-[#154734]" />
                    <span>Balances &amp; Turnaround</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px] sm:text-xs">
                    Replacement cards are printed on the spot in just a few minutes. Any existing <strong>Comet Cash</strong> balances and active meal plans automatically transfer to your new card.
                  </p>
                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    <a
                      href="https://cometcard.utdallas.edu/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[#154734] hover:bg-[#0e3124] text-white rounded-lg transition"
                    >
                      <span>Request a Replacement / View Official Options</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Official Links Bar */}
          <div className="bg-slate-100 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 border border-slate-200">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#154734]" />
              <span>
                <strong>Comet Card Office:</strong> Student Services Addition SSA 12.324 &bull; cometcard@utdallas.edu &bull; (972) 883-2495
              </span>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://cometcard.utdallas.edu/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#154734] hover:text-[#0e3124] underline flex items-center gap-1"
              >
                <span>Comet Card Website</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span>&bull;</span>
              <a
                href="https://get.cbord.com/utdallas"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#C75B12] hover:text-[#a64b0e] underline flex items-center gap-1"
              >
                <span>GET Portal (Deactivation)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
