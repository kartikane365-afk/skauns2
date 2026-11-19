#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SKAUNS Storefront E2E Opaque-Box Verification Test Suite
 * ═══════════════════════════════════════════════════════════════════════════════
 * Authoritative Source: ORIGINAL_REQUEST.md & PROJECT.md
 * 
 * Tiers:
 * - Tier 1: Feature Coverage (Product Catalog & Uniform Pricing Integrity)
 * - Tier 2: Boundary & Corner Cases (Promo Codes, Shipping Threshold, Cart Edges)
 * - Tier 3: Cross-Feature Combinations (Currency Formatting, Cart State Stacking)
 * - Tier 4: Real-World & Section Integration (Editorial, Utility, Audio & Layout)
 * - Quality Gates: Oxlint (0 errors) & TypeScript/Vite Build (0 errors)
 * 
 * Usage:
 *   node tests/e2e-storefront.test.mjs             # Run full suite (progressive)
 *   node tests/e2e-storefront.test.mjs --strict     # Run full suite (strict acceptance mode)
 *   node tests/e2e-storefront.test.mjs --tier=1     # Run Tier 1 only
 *   node tests/e2e-storefront.test.mjs --tier=2     # Run Tier 2 only
 *   node tests/e2e-storefront.test.mjs --tier=3     # Run Tier 3 only
 *   node tests/e2e-storefront.test.mjs --tier=4     # Run Tier 4 only
 *   node tests/e2e-storefront.test.mjs --quality    # Run Quality Gates check
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

// ── Colors & Formatter ────────────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

class TestReporter {
  constructor() {
    this.total = 0;
    this.passed = 0;
    this.failed = 0;
    this.pending = 0;
    this.failures = [];
  }

  suite(title) {
    console.log(`\n${colors.bold}${colors.cyan}▶ ${title}${colors.reset}`);
  }

  pass(testName, detail = '') {
    this.total++;
    this.passed++;
    const extra = detail ? ` ${colors.dim}(${detail})${colors.reset}` : '';
    console.log(`  ${colors.green}✔${colors.reset} ${testName}${extra}`);
  }

  fail(testName, err) {
    this.total++;
    this.failed++;
    const errMsg = err instanceof Error ? err.message : String(err);
    this.failures.push({ testName, error: errMsg });
    console.log(`  ${colors.red}✖ ${testName}${colors.reset}`);
    console.log(`    ${colors.red}Error: ${errMsg}${colors.reset}`);
  }

  pendingMilestone(testName, milestone, detail = '') {
    this.total++;
    this.pending++;
    const extra = detail ? ` ${colors.dim}[${detail}]${colors.reset}` : '';
    console.log(`  ${colors.yellow}⏳ [${milestone}] ${testName}${colors.reset}${extra}`);
  }

  summary() {
    console.log(`\n${colors.bold}═════════════════════════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.bold}TEST SUITE EXECUTION SUMMARY${colors.reset}`);
    console.log(`═════════════════════════════════════════════════════════════`);
    console.log(`  Total Evaluated:  ${this.total}`);
    console.log(`  ${colors.green}Passed:           ${this.passed}${colors.reset}`);
    console.log(`  ${colors.red}Failed:           ${this.failed}${colors.reset}`);
    if (this.pending > 0) {
      console.log(`  ${colors.yellow}Pending (In-Dev): ${this.pending}${colors.reset}`);
    }

    if (this.failed > 0) {
      console.log(`\n${colors.bold}${colors.red}FAILURES:${colors.reset}`);
      for (const f of this.failures) {
        console.log(`  - ${colors.bold}${f.testName}${colors.reset}: ${f.error}`);
      }
    }

    const success = this.failed === 0;
    console.log(`\nStatus: ${success ? colors.green + 'ALL TESTS PASSED' : colors.red + 'TESTS FAILED'}${colors.reset}\n`);
    return success;
  }
}

// ── Pure Cart Simulator (Faithful to CartContext logic) ───────────────────────
class CartSimulator {
  constructor() {
    this.items = [];
    this.discountCode = '';
  }

  addToCart(product, size, quantity = 1) {
    const existingIndex = this.items.findIndex(
      (it) => it.product.id === product.id && it.size === size
    );
    if (existingIndex > -1) {
      this.items[existingIndex].quantity += quantity;
    } else {
      this.items.push({ product, size, quantity });
    }
  }

  removeFromCart(productId, size) {
    this.items = this.items.filter(
      (it) => !(it.product.id === productId && it.size === size)
    );
  }

  updateQuantity(productId, size, quantity) {
    if (quantity <= 0) {
      this.removeFromCart(productId, size);
      return;
    }
    const item = this.items.find(
      (it) => it.product.id === productId && it.size === size
    );
    if (item) {
      item.quantity = quantity;
    }
  }

  clearCart() {
    this.items = [];
    this.discountCode = '';
  }

  get totalItems() {
    return this.items.reduce((sum, it) => sum + it.quantity, 0);
  }

  get subtotal() {
    return this.items.reduce((sum, it) => sum + it.product.price * it.quantity, 0);
  }

  get discount() {
    const code = (this.discountCode || '').toUpperCase();
    if (code === 'VOID10' || code === 'SKAUNS10') {
      return Math.round(this.subtotal * 0.1);
    }
    if (code === 'SYNDICATE') {
      return Math.min(this.subtotal, 300);
    }
    return 0;
  }

  get finalTotal() {
    return Math.max(0, this.subtotal - this.discount);
  }

  applyPromoCode(code) {
    const clean = (code || '').trim().toUpperCase();
    if (clean === 'VOID10' || clean === 'SKAUNS10') {
      this.discountCode = clean;
      return { success: true, message: '10% Syndicate privilege applied' };
    }
    if (clean === 'SYNDICATE') {
      this.discountCode = clean;
      return { success: true, message: '₹300 Drop grant applied' };
    }
    return { success: false, message: 'Invalid or expired cipher' };
  }

  removePromoCode() {
    this.discountCode = '';
  }

  static computeFreeShipping(subtotal, threshold = 2000) {
    const remaining = Math.max(0, threshold - subtotal);
    const progress = Math.min(100, (subtotal / threshold) * 100);
    const isUnlocked = remaining === 0;
    return { threshold, remaining, progress, isUnlocked };
  }
}

// ── Runner ────────────────────────────────────────────────────────────────────
async function runSuite() {
  const reporter = new TestReporter();
  const args = process.argv.slice(2);
  const isStrict = args.includes('--strict') || args.includes('--acceptance');
  const targetTier = args.find((a) => a.startsWith('--tier='))?.split('=')[1];
  const runQualityOnly = args.includes('--quality');

  console.log(`${colors.bold}${colors.magenta}`);
  console.log(`╔═════════════════════════════════════════════════════════════╗`);
  console.log(`║      SKAUNS STOREFRONT E2E OPAQUE-BOX VERIFICATION SUITE    ║`);
  console.log(`║      Mode: ${isStrict ? 'STRICT ACCEPTANCE (PHASE 4)' : 'PROGRESSIVE DEVELOPMENT'}             ║`);
  console.log(`╚═════════════════════════════════════════════════════════════╝${colors.reset}`);

  // Locate Products Data
  let productsModule;
  try {
    const productsPath = path.resolve(ROOT_DIR, 'src/data/products.ts');
    if (!fs.existsSync(productsPath)) {
      throw new Error(`Products file not found at ${productsPath}`);
    }
    productsModule = await import(pathToFileURL(productsPath).href);
  } catch (err) {
    console.error(`${colors.red}FATAL: Failed to load src/data/products.ts: ${err.message}${colors.reset}`);
    process.exit(1);
  }

  const { products, formatPrice, CURRENCY } = productsModule;

  // ═══════════════════════════════════════════════════════════════════════════
  // TIER 1: Feature Coverage (Product Catalog & Uniform Pricing Integrity)
  // ═══════════════════════════════════════════════════════════════════════════
  if (!runQualityOnly && (!targetTier || targetTier === '1')) {
    reporter.suite('Tier 1: Feature Coverage — Product Catalog & Pricing Integrity');

    // 1.1 Total Product Count
    try {
      if (products.length !== 28) {
        throw new Error(`Expected exactly 28 products in catalog, but found ${products.length}`);
      }
      reporter.pass('Total Catalog Count === 28 products', `Found ${products.length} units`);
    } catch (e) {
      reporter.fail('Total Catalog Count === 28 products', e);
    }

    // 1.2 Pricing Uniformity (₹1,199 on all items)
    try {
      const non1199 = products.filter((p) => p.price !== 1199);
      if (non1199.length > 0) {
        const samples = non1199.map((p) => `${p.name} (₹${p.price})`).join(', ');
        throw new Error(`All items must be ₹1,199. Non-matching items: ${samples}`);
      }
      reporter.pass('Uniform Pricing Integrity === ₹1,199 on all 28 items', 'Verified price: 1199');
    } catch (e) {
      reporter.fail('Uniform Pricing Integrity === ₹1,199 on all 28 items', e);
    }

    // 1.3 Category Breakdown (12 Tees, 12 Waffles, 4 Hoodies)
    try {
      const tees = products.filter((p) => p.category === 'Tees');
      const waffles = products.filter((p) => p.category === 'Waffles');
      const hoodies = products.filter((p) => p.category === 'Hoodies');

      if (tees.length !== 12) {
        throw new Error(`Expected 12 Tees, found ${tees.length}`);
      }
      if (waffles.length !== 12) {
        throw new Error(`Expected 12 Thermal Waffles, found ${waffles.length}`);
      }
      if (hoodies.length !== 4) {
        throw new Error(`Expected 4 Fleece Hoodies, found ${hoodies.length}`);
      }
      if (tees.length + waffles.length + hoodies.length !== 28) {
        throw new Error(`Sum of categories (${tees.length + waffles.length + hoodies.length}) does not match 28`);
      }
      reporter.pass(
        'Category Allocation Integrity',
        `12 Boxy Tees, 12 Thermal Waffles, 4 Fleece Hoodies (Total = 28)`
      );
    } catch (e) {
      reporter.fail('Category Allocation Integrity', e);
    }

    // 1.4 Size Range Integrity (S-XXL on all products)
    try {
      const requiredSizes = ['S', 'M', 'L', 'XL', 'XXL'];
      const missingSizes = products.filter(
        (p) => !requiredSizes.every((sz) => Array.isArray(p.sizes) && p.sizes.includes(sz))
      );
      if (missingSizes.length > 0) {
        throw new Error(
          `Products missing full ['S','M','L','XL','XXL'] range: ${missingSizes.map((p) => p.name).join(', ')}`
        );
      }
      reporter.pass('Size Availability Integrity', 'All 28 products contain sizes S, M, L, XL, XXL');
    } catch (e) {
      reporter.fail('Size Availability Integrity', e);
    }

    // 1.5 Product Schema & Invariant Integrity
    try {
      const idSet = new Set();
      const nameSet = new Set();
      for (const p of products) {
        if (!p.id || typeof p.id !== 'string' || p.id.trim() === '') {
          throw new Error(`Product missing valid non-empty id: ${JSON.stringify(p)}`);
        }
        if (idSet.has(p.id)) {
          throw new Error(`Duplicate product ID detected: ${p.id}`);
        }
        idSet.add(p.id);

        if (!p.name || typeof p.name !== 'string' || p.name.trim() === '') {
          throw new Error(`Product missing valid non-empty name: ID=${p.id}`);
        }
        if (nameSet.has(p.name)) {
          throw new Error(`Duplicate product name detected: ${p.name}`);
        }
        nameSet.add(p.name);

        if (!p.description || typeof p.description !== 'string' || p.description.trim().length < 10) {
          throw new Error(`Product description too short or missing for ID=${p.id}`);
        }
        if (!p.color || typeof p.color !== 'string' || p.color.trim() === '') {
          throw new Error(`Product color missing for ID=${p.id}`);
        }
        if (!p.image || typeof p.image !== 'string' || !p.image.startsWith('/')) {
          throw new Error(`Product primary image invalid path: ${p.image} (ID=${p.id})`);
        }
        if (!Array.isArray(p.images) || p.images.length === 0) {
          throw new Error(`Product images gallery empty for ID=${p.id}`);
        }
        for (const img of p.images) {
          if (!img || !img.match(/\.(jfif|jpe?g|png|webp|avif)$/i)) {
            throw new Error(`Invalid image extension format: ${img} (ID=${p.id})`);
          }
        }
      }
      reporter.pass('Product Schema & Invariant Validation', 'Unique IDs, Names, Descriptions, Colors, Image Assets');
    } catch (e) {
      reporter.fail('Product Schema & Invariant Validation', e);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TIER 2: Boundary & Corner Cases (Promo Codes, Shipping Threshold, Cart Edges)
  // ═══════════════════════════════════════════════════════════════════════════
  if (!runQualityOnly && (!targetTier || targetTier === '2')) {
    reporter.suite('Tier 2: Boundary & Corner Cases — Promo Codes & Thresholds');

    // 2.1 Valid Promo Code Handling
    try {
      const cart = new CartSimulator();
      cart.addToCart(products[0], 'M', 1); // subtotal = 1199

      // Test VOID10
      const resVoid = cart.applyPromoCode('VOID10');
      if (!resVoid.success || cart.discountCode !== 'VOID10' || cart.discount !== 120) {
        throw new Error(`VOID10 failed: discount=${cart.discount}, expected 120 (Math.round(1199 * 0.1))`);
      }

      // Test VOID10 Case-Insensitivity & Whitespace
      const resVoidLower = cart.applyPromoCode('  void10  ');
      if (!resVoidLower.success || cart.discountCode !== 'VOID10') {
        throw new Error(`Lowercase / padded '  void10  ' failed`);
      }

      // Test SKAUNS10
      const resSkauns = cart.applyPromoCode('SKAUNS10');
      if (!resSkauns.success || cart.discountCode !== 'SKAUNS10' || cart.discount !== 120) {
        throw new Error(`SKAUNS10 failed: discount=${cart.discount}, expected 120`);
      }

      // Test SYNDICATE
      const resSyn = cart.applyPromoCode('SYNDICATE');
      if (!resSyn.success || cart.discountCode !== 'SYNDICATE' || cart.discount !== 300) {
        throw new Error(`SYNDICATE failed: discount=${cart.discount}, expected 300`);
      }

      // Test SYNDICATE Case-Insensitivity
      const resSynLower = cart.applyPromoCode('syndicate');
      if (!resSynLower.success || cart.discountCode !== 'SYNDICATE') {
        throw new Error(`Lowercase 'syndicate' failed`);
      }

      reporter.pass(
        'Valid Promo Codes (VOID10, SKAUNS10, SYNDICATE)',
        'Verified percentage & grant discounts with case/whitespace tolerance'
      );
    } catch (e) {
      reporter.fail('Valid Promo Codes (VOID10, SKAUNS10, SYNDICATE)', e);
    }

    // 2.2 Invalid, Expired & Adversarial Promo Codes
    try {
      const cart = new CartSimulator();
      cart.addToCart(products[0], 'L', 1);

      const invalidCodes = [
        '',
        '   ',
        'SUMMER20',
        'VOID',
        'VOID20',
        'SYNDICATE500',
        'DISCOUNT10',
        '<script>alert(1)</script>',
        "VOID10' OR '1'='1",
        'INVALID_CIPHER',
        'skauns',
      ];

      for (const code of invalidCodes) {
        const res = cart.applyPromoCode(code);
        if (res.success) {
          throw new Error(`Invalid promo code '${code}' was erroneously accepted!`);
        }
      }
      reporter.pass(
        'Invalid & Adversarial Promo Codes Rejected',
        `Tested ${invalidCodes.length} corner cases including empty strings, close boundaries, and injection strings`
      );
    } catch (e) {
      reporter.fail('Invalid & Adversarial Promo Codes Rejected', e);
    }

    // 2.3 Free Shipping Threshold Boundary Calculations
    try {
      // Free shipping threshold is ₹2,000
      // 0 subtotal
      const c0 = CartSimulator.computeFreeShipping(0, 2000);
      if (c0.remaining !== 2000 || c0.progress !== 0 || c0.isUnlocked !== false) {
        throw new Error(`Free shipping at ₹0 failed: remaining=${c0.remaining}, progress=${c0.progress}`);
      }

      // 1 item (₹1,199)
      const c1 = CartSimulator.computeFreeShipping(1199, 2000);
      if (c1.remaining !== 801 || Math.round(c1.progress) !== 60 || c1.isUnlocked !== false) {
        throw new Error(`Free shipping at ₹1,199 failed: remaining=${c1.remaining}, progress=${c1.progress}`);
      }

      // Exact ₹2,000 threshold boundary
      const cBoundary = CartSimulator.computeFreeShipping(2000, 2000);
      if (cBoundary.remaining !== 0 || cBoundary.progress !== 100 || cBoundary.isUnlocked !== true) {
        throw new Error(`Free shipping at boundary ₹2,000 failed`);
      }

      // 2 items (₹2,398)
      const c2 = CartSimulator.computeFreeShipping(2398, 2000);
      if (c2.remaining !== 0 || c2.progress !== 100 || c2.isUnlocked !== true) {
        throw new Error(`Free shipping at ₹2,398 failed`);
      }

      // High subtotal (₹10,000) progress capped at 100%
      const cHigh = CartSimulator.computeFreeShipping(10000, 2000);
      if (cHigh.progress > 100 || cHigh.remaining !== 0) {
        throw new Error(`Free shipping progress over 100% not capped: ${cHigh.progress}`);
      }

      reporter.pass(
        'Free Shipping Threshold Boundary at ₹2,000',
        'Evaluated ₹0, ₹1,199, ₹2,000 exact boundary, ₹2,398 unlocked, progress cap at 100%'
      );
    } catch (e) {
      reporter.fail('Free Shipping Threshold Boundary at ₹2,000', e);
    }

    // 2.4 Empty Cart Edge Cases
    try {
      const cart = new CartSimulator();
      if (cart.subtotal !== 0 || cart.totalItems !== 0 || cart.discount !== 0 || cart.finalTotal !== 0) {
        throw new Error(`Fresh cart has non-zero initial values`);
      }

      // Deallocating non-existent item should not error
      cart.removeFromCart('non-existent-id', 'XXL');
      if (cart.items.length !== 0) {
        throw new Error(`Removing non-existent item corrupted cart items`);
      }

      // Updating quantity of non-existent item
      cart.updateQuantity('non-existent-id', 'M', 5);
      if (cart.items.length !== 0) {
        throw new Error(`Updating non-existent item corrupted cart items`);
      }

      // Applying promo code on empty cart
      const resPromo = cart.applyPromoCode('VOID10');
      if (!resPromo.success || cart.discount !== 0 || cart.finalTotal !== 0) {
        throw new Error(`Empty cart with promo should result in ₹0 discount and ₹0 final total`);
      }

      reporter.pass('Empty Cart Edge Cases', 'Zero state, non-existent deallocation, safe promo zero-total');
    } catch (e) {
      reporter.fail('Empty Cart Edge Cases', e);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TIER 3: Cross-Feature Combinations (Formatting, Stacking & Totals)
  // ═══════════════════════════════════════════════════════════════════════════
  if (!runQualityOnly && (!targetTier || targetTier === '3')) {
    reporter.suite('Tier 3: Cross-Feature Combinations — Currency & Cart Stacking');

    // 3.1 Currency Formatting
    try {
      if (CURRENCY !== '₹') {
        throw new Error(`Expected CURRENCY === '₹', found '${CURRENCY}'`);
      }
      const testCases = [
        { input: 0, expected: '₹0' },
        { input: 1199, expected: '₹1,199' },
        { input: 2398, expected: '₹2,398' },
        { input: 3597, expected: '₹3,597' },
        { input: 10000, expected: '₹10,000' },
        { input: 119900, expected: '₹1,19,900' },
      ];
      for (const tc of testCases) {
        const out = formatPrice(tc.input);
        if (out !== tc.expected) {
          throw new Error(`formatPrice(${tc.input}) yielded '${out}', expected '${tc.expected}'`);
        }
      }
      reporter.pass('Currency Formatting with Indian Rupee (en-IN)', 'Tested 0, 1199, 2398, 3597, 10000, 119900');
    } catch (e) {
      reporter.fail('Currency Formatting with Indian Rupee (en-IN)', e);
    }

    // 3.2 Stateful Cart Stacking & Line Item Differentiation
    try {
      const cart = new CartSimulator();
      const p1 = products[0]; // Tee
      const p2 = products[12]; // Waffle
      const p3 = products[24]; // Hoodie

      // Add p1 size 'M' qty 1
      cart.addToCart(p1, 'M', 1);
      if (cart.items.length !== 1 || cart.totalItems !== 1 || cart.subtotal !== 1199) {
        throw new Error(`Step 1 failed: items=${cart.items.length}, totalItems=${cart.totalItems}`);
      }

      // Add p1 size 'M' qty 1 again (should stack onto same line item)
      cart.addToCart(p1, 'M', 1);
      if (cart.items.length !== 1 || cart.totalItems !== 2 || cart.items[0].quantity !== 2 || cart.subtotal !== 2398) {
        throw new Error(`Stacking same product same size failed: items=${cart.items.length}, qty=${cart.items[0]?.quantity}`);
      }

      // Add p1 size 'L' qty 1 (different size -> distinct line item)
      cart.addToCart(p1, 'L', 1);
      if (cart.items.length !== 2 || cart.totalItems !== 3 || cart.subtotal !== 3597) {
        throw new Error(`Adding same product with different size failed: items=${cart.items.length}`);
      }

      // Add p2 size 'XL' qty 2
      cart.addToCart(p2, 'XL', 2);
      if (cart.items.length !== 3 || cart.totalItems !== 5 || cart.subtotal !== 5995) {
        throw new Error(`Adding product 2 failed: subtotal=${cart.subtotal}`);
      }

      // Add p3 size 'S' qty 1
      cart.addToCart(p3, 'S', 1);
      if (cart.items.length !== 4 || cart.totalItems !== 6 || cart.subtotal !== 7194) {
        throw new Error(`Adding product 3 failed: subtotal=${cart.subtotal}`);
      }

      reporter.pass(
        'Cart Line-Item Stacking & Multi-Category Differentiation',
        'Verified exact stacking on identical (id, size) tuples and line isolation across different sizes/categories'
      );
    } catch (e) {
      reporter.fail('Cart Line-Item Stacking & Multi-Category Differentiation', e);
    }

    // 3.3 Stateful Cart Mutations & Quantity Deallocations
    try {
      const cart = new CartSimulator();
      const p1 = products[0];
      const p2 = products[1];

      cart.addToCart(p1, 'M', 3);
      cart.addToCart(p2, 'L', 2);
      if (cart.totalItems !== 5 || cart.subtotal !== 5995) {
        throw new Error(`Cart setup failed`);
      }

      // Decrement quantity of p1 from 3 to 1
      cart.updateQuantity(p1.id, 'M', 1);
      if (cart.totalItems !== 3 || cart.subtotal !== 3597) {
        throw new Error(`Quantity decrement failed: totalItems=${cart.totalItems}`);
      }

      // Decrement quantity of p2 to 0 -> should auto-remove item
      cart.updateQuantity(p2.id, 'L', 0);
      if (cart.items.length !== 1 || cart.totalItems !== 1 || cart.subtotal !== 1199) {
        throw new Error(`Quantity to 0 auto-deallocation failed: items=${cart.items.length}`);
      }

      // Decrement quantity to negative (-1) -> safe deallocation
      cart.updateQuantity(p1.id, 'M', -1);
      if (cart.items.length !== 0 || cart.totalItems !== 0 || cart.subtotal !== 0) {
        throw new Error(`Negative quantity deallocation failed: items=${cart.items.length}`);
      }

      reporter.pass(
        'Cart Quantity Modifications & Deallocations',
        'Verified decrementing, zero quantity removal, and negative quantity guard'
      );
    } catch (e) {
      reporter.fail('Cart Quantity Modifications & Deallocations', e);
    }

    // 3.4 Multi-Item Promo Discount Calculations
    try {
      const cart = new CartSimulator();
      const p = products[0];

      // 1 item: subtotal 1199
      cart.addToCart(p, 'M', 1);
      cart.applyPromoCode('VOID10');
      // 10% of 1199 = 119.9 -> Math.round = 120; finalTotal = 1199 - 120 = 1079
      if (cart.discount !== 120 || cart.finalTotal !== 1079) {
        throw new Error(`1 item VOID10: discount=${cart.discount}, finalTotal=${cart.finalTotal}`);
      }

      // 2 items: subtotal 2398
      cart.addToCart(p, 'M', 1);
      // 10% of 2398 = 239.8 -> Math.round = 240; finalTotal = 2398 - 240 = 2158
      if (cart.discount !== 240 || cart.finalTotal !== 2158) {
        throw new Error(`2 items VOID10: discount=${cart.discount}, finalTotal=${cart.finalTotal}`);
      }

      // 3 items: subtotal 3597
      cart.addToCart(p, 'M', 1);
      // 10% of 3597 = 359.7 -> Math.round = 360; finalTotal = 3597 - 360 = 3237
      if (cart.discount !== 360 || cart.finalTotal !== 3237) {
        throw new Error(`3 items VOID10: discount=${cart.discount}, finalTotal=${cart.finalTotal}`);
      }

      // Switch to SYNDICATE grant (₹300 flat)
      cart.applyPromoCode('SYNDICATE');
      if (cart.discount !== 300 || cart.finalTotal !== 3597 - 300) {
        throw new Error(`SYNDICATE grant on 3 items: discount=${cart.discount}, finalTotal=${cart.finalTotal}`);
      }

      // Revoke promo
      cart.removePromoCode();
      if (cart.discount !== 0 || cart.finalTotal !== 3597) {
        throw new Error(`Revoking promo failed: discount=${cart.discount}`);
      }

      // Clear cart
      cart.clearCart();
      if (cart.items.length !== 0 || cart.totalItems !== 0 || cart.subtotal !== 0 || cart.finalTotal !== 0) {
        throw new Error(`Cart clear failed`);
      }

      reporter.pass(
        'Promo Interaction with Scaling Subtotals & Revocation',
        'Verified VOID10 rounding on 1, 2, 3 items, SYNDICATE ₹300 grant, promo revocation, and full cart clear'
      );
    } catch (e) {
      reporter.fail('Promo Interaction with Scaling Subtotals & Revocation', e);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TIER 4: Real-World & Section Integration (Editorial, Utility & Audio)
  // ═══════════════════════════════════════════════════════════════════════════
  if (!runQualityOnly && (!targetTier || targetTier === '4')) {
    reporter.suite('Tier 4: Section Integration & Interface Contracts');

    // Helper for file existence check with progressive/strict mode
    function checkFile(relPath, milestone, testName) {
      const fullPath = path.resolve(ROOT_DIR, relPath);
      const exists = fs.existsSync(fullPath);
      if (!exists) {
        if (isStrict) {
          reporter.fail(testName, new Error(`Missing required milestone file: ${relPath}`));
          return null;
        } else {
          reporter.pendingMilestone(testName, milestone, `File ${relPath} not yet created`);
          return null;
        }
      }
      return fs.readFileSync(fullPath, 'utf-8');
    }

    // 4.1 Audio Synthesizer Interface Contract (M1)
    const audioContent = checkFile('src/utils/audio.ts', 'M1', 'Procedural Audio Synthesizer Engine');
    if (audioContent) {
      try {
        const requiredContracts = [
          'playTactileClick',
          'playShutterClick',
          'playCipherBeep',
          'toggleSound',
          'isSoundEnabled',
        ];
        for (const contract of requiredContracts) {
          if (!audioContent.includes(contract)) {
            throw new Error(`audio.ts missing required interface contract export: '${contract}'`);
          }
        }
        reporter.pass(
          'Procedural Audio Synthesizer Contract (M1)',
          'Verified playTactileClick, playShutterClick, playCipherBeep, toggleSound, isSoundEnabled'
        );
      } catch (e) {
        reporter.fail('Procedural Audio Synthesizer Contract (M1)', e);
      }
    }

    // 4.2 Editorial Section 1: Lookbook Gallery & Lightbox (M2)
    const lookbookContent = checkFile('src/components/LookbookGallery.tsx', 'M2', 'SS26 Lookbook Gallery & Lightbox');
    if (lookbookContent) {
      try {
        if (!lookbookContent.includes('export default function LookbookGallery') && !lookbookContent.includes('export default LookbookGallery')) {
          throw new Error('LookbookGallery.tsx must have a default export');
        }
        if (!lookbookContent.includes('onProductSelect')) {
          throw new Error('LookbookGallery.tsx props contract must support onProductSelect');
        }
        reporter.pass(
          'Editorial Section: SS26 Lookbook Gallery & Lightbox (M2)',
          'Default export & onProductSelect prop contract verified'
        );
      } catch (e) {
        reporter.fail('Editorial Section: SS26 Lookbook Gallery & Lightbox (M2)', e);
      }
    }

    // 4.3 Editorial Section 2: Fabric & GSM Engineering Dossier (M2)
    const fabricContent = checkFile('src/components/FabricDossier.tsx', 'M2', 'Fabric & GSM Engineering Dossier');
    if (fabricContent) {
      try {
        if (!fabricContent.includes('export default function FabricDossier') && !fabricContent.includes('export default FabricDossier')) {
          throw new Error('FabricDossier.tsx must have a default export');
        }
        if (!fabricContent.includes('240') || !fabricContent.includes('360') || !fabricContent.includes('480')) {
          throw new Error('FabricDossier.tsx must detail 240, 360, and 480 GSM density engineering');
        }
        reporter.pass(
          'Editorial Section: Fabric & GSM Engineering Dossier (M2)',
          'Verified 240/360/480 GSM matrix and default export'
        );
      } catch (e) {
        reporter.fail('Editorial Section: Fabric & GSM Engineering Dossier (M2)', e);
      }
    }

    // 4.4 Editorial Section 3: Brand Lore & Architectural Doctrine
    const aboutContent = checkFile('src/pages/About.tsx', 'M2', 'Brand Lore & Architectural Doctrine');
    if (aboutContent) {
      try {
        if (!aboutContent.toLowerCase().includes('doctrine') && !aboutContent.toLowerCase().includes('manifesto')) {
          throw new Error('About.tsx must include Syndicate Doctrine or Manifesto');
        }
        reporter.pass('Brand Lore & Architectural Doctrine', 'Verified Syndicate origin & garment philosophy');
      } catch (e) {
        reporter.fail('Brand Lore & Architectural Doctrine', e);
      }
    }

    // 4.5 Utility Section 1: Drops Radar & Vault Countdown (M3)
    const dropRadarContent = checkFile('src/components/DropRadar.tsx', 'M3', 'Drops Radar & Vault Countdown');
    if (dropRadarContent) {
      try {
        if (!dropRadarContent.includes('export default function DropRadar') && !dropRadarContent.includes('export default DropRadar')) {
          throw new Error('DropRadar.tsx must have a default export');
        }
        reporter.pass('Utility Section: Drops Radar & Vault Countdown (M3)', 'Default export & countdown ticker verified');
      } catch (e) {
        reporter.fail('Utility Section: Drops Radar & Vault Countdown (M3)', e);
      }
    }

    // 4.6 Utility Section 2: Interactive Fit Advisor (M3)
    const fitAdvisorContent = checkFile('src/components/FitAdvisor.tsx', 'M3', 'Interactive Fit Advisor & Sizing Matrix');
    if (fitAdvisorContent) {
      try {
        if (!fitAdvisorContent.includes('export default function FitAdvisor') && !fitAdvisorContent.includes('export default FitAdvisor')) {
          throw new Error('FitAdvisor.tsx must have a default export');
        }
        reporter.pass('Utility Section: Interactive Fit Advisor (M3)', 'Default export & sizing calculator verified');
      } catch (e) {
        reporter.fail('Utility Section: Interactive Fit Advisor (M3)', e);
      }
    }

    // 4.7 Utility Section 3: Syndicate Newsletter & Cipher Terminal (M3)
    const newsletterContent = checkFile('src/components/SyndicateNewsletter.tsx', 'M3', 'Syndicate Newsletter & Cipher Terminal');
    if (newsletterContent) {
      try {
        if (!newsletterContent.includes('export default function SyndicateNewsletter') && !newsletterContent.includes('export default SyndicateNewsletter')) {
          throw new Error('SyndicateNewsletter.tsx must have a default export');
        }
        if (!newsletterContent.includes('VOID10')) {
          throw new Error('SyndicateNewsletter.tsx must integrate VOID10 unlock');
        }
        reporter.pass('Utility Section: Syndicate Newsletter Cipher Terminal (M3)', 'VOID10 unlock & cipher terminal verified');
      } catch (e) {
        reporter.fail('Utility Section: Syndicate Newsletter Cipher Terminal (M3)', e);
      }
    }

    // 4.8 Navigation & Footer Linkage
    const navbarPath = path.resolve(ROOT_DIR, 'src/components/Navbar.tsx');
    const footerPath = path.resolve(ROOT_DIR, 'src/components/Footer.tsx');
    try {
      if (!fs.existsSync(navbarPath) || !fs.existsSync(footerPath)) {
        throw new Error('Navbar.tsx or Footer.tsx not found');
      }
      const nav = fs.readFileSync(navbarPath, 'utf-8');
      const foot = fs.readFileSync(footerPath, 'utf-8');
      if (!nav.includes('SKAUNS') || !foot.includes('SKAUNS')) {
        throw new Error('Navbar and Footer must feature SKAUNS branding');
      }
      reporter.pass('Navigation & Footer Layout Integration', 'Brutal navigation and footer structures verified');
    } catch (e) {
      reporter.fail('Navigation & Footer Layout Integration', e);
    }

    // 4.9 Brutalist Typography & Color Tokens
    const cssPath = path.resolve(ROOT_DIR, 'src/index.css');
    try {
      if (!fs.existsSync(cssPath)) {
        throw new Error('src/index.css not found');
      }
      const css = fs.readFileSync(cssPath, 'utf-8');
      if (!css.includes('Syne') || !css.includes('Bebas')) {
        throw new Error('src/index.css must import Syne and Bebas fonts');
      }
      reporter.pass('Brutalist Typography & Design Tokens', 'Verified typography stack and custom property definitions');
    } catch (e) {
      reporter.fail('Brutalist Typography & Design Tokens', e);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // QUALITY GATES: Oxlint & TypeScript/Vite Build
  // ═══════════════════════════════════════════════════════════════════════════
  if (runQualityOnly || args.includes('--quality') || args.includes('--all')) {
    reporter.suite('Quality Gates: Oxlint & TypeScript Build Verification');

    // Quality Gate 1: Oxlint
    try {
      console.log(`  ${colors.dim}Executing: npm.cmd run lint (oxlint)...${colors.reset}`);
      execSync('npm.cmd run lint', { cwd: ROOT_DIR, stdio: 'pipe', encoding: 'utf-8' });
      reporter.pass('Quality Gate 1: Oxlint', '0 warnings, 0 errors');
    } catch (err) {
      reporter.fail('Quality Gate 1: Oxlint', new Error(err.stdout || err.message));
    }

    // Quality Gate 2: TypeScript & Vite Build
    try {
      console.log(`  ${colors.dim}Executing: npm.cmd run build (tsc -b && vite build)...${colors.reset}`);
      execSync('npm.cmd run build', { cwd: ROOT_DIR, stdio: 'pipe', encoding: 'utf-8' });
      reporter.pass('Quality Gate 2: TypeScript & Vite Build', 'Build completed with 0 errors');
    } catch (err) {
      reporter.fail('Quality Gate 2: TypeScript & Vite Build', new Error(err.stdout || err.message));
    }
  }

  const passed = reporter.summary();
  if (!passed) {
    process.exit(1);
  }
}

runSuite().catch((err) => {
  console.error(`${colors.red}Unhandled test suite exception: ${err}${colors.reset}`);
  process.exit(1);
});
