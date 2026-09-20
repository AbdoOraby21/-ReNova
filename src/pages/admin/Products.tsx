import React, { useState } from 'react';
import { Plus, Edit, Trash2, X, Upload, Image as ImageIcon } from 'lucide-react';
import { useProductStore } from '../../stores/productStore';
import { Product } from '../../types';
import SafeImage, { FALLBACK_IMAGE } from '../../components/common/SafeImage';

const Products: React.FC = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useProductStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageMode, setImageMode] = useState<'url' | 'file'>('url');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
  });

  const openModal = (product: Product | null = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category: product.category,
        image: product.image,
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: '', category: '', image: '' });
    }
    setImageMode('url');
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData({ ...formData, image: url });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...formData, price: Number(formData.price), image: formData.image || FALLBACK_IMAGE };
    if (editingProduct) updateProduct({ ...editingProduct, ...data });
    else addProduct(data);
    setIsModalOpen(false);
  };

  const filteredProducts = products;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-white">إدارة المنتجات</h1>
            <p className="text-xs text-white/50 mt-1">إدارة منتجات المتجر، إضافة منتجات جديدة أو تعديل الحالية</p>
          </div>
          <button
            onClick={() => openModal()}
            className="hidden md:flex items-center gap-2 bg-[#0f9d62] hover:bg-[#0d8a56] text-white px-5 py-2.5 rounded-xl text-xs font-black transition-colors shadow-md"
          >
            <Plus size={16} /> إضافة منتج
          </button>
        </div>
        {/* Mobile Add Button */}
        <button
          onClick={() => openModal()}
          className="md:hidden w-fit flex items-center gap-2 bg-[#0f9d62] text-white px-4 py-2 rounded-xl text-xs font-bold"
        >
          <Plus size={14} /> إضافة منتج
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-[#141414] border-b border-[#2a2a2a] text-white/50 text-[11px]">
                <th className="px-4 py-3 font-bold whitespace-nowrap">اسم المنتج</th>
                <th className="px-4 py-3 font-bold whitespace-nowrap text-center">القسم</th>
                <th className="px-4 py-3 font-bold whitespace-nowrap text-center">السعر</th>
                <th className="px-4 py-3 font-bold whitespace-nowrap text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a2a]">
              {filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-[#1e1e1e] transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 justify-end">
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-white line-clamp-1">{product.name}</span>
                        <span className="text-[11px] text-white/40 hidden md:block">{product.category}</span>
                      </div>
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#2a2a2a] bg-[#141414] shrink-0">
                        <SafeImage src={product.image} alt={product.name} fallback={FALLBACK_IMAGE} className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-xs text-white/70">{product.category}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-xs font-bold text-[#22c55e]">{product.price} ج.م</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => openModal(product)} className="p-1.5 text-[#3b82f6] hover:bg-[#3b82f6]/10 rounded-lg">
                        <Edit size={14} />
                      </button>
                      <button onClick={() => deleteProduct(product.id)} className="p-1.5 text-[#ef4444] hover:bg-[#ef4444]/10 rounded-lg">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
            <div className="py-16 text-center text-white/40 text-sm">لا توجد منتجات</div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-3xl bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#2a2a2a]">
              <h2 className="text-sm font-black text-white">{editingProduct ? 'تعديل المنتج' : 'منتج جديد'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center text-white/60 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-hide">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-white/70">اسم المنتج</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#0f9d62]" placeholder="مثال: طاولة خشبية" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-white/70">القسم</label>
                  <select required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#0f9d62]">
                    <option value="">-- القسم --</option>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-white/70">السعر (ج.م)</label>
                  <input type="number" required min="1" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#0f9d62]" placeholder="0" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-white/70">صورة المنتج</label>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setImageMode('file')} className={`flex-1 py-2.5 rounded-xl text-xs font-bold border ${imageMode === 'file' ? 'bg-[#0f9d62] text-white border-[#0f9d62]' : 'bg-[#141414] text-white/60 border-[#2a2a2a]'}`}>رفع من الجهاز</button>
                    <button type="button" onClick={() => setImageMode('url')} className={`flex-1 py-2.5 rounded-xl text-xs font-bold border ${imageMode === 'url' ? 'bg-[#0f9d62] text-white border-[#0f9d62]' : 'bg-[#141414] text-white/60 border-[#2a2a2a]'}`}>رابط (URL)</button>
                  </div>
                </div>
              </div>

              {imageMode === 'url' ? (
                <div className="space-y-1.5">
                  <input type="url" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} placeholder="https://..." className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#0f9d62]" />
                  {formData.image && <div className="w-20 h-20 rounded-xl overflow-hidden border border-[#2a2a2a] mt-2"><SafeImage src={formData.image} alt="preview" className="w-full h-full object-cover" /></div>}
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="flex items-center gap-2 bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 cursor-pointer hover:border-[#0f9d62]/50">
                    <Upload size={14} className="text-[#0f9d62]" />
                    <span className="text-xs text-white/70">اختر صورة</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    <span className="mr-auto text-[11px] bg-[#0f9d62] text-white px-3 py-1 rounded-lg font-bold">Choose File</span>
                    <span className="text-[11px] text-white/40">{formData.image ? 'تم الاختيار' : 'No file chosen'}</span>
                  </label>
                  {formData.image && <div className="w-20 h-20 rounded-xl overflow-hidden border border-[#2a2a2a]"><SafeImage src={formData.image} alt="preview" className="w-full h-full object-cover" /></div>}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-white/70">الوصف</label>
                <textarea required rows={4} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#0f9d62] resize-none" placeholder="وصف المنتج..." />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="bg-[#0f9d62] hover:bg-[#0d8a56] text-white px-6 py-3 rounded-xl text-xs font-black flex items-center gap-2">
                  <ImageIcon size={14} /> حفظ التغييرات
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl text-xs font-bold text-white/60 hover:text-white hover:bg-white/5">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
