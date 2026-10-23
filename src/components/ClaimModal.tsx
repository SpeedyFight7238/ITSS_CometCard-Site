import React, { useState } from 'react';
import { FoundItem } from '../types';
import { X, CheckCircle2, ShieldCheck, Tag, Calendar, MapPin, AlertCircle, Lock } from 'lucide-react';

interface ClaimModalProps {
  item: FoundItem | null;
  onClose: () => void;
  onSubmitClaim: (claimData: {
    itemId: string;
    claimantName: string;
    contactEmail: string;
    contactPhone: string;
    identifyingDetail: string;
  }) => void;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({ item, onClose, onSubmitClaim }) => {
  const [claimantName, setClaimantName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [identifyingDetail, setIdentifyingDetail] = useState('');

  // Per-field errors
  const [fieldErrors, setFieldErrors] = useState<{
    claimantName?: string;
    contactEmail?: string;
    contactPhone?: string;
    identifyingDetail?: string;
  }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!item) return null;

  // Phone validation: allows digits, spaces, parentheses, dashes
  const isValidPhone = (phone: string) => {
    const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
    return cleaned.length >= 7 && cleaned.length <= 15 && /^\+?\d+$/.test(cleaned);
  };

  // Email validation: standard email pattern
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: {
      claimantName?: string;
      contactEmail?: string;
      contactPhone?: string;
      identifyingDetail?: string;
    } = {};

    const missingList: string[] = [];

    // Full Name check (reject empty or whitespace only)
    if (!claimantName.trim()) {
      errors.claimantName = 'Full Name is required.';
      missingList.push('Full Name');
    }

    // Email check
    if (!contactEmail.trim()) {
      errors.contactEmail = 'Contact Email is required.';
      missingList.push('Contact Email');
    } else if (!isValidEmail(contactEmail.trim())) {
      errors.contactEmail = 'Please provide a valid email address (e.g. name@example.com).';
      missingList.push('Valid Contact Email');
    }

    // Phone check
    if (!contactPhone.trim()) {
      errors.contactPhone = 'Contact Phone Number is required.';
      missingList.push('Contact Phone Number');
    } else if (!isValidPhone(contactPhone.trim())) {
      errors.contactPhone = 'Please provide a valid phone number (e.g. (202) 555-0143).';
      missingList.push('Valid Contact Phone Number');
    }

    // Identifying Detail check
    if (!identifyingDetail.trim()) {
      errors.identifyingDetail = 'Specific Identifying Details are required.';
      missingList.push('Specific Identifying Details');
    } else if (identifyingDetail.trim().length < 5) {
      errors.identifyingDetail = 'Please provide at least a few words describing distinguishing features.';
      missingList.push('Sufficient Identifying Details');
    }

    if (missingList.length > 0) {
      setFieldErrors(errors);
      setGeneralError(`Missing Required Information: Please complete ${missingList.join(', ')}.`);
      return;
    }

    // Success: submit claim
    setFieldErrors({});
    setGeneralError(null);
    onSubmitClaim({
      itemId: item.id,
      claimantName: claimantName.trim(),
      contactEmail: contactEmail.trim(),
      contactPhone: contactPhone.trim(),
      identifyingDetail: identifyingDetail.trim(),
    });

    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0e3124]/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border-2 border-[#154734]/30 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-[#154734] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#C75B12]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C75B12] text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Submit Ownership Claim</h2>
              <p className="text-xs text-orange-200">Screen 3 &bull; Claim Verification Form</p>
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

        {isSubmitted ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-[#154734] rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8 text-[#154734]" />
            </div>
            <h3 className="text-xl font-bold text-[#154734]">Ownership Claim Submitted!</h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Thank you, <strong className="text-slate-900">{claimantName}</strong>. Your claim for item{' '}
              <strong className="text-slate-900">#{item.id}</strong> has been saved and forwarded to the Finder / Reviewer Desk.
            </p>

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-left text-xs space-y-2 text-orange-950">
              <div className="font-bold flex items-center gap-1.5 text-[#C75B12]">
                <Lock className="w-4 h-4 text-[#C75B12] shrink-0" />
                <span>Contact Privacy Active</span>
              </div>
              <p className="leading-relaxed">
                Your email (<strong>{contactEmail}</strong>) and phone (<strong>{contactPhone}</strong>) remain strictly hidden while the claim is in pending review. If the finder approves your claim after matching the identifying details, your contact information will be revealed so a physical handoff can be arranged.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 bg-[#154734] hover:bg-[#0e3124] text-white rounded-xl text-sm font-bold shadow-md transition"
              >
                Close & Return to Directory
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Selected Item Reference Block */}
            <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-3.5 text-xs text-slate-700 space-y-1.5">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span className="flex items-center gap-1.5 text-[#154734]">
                  <Tag className="w-3.5 h-3.5 text-[#C75B12]" />
                  Listing Reference #{item.id}
                </span>
                <span className="bg-[#154734] text-white px-2 py-0.5 rounded text-[11px] font-bold">
                  {item.category}
                </span>
              </div>

              <p className="text-xs text-slate-800 font-semibold leading-snug">
                {item.description}
              </p>

              <div className="pt-1 flex flex-wrap gap-x-4 gap-y-1 text-slate-600 text-[11px]">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" /> Found on {item.dateFound}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#C75B12]" /> {item.campusLocation}
                  {item.specificLocation ? ` (${item.specificLocation})` : ''}
                </span>
              </div>
            </div>

            {/* General Error Banner if missing information */}
            {generalError && (
              <div className="p-3 bg-rose-50 border-2 border-rose-300 rounded-xl text-xs text-rose-900 font-semibold flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-rose-800">Missing Required Information</div>
                  <div className="text-[11px] font-normal text-rose-700">{generalError}</div>
                </div>
              </div>
            )}

            {/* Field 1: Full Name */}
            <div>
              <label htmlFor="claimantNameInput" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Full Name — Fictional for Prototype <span className="text-[#C75B12]">*</span>
              </label>
              <input
                id="claimantNameInput"
                type="text"
                value={claimantName}
                onChange={(e) => {
                  setClaimantName(e.target.value);
                  if (fieldErrors.claimantName) {
                    setFieldErrors((prev) => ({ ...prev, claimantName: undefined }));
                  }
                }}
                placeholder="e.g. Samira Patel, Marcus Chen, Jordan Vance"
                className={`w-full px-3 py-2 text-sm border rounded-xl outline-hidden ${
                  fieldErrors.claimantName
                    ? 'border-rose-400 focus:ring-2 focus:ring-rose-500 bg-rose-50/40'
                    : 'border-slate-300 focus:ring-2 focus:ring-[#154734]'
                }`}
              />
              {fieldErrors.claimantName && (
                <span className="text-[11px] text-rose-600 font-semibold mt-1 block">
                  {fieldErrors.claimantName}
                </span>
              )}
            </div>

            {/* Field 2 & Field 3: Contact Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="contactEmailInput" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Contact Email — Hidden Until Approved <span className="text-[#C75B12]">*</span>
                </label>
                <input
                  id="contactEmailInput"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => {
                    setContactEmail(e.target.value);
                    if (fieldErrors.contactEmail) {
                      setFieldErrors((prev) => ({ ...prev, contactEmail: undefined }));
                    }
                  }}
                  placeholder="e.g. samira.patel@example.com"
                  className={`w-full px-3 py-2 text-sm border rounded-xl outline-hidden ${
                    fieldErrors.contactEmail
                      ? 'border-rose-400 focus:ring-2 focus:ring-rose-500 bg-rose-50/40'
                      : 'border-slate-300 focus:ring-2 focus:ring-[#154734]'
                  }`}
                />
                {fieldErrors.contactEmail && (
                  <span className="text-[11px] text-rose-600 font-semibold mt-1 block">
                    {fieldErrors.contactEmail}
                  </span>
                )}
              </div>

              <div>
                <label htmlFor="contactPhoneInput" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Contact Phone Number — Hidden Until Approved <span className="text-[#C75B12]">*</span>
                </label>
                <input
                  id="contactPhoneInput"
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => {
                    setContactPhone(e.target.value);
                    if (fieldErrors.contactPhone) {
                      setFieldErrors((prev) => ({ ...prev, contactPhone: undefined }));
                    }
                  }}
                  placeholder="e.g. (202) 555-0182"
                  className={`w-full px-3 py-2 text-sm border rounded-xl outline-hidden ${
                    fieldErrors.contactPhone
                      ? 'border-rose-400 focus:ring-2 focus:ring-rose-500 bg-rose-50/40'
                      : 'border-slate-300 focus:ring-2 focus:ring-[#154734]'
                  }`}
                />
                {fieldErrors.contactPhone && (
                  <span className="text-[11px] text-rose-600 font-semibold mt-1 block">
                    {fieldErrors.contactPhone}
                  </span>
                )}
              </div>
            </div>

            {/* Field 4: Specific Identifying Details */}
            <div>
              <label htmlFor="identifyingDetailInput" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Specific Identifying Details — Not Shown on Public Board <span className="text-[#C75B12]">*</span>
              </label>

              {/* Exact required instructions from prompt */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-xs text-[#154734] mb-1.5 leading-relaxed">
                Describe distinctive details that were not included in the public listing, such as a sticker, scratch, keychain, or contents. These details help the finder evaluate your claim.
              </div>

              <textarea
                id="identifyingDetailInput"
                rows={3}
                value={identifyingDetail}
                onChange={(e) => {
                  setIdentifyingDetail(e.target.value);
                  if (fieldErrors.identifyingDetail) {
                    setFieldErrors((prev) => ({ ...prev, identifyingDetail: undefined }));
                  }
                }}
                placeholder="e.g., There is a faint scratch on the base, a small blue sticker inside, and a keychain with two keys..."
                className={`w-full px-3 py-2 text-sm border rounded-xl outline-hidden resize-none ${
                  fieldErrors.identifyingDetail
                    ? 'border-rose-400 focus:ring-2 focus:ring-rose-500 bg-rose-50/40'
                    : 'border-slate-300 focus:ring-2 focus:ring-[#154734]'
                }`}
              />
              {fieldErrors.identifyingDetail && (
                <span className="text-[11px] text-rose-600 font-semibold mt-1 block">
                  {fieldErrors.identifyingDetail}
                </span>
              )}
            </div>

            {/* Comet Card notice if claiming a Comet Card */}
            {item.category === 'Comet Cards' && (
              <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 text-xs text-amber-950 space-y-1">
                <strong>Comet Card Privacy Safeguard:</strong>
                <p className="text-[11px] text-amber-900 leading-relaxed">
                  Do not provide student ID numbers, passwords, or photos. Found cards should be turned in directly to the Comet Card Office (SSA 12.324). Visit the{' '}
                  <a
                    href="https://cometcard.utdallas.edu/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-bold text-[#C75B12]"
                  >
                    official Comet Card Office
                  </a>{' '}
                  for card recovery or replacement options.
                </p>
              </div>
            )}

            {/* Exact Contact-Sharing Notice */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-xs text-orange-950 flex items-start gap-2">
              <Lock className="w-4 h-4 text-[#C75B12] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Contact Notice:</strong> Your email address and phone number will be displayed in the finder/reviewer view if your claim is approved so the return can be arranged.
              </p>
            </div>

            {/* Modal Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold bg-[#C75B12] hover:bg-[#a64b0e] text-white rounded-lg shadow-sm transition"
              >
                Submit Claim
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
