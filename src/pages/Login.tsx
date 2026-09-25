import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle, Sparkles } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import Logo from '../components/common/Logo';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.ok) {
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
        setError(result.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة.');
      }
    } catch (err) {
      setError('حدث خطأ أثناء تسجيل الدخول.');
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
                  placeholder="example@mail.com"
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

        <p className="text-center text-[var(--text-muted)] text-sm pt-1 flex items-center justify-center gap-2">
          <Link to="/forgot-password" className="text-[var(--primary)] font-bold hover:underline underline-offset-4">
            نسيت كلمة المرور؟
          </Link>
          <span aria-hidden="true">•</span>
          <span>
            ليس لديك حساب؟{' '}
            <Link to="/register" className="text-[var(--primary)] font-bold hover:underline underline-offset-4">
              إنشاء حساب جديد
            </Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
