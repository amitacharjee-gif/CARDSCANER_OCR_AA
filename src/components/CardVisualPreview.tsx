import React from 'react';
import { QrCode, Shield, Sparkles, Building2, User, Phone, Mail, Globe, MapPin } from 'lucide-react';
import { ScannedCard } from '../types/card';

interface CardVisualPreviewProps {
  card: Partial<ScannedCard>;
  aspectRatio?: 'landscape' | 'portrait';
  bgGradient?: string;
  accentColor?: string;
  chipVisible?: boolean;
  barcodeVisible?: boolean;
  showReticleMarkers?: boolean;
  className?: string;
}

export const CardVisualPreview: React.FC<CardVisualPreviewProps> = ({
  card,
  aspectRatio = 'landscape',
  bgGradient = 'from-[#0A1931] via-[#152642] to-[#1E3A8A]',
  accentColor = '#38BDF8',
  chipVisible = true,
  barcodeVisible = false,
  showReticleMarkers = false,
  className = '',
}) => {
  const isPortrait = aspectRatio === 'portrait' || card.category === 'id_badge';

  return (
    <div
      className={`relative select-none overflow-hidden rounded-xl bg-gradient-to-br ${bgGradient} text-white shadow-xl border border-white/10 transition-all duration-300 ${
        isPortrait ? 'w-full max-w-[280px] aspect-[1/1.55] p-5' : 'w-full max-w-[420px] aspect-[1.7/1] p-5'
      } ${className}`}
    >
      {/* Precision corner reticles for OCR bounding alignment */}
      {showReticleMarkers && (
        <>
          <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#06B6D4] pointer-events-none" />
          <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-[#06B6D4] pointer-events-none" />
          <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-[#06B6D4] pointer-events-none" />
          <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#06B6D4] pointer-events-none" />
        </>
      )}

      {/* Subtle security micro-pattern background */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '16px 16px',
        }}
      />

      {isPortrait ? (
        // Portrait ID Badge layout
        <div className="relative h-full flex flex-col justify-between z-10 text-center">
          {/* Badge Lanyard Clip slot */}
          <div className="mx-auto w-12 h-2.5 bg-white/20 rounded-full mb-2 border border-white/30" />

          {/* Org Header */}
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-white/90">
              <Shield className="w-3.5 h-3.5" style={{ color: accentColor }} />
              <span className="truncate max-w-[200px]">{card.company || 'ORGANIZATION ID'}</span>
            </div>
            {card.department && (
              <p className="text-[10px] text-white/60 tracking-tight mt-0.5 truncate">{card.department}</p>
            )}
          </div>

          {/* Avatar / Photo placeholder */}
          <div className="my-auto flex flex-col items-center">
            <div
              className="w-20 h-20 rounded-full border-2 p-1 flex items-center justify-center bg-white/10 backdrop-blur-sm shadow-inner"
              style={{ borderColor: accentColor }}
            >
              <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-white/80 overflow-hidden">
                <User className="w-10 h-10 text-white/60" />
              </div>
            </div>

            <div className="mt-3">
              <h3 className="text-base font-bold text-white tracking-tight">{card.name || 'Cardholder Name'}</h3>
              <p className="text-xs text-white/80 font-medium" style={{ color: accentColor }}>
                {card.title || 'Specialist Role'}
              </p>
            </div>
          </div>

          {/* Bottom Security Credentials & Barcode */}
          <div className="pt-2 border-t border-white/15 text-left">
            <div className="flex items-center justify-between text-[10px] text-white/70 tabular-nums">
              <span>ID: <strong className="text-white font-mono">{card.cardNumber || 'SEC-0982'}</strong></span>
              {card.expiryDate && <span>EXP: <strong className="text-white font-mono">{card.expiryDate}</strong></span>}
            </div>

            {/* Simulated barcode */}
            <div className="mt-2 h-7 bg-white/95 rounded px-2 py-1 flex items-center justify-between">
              <div className="flex items-center gap-0.5 w-full h-full overflow-hidden">
                {Array.from({ length: 34 }).map((_, i) => (
                  <span
                    key={i}
                    className="h-full bg-slate-900 inline-block"
                    style={{
                      width: i % 3 === 0 ? '3px' : i % 2 === 0 ? '1px' : '2px',
                      opacity: (i * 7) % 5 === 0 ? 0.3 : 1,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Landscape Business / Membership Card layout
        <div className="relative h-full flex flex-col justify-between z-10">
          {/* Top Row: Company & Chip/Badge */}
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2 rounded-sm"
                  style={{ backgroundColor: accentColor }}
                />
                <h4 className="text-xs font-bold tracking-wider uppercase text-white/90 truncate max-w-[220px]">
                  {card.company || 'CORPORATE NETWORK'}
                </h4>
              </div>
              {card.department && (
                <p className="text-[10px] text-white/60 font-light truncate max-w-[240px]">
                  {card.department}
                </p>
              )}
            </div>

            {/* Smart EMV Chip or Hologram */}
            {chipVisible ? (
              <div className="w-9 h-7 rounded border border-amber-300/40 bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-0.5 shadow-sm opacity-90 flex flex-col justify-between">
                <div className="border-b border-amber-800/40 h-2 w-full" />
                <div className="flex justify-between h-2">
                  <div className="w-2 border-r border-amber-800/40" />
                  <div className="w-2 border-l border-amber-800/40" />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-[10px] text-white/50 bg-white/10 px-2 py-0.5 rounded">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>VERIFIED</span>
              </div>
            )}
          </div>

          {/* Middle: Name & Title */}
          <div className="my-auto py-1">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
              {card.name || 'Full Name'}
            </h2>
            <p className="text-xs font-medium text-white/80" style={{ color: accentColor }}>
              {card.title || 'Executive Title'}
            </p>
          </div>

          {/* Bottom Row: Contact Grid & QR */}
          <div className="flex items-end justify-between gap-3 pt-2 border-t border-white/15">
            <div className="space-y-1 text-[11px] text-white/80 font-normal leading-tight min-w-0">
              {card.email && (
                <div className="flex items-center gap-1.5 truncate">
                  <Mail className="w-3 h-3 shrink-0 text-white/60" />
                  <span className="truncate">{card.email}</span>
                </div>
              )}
              {card.phone && (
                <div className="flex items-center gap-1.5 tabular-nums truncate">
                  <Phone className="w-3 h-3 shrink-0 text-white/60" />
                  <span className="truncate">{card.phone}</span>
                </div>
              )}
              {card.website && (
                <div className="flex items-center gap-1.5 truncate text-[10px] text-white/70">
                  <Globe className="w-3 h-3 shrink-0 text-white/60" />
                  <span className="truncate">{card.website.replace(/^https?:\/\//, '')}</span>
                </div>
              )}
            </div>

            {/* Quick QR code mark */}
            <div className="shrink-0 p-1 bg-white rounded-md text-slate-900 shadow-sm flex items-center justify-center">
              <QrCode className="w-8 h-8" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
