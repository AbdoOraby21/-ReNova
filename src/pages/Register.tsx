import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, UserPlus, AlertCircle, Sparkles } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import Logo from '../components/common/Logo';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }

    setLoading(true);

    try {
      const success = await register(
        formData.name,
        formData.email,
        formData.phone,
        formData.password
      );

      if (success) {
        navigate('/');
      } else {
        setError('هذا البريد الإلكتروني مستخدم بالفعل');
      }
    } catch (err) {
      setError('حدث خطأ أثناء إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center p-4 py-10">
      <div className="w-full max-w-[480px] space-y-6 bg-[var(--bg-card)] p-7 md:p-8 rounded-[2rem] border border-[var(--border)] shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="relative">
            <div className="absolute -inset-3 bg-[var(--primary-soft)] rounded-[1.75rem] blur-xl" />
            <div className="relative bg-[var(--bg-card)] rounded-2xl p-1.5 ring-1 ring-[var(--border)]">
              <Logo size="lg" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-[1.65rem] font-black tracking-tight">إنشاء حساب جديد</h2>
            <p className="text-[var(--text-muted)] text-sm flex items-center justify-center gap-1.5"><Sparkles size={14} className="text-[var(--primary)]" /> انضم لمجتمع رينوفا وابدأ رحلتك المستدامة</p>
          </div>
        </div>

        {error && (
          <div className="bg-[var(--danger)]/10 border border-[var(--danger)]/20 text-[var(--danger)] p-3.5 rounded-2xl flex items-start gap-2.5 text-sm">
            <AlertCircle className="shrink-0 mt-0.5" size={18} />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[13px] font-bold mr-1">الاسم الكامل</label>
            <div className="relative group">
              <User className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--primary)] transition-colors" size={18} />
              <input 
                type="text" 
                required
                placeholder="أحمد محمد"
                className="w-full pr-11 pl-4 py-3 rounded-2xl"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-bold mr-1">البريد الإلكتروني</label>
            <div className="relative group">
              <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--primary)] transition-colors" size={18} />
              <input 
                type="email" 
                required
                placeholder="example@mail.com"
                className="w-full pr-11 pl-4 py-3 rounded-2xl"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-bold mr-1">رقم الهاتف</label>
            <div className="relative group">
              <Phone className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--primary)] transition-colors" size={18} />
              <input 
                type="tel" 
                required
                placeholder="0123456789"
                className="w-full pr-11 pl-4 py-3 rounded-2xl"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[13px] font-bold mr-1">كلمة المرور</label>
              <div className="relative group">
                <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--primary)] transition-colors" size={18} />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full pr-11 pl-4 py-3 rounded-2xl"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[13px] font-bold mr-1">تأكيد المرور</label>
              <div className="relative group">
                <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--primary)] transition-colors" size={18} />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full pr-11 pl-4 py-3 rounded-2xl"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] disabled:opacity-60 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-green-900/15 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] mt-2"
          >
            {loading ? 'جاري إنشاء الحساب...' : (
              <>
                <UserPlus size={19} />
                إنشاء حساب
              </>
            )}
          </button>
        </form>

        <p className="text-center text-[var(--text-muted)] text-sm">
          لديك حساب بالفعل؟{' '}
          <Link to="/login" className="text-[var(--primary)] font-bold hover:underline underline-offset-4">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
