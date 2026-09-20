import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, LogIn, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import Logo from '../../components/common/Logo';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { adminLogin } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await adminLogin(email, password);
      if (success) {
        navigate('/admin');
      } else {
        setError('بيانات دخول المشرف غير صحيحة. استخدم admin123');
      }
    } catch (err) {
      setError('حدث خطأ أثناء تسجيل الدخول للوحة التحكم.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#052e08] flex items-center justify-center p-4 relative overflow-hidden">
      {/* subtle pattern */}
      <div className="absolute inset-0 opacity-[0.04]" style={{backgroundImage:`url("https://www.transparenttextures.com/patterns/carbon-fibre.png")`}} />
      <div className="absolute inset-0 bg-gradient-to-br from-[#052e08] via-[#0a3d0f]/60 to-black/60" />

      <div className="w-full max-w-md space-y-7 bg-white p-8 md:p-10 rounded-[2rem] border border-black/5 shadow-[0_32px_80px_rgba(0,0,0,0.4)] relative">
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="relative">
            <Logo size="lg" />
          </div>
          <div className="w-14 h-14 bg-[#052e08] text-white rounded-2xl flex items-center justify-center shadow-lg">
            <Shield size={28} />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-[1.7rem] font-black text-[#052e08]">بوابة الإدارة</h2>
            <p className="text-gray-500 text-sm">تسجيل الدخول للوحة تحكم ReNova</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3.5 rounded-2xl flex items-start gap-2.5 text-sm">
            <AlertCircle className="shrink-0 mt-0.5" size={18} />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-gray-700 mr-1">البريد الإلكتروني للإدارة</label>
              <div className="relative group">
                <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0a3d0f] transition-colors" size={18} />
                <input 
                  type="email" 
                  required
                  placeholder="admin@renova.demo"
                  className="w-full pr-11 pl-4 py-3.5 rounded-2xl bg-gray-50 border-gray-200 text-[#052e08] focus:bg-white focus:ring-2 focus:ring-[#0a3d0f]/20 focus:border-[#0a3d0f] outline-none transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-bold text-gray-700 mr-1">كلمة المرور</label>
              <div className="relative group">
                <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0a3d0f] transition-colors" size={18} />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full pr-11 pl-4 py-3.5 rounded-2xl bg-gray-50 border-gray-200 text-[#052e08] focus:bg-white focus:ring-2 focus:ring-[#0a3d0f]/20 focus:border-[#0a3d0f] outline-none transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#0a3d0f] hover:bg-[#052e08] disabled:opacity-60 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
          >
            {loading ? 'جاري التحقق...' : (
              <>
                <LogIn size={20} />
                دخول للوحة التحكم
              </>
            )}
          </button>
        </form>

        <div className="text-center space-y-3">
          <p className="text-[11px] text-gray-500 bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3">
            تجريبي: <span className="font-mono font-bold text-[#052e08]">admin@renova.demo</span> / <span className="font-mono font-bold text-[#052e08]">admin123</span>
          </p>
          <button 
            onClick={() => navigate('/')}
            className="text-gray-500 text-sm hover:text-[#0a3d0f] transition-colors inline-flex items-center gap-1.5 font-medium"
          >
            العودة للموقع الرئيسي <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
