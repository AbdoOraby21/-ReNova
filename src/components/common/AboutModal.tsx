import React, { useEffect } from 'react';
import { X, Leaf, Recycle, Heart, ShieldCheck, Sparkles, Award, Globe } from 'lucide-react';
import Logo from './Logo';

interface AboutModalProps {
  open: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ open, onClose }) => {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
              <p className="text-white/70 text-sm mt-1">E-Waste Recycling for a Greener Tomorrow</p>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto p-6 md:p-8 space-y-6 scrollbar-hide">
          <div className="space-y-4">
            <h3 className="text-lg font-black flex items-center gap-2 text-[var(--text-main)]">
              <Sparkles size={18} className="text-[var(--primary)]" /> قصتنا
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed text-[15px] bg-[var(--bg-item)] border border-[var(--border)] rounded-2xl p-5">
              We are <span className="font-black text-[var(--primary)]">Renova</span>, dedicated to promoting sustainability and environmental protection by recycling materials, reducing waste, and creating high-quality, handcrafted eco-friendly products and accessories.
            </p>
            <p className="text-[var(--text-muted)] leading-relaxed text-[15px]">
              نحن <span className="font-black text-[var(--primary)]">رينوفا</span> — منصة رائدة تسعى لنشر ثقافة الاستدامة وحماية البيئة من خلال إعادة تدوير الخامات، تقليل النفايات، وتحويلها إلى منتجات وإكسسوارات صديقة للبيئة عالية الجودة ومصنوعة يدوياً بعناية.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { icon: Recycle, title: 'إعادة التدوير', desc: 'نحوّل الخردة إلى قيمة' },
              { icon: Heart, title: 'صناعة يدوية', desc: 'جودة وحرفية عالية' },
              { icon: Globe, title: 'استدامة', desc: 'مستقبل أنظف للجميع' },
            ].map((f) => (
              <div key={f.title} className="bg-[var(--bg-item)] border border-[var(--border)] rounded-2xl p-4 text-center space-y-2 hover:border-[var(--primary)]/20 hover:bg-[var(--primary-soft)] transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#0a3d0f] text-white flex items-center justify-center mx-auto">
                  <f.icon size={18} />
                </div>
                <h4 className="font-bold text-sm">{f.title}</h4>
                <p className="text-xs text-[var(--text-muted)]">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] justify-center pt-2 border-t border-[var(--border)]">
            <ShieldCheck size={14} className="text-[var(--primary)]" />
            منصة ذكية لبيع وشراء الخردة والمنتجات المعاد تدويرها
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
