import { create } from 'zustand';
import { Product, Category } from '../types';
import { requireSupabase, isSupabaseConfigured, NOT_CONFIGURED_ERROR } from '../lib/supabase';
import { FALLBACK_IMAGE } from '../components/common/SafeImage';
import { deleteProductImageByUrl } from '../lib/productImages';

interface DbProduct {
  id: string;
  name: string;
  category: string;
  description: string | null;
  price: number | string;
  condition: string | null;
  status: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

interface DbCategory {
  id: string;
  name: string;
}

function mapProduct(row: DbProduct): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? '',
    price: Number(row.price) || 0,
    category: row.category,
    image: row.image_url || FALLBACK_IMAGE,
    condition: row.condition ?? undefined,
    status: row.status ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  condition?: string;
}

interface ProductStore {
  products: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  selectedCategory: string;
  fetchProducts: () => Promise<void>;
  setSelectedCategory: (category: string) => void;
  addProduct: (product: ProductInput) => Promise<Product>;
  updateProduct: (id: string, product: ProductInput) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  addCategory: (name: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useProductStore = create<ProductStore>()((set, get) => ({
  products: [],
  categories: [],
  loading: false,
  error: null,
  selectedCategory: 'الكل',

  fetchProducts: async () => {
    if (get().loading) return;
    if (!isSupabaseConfigured) {
      set({ products: [], categories: [], error: NOT_CONFIGURED_ERROR });
      return;
    }
    set({ loading: true, error: null });
    try {
      const client = requireSupabase();
      const [{ data: products, error: productsError }, { data: categories, error: categoriesError }] =
        await Promise.all([
          client.from('products').select('*').eq('status', 'published').order('created_at', { ascending: false }),
          client.from('categories').select('*').order('name', { ascending: true }),
        ]);
      if (productsError) throw productsError;
      if (categoriesError) throw categoriesError;
      set({
        products: (products ?? []).map(mapProduct),
        categories: (categories ?? []).map((c: DbCategory) => ({ id: c.id, name: c.name })),
        loading: false,
      });
    } catch (e) {
      set({ loading: false, error: e instanceof Error ? e.message : 'فشل تحميل المنتجات' });
    }
  },

  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),

  addProduct: async (product) => {
    const client = requireSupabase();
    const { data, error } = await client
      .from('products')
      .insert({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        image_url: product.image || null,
        condition: product.condition || 'مُجدد - ممتاز',
        status: 'published',
      })
      .select('*')
      .single();
    if (error) throw new Error(error.message);
    const mapped = mapProduct(data as DbProduct);
    set({ products: [mapped, ...get().products] });
    return mapped;
  },

  updateProduct: async (id, product) => {
    const client = requireSupabase();
    const { data, error } = await client
      .from('products')
      .update({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        image_url: product.image || null,
        condition: product.condition || 'مُجدد - ممتاز',
      })
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw new Error(error.message);
    const mapped = mapProduct(data as DbProduct);
    set({ products: get().products.map((p) => (p.id === id ? mapped : p)) });
    return mapped;
  },

  deleteProduct: async (id) => {
    const client = requireSupabase();
    const existing = get().products.find((p) => p.id === id);
    const { error } = await client.from('products').delete().eq('id', id);
    if (error) throw new Error(error.message);
    if (existing?.image) await deleteProductImageByUrl(existing.image);
    set({ products: get().products.filter((p) => p.id !== id) });
  },

  addCategory: async (name) => {
    const client = requireSupabase();
    const { data, error } = await client.from('categories').insert({ name }).select('*').single();
    if (error) throw new Error(error.message);
    const row = data as DbCategory;
    set({ categories: [...get().categories, { id: row.id, name: row.name }] });
  },

  deleteCategory: async (id) => {
    const client = requireSupabase();
    const { error } = await client.from('categories').delete().eq('id', id);
    if (error) throw new Error(error.message);
    set({ categories: get().categories.filter((c) => c.id !== id) });
  },

  clearError: () => set({ error: null }),
}));
