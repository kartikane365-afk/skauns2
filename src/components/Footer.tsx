import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { playTactileClick } from '../utils/audio';

export default function Footer() {
  const { products, categories } = useStore();
  const handleAnchorClick = (path: string) => {
    playTactileClick();
    if (path.includes('#')) {
      const targetId = path.split('#')[1];
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const shopLinks = [
    { name: `Shop All (${products.length} Cuts)`, path: '/collection' },
    ...categories.map((cat) => ({
      name: `${cat.name} (${products.filter((p) => p.category === cat.id).length})`,
      path: `/collection?category=${encodeURIComponent(cat.id)}`,
    })),
  ];

  const infoLinks = [
    { name: 'Fit Advisor (Size Guide)', path: '/#fit-advisor' },
    { name: 'The Manifesto', path: '/about' },
    { name: 'Direct Comms Desk', path: '/contact' },
    { name: 'Syndicate Bag', path: '/cart' },
  ];

  const legalLinks = [
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Refund & Cancellation', path: '/refund-policy' },
    { name: 'Shipping & Delivery', path: '/shipping-policy' },
  ];
  return (
    <footer className="bg-white text-dark relative overflow-hidden">
      {/* Top border accent */}
      <div className="w-full h-[1px] bg-black/[0.07]" />

      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 pt-20 sm:pt-28 pb-8 relative z-10">
        {/* Top section — Logo + tagline */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-12 mb-16 sm:mb-20">
          <div className="max-w-xs">
            <Link to="/" className="inline-block mb-5 group">
              <img
                src="/logo.png"
                alt="SKAUNS"
                className="h-8 sm:h-9 w-auto object-contain invert group-hover:opacity-55 transition-opacity duration-400"
              />
            </Link>
            <p className="font-mono text-dark/28 text-xs leading-[1.9]">
              Modern silhouette. Brutalist individuality.<br />
              Engineered for those who reject the ordinary.
            </p>
            <p className="font-mono text-dark/40 text-[11px] mt-2">
              Help: <a href="mailto:skauns.help@gmail.com" className="underline hover:text-black font-bold">skauns.help@gmail.com</a>
            </p>
            {/* Tiny social icons row */}
            <div className="flex gap-5 mt-6">
              <a
                href="https://www.instagram.com/skauns.25"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] uppercase tracking-[0.25em] text-dark/30 hover:text-dark transition-colors duration-300 link-underline font-bold"
              >
                IG
              </a>
              <a
                href="https://www.instagram.com/skauns.25"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] uppercase tracking-[0.25em] text-dark/30 hover:text-dark transition-colors duration-300 link-underline"
              >
                TK
              </a>
              <a
                href="https://www.instagram.com/skauns.25"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] uppercase tracking-[0.25em] text-dark/30 hover:text-dark transition-colors duration-300 link-underline"
              >
                TW
              </a>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 sm:gap-12">
            <div>
              <h4 className="font-mono text-[9px] uppercase tracking-[0.35em] text-dark/22 mb-5">Shop</h4>
              <ul className="flex flex-col gap-3">
                {shopLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      onClick={() => handleAnchorClick(item.path)}
                      className="font-mono text-xs text-dark/45 hover:text-dark transition-colors duration-300 link-underline"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-mono text-[9px] uppercase tracking-[0.35em] text-dark/22 mb-5">Info</h4>
              <ul className="flex flex-col gap-3">
                {infoLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      onClick={() => handleAnchorClick(item.path)}
                      className="font-mono text-xs text-dark/45 hover:text-dark transition-colors duration-300 link-underline"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-mono text-[9px] uppercase tracking-[0.35em] text-dark/22 mb-5">Legal & Policies</h4>
              <ul className="flex flex-col gap-3">
                {legalLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      onClick={() => handleAnchorClick(item.path)}
                      className="font-mono text-xs text-dark/45 hover:text-dark transition-colors duration-300 link-underline"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-mono text-[9px] uppercase tracking-[0.35em] text-dark/22 mb-5">Social</h4>
              <ul className="flex flex-col gap-3">
                <li>
                  <a
                    href="https://www.instagram.com/skauns.25"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-dark hover:text-black transition-colors duration-300 link-underline font-bold"
                  >
                    Instagram (@skauns.25) ↗
                  </a>
                </li>
                {['TikTok', 'Twitter / X', 'Discord'].map((s) => (
                  <li key={s}>
                    <a
                      href="https://www.instagram.com/skauns.25"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-dark/45 hover:text-dark transition-colors duration-300 link-underline"
                    >
                      {s}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Payment Gateways & Compliance Trust Bar */}
        <div className="py-6 border-t border-black/[0.06] flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-3 text-dark/40 text-[10px] uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Encrypted 256-Bit SSL Checkout // PCI-DSS Level 1 Compliant</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-dark/50 uppercase tracking-widest">
            <span className="border border-black/10 px-2 py-0.5 bg-[#fafafa]">UPI</span>
            <span className="border border-black/10 px-2 py-0.5 bg-[#fafafa]">RuPay</span>
            <span className="border border-black/10 px-2 py-0.5 bg-[#fafafa]">Visa</span>
            <span className="border border-black/10 px-2 py-0.5 bg-[#fafafa]">Mastercard</span>
            <span className="border border-black/10 px-2 py-0.5 bg-[#fafafa]">NetBanking</span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-5 border-t border-black/[0.06] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-mono text-dark/30 text-[9px] tracking-[0.25em] uppercase">
            © 2026 SKAUNS APPAREL (Kartikane Parihar). Faridabad, Haryana, Republic of India.
          </p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 font-mono text-[9px] text-dark/40 uppercase tracking-[0.25em]">
            <Link to="/privacy" className="hover:text-black transition-colors duration-300">Privacy</Link>
            <span>✦</span>
            <Link to="/terms" className="hover:text-black transition-colors duration-300">Terms</Link>
            <span>✦</span>
            <Link to="/refund-policy" className="hover:text-black transition-colors duration-300">Refund Policy</Link>
            <span>✦</span>
            <Link to="/shipping-policy" className="hover:text-black transition-colors duration-300">Shipping</Link>
          </div>
        </div>
      </div>

      {/* Running marquee at very bottom */}
      <div className="w-full bg-black mt-8 py-2.5 overflow-hidden">
        <div className="marquee flex w-max whitespace-nowrap font-mono text-[10px] sm:text-xs text-white/25 uppercase tracking-[0.3em]">
          {Array(8).fill(null).map((_, i) => (
            <span key={i} className="px-8">SKAUNS 2026 ✦ DESTROY THE NORM ✦ SS26 DROP ✦ AVANT STREETWEAR ✦</span>
          ))}
        </div>
      </div>
    </footer>
  );
}
