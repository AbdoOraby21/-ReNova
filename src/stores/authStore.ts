import { create } from 'zustand';
import type { User as SupabaseAuthUser } from '@supabase/supabase-js';
import { User } from '../types';
import { mockUsers } from '../data/mockData';
import { supabase, isSupabaseConfigured, NOT_CONFIGURED_ERROR } from '../lib/supabase';

/**
 * Admin accounts are managed separately in Supabase Auth / dashboard tooling.
 * Registration can NEVER create an admin: the role is derived here from a
 * fixed email allow-list, never from client input or user metadata.
 * (True enforcement lives in Supabase RLS; this gate only drives the UI.)
 */
const ADMIN_EMAILS = ['admin@renova.demo'];

const isAdminEmail = (email: string) => ADMIN_EMAILS.includes(email.trim().toLowerCase());

function mapAuthUser(authUser: SupabaseAuthUser): User {
  const email = (authUser.email || '').toLowerCase();
  const meta = (authUser.user_metadata || {}) as Record<string, unknown>;
  const name =
    (typeof meta.name === 'string' && meta.name.trim()) ||
    (typeof meta.full_name === 'string' && meta.full_name.trim()) ||
    email.split('@')[0] ||
    'مستخدم رينوفا';
  const phone = typeof meta.phone === 'string' ? meta.phone : undefined;
  return {
    id: authUser.id,
    name,
    email,
    phone,
    role: isAdminEmail(email) ? 'admin' : 'user',
    createdAt: authUser.created_at,
  };
}

export interface AuthResult {
  ok: boolean;
  message?: string;
  needsConfirmation?: boolean;
}

function friendlyError(raw: string, fallback: string): string {
  const msg = raw.toLowerCase();
  if (msg.includes('invalid login credentials')) return 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
  if (msg.includes('email not confirmed')) return 'تم إنشاء الحساب. يرجى تأكيد بريدك الإلكتروني قبل تسجيل الدخول.';
  if (msg.includes('user already registered') || msg.includes('already been registered') || msg.includes('already exists'))
    return 'هذا البريد الإلكتروني مسجل بالفعل. سجّل الدخول بدلًا من ذلك.';
  if (msg.includes('password should be at least') || msg.includes('weak password') || msg.includes('password is too short'))
    return 'كلمة المرور ضعيفة. استخدم 6 أحرف على الأقل.';
  if (msg.includes('failed to fetch') || msg.includes('network')) return 'تعذر الاتصال بالخادم. تحقق من الإنترنت وحاول مجددًا.';
  if (msg.includes('invalid email') || msg.includes('email address')) return 'صيغة البريد الإلكتروني غير صحيحة.';
  return fallback;
}

function requireClient() {
  if (!isSupabaseConfigured || !supabase) throw new Error(NOT_CONFIGURED_ERROR);
  return supabase;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  /** Demo list used by the Admin Customers/Dashboard display only — never for auth decisions. */
  users: User[];
  /** True when a Supabase Auth session exists. */
  supabaseSessionActive: boolean;
  /** False until the initial session restore completes (prevents auth UI flashing). */
  initialized: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  adminLogin: (email: string, password: string) => Promise<AuthResult>;
  register: (name: string, email: string, phone: string, password: string) => Promise<AuthResult>;
  logout: () => void;
  updateUser: (user: User) => void;
  seedUsers: () => void;
  initAuth: () => void;
}

let authListenerStarted = false;

export const useAuthStore = create<AuthStore>()((set, get) => ({
  user: null,
  isAuthenticated: false,
  users: [],
  supabaseSessionActive: false,
  initialized: false,

  seedUsers: () => {
    if (get().users.length === 0) set({ users: mockUsers });
  },

  initAuth: () => {
    if (!isSupabaseConfigured || !supabase) {
      set({ user: null, isAuthenticated: false, supabaseSessionActive: false, initialized: true });
      return;
    }
    // Restore any persisted session, then stay in sync with auth events.
    supabase.auth
      .getSession()
      .then(({ data }) => {
        const su = data.session?.user ?? null;
        set({
          user: su ? mapAuthUser(su) : null,
          isAuthenticated: !!su,
          supabaseSessionActive: !!data.session,
          initialized: true,
        });
      })
      .catch(() => {
        set({ user: null, isAuthenticated: false, supabaseSessionActive: false, initialized: true });
      });
    if (!authListenerStarted) {
      authListenerStarted = true;
      supabase.auth.onAuthStateChange((_event, session) => {
        const su = session?.user ?? null;
        set({
          user: su ? mapAuthUser(su) : null,
          isAuthenticated: !!su,
          supabaseSessionActive: !!session,
        });
      });
    }
  },

  login: async (email, password) => {
    try {
      const client = requireClient();
      const { data, error } = await client.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (error) return { ok: false, message: friendlyError(error.message, 'حدث خطأ أثناء تسجيل الدخول.') };
      if (!data.session || !data.user) {
        return { ok: false, message: 'تم إنشاء الحساب. يرجى تأكيد بريدك الإلكتروني قبل تسجيل الدخول.' };
      }
      const user = mapAuthUser(data.user);
      set({ user, isAuthenticated: true, supabaseSessionActive: true });
      return { ok: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'حدث خطأ أثناء تسجيل الدخول.';
      return { ok: false, message: message === NOT_CONFIGURED_ERROR ? message : friendlyError(message, 'حدث خطأ أثناء تسجيل الدخول.') };
    }
  },

  adminLogin: async (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!isAdminEmail(normalizedEmail)) {
      return { ok: false, message: 'هذا الحساب ليس حساب مشرف.' };
    }
    try {
      const client = requireClient();
      const { data, error } = await client.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });
      if (error) return { ok: false, message: friendlyError(error.message, 'بيانات دخول المشرف غير صحيحة.') };
      if (!data.session || !data.user) {
        return { ok: false, message: 'تم إنشاء الحساب. يرجى تأكيد بريدك الإلكتروني قبل تسجيل الدخول.' };
      }
      const user = mapAuthUser(data.user);
      set({ user, isAuthenticated: true, supabaseSessionActive: true });
      return { ok: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'حدث خطأ أثناء تسجيل الدخول.';
      return { ok: false, message: message === NOT_CONFIGURED_ERROR ? message : friendlyError(message, 'حدث خطأ أثناء تسجيل الدخول.') };
    }
  },

  register: async (name, email, phone, password) => {
    try {
      const client = requireClient();
      const normalizedEmail = email.trim().toLowerCase();
      // Role is NEVER accepted from the client: every signup is a normal user.
      const { data, error } = await client.auth.signUp({
        email: normalizedEmail,
        password,
        options: { data: { name: name.trim(), phone: phone.trim() } },
      });
      if (error) return { ok: false, message: friendlyError(error.message, 'حدث خطأ أثناء إنشاء الحساب.') };
      // Supabase returns an empty identities array when the email is already taken.
      if (data.user && Array.isArray((data.user as unknown as Record<string, unknown>).identities) && ((data.user as unknown as Record<string, unknown>).identities as unknown[]).length === 0) {
        return { ok: false, message: 'هذا البريد الإلكتروني مسجل بالفعل. سجّل الدخول بدلًا من ذلك.' };
      }
      if (data.session && data.user) {
        // Email confirmation disabled → immediate session.
        const user = mapAuthUser(data.user);
        set({ user, isAuthenticated: true, supabaseSessionActive: true });
        return { ok: true };
      }
      // Email confirmation required → do NOT claim a login happened.
      return { ok: true, needsConfirmation: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'حدث خطأ أثناء إنشاء الحساب.';
      return { ok: false, message: message === NOT_CONFIGURED_ERROR ? message : friendlyError(message, 'حدث خطأ أثناء إنشاء الحساب.') };
    }
  },

  logout: () => {
    // Clear local state immediately so protected UI disappears at once;
    // the persisted Supabase session is removed in the background.
    set({ user: null, isAuthenticated: false, supabaseSessionActive: false });
    if (supabase) supabase.auth.signOut().catch(() => undefined);
  },

  updateUser: (user) => set({ user }),
}));
