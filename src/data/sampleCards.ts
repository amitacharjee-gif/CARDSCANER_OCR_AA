import { ScannedCard } from '../types/card';

export interface SampleCardPreset {
  id: string;
  presetTitle: string;
  category: ScannedCard['category'];
  card: Omit<ScannedCard, 'id' | 'createdAt'>;
  aspectRatio: 'landscape' | 'portrait';
  bgGradient: string;
  accentColor: string;
  chipVisible?: boolean;
  barcodeVisible?: boolean;
  avatarSeed?: string;
}

export const SAMPLE_CARD_PRESETS: SampleCardPreset[] = [
  {
    id: 'preset_elena_quantum',
    presetTitle: 'Executive Business Card',
    category: 'business',
    aspectRatio: 'landscape',
    bgGradient: 'from-[#0A1931] via-[#152642] to-[#1E3A8A]',
    accentColor: '#38BDF8',
    chipVisible: true,
    card: {
      name: 'Dr. Elena Rostova',
      title: 'Chief Technology Officer & VP of Research',
      company: 'Horizon Quantum Dynamics Corp.',
      phone: '+1 (415) 890-4421',
      email: 'e.rostova@horizonquantum.io',
      website: 'https://horizonquantum.io',
      address: '400 Concourse Way, Suite 800, San Francisco, CA 94107',
      category: 'business',
      department: 'Advanced Photonics & Quantum Compute',
      cardNumber: 'HQD-CTO-8824',
      expiryDate: '12/2028',
      notes: 'Pioneering cryogenic photonic interconnects & scalable topological qubits.',
      rawText: `HORIZON QUANTUM DYNAMICS
DR. ELENA ROSTOVA
Chief Technology Officer & VP of Research
Advanced Photonics & Quantum Compute
e.rostova@horizonquantum.io
+1 (415) 890-4421
https://horizonquantum.io
400 Concourse Way, Suite 800, San Francisco, CA 94107
HQD-CTO-8824 · Valid Thru: 12/2028`,
      confidence: 98,
      fieldConfidences: {
        name: 99,
        title: 98,
        company: 99,
        phone: 97,
        email: 100,
        website: 98,
        address: 95,
        cardNumber: 96,
      },
      thumbnailColor: '#1E40AF',
    },
  },
  {
    id: 'preset_marcus_badge',
    presetTitle: 'Corporate Security ID Badge',
    category: 'id_badge',
    aspectRatio: 'portrait',
    bgGradient: 'from-[#0F172A] via-[#1E293B] to-[#334155]',
    accentColor: '#10B981',
    barcodeVisible: true,
    avatarSeed: 'marcus',
    card: {
      name: 'Marcus Vance',
      title: 'Principal Systems Architect',
      company: 'Sentinel BioSystems Global',
      phone: '+1 (206) 555-0199',
      email: 'm.vance@sentinelbio.com',
      website: 'https://sentinelbio.com',
      address: '2201 Innovation Blvd, Building 4, Seattle, WA 98121',
      category: 'id_badge',
      department: 'Autonomous Defense & Cybernetics',
      cardNumber: 'SEC-LVL4-99031',
      expiryDate: '09/2027',
      notes: 'SECURITY CLEARANCE LEVEL 4. Escort required in Sub-Level 2 cleanrooms.',
      rawText: `SENTINEL BIOSYSTEMS
SECURITY CLEARANCE LEVEL 4
MARCUS VANCE
Principal Systems Architect
Badge ID: SEC-LVL4-99031
Expires: 09/2027
Autonomous Defense & Cybernetics
Direct: +1 (206) 555-0199
m.vance@sentinelbio.com
Seattle, WA 98121`,
      confidence: 96,
      fieldConfidences: {
        name: 99,
        title: 96,
        company: 98,
        phone: 94,
        email: 99,
        cardNumber: 100,
        expiryDate: 97,
      },
      thumbnailColor: '#10B981',
    },
  },
  {
    id: 'preset_aria_apex',
    presetTitle: 'Executive Platinum Card',
    category: 'membership',
    aspectRatio: 'landscape',
    bgGradient: 'from-[#1C1917] via-[#292524] to-[#44403C]',
    accentColor: '#F59E0B',
    chipVisible: true,
    card: {
      name: 'Aria Chen',
      title: 'Founding Member #0482',
      company: 'Apex Aeroclub International',
      phone: '+1 (800) 492-APEX',
      email: 'aria.chen@apexclub.vip',
      website: 'https://apexclub.vip',
      address: 'Private Terminal 3, Zurich Airport (ZRH), Switzerland',
      category: 'membership',
      department: 'Transatlantic Flight Tier',
      cardNumber: '8820 4911 3042 9180',
      expiryDate: '11/2029',
      notes: 'Global Concierge 24/7 Access. Priority ramp & helicopter transfer enabled.',
      rawText: `APEX AEROCLUB INTERNATIONAL
ARIA CHEN
MEMBER #8820 4911 3042 9180
Valid Thru: 11/2029
Private Terminal 3, Zurich Airport (ZRH)
Concierge: aria.chen@apexclub.vip
Emergency: +1 (800) 492-APEX`,
      confidence: 99,
      fieldConfidences: {
        name: 99,
        cardNumber: 100,
        expiryDate: 98,
        company: 99,
        email: 98,
      },
      thumbnailColor: '#F59E0B',
    },
  },
  {
    id: 'preset_dr_julian',
    presetTitle: 'Medical Credential Badge',
    category: 'medical',
    aspectRatio: 'landscape',
    bgGradient: 'from-[#042F2E] via-[#0D544C] to-[#115E59]',
    accentColor: '#14B8A6',
    card: {
      name: 'Dr. Julian Ross, M.D.',
      title: 'Chief of Interventional Cardiology',
      company: 'Metro Health Academic Medical Center',
      phone: '+1 (617) 555-8392',
      email: 'j.ross@metrohealth.org',
      website: 'https://metrohealth.org/cardiology',
      address: '750 Harrison Ave, Boston, MA 02118',
      category: 'medical',
      department: 'Cardiovascular Surgery & Cath Lab',
      cardNumber: 'MA-MED-449102',
      expiryDate: '06/2028',
      notes: 'Board Certified FACC / FSCAI. Attending Physician License active.',
      rawText: `METRO HEALTH ACADEMIC MEDICAL CENTER
DR. JULIAN ROSS, M.D., FACC
Chief of Interventional Cardiology
Cardiovascular Surgery & Cath Lab
License: MA-MED-449102
Pager/Direct: +1 (617) 555-8392
Email: j.ross@metrohealth.org
750 Harrison Ave, Boston, MA 02118`,
      confidence: 97,
      fieldConfidences: {
        name: 100,
        title: 98,
        company: 97,
        phone: 99,
        email: 99,
        cardNumber: 95,
      },
      thumbnailColor: '#00687A',
    },
  },
  {
    id: 'preset_kai_studio',
    presetTitle: 'Architectural Studio Card',
    category: 'business',
    aspectRatio: 'landscape',
    bgGradient: 'from-[#18181B] via-[#27272A] to-[#3F3F46]',
    accentColor: '#A1A1AA',
    card: {
      name: 'Kai Tanaka',
      title: 'Principal Design Architect',
      company: 'KROMA Spatial Atelier Tokyo',
      phone: '+81 3 5410 8820',
      email: 'kai@kroma-atelier.jp',
      website: 'https://kroma-atelier.jp',
      address: '5-7-2 Minami-Aoyama, Minato-ku, Tokyo 107-0062',
      category: 'business',
      department: 'Monolithic Timber & Sustainable Facades',
      cardNumber: 'JIA-REG-9018',
      notes: 'Recipient of Pritzker Nominee Fellowship 2025.',
      rawText: `KROMA SPATIAL ATELIER
KAI TANAKA
Principal Design Architect
5-7-2 Minami-Aoyama, Minato-ku, Tokyo 107-0062
kai@kroma-atelier.jp
+81 3 5410 8820
kroma-atelier.jp`,
      confidence: 95,
      fieldConfidences: {
        name: 98,
        title: 97,
        company: 95,
        phone: 96,
        email: 99,
        website: 95,
      },
      thumbnailColor: '#3755C3',
    },
  },
];
