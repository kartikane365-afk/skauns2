import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="bg-white text-dark min-h-screen pt-28 sm:pt-36 pb-24 relative overflow-hidden">
      {/* Ghost background watermark */}
      <div className="absolute top-20 right-0 pointer-events-none select-none overflow-hidden">
        <span className="font-bebas text-[24vw] text-black/[0.02] leading-none whitespace-nowrap block">
          PRIVACY
        </span>
      </div>

      <div className="max-w-[1100px] mx-auto px-6 sm:px-10 relative z-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs uppercase tracking-widest text-dark/40 mb-8">
          <Link to="/" className="hover:text-black">Home</Link>
          <span>/</span>
          <span className="text-black font-bold">Privacy Policy</span>
        </div>

        {/* Header */}
        <div className="border-b border-black/15 pb-8 mb-12">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-[1px] bg-black/20" />
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-dark/40">
              Data Protection // Protocol 02
            </p>
          </div>
          <h1 className="font-syne font-black text-3xl sm:text-5xl uppercase tracking-tighter text-dark mb-4">
            Privacy Policy
          </h1>
          <div className="flex flex-wrap items-center gap-4 sm:gap-8 font-mono text-xs text-dark/50">
            <span>Entity: <strong>SKAUNS APPAREL (Kartikane Parihar)</strong></span>
            <span>✦</span>
            <span>Operating Hub: <strong>Faridabad, Haryana</strong></span>
            <span>✦</span>
            <span>Standard: <strong>IT Act 2000 & DPDP Act 2023</strong></span>
          </div>
        </div>

        {/* Privacy Highlight Banner */}
        <div className="bg-[#fafafa] border-l-4 border-black border-y border-r border-black/10 p-5 sm:p-6 mb-12 font-mono text-xs leading-relaxed text-dark/80">
          <p className="font-bold uppercase tracking-wider text-black mb-1.5 flex items-center gap-2">
            <span>🛡</span> Absolute Data Discretion Guarantee
          </p>
          <p>
            At <strong>SKAUNS</strong>, we respect your identity and privacy. We maintain stringent cryptographic security standards to ensure your personal details, order records, and transmission data remain strictly confidential. We never monetize, sell, or rent your personal information to third-party marketing brokers.
          </p>
        </div>

        {/* Policy Body */}
        <div className="space-y-12 font-mono text-xs sm:text-[13px] leading-relaxed text-dark/75">
          
          {/* Section 1 */}
          <section className="border-t border-black/10 pt-8">
            <span className="text-[10px] uppercase tracking-[0.3em] text-dark/40 block mb-1">
              Section 01 // Overview
            </span>
            <h2 className="font-syne font-black text-xl sm:text-2xl uppercase tracking-tight text-dark mb-4">
              1. Regulatory Framework & Scope
            </h2>
            <div className="space-y-3">
              <p>
                This Privacy Policy outlines the practices and principles of <strong>SKAUNS APPAREL</strong> (&ldquo;SKAUNS&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;) regarding the collection, handling, storage, transfer, and protection of personal data collected through our digital platform (skauns.com).
              </p>
              <p>
                This policy is formulated in strict compliance with the <strong>Information Technology Act, 2000</strong>, the <strong>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</strong>, and aligns with the provisions of the <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong> of the Republic of India.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="border-t border-black/10 pt-8">
            <span className="text-[10px] uppercase tracking-[0.3em] text-dark/40 block mb-1">
              Section 02 // Information Collected
            </span>
            <h2 className="font-syne font-black text-xl sm:text-2xl uppercase tracking-tight text-dark mb-4">
              2. Data We Collect & Receive
            </h2>
            <div className="space-y-3">
              <p>To process your silhouette allocations and deliver seamless logistics, we collect the following categories of information:</p>
              <ul className="list-disc pl-5 space-y-2 text-dark/70">
                <li>
                  <strong>Contact & Identity Data:</strong> Full legal name, primary email address, shipping delivery address, billing address, and active telephone/mobile number.
                </li>
                <li>
                  <strong>Order & Transaction Records:</strong> Garment silhouettes, sizes selected, order identification code (SKN-XXXXXX), invoice amount, dispatch timeline, and fulfillment tracking history.
                </li>
                <li>
                  <strong>Technical & Telemetry Data:</strong> IP address, browser type and version, operating system environment, referring URLs, screen resolution, and session timestamps collected automatically via server logs.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="border-t border-black/10 pt-8">
            <span className="text-[10px] uppercase tracking-[0.3em] text-dark/40 block mb-1">
              Section 03 // Payment Protection
            </span>
            <h2 className="font-syne font-black text-xl sm:text-2xl uppercase tracking-tight text-dark mb-4">
              3. Strict Non-Storage of Financial Credentials
            </h2>
            <div className="space-y-3">
              <div className="bg-[#f5f5f3] p-4 border border-black/10 text-black">
                <p className="font-bold uppercase tracking-wider mb-1">✦ Zero Card Storage Architecture</p>
                <p>
                  SKAUNS operates on a zero-financial-data-retention model. We do NOT store, process, log, or have access to your full credit card numbers, debit card numbers, CVV/CVC codes, netbanking credentials, or UPI PINs.
                </p>
              </div>
              <p>
                When you initiate payment during checkout, you are connected directly through 256-bit encrypted channels to our RBI-authorized, PCI-DSS Level 1 certified Payment Aggregators (such as Razorpay, Cashfree, PayU, PhonePe, or Stripe).
              </p>
              <p>
                All payment operations strictly adhere to the Reserve Bank of India&apos;s Card-on-File Tokenization (CoFT) regulatory framework, ensuring that only cryptographically scrambled tokens are utilized by banking gateways without exposing raw payment instruments.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="border-t border-black/10 pt-8">
            <span className="text-[10px] uppercase tracking-[0.3em] text-dark/40 block mb-1">
              Section 04 // Data Usage
            </span>
            <h2 className="font-syne font-black text-xl sm:text-2xl uppercase tracking-tight text-dark mb-4">
              4. How Your Data Is Utilized
            </h2>
            <div className="space-y-3">
              <p>Your personal information is processed strictly for legitimate operational purposes:</p>
              <ul className="list-disc pl-5 space-y-2 text-dark/70">
                <li>Allocating, packaging, vacuum-sealing, and dispatching your purchased SKAUNS garments.</li>
                <li>Generating GST-compliant tax invoices and customs manifests where required.</li>
                <li>Transmitting automated dispatch ciphers, Airway Bill (AWB) tracking numbers, and delivery updates via email and SMS.</li>
                <li>Addressing customer support transmissions logged via our Comms desk.</li>
                <li>Safeguarding our platform against automated bot checkouts, malicious penetration attempts, and financial chargeback fraud.</li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section className="border-t border-black/10 pt-8">
            <span className="text-[10px] uppercase tracking-[0.3em] text-dark/40 block mb-1">
              Section 05 // Third-Party Sharing
            </span>
            <h2 className="font-syne font-black text-xl sm:text-2xl uppercase tracking-tight text-dark mb-4">
              5. Authorized Third-Party Disclosures
            </h2>
            <div className="space-y-3">
              <p>We share personal data solely with trusted operational partners under strict non-disclosure obligations:</p>
              <ul className="list-disc pl-5 space-y-2 text-dark/70">
                <li>
                  <strong>Logistics & Courier Aggregators:</strong> Reputed domestic couriers (including Shiprocket, Blue Dart, Delhivery, Shadowfax, Xpressbees, DTDC) to deliver your physical parcel to your doorstep.
                </li>
                <li>
                  <strong>Payment Aggregators:</strong> RBI-licensed payment gateways to authenticate and settle transactions.
                </li>
                <li>
                  <strong>Legal & Statutory Authorities:</strong> If compelled by an official lawful order, subpoena, or warrant issued by a competent court or law enforcement agency under Indian law.
                </li>
              </ul>
              <p>We never sell, lease, trade, or share your data with advertisers or lead-generation syndicates.</p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="border-t border-black/10 pt-8">
            <span className="text-[10px] uppercase tracking-[0.3em] text-dark/40 block mb-1">
              Section 06 // Cookies & Telemetry
            </span>
            <h2 className="font-syne font-black text-xl sm:text-2xl uppercase tracking-tight text-dark mb-4">
              6. Cookies & Session Storage
            </h2>
            <div className="space-y-3">
              <p>
                Our platform utilizes essential functional cookies and local storage to remember your bag contents, active promo ciphers, visual theme preferences, and fit advisor session inputs.
              </p>
              <p>
                You may disable non-essential cookies via your browser settings; however, disabling essential local storage may impair the bag allocation and checkout sequence.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="border-t border-black/10 pt-8">
            <span className="text-[10px] uppercase tracking-[0.3em] text-dark/40 block mb-1">
              Section 07 // User Entitlements
            </span>
            <h2 className="font-syne font-black text-xl sm:text-2xl uppercase tracking-tight text-dark mb-4">
              7. Your Rights Under Indian Data Law
            </h2>
            <div className="space-y-3">
              <p>In accordance with applicable privacy regulations, you possess the right to:</p>
              <ul className="list-disc pl-5 space-y-2 text-dark/70">
                <li>Request a summary of the personal data held about you in our records.</li>
                <li>Request rectification of inaccurate delivery coordinates or outdated contact data.</li>
                <li>Request erasure of your marketing email profile (excluding historical transaction records retained for mandatory GST audit compliance).</li>
              </ul>
              <p>
                To exercise any of these entitlements, transmit a formal query to <a href="mailto:skauns.help@gmail.com" className="underline font-bold text-black">skauns.help@gmail.com</a>.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="border-t border-black/10 pt-8">
            <span className="text-[10px] uppercase tracking-[0.3em] text-dark/40 block mb-1">
              Section 08 // Grievance Mechanism
            </span>
            <h2 className="font-syne font-black text-xl sm:text-2xl uppercase tracking-tight text-dark mb-4">
              8. Grievance Redressal Protocol
            </h2>
            <div className="space-y-3">
              <p>
                For grievances regarding data handling or privacy practices, you may escalate directly to our designated Grievance Officer:
              </p>
              <div className="bg-[#f5f5f3] border border-black/15 p-5 space-y-1.5 text-xs text-dark/80">
                <p><strong>Grievance Redressal Officer:</strong> Kartikane Parihar</p>
                <p><strong>Entity:</strong> SKAUNS APPAREL (Prop. Kartikane Parihar)</p>
                <p><strong>Operating Hub & Address:</strong> Faridabad, Haryana, Republic of India</p>
                <p><strong>Official Help & Grievance Email:</strong> <a href="mailto:skauns.help@gmail.com" className="text-black underline font-bold">skauns.help@gmail.com</a></p>
                <p><strong>Phone:</strong> +91 98710 44291</p>
                <p><strong>Official Instagram:</strong> <a href="https://www.instagram.com/skauns.25" target="_blank" rel="noopener noreferrer" className="text-black underline font-bold">@skauns.25</a></p>
                <p><strong>Acknowledgment Time:</strong> Within 48 hours of transmission</p>
                <p><strong>Resolution SLA:</strong> Within thirty (30) business days</p>
              </div>
            </div>
          </section>

        </div>

        {/* Bottom Nav Links */}
        <div className="mt-16 pt-8 border-t border-black/10 flex flex-wrap gap-6 text-xs font-mono text-dark/50">
          <Link to="/terms" className="hover:text-black underline">Terms of Service →</Link>
          <Link to="/refund-policy" className="hover:text-black underline">Refund & Cancellation Policy →</Link>
          <Link to="/shipping-policy" className="hover:text-black underline">Shipping & Delivery Policy →</Link>
          <Link to="/contact" className="hover:text-black underline">Comms & Dispatch →</Link>
        </div>
      </div>
    </div>
  );
}
