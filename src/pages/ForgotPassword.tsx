import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Send, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import Logo from '../components/common/Logo';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (!isSupabaseConfigured || !supabase) throw new Error('unconfigured');
      // Origin-derived redirect: production and local dev each get their own
      // /reset-password URL. Never hardcoded, never the Vercel URL.
      // Supabase returns success even for unknown emails — existential
      // privacy is preserved by always showing the same success state.
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
    } catch {
      setError('تعذر إرسال رابط الاستعادة. تحقق من البريد وحاول مجددًا.');
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
            <h2 className="text-[1.65rem] font-black tracking-tight">استعادة كلمة المرور</h2>
            <p className="text-[var(--text-muted)] text-sm">أدخل بريدك وسنرسل لك رابط إعادة التعيين</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/25 text-red-500 p-3.5 rounded-2xl text-sm flex items-start gap-2">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {sent ? (
          <div className="bg-[var(--primary)]/10 border border-[var(--primary)]/25 text-[var(--primary)] p-4 rounded-2xl text-sm leading-relaxed space-y-2">
            <p className="flex items-start gap-2 font-bold">
              <CheckCircle size={18} className="shrink-0 mt-0.5" />
              تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. راجع صندوق الوارد والرسائل غير المرغوب فيها.
            </p>
            <Link to="/login" className="inline-flex items-center gap-1.5 font-bold hover:underline underline-offset-4">
              العودة لتسجيل الدخول <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[13px] font-bold mr-1">البريد الإلكتروني</label>
              <div className="relative">
                <Mail size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
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
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] disabled:opacity-60 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              {loading ? 'جارٍ الإرسال...' : (
                <>
                  <Send size={18} />
                  إرسال رابط الاستعادة
                </>
              )}
            </button>
          </form>
        )}

        {!sent && (
          <p className="text-center text-[var(--text-muted)] text-sm">
            <Link to="/login" className="text-[var(--primary)] font-bold hover:underline underline-offset-4">
              العودة لتسجيل الدخول
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
