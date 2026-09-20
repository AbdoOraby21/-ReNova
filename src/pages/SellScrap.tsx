import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Recycle, Image as ImageIcon, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import { useRequestStore } from '../stores/requestStore';
import { useAuthStore } from '../stores/authStore';
import { useToast } from '../components/common/Toast';

const SellScrap: React.FC = () => {
  const { scrapTypes, addScrapRequest } = useRequestStore();
  const { user } = useAuthStore();
  const { showToast, ToastContainer } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    scrapType: '',
    askingPrice: '',
    description: '',
    address: user?.phone ? 'العنوان الأساسي' : '',
    newAddress: '',
    imageUrl: '',
  });

  const [submitted, setSubmitted] = useState<{ id: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/sell-scrap' } } });
      return;
    }

    const request = {
      userId: user.id,
      userName: user.name,
      userPhone: user.phone || '0000000000',
      scrapType: formData.scrapType,
      askingPrice: Number(formData.askingPrice),
      description: formData.description,
      address: formData.address === 'إضافة عنوان جديد' ? formData.newAddress : 'العنوان المسجل',
      image: formData.imageUrl || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=1000&auto=format&fit=crop',
    };

    addScrapRequest(request);
    const requestId = `RN-SCRAP-${1000 + Math.floor(Math.random() * 9000)}`;
    setSubmitted({ id: requestId });
    showToast('تم إرسال طلب بيع الخردة بنجاح');
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[2.5rem] p-12 text-center space-y-8 shadow-2xl">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-[var(--primary)] bg-opacity-10 text-[var(--primary)] rounded-full flex items-center justify-center">
              <CheckCircle size={48} strokeWidth={1.5} />
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-black">تم إرسال طلب بيع الخردة بنجاح</h2>
            <p className="text-[var(--text-muted)] text-lg">سيتواصل معك فريق ReNova قريباً لمعاينة الخردة وإتمام عملية الشراء.</p>
          </div>
          <div className="bg-[var(--bg-item)] p-6 rounded-2xl inline-block">
            <span className="text-[var(--text-muted)] text-sm block mb-1">رقم الطلب</span>
            <span className="text-2xl font-black text-[var(--primary-light)] tracking-wider">{submitted.id}</span>
          </div>
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/my-orders')}
              className="px-8 py-4 bg-[var(--primary)] hover:bg-[var(--primary-light)] text-white rounded-2xl font-bold transition-all shadow-xl shadow-green-900/20"
            >
              مشاهدة طلباتي
            </button>
            <button 
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-[var(--bg-item)] hover:bg-[var(--border)] text-[var(--text-main)] rounded-2xl font-bold transition-all"
            >
              العودة للرئيسية
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <ToastContainer />
      
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-20 h-20 bg-[#0f9d62] rounded-3xl flex items-center justify-center shadow-lg shadow-green-900/20">
          <Recycle size={40} className="text-white animate-spin-slow" strokeWidth={1.9} style={{ transformOrigin: 'center' }} />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-black">طلب بيع خردة</h1>
          <p className="text-[var(--text-muted)]">أرسل تفاصيل الخردة التي ترغب في بيعها وسيتواصل معك فريق ReNova.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[2.5rem] p-8 md:p-12 shadow-2xl space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-sm font-bold mr-1">نوع الخردة</label>
            <select 
              required
              className="w-full"
              value={formData.scrapType}
              onChange={(e) => setFormData({ ...formData, scrapType: e.target.value })}
            >
              <option value="">اختر نوع الخردة...</option>
              {scrapTypes.map(type => (
                <option key={type.id} value={type.name}>{type.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold mr-1">السعر المطلوب (ج.م)</label>
            <input 
              type="number" 
              required
              min="1"
              placeholder="0.00"
              className="w-full"
              value={formData.askingPrice}
              onChange={(e) => setFormData({ ...formData, askingPrice: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-bold mr-1">وصف الطلب</label>
          <textarea 
            required
            rows={4}
            placeholder="أخبرنا بالمزيد عن الخردة (الحالة، الكمية التقريبية، إلخ...)"
            className="w-full resize-none"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="space-y-4">
          <label className="text-sm font-bold mr-1">عنوان الاستلام</label>
          <div className="grid sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, address: 'العنوان الأساسي' })}
              className={`p-4 rounded-2xl border-2 text-right transition-all flex flex-col gap-1 ${
                formData.address === 'العنوان الأساسي' 
                ? 'border-[var(--primary)] bg-[var(--primary)] bg-opacity-5' 
                : 'border-[var(--border)] hover:border-[var(--text-muted)]'
              }`}
            >
              <span className="font-bold">العنوان الأساسي</span>
              <span className="text-xs text-[var(--text-muted)]">استخدام العنوان المسجل في حسابك</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, address: 'إضافة عنوان جديد' })}
              className={`p-4 rounded-2xl border-2 text-right transition-all flex flex-col gap-1 ${
                formData.address === 'إضافة عنوان جديد' 
                ? 'border-[var(--primary)] bg-[var(--primary)] bg-opacity-5' 
                : 'border-[var(--border)] hover:border-[var(--text-muted)]'
              }`}
            >
              <span className="font-bold">عنوان جديد</span>
              <span className="text-xs text-[var(--text-muted)]">إضافة عنوان استلام مختلف</span>
            </button>
          </div>

          {formData.address === 'إضافة عنوان جديد' && (
            <div className="relative animate-in fade-in slide-in-from-top-2 duration-300">
              <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
              <input 
                type="text" 
                required
                placeholder="العنوان بالتفصيل..."
                className="w-full pr-12"
                value={formData.newAddress}
                onChange={(e) => setFormData({ ...formData, newAddress: e.target.value })}
              />
            </div>
          )}
        </div>

        <div className="space-y-3">
          <label className="text-sm font-bold mr-1">صور الخردة (رابط الصورة)</label>
          <div className="relative">
            <ImageIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
            <input 
              type="url" 
              placeholder="https://..."
              className="w-full pr-12"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            />
          </div>
          <p className="text-[var(--text-muted)] text-[10px]">يمكنك إضافة رابط لصورة الخردة للمساعدة في التقييم السريع.</p>
        </div>

        <button 
          type="submit"
          className="w-full bg-[var(--primary)] hover:bg-[var(--primary-light)] text-white font-black py-5 rounded-[2rem] flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1 shadow-2xl shadow-green-900/20 active:scale-95"
        >
          إرسال الطلب
          <ArrowRight size={24} />
        </button>
      </form>
    </div>
  );
};

export default SellScrap;
