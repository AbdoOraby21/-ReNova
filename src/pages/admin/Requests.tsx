import React, { useState } from 'react';
import { Recycle, User, Phone, MapPin, Calendar, Trash2 } from 'lucide-react';
import { useRequestStore } from '../../stores/requestStore';
import { RequestStatus } from '../../types';

const Requests: React.FC = () => {
  const { scrapRequests, updateScrapStatus, deleteScrapRequest } = useRequestStore();
  const [activeTab, setActiveTab] = useState<RequestStatus | 'الكل'>('الكل');

  const tabs: (RequestStatus | 'الكل')[] = ['الكل', 'جديد', 'جاري التفاوض', 'مقبول', 'تم التواصل', 'مرفوض', 'مكتمل'];

  const filteredRequests = scrapRequests.filter(req => 
    activeTab === 'الكل' || req.status === activeTab
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'جديد': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'مقبول': case 'مكتمل': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'مرفوض': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredRequests.map((req) => (
          <div key={req.id} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row">
            <div className="w-full md:w-48 bg-[var(--bg-item)] relative shrink-0">
              <img src={req.image} alt="" className="w-full h-full object-cover" />
              <div className={`absolute top-4 right-4 px-3 py-1 rounded-lg text-[10px] font-black border backdrop-blur-md ${getStatusColor(req.status)}`}>
                {req.status}
              </div>
            </div>

            <div className="flex-grow p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-black">{req.scrapType}</h3>
                  <div className="flex items-center gap-2 text-[var(--text-muted)] text-xs mt-1">
                    <Calendar size={12} />
                    {new Date(req.createdAt).toLocaleDateString('ar-EG')} • {req.id}
                  </div>
                </div>
                <div className="text-left">
                  <span className="text-[var(--text-muted)] text-[10px] block">السعر المطلوب</span>
                  <span className="text-xl font-black text-[var(--primary-light)]">{req.askingPrice} ج.م</span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-[var(--bg-item)] p-4 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-[var(--primary)]">
                    <User size={14} />
                    <span className="text-xs font-bold uppercase tracking-wider">العميل</span>
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-sm">{req.userName}</p>
                    <p className="text-[var(--text-muted)] text-xs flex items-center gap-1">
                      <Phone size={10} />
                      {req.userPhone}
                    </p>
                  </div>
                </div>
                <div className="bg-[var(--bg-item)] p-4 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-[var(--primary)]">
                    <MapPin size={14} />
                    <span className="text-xs font-bold uppercase tracking-wider">الموقع</span>
                  </div>
                  <p className="font-bold text-sm line-clamp-2">{req.address}</p>
                </div>
              </div>

              <div className="bg-orange-500/5 border border-orange-500/10 p-4 rounded-2xl">
                <p className="text-xs text-orange-500 font-bold mb-1">وصف الطلب:</p>
                <p className="text-[var(--text-muted)] text-sm italic">"{req.description}"</p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold ml-2">تغيير الحالة:</span>
                  <select 
                    className="text-xs py-1.5 px-3"
                    value={req.status}
                    onChange={(e) => updateScrapStatus(req.id, e.target.value as RequestStatus)}
                  >
                    {tabs.filter(t => t !== 'الكل').map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <button 
                  onClick={() => deleteScrapRequest(req.id)}
                  className="p-2 text-[var(--danger)] hover:bg-[var(--danger)] hover:bg-opacity-10 rounded-xl transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <div className="text-center py-20 bg-[var(--bg-card)] rounded-[2.5rem] border border-[var(--border)]">
          <Recycle className="w-20 h-20 text-[var(--text-muted)] mx-auto opacity-20 mb-4" />
          <p className="text-[var(--text-muted)]">لا توجد طلبات في هذا القسم حالياً.</p>
        </div>
      )}
    </div>
  );
};

export default Requests;
