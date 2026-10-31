import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  FileSpreadsheet,
  Download,
  Copy,
  Share2,
  X,
  ExternalLink,
  Phone,
  Mail,
  Building,
  User,
  CreditCard,
  MapPin,
  Globe,
  Sparkles,
  AlertCircle,
  FileText,
  SlidersHorizontal,
  BookmarkCheck
} from 'lucide-react';
import { ScannedCard, CardCategory } from '../types/card';
import { downloadVCard } from '../utils/ocrEngine';

interface InspectionSheetProps {
  card: Partial<ScannedCard>;
  onClose: () => void;
  onSave: (savedCard: ScannedCard) => void;
  onExportCSV: (card: ScannedCard) => void;
}

export const InspectionSheet: React.FC<InspectionSheetProps> = ({
  card,
  onClose,
  onSave,
  onExportCSV,
}) => {
  // Local editable state
  const [formData, setFormData] = useState<Partial<ScannedCard>>({
    name: card.name || '',
    title: card.title || '',
    company: card.company || '',
    department: card.department || '',
    phone: card.phone || '',
    email: card.email || '',
    website: card.website || '',
    address: card.address || '',
    category: card.category || 'business',
    cardNumber: card.cardNumber || '',
    expiryDate: card.expiryDate || '',
    notes: card.notes || '',
    rawText: card.rawText || '',
    confidence: card.confidence || 95,
  });

  const [activeTab, setActiveTab] = useState<'parsed' | 'raw'>('parsed');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleCopy = (text: string, fieldName: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 1800);
  };

  const handleSave = () => {
    const fullCard: ScannedCard = {
      id: card.id || `card_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: card.createdAt || new Date().toISOString(),
      name: formData.name || 'Untitled Contact',
      title: formData.title || '',
      company: formData.company || '',
      department: formData.department || '',
      phone: formData.phone || '',
      email: formData.email || '',
      website: formData.website || '',
      address: formData.address || '',
      category: formData.category || 'business',
      cardNumber: formData.cardNumber || '',
      expiryDate: formData.expiryDate || '',
      notes: formData.notes || '',
      rawText: formData.rawText || '',
      confidence: formData.confidence || 95,
      fieldConfidences: card.fieldConfidences,
      imageUri: card.imageUri,
      thumbnailColor: card.thumbnailColor || '#1E40AF',
    };

    onSave(fullCard);
    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 800);
  };

  const handleExportVCard = () => {
    downloadVCard(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm transition-all duration-300">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Tactile Bottom Sheet Container (Spec: 24px top radiuses, 32x4dp handle in #CBD5E1) */}
      <div
        className="relative z-10 w-full max-w-3xl max-h-[90vh] bg-white rounded-t-[24px] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300"
        style={{
          boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.2), 0 -8px 20px rgba(15, 23, 42, 0.08)',
        }}
      >
        {/* Grab Handle */}
        <div className="pt-3 pb-1 flex justify-center shrink-0">
          <div className="w-8 h-1 bg-[#CBD5E1] rounded-full" />
        </div>

        {/* Sheet Header */}
        <div className="px-6 py-3 border-b border-[#E2E8F0] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EAEDFF] text-[#1E40AF] flex items-center justify-center font-bold text-sm">
              M3
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A] leading-tight">
                Scanned Card Inspection
              </h3>
              <p className="text-xs text-[#64748B] flex items-center gap-1.5 mt-0.5">
                <span className="inline-block w-2 h-2 rounded-full bg-[#10B981]" />
                <span className="font-mono tabular-nums font-semibold text-[#047857]">
                  {formData.confidence}% OCR Accuracy
                </span>
                <span>·</span>
                <span>Double-check parsed fields below</span>
              </p>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
            aria-label="Close Inspection"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* View Toggle Tabs: Parsed vs Raw Text */}
        <div className="px-6 pt-3 pb-2 flex items-center justify-between gap-2 shrink-0 bg-slate-50 border-b border-[#E2E8F0]">
          <div className="inline-flex p-1 bg-[#EAEDFF] rounded-lg">
            <button
              onClick={() => setActiveTab('parsed')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'parsed'
                  ? 'bg-white text-[#1E40AF] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Key-Value Fields
            </button>
            <button
              onClick={() => setActiveTab('raw')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'raw'
                  ? 'bg-white text-[#1E40AF] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Raw OCR Buffer
            </button>
          </div>

          {/* Category Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">Format:</span>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as CardCategory })}
              className="text-xs font-semibold bg-white border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
            >
              <option value="business">Business Card</option>
              <option value="id_badge">Security ID Badge</option>
              <option value="membership">Executive / Club Card</option>
              <option value="medical">Medical Credential</option>
              <option value="finance">Corporate / Expense</option>
              <option value="other">General Document</option>
            </select>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 'parsed' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="relative">
                <label className="block text-xs font-medium text-[#64748B] mb-1">
                  Cardholder / Full Name
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Dr. Jane Doe"
                    className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm text-[#0F172A] font-medium focus:outline-none focus:border-2 focus:border-[#2563EB] focus:ring-0 transition-all pr-16"
                  />
                  <div className="absolute right-2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleCopy(formData.name || '', 'name')}
                      className="p-1 text-slate-400 hover:text-slate-700"
                      title="Copy Name"
                    >
                      {copiedField === 'name' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <span title="Confidence 99%"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /></span>
                  </div>
                </div>
              </div>

              {/* Title / Role */}
              <div className="relative">
                <label className="block text-xs font-medium text-[#64748B] mb-1">
                  Job Title / Professional Role
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Chief Technology Officer"
                    className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:border-2 focus:border-[#2563EB] pr-16"
                  />
                  <div className="absolute right-2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleCopy(formData.title || '', 'title')}
                      className="p-1 text-slate-400 hover:text-slate-700"
                    >
                      {copiedField === 'title' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <span title="Confidence 98%"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /></span>
                  </div>
                </div>
              </div>

              {/* Company / Org */}
              <div className="relative">
                <label className="block text-xs font-medium text-[#64748B] mb-1">
                  Company / Organization
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={formData.company || ''}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Horizon Dynamics"
                    className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:border-2 focus:border-[#2563EB] pr-16"
                  />
                  <div className="absolute right-2 flex items-center gap-1">
                    <span title="Confidence 97%"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /></span>
                  </div>
                </div>
              </div>

              {/* Department */}
              <div className="relative">
                <label className="block text-xs font-medium text-[#64748B] mb-1">
                  Department / Division
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={formData.department || ''}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="e.g. Research & Operations"
                    className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:border-2 focus:border-[#2563EB] pr-16"
                  />
                  <div className="absolute right-2 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="relative">
                <label className="block text-xs font-medium text-[#64748B] mb-1">
                  Phone Number
                </label>
                <div className="relative flex items-center">
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm text-[#0F172A] font-mono tabular-nums focus:outline-none focus:border-2 focus:border-[#2563EB] pr-20"
                  />
                  <div className="absolute right-2 flex items-center gap-1">
                    {formData.phone && (
                      <a
                        href={`tel:${formData.phone}`}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="Direct Call"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="relative">
                <label className="block text-xs font-medium text-[#64748B] mb-1">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@company.com"
                    className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:border-2 focus:border-[#2563EB] pr-20"
                  />
                  <div className="absolute right-2 flex items-center gap-1">
                    {formData.email && (
                      <a
                        href={`mailto:${formData.email}`}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="Send Email"
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  </div>
                </div>
              </div>

              {/* Website */}
              <div className="relative">
                <label className="block text-xs font-medium text-[#64748B] mb-1">
                  Website URL
                </label>
                <div className="relative flex items-center">
                  <input
                    type="url"
                    value={formData.website || ''}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://company.com"
                    className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:border-2 focus:border-[#2563EB] pr-20"
                  />
                  <div className="absolute right-2 flex items-center gap-1">
                    {formData.website && (
                      <a
                        href={formData.website}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="Open Website"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  </div>
                </div>
              </div>

              {/* Card / Badge Number & Expiry */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-[#64748B] mb-1">
                    Card / Badge ID
                  </label>
                  <input
                    type="text"
                    value={formData.cardNumber || ''}
                    onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                    placeholder="SEC-9021"
                    className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm text-[#0F172A] font-mono tabular-nums focus:outline-none focus:border-2 focus:border-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#64748B] mb-1">
                    Valid Thru / Expiry
                  </label>
                  <input
                    type="text"
                    value={formData.expiryDate || ''}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    placeholder="MM/YY"
                    className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm text-[#0F172A] font-mono tabular-nums focus:outline-none focus:border-2 focus:border-[#2563EB]"
                  />
                </div>
              </div>

              {/* Address (Full width) */}
              <div className="md:col-span-2 relative">
                <label className="block text-xs font-medium text-[#64748B] mb-1">
                  Physical Address
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={formData.address || ''}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Suite, Street, City, State, ZIP"
                    className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:border-2 focus:border-[#2563EB]"
                  />
                </div>
              </div>

              {/* Notes / Tagline */}
              <div className="md:col-span-2 relative">
                <label className="block text-xs font-medium text-[#64748B] mb-1">
                  Notes & Transcribed Slogans
                </label>
                <textarea
                  rows={2}
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional accreditation, room numbers, or notes..."
                  className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:border-2 focus:border-[#2563EB]"
                />
              </div>
            </div>
          ) : (
            // Raw OCR transcription buffer
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 flex items-center justify-between">
                <span>Direct unformatted OCR transcription stream extracted from image pixels:</span>
                <button
                  onClick={() => handleCopy(formData.rawText || '', 'rawText')}
                  className="px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-700 font-medium hover:bg-slate-100 flex items-center gap-1"
                >
                  {copiedField === 'rawText' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedField === 'rawText' ? 'Copied' : 'Copy All'}</span>
                </button>
              </div>
              <textarea
                rows={8}
                value={formData.rawText || ''}
                onChange={(e) => setFormData({ ...formData, rawText: e.target.value })}
                className="w-full font-mono text-xs leading-relaxed p-3.5 bg-slate-900 text-cyan-300 rounded-lg border border-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>
          )}
        </div>

        {/* Tactile Bottom Action Bar */}
        <div className="px-6 py-4 bg-slate-50 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Export triggers */}
          <div className="flex items-center gap-2">
            {/* Export vCard Button */}
            <button
              onClick={handleExportVCard}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              title="Download Contact Card (.vcf)"
            >
              <Download className="w-4 h-4 text-[#1E40AF]" />
              <span>vCard (.vcf)</span>
            </button>

            {/* Export Trigger: Fill #059669, text #FFFFFF with trailing icon indicating Excel/Sheets sync */}
            <button
              onClick={() => onExportCSV(formData as ScannedCard)}
              className="px-3.5 py-2.5 rounded-xl text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              style={{ backgroundColor: '#059669' }}
              title="Export to CSV / Excel spreadsheet"
            >
              <span>Excel / CSV</span>
              <FileSpreadsheet className="w-4 h-4" />
            </button>
          </div>

          {/* Primary Action Button (Save / Confirm: Fill #1E40AF, radius 12px, min touch target 48x48dp) */}
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="min-h-[48px] px-6 rounded-xl text-sm font-semibold text-white flex items-center gap-2 transition-all shadow-md active:scale-95"
              style={{ backgroundColor: savedSuccess ? '#059669' : '#1E40AF' }}
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Card Saved!</span>
                </>
              ) : (
                <>
                  <BookmarkCheck className="w-4 h-4" />
                  <span>Save to Card Library</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
