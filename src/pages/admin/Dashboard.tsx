import React, { useEffect, useState } from 'react';
import { Users, Package, DollarSign, ShoppingBag, Activity, Recycle, Receipt } from 'lucide-react';
import { useProductStore } from '../../stores/productStore';
import { useRequestStore } from '../../stores/requestStore';
import { fetchAllOrders, fetchOrderItems, summarizeOrders, formatDateTime, type DbOrder, type DbOrderItem } from '../../lib/orders';

const Dashboard: React.FC = () => {
  const { products, fetchProducts } = useProductStore();
  const { scrapRequests } = useRequestStore();
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [ordersAvailable, setOrdersAvailable] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (products.length === 0) fetchProducts();
  }, [products.length, fetchProducts]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { orders: rows, available } = await fetchAllOrders();
      if (!cancelled) {
        setOrders(rows);
        setOrdersAvailable(available);
        setOrdersLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const [items, setItems] = useState<DbOrderItem[]>([]);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (orders.length === 0) {
        setItems([]);
        return;
      }
      const rows = await fetchOrderItems(orders.map((o) => o.id));
      if (!cancelled) setItems(rows);
    })();
    return () => {
      cancelled = true;
    };
  }, [orders]);

  const summary = summarizeOrders(orders, items);
  const hasSales = summary.completedCount > 0;

  // Every money/count figure below comes from REAL Supabase transactions
  // (completed orders only). No mock, no derived-from-catalog revenue.
  const topStats = [
    {
      label: 'المنتجات المعروضة',
      value: products.length,
      icon: Package,
      color: 'text-[#22c55e]',
      bg: 'bg-[#22c55e]/15',
      iconBg: 'bg-[#1a3329]',
    },
    {
      label: 'الطلبات المكتملة',
      value: ordersLoading ? '…' : summary.completedCount,
      icon: ShoppingBag,
      color: 'text-[#3b82f6]',
      bg: 'bg-[#3b82f6]/15',
      iconBg: 'bg-[#1e2a4a]',
    },
    {
      label: 'إجمالي الإيرادات',
      value: ordersLoading ? '…' : `${summary.revenue} ج.م`,
      icon: DollarSign,
      color: 'text-[#22c55e]',
      bg: 'bg-[#22c55e]/15',
      iconBg: 'bg-[#1a3329]',
    },
    {
      label: 'متوسط قيمة الطلب',
      value: ordersLoading ? '…' : `${Math.round(summary.avgOrderValue * 100) / 100} ج.م`,
      icon: Receipt,
      color: 'text-[#a78bfa]',
      bg: 'bg-[#a78bfa]/15',
      iconBg: 'bg-[#2a2250]',
    },
  ];

  const getCounts = (vals: string[]) =>
    vals.reduce((acc: Record<string, number>, cur) => {
      acc[cur] = (acc[cur] || 0) + 1;
      return acc;
    }, {});

  const orderStatusCounts = getCounts(orders.map((o) => o.status));
  const orderTotal = orders.length;
  const orderStatuses: { label: string; key: string; color: string; dot: string }[] = [
    { label: 'جديد', key: 'جديد', color: 'bg-[#f97316]', dot: 'bg-[#f97316]' },
    { label: 'قيد التجهيز', key: 'قيد التجهيز', color: 'bg-[#3b82f6]', dot: 'bg-[#3b82f6]' },
    { label: 'تم الشحن', key: 'تم الشحن', color: 'bg-[#a78bfa]', dot: 'bg-[#a78bfa]' },
    { label: 'مكتمل', key: 'مكتمل', color: 'bg-[#22c55e]', dot: 'bg-[#22c55e]' },
    { label: 'ملغي', key: 'ملغي', color: 'bg-[#ef4444]', dot: 'bg-[#ef4444]' },
  ];

  const scrapCounts = getCounts(scrapRequests.map((r) => r.status));
  const scrapStatuses: { label: string; key: string; color: string; dot: string }[] = [
    { label: 'جديد', key: 'جديد', color: 'bg-[#f97316]', dot: 'bg-[#f97316]' },
    { label: 'تم التواصل', key: 'تم التواصل', color: 'bg-[#6366f1]', dot: 'bg-[#6366f1]' },
    { label: 'جاري التفاوض', key: 'جاري التفاوض', color: 'bg-[#eab308]', dot: 'bg-[#eab308]' },
    { label: 'مقبول', key: 'مقبول', color: 'bg-[#84cc16]', dot: 'bg-[#84cc16]' },
    { label: 'مكتمل', key: 'مكتمل', color: 'bg-[#14b8a6]', dot: 'bg-[#14b8a6]' },
    { label: 'مرفوض', key: 'مرفوض', color: 'bg-[#ef4444]', dot: 'bg-[#ef4444]' },
  ];

  const StatusRow = ({ label, count, total, color, dot }: { label: string; count: number; total: number; color: string; dot: string }) => {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return (
      <div className="flex items-center gap-2 sm:gap-3 py-1.5 min-w-0">
        <div className={`w-2 h-2 rounded-full ${dot} shrink-0`} />
        <span className="text-[11px] sm:text-xs text-white/70 w-[64px] sm:w-[70px] text-right shrink-0 truncate">{label}</span>
        <div className="flex-1 min-w-0 h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden">
          <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
        </div>
        <span className="text-[11px] sm:text-xs text-white/40 w-9 sm:w-10 text-left shrink-0 tabular-nums">({pct}%)</span>
        <span className="text-[11px] sm:text-xs font-bold text-white w-4 text-left shrink-0 tabular-nums">{count}</span>
      </div>
    );
  };

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <div className="w-full max-w-full min-w-0 overflow-x-clip space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col items-start gap-1 mb-1 sm:mb-2 min-w-0">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-black text-white leading-tight">الرئيسية والإحصائيات</h1>
        <p className="text-[11px] sm:text-xs lg:text-sm text-white/50">نظرة عامة على نشاط المنصة وحالة الطلبات.</p>
      </div>

      {/* Top 4 Stats — all from real sources (Supabase catalog + transactions) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {topStats.map((s, i) => (
          <div key={i} className="min-w-0 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-3">
            <div className="flex flex-col gap-1 min-w-0 flex-1">
              <span className="text-[11px] text-white/50 font-medium truncate">{s.label}</span>
              <span className="text-xl sm:text-2xl font-black text-white leading-none truncate tabular-nums">{s.value}</span>
            </div>
            <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${s.iconBg} ${s.color} flex items-center justify-center shrink-0`}>
              <s.icon size={20} strokeWidth={1.9} />
            </div>
          </div>
        ))}
      </div>

      {/* Honest zero-sales state (never fake revenue) — shown whenever there
          are no completed sales, including before the orders tables exist. */}
      {!ordersLoading && !hasSales && (
        <div className="min-w-0 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 sm:p-6 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#1a3329] text-[#22c55e] flex items-center justify-center shrink-0">
            <Activity size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm text-white/60">لا توجد مبيعات حتى الآن — ستظهر الإيرادات والطلبات هنا عند إتمام أول عملية شراء حقيقية.</p>
            {!ordersAvailable && (
              <p className="text-[11px] text-white/35 mt-1">جداول الطلبات غير منشأة بعد في Supabase (طبّق supabase/migrations/20260926_orders.sql).</p>
            )}
          </div>
        </div>
      )}

      {/* Two Analytics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Real Supabase orders by status */}
        <div className="min-w-0 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-sm sm:text-[15px] font-black text-white flex items-center gap-2">
                طلبات الشراء
                <span className="w-7 h-7 rounded-lg bg-[#2a2250] text-[#a78bfa] flex items-center justify-center shrink-0">
                  <ShoppingBag size={14} />
                </span>
              </h3>
              <p className="text-[11px] text-white/40 mt-1">طلبات حقيقية من قاعدة البيانات</p>
            </div>
            <div className="text-left shrink-0">
              <span className="text-xl sm:text-2xl font-black text-white leading-none tabular-nums">{orderTotal}</span>
              <p className="text-[10px] text-white/40 whitespace-nowrap">إجمالي الطلبات</p>
            </div>
          </div>

          <div className="space-y-1 min-w-0">
            {orderStatuses.map((st) => (
              <StatusRow
                key={st.key}
                label={st.label}
                count={orderStatusCounts[st.key] || 0}
                total={orderTotal}
                color={st.color}
                dot={st.dot}
              />
            ))}
          </div>
        </div>

        {/* Real local scrap submissions by status */}
        <div className="min-w-0 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-sm sm:text-[15px] font-black text-white flex items-center gap-2">
                طلبات بيع الخردة
                <span className="w-7 h-7 rounded-lg bg-[#0f9d62] flex items-center justify-center shrink-0">
                  <Recycle size={14} className="text-white animate-spin-slow" strokeWidth={2} style={{ transformOrigin: 'center' }} />
                </span>
              </h3>
              <p className="text-[11px] text-white/40 mt-1">تفصيل حالات استلام الخردة</p>
            </div>
            <div className="text-left shrink-0">
              <span className="text-xl sm:text-2xl font-black text-[#22c55e] leading-none tabular-nums">{scrapRequests.length}</span>
              <p className="text-[10px] text-white/40 whitespace-nowrap">إجمالي الطلبات</p>
            </div>
          </div>

          <div className="space-y-1 min-w-0">
            {scrapStatuses.map((st) => (
              <StatusRow
                key={st.key}
                label={st.label}
                count={scrapCounts[st.key] || 0}
                total={scrapRequests.length}
                color={st.color}
                dot={st.dot}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Recent real orders */}
      {recentOrders.length > 0 ? (
        <div className="min-w-0 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 sm:p-6">
          <h3 className="text-sm font-black text-white mb-4">آخر الطلبات</h3>
          <div className="space-y-3 min-w-0">
            {recentOrders.map((o) => (
              <div key={o.id} className="flex items-center justify-between gap-3 p-3 bg-[#141414] rounded-xl border border-[#2a2a2a] min-w-0">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-[#1e2a4a] text-[#3b82f6]">
                    <ShoppingBag size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate">طلب #{o.id.slice(0, 8)} • {o.status}</p>
                    <p className="text-[11px] text-white/40 truncate">{formatDateTime(o.created_at)}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#22c55e] shrink-0 whitespace-nowrap tabular-nums">{Number(o.total_amount)} ج.م</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="min-w-0 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 sm:p-6">
          <h3 className="text-sm font-black text-white mb-2">آخر الطلبات</h3>
          <p className="text-xs text-white/40 flex items-center gap-2">
            <Users size={14} className="shrink-0" /> لا توجد بيانات متاحة حاليًا
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
