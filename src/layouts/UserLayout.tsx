import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingCart, 
  Heart, 
  Moon, 
  Sun, 
  LogOut, 
  Recycle, 
  Menu,
  X,
  Leaf
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useCartStore } from '../stores/cartStore';
import { useThemeStore } from '../stores/themeStore';
import Logo from '../components/common/Logo';
import AboutModal from '../components/common/AboutModal';

const UserLayout: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { items } = useCartStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLink = (path: string) =>
    `relative py-1 text-sm font-semibold transition-colors duration-200 ${
      location.pathname === path ? 'text-[var(--primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)]">
      <header className="sticky top-0 z-40 bg-[var(--bg-card)]/90 backdrop-blur-xl border-b border-[var(--border)] supports-[backdrop-filter]:bg-[var(--bg-card)]/80 shadow-[0_1px_12px_rgba(0,0,0,0.06)]">
        <div className="container mx-auto px-4 h-[68px] md:h-[72px] flex items-center justify-between gap-4">
          <div className="flex items-center gap-6 md:gap-8">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="shrink-0 transition-transform duration-200 hover:scale-[1.02]">
              <Logo size="md" />
            </Link>
            
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
              <Link to="/" className={`${navLink('/')} px-3 py-2 rounded-full ${location.pathname==='/'?'bg-[var(--primary-soft)]':''}`}>
                الرئيسية
              </Link>
              <Link to="/sell-scrap" className={`${navLink('/sell-scrap')} px-3 py-2 rounded-full ${location.pathname==='/sell-scrap'?'bg-[var(--primary-soft)]':''}`}>
                بيع خردة
              </Link>
              {isAuthenticated && (
                <Link to="/my-orders" className={`${navLink('/my-orders')} px-3 py-2 rounded-full ${location.pathname==='/my-orders'?'bg-[var(--primary-soft)]':''}`}>
                  طلباتي
                </Link>
              )}
              <button onClick={() => setAboutOpen(true)} className={`${navLink('/about')} px-3 py-2 rounded-full hover:bg-[var(--bg-item)]`}>
                من نحن
              </button>
              <Link to="/about" className={`${navLink('/about')} px-3 py-2 rounded-full ${location.pathname==='/about'?'bg-[var(--primary-soft)]':''} hidden lg:inline-flex`}>
                عن المنصة
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-1.5 md:gap-2">
            <button 
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2.5 rounded-xl bg-[var(--bg-item)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--primary)] hover:border-[var(--primary)]/20 hover:bg-[var(--primary-soft)] transition-all duration-200"
            >
              {isDarkMode ? <Sun size={18} strokeWidth={1.9} /> : <Moon size={18} strokeWidth={1.9} />}
            </button>

            <Link to="/favorites" aria-label="Favorites - قائمة الرغبات" title="المفضلة" className="hidden sm:flex p-2.5 rounded-xl bg-[var(--bg-item)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--primary)] hover:border-[var(--primary)]/20 hover:bg-[var(--primary-soft)] transition-all duration-200">
              <Heart size={18} strokeWidth={2} fill="none" className="shrink-0" style={{ fill: 'none' }} />
            </Link>

            <Link to="/cart" aria-label="Cart" className="p-2.5 rounded-xl bg-[var(--bg-item)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--primary)] hover:border-[var(--primary)]/20 hover:bg-[var(--primary-soft)] transition-all duration-200 relative">
              <ShoppingCart size={18} strokeWidth={1.9} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[var(--primary)] text-white text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-bold shadow-lg shadow-green-900/20 ring-2 ring-[var(--bg-card)]">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-3 ms-1">
                <div className="hidden lg:flex flex-col items-end text-xs leading-none gap-1">
                  <span className="text-[var(--text-muted)] flex items-center gap-1"><Leaf size={12} className="text-[var(--primary)]" /> مرحباً</span>
                  <span className="font-bold text-[13px]">{user?.name}</span>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--brand-dark)] to-[var(--brand)] flex items-center justify-center text-white font-bold text-sm ring-1 ring-white/10">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="hidden sm:flex p-2.5 rounded-xl text-[var(--danger)] hover:bg-[var(--danger)]/10 border border-transparent hover:border-[var(--danger)]/20 transition-all"
                  title="تسجيل الخروج"
                >
                  <LogOut size={18} strokeWidth={1.9} />
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-5 md:px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 shadow-md shadow-green-900/10 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
              >
                دخول
              </Link>
            )}

            <button 
              className="md:hidden p-2.5 rounded-xl bg-[var(--bg-item)] border border-[var(--border)] text-[var(--text-muted)]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-[var(--bg-card)] border-b border-[var(--border)] p-4 animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col gap-1.5 text-sm font-medium">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className={`py-3 px-4 rounded-xl flex items-center justify-between ${location.pathname==='/'?'bg-[var(--primary-soft)] text-[var(--primary)]':'hover:bg-[var(--bg-item)]'}`}>الرئيسية <span className="text-xs opacity-50">›</span></Link>
              <Link to="/sell-scrap" onClick={() => setIsMenuOpen(false)} className={`py-3 px-4 rounded-xl flex items-center justify-between ${location.pathname==='/sell-scrap'?'bg-[var(--primary-soft)] text-[var(--primary)]':'hover:bg-[var(--bg-item)]'}`}>بيع خردة <Recycle size={16} /></Link>
              <button onClick={() => { setAboutOpen(true); setIsMenuOpen(false); }} className="py-3 px-4 rounded-xl hover:bg-[var(--bg-item)] text-right flex items-center justify-between w-full">من نحن <Leaf size={16} className="text-[var(--primary)]" /></button>
              <Link to="/about" onClick={() => setIsMenuOpen(false)} className={`py-3 px-4 rounded-xl ${location.pathname==='/about'?'bg-[var(--primary-soft)] text-[var(--primary)]':'hover:bg-[var(--bg-item)]'}`}>عن المنصة</Link>
              {isAuthenticated && (
                <>
                  <Link to="/my-orders" onClick={() => setIsMenuOpen(false)} className="py-3 px-4 hover:bg-[var(--bg-item)] rounded-xl">طلباتي</Link>
                  <Link to="/favorites" onClick={() => setIsMenuOpen(false)} className="py-3 px-4 hover:bg-[var(--bg-item)] rounded-xl">المفضلة</Link>
                  <div className="pt-3 mt-1 border-t border-[var(--border)] flex items-center justify-between">
                    <span className="text-xs text-[var(--text-muted)]">{user?.name}</span>
                    <button 
                      onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                      className="py-2 px-4 text-sm font-bold text-[var(--danger)] bg-[var(--danger)]/10 rounded-xl"
                    >
                      تسجيل الخروج
                    </button>
                  </div>
                </>
              )}
              {!isAuthenticated && (
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="py-3 px-4 rounded-xl text-[var(--primary)] bg-[var(--primary-soft)] text-center font-bold">تسجيل الدخول</Link>
              )}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-grow container mx-auto px-4 py-6 md:py-10">
        <Outlet />
      </main>

      <footer className="bg-[#052e08] text-white border-t border-white/10 mt-8 md:mt-12">
        <div className="container mx-auto px-4 py-10 md:py-12">
          <div className="grid md:grid-cols-[1.4fr_1fr_1fr] gap-8 md:gap-12 items-start">
            <div className="space-y-4">
              <Logo size="md" variant="light" />
              <p className="text-white/70 text-sm leading-relaxed max-w-md">
                رينوفا — منصة ذكية لبيع وشراء الخردة والمنتجات المعاد تدويرها. نساهم معاً في بناء مستقبل أنظف وأكثر استدامة.
              </p>
              <p className="text-white/50 text-xs tracking-widest uppercase font-medium">E-Waste Recycling for a Greener Tomorrow</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold text-sm">روابط سريعة</h4>
              <div className="flex flex-col gap-2 text-sm text-white/70">
                <Link to="/" className="hover:text-white transition-colors">الرئيسية</Link>
                <Link to="/sell-scrap" className="hover:text-white transition-colors">بيع خردة</Link>
                <Link to="/cart" className="hover:text-white transition-colors">سلة المشتريات</Link>
                <Link to="/favorites" className="hover:text-white transition-colors">المفضلة</Link>
                <button onClick={() => setAboutOpen(true)} className="text-right hover:text-white transition-colors">من نحن</button>
                <Link to="/about" className="hover:text-white transition-colors">عن المنصة</Link>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold text-sm">تواصل معنا</h4>
              <div className="flex flex-col gap-2 text-sm text-white/70">
                <span>support@renova.demo</span>
                <span dir="ltr" className="text-left">+20 100 123 4567</span>
                <div className="flex gap-3 pt-2">
                  <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"><Leaf size={16} /></span>
                  <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"><Recycle size={16} /></span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/50">
            <span>© {new Date().getFullYear()} ReNova. جميع الحقوق محفوظة.</span>
            <div className="flex items-center gap-6">
              <button onClick={() => setAboutOpen(true)} className="hover:text-white transition-colors">من نحن</button>
              <Link to="/about" className="hover:text-white transition-colors">عن المنصة</Link>
              <Link to="#" className="hover:text-white transition-colors">سياسة الخصوصية</Link>
              <Link to="#" className="hover:text-white transition-colors">الشروط والأحكام</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Sell Button */}
      <Link 
        to="/sell-scrap"
        className="fixed bottom-5 left-5 z-40 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white p-3.5 md:p-4 rounded-full shadow-2xl shadow-green-900/30 flex items-center gap-2 group transition-all duration-300 hover:scale-105 active:scale-95 ring-1 ring-white/10"
      >
        <Recycle size={22} strokeWidth={1.9} />
        <span className="max-w-0 overflow-hidden group-hover:max-w-[100px] transition-all duration-300 font-bold whitespace-nowrap text-sm">
          بيع خردة
        </span>
      </Link>

      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </div>
  );
};

export default UserLayout;
