import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, Category } from '../types';
import { mockProducts, mockCategories } from '../data/mockData';

interface ProductStore {
  products: Product[];
  categories: Category[];
  searchQuery: string;
  selectedCategory: string;
  seedProducts: () => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addCategory: (name: string) => void;
  deleteCategory: (id: string) => void;
  resetToDemo: () => void;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: [],
      categories: [],
      searchQuery: '',
      selectedCategory: 'الكل',

      seedProducts: () => {
        if (get().products.length === 0) {
          set({ products: mockProducts, categories: mockCategories });
        }
      },

      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setSelectedCategory: (selectedCategory) => set({ selectedCategory }),

      addProduct: (productData) => {
        const newProduct: Product = {
          ...productData,
          id: `prod-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set({ products: [newProduct, ...get().products] });
      },

      updateProduct: (updatedProduct) => {
        set({
          products: get().products.map((p) =>
            p.id === updatedProduct.id ? updatedProduct : p
          ),
        });
      },

      deleteProduct: (id) => {
        set({
          products: get().products.filter((p) => p.id !== id),
        });
      },

      addCategory: (name) => {
        const newCategory: Category = {
          id: `cat-${Date.now()}`,
          name,
        };
        set({ categories: [...get().categories, newCategory] });
      },

      deleteCategory: (id) => {
        set({
          categories: get().categories.filter((c) => c.id !== id),
        });
      },

      resetToDemo: () => {
        set({
          products: mockProducts,
          categories: mockCategories,
        });
      },
    }),
    {
      name: 'renova_products',
    }
  )
);
