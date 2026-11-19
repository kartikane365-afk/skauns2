# Project: SKAUNS Gen-Z Brutalist E-Commerce Storefront Production Elevation

## Architecture
The SKAUNS storefront is a high-performance React 19 + TypeScript + Vite + Tailwind CSS v4 single-page application.
- **Data Flow**:
  - `src/data/products.ts` provides immutable product catalog data for 31 units (12 Boxy Tees, 15 Thermal Waffles, 4 Fleece Hoodies) at uniform ₹1,199.
  - `src/context/CartContext.tsx` handles cart state, discount ciphers (`VOID10`, `SYNDICATE`), shipping thresholds, and local storage persistence.
  - `src/utils/audio.ts` provides procedural Web Audio API brutalist acoustic feedback without external asset dependencies.
  - Modular UI components in `src/components/` isolate UI concerns and interface contracts.
  - Pages in `src/pages/` orchestrate sections. `src/pages/Home.tsx` is the primary narrative storefront scroll.

## Code Layout
- `src/index.css`: Global styles, Google Fonts imports (Syne, Bebas, Anton, Space Mono), CSS custom properties, brutalist utilities.
- `src/utils/audio.ts`: Procedural cyber-armor sound effects (click, shutter, cipher, drone).
- `src/components/`:
  - `DropRadar.tsx`: Utility section — Drops countdown timer & vault allocation gauge.
  - `FabricDossier.tsx`: Editorial section — 240/360/480 GSM fabric density engineering matrix.
  - `LookbookGallery.tsx`: Editorial section — SS26 Campaign runway lookbook and full-screen lightbox modal.
  - `FitAdvisor.tsx`: Utility section — Interactive sizing matrix with CM/IN toggle and drape calculator.
  - `SyndicateNewsletter.tsx`: Utility section — Encrypted member cipher terminal with VOID10 promo integration.
  - `Navbar.tsx` & `Footer.tsx`: Navigation header and footer with updated links to editorial/utility sections.
- `src/pages/`:
  - `Home.tsx`: Complete narrative assembly preserving all 3 product tracks and section banners.
  - `About.tsx`: Lore alignment for 28 architectural silhouettes.
- Workspaces:
  - Primary Dev Workspace: `C:\Users\karti\OneDrive\Desktop\New folder (2)`
  - Mirror Workspace: `C:\Users\karti\Desktop\New folder (2)`

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Space Mono Import & Cyber-Armor Font System | Load Space Mono in `src/index.css` and configure `--font-mono` token | M1 | Survey (Explorer 2) |
| 2 | Raw Bone & Pitch-Black Brutalist Theme Polish | Refine color tokens (`#f4f4f0`, `#0a0a0a`), wireframe strokes, corner ticks | M1 | R2 / Survey (Explorer 2) |
| 3 | Procedural Brutalist Web Audio Synthesizer | Zero-asset browser audio engine for tactile UI clicks, shutter, cipher | M1 | R2 / Survey (Explorer 2) |
| 4 | SS26 Campaign Lookbook & Lightbox Modal | Curated editorial runway gallery using `public/direct/` images with modal | M2 | R1 / Survey (Explorer 2 & 3) |
| 5 | Fabric & GSM Engineering Dossier | 240 vs 360 vs 480 GSM density breakdown, lab specs, macro weave imagery | M2 | R1 / Survey (Explorer 2 & 3) |
| 6 | Brand Lore & Architectural Doctrine | Expanded syndicate manifesto and garment philosophy section | M2 | R1 / Survey (Explorer 2 & 3) |
| 7 | Drops Radar & Vault Countdown Timer | Live ticker to SS26 Drop 02, allocation percentage, priority RSVP modal | M3 | R1 / Survey (Explorer 2 & 3) |
| 8 | Interactive Fit Advisor & Sizing Matrix | Sizing calculator, CM ⟷ IN toggle, category specs, model reference specs | M3 | R1 / Survey (Explorer 2 & 3) |
| 9 | Syndicate Cipher Newsletter Terminal | Brutalist email cipher generator unlocking VOID10 discount with 1-click copy | M3 | R1 / Survey (Explorer 2 & 3) |
| 10 | Navigation & Footer Linkage Updates | Header and footer links to Lookbook & Fit Advisor, resolving broken routes | M3 | R2 / Survey (Explorer 2) |
| 11 | Home Page Storefront Assembly | Seamlessly sequence editorial & utility sections with 3 catalog carousels | M4 | R1, R2 / Acceptance Criteria |
| 12 | 28-Product Catalog & Price Integrity | Verify all 28 units intact at ₹1,199 across Tees (12), Waffles (12), Hoodies (4) | M4 | Acceptance Criteria |
| 13 | Primary ↔ Mirror Workspace Synchronization | Synchronize all code, assets, configs from OneDrive to Desktop mirror | M5 | R3 / Acceptance Criteria |
| 14 | Zero-Tolerance Quality Gates & Integrity Audit | oxlint (0 errors), tsc -b && vite build (0 errors), Forensic Auditor CLEAN | M5 | R3 / Acceptance Criteria |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Visual Foundation, Typography & Audio | `src/index.css`, `src/utils/audio.ts` | none | DONE |
| M2 | Editorial Sections Suite | `LookbookGallery.tsx`, `FabricDossier.tsx`, `BrandLore.tsx` | M1 | DONE |
| M3 | Utility Sections Suite & Nav Updates | `DropRadar.tsx`, `FitAdvisor.tsx`, `SyndicateNewsletter.tsx`, `Navbar.tsx`, `Footer.tsx` | M1 | DONE |
| M4 | Storefront Narrative Assembly & Catalog Integrity | `src/pages/Home.tsx`, `src/pages/About.tsx`, 28-product audit | M2, M3 | DONE |
| M5 | Mirror Synchronization, Zero-Error Verification & Audit | Workspace mirror sync, `oxlint`, `tsc -b && vite build`, Forensic Audit | M4 | DONE |

## Interface Contracts
### `src/utils/audio.ts`
- `playTactileClick(): void` — procedural micro-click (15ms frequency drop)
- `playShutterClick(): void` — metallic mechanical shutter for lookbook
- `playCipherBeep(): void` — digital authorization tone for coupon unlock
- `toggleSound(): boolean` — mute/unmute audio engine with state return
- `isSoundEnabled(): boolean` — query current mute state

### `src/components/LookbookGallery.tsx`
- Props: `onProductSelect?: (productId: string) => void`
- Exports: `default LookbookGallery`
- Dependencies: images in `/direct/`, `audio.ts`

### `src/components/FabricDossier.tsx`
- Props: `onCategoryJump?: (category: 'tees' | 'waffles' | 'hoodies') => void`
- Exports: `default FabricDossier`

### `src/components/FitAdvisor.tsx`
- Props: `initialCategory?: 'tees' | 'waffles' | 'hoodies'`
- Exports: `default FitAdvisor`

### `src/components/DropRadar.tsx`
- Props: `targetDate?: string`
- Exports: `default DropRadar`

### `src/components/SyndicateNewsletter.tsx`
- Props: `onApplyPromo?: (code: string) => void`
- Exports: `default SyndicateNewsletter`
