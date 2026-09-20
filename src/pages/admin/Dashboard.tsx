import React from 'react';
import { ShoppingCart, Users, Package, DollarSign, Activity, Recycle, ShoppingBag } from 'lucide-react';
import { useProductStore } from '../../stores/productStore';
import { useAuthStore } from '../../stores/authStore';
import { useRequestStore } from '../../stores/requestStore';

const Dashboard: React.FC = () => {
  const { products } = useProductStore();
  const { users } = useAuthStore();
  const { scrapRequests, purchaseOrders } = useRequestStore();

  const totalSales = purchaseOrders.reduce((sum, o) => sum + o.total, 0);

  // Top 4 stats - order matches screenshot RTL: العملاء, المنتجات, المبيعات, العمليات (right to left in screenshot)
  const topStats = [
    {
      label: 'إجمالي العملاء',
      value: users.filter(u => u.role === 'user').length || 2,
      icon: Users,
      color: 'text-[#3b82f6]',
      bg: 'bg-[#3b82f6]/15',
      iconBg: 'bg-[#1e2a4a]',
    },
    {
      label: 'المنتجات المعروضة',
      value: products.length || 6,
      icon: Package,
      color: 'text-[#22c55e]',
      bg: 'bg-[#22c55e]/15',
      iconBg: 'bg-[#1a3329]',
    },
    {
      label: 'إجمالي المبيعات',
      value: `${totalSales || 0} ج.م`,
      icon: DollarSign,
      color: 'text-[#22c55e]',
      bg: 'bg-[#22c55e]/15',
      iconBg: 'bg-[#1a3329]',
    },
    {
      label: 'إجمالي العمليات',
      value: scrapRequests.length + purchaseOrders.length || 1,
      icon: Activity,
      color: 'text-[#a78bfa]',
      bg: 'bg-[#a78bfa]/15',
      iconBg: 'bg-[#2a2250]',
    },
  ];

  const getCounts = (items: any[]) => items.reduce((acc: any, cur: any) => { acc[cur.status] = (acc[cur.status] || 0) + 1; return acc; }, {} as any);
  const scrapCounts = getCounts(scrapRequests);
  const purchaseCounts = getCounts(purchaseOrders);

  const purchaseStatuses: { label: string; key: string; color: string; dot: string }[] = [
    { label: 'قيد الانتظار', key: 'جديد', color: 'bg-[#f97316]', dot: 'bg-[#f97316]' },
    { label: 'جاري التجهيز', key: 'قيد التجهيز', color: 'bg-[#3b82f6]', dot: 'bg-[#3b82f6]' },
    { label: 'تم الشحن', key: 'تم الشحن', color: 'bg-[#a78bfa]', dot: 'bg-[#a78bfa]' },
    { label: 'تم التوصيل', key: 'مكتمل', color: 'bg-[#22c55e]', dot: 'bg-[#22c55e]' },
    { label: 'مرفوض', key: 'ملغي', color: 'bg-[#ef4444]', dot: 'bg-[#ef4444]' },
  ];

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
      <div className="flex items-center gap-3 py-1.5">
        <div className={`w-2 h-2 rounded-full ${dot} shrink-0`} />
        <span className="text-xs text-white/70 w-[70px] text-right shrink-0">{label}</span>
        <div className="flex-1 h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden mx-2">
          <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
        </div>
        <span className="text-xs text-white/40 w-10 text-left shrink-0">({pct}%)</span>
        <span className="text-xs font-bold text-white w-3 text-left shrink-0">{count}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col items-start gap-1 mb-2">
        <h1 className="text-xl md:text-2xl font-black text-white">الرئيسية والإحصائيات</h1>
        <p className="text-xs md:text-sm text-white/50">نظرة عامة على نشاط المنصة وحالة الطلبات.</p>
      </div>

      {/* Top 4 Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {topStats.map((s, i) => (
          <div key={i} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-5 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-white/50 font-medium">{s.label}</span>
              <span className="text-2xl font-black text-white leading-none">{s.value}</span>
            </div>
            <div className={`w-11 h-11 rounded-xl ${s.iconBg} ${s.color} flex items-center justify-center shrink-0`}>
              <s.icon size={20} strokeWidth={1.9} />
            </div>
          </div>
        ))}
      </div>

      {/* Two Analytics Cards */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* طلبات الشراء */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-[15px] font-black text-white flex items-center gap-2">
                طلبات الشراء
                <span className="w-7 h-7 rounded-lg bg-[#2a2250] text-[#a78bfa] flex items-center justify-center">
                  <ShoppingCart size={14} />
                </span>
              </h3>
              <p className="text-[11px] text-white/40 mt-1">تفصيل حالات المبيعات المنتظر</p>
            </div>
            <div className="text-left">
              <span className="text-2xl font-black text-white leading-none">{purchaseOrders.length || 0}</span>
              <p className="text-[10px] text-white/40">إجمالي الطلبات</p>
            </div>
          </div>

          <div className="space-y-1">
            {purchaseStatuses.map(st => (
              <StatusRow
                key={st.key}
                label={st.label}
                count={purchaseCounts[st.key] || 0}
                total={purchaseOrders.length || 0}
                color={st.color}
                dot={st.dot}
              />
            ))}
          </div>
        </div>

        {/* طلبات بيع الخردة */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-[15px] font-black text-white flex items-center gap-2">
                طلبات بيع الخردة
                <span className="w-7 h-7 rounded-lg bg-[#0f9d62] flex items-center justify-center">
                  <Recycle size={14} className="text-white animate-spin-slow" strokeWidth={2} style={{ transformOrigin: 'center' }} />
                </span>
              </h3>
              <p className="text-[11px] text-white/40 mt-1">تفصيل حالات استلام الخردة</p>
            </div>
            <div className="text-left">
              <span className="text-2xl font-black text-[#22c55e] leading-none">{scrapRequests.length || 1}</span>
              <p className="text-[10px] text-white/40">إجمالي الطلبات</p>
            </div>
          </div>

          <div className="space-y-1">
            {scrapStatuses.map(st => (
              <StatusRow
                key={st.key}
                label={st.label}
                count={scrapCounts[st.key] || 0}
                total={scrapRequests.length || 1}
                color={st.color}
                dot={st.dot}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Optional Recent Activity - matches earlier but styled dark */}
      {(scrapRequests.length > 0 || purchaseOrders.length > 0) && (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6">
          <h3 className="text-sm font-black text-white mb-4">آخر النشاطات</h3>
          <div className="space-y-3">
            {[...scrapRequests, ...purchaseOrders]
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 5)
              .map((act, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-[#141414] rounded-xl border border-[#2a2a2a]">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${'scrapType' in act ? 'bg-[#1a3329] text-[#22c55e]' : 'bg-[#1e2a4a] text-[#3b82f6]'}`}>
                      {'scrapType' in act ? <Recycle size={16} /> : <ShoppingBag size={16} />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{'scrapType' in act ? `طلب بيع خردة (${(act as any).scrapType})` : `طلب شراء #${act.id}`}</p>
                      <p className="text-[11px] text-white/40">{act.userName} • {new Date(act.createdAt).toLocaleDateString('ar-EG')}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#22c55e]">{'askingPrice' in act ? `${(act as any).askingPrice} ج.م` : `${(act as any).total} ج.م`}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
