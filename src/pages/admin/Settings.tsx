import React, { useState } from 'react';
import { Plus, Trash2, RefreshCw, AlertTriangle } from 'lucide-react';
import { useProductStore } from '../../stores/productStore';
import { useRequestStore } from '../../stores/requestStore';
import { useToast } from '../../components/common/Toast';

const Settings: React.FC = () => {
  const { categories, addCategory, deleteCategory } = useProductStore();
  const { scrapTypes, addScrapType, deleteScrapType, clearDisplayData } = useRequestStore();
  const { showToast, ToastContainer } = useToast();
  
  const [newCat, setNewCat] = useState('');
  const [newType, setNewType] = useState('');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCat.trim()) {
      try {
        await addCategory(newCat.trim());
        setNewCat('');
        showToast('تمت إضافة القسم بنجاح');
      } catch (err) {
        showToast(err instanceof Error ? err.message : 'فشل إضافة القسم');
      }
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id);
      showToast('تم حذف القسم بنجاح');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'فشل حذف القسم');
    }
  };

  const handleAddScrapType = (e: React.FormEvent) => {
    e.preventDefault();
    if (newType.trim()) {
      addScrapType(newType.trim());
      setNewType('');
      showToast('تمت إضافة نوع الخردة بنجاح');
    }
  };

  const handleResetData = () => {
    // Products live in the real database and are never touched here.
    // Clears submitted display records (orders/requests). Never restores
    // fake demo records.
    clearDisplayData();
    setIsResetModalOpen(false);
    showToast('تم مسح بيانات العرض بنجاح');
  };

  return (
    <div className="space-y-8">
      <ToastContainer />
      
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] p-8 rounded-[2.5rem] shadow-xl space-y-6">
          <h3 className="text-xl font-bold border-b border-[var(--border)] pb-4">أقسام المنتجات</h3>
          
          <form onSubmit={handleAddCategory} className="flex gap-2">
            <input 
              type="text" 
              placeholder="اسم القسم الجديد..."
              className="flex-grow"
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
            />
            <button 
              type="submit"
              className="bg-[var(--primary)] hover:bg-[var(--primary-light)] text-white p-3 rounded-xl transition-all"
            >
              <Plus size={20} />
            </button>
          </form>

          <div className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-hide">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between p-4 bg-[var(--bg-item)] rounded-2xl group hover:border-[var(--primary)] border border-transparent transition-all">
                <span className="font-bold">{cat.name}</span>
                <button 
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="p-2 text-[var(--danger)] hover:bg-[var(--danger)] hover:bg-opacity-10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border)] p-8 rounded-[2.5rem] shadow-xl space-y-6">
          <h3 className="text-xl font-bold border-b border-[var(--border)] pb-4">أنواع الخردة</h3>
          
          <form onSubmit={handleAddScrapType} className="flex gap-2">
            <input 
              type="text" 
              placeholder="نوع الخردة الجديد..."
              className="flex-grow"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
            />
            <button 
              type="submit"
              className="bg-[var(--primary)] hover:bg-[var(--primary-light)] text-white p-3 rounded-xl transition-all"
            >
              <Plus size={20} />
            </button>
          </form>

          <div className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-hide">
            {scrapTypes.map((type) => (
              <div key={type.id} className="flex items-center justify-between p-4 bg-[var(--bg-item)] rounded-2xl group hover:border-[var(--primary)] border border-transparent transition-all">
                <span className="font-bold">{type.name}</span>
                <button 
                  onClick={() => deleteScrapType(type.id)}
                  className="p-2 text-[var(--danger)] hover:bg-[var(--danger)] hover:bg-opacity-10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-red-500/5 border border-red-500/20 p-8 rounded-[2.5rem] space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-right">
            <h3 className="text-xl font-bold text-[var(--danger)] flex items-center justify-center md:justify-start gap-2">
              <AlertTriangle size={24} />
              منطقة الخطر: مسح بيانات العرض
            </h3>
            <p className="text-[var(--text-muted)] text-sm">
              سيقوم هذا الإجراء بمسح بيانات العرض الحالية (الطلبات المُرسلة). منتجات المتجر محفوظة في قاعدة البيانات ولن تتأثر.
            </p>
          </div>
          <button 
            onClick={() => setIsResetModalOpen(true)}
            className="bg-[var(--danger)] hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 transition-all transform active:scale-95 shadow-xl shadow-red-900/20"
          >
            <RefreshCw size={20} />
            مسح بيانات العرض
          </button>
        </div>
      </div>

      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsResetModalOpen(false)} />
          <div className="relative bg-[var(--bg-card)] border border-[var(--border)] w-full max-w-md rounded-[2.5rem] p-10 text-center space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle size={40} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black">هل أنت متأكد؟</h2>
              <p className="text-[var(--text-muted)]">
                سيتم مسح بيانات العرض الحالية (الطلبات المُرسلة). منتجات المتجر في قاعدة البيانات لن تتأثر ولا يمكن التراجع عن هذا الإجراء.
              </p>
            </div>
            <div className="flex flex-col gap-3 pt-4">
              <button 
                onClick={handleResetData}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-black transition-all"
              >
                نعم، قم بالمسح
              </button>
              <button 
                onClick={() => setIsResetModalOpen(false)}
                className="w-full bg-[var(--bg-item)] hover:bg-[var(--border)] py-4 rounded-2xl font-bold transition-all"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
