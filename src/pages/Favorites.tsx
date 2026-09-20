import React from 'react';
import { Heart, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useProductStore } from '../stores/productStore';
import { useFavoritesStore } from '../stores/favoritesStore';
import { useCartStore } from '../stores/cartStore';
import { useToast } from '../components/common/Toast';
import { Link } from 'react-router-dom';

const Favorites: React.FC = () => {
  const { products } = useProductStore();
  const { favoriteIds, toggleFavorite } = useFavoritesStore();
  const { addItem } = useCartStore();
  const { showToast, ToastContainer } = useToast();

  const favoriteProducts = products.filter(p => favoriteIds.includes(p.id));

  const handleAddToCart = (product: any) => {
    addItem(product);
    showToast('تمت إضافة المنتج إلى السلة بنجاح');
  };

  return (
    <div className="space-y-8">
      <ToastContainer />
      
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black flex items-center gap-3">
          <Heart className="text-[var(--danger)]" fill="currentColor" />
          المنتجات المفضلة
        </h1>
        <span className="bg-[var(--bg-item)] px-4 py-2 rounded-xl text-sm font-bold border border-[var(--border)]">
          {favoriteProducts.length} منتج
        </span>
      </div>

      {favoriteProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favoriteProducts.map((product) => (
            <div 
              key={product.id}
              className="group bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl overflow-hidden hover:border-[var(--primary)] transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-square overflow-hidden bg-[var(--bg-item)]">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 z-10">
                  <button 
                    onClick={() => toggleFavorite(product.id)}
                    className="p-2.5 rounded-xl backdrop-blur-md bg-black/30 border border-white/10 text-[var(--danger)]"
                  >
                    <Heart size={20} strokeWidth={2} fill="currentColor" />
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-3 flex-grow flex flex-col">
                <h3 className="font-bold text-lg leading-tight line-clamp-1">{product.name}</h3>
                <div className="pt-2 flex items-center justify-between mt-auto">
                  <span className="text-[var(--primary-light)] font-black text-xl">{product.price} ج.م</span>
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="p-3 bg-[var(--bg-item)] hover:bg-[var(--primary)] text-[var(--text-main)] hover:text-white rounded-2xl transition-all"
                  >
                    <ShoppingCart size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-[2.5rem]">
          <div className="w-24 h-24 bg-[var(--bg-item)] rounded-full flex items-center justify-center text-[var(--text-muted)] opacity-50">
            <Heart size={48} strokeWidth={1} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">لا توجد منتجات مفضلة</h2>
            <p className="text-[var(--text-muted)] max-w-md mx-auto px-4">
              لم تقم بإضافة أي منتجات إلى قائمة المفضلة لديك حتى الآن.
            </p>
          </div>
          <Link 
            to="/"
            className="bg-[var(--primary)] hover:bg-[var(--primary-light)] text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-green-900/20 flex items-center gap-2"
          >
            تصفح المنتجات
            <ArrowLeft size={20} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default Favorites;
