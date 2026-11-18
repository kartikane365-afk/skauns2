import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  useStore,
  type CategoryConfig,
  type SectionBannerConfig,
  type HeroSlideConfig,
  type OrderStatus,
} from '../context/StoreContext';
import { formatPrice, type Product } from '../data/products';
import { fileToDataUrl } from '../utils/storeDb';

type AdminTab = 'products' | 'categories' | 'banners' | 'hero' | 'orders';

export default function Admin() {
  const { user, isAdmin, logout, changePassword } = useAuth();
  const {
    products,
    categories,
    sectionBanners,
    heroSlides,
    orders,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    addSectionBanner,
    updateSectionBanner,
    deleteSectionBanner,
    addHeroSlide,
    updateHeroSlide,
    deleteHeroSlide,
    moveHeroSlide,
    updateOrderStatus,
    deleteOrder,
    resetStoreToDefaults,
  } = useStore();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  // ──────────────────────────────────────────────────────────────
  // 1. PRODUCT FORM STATE
  // ──────────────────────────────────────────────────────────────
  const [productSearch, setProductSearch] = useState('');
  const [productCatFilter, setProductCatFilter] = useState('ALL');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [prodForm, setProdForm] = useState({
    name: '',
    price: '1099',
    category: categories[0]?.id || 'Tees',
    color: 'Washed Black',
    sizes: 'S, M, L, XL, XXL',
    tag: 'New Release',
    description: '',
    image: '',
    images: [] as string[],
    extraImageUrl: '',
  });

  const openNewProductForm = () => {
    setEditingProductId(null);
    const defaultCat = categories[0];
    setProdForm({
      name: '',
      price: String(defaultCat?.defaultPrice ?? 1099),
      category: defaultCat?.id || 'Tees',
      color: 'Vintage Washed Black',
      sizes: 'S, M, L, XL, XXL',
      tag: 'New Release',
      description: '',
      image: '',
      images: [],
      extraImageUrl: '',
    });
    setShowProductForm(true);
  };

  const openEditProductForm = (p: Product) => {
    setEditingProductId(p.id);
    setProdForm({
      name: p.name,
      price: String(p.price),
      category: p.category,
      color: p.color,
      sizes: p.sizes.join(', '),
      tag: p.tag || '',
      description: p.description,
      image: p.image,
      images: p.images && p.images.length > 0 ? [...p.images] : [p.image],
      extraImageUrl: '',
    });
    setShowProductForm(true);
  };

  const handleProductFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isPrimary: boolean) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      const urls = await Promise.all(Array.from(files).map((f) => fileToDataUrl(f)));
      if (isPrimary) {
        const primaryUrl = urls[0];
        setProdForm((prev) => ({
          ...prev,
          image: primaryUrl,
          images: [primaryUrl, ...prev.images.filter((img) => img !== prev.image)],
        }));
      } else {
        setProdForm((prev) => {
          const nextImages = [...prev.images, ...urls];
          return {
            ...prev,
            image: prev.image || nextImages[0] || '',
            images: nextImages,
          };
        });
      }
      showToast(`Uploaded ${urls.length} image(s)`);
    } catch {
      showToast('Failed to read image file');
    }
    e.target.value = '';
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const numericPrice = Math.max(0, Number(prodForm.price) || 0);
    const parsedSizes = prodForm.sizes
      .split(',')
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean);
    const gallery = prodForm.images.length > 0 ? prodForm.images : prodForm.image ? [prodForm.image] : [];
    const primaryImg = prodForm.image || gallery[0] || '/logo.png';

    const payload = {
      name: prodForm.name.trim(),
      price: numericPrice,
      category: prodForm.category,
      color: prodForm.color.trim() || 'Obsidian Black',
      sizes: parsedSizes.length > 0 ? parsedSizes : ['S', 'M', 'L', 'XL'],
      tag: prodForm.tag.trim() || undefined,
      description: prodForm.description.trim() || 'SKAUNS architectural heavyweight silhouette.',
      image: primaryImg,
      images: gallery.length > 0 ? gallery : [primaryImg],
    };

    if (editingProductId) {
      updateProduct(editingProductId, payload);
      showToast(`Updated product "${payload.name}"`);
    } else {
      addProduct(payload);
      showToast(`Added new product "${payload.name}"`);
    }
    setShowProductForm(false);
    setEditingProductId(null);
  };

  // ──────────────────────────────────────────────────────────────
  // 2. CATEGORY FORM STATE
  // ──────────────────────────────────────────────────────────────
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [catForm, setCatForm] = useState<CategoryConfig>({
    id: '',
    name: '',
    navLabel: '',
    subtitle: '',
    sectionSubtitle: '',
    watermark: '',
    gsm: '240 GSM',
    defaultPrice: 1299,
  });

  const resetCatForm = () => {
    setEditingCatId(null);
    setCatForm({
      id: '',
      name: '',
      navLabel: '',
      subtitle: '',
      sectionSubtitle: '',
      watermark: '',
      gsm: '240 GSM',
      defaultPrice: 1299,
    });
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catForm.id.trim() || !catForm.name.trim()) return;
    if (editingCatId) {
      updateCategory(editingCatId, catForm);
      showToast(`Updated category "${catForm.name}"`);
    } else {
      addCategory({
        ...catForm,
        id: catForm.id.trim(),
        navLabel: catForm.navLabel.trim() || `Shop ${catForm.name.trim()}`,
        watermark: (catForm.watermark.trim() || catForm.name.trim()).toUpperCase(),
      });
      showToast(`Added category "${catForm.name}"`);
    }
    resetCatForm();
  };

  // ──────────────────────────────────────────────────────────────
  // 3. SECTION BANNER FORM STATE
  // ──────────────────────────────────────────────────────────────
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [bannerForm, setBannerForm] = useState<Omit<SectionBannerConfig, 'id'>>({
    categoryId: categories[0]?.id || 'Tees',
    title: '',
    categoryName: '',
    gsm: '240 GSM',
    coolLine: '',
    image: '',
    objectPosition: 'object-[center_32%]',
  });

  const resetBannerForm = () => {
    setEditingBannerId(null);
    setBannerForm({
      categoryId: categories[0]?.id || 'Tees',
      title: '',
      categoryName: '',
      gsm: '240 GSM',
      coolLine: '',
      image: '',
      objectPosition: 'object-[center_32%]',
    });
  };

  const handleBannerFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      setBannerForm((prev) => ({ ...prev, image: dataUrl }));
      showToast('Banner image loaded');
    } catch {
      showToast('Failed to read banner image');
    }
    e.target.value = '';
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerForm.title.trim() || !bannerForm.image.trim()) return;
    if (editingBannerId) {
      updateSectionBanner(editingBannerId, bannerForm);
      showToast(`Updated section banner "${bannerForm.title}"`);
    } else {
      addSectionBanner(bannerForm);
      showToast(`Added section banner "${bannerForm.title}"`);
    }
    resetBannerForm();
  };

  // ──────────────────────────────────────────────────────────────
  // 4. MAIN LANDING HERO SLIDE FORM STATE
  // ──────────────────────────────────────────────────────────────
  const [editingHeroId, setEditingHeroId] = useState<string | null>(null);
  const [heroForm, setHeroForm] = useState<Omit<HeroSlideConfig, 'id'>>({
    image: '',
    alt: 'SKAUNS Campaign',
    objectPosition: 'object-center',
    watermark: 'SYNDICATE',
    category: 'SS26 Drop // NEW',
    tagline: 'THE NEW STANDARD.',
    theme: 'dark',
    headlineLine1: 'NEW',
    headlineLine2: 'DROP.',
    headlineStyle: 'boxy',
    ctaText: 'Explore Collection',
    ctaLink: '/collection',
    badgeTitle: '240 GSM Heavyweight',
    badgeSubtitle: 'Series / NEW',
    label: '04 // DROP',
  });

  const resetHeroForm = () => {
    setEditingHeroId(null);
    setHeroForm({
      image: '',
      alt: 'SKAUNS Campaign',
      objectPosition: 'object-center',
      watermark: 'SYNDICATE',
      category: `Drop // 0${heroSlides.length + 1}`,
      tagline: 'ARCHITECTURAL FORM.',
      theme: 'dark',
      headlineLine1: 'NEW',
      headlineLine2: 'DROP.',
      headlineStyle: 'boxy',
      ctaText: 'Explore Collection',
      ctaLink: '/collection',
      badgeTitle: 'Heavyweight Edition',
      badgeSubtitle: `Series / 0${heroSlides.length + 1}`,
      label: `0${heroSlides.length + 1} // DROP`,
    });
  };

  const handleHeroFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      setHeroForm((prev) => ({ ...prev, image: dataUrl }));
      showToast('Main landing hero image loaded');
    } catch {
      showToast('Failed to read hero image');
    }
    e.target.value = '';
  };

  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroForm.image.trim() || !heroForm.headlineLine1.trim()) return;
    if (editingHeroId) {
      updateHeroSlide(editingHeroId, heroForm);
      showToast(`Updated landing slide "${heroForm.label}"`);
    } else {
      addHeroSlide(heroForm);
      showToast(`Added landing slide "${heroForm.label}"`);
    }
    resetHeroForm();
  };

  // ──────────────────────────────────────────────────────────────
  // 5. PASSWORD CHANGE & ORDERS STATE
  // ──────────────────────────────────────────────────────────────
  const [pwForm, setPwForm] = useState({ current: '', next: '' });
  const [pwMessage, setPwMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    const res = changePassword(pwForm.current, pwForm.next);
    setPwMessage({ text: res.message, ok: res.success });
    if (res.success) setPwForm({ current: '', next: '' });
  };

  // Access Gate: Strictly Master Admin only
  if (!user || !isAdmin) {
    return (
      <div className="bg-white text-dark min-h-screen pt-36 pb-24 px-6">
        <div className="max-w-md mx-auto border-2 border-black p-8 text-center font-mono">
          <p className="text-[10px] uppercase tracking-[0.35em] text-red-600 font-bold mb-2">
            // RESTRICTED SECTOR
          </p>
          <h1 className="font-syne font-black text-2xl sm:text-3xl uppercase tracking-tight text-dark mb-3">
            Master Access Required
          </h1>
          <p className="text-xs text-dark/60 leading-relaxed mb-6">
            This control studio is restricted to the authorized SKAUNS master account. Please sign in with authorized credentials.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/login?redirect=/admin"
              className="w-full bg-black text-white py-3 text-xs uppercase tracking-[0.2em] font-bold"
            >
              Sign In →
            </Link>
            <Link
              to="/"
              className="w-full border border-black/20 py-3 text-xs uppercase tracking-[0.2em] font-bold hover:border-black"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const filteredProducts = products.filter((p) => {
    const matchesCat = productCatFilter === 'ALL' || p.category === productCatFilter;
    const q = productSearch.trim().toLowerCase();
    const matchesQ =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.color.toLowerCase().includes(q);
    return matchesCat && matchesQ;
  });

  return (
    <div className="bg-[#f8f8f6] text-dark min-h-screen pt-24 sm:pt-32 pb-24">
      {/* Floating Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-black text-white px-5 py-3 font-mono text-xs uppercase tracking-wider shadow-xl border border-white/20">
          ✦ {toast}
        </div>
      )}

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
        {/* Top Master Header */}
        <div className="bg-black text-white p-6 sm:p-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-black">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/50 mb-1">
              // MASTER CONTROL STUDIO • LIVE CMS
            </p>
            <h1 className="font-syne font-black text-2xl sm:text-4xl uppercase tracking-tight">
              SKAUNS Admin Command
            </h1>
            <p className="font-mono text-[11px] text-white/65 mt-1">
              Signed in as Master Owner ({user.fullName}) • Changes go live across the website instantly.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
            <Link
              to="/"
              className="border border-white/30 hover:bg-white hover:text-black px-4 py-2.5 uppercase tracking-wider font-bold transition-colors"
            >
              View Live Site ↗
            </Link>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="bg-white/15 hover:bg-red-600 text-white px-4 py-2.5 uppercase tracking-wider font-bold transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Live Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 mb-8 font-mono">
          {[
            { label: 'Products', val: products.length, tab: 'products' as AdminTab },
            { label: 'Categories', val: categories.length, tab: 'categories' as AdminTab },
            { label: 'Section Banners', val: sectionBanners.length, tab: 'banners' as AdminTab },
            { label: 'Landing Hero Slides', val: heroSlides.length, tab: 'hero' as AdminTab },
            { label: 'Orders & Codes', val: orders.length, tab: 'orders' as AdminTab },
          ].map((stat) => (
            <button
              key={stat.tab}
              onClick={() => setActiveTab(stat.tab)}
              className={`p-4 text-left border transition-all ${
                activeTab === stat.tab
                  ? 'bg-black text-white border-black shadow-md'
                  : 'bg-white text-dark border-black/15 hover:border-black'
              }`}
            >
              <span className={`text-[10px] uppercase tracking-widest block ${activeTab === stat.tab ? 'text-white/60' : 'text-dark/45'}`}>
                {stat.label}
              </span>
              <span className="font-syne font-black text-2xl sm:text-3xl mt-1 block">{stat.val}</span>
            </button>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-black/15 pb-3 font-mono text-xs">
          {(
            [
              ['products', '01 // Products'],
              ['categories', '02 // Categories'],
              ['banners', '03 // Section Banners'],
              ['hero', '04 // Main Landing Images'],
              ['orders', '05 // Orders, Codes & Settings'],
            ] as [AdminTab, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2.5 uppercase tracking-wider font-bold border transition-colors ${
                activeTab === key
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-dark/70 border-black/15 hover:border-black hover:text-black'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* TAB 01: PRODUCTS MANAGER                                    */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-black/15 p-4 font-mono text-xs">
              <div className="flex flex-wrap items-center gap-3 flex-1">
                <input
                  type="text"
                  placeholder="Search product name, ID, color..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="bg-[#fafafa] border border-black/20 px-3 py-2 text-xs flex-1 min-w-[200px] focus:outline-none focus:border-black"
                />
                <select
                  value={productCatFilter}
                  onChange={(e) => setProductCatFilter(e.target.value)}
                  className="bg-[#fafafa] border border-black/20 px-3 py-2 text-xs uppercase focus:outline-none focus:border-black"
                >
                  <option value="ALL">All Categories ({products.length})</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({products.filter((p) => p.category === c.id).length})
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={openNewProductForm}
                className="bg-black text-white px-5 py-2.5 uppercase tracking-wider font-bold hover:bg-black/85 transition-colors"
              >
                + Add New Product
              </button>
            </div>

            {/* Add / Edit Product Drawer/Panel */}
            {showProductForm && (
              <form
                onSubmit={handleSaveProduct}
                className="bg-white border-2 border-black p-6 space-y-5 font-mono text-xs shadow-lg"
              >
                <div className="flex items-center justify-between border-b border-black/10 pb-3">
                  <h2 className="font-syne font-black text-xl uppercase !mb-0">
                    {editingProductId ? `Edit Product: ${editingProductId}` : 'Add New Product'}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowProductForm(false)}
                    className="border border-black/20 px-3 py-1 hover:bg-black hover:text-white font-bold"
                  >
                    ✕ Close
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase text-dark/60 mb-1">Product Name *</label>
                    <input
                      type="text"
                      required
                      value={prodForm.name}
                      onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                      placeholder="e.g. Obsidian Heavy Boxy Tee"
                      className="w-full border border-black/20 px-3 py-2 bg-[#fafafa]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-dark/60 mb-1">Price (₹ INR) *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={prodForm.price}
                      onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })}
                      className="w-full border border-black/20 px-3 py-2 bg-[#fafafa]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-dark/60 mb-1">Category *</label>
                    <select
                      value={prodForm.category}
                      onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                      className="w-full border border-black/20 px-3 py-2 bg-[#fafafa]"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.id})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-dark/60 mb-1">Colorway *</label>
                    <input
                      type="text"
                      required
                      value={prodForm.color}
                      onChange={(e) => setProdForm({ ...prodForm, color: e.target.value })}
                      placeholder="e.g. Washed Black"
                      className="w-full border border-black/20 px-3 py-2 bg-[#fafafa]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-dark/60 mb-1">Sizes (comma separated) *</label>
                    <input
                      type="text"
                      required
                      value={prodForm.sizes}
                      onChange={(e) => setProdForm({ ...prodForm, sizes: e.target.value })}
                      placeholder="S, M, L, XL, XXL"
                      className="w-full border border-black/20 px-3 py-2 bg-[#fafafa]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-dark/60 mb-1">Badge Tag (optional)</label>
                    <input
                      type="text"
                      value={prodForm.tag}
                      onChange={(e) => setProdForm({ ...prodForm, tag: e.target.value })}
                      placeholder="e.g. New Release, Limited, Best Seller"
                      className="w-full border border-black/20 px-3 py-2 bg-[#fafafa]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-dark/60 mb-1">Description *</label>
                  <textarea
                    rows={3}
                    required
                    value={prodForm.description}
                    onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                    placeholder="Fabric GSM, fit architecture, print details..."
                    className="w-full border border-black/20 px-3 py-2 bg-[#fafafa]"
                  />
                </div>

                {/* Image Upload & URL Controls */}
                <div className="border border-black/15 p-4 bg-[#fafafa] space-y-4">
                  <p className="font-bold uppercase text-[11px]">Product Photos (Upload from PC or Paste URL)</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase text-dark/60 mb-1">
                        Primary Image URL or Path
                      </label>
                      <input
                        type="text"
                        value={prodForm.image}
                        onChange={(e) => setProdForm({ ...prodForm, image: e.target.value })}
                        placeholder="/products/... or https://..."
                        className="w-full border border-black/20 px-3 py-2 bg-white mb-2"
                      />
                      <label className="inline-block bg-black text-white px-3 py-1.5 text-[10px] uppercase font-bold cursor-pointer">
                        Upload Primary Photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => void handleProductFileUpload(e, true)}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-dark/60 mb-1">
                        Add Gallery Angle (URL or Multi-File Upload)
                      </label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={prodForm.extraImageUrl}
                          onChange={(e) => setProdForm({ ...prodForm, extraImageUrl: e.target.value })}
                          placeholder="Paste image URL to add angle"
                          className="flex-1 border border-black/20 px-3 py-2 bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!prodForm.extraImageUrl.trim()) return;
                            const u = prodForm.extraImageUrl.trim();
                            setProdForm((prev) => ({
                              ...prev,
                              image: prev.image || u,
                              images: [...prev.images, u],
                              extraImageUrl: '',
                            }));
                          }}
                          className="bg-black text-white px-3 py-2 uppercase font-bold"
                        >
                          Add
                        </button>
                      </div>
                      <label className="inline-block border border-black px-3 py-1.5 text-[10px] uppercase font-bold cursor-pointer bg-white hover:bg-black hover:text-white">
                        + Upload Gallery Photos
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => void handleProductFileUpload(e, false)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Gallery Preview Strip */}
                  {prodForm.images.length > 0 && (
                    <div className="flex flex-wrap gap-3 pt-2">
                      {prodForm.images.map((img, idx) => (
                        <div key={`${img.slice(0, 40)}-${idx}`} className="relative w-20 h-24 border border-black/20 bg-white p-1">
                          <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-contain" />
                          <button
                            type="button"
                            onClick={() => {
                              const next = prodForm.images.filter((_, i) => i !== idx);
                              setProdForm((prev) => ({
                                ...prev,
                                images: next,
                                image: prev.image === img ? next[0] || '' : prev.image,
                              }));
                            }}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 text-white text-[10px] font-bold flex items-center justify-center"
                            title="Remove photo"
                          >
                            ✕
                          </button>
                          {idx === 0 && (
                            <span className="absolute bottom-0 inset-x-0 bg-black text-white text-[8px] text-center uppercase">
                              Main
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowProductForm(false)}
                    className="border border-black/20 px-5 py-2.5 uppercase font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-black text-white px-6 py-2.5 uppercase tracking-wider font-bold hover:bg-black/85"
                  >
                    {editingProductId ? 'Save Product Changes' : 'Publish Product Live'}
                  </button>
                </div>
              </form>
            )}

            {/* Products Table / Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-white border border-black/15 p-4 flex gap-4 items-start justify-between hover:border-black transition-colors"
                >
                  <div className="flex gap-3 min-w-0">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-16 h-20 object-contain bg-[#f5f5f3] border border-black/10 flex-shrink-0 p-1"
                    />
                    <div className="min-w-0 font-mono text-xs">
                      <span className="text-[9px] uppercase tracking-widest text-dark/45 block">
                        {p.category} • {p.color}
                      </span>
                      <h3 className="font-syne font-bold text-sm uppercase truncate text-dark">{p.name}</h3>
                      <p className="font-bold text-black mt-0.5">{formatPrice(p.price)}</p>
                      <p className="text-[10px] text-dark/50 mt-0.5 truncate">
                        Sizes: {p.sizes.join(', ')} • {p.images?.length || 1} photo(s)
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 font-mono text-[10px] flex-shrink-0">
                    <button
                      onClick={() => openEditProductForm(p)}
                      className="border border-black px-2.5 py-1 uppercase font-bold hover:bg-black hover:text-white transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete "${p.name}" from live catalog?`)) {
                          deleteProduct(p.id);
                          showToast(`Deleted "${p.name}"`);
                        }
                      }}
                      className="border border-red-200 text-red-700 px-2.5 py-1 uppercase font-bold hover:bg-red-600 hover:text-white transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* TAB 02: CATEGORIES MANAGER                                  */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <form
              onSubmit={handleSaveCategory}
              className="lg:col-span-5 bg-white border-2 border-black p-6 space-y-4 font-mono text-xs"
            >
              <h2 className="font-syne font-black text-xl uppercase !mb-2">
                {editingCatId ? `Edit Category: ${editingCatId}` : 'Add New Category'}
              </h2>
              <div>
                <label className="block text-[10px] uppercase text-dark/60 mb-1">Category Key / Slug *</label>
                <input
                  type="text"
                  required
                  disabled={Boolean(editingCatId)}
                  value={catForm.id}
                  onChange={(e) => setCatForm({ ...catForm, id: e.target.value })}
                  placeholder="e.g. Jackets, Cargos, Caps"
                  className="w-full border border-black/20 px-3 py-2 bg-[#fafafa] disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-dark/60 mb-1">Display Name *</label>
                <input
                  type="text"
                  required
                  value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  placeholder="e.g. Heavyweight Jackets"
                  className="w-full border border-black/20 px-3 py-2 bg-[#fafafa]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase text-dark/60 mb-1">Navbar Label</label>
                  <input
                    type="text"
                    value={catForm.navLabel}
                    onChange={(e) => setCatForm({ ...catForm, navLabel: e.target.value })}
                    placeholder="e.g. Shop Jackets"
                    className="w-full border border-black/20 px-3 py-2 bg-[#fafafa]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-dark/60 mb-1">GSM / Fabric Spec</label>
                  <input
                    type="text"
                    value={catForm.gsm}
                    onChange={(e) => setCatForm({ ...catForm, gsm: e.target.value })}
                    placeholder="e.g. 420 GSM"
                    className="w-full border border-black/20 px-3 py-2 bg-[#fafafa]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase text-dark/60 mb-1">Section Subtitle</label>
                  <input
                    type="text"
                    value={catForm.sectionSubtitle}
                    onChange={(e) => setCatForm({ ...catForm, sectionSubtitle: e.target.value })}
                    placeholder="e.g. Architectural Outerwear"
                    className="w-full border border-black/20 px-3 py-2 bg-[#fafafa]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-dark/60 mb-1">Default Price (₹)</label>
                  <input
                    type="number"
                    value={catForm.defaultPrice}
                    onChange={(e) => setCatForm({ ...catForm, defaultPrice: Number(e.target.value) || 0 })}
                    className="w-full border border-black/20 px-3 py-2 bg-[#fafafa]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase text-dark/60 mb-1">Menu Subtitle</label>
                <input
                  type="text"
                  value={catForm.subtitle}
                  onChange={(e) => setCatForm({ ...catForm, subtitle: e.target.value })}
                  placeholder="e.g. 420 GSM Weatherproof Canvas"
                  className="w-full border border-black/20 px-3 py-2 bg-[#fafafa]"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-black text-white py-3 uppercase tracking-wider font-bold hover:bg-black/85"
                >
                  {editingCatId ? 'Update Category' : '+ Create Category'}
                </button>
                {editingCatId && (
                  <button
                    type="button"
                    onClick={resetCatForm}
                    className="border border-black/25 px-4 py-3 uppercase font-bold"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="lg:col-span-7 space-y-3 font-mono text-xs">
              {categories.map((cat) => {
                const count = products.filter((p) => p.category === cat.id).length;
                return (
                  <div
                    key={cat.id}
                    className="bg-white border border-black/15 p-5 flex items-center justify-between gap-4"
                  >
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-dark/45">
                        KEY: {cat.id} • {cat.gsm} • DEFAULT ₹{cat.defaultPrice}
                      </span>
                      <h3 className="font-syne font-black text-lg uppercase text-dark">{cat.name}</h3>
                      <p className="text-[11px] text-dark/60">{cat.subtitle} • {count} Product(s)</p>
                    </div>
                    <div className="flex gap-2 text-[10px]">
                      <button
                        onClick={() => {
                          setEditingCatId(cat.id);
                          setCatForm(cat);
                        }}
                        className="border border-black px-3 py-1.5 uppercase font-bold hover:bg-black hover:text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete category "${cat.name}"?`)) {
                            deleteCategory(cat.id);
                            showToast(`Deleted category "${cat.name}"`);
                          }
                        }}
                        className="border border-red-200 text-red-700 px-3 py-1.5 uppercase font-bold hover:bg-red-600 hover:text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* TAB 03: SECTION BANNERS MANAGER                             */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === 'banners' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <form
              onSubmit={handleSaveBanner}
              className="lg:col-span-5 bg-white border-2 border-black p-6 space-y-4 font-mono text-xs"
            >
              <h2 className="font-syne font-black text-xl uppercase !mb-2">
                {editingBannerId ? 'Edit Category Banner' : 'Add Category Banner'}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase text-dark/60 mb-1">Linked Category *</label>
                  <select
                    value={bannerForm.categoryId}
                    onChange={(e) => setBannerForm({ ...bannerForm, categoryId: e.target.value })}
                    className="w-full border border-black/20 px-3 py-2 bg-[#fafafa]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.id})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-dark/60 mb-1">Big Center Title *</label>
                  <input
                    type="text"
                    required
                    value={bannerForm.title}
                    onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                    placeholder="e.g. BOXY, WAFFLE, HOODIE"
                    className="w-full border border-black/20 px-3 py-2 bg-[#fafafa]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase text-dark/60 mb-1">Subtitle Label</label>
                  <input
                    type="text"
                    value={bannerForm.categoryName}
                    onChange={(e) => setBannerForm({ ...bannerForm, categoryName: e.target.value })}
                    placeholder="e.g. Heavyweight Tees"
                    className="w-full border border-black/20 px-3 py-2 bg-[#fafafa]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-dark/60 mb-1">GSM Pill</label>
                  <input
                    type="text"
                    value={bannerForm.gsm}
                    onChange={(e) => setBannerForm({ ...bannerForm, gsm: e.target.value })}
                    placeholder="e.g. 240 GSM"
                    className="w-full border border-black/20 px-3 py-2 bg-[#fafafa]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-dark/60 mb-1">Banner Description Line</label>
                <textarea
                  rows={2}
                  value={bannerForm.coolLine}
                  onChange={(e) => setBannerForm({ ...bannerForm, coolLine: e.target.value })}
                  placeholder="Architectural tagline displayed under title..."
                  className="w-full border border-black/20 px-3 py-2 bg-[#fafafa]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-dark/60 mb-1">Banner Image (URL or Upload) *</label>
                <input
                  type="text"
                  required
                  value={bannerForm.image}
                  onChange={(e) => setBannerForm({ ...bannerForm, image: e.target.value })}
                  placeholder="/banners/banner-boxy.png or upload below"
                  className="w-full border border-black/20 px-3 py-2 bg-[#fafafa] mb-2"
                />
                <label className="inline-block bg-black text-white px-4 py-2 text-[10px] uppercase font-bold cursor-pointer">
                  Upload Banner Image from PC
                  <input type="file" accept="image/*" onChange={(e) => void handleBannerFileUpload(e)} className="hidden" />
                </label>
                {bannerForm.image && (
                  <img
                    src={bannerForm.image}
                    alt="Banner preview"
                    className="w-full h-28 object-cover mt-3 border border-black/15"
                  />
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-black text-white py-3 uppercase tracking-wider font-bold hover:bg-black/85"
                >
                  {editingBannerId ? 'Save Banner Changes' : '+ Add Section Banner'}
                </button>
                {editingBannerId && (
                  <button
                    type="button"
                    onClick={resetBannerForm}
                    className="border border-black/25 px-4 py-3 uppercase font-bold"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="lg:col-span-7 space-y-4 font-mono text-xs">
              {sectionBanners.map((b) => (
                <div key={b.id} className="bg-white border border-black/15 overflow-hidden">
                  <div className="relative h-36 w-full bg-black">
                    <img src={b.image} alt={b.title} className={`w-full h-full object-cover ${b.objectPosition}`} />
                    <div className="absolute inset-0 bg-black/35 flex flex-col items-center justify-center text-white text-center px-4">
                      <span className="text-[10px] uppercase tracking-widest bg-black/70 px-2 py-0.5 mb-1">
                        Category: {b.categoryId} • {b.gsm}
                      </span>
                      <span className="font-anton text-4xl tracking-wider uppercase">{b.title}</span>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between gap-4">
                    <p className="text-[11px] text-dark/70 line-clamp-2">{b.coolLine}</p>
                    <div className="flex gap-2 flex-shrink-0 text-[10px]">
                      <button
                        onClick={() => {
                          setEditingBannerId(b.id);
                          setBannerForm({
                            categoryId: b.categoryId,
                            title: b.title,
                            categoryName: b.categoryName,
                            gsm: b.gsm,
                            coolLine: b.coolLine,
                            image: b.image,
                            objectPosition: b.objectPosition,
                          });
                        }}
                        className="border border-black px-3 py-1.5 uppercase font-bold hover:bg-black hover:text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete section banner "${b.title}"?`)) {
                            deleteSectionBanner(b.id);
                            showToast(`Deleted banner "${b.title}"`);
                          }
                        }}
                        className="border border-red-200 text-red-700 px-3 py-1.5 uppercase font-bold hover:bg-red-600 hover:text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* TAB 04: MAIN LANDING PAGE HERO IMAGES MANAGER               */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === 'hero' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <form
              onSubmit={handleSaveHero}
              className="lg:col-span-5 bg-white border-2 border-black p-6 space-y-4 font-mono text-xs"
            >
              <h2 className="font-syne font-black text-xl uppercase !mb-2">
                {editingHeroId ? 'Edit Main Landing Slide' : 'Add Main Landing Slide'}
              </h2>

              <div>
                <label className="block text-[10px] uppercase text-dark/60 mb-1">
                  Main Landing Image (URL or Upload from PC) *
                </label>
                <input
                  type="text"
                  required
                  value={heroForm.image}
                  onChange={(e) => setHeroForm({ ...heroForm, image: e.target.value })}
                  placeholder="/banners/... or upload below"
                  className="w-full border border-black/20 px-3 py-2 bg-[#fafafa] mb-2"
                />
                <label className="inline-block bg-black text-white px-4 py-2 text-[10px] uppercase font-bold cursor-pointer">
                  Upload Main Landing Image
                  <input type="file" accept="image/*" onChange={(e) => void handleHeroFileUpload(e)} className="hidden" />
                </label>
                {heroForm.image && (
                  <img
                    src={heroForm.image}
                    alt="Hero slide preview"
                    className="w-full h-36 object-cover mt-3 border border-black/15"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase text-dark/60 mb-1">Headline Line 1 *</label>
                  <input
                    type="text"
                    required
                    value={heroForm.headlineLine1}
                    onChange={(e) => setHeroForm({ ...heroForm, headlineLine1: e.target.value })}
                    placeholder="e.g. BOXY"
                    className="w-full border border-black/20 px-3 py-2 bg-[#fafafa]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-dark/60 mb-1">Headline Line 2 *</label>
                  <input
                    type="text"
                    required
                    value={heroForm.headlineLine2}
                    onChange={(e) => setHeroForm({ ...heroForm, headlineLine2: e.target.value })}
                    placeholder="e.g. FITS."
                    className="w-full border border-black/20 px-3 py-2 bg-[#fafafa]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase text-dark/60 mb-1">Text Contrast Theme</label>
                  <select
                    value={heroForm.theme}
                    onChange={(e) => setHeroForm({ ...heroForm, theme: e.target.value as 'dark' | 'light' })}
                    className="w-full border border-black/20 px-3 py-2 bg-[#fafafa]"
                  >
                    <option value="dark">Dark Photo (White Text)</option>
                    <option value="light">Bright Photo (Black Text)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-dark/60 mb-1">Bottom Pill Label</label>
                  <input
                    type="text"
                    value={heroForm.label}
                    onChange={(e) => setHeroForm({ ...heroForm, label: e.target.value })}
                    placeholder="e.g. 01 // BOXY"
                    className="w-full border border-black/20 px-3 py-2 bg-[#fafafa]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase text-dark/60 mb-1">Top Capsule Tag</label>
                  <input
                    type="text"
                    value={heroForm.category}
                    onChange={(e) => setHeroForm({ ...heroForm, category: e.target.value })}
                    placeholder="SS26 Capsule // 01"
                    className="w-full border border-black/20 px-3 py-2 bg-[#fafafa]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-dark/60 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={heroForm.tagline}
                    onChange={(e) => setHeroForm({ ...heroForm, tagline: e.target.value })}
                    placeholder="THE NEW STANDARD."
                    className="w-full border border-black/20 px-3 py-2 bg-[#fafafa]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase text-dark/60 mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={heroForm.ctaText}
                    onChange={(e) => setHeroForm({ ...heroForm, ctaText: e.target.value })}
                    className="w-full border border-black/20 px-3 py-2 bg-[#fafafa]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-dark/60 mb-1">CTA Link</label>
                  <input
                    type="text"
                    value={heroForm.ctaLink}
                    onChange={(e) => setHeroForm({ ...heroForm, ctaLink: e.target.value })}
                    className="w-full border border-black/20 px-3 py-2 bg-[#fafafa]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase text-dark/60 mb-1">Corner Badge Title</label>
                  <input
                    type="text"
                    value={heroForm.badgeTitle}
                    onChange={(e) => setHeroForm({ ...heroForm, badgeTitle: e.target.value })}
                    className="w-full border border-black/20 px-3 py-2 bg-[#fafafa]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-dark/60 mb-1">Corner Badge Subtitle</label>
                  <input
                    type="text"
                    value={heroForm.badgeSubtitle}
                    onChange={(e) => setHeroForm({ ...heroForm, badgeSubtitle: e.target.value })}
                    className="w-full border border-black/20 px-3 py-2 bg-[#fafafa]"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-black text-white py-3 uppercase tracking-wider font-bold hover:bg-black/85"
                >
                  {editingHeroId ? 'Update Main Landing Slide' : '+ Add Landing Slide'}
                </button>
                {editingHeroId && (
                  <button
                    type="button"
                    onClick={resetHeroForm}
                    className="border border-black/25 px-4 py-3 uppercase font-bold"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="lg:col-span-7 space-y-4 font-mono text-xs">
              {heroSlides.map((slide, idx) => (
                <div key={slide.id} className="bg-white border border-black/15 overflow-hidden">
                  <div className="relative h-44 w-full bg-black">
                    <img src={slide.image} alt={slide.alt} className="w-full h-full object-cover object-center" />
                    <div className="absolute top-3 left-3 bg-black/80 text-white px-2.5 py-1 text-[10px] uppercase font-bold">
                      Slide 0{idx + 1} • {slide.label} • Theme: {slide.theme.toUpperCase()}
                    </div>
                    <div className="absolute bottom-3 left-3 bg-black/75 text-white px-3 py-1.5">
                      <span className="font-syne font-black text-xl uppercase">
                        {slide.headlineLine1} {slide.headlineLine2}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-[11px] text-dark/70">
                      <p className="font-bold text-black">{slide.category} — {slide.tagline}</p>
                      <p>Badge: {slide.badgeTitle} ({slide.badgeSubtitle})</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5 text-[10px]">
                      <button
                        onClick={() => moveHeroSlide(slide.id, 'up')}
                        disabled={idx === 0}
                        className="border border-black/25 px-2 py-1.5 uppercase font-bold disabled:opacity-30"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveHeroSlide(slide.id, 'down')}
                        disabled={idx === heroSlides.length - 1}
                        className="border border-black/25 px-2 py-1.5 uppercase font-bold disabled:opacity-30"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => {
                          setEditingHeroId(slide.id);
                          setHeroForm({
                            image: slide.image,
                            alt: slide.alt,
                            objectPosition: slide.objectPosition,
                            watermark: slide.watermark,
                            category: slide.category,
                            tagline: slide.tagline,
                            theme: slide.theme,
                            headlineLine1: slide.headlineLine1,
                            headlineLine2: slide.headlineLine2,
                            headlineStyle: slide.headlineStyle || 'boxy',
                            ctaText: slide.ctaText,
                            ctaLink: slide.ctaLink,
                            badgeTitle: slide.badgeTitle,
                            badgeSubtitle: slide.badgeSubtitle,
                            label: slide.label,
                          });
                        }}
                        className="border border-black px-3 py-1.5 uppercase font-bold hover:bg-black hover:text-white"
                      >
                        Edit
                      </button>
                      <button
                        disabled={heroSlides.length <= 1}
                        onClick={() => {
                          if (window.confirm(`Delete landing slide "${slide.label}"?`)) {
                            deleteHeroSlide(slide.id);
                            showToast(`Deleted slide "${slide.label}"`);
                          }
                        }}
                        className="border border-red-200 text-red-700 px-3 py-1.5 uppercase font-bold hover:bg-red-600 hover:text-white disabled:opacity-30"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* TAB 05: ORDERS, GENERATED CODES & MASTER SETTINGS           */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === 'orders' && (
          <div className="space-y-8 font-mono text-xs">
            {/* Orders List */}
            <div>
              <h2 className="font-syne font-black text-2xl uppercase mb-4">
                Customer Orders & Generated Verification Codes ({orders.length})
              </h2>
              {orders.length === 0 ? (
                <div className="bg-white border border-black/15 p-8 text-center text-dark/60">
                  No orders recorded in this browser yet. New orders placed at checkout will appear here immediately and be emailed to your master email.
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div key={ord.orderId} className="bg-white border-2 border-black/15 p-5 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/10 pb-3">
                        <div>
                          <span className="text-[10px] text-dark/45 uppercase block">ORDER CODE & TIMESTAMP</span>
                          <p className="font-bold text-sm text-black">{ord.orderCode}</p>
                          <p className="text-[11px] text-dark/60">{ord.timestamp} • UTR: <strong>{ord.transactionId}</strong></p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <select
                            value={ord.status}
                            onChange={(e) => {
                              updateOrderStatus(ord.orderId, e.target.value as OrderStatus);
                              showToast(`Order ${ord.orderId} marked ${e.target.value}`);
                            }}
                            className="border border-black bg-[#fafafa] px-2.5 py-1.5 text-[11px] font-bold uppercase"
                          >
                            <option value="Pending Verification">Pending Verification</option>
                            <option value="Verified & Dispatched">Verified & Dispatched</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(ord.orderManifestCode);
                              setCopiedOrderId(ord.orderId);
                              setTimeout(() => setCopiedOrderId(null), 2000);
                            }}
                            className="bg-black text-white px-3 py-1.5 text-[10px] uppercase font-bold"
                          >
                            {copiedOrderId === ord.orderId ? '✓ Copied Code' : 'Copy Manifest'}
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete order record ${ord.orderId}?`)) {
                                deleteOrder(ord.orderId);
                                showToast(`Deleted order ${ord.orderId}`);
                              }
                            }}
                            className="border border-red-200 text-red-700 px-3 py-1.5 text-[10px] uppercase font-bold hover:bg-red-600 hover:text-white"
                          >
                            Delete
                          </button>
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

            {/* Security & Factory Reset */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-black/15">
              <form onSubmit={handlePasswordChange} className="bg-white border border-black/15 p-6 space-y-3">
                <h3 className="font-syne font-black text-lg uppercase">Update Master Password</h3>
                <input
                  type="password"
                  required
                  placeholder="Current Password"
                  value={pwForm.current}
                  onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })}
                  className="w-full border border-black/20 px-3 py-2 bg-[#fafafa]"
                />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="New Password (min 6 chars)"
                  value={pwForm.next}
                  onChange={(e) => setPwForm({ ...pwForm, next: e.target.value })}
                  className="w-full border border-black/20 px-3 py-2 bg-[#fafafa]"
                />
                {pwMessage && (
                  <p className={`text-[11px] font-bold ${pwMessage.ok ? 'text-emerald-700' : 'text-red-600'}`}>
                    {pwMessage.text}
                  </p>
                )}
                <button type="submit" className="bg-black text-white px-5 py-2.5 uppercase font-bold">
                  Change Password
                </button>
              </form>

              <div className="bg-white border border-black/15 p-6 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-syne font-black text-lg uppercase mb-1">Factory Reset Catalog</h3>
                  <p className="text-[11px] text-dark/60 leading-relaxed">
                    Restores products, categories, section banners, and landing hero slides back to the original built-in SKAUNS defaults. Order records are preserved.
                  </p>
                </div>
                <button
                  onClick={async () => {
                    if (window.confirm('Restore products, categories, banners, and landing slides to factory defaults?')) {
                      await resetStoreToDefaults();
                      showToast('Restored catalog & banners to defaults');
                    }
                  }}
                  className="border border-red-600 text-red-700 hover:bg-red-600 hover:text-white px-5 py-2.5 uppercase font-bold transition-colors self-start"
                >
                  Reset Storefront Defaults
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
