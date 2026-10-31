---
name: CardScan Design System
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#444653'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#757684'
  outline-variant: '#c4c5d5'
  surface-tint: '#3755c3'
  primary: '#00288e'
  on-primary: '#ffffff'
  primary-container: '#1e40af'
  on-primary-container: '#a8b8ff'
  inverse-primary: '#b8c4ff'
  secondary: '#00687a'
  on-secondary: '#ffffff'
  secondary-container: '#57dffe'
  on-secondary-container: '#006172'
  tertiary: '#003d27'
  on-tertiary: '#ffffff'
  tertiary-container: '#00563a'
  on-tertiary-container: '#3fd298'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b8c4ff'
  on-primary-fixed: '#001453'
  on-primary-fixed-variant: '#173bab'
  secondary-fixed: '#acedff'
  secondary-fixed-dim: '#4cd7f6'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#004e5c'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 57px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.25px
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: 0px
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: 0px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: 0px
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: 0px
  title-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0px
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: 0.15px
  title-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.1px
  body-lg:
    fontFamily: Roboto Flex
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0.25px
  body-md:
    fontFamily: Roboto Flex
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.25px
  body-sm:
    fontFamily: Roboto Flex
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.4px
  label-lg:
    fontFamily: Roboto Flex
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.1px
  label-md:
    fontFamily: Roboto Flex
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.5px
  label-sm:
    fontFamily: Roboto Flex
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.5px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system expresses a high-velocity, industrial-grade productivity instrument engineered for Android. It blends the structural rigors of Material Design 3 (M3) with the precision of technical optical instrumentation. The aesthetic is analytical, focused, and frictionless—eliminating superfluous ornamentation in favor of immediate scanning clarity, ergonomic thumb-zone controls, and instant data legibility.

### Core Principles
- **Optical Precision:** Viewfinder reticles, laser-guided framing, and HUD-inspired metadata provide confident feedback during OCR/barcode capture workflows.
- **Tonal Structure (Material 3 Expressive):** Clean separation of content surfaces through subtle slate tonal shifts and deliberate hairline borders rather than heavy ambient occlusion.
- **Immediate Data Feedback:** High-contrast confirmation states with unambiguous semantic signals (Emerald scan locks, Forest Green export confirmations).

## Colors

The palette balances authoritative enterprise depth with high-visibility technical signals.

### Roles & Semantic Mapping
- **Primary (`#1E40AF`, `#2563EB`):** Sapphire/Deep Tech Indigo. Governs primary app bars, high-prominence FABs, key action buttons, and active bottom-navigation states.
- **Secondary / Accent (`#06B6D4`):** Precision Cyan. Dedicated to active camera viewfinder HUD lines, optical bounding boxes, focus reticles, and real-time detection telemetry.
- **Status & Feedback:**
  - **Success / OCR Lock (`#10B981`):** Instant verification chip indicators, successful parse highlights, and real-time barcode lock bounding boxes.
  - **Export / Pipeline Confirmation (`#059669`):** Direct Excel/CSV sync triggers, export confirmation toasts, and sync status stamps.
  - **Warning (`#F59E0B`) & Critical (`#EF4444`):** Low-light warnings, blurred-frame alerts, and unreadable field flags.
- **Surfaces & Neutrals:**
  - **Canvas Background (`#F8FAFC`):** Slate 50 tint provides eye comfort under high device brightness.
  - **Surface Container (`#FFFFFF`):** High-clarity cards, sheets, and bottom sheets.
  - **Outlines & Dividers (`#E2E8F0`):** Hairline precision borders defining structural boundaries.
  - **Typography (`#0F172A` on light, `#64748B` for secondary captions):** Deep slate providing maximum optical contrast for tabular and numeric scan data.

## Typography

The type system couples **Inter** for crisp, structural headlines with **Roboto Flex** for mechanical, legible Android-native body and label copy.

- **Numerics & Scanned Output:** Body, labels, and table cells utilize tabular numeric spacing (`font-variant-numeric: tabular-nums`) to ensure card numbers, dates, barcodes, and amounts align precisely across vertical scan rows.
- **Scalability:** Large displays shrink fluidly down to compact phone viewports; key title and headline variants retain strict line heights to avoid text jumps during real-time optical scanning recognition passes.

## Layout & Spacing

Adhering strictly to Android Material Design 3 layout paradigms, this design system operates on an 8dp (0.5rem) primary spatial grid with a 4dp (0.25rem) micro-grid for compact HUD readouts, chip insets, and icon arrangements.

- **Mobile Phone Grid (<600dp):** 4 fluid columns, 16dp outer margins, 16dp gutters. Bottom utility bar anchored within the ergonomic primary thumb zone (bottom 35% of the viewport).
- **Foldables / Tablets (600dp–840dp):** 8 fluid columns, 24dp outer margins, 16dp gutters. Viewfinder locks to the left pane, split-pane OCR inspection table docks dynamically on the right.
- **Desktop / Large Displays (>840dp):** 12 fluid columns, 32dp outer margins, 24dp gutters with a max-width container cap of 1200dp for data grids and settings.

## Elevation & Depth

This system avoids muddy dropshadows, relying instead on **M3 Tonal Surface Elevation** reinforced with crisp 1px borders (`#E2E8F0`):

- **Level 0 (Flat Canvas):** `#F8FAFC`. Zero elevation. Backing for lists, scan histories, and settings.
- **Level 1 (Resting Cards & Tiles):** `#FFFFFF` paired with an explicit `1px solid #E2E8F0` hairline border and an ambient diffusion: `box-shadow: 0 1px 3px 0 rgba(15, 23, 42, 0.05)`.
- **Level 2 (Active OCR Scanning Cards & Hover States):** `box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05)`.
- **Level 3 (Modal Bottom Sheets & Navigation Bar):** `#FFFFFF` with `box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 -4px 12px rgba(15, 23, 42, 0.03)`.
- **Level 4 (Camera HUD Overlays):** Frosted dark overlay (`rgba(15, 23, 42, 0.75)`) with backdrop blur (`blur(12px)`) positioned over camera feed, cutting direct light from the camera hardware.

## Shapes

The geometric signature uses **Rounded Level 2** (0.5rem standard radius), tuned for Android 14+ UI mechanics:

- **Cards, Input Containers, and Surface Panels:** `0.5rem` (8px).
- **Action Buttons & Modals:** `0.75rem` (12px).
- **Bottom Sheets (M3 Tactile Rounded Sheets):** Top corners clipped to `1.5rem` (24px) for prominent grab-and-slide interaction; bottom corners flat (`0px`).
- **Chips & Badges:** `9999px` (Pill shape) to contrast sharply against geometric rectangular preview frames.
- **Viewfinder Reticle:** 4px stroke with 8px radius corner accents framing the active camera detection zone.

## Components

### Buttons
- **Primary Action (Scan / Confirm):** Fill `#1E40AF`, text `#FFFFFF`, radius 12px, minimum touch target 48x48dp. Press state cascades to `#1E3A8A`.
- **Secondary (HUD / In-Camera Flash & Lens Toggle):** Circular 44dp target, translucent slate fill `rgba(15, 23, 42, 0.6)` with backdrop blur and `#06B6D4` icons.
- **Export Trigger:** Fill `#059669`, text `#FFFFFF`, with trailing icon indicating Excel/Sheets sync.

### Chips & Status Badges
- **OCR Lock Chip:** Background `rgba(16, 185, 129, 0.12)`, text `#047857`, 1px border `#10B981`. Includes a pulsing 6px emerald dot indicator for active edge-detection.
- **Format Filter Chips:** Outlined with `#E2E8F0`, background `#FFFFFF`, text `#0F172A`. Active state flips to `#1E40AF` background with white text.

### Viewfinder HUD (Camera Component)
- Real-time card frame boundary drawn with 2px dashed Cyan (`#06B6D4`) lines.
- Four solid 16px corner brackets highlighting detected business cards, receipts, or barcodes.
- Top-anchored metadata pill showing current exposure, DPI estimate, and auto-capture countdown.

### Input Fields
- Filled variant with white surface, 1px `#E2E8F0` border, resting label in Slate 500 (`#64748B`), and text in Slate 900 (`#0F172A`).
- Active focus state transitions border to 2px `#2563EB` with zero layout shift.
- Scanned text fields show an inline "confidence level" icon right-aligned inside the field container.

### Lists & Scanned History Cards
- Card surfaces `#FFFFFF` with a 1px `#E2E8F0` outline.
- Left-aligned thumbnail preview with an overlaid format pill (e.g., "vCard", "Barcode", "Invoice").
- Leading title in Inter SemiBold, trailing timestamp in Slate 400.
- Swipe gestures reveal emerald export action (left swipe) or crimson trash action (right swipe).

### Tactile Bottom Sheets
- Anchored to bottom screen edges with 24px top radiuses and a central grab handle (32x4dp in `#CBD5E1`).
- Used for scanned card verification, batch export selection, and OCR raw text vs parsed key-value pairing comparisons.