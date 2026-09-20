import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Mail,
  ShoppingCart,
  Package,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';

const AdminLayout: React.FC = () => {
  const { logout } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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
    { icon: Settings, label: 'الإعدادات', path: '/admin/settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex bg-[#0a0a0a] text-white overflow-hidden" dir="rtl">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[260px] shrink-0 bg-[#141414] border-l border-[#2a2a2a] h-screen sticky top-0">
        {/* Logo Header */}
        <div className="h-[72px] px-6 flex items-center justify-between border-b border-[#2a2a2a] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0f9d62] flex items-center justify-center">
              <ShieldCheck size={20} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-[15px] leading-none">Renova Admin</span>
              <span className="text-[11px] text-white/50 font-medium">لوحة التحكم</span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto scrollbar-hide mt-2">
          {navItems.map(item => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-bold transition-all ${
                  active ? 'bg-[#0f9d62] text-white shadow-md' : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon size={18} strokeWidth={1.9} className={active ? 'text-white' : 'text-white/60'} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom User Card */}
        <div className="p-3 border-t border-[#2a2a2a] space-y-3">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-[#1e1e1e] border border-[#2a2a2a]">
            <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center text-white font-bold text-xs shrink-0">
              م
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold leading-none">مدير النظام</p>
              <p className="text-[11px] text-white/50 truncate">Admin</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#1e1e1e] border border-[#2a2a2a] text-white/70 hover:bg-white/5 hover:text-white text-xs font-bold transition-colors"
            >
              تسجيل الخروج
              <LogOut size={14} />
            </button>
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-11 h-11 rounded-xl bg-[#1e1e1e] border border-[#2a2a2a] flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-colors"
            >
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
          <aside className="absolute right-0 top-0 bottom-0 w-[280px] bg-[#141414] border-l border-[#2a2a2a] flex flex-col">
            <div className="h-[72px] px-6 flex items-center justify-between border-b border-[#2a2a2a]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#0f9d62] flex items-center justify-center">
                  <ShieldCheck size={20} className="text-white" />
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
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden bg-[#0a0a0a]">
        {/* Mobile Top Bar */}
        <div className="lg:hidden h-[56px] flex items-center justify-between px-4 bg-[#141414] border-b border-[#2a2a2a] shrink-0 sticky top-0 z-30">
          <button onClick={() => setIsMobileOpen(true)} className="p-2 rounded-xl bg-[#1e1e1e] border border-[#2a2a2a]">
            <Menu size={18} />
          </button>
          <div className="flex items-center gap-2">
            <span className="font-black text-sm">Renova Admin</span>
            <div className="w-7 h-7 rounded-lg bg-[#0f9d62] flex items-center justify-center">
              <ShieldCheck size={14} className="text-white" />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scrollbar-hide">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
