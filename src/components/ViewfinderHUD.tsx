import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Camera,
  Zap,
  ZapOff,
  Maximize2,
  Grid,
  Radio,
  Sparkles,
  Upload,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Layers,
  ChevronDown,
  Info
} from 'lucide-react';
import { ScannedCard, ScannerSettings, DetectionTelemetry } from '../types/card';
import { SAMPLE_CARD_PRESETS, SampleCardPreset } from '../data/sampleCards';
import { CardVisualPreview } from './CardVisualPreview';

interface ViewfinderHUDProps {
  onCapture: (cardData: Partial<ScannedCard>, imageBase64?: string) => void;
  isScanning: boolean;
}

export const ViewfinderHUD: React.FC<ViewfinderHUDProps> = ({ onCapture, isScanning }) => {
  // Camera state
  const [useLiveCamera, setUseLiveCamera] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Active preset card for simulation / testing
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);
  const activePreset = SAMPLE_CARD_PRESETS[selectedPresetIndex];

  // Scanner settings
  const [settings, setSettings] = useState<ScannerSettings>({
    flash: false,
    lens: '1x',
    autoCapture: false,
    gridVisible: true,
    laserVisible: true,
    formatMode: 'all',
  });

  // Telemetry state
  const [telemetry, setTelemetry] = useState<DetectionTelemetry>({
    dpi: 320,
    iso: 160,
    ev: '+0.2',
    edgeConfidence: 98.4,
    isAligned: true,
    autoCaptureCountdown: null,
    detectedType: 'BUSINESS CARD',
  });

  // Alignment and locked state
  const [edgeLocked, setEdgeLocked] = useState<boolean>(true);
  const [countdown, setCountdown] = useState<number | null>(null);
  const cardContainerRef = useRef<HTMLDivElement | null>(null);

  // Initialize camera if requested
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported on this browser/environment');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setUseLiveCamera(true);
      }
    } catch (err: any) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraError(err.message || 'Camera permission denied. Using optical card emulator.');
      setUseLiveCamera(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setUseLiveCamera(false);
  };

  // Telemetry fluctuation to simulate real sensor micro-movements
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry((prev) => {
        const jitter = (Math.random() - 0.5) * 0.4;
        const confidence = Math.min(99.6, Math.max(94.2, +(prev.edgeConfidence + jitter).toFixed(1)));
        return {
          ...prev,
          dpi: 320 + Math.floor((Math.random() - 0.5) * 8),
          iso: 150 + Math.floor(Math.random() * 20),
          edgeConfidence: confidence,
        };
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // Handle Auto-capture countdown when enabled
  useEffect(() => {
    if (!settings.autoCapture || !edgeLocked || isScanning) {
      setCountdown(null);
      return;
    }

    setCountdown(3);
    const timer3 = setTimeout(() => setCountdown(2), 700);
    const timer2 = setTimeout(() => setCountdown(1), 1400);
    const timer1 = setTimeout(() => {
      setCountdown(null);
      handleTriggerCapture();
    }, 2100);

    return () => {
      clearTimeout(timer3);
      clearTimeout(timer2);
      clearTimeout(timer1);
    };
  }, [settings.autoCapture, edgeLocked, isScanning, selectedPresetIndex]);

  // Capture trigger
  const handleTriggerCapture = useCallback(async () => {
    if (isScanning) return;

    // If using live camera feed, grab frame from video element
    if (useLiveCamera && videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        onCapture(
          {
            rawText: `CARD SCAN AT ${new Date().toLocaleTimeString()}\nCaptured via camera viewfinder`,
            confidence: 96,
          },
          dataUrl
        );
        return;
      }
    }

    // Default: use the selected sample card preset with visual snapshot
    const preset = SAMPLE_CARD_PRESETS[selectedPresetIndex];
    onCapture(preset.card);
  }, [useLiveCamera, isScanning, selectedPresetIndex, onCapture]);

  // Handle direct file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      onCapture(
        {
          name: 'Scanned Card Holder',
          company: 'Analyzed Document',
          rawText: `Scanned File: ${file.name}\nSize: ${(file.size / 1024).toFixed(1)} KB`,
        },
        base64
      );
    };
    reader.readAsDataURL(file);
  };

  // Toggle lens magnification
  const cycleLens = () => {
    setSettings((prev) => ({
      ...prev,
      lens: prev.lens === '0.5x' ? '1x' : prev.lens === '1x' ? '2x' : '0.5x',
    }));
  };

  return (
    <div className="relative flex flex-col items-center justify-between min-h-[580px] w-full max-w-4xl mx-auto select-none bg-[#0B1120] text-white rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
      {/* ----------------- TOP METADATA HUD BAR ----------------- */}
      <div className="w-full z-30 px-4 py-3 bg-gradient-to-b from-slate-950/90 via-slate-950/60 to-transparent flex items-center justify-between gap-2">
        {/* Exposure & Telemetry Pill */}
        <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/60 text-xs">
          <span className="font-mono text-cyan-400 tabular-nums">EV {telemetry.ev}</span>
          <span className="text-slate-500">·</span>
          <span className="font-mono text-slate-300 tabular-nums">ISO {telemetry.iso}</span>
          <span className="text-slate-500">·</span>
          <span className="font-mono text-emerald-400 tabular-nums">{telemetry.dpi} DPI</span>
        </div>

        {/* OCR Edge Lock Status Chip (Specification compliant) */}
        <div
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium tracking-tight transition-all"
          style={{
            backgroundColor: edgeLocked ? 'rgba(16, 185, 129, 0.16)' : 'rgba(245, 158, 11, 0.16)',
            color: edgeLocked ? '#10B981' : '#F59E0B',
            border: `1px solid ${edgeLocked ? '#10B981' : '#F59E0B'}`,
          }}
        >
          {/* Pulsing 6px dot indicator */}
          <span
            className="w-1.5 h-1.5 rounded-full inline-block animate-pulse"
            style={{ backgroundColor: edgeLocked ? '#10B981' : '#F59E0B' }}
          />
          <span className="tabular-nums font-mono">
            {edgeLocked ? `LOCK ${telemetry.edgeConfidence}%` : 'ALIGNING...'}
          </span>
        </div>

        {/* Quick Format Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/60 text-xs text-slate-300">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span className="truncate max-w-[110px] font-medium">{activePreset.presetTitle}</span>
        </div>
      </div>

      {/* ----------------- CAMERA / VIEWFINDER STAGE ----------------- */}
      <div className="relative w-full flex-1 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
        {/* Background frosted dark overlay */}
        <div className="absolute inset-0 bg-[#070D18]" />

        {/* Live Camera Video stream */}
        {useLiveCamera && (
          <video
            ref={videoRef}
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover z-0"
            style={{
              transform: settings.lens === '2x' ? 'scale(1.5)' : settings.lens === '0.5x' ? 'scale(0.85)' : 'scale(1)',
              transition: 'transform 0.3s ease',
            }}
          />
        )}

        {/* Ambient grid lines (3x3 Rule-of-thirds) */}
        {settings.gridVisible && (
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none z-10 opacity-20">
            <div className="border-r border-b border-cyan-400" />
            <div className="border-r border-b border-cyan-400" />
            <div className="border-b border-cyan-400" />
            <div className="border-r border-b border-cyan-400" />
            <div className="border-r border-b border-cyan-400" />
            <div className="border-b border-cyan-400" />
            <div className="border-r border-cyan-400" />
            <div className="border-r border-cyan-400" />
            <div />
          </div>
        )}

        {/* Central Card Container with Viewfinder HUD */}
        <div
          ref={cardContainerRef}
          className={`relative z-20 transition-transform duration-300 flex items-center justify-center p-4 sm:p-6 ${
            settings.lens === '2x' ? 'scale-110' : settings.lens === '0.5x' ? 'scale-90' : 'scale-100'
          }`}
        >
          {/* Viewfinder HUD Framing:
              - Real-time card frame boundary drawn with 2px dashed Cyan (#06B6D4) lines
              - Four solid 16px corner brackets highlighting detected card (4px stroke, 8px radius) */}
          <div className="absolute -inset-2.5 sm:-inset-4 pointer-events-none z-30">
            {/* Dashed cyan bounding box */}
            <div className="w-full h-full border-2 border-dashed border-[#06B6D4]/80 rounded-2xl shadow-[0_0_15px_rgba(6,182,212,0.25)]" />

            {/* Top-Left Corner Bracket (16px solid corner with 4px stroke) */}
            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-[#06B6D4] rounded-tl-lg" />
            {/* Top-Right Corner Bracket */}
            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-[#06B6D4] rounded-tr-lg" />
            {/* Bottom-Left Corner Bracket */}
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-[#06B6D4] rounded-bl-lg" />
            {/* Bottom-Right Corner Bracket */}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-[#06B6D4] rounded-br-lg" />

            {/* Active Auto-Capture Countdown Indicator */}
            {countdown !== null && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs rounded-2xl">
                <div className="w-20 h-20 rounded-full border-4 border-cyan-400 flex items-center justify-center text-3xl font-extrabold text-white animate-pulse">
                  {countdown}
                </div>
              </div>
            )}
          </div>

          {/* Laser-Guided Scanning Line Sweeping Vertically */}
          {settings.laserVisible && (
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#06B6D4] to-transparent shadow-[0_0_12px_#06B6D4] animate-laser-sweep z-30 pointer-events-none" />
          )}

          {/* If not live camera, render the interactive high-fidelity CardVisualPreview */}
          {!useLiveCamera ? (
            <CardVisualPreview
              card={activePreset.card}
              aspectRatio={activePreset.aspectRatio}
              bgGradient={activePreset.bgGradient}
              accentColor={activePreset.accentColor}
              chipVisible={activePreset.chipVisible}
              barcodeVisible={activePreset.barcodeVisible}
              showReticleMarkers={true}
              className="transform hover:scale-[1.01] transition-transform duration-200"
            />
          ) : (
            // In live camera mode, display a transparent target alignment zone
            <div className="w-[360px] aspect-[1.65/1] rounded-xl border border-white/20 bg-cyan-950/10 backdrop-blur-xs flex items-center justify-center text-center p-4">
              <span className="text-xs text-cyan-300 font-mono tracking-wide bg-slate-950/80 px-3 py-1 rounded-full border border-cyan-500/30">
                ALIGN CARD EDGES TO VIEWFINDER
              </span>
            </div>
          )}
        </div>

        {/* In-viewfinder Flash/Torch light illumination effect */}
        {settings.flash && (
          <div className="absolute inset-0 bg-white/10 pointer-events-none z-15 backdrop-brightness-125" />
        )}
      </div>

      {/* ----------------- PRESET SELECTOR CHIPS BAR ----------------- */}
      <div className="w-full z-20 px-4 py-2 bg-slate-950/70 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider shrink-0 pl-1">
          Preset:
        </span>
        {SAMPLE_CARD_PRESETS.map((preset, idx) => {
          const isActive = selectedPresetIndex === idx && !useLiveCamera;
          return (
            <button
              key={preset.id}
              onClick={() => {
                if (useLiveCamera) stopCamera();
                setSelectedPresetIndex(idx);
              }}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#1E40AF] text-white shadow-sm ring-1 ring-cyan-400/40'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: preset.accentColor }}
              />
              {preset.presetTitle}
            </button>
          );
        })}
      </div>

      {/* ----------------- BOTTOM ERGONOMIC CONTROLS BAR ----------------- */}
      {/* Anchored within the ergonomic thumb zone (bottom 35% of the viewport) */}
      <div className="w-full z-30 px-6 py-4 bg-slate-950/95 border-t border-slate-800 flex items-center justify-between gap-4">
        {/* Left Side: Camera HUD Toggles (Circular 44dp targets with #06B6D4 icons) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Flash / Light toggle */}
          <button
            onClick={() => setSettings((s) => ({ ...s, flash: !s.flash }))}
            className={`min-h-[44px] min-w-[44px] rounded-full flex items-center justify-center transition-all ${
              settings.flash
                ? 'bg-cyan-500/20 text-[#06B6D4] border border-[#06B6D4]'
                : 'bg-slate-900/90 text-slate-400 hover:text-cyan-400 border border-slate-700'
            }`}
            title="Toggle Flashlight / Fill Light"
            aria-label="Toggle Flashlight"
          >
            {settings.flash ? <Zap className="w-5 h-5 fill-cyan-400" /> : <ZapOff className="w-5 h-5" />}
          </button>

          {/* Lens Zoom Switcher (0.5x, 1x, 2x) */}
          <button
            onClick={cycleLens}
            className="min-h-[44px] min-w-[44px] rounded-full bg-slate-900/90 text-[#06B6D4] hover:bg-slate-800 border border-slate-700 flex items-center justify-center font-mono text-xs font-bold tabular-nums"
            title="Switch Optical Zoom"
            aria-label="Switch Optical Zoom"
          >
            {settings.lens}
          </button>

          {/* Grid lines toggle */}
          <button
            onClick={() => setSettings((s) => ({ ...s, gridVisible: !s.gridVisible }))}
            className={`min-h-[44px] min-w-[44px] rounded-full hidden sm:flex items-center justify-center transition-all ${
              settings.gridVisible
                ? 'bg-cyan-500/20 text-[#06B6D4] border border-[#06B6D4]'
                : 'bg-slate-900/90 text-slate-400 hover:text-cyan-400 border border-slate-700'
            }`}
            title="Toggle Framing Grid"
            aria-label="Toggle Framing Grid"
          >
            <Grid className="w-4 h-4" />
          </button>
        </div>

        {/* Center: High-Prominence Shutter / Capture Button */}
        {/* Specification: Fill #1E40AF, text #FFFFFF, min touch target 48x48dp, press state cascades to #1E3A8A */}
        <div className="flex flex-col items-center">
          <button
            onClick={handleTriggerCapture}
            disabled={isScanning}
            className="group relative min-w-[64px] min-h-[64px] sm:w-18 sm:h-18 rounded-full flex items-center justify-center transition-all duration-150 active:scale-95 disabled:opacity-50"
            aria-label="Capture Card"
          >
            {/* Outer tactile targeting ring */}
            <span className="absolute inset-0 rounded-full border-2 border-cyan-400/80 group-hover:border-cyan-300 transition-colors" />

            {/* Inner primary shutter disc */}
            <span
              className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors"
              style={{ backgroundColor: '#1E40AF' }}
            >
              {isScanning ? (
                <RefreshCw className="w-6 h-6 text-white animate-spin" />
              ) : (
                <Camera className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              )}
            </span>
          </button>

          <span className="text-[11px] font-medium text-slate-400 mt-1 tabular-nums">
            {isScanning ? 'Extracting OCR...' : 'Tap to Scan'}
          </span>
        </div>

        {/* Right Side: Camera Live vs Preset Switcher & Upload */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Webcam Toggle */}
          <button
            onClick={useLiveCamera ? stopCamera : startCamera}
            className={`min-h-[44px] px-3 rounded-full flex items-center gap-1.5 text-xs font-semibold transition-all ${
              useLiveCamera
                ? 'bg-emerald-500 text-slate-950 shadow-md ring-2 ring-emerald-400'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
            }`}
            title="Use Device Camera"
          >
            <Radio className={`w-4 h-4 ${useLiveCamera ? 'text-slate-950 animate-pulse' : 'text-cyan-400'}`} />
            <span className="hidden sm:inline">{useLiveCamera ? 'Live Cam' : 'Webcam'}</span>
          </button>

          {/* Upload photo trigger */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="min-h-[44px] min-w-[44px] rounded-full bg-slate-900/90 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 border border-slate-700 flex items-center justify-center transition-colors"
            title="Upload Card Photo"
            aria-label="Upload Card Photo"
          >
            <Upload className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
