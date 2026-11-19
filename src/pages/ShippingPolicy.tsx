import { Link } from 'react-router-dom';

export default function ShippingPolicy() {
  return (
    <div className="bg-white text-dark min-h-screen pt-28 sm:pt-36 pb-24 relative overflow-hidden">
      {/* Ghost background watermark */}
      <div className="absolute top-20 right-0 pointer-events-none select-none overflow-hidden">
        <span className="font-bebas text-[22vw] text-black/[0.02] leading-none whitespace-nowrap block">
          DISPATCH
        </span>
      </div>

      <div className="max-w-[1100px] mx-auto px-6 sm:px-10 relative z-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs uppercase tracking-widest text-dark/40 mb-8">
          <Link to="/" className="hover:text-black">Home</Link>
          <span>/</span>
          <span className="text-black font-bold">Shipping & Delivery Policy</span>
        </div>

        {/* Header */}
        <div className="border-b border-black/15 pb-8 mb-12">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-[1px] bg-black/20" />
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-dark/40">
              Logistics Infrastructure // Protocol 04
            </p>
          </div>
          <h1 className="font-syne font-black text-3xl sm:text-5xl uppercase tracking-tighter text-dark mb-4">
            Shipping & Delivery Policy
          </h1>
          <div className="flex flex-wrap items-center gap-4 sm:gap-8 font-mono text-xs text-dark/50">
            <span>Coverage: <strong>Pan-India (19,000+ PIN Codes)</strong></span>
            <span>✦</span>
            <span>Hub: <strong>Faridabad, Haryana</strong></span>
            <span>✦</span>
            <span>Entity: <strong>SKAUNS APPAREL (Kartikane Parihar)</strong></span>
          </div>
        </div>

        {/* Logistics Highlights Banner */}
        <div className="bg-[#fafafa] border border-black/15 p-6 sm:p-8 mb-12 font-mono">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="border-b sm:border-b-0 sm:border-r border-black/10 pb-4 sm:pb-0 sm:pr-4">
              <p className="text-[10px] uppercase tracking-widest text-dark/40 mb-1">// DISPATCH WINDOW</p>
              <h3 className="font-syne font-black text-xl text-dark mb-1">24–48 Hours</h3>
              <p className="text-xs text-dark/60">Quality checked, vacuum packed, and handed to national air couriers.</p>
            </div>
            <div className="border-b sm:border-b-0 sm:border-r border-black/10 pb-4 sm:pb-0 sm:pr-4">
              <p className="text-[10px] uppercase tracking-widest text-dark/40 mb-1">// TRANSIT HORIZON</p>
              <h3 className="font-syne font-black text-xl text-dark mb-1">2–7 Business Days</h3>
              <p className="text-xs text-dark/60">Metros 2–4 days; Tier-2 & regional destinations 4–7 business days.</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-dark/40 mb-1">// ZERO FREIGHT TARIFF</p>
              <h3 className="font-syne font-black text-xl text-dark mb-1">100% Free Shipping</h3>
              <p className="text-xs text-dark/60">Complimentary priority air express delivery on every order nationwide.</p>
            </div>
          </div>
        </div>

        {/* Policy Body */}
        <div className="space-y-12 font-mono text-xs sm:text-[13px] leading-relaxed text-dark/75">
          
          {/* Section 1 */}
          <section className="border-t border-black/10 pt-8">
            <span className="text-[10px] uppercase tracking-[0.3em] text-dark/40 block mb-1">
              Section 01 // Geographic Scope
            </span>
            <h2 className="font-syne font-black text-xl sm:text-2xl uppercase tracking-tight text-dark mb-4">
              1. Domestic Delivery Reach
            </h2>
            <div className="space-y-3">
              <p>
                <strong>SKAUNS APPAREL</strong> provides insured domestic logistics across all 28 States and 8 Union Territories of the Republic of India, covering over 19,000+ postal PIN codes through enterprise air express courier partnerships.
              </p>
              <p>
                We do not currently offer automated international checkout; overseas orders require manual coordination with our core operations desk at <a href="mailto:skauns.help@gmail.com" className="underline font-bold text-black">skauns.help@gmail.com</a>.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="border-t border-black/10 pt-8">
            <span className="text-[10px] uppercase tracking-[0.3em] text-dark/40 block mb-1">
              Section 02 // Fulfillment Timelines
            </span>
            <h2 className="font-syne font-black text-xl sm:text-2xl uppercase tracking-tight text-dark mb-4">
              2. Processing & Dispatch Horizons
            </h2>
            <div className="space-y-3">
              <p>
                All confirmed orders undergo double inspection at our central atelier before logistics handover:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-dark/70">
                <li>
                  <strong>Processing Cycle:</strong> Orders are processed and packaged within <strong>24 to 48 business hours</strong> following payment verification. Orders placed on Saturdays after 2:00 PM IST, Sundays, or statutory public holidays are processed on the subsequent business day.
                </li>
                <li>
                  <strong>Estimated In-Transit Horizon:</strong>
                  <ul className="list-none pl-4 pt-1 space-y-1 text-dark/80">
                    <li>✦ <strong>Tier 1 Metros</strong> (Delhi-NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata, Pune, Ahmedabad): <strong>2 to 4 business days</strong>.</li>
                    <li>✦ <strong>Tier 2 & Tier 3 Cities:</strong> <strong>4 to 6 business days</strong>.</li>
                    <li>✦ <strong>North-Eastern States, J&K, & Remote Islands:</strong> <strong>6 to 9 business days</strong>.</li>
                  </ul>
                </li>
              </ul>
              <p className="text-[11px] text-dark/50 italic">
                *Note: Transit estimates are indicative and subject to operational factors including regional weather constraints, airport logistics throughput, or statutory transport checkpoints.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="border-t border-black/10 pt-8">
            <span className="text-[10px] uppercase tracking-[0.3em] text-dark/40 block mb-1">
              Section 03 // Tariffs & COD Terms
            </span>
            <h2 className="font-syne font-black text-xl sm:text-2xl uppercase tracking-tight text-dark mb-4">
              3. Complimentary Shipping & Cash On Delivery (COD) Terms
            </h2>
            <div className="space-y-4">
              <div className="border border-black/15 overflow-hidden">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-[#f2f2f0] border-b border-black/15 text-dark uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-3">Payment Method</th>
                      <th className="p-3">Freight Tariff</th>
                      <th className="p-3">Advance Terms</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/10">
                    <tr>
                      <td className="p-3 font-bold text-dark">Prepaid (Direct UPI)</td>
                      <td className="p-3 font-bold text-emerald-700 uppercase">100% FREE</td>
                      <td className="p-3 text-dark/70">Full payment settled upfront via UPI</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-dark">Cash on Delivery (COD)</td>
                      <td className="p-3 font-bold text-emerald-700 uppercase">100% FREE</td>
                      <td className="p-3 text-dark/70">₹99 Non-Refundable Advance Verification Fee paid upfront via UPI (deducted from balance payable at delivery)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-[#fafafa] border border-black/15 p-4 text-xs space-y-2">
                <p className="font-bold text-black">// COD Advance Verification Protocol:</p>
                <p>
                  To eliminate bogus/fraudulent orders and verify authentic delivery coordinates, Cash on Delivery (COD) orders require a <strong>mandatory ₹99 non-refundable advance commitment fee</strong> payable upfront via UPI before order dispatch.
                </p>
                <p>
                  <strong>How the ₹99 is adjusted:</strong> The ₹99 advance fee is strictly deducted from your actual invoice value. For example, if your order total is ₹1,099 for a boxy tee, you pay ₹99 via UPI during checkout, and pay only the remaining balance of ₹1,000 in cash to the courier rider upon delivery.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="border-t border-black/10 pt-8">
            <span className="text-[10px] uppercase tracking-[0.3em] text-dark/40 block mb-1">
              Section 04 // Courier Partners
            </span>
            <h2 className="font-syne font-black text-xl sm:text-2xl uppercase tracking-tight text-dark mb-4">
              4. Logistics Infrastructure & Courier Partners
            </h2>
            <div className="space-y-3">
              <p>
                We do not utilize generic postal options. All shipments are managed via enterprise courier integrations through tier-1 national logistics providers, including:
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                {['Blue Dart Express', 'Delhivery Express', 'Shadowfax', 'Xpressbees', 'DTDC Air'].map((partner) => (
                  <span key={partner} className="bg-[#fafafa] border border-black/15 px-3 py-1 font-bold text-dark">
                    ✦ {partner}
                  </span>
                ))}
              </div>
              <p>
                The optimal courier partner is dynamically assigned based on real-time PIN code routing performance to guarantee the fastest transit time.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="border-t border-black/10 pt-8">
            <span className="text-[10px] uppercase tracking-[0.3em] text-dark/40 block mb-1">
              Section 05 // Order Tracking
            </span>
            <h2 className="font-syne font-black text-xl sm:text-2xl uppercase tracking-tight text-dark mb-4">
              5. Dispatch Notification & Real-Time Tracking
            </h2>
            <div className="space-y-3">
              <p>
                The moment your parcel is scanned and manifested at our dispatch hub:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-dark/70">
                <li>An automated electronic dispatch cipher containing your <strong>Airway Bill (AWB) number</strong> and direct tracking URL is sent to your registered email and SMS.</li>
                <li>Tracking data typically activates within 12 hours of courier pickup as the parcel passes through the primary airport sorting facility.</li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section className="border-t border-black/10 pt-8">
            <span className="text-[10px] uppercase tracking-[0.3em] text-dark/40 block mb-1">
              Section 06 // Security & Packaging
            </span>
            <h2 className="font-syne font-black text-xl sm:text-2xl uppercase tracking-tight text-dark mb-4">
              6. Tamper-Evident Armor Packaging
            </h2>
            <div className="space-y-3">
              <p>
                To maintain collector integrity and garment hygiene, every SKAUNS piece is encased in:
              </p>
              <ol className="list-decimal pl-5 space-y-1.5 text-dark/70">
                <li>An interior heavy-gauge transparent vacuum polybag safeguarding fabric fibers against moisture, humidity, and atmospheric dust.</li>
                <li>An exterior industrial-grade, puncture-resistant, carbon black tamper-evident courier flyer with high-security irreversible adhesive strips.</li>
              </ol>
              <p className="bg-[#fff8f8] p-4 border border-red-900/20 text-red-950 font-bold">
                CRITICAL: If the outer courier flyer exhibits visible cuts, tears, re-taping, or severe damage upon delivery, REJECT the parcel immediately from the courier rider and photograph the damaged package.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="border-t border-black/10 pt-8">
            <span className="text-[10px] uppercase tracking-[0.3em] text-dark/40 block mb-1">
              Section 07 // Delivery Failure
            </span>
            <h2 className="font-syne font-black text-xl sm:text-2xl uppercase tracking-tight text-dark mb-4">
              7. Non-Delivery, Failed Attempts & RTO
            </h2>
            <div className="space-y-3">
              <p>
                Our courier partners will make up to <strong>three (3) consecutive delivery attempts</strong> before initiating Return to Origin (RTO).
              </p>
              <p>
                Customers are required to provide complete and accurate delivery coordinates, including landmark, building name, flat number, and an active operational phone number. SKAUNS is not liable for delayed or aborted deliveries resulting from incomplete addresses or uncontactable recipients.
              </p>
              <p>
                In the event a parcel is returned to our atelier as RTO due to customer unavailability, refusal of delivery, or incorrect address, a re-dispatch fee of <strong>₹250</strong> will be charged prior to re-attempting delivery.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="border-t border-black/10 pt-8">
            <span className="text-[10px] uppercase tracking-[0.3em] text-dark/40 block mb-1">
              Section 08 // Force Majeure
            </span>
            <h2 className="font-syne font-black text-xl sm:text-2xl uppercase tracking-tight text-dark mb-4">
              8. Force Majeure & Exceptional Delays
            </h2>
            <div className="space-y-3">
              <p>
                SKAUNS APPAREL shall not be held liable for failure or delay in logistics delivery caused by events beyond our reasonable control, including natural disasters, cyclones, floods, strikes, curfews, civil unrest, regional lockdowns, or national supply-chain blockades. In such scenarios, dispatch updates will be broadcast via email.
              </p>
            </div>
          </section>

        </div>

        {/* Bottom Nav Links */}
        <div className="mt-16 pt-8 border-t border-black/10 flex flex-wrap gap-6 text-xs font-mono text-dark/50">
          <Link to="/terms" className="hover:text-black underline">Terms of Service →</Link>
          <Link to="/privacy" className="hover:text-black underline">Privacy Policy →</Link>
          <Link to="/refund-policy" className="hover:text-black underline">Refund & Cancellation Policy →</Link>
          <Link to="/contact" className="hover:text-black underline">Comms & Dispatch →</Link>
        </div>
      </div>
    </div>
  );
}
