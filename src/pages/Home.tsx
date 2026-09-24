import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowLeft, Heart, ShoppingCart, Sparkles, Recycle, Leaf, ShieldCheck } from 'lucide-react';
import { useProductStore } from '../stores/productStore';
import { useFavoritesStore } from '../stores/favoritesStore';
import { useCartStore } from '../stores/cartStore';
import { useToast } from '../components/common/Toast';
import SafeImage, { FALLBACK_IMAGE } from '../components/common/SafeImage';
const logoImg = '/logo.jpeg';

const Home: React.FC = () => {
  const { products, categories, selectedCategory, setSelectedCategory, fetchProducts, loading, error, clearError } = useProductStore();
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const { addItem } = useCartStore();
  const { showToast, ToastContainer } = useToast();
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'الكل' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product: any) => {
    addItem(product);
    showToast('تمت إضافة المنتج إلى السلة بنجاح');
  };

  return (
    <div className="space-y-10 md:space-y-14">
      <ToastContainer />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-[#052e08] min-h-[520px] flex items-center border border-white/10">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-l from-[#0a3d0f] via-[#052e08] to-[#021a04]" />
          <div className="absolute inset-0 opacity-[0.06]" style={{backgroundImage:`url("https://www.transparenttextures.com/patterns/carbon-fibre.png")`}} />
          <div className="absolute -top-32 -left-32 w-[420px] h-[420px] bg-[#16a34a]/20 rounded-full blur-[80px]" />
          <div className="absolute -bottom-24 -right-24 w-[520px] h-[520px] bg-[#22c55e]/12 rounded-full blur-[90px]" />
        </div>

        <div className="container mx-auto px-6 md:px-10 lg:px-14 py-10 md:py-14 grid lg:grid-cols-[1.05fr_1fr] items-center gap-8 md:gap-12 relative z-10">
          {/* Logo / Visual */}
          <div className="flex justify-center lg:justify-start order-2 lg:order-1">
            <div className="relative group">
              <div className="absolute -inset-4 bg-white/10 rounded-[2rem] blur-2xl group-hover:bg-white/15 transition-colors" />
              <div className="relative bg-[#052e08] rounded-[1.75rem] overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.5)] ring-1 ring-white/15 p-3 md:p-4 max-w-[360px] w-full">
                <div className="rounded-2xl overflow-hidden bg-[#052e08]">
                  <img src={logoImg} alt="ReNova Logo - E-Waste Recycling for a Greener Tomorrow" className="w-full h-auto object-contain" loading="eager" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center lg:text-right space-y-6 md:space-y-7 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 text-white/90 px-4 py-2 rounded-full text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
              <Leaf size={14} className="text-[#22c55e]" />
              منصة إعادة التدوير الذكية
            </div>

            <h1 className="text-[2.1rem] sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black leading-[1.15] text-white">
              نحو بيئة أنظف و <br />
              <span className="text-[#22c55e]">مستقبل أفضل</span>
            </h1>

            <p className="text-[15px] md:text-lg text-white/70 max-w-xl mx-auto lg:mr-0 lg:ml-auto leading-relaxed">
              منصة ذكية لبيع وشراء الخردة والمنتجات المعاد تدويرها بطريقة سهلة ومستدامة. انضم إلينا اليوم لنبني غداً أجمل.
            </p>

            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <Link 
                to="/sell-scrap"
                className="bg-[#16a34a] hover:bg-[#15803d] text-white px-7 md:px-8 py-3.5 md:py-4 rounded-2xl font-bold text-[15px] flex items-center gap-2.5 transition-all duration-200 shadow-[0_12px_32px_rgba(22,163,74,0.35)] hover:shadow-[0_16px_40px_rgba(22,163,74,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
              >
                ساهم في التدوير
                <ArrowLeft size={20} />
              </Link>
              <Link 
                to="/#products"
                onClick={(e)=>{e.preventDefault(); document.getElementById('products')?.scrollIntoView({behavior:'smooth'})}}
                className="bg-white/10 hover:bg-white text-white hover:text-[#052e08] border border-white/15 px-7 md:px-8 py-3.5 md:py-4 rounded-2xl font-bold text-[15px] flex items-center gap-2 transition-all duration-200 backdrop-blur-md"
              >
                <Sparkles size={18} />
                تصفح المنتجات
              </Link>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-6 pt-2 text-white/60 text-xs">
              <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-[#22c55e]" /> دفع آمن</span>
              <span className="flex items-center gap-1.5"><Recycle size={14} className="text-[#22c55e]" /> شحن مستدام</span>
              <span className="flex items-center gap-1.5"><Leaf size={14} className="text-[#22c55e]" /> صديق للبيئة</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories & Search */}
      <section id="products" className="space-y-6 md:space-y-8 scroll-mt-24">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 md:gap-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto scrollbar-hide -mx-1 px-1">
            <button
              onClick={() => setSelectedCategory('الكل')}
              className={`px-5 md:px-6 py-2.5 rounded-full text-[13px] font-bold whitespace-nowrap transition-all duration-200 border ${
                selectedCategory === 'الكل' 
                ? 'bg-[#0a3d0f] text-white border-[#0a3d0f] shadow-md shadow-green-900/15' 
                : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border)] hover:border-[#0a3d0f]/20 hover:text-[var(--text-main)]'
              }`}
            >
              الكل
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-5 md:px-6 py-2.5 rounded-full text-[13px] font-bold whitespace-nowrap transition-all duration-200 border ${
                  selectedCategory === cat.name 
                  ? 'bg-[#0a3d0f] text-white border-[#0a3d0f] shadow-md shadow-green-900/15' 
                  : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border)] hover:border-[#0a3d0f]/20 hover:text-[var(--text-main)]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-[360px] shrink-0">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
            <input 
              type="text" 
              placeholder="ابحث عن منتجات..."
              className="w-full pr-11 pl-4 py-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] focus:border-[#0a3d0f]/30 focus:bg-[var(--bg-card)] shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[1.5rem] md:rounded-[1.75rem] overflow-hidden animate-pulse">
                <div className="aspect-square bg-[var(--bg-item)]" />
                <div className="p-4 md:p-5 space-y-2">
                  <div className="h-4 bg-[var(--bg-item)] rounded-lg w-3/4" />
                  <div className="h-3 bg-[var(--bg-item)] rounded-lg w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 md:py-20 text-center space-y-4 bg-[var(--bg-card)] border border-dashed border-[var(--border)] rounded-[1.75rem]">
            <div className="space-y-1 px-4">
              <h3 className="text-lg font-bold">تعذر تحميل المنتجات</h3>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed">{error}</p>
            </div>
            <button
              onClick={() => { clearError(); fetchProducts(); }}
              className="bg-[#0a3d0f] hover:bg-[#052e08] text-white px-6 py-3 rounded-2xl font-bold text-sm transition-colors"
            >
              إعادة المحاولة
            </button>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <div 
                key={product.id}
                className="group bg-[var(--bg-card)] border border-[var(--border)] rounded-[1.5rem] md:rounded-[1.75rem] overflow-hidden hover:border-[#0a3d0f]/20 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col hover:-translate-y-1"
              >
                <div className="relative aspect-square overflow-hidden bg-[var(--bg-item)]">
                  <SafeImage 
                    src={product.image} 
                    alt={product.name}
                    fallback={FALLBACK_IMAGE}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
                    <button 
                      onClick={() => toggleFavorite(product.id)}
                      aria-label="Toggle favorite"
                      className={`p-2 md:p-2.5 rounded-xl backdrop-blur-md bg-black/25 border border-white/10 shadow-md transition-all hover:scale-105 active:scale-95 ${
                        isFavorite(product.id) ? 'text-[#ef4444]' : 'text-white hover:text-[#ef4444]'
                      }`}
                    >
                      <Heart size={18} strokeWidth={2} fill={isFavorite(product.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="px-2.5 py-1 rounded-full bg-[#0a3d0f] text-white text-[10px] font-bold tracking-wide shadow-md">
                      {product.category}
                    </span>
                  </div>
                </div>

                <div className="p-4 md:p-5 space-y-2.5 flex-grow flex flex-col">
                  <div className="flex-grow">
                    <h3 className="font-bold text-[15px] md:text-[16px] leading-tight group-hover:text-[#0a3d0f] transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-[var(--text-muted)] text-xs line-clamp-2 mt-1 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-3 flex items-center justify-between mt-auto border-t border-[var(--border)]/60">
                    <div className="flex flex-col">
                      <span className="text-[var(--text-muted)] text-[10px] font-medium">السعر</span>
                      <span className="text-[#15803d] font-black text-lg leading-none mt-0.5">
                        {product.price} <span className="text-xs font-bold">ج.م</span>
                      </span>
                    </div>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      aria-label="Add to cart"
                      className="p-2.5 md:p-3 bg-[var(--bg-item)] hover:bg-[#0a3d0f] text-[var(--text-main)] hover:text-white rounded-xl md:rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 border border-[var(--border)] hover:border-[#0a3d0f]"
                    >
                      <ShoppingCart size={18} strokeWidth={2} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 md:py-20 text-center space-y-4 bg-[var(--bg-card)] border border-dashed border-[var(--border)] rounded-[1.75rem]">
            <div className="w-16 h-16 bg-[var(--bg-item)] rounded-2xl flex items-center justify-center text-[var(--text-muted)]">
              <Search size={28} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold">لا توجد منتجات</h3>
              <p className="text-[var(--text-muted)] text-sm">
                {search || selectedCategory !== 'الكل'
                  ? 'لم نجد أي منتجات تطابق بحثك حالياً.'
                  : 'لا توجد منتجات منشورة حالياً. عُد قريباً.'}
              </p>
            </div>
            <button 
              onClick={() => { setSearch(''); setSelectedCategory('الكل'); }}
              className="text-[#0a3d0f] dark:text-[var(--primary-light)] font-bold hover:underline underline-offset-4 text-sm"
            >
              عرض جميع المنتجات
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
