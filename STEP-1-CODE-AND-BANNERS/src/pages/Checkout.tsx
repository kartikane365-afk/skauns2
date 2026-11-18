import { useState, useId } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../data/products';
import {
  buildOrderVerificationCode,
  dispatchOrderConfirmationToAdmin,
  type OrderDispatchData,
} from '../services/adminDispatcher';

export default function Checkout() {
  const { items, subtotal, discount, discountCode, finalTotal, clearCart } = useCart();
  const { user, login, register } = useAuth();
  const { recordOrder } = useStore();

  // Inline Compulsory Auth Gate state (when user is not logged in)
  const [authTab, setAuthTab] = useState<'register' | 'login'>('register');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authPass, setAuthPass] = useState('');
  const [authError, setAuthError] = useState('');

  // Contact & Address Form
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: '',
    city: '',
    state: 'Delhi',
    pincode: '',
  });

  // Payment Selection: 'prepaid' (Full UPI) or 'cod' (COD with ₹99 advance)
  const [paymentMode, setPaymentMode] = useState<'prepaid' | 'cod'>('prepaid');
  
  // UPI Transaction ID (12-digit UTR)
  const [transactionId, setTransactionId] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedManifest, setCopiedManifest] = useState(false);
  
  // Validation and Submission State
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderDispatchData | null>(null);

  const handleGateAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const res =
      authTab === 'login'
        ? login(authEmail, authPass)
        : register({
            fullName: authName,
            email: authEmail,
            phone: authPhone,
            password: authPass,
          });
    if (!res.success) {
      setAuthError(res.message);
      return;
    }
    if (res.user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || res.user!.fullName,
        phone: prev.phone || res.user!.phone,
        email: prev.email || res.user!.email,
      }));
    }
  };

  const prepaidRadioId = useId();
  const codRadioId = useId();

  // Financial calculations
  const COD_ADVANCE_FEE = 99;
  const grandTotal = finalTotal;
  
  // When COD is selected: customer pays ₹99 advance via UPI now, balance on delivery = grandTotal - 99
  const amountToPayNow = paymentMode === 'cod' ? COD_ADVANCE_FEE : grandTotal;
  const balancePayableOnDelivery = paymentMode === 'cod' ? Math.max(0, grandTotal - COD_ADVANCE_FEE) : 0;

  // Merchant UPI Configuration
  const MERCHANT_UPI_ID = 'kartikane@fam';
  const MERCHANT_NAME = 'kartikane';
  const [orderRef] = useState(() => `Order${Math.floor(100000 + Math.random() * 900000)}`);
  const upiPayload = `upi://pay?pa=${MERCHANT_UPI_ID}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${amountToPayNow.toFixed(2)}&cu=INR&tn=${encodeURIComponent(orderRef)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=8&data=${encodeURIComponent(upiPayload)}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(MERCHANT_UPI_ID);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setScreenshotFile(file);
      setScreenshotPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validation
    if (!formData.fullName.trim()) {
      setErrorMsg('Please enter your full legal name.');
      return;
    }
    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      setErrorMsg('Please provide a valid 10-digit mobile number for courier dispatch notifications.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('Please enter a valid email address to receive order manifests.');
      return;
    }
    if (!formData.address.trim() || formData.address.length < 8) {
      setErrorMsg('Please provide your complete delivery street address.');
      return;
    }
    if (!formData.city.trim()) {
      setErrorMsg('Please enter your city.');
      return;
    }
    if (!formData.pincode.trim() || !/^\d{6}$/.test(formData.pincode.trim())) {
      setErrorMsg('Please enter a valid 6-digit Indian postal PIN code.');
      return;
    }

    // UTR / Transaction ID validation
    const cleanUtr = transactionId.trim().replace(/\s+/g, '');
    if (!cleanUtr) {
      setErrorMsg('Please enter your 12-digit UPI Transaction ID / UTR number from your payment app.');
      return;
    }
    if (cleanUtr.length < 8) {
      setErrorMsg('Please enter a valid UPI Reference / UTR Number (usually 12 digits).');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const generatedOrderId = `SKN-${Math.floor(100000 + Math.random() * 900000)}`;
      const accountInfo = user
        ? {
            userId: user.id,
            registeredName: user.fullName,
            registeredEmail: user.email,
            registeredPhone: user.phone,
          }
        : undefined;

      const { orderCode, orderManifestCode, timestamp, isoTimestamp } = buildOrderVerificationCode({
        orderId: generatedOrderId,
        items: [...items],
        paymentMode,
        subtotal,
        discount,
        discountCode,
        totalOrderValue: grandTotal,
        amountPaidNow: amountToPayNow,
        balanceOnDelivery: balancePayableOnDelivery,
        transactionId: cleanUtr,
        accountInfo,
        shippingDetails: { ...formData },
      });

      const orderPayload: OrderDispatchData = {
        orderId: generatedOrderId,
        orderCode,
        orderManifestCode,
        items: [...items],
        paymentMode,
        subtotal,
        discount,
        discountCode,
        totalOrderValue: grandTotal,
        amountPaidNow: amountToPayNow,
        balanceOnDelivery: balancePayableOnDelivery,
        transactionId: cleanUtr,
        accountInfo,
        shippingDetails: { ...formData },
        timestamp,
        isoTimestamp,
      };

      // Persist order to store (visible in Customer Account & Master Admin Dashboard)
      recordOrder(orderPayload);

      // Silently dispatch generated Order Code, full product manifest, timestamp & UTR to master email
      void dispatchOrderConfirmationToAdmin(orderPayload);

      setConfirmedOrder(orderPayload);
      setIsSubmitting(false);
      clearCart();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1000);
  };

  // If order is confirmed, display the confirmation screen with generated Order Code
  if (confirmedOrder) {
    const waText = encodeURIComponent(confirmedOrder.orderManifestCode);

    return (
      <div className="bg-white text-dark min-h-screen pt-28 sm:pt-36 pb-24 relative overflow-hidden">
        <div className="max-w-[820px] mx-auto px-6 sm:px-10">
          <div className="border-2 border-black p-6 sm:p-10 bg-white shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-black pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                <span className="font-mono text-xs uppercase font-bold tracking-widest text-dark">
                  Transmission Authorized // Payment Logged
                </span>
              </div>
              <span className="font-mono text-xs text-dark/40 font-bold">{confirmedOrder.timestamp}</span>
            </div>

            <div className="text-center py-4 border-b border-black/10 mb-6">
              <div className="w-16 h-16 rounded-full border-2 border-black flex items-center justify-center mx-auto mb-4 text-2xl font-bold font-mono">
                ✓
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-dark/40 mb-1">
                Generated Order Verification Code
              </p>
              <h1 className="font-mono font-black text-lg sm:text-2xl tracking-wider uppercase text-black mb-2 bg-[#f7f7f5] border border-black/15 px-4 py-2 inline-block">
                {confirmedOrder.orderCode}
              </h1>
              <p className="font-mono text-xs text-dark/70 max-w-md mx-auto leading-relaxed mt-2">
                Your order manifest (including all products, customer info, UTR{' '}
                <strong className="text-black font-mono">{confirmedOrder.transactionId}</strong>, and exact timestamp) has been generated and dispatched to SKAUNS Fulfillment.
              </p>
            </div>

            {/* Generated Full Order Code Block */}
            <div className="mb-6 font-mono">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-widest text-dark/50 font-bold">
                  // COMPLETE VERIFIED ORDER CODE & MANIFEST
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(confirmedOrder.orderManifestCode);
                    setCopiedManifest(true);
                    setTimeout(() => setCopiedManifest(false), 2200);
                  }}
                  className="bg-black text-white px-3 py-1 text-[10px] uppercase tracking-wider font-bold hover:bg-black/80"
                >
                  {copiedManifest ? '✓ Copied Order Code' : 'Copy Order Code'}
                </button>
              </div>
              <pre className="bg-black text-[#f4f4f0] p-4 text-[10px] sm:text-[11px] overflow-x-auto leading-relaxed whitespace-pre-wrap border border-black">
                {confirmedOrder.orderManifestCode}
              </pre>
            </div>

            {/* Breakdown card */}
            <div className="space-y-4 font-mono text-xs mb-8">
              <div className="bg-[#f7f7f5] border border-black/15 p-4 space-y-2">
                <div className="flex justify-between items-center text-dark/70">
                  <span>Payment Protocol:</span>
                  <span className="font-bold text-dark uppercase">
                    {confirmedOrder.paymentMode === 'cod' ? 'Cash on Delivery (COD)' : 'Prepaid (Full UPI)'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-dark/70">
                  <span>Total Order Value:</span>
                  <span className="font-bold text-dark">{formatPrice(confirmedOrder.totalOrderValue)}</span>
                </div>
                <div className="flex justify-between items-center text-emerald-800 font-bold">
                  <span>Advance / Amount Paid via UPI:</span>
                  <span>{formatPrice(confirmedOrder.amountPaidNow)}</span>
                </div>
                {confirmedOrder.balanceOnDelivery > 0 && (
                  <div className="flex justify-between items-center text-amber-900 font-bold border-t border-black/10 pt-2">
                    <span>Balance Cash Payable to Courier upon Delivery:</span>
                    <span className="text-sm">{formatPrice(confirmedOrder.balanceOnDelivery)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-dark/70 border-t border-black/10 pt-2">
                  <span>Air Courier Delivery Tariff:</span>
                  <span className="font-bold text-emerald-700 uppercase">100% FREE</span>
                </div>
                <div className="flex justify-between items-center text-dark/70">
                  <span>Submitted UPI Transaction ID / UTR:</span>
                  <span className="font-bold text-black font-mono tracking-wider">{confirmedOrder.transactionId}</span>
                </div>
              </div>

              {/* Delivery coordinates */}
              <div className="border border-black/10 p-4 bg-white space-y-1">
                <p className="font-bold uppercase tracking-wider text-dark/50 text-[10px] mb-1">
                  // Dispatch Destination Coordinates
                </p>
                <p className="font-bold text-dark">{confirmedOrder.shippingDetails.fullName}</p>
                <p className="text-dark/70">{confirmedOrder.shippingDetails.address}</p>
                <p className="text-dark/70">
                  {confirmedOrder.shippingDetails.city}, {confirmedOrder.shippingDetails.state} — {confirmedOrder.shippingDetails.pincode}
                </p>
                <p className="text-dark/70">Phone: {confirmedOrder.shippingDetails.phone}</p>
              </div>

              {/* Items Summary */}
              <div className="border border-black/10 p-4 bg-white">
                <p className="font-bold uppercase tracking-wider text-dark/50 text-[10px] mb-2">
                  // Allocated Silhouettes ({confirmedOrder.items.length})
                </p>
                <div className="divide-y divide-black/10">
                  {confirmedOrder.items.map((item) => (
                    <div key={`${item.product.id}-${item.size}`} className="py-2 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        {item.product.image && (
                          <img src={item.product.image} alt={item.product.name} className="w-10 h-12 object-contain bg-[#f7f7f5]" />
                        )}
                        <div>
                          <p className="font-bold text-dark">{item.product.name}</p>
                          <p className="text-[10px] text-dark/40 uppercase">Size: {item.size} × Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold">{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 font-mono text-xs">
              <a
                href={`https://wa.me/919871044291?text=${waText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] text-white py-4 font-bold uppercase tracking-[0.2em] hover:bg-[#1fa952] transition-colors shadow-md flex items-center justify-center gap-2 text-center"
              >
                <span>💬</span> Send Order Code on WhatsApp Now
              </a>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  to="/account"
                  className="w-full border border-black text-black py-3.5 font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-colors block text-center"
                >
                  View in My Account
                </Link>
                <Link
                  to="/collection"
                  className="w-full bg-black text-white py-3.5 font-bold uppercase tracking-[0.2em] hover:bg-black/85 transition-colors block text-center"
                >
                  Return to Archive
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If cart is empty, redirect or prompt
  if (items.length === 0) {
    return (
      <div className="bg-white text-dark min-h-screen pt-40 pb-20 text-center px-6 font-mono">
        <h1 className="font-syne font-black text-3xl mb-3 uppercase">No Silhouettes in Bag</h1>
        <p className="text-xs text-dark/50 mb-6">Allocate garments to your bag before proceeding to checkout.</p>
        <Link
          to="/collection"
          className="inline-block bg-black text-white px-8 py-3.5 font-mono text-xs uppercase tracking-[0.2em] font-bold"
        >
          View Collection
        </Link>
      </div>
    );
  }

  // COMPULSORY REGISTRATION / LOGIN GATE BEFORE PAYMENT
  if (!user) {
    return (
      <div className="bg-white text-dark min-h-screen pt-28 sm:pt-36 pb-24 relative overflow-hidden">
        <div className="absolute top-20 right-0 pointer-events-none select-none overflow-hidden">
          <span className="font-bebas text-[24vw] text-black/[0.02] leading-none whitespace-nowrap block">
            REGISTER
          </span>
        </div>

        <div className="max-w-xl mx-auto px-6 relative z-10">
          <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs uppercase tracking-widest text-dark/40 mb-6">
            <Link to="/cart" className="hover:text-black">← Back to Bag</Link>
            <span>/</span>
            <span className="text-black font-bold">Mandatory Account Verification</span>
          </div>

          <div className="border-2 border-black bg-white p-6 sm:p-8 shadow-lg">
            <div className="bg-black text-white p-4 mb-6 font-mono">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/60 mb-1">
                // COMPULSORY PRE-PAYMENT STEP
              </p>
              <h1 className="font-syne font-black text-xl sm:text-2xl uppercase tracking-tight">
                Register or Sign In to Pay
              </h1>
              <p className="text-[11px] text-white/75 mt-1 leading-relaxed">
                Registration is mandatory before payment so your verified Order Code, product manifest, and exact dispatch timestamp are securely bound to your account.
              </p>
            </div>

            {/* Bag preview pill */}
            <div className="bg-[#f7f7f5] border border-black/15 px-4 py-3 mb-6 flex items-center justify-between font-mono text-xs">
              <span className="text-dark/70 uppercase">
                Reserved Bag: <strong className="text-black">{items.reduce((s, i) => s + i.quantity, 0)} Unit(s)</strong>
              </span>
              <span className="font-bold text-black">{formatPrice(grandTotal)}</span>
            </div>

            {/* Register / Login tabs */}
            <div className="grid grid-cols-2 border-b border-black/15 mb-6 font-mono text-xs">
              <button
                type="button"
                onClick={() => {
                  setAuthTab('register');
                  setAuthError('');
                }}
                className={`py-3 uppercase tracking-[0.2em] font-bold border-b-2 -mb-[1px] ${
                  authTab === 'register' ? 'border-black text-black' : 'border-transparent text-dark/40'
                }`}
              >
                New Account (Register)
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthTab('login');
                  setAuthError('');
                }}
                className={`py-3 uppercase tracking-[0.2em] font-bold border-b-2 -mb-[1px] ${
                  authTab === 'login' ? 'border-black text-black' : 'border-transparent text-dark/40'
                }`}
              >
                Existing Member (Login)
              </button>
            </div>

            <form onSubmit={handleGateAuth} className="space-y-4 font-mono text-xs">
              {authTab === 'register' && (
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-dark/60 mb-1">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="E.G. ARJUN SHARMA"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    className="w-full bg-[#fafafa] border border-black/20 px-3.5 py-2.5 text-xs focus:outline-none focus:border-black"
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-dark/60 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full bg-[#fafafa] border border-black/20 px-3.5 py-2.5 text-xs lowercase focus:outline-none focus:border-black"
                />
              </div>

              {authTab === 'register' && (
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-dark/60 mb-1">
                    10-Digit Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9871044291"
                    value={authPhone}
                    onChange={(e) => setAuthPhone(e.target.value)}
                    className="w-full bg-[#fafafa] border border-black/20 px-3.5 py-2.5 text-xs focus:outline-none focus:border-black"
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-dark/60 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Minimum 6 characters"
                  value={authPass}
                  onChange={(e) => setAuthPass(e.target.value)}
                  className="w-full bg-[#fafafa] border border-black/20 px-3.5 py-2.5 text-xs focus:outline-none focus:border-black"
                />
              </div>

              {authError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 text-[11px] font-bold">
                  ⚠ {authError}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-black text-white py-4 text-xs uppercase tracking-[0.25em] font-bold hover:bg-black/85 transition-colors shadow-md"
              >
                {authTab === 'register' ? 'Register & Unlock Payment →' : 'Sign In & Unlock Payment →'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-dark min-h-screen pt-28 sm:pt-36 pb-24 relative overflow-hidden">
      {/* Ghost background watermark */}
      <div className="absolute top-20 right-0 pointer-events-none select-none overflow-hidden">
        <span className="font-bebas text-[24vw] text-black/[0.02] leading-none whitespace-nowrap block">
          CHECKOUT
        </span>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 relative z-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs uppercase tracking-widest text-dark/40 mb-6">
          <Link to="/" className="hover:text-black">Home</Link>
          <span>/</span>
          <Link to="/cart" className="hover:text-black">Syndicate Bag</Link>
          <span>/</span>
          <span className="text-black font-bold">Secure UPI Allocation</span>
        </div>

        {/* Page Title & Free Delivery Banner */}
        <div className="border-b border-black/15 pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-syne font-black text-3xl sm:text-5xl uppercase tracking-tighter text-dark mb-1">
              Checkout // UPI Protocol
            </h1>
            <p className="font-mono text-xs sm:text-sm text-dark/50">
              Provide your delivery coordinates, select payment protocol, and submit your 12-digit transaction ID.
            </p>
          </div>
          
          <div className="bg-black text-white px-4 py-2 font-mono text-xs uppercase tracking-wider flex items-center gap-2 self-start md:self-auto shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold">✦ 100% Free Air Delivery On All Orders</span>
          </div>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column (7 cols): Address & Payment Protocol Selection */}
          <div className="lg:col-span-7 space-y-8 font-mono">
            
            {/* Step 1: Destination Coordinates */}
            <div className="border border-black/15 p-6 sm:p-7 bg-[#fafafa]">
              <div className="flex items-center gap-3 mb-5 border-b border-black/10 pb-3">
                <span className="w-6 h-6 rounded-full bg-black text-white font-mono text-xs flex items-center justify-center font-bold">
                  01
                </span>
                <h2 className="font-syne font-black text-lg uppercase tracking-tight text-dark">
                  Delivery Destination
                </h2>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label htmlFor="fullName" className="block text-[10px] uppercase tracking-wider text-dark/60 mb-1">
                    Full Legal Name *
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    placeholder="E.G. ARJUN SHARMA"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-white border border-black/15 px-3 py-2.5 text-xs uppercase focus:outline-none focus:border-black"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-[10px] uppercase tracking-wider text-dark/60 mb-1">
                      10-Digit Mobile Number (For Courier SMS) *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="9871044291"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white border border-black/15 px-3 py-2.5 text-xs focus:outline-none focus:border-black font-mono"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-[10px] uppercase tracking-wider text-dark/60 mb-1">
                      Email Address (For Dispatch Manifest) *
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="ARJUN@EXAMPLE.COM"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white border border-black/15 px-3 py-2.5 text-xs focus:outline-none focus:border-black lowercase"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-[10px] uppercase tracking-wider text-dark/60 mb-1">
                    Complete Street Address (Flat / House / Floor / Street / Landmark) *
                  </label>
                  <textarea
                    id="address"
                    required
                    rows={2}
                    placeholder="HOUSE NO. 14, 2ND FLOOR, OPPOSITE CENTRAL PLAZA"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-white border border-black/15 px-3 py-2 text-xs uppercase focus:outline-none focus:border-black"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-[10px] uppercase tracking-wider text-dark/60 mb-1">
                      City *
                    </label>
                    <input
                      id="city"
                      type="text"
                      required
                      placeholder="NEW DELHI"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-white border border-black/15 px-3 py-2.5 text-xs uppercase focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-[10px] uppercase tracking-wider text-dark/60 mb-1">
                      State *
                    </label>
                    <select
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full bg-white border border-black/15 px-3 py-2.5 text-xs uppercase focus:outline-none focus:border-black"
                    >
                      {[
                        'Delhi', 'Maharashtra', 'Karnataka', 'Haryana', 'Uttar Pradesh',
                        'Punjab', 'West Bengal', 'Tamil Nadu', 'Telangana', 'Gujarat',
                        'Rajasthan', 'Madhya Pradesh', 'Kerala', 'Chandigarh', 'Other'
                      ].map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="pincode" className="block text-[10px] uppercase tracking-wider text-dark/60 mb-1">
                      Postal PIN Code *
                    </label>
                    <input
                      id="pincode"
                      type="text"
                      required
                      maxLength={6}
                      placeholder="110020"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-full bg-white border border-black/15 px-3 py-2.5 text-xs focus:outline-none focus:border-black font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Payment Protocol Selection (Prepaid vs COD with ₹99 Advance Fee) */}
            <div className="border border-black/15 p-6 sm:p-7 bg-[#fafafa]">
              <div className="flex items-center gap-3 mb-5 border-b border-black/10 pb-3">
                <span className="w-6 h-6 rounded-full bg-black text-white font-mono text-xs flex items-center justify-center font-bold">
                  02
                </span>
                <h2 className="font-syne font-black text-lg uppercase tracking-tight text-dark">
                  Select Payment Protocol
                </h2>
              </div>

              <div className="space-y-4">
                
                {/* Option A: Prepaid (Full UPI) */}
                <label
                  htmlFor={prepaidRadioId}
                  className={`block border p-4 cursor-pointer transition-all ${
                    paymentMode === 'prepaid'
                      ? 'border-black bg-white shadow-sm ring-1 ring-black'
                      : 'border-black/15 bg-white/60 hover:border-black/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <input
                        id={prepaidRadioId}
                        type="radio"
                        name="paymentMode"
                        checked={paymentMode === 'prepaid'}
                        onChange={() => setPaymentMode('prepaid')}
                        className="mt-1 accent-black"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-dark uppercase text-xs sm:text-sm">
                            Prepaid (Direct UPI Full Payment)
                          </span>
                          <span className="bg-black text-white text-[9px] uppercase tracking-widest px-2 py-0.5 font-bold">
                            RECOMMENDED
                          </span>
                        </div>
                        <p className="text-[11px] text-dark/60 mt-1">
                          Pay 100% upfront via GPay / PhonePe / Paytm / CRED / BHIM. Zero courier collection friction.
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-sm font-bold text-dark">
                      {formatPrice(grandTotal)}
                    </span>
                  </div>
                </label>

                {/* Option B: Cash on Delivery (COD) with ₹99 Advance Fee Checkbox */}
                <label
                  htmlFor={codRadioId}
                  className={`block border p-4 cursor-pointer transition-all ${
                    paymentMode === 'cod'
                      ? 'border-black bg-white shadow-sm ring-1 ring-black'
                      : 'border-black/15 bg-white/60 hover:border-black/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <input
                        id={codRadioId}
                        type="radio"
                        name="paymentMode"
                        checked={paymentMode === 'cod'}
                        onChange={() => setPaymentMode('cod')}
                        className="mt-1 accent-black"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-dark uppercase text-xs sm:text-sm">
                            Cash On Delivery (COD)
                          </span>
                          <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[9px] uppercase tracking-widest px-2 py-0.5 font-bold">
                            ₹99 ADVANCE REQUIRED
                          </span>
                        </div>
                        <p className="text-[11px] text-dark/70 mt-1">
                          Pay <strong>₹99 Advance Verification Fee</strong> now via UPI to lock your order.
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-xs font-bold text-dark block">
                        ₹99 Now
                      </span>
                      <span className="text-[10px] text-dark/50">
                        +{formatPrice(balancePayableOnDelivery)} COD
                      </span>
                    </div>
                  </div>

                  {/* COD Explanatory Banner */}
                  {paymentMode === 'cod' && (
                    <div className="mt-3 pt-3 border-t border-black/10 bg-[#fbf9f4] p-3 text-[11px] text-dark/75 space-y-1">
                      <p className="font-bold text-black flex items-center gap-1.5">
                        <span>ℹ</span> How the ₹99 COD Advance Works:
                      </p>
                      <p>
                        The ₹99 fee is <strong>non-refundable</strong> and verifies your delivery coordinates.
                        It is <strong>strictly deducted from your garment price</strong>.
                      </p>
                      <div className="bg-white border border-black/10 p-2 mt-2 font-mono text-[10px] space-y-0.5">
                        <div className="flex justify-between">
                          <span>Total Garment Value:</span>
                          <span>{formatPrice(grandTotal)}</span>
                        </div>
                        <div className="flex justify-between text-emerald-700 font-bold">
                          <span>Paid Now via UPI (Advance):</span>
                          <span>−₹99</span>
                        </div>
                        <div className="flex justify-between text-black font-bold border-t border-black/10 pt-1">
                          <span>Remaining Balance to Courier on Delivery:</span>
                          <span>{formatPrice(balancePayableOnDelivery)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </label>

              </div>
            </div>

            {/* Step 3: UPI Payment Gateway (QR Code + Deep Links) */}
            <div className="border-2 border-black p-6 sm:p-8 bg-white shadow-sm">
              <div className="flex items-center gap-3 mb-4 border-b border-black/10 pb-3">
                <span className="w-6 h-6 rounded-full bg-black text-white font-mono text-xs flex items-center justify-center font-bold">
                  03
                </span>
                <div>
                  <h2 className="font-syne font-black text-lg uppercase tracking-tight text-dark">
                    Scan QR or Pay via UPI
                  </h2>
                  <p className="text-[11px] text-dark/50">
                    Payable Now: <strong className="text-black text-sm">{formatPrice(amountToPayNow)}</strong>{' '}
                    {paymentMode === 'cod' ? '(₹99 COD Advance Verification Fee)' : '(100% Full Payment)'}
                  </p>
                </div>
              </div>

              {/* QR Code and Payment Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
                {/* QR Code Box */}
                <div className="p-3 bg-white border border-black/20 shadow-inner flex flex-col items-center">
                  <img
                    src={qrCodeUrl}
                    alt="Scan to Pay via UPI"
                    className="w-48 h-48 sm:w-52 sm:h-52 object-contain"
                  />
                  <span className="font-mono text-[9px] uppercase tracking-widest text-dark/40 mt-1 text-center">
                    Accepts GPay • PhonePe • Paytm • CRED
                  </span>
                </div>

                {/* Details & Mobile Intent Links */}
                <div className="flex-1 w-full space-y-4">
                  <div className="bg-[#f7f7f5] border border-black/10 p-3.5 space-y-1.5">
                    <p className="text-[9px] uppercase tracking-wider text-dark/40">// OFFICIAL SYNDICATE UPI VPA</p>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-sm sm:text-base font-bold text-black tracking-wider">
                        {MERCHANT_UPI_ID}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        className="bg-black text-white px-3 py-1 text-[10px] uppercase tracking-wider font-bold hover:bg-black/80 transition-colors"
                      >
                        {copiedUpi ? '✓ Copied' : 'Copy UPI'}
                      </button>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-dark/50 pt-1 border-t border-black/5">
                      <span>Verified Payee: <strong className="text-dark">{MERCHANT_NAME}</strong></span>
                      <span>Ref Note: <strong className="text-dark">{orderRef}</strong></span>
                    </div>
                  </div>

                  {/* Direct Mobile UPI App Links */}
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-dark/50 mb-2">
                      // Quick Pay with Installed App:
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <a
                        href={upiPayload}
                        className="border border-black/20 bg-white hover:bg-black hover:text-white p-2.5 text-center font-bold tracking-wider uppercase transition-colors"
                      >
                        ⚡ Google Pay
                      </a>
                      <a
                        href={upiPayload}
                        className="border border-black/20 bg-white hover:bg-black hover:text-white p-2.5 text-center font-bold tracking-wider uppercase transition-colors"
                      >
                        ⚡ PhonePe
                      </a>
                      <a
                        href={upiPayload}
                        className="border border-black/20 bg-white hover:bg-black hover:text-white p-2.5 text-center font-bold tracking-wider uppercase transition-colors"
                      >
                        ⚡ Paytm
                      </a>
                      <a
                        href={upiPayload}
                        className="border border-black/20 bg-white hover:bg-black hover:text-white p-2.5 text-center font-bold tracking-wider uppercase transition-colors"
                      >
                        ⚡ Any UPI App
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4: Submit 12-digit UPI Transaction ID / UTR */}
            <div className="border border-black/15 p-6 sm:p-7 bg-[#fafafa]">
              <div className="flex items-center gap-3 mb-4 border-b border-black/10 pb-3">
                <span className="w-6 h-6 rounded-full bg-black text-white font-mono text-xs flex items-center justify-center font-bold">
                  04
                </span>
                <div>
                  <h2 className="font-syne font-black text-lg uppercase tracking-tight text-dark">
                    Tell Us You Have Made the Payment
                  </h2>
                  <p className="text-[11px] text-dark/50">
                    Enter the 12-digit UPI Reference / UTR Number to link payment to your order.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="transactionId" className="block text-[10px] uppercase tracking-wider text-dark/60 mb-1">
                    12-Digit UPI Transaction ID / UTR Number *
                  </label>
                  <input
                    id="transactionId"
                    type="text"
                    required
                    maxLength={22}
                    placeholder="E.G. 432198765432"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full bg-white border border-black/25 px-4 py-3 text-sm font-mono tracking-widest uppercase focus:outline-none focus:border-black font-bold"
                  />
                  <p className="text-[10px] text-dark/45 mt-1.5">
                    💡 <em>Where to find:</em> Open Google Pay, PhonePe, or Paytm &gt; Payment History &gt; Click SKAUNS Transaction &gt; Copy 12-digit UPI Ref / UTR No.
                  </p>
                </div>

                {/* Optional Screenshot upload */}
                <div>
                  <label htmlFor="screenshotUpload" className="block text-[10px] uppercase tracking-wider text-dark/60 mb-1">
                    Payment Screenshot (Optional, for expedited clearance)
                  </label>
                  <input
                    id="screenshotUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotChange}
                    className="block w-full text-xs text-dark/60 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-mono file:font-bold file:bg-black file:text-white hover:file:bg-black/80 cursor-pointer"
                  />
                  {screenshotPreview && (
                    <div className="mt-2 flex items-center gap-3">
                      <img src={screenshotPreview} alt="Screenshot Preview" className="w-16 h-16 object-cover border border-black/20" />
                      <span className="text-[10px] text-emerald-700 font-bold">✓ Screenshot attached ({screenshotFile?.name})</span>
                    </div>
                  )}
                </div>

                {/* Error Banner if any */}
                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-300 text-red-700 text-xs font-bold">
                    ⚠ {errorMsg}
                  </div>
                )}

                {/* Final Submit CTA */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black text-white py-4 font-mono text-xs uppercase tracking-[0.25em] font-bold hover:bg-black/85 transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 mt-4"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Authenticating Transaction...
                    </>
                  ) : (
                    `Confirm Order & Submit UTR →`
                  )}
                </button>

                <p className="font-mono text-[9px] text-dark/45 text-center leading-relaxed">
                  By clicking confirm, you acknowledge our <Link to="/terms" className="underline hover:text-black">Terms</Link>,{' '}
                  <Link to="/shipping-policy" className="underline hover:text-black">Shipping Policy</Link>, and strict{' '}
                  <Link to="/refund-policy" className="underline hover:text-black font-bold">Refund Policy</Link> (All Sales Final).
                </p>
              </div>
            </div>

          </div>

          {/* Right Column (5 cols): Order Summary & Allocation Review */}
          <div className="lg:col-span-5 font-mono">
            <div className="border border-black/15 p-6 sm:p-7 bg-[#fafafa] sticky top-32 space-y-6">
              
              <div className="flex items-center justify-between border-b border-black/10 pb-4">
                <h2 className="font-syne font-black text-lg uppercase tracking-tight text-dark">
                  Order Summary
                </h2>
                <span className="text-xs text-dark/50 font-bold">
                  {items.reduce((s, it) => s + it.quantity, 0)} Units
                </span>
              </div>

              {/* Items List */}
              <div className="divide-y divide-black/10 max-h-72 overflow-y-auto no-scrollbar pr-1">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.size}`} className="py-3 flex gap-3 items-center">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-14 h-16 object-contain bg-white border border-black/10 p-1 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs uppercase text-dark truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-[10px] text-dark/40 uppercase">
                        Size: {item.size} • Qty: {item.quantity}
                      </p>
                      <p className="text-[10px] text-dark/60">
                        {formatPrice(item.product.price)} each
                      </p>
                    </div>
                    <span className="font-bold text-xs">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculations */}
              <div className="space-y-2.5 text-xs border-t border-black/10 pt-4 text-dark/70">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-dark">{formatPrice(subtotal)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Privilege Code ({discountCode})</span>
                    <span>−{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span>Priority Air Freight</span>
                  <span className="font-bold text-emerald-700 uppercase">100% FREE</span>
                </div>

                <div className="flex justify-between text-dark/40 text-[10px]">
                  <span>GST (12% Apparel)</span>
                  <span>Included</span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="border-t-2 border-black pt-4 pb-2">
                <div className="flex justify-between items-baseline font-syne font-black text-xl text-dark">
                  <span className="uppercase">Total Order Value</span>
                  <span className="font-mono text-2xl font-bold">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Dynamic Payment Split according to Selected Mode */}
              <div className="bg-white border border-black/15 p-4 space-y-2 text-xs">
                <div className="flex justify-between items-center text-dark/60 text-[11px]">
                  <span>Selected Mode:</span>
                  <span className="font-bold uppercase text-dark">
                    {paymentMode === 'cod' ? 'Cash on Delivery' : 'Prepaid (Full UPI)'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-sm font-bold text-black border-t border-black/10 pt-2">
                  <span>Payable Now via UPI:</span>
                  <span className="text-base font-black text-emerald-800">{formatPrice(amountToPayNow)}</span>
                </div>

                {paymentMode === 'cod' && (
                  <div className="flex justify-between items-center text-[11px] text-amber-900 font-bold bg-amber-50 p-2 border border-amber-200">
                    <span>Balance at Delivery:</span>
                    <span>{formatPrice(balancePayableOnDelivery)}</span>
                  </div>
                )}
              </div>

              {/* Trust badges */}
              <div className="space-y-2 text-[10px] text-dark/50 pt-2">
                <div className="flex items-center gap-2">
                  <span>✦</span>
                  <span>Discreet carbon black vacuum-sealed packaging</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✦</span>
                  <span>Direct Airway Bill (AWB) SMS & Email tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✦</span>
                  <span>Zero-cancellation collector archive policy</span>
                </div>
              </div>

            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
