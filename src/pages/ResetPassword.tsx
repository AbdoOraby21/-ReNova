import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import Logo from '../components/common/Logo';

type Phase = 'checking' | 'ready' | 'invalid' | 'done';

/**
 * Handles Supabase recovery links (PKCE `?code=` or hash tokens are
 * exchanged automatically by supabase-js). Supabase Auth only — no custom
 * tokens, no password stores, nothing in localStorage beyond the session.
 */
const ResetPassword: React.FC = () => {
  const [phase, setPhase] = useState<Phase>('checking');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setPhase('invalid');
      return;
    }
    let cancelled = false;
    const client = supabase;
    // A valid recovery link yields a session (possibly after the automatic
    // PKCE code exchange). PASSWORD_RECOVERY marks the recovery context.
    const { data: listener } = client.auth.onAuthStateChange((event, session) => {
      if (cancelled) return;
      if ((event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') && session) {
        setPhase('ready');
      }
    });
    client.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      if (data.session) setPhase('ready');
      else {
        // Give the automatic code exchange a moment before giving up.
        setTimeout(() => {
          if (!cancelled) {
            client.auth.getSession().then(({ data: retry }) => {
              if (!cancelled) setPhase(retry.session ? 'ready' : 'invalid');
            });
          }
        }, 1500);
      }
    });
    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('كلمتا المرور غير متطابقتين.');
      return;
    }
    if (password.length < 6) {
      setError('كلمة المرور قصيرة جدًا.');
      return;
    }
    if (!supabase) {
      setError('حدث خطأ أثناء تحديث كلمة المرور.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      // Recovery consumed: drop the session so the temporary recovery
      // state cannot be reused, then hand off to a fresh login.
      await supabase.auth.signOut();
      setPhase('done');
    } catch {
      setError('حدث خطأ أثناء تحديث كلمة المرور. قد يكون الرابط منتهيًا — اطلب رابطًا جديدًا.');
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
            <h2 className="text-[1.65rem] font-black tracking-tight">تعيين كلمة مرور جديدة</h2>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/25 text-red-500 p-3.5 rounded-2xl text-sm flex items-start gap-2">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {phase === 'checking' && (
          <p className="text-center text-[var(--text-muted)] text-sm">جارٍ التحقق من رابط الاستعادة...</p>
        )}

        {phase === 'invalid' && (
          <div className="bg-red-500/10 border border-red-500/25 text-red-500 p-4 rounded-2xl text-sm leading-relaxed space-y-2">
            <p className="font-bold">رابط الاستعادة غير صالح أو منتهي الصلاحية.</p>
            <div className="flex items-center gap-3">
              <Link to="/forgot-password" className="font-bold hover:underline underline-offset-4">
                طلب رابط جديد
              </Link>
              <Link to="/login" className="font-bold hover:underline underline-offset-4">
                تسجيل الدخول
              </Link>
            </div>
          </div>
        )}

        {phase === 'ready' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[13px] font-bold mr-1">كلمة المرور الجديدة</label>
              <div className="relative">
                <Lock size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full pr-11 pl-4 py-3.5 rounded-2xl bg-[var(--bg-item)] border border-[var(--border)] focus:bg-[var(--bg-card)] transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[13px] font-bold mr-1">تأكيد كلمة المرور</label>
              <div className="relative">
                <Lock size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full pr-11 pl-4 py-3.5 rounded-2xl bg-[var(--bg-item)] border border-[var(--border)] focus:bg-[var(--bg-card)] transition-all"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] disabled:opacity-60 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg"
            >
              {loading ? 'جارٍ التحديث...' : 'تحديث كلمة المرور'}
            </button>
          </form>
        )}

        {phase === 'done' && (
          <div className="bg-[var(--primary)]/10 border border-[var(--primary)]/25 text-[var(--primary)] p-4 rounded-2xl text-sm leading-relaxed space-y-2">
            <p className="flex items-start gap-2 font-bold">
              <CheckCircle size={18} className="shrink-0 mt-0.5" />
              تم تحديث كلمة المرور بنجاح.
            </p>
            <button
              onClick={() => navigate('/login', { replace: true })}
              className="inline-flex items-center gap-1.5 font-bold hover:underline underline-offset-4"
            >
              الذهاب إلى تسجيل الدخول <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
