import React, { useState, useEffect } from 'react';
import { ViewfinderHUD } from './components/ViewfinderHUD';
import { InspectionSheet } from './components/InspectionSheet';
import { HistoryLibrary } from './components/HistoryLibrary';
import { CardDetailModal } from './components/CardDetailModal';
import { PresetsShowcase } from './components/PresetsShowcase';
import { TopAppBar } from './components/TopAppBar';
import { ScannedCard } from './types/card';
import { SAMPLE_CARD_PRESETS, SampleCardPreset } from './data/sampleCards';
import { performCardScan, exportCardsAsCSV } from './utils/ocrEngine';
import {
  Camera,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  FileSpreadsheet,
  Download,
  Info
} from 'lucide-react';

const STORAGE_KEY = 'cardscan_m3_library_v1';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'scanner' | 'history' | 'presets'>('scanner');
  const [cards, setCards] = useState<ScannedCard[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse stored cards:', e);
    }
    // Seed initial library with 2 diverse cards
    return [
      {
        id: 'seed_card_1',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        ...SAMPLE_CARD_PRESETS[0].card,
      },
      {
        id: 'seed_card_2',
        createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
        ...SAMPLE_CARD_PRESETS[1].card,
      },
    ];
  });

  // Active card being inspected in bottom sheet
  const [inspectingCard, setInspectingCard] = useState<Partial<ScannedCard> | null>(null);

  // Active card being viewed in detail modal
  const [detailCard, setDetailCard] = useState<ScannedCard | null>(null);

  // Scanning indicator state
  const [isScanning, setIsScanning] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [cards]);

  // Handle capture event from ViewfinderHUD
  const handleCapture = async (capturedData: Partial<ScannedCard>, imageBase64?: string) => {
    setIsScanning(true);

    try {
      let finalCardData: Partial<ScannedCard> = capturedData;

      if (imageBase64) {
        // Run OCR scan through Gemini endpoint or fallback
        finalCardData = await performCardScan(imageBase64, capturedData);
      } else {
        // Small simulated processing latency (350ms) for realistic optical scan feel
        await new Promise((r) => setTimeout(r, 400));
      }

      setInspectingCard({
        ...finalCardData,
        imageUri: imageBase64 || finalCardData.imageUri,
      });
    } catch (err) {
      console.error('Scan error:', err);
      setInspectingCard(capturedData);
    } finally {
      setIsScanning(false);
    }
  };

  // Save or update card in library
  const handleSaveCard = (savedCard: ScannedCard) => {
    setCards((prev) => {
      const exists = prev.some((c) => c.id === savedCard.id);
      if (exists) {
        return prev.map((c) => (c.id === savedCard.id ? savedCard : c));
      }
      return [savedCard, ...prev];
    });
  };

  // Delete card from library
  const handleDeleteCard = (id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
    if (detailCard && detailCard.id === id) {
      setDetailCard(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8FF] text-[#131B2E]">
      {/* Top App Bar adhering to Constitution Top Bar Contract */}
      <TopAppBar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        cardsCount={cards.length}
        onQuickScan={() => setCurrentTab('scanner')}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 md:p-8">
        {/* SCREEN 1: SCANNER - CARD */}
        {currentTab === 'scanner' && (
          <div className="space-y-6">
            {/* Screen Header & Sub-Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
                  1. Scanner - Card
                </h1>
                <p className="text-xs text-[#64748B] mt-0.5">
                  High-velocity optical instrument with laser-guided framing, real-time edge telemetry, and instant OCR verification.
                </p>
              </div>

              {/* Status indicators */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  OPTICAL ENGINE ACTIVE
                </span>
              </div>
            </div>

            {/* Viewfinder HUD Component */}
            <ViewfinderHUD
              onCapture={handleCapture}
              isScanning={isScanning}
            />

            {/* Feature Overview Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-white border border-[#E2E8F0] rounded-xl shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold text-[#1E40AF] uppercase tracking-wider mb-1">
                  <ShieldCheck className="w-4 h-4 text-cyan-600" />
                  <span>Optical Precision</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  2px dashed Cyan viewfinder boundary with 4 solid 16px corner brackets and laser-sweep telemetry.
                </p>
              </div>

              <div className="p-4 bg-white border border-[#E2E8F0] rounded-xl shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold text-[#1E40AF] uppercase tracking-wider mb-1">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Tactile Inspection</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  M3 rounded bottom sheet slides up on capture with confidence ratings, raw OCR buffer, and inline editing.
                </p>
              </div>

              <div className="p-4 bg-white border border-[#E2E8F0] rounded-xl shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold text-[#1E40AF] uppercase tracking-wider mb-1">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                  <span>Enterprise Sync</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  One-tap pipeline export to vCard (.vcf) contacts and formatted Excel/CSV spreadsheets.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SCREEN 2: HISTORY LIBRARY */}
        {currentTab === 'history' && (
          <HistoryLibrary
            cards={cards}
            onSelectCard={(card) => setDetailCard(card)}
            onDeleteCard={handleDeleteCard}
            onScanNew={() => setCurrentTab('scanner')}
          />
        )}

        {/* SCREEN 3: PRESETS TEST DECK */}
        {currentTab === 'presets' && (
          <PresetsShowcase
            onScanPreset={(preset) => {
              setCurrentTab('scanner');
              handleCapture(preset.card);
            }}
            onImportPreset={(preset) => {
              const newCard: ScannedCard = {
                id: `card_preset_${Date.now()}`,
                createdAt: new Date().toISOString(),
                ...preset.card,
              };
              handleSaveCard(newCard);
              setCurrentTab('history');
            }}
          />
        )}
      </main>

      {/* Tactile Bottom Sheet for OCR Verification and Editing */}
      {inspectingCard && (
        <InspectionSheet
          card={inspectingCard}
          onClose={() => setInspectingCard(null)}
          onSave={(saved) => {
            handleSaveCard(saved);
            setInspectingCard(null);
          }}
          onExportCSV={(card) => exportCardsAsCSV([card])}
        />
      )}

      {/* Full-view Modal for individual card in library */}
      {detailCard && (
        <CardDetailModal
          card={detailCard}
          onClose={() => setDetailCard(null)}
          onEdit={(card) => {
            setDetailCard(null);
            setInspectingCard(card);
          }}
          onExportCSV={(card) => exportCardsAsCSV([card])}
        />
      )}
    </div>
  );
}
