import React, { useState } from 'react';
import { MainScreen, FoundItem } from './types';
import { useLostAndFound } from './useLostAndFound';
import { Header } from './components/Header';
import { DirectoryView } from './components/DirectoryView';
import { PostItemView } from './components/PostItemView';
import { ReviewerDeskView } from './components/ReviewerDeskView';
import { ClaimModal } from './components/ClaimModal';
import { StorageInfoModal } from './components/StorageInfoModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { CometIcon } from './components/CometIcon';
import { CheckCircle2, X, AlertTriangle, ExternalLink, Database } from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<MainScreen>('search');
  const [claimModalItem, setClaimModalItem] = useState<FoundItem | null>(null);
  const [isStorageModalOpen, setIsStorageModalOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const {
    items,
    claims,
    pendingClaimsCount,
    toastMessage,
    isFirebaseConnected,
    dismissToast,
    postFoundItem,
    submitClaim,
    approveClaim,
    revokeApproval,
    rejectClaim,
    undoRejection,
    deleteRejectedClaim,
    confirmHandoffAndReturn,
    resetSampleData,
  } = useLostAndFound();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 selection:bg-orange-200">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md bg-[#154734] text-white px-4 py-3 rounded-xl shadow-2xl border-2 border-[#C75B12] flex items-center justify-between gap-3 animate-in slide-in-from-bottom-5">
          <div className="flex items-center gap-2.5 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={dismissToast}
            className="text-emerald-200 hover:text-white p-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Header with Comet Finder Branding & 3 Navigation Buttons */}
      <Header
        currentScreen={currentScreen}
        onScreenChange={setCurrentScreen}
        availableCount={items.filter((i) => i.status !== 'Returned').length}
        pendingClaimsCount={pendingClaimsCount}
        onOpenStorageInfo={() => setIsStorageModalOpen(true)}
        onConfirmReset={() => setIsResetConfirmOpen(true)}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Screen 1: Search & Claim */}
        {currentScreen === 'search' && (
          <DirectoryView
            items={items}
            onOpenClaimModal={setClaimModalItem}
            onNavigateToPost={() => setCurrentScreen('post')}
          />
        )}

        {/* Screen 2: Post Found Item */}
        {currentScreen === 'post' && (
          <PostItemView
            onPostItem={postFoundItem}
            onNavigateToDirectory={() => setCurrentScreen('search')}
          />
        )}

        {/* Screen 4: Finder / Reviewer Desk */}
        {currentScreen === 'reviewer' && (
          <ReviewerDeskView
            items={items}
            claims={claims}
            onApproveClaim={approveClaim}
            onRevokeApproval={revokeApproval}
            onRejectClaim={rejectClaim}
            onUndoRejection={undoRejection}
            onDeleteRejectedClaim={deleteRejectedClaim}
            onConfirmHandoffAndReturn={confirmHandoffAndReturn}
            onNavigateToDirectory={() => setCurrentScreen('search')}
          />
        )}

        {/* Storage & Prototype Boundaries Notice Box (Always Visible at Bottom) */}
        <section className="bg-white rounded-2xl p-5 border-2 border-[#154734]/15 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 font-bold text-sm text-[#154734]">
              <Database className="w-4 h-4 text-[#C75B12]" />
              <span>Storage Notice & Prototype Disclaimers</span>
            </div>
            <div className="flex items-center gap-2">
              {isFirebaseConnected ? (
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Firebase Firestore Cloud Active
                </span>
              ) : (
                <span className="text-[11px] font-bold text-[#154734] bg-emerald-50 px-3 py-0.5 rounded-full border border-emerald-300">
                  Firebase Initializing &bull; Local Cache Active
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
            <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 space-y-1">
              <strong className="text-[#154734] block font-bold">
                Local Browser Storage Notice
              </strong>
              <p className="text-emerald-950 font-medium">
                Local Browser Storage: Changes are saved in this browser. They are not shared across browsers or devices.
              </p>
              <p className="text-[11px] text-emerald-800">
                Refreshing or reopening the browser preserves all posted items, claims, approvals, and returns.
              </p>
            </div>

            <div className="bg-orange-50/70 p-3.5 rounded-xl border border-orange-200 space-y-1">
              <strong className="text-[#C75B12] block font-bold">
                Prototype & Privacy Limits
              </strong>
              <p className="text-orange-950">
                This app demonstrates a lost-and-found process without real accounts. The reviewer screen is not restricted to a verified finder. Claim details and contact information are stored locally; hiding them in the interface is not secure access control. Use fictional information only.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Screen 3: Submit Ownership Claim Modal */}
      <ClaimModal
        item={claimModalItem}
        onClose={() => setClaimModalItem(null)}
        onSubmitClaim={submitClaim}
      />

      {/* Storage Information Modal */}
      <StorageInfoModal
        isOpen={isStorageModalOpen}
        onClose={() => setIsStorageModalOpen(false)}
        onConfirmReset={() => setIsResetConfirmOpen(true)}
        itemsCount={items.length}
        claimsCount={claims.length}
      />

      {/* Reset Confirmation Modal */}
      <ResetConfirmModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={resetSampleData}
      />

      {/* Global Footer */}
      <footer className="bg-[#154734] text-emerald-200 text-xs py-6 border-t-4 border-[#C75B12] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CometIcon className="w-5 h-5 shrink-0" />
            <div>
              <strong className="text-white">Comet Finder</strong> &bull; Connecting found campus items with their rightful Comet owners.
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-emerald-200 text-[11px]">
            <span className="text-orange-300 font-bold">Student Project Prototype — Not an Official UT Dallas Service</span>
            <span>&bull;</span>
            <a
              href="https://cometcard.utdallas.edu/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition underline underline-offset-2 flex items-center gap-1"
            >
              <span>UT Dallas Comet Card Website</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
