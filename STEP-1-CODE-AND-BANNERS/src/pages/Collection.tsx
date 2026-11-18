import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { formatPrice } from '../data/products';
import type { Product } from '../data/products';
import { useStore } from '../context/StoreContext';

export default function Collection() {
  const { products, categories: storeCategories } = useStore();
  const [searchParams] = useSearchParams();
  const catParam = searchParams.get('category');
  const [userSelectedCat, setUserSelectedCat] = useState<string | null>(null);
  const [prevCatParam, setPrevCatParam] = useState(catParam);

  if (catParam !== prevCatParam) {
    setPrevCatParam(catParam);
    setUserSelectedCat(null);
  }

  // Build filter pills dynamically from StoreContext categories + colorway filters
  const filterTabs = useMemo(() => {
    const catIds = storeCategories.map((c) => c.id);
    return ['All', ...catIds, 'Washed Black', 'Raw Bone'];
  }, [storeCategories]);

  const resolvedParam = useMemo(() => {
    if (!catParam) return 'All';
    const lower = catParam.toLowerCase();
    const matched = storeCategories.find(
      (c) =>
        c.id.toLowerCase() === lower ||
        c.name.toLowerCase() === lower ||
        (lower === 'waffle' && c.id === 'Waffles') ||
        (lower === 'hoodie' && c.id === 'Hoodies')
    );
    return matched ? matched.id : 'All';
  }, [catParam, storeCategories]);

  const active = userSelectedCat ?? resolvedParam;
  const setActive = (cat: string) => setUserSelectedCat(cat);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'name'>('default');
  const [viewMode, setViewMode] = useState<'grid' | 'dense'>('grid');

  const filtered = useMemo(() => {
    let result =
      active === 'All'
        ? products
        : active === 'Washed Black'
          ? products.filter((p) => p.color.toLowerCase().includes('black'))
          : active === 'Raw Bone'
            ? products.filter(
                (p) => p.color.toLowerCase().includes('bone') || p.color.toLowerCase().includes('white')
              )
            : products.filter((p) => p.category === active);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.color.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [active, products, searchQuery, sortBy]);

  const getTabLabel = (tab: string) => {
    if (tab === 'Waffles') return 'Waffle Knit';
    const cat = storeCategories.find((c) => c.id === tab);
    return cat ? cat.id : tab;
  };

  const renderProductCard = (product: Product) => (
    <Link
      key={product.id}
      to={`/product/${product.id}`}
      className="group block product-card bg-[#fafafa] border border-black/[0.06] hover:border-black/25 transition-all duration-300 relative"
    >
      <div className="aspect-[3/4] bg-[#f5f5f3] overflow-hidden relative flex items-center justify-center p-2.5">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain grayscale-[10%] group-hover:grayscale-0 group-hover:scale-[1.04] transition-all duration-500 ease-out"
        />

        {product.images && product.images.length > 1 && (
          <img
            src={product.images[1]}
            alt={`${product.name} alternate view`}
            className="absolute inset-0 w-full h-full object-contain p-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out pointer-events-none group-hover:scale-[1.04]"
          />
        )}

        {product.tag && (
          <span className="absolute top-2.5 left-2.5 bg-black text-white font-mono font-bold text-[8px] uppercase tracking-wider px-2 py-1 shadow-sm z-10">
            {product.tag}
          </span>
        )}

        <span className="absolute bottom-2.5 right-2.5 font-mono text-[8px] text-dark/40 uppercase tracking-widest bg-white/80 px-1.5 py-0.5 z-10">
          {product.category === 'Hoodies'
            ? 'Pure Cotton Hoodie'
            : product.category === 'Waffles'
              ? 'Cotton Blend Waffle'
              : product.category === 'Tees'
                ? 'Boxy Tee'
                : product.category}
        </span>

        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] z-20">
          <div className="w-full bg-black text-white py-2 text-center font-mono text-[9px] uppercase tracking-[0.25em] font-bold shadow-md">
            Inspect Unit →
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-4 bg-white border-t border-black/[0.04]">
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0">
            <h3 className="font-syne font-bold text-xs sm:text-sm uppercase tracking-tight text-dark group-hover:underline truncate">
              {product.name}
            </h3>
            <p className="font-mono text-[9px] sm:text-[10px] text-dark/40 uppercase tracking-widest mt-0.5 truncate">
              {product.color}
            </p>
          </div>
          <p className="font-mono text-dark font-bold text-xs sm:text-sm whitespace-nowrap">
            {formatPrice(product.price)}
          </p>
        </div>
      </div>
    </Link>
  );

  const showSectionSplit = active === 'All' && !searchQuery.trim() && sortBy === 'default';

  return (
    <div className="bg-white text-dark min-h-screen w-full pt-28 sm:pt-36 pb-24">
      {/* Header */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 mb-10 sm:mb-14">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-8 h-[1px] bg-black/20" />
          <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.35em] text-dark/40">
            Archive // SS26
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-black/[0.08]">
          <div>
            <h1 className="font-syne font-black text-4xl sm:text-6xl uppercase tracking-tighter text-dark mb-2">
              The Collection
            </h1>
            <p className="font-mono text-xs sm:text-sm text-dark/40">
              Architectural streetwear: 240 GSM Boxy Tees, 240 GSM Cotton Blend Knit Waffles & Pure Cotton 360 GSM Hoodies.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <span className="font-mono text-xs text-dark/40 uppercase tracking-widest">
              Showing <span className="font-bold text-dark">{filtered.length}</span>{' '}
              {filtered.length === 1 ? 'Piece' : 'Pieces'}
            </span>

            <div className="hidden sm:inline-flex border border-black/15 font-mono text-[10px]">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-2.5 py-1 uppercase ${viewMode === 'grid' ? 'bg-black text-white font-bold' : 'text-dark/50 hover:text-black'}`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('dense')}
                className={`px-2.5 py-1 uppercase border-l border-black/15 ${viewMode === 'dense' ? 'bg-black text-white font-bold' : 'text-dark/50 hover:text-black'}`}
              >
                Dense
              </button>
            </div>
          </div>
        </div>

        {/* Filters, Search & Sort */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center mt-6 pt-2">
          <div className="flex flex-wrap gap-2">
            {filterTabs.map((cat) => {
              const count =
                cat === 'All'
                  ? products.length
                  : cat === 'Washed Black'
                    ? products.filter((p) => p.color.toLowerCase().includes('black')).length
                    : cat === 'Raw Bone'
                      ? products.filter(
                          (p) => p.color.toLowerCase().includes('bone') || p.color.toLowerCase().includes('white')
                        ).length
                      : products.filter((p) => p.category === cat).length;
              const isSelected = active === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
                  className={`px-3.5 sm:px-4 py-2 font-mono text-[11px] uppercase tracking-wider transition-all duration-300 border flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-black text-white border-black font-bold shadow-sm'
                      : 'bg-white text-dark/60 border-black/10 hover:border-black hover:text-black'
                  }`}
                >
                  <span>{getTabLabel(cat)}</span>
                  <span className={`text-[9px] ${isSelected ? 'text-white/60' : 'text-dark/30'}`}>({count})</span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-stretch sm:items-center">
            <div className="relative min-w-[200px]">
              <input
                type="text"
                placeholder="FILTER SILHOUETTES..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#fafafa] border border-black/15 px-3 py-2 text-xs font-mono uppercase tracking-wider placeholder:text-dark/30 focus:outline-none focus:border-black"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-dark/40 hover:text-black font-mono text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'default' | 'price-asc' | 'price-desc' | 'name')}
              className="bg-[#fafafa] border border-black/15 px-3 py-2 text-xs font-mono uppercase tracking-wider text-dark/70 focus:outline-none focus:border-black cursor-pointer"
            >
              <option value="default">Sort: Archive Order</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name: Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Section Quick Jump Buttons */}
        {showSectionSplit && (
          <div className="flex flex-wrap items-center gap-3 mt-6 pt-4 border-t border-black/[0.06] font-mono text-xs">
            <span className="text-dark/40 uppercase tracking-widest text-[10px]">Jump to Section:</span>
            {storeCategories.map((cat, idx) => {
              const catItems = filtered.filter((p) => p.category === cat.id);
              return (
                <a
                  key={cat.id}
                  href={`#cat-${cat.id.toLowerCase()}`}
                  className="px-3 py-1 bg-[#f5f5f3] hover:bg-black hover:text-white transition-colors border border-black/10 uppercase tracking-wider text-[11px]"
                >
                  ↓ {String(idx + 1).padStart(2, '0')}. {cat.id} ({catItems.length})
                </a>
              );
            })}
          </div>
        )}
      </div>

      {/* Product Display */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10">
        {showSectionSplit ? (
          <div className="space-y-20">
            {storeCategories.map((cat, idx) => {
              const catItems = filtered.filter((p) => p.category === cat.id);
              return (
                <section
                  key={cat.id}
                  id={`cat-${cat.id.toLowerCase()}`}
                  className={`scroll-mt-36 ${idx > 0 ? 'pt-6 border-t border-black/10' : ''}`}
                >
                  <div className="flex items-end justify-between border-b border-black/15 pb-4 mb-8">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-dark/40 block mb-1">
                        Section {String(idx + 1).padStart(2, '0')} // {cat.sectionSubtitle || cat.subtitle}
                      </span>
                      <h2 className="font-syne font-black text-2xl sm:text-3xl uppercase tracking-tight text-dark">
                        {cat.name} ({catItems.length})
                      </h2>
                    </div>
                    <button
                      onClick={() => setActive(cat.id)}
                      className="font-mono text-xs uppercase tracking-widest text-dark/60 hover:text-black underline underline-offset-4"
                    >
                      Isolate {cat.id} →
                    </button>
                  </div>

                  {catItems.length === 0 ? (
                    <div className="border border-dashed border-black/15 p-8 text-center font-mono text-xs text-dark/45">
                      No pieces in {cat.name} yet.
                    </div>
                  ) : (
                    <div
                      className={`grid gap-4 sm:gap-6 ${
                        viewMode === 'dense'
                          ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                          : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                      }`}
                    >
                      {catItems.map(renderProductCard)}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        ) : (
          <div
            className={`grid gap-4 sm:gap-6 ${
              viewMode === 'dense'
                ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            }`}
          >
            {filtered.map(renderProductCard)}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-24 border border-dashed border-black/15 bg-[#fafafa]">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-dark/40 mb-2">// ARCHIVE EMPTY</p>
            <p className="font-syne text-xl text-dark font-bold mb-4">No units matching your query.</p>
            <button
              onClick={() => {
                setActive('All');
                setSearchQuery('');
              }}
              className="font-mono text-xs uppercase tracking-widest text-black underline underline-offset-4 cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
