import React from 'react';
const logoImg = '/logo.jpeg';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'default' | 'footer' | 'light';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = true, variant = 'default' }) => {
  const sizes = {
    sm: { container: 'h-9', img: 'h-9', text: 'text-[1.05rem]' },
    md: { container: 'h-10', img: 'h-10', text: 'text-xl' },
    lg: { container: 'h-14', img: 'h-14', text: 'text-2xl' },
    xl: { container: 'h-20', img: 'h-20', text: 'text-3xl' },
  };

  const s = sizes[size];

  // For header / branding we show the official logo image preserving proportions
  // logo.jpeg has dark green background, so we wrap with rounded overflow and subtle ring
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`relative shrink-0 overflow-hidden rounded-xl bg-[#052e08] ring-1 ring-white/10 shadow-sm flex items-center justify-center ${s.container} aspect-[1.15] sm:aspect-auto`}
        style={{ minWidth: size === 'sm' ? 42 : size === 'md' ? 52 : size === 'lg' ? 68 : 84 }}
      >
        <img
          src={logoImg}
          alt="ReNova - E-Waste Recycling for a Greener Tomorrow"
          className={`w-full h-full object-contain object-center ${s.img}`}
          loading="eager"
          decoding="async"
        />
      </div>
      {showText && (
        <div className="flex flex-col items-start leading-none">
          <span className={`font-black tracking-tight ${s.text} ${variant === 'light' ? 'text-white' : 'text-[var(--text-main)]'}`}>
            Re<span className="text-[var(--primary)]">Nova</span>
          </span>
          {size !== 'sm' && (
            <span className="text-[10px] font-medium tracking-widest uppercase text-[var(--text-muted)] -mt-0.5 hidden sm:block">
              E-Waste Recycling
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
