import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../data/products';

export default function Auth() {
  const { user, isAdmin, login, register, logout } = useAuth();
  const { orders } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const redirectTo = searchParams.get('redirect') || '';
  const initialMode: 'login' | 'register' =
    location.pathname === '/register' ? 'register' : 'login';

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [prevPathname, setPrevPathname] = useState(location.pathname);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (location.pathname !== prevPathname) {
    setPrevPathname(location.pathname);
    if (location.pathname === '/register') setMode('register');
    else if (location.pathname === '/login') setMode('login');
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  // If already logged in and visiting /login or /register with a redirect param, forward immediately
  useEffect(() => {
    if (user && redirectTo && (location.pathname === '/login' || location.pathname === '/register')) {
      navigate(redirectTo, { replace: true });
    }
  }, [user, redirectTo, location.pathname, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (mode === 'login') {
      const res = login(email, password);
      if (!res.success) {
        setErrorMsg(res.message);
        return;
      }
      if (redirectTo) {
        navigate(redirectTo, { replace: true });
      } else if (res.user?.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/account', { replace: true });
      }
      return;
    }

    // Register mode
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    const res = register({ fullName, email, phone, password });
    if (!res.success) {
      setErrorMsg(res.message);
      return;
    }
    if (redirectTo) {
      navigate(redirectTo, { replace: true });
    } else if (res.user?.role === 'admin') {
      navigate('/admin', { replace: true });
    } else {
      navigate('/account', { replace: true });
    }
  };

  const handleCopyCode = (code: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2200);
  };

  // Logged-in Account View
  if (user && location.pathname === '/account') {
    const myOrders = orders.filter(
      (o) =>
        o.accountInfo?.registeredEmail?.toLowerCase() === user.email.toLowerCase() ||
        o.shippingDetails.email.toLowerCase() === user.email.toLowerCase()
    );

    return (
      <div className="bg-white text-dark min-h-screen pt-28 sm:pt-36 pb-24 relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs uppercase tracking-widest text-dark/40 mb-6">
            <Link to="/" className="hover:text-black">Home</Link>
            <span>/</span>
            <span className="text-black font-bold">Syndicate Account</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-black/10 mb-10">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-dark/45 mb-1">
                // AUTHENTICATED PROFILE
              </p>
              <h1 className="font-syne font-black text-3xl sm:text-5xl uppercase tracking-tighter text-dark">
                {user.fullName}
              </h1>
              <p className="font-mono text-xs text-dark/60 mt-1">
                {user.email} • +91 {user.phone}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="bg-black text-white px-5 py-3 uppercase tracking-[0.2em] font-bold hover:bg-black/85 transition-colors shadow-md"
                >
                  ⚡ Open Admin Studio
                </Link>
              )}
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="border border-black/25 px-5 py-3 uppercase tracking-[0.2em] font-bold hover:bg-black hover:text-white transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Orders & Verification Codes History */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-syne font-black text-xl sm:text-2xl uppercase tracking-tight text-dark !mb-0">
                My Orders & Verification Codes ({myOrders.length})
              </h2>
              <Link
                to="/collection"
                className="font-mono text-xs uppercase tracking-widest underline font-bold text-dark/70 hover:text-black"
              >
                Explore Drop →
              </Link>
            </div>

            {myOrders.length === 0 ? (
              <div className="border border-black/10 bg-[#fafafa] p-10 text-center font-mono">
                <p className="text-sm font-bold text-dark uppercase mb-2">No Orders Allocated Yet</p>
                <p className="text-xs text-dark/50 mb-6">
                  When you complete a checkout, your generated Order Verification Code and full product manifest will appear here.
                </p>
                <Link
                  to="/collection"
                  className="inline-block bg-black text-white px-6 py-3 text-xs uppercase tracking-[0.2em] font-bold"
                >
                  Shop Collection
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {myOrders.map((ord) => (
                  <div
                    key={ord.orderId}
                    className="border border-black/15 bg-[#fafafa] p-5 sm:p-6 font-mono text-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/10 pb-3">
                      <div>
                        <span className="text-[10px] text-dark/45 uppercase block">// GENERATED ORDER CODE</span>
                        <span className="font-bold text-sm sm:text-base text-black tracking-wider">
                          {ord.orderCode}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-black text-white px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold">
                          {ord.status}
                        </span>
                        <button
                          onClick={() => handleCopyCode(ord.orderCode, ord.orderManifestCode)}
                          className="border border-black/25 bg-white hover:bg-black hover:text-white px-3 py-1 text-[10px] uppercase tracking-wider font-bold transition-colors"
                        >
                          {copiedCode === ord.orderCode ? '✓ Copied Manifest' : 'Copy Full Code'}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
                      <div>
                        <span className="text-dark/45 uppercase block text-[9px]">Timestamp</span>
                        <span className="font-bold text-dark">{ord.timestamp}</span>
                      </div>
                      <div>
                        <span className="text-dark/45 uppercase block text-[9px]">Payment / UTR</span>
                        <span className="font-bold text-dark">
                          {ord.paymentMode === 'cod' ? 'COD (₹99 Paid)' : 'Prepaid Full'} • UTR: {ord.transactionId}
                        </span>
                      </div>
                      <div>
                        <span className="text-dark/45 uppercase block text-[9px]">Total / Balance</span>
                        <span className="font-bold text-dark">
                          {formatPrice(ord.totalOrderValue)}{' '}
                          {ord.balanceOnDelivery > 0 ? `(COD Due: ${formatPrice(ord.balanceOnDelivery)})` : '(Settled)'}
                        </span>
                      </div>
                    </div>

                    <pre className="bg-black text-[#f4f4f0] p-4 text-[10px] sm:text-[11px] overflow-x-auto leading-relaxed whitespace-pre-wrap">
                      {ord.orderManifestCode}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Login / Register View
  return (
    <div className="bg-white text-dark min-h-screen pt-28 sm:pt-36 pb-24 relative overflow-hidden">
      {/* Watermark */}
      <div className="absolute top-20 right-0 pointer-events-none select-none overflow-hidden">
        <span className="font-bebas text-[24vw] text-black/[0.02] leading-none whitespace-nowrap block">
          ACCESS
        </span>
      </div>

      <div className="max-w-lg mx-auto px-6 relative z-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs uppercase tracking-widest text-dark/40 mb-6">
          <Link to="/" className="hover:text-black">Home</Link>
          <span>/</span>
          <span className="text-black font-bold">{mode === 'login' ? 'Sign In' : 'Register'}</span>
        </div>

        {redirectTo === '/checkout' && (
          <div className="mb-6 border-2 border-black bg-[#fbf9f4] p-4 font-mono text-xs">
            <p className="font-bold uppercase text-black mb-1">
              ⚡ Registration Required Before Payment
            </p>
            <p className="text-dark/70 text-[11px]">
              Create a SKAUNS account or sign in to generate your verified order code and unlock UPI/COD payment checkout.
            </p>
          </div>
        )}

        <div className="border-2 border-black bg-white p-6 sm:p-8 shadow-sm">
          {/* Tabs */}
          <div className="grid grid-cols-2 border-b border-black/15 mb-6 font-mono text-xs">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg('');
              }}
              className={`py-3 uppercase tracking-[0.2em] font-bold transition-colors border-b-2 -mb-[1px] ${
                mode === 'login'
                  ? 'border-black text-black'
                  : 'border-transparent text-dark/40 hover:text-dark'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMsg('');
              }}
              className={`py-3 uppercase tracking-[0.2em] font-bold transition-colors border-b-2 -mb-[1px] ${
                mode === 'register'
                  ? 'border-black text-black'
                  : 'border-transparent text-dark/40 hover:text-dark'
              }`}
            >
              Register
            </button>
          </div>

          <div className="mb-6">
            <h1 className="font-syne font-black text-2xl sm:text-3xl uppercase tracking-tight text-dark">
              {mode === 'login' ? 'Syndicate Sign In' : 'Create Account'}
            </h1>
            <p className="font-mono text-[11px] text-dark/55 mt-1">
              {mode === 'login'
                ? 'Access your saved coordinates, order verification codes, and instant checkout.'
                : 'Register your identity before placing orders to receive tamper-proof dispatch codes.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
            {mode === 'register' && (
              <div>
                <label htmlFor="auth-name" className="block text-[10px] uppercase tracking-wider text-dark/60 mb-1">
                  Full Legal Name *
                </label>
                <input
                  id="auth-name"
                  type="text"
                  required
                  placeholder="E.G. ARJUN SHARMA"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#fafafa] border border-black/20 px-3.5 py-2.5 text-xs focus:outline-none focus:border-black"
                />
              </div>
            )}

            <div>
              <label htmlFor="auth-email" className="block text-[10px] uppercase tracking-wider text-dark/60 mb-1">
                Email Address *
              </label>
              <input
                id="auth-email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#fafafa] border border-black/20 px-3.5 py-2.5 text-xs lowercase focus:outline-none focus:border-black"
              />
            </div>

            {mode === 'register' && (
              <div>
                <label htmlFor="auth-phone" className="block text-[10px] uppercase tracking-wider text-dark/60 mb-1">
                  10-Digit Mobile Number *
                </label>
                <input
                  id="auth-phone"
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="9871044291"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#fafafa] border border-black/20 px-3.5 py-2.5 text-xs focus:outline-none focus:border-black"
                />
              </div>
            )}

            <div>
              <label htmlFor="auth-password" className="block text-[10px] uppercase tracking-wider text-dark/60 mb-1">
                Password *
              </label>
              <input
                id="auth-password"
                type="password"
                required
                minLength={6}
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#fafafa] border border-black/20 px-3.5 py-2.5 text-xs focus:outline-none focus:border-black"
              />
            </div>

            {mode === 'register' && (
              <div>
                <label htmlFor="auth-confirm" className="block text-[10px] uppercase tracking-wider text-dark/60 mb-1">
                  Confirm Password *
                </label>
                <input
                  id="auth-confirm"
                  type="password"
                  required
                  minLength={6}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#fafafa] border border-black/20 px-3.5 py-2.5 text-xs focus:outline-none focus:border-black"
                />
              </div>
            )}

            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 text-[11px] font-bold">
                ⚠ {errorMsg}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-black text-white py-3.5 text-xs uppercase tracking-[0.25em] font-bold hover:bg-black/85 transition-colors shadow-md"
            >
              {mode === 'login' ? 'Authenticate & Enter →' : 'Register & Continue →'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-black/10 text-center font-mono text-[11px] text-dark/60">
            {mode === 'login' ? (
              <>
                New to SKAUNS?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMsg('');
                  }}
                  className="underline font-bold text-black"
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg('');
                  }}
                  className="underline font-bold text-black"
                >
                  Sign in here
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
