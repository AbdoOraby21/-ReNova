import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowLeft, Heart, ShoppingCart, Sparkles, Recycle, Leaf, ShieldCheck, Phone } from 'lucide-react';
import { useProductStore } from '../stores/productStore';
import { useFavoritesStore } from '../stores/favoritesStore';
import { useCartStore } from '../stores/cartStore';
import { useToast } from '../components/common/Toast';
import SafeImage, { FALLBACK_IMAGE } from '../components/common/SafeImage';
const logoImg = '/logo.jpeg';

const CONTACT_PHONES = ['01123302529', '01019048949', '01069620611'];

const CONTACT_SOCIALS = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/renova-bb473a433',
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z',
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/share/1EgnkQLqsi/?mibextid=wwXIfr',
    path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@renova173?_r=1&_t=ZS-99PGUWWibci',
    path: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/renovaa_company?stkn=aXZtZXBoYWR4cWZr',
    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
  },
];

const Home: React.FC = () => {
  const { products, categories, selectedCategory, setSelectedCategory, seedProducts } = useProductStore();
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const { addItem } = useCartStore();
  const { showToast, ToastContainer } = useToast();
  const [search, setSearch] = useState('');

  useEffect(() => {
    seedProducts();
  }, [seedProducts]);

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
        {filteredProducts.length > 0 ? (
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
              <p className="text-[var(--text-muted)] text-sm">لم نجد أي منتجات تطابق بحثك حالياً.</p>
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

      {/* Contact Us */}
      <section dir="rtl" className="relative overflow-hidden rounded-[2rem] bg-[#052e08] text-white border border-white/10 px-6 py-10 md:p-10 overflow-x-clip">
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/carbon-fibre.png")` }} />
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#16a34a]/20 rounded-full blur-3xl" />
        <div className="relative space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl md:text-2xl font-black flex items-center justify-center gap-2">
              <Leaf size={22} className="text-[#22c55e]" /> تواصل معنا
            </h2>
            <p className="text-white/60 text-sm leading-relaxed">يسعدنا تواصلك معنا عبر الهاتف أو منصات التواصل الاجتماعي</p>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-3">
            {CONTACT_PHONES.map((phone) => (
              <a
                key={phone}
                href={`tel:${phone}`}
                dir="ltr"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-[#22c55e] focus-visible:bg-[#22c55e] focus-visible:outline-2 focus-visible:outline-white/60 active:bg-[#16a34a] border border-white/10 hover:border-transparent px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-colors min-w-0 break-all"
              >
                <Phone size={16} className="shrink-0" />
                {phone}
              </a>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {CONTACT_SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`ReNova على ${s.label}`}
                title={s.label}
                className="w-11 h-11 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center hover:bg-[#22c55e] hover:border-transparent hover:-translate-y-0.5 focus-visible:bg-[#22c55e] focus-visible:outline-2 focus-visible:outline-white/60 active:translate-y-0 active:bg-[#16a34a] transition-all"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
          <p className="text-center text-white/40 text-xs" dir="ltr">LinkedIn • Facebook • TikTok • Instagram</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
