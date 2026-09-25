import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Mail,
  ShoppingCart,
  Package,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  ChevronsLeft,
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';

const AdminLayout: React.FC = () => {
  const { logout } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  // Desktop (lg+) sidebar collapse — the sidebar used to be static with no
  // toggle on laptop/desktop, so users had no drawer control there.
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'الرئيسية', path: '/admin' },
    { icon: Users, label: 'العملاء', path: '/admin/customers' },
    { icon: Mail, label: 'طلبات البيع', path: '/admin/requests' },
    { icon: ShoppingCart, label: 'طلبات الشراء', path: '/admin/purchase-requests' },
    { icon: Package, label: 'المنتجات', path: '/admin/products' },
    { icon: BarChart3, label: 'التقارير', path: '/admin/reports' },
    { icon: Settings, label: 'الإعدادات', path: '/admin/settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Current section title for the desktop top bar (derived from route, not viewport size)
  const currentPageTitle = navItems.find(item => item.path === location.pathname)?.label ?? 'لوحة التحكم';

  // Resize-safe: never leave the mobile drawer stuck open after navigation,
  // and allow closing it with Escape on any screen size.
  React.useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="min-h-screen flex bg-[#0a0a0a] text-white overflow-hidden" dir="rtl">
      {/* Desktop Sidebar (lg+) — collapsible via header toggle */}
      <aside
        className={`hidden lg:flex flex-col shrink-0 bg-[#141414] border-l border-[#2a2a2a] h-screen sticky top-0 transition-[width] duration-300 ease-in-out ${
          isDesktopCollapsed ? 'w-[76px]' : 'w-[260px]'
        }`}
      >
        {/* Logo Header — matches reference (logo + titles only) */}
        <div className={`h-[72px] flex items-center border-b border-[#2a2a2a] shrink-0 ${
          isDesktopCollapsed ? 'justify-center px-2' : 'justify-between px-4 xl:px-6'
        }`}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-[#052e08] ring-1 ring-white/10 shrink-0">
              <img
                src="/logo.jpeg"
                alt="ReNova logo"
                loading="eager"
                decoding="async"
                className="h-full w-full object-cover"
                style={{ objectPosition: 'center 38%' }}
              />
            </div>
            {!isDesktopCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-black text-[15px] leading-none truncate">Renova Admin</span>
                <span className="text-[11px] text-white/50 font-medium">لوحة التحكم</span>
              </div>
            )}
          </div>
        </div>

        {/* Collapsed expand button */}
        {isDesktopCollapsed && (
          <div className="flex justify-center pt-2">
            <button
              onClick={() => setIsDesktopCollapsed(false)}
              title="فتح القائمة"
              aria-label="Expand sidebar"
              className="p-2 rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-colors"
            >
              <ChevronsLeft size={18} />
            </button>
          </div>
        )}

        {/* Nav */}
        <nav className={`flex-1 p-3 space-y-1.5 overflow-y-auto overflow-x-hidden scrollbar-hide mt-2 ${isDesktopCollapsed ? 'px-2' : ''}`}>
          {navItems.map(item => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                title={isDesktopCollapsed ? item.label : undefined}
                aria-label={item.label}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-bold transition-all ${
                  isDesktopCollapsed ? 'justify-center px-0' : ''
                } ${
                  active ? 'bg-[#0f9d62] text-white shadow-md' : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon size={18} strokeWidth={1.9} className={`${active ? 'text-white' : 'text-white/60'} shrink-0`} />
                {!isDesktopCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom User Card */}
        <div className={`p-3 border-t border-[#2a2a2a] space-y-3 ${isDesktopCollapsed ? 'px-2' : ''}`}>
          {isDesktopCollapsed ? (
            <div className="flex flex-col items-center gap-2">
              <div
                title="مدير النظام (Admin)"
                className="w-9 h-9 rounded-full bg-[#2a2a2a] flex items-center justify-center text-white font-bold text-xs shrink-0"
              >
                م
              </div>
              <button
                onClick={handleLogout}
                title="تسجيل الخروج"
                aria-label="Logout - تسجيل الخروج"
                className="w-9 h-9 rounded-xl bg-[#1e1e1e] border border-[#2a2a2a] flex items-center justify-center text-white/70 hover:bg-white/5 hover:text-white transition-colors"
              >
                <LogOut size={14} />
              </button>
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                title="تبديل المظهر"
                className="w-9 h-9 rounded-xl bg-[#1e1e1e] border border-[#2a2a2a] flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-colors"
              >
                {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-[#1e1e1e] border border-[#2a2a2a] min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center text-white font-bold text-xs shrink-0">
                  م
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold leading-none truncate">مدير النظام</p>
                  <p className="text-[11px] text-white/50 truncate">Admin</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleLogout}
                  className="flex-1 min-w-0 flex items-center justify-center gap-2 py-2.5 px-2 rounded-xl bg-[#1e1e1e] border border-[#2a2a2a] text-white/70 hover:bg-white/5 hover:text-white text-xs font-bold transition-colors"
                >
                  <span className="truncate">تسجيل الخروج</span>
                  <LogOut size={14} className="shrink-0" />
                </button>
                <button
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                  className="w-11 h-11 shrink-0 rounded-xl bg-[#1e1e1e] border border-[#2a2a2a] flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                >
                  {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                </button>
              </div>
            </>
          )}
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
          <aside className="absolute right-0 top-0 bottom-0 w-[280px] bg-[#141414] border-l border-[#2a2a2a] flex flex-col">
            <div className="h-[72px] px-6 flex items-center justify-between border-b border-[#2a2a2a]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl overflow-hidden bg-[#052e08] ring-1 ring-white/10 shrink-0">
                  <img
                    src="/logo.jpeg"
                    alt="ReNova logo"
                    loading="eager"
                    decoding="async"
                    className="h-full w-full object-cover"
                    style={{ objectPosition: 'center 38%' }}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-[15px]">Renova Admin</span>
                  <span className="text-[11px] text-white/50">لوحة التحكم</span>
                </div>
              </div>
              <button onClick={() => setIsMobileOpen(false)} className="p-2 hover:bg-white/10 rounded-xl">
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto mt-2">
              {navItems.map(item => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-bold ${
                      active ? 'bg-[#0f9d62] text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="p-3 border-t border-[#2a2a2a] space-y-3">
              <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-[#1e1e1e] border border-[#2a2a2a]">
                <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center text-xs font-bold">م</div>
                <div>
                  <p className="text-xs font-bold">مدير النظام</p>
                  <p className="text-[11px] text-white/50">Admin</p>
                </div>
              </div>
              <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#1e1e1e] border border-[#2a2a2a] text-xs font-bold">
                تسجيل الخروج <LogOut size={14} />
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 min-w-0 w-full max-w-full flex flex-col min-h-screen overflow-hidden bg-[#0a0a0a]">
        {/* Mobile Top Bar */}
        <div className="lg:hidden h-[56px] flex items-center justify-between px-4 bg-[#141414] border-b border-[#2a2a2a] shrink-0 sticky top-0 z-30">
          <button onClick={() => setIsMobileOpen(true)} className="p-2 rounded-xl bg-[#1e1e1e] border border-[#2a2a2a]">
            <Menu size={18} />
          </button>
          <div className="flex items-center gap-2">
            <span className="font-black text-sm">Renova Admin</span>
            <div className="w-7 h-7 rounded-lg overflow-hidden bg-[#052e08] ring-1 ring-white/10 shrink-0">
              <img
                src="/logo.jpeg"
                alt="ReNova logo"
                loading="eager"
                decoding="async"
                className="h-full w-full object-cover"
                style={{ objectPosition: 'center 38%' }}
              />
            </div>
          </div>
        </div>

        {/* Desktop Top Bar (lg+) — always-visible sidebar toggle so the
            navigation control never disappears on fullscreen laptop/desktop */}
        <div className="hidden lg:flex h-[64px] items-center justify-between gap-4 px-6 xl:px-8 bg-[#141414] border-b border-[#2a2a2a] shrink-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setIsDesktopCollapsed(prev => !prev)}
              title={isDesktopCollapsed ? 'فتح القائمة' : 'طي القائمة'}
              aria-label={isDesktopCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-expanded={!isDesktopCollapsed}
              className="p-2.5 rounded-xl bg-[#1e1e1e] border border-[#2a2a2a] text-white/70 hover:text-white hover:bg-white/5 transition-colors shrink-0"
            >
              <Menu size={18} />
            </button>
            <div className="min-w-0">
              <p className="text-[15px] font-black text-white leading-none truncate">{currentPageTitle}</p>
              <p className="text-[11px] text-white/50 mt-1 truncate">Renova Admin • لوحة التحكم</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title="تبديل المظهر"
              className="w-10 h-10 rounded-xl bg-[#1e1e1e] border border-[#2a2a2a] flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-colors"
            >
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>

        <div className="flex-1 min-w-0 w-full max-w-full overflow-y-auto overflow-x-clip p-4 md:p-6 lg:p-8 scrollbar-hide">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
