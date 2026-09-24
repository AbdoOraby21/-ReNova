import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useProductStore } from '../../stores/productStore';
import { useAuthStore } from '../../stores/authStore';
import { Product } from '../../types';
import SafeImage, { FALLBACK_IMAGE } from '../../components/common/SafeImage';
import { uploadProductImage, validateProductImage } from '../../lib/productImages';
import { isSupabaseConfigured } from '../../lib/supabase';

const CONDITION_OPTIONS = ['جديد', 'مُجدد - ممتاز', 'مستعمل - جيد', 'للقطع والاستعادة'];

const Products: React.FC = () => {
  const { products, categories, loading, error, fetchProducts, addProduct, updateProduct, deleteProduct, clearError } = useProductStore();
  const { supabaseSessionActive } = useAuthStore();
  const canWrite = isSupabaseConfigured && supabaseSessionActive;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageMode, setImageMode] = useState<'url' | 'file'>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState('');
  const [actionError, setActionError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    condition: CONDITION_OPTIONS[1],
    image: '',
  });

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Revoke object URLs to avoid leaking browser memory
  useEffect(() => {
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview);
    };
  }, [filePreview]);

  const resetFormState = () => {
    setSelectedFile(null);
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFilePreview('');
    setFormError('');
    setUploading(false);
  };

  const openModal = (product: Product | null = null) => {
    resetFormState();
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category: product.category,
        condition: product.condition || CONDITION_OPTIONS[1],
        image: product.image === FALLBACK_IMAGE ? '' : product.image,
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: '', category: '', condition: CONDITION_OPTIONS[1], image: '' });
    }
    setImageMode(product && product.image && !product.image.startsWith('blob:') ? 'url' : 'file');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (uploading) return;
    setIsModalOpen(false);
    resetFormState();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validationError = validateProductImage(file);
    if (validationError) {
      setFormError(validationError);
      return;
    }
    setFormError('');
    setSelectedFile(file);
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFilePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setActionError('');
    if (!canWrite) {
      setFormError('لا توجد جلسة Supabase — سجّل الدخول مجددًا بعد إنشاء مستخدم Supabase للمشرف');
      return;
    }
    const price = Number(formData.price);
    if (!formData.name.trim() || !formData.category || !formData.description.trim() || !price || price < 1) {
      setFormError('يرجى إكمال جميع الحقول المطلوبة بسعر صحيح');
      return;
    }

    setUploading(true);
    try {
      let imageUrl = formData.image.trim();
      if (imageMode === 'file') {
        if (selectedFile) {
          imageUrl = await uploadProductImage(selectedFile);
        } else if (editingProduct) {
          imageUrl = editingProduct.image === FALLBACK_IMAGE ? '' : editingProduct.image;
        }
      }
      const data = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price,
        category: formData.category,
        condition: formData.condition,
        image: imageUrl || FALLBACK_IMAGE,
      };
      if (editingProduct) await updateProduct(editingProduct.id, data);
      else await addProduct(data);
      setIsModalOpen(false);
      resetFormState();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'حدث خطأ أثناء حفظ المنتج');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setActionError('');
    try {
      await deleteProduct(id);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'فشل حذف المنتج');
    }
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
            disabled={!canWrite}
            className="hidden md:flex items-center gap-2 bg-[#0f9d62] hover:bg-[#0d8a56] disabled:opacity-40 text-white px-5 py-2.5 rounded-xl text-xs font-black transition-colors shadow-md"
          >
            <Plus size={16} /> إضافة منتج
          </button>
        </div>
        {/* Mobile Add Button */}
        <button
          onClick={() => openModal()}
          disabled={!canWrite}
          className="md:hidden w-fit flex items-center gap-2 bg-[#0f9d62] disabled:opacity-40 text-white px-4 py-2 rounded-xl text-xs font-bold"
        >
          <Plus size={14} /> إضافة منتج
        </button>
      </div>

      {isSupabaseConfigured && !supabaseSessionActive && (
        <div className="bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-2xl px-5 py-4 text-xs text-[#fcd34d] leading-relaxed">
          وضع القراءة فقط: لا توجد جلسة Supabase. أنشئ مستخدمًا في Supabase Authentication بنفس بريد المشرف وكلمة المرور ثم سجّل الدخول مجددًا لتفعيل الإضافة والتعديل والحذف ورفع الصور.
        </div>
      )}

      {error && (
        <div className="bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-2xl px-5 py-4 text-xs text-[#fca5a5] leading-relaxed flex items-center justify-between gap-3">
          <span>{error}</span>
          <button onClick={() => { clearError(); fetchProducts(); }} className="shrink-0 bg-[#ef4444]/20 hover:bg-[#ef4444]/30 px-4 py-2 rounded-xl font-bold text-white transition-colors">
            إعادة المحاولة
          </button>
        </div>
      )}

      {actionError && (
        <div className="bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-2xl px-5 py-4 text-xs text-[#fca5a5] leading-relaxed">
          {actionError}
        </div>
      )}

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
                      <button onClick={() => openModal(product)} disabled={!canWrite} className="p-1.5 text-[#3b82f6] hover:bg-[#3b82f6]/10 disabled:opacity-30 rounded-lg">
                        <Edit size={14} />
                      </button>
                      <button onClick={() => handleDelete(product.id)} disabled={!canWrite} className="p-1.5 text-[#ef4444] hover:bg-[#ef4444]/10 disabled:opacity-30 rounded-lg">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && filteredProducts.length === 0 && (
            <div className="py-16 flex flex-col items-center gap-3 text-white/40 text-sm">
              <Loader2 size={24} className="animate-spin text-[#0f9d62]" />
              جارٍ تحميل المنتجات من قاعدة البيانات...
            </div>
          )}
          {!loading && filteredProducts.length === 0 && !error && (
            <div className="py-16 text-center text-white/40 text-sm">لا توجد منتجات</div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative w-full max-w-3xl bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#2a2a2a]">
              <h2 className="text-sm font-black text-white">{editingProduct ? 'تعديل المنتج' : 'منتج جديد'}</h2>
              <button onClick={closeModal} className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center text-white/60 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-hide">
              {formError && (
                <div className="bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-xl px-4 py-3 text-xs text-[#fca5a5] leading-relaxed">
                  {formError}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-white/70">اسم المنتج</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#0f9d62]" placeholder="مثال: لابتوب مُجدد Core i5" />
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
                  <label className="text-[11px] font-bold text-white/70">الحالة</label>
                  <select value={formData.condition} onChange={e => setFormData({ ...formData, condition: e.target.value })} className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#0f9d62]">
                    {CONDITION_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-white/70">صورة المنتج</label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setImageMode('file')} className={`flex-1 py-2.5 rounded-xl text-xs font-bold border ${imageMode === 'file' ? 'bg-[#0f9d62] text-white border-[#0f9d62]' : 'bg-[#141414] text-white/60 border-[#2a2a2a]'}`}>رفع من الجهاز</button>
                  <button type="button" onClick={() => setImageMode('url')} className={`flex-1 py-2.5 rounded-xl text-xs font-bold border ${imageMode === 'url' ? 'bg-[#0f9d62] text-white border-[#0f9d62]' : 'bg-[#141414] text-white/60 border-[#2a2a2a]'}`}>رابط (URL)</button>
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
                    <span className="text-xs text-white/70">اختر صورة (JPG أو PNG أو WEBP — بحد أقصى 5MB)</span>
                    <input type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" onChange={handleFileChange} className="hidden" />
                    <span className="mr-auto text-[11px] bg-[#0f9d62] text-white px-3 py-1 rounded-lg font-bold">Choose File</span>
                    <span className="text-[11px] text-white/40">{selectedFile ? selectedFile.name : (editingProduct ? 'الصورة الحالية محفوظة' : 'No file chosen')}</span>
                  </label>
                  {filePreview ? (
                    <div className="w-20 h-20 rounded-xl overflow-hidden border border-[#2a2a2a]"><img src={filePreview} alt="preview" className="w-full h-full object-cover" /></div>
                  ) : imageMode === 'file' && editingProduct && editingProduct.image !== FALLBACK_IMAGE ? (
                    <div className="w-20 h-20 rounded-xl overflow-hidden border border-[#2a2a2a]"><SafeImage src={editingProduct.image} alt="preview" className="w-full h-full object-cover" /></div>
                  ) : null}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-white/70">الوصف</label>
                <textarea required rows={4} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#0f9d62] resize-none" placeholder="وصف المنتج..." />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={uploading} className="bg-[#0f9d62] hover:bg-[#0d8a56] disabled:opacity-60 text-white px-6 py-3 rounded-xl text-xs font-black flex items-center gap-2">
                  {uploading ? <Loader2 size={14} className="animate-spin" /> : <ImageIcon size={14} />}
                  {uploading ? 'جارٍ الرفع والحفظ...' : 'حفظ التغييرات'}
                </button>
                <button type="button" onClick={closeModal} disabled={uploading} className="px-6 py-3 rounded-xl text-xs font-bold text-white/60 hover:text-white hover:bg-white/5 disabled:opacity-40">
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
