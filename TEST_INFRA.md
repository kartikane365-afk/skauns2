# SKAUNS Storefront — Test Infrastructure Architecture

## Overview
The automated testing infrastructure provides an opaque-box, specification-derived verification test suite for the SKAUNS Gen-Z brutalist e-commerce platform. The suite operates directly against production contracts and specifications derived from `ORIGINAL_REQUEST.md` and `PROJECT.md`.

## Execution Engine
- **Runtime**: Node.js v24 native execution (`v24.21.0`) with built-in ESM module resolution and dynamic TypeScript type stripping.
- **Zero-Dependency Harness**: No third-party test framework overhead, zero bundle footprint impact, instantaneous execution (< 500ms for pure tests).
- **Environment**: Compatible with Windows PowerShell (`npm.cmd`) and POSIX environments.

## Multi-Tier Verification Matrix

### Tier 1: Feature Coverage — Product Catalog & Pricing Integrity
- **Catalog Size**: Strict check for exactly 28 immutable product items in `src/data/products.ts`.
- **Pricing Uniformity**: Validates that all 28 products have a price of exactly ₹1,199.
- **Category Allocation**:
  - Boxy Tees: Exactly 12 units (`category: 'Tees'`)
  - Thermal Waffles: Exactly 12 units (`category: 'Waffles'`)
  - Fleece Hoodies: Exactly 4 units (`category: 'Hoodies'`)
  - Total allocation invariant: 12 + 12 + 4 = 28.
- **Size Availability**: Verifies all 28 products contain sizes `['S', 'M', 'L', 'XL', 'XXL']`.
- **Schema Validation**: Unique IDs, non-empty names, descriptions, colors, and valid relative asset paths (`/products/*`).

### Tier 2: Boundary & Corner Cases — Promo Codes & Thresholds
- **Valid Promo Ciphers**:
  - `VOID10`: 10% discount (`Math.round(subtotal * 0.1)`)
  - `SKAUNS10`: 10% discount
  - `SYNDICATE`: ₹300 grant (`Math.min(subtotal, 300)`)
  - Case-insensitivity (`void10`, `syndicate`) and whitespace trimming (`  VOID10  `).
- **Adversarial & Invalid Promo Inputs**: Empty strings, whitespace, non-existent ciphers (`SUMMER20`, `DISCOUNT`), boundary-adjacent strings (`VOID`, `VOID20`), and script injection inputs (`<script>`, SQL fragments) correctly rejected with `{ success: false }`.
- **Free Shipping Threshold Calculation**:
  - Threshold: ₹2,000.
  - Zero subtotal (₹0): remaining ₹2,000, 0% progress.
  - 1 item (₹1,199): remaining ₹801, 60% progress.
  - Threshold boundary (₹2,000): remaining ₹0, 100% unlocked.
  - 2 items (₹2,398): remaining ₹0, 100% unlocked.
  - High subtotal (₹10,000): progress capped at 100% (never exceeds 100%).
- **Empty Cart Handling**: Initial zero state, non-existent item deallocation without crash, zero final total when promo applied to empty cart.

### Tier 3: Cross-Feature Combinations — Formatting & Stateful Cart Stacking
- **Currency Formatting**: Verification of `CURRENCY === '₹'` and `formatPrice(price)` with `en-IN` comma grouping (`₹0`, `₹1,199`, `₹2,398`, `₹3,597`, `₹10,000`, `₹1,19,900`).
- **Cart Stacking Logic**:
  - Adding identical `(productId, size)` tuple increments quantity on the existing line item.
  - Adding identical `productId` with different `size` creates isolated line items.
  - Stacking across multiple product categories (Tees, Waffles, Hoodies).
- **Cart Quantity Mutations**: Decrementing quantities, auto-deallocation when quantity reaches 0, negative quantity guards.
- **Promo Interactions**:
  - Proportional rounding on scaling subtotals (120 on 1 unit, 240 on 2 units, 360 on 3 units).
  - Fixed grant capping (₹300 flat, never exceeding subtotal).
  - Promo revocation restores subtotal as finalTotal.
  - Full cart clear resets items, discount code, subtotal, and finalTotal to 0.

### Tier 4: Real-World & Section Integration — Editorial, Utility & Audio
- **Audio Synthesizer Engine (`src/utils/audio.ts`)**:
  - Interface contracts: `playTactileClick()`, `playShutterClick()`, `playCipherBeep()`, `toggleSound()`, `isSoundEnabled()`.
- **Editorial Sections**:
  - `LookbookGallery.tsx`: Default export, `onProductSelect` prop contract, lightbox modal.
  - `FabricDossier.tsx`: Default export, `onCategoryJump` prop contract, 240/360/480 GSM density matrix.
  - `BrandLore.tsx` / `About.tsx`: Syndicate doctrine, origin lore, and architectural specifications.
- **Utility Sections**:
  - `DropRadar.tsx`: Default export, `targetDate` prop contract, countdown ticker.
  - `FitAdvisor.tsx`: Default export, `initialCategory` prop contract, interactive sizing matrix.
  - `SyndicateNewsletter.tsx`: Default export, `onApplyPromo` prop contract, VOID10 promo integration.
- **Storefront & Navigation Linkage**: `Navbar.tsx` and `Footer.tsx` branding and route navigation.
- **Design Tokens**: `src/index.css` font families (Syne, Bebas, Space Mono) and color tokens (`#f4f4f0`, `#0a0a0a`).

### Quality Gates
- **Oxlint**: Zero warnings, zero errors (`npm.cmd run lint`).
- **TypeScript & Vite Build**: Zero errors (`npm.cmd run build`).

## Test Execution Commands

```bash
# Full progressive test run (Tiers 1-4)
node tests/e2e-storefront.test.mjs

# Strict acceptance mode (fails if any planned milestone file is missing)
node tests/e2e-storefront.test.mjs --strict

# Individual Tier runs
node tests/e2e-storefront.test.mjs --tier=1
node tests/e2e-storefront.test.mjs --tier=2
node tests/e2e-storefront.test.mjs --tier=3
node tests/e2e-storefront.test.mjs --tier=4

# Quality Gates (Oxlint + TypeScript build)
node tests/e2e-storefront.test.mjs --quality

# Comprehensive run (All tiers + Quality gates)
node tests/e2e-storefront.test.mjs --all
```
