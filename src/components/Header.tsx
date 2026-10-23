import React from 'react';
import { MainScreen } from '../types';
import { Search, PlusCircle, Shield, RefreshCw, HelpCircle, AlertCircle } from 'lucide-react';
import { CometIcon } from './CometIcon';

interface HeaderProps {
  currentScreen: MainScreen;
  onScreenChange: (screen: MainScreen) => void;
  availableCount: number;
  pendingClaimsCount: number;
  onOpenStorageInfo: () => void;
  onConfirmReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onScreenChange,
  availableCount,
  pendingClaimsCount,
  onOpenStorageInfo,
  onConfirmReset,
}) => {
  return (
    <header className="sticky top-0 z-30 shadow-xs">
      {/* 1. Top Dark Green Strip matching reference */}
      <div className="bg-[#154734] text-white text-xs py-1.5 px-4 sm:px-6 lg:px-8 border-b border-emerald-900/60">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5">
          {/* Left: UT Dallas & Prototype Network Label */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
            <span className="font-black text-[#E87500] tracking-wider text-[11px] sm:text-xs">
              UT DALLAS
            </span>
            <span className="text-white/40">/</span>
            <span className="text-white/90 text-[11px] sm:text-xs font-medium">
              Comet Peer Support Network (Fictional Prototype)
            </span>
          </div>

          {/* Right: Quick Links for Privacy Limits & Reset */}
          <div className="flex items-center gap-3 text-[11px]">
            <button
              type="button"
              onClick={onOpenStorageInfo}
              className="text-amber-300 hover:text-amber-200 flex items-center gap-1 font-semibold transition"
              title="Read prototype & privacy limits"
            >
              <HelpCircle className="w-3 h-3 text-amber-400" />
              <span>Prototype & Privacy Limits</span>
            </button>
            <span className="text-white/30">|</span>
            <button
              type="button"
              onClick={onConfirmReset}
              className="text-white/80 hover:text-white flex items-center gap-1 transition"
              title="Reset records to default sample listings"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Sample Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main White Navigation Header matching reference */}
      <div className="bg-white border-b border-slate-200 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left: Temoc Mascot Logo, University Label, App Name & Subtitle */}
          <div className="flex items-center gap-3 sm:gap-3.5">
            {/* Temoc Mascot Image */}
            <div className="relative shrink-0">
              <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-slate-900 border-2 border-orange-400/90 p-0.5 shadow-sm flex items-center justify-center overflow-hidden">
                <img
                  src="/assets/aistudio/Screenshot_2026-10-22_at_10.30.49_PM_752a2ec4.png"
                  alt="Temoc, the UT Dallas mascot, with fiery yellow hair, crossed arms, and an orange UTD shirt"
                  className="w-full h-full object-cover object-center rounded-full"
                />
              </div>
            </div>

            {/* Title & Subtitle Block */}
            <div className="space-y-0.5">
              {/* Added above the app name as requested */}
              <div className="text-[10px] sm:text-[11px] font-bold tracking-wider text-[#C75B12] uppercase leading-tight">
                The University of Texas at Dallas
              </div>

              {/* App Name with Distinctive Comet Icon and Prototype badge */}
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-1.5 leading-tight">
                  <CometIcon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                  <span>Comet Finder</span>
                </h1>
                <span className="text-[10px] sm:text-[11px] font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-md">
                  Prototype
                </span>
              </div>

              {/* Subtitle */}
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-tight">
                Connecting found campus items with their rightful Comet owners.
              </p>
            </div>
          </div>

          {/* Right: Three Pill Navigation Buttons matching reference */}
          <nav className="flex flex-wrap items-center gap-2">
            {/* Button 1: Search & Claim */}
            <button
              type="button"
              onClick={() => onScreenChange('search')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm transition-all ${
                currentScreen === 'search'
                  ? 'bg-emerald-50 border-2 border-[#154734] text-[#154734] font-bold shadow-xs'
                  : 'bg-slate-50/80 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold'
              }`}
            >
              <Search className="w-4 h-4 text-slate-500" />
              <span>Search & Claim</span>
              <span className="ml-1 text-[11px] font-bold text-slate-600 bg-slate-200/80 px-1.5 py-0.2 rounded-full">
                {availableCount}
              </span>
            </button>

            {/* Button 2: Post Found Item */}
            <button
              type="button"
              onClick={() => onScreenChange('post')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                currentScreen === 'post'
                  ? 'bg-orange-50 border-2 border-[#C75B12] text-[#C75B12] font-bold shadow-xs'
                  : 'text-[#C75B12] hover:text-[#a64b0e] hover:bg-orange-50/70 border border-orange-200'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-[#C75B12]" />
              <span>Post Found Item</span>
            </button>

            {/* Button 3: Reviewer View */}
            <button
              type="button"
              onClick={() => onScreenChange('reviewer')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs ${
                currentScreen === 'reviewer'
                  ? 'bg-[#154734] text-white ring-2 ring-emerald-500/50'
                  : 'bg-[#154734] hover:bg-[#0e3124] text-white'
              }`}
            >
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Reviewer View</span>
              <span className="ml-1 text-[11px] font-black text-slate-900 bg-[#E87500] px-1.5 py-0.2 rounded-md shadow-xs">
                {pendingClaimsCount}
              </span>
            </button>
          </nav>
        </div>
      </div>

      {/* 3. Sub-header Alert Bar matching reference */}
      <div className="bg-[#fffbeb] text-amber-950 border-b border-amber-200 py-1.5 px-4 text-[11px] sm:text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <RefreshCw className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>
              <strong>Local Browser Storage:</strong> Data survives page refreshes in this browser.
            </span>
            <span className="hidden sm:inline text-amber-400">&bull;</span>
            <span className="text-amber-800">
              No server database or logins are used in this prototype.
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenStorageInfo}
            className="inline-flex items-center gap-1 text-[#C75B12] hover:text-[#a64b0e] font-bold underline underline-offset-2 shrink-0"
          >
            <AlertCircle className="w-3 h-3 text-[#C75B12]" />
            <span>Read Privacy Limitations & Comet Card Rules</span>
          </button>
        </div>
      </div>
    </header>
  );
};
