import React from 'react';
import { Camera, Layers, BookmarkCheck, Download, Plus } from 'lucide-react';

interface TopAppBarProps {
  currentTab: 'scanner' | 'history' | 'presets';
  onTabChange: (tab: 'scanner' | 'history' | 'presets') => void;
  cardsCount: number;
  onQuickScan: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  currentTab,
  onTabChange,
  cardsCount,
  onQuickScan,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-xs">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#1E40AF] text-white flex items-center justify-center font-extrabold text-sm shadow-xs">
            CS
          </div>
          <span className="text-base sm:text-lg font-bold tracking-tight text-[#0F172A] whitespace-nowrap shrink-0">
            CardScan M3
          </span>
        </div>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="flex items-center gap-4 sm:gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => onTabChange('scanner')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              currentTab === 'scanner'
                ? 'border-[#1E40AF] text-[#1E40AF] font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Optical Scanner
          </button>

          <button
            onClick={() => onTabChange('history')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 flex items-center gap-1.5 ${
              currentTab === 'history'
                ? 'border-[#1E40AF] text-[#1E40AF] font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <span>Library</span>
            {cardsCount > 0 && (
              <span className="text-[11px] font-mono px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700">
                {cardsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onTabChange('presets')}
            className={`hidden sm:inline-block transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              currentTab === 'presets'
                ? 'border-[#1E40AF] text-[#1E40AF] font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Presets
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onQuickScan}
            className="min-h-[40px] px-3.5 py-2 text-xs font-semibold text-white rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1.5 whitespace-nowrap shrink-0"
            style={{ backgroundColor: '#1E40AF' }}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Scan Card</span>
          </button>
        </div>
      </div>
    </header>
  );
};
