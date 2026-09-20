import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ScrapRequest, PurchaseOrder, RequestStatus, PurchaseStatus, ScrapType } from '../types';
import { mockScrapRequests, mockPurchaseOrders, mockScrapTypes } from '../data/mockData';

interface RequestStore {
  scrapRequests: ScrapRequest[];
  purchaseOrders: PurchaseOrder[];
  scrapTypes: ScrapType[];
  seedRequests: () => void;
  addScrapRequest: (request: Omit<ScrapRequest, 'id' | 'createdAt' | 'status'>) => void;
  updateScrapStatus: (id: string, status: RequestStatus) => void;
  deleteScrapRequest: (id: string) => void;
  addPurchaseOrder: (order: Omit<PurchaseOrder, 'id' | 'createdAt' | 'status'>) => void;
  updatePurchaseStatus: (id: string, status: PurchaseStatus) => void;
  addScrapType: (name: string) => void;
  deleteScrapType: (id: string) => void;
  resetToDemo: () => void;
}

export const useRequestStore = create<RequestStore>()(
  persist(
    (set, get) => ({
      scrapRequests: [],
      purchaseOrders: [],
      scrapTypes: [],

      seedRequests: () => {
        if (get().scrapRequests.length === 0) {
          set({
            scrapRequests: mockScrapRequests,
            purchaseOrders: mockPurchaseOrders,
            scrapTypes: mockScrapTypes,
          });
        }
      },

      addScrapRequest: (requestData) => {
        const newRequest: ScrapRequest = {
          ...requestData,
          id: `RN-SCRAP-${1000 + get().scrapRequests.length + 1}`,
          status: 'جديد',
          createdAt: new Date().toISOString(),
        };
        set({ scrapRequests: [newRequest, ...get().scrapRequests] });
      },

      updateScrapStatus: (id, status) => {
        set({
          scrapRequests: get().scrapRequests.map((r) =>
            r.id === id ? { ...r, status } : r
          ),
        });
      },

      deleteScrapRequest: (id) => {
        set({
          scrapRequests: get().scrapRequests.filter((r) => r.id !== id),
        });
      },

      addPurchaseOrder: (orderData) => {
        const newOrder: PurchaseOrder = {
          ...orderData,
          id: `RN-${1000 + get().purchaseOrders.length + 1}`,
          status: 'جديد',
          createdAt: new Date().toISOString(),
        };
        set({ purchaseOrders: [newOrder, ...get().purchaseOrders] });
      },

      updatePurchaseStatus: (id, status) => {
        set({
          purchaseOrders: get().purchaseOrders.map((o) =>
            o.id === id ? { ...o, status } : o
          ),
        });
      },

      addScrapType: (name) => {
        const newType: ScrapType = {
          id: `st-${Date.now()}`,
          name,
        };
        set({ scrapTypes: [...get().scrapTypes, newType] });
      },

      deleteScrapType: (id) => {
        set({
          scrapTypes: get().scrapTypes.filter((t) => t.id !== id),
        });
      },

      resetToDemo: () => {
        set({
          scrapRequests: mockScrapRequests,
          purchaseOrders: mockPurchaseOrders,
          scrapTypes: mockScrapTypes,
        });
      },
    }),
    {
      name: 'renova_requests',
    }
  )
);
