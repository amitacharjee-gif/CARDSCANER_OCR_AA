export type CardCategory = 'business' | 'id_badge' | 'membership' | 'finance' | 'medical' | 'other';

export interface FieldConfidences {
  name?: number;
  title?: number;
  company?: number;
  phone?: number;
  email?: number;
  website?: number;
  address?: number;
  cardNumber?: number;
  expiryDate?: number;
  department?: number;
  notes?: number;
  [key: string]: number | undefined;
}

export interface ScannedCard {
  id: string;
  createdAt: string;
  name: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  category: CardCategory;
  cardNumber?: string;
  expiryDate?: string;
  department?: string;
  notes?: string;
  rawText: string;
  confidence: number;
  fieldConfidences?: FieldConfidences;
  imageUri?: string;
  thumbnailColor?: string;
  favorite?: boolean;
}

export interface ScannerSettings {
  flash: boolean;
  lens: '0.5x' | '1x' | '2x';
  autoCapture: boolean;
  gridVisible: boolean;
  laserVisible: boolean;
  formatMode: 'all' | 'business' | 'id_badge' | 'membership' | 'finance';
}

export interface DetectionTelemetry {
  dpi: number;
  iso: number;
  ev: string;
  edgeConfidence: number;
  isAligned: boolean;
  autoCaptureCountdown: number | null;
  detectedType: string;
}
