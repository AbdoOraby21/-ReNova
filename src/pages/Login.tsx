import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, Globe, Apple, AlertCircle, Sparkles } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import Logo from '../components/common/Logo';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, googleLogin, appleLogin } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        const currentUser = useAuthStore.getState().user;
        // Admin should go directly to dashboard as required
        if (currentUser?.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          // If user came from protected route, respect it; otherwise go to home dashboard
          const target = from !== '/login' && from !== '/admin/login' ? from : '/';
          navigate(target, { replace: true });
        }
      } else {
        setError('بيانات الدخول غير صحيحة. استخدم user@renova.demo / 123456 أو admin@renova.demo / admin123');
      }
    } catch (err) {
      setError('حدث خطأ أثناء تسجيل الدخول.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    setLoading(true);
    try {
      if (provider === 'google') await googleLogin();
      else await appleLogin();
      navigate(from, { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center p-4 py-10">
      <div className="w-full max-w-[440px] space-y-6 bg-[var(--bg-card)] p-7 md:p-8 rounded-[2rem] border border-[var(--border)] shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="relative">
            <div className="absolute -inset-3 bg-[var(--primary-soft)] rounded-[1.75rem] blur-xl" />
            <div className="relative bg-[var(--bg-card)] rounded-2xl p-1.5 ring-1 ring-[var(--border)]">
              <Logo size="lg" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-[1.65rem] font-black tracking-tight">تسجيل الدخول</h2>
            <p className="text-[var(--text-muted)] text-sm flex items-center justify-center gap-1.5"><Sparkles size={14} className="text-[var(--primary)]" /> أهلاً بك مجدداً في منصة رينوفا</p>
          </div>
        </div>

        {error && (
          <div className="bg-[var(--danger)]/10 border border-[var(--danger)]/20 text-[var(--danger)] p-3.5 rounded-2xl flex items-start gap-2.5 text-sm">
            <AlertCircle className="shrink-0 mt-0.5" size={18} />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[13px] font-bold mr-1 flex items-center gap-1.5">البريد الإلكتروني <span className="text-[var(--danger)]">*</span></label>
              <div className="relative group">
                <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--primary)] transition-colors" size={18} />
                <input 
                  type="email" 
                  required
                  placeholder="user@renova.demo"
                  className="w-full pr-11 pl-4 py-3.5 rounded-2xl bg-[var(--bg-item)] border border-[var(--border)] focus:bg-[var(--bg-card)] transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-bold mr-1 flex items-center gap-1.5">كلمة المرور <span className="text-[var(--danger)]">*</span></label>
              <div className="relative group">
                <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--primary)] transition-colors" size={18} />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full pr-11 pl-4 py-3.5 rounded-2xl bg-[var(--bg-item)] border border-[var(--border)] focus:bg-[var(--bg-card)] transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-green-900/15 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
          >
            {loading ? 'جاري التحميل...' : (
              <>
                <LogIn size={19} />
                دخول
              </>
            )}
          </button>
        </form>

        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--border)]"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-[var(--bg-card)] px-3 text-[var(--text-muted)] font-medium">أو عبر</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => handleSocialLogin('google')}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-item)] hover:bg-[var(--bg-card)] hover:border-[var(--primary)]/20 hover:text-[var(--primary)] transition-all text-sm font-bold"
          >
            <Globe size={18} className="text-[#ea4335]" />
            <span>Google</span>
          </button>
          <button 
            onClick={() => handleSocialLogin('apple')}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-item)] hover:bg-[var(--bg-card)] hover:border-[var(--primary)]/20 transition-all text-sm font-bold"
          >
            <Apple size={18} />
            <span>Apple</span>
          </button>
        </div>

        <p className="text-center text-[var(--text-muted)] text-sm pt-1">
          ليس لديك حساب؟{' '}
          <Link to="/register" className="text-[var(--primary)] font-bold hover:underline underline-offset-4">
            إنشاء حساب جديد
          </Link>
        </p>

        <div className="text-center">
          <p className="text-[11px] text-[var(--text-muted)] bg-[var(--bg-item)] border border-[var(--border)] rounded-xl py-2.5 px-3">
            حساب تجريبي: <span className="font-mono font-bold text-[var(--text-main)]">user@renova.demo</span> / <span className="font-mono font-bold text-[var(--text-main)]">123456</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
