import React, { useState, useMemo } from 'react';
import { FoundItem, ItemCategory } from '../types';
import { ITEM_CATEGORIES } from '../initialData';
import {
  Search,
  Filter,
  ArrowUpDown,
  PlusCircle,
  Calendar,
  MapPin,
  Tag,
  CreditCard,
  Laptop,
  Coffee,
  Shirt,
  BookOpen,
  Key,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Lock,
} from 'lucide-react';
import { CometIcon } from './CometIcon';
import { CometCardGuidanceSection } from './CometCardGuidanceSection';

interface DirectoryViewProps {
  items: FoundItem[];
  onOpenClaimModal: (item: FoundItem) => void;
  onNavigateToPost: () => void;
}

const CATEGORY_ICONS: Record<ItemCategory, React.ReactNode> = {
  'Comet Cards': <CreditCard className="w-4 h-4" />,
  Electronics: <Laptop className="w-4 h-4" />,
  'Water Bottles & Tumblers': <Coffee className="w-4 h-4" />,
  'Clothing & Accessories': <Shirt className="w-4 h-4" />,
  'Notebooks & Books': <BookOpen className="w-4 h-4" />,
  'Keys & Accessories': <Key className="w-4 h-4" />,
  Other: <HelpCircle className="w-4 h-4" />,
};

export const DirectoryView: React.FC<DirectoryViewProps> = ({
  items,
  onOpenClaimModal,
  onNavigateToPost,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Filter out Returned items: "Returned items must not appear among available items."
  const unreturnedItems = useMemo(() => {
    return items.filter((item) => item.status !== 'Returned');
  }, [items]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: unreturnedItems.length };
    unreturnedItems.forEach((i) => {
      counts[i.category] = (counts[i.category] || 0) + 1;
    });
    return counts;
  }, [unreturnedItems]);

  // Filtered and sorted listings
  const filteredItems = useMemo(() => {
    return unreturnedItems
      .filter((item) => {
        // Keyword search matches general description and location
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchDesc = item.description.toLowerCase().includes(q);
          const matchLoc = item.campusLocation.toLowerCase().includes(q);
          const matchSpec = item.specificLocation
            ? item.specificLocation.toLowerCase().includes(q)
            : false;
          const matchId = item.id.toLowerCase().includes(q);
          if (!matchDesc && !matchLoc && !matchSpec && !matchId) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== 'All' && item.category !== selectedCategory) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.dateFound).getTime();
        const timeB = new Date(b.dateFound).getTime();
        return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
      });
  }, [unreturnedItems, searchQuery, selectedCategory, sortOrder]);

  const isCometCardActive =
    selectedCategory === 'Comet Cards' ||
    filteredItems.some((i) => i.category === 'Comet Cards');

  return (
    <div className="space-y-6">
      {/* Screen 1 Header & Instructions */}
      <div className="bg-[#154734] text-white rounded-2xl p-6 sm:p-7 shadow-sm border-b-4 border-[#C75B12] relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="max-w-3xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-orange-500/20 text-orange-300 border border-orange-400/40 px-2.5 py-0.5 rounded-full">
                Screen 1
              </span>
              <span className="text-xs text-emerald-100">Public Directory</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <CometIcon className="w-7 h-7 shrink-0" />
              <span>Comet Finder Directory</span>
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Browse found campus items below. If you recognize a possible match, select ‘This Is Mine / Claim’ and provide identifying details. The finder will review your claim before contact information is revealed.
            </p>
          </div>

          <button
            type="button"
            onClick={onNavigateToPost}
            className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C75B12] hover:bg-[#a64b0e] text-white font-bold text-xs sm:text-sm shadow-md transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post Found Item</span>
          </button>
        </div>
      </div>

      {/* Expanded Comet Card Section: Office Guidance, Assistance Form & Replacement Options */}
      <CometCardGuidanceSection
        key={isCometCardActive ? 'comet-card-active' : 'comet-card-default'}
        initialType={selectedCategory === 'Comet Cards' ? 'replacement' : 'lost'}
        defaultExpanded={isCometCardActive}
      />

      {/* Search & Filtering Controls */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="relative md:col-span-8">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search general descriptions or campus locations (e.g. water bottle, library, umbrella, JSOM)..."
              className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#154734] outline-hidden text-slate-900"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Date Sorting Control */}
          <div className="relative md:col-span-4 flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
              className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#154734] outline-hidden text-slate-800 font-semibold"
            >
              <option value="newest">Date Found: Newest First</option>
              <option value="oldest">Date Found: Oldest First</option>
            </select>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-thin">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1 shrink-0">
            <Filter className="w-3.5 h-3.5 text-[#154734]" /> Categories:
          </span>
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedCategory === 'All'
                ? 'bg-[#154734] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>All</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === 'All' ? 'bg-black/20 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {categoryCounts['All'] || 0}
            </span>
          </button>

          {ITEM_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? cat === 'Comet Cards'
                      ? 'bg-[#C75B12] text-white shadow-xs'
                      : 'bg-[#154734] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {CATEGORY_ICONS[cat]}
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-black/20 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {categoryCounts[cat] || 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Directory Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-1">
        <p className="text-xs sm:text-sm text-slate-700 font-medium">
          Showing <strong className="text-[#154734] font-bold">{filteredItems.length}</strong> items in directory
          {selectedCategory !== 'All' ? ` (${selectedCategory})` : ''}
        </p>

        {(searchQuery || selectedCategory !== 'All') && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="text-xs text-[#C75B12] hover:text-[#a64b0e] font-bold underline underline-offset-2 self-start sm:self-auto"
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Item Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4 shadow-xs">
          <div className="w-12 h-12 bg-orange-50 text-[#C75B12] rounded-full flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No matching items found</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              No found items matched your search. Try checking your spelling or selecting "All" categories. Returned items are no longer listed in this public directory.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="px-4 py-2 text-xs font-bold bg-[#154734] hover:bg-[#0e3124] text-white rounded-lg shadow-sm transition"
          >
            View All Directory Items
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => {
            const isApprovedAwaiting = item.status === 'Approved — Awaiting Return';
            const isCometCard = item.category === 'Comet Cards';

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border-2 border-slate-200 hover:border-[#154734]/30 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                {/* Public Card Body matching reference screenshot */}
                <div className="p-5 space-y-3">
                  {/* Top metadata line */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-[#154734]">{item.category}</span>
                      <span className="text-slate-300">&bull;</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" /> Found {item.dateFound}
                      </span>
                    </div>

                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                      #{item.id}
                    </span>
                  </div>

                  {/* Title / Description */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {item.description}
                    </h3>
                  </div>

                  {/* Campus Location */}
                  <div className="text-xs text-slate-600 flex items-start gap-1.5 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#C75B12] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-800">{item.campusLocation}</span>
                      {item.specificLocation && (
                        <span className="text-slate-500 block text-[11px]">
                          ({item.specificLocation})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Confidentiality Notice */}
                  <div className="text-[11px] text-slate-400 italic pt-1">
                    Public listing &bull; Personal identifying details hidden
                  </div>
                </div>

                {/* Card Footer: Status & Claim Button */}
                <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                  {/* Status Badge */}
                  {isApprovedAwaiting ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                      <Lock className="w-3 h-3 text-amber-700" />
                      Approved — Awaiting Return
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#154734] bg-emerald-100/70 px-2.5 py-0.5 rounded-full border border-emerald-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#154734]"></span>
                      Available
                    </span>
                  )}

                  {/* Action Button: Disabled when Approved — Awaiting Return */}
                  {isApprovedAwaiting ? (
                    <button
                      type="button"
                      disabled
                      className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-slate-200 text-slate-500 cursor-not-allowed"
                      title="This item has an approved claim and cannot accept additional claims while approval is active."
                    >
                      Claims Paused
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onOpenClaimModal(item)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[#C75B12] hover:bg-[#a64b0e] text-white shadow-xs hover:shadow transition"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>This Is Mine / Claim</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
