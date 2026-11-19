import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { formatPrice } from '../data/products';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';

export default function Product() {
  const { id } = useParams();
  const { products } = useStore();
  const product = products.find(p => p.id === id);
  const [selectedSize, setSelectedSize] = useState('L');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [prevId, setPrevId] = useState(id);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const { addToCart } = useCart();

  // Zoom magnifier state
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const imageBoxRef = useRef<HTMLDivElement>(null);

  // Reset active image index during render when switching products
  if (prevId !== id) {
    setPrevId(id);
    setActiveImgIndex(0);
    setIsZoomed(false);
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (!product) {
    return (
      <div className="bg-white text-dark min-h-screen pt-40 pb-20 text-center px-6">
        <h1 className="font-syne font-black text-3xl sm:text-4xl mb-4 uppercase">Unit Not Found</h1>
        <Link to="/collection" className="font-mono text-xs uppercase tracking-widest text-black underline underline-offset-4">
          [ Return to Collection ]
        </Link>
      </div>
    );
  }

  const galleryImages = product.images && product.images.length > 0 ? product.images : [product.image];
  const currentImage = galleryImages[activeImgIndex] || product.image;
  const related = products
    .filter(p => p.id !== product.id)
    .sort((a, _b) => (a.category === product.category ? -1 : 1))
    .slice(0, 4);

  const nextImage = () => {
    setActiveImgIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setActiveImgIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleClaim = () => {
    addToCart(product, selectedSize, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2200);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageBoxRef.current) return;
    const rect = imageBoxRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomOrigin({ x, y });
  };

  const handleMouseEnter = () => setIsZoomed(true);
  const handleMouseLeave = () => {
    setIsZoomed(false);
    setZoomOrigin({ x: 50, y: 50 });
  };

  return (
    <div className="bg-white text-dark min-h-screen w-full pt-20 sm:pt-24 pb-20">
      {/* Compact Breadcrumb */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 mb-4 sm:mb-5">
        <div className="flex items-center gap-2 font-mono text-[10px] sm:text-[11px] tracking-wider text-dark/40 uppercase">
          <Link to="/" className="hover:text-dark transition-colors">Home</Link>
          <span>/</span>
          <Link to="/collection" className="hover:text-dark transition-colors">Collection</Link>
          <span>/</span>
          <span className="text-dark font-bold truncate">{product.name}</span>
        </div>
      </div>

      {/* Product Detail Main Viewport-Fitting Container */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          
          {/* Left: Product Images with SIDE Thumbnail Gallery */}
          <div className="lg:col-span-7 xl:col-span-7">
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 items-start w-full">
              
              {/* Vertical Side Thumbnails Strip */}
              {galleryImages.length > 1 && (
                <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto w-full sm:w-20 md:w-22 max-h-[16vh] sm:max-h-[72vh] flex-shrink-0 no-scrollbar py-1">
                  {galleryImages.map((img, idx) => {
                    const isActive = activeImgIndex === idx;
                    const letter = String.fromCharCode(65 + idx);
                    return (
                      <button
                        key={img}
                        onClick={() => setActiveImgIndex(idx)}
                        onMouseEnter={() => setActiveImgIndex(idx)}
                        className={`relative aspect-[3/4] w-14 sm:w-full bg-[#f8f8f7] flex-shrink-0 border transition-all duration-200 cursor-pointer overflow-hidden ${
                          isActive
                            ? 'border-black ring-2 ring-black shadow-md opacity-100'
                            : 'border-black/15 opacity-60 hover:opacity-100 hover:border-black/50'
                        }`}
                        aria-label={`View photo ${letter}`}
                      >
                        <img src={img} alt={`${product.name} angle ${letter}`} className="w-full h-full object-contain p-0.5" />
                        <span className="absolute bottom-0.5 right-0.5 bg-black/85 text-white font-mono text-[8px] font-bold px-1 uppercase leading-tight">
                          {letter}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Main Opened Picture Stage (FULL VIEW, NEVER CROPPED + CURSOR HOVER ZOOM) */}
              <div
                ref={imageBoxRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="flex-1 w-full bg-[#f8f8f7] border border-black/[0.08] relative overflow-hidden h-[52vh] sm:h-[70vh] md:h-[74vh] max-h-[700px] flex items-center justify-center cursor-zoom-in select-none group"
              >
                {/* Full View Image with Cursor Coordinate Zoom */}
                <img
                  key={currentImage}
                  src={currentImage}
                  alt={`${product.name} - View ${String.fromCharCode(65 + activeImgIndex)}`}
                  className="w-full h-full object-contain pointer-events-none transition-transform duration-150 ease-out will-change-transform"
                  style={{
                    transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                    transform: isZoomed ? 'scale(2.3)' : 'scale(1)',
                  }}
                />

                {/* Badge */}
                {product.tag && (
                  <span className={`absolute top-3.5 left-3.5 bg-black text-white font-mono font-bold text-[9px] uppercase tracking-wider px-3 py-1 shadow-sm z-10 pointer-events-none transition-opacity duration-200 ${
                    isZoomed ? 'opacity-0' : 'opacity-100'
                  }`}>
                    {product.tag}
                  </span>
                )}

                {/* Photo Angle Indicator */}
                <div className={`absolute top-3.5 right-3.5 bg-white/95 backdrop-blur-sm border border-black/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-dark/75 font-bold z-10 pointer-events-none transition-opacity duration-200 ${
                  isZoomed ? 'opacity-0' : 'opacity-100'
                }`}>
                  Angle {String.fromCharCode(65 + activeImgIndex)} // {String(activeImgIndex + 1).padStart(2, '0')}/{String(galleryImages.length).padStart(2, '0')}
                </div>

                {/* Zoom Affordance Pill (bottom-left) */}
                <div className={`absolute bottom-3.5 left-3.5 bg-black/75 backdrop-blur-sm text-white font-mono text-[9px] uppercase tracking-wider px-2.5 py-1 pointer-events-none transition-opacity duration-300 z-10 ${
                  isZoomed ? 'opacity-0' : 'opacity-65 group-hover:opacity-100'
                }`}>
                  ✦ Hover to Zoom
                </div>

                {/* Left/Right Floating Arrows */}
                {galleryImages.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); prevImage(); }}
                      aria-label="Previous view"
                      className={`absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-black hover:text-white text-black border border-black/15 flex items-center justify-center font-mono text-sm backdrop-blur-sm transition-all duration-300 cursor-pointer z-20 shadow-sm ${
                        isZoomed ? 'opacity-0 pointer-events-none' : 'opacity-70 sm:opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      ←
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); nextImage(); }}
                      aria-label="Next view"
                      className={`absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-black hover:text-white text-black border border-black/15 flex items-center justify-center font-mono text-sm backdrop-blur-sm transition-all duration-300 cursor-pointer z-20 shadow-sm ${
                        isZoomed ? 'opacity-0 pointer-events-none' : 'opacity-70 sm:opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      →
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right: Product Specs & Purchase */}
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col pt-1">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-3">
                <span className="w-6 h-[1px] bg-black/20" />
                <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-dark/40">
                  {product.category === 'Hoodies' ? 'Pure Cotton 360 GSM Heavyweight Hoodie' : product.category === 'Waffles' ? '240 GSM Cotton Blend Knit Waffle' : '240 GSM Heavyweight Boxy Tee'} // SS26 Drop
                </p>
              </div>

              {/* Share / Copy link button */}
              <button
                onClick={handleCopyLink}
                className="font-mono text-[10px] uppercase tracking-wider text-dark/40 hover:text-black transition-colors cursor-pointer"
              >
                {linkCopied ? '✓ Cipher Copied' : 'Share [⎘]'}
              </button>
            </div>

            <h1 className="font-syne font-black text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tight text-dark mb-2">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-3 mb-4">
              <p className="font-mono text-2xl sm:text-3xl text-dark font-black tracking-tight">
                {formatPrice(product.price)}
              </p>
              <span className="font-mono text-[11px] text-dark/40 uppercase tracking-widest">Taxes Included</span>
            </div>

            <div className="h-[1px] bg-black/[0.08] mb-4" />

            <p className="font-mono text-dark/65 leading-relaxed text-xs sm:text-[13px] mb-5">
              {product.description}
            </p>

            {/* Colorway */}
            <div className="mb-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-dark/40 mb-2">
                // Colorway
              </p>
              <span className="inline-block border border-black/15 bg-[#fafafa] px-3.5 py-1.5 font-mono text-xs uppercase text-dark font-bold">
                {product.color}
              </span>
            </div>

            {/* Sizes */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-dark/40">
                  // Select Silhouette Size
                </p>
                <button
                  type="button"
                  onClick={() => setShowSizeGuide(true)}
                  className="font-mono text-[9px] text-dark/60 hover:text-black underline uppercase cursor-pointer transition-colors"
                >
                  Boxy Oversized Fit Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[48px] py-2.5 text-xs font-mono font-bold uppercase border transition-all duration-200 cursor-pointer ${
                      selectedSize === size
                        ? 'bg-black text-white border-black shadow-sm'
                        : 'border-black/15 text-dark hover:border-black bg-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Scarcity indicator */}
            <div className="mb-4 flex items-center gap-2 bg-[#fcfcfb] border border-black/10 px-3 py-2 font-mono text-[10px]">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span className="text-dark/70 uppercase">
                High Velocity: Only <strong className="text-black font-bold">4 units</strong> remaining in Size {selectedSize}
              </span>
            </div>

            {/* Quantity */}
            <div className="mb-5">
              <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-dark/40 mb-2">
                // Allocation Quantity
              </p>
              <div className="inline-flex items-center border border-black/15 bg-white font-mono">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-3.5 py-2 text-dark/60 hover:text-dark hover:bg-black/5 transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="px-5 py-2 text-xs border-x border-black/15 font-bold">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="px-3.5 py-2 text-dark/60 hover:text-dark hover:bg-black/5 transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA button */}
            <button
              onClick={handleClaim}
              className="w-full bg-black text-white py-3.5 sm:py-4 font-mono text-xs uppercase tracking-[0.25em] font-bold hover:bg-black/85 transition-all duration-300 mb-2.5 cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              {added ? (
                <>
                  <span className="text-emerald-400">✓</span> Allocated to Bag
                </>
              ) : (
                `Claim Unit — ${formatPrice(product.price * qty)}`
              )}
            </button>

            {/* Guarantees */}
            <div className="mt-4 border-t border-black/[0.08] pt-4 space-y-2 font-mono text-[11px] text-dark/50">
              {[
                'Pan-India express air dispatch with vacuum-sealed security packaging',
                product.category === 'Hoodies'
                  ? 'Custom 360 GSM pure cotton heavyweight fleece construction'
                  : product.category === 'Waffles'
                  ? 'Custom 240 GSM cotton blend knit waffle fabric with elongated slouch sleeves'
                  : 'Custom 240 GSM heavy combed cotton boxy construction',
                'Limited Syndicate drop batch: All sales final (Zero cancellations / no returns)'
              ].map((info) => (
                <div key={info} className="flex items-center gap-2">
                  <span className="text-black font-bold">✦</span>
                  <span>{info}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Associated Units (Related Products) */}
        <div className="mt-20 pt-12 border-t border-black/[0.08]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-dark/40 mb-1">
                // SYNDICATE ARCHIVE
              </p>
              <h2 className="font-syne font-black text-xl sm:text-2xl uppercase tracking-tight text-dark">
                Associated Units
              </h2>
            </div>
            <Link
              to="/collection"
              className="font-mono text-xs uppercase tracking-widest text-dark/60 hover:text-dark font-bold underline underline-offset-4"
            >
              View All ({products.length})
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {related.map((rel) => (
              <Link
                key={rel.id}
                to={`/product/${rel.id}`}
                className="group block bg-[#fafafa] border border-black/[0.06] hover:border-black/25 transition-all p-3 sm:p-4"
              >
                <div className="aspect-[3/4] bg-[#f5f5f3] overflow-hidden relative mb-3">
                  <img
                    src={rel.image}
                    alt={rel.name}
                    className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-500"
                  />
                  {rel.images && rel.images.length > 1 && (
                    <img
                      src={rel.images[1]}
                      alt={`${rel.name} alternate view`}
                      className="absolute inset-0 w-full h-full object-contain p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />
                  )}
                </div>
                <h3 className="font-syne font-bold uppercase text-xs sm:text-sm text-dark truncate group-hover:underline">
                  {rel.name}
                </h3>
                <div className="flex justify-between items-center mt-1.5 font-mono text-[11px]">
                  <span className="text-dark/40 uppercase">{rel.color}</span>
                  <span className="font-bold text-dark">{formatPrice(rel.price)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Sizing Chart Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border-2 border-black max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-black pb-4 mb-5">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-widest text-dark/40">
                  Architectural Block Specification
                </p>
                <h3 className="font-syne font-black text-xl uppercase tracking-tight text-dark">
                  Boxy Oversized Sizing Guide
                </h3>
              </div>
              <button
                onClick={() => setShowSizeGuide(false)}
                className="text-dark/50 hover:text-black font-mono text-sm p-1 cursor-pointer"
                aria-label="Close size guide"
              >
                ✕
              </button>
            </div>

            <p className="font-mono text-xs text-dark/70 mb-5 leading-relaxed">
              Designed with a slouch drop-shoulder, widened torso, and structured boxy hang. Select your usual size for an oversized aesthetic, or size down one step for a standard streetwear drape.
            </p>

            {/* Measurement Table */}
            <div className="border border-black/15 mb-6 overflow-hidden">
              <table className="w-full font-mono text-xs text-left">
                <thead className="bg-[#f5f5f3] border-b border-black/15 text-[10px] uppercase text-dark/60 tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Size</th>
                    <th className="py-2.5 px-3">Chest (in)</th>
                    <th className="py-2.5 px-3">Length (in)</th>
                    <th className="py-2.5 px-3">Shoulder (in)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10">
                  {[
                    { size: 'S', chest: '44"', length: '28"', shoulder: '22"' },
                    { size: 'M', chest: '46"', length: '29"', shoulder: '23"' },
                    { size: 'L', chest: '48"', length: '30"', shoulder: '24"' },
                    { size: 'XL', chest: '50"', length: '31"', shoulder: '25"' },
                    { size: 'XXL', chest: '52"', length: '32"', shoulder: '26"' },
                  ].map((row) => (
                    <tr
                      key={row.size}
                      className={selectedSize === row.size ? 'bg-black text-white font-bold' : 'hover:bg-black/5'}
                    >
                      <td className="py-2 px-3 font-bold">{row.size}</td>
                      <td className="py-2 px-3">{row.chest}</td>
                      <td className="py-2 px-3">{row.length}</td>
                      <td className="py-2 px-3">{row.shoulder}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-[#fafafa] border border-black/10 p-3 font-mono text-[10px] text-dark/60 space-y-1 mb-6">
              <p className="font-bold text-dark uppercase">✦ Model Specification:</p>
              <p>Model is 6'1" (185 cm) / 74 kg wearing Silhouette Size L for intentional slouch hang.</p>
            </div>

            <button
              onClick={() => setShowSizeGuide(false)}
              className="w-full bg-black text-white py-3 font-mono text-xs uppercase tracking-[0.2em] font-bold hover:bg-black/85 transition-colors cursor-pointer"
            >
              Confirm Size ({selectedSize})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
