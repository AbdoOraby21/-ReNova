import React, { useState } from 'react';
import { ShoppingBag, User, Phone, MapPin, Calendar, Clock, CreditCard, ChevronLeft } from 'lucide-react';
import { useRequestStore } from '../../stores/requestStore';
import { PurchaseStatus } from '../../types';

const PurchaseRequests: React.FC = () => {
  const { purchaseOrders, updatePurchaseStatus } = useRequestStore();
  const [activeTab, setActiveTab] = useState<PurchaseStatus | 'الكل'>('الكل');

  const tabs: (PurchaseStatus | 'الكل')[] = ['الكل', 'جديد', 'قيد التجهيز', 'تم الشحن', 'مكتمل', 'ملغي'];

  const filteredOrders = purchaseOrders.filter(order => 
    activeTab === 'الكل' || order.status === activeTab
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مكتمل': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'ملغي': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'تم الشحن': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'قيد التجهيز': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === tab 
              ? 'bg-[var(--primary)] text-white shadow-lg shadow-green-900/20' 
              : 'bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border)] hover:border-[var(--text-main)]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[2.5rem] overflow-hidden">
            <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-8">
              <div className="flex-grow space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-black">طلب شراء {order.id}</h3>
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--text-muted)] text-xs mt-1">
                      <Calendar size={12} />
                      {new Date(order.createdAt).toLocaleDateString('ar-EG')}
                      <span className="mx-1 opacity-20">|</span>
                      <Clock size={12} />
                      {new Date(order.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-[var(--bg-item)] p-3 rounded-2xl">
                    <div className="flex flex-col items-end">
                      <span className="text-[var(--text-muted)] text-[10px]">طريقة الدفع</span>
                      <span className="text-xs font-bold flex items-center gap-1">
                        <CreditCard size={12} />
                        {order.paymentMethod}
                      </span>
                    </div>
                    <div className="w-[1px] h-8 bg-[var(--border)] mx-1"></div>
                    <div className="flex flex-col items-end">
                      <span className="text-[var(--text-muted)] text-[10px]">إجمالي المبلغ</span>
                      <span className="text-xl font-black text-[var(--primary-light)]">{order.total} ج.م</span>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-widest text-[var(--primary)]">بيانات العميل</h4>
                    <div className="bg-[var(--bg-item)] p-4 rounded-2xl space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--primary)] bg-opacity-10 text-[var(--primary)] flex items-center justify-center">
                          <User size={14} />
                        </div>
                        <span className="font-bold">{order.userName}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--primary)] bg-opacity-10 text-[var(--primary)] flex items-center justify-center">
                          <Phone size={14} />
                        </div>
                        <span className="text-sm">{order.userPhone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--primary)] bg-opacity-10 text-[var(--primary)] flex items-center justify-center">
                          <MapPin size={14} />
                        </div>
                        <span className="text-sm line-clamp-1">{order.address}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-widest text-[var(--primary)]">المنتجات ({order.items.length})</h4>
                    <div className="bg-[var(--bg-item)] p-4 rounded-2xl space-y-3 max-h-[160px] overflow-y-auto scrollbar-hide">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-[var(--border)]">
                              <img src={item.image} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-bold truncate max-w-[150px]">{item.name}</span>
                              <span className="text-[var(--text-muted)] text-[10px]">الكمية: {item.quantity}</span>
                            </div>
                          </div>
                          <span className="text-sm font-bold whitespace-nowrap">{item.price * item.quantity} ج.م</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:w-48 shrink-0 flex flex-col justify-center border-r border-[var(--border)] pr-8 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[var(--text-muted)] mr-1">تحديث الحالة</label>
                  <select 
                    className="w-full text-sm"
                    value={order.status}
                    onChange={(e) => updatePurchaseStatus(order.id, e.target.value as PurchaseStatus)}
                  >
                    {tabs.filter(t => t !== 'الكل').map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <button className="w-full py-3 bg-[var(--bg-item)] hover:bg-[var(--border)] text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                  تفاصيل كاملة
                  <ChevronLeft size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-20 bg-[var(--bg-card)] rounded-[2.5rem] border border-[var(--border)]">
          <ShoppingBag className="w-20 h-20 text-[var(--text-muted)] mx-auto opacity-20 mb-4" />
          <p className="text-[var(--text-muted)]">لا توجد طلبات شراء في هذا القسم حالياً.</p>
        </div>
      )}
    </div>
  );
};

export default PurchaseRequests;
