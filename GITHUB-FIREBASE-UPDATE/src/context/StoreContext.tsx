import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  writeBatch,
} from 'firebase/firestore';
import { products as defaultProducts } from '../data/products';
import type { Product } from '../data/products';
import type { OrderDispatchData } from '../services/adminDispatcher';
import { dbGet, dbSet, dbDelete } from '../utils/storeDb';
import { firebaseDb, isFirebaseConfigured } from '../lib/firebase';
import { useAuth } from './AuthContext';

export interface CategoryConfig {
  id: string;
  name: string;
  navLabel: string;
  subtitle: string;
  sectionSubtitle: string;
  watermark: string;
  gsm: string;
  defaultPrice: number;
  orderIndex?: number;
}

export interface SectionBannerConfig {
  id: string;
  categoryId: string;
  title: string;
  categoryName: string;
  gsm: string;
  coolLine: string;
  image: string;
  objectPosition: string;
  orderIndex?: number;
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
  orderIndex?: number;
}

export type OrderStatus = 'Pending Verification' | 'Verified & Dispatched' | 'Delivered' | 'Cancelled';

export interface OrderRecord extends OrderDispatchData {
  userId?: string;
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
    orderIndex: 0,
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
    orderIndex: 1,
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
    orderIndex: 2,
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
    orderIndex: 0,
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
    orderIndex: 1,
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
    orderIndex: 2,
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
    orderIndex: 0,
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
    orderIndex: 1,
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
    orderIndex: 2,
  },
];

interface StoreContextType {
  products: Product[];
  categories: CategoryConfig[];
  sectionBanners: SectionBannerConfig[];
  heroSlides: HeroSlideConfig[];
  orders: OrderRecord[];
  isHydrated: boolean;
  isCloudSynced: boolean;

  addProduct: (product: Omit<Product, 'id'> & { id?: string }) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  addCategory: (cat: CategoryConfig) => void;
  updateCategory: (id: string, updates: Partial<CategoryConfig>) => void;
  deleteCategory: (id: string) => void;

  addSectionBanner: (banner: Omit<SectionBannerConfig, 'id'> & { id?: string }) => void;
  updateSectionBanner: (id: string, updates: Partial<SectionBannerConfig>) => void;
  deleteSectionBanner: (id: string) => void;

  addHeroSlide: (slide: Omit<HeroSlideConfig, 'id'> & { id?: string }) => void;
  updateHeroSlide: (id: string, updates: Partial<HeroSlideConfig>) => void;
  deleteHeroSlide: (id: string) => void;
  moveHeroSlide: (id: string, direction: 'up' | 'down') => void;

  recordOrder: (order: OrderDispatchData) => OrderRecord;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;

  syncDefaultsToCloud: () => Promise<void>;
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

const FS_COLS = {
  products: 'store_products',
  categories: 'store_categories',
  banners: 'store_banners',
  heroSlides: 'store_hero_slides',
  orders: 'store_orders',
};

function stripUndefined<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) out[k] = v;
  }
  return out;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const { user, isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [categories, setCategories] = useState<CategoryConfig[]>(DEFAULT_CATEGORIES);
  const [sectionBanners, setSectionBanners] = useState<SectionBannerConfig[]>(DEFAULT_SECTION_BANNERS);
  const [heroSlides, setHeroSlides] = useState<HeroSlideConfig[]>(DEFAULT_HERO_SLIDES);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Track which Firestore collections already have docs on the server
  const cloudHasDocs = useRef({
    products: false,
    categories: false,
    banners: false,
    heroSlides: false,
  });

  // ── 1. HYDRATE PUBLIC STOREFRONT (Cloud Firestore live onSnapshot OR IndexedDB fallback) ──
  useEffect(() => {
    if (isFirebaseConfigured && firebaseDb) {
      const db = firebaseDb;
      const unsubProducts = onSnapshot(
        collection(db, FS_COLS.products),
        (snap) => {
          if (snap.empty) {
            cloudHasDocs.current.products = false;
            setProducts(defaultProducts);
          } else {
            cloudHasDocs.current.products = true;
            const list = snap.docs
              .map((d) => d.data() as Product & { orderIndex?: number })
              .sort((a, b) => (a.orderIndex ?? 9999) - (b.orderIndex ?? 9999));
            setProducts(list);
          }
          setIsHydrated(true);
        },
        () => {
          setIsHydrated(true);
        }
      );

      const unsubCategories = onSnapshot(
        collection(db, FS_COLS.categories),
        (snap) => {
          if (snap.empty) {
            cloudHasDocs.current.categories = false;
            setCategories(DEFAULT_CATEGORIES);
          } else {
            cloudHasDocs.current.categories = true;
            const list = snap.docs
              .map((d) => d.data() as CategoryConfig)
              .sort((a, b) => (a.orderIndex ?? 999) - (b.orderIndex ?? 999));
            setCategories(list);
          }
        },
        () => {}
      );

      const unsubBanners = onSnapshot(
        collection(db, FS_COLS.banners),
        (snap) => {
          if (snap.empty) {
            cloudHasDocs.current.banners = false;
            setSectionBanners(DEFAULT_SECTION_BANNERS);
          } else {
            cloudHasDocs.current.banners = true;
            const list = snap.docs
              .map((d) => d.data() as SectionBannerConfig)
              .sort((a, b) => (a.orderIndex ?? 999) - (b.orderIndex ?? 999));
            setSectionBanners(list);
          }
        },
        () => {}
      );

      const unsubHero = onSnapshot(
        collection(db, FS_COLS.heroSlides),
        (snap) => {
          if (snap.empty) {
            cloudHasDocs.current.heroSlides = false;
            setHeroSlides(DEFAULT_HERO_SLIDES);
          } else {
            cloudHasDocs.current.heroSlides = true;
            const list = snap.docs
              .map((d) => d.data() as HeroSlideConfig)
              .sort((a, b) => (a.orderIndex ?? 999) - (b.orderIndex ?? 999));
            setHeroSlides(list);
          }
        },
        () => {}
      );

      return () => {
        unsubProducts();
        unsubCategories();
        unsubBanners();
        unsubHero();
      };
    }

    // Local IndexedDB Fallback
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

  // ── 2. SUBSCRIBE TO ORDERS (Admin gets all orders; Customer gets only their own) ──
  useEffect(() => {
    if (!isFirebaseConfigured || !firebaseDb) return;
    if (!user) {
      setOrders([]);
      return;
    }

    const db = firebaseDb;
    const ordersRef = collection(db, FS_COLS.orders);
    const q = isAdmin ? query(ordersRef) : query(ordersRef, where('userId', '==', user.id));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs
          .map((d) => d.data() as OrderRecord)
          .sort((a, b) => (b.isoTimestamp || '').localeCompare(a.isoTimestamp || ''));
        setOrders(list);
      },
      () => {}
    );

    return () => unsub();
  }, [user, isAdmin]);

  // Helper: batch-seed a full array into Firestore if admin edits before initial cloud seed
  const batchWriteCollection = useCallback(async <T extends { id: string }>(colName: string, items: T[]) => {
    if (!isFirebaseConfigured || !firebaseDb) return;
    const batch = writeBatch(firebaseDb);
    items.forEach((item, idx) => {
      batch.set(
        doc(firebaseDb!, colName, item.id),
        stripUndefined({ ...(item as Record<string, unknown>), orderIndex: idx })
      );
    });
    await batch.commit();
  }, []);

  // Persist helpers
  const persistLocal = useCallback(<T,>(key: string, next: T, setter: React.Dispatch<React.SetStateAction<T>>) => {
    setter(next);
    if (!isFirebaseConfigured) {
      void dbSet(key, next);
    }
  }, []);

  // ── PRODUCT CRUD ──
  const addProduct = (input: Omit<Product, 'id'> & { id?: string }): Product => {
    const slug =
      input.id?.trim() ||
      `${input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${Date.now().toString(36).slice(-4)}`;
    const newProduct: Product = {
      ...input,
      id: slug,
      images: input.images && input.images.length > 0 ? input.images : [input.image],
    };
    const next = [newProduct, ...products];
    persistLocal(DB_KEYS.products, next, setProducts);

    if (isFirebaseConfigured && firebaseDb) {
      if (!cloudHasDocs.current.products) {
        void batchWriteCollection(FS_COLS.products, next);
      } else {
        void setDoc(
          doc(firebaseDb, FS_COLS.products, newProduct.id),
          stripUndefined({ ...newProduct, orderIndex: 0 })
        );
      }
    }
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const next = products.map((p) => {
      if (p.id !== id) return p;
      const merged = { ...p, ...updates };
      if (merged.images && merged.images.length > 0 && !updates.image) {
        merged.image = merged.images[0];
      }
      return merged;
    });
    persistLocal(DB_KEYS.products, next, setProducts);

    if (isFirebaseConfigured && firebaseDb) {
      if (!cloudHasDocs.current.products) {
        void batchWriteCollection(FS_COLS.products, next);
      } else {
        const updated = next.find((p) => p.id === id);
        if (updated) {
          void setDoc(doc(firebaseDb, FS_COLS.products, id), stripUndefined({ ...updated }), { merge: true });
        }
      }
    }
  };

  const deleteProduct = (id: string) => {
    const next = products.filter((p) => p.id !== id);
    persistLocal(DB_KEYS.products, next, setProducts);

    if (isFirebaseConfigured && firebaseDb) {
      if (!cloudHasDocs.current.products) {
        void batchWriteCollection(FS_COLS.products, next);
      } else {
        void deleteDoc(doc(firebaseDb, FS_COLS.products, id));
      }
    }
  };

  // ── CATEGORY CRUD ──
  const addCategory = (cat: CategoryConfig) => {
    const cleanId = cat.id.trim().replace(/\s+/g, '');
    if (categories.some((c) => c.id.toLowerCase() === cleanId.toLowerCase())) return;
    const created: CategoryConfig = { ...cat, id: cleanId, orderIndex: categories.length };
    const next = [...categories, created];
    persistLocal(DB_KEYS.categories, next, setCategories);

    if (isFirebaseConfigured && firebaseDb) {
      if (!cloudHasDocs.current.categories) {
        void batchWriteCollection(FS_COLS.categories, next);
      } else {
        void setDoc(doc(firebaseDb, FS_COLS.categories, created.id), stripUndefined({ ...created }));
      }
    }
  };

  const updateCategory = (id: string, updates: Partial<CategoryConfig>) => {
    const next = categories.map((c) => (c.id === id ? { ...c, ...updates } : c));
    persistLocal(DB_KEYS.categories, next, setCategories);

    if (isFirebaseConfigured && firebaseDb) {
      if (!cloudHasDocs.current.categories) {
        void batchWriteCollection(FS_COLS.categories, next);
      } else {
        const updated = next.find((c) => c.id === id);
        if (updated) {
          void setDoc(doc(firebaseDb, FS_COLS.categories, id), stripUndefined({ ...updated }), { merge: true });
        }
      }
    }
  };

  const deleteCategory = (id: string) => {
    const next = categories.filter((c) => c.id !== id);
    persistLocal(DB_KEYS.categories, next, setCategories);

    if (isFirebaseConfigured && firebaseDb) {
      if (!cloudHasDocs.current.categories) {
        void batchWriteCollection(FS_COLS.categories, next);
      } else {
        void deleteDoc(doc(firebaseDb, FS_COLS.categories, id));
      }
    }
  };

  // ── SECTION BANNER CRUD ──
  const addSectionBanner = (banner: Omit<SectionBannerConfig, 'id'> & { id?: string }) => {
    const id = banner.id?.trim() || `banner-${Date.now().toString(36)}`;
    const created: SectionBannerConfig = { ...banner, id, orderIndex: sectionBanners.length };
    const next = [...sectionBanners, created];
    persistLocal(DB_KEYS.sectionBanners, next, setSectionBanners);

    if (isFirebaseConfigured && firebaseDb) {
      if (!cloudHasDocs.current.banners) {
        void batchWriteCollection(FS_COLS.banners, next);
      } else {
        void setDoc(doc(firebaseDb, FS_COLS.banners, created.id), stripUndefined({ ...created }));
      }
    }
  };

  const updateSectionBanner = (id: string, updates: Partial<SectionBannerConfig>) => {
    const next = sectionBanners.map((b) => (b.id === id ? { ...b, ...updates } : b));
    persistLocal(DB_KEYS.sectionBanners, next, setSectionBanners);

    if (isFirebaseConfigured && firebaseDb) {
      if (!cloudHasDocs.current.banners) {
        void batchWriteCollection(FS_COLS.banners, next);
      } else {
        const updated = next.find((b) => b.id === id);
        if (updated) {
          void setDoc(doc(firebaseDb, FS_COLS.banners, id), stripUndefined({ ...updated }), { merge: true });
        }
      }
    }
  };

  const deleteSectionBanner = (id: string) => {
    const next = sectionBanners.filter((b) => b.id !== id);
    persistLocal(DB_KEYS.sectionBanners, next, setSectionBanners);

    if (isFirebaseConfigured && firebaseDb) {
      if (!cloudHasDocs.current.banners) {
        void batchWriteCollection(FS_COLS.banners, next);
      } else {
        void deleteDoc(doc(firebaseDb, FS_COLS.banners, id));
      }
    }
  };

  // ── HERO SLIDE CRUD ──
  const addHeroSlide = (slide: Omit<HeroSlideConfig, 'id'> & { id?: string }) => {
    const id = slide.id?.trim() || `hero-${Date.now().toString(36)}`;
    const created: HeroSlideConfig = { ...slide, id, orderIndex: heroSlides.length };
    const next = [...heroSlides, created];
    persistLocal(DB_KEYS.heroSlides, next, setHeroSlides);

    if (isFirebaseConfigured && firebaseDb) {
      if (!cloudHasDocs.current.heroSlides) {
        void batchWriteCollection(FS_COLS.heroSlides, next);
      } else {
        void setDoc(doc(firebaseDb, FS_COLS.heroSlides, created.id), stripUndefined({ ...created }));
      }
    }
  };

  const updateHeroSlide = (id: string, updates: Partial<HeroSlideConfig>) => {
    const next = heroSlides.map((s) => (s.id === id ? { ...s, ...updates } : s));
    persistLocal(DB_KEYS.heroSlides, next, setHeroSlides);

    if (isFirebaseConfigured && firebaseDb) {
      if (!cloudHasDocs.current.heroSlides) {
        void batchWriteCollection(FS_COLS.heroSlides, next);
      } else {
        const updated = next.find((s) => s.id === id);
        if (updated) {
          void setDoc(doc(firebaseDb, FS_COLS.heroSlides, id), stripUndefined({ ...updated }), { merge: true });
        }
      }
    }
  };

  const deleteHeroSlide = (id: string) => {
    if (heroSlides.length <= 1) return;
    const next = heroSlides.filter((s) => s.id !== id);
    persistLocal(DB_KEYS.heroSlides, next, setHeroSlides);

    if (isFirebaseConfigured && firebaseDb) {
      if (!cloudHasDocs.current.heroSlides) {
        void batchWriteCollection(FS_COLS.heroSlides, next);
      } else {
        void deleteDoc(doc(firebaseDb, FS_COLS.heroSlides, id));
      }
    }
  };

  const moveHeroSlide = (id: string, direction: 'up' | 'down') => {
    const idx = heroSlides.findIndex((s) => s.id === id);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= heroSlides.length) return;
    const copy = [...heroSlides];
    const [moved] = copy.splice(idx, 1);
    copy.splice(targetIdx, 0, moved);
    const reindexed: HeroSlideConfig[] = copy.map((s, i) => ({ ...s, orderIndex: i }));
    persistLocal(DB_KEYS.heroSlides, reindexed, setHeroSlides);

    if (isFirebaseConfigured && firebaseDb) {
      void batchWriteCollection(FS_COLS.heroSlides, reindexed);
    }
  };

  // ── ORDERS ──
  const recordOrder = (order: OrderDispatchData): OrderRecord => {
    const record: OrderRecord = {
      ...order,
      userId: order.accountInfo?.userId || user?.id || 'guest',
      status: 'Pending Verification',
    };
    const next = [record, ...orders];
    persistLocal(DB_KEYS.orders, next, setOrders);

    if (isFirebaseConfigured && firebaseDb) {
      void setDoc(doc(firebaseDb, FS_COLS.orders, record.orderId), stripUndefined({ ...record }));
    }
    return record;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const next = orders.map((o) => (o.orderId === orderId ? { ...o, status } : o));
    persistLocal(DB_KEYS.orders, next, setOrders);

    if (isFirebaseConfigured && firebaseDb) {
      void setDoc(doc(firebaseDb, FS_COLS.orders, orderId), { status }, { merge: true });
    }
  };

  const deleteOrder = (orderId: string) => {
    const next = orders.filter((o) => o.orderId !== orderId);
    persistLocal(DB_KEYS.orders, next, setOrders);

    if (isFirebaseConfigured && firebaseDb) {
      void deleteDoc(doc(firebaseDb, FS_COLS.orders, orderId));
    }
  };

  const syncDefaultsToCloud = async () => {
    if (!isFirebaseConfigured || !firebaseDb) return;
    await Promise.all([
      batchWriteCollection(FS_COLS.products, defaultProducts),
      batchWriteCollection(FS_COLS.categories, DEFAULT_CATEGORIES),
      batchWriteCollection(FS_COLS.banners, DEFAULT_SECTION_BANNERS),
      batchWriteCollection(FS_COLS.heroSlides, DEFAULT_HERO_SLIDES),
    ]);
  };

  const resetStoreToDefaults = async () => {
    if (isFirebaseConfigured && firebaseDb) {
      await syncDefaultsToCloud();
    } else {
      await Promise.all([
        dbDelete(DB_KEYS.products),
        dbDelete(DB_KEYS.categories),
        dbDelete(DB_KEYS.sectionBanners),
        dbDelete(DB_KEYS.heroSlides),
      ]);
    }
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
        isCloudSynced: isFirebaseConfigured,
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
        syncDefaultsToCloud,
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
