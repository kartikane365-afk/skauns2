import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div className="bg-white text-dark min-h-screen pt-28 sm:pt-36 pb-24 relative overflow-hidden">
      {/* Ghost background watermark */}
      <div className="absolute top-20 right-0 pointer-events-none select-none overflow-hidden">
        <span className="font-bebas text-[24vw] text-black/[0.02] leading-none whitespace-nowrap block">
          TERMS
        </span>
      </div>

      <div className="max-w-[1100px] mx-auto px-6 sm:px-10 relative z-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs uppercase tracking-widest text-dark/40 mb-8">
          <Link to="/" className="hover:text-black">Home</Link>
          <span>/</span>
          <span className="text-black font-bold">Terms & Conditions</span>
        </div>

        {/* Header */}
        <div className="border-b border-black/15 pb-8 mb-12">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-[1px] bg-black/20" />
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-dark/40">
              Legal Framework // Protocol 01
            </p>
          </div>
          <h1 className="font-syne font-black text-3xl sm:text-5xl uppercase tracking-tighter text-dark mb-4">
            Terms of Service
          </h1>
          <div className="flex flex-wrap items-center gap-4 sm:gap-8 font-mono text-xs text-dark/50">
            <span>Entity: <strong>SKAUNS APPAREL (Kartikane Parihar)</strong></span>
            <span>✦</span>
            <span>Operating Hub: <strong>Faridabad, Haryana</strong></span>
            <span>✦</span>
            <span>Governing Law: <strong>Republic of India</strong></span>
          </div>
        </div>

        {/* Legal Notice Banner */}
        <div className="bg-[#fafafa] border-l-4 border-black border-y border-r border-black/10 p-5 sm:p-6 mb-12 font-mono text-xs leading-relaxed text-dark/80">
          <p className="font-bold uppercase tracking-wider text-black mb-1.5 flex items-center gap-2">
            <span>⚠</span> Mandatory Legal Disclosure
          </p>
          <p>
            Please read these Terms of Service carefully before accessing or using the SKAUNS digital platform (accessible at skauns.com). By accessing the website, placing an order, or transmitting payment, you agree to be bound unconditionally by these terms. If you do not accept all stipulations herein, you must refrain from accessing this platform or purchasing any silhouettes.
          </p>
        </div>

        {/* Policy Body */}
        <div className="space-y-12 font-mono text-xs sm:text-[13px] leading-relaxed text-dark/75">
          
          {/* Section 1 */}
          <section className="border-t border-black/10 pt-8">
            <span className="text-[10px] uppercase tracking-[0.3em] text-dark/40 block mb-1">
              Section 01 // General Stipulations
            </span>
            <h2 className="font-syne font-black text-xl sm:text-2xl uppercase tracking-tight text-dark mb-4">
              1. Platform Ownership & Eligibility
            </h2>
            <div className="space-y-3">
              <p>
                The domain, website, mobile interface, and e-commerce infrastructure operating under the trade name <strong>SKAUNS</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) are owned and operated by <strong>SKAUNS APPAREL</strong>, a commercial entity established and existing under the applicable laws of the Republic of India.
              </p>
              <p>
                By utilizing this platform, you affirm that you are at least 18 years of age or possess the legal capacity to enter into binding agreements as defined under the <strong>Indian Contract Act, 1872</strong>. If you are under 18 years of age, you may use this platform only under the direct supervision and authorization of a parent or legal guardian.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="border-t border-black/10 pt-8">
            <span className="text-[10px] uppercase tracking-[0.3em] text-dark/40 block mb-1">
              Section 02 // Product Disclaimers
            </span>
            <h2 className="font-syne font-black text-xl sm:text-2xl uppercase tracking-tight text-dark mb-4">
              2. Limited Archive Silhouettes & Craftsmanship Nuances
            </h2>
            <div className="space-y-3">
              <p>
                SKAUNS garments are produced in strict, small-batch limited editions spanning Heavyweight Boxy Tees (240 GSM), Cotton Blend Knit Waffles (240 GSM), and Pure Cotton Heavyweight Hoodies (360 GSM). 
              </p>
              <ul className="list-disc pl-5 space-y-2 text-dark/70">
                <li>
                  <strong>Color & Screen Accuracy:</strong> While we calibrate our photographic studio lighting to present exact garment shades, actual hues may vary marginally based on your display panel settings, color profile calibrations, or ambient light.
                </li>
                <li>
                  <strong>Handcrafted Nuances:</strong> Our garments undergo specialized bio-washing, distressing, and heavy screen-printing processes. Minor tonal gradients or raw distressed hems are architectural design features of the silhouette, not manufacturing defects.
                </li>
                <li>
                  <strong>Sizing & Drape:</strong> All garments follow an avant-garde oversized boxy silhouette. Detailed dimensions are documented in our <Link to="/#fit-advisor" className="underline font-bold text-black">Interactive Fit Advisor</Link>. Customers are strictly advised to verify measurements prior to placing an order.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="border-t border-black/10 pt-8">
            <span className="text-[10px] uppercase tracking-[0.3em] text-dark/40 block mb-1">
              Section 03 // Commercial Terms
            </span>
            <h2 className="font-syne font-black text-xl sm:text-2xl uppercase tracking-tight text-dark mb-4">
              3. Pricing, Taxation & Order Confirmation
            </h2>
            <div className="space-y-3">
              <p>
                All prices presented on the platform are denominated in <strong>Indian National Rupees (INR ₹)</strong> and are inclusive of all applicable Goods and Services Taxes (GST) unless explicitly indicated otherwise.
              </p>
              <p>
                We reserve the unilateral right to adjust prices, modify drops, or withdraw items without prior notification. In the event of an inadvertent technical, computational, or typographical pricing error, SKAUNS reserves the right to decline or cancel any orders placed at the erroneous price, refunding the full transaction value to the originating source.
              </p>
              <p>
                Transmission of order details and credit/debit/UPI confirmation does not represent final acceptance of the contract. Order acceptance occurs solely upon physical allocation, dispatch verification, and handover to our authorized national courier partner.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="border-t border-black/10 pt-8">
            <span className="text-[10px] uppercase tracking-[0.3em] text-dark/40 block mb-1">
              Section 04 // Payment Security
            </span>
            <h2 className="font-syne font-black text-xl sm:text-2xl uppercase tracking-tight text-dark mb-4">
              4. Payment Gateway & Financial Security
            </h2>
            <div className="space-y-3">
              <p>
                All digital transactions on SKAUNS are processed through Reserve Bank of India (RBI) authorized, PCI-DSS Level 1 certified Payment Gateways and Aggregators (including Razorpay, Cashfree, PayU, PhonePe, and Stripe).
              </p>
              <p>
                <strong>Zero Financial Data Storage:</strong> SKAUNS does not process, store, capture, or retain sensitive card details (such as full 16-digit card numbers, expiry dates, or CVV/CVC codes) or banking credentials (such as UPI PINs or Net Banking passwords) on any of its physical or cloud servers. All card details are encrypted and tokenized directly via the payment gateway&apos;s secured endpoints in full compliance with RBI Card-on-File Tokenization guidelines.
              </p>
              <p>
                In the event of a payment deduction where the order status remains unconfirmed due to intermittent banking server timeouts, the deducted funds are systematically reconciled by the acquiring bank and refunded to the source account within 5–7 banking business cycles.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="border-t border-black/10 pt-8">
            <span className="text-[10px] uppercase tracking-[0.3em] text-dark/40 block mb-1">
              Section 05 // Order Policy
            </span>
            <h2 className="font-syne font-black text-xl sm:text-2xl uppercase tracking-tight text-dark mb-4">
              5. Strict All-Sales-Final & Cancellation Policy
            </h2>
            <div className="space-y-3">
              <p className="bg-[#fafafa] p-4 border border-black/10 text-black font-bold">
                NOTICE: Due to the high-velocity, small-batch collector nature of SKAUNS garments, ALL TRANSACTIONS ARE STRICTLY FINAL. WE DO NOT ENTERTAIN CANCELLATIONS, RETURNS, OR SIZE EXCHANGES ONCE AN ORDER HAS BEEN PROCESSED.
              </p>
              <p>
                Once an order is confirmed, inventory units are locked, electronic manifests are issued to our warehouse logistics queue, and vacuum-sealed dispatch packing commences. Consequently, orders cannot be cancelled or altered after checkout.
              </p>
              <p>
                The sole exemption applies to verifiable transit damages or dispatch of an incorrect silhouette, governed strictly by our <Link to="/refund-policy" className="underline font-bold text-black">Refund & Cancellation Policy</Link> requiring mandatory continuous unboxing video evidence.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="border-t border-black/10 pt-8">
            <span className="text-[10px] uppercase tracking-[0.3em] text-dark/40 block mb-1">
              Section 06 // Intellectual Property
            </span>
            <h2 className="font-syne font-black text-xl sm:text-2xl uppercase tracking-tight text-dark mb-4">
              6. Intellectual Property & Copyright Protection
            </h2>
            <div className="space-y-3">
              <p>
                All visual assets, graphic designs, typographic compositions, cyber-sigil artworks, photographs, software source code, trademarks, brand insignia, trade dress, and written documentation on this platform are the sole and exclusive intellectual property of SKAUNS APPAREL, safeguarded under the <strong>Copyright Act, 1957</strong> and the <strong>Trade Marks Act, 1999</strong> of India.
              </p>
              <p>
                Any unauthorized downloading, reproduction, reverse engineering, imitation, distribution, commercial exploitation, or creation of derivative works without prior written consent from SKAUNS APPAREL is strictly forbidden and subject to civil litigation and criminal copyright prosecution.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="border-t border-black/10 pt-8">
            <span className="text-[10px] uppercase tracking-[0.3em] text-dark/40 block mb-1">
              Section 07 // Legal Liability
            </span>
            <h2 className="font-syne font-black text-xl sm:text-2xl uppercase tracking-tight text-dark mb-4">
              7. Limitation of Liability & Indemnification
            </h2>
            <div className="space-y-3">
              <p>
                To the maximum extent permitted under applicable law, SKAUNS APPAREL, its founders, directors, employees, affiliates, and logistics partners shall not be held liable for any indirect, incidental, punitive, or consequential damages arising from the use of, or inability to use, this website or purchased items.
              </p>
              <p>
                In any scenario, the total cumulative liability of SKAUNS APPAREL to any customer for any claim arising out of or related to these Terms of Service or any order shall not exceed the actual monetary amount paid by the customer for the specific product giving rise to such claim.
              </p>
              <p>
                You agree to indemnify, defend, and hold harmless SKAUNS APPAREL from and against any third-party claims, liabilities, damages, and legal expenses arising out of your breach of these Terms or violation of any law.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="border-t border-black/10 pt-8">
            <span className="text-[10px] uppercase tracking-[0.3em] text-dark/40 block mb-1">
              Section 08 // Jurisdiction
            </span>
            <h2 className="font-syne font-black text-xl sm:text-2xl uppercase tracking-tight text-dark mb-4">
              8. Dispute Resolution & Governing Jurisdiction
            </h2>
            <div className="space-y-3">
              <p>
                These Terms of Service and any contractual or non-contractual relationship between the user and SKAUNS APPAREL shall be governed by, construed, and enforced in accordance with the substantive laws of the <strong>Republic of India</strong>, without regard to conflict of law principles.
              </p>
              <p>
                Any dispute, controversy, or claim arising out of or relating to these Terms, including the validity, breach, or termination thereof, shall be subject to the exclusive jurisdiction of the competent civil courts situated at <strong>Faridabad, Haryana, India</strong>.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section className="border-t border-black/10 pt-8">
            <span className="text-[10px] uppercase tracking-[0.3em] text-dark/40 block mb-1">
              Section 09 // Statutory Compliance
            </span>
            <h2 className="font-syne font-black text-xl sm:text-2xl uppercase tracking-tight text-dark mb-4">
              9. Grievance Officer & Statutory Contact
            </h2>
            <div className="space-y-3">
              <p>
                In compliance with the <strong>Information Technology Act, 2000</strong>, the rules made thereunder, and the <strong>Consumer Protection (E-Commerce) Rules, 2020</strong>, the contact details of the designated Grievance Officer for SKAUNS are provided below:
              </p>
              <div className="bg-[#f5f5f3] border border-black/15 p-5 space-y-1.5 text-xs text-dark/80">
                <p><strong>Entity:</strong> SKAUNS APPAREL (Prop. Kartikane Parihar)</p>
                <p><strong>Grievance Redressal Officer:</strong> Kartikane Parihar</p>
                <p><strong>Operating Hub & Address:</strong> Faridabad, Haryana, Republic of India</p>
                <p><strong>Official Help & Grievance Email:</strong> <a href="mailto:skauns.help@gmail.com" className="text-black underline font-bold">skauns.help@gmail.com</a></p>
                <p><strong>Support Helpline:</strong> +91 98710 44291</p>
                <p><strong>Official Instagram:</strong> <a href="https://www.instagram.com/skauns.25" target="_blank" rel="noopener noreferrer" className="text-black underline font-bold">@skauns.25</a></p>
                <p><strong>Working Hours:</strong> Monday through Saturday, 10:00 AM – 6:00 PM IST</p>
                <p><strong>Acknowledgment Time:</strong> Within 48 business hours</p>
                <p><strong>Resolution Horizon:</strong> Within thirty (30) days from the date of receipt of grievance</p>
              </div>
            </div>
          </section>

        </div>

        {/* Bottom Nav Links */}
        <div className="mt-16 pt-8 border-t border-black/10 flex flex-wrap gap-6 text-xs font-mono text-dark/50">
          <Link to="/privacy" className="hover:text-black underline">Privacy Policy →</Link>
          <Link to="/refund-policy" className="hover:text-black underline">Refund & Cancellation Policy →</Link>
          <Link to="/shipping-policy" className="hover:text-black underline">Shipping & Delivery Policy →</Link>
          <Link to="/contact" className="hover:text-black underline">Comms & Dispatch →</Link>
        </div>
      </div>
    </div>
  );
}
