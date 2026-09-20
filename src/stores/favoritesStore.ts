import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesStore {
  favoriteIds: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      toggleFavorite: (productId) => {
        const favoriteIds = get().favoriteIds;
        if (favoriteIds.includes(productId)) {
          set({ favoriteIds: favoriteIds.filter((id) => id !== productId) });
        } else {
          set({ favoriteIds: [...favoriteIds, productId] });
        }
      },
      isFavorite: (productId) => get().favoriteIds.includes(productId),
    }),
    {
      name: 'renova_favorites',
    }
  )
);
