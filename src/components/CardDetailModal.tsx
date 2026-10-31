import React, { useState } from 'react';
import {
  X,
  Download,
  Share2,
  Phone,
  Mail,
  Globe,
  MapPin,
  Building,
  User,
  CreditCard,
  Edit3,
  Copy,
  Check,
  FileSpreadsheet,
  QrCode,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { ScannedCard } from '../types/card';
import { CardVisualPreview } from './CardVisualPreview';
import { downloadVCard } from '../utils/ocrEngine';

interface CardDetailModalProps {
  card: ScannedCard;
  onClose: () => void;
  onEdit: (card: ScannedCard) => void;
  onExportCSV: (card: ScannedCard) => void;
}

export const CardDetailModal: React.FC<CardDetailModalProps> = ({
  card,
  onClose,
  onEdit,
  onExportCSV,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const formattedDate = new Date(card.createdAt).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-[#E2E8F0]"
        style={{
          boxShadow: '0 20px 25px -5px rgba(15, 23, 42, 0.15)',
        }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-4 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
            <h3 className="text-base font-bold text-[#0F172A] truncate">
              {card.name}
            </h3>
            <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-medium capitalize">
              {card.category.replace('_', ' ')}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Card Physical Simulation Showcase */}
          <div className="flex justify-center">
            <CardVisualPreview
              card={card}
              aspectRatio={card.category === 'id_badge' ? 'portrait' : 'landscape'}
              chipVisible={true}
              barcodeVisible={card.category === 'id_badge'}
            />
          </div>

          {/* Quick Action Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {card.phone && (
              <a
                href={`tel:${card.phone}`}
                className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span>Call Phone</span>
              </a>
            )}

            {card.email && (
              <a
                href={`mailto:${card.email}`}
                className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-indigo-600" />
                <span>Send Email</span>
              </a>
            )}

            {card.website && (
              <a
                href={card.website}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <span>Visit Site</span>
              </a>
            )}

            <button
              onClick={() => onEdit(card)}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-600" />
              <span>Edit OCR</span>
            </button>
          </div>

          {/* Key Value Data Grid */}
          <div className="border border-[#E2E8F0] rounded-xl overflow-hidden divide-y divide-[#E2E8F0] bg-white text-xs">
            <div className="p-3 bg-slate-50 font-semibold text-slate-700 flex items-center justify-between">
              <span>Card Metadata & Contact Details</span>
              <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-normal">
                {card.confidence}% OCR Match
              </span>
            </div>

            {[
              { label: 'Full Name', value: card.name, icon: User },
              { label: 'Title / Position', value: card.title, icon: ShieldCheck },
              { label: 'Company', value: card.company, icon: Building },
              { label: 'Department', value: card.department, icon: Building },
              { label: 'Phone', value: card.phone, icon: Phone },
              { label: 'Email', value: card.email, icon: Mail },
              { label: 'Website', value: card.website, icon: Globe },
              { label: 'Address', value: card.address, icon: MapPin },
              { label: 'Card / ID Number', value: card.cardNumber, icon: CreditCard },
              { label: 'Valid Thru / Expiry', value: card.expiryDate, icon: Calendar },
              { label: 'Scanned On', value: formattedDate, icon: Calendar },
            ]
              .filter((item) => Boolean(item.value))
              .map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-3 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-slate-500 w-36 shrink-0">
                      <Icon className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.label}</span>
                    </div>

                    <div className="flex-1 font-medium text-slate-900 truncate tabular-nums">
                      {item.value}
                    </div>

                    <button
                      onClick={() => handleCopy(item.value!, item.label)}
                      className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
                      title="Copy to clipboard"
                    >
                      {copiedKey === item.label ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                );
              })}
          </div>

          {/* Notes */}
          {card.notes && (
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
              <span className="font-semibold text-slate-700">Notes & Accreditation:</span>
              <p className="text-slate-600 leading-relaxed">{card.notes}</p>
            </div>
          )}
        </div>

        {/* Footer with Exports */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-[#E2E8F0] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadVCard(card)}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-semibold hover:bg-slate-100 flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Download className="w-4 h-4 text-[#1E40AF]" />
              <span>vCard File</span>
            </button>

            <button
              onClick={() => onExportCSV(card)}
              className="px-4 py-2 rounded-xl text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              style={{ backgroundColor: '#059669' }}
            >
              <span>Excel / CSV</span>
              <FileSpreadsheet className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
