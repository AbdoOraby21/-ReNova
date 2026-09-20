import React from 'react';
import { Leaf, Recycle, Heart, ShieldCheck, Sparkles, Award, Globe, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../components/common/Logo';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-l from-[#0a3d0f] via-[#052e08] to-[#021a04] px-8 py-12 md:py-16 text-white border border-white/10">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/carbon-fibre.png")` }} />
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#16a34a]/20 rounded-full blur-3xl" />
        <div className="relative flex flex-col items-center text-center gap-5">
          <div className="bg-white rounded-2xl p-2.5 ring-1 ring-white/20 shadow-xl">
            <Logo size="lg" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black flex items-center gap-3">
            <Leaf className="text-[#22c55e]" /> من نحن
          </h1>
          <p className="text-white/70 text-sm tracking-widest uppercase">E-Waste Recycling for a Greener Tomorrow</p>
        </div>
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[2rem] p-6 md:p-10 space-y-8 shadow-xl">
        <div className="space-y-4">
          <h2 className="text-xl font-black flex items-center gap-2">
            <Sparkles size={20} className="text-[var(--primary)]" /> قصتنا
          </h2>
          <p className="text-[var(--text-muted)] leading-relaxed text-[15px] bg-[var(--bg-item)] border border-[var(--border)] rounded-2xl p-6">
            We are <span className="font-black text-[var(--primary)]">Renova</span>, dedicated to promoting sustainability and environmental protection by recycling materials, reducing waste, and creating high-quality, handcrafted eco-friendly products and accessories.
          </p>
          <p className="text-[var(--text-muted)] leading-relaxed text-[15px]">
            نحن <span className="font-black text-[var(--primary)]">رينوفا</span> — منصة رائدة تسعى لنشر ثقافة الاستدامة وحماية البيئة من خلال إعادة تدوير الخامات، تقليل النفايات، وتحويلها إلى منتجات وإكسسوارات صديقة للبيئة عالية الجودة ومصنوعة يدوياً بعناية. نؤمن بأن كل قطعة خردة يمكن أن تتحول إلى منتج يروي قصة، وكل عملية شراء مستدامة هي خطوة نحو كوكب أنظف.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: Recycle, title: 'إعادة التدوير الذكي', desc: 'نجمع الخردة من الأفراد والشركات ونعيد تدويرها بطرق مبتكرة لتقليل النفايات.' },
            { icon: Heart, title: 'صناعة يدوية بجودة', desc: 'كل منتج مصنوع يدوياً بعناية فائقة ليجمع بين الجمال والمتانة.' },
            { icon: Globe, title: 'التزام بالاستدامة', desc: 'نساهم في بناء اقتصاد دائري ومستقبل أكثر اخضراراً للأجيال القادمة.' },
          ].map(f => (
            <div key={f.title} className="bg-[var(--bg-item)] border border-[var(--border)] rounded-2xl p-6 text-center space-y-3 hover:border-[var(--primary)]/20 hover:bg-[var(--primary-soft)] transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#0a3d0f] text-white flex items-center justify-center mx-auto">
                <f.icon size={20} />
              </div>
              <h3 className="font-bold">{f.title}</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#052e08] text-white rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-[#22c55e]" />
            <span className="text-sm">انضم لآلاف العملاء الذين يختارون الاستدامة مع رينوفا</span>
            <Award className="text-[#22c55e] hidden md:block" />
          </div>
          <Link to="/" className="bg-white text-[#052e08] hover:bg-[#22c55e] hover:text-white px-6 py-2.5 rounded-xl font-bold transition-colors flex items-center gap-2 shrink-0">
            تصفح المنتجات <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
