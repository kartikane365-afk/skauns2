import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';

export default function CartDrawer() {
  const {
    items,
    isOpen,
    setIsOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    discountCode,
    applyPromoCode,
    removePromoCode,
    finalTotal,
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; error: boolean } | null>(null);
  const navigate = useNavigate();

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    setPromoMessage({ text: res.message, error: !res.success });
    if (res.success) {
      setPromoInput('');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-500"
        onClick={() => setIsOpen(false)}
      />

      {/* Cart Drawer */}
      <div
        className={`fixed top-0 right-0 h-[100dvh] w-full max-w-lg bg-[#ffffff] text-dark z-50 flex flex-col shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-black/[0.08] bg-[#fafafa]">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
            <h2 className="font-syne font-black text-lg uppercase tracking-tight">
              Syndicate Bag
            </h2>
            <span className="font-mono text-xs text-dark/40 ml-1">
              ({items.reduce((acc, it) => acc + it.quantity, 0)} units)
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="font-mono text-xs text-dark/50 hover:text-black uppercase tracking-widest p-1.5 transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            [Close ✕]
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="bg-[#f2f2f0] px-6 py-3 border-b border-black/[0.06]">
          <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider mb-1.5">
            <span className="text-black font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              ✦ Complimentary Express Dispatch (All Orders)
            </span>
            <span className="font-bold text-emerald-700">₹0 FREE</span>
          </div>
          <div className="w-full bg-black/10 h-1 rounded-full overflow-hidden">
            <div className="bg-emerald-600 h-full w-full" />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-black/[0.06] no-scrollbar">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="w-16 h-16 rounded-full border border-black/10 flex items-center justify-center mb-4 text-black/30 font-mono text-xl">
                ∅
              </div>
              <h3 className="font-syne font-bold text-lg uppercase tracking-tight text-dark mb-1">
                Your Vault is Empty
              </h3>
              <p className="font-mono text-xs text-dark/50 max-w-xs mb-6">
                No units allocated yet. Explore our limited archive and claim your armor before allocations deplete.
              </p>
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/collection');
                }}
                className="bg-black text-white px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] font-bold hover:bg-black/80 transition-colors shadow-sm cursor-pointer"
              >
                Inspect Collection
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.product.id}-${item.size}`} className="py-4 flex gap-4 items-start group">
                {/* Thumbnail */}
                <Link
                  to={`/product/${item.product.id}`}
                  onClick={() => setIsOpen(false)}
                  className="w-20 h-24 bg-[#f6f6f4] border border-black/10 flex-shrink-0 relative overflow-hidden flex items-center justify-center"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-1 right-1 bg-black text-white font-mono text-[8px] px-1 font-bold">
                    {item.size}
                  </span>
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <Link
                        to={`/product/${item.product.id}`}
                        onClick={() => setIsOpen(false)}
                        className="font-syne font-bold text-xs sm:text-sm uppercase tracking-tight text-dark hover:underline line-clamp-1 block"
                      >
                        {item.product.name}
                      </Link>
                      <p className="font-mono text-[10px] text-dark/40 uppercase tracking-wider mt-0.5">
                        Silhouette // Size {item.size}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id, item.size)}
                      className="text-dark/30 hover:text-black text-xs font-mono p-1 transition-colors cursor-pointer"
                      title="Deallocate Unit"
                      aria-label="Remove item"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {/* Quantity Selector */}
                    <div className="inline-flex items-center border border-black/15 bg-white font-mono text-xs">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-dark/60 hover:text-dark hover:bg-black/5 transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-bold text-xs border-x border-black/15">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-dark/60 hover:text-dark hover:bg-black/5 transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-mono font-bold text-sm text-dark">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Promo code drawer */}
        {items.length > 0 && (
          <div className="px-6 py-3 bg-[#fafafa] border-t border-black/[0.06]">
            {discountCode ? (
              <div className="flex items-center justify-between bg-black/5 border border-black/10 px-3 py-2 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="font-bold uppercase tracking-wider text-black">
                    Cipher: {discountCode}
                  </span>
                  <span className="text-black/60">(-{formatPrice(discount)})</span>
                </div>
                <button
                  onClick={removePromoCode}
                  className="text-dark/40 hover:text-black font-bold uppercase text-[10px] cursor-pointer"
                >
                  Revoke [✕]
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="PROMO CIPHER (TRY: VOID10)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="flex-1 bg-white border border-black/15 px-3 py-1.5 text-xs font-mono uppercase tracking-wider placeholder:text-dark/25 focus:outline-none focus:border-black"
                />
                <button
                  type="submit"
                  className="bg-black text-white px-4 py-1.5 font-mono text-xs uppercase tracking-wider font-bold hover:bg-black/80 transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </form>
            )}
            {promoMessage && (
              <p
                className={`text-[10px] font-mono mt-1 ${
                  promoMessage.error ? 'text-red-600' : 'text-emerald-700 font-bold'
                }`}
              >
                {promoMessage.text}
              </p>
            )}
          </div>
        )}

        {/* Footer Checkout Summary */}
        {items.length > 0 && (
          <div className="p-6 bg-white border-t border-black/[0.08] shadow-[0_-8px_20px_rgba(0,0,0,0.03)] space-y-3">
            <div className="space-y-1.5 font-mono text-xs text-dark/70">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-dark">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Privilege Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Discreet Sealed Shipping</span>
                <span className="font-bold text-emerald-700">
                  FREE (ALL ORDERS)
                </span>
              </div>
              <div className="pt-2 border-t border-black/10 flex justify-between items-baseline font-syne font-black text-base text-dark">
                <span className="uppercase tracking-tight">Total Allocation</span>
                <span className="font-mono text-xl">
                  {formatPrice(finalTotal)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/cart');
                }}
                className="w-full border border-black py-3 font-mono text-[11px] uppercase tracking-[0.2em] font-bold text-dark hover:bg-black/5 transition-colors cursor-pointer text-center"
              >
                Inspect Bag
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/checkout');
                }}
                className="w-full bg-black text-white py-3 font-mono text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-black/85 transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                Instant Checkout →
              </button>
            </div>

            <p className="font-mono text-[9px] text-center text-dark/45 uppercase tracking-wider pt-2 leading-relaxed">
              Discreet Vacuum Packaging // Limited Archive Drop // All Sales Final
            </p>
            <p className="font-mono text-[8px] text-center text-dark/35 pt-0.5">
              Subject to <Link to="/terms" onClick={() => setIsOpen(false)} className="underline hover:text-black">Terms</Link> & <Link to="/refund-policy" onClick={() => setIsOpen(false)} className="underline hover:text-black">Refund Policy</Link>
            </p>
          </div>
        )}
      </div>
    </>
  );
}
