import { Link } from 'react-router-dom';

export default function RefundPolicy() {
  return (
    <div className="bg-white text-dark min-h-screen pt-28 sm:pt-36 pb-24 relative overflow-hidden">
      {/* Ghost background watermark */}
      <div className="absolute top-20 right-0 pointer-events-none select-none overflow-hidden">
        <span className="font-bebas text-[22vw] text-black/[0.02] leading-none whitespace-nowrap block">
          REFUND
        </span>
      </div>

      <div className="max-w-[1100px] mx-auto px-6 sm:px-10 relative z-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs uppercase tracking-widest text-dark/40 mb-8">
          <Link to="/" className="hover:text-black">Home</Link>
          <span>/</span>
          <span className="text-black font-bold">Refund & Cancellation Policy</span>
        </div>

        {/* Header */}
        <div className="border-b border-black/15 pb-8 mb-12">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-[1px] bg-black/20" />
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-dark/40">
              Commerce Directive // Protocol 03
            </p>
          </div>
          <h1 className="font-syne font-black text-3xl sm:text-5xl uppercase tracking-tighter text-dark mb-4">
            Refund & Cancellation Policy
          </h1>
          <div className="flex flex-wrap items-center gap-4 sm:gap-8 font-mono text-xs text-dark/50">
            <span>Policy Status: <strong>Strict All-Sales-Final</strong></span>
            <span>✦</span>
            <span>Hub: <strong>Faridabad, Haryana</strong></span>
            <span>✦</span>
            <span>Entity: <strong>SKAUNS APPAREL (Kartikane Parihar)</strong></span>
          </div>
        </div>

        {/* Core Strict Policy Notice */}
        <div className="bg-[#0a0a0a] text-white p-6 sm:p-8 mb-12 font-mono border border-black shadow-lg">
          <div className="flex items-center gap-3 mb-3 text-red-400 text-xs uppercase tracking-[0.3em] font-bold">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Strict Limited Archive Drop Directive
          </div>
          <h2 className="font-syne font-black text-xl sm:text-2xl uppercase tracking-tight mb-3">
            All Sales Are Strictly Final
          </h2>
          <p className="text-white/70 text-xs sm:text-[13px] leading-relaxed mb-4">
            Due to the small-batch, limited-run collector nature of SKAUNS garments (Heavyweight 240 GSM Boxy Tees, 240 GSM Cotton Blend Knit Waffles, and Pure Cotton 360 GSM Hoodies), <strong>we do not accept returns, exchanges, or cancellations under standard consumer preference or remorse</strong>.
          </p>
          <div className="text-[11px] text-white/50 border-t border-white/10 pt-3 flex flex-wrap gap-x-6 gap-y-1">
            <span>✦ Zero Returns For Sizing Errors</span>
            <span>✦ Zero Cancellations Post-Allocation</span>
            <span>✦ Mandatory Unboxing Video For Transit Claims</span>
          </div>
        </div>

        {/* Policy Body */}
        <div className="space-y-12 font-mono text-xs sm:text-[13px] leading-relaxed text-dark/75">
          
          {/* Section 1 */}
          <section className="border-t border-black/10 pt-8">
            <span className="text-[10px] uppercase tracking-[0.3em] text-dark/40 block mb-1">
              Section 01 // Return Stance
            </span>
            <h2 className="font-syne font-black text-xl sm:text-2xl uppercase tracking-tight text-dark mb-4">
              1. Non-Returnable & Non-Exchangeable Silhouettes
            </h2>
            <div className="space-y-3">
              <p>
                Each piece released under SKAUNS is custom-milled, numbered, and vacuum-sealed upon quality clearance. Once a garment leaves our dispatch atelier, it cannot be restocked or re-issued to another patron.
              </p>
              <p className="font-bold text-dark">
                We strictly decline return or exchange requests predicated on any of the following grounds:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-dark/70">
                <li>
                  <strong>Sizing or Fit Dissatisfaction:</strong> All our cuts feature a signature architectural oversized boxy drape. Complete garment measurements (chest width, body length, sleeve drape) are transparently detailed on each product page and within our <Link to="/#fit-advisor" className="underline font-bold text-black">Interactive Fit Advisor</Link>. Selecting an incorrect size is solely the patron&apos;s responsibility.
                </li>
                <li>
                  <strong>Change of Mind or Subjective Dislike:</strong> We do not offer returns because a customer no longer desires the garment or prefers a different aesthetic.
                </li>
                <li>
                  <strong>Fabric Nuances & Natural Bio-Wash Variations:</strong> Minor tonal gradations, vintage distressed washes, and micro-textural features inherent to heavy 240–360 GSM organic cotton and cotton blend knits are deliberate design traits and do not constitute flaws.
                </li>
                <li>
                  <strong>Worn, Washed, or Altered Garments:</strong> Any item that has been worn, laundered, stained, altered, sprayed with perfume/cologne, or stripped of its brutalist tags or security barcode seals is permanently ineligible for any claim.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="border-t border-black/10 pt-8">
            <span className="text-[10px] uppercase tracking-[0.3em] text-dark/40 block mb-1">
              Section 02 // Cancellation Policy
            </span>
            <h2 className="font-syne font-black text-xl sm:text-2xl uppercase tracking-tight text-dark mb-4">
              2. Strict Order Cancellation Protocol
            </h2>
            <div className="space-y-3">
              <p>
                Upon completion of digital checkout, our automated ERP immediately commits the allocated unit from physical inventory and generates automated manifests for logistics processing.
              </p>
              <div className="bg-[#fafafa] border border-black/15 p-4 space-y-2">
                <p className="font-bold text-black">
                  // Zero-Tolerance Cancellation Rule:
                </p>
                <p>
                  Orders cannot be cancelled, diverted, or modified once confirmed. Please review your bag thoroughly prior to clicking &ldquo;Proceed to Allocation&rdquo;.
                </p>
                <p className="text-[11px] text-dark/60">
                  <strong>Emergency Window (Pre-Fulfillment Only):</strong> In exceptional circumstances, a cancellation request transmitted within strictly <strong>sixty (60) minutes</strong> of checkout may be evaluated, provided warehouse packing has not commenced. Approved emergency cancellations are subject to a mandatory <strong>5% non-refundable gateway processing charge</strong> (levied by acquiring banks), with the net balance refunded as a non-expiring SKAUNS Syndicate Store Credit.
                </p>
                <p className="text-[11px] text-dark/70 border-t border-black/10 pt-2 font-bold">
                  <strong>Non-Refundable COD Advance Verification Fee:</strong> The ₹99 advance fee paid upfront via UPI for Cash on Delivery orders covers carrier allocation manifests and address verification. This fee is strictly non-refundable under all customer-initiated cancellations or delivery rejections.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="border-t border-black/10 pt-8">
            <span className="text-[10px] uppercase tracking-[0.3em] text-dark/40 block mb-1">
              Section 03 // Statutory Exemption
            </span>
            <h2 className="font-syne font-black text-xl sm:text-2xl uppercase tracking-tight text-dark mb-4">
              3. Defective, Damaged in Transit, or Incorrect Item Claims
            </h2>
            <div className="space-y-3">
              <p>
                In strict compliance with the <strong>Consumer Protection (E-Commerce) Rules, 2020</strong>, SKAUNS provides an avenue for resolution if and only if an item arrives physically torn/defective from manufacturing, destroyed in transit, or if an incorrect silhouette/size was dispatched contrary to your verified order manifest.
              </p>
              
              {/* Mandatory Video Requirement Card */}
              <div className="bg-[#fff8f8] border-2 border-red-900/30 p-5 space-y-3 text-red-950">
                <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-xs text-red-800">
                  <span>📹</span> Mandatory Proof Requirement: Continuous Unboxing Video
                </div>
                <p className="text-xs leading-relaxed">
                  To eliminate fraudulent substitution claims and ensure legitimate protection, an exchange claim WILL ONLY BE PROCESSED IF accompanied by an <strong>unbroken, uncut, continuous video recording</strong> of the parcel opening, adhering strictly to the following criteria:
                </p>
                <ol className="list-decimal pl-5 space-y-1.5 text-[11px]">
                  <li>The video must begin showing the sealed, undamaged outer courier flyer with the printed Airway Bill (AWB) label and tracking barcode clearly visible and legible.</li>
                  <li>The opening of the outer courier tamper seal must be captured live on camera without any interruption, cut, pause, transition, or edit.</li>
                  <li>The extraction of the garment from its secondary vacuum packaging and immediate clear camera close-up of the specific structural tear or defect must be recorded continuously.</li>
                  <li>Any video recorded after the outer parcel has already been sliced, opened, re-taped, or tampered with will be <strong>summarily rejected without appeal</strong>.</li>
                </ol>
              </div>

              <div className="space-y-2 pt-2">
                <p className="font-bold text-dark">// Strict Notification Window:</p>
                <p>
                  Any transit damage or dispatch error must be formally reported to Comms at <a href="mailto:skauns.help@gmail.com" className="underline font-bold text-black">skauns.help@gmail.com</a> within strictly <strong>twenty-four (24) hours</strong> (and no later than forty-eight (48) hours) of the delivery timestamp officially recorded by our courier partner. Claims lodged after this 48-hour cut-off are irrevocably time-barred.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="border-t border-black/10 pt-8">
            <span className="text-[10px] uppercase tracking-[0.3em] text-dark/40 block mb-1">
              Section 04 // Resolution Protocol
            </span>
            <h2 className="font-syne font-black text-xl sm:text-2xl uppercase tracking-tight text-dark mb-4">
              4. Replacement & Store Credit Resolution
            </h2>
            <div className="space-y-3">
              <p>
                Upon receipt of the valid unboxing footage and preliminary verification by our quality inspection cell:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-dark/70">
                <li>
                  <strong>Reverse Courier Pickup:</strong> We will arrange a secure reverse logistics courier pickup from your delivery address at no cost to you. The garment must be repackaged with all brutalist tags, barcode cards, and original polybags.
                </li>
                <li>
                  <strong>Physical Inspection:</strong> Upon arrival at our atelier, the garment undergoes laboratory inspection. If the defect is verified as genuine manufacturing/transit damage, we will immediately dispatch a pristine replacement of the identical silhouette and size.
                </li>
                <li>
                  <strong>Archive Exhaustion / Sold-Out Pieces:</strong> If the silhouette is permanently exhausted and cannot be replaced due to limited batch depletion, a <strong>non-expiring SKAUNS Store Credit Voucher</strong> equivalent to 100% of the purchased item value will be issued to your registered email address.
                </li>
                <li>
                  <strong>No Cash/Bank Reversals:</strong> As an ultra-exclusive streetwear atelier, monetary cash or bank account refunds are strictly not offered under any circumstances.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section className="border-t border-black/10 pt-8">
            <span className="text-[10px] uppercase tracking-[0.3em] text-dark/40 block mb-1">
              Section 05 // Logistics Failures
            </span>
            <h2 className="font-syne font-black text-xl sm:text-2xl uppercase tracking-tight text-dark mb-4">
              5. Undelivered Shipments & RTO Deductions
            </h2>
            <div className="space-y-3">
              <p>
                If a shipment is designated as Return to Origin (RTO) due to customer-side failure (including incorrect/incomplete address, unserviceable phone number, or rejection of delivery after 3 documented delivery attempts by our national courier partner):
              </p>
              <p>
                A standard logistics re-shipping and restocking deduction of <strong>₹250</strong> will be applied. The residual amount will be converted into a store credit voucher. Reshipment will only occur upon receipt of updated verified coordinates and settlement of the re-dispatch fee.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="border-t border-black/10 pt-8">
            <span className="text-[10px] uppercase tracking-[0.3em] text-dark/40 block mb-1">
              Section 06 // Escalation Desk
            </span>
            <h2 className="font-syne font-black text-xl sm:text-2xl uppercase tracking-tight text-dark mb-4">
              6. How to File an Official Defect Claim
            </h2>
            <div className="bg-[#f5f5f3] border border-black/15 p-5 space-y-2 text-xs">
              <p>To initiate a verified transit or defect inspection, transmit an email to:</p>
              <p className="text-base font-bold text-black font-mono">skauns.help@gmail.com</p>
              <p className="text-dark/60">Include the following required information in your subject and body:</p>
              <ul className="list-disc pl-5 text-dark/70 space-y-1">
                <li>Subject: <strong>CLAIM: [Your Order ID: SKN-XXXXXX] - Defect Report</strong></li>
                <li>Clear description of the manufacturing structural fault</li>
                <li>Cloud link (Google Drive / WeTransfer) or attachment of the uninterrupted unboxing video</li>
                <li>High-resolution close-up photographs of the AWB courier label and defective area</li>
              </ul>
              <p className="text-[11px] text-dark/50 pt-2 border-t border-black/10">
                Turnaround SLA: All legitimate claims are acknowledged within 24 hours of transmission.
              </p>
            </div>
          </section>

        </div>

        {/* Bottom Nav Links */}
        <div className="mt-16 pt-8 border-t border-black/10 flex flex-wrap gap-6 text-xs font-mono text-dark/50">
          <Link to="/terms" className="hover:text-black underline">Terms of Service →</Link>
          <Link to="/privacy" className="hover:text-black underline">Privacy Policy →</Link>
          <Link to="/shipping-policy" className="hover:text-black underline">Shipping & Delivery Policy →</Link>
          <Link to="/contact" className="hover:text-black underline">Comms & Dispatch →</Link>
        </div>
      </div>
    </div>
  );
}
