import React, { useEffect } from 'react';
import { X, Leaf, Wrench, Sparkles, Cpu, Eye, Target, Phone, ShieldCheck, Award } from 'lucide-react';
import Logo from './Logo';

interface AboutModalProps {
  open: boolean;
  onClose: () => void;
}

const PHONES = ['01123302529', '01019048949', '01069620611'];

const SOCIALS = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/renova-bb473a433',
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z',
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/share/1EgnkQLqsi/?mibextid=wwXIfr',
    path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@renova173?_r=1&_t=ZS-99PGUWWibci',
    path: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/renovaa_company?stkn=aXZtZXBoYWR4cWZr',
    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
  },
];

const TRACKS = [
  { icon: Wrench, title: 'Repair & Resell', desc: 'إصلاح وإعادة استخدام الأجهزة.' },
  { icon: Sparkles, title: 'Upcycling', desc: 'تحويل المكونات إلى منتجات جديدة.' },
  { icon: Cpu, title: 'Component Recovery', desc: 'استعادة المكونات والمواد القابلة للاستفادة.' },
];

const AboutModal: React.FC<AboutModalProps> = ({ open, onClose }) => {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" dir="rtl">
      <div className="absolute inset-0 bg-[#052e08]/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden bg-[var(--bg-card)] rounded-[2rem] border border-[var(--border)] shadow-[0_32px_80px_rgba(0,0,0,0.4)] animate-in fade-in zoom-in duration-300 flex flex-col">
        <button onClick={onClose} className="absolute top-4 left-4 z-10 p-2 rounded-xl bg-[var(--bg-item)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)] transition-colors">
          <X size={18} />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-l from-[#0a3d0f] via-[#052e08] to-[#021a04] px-8 py-10 text-white relative overflow-hidden shrink-0">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/carbon-fibre.png")` }} />
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#16a34a]/20 rounded-full blur-3xl" />
          <div className="relative flex flex-col items-center text-center gap-4">
            <div className="bg-white rounded-2xl p-2 ring-1 ring-white/20 shadow-xl">
              <Logo size="md" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black flex items-center justify-center gap-2">
                <Leaf size={24} className="text-[#22c55e]" /> من نحن
              </h2>
              <p className="text-white/70 text-sm mt-1" dir="ltr">E-Waste Recycling for a Greener Tomorrow</p>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto p-6 md:p-8 space-y-6 scrollbar-hide overflow-x-clip">
          <div className="space-y-3 text-right">
            <p className="text-[var(--text-main)] leading-loose text-[15px]">
              ReNova هي منصة لإدارة وإعادة توظيف المخلفات الإلكترونية، نعمل على تحويل الأجهزة والمكونات الإلكترونية المهملة إلى قيمة جديدة بدلًا من التخلص منها.
            </p>
            <p className="text-[var(--text-muted)] leading-loose text-sm">
              نعتمد على ثلاثة مسارات رئيسية:
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            {TRACKS.map((f) => (
              <div key={f.title} className="bg-[var(--bg-item)] border border-[var(--border)] rounded-2xl p-4 text-center space-y-2 hover:border-[var(--primary)]/30 hover:bg-[var(--primary-soft)] transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#0a3d0f] text-white flex items-center justify-center mx-auto">
                  <f.icon size={18} />
                </div>
                <h4 className="font-bold text-sm" dir="ltr">{f.title}</h4>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-right">
            <div className="bg-[var(--bg-item)] border border-[var(--border)] rounded-2xl p-4 space-y-1.5">
              <h3 className="font-black text-sm flex items-center gap-2">
                <Eye size={16} className="text-[var(--primary)]" /> رؤيتنا
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-loose">
                بناء منظومة أكثر استدامة للمخلفات الإلكترونية، وتحويلها من نفايات إلى موارد.
              </p>
            </div>
            <div className="bg-[var(--bg-item)] border border-[var(--border)] rounded-2xl p-4 space-y-1.5">
              <h3 className="font-black text-sm flex items-center gap-2">
                <Target size={16} className="text-[var(--primary)]" /> مهمتنا
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-loose">
                ربط التكنولوجيا بالاقتصاد الدائري لخلق حلول عملية تعيد الموارد إلى دورة الاستخدام.
              </p>
            </div>
          </div>

          <div className="bg-[#052e08] text-white rounded-2xl p-5 md:p-6 space-y-4">
            <div className="text-center space-y-1">
              <h3 className="font-black text-sm">تواصل معنا</h3>
              <p className="text-white/60 text-xs">يسعدنا تواصلك معنا عبر الهاتف أو منصات التواصل الاجتماعي</p>
            </div>
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-2">
              {PHONES.map(phone => (
                <a
                  key={phone}
                  href={`tel:${phone}`}
                  dir="ltr"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-[#22c55e] focus-visible:bg-[#22c55e] active:bg-[#16a34a] border border-white/10 hover:border-transparent px-4 py-2 rounded-xl text-xs font-bold transition-colors min-w-0 break-all"
                >
                  <Phone size={14} className="shrink-0" />
                  {phone}
                </a>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {SOCIALS.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`ReNova على ${s.label}`}
                  title={s.label}
                  className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center hover:bg-[#22c55e] hover:border-transparent hover:-translate-y-0.5 focus-visible:bg-[#22c55e] active:translate-y-0 active:bg-[#16a34a] transition-all"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] justify-center pt-2 border-t border-[var(--border)]">
            <ShieldCheck size={14} className="text-[var(--primary)]" />
            منصة ذكية لإدارة وإعادة توظيف المخلفات الإلكترونية
            <Award size={14} className="text-[var(--primary)]" />
          </div>
        </div>

        <div className="p-6 border-t border-[var(--border)] bg-[var(--bg-item)]/50 flex justify-center shrink-0">
          <button onClick={onClose} className="bg-[#0a3d0f] hover:bg-[#052e08] text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0">
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
