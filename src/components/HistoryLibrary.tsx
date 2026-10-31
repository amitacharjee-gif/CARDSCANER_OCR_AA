import React, { useState } from 'react';
import {
  Search,
  Filter,
  FileSpreadsheet,
  Download,
  Trash2,
  ExternalLink,
  Phone,
  Mail,
  Share2,
  Star,
  CheckSquare,
  Square,
  QrCode,
  Eye,
  PlusCircle,
  FileText
} from 'lucide-react';
import { ScannedCard, CardCategory } from '../types/card';
import { downloadVCard, exportCardsAsCSV, exportBatchVCards } from '../utils/ocrEngine';

interface HistoryLibraryProps {
  cards: ScannedCard[];
  onSelectCard: (card: ScannedCard) => void;
  onDeleteCard: (id: string) => void;
  onScanNew: () => void;
}

export const HistoryLibrary: React.FC<HistoryLibraryProps> = ({
  cards,
  onSelectCard,
  onDeleteCard,
  onScanNew,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCardIds, setSelectedCardIds] = useState<Set<string>>(new Set());
  const [isBatchMode, setIsBatchMode] = useState<boolean>(false);

  // Filter cards by search and category
  const filteredCards = cards.filter((card) => {
    const matchesCategory = selectedCategory === 'all' || card.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      card.name.toLowerCase().includes(q) ||
      card.company.toLowerCase().includes(q) ||
      card.title.toLowerCase().includes(q) ||
      card.email.toLowerCase().includes(q) ||
      (card.cardNumber && card.cardNumber.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  const toggleSelectCard = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCardIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedCardIds.size === filteredCards.length) {
      setSelectedCardIds(new Set());
    } else {
      setSelectedCardIds(new Set(filteredCards.map((c) => c.id)));
    }
  };

  const handleBatchExportCSV = () => {
    const selected = cards.filter((c) => selectedCardIds.has(c.id));
    if (selected.length > 0) exportCardsAsCSV(selected);
  };

  const handleBatchExportVCF = () => {
    const selected = cards.filter((c) => selectedCardIds.has(c.id));
    if (selected.length > 0) exportBatchVCards(selected);
  };

  const handleBatchDelete = () => {
    if (confirm(`Delete ${selectedCardIds.size} selected card(s)?`)) {
      selectedCardIds.forEach((id) => onDeleteCard(id));
      setSelectedCardIds(new Set());
      setIsBatchMode(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5 select-none">
      {/* Search Bar & Batch Mode Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input (Filled variant with white surface, 1px #E2E8F0 border) */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, company, email, or badge ID..."
            className="w-full bg-white border border-[#E2E8F0] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-2 focus:border-[#2563EB] transition-all shadow-xs"
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setIsBatchMode(!isBatchMode);
              setSelectedCardIds(new Set());
            }}
            className={`min-h-[44px] px-3.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
              isBatchMode
                ? 'bg-[#1E40AF] text-white border-[#1E40AF]'
                : 'bg-white text-slate-700 border-[#E2E8F0] hover:bg-slate-50'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>{isBatchMode ? 'Done' : 'Select'}</span>
          </button>

          <button
            onClick={onScanNew}
            className="min-h-[44px] px-4 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
            style={{ backgroundColor: '#1E40AF' }}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Scan New</span>
          </button>
        </div>
      </div>

      {/* Format Filter Chips (Specification compliant: Outlined with #E2E8F0, bg #FFFFFF, active #1E40AF) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'all', label: 'All Cards' },
          { id: 'business', label: 'Business Cards' },
          { id: 'id_badge', label: 'ID Badges' },
          { id: 'membership', label: 'Membership' },
          { id: 'medical', label: 'Medical' },
          { id: 'finance', label: 'Corporate' },
        ].map((filter) => {
          const isActive = selectedCategory === filter.id;
          return (
            <button
              key={filter.id}
              onClick={() => setSelectedCategory(filter.id)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-[#1E40AF] text-white border-[#1E40AF] shadow-xs'
                  : 'bg-white text-[#0F172A] border-[#E2E8F0] hover:bg-slate-50'
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {/* Batch Actions Toolbar when active */}
      {isBatchMode && (
        <div className="p-3 bg-[#EAEDFF] border border-[#CBD5E1] rounded-xl flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectAll}
              className="font-semibold text-[#1E40AF] hover:underline"
            >
              {selectedCardIds.size === filteredCards.length ? 'Deselect All' : 'Select All'}
            </button>
            <span className="text-slate-500">·</span>
            <span className="font-mono text-slate-700">
              {selectedCardIds.size} of {filteredCards.length} selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={selectedCardIds.size === 0}
              onClick={handleBatchExportCSV}
              className="px-3 py-1.5 rounded-lg text-white font-medium flex items-center gap-1 disabled:opacity-40"
              style={{ backgroundColor: '#059669' }}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              disabled={selectedCardIds.size === 0}
              onClick={handleBatchExportVCF}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium flex items-center gap-1 disabled:opacity-40 hover:bg-slate-50"
            >
              <Download className="w-3.5 h-3.5 text-[#1E40AF]" />
              <span>Export vCards</span>
            </button>

            <button
              disabled={selectedCardIds.size === 0}
              onClick={handleBatchDelete}
              className="px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-lg font-medium flex items-center gap-1 disabled:opacity-40 hover:bg-red-100"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      )}

      {/* Cards List (Spec: Card surface #FFFFFF, 1px #E2E8F0 outline, left-aligned thumbnail with overlaid format pill) */}
      {filteredCards.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#E2E8F0] space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-800">No scanned cards found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? 'Try modifying your search keywords or filter category.'
              : 'Scan your first card or try one of the ready-made presets in the scanner.'}
          </p>
          <button
            onClick={onScanNew}
            className="mt-2 px-5 py-2 rounded-xl text-xs font-semibold text-white inline-flex items-center gap-1.5"
            style={{ backgroundColor: '#1E40AF' }}
          >
            Open Card Scanner
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCards.map((card) => {
            const isSelected = selectedCardIds.has(card.id);
            const formattedDate = new Date(card.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div
                key={card.id}
                onClick={() => {
                  if (isBatchMode) {
                    toggleSelectCard(card.id, {} as any);
                  } else {
                    onSelectCard(card);
                  }
                }}
                className={`group relative bg-white border rounded-xl p-3.5 sm:p-4 flex items-center gap-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isSelected ? 'border-[#1E40AF] ring-2 ring-[#1E40AF]/20' : 'border-[#E2E8F0]'
                }`}
                style={{
                  boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.05)',
                }}
              >
                {/* Checkbox for batch mode */}
                {isBatchMode && (
                  <button
                    onClick={(e) => toggleSelectCard(card.id, e)}
                    className="p-1 text-slate-400 hover:text-[#1E40AF]"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-5 h-5 text-[#1E40AF]" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-300" />
                    )}
                  </button>
                )}

                {/* Left Thumbnail with overlaid format pill */}
                <div className="relative shrink-0 w-20 h-14 sm:w-24 sm:h-16 rounded-lg overflow-hidden bg-gradient-to-br from-slate-900 to-indigo-950 flex items-center justify-center border border-slate-200 shadow-xs">
                  {/* Decorative card micro-elements */}
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:8px_8px]" />
                  <span className="font-mono text-[10px] text-white/70 tracking-widest font-bold">
                    {card.category === 'id_badge' ? 'BADGE' : 'CARD'}
                  </span>

                  {/* Overlaid format pill */}
                  <div className="absolute bottom-1 left-1 bg-slate-950/85 backdrop-blur-xs text-[9px] font-semibold text-cyan-300 px-1.5 py-0.5 rounded uppercase tracking-wider">
                    {card.category.replace('_', ' ')}
                  </div>
                </div>

                {/* Card Info: Leading Title in Inter SemiBold, trailing timestamp in Slate 400 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="text-sm sm:text-base font-semibold text-[#0F172A] truncate group-hover:text-[#1E40AF] transition-colors">
                      {card.name}
                    </h4>
                    <span className="text-[11px] text-[#64748B] shrink-0 tabular-nums">
                      {formattedDate}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 truncate mt-0.5 font-medium">
                    {card.title ? `${card.title} · ` : ''}
                    <span className="text-slate-800">{card.company}</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-1.5">
                    {card.email && <span className="truncate max-w-[180px]">{card.email}</span>}
                    {card.phone && (
                      <>
                        <span className="text-slate-300">·</span>
                        <span className="tabular-nums font-mono">{card.phone}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Quick Action buttons (Spec: Emerald export action, crimson trash) */}
                {!isBatchMode && (
                  <div className="flex items-center gap-1 shrink-0">
                    {/* Emerald Export action trigger */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadVCard(card);
                      }}
                      className="p-2 rounded-lg text-white hover:opacity-90 transition-opacity shadow-xs"
                      style={{ backgroundColor: '#059669' }}
                      title="Download vCard"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete card for ${card.name}?`)) onDeleteCard(card.id);
                      }}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete Card"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
