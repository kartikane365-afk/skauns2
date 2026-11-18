import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../data/products';

export default function Cart() {
  const { products } = useStore();
  const {
    items,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    discountCode,
    applyPromoCode,
    removePromoCode,
    finalTotal,
    clearCart,
  } = useCart();

  const navigate = useNavigate();
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; error: boolean } | null>(null);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    setPromoMessage({ text: res.message, error: !res.success });
    if (res.success) {
      setPromoInput('');
    }
  };

  // Cross-sell recommendations: pick 3 products not in cart
  const cartProductIds = new Set(items.map((i) => i.product.id));
  const suggestedProducts = products.filter((p) => !cartProductIds.has(p.id)).slice(0, 3);

  return (
    <div className="bg-white text-dark min-h-screen pt-28 sm:pt-36 pb-24">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs uppercase tracking-widest text-dark/40 mb-6">
          <Link to="/" className="hover:text-black">Home</Link>
          <span>/</span>
          <span className="text-black font-bold">Syndicate Bag</span>
        </div>

        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-black/[0.08] mb-10">
          <div>
            <h1 className="font-syne font-black text-3xl sm:text-5xl uppercase tracking-tighter text-dark">
              Bag // Allocation
            </h1>
            <p className="font-mono text-xs sm:text-sm text-dark/40 mt-1">
              Review your reserved silhouette units before dispatch lock.
            </p>
          </div>
          <span className="font-mono text-xs uppercase tracking-widest text-dark/50">
            {items.reduce((sum, it) => sum + it.quantity, 0)} Total Units
          </span>
        </div>

        {items.length === 0 ? (
          <div className="py-20 text-center max-w-md mx-auto">
            <div className="w-20 h-20 rounded-full border border-black/15 flex items-center justify-center mx-auto mb-6 text-3xl font-mono text-dark/30">
              ∅
            </div>
            <h2 className="font-syne font-black text-2xl uppercase tracking-tight text-dark mb-2">
              Bag Is Vacant
            </h2>
            <p className="font-mono text-xs sm:text-sm text-dark/50 leading-relaxed mb-8">
              No armor has been allocated. Explore the SS26 Syndicate drop and claim your pieces before the vault closes.
            </p>
            <Link
              to="/collection"
              className="inline-block bg-black text-white px-8 py-4 font-mono text-xs uppercase tracking-[0.25em] font-bold hover:bg-black/85 transition-colors shadow-md"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left: Items list */}
            <div className="lg:col-span-8 space-y-6">
              {/* Shipping notice */}
              <div className="bg-[#f7f7f5] border border-black/10 p-4">
                <div className="flex justify-between items-center text-xs font-mono uppercase tracking-wider mb-2">
                  <span className="font-bold text-dark flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                    ✦ Complimentary Priority Air Delivery Unlocked (All Orders)
                  </span>
                  <span className="text-emerald-700 font-bold">₹0 FREE</span>
                </div>
                <div className="w-full bg-black/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full w-full" />
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-black/10 divide-y divide-black/10">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.size}`}
                    className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between bg-white hover:bg-[#fafafa] transition-colors"
                  >
                    <div className="flex gap-4 sm:gap-6 items-center">
                      <Link
                        to={`/product/${item.product.id}`}
                        className="w-20 h-24 sm:w-24 sm:h-28 bg-[#f5f5f3] border border-black/10 flex-shrink-0 relative overflow-hidden flex items-center justify-center"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-contain p-1"
                        />
                        <span className="absolute bottom-1 right-1 bg-black text-white font-mono text-[9px] px-1 font-bold">
                          {item.size}
                        </span>
                      </Link>

                      <div>
                        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-dark/40">
                          {item.product.category} // {item.product.color}
                        </span>
                        <Link
                          to={`/product/${item.product.id}`}
                          className="font-syne font-bold text-base sm:text-lg uppercase tracking-tight text-dark hover:underline block mt-0.5"
                        >
                          {item.product.name}
                        </Link>
                        <p className="font-mono text-xs text-dark/60 mt-1">
                          Unit Price: <span className="font-bold text-dark">{formatPrice(item.product.price)}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-black/5">
                      {/* Quantity Stepper */}
                      <div className="inline-flex items-center border border-black/15 bg-white font-mono text-xs">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-dark/60 hover:text-dark hover:bg-black/5 transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="w-10 text-center font-bold text-xs border-x border-black/15">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-dark/60 hover:text-dark hover:bg-black/5 transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right min-w-[90px]">
                        <p className="font-mono font-black text-base text-dark">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.size)}
                          className="font-mono text-[10px] text-dark/40 hover:text-red-600 uppercase tracking-widest mt-1 transition-colors cursor-pointer"
                        >
                          Remove [✕]
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action buttons under items */}
              <div className="flex justify-between items-center pt-2">
                <Link
                  to="/collection"
                  className="font-mono text-xs uppercase tracking-[0.2em] text-dark/60 hover:text-dark font-bold inline-flex items-center gap-2"
                >
                  ← Continue Shopping
                </Link>
                <button
                  onClick={clearCart}
                  className="font-mono text-xs uppercase tracking-widest text-dark/40 hover:text-red-600 transition-colors cursor-pointer"
                >
                  Empty Bag
                </button>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-4">
              <div className="bg-[#fafafa] border border-black/15 p-6 sm:p-7 sticky top-32">
                <h2 className="font-syne font-black text-lg uppercase tracking-tight text-dark pb-4 border-b border-black/10 mb-5">
                  Allocation Summary
                </h2>

                {/* Promo Cipher */}
                <div className="mb-6">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-dark/50 mb-2">
                    // Syndicate Privilege Code
                  </p>
                  {discountCode ? (
                    <div className="flex items-center justify-between bg-black/5 border border-black/10 px-3 py-2 text-xs font-mono">
                      <span className="font-bold text-dark">{discountCode} (-{formatPrice(discount)})</span>
                      <button
                        onClick={removePromoCode}
                        className="text-dark/40 hover:text-black uppercase text-[10px] font-bold cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyPromo} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="CIPHER (TRY: VOID10)"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        className="flex-1 bg-white border border-black/15 px-3 py-2 text-xs font-mono uppercase tracking-wider focus:outline-none focus:border-black"
                      />
                      <button
                        type="submit"
                        className="bg-black text-white px-4 py-2 font-mono text-xs uppercase tracking-wider font-bold hover:bg-black/80 transition-colors cursor-pointer"
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

                {/* Subtotals */}
                <div className="space-y-3 font-mono text-xs text-dark/70 pb-6 border-b border-black/10">
                  <div className="flex justify-between">
                    <span>Base Value</span>
                    <span className="font-bold text-dark">{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Privilege Code</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Priority Dispatch</span>
                    <span className="font-bold text-emerald-700">
                      FREE (ALL ORDERS)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes</span>
                    <span className="text-dark/40">Included</span>
                  </div>
                </div>

                {/* Total */}
                <div className="py-5 flex justify-between items-baseline font-syne font-black text-xl text-dark">
                  <span className="uppercase tracking-tight">Total</span>
                  <span className="font-mono text-2xl">
                    {formatPrice(finalTotal)}
                  </span>
                </div>

                {/* Checkout CTA */}
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-black text-white py-4 font-mono text-xs uppercase tracking-[0.25em] font-bold hover:bg-black/85 transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 mb-3"
                >
                  Proceed to Secure Checkout →
                </button>

                {/* Gateway compliance consent notice */}
                <p className="font-mono text-[9px] text-dark/45 leading-relaxed text-center mb-4">
                  By allocating, you agree to our{' '}
                  <Link to="/terms" className="underline hover:text-black">Terms</Link>,{' '}
                  <Link to="/shipping-policy" className="underline hover:text-black">Shipping</Link>, and strict{' '}
                  <Link to="/refund-policy" className="underline hover:text-black font-bold text-dark/70">Refund Policy</Link> (All Sales Final).
                </p>

                <div className="space-y-2 font-mono text-[10px] text-dark/50 border-t border-black/10 pt-3">
                  <div className="flex items-center gap-2">
                    <span>✦</span>
                    <span>Discreet vacuum-sealed armor packaging</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✦</span>
                    <span>Limited small-batch archive // All sales strictly final</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✦</span>
                    <span>Encrypted 256-bit checkout via RBI-licensed gateways</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Suggested Pieces */}
        {suggestedProducts.length > 0 && (
          <div className="mt-24 pt-16 border-t border-black/10">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-[1px] bg-black/20" />
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-dark/40">
                Syndicate Archive
              </p>
            </div>
            <h2 className="font-syne font-black text-2xl sm:text-3xl uppercase tracking-tight text-dark mb-8">
              Complementary Silhouettes
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {suggestedProducts.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="group block bg-[#fafafa] border border-black/10 hover:border-black/30 transition-all p-4"
                >
                  <div className="aspect-[3/4] bg-[#f5f5f3] mb-4 overflow-hidden relative">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="font-syne font-bold text-sm uppercase text-dark truncate">
                    {p.name}
                  </h3>
                  <div className="flex justify-between items-center mt-2 font-mono text-xs">
                    <span className="text-dark/40 uppercase">{p.color}</span>
                    <span className="font-bold text-dark">{formatPrice(p.price)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
