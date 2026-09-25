import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, LogIn, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

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
      const result = await adminLogin(email, password);
      if (result.ok) navigate('/admin', { replace: true });
      else setError(result.message || 'بيانات دخول المشرف غير صحيحة.');
    } catch {
      setError('حدث خطأ أثناء تسجيل الدخول.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-[380px] bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 rounded-full bg-[#2a2a2a] flex items-center justify-center">
            <Shield size={20} className="text-white/80" />
          </div>
          <div>
            <h2 className="text-base font-black text-white">بوابة الإدارة</h2>
            <p className="text-[11px] text-white/40 mt-1">تسجيل الدخول للوحة تحكم Renova</p>
          </div>
        </div>

        {error && (
          <div className="bg-[#ef4444]/10 border border-[#ef4444]/20 text-[#f87171] p-3 rounded-xl flex gap-2 text-xs">
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-white/50">البريد الإلكتروني للإدارة</label>
            <div className="relative">
              <Mail size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full pr-9 pl-3 py-3 rounded-xl bg-[#141414] border border-[#2a2a2a] text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-white/20" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-white/50">كلمة المرور</label>
            <div className="relative">
              <Lock size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full pr-9 pl-3 py-3 rounded-xl bg-[#141414] border border-[#2a2a2a] text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-white/20" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-[#2a2a2a] hover:bg-[#333] disabled:opacity-60 text-white py-3 rounded-xl text-xs font-bold transition-colors">
            {loading ? 'جاري التحقق...' : <><LogIn size={14} /> دخول للوحة التحكم</>}
          </button>
        </form>

        <div className="text-center space-y-3">
          <button onClick={() => navigate('/')} className="text-[11px] text-white/40 hover:text-white flex items-center gap-1.5 mx-auto">
            العودة للموقع <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
