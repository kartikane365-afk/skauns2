import { useState } from 'react';
import { Link } from 'react-router-dom';
import { dispatchContactInquiryToAdmin } from '../services/adminDispatcher';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: 'order', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void dispatchContactInquiryToAdmin(form);
    setSubmitted(true);
  };

  return (
    <div className="bg-white text-dark min-h-screen pt-28 sm:pt-36 pb-24 relative overflow-hidden">
      {/* Ghost background watermark */}
      <div className="absolute top-20 right-0 pointer-events-none select-none overflow-hidden">
        <span className="font-bebas text-[28vw] text-black/[0.02] leading-none whitespace-nowrap block">
          COMMS
        </span>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 relative z-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs uppercase tracking-widest text-dark/40 mb-8">
          <Link to="/" className="hover:text-black">Home</Link>
          <span>/</span>
          <span className="text-black font-bold">Comms & Dispatch</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Comms Info */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-[1px] bg-black/20" />
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-dark/40">
                  Syndicate Dispatch // Sector 01
                </p>
              </div>

              <h1 className="font-syne font-black text-4xl sm:text-6xl uppercase tracking-tighter text-dark mb-6">
                Transmit a Signal
              </h1>

              <p className="font-mono text-xs sm:text-sm text-dark/65 leading-relaxed mb-10 max-w-md">
                Inquiries concerning order tracking, drop timelines, sizing measurements, or press allocations are reviewed directly by our core operations team.
              </p>

              <div className="space-y-6 font-mono text-xs border-t border-black/10 pt-8">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-dark/40 mb-1">// DIRECT FREQUENCY</p>
                  <a
                    href="mailto:skauns.help@gmail.com"
                    className="text-base sm:text-lg font-bold text-dark hover:underline block"
                  >
                    skauns.help@gmail.com
                  </a>
                  <p className="text-dark/40 text-[10px] mt-0.5">Official Help & Support: Under 6 hours response</p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-widest text-dark/40 mb-1">// TELEPHONE & HELPLINE</p>
                  <p className="text-base font-bold text-dark">+91 98710 44291</p>
                  <p className="text-dark/40 text-[10px] mt-0.5">Hours: Monday to Saturday, 10:00 AM – 6:00 PM IST</p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-widest text-dark/40 mb-1">// REGISTERED OPERATIONAL HUB</p>
                  <p className="font-bold text-dark">SKAUNS APPAREL (Kartikane Parihar)</p>
                  <p className="text-dark/70">Faridabad, Haryana, Republic of India</p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-widest text-dark/40 mb-1">// STATUTORY GRIEVANCE CELL</p>
                  <p className="font-bold text-dark">Kartikane Parihar</p>
                  <p className="text-dark/70 text-[11px]">Designated Grievance Redressal Officer</p>
                  <p className="text-dark/70">Email: <a href="mailto:skauns.help@gmail.com" className="underline font-bold text-black">skauns.help@gmail.com</a></p>
                  <p className="text-dark/70">Jurisdiction: Faridabad, Haryana, India</p>
                  <p className="text-dark/40 text-[10px] mt-0.5">Statutory compliance under Consumer Protection (E-Commerce) Rules, 2020</p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-widest text-dark/40 mb-1">// TRANSMISSION NETWORKS</p>
                  <div className="flex flex-wrap gap-5 text-dark/70">
                    <a
                      href="https://www.instagram.com/skauns.25"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-black uppercase tracking-wider text-[11px] underline underline-offset-4 font-bold text-black"
                    >
                      Instagram (@skauns.25) ↗
                    </a>
                    {['TikTok', 'Twitter / X', 'Discord'].map((platform) => (
                      <a
                        key={platform}
                        href="https://www.instagram.com/skauns.25"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-black uppercase tracking-wider text-[11px] underline underline-offset-4"
                      >
                        {platform}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 p-4 bg-[#fafafa] border border-black/10 font-mono text-[10px] text-dark/50 space-y-1">
              <p className="font-bold uppercase tracking-wider text-dark">✦ Discretion Policy</p>
              <p>All transactions, transmissions, and shipping data are encrypted under strict syndicate discretion.</p>
            </div>
          </div>

          {/* Right Column: Transmission Form */}
          <div className="lg:col-span-7 bg-[#fafafa] border border-black/15 p-8 sm:p-12">
            {submitted ? (
              <div className="py-16 text-center font-mono">
                <div className="w-16 h-16 rounded-full border-2 border-black flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  ✓
                </div>
                <p className="text-[10px] uppercase tracking-widest text-dark/40 mb-1">Status: Encrypted & Logged</p>
                <h3 className="font-syne font-black text-2xl uppercase tracking-tight text-dark mb-3">
                  Transmission Received
                </h3>
                <p className="text-xs sm:text-sm text-dark/60 max-w-sm mx-auto mb-8 leading-relaxed">
                  Your message has entered our queue. A syndicate dispatch officer will respond to <span className="text-black font-bold">{form.email || 'your email'}</span> within 6–12 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: '', email: '', subject: 'order', message: '' });
                  }}
                  className="bg-black text-white px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-black/80 transition-colors"
                >
                  Transmit Another Cipher
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 font-mono text-xs">
                <div className="border-b border-black/10 pb-4 mb-2">
                  <h2 className="font-syne font-black text-lg uppercase tracking-tight text-dark">
                    Transmission Terminal
                  </h2>
                  <p className="text-dark/40 text-[10px] uppercase tracking-wider mt-0.5">
                    Fill all coordinates to transmit
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block uppercase tracking-wider text-dark/60 text-[10px] mb-2 font-bold">
                      Designation / Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Alex Ward"
                      className="w-full bg-white border border-black/15 px-4 py-3 text-xs text-dark placeholder:text-dark/25 focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-wider text-dark/60 text-[10px] mb-2 font-bold">
                      Return Cipher / Email *
                    </label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="e.g. name@domain.com"
                      className="w-full bg-white border border-black/15 px-4 py-3 text-xs text-dark placeholder:text-dark/25 focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-dark/60 text-[10px] mb-2 font-bold">
                    Transmission Topic *
                  </label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full bg-white border border-black/15 px-4 py-3 text-xs text-dark focus:outline-none focus:border-black uppercase font-mono"
                  >
                    <option value="order">Order Tracking & Allocation Status</option>
                    <option value="sizing">Silhouette Fit & Size Consultation</option>
                    <option value="returns">Exchange & Damage Protocol</option>
                    <option value="collab">Syndicate Creative Collab</option>
                    <option value="other">General Dispatch Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-dark/60 text-[10px] mb-2 font-bold">
                    Message Cipher *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Enter message details or order reference..."
                    className="w-full bg-white border border-black/15 px-4 py-3 text-xs text-dark placeholder:text-dark/25 focus:outline-none focus:border-black resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white py-4 font-mono text-xs uppercase tracking-[0.25em] font-bold hover:bg-black/85 transition-colors shadow-md cursor-pointer"
                >
                  Send Transmission →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
