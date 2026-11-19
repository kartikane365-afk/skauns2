import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice, type Product } from '../data/products';
import type { CategoryConfig, SectionBannerConfig } from '../context/StoreContext';
import { SectionBanner } from './SectionBanner';

interface CategoryCarouselProps {
  index: number;
  category: CategoryConfig;
  banner?: SectionBannerConfig;
  products: Product[];
  cardsPerView: number;
}

export function CategoryCarousel({
  index,
  category,
  banner,
  products,
  cardsPerView,
}: CategoryCarouselProps) {
  const [rawSlideIndex, setSlideIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const maxSlide = Math.max(0, products.length - cardsPerView);
  const slideIndex = Math.min(rawSlideIndex, maxSlide);

  const nextSlide = () => setSlideIndex((prev) => Math.min(maxSlide, Math.min(prev, maxSlide) + 1));
  const prevSlide = () => setSlideIndex((prev) => Math.max(0, Math.min(prev, maxSlide) - 1));

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStart;
    if (deltaX > 45) prevSlide();
    else if (deltaX < -45) nextSlide();
    setTouchStart(null);
  };

  const sectionId =
    category.id === 'Tees'
      ? 'boxy-tees-section'
      : category.id === 'Waffles'
        ? 'waffle-section'
        : category.id === 'Hoodies'
          ? 'hoodies-section'
          : `${category.id.toLowerCase()}-section`;

  const sectionNum = String(index + 1).padStart(2, '0');

  return (
    <>
      {banner && (
        <SectionBanner
          title={banner.title}
          categoryName={banner.categoryName}
          gsm={banner.gsm}
          coolLine={banner.coolLine}
          image={banner.image}
          objectPosition={banner.objectPosition || 'object-[center_32%]'}
          targetSectionId={sectionId}
          itemCount={products.length}
        />
      )}

      <section
        id={sectionId}
        className="bg-white text-dark pt-16 sm:pt-24 pb-16 sm:pb-24 relative z-20 overflow-hidden border-b border-black/[0.08]"
      >
        {/* Ghost background text */}
        <div className="absolute top-6 sm:top-10 left-0 pointer-events-none select-none overflow-hidden w-full">
          <span className="font-bebas text-[22vw] text-black/[0.02] leading-none whitespace-nowrap block pl-6 sm:pl-10">
            {category.watermark || category.name.toUpperCase()}
          </span>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 relative z-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 sm:mb-14 gap-4 pb-4 border-b border-black/[0.06]">
            <div>
              <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.4em] text-dark/35 mb-2 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-black/25" />
                Section {sectionNum} // {category.sectionSubtitle || category.subtitle}
              </p>
              <h2 className="font-syne font-black text-2xl sm:text-4xl uppercase tracking-tighter text-dark !mb-0">
                {category.name}
              </h2>
            </div>
            <div>
              <Link
                to={`/collection?category=${encodeURIComponent(category.id)}`}
                className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.25em] text-dark/60 hover:text-dark items-center gap-2 transition-colors duration-300 link-underline font-bold inline-flex"
              >
                Explore All {category.id} ({products.length}) →
              </Link>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="border border-black/10 bg-[#fafafa] py-14 text-center font-mono text-xs text-dark/50">
              No pieces published in {category.name} yet.
            </div>
          ) : (
            <>
              {/* Product Slider Track */}
              <div
                className="overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <div
                  className="flex"
                  style={{
                    transform: `translateX(-${slideIndex * (100 / cardsPerView)}%)`,
                    transition: 'transform 0.9s cubic-bezier(0.23,1,0.32,1)',
                  }}
                >
                  {products.map((product, i) => (
                    <div
                      key={product.id}
                      id={product.id}
                      className="w-full sm:w-1/2 lg:w-1/4 flex-shrink-0 px-2 sm:px-3"
                      style={{ paddingTop: i % 2 === 1 ? '1.75rem' : '0' }}
                    >
                      <Link to={`/product/${product.id}`} className="group block relative">
                        <div className="absolute -top-1 -left-1 z-20 font-bebas text-[4rem] sm:text-[5rem] leading-none text-black/[0.04] group-hover:text-black/[0.1] transition-colors duration-700 select-none pointer-events-none">
                          {String(i + 1).padStart(2, '0')}
                        </div>

                        <div className="aspect-[3/4] bg-[#f3f3f1] overflow-hidden relative border border-black/[0.05] group-hover:border-black/[0.12] transition-all duration-600 flex items-center justify-center p-2.5">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain grayscale-[15%] group-hover:grayscale-0 transition-all duration-700 ease-out group-hover:scale-105"
                          />

                          {product.images && product.images.length > 1 && (
                            <img
                              src={product.images[1]}
                              alt={`${product.name} alternate view`}
                              className="absolute inset-0 w-full h-full object-contain p-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out pointer-events-none group-hover:scale-105"
                            />
                          )}

                          {product.tag && (
                            <span className="absolute top-3 left-3 bg-black text-white font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 font-bold z-10 shadow-sm">
                              {product.tag}
                            </span>
                          )}

                          <div className="absolute bottom-0 inset-x-0 bg-black/90 text-white py-3 text-center font-mono text-[10px] uppercase tracking-[0.3em] font-bold transform translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] z-20">
                            View Silhouette →
                          </div>
                        </div>

                        <div className="pt-4 pb-2 flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="font-syne font-bold text-sm sm:text-[15px] uppercase tracking-tight text-dark group-hover:underline truncate">
                              {product.name}
                            </h3>
                            <p className="font-mono text-[10px] text-dark/40 uppercase tracking-widest mt-0.5 truncate">
                              {product.color}
                            </p>
                          </div>
                          <span className="font-mono font-bold text-sm text-dark flex-shrink-0">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Slider Progress & Controls */}
              <div className="mt-10 sm:mt-12">
                <div className="relative w-full h-[1px] bg-black/10 mb-6">
                  <div
                    className="absolute top-0 left-0 h-[2px] bg-black -translate-y-[0.5px]"
                    style={{
                      width: `${maxSlide > 0 ? (slideIndex / maxSlide) * 100 : 100}%`,
                      transition: 'width 0.9s cubic-bezier(0.23,1,0.32,1)',
                    }}
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="hidden sm:flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-dark/40">
                    <span className="w-2 h-2 rounded-full bg-black/40" />
                    <span>
                      {category.name} // {products.length} Silhouettes Archived
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={prevSlide}
                      disabled={slideIndex === 0}
                      className="px-4 py-2.5 border border-black/15 font-mono text-xs uppercase tracking-widest text-dark hover:bg-black hover:text-white transition-all duration-300 disabled:opacity-20 disabled:pointer-events-none flex items-center gap-2 cursor-pointer shadow-sm"
                      aria-label={`Previous ${category.name}`}
                    >
                      <span>←</span>
                      <span className="text-[10px] font-bold">PREV</span>
                    </button>

                    <div className="px-4 py-2 bg-[#f5f5f3] border border-black/10 font-mono text-[11px] tracking-widest text-dark font-bold select-none min-w-[5rem] text-center">
                      {String(slideIndex + 1).padStart(2, '0')} / {String(maxSlide + 1).padStart(2, '0')}
                    </div>

                    <button
                      onClick={nextSlide}
                      disabled={slideIndex >= maxSlide}
                      className="px-4 py-2.5 border border-black/15 font-mono text-xs uppercase tracking-widest text-dark hover:bg-black hover:text-white transition-all duration-300 disabled:opacity-20 disabled:pointer-events-none flex items-center gap-2 cursor-pointer shadow-sm"
                      aria-label={`Next ${category.name}`}
                    >
                      <span className="text-[10px] font-bold">NEXT</span>
                      <span>→</span>
                    </button>
                  </div>

                  <div>
                    <Link
                      to={`/collection?category=${encodeURIComponent(category.id)}`}
                      className="font-mono text-[10px] uppercase tracking-[0.2em] text-dark/50 border border-black/10 px-6 py-2.5 inline-block hover:bg-black hover:text-white transition-all duration-300"
                    >
                      View All {category.id} ({products.length}) →
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
