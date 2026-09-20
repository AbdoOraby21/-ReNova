import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, X } from 'lucide-react';
import { useProductStore } from '../../stores/productStore';
import { Product } from '../../types';

const Products: React.FC = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useProductStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState('');

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
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      price: Number(formData.price),
    };

    if (editingProduct) {
      updateProduct({ ...editingProduct, ...data });
    } else {
      addProduct(data);
    }
    setIsModalOpen(false);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
          <input 
            type="text" 
            placeholder="ابحث عن المنتجات..."
            className="w-full pr-12"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-[var(--primary)] hover:bg-[var(--primary-light)] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-green-900/20"
        >
          <Plus size={20} />
          إضافة منتج جديد
        </button>
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[2.5rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="px-6 py-4 text-sm font-bold">المنتج</th>
                <th className="px-6 py-4 text-sm font-bold">القسم</th>
                <th className="px-6 py-4 text-sm font-bold">السعر</th>
                <th className="px-6 py-4 text-sm font-bold text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-[var(--bg-item)] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--bg-item)]">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold">{product.name}</span>
                        <span className="text-[var(--text-muted)] text-[10px] line-clamp-1">{product.description}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-[var(--bg-item)] text-[var(--text-muted)] rounded-lg text-xs font-medium">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-[var(--primary-light)]">{product.price} ج.م</span>
                  </td>
                  <td className="px-6 py-4 text-left">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openModal(product)}
                        className="p-2 text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary)] hover:bg-opacity-10 rounded-lg transition-all"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => deleteProduct(product.id)}
                        className="p-2 text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger)] hover:bg-opacity-10 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-[var(--bg-card)] border border-[var(--border)] w-full max-w-2xl rounded-[2.5rem] p-8 md:p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black">{editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-[var(--bg-item)] rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold mr-1">اسم المنتج</label>
                  <input 
                    type="text" 
                    required
                    className="w-full"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold mr-1">القسم</label>
                  <select 
                    required
                    className="w-full"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="">اختر القسم...</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold mr-1">السعر (ج.م)</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    className="w-full"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold mr-1">رابط الصورة</label>
                  <input 
                    type="url" 
                    required
                    placeholder="https://..."
                    className="w-full"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold mr-1">وصف المنتج</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="submit"
                  className="flex-grow bg-[var(--primary)] hover:bg-[var(--primary-light)] text-white font-black py-4 rounded-2xl shadow-xl shadow-green-900/20 transition-all"
                >
                  {editingProduct ? 'حفظ التعديلات' : 'إضافة المنتج'}
                </button>
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-4 bg-[var(--bg-item)] hover:bg-[var(--border)] font-bold rounded-2xl transition-all"
                >
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
