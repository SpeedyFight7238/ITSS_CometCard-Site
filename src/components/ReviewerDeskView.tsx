import React, { useState } from 'react';
import { FoundItem, ClaimRequest, ReviewerTab } from '../types';
import {
  Inbox,
  CheckCircle2,
  PackageCheck,
  RotateCcw,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Lock,
  Unlock,
  Check,
  AlertTriangle,
  Shield,
  User,
  ArrowRight,
  Trash2,
  XCircle,
} from 'lucide-react';

interface ReviewerDeskViewProps {
  items: FoundItem[];
  claims: ClaimRequest[];
  onApproveClaim: (claimId: string, itemId: string) => void;
  onRevokeApproval: (claimId: string, itemId: string) => void;
  onRejectClaim: (claimId: string, reason?: string) => void;
  onUndoRejection: (claimId: string) => Promise<{ success: boolean; message: string }> | { success: boolean; message: string };
  onDeleteRejectedClaim: (claimId: string) => void;
  onConfirmHandoffAndReturn: (itemId: string, claimantName?: string) => void;
  onNavigateToDirectory: () => void;
}

export const ReviewerDeskView: React.FC<ReviewerDeskViewProps> = ({
  items,
  claims,
  onApproveClaim,
  onRevokeApproval,
  onRejectClaim,
  onUndoRejection,
  onDeleteRejectedClaim,
  onConfirmHandoffAndReturn,
  onNavigateToDirectory,
}) => {
  const [activeTab, setActiveTab] = useState<ReviewerTab>('pending');

  // Confirmation modal for physical handoff & return
  const [handoffConfirmData, setHandoffConfirmData] = useState<{
    item: FoundItem;
    claimantName: string;
  } | null>(null);

  // Rejection reason prompt state
  const [rejectPromptClaimId, setRejectPromptClaimId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('Identifying details did not match found item.');

  // Delete confirmation state for rejected claim
  const [deleteConfirmClaim, setDeleteConfirmClaim] = useState<ClaimRequest | null>(null);

  // Explanation dialog if undo is blocked (item returned or approved for someone else)
  const [cannotUndoInfo, setCannotUndoInfo] = useState<string | null>(null);

  // Tab lists
  const pendingClaimsList = claims.filter((c) => c.status === 'Pending');
  const approvedClaimsList = claims.filter((c) => c.status === 'Approved');
  const rejectedClaimsList = claims.filter((c) => c.status === 'Rejected');
  const openItemsList = items.filter((i) => i.status !== 'Returned');
  const returnedItemsList = items.filter((i) => i.status === 'Returned');

  const getItemById = (itemId: string) => items.find((i) => i.id === itemId);
  const getClaimsForItem = (itemId: string) => claims.filter((c) => c.itemId === itemId);

  // Items with pending claims
  const itemsWithPendingClaims = items.filter((item) =>
    claims.some((c) => c.itemId === item.id && c.status === 'Pending')
  );

  return (
    <div className="space-y-6">
      {/* 1. Prototype Reviewer View Hero Card matching reference screenshot */}
      <div className="bg-[#154734] text-white rounded-2xl p-6 shadow-md border-b-4 border-[#C75B12] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-900/80 border border-emerald-500/60 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
              <Shield className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Prototype Reviewer View
                </h2>
                <span className="bg-[#E87500] text-slate-950 font-black px-2 py-0.5 rounded text-[10px] tracking-wider uppercase shadow-xs">
                  ORGANIZERS ONLY
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 mt-0.5 font-medium">
                UT Dallas Student Peer Group Administrative Verification &amp; Resolution Workspace
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onNavigateToDirectory}
            className="self-start sm:self-auto px-4 py-2 rounded-xl border border-emerald-600/70 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-100 text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <span>Public Board View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Inner Callout Box from Screenshot */}
        <div className="bg-[#0a291e] border border-emerald-800/80 rounded-xl p-3.5 text-xs text-emerald-100 leading-relaxed shadow-inner">
          <strong className="text-white">Reviewer Responsibility:</strong> Review the private specific verification details entered by claimants against the physical item in your group's custody. When verified, click <strong className="text-amber-300 font-bold">“Mark Item Returned &amp; Resolve”</strong> to officially retire the record. Once marked returned, the item is immediately removed from the public available-items board.
        </div>
      </div>

      {/* 2. Horizontal Tab Navigation matching reference screenshot */}
      <div className="bg-slate-100/80 p-1.5 rounded-2xl flex flex-wrap items-center justify-between gap-2 border border-slate-200">
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Tab 1: Claims Awaiting Review */}
          <button
            type="button"
            onClick={() => setActiveTab('pending')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'pending'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Claims Awaiting Review</span>
            <span
              className={`text-xs px-2 py-0.2 rounded-md font-black ${
                pendingClaimsList.length > 0
                  ? 'bg-[#E87500] text-slate-950'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {pendingClaimsList.length}
            </span>
          </button>

          {/* Tab 2: All Open Items */}
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>All Open Items</span>
            <span className="text-xs px-2 py-0.2 rounded-md bg-slate-200 text-slate-700 font-bold">
              {openItemsList.length}
            </span>
          </button>

          {/* Tab 3: Approved — Awaiting Return */}
          <button
            type="button"
            onClick={() => setActiveTab('approved')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'approved'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Approved Awaiting Return</span>
            <span className="text-xs px-2 py-0.2 rounded-md bg-emerald-100 text-emerald-800 font-bold">
              {approvedClaimsList.length}
            </span>
          </button>

          {/* Tab 4: Rejected Claims */}
          <button
            type="button"
            onClick={() => setActiveTab('rejected')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'rejected'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Rejected Claims</span>
            <span
              className={`text-xs px-2 py-0.2 rounded-md font-bold ${
                rejectedClaimsList.length > 0
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {rejectedClaimsList.length}
            </span>
          </button>

          {/* Tab 5: Returned & Resolved Archive */}
          <button
            type="button"
            onClick={() => setActiveTab('returned')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'returned'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Returned &amp; Resolved Archive</span>
            <span className="text-xs px-2 py-0.2 rounded-md bg-slate-200 text-slate-700 font-bold">
              {returnedItemsList.length}
            </span>
          </button>
        </div>

        <div className="text-xs text-slate-500 font-semibold px-2">
          Showing{' '}
          <strong className="text-slate-900">
            {activeTab === 'pending'
              ? itemsWithPendingClaims.length
              : activeTab === 'all'
              ? openItemsList.length
              : activeTab === 'approved'
              ? approvedClaimsList.length
              : activeTab === 'rejected'
              ? rejectedClaimsList.length
              : returnedItemsList.length}
          </strong>{' '}
          {activeTab === 'pending' || activeTab === 'all' || activeTab === 'returned'
            ? 'items'
            : 'claims'}
        </div>
      </div>

      {/* TAB 1: CLAIMS AWAITING REVIEW (matching exact screenshot layout) */}
      {activeTab === 'pending' && (
        <div className="space-y-5">
          {itemsWithPendingClaims.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
              <div className="w-12 h-12 bg-emerald-50 text-[#154734] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No Claims Awaiting Review</h3>
              <p className="text-xs text-slate-500">
                All claims have been evaluated or no new claims have arrived yet.
              </p>
              <button
                type="button"
                onClick={onNavigateToDirectory}
                className="px-4 py-2 text-xs font-bold bg-[#154734] text-white rounded-lg hover:bg-[#0e3124] transition shadow-xs"
              >
                Go to Public Directory
              </button>
            </div>
          ) : (
            itemsWithPendingClaims.map((item) => {
              const itemPendingClaims = claims.filter(
                (c) => c.itemId === item.id && c.status === 'Pending'
              );

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border-2 border-amber-300/80 p-5 sm:p-6 shadow-xs space-y-4"
                >
                  {/* Top Metadata Line from Screenshot */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="text-xs text-slate-600 font-medium flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-[#154734]">{item.category}</span>
                      <span className="text-slate-300">&bull;</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> Found {item.dateFound}
                      </span>
                      <span className="text-slate-300">&bull;</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#C75B12]" /> {item.campusLocation}
                        {item.specificLocation ? `, ${item.specificLocation}` : ''}
                      </span>
                    </div>

                    <div className="bg-amber-50 border border-amber-300 text-amber-900 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto shrink-0">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>{itemPendingClaims.length} Claim to Review</span>
                    </div>
                  </div>

                  {/* Item Description Header */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {item.description}
                    </h3>
                  </div>

                  {/* Submitted Claims Section Header */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 text-[11px]">
                      <Lock className="w-3.5 h-3.5 text-amber-600" />
                      <span>SUBMITTED PRIVATE CLAIMS ({itemPendingClaims.length})</span>
                    </span>
                    <span className="text-[11px] text-slate-400 italic">
                      (confidential: not displayed on public board)
                    </span>
                  </div>

                  {/* Inner Claim Cards matching screenshot */}
                  <div className="space-y-4">
                    {itemPendingClaims.map((claim) => (
                      <div
                        key={claim.id}
                        className="border-2 border-amber-300 rounded-xl p-4 bg-white space-y-3 shadow-xs"
                      >
                        {/* Claimant header line */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-2">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-slate-500" />
                            <strong className="text-sm font-bold text-slate-900">
                              {claim.claimantName} (Fictional Student)
                            </strong>
                            <span className="text-xs text-slate-400 font-mono">Claim #{claim.id}</span>
                          </div>
                          <span className="text-xs text-slate-400">
                            Submitted: {new Date(claim.submittedAt).toLocaleString()}
                          </span>
                        </div>

                        {/* Specific Verification Details Label & Box */}
                        <div className="space-y-1.5">
                          <div className="text-[11px] font-bold text-amber-900 tracking-wider uppercase">
                            SPECIFIC VERIFICATION DETAILS PROVIDED BY CLAIMANT:
                          </div>
                          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-800 font-mono leading-relaxed">
                            {claim.identifyingDetail}
                          </div>
                        </div>

                        {/* Hidden Contact Info Notice While Pending */}
                        <div className="bg-slate-100 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-600 flex items-center gap-2">
                          <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>
                            <strong>Claimant Contact Details Hidden:</strong> Contact information will appear after approval.
                          </span>
                        </div>

                        {/* Actions: Reject & Approve */}
                        <div className="flex items-center justify-end gap-2.5 pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              if (rejectPromptClaimId === claim.id) {
                                onRejectClaim(claim.id, rejectReason);
                                setRejectPromptClaimId(null);
                              } else {
                                setRejectPromptClaimId(claim.id);
                              }
                            }}
                            className="px-3.5 py-1.5 text-xs font-bold text-rose-700 hover:text-white hover:bg-rose-600 border border-rose-300 rounded-lg transition"
                          >
                            {rejectPromptClaimId === claim.id ? 'Confirm Rejection' : 'Reject Claim'}
                          </button>

                          <button
                            type="button"
                            onClick={() => onApproveClaim(claim.id, claim.itemId)}
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold bg-[#154734] hover:bg-[#0e3124] text-white rounded-lg shadow-xs transition"
                          >
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span>Approve Claim</span>
                          </button>
                        </div>

                        {/* Rejection input prompt */}
                        {rejectPromptClaimId === claim.id && (
                          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs space-y-2 animate-in fade-in">
                            <span className="font-bold text-rose-800">
                              Confirm rejection reason for {claim.claimantName}'s claim:
                            </span>
                            <input
                              type="text"
                              value={rejectReason}
                              onChange={(e) => setRejectReason(e.target.value)}
                              placeholder="Reason (e.g. Identifying details did not match found item)"
                              className="w-full px-3 py-1.5 text-xs bg-white border border-rose-300 rounded-lg outline-hidden"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setRejectPromptClaimId(null)}
                                className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  onRejectClaim(claim.id, rejectReason);
                                  setRejectPromptClaimId(null);
                                }}
                                className="px-3 py-1 text-xs font-bold bg-rose-600 text-white rounded-lg hover:bg-rose-700"
                              >
                                Complete Rejection
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: ALL OPEN ITEMS */}
      {activeTab === 'all' && (
        <div className="space-y-4">
          {openItemsList.map((item) => {
            const itemClaims = getClaimsForItem(item.id);

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border-2 border-slate-200 p-5 shadow-xs space-y-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                        #{item.id}
                      </span>
                      <span className="bg-[#154734] text-white px-2 py-0.5 rounded text-[11px] font-bold">
                        {item.category}
                      </span>
                      <span className="text-xs text-slate-500">
                        Found: {item.dateFound} &bull; {item.campusLocation}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{item.description}</h4>
                  </div>

                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      item.status === 'Approved — Awaiting Return'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-emerald-100 text-[#154734] border border-emerald-300'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                {/* Claims History */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Claims Record for #{item.id} ({itemClaims.length}):
                  </span>
                  {itemClaims.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No claims recorded yet.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {itemClaims.map((c) => (
                        <div
                          key={c.id}
                          className={`p-2.5 rounded-xl border text-xs flex flex-wrap items-center justify-between gap-2 ${
                            c.status === 'Approved'
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-950 font-semibold'
                              : c.status === 'Rejected'
                              ? 'bg-rose-50/60 border-rose-200 text-rose-900'
                              : 'bg-orange-50/60 border-orange-200 text-orange-950'
                          }`}
                        >
                          <div>
                            <strong>{c.claimantName}</strong> &bull;{' '}
                            <span className="text-slate-600 font-mono">"{c.identifyingDetail}"</span>
                            {c.status === 'Rejected' && c.rejectionReason && (
                              <span className="block text-[11px] text-rose-600 mt-0.5">
                                Reason: {c.rejectionReason}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                                c.status === 'Approved'
                                  ? 'bg-emerald-600 text-white'
                                  : c.status === 'Rejected'
                                  ? 'bg-rose-600 text-white'
                                  : 'bg-orange-500 text-white'
                              }`}
                            >
                              {c.status}
                            </span>
                            {c.status === 'Rejected' && (
                              <div className="flex items-center gap-1.5 ml-2 border-l border-rose-200 pl-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (item.status !== 'Available') {
                                      setCannotUndoInfo(`Cannot restore claim #${c.id}: Item #${item.id} is ${item.status}. Claims can only be restored while the item is Available.`);
                                    } else {
                                      onUndoRejection(c.id);
                                    }
                                  }}
                                  className="text-[11px] font-bold text-[#154734] hover:text-[#0e3124] underline flex items-center gap-1"
                                  title="Restore to Pending Review"
                                >
                                  <RotateCcw className="w-3 h-3" />
                                  <span>Undo</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteConfirmClaim(c)}
                                  className="text-[11px] font-bold text-rose-700 hover:text-rose-900 underline flex items-center gap-1"
                                  title="Permanently delete claim record"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: APPROVED — AWAITING RETURN */}
      {activeTab === 'approved' && (
        <div className="space-y-4">
          {approvedClaimsList.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
              <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <Unlock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No Approved Claims Pending Return</h3>
              <p className="text-xs text-slate-500">
                When you approve a matching claim, its contact details are revealed here so you can coordinate the physical return.
              </p>
            </div>
          ) : (
            approvedClaimsList.map((claim) => {
              const item = getItemById(claim.itemId);

              return (
                <div
                  key={claim.id}
                  className="bg-white rounded-2xl border-2 border-emerald-300 p-5 sm:p-6 shadow-xs space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded border border-emerald-300">
                        #{claim.id}
                      </span>
                      <strong className="text-sm font-bold text-slate-900">
                        Claimant: {claim.claimantName}
                      </strong>
                    </div>

                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                      Approved — Awaiting Return
                    </span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
                    <div className="font-bold text-slate-900">
                      Item #{item?.id}: {item?.description}
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      📍 {item?.campusLocation} &bull; Found {item?.dateFound}
                    </div>
                  </div>

                  {/* Revealed Contact Section */}
                  <div className="bg-emerald-50/90 border-2 border-emerald-300 rounded-xl p-4 space-y-2">
                    <div className="text-xs font-bold text-[#154734] uppercase tracking-wider flex items-center gap-1.5">
                      <Unlock className="w-4 h-4 text-emerald-600" />
                      <span>Revealed Claimant Contact Information (For Return Coordination):</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                      <div className="bg-white p-2.5 rounded-lg border border-emerald-200 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-[#C75B12]" />
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold">Email Address:</span>
                          <span className="font-bold text-slate-900">{claim.contactEmail}</span>
                        </div>
                      </div>

                      <div className="bg-white p-2.5 rounded-lg border border-emerald-200 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-[#C75B12]" />
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold">Phone Number:</span>
                          <span className="font-bold text-slate-900">{claim.contactPhone}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => onRevokeApproval(claim.id, claim.itemId)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Revoke Approval</span>
                    </button>

                    {item && (
                      <button
                        type="button"
                        onClick={() => setHandoffConfirmData({ item, claimantName: claim.claimantName })}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-[#154734] hover:bg-[#0e3124] text-white rounded-xl shadow-xs transition"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Mark Item Returned &amp; Resolve</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 4: REJECTED CLAIMS */}
      {activeTab === 'rejected' && (
        <div className="space-y-4">
          {rejectedClaimsList.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                <XCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No Rejected Claims</h3>
              <p className="text-xs text-slate-500">
                Rejected claims appear here. If a claim was rejected by accident, you can undo the rejection to restore it to Pending Review, or permanently delete it to clean up old records.
              </p>
            </div>
          ) : (
            rejectedClaimsList.map((claim) => {
              const item = getItemById(claim.itemId);
              const isItemAvailable = item && item.status === 'Available';

              return (
                <div
                  key={claim.id}
                  className="bg-white rounded-2xl border-2 border-rose-200/90 p-5 sm:p-6 shadow-xs space-y-4"
                >
                  {/* Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <User className="w-4 h-4 text-slate-500" />
                      <strong className="text-sm font-bold text-slate-900">
                        {claim.claimantName} (Fictional Student)
                      </strong>
                      <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                        #{claim.id}
                      </span>
                      <span className="text-xs text-slate-400">
                        Submitted: {new Date(claim.submittedAt).toLocaleDateString()}
                      </span>
                      {claim.reviewDate && (
                        <span className="text-xs text-slate-400">
                          &bull; Rejected: {new Date(claim.reviewDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-800 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Rejected Claim</span>
                      </span>
                    </div>
                  </div>

                  {/* Associated Found Item Info */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-bold text-slate-900">
                          Item #{item?.id || claim.itemId}: {item?.description || 'Found campus belonging'}
                        </div>
                        <div className="text-slate-500 text-[11px] mt-0.5">
                          📍 {item?.campusLocation || 'UT Dallas Campus'}
                          {item?.specificLocation ? `, ${item.specificLocation}` : ''} &bull; Found {item?.dateFound || 'Recorded'}
                        </div>
                      </div>

                      {item ? (
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-bold self-start sm:self-auto shrink-0 ${
                            item.status === 'Available'
                              ? 'bg-emerald-100 text-[#154734] border border-emerald-300'
                              : item.status === 'Approved — Awaiting Return'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-slate-200 text-slate-800 border border-slate-300'
                          }`}
                        >
                          Item: {item.status}
                        </span>
                      ) : (
                        <span className="text-xs text-rose-700 font-bold bg-rose-50 px-2.5 py-0.5 rounded border border-rose-200">
                          Item record not found
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Recorded Rejection Reason */}
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-rose-900 uppercase tracking-wider">
                      Recorded Rejection Reason:
                    </div>
                    <div className="bg-rose-50/70 border border-rose-200 text-rose-950 p-2.5 rounded-lg text-xs font-medium">
                      {claim.rejectionReason || 'Identifying details did not match the found item.'}
                    </div>
                  </div>

                  {/* Claimant's Submitted Verification Details */}
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Claimant's Submitted Verification Details:
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-800 font-mono leading-relaxed">
                      {claim.identifyingDetail}
                    </div>
                  </div>

                  {/* Hidden Contact Information Notice */}
                  <div className="bg-slate-100 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-600 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>
                      <strong>Claimant Contact Details Hidden:</strong> Contact information remains hidden. Undoing rejection restores this claim to Pending Review and keeps contact information hidden until formal approval.
                    </span>
                  </div>

                  {/* Item Status Notice if Cannot Undo */}
                  {item && item.status !== 'Available' && (
                    <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 text-xs text-amber-950 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Cannot restore to Pending Review at this time: </strong>
                        {item.status === 'Returned' ? (
                          <span>
                            Item #{item.id} has already been returned to <strong>{item.returnedToName || 'a verified claimant'}</strong> and marked resolved. A returned item cannot accept restored claims.
                          </span>
                        ) : (
                          <span>
                            Item #{item.id} is currently approved for another claimant awaiting physical handoff. To restore this claim, first revoke that approval in the <strong>Approved Awaiting Return</strong> tab.
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions: Delete Permanently & Undo Rejection */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
                    <span className="text-[11px] text-slate-500">
                      Clean up unwanted records or restore accidental rejections.
                    </span>

                    <div className="flex items-center gap-2.5 self-end sm:self-auto">
                      {/* Delete Permanently Button */}
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmClaim(claim)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-rose-700 hover:text-white hover:bg-rose-600 border border-rose-300 rounded-lg transition shadow-2xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Permanently</span>
                      </button>

                      {/* Undo Rejection Button */}
                      <button
                        type="button"
                        onClick={() => {
                          if (!isItemAvailable) {
                            if (!item) {
                              setCannotUndoInfo(`Cannot restore claim #${claim.id}: The associated found item #${claim.itemId} is no longer in the directory.`);
                            } else if (item.status === 'Returned') {
                              setCannotUndoInfo(`Cannot restore claim #${claim.id}: Item #${item.id} (${item.description}) has already been returned to ${item.returnedToName || 'a claimant'} and officially resolved. Returned items cannot accept claims.`);
                            } else if (item.status === 'Approved — Awaiting Return') {
                              setCannotUndoInfo(`Cannot restore claim #${claim.id}: Item #${item.id} (${item.description}) is already approved for another claimant awaiting return. If you need to reconsider claims for this item, first revoke the existing approval in the "Approved Awaiting Return" tab.`);
                            }
                          } else {
                            onUndoRejection(claim.id);
                          }
                        }}
                        className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg shadow-xs transition ${
                          isItemAvailable
                            ? 'bg-[#154734] hover:bg-[#0e3124] text-white cursor-pointer'
                            : 'bg-slate-200 hover:bg-slate-300 text-slate-600 cursor-pointer'
                        }`}
                        title={
                          isItemAvailable
                            ? 'Restore this claim back to Pending Review'
                            : 'Cannot restore while the item is already approved or returned'
                        }
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Undo Rejection</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 5: RETURNED & RESOLVED ARCHIVE */}
      {activeTab === 'returned' && (
        <div className="space-y-3">
          {returnedItemsList.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
              <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No Returned Items Yet</h3>
              <p className="text-xs text-slate-500">
                When a physical return is confirmed, the item moves here with its recorded return date and recipient.
              </p>
            </div>
          ) : (
            returnedItemsList.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border-2 border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 opacity-90"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      #{item.id}
                    </span>
                    <span className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded text-[11px] font-bold">
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-500">{item.campusLocation}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">{item.description}</h4>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-950 text-right sm:text-left shrink-0">
                  <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Returned to: {item.returnedToName || 'Verified Claimant'}</span>
                  </div>
                  <div className="text-[11px] text-emerald-700 mt-0.5">
                    Return Date: {item.dateReturned || 'Recorded'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Confirmation Modal for Permanently Deleting a Rejected Claim */}
      {deleteConfirmClaim && (
        <div className="fixed inset-0 z-50 bg-[#0e3124]/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-rose-300 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2.5 text-rose-700">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Permanently delete this rejected claim? This cannot be undone.
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete claim <strong className="text-slate-900">#{deleteConfirmClaim.id}</strong> submitted by <strong className="text-slate-900">{deleteConfirmClaim.claimantName}</strong> for item <strong className="text-slate-900">#{deleteConfirmClaim.itemId}</strong>?
            </p>

            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-950 space-y-1">
              <strong>Record Deletion Details:</strong>
              <p className="text-[11px] text-rose-800">
                Only this specific claim record (including its submitted identifying details and hidden contact information) will be permanently deleted. The found-item listing (#{deleteConfirmClaim.itemId}) and all other claims will be preserved.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteConfirmClaim(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteRejectedClaim(deleteConfirmClaim.id);
                  setDeleteConfirmClaim(null);
                }}
                className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs transition flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Permanently</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cannot Undo Explanation Modal */}
      {cannotUndoInfo && (
        <div className="fixed inset-0 z-50 bg-[#0e3124]/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-amber-300 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2.5 text-amber-800">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Cannot Restore Rejected Claim
              </h3>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-950 leading-relaxed">
              {cannotUndoInfo}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCannotUndoInfo(null)}
                className="px-4 py-2 text-xs font-bold bg-[#154734] hover:bg-[#0e3124] text-white rounded-xl transition"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Physical Handoff & Return */}
      {handoffConfirmData && (
        <div className="fixed inset-0 z-50 bg-[#0e3124]/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-[#154734]/30 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2.5 text-[#154734]">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">
                Confirm Physical Handoff &amp; Mark Returned
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you confirming that item <strong className="text-slate-900">#{handoffConfirmData.item.id} ({handoffConfirmData.item.description})</strong> has been physically handed off to <strong className="text-slate-900">{handoffConfirmData.claimantName}</strong>?
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 space-y-1">
              <strong>Notice:</strong> This action officially retires the record and moves it to the <strong>Returned &amp; Resolved Archive</strong>. It is permanently removed from the public directory.
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setHandoffConfirmData(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onConfirmHandoffAndReturn(
                    handoffConfirmData.item.id,
                    handoffConfirmData.claimantName
                  );
                  setHandoffConfirmData(null);
                }}
                className="px-4 py-2 text-xs font-bold bg-[#154734] hover:bg-[#0e3124] text-white rounded-xl shadow-xs transition"
              >
                Yes, Confirm Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
