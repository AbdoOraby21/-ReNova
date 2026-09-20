import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Recycle, 
  ShoppingBag, 
  Package, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Shield
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import Logo from '../components/common/Logo';

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'الرئيسية', path: '/admin' },
    { icon: Users, label: 'العملاء', path: '/admin/customers' },
    { icon: Recycle, label: 'طلبات البيع', path: '/admin/requests' },
    { icon: ShoppingBag, label: 'طلبات الشراء', path: '/admin/purchase-requests' },
    { icon: Package, label: 'المنتجات', path: '/admin/products' },
    { icon: Settings, label: 'الإعدادات', path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside 
        className={`hidden lg:flex flex-col bg-[#052e08] text-white border-l border-white/10 transition-all duration-300 ${isSidebarOpen ? 'w-[272px]' : 'w-[84px]'}`}
      >
        <div className="h-[68px] px-4 flex items-center justify-between border-b border-white/10 shrink-0">
          {isSidebarOpen ? (
            <div className="flex items-center gap-3">
              <Logo size="sm" variant="light" showText={true} />
            </div>
          ) : (
            <Logo size="sm" variant="light" showText={false} />
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="flex-grow p-3 mt-2 space-y-1 overflow-y-auto scrollbar-hide">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-sm ${
                active 
                  ? 'bg-white text-[#052e08] shadow-md font-bold' 
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
              title={!isSidebarOpen ? item.label : undefined}
            >
              <item.icon size={20} strokeWidth={1.9} className={active ? 'text-[#0a3d0f]' : ''} />
              {isSidebarOpen && <span className="whitespace-nowrap">{item.label}</span>}
            </Link>
          )})}
        </nav>

        <div className="p-3 border-t border-white/10 space-y-3">
          <div className={`flex items-center gap-3 p-3 rounded-xl bg-white/10 border border-white/10 ${!isSidebarOpen && 'justify-center'}`}>
            <div className="w-9 h-9 rounded-xl bg-white text-[#052e08] flex items-center justify-center shrink-0">
              <Shield size={18} />
            </div>
            {isSidebarOpen && (
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate">مدير النظام</p>
                <p className="text-[11px] text-white/60 truncate">{user?.email}</p>
              </div>
            )}
          </div>
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-white/80 hover:bg-[var(--danger)] hover:text-white rounded-xl transition-all text-sm font-medium border border-transparent hover:border-white/10 ${!isSidebarOpen && 'justify-center'}`}
          >
            <LogOut size={18} strokeWidth={1.9} />
            {isSidebarOpen && <span>تسجيل الخروج</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
          <aside className="absolute right-0 top-0 bottom-0 w-[300px] bg-[#052e08] text-white border-l border-white/10 p-5 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <Logo size="sm" variant="light" />
              <button onClick={() => setIsMobileOpen(false)} className="p-2 hover:bg-white/10 rounded-xl"><X size={22} /></button>
            </div>
            <nav className="space-y-1 flex-grow">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-sm ${
                    location.pathname === item.path 
                      ? 'bg-white text-[#052e08] font-bold' 
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <item.icon size={20} strokeWidth={1.9} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-3 text-white/80 hover:bg-white/10 rounded-xl mt-6"
            >
              <LogOut size={20} strokeWidth={1.9} />
              <span className="font-medium">تسجيل الخروج</span>
            </button>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow flex flex-col h-screen overflow-hidden bg-[var(--bg-main)]">
        <header className="h-[68px] border-b border-[var(--border)] bg-[var(--bg-card)] flex items-center justify-between px-4 md:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button 
              className="lg:hidden p-2 rounded-xl bg-[var(--bg-item)] border border-[var(--border)] text-[var(--text-muted)]"
              onClick={() => setIsMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg md:text-xl font-black">
              {navItems.find(item => item.path === location.pathname)?.label || 'لوحة التحكم'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-[var(--text-muted)] bg-[var(--bg-item)] border border-[var(--border)] px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {new Intl.DateTimeFormat('ar-EG', { dateStyle: 'full' }).format(new Date())}
            </div>
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-[#052e08] ring-1 ring-black/5 hidden sm:block">
              <img src="/logo.jpeg" alt="ReNova" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        <div className="flex-grow overflow-y-auto p-4 md:p-6 scrollbar-hide">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
