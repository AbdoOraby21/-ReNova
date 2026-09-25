import { requireSupabase, isSupabaseConfigured } from './supabase';

/** Order/contact statuses shared with the DB CHECK constraint. */
export type DbOrderStatus = 'جديد' | 'قيد التجهيز' | 'تم الشحن' | 'مكتمل' | 'ملغي';

export interface DbOrder {
  id: string;
  customer_user_id: string;
  status: DbOrderStatus;
  total_amount: number | string;
  created_at: string;
  updated_at: string;
}

export interface DbOrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_category: string;
  quantity: number;
  unit_price: number | string;
  cost_price: number | string;
  subtotal: number | string;
}

export interface CartLineInput {
  productId: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

const num = (v: number | string | null | undefined): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

/**
 * Capability probe for the orders tables (migration 20260926).
 * A single lightweight `limit=1` query: HTTP 200 means the tables exist,
 * 404 means the migration has not been applied yet. The result is cached
 * 1h in localStorage, so a missing backend costs at most one probe/hour
 * and zero noise after migration. Never throws.
 */
const CAP_KEY = 'renova_orders_cap_v1';
const CAP_TTL_MS = 3600000;

async function ordersTablesExist(): Promise<boolean> {
  try {
    const raw = localStorage.getItem(CAP_KEY);
    if (raw) {
      const cap = JSON.parse(raw) as { available?: boolean; ts?: number };
      if (typeof cap.available === 'boolean' && typeof cap.ts === 'number' && Date.now() - cap.ts < CAP_TTL_MS) {
        return cap.available;
      }
    }
  } catch {
    // Storage unavailable — fall through to live probe.
  }
  try {
    if (!isSupabaseConfigured) return false;
    const base = import.meta.env.VITE_SUPABASE_URL as string;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
    const res = await fetch(`${base}/rest/v1/orders?select=id&limit=1`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (res.status === 200 || res.status === 404) {
      const ok = res.status === 200;
      try {
        localStorage.setItem(CAP_KEY, JSON.stringify({ available: ok, ts: Date.now() }));
      } catch {
        // Non-fatal.
      }
      return ok;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Best-effort creation of a real Supabase order + items at checkout.
 * Returns the order id on success, null when the backend is unavailable
 * (tables not migrated yet, offline, RLS denial). Never throws — the
 * caller always keeps its local record so checkout never breaks.
 */
export async function createSupabaseOrder(
  customerUserId: string,
  lines: CartLineInput[],
  total: number,
): Promise<string | null> {
  try {
    if (!isSupabaseConfigured) return null;
    if (!(await ordersTablesExist())) return null;
    const client = requireSupabase();
    const { data: order, error: orderError } = await client
      .from('orders')
      .insert({ customer_user_id: customerUserId, status: 'جديد', total_amount: total })
      .select('id')
      .single();
    if (orderError || !order) return null;
    const rows = lines.map((l) => ({
      order_id: (order as DbOrder).id,
      product_id: l.productId,
      product_name: l.name,
      product_category: l.category,
      quantity: l.quantity,
      unit_price: l.price,
      cost_price: 0,
      subtotal: l.price * l.quantity,
    }));
    const { error: itemsError } = await client.from('order_items').insert(rows);
    if (itemsError) {
      // Roll back the header so half-written orders never linger.
      await client.from('orders').delete().eq('id', (order as DbOrder).id);
      return null;
    }
    return (order as DbOrder).id;
  } catch {
    return null;
  }
}

export interface OrdersQuery {
  orders: DbOrder[];
  /** False when the backend has no orders tables yet (migration not applied). */
  available: boolean;
}

/** Admin: read all orders (RLS restricts to allow-listed admins). */
export async function fetchAllOrders(): Promise<OrdersQuery> {
  try {
    if (!isSupabaseConfigured) return { orders: [], available: false };
    if (!(await ordersTablesExist())) return { orders: [], available: false };
    const client = requireSupabase();
    const { data, error } = await client
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return { orders: [], available: false };
    return { orders: (data ?? []) as DbOrder[], available: true };
  } catch {
    return { orders: [], available: false };
  }
}

/** Admin: read items for a set of orders (single query, RLS-enforced). */
export async function fetchOrderItems(orderIds: string[]): Promise<DbOrderItem[]> {
  try {
    if (!isSupabaseConfigured || orderIds.length === 0) return [];
    if (!(await ordersTablesExist())) return [];
    const client = requireSupabase();
    const { data, error } = await client
      .from('order_items')
      .select('*')
      .in('order_id', orderIds);
    if (error) return [];
    return (data ?? []) as DbOrderItem[];
  } catch {
    return [];
  }
}

export interface SalesSummary {
  orderCount: number;
  completedCount: number;
  unitsSold: number;
  revenue: number;
  cost: number;
  /** Revenue minus recorded cost. Only meaningful when cost data exists. */
  grossProfit: number;
  hasCostData: boolean;
  avgOrderValue: number;
}

/** Completed orders only drive revenue-style metrics. Cancelled/active excluded. */
export function summarizeOrders(orders: DbOrder[], items: DbOrderItem[]): SalesSummary {
  const completed = orders.filter((o) => o.status === 'مكتمل');
  const completedIds = new Set(completed.map((o) => o.id));
  const cItems = items.filter((i) => completedIds.has(i.order_id));
  const revenue = completed.reduce((s, o) => s + num(o.total_amount), 0);
  const cost = cItems.reduce((s, i) => s + num(i.cost_price) * num(i.quantity), 0);
  const unitsSold = cItems.reduce((s, i) => s + num(i.quantity), 0);
  return {
    orderCount: orders.filter((o) => o.status !== 'ملغي').length,
    completedCount: completed.length,
    unitsSold,
    revenue,
    cost,
    grossProfit: revenue - cost,
    hasCostData: cost > 0,
    avgOrderValue: completed.length > 0 ? revenue / completed.length : 0,
  };
}

export type PeriodKey = 'today' | 'last7' | 'last30' | 'month' | 'custom';

export interface DateRange {
  from: Date;
  to: Date;
}

export function periodRange(key: PeriodKey, custom?: { from: string; to: string }): DateRange {
  const now = new Date();
  const startOfDay = (d: Date) => {
    const c = new Date(d);
    c.setHours(0, 0, 0, 0);
    return c;
  };
  if (key === 'custom' && custom?.from && custom?.to) {
    const from = startOfDay(new Date(custom.from));
    const to = new Date(custom.to);
    to.setHours(23, 59, 59, 999);
    return { from, to };
  }
  if (key === 'today') return { from: startOfDay(now), to: now };
  if (key === 'last7') {
    const from = startOfDay(new Date(now.getTime() - 6 * 86400000));
    return { from, to: now };
  }
  if (key === 'last30') {
    const from = startOfDay(new Date(now.getTime() - 29 * 86400000));
    return { from, to: now };
  }
  // this month
  const from = new Date(now.getFullYear(), now.getMonth(), 1);
  return { from, to: now };
}

export function inRange(iso: string, range: DateRange): boolean {
  const t = new Date(iso).getTime();
  return t >= range.from.getTime() && t <= range.to.getTime();
}

export function formatDay(iso: string): string {
  return new Date(iso).toLocaleDateString('ar-EG', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' });
}

/** CSV with BOM so Excel renders Arabic correctly. Real values only. */
export function buildSalesCsv(
  periodLabel: string,
  generatedAt: string,
  summary: SalesSummary,
  orders: DbOrder[],
  items: DbOrderItem[],
): string {
  const esc = (v: string | number): string => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines: string[] = [];
  lines.push('ReNova — تقرير المبيعات');
  lines.push(`الفترة,${esc(periodLabel)}`);
  lines.push(`تاريخ الإنشاء,${esc(generatedAt)}`);
  lines.push('');
  lines.push('الملخص');
  lines.push('البيان,القيمة');
  lines.push(`إجمالي الإيرادات (ج.م),${summary.revenue}`);
  lines.push(`إجمالي التكلفة المسجلة (ج.م),${summary.cost}`);
  lines.push(
    `صافي الأرباح (ج.م),${summary.hasCostData ? summary.grossProfit : 'لم يتم حساب صافي الأرباح بعد'}`,
  );
  lines.push(`عدد الطلبات,${summary.orderCount}`);
  lines.push(`الطلبات المكتملة,${summary.completedCount}`);
  lines.push(`الوحدات المباعة,${summary.unitsSold}`);
  lines.push(`متوسط قيمة الطلب (ج.م),${Math.round(summary.avgOrderValue * 100) / 100}`);
  lines.push('');
  lines.push('الطلبات');
  lines.push('المعرف,التاريخ,الحالة,الإجمالي (ج.م)');
  for (const o of orders) {
    lines.push(`${o.id},${formatDateTime(o.created_at)},${o.status},${num(o.total_amount)}`);
  }
  lines.push('');
  lines.push('المنتجات');
  lines.push('الطلب,المنتج,القسم,الكمية,سعر الوحدة (ج.م),الإجمالي (ج.م)');
  for (const i of items) {
    lines.push(
      `${i.order_id},${esc(i.product_name)},${esc(i.product_category)},${i.quantity},${num(i.unit_price)},${num(i.subtotal)}`,
    );
  }
  return '﻿' + lines.join('\n');
}

export function downloadTextFile(filename: string, text: string, mime: string): void {
  const blob = new Blob([text], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export function reportFilename(ext: 'csv' | 'pdf'): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `ReNova-Sales-Report-${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}.${ext}`;
}
