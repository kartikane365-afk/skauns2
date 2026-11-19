import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { playTactileClick } from '../utils/audio';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { pathname, key, hash } = useLocation();
  const { totalItems, setIsOpen: setCartOpen } = useCart();
  const { products, categories } = useStore();
  const { user, isAdmin } = useAuth();

  const totalCount = products.length;

  // Close menu on route change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setIsOpen(false); }, [pathname, key]);

  // Handle smooth hash anchor navigation
  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 60);
      }
    }
  }, [pathname, hash]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      const el = document.documentElement;
      const progress = (window.scrollY / (el.scrollHeight - el.clientHeight)) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleLinkClick = (path: string) => {
    playTactileClick();
    setIsOpen(false);
    if (path.includes('#')) {
      const hashPart = path.split('#')[1];
      if (pathname === '/' || path.startsWith('/#')) {
        const el = document.getElementById(hashPart);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  const primaryMenuItems = [
    {
      name: 'Shop All',
      path: '/collection',
      subtitle: `All ${totalCount} Silhouettes Archived`,
      badge: `${totalCount} PIECES`,
      num: '01',
    },
    ...categories.map((cat, idx) => {
      const count = products.filter((p) => p.category === cat.id).length;
      return {
        name: cat.navLabel || `Shop ${cat.name}`,
        path: `/collection?category=${encodeURIComponent(cat.id)}`,
        subtitle: cat.subtitle,
        badge: `${String(count).padStart(2, '0')} CUTS`,
        num: String(idx + 2).padStart(2, '0'),
      };
    }),
    {
      name: 'Fit Advisor',
      path: '/#fit-advisor',
      subtitle: 'Interactive Sizing & Drape Matrix',
      badge: 'MATRIX',
      num: String(categories.length + 2).padStart(2, '0'),
    },
  ];

  const otherMenuItems = [
    ...(isAdmin
      ? [
          {
            name: '⚡ Admin Control Studio',
            path: '/admin',
            subtitle: 'Manage Products, Categories, Banners & Hero Slides',
          },
        ]
      : []),
    ...(user
      ? [
          {
            name: `Account (${user.fullName.split(' ')[0]})`,
            path: '/account',
            subtitle: 'View Profile & Verified Order Codes',
          },
        ]
      : [
          {
            name: 'Login / Register',
            path: '/login',
            subtitle: 'Member Sign In & New Account Registration',
          },
        ]),
    {
      name: 'Manifesto & Origin',
      path: '/about',
      subtitle: 'Syndicate Doctrine & Principles',
    },
    {
      name: 'Comms Direct Desk',
      path: '/contact',
      subtitle: 'Helpline & Grievance Protocol',
    },
    {
      name: 'Legal & Policies',
      path: '/terms',
      subtitle: 'Terms, Privacy & Strict Refund Policy',
    },
    {
      name: 'Syndicate Bag',
      path: '/cart',
      subtitle: `${totalItems} Silhouettes Allocated`,
    },
  ];

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-black/[0.08] shadow-[0_1px_24px_rgba(0,0,0,0.04)]'
            : 'bg-white sm:bg-transparent border-b border-black/[0.04] sm:border-transparent'
        }`}
      >
        {/* Scroll progress bar */}
        <div
          className="absolute bottom-0 left-0 h-[1.5px] bg-black/60 transition-all duration-100 ease-linear"
          style={{ width: `${scrollProgress}%` }}
        />

        <div className="max-w-[1400px] mx-auto grid grid-cols-3 items-center px-6 py-4 sm:py-5 sm:px-10">
          
          {/* Left: Clean, uncluttered essential links */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              to="/collection"
              onClick={() => playTactileClick()}
              className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.22em] text-dark/80 hover:text-dark transition-all duration-300 link-underline hidden sm:inline-block font-bold"
            >
              Shop All
            </Link>
            <Link
              to="/#fit-advisor"
              onClick={() => handleLinkClick('/#fit-advisor')}
              className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.22em] text-dark/60 hover:text-dark transition-all duration-300 link-underline hidden md:inline-block"
            >
              Fit Advisor
            </Link>
          </div>

          {/* Center — Logo */}
          <div className="flex justify-center items-center">
            <Link to="/" className="flex items-center justify-center group" aria-label="SKAUNS Home">
              <img
                src="/logo.png"
                alt="SKAUNS"
                className="h-8 sm:h-10 w-auto object-contain invert group-hover:opacity-65 transition-all duration-300"
              />
            </Link>
          </div>

          {/* Right — Auth, Bag and Menu Trigger */}
          <div className="flex justify-end items-center gap-3 sm:gap-5">
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => playTactileClick()}
                className="bg-black text-white font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.2em] px-2.5 py-1.5 font-bold hover:bg-black/80 transition-colors shadow-sm"
              >
                ⚡ Admin
              </Link>
            )}

            {user ? (
              <Link
                to="/account"
                onClick={() => playTactileClick()}
                className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.18em] text-dark/80 hover:text-black font-bold hidden sm:inline-block link-underline"
              >
                {user.fullName.split(' ')[0]}
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => playTactileClick()}
                className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.18em] text-dark/80 hover:text-black font-bold hidden sm:inline-block link-underline"
              >
                Login
              </Link>
            )}

            {/* Bag Trigger */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-dark/80 hover:text-dark transition-colors duration-200 cursor-pointer py-1"
              aria-label="Open cart"
            >
              <span className="hidden xs:inline font-bold">Bag</span>
              <span className="inline-flex items-center justify-center bg-black text-white text-[10px] font-mono font-bold px-2 py-0.5 min-w-[22px]">
                {totalItems}
              </span>
            </button>

            {/* Menu Trigger Button */}
            <button
              onClick={() => {
                playTactileClick();
                setIsOpen(!isOpen);
              }}
              className="flex items-center gap-2.5 font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-dark hover:text-black transition-all duration-300 group py-1.5 px-3 border border-black/15 hover:border-black bg-white/70 backdrop-blur-xs cursor-pointer shadow-2xs"
              aria-label="Toggle menu"
            >
              <span className="font-bold">{isOpen ? 'Close' : 'Menu'}</span>
              <span className="flex flex-col gap-[4px] w-4">
                <span className={`block h-[1.5px] bg-black transition-all duration-400 ease-[cubic-bezier(0.77,0,0.175,1)] ${isOpen ? 'rotate-45 translate-y-[5.5px] w-full' : 'w-full'}`} />
                <span className={`block h-[1.5px] bg-black transition-all duration-200 ${isOpen ? 'opacity-0 w-0' : 'w-3/4'}`} />
                <span className={`block h-[1.5px] bg-black transition-all duration-400 ease-[cubic-bezier(0.77,0,0.175,1)] ${isOpen ? '-rotate-45 -translate-y-[5.5px] w-full' : 'w-1/2'}`} />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Backdrop Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Slide-out Menu Drawer */}
      <div
        className={`fixed top-0 right-0 h-[100dvh] w-full max-w-lg bg-white z-50 px-6 sm:px-10 py-10 flex flex-col text-dark shadow-2xl transition-transform duration-600 ease-[cubic-bezier(0.77,0,0.175,1)] overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-5 border-b border-black/10">
          <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center">
            <img src="/logo.png" alt="SKAUNS" className="h-7 w-auto object-contain invert" />
          </Link>
          <button
            onClick={() => {
              playTactileClick();
              setIsOpen(false);
            }}
            className="font-mono text-xs uppercase tracking-[0.25em] text-dark/60 hover:text-black transition-colors duration-200 cursor-pointer flex items-center gap-1.5 font-bold"
          >
            <span>Close</span>
            <span>✕</span>
          </button>
        </div>

        {/* Primary Navigation: Shop All, Shop Boxy, Shop Waffle, Shop Hoodie, Fit Advisor */}
        <div className="mt-6">
          <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-dark/35 mb-2 flex items-center gap-2">
            <span className="w-4 h-[1px] bg-black/25" />
            CATALOG & FITS
          </p>

          <nav className="flex flex-col divide-y divide-black/[0.06]">
            {primaryMenuItems.map((item, i) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => handleLinkClick(item.path)}
                className={`group flex items-center justify-between py-3.5 sm:py-4 transition-all duration-400 ${
                  isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                }`}
                style={{ transitionDelay: `${isOpen ? 100 + i * 50 : 0}ms` }}
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] text-dark/30 font-bold group-hover:text-black">
                      {item.num}
                    </span>
                    <span className="font-anton text-2xl sm:text-3xl uppercase tracking-tight text-dark group-hover:translate-x-1.5 transition-transform duration-300 block">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-dark/40 block mt-0.5 pl-6">
                    {item.subtitle}
                  </span>
                </div>

                <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 bg-[#f4f4f2] text-dark/70 border border-black/10 font-bold group-hover:bg-black group-hover:text-white transition-colors duration-300">
                  {item.badge}
                </span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Secondary Navigation: Other Things */}
        <div className="mt-8 pt-6 border-t border-black/10">
          <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-dark/35 mb-3 flex items-center gap-2">
            <span className="w-4 h-[1px] bg-black/25" />
            OTHER THINGS
          </p>

          <div className="flex flex-col divide-y divide-black/[0.05]">
            {otherMenuItems.map((item, i) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => handleLinkClick(item.path)}
                className={`group flex items-center justify-between py-2.5 transition-all duration-400 ${
                  isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                }`}
                style={{ transitionDelay: `${isOpen ? 350 + i * 50 : 0}ms` }}
              >
                <div>
                  <span className="font-syne font-bold text-sm uppercase tracking-tight text-dark/80 group-hover:text-black group-hover:translate-x-1 transition-all duration-300 block">
                    {item.name}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-dark/35 block">
                    {item.subtitle}
                  </span>
                </div>
                <span className="font-mono text-xs text-dark/25 group-hover:text-black transition-colors duration-300">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="mt-auto pt-8 border-t border-black/10">
          <div className="flex flex-wrap gap-5 text-sm font-mono text-dark/40 mb-2.5">
            <a
              href="https://www.instagram.com/skauns.25"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black transition-colors duration-200 text-[10px] uppercase tracking-widest link-underline font-bold text-dark"
            >
              Instagram (@skauns.25)
            </a>
            {['TikTok', 'Twitter', 'Discord'].map((s) => (
              <a
                key={s}
                href="https://www.instagram.com/skauns.25"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black transition-colors duration-200 text-[10px] uppercase tracking-widest link-underline"
              >
                {s}
              </a>
            ))}
          </div>
          <p className="font-mono text-[9px] text-dark/35 tracking-widest uppercase">
            skauns.help@gmail.com // FARIDABAD, HARYANA
          </p>
        </div>

        {/* Ghost background text in drawer */}
        <div className="absolute bottom-2 right-4 font-bebas text-[18vw] text-black/[0.02] leading-none select-none pointer-events-none overflow-hidden">
          SKAUNS
        </div>
      </div>
    </>
  );
}
