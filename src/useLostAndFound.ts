import { useState, useEffect, useCallback, useRef } from 'react';
import { FoundItem, ClaimRequest, ItemCategory, UTDLocation } from './types';
import { INITIAL_ITEMS, INITIAL_CLAIMS } from './initialData';
import {
  db,
  handleFirestoreError,
  OperationType,
} from './firebase';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  writeBatch,
} from 'firebase/firestore';

const STORAGE_KEY_ITEMS = 'campus_lost_and_found_items_v1';
const STORAGE_KEY_CLAIMS = 'campus_lost_and_found_claims_v1';

export function useLostAndFound() {
  const [items, setItems] = useState<FoundItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ITEMS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load items from localStorage:', e);
    }
    return INITIAL_ITEMS;
  });

  const [claims, setClaims] = useState<ClaimRequest[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CLAIMS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load claims from localStorage:', e);
    }
    return INITIAL_CLAIMS;
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(false);
  const isInitialSeedDone = useRef<boolean>(false);

  // Sync to local storage for offline resilience
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to sync items to localStorage:', e);
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CLAIMS, JSON.stringify(claims));
    } catch (e) {
      console.error('Failed to sync claims to localStorage:', e);
    }
  }, [claims]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    const timer = setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  // Set up real-time Firebase listeners and auto-seed initial items if Firestore is empty
  useEffect(() => {
    let unsubscribeItems: (() => void) | null = null;
    let unsubscribeClaims: (() => void) | null = null;

    async function initFirestoreSync() {
      try {
        const itemsColl = collection(db, 'items');
        const claimsColl = collection(db, 'claims');

        // Check if items collection is empty on first boot
        if (!isInitialSeedDone.current) {
          isInitialSeedDone.current = true;
          try {
            const existingSnapshot = await getDocs(itemsColl);
            if (existingSnapshot.empty) {
              // Seed initial sample items & claims into Firestore
              const batch = writeBatch(db);
              INITIAL_ITEMS.forEach((it) => {
                const itRef = doc(db, 'items', it.id);
                batch.set(itRef, it);
              });
              INITIAL_CLAIMS.forEach((cl) => {
                const clRef = doc(db, 'claims', cl.id);
                batch.set(clRef, cl);
              });
              await batch.commit();
            }
          } catch (seedErr) {
            console.warn('Initial Firestore seed check skipped or handled:', seedErr);
          }
        }

        // Real-time listener for Items
        unsubscribeItems = onSnapshot(
          itemsColl,
          (snapshot) => {
            setIsFirebaseConnected(true);
            if (!snapshot.empty) {
              const remoteItems: FoundItem[] = [];
              snapshot.forEach((docSnap) => {
                remoteItems.push(docSnap.data() as FoundItem);
              });
              setItems(remoteItems);
            }
          },
          (error) => {
            handleFirestoreError(error, OperationType.GET, 'items');
          }
        );

        // Real-time listener for Claims
        unsubscribeClaims = onSnapshot(
          claimsColl,
          (snapshot) => {
            setIsFirebaseConnected(true);
            const remoteClaims: ClaimRequest[] = [];
            snapshot.forEach((docSnap) => {
              remoteClaims.push(docSnap.data() as ClaimRequest);
            });
            setClaims(remoteClaims);
          },
          (error) => {
            handleFirestoreError(error, OperationType.GET, 'claims');
          }
        );
      } catch (err) {
        console.warn('Firestore real-time sync initialization note:', err);
      }
    }

    initFirestoreSync();

    return () => {
      if (unsubscribeItems) unsubscribeItems();
      if (unsubscribeClaims) unsubscribeClaims();
    };
  }, []);

  const pendingClaimsCount = claims.filter((c) => c.status === 'Pending').length;

  // 1. Post Found Item (Screen 2)
  const postFoundItem = useCallback(
    async (itemData: {
      category: ItemCategory;
      description: string;
      dateFound: string;
      campusLocation: UTDLocation;
      specificLocation?: string;
    }) => {
      const highestNum = items.reduce((max, item) => {
        const match = item.id.match(/(?:CF|LF)-(\d+)/);
        if (match) {
          const num = parseInt(match[1], 10);
          return num > max ? num : max;
        }
        return max;
      }, 100);

      const newItem: FoundItem = {
        id: `CF-${highestNum + 1}`,
        category: itemData.category,
        description: itemData.description.trim(),
        dateFound: itemData.dateFound,
        campusLocation: itemData.campusLocation,
        specificLocation: itemData.specificLocation?.trim() || undefined,
        status: 'Available',
        createdAt: new Date().toISOString(),
      };

      // Optimistic state update
      setItems((prev) => [newItem, ...prev]);
      showToast(`Item #${newItem.id} published to directory!`);

      // Write to Firestore
      try {
        await setDoc(doc(db, 'items', newItem.id), newItem);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `items/${newItem.id}`);
      }

      return newItem;
    },
    [items, showToast]
  );

  // 2. Submit Claim (Screen 3)
  const submitClaim = useCallback(
    async (claimData: {
      itemId: string;
      claimantName: string;
      contactEmail: string;
      contactPhone: string;
      identifyingDetail: string;
    }) => {
      const highestNum = claims.reduce((max, c) => {
        const match = c.id.match(/CLM-(\d+)/);
        if (match) {
          const num = parseInt(match[1], 10);
          return num > max ? num : max;
        }
        return max;
      }, 300);

      const newClaim: ClaimRequest = {
        id: `CLM-${highestNum + 1}`,
        itemId: claimData.itemId,
        claimantName: claimData.claimantName.trim(),
        contactEmail: claimData.contactEmail.trim(),
        contactPhone: claimData.contactPhone.trim(),
        identifyingDetail: claimData.identifyingDetail.trim(),
        submittedAt: new Date().toISOString(),
        status: 'Pending',
      };

      setClaims((prev) => [newClaim, ...prev]);
      showToast(`Claim #${newClaim.id} submitted! Pending finder review.`);

      // Write to Firestore
      try {
        await setDoc(doc(db, 'claims', newClaim.id), newClaim);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `claims/${newClaim.id}`);
      }

      return newClaim;
    },
    [claims, showToast]
  );

  // 3. Approve Claim (Screen 4)
  const approveClaim = useCallback(
    async (claimId: string, itemId: string) => {
      const nowStr = new Date().toISOString();

      const alreadyApproved = claims.some(
        (c) => c.itemId === itemId && c.status === 'Approved' && c.id !== claimId
      );
      if (alreadyApproved) {
        showToast(`Cannot approve claim: this item already has an active approved claim.`);
        return;
      }

      const updatedClaim = claims.find((c) => c.id === claimId);
      const updatedItem = items.find((i) => i.id === itemId);

      setClaims((prev) =>
        prev.map((c) =>
          c.id === claimId
            ? { ...c, status: 'Approved', reviewDate: nowStr }
            : c
        )
      );

      setItems((prev) =>
        prev.map((i) =>
          i.id === itemId
            ? { ...i, status: 'Approved — Awaiting Return' }
            : i
        )
      );

      showToast(`Claim #${claimId} approved! Claimant contact details are now revealed.`);

      // Write to Firestore
      try {
        if (updatedClaim) {
          await setDoc(doc(db, 'claims', claimId), {
            ...updatedClaim,
            status: 'Approved',
            reviewDate: nowStr,
          });
        }
        if (updatedItem) {
          await setDoc(doc(db, 'items', itemId), {
            ...updatedItem,
            status: 'Approved — Awaiting Return',
          });
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `items/${itemId} / claims/${claimId}`);
      }
    },
    [claims, items, showToast]
  );

  // 4. Revoke Approval (Screen 4)
  const revokeApproval = useCallback(
    async (claimId: string, itemId: string) => {
      const updatedClaim = claims.find((c) => c.id === claimId);
      const updatedItem = items.find((i) => i.id === itemId);

      setClaims((prev) =>
        prev.map((c) =>
          c.id === claimId
            ? { ...c, status: 'Pending', reviewDate: undefined }
            : c
        )
      );

      setItems((prev) =>
        prev.map((i) =>
          i.id === itemId
            ? { ...i, status: 'Available' }
            : i
        )
      );

      showToast(`Approval revoked for claim #${claimId}. Contact info is hidden and item is Available again.`);

      try {
        if (updatedClaim) {
          const { reviewDate, ...rest } = updatedClaim;
          await setDoc(doc(db, 'claims', claimId), { ...rest, status: 'Pending' });
        }
        if (updatedItem) {
          await setDoc(doc(db, 'items', itemId), { ...updatedItem, status: 'Available' });
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `items/${itemId} / claims/${claimId}`);
      }
    },
    [claims, items, showToast]
  );

  // 5. Reject Claim (Screen 4)
  const rejectClaim = useCallback(
    async (claimId: string, reason?: string) => {
      const nowStr = new Date().toISOString();
      const rejectionReason = reason || 'Identifying details did not match the found item.';
      const existingClaim = claims.find((c) => c.id === claimId);

      setClaims((prev) =>
        prev.map((c) =>
          c.id === claimId
            ? {
                ...c,
                status: 'Rejected',
                reviewDate: nowStr,
                rejectionReason,
              }
            : c
        )
      );

      // Keep item available if it has no approved claim
      if (existingClaim) {
        const associatedItem = items.find((i) => i.id === existingClaim.itemId);
        if (associatedItem && associatedItem.status !== 'Returned') {
          const hasOtherApproved = claims.some(
            (c) => c.itemId === existingClaim.itemId && c.status === 'Approved' && c.id !== claimId
          );
          if (!hasOtherApproved && associatedItem.status !== 'Available') {
            setItems((prev) =>
              prev.map((i) =>
                i.id === existingClaim.itemId ? { ...i, status: 'Available' } : i
              )
            );
            try {
              await setDoc(doc(db, 'items', existingClaim.itemId), {
                ...associatedItem,
                status: 'Available',
              });
            } catch (e) {
              console.warn('Item status sync error:', e);
            }
          }
        }
      }

      showToast(`Claim #${claimId} has been rejected and moved to the Rejected Claims tab.`);

      try {
        if (existingClaim) {
          await setDoc(doc(db, 'claims', claimId), {
            ...existingClaim,
            status: 'Rejected',
            reviewDate: nowStr,
            rejectionReason,
          });
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `claims/${claimId}`);
      }
    },
    [claims, items, showToast]
  );

  // 5b. Undo Rejection (Screen 4)
  const undoRejection = useCallback(
    async (claimId: string): Promise<{ success: boolean; message: string }> => {
      const claim = claims.find((c) => c.id === claimId);
      if (!claim) {
        return { success: false, message: 'Claim record not found.' };
      }

      const item = items.find((i) => i.id === claim.itemId);
      if (!item) {
        const msg = `Cannot restore claim: the associated found item #${claim.itemId} no longer exists.`;
        showToast(msg);
        return { success: false, message: msg };
      }

      // If item is already returned, explain why it cannot be restored
      if (item.status === 'Returned') {
        const msg = `Cannot restore claim: Item #${item.id} (${item.description}) has already been returned to ${item.returnedToName || 'a verified claimant'} and resolved.`;
        showToast(msg);
        return { success: false, message: msg };
      }

      // If item is already approved for another claimant, explain why it cannot be restored
      const activeApprovedClaim = claims.find(
        (c) => c.itemId === item.id && c.status === 'Approved' && c.id !== claimId
      );
      if (item.status === 'Approved — Awaiting Return' || activeApprovedClaim) {
        const approvedName = activeApprovedClaim ? activeApprovedClaim.claimantName : 'another student';
        const msg = `Cannot restore claim: Item #${item.id} (${item.description}) is already approved for ${approvedName}. Revoke that approval before restoring this claim.`;
        showToast(msg);
        return { success: false, message: msg };
      }

      // Restore claim to Pending Review
      const restoredClaim: ClaimRequest = {
        ...claim,
        status: 'Pending',
        rejectionReason: undefined,
        reviewDate: undefined,
      };

      setClaims((prev) =>
        prev.map((c) => (c.id === claimId ? restoredClaim : c))
      );

      // Ensure item is marked Available
      if (item.status !== 'Available') {
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, status: 'Available' } : i))
        );
      }

      const successMsg = `Claim #${claimId} restored to Pending Review! It has been moved back to Pending Claims.`;
      showToast(successMsg);

      // Persist restored claim to Firestore
      try {
        const updateData: Record<string, any> = {
          id: claim.id,
          itemId: claim.itemId,
          claimantName: claim.claimantName,
          contactEmail: claim.contactEmail,
          contactPhone: claim.contactPhone,
          identifyingDetail: claim.identifyingDetail,
          submittedAt: claim.submittedAt,
          status: 'Pending',
        };
        await setDoc(doc(db, 'claims', claimId), updateData);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `claims/${claimId}`);
      }

      return { success: true, message: successMsg };
    },
    [claims, items, showToast]
  );

  // 5c. Permanently Delete Rejected Claim (Screen 4)
  const deleteRejectedClaim = useCallback(
    async (claimId: string) => {
      const claimToDelete = claims.find((c) => c.id === claimId);
      if (!claimToDelete) return;

      // Delete only this claim; preserve found item and all other claims
      setClaims((prev) => prev.filter((c) => c.id !== claimId));
      showToast(`Rejected claim #${claimId} was permanently deleted.`);

      try {
        await deleteDoc(doc(db, 'claims', claimId));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `claims/${claimId}`);
      }
    },
    [claims, showToast]
  );

  // 6. Confirm Handoff & Mark Returned (Screen 4)
  const confirmHandoffAndReturn = useCallback(
    async (itemId: string, claimantName?: string) => {
      const todayStr = new Date().toISOString().split('T')[0];
      const recipient = claimantName || 'Verified Claimant';
      const existingItem = items.find((i) => i.id === itemId);

      setItems((prev) =>
        prev.map((i) =>
          i.id === itemId
            ? {
                ...i,
                status: 'Returned',
                dateReturned: todayStr,
                returnedToName: recipient,
              }
            : i
        )
      );

      showToast(`Physical handoff confirmed for item #${itemId}! Item moved to Returned & Resolved.`);

      try {
        if (existingItem) {
          await setDoc(doc(db, 'items', itemId), {
            ...existingItem,
            status: 'Returned',
            dateReturned: todayStr,
            returnedToName: recipient,
          });
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `items/${itemId}`);
      }
    },
    [items, showToast]
  );

  // 7. Reset Sample Data
  const resetSampleData = useCallback(async () => {
    localStorage.removeItem(STORAGE_KEY_ITEMS);
    localStorage.removeItem(STORAGE_KEY_CLAIMS);
    setItems(INITIAL_ITEMS);
    setClaims(INITIAL_CLAIMS);
    showToast('Reset to original 5 fictional sample listings.');

    try {
      const batch = writeBatch(db);
      // Clean old and reseed
      const existingItems = await getDocs(collection(db, 'items'));
      existingItems.forEach((d) => batch.delete(d.ref));
      const existingClaims = await getDocs(collection(db, 'claims'));
      existingClaims.forEach((d) => batch.delete(d.ref));

      INITIAL_ITEMS.forEach((it) => {
        batch.set(doc(db, 'items', it.id), it);
      });
      INITIAL_CLAIMS.forEach((cl) => {
        batch.set(doc(db, 'claims', cl.id), cl);
      });
      await batch.commit();
    } catch (error) {
      console.warn('Firebase batch reset note:', error);
    }
  }, [showToast]);

  return {
    items,
    claims,
    pendingClaimsCount,
    toastMessage,
    isFirebaseConnected,
    dismissToast: () => setToastMessage(null),
    postFoundItem,
    submitClaim,
    approveClaim,
    revokeApproval,
    rejectClaim,
    undoRejection,
    deleteRejectedClaim,
    confirmHandoffAndReturn,
    resetSampleData,
  };
}
