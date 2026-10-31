import React from 'react';
import { SAMPLE_CARD_PRESETS, SampleCardPreset } from '../data/sampleCards';
import { CardVisualPreview } from './CardVisualPreview';
import { Scan, Plus, Download, Check, Shield, Award, Sparkles } from 'lucide-react';
import { ScannedCard } from '../types/card';
import { downloadVCard } from '../utils/ocrEngine';

interface PresetsShowcaseProps {
  onScanPreset: (preset: SampleCardPreset) => void;
  onImportPreset: (preset: SampleCardPreset) => void;
}

export const PresetsShowcase: React.FC<PresetsShowcaseProps> = ({
  onScanPreset,
  onImportPreset,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">
            Optical Card Test Deck
          </h2>
          <p className="text-xs text-[#64748B] mt-1">
            Production-grade sample layouts engineered to test camera edge alignment, barcode readers, and OCR parsing pipelines.
          </p>
        </div>
        <div className="text-xs font-mono text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          5 Standard Layouts
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SAMPLE_CARD_PRESETS.map((preset) => {
          return (
            <div
              key={preset.id}
              className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                    {preset.presetTitle}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 capitalize">
                    {preset.category.replace('_', ' ')}
                  </span>
                </div>

                {/* Card representation */}
                <div className="flex justify-center my-2">
                  <CardVisualPreview
                    card={preset.card}
                    aspectRatio={preset.aspectRatio}
                    bgGradient={preset.bgGradient}
                    accentColor={preset.accentColor}
                    chipVisible={preset.chipVisible}
                    barcodeVisible={preset.barcodeVisible}
                    className="transform scale-95"
                  />
                </div>

                <div className="mt-3 space-y-1 text-xs text-slate-600">
                  <p className="font-semibold text-slate-900 truncate">{preset.card.name}</p>
                  <p className="truncate text-slate-500">{preset.card.title}</p>
                  <p className="truncate text-slate-500">{preset.card.company}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onScanPreset(preset)}
                  className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-all shadow-xs"
                  style={{ backgroundColor: '#1E40AF' }}
                >
                  <Scan className="w-3.5 h-3.5" />
                  <span>Scan in HUD</span>
                </button>

                <button
                  onClick={() => onImportPreset(preset)}
                  className="py-2 px-3 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center gap-1.5 transition-colors"
                  title="Save directly to Library"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
