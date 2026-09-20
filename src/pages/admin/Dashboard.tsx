import React from 'react';
import { ShoppingCart, Users, Recycle, Package, TrendingUp } from 'lucide-react';
import { useProductStore } from '../../stores/productStore';
import { useAuthStore } from '../../stores/authStore';
import { useRequestStore } from '../../stores/requestStore';

const Dashboard: React.FC = () => {
  const { products } = useProductStore();
  const { users } = useAuthStore();
  const { scrapRequests, purchaseOrders } = useRequestStore();

  const totalSales = purchaseOrders.reduce((sum, order) => sum + order.total, 0);

  const stats = [
    { label: 'إجمالي المبيعات', value: `${totalSales} ج.م`, icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'إجمالي العمليات', value: scrapRequests.length + purchaseOrders.length, icon: ShoppingCart, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'المنتجات المعروضة', value: products.length, icon: Package, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'إجمالي العملاء', value: users.length, icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  const getStatusCounts = (items: any[]) => {
    return items.reduce((acc: any, item: any) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});
  };

  const scrapStats = getStatusCounts(scrapRequests);
  const purchaseStats = getStatusCounts(purchaseOrders);

  const StatusItem = ({ label, count, total, color }: { label: string, count: number, total: number, color: string }) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium">{label}</span>
          <span className="text-[var(--text-muted)]">{count} طلب</span>
        </div>
        <div className="h-2 bg-[var(--bg-item)] rounded-full overflow-hidden">
          <div 
            className={`h-full ${color} transition-all duration-500`} 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-[var(--bg-card)] border border-[var(--border)] p-6 rounded-3xl space-y-4">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[var(--text-muted)] text-sm">{stat.label}</p>
              <h3 className="text-2xl font-black">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] p-8 rounded-[2.5rem] space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Recycle className="text-[var(--primary)]" size={20} />
              طلبات بيع الخردة
            </h3>
            <span className="text-sm text-[var(--text-muted)]">{scrapRequests.length} إجمالي الطلبات</span>
          </div>
          <div className="space-y-4">
            <StatusItem label="جديد" count={scrapStats['جديد'] || 0} total={scrapRequests.length} color="bg-blue-500" />
            <StatusItem label="جاري التفاوض" count={scrapStats['جاري التفاوض'] || 0} total={scrapRequests.length} color="bg-orange-500" />
            <StatusItem label="مقبول" count={scrapStats['مقبول'] || 0} total={scrapRequests.length} color="bg-green-500" />
            <StatusItem label="مكتمل" count={scrapStats['مكتمل'] || 0} total={scrapRequests.length} color="bg-[var(--primary)]" />
            <StatusItem label="مرفوض" count={scrapStats['مرفوض'] || 0} total={scrapRequests.length} color="bg-red-500" />
          </div>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border)] p-8 rounded-[2.5rem] space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <ShoppingCart className="text-[var(--primary)]" size={20} />
              طلبات الشراء
            </h3>
            <span className="text-sm text-[var(--text-muted)]">{purchaseOrders.length} إجمالي الطلبات</span>
          </div>
          <div className="space-y-4">
            <StatusItem label="جديد" count={purchaseStats['جديد'] || 0} total={purchaseOrders.length} color="bg-blue-500" />
            <StatusItem label="قيد التجهيز" count={purchaseStats['قيد التجهيز'] || 0} total={purchaseOrders.length} color="bg-yellow-500" />
            <StatusItem label="تم الشحن" count={purchaseStats['تم الشحن'] || 0} total={purchaseOrders.length} color="bg-purple-500" />
            <StatusItem label="مكتمل" count={purchaseStats['مكتمل'] || 0} total={purchaseOrders.length} color="bg-green-500" />
            <StatusItem label="ملغي" count={purchaseStats['ملغي'] || 0} total={purchaseOrders.length} color="bg-red-500" />
          </div>
        </div>
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border)] p-8 rounded-[2.5rem]">
        <h3 className="text-xl font-bold mb-6">آخر النشاطات</h3>
        <div className="space-y-4">
          {[...scrapRequests, ...purchaseOrders]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)
            .map((activity, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-[var(--bg-item)] rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${'scrapType' in activity ? 'bg-blue-500/10 text-blue-500' : 'bg-green-500/10 text-green-500'}`}>
                    {'scrapType' in activity ? <Recycle size={20} /> : <ShoppingCart size={20} />}
                  </div>
                  <div>
                    <p className="font-bold text-sm">
                      {'scrapType' in activity ? `طلب بيع خردة جديد (${activity.scrapType})` : `طلب شراء جديد #${activity.id}`}
                    </p>
                    <p className="text-[var(--text-muted)] text-xs">{activity.userName} • {new Date(activity.createdAt).toLocaleString('ar-EG')}</p>
                  </div>
                </div>
                <div className="text-left">
                  <span className="font-bold">{'askingPrice' in activity ? `${activity.askingPrice} ج.م` : `${activity.total} ج.م`}</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
