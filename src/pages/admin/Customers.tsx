import React, { useState } from 'react';
import { Search, User, Mail, Phone, Calendar, Shield } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

const Customers: React.FC = () => {
  const { users } = useAuthStore();
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative w-full md:w-80">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
        <input 
          type="text" 
          placeholder="ابحث عن العملاء..."
          className="w-full pr-12"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[2.5rem] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="px-6 py-6 text-sm font-black uppercase tracking-widest text-[var(--primary)]">العميل</th>
                <th className="px-6 py-6 text-sm font-black uppercase tracking-widest text-[var(--primary)]">بيانات التواصل</th>
                <th className="px-6 py-6 text-sm font-black uppercase tracking-widest text-[var(--primary)] text-center">الدور</th>
                <th className="px-6 py-6 text-sm font-black uppercase tracking-widest text-[var(--primary)]">تاريخ التسجيل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-[var(--bg-item)] transition-colors group">
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg ${u.role === 'admin' ? 'bg-purple-600' : 'bg-[var(--primary)]'}`}>
                        {u.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-lg">{u.name}</span>
                        <span className="text-[var(--text-muted)] text-[10px]">ID: {u.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail size={14} className="text-[var(--text-muted)]" />
                        {u.email}
                      </div>
                      {u.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone size={14} className="text-[var(--text-muted)]" />
                          {u.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex justify-center">
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border ${
                        u.role === 'admin' 
                        ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' 
                        : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                      }`}>
                        {u.role === 'admin' ? <Shield size={10} /> : <User size={10} />}
                        {u.role === 'admin' ? 'مدير' : 'عميل'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2 text-[var(--text-muted)] text-sm">
                      <Calendar size={14} />
                      {new Date(u.createdAt).toLocaleDateString('ar-EG')}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Customers;
