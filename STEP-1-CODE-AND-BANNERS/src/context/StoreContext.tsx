import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { products as defaultProducts } from '../data/products';
import type { Product } from '../data/products';
import type { OrderDispatchData } from '../services/adminDispatcher';
import { dbGet, dbSet, dbDelete } from '../utils/storeDb';

export interface CategoryConfig {
  id: string; // e.g., 'Tees', 'Waffles', 'Hoodies', or custom slug
  name: string; // Display heading e.g. 'Heavyweight Tees'
  navLabel: string; // e.g. 'Shop Boxy'
  subtitle: string; // e.g. '240 GSM Heavyweight Tees'
  sectionSubtitle: string; // e.g. 'Heavyweight Box Fit'
  watermark: string; // e.g. 'HEAVY TEES'
  gsm: string; // e.g. '240 GSM'
  defaultPrice: number;
}

export interface SectionBannerConfig {
  id: string;
  categoryId: string; // Links banner to a category section
  title: string; // Big center typography e.g. 'BOXY'
  categoryName: string; // e.g. 'Heavyweight Tees'
  gsm: string; // e.g. '240 GSM'
  coolLine: string;
  image: string;
  objectPosition: string;
}

export interface HeroSlideConfig {
  id: string;
  image: string;
  alt: string;
  objectPosition: string;
  watermark: string;
  category: string;
  tagline: string;
  theme: 'dark' | 'light';
  headlineLine1: string;
  headlineLine2: string;
  headlineStyle?: 'boxy' | 'armor' | 'avant';
  ctaText: string;
  ctaLink: string;
  badgeTitle: string;
  badgeSubtitle: string;
  label: string;
}

export type OrderStatus = 'Pending Verification' | 'Verified & Dispatched' | 'Delivered' | 'Cancelled';

export interface OrderRecord extends OrderDispatchData {
  status: OrderStatus;
}

export const DEFAULT_CATEGORIES: CategoryConfig[] = [
  {
    id: 'Tees',
    name: 'Heavyweight Tees',
    navLabel: 'Shop Boxy',
    subtitle: '240 GSM Heavyweight Tees',
    sectionSubtitle: 'Heavyweight Box Fit',
    watermark: 'HEAVY TEES',
    gsm: '240 GSM',
    defaultPrice: 1099,
  },
  {
    id: 'Waffles',
    name: 'Waffle Knit',
    navLabel: 'Shop Waffle',
    subtitle: '240 GSM Cotton Blend Knit',
    sectionSubtitle: '240 GSM Cotton Blend Knit',
    watermark: 'WAFFLE',
    gsm: '240 GSM',
    defaultPrice: 1299,
  },
  {
    id: 'Hoodies',
    name: 'Heavyweight Hoodies',
    navLabel: 'Shop Hoodie',
    subtitle: 'Pure Cotton 360 GSM Hoodies',
    sectionSubtitle: 'Pure Cotton 360 GSM Heavyweight',
    watermark: 'HOODIES',
    gsm: '360 GSM',
    defaultPrice: 1499,
  },
];

export const DEFAULT_SECTION_BANNERS: SectionBannerConfig[] = [
  {
    id: 'banner-tees',
    categoryId: 'Tees',
    title: 'BOXY',
    categoryName: 'Heavyweight Tees',
    gsm: '240 GSM',
    coolLine: 'Pre-shrunk 240 GSM combed cotton. Dropped shoulder architecture — built for longevity, zero apologies.',
    image: '/banners/banner-boxy.png',
    objectPosition: 'object-[center_32%]',
  },
  {
    id: 'banner-waffles',
    categoryId: 'Waffles',
    title: 'WAFFLE',
    categoryName: 'Cotton Blend Knit',
    gsm: '240 GSM',
    coolLine: '240 GSM cotton blend knit waffle fabric. Elongated slouch contour for architectural streetwear layering.',
    image: '/banners/banner-waffle.png',
    objectPosition: 'object-[center_35%]',
  },
  {
    id: 'banner-hoodies',
    categoryId: 'Hoodies',
    title: 'HOODIE',
    categoryName: 'Pure Cotton Heavyweight',
    gsm: '360 GSM',
    coolLine: '360 GSM pure cotton heavyweight fleece. Structural double-layer hood, raw aggressive silhouette.',
    image: '/banners/banner-hoodie.png',
    objectPosition: 'object-[center_30%]',
  },
];

export const DEFAULT_HERO_SLIDES: HeroSlideConfig[] = [
  {
    id: 'hero-1',
    image: '/banners/Gemini_Generated_Image (2).jpeg',
    alt: 'SKAUNS Boxy Fits Campaign',
    objectPosition: 'object-center',
    watermark: 'HEAVYWEIGHT',
    category: 'SS26 Capsule // 01',
    tagline: 'THE NEW STANDARD.',
    theme: 'dark',
    headlineLine1: 'BOXY',
    headlineLine2: 'FITS.',
    headlineStyle: 'boxy',
    ctaText: 'Explore Collection',
    ctaLink: '/collection',
    badgeTitle: '240 GSM Heavyweight',
    badgeSubtitle: 'Series / 01',
    label: '01 // BOXY',
  },
  {
    id: 'hero-2',
    image: '/banners/Gemini_Generated_Image.jpeg',
    alt: 'SKAUNS Cyber Armor Campaign',
    objectPosition: 'object-center',
    watermark: 'STRUCTURE',
    category: 'Hardware Series // 02',
    tagline: 'ARCHITECTURAL CONTOUR.',
    theme: 'light',
    headlineLine1: 'CYBER',
    headlineLine2: 'ARMOR.',
    headlineStyle: 'armor',
    ctaText: 'Discover Hardware',
    ctaLink: '/collection',
    badgeTitle: '360 GSM Dual-Zip',
    badgeSubtitle: 'Hardware / 02',
    label: '02 // ARMOR',
  },
  {
    id: 'hero-3',
    image: '/banners/Gemini_Generated_Image (1).jpeg',
    alt: 'SKAUNS Avant-Garde Campaign',
    objectPosition: 'object-center',
    watermark: 'AVANT-GARDE',
    category: 'Runway Edition // 03',
    tagline: 'EXPERIMENTAL SILHOUETTE.',
    theme: 'dark',
    headlineLine1: 'AVANT',
    headlineLine2: 'DRAPE.',
    headlineStyle: 'avant',
    ctaText: 'View Silhouettes',
    ctaLink: '/collection',
    badgeTitle: 'Metallic Bomber + Slouch',
    badgeSubtitle: 'Runway / 03',
    label: '03 // AVANT',
  },
];

interface StoreContextType {
  products: Product[];
  categories: CategoryConfig[];
  sectionBanners: SectionBannerConfig[];
  heroSlides: HeroSlideConfig[];
  orders: OrderRecord[];
  isHydrated: boolean;

  // Product CRUD
  addProduct: (product: Omit<Product, 'id'> & { id?: string }) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Category CRUD
  addCategory: (cat: CategoryConfig) => void;
  updateCategory: (id: string, updates: Partial<CategoryConfig>) => void;
  deleteCategory: (id: string) => void;

  // Section Banner CRUD
  addSectionBanner: (banner: Omit<SectionBannerConfig, 'id'> & { id?: string }) => void;
  updateSectionBanner: (id: string, updates: Partial<SectionBannerConfig>) => void;
  deleteSectionBanner: (id: string) => void;

  // Hero Slide CRUD
  addHeroSlide: (slide: Omit<HeroSlideConfig, 'id'> & { id?: string }) => void;
  updateHeroSlide: (id: string, updates: Partial<HeroSlideConfig>) => void;
  deleteHeroSlide: (id: string) => void;
  moveHeroSlide: (id: string, direction: 'up' | 'down') => void;

  // Orders
  recordOrder: (order: OrderDispatchData) => OrderRecord;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;

  // Maintenance
  resetStoreToDefaults: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const DB_KEYS = {
  products: 'store_products_v1',
  categories: 'store_categories_v1',
  sectionBanners: 'store_section_banners_v1',
  heroSlides: 'store_hero_slides_v1',
  orders: 'store_orders_v1',
};

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [categories, setCategories] = useState<CategoryConfig[]>(DEFAULT_CATEGORIES);
  const [sectionBanners, setSectionBanners] = useState<SectionBannerConfig[]>(DEFAULT_SECTION_BANNERS);
  const [heroSlides, setHeroSlides] = useState<HeroSlideConfig[]>(DEFAULT_HERO_SLIDES);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from IndexedDB on mount
  useEffect(() => {
    let active = true;
    (async () => {
      const [savedProducts, savedCategories, savedBanners, savedHero, savedOrders] = await Promise.all([
        dbGet<Product[]>(DB_KEYS.products),
        dbGet<CategoryConfig[]>(DB_KEYS.categories),
        dbGet<SectionBannerConfig[]>(DB_KEYS.sectionBanners),
        dbGet<HeroSlideConfig[]>(DB_KEYS.heroSlides),
        dbGet<OrderRecord[]>(DB_KEYS.orders),
      ]);
      if (!active) return;
      if (savedProducts && Array.isArray(savedProducts)) {
        // Auto-migrate legacy .jfif paths to standard .jpeg
        const migrated = savedProducts.map((p) => ({
          ...p,
          image: p.image.replace(/\.jfif$/i, '.jpeg'),
          images: (p.images || []).map((img) => img.replace(/\.jfif$/i, '.jpeg')),
        }));
        setProducts(migrated);
      }
      if (savedCategories && Array.isArray(savedCategories) && savedCategories.length > 0) setCategories(savedCategories);
      if (savedBanners && Array.isArray(savedBanners)) setSectionBanners(savedBanners);
      if (savedHero && Array.isArray(savedHero) && savedHero.length > 0) setHeroSlides(savedHero);
      if (savedOrders && Array.isArray(savedOrders)) setOrders(savedOrders);
      setIsHydrated(true);
    })();
    return () => {
      active = false;
    };
  }, []);

  // Persist helpers
  const persistProducts = useCallback((next: Product[]) => {
    setProducts(next);
    void dbSet(DB_KEYS.products, next);
  }, []);

  const persistCategories = useCallback((next: CategoryConfig[]) => {
    setCategories(next);
    void dbSet(DB_KEYS.categories, next);
  }, []);

  const persistBanners = useCallback((next: SectionBannerConfig[]) => {
    setSectionBanners(next);
    void dbSet(DB_KEYS.sectionBanners, next);
  }, []);

  const persistHeroSlides = useCallback((next: HeroSlideConfig[]) => {
    setHeroSlides(next);
    void dbSet(DB_KEYS.heroSlides, next);
  }, []);

  const persistOrders = useCallback((next: OrderRecord[]) => {
    setOrders(next);
    void dbSet(DB_KEYS.orders, next);
  }, []);

  // Product CRUD
  const addProduct = (input: Omit<Product, 'id'> & { id?: string }): Product => {
    const slug =
      input.id?.trim() ||
      `${input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${Date.now().toString(36).slice(-4)}`;
    const newProduct: Product = {
      ...input,
      id: slug,
      images: input.images && input.images.length > 0 ? input.images : [input.image],
    };
    persistProducts([newProduct, ...products]);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    persistProducts(
      products.map((p) => {
        if (p.id !== id) return p;
        const merged = { ...p, ...updates };
        if (merged.images && merged.images.length > 0 && !updates.image) {
          merged.image = merged.images[0];
        }
        return merged;
      })
    );
  };

  const deleteProduct = (id: string) => {
    persistProducts(products.filter((p) => p.id !== id));
  };

  // Category CRUD
  const addCategory = (cat: CategoryConfig) => {
    const cleanId = cat.id.trim().replace(/\s+/g, '');
    if (categories.some((c) => c.id.toLowerCase() === cleanId.toLowerCase())) return;
    persistCategories([...categories, { ...cat, id: cleanId }]);
  };

  const updateCategory = (id: string, updates: Partial<CategoryConfig>) => {
    persistCategories(categories.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteCategory = (id: string) => {
    persistCategories(categories.filter((c) => c.id !== id));
  };

  // Section Banner CRUD
  const addSectionBanner = (banner: Omit<SectionBannerConfig, 'id'> & { id?: string }) => {
    const id = banner.id?.trim() || `banner-${Date.now().toString(36)}`;
    persistBanners([...sectionBanners, { ...banner, id }]);
  };

  const updateSectionBanner = (id: string, updates: Partial<SectionBannerConfig>) => {
    persistBanners(sectionBanners.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const deleteSectionBanner = (id: string) => {
    persistBanners(sectionBanners.filter((b) => b.id !== id));
  };

  // Hero Slide CRUD
  const addHeroSlide = (slide: Omit<HeroSlideConfig, 'id'> & { id?: string }) => {
    const id = slide.id?.trim() || `hero-${Date.now().toString(36)}`;
    persistHeroSlides([...heroSlides, { ...slide, id }]);
  };

  const updateHeroSlide = (id: string, updates: Partial<HeroSlideConfig>) => {
    persistHeroSlides(heroSlides.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteHeroSlide = (id: string) => {
    if (heroSlides.length <= 1) return; // Always keep at least 1 hero slide
    persistHeroSlides(heroSlides.filter((s) => s.id !== id));
  };

  const moveHeroSlide = (id: string, direction: 'up' | 'down') => {
    const idx = heroSlides.findIndex((s) => s.id === id);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= heroSlides.length) return;
    const copy = [...heroSlides];
    const [moved] = copy.splice(idx, 1);
    copy.splice(targetIdx, 0, moved);
    persistHeroSlides(copy);
  };

  // Orders
  const recordOrder = (order: OrderDispatchData): OrderRecord => {
    const record: OrderRecord = {
      ...order,
      status: 'Pending Verification',
    };
    persistOrders([record, ...orders]);
    return record;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    persistOrders(orders.map((o) => (o.orderId === orderId ? { ...o, status } : o)));
  };

  const deleteOrder = (orderId: string) => {
    persistOrders(orders.filter((o) => o.orderId !== orderId));
  };

  const resetStoreToDefaults = async () => {
    await Promise.all([
      dbDelete(DB_KEYS.products),
      dbDelete(DB_KEYS.categories),
      dbDelete(DB_KEYS.sectionBanners),
      dbDelete(DB_KEYS.heroSlides),
    ]);
    setProducts(defaultProducts);
    setCategories(DEFAULT_CATEGORIES);
    setSectionBanners(DEFAULT_SECTION_BANNERS);
    setHeroSlides(DEFAULT_HERO_SLIDES);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        sectionBanners,
        heroSlides,
        orders,
        isHydrated,
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
        recordOrder,
        updateOrderStatus,
        deleteOrder,
        resetStoreToDefaults,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return ctx;
}
