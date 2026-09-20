import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { mockUsers } from '../data/mockData';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  users: User[];
  login: (email: string, password: string) => Promise<boolean>;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  googleLogin: () => Promise<void>;
  appleLogin: () => Promise<void>;
  register: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: User) => void;
  seedUsers: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      users: [],

      seedUsers: () => {
        if (get().users.length === 0) {
          set({ users: mockUsers });
        }
      },

      login: async (email, password) => {
        // Simulated login logic
        const user = get().users.find(u => u.email === email && password === '123456');
        if (user && user.role === 'user') {
          set({ user, isAuthenticated: true });
          return true;
        }
        return false;
      },

      adminLogin: async (email, password) => {
        const user = get().users.find(u => u.email === email && password === 'admin123');
        if (user && user.role === 'admin') {
          set({ user, isAuthenticated: true });
          return true;
        }
        return false;
      },

      googleLogin: async () => {
        const googleUser: User = {
          id: `google-${Date.now()}`,
          name: 'Google Demo User',
          email: 'google.user@renova.demo',
          role: 'user',
          createdAt: new Date().toISOString(),
        };
        const users = get().users;
        if (!users.find(u => u.email === googleUser.email)) {
          set({ users: [...users, googleUser] });
        }
        set({ user: googleUser, isAuthenticated: true });
      },

      appleLogin: async () => {
        const appleUser: User = {
          id: `apple-${Date.now()}`,
          name: 'Apple Demo User',
          email: 'apple.user@renova.demo',
          role: 'user',
          createdAt: new Date().toISOString(),
        };
        const users = get().users;
        if (!users.find(u => u.email === appleUser.email)) {
          set({ users: [...users, appleUser] });
        }
        set({ user: appleUser, isAuthenticated: true });
      },

      register: async (name, email, phone, _password) => {
        const users = get().users;
        if (users.find(u => u.email === email)) return false;

        const newUser: User = {
          id: `user-${Date.now()}`,
          name,
          email,
          phone,
          role: 'user',
          createdAt: new Date().toISOString(),
        };

        set({ users: [...users, newUser], user: newUser, isAuthenticated: true });
        return true;
      },

      logout: () => set({ user: null, isAuthenticated: false }),
      updateUser: (user) => set({ user }),
    }),
    {
      name: 'renova_auth',
    }
  )
);
