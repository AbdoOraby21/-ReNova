import React, { useState } from 'react';
import { Recycle, User, Phone, MapPin, Trash2, FileText } from 'lucide-react';
import { useRequestStore } from '../../stores/requestStore';
import { RequestStatus } from '../../types';

const Requests: React.FC = () => {
  const { scrapRequests, updateScrapStatus, deleteScrapRequest } = useRequestStore();
  const [activeTab, setActiveTab] = useState<RequestStatus | 'الكل'>('الكل');
  const [selectedId, setSelectedId] = useState<string | null>(scrapRequests[0]?.id || null);

  const tabs: (RequestStatus | 'الكل')[] = ['الكل', 'جديد', 'تم التواصل', 'جاري التفاوض', 'مقبول', 'مكتمل', 'مرفوض'];
  const filtered = scrapRequests.filter(r => activeTab === 'الكل' || r.status === activeTab);
  const selected = filtered.find(r => r.id === selectedId) || filtered[0];

  const getStatusPill = (s: string) => {
    if (s === 'تم التواصل') return 'bg-[#7c3aed]/20 text-[#a78bfa] border-[#7c3aed]/30';
    if (s === 'جديد') return 'bg-[#3b82f6]/15 text-[#60a5fa] border-[#3b82f6]/20';
    if (s === 'مقبول' || s === 'مكتمل') return 'bg-[#22c55e]/15 text-[#4ade80] border-[#22c55e]/20';
    if (s === 'مرفوض') return 'bg-[#ef4444]/15 text-[#f87171] border-[#ef4444]/20';
    return 'bg-[#f59e0b]/15 text-[#fbbf24] border-[#f59e0b]/20';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-black text-white">طلبات بيع الخردة</h1>
        <p className="text-xs text-white/50">إدارة طلبات المستخدمين لبيع الخردة الخاصة بهم</p>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide bg-[#1a1a1a] border border-[#2a2a2a] rounded-full p-1 w-fit max-w-full">
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${activeTab === t ? 'bg-white text-black' : 'text-white/50 hover:text-white hover:bg-white/5'}`}>
            {t}
          </button>
        ))}
      </div>

      {selected ? (
        <div className="grid lg:grid-cols-[1fr_420px] gap-6">
          {/* List */}
          <div className="hidden lg:block space-y-2 max-h-[70vh] overflow-y-auto scrollbar-hide pr-1">
            {filtered.map(r => (
              <button key={r.id} onClick={() => setSelectedId(r.id)} className={`w-full text-right p-4 rounded-2xl border text-xs flex items-center justify-between gap-3 transition-all ${selectedId === r.id ? 'bg-[#1a1a1a] border-[#0f9d62] text-white' : 'bg-[#141414] border-[#2a2a2a] text-white/70 hover:border-white/10'}`}>
                <span className="truncate">{r.scrapType} - {r.userName}</span>
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold border shrink-0 ${getStatusPill(r.status)}`}>{r.status}</span>
              </button>
            ))}
          </div>

          {/* Detail Card */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl overflow-hidden">
            {/* Card Header */}
            <div className="px-5 py-4 border-b border-[#2a2a2a] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#0f9d62] flex items-center justify-center">
                  <Recycle size={18} className="text-white animate-spin-slow" strokeWidth={2} style={{ transformOrigin: 'center' }} />
                </div>
                <div>
                  <p className="text-[11px] text-white/40">رقم الطلب</p>
                  <p className="text-xs font-black text-white">#{selected.id.replace(/\D/g, '').slice(0, 13) || '1786051552463'}</p>
                </div>
              </div>
              <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold border ${getStatusPill(selected.status)}`}>{selected.status}</span>
            </div>

            <div className="p-5 space-y-5">
              {/* بيانات الخردة / بيانات العميل */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold text-white/40">بيانات الخردة</h4>
                  <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-4 space-y-3">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-white/40">النوع</span>
                      <span className="px-2 py-1 rounded-lg bg-[#2a2a2a] text-white text-[11px] font-bold">{selected.scrapType}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-white/40">التاريخ</span>
                      <span className="text-white font-bold">{new Date(selected.createdAt).toLocaleDateString('en-GB')}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-white/40">السعر المطلوب</span>
                      <span className="text-[#22c55e] font-black">{selected.askingPrice} ج.م</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold text-white/40">بيانات العميل</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 bg-[#141414] border border-[#2a2a2a] rounded-xl px-3 py-2">
                      <div className="w-7 h-7 rounded-full bg-[#2a2a2a] flex items-center justify-center"><User size={12} className="text-white/60" /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-white/40">الاسم</p>
                        <p className="text-xs font-bold text-white truncate">{selected.userName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-[#141414] border border-[#2a2a2a] rounded-xl px-3 py-2">
                      <div className="w-7 h-7 rounded-full bg-[#2a2a2a] flex items-center justify-center"><Phone size={12} className="text-white/60" /></div>
                      <div>
                        <p className="text-[10px] text-white/40">الهاتف</p>
                        <p className="text-xs font-bold text-white" dir="ltr">{selected.userPhone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-[#141414] border border-[#2a2a2a] rounded-xl px-3 py-2">
                      <div className="w-7 h-7 rounded-full bg-[#2a2a2a] flex items-center justify-center"><MapPin size={12} className="text-white/60" /></div>
                      <div>
                        <p className="text-[10px] text-white/40">العنوان</p>
                        <p className="text-xs font-bold text-white">{selected.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-[11px] font-bold text-white/40 mb-2">تفاصيل إضافية</h4>
                <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-4 flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#f59e0b]/15 text-[#f59e0b] flex items-center justify-center shrink-0"><FileText size={14} /></div>
                  <div>
                    <p className="text-[11px] font-bold text-[#f59e0b]">وصف العمل</p>
                    <p className="text-xs text-white/70 mt-1">{selected.description}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 py-4 bg-[#141414] border-t border-[#2a2a2a] flex items-center gap-2">
              <button onClick={() => deleteScrapRequest(selected.id)} className="w-9 h-9 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-white/40 hover:text-[#ef4444] hover:border-[#ef4444]/20">
                <Trash2 size={14} />
              </button>
              <div className="flex-1 flex items-center gap-2">
                <span className="text-[11px] text-white/40 whitespace-nowrap">تحديث الحالة</span>
                <select value={selected.status} onChange={e => updateScrapStatus(selected.id, e.target.value as RequestStatus)} className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0f9d62]">
                  {tabs.filter(t => t !== 'الكل').map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a]">
          <Recycle className="w-16 h-16 text-white/20 mx-auto mb-3" />
          <p className="text-white/50 text-sm">لا توجد طلبات في هذا القسم حالياً.</p>
        </div>
      )}

      {/* Mobile list fallback */}
      <div className="lg:hidden grid gap-3">
        {filtered.filter(r => r.id !== selected?.id).slice(0, 4).map(r => (
          <div key={r.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 flex items-center justify-between">
            <span className="text-xs font-bold text-white">{r.scrapType}</span>
            <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${getStatusPill(r.status)}`}>{r.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Requests;
