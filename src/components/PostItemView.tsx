import React, { useState } from 'react';
import { ItemCategory, UTDLocation } from '../types';
import { ITEM_CATEGORIES, CAMPUS_LOCATIONS } from '../initialData';
import {
  PlusCircle,
  AlertTriangle,
  CheckCircle2,
  CameraOff,
  CreditCard,
  ExternalLink,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { CometIcon } from './CometIcon';

interface PostItemViewProps {
  onPostItem: (itemData: {
    category: ItemCategory;
    description: string;
    dateFound: string;
    campusLocation: UTDLocation;
    specificLocation?: string;
  }) => void;
  onNavigateToDirectory: () => void;
}

export const PostItemView: React.FC<PostItemViewProps> = ({
  onPostItem,
  onNavigateToDirectory,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [category, setCategory] = useState<ItemCategory>('Water Bottles & Tumblers');
  const [description, setDescription] = useState('');
  const [dateFound, setDateFound] = useState(todayStr);
  const [campusLocation, setCampusLocation] = useState<UTDLocation>(CAMPUS_LOCATIONS[0]);
  const [specificLocation, setSpecificLocation] = useState('');

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [privacyWarning, setPrivacyWarning] = useState<string | null>(null);
  const [submittedItemSummary, setSubmittedItemSummary] = useState<string | null>(null);

  // Check description for obvious email addresses, phone numbers, and student ID numbers
  const checkForPrivateInfo = (text: string): string | null => {
    // Email regex
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    if (emailRegex.test(text)) {
      return 'The description contains what looks like an email address. Please remove email addresses before publishing.';
    }

    // Phone regex
    const phoneRegex = /(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
    if (phoneRegex.test(text)) {
      return 'The description contains what looks like a telephone number. Please remove phone numbers before publishing.';
    }

    // Student ID regex (typically 8 to 10 digits or NetID-like ABC123456)
    const idRegex = /\b\d{8,10}\b|\b[a-zA-Z]{3}\d{6}\b/;
    if (idRegex.test(text)) {
      return 'The description contains what looks like a student ID number or NetID. Please remove student IDs or card numbers before publishing.';
    }

    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];

    if (!description.trim()) {
      errors.push('General description is required.');
    } else if (description.trim().length < 5) {
      errors.push('Please provide a slightly more descriptive general description (at least 5 characters).');
    }

    if (!dateFound) {
      errors.push('Date found is required.');
    }

    // Check for personal information
    const detectedPII = checkForPrivateInfo(description);
    if (detectedPII) {
      setPrivacyWarning(detectedPII);
      setValidationErrors([]);
      return;
    } else {
      setPrivacyWarning(null);
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors([]);
    onPostItem({
      category,
      description: description.trim(),
      dateFound,
      campusLocation,
      specificLocation: specificLocation.trim() || undefined,
    });

    setSubmittedItemSummary(
      `"${description.trim()}" at ${campusLocation}${specificLocation.trim() ? ` (${specificLocation.trim()})` : ''}`
    );

    // Reset form fields
    setDescription('');
    setSpecificLocation('');
    setDateFound(todayStr);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Screen 2 Header & Instructions */}
      <div className="bg-[#154734] text-white rounded-2xl p-6 sm:p-7 shadow-sm border-b-4 border-[#C75B12] space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider bg-orange-500/20 text-orange-300 border border-orange-400/40 px-2.5 py-0.5 rounded-full">
            Screen 2
          </span>
          <span className="text-xs text-emerald-100">Found Item Form</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
          <CometIcon className="w-7 h-7 shrink-0" />
          <span>Post Found Item</span>
        </h2>
        <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
          Report an unattended belonging you found on the UT Dallas campus. Once published, your listing appears in the public directory so rightful owners can submit ownership claims with verifying details.
        </p>
      </div>

      {/* Confirmation of Recent Submission */}
      {submittedItemSummary && (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-5 text-emerald-950 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 font-bold text-sm text-[#154734]">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Item Published Successfully to Comet Finder!</span>
          </div>
          <p className="text-xs text-slate-700">
            Your listing for <strong>{submittedItemSummary}</strong> is now live in the directory.
          </p>
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={onNavigateToDirectory}
              className="px-4 py-2 bg-[#154734] hover:bg-[#0e3124] text-white rounded-lg text-xs font-bold transition shadow-xs"
            >
              View in Directory
            </button>
            <button
              type="button"
              onClick={() => setSubmittedItemSummary(null)}
              className="text-xs text-slate-600 hover:text-slate-900 font-semibold"
            >
              Post Another Item
            </button>
          </div>
        </div>
      )}

      {/* Comet Card Specific Warning if selected */}
      {category === 'Comet Cards' && (
        <div className="bg-orange-50 border-2 border-orange-300 rounded-2xl p-5 text-xs text-orange-950 space-y-3 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-bold text-sm text-[#C75B12]">
              <CreditCard className="w-4.5 h-4.5 text-[#C75B12]" />
              <span>Official Comet Card Policy &amp; Guidance</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <a
                href="https://cometcard.utdallas.edu/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-xs bg-[#154734] hover:bg-[#0e3124] text-white px-3 py-1.5 rounded-lg transition"
              >
                <span>Visit the Comet Card Office Website</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://cometcard.utdallas.edu/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-xs bg-[#C75B12] hover:bg-[#a64b0e] text-white px-3 py-1.5 rounded-lg transition"
              >
                <span>Request a Replacement / View Official Options</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
          <p className="leading-relaxed">
            For a lost or found Comet Card, follow official UT Dallas instructions. Do not post identifying card information here. Do not post a cardholder’s name, student ID number, NetID, or card photo. Turn found cards in to the Comet Card Office (SSA 12.324) or the nearest building service desk.
          </p>
        </div>
      )}

      {/* Main Post Form Card */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Photo Upload Prohibition Notice */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600 flex items-start gap-2.5">
          <CameraOff className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-800 block">Photographs are not accepted:</strong>
            <span>
              Photographs of cards and belongings can expose personal details or serial numbers. Please describe the item in text only.
            </span>
          </div>
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="bg-rose-50 border-2 border-rose-300 rounded-xl p-4 text-xs text-rose-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Please complete all required fields:</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5">
              {validationErrors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Privacy Check Block */}
        {privacyWarning && (
          <div className="bg-rose-50 border-2 border-rose-300 rounded-xl p-4 text-xs text-rose-900 space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-rose-700">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Personal Information Detected in Description</span>
            </div>
            <p className="leading-relaxed">{privacyWarning}</p>
            <p className="text-[11px] text-slate-500 border-t border-rose-200 pt-1">
              Note: This automated safety check looks for obvious emails, phone numbers, and student ID numbers, but cannot detect every possible kind of personal information.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Item Category */}
          <div>
            <label htmlFor="categorySelect" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Item Category <span className="text-[#C75B12]">*</span>
            </label>
            <select
              id="categorySelect"
              value={category}
              onChange={(e) => setCategory(e.target.value as ItemCategory)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#154734] outline-hidden text-slate-800 font-semibold"
              required
            >
              {ITEM_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Description with Required Notice */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="descriptionInput" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Short General Description <span className="text-[#C75B12]">*</span>
              </label>
            </div>

            {/* Crucial instruction specified in prompt */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-[#154734] mb-2 leading-relaxed">
              <strong>Keep the public description general.</strong> Do not include unique stickers, hidden marks, or contents that could help you check an ownership claim later.
            </div>

            <textarea
              id="descriptionInput"
              rows={3}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (privacyWarning) setPrivacyWarning(null);
              }}
              placeholder="e.g., Black water bottle found near a study table, or Blue umbrella under a table..."
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#154734] outline-hidden resize-none text-slate-900"
              required
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Describe only the basic item type, color, and general appearance.
            </span>
          </div>

          {/* Date Found & Campus Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="dateFoundInput" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Date Found <span className="text-[#C75B12]">*</span>
              </label>
              <input
                id="dateFoundInput"
                type="date"
                value={dateFound}
                onChange={(e) => setDateFound(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#154734] outline-hidden text-slate-800 font-medium"
                required
              />
            </div>

            <div>
              <label htmlFor="locationSelect" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Campus Location <span className="text-[#C75B12]">*</span>
              </label>
              <select
                id="locationSelect"
                value={campusLocation}
                onChange={(e) => setCampusLocation(e.target.value as UTDLocation)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#154734] outline-hidden text-slate-800 font-semibold"
                required
              >
                {CAMPUS_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Optional Typed Detail */}
          <div>
            <label htmlFor="specificDetailInput" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Specific Location Detail <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              id="specificDetailInput"
              type="text"
              value={specificLocation}
              onChange={(e) => setSpecificLocation(e.target.value)}
              placeholder="e.g. near a study table, first-floor seating area, second-floor hallway"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#154734] outline-hidden text-slate-900"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Optional general context on where in the building it was spotted.
            </span>
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setDescription('');
                setSpecificLocation('');
                setValidationErrors([]);
                setPrivacyWarning(null);
              }}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
            >
              Clear Form
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-[#154734] hover:bg-[#0e3124] text-white rounded-xl shadow-md transition"
            >
              <PlusCircle className="w-4 h-4 text-emerald-300" />
              <span>Publish Found Item</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
