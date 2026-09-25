import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FileDown, FileText, CalendarDays, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  fetchAllOrders,
  fetchOrderItems,
  summarizeOrders,
  periodRange,
  inRange,
  formatDay,
  buildSalesCsv,
  downloadTextFile,
  reportFilename,
  type DbOrder,
  type DbOrderItem,
  type PeriodKey,
} from '../../lib/orders';

const PERIODS: { key: PeriodKey; label: string }[] = [
  { key: 'today', label: 'اليوم' },
  { key: 'last7', label: 'آخر 7 أيام' },
  { key: 'last30', label: 'آخر 30 يومًا' },
  { key: 'month', label: 'هذا الشهر' },
  { key: 'custom', label: 'فترة مخصصة' },
];

const PERIOD_LABELS: Record<PeriodKey, string> = {
  today: 'اليوم',
  last7: 'آخر 7 أيام',
  last30: 'آخر 30 يومًا',
  month: 'هذا الشهر',
  custom: 'فترة مخصصة',
};

/** Flat hex palette for the printable node (html2canvas-safe, no oklch). */
const P = {
  bg: '#141414',
  card: '#1e1e1e',
  border: '#3a3a3a',
  text: '#111111',
  paper: '#ffffff',
  muted: '#555555',
  green: '#0f9d62',
};

const Reports: React.FC = () => {
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [items, setItems] = useState<DbOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<PeriodKey>('last30');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [exporting, setExporting] = useState<'csv' | 'pdf' | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { orders: rows } = await fetchAllOrders();
      if (cancelled) return;
      setOrders(rows);
      setItems(rows.length > 0 ? await fetchOrderItems(rows.map((o) => o.id)) : []);
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const range = useMemo(
    () => periodRange(period, { from: customFrom, to: customTo }),
    [period, customFrom, customTo],
  );

  const filteredOrders = useMemo(
    () => orders.filter((o) => inRange(o.created_at, range)),
    [orders, range],
  );
  const filteredIds = useMemo(() => new Set(filteredOrders.map((o) => o.id)), [filteredOrders]);
  const filteredItems = useMemo(() => items.filter((i) => filteredIds.has(i.order_id)), [items, filteredIds]);
  const summary = useMemo(() => summarizeOrders(filteredOrders, filteredItems), [filteredOrders, filteredItems]);

  const daily = useMemo(() => {
    const map = new Map<string, { revenue: number; count: number }>();
    for (const o of filteredOrders) {
      if (o.status === 'ملغي') continue;
      const d = formatDay(o.created_at);
      const cur = map.get(d) ?? { revenue: 0, count: 0 };
      cur.revenue += Number(o.total_amount) || 0;
      cur.count += 1;
      map.set(d, cur);
    }
    return [...map.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [filteredOrders]);

  const topProducts = useMemo(() => {
    const map = new Map<string, { name: string; category: string; qty: number; revenue: number }>();
    const completedIds = new Set(filteredOrders.filter((o) => o.status === 'مكتمل').map((o) => o.id));
    for (const i of filteredItems) {
      if (!completedIds.has(i.order_id)) continue;
      const key = `${i.product_name}||${i.product_category}`;
      const cur = map.get(key) ?? { name: i.product_name, category: i.product_category, qty: 0, revenue: 0 };
      cur.qty += Number(i.quantity) || 0;
      cur.revenue += Number(i.subtotal) || 0;
      map.set(key, cur);
    }
    return [...map.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 10);
  }, [filteredItems, filteredOrders]);

  const byCategory = useMemo(() => {
    const map = new Map<string, { revenue: number; qty: number }>();
    const completedIds = new Set(filteredOrders.filter((o) => o.status === 'مكتمل').map((o) => o.id));
    for (const i of filteredItems) {
      if (!completedIds.has(i.order_id)) continue;
      const cat = i.product_category || 'غير مصنف';
      const cur = map.get(cat) ?? { revenue: 0, qty: 0 };
      cur.revenue += Number(i.subtotal) || 0;
      cur.qty += Number(i.quantity) || 0;
      map.set(cat, cur);
    }
    return [...map.entries()].sort((a, b) => b[1].revenue - a[1].revenue);
  }, [filteredItems, filteredOrders]);

  const hasData = filteredOrders.length > 0;
  const generatedLabel = new Date().toLocaleString('ar-EG', { dateStyle: 'full', timeStyle: 'short' });

  const handleCsv = () => {
    setExporting('csv');
    try {
      const csv = hasData
        ? buildSalesCsv(PERIOD_LABELS[period], generatedLabel, summary, filteredOrders, filteredItems)
        : '﻿ReNova — تقرير المبيعات\nالفترة,' +
          PERIOD_LABELS[period] +
          '\nتاريخ الإنشاء,' +
          generatedLabel +
          '\n\nلا توجد معاملات\n';
      downloadTextFile(reportFilename('csv'), csv, 'text/csv');
    } finally {
      setExporting(null);
    }
  };

  const handlePdf = async () => {
    if (!printRef.current) return;
    setExporting('pdf');
    try {
      const canvas = await html2canvas(printRef.current, { scale: 2, backgroundColor: P.paper, useCORS: true });
      const img = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const ratio = canvas.height / canvas.width;
      let imgH = pageW * ratio;
      let imgW = pageW;
      if (imgH > pageH) {
        imgH = pageH;
        imgW = pageH / ratio;
      }
      pdf.addImage(img, 'PNG', (pageW - imgW) / 2, 0, imgW, imgH);
      pdf.save(reportFilename('pdf'));
    } finally {
      setExporting(null);
    }
  };

  const cards = [
    { label: 'إجمالي الإيرادات (ج.م)', value: summary.revenue },
    { label: 'التكلفة المسجلة (ج.م)', value: summary.cost },
    {
      label: 'صافي الأرباح (ج.م)',
      value: summary.hasCostData ? summary.grossProfit : '—',
    },
    { label: 'الطلبات', value: summary.orderCount },
    { label: 'المكتملة', value: summary.completedCount },
    { label: 'الوحدات المباعة', value: summary.unitsSold },
    { label: 'متوسط الطلب (ج.م)', value: Math.round(summary.avgOrderValue * 100) / 100 },
  ];

  return (
    <div className="w-full max-w-full min-w-0 overflow-x-clip space-y-4 sm:space-y-6">
      <div className="flex flex-col items-start gap-1 min-w-0">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-black text-white leading-tight">التقارير</h1>
        <p className="text-[11px] sm:text-xs lg:text-sm text-white/50">تقارير المبيعات من معاملات Supabase الحقيقية فقط.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] text-white/50 flex items-center gap-1.5">
          <CalendarDays size={14} /> الفترة:
        </span>
        {PERIODS.map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
              period === p.key ? 'bg-[#0f9d62] text-white' : 'bg-[#1a1a1a] border border-[#2a2a2a] text-white/60 hover:text-white'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {period === 'custom' && (
        <div className="flex flex-wrap items-center gap-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4">
          <label className="text-[11px] text-white/60 flex items-center gap-2">
            من
            <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} className="bg-[#141414] border border-[#2a2a2a] rounded-xl px-3 py-2 text-xs text-white" />
          </label>
          <label className="text-[11px] text-white/60 flex items-center gap-2">
            إلى
            <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} className="bg-[#141414] border border-[#2a2a2a] rounded-xl px-3 py-2 text-xs text-white" />
          </label>
        </div>
      )}

      {loading ? (
        <div className="py-16 flex flex-col items-center gap-3 text-white/40 text-sm">
          <Loader2 size={24} className="animate-spin text-[#0f9d62]" />
          جارٍ تحميل المعاملات...
        </div>
      ) : !hasData ? (
        <div className="text-center py-20 bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] space-y-3">
          <FileText size={40} className="mx-auto text-white/20" />
          <p className="text-white/60 text-sm">لا توجد بيانات مبيعات ضمن الفترة المحددة.</p>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            <button onClick={handleCsv} disabled={exporting !== null} className="px-4 py-2 rounded-xl text-xs font-bold bg-[#1e1e1e] border border-[#2a2a2a] text-white/70 hover:text-white disabled:opacity-50 flex items-center gap-2">
              <FileDown size={14} /> CSV (فارغ)
            </button>
            <button onClick={handlePdf} disabled={exporting !== null} className="px-4 py-2 rounded-xl text-xs font-bold bg-[#1e1e1e] border border-[#2a2a2a] text-white/70 hover:text-white disabled:opacity-50 flex items-center gap-2">
              <FileDown size={14} /> PDF (فارغ)
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {cards.map((c) => (
              <div key={c.label} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 min-w-0">
                <p className="text-[10px] text-white/50 truncate">{c.label}</p>
                <p className="text-lg font-black text-white tabular-nums truncate">{c.value}</p>
              </div>
            ))}
          </div>
          {!summary.hasCostData && (
            <p className="text-[11px] text-white/40">لم يتم حساب صافي الأرباح بعد — لا توجد بيانات تكلفة كافية لحساب الأرباح.</p>
          )}

          {/* Export */}
          <div className="flex flex-wrap gap-2">
            <button onClick={handleCsv} disabled={exporting !== null} className="px-5 py-2.5 rounded-xl text-xs font-black bg-[#0f9d62] hover:bg-[#0d8a56] disabled:opacity-50 text-white flex items-center gap-2">
              {exporting === 'csv' ? <Loader2 size={14} className="animate-spin" /> : <FileDown size={14} />} تحميل CSV
            </button>
            <button onClick={handlePdf} disabled={exporting !== null} className="px-5 py-2.5 rounded-xl text-xs font-black bg-[#1e1e1e] border border-[#2a2a2a] hover:bg-white/5 disabled:opacity-50 text-white flex items-center gap-2">
              {exporting === 'pdf' ? <Loader2 size={14} className="animate-spin" /> : <FileDown size={14} />} تحميل PDF
            </button>
          </div>

          {/* Daily */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 sm:p-6">
            <h3 className="text-sm font-black text-white mb-3">المبيعات حسب التاريخ</h3>
            <div className="space-y-2">
              {daily.map(([d, v]) => (
                <div key={d} className="flex items-center justify-between gap-3 text-xs bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-2.5">
                  <span className="text-white/70">{d}</span>
                  <span className="text-white/40 tabular-nums">{v.count} طلبات</span>
                  <span className="font-bold text-[#22c55e] tabular-nums">{v.revenue} ج.م</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top products + categories */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 sm:p-6">
              <h3 className="text-sm font-black text-white mb-3">أفضل المنتجات مبيعًا</h3>
              {topProducts.length === 0 ? (
                <p className="text-xs text-white/40">لا توجد بيانات متاحة حاليًا</p>
              ) : (
                <div className="space-y-2">
                  {topProducts.map((t) => (
                    <div key={t.name} className="flex items-center justify-between gap-3 text-xs bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-2.5 min-w-0">
                      <span className="text-white font-bold truncate">{t.name}</span>
                      <span className="text-white/40 tabular-nums shrink-0">{t.qty} ×</span>
                      <span className="font-bold text-[#22c55e] tabular-nums shrink-0">{t.revenue} ج.م</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 sm:p-6">
              <h3 className="text-sm font-black text-white mb-3">المبيعات حسب القسم</h3>
              {byCategory.length === 0 ? (
                <p className="text-xs text-white/40">لا توجد بيانات متاحة حاليًا</p>
              ) : (
                <div className="space-y-2">
                  {byCategory.map(([cat, v]) => (
                    <div key={cat} className="flex items-center justify-between gap-3 text-xs bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-2.5">
                      <span className="text-white font-bold truncate">{cat}</span>
                      <span className="font-bold text-[#22c55e] tabular-nums shrink-0">{v.revenue} ج.م</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Printable report node (off-screen, hex-only styles for html2canvas) */}
      <div style={{ position: 'fixed', left: -10000, top: 0, width: 794 }}>
        <div ref={printRef} dir="rtl" style={{ background: P.paper, color: P.text, padding: 32, fontFamily: 'Cairo, Tahoma, sans-serif' }}>
          <div style={{ textAlign: 'center', borderBottom: `2px solid ${P.green}`, paddingBottom: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 22, fontWeight: 900 }}>ReNova — تقرير المبيعات</div>
            <div style={{ fontSize: 12, color: P.muted }}>الفترة: {PERIOD_LABELS[period]} • الإنشاء: {generatedLabel}</div>
          </div>
          {!hasData ? (
            <div style={{ fontSize: 14, textAlign: 'center', padding: 24 }}>لا توجد معاملات</div>
          ) : (
            <>
              <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 8 }}>الملخص</div>
              <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse', marginBottom: 16 }}>
                <tbody>
                  {[
                    ['إجمالي الإيرادات (ج.م)', summary.revenue],
                    ['التكلفة المسجلة (ج.م)', summary.cost],
                    [
                      'صافي الأرباح (ج.م)',
                      summary.hasCostData ? summary.grossProfit : 'لم يتم حساب صافي الأرباح بعد',
                    ],
                    ['الطلبات', summary.orderCount],
                    ['المكتملة', summary.completedCount],
                    ['الوحدات المباعة', summary.unitsSold],
                  ].map(([k, v]) => (
                    <tr key={String(k)}>
                      <td style={{ border: `1px solid ${P.border}`, padding: 6 }}>{k}</td>
                      <td style={{ border: `1px solid ${P.border}`, padding: 6, textAlign: 'left' }}>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 8 }}>الملخص اليومي</div>
              <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: P.card, color: P.paper }}>
                    <td style={{ padding: 6 }}>التاريخ</td>
                    <td style={{ padding: 6 }}>الطلبات</td>
                    <td style={{ padding: 6 }}>الإيراد (ج.م)</td>
                  </tr>
                </thead>
                <tbody>
                  {daily.map(([d, v]) => (
                    <tr key={d}>
                      <td style={{ border: `1px solid ${P.border}`, padding: 6 }}>{d}</td>
                      <td style={{ border: `1px solid ${P.border}`, padding: 6 }}>{v.count}</td>
                      <td style={{ border: `1px solid ${P.border}`, padding: 6 }}>{v.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
