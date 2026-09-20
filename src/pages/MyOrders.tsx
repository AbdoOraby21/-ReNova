import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Recycle, ShoppingBag, Clock, Package, ChevronLeft } from 'lucide-react';
import { useRequestStore } from '../stores/requestStore';
import { useAuthStore } from '../stores/authStore';

const MyOrders: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'scrap' | 'purchase'>('scrap');
  const { scrapRequests, purchaseOrders } = useRequestStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const userScrapRequests = scrapRequests.filter(r => r.userId === user?.id);
  const userPurchaseOrders = purchaseOrders.filter(o => o.userId === user?.id);

  const getScrapStatusColor = (status: string) => {
    switch (status) {
      case 'جديد': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'مقبول': case 'مكتمل': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'مرفوض': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    }
  };

  const getPurchaseStatusColor = (status: string) => {
    switch (status) {
      case 'مكتمل': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'ملغي': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'تم الشحن': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-black">طلباتي</h1>
        
        <div className="flex p-1 bg-[var(--bg-item)] rounded-2xl w-fit border border-[var(--border)]">
          <button
            onClick={() => setActiveTab('scrap')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'scrap' 
              ? 'bg-[var(--bg-card)] text-[var(--primary)] shadow-sm' 
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <Recycle size={18} />
            طلبات بيع الخردة
            <span className="bg-[var(--primary)] bg-opacity-10 text-[var(--primary)] px-2 rounded-md text-[10px]">{userScrapRequests.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('purchase')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'purchase' 
              ? 'bg-[var(--bg-card)] text-[var(--primary)] shadow-sm' 
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <ShoppingBag size={18} />
            مشترياتي
            <span className="bg-[var(--primary)] bg-opacity-10 text-[var(--primary)] px-2 rounded-md text-[10px]">{userPurchaseOrders.length}</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {activeTab === 'scrap' ? (
          userScrapRequests.length > 0 ? (
            userScrapRequests.map((req) => (
              <div key={req.id} className="bg-[var(--bg-card)] border border-[var(--border)] p-6 rounded-3xl space-y-4 hover:border-[var(--primary)] transition-all group">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[var(--bg-item)] rounded-2xl flex items-center justify-center text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-all">
                      <Recycle size={24} />
                    </div>
                    <div>
                      <h3 className="font-black text-lg">{req.scrapType}</h3>
                      <p className="text-[var(--text-muted)] text-xs flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(req.createdAt).toLocaleDateString('ar-EG')} • {req.id}
                      </p>
                    </div>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getScrapStatusColor(req.status)}`}>
                    {req.status}
                  </span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 pt-2">
                  <div className="bg-[var(--bg-item)] p-4 rounded-2xl">
                    <span className="text-[var(--text-muted)] text-[10px] block mb-1">السعر المطلوب</span>
                    <span className="text-xl font-black text-[var(--primary-light)]">{req.askingPrice} ج.م</span>
                  </div>
                  <div className="bg-[var(--bg-item)] p-4 rounded-2xl">
                    <span className="text-[var(--text-muted)] text-[10px] block mb-1">عنوان الاستلام</span>
                    <span className="font-bold line-clamp-1">{req.address}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-[var(--bg-card)] rounded-[2.5rem] border border-[var(--border)] space-y-4">
              <div className="w-20 h-20 bg-[var(--bg-item)] rounded-full flex items-center justify-center mx-auto text-[var(--text-muted)]">
                <Recycle size={32} />
              </div>
              <p className="text-[var(--text-muted)]">لم تقم بإرسال أي طلبات لبيع الخردة بعد.</p>
              <button onClick={() => navigate('/sell-scrap')} className="text-[var(--primary)] font-bold hover:underline">أرسل أول طلب الآن</button>
            </div>
          )
        ) : (
          userPurchaseOrders.length > 0 ? (
            userPurchaseOrders.map((order) => (
              <div key={order.id} className="bg-[var(--bg-card)] border border-[var(--border)] p-6 rounded-3xl space-y-4 hover:border-[var(--primary)] transition-all group">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[var(--bg-item)] rounded-2xl flex items-center justify-center text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-all">
                      <ShoppingBag size={24} />
                    </div>
                    <div>
                      <h3 className="font-black text-lg">طلب شراء {order.id}</h3>
                      <p className="text-[var(--text-muted)] text-xs flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(order.createdAt).toLocaleDateString('ar-EG')} • {order.items.length} منتجات
                      </p>
                    </div>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getPurchaseStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="w-12 h-12 rounded-lg overflow-hidden border border-[var(--border)] shrink-0">
                      <img src={item.image} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {order.items.length > 5 && (
                    <div className="w-12 h-12 rounded-lg bg-[var(--bg-item)] flex items-center justify-center text-xs font-bold">
                      +{order.items.length - 5}
                    </div>
                  )}
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-[var(--border)]">
                  <div className="flex flex-col">
                    <span className="text-[var(--text-muted)] text-[10px]">إجمالي المدفوع</span>
                    <span className="text-xl font-black text-[var(--primary-light)]">{order.total} ج.م</span>
                  </div>
                  <button className="flex items-center gap-1 text-[var(--primary)] text-sm font-bold hover:gap-2 transition-all">
                    تفاصيل الطلب
                    <ChevronLeft size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-[var(--bg-card)] rounded-[2.5rem] border border-[var(--border)] space-y-4">
              <div className="w-20 h-20 bg-[var(--bg-item)] rounded-full flex items-center justify-center mx-auto text-[var(--text-muted)]">
                <Package size={32} />
              </div>
              <p className="text-[var(--text-muted)]">لم تقم بشراء أي منتجات بعد.</p>
              <button onClick={() => navigate('/')} className="text-[var(--primary)] font-bold hover:underline">ابدأ التسوق الآن</button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default MyOrders;
