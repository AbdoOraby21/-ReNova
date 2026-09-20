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
        const current = get().users;
        let users = [...current];
        let changed = false;

        // Ensure demo accounts always exist (idempotent, fixes stale localStorage)
        for (const demo of mockUsers) {
          const exists = users.find(u => u.email.toLowerCase() === demo.email.toLowerCase());
          if (!exists) {
            users.push(demo);
            changed = true;
          } else if (exists.role !== demo.role || exists.name !== demo.name) {
            // repair corrupted role/name
            users = users.map(u => u.email.toLowerCase() === demo.email.toLowerCase() ? { ...u, role: demo.role, name: demo.name } : u);
            changed = true;
          }
        }

        if (users.length === 0) {
          set({ users: mockUsers });
        } else if (changed) {
          set({ users });
        } else if (current.length === 0) {
          set({ users: mockUsers });
        }

        // Also repair current authenticated user if role mismatched
        const { user } = get();
        if (user) {
          const fresh = users.find(u => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
          if (fresh && fresh.role !== user.role) {
            set({ user: fresh });
          }
        }
      },

      login: async (email, password) => {
        get().seedUsers();
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedPass = password.trim();
        // Demo user accepts 123456 ; also allow admin123 for admin via regular login for flexibility
        const user = get().users.find(u => u.email.toLowerCase() === normalizedEmail);
        if (!user) return false;
        const isValidPass = normalizedPass === '123456' || (user.role === 'admin' && normalizedPass === 'admin123');
        if (!isValidPass) return false;
        // For regular login route, allow both roles but prefer user; admin will be redirected to /admin by caller
        set({ user, isAuthenticated: true });
        return true;
      },

      adminLogin: async (email, password) => {
        get().seedUsers();
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedPass = password.trim();
        const user = get().users.find(u => u.email.toLowerCase() === normalizedEmail && u.role === 'admin');
        if (user && normalizedPass === 'admin123') {
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
        if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) return false;

        const newUser: User = {
          id: `user-${Date.now()}`,
          name,
          email: email.trim().toLowerCase(),
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
