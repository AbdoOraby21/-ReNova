import React, { useState } from 'react';
import { Recycle } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'default' | 'footer' | 'light';
  imgSrc?: string;
}

const LOGO_SRC = '/logo.jpeg';

const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  variant = 'default',
  imgSrc = LOGO_SRC,
}) => {
  const [imgFailed, setImgFailed] = useState(false);

  // Responsive container: slightly smaller on mobile, larger on md+ screens.
  // Square crop of the portrait logo.jpeg — object-position biased upward
  // so the white recycling mark stays visible in the crop.
  const sizes = {
    sm: { container: 'h-8 w-8 md:h-9 md:w-9', text: 'text-[1.05rem]', icon: 18 },
    md: { container: 'h-9 w-9 md:h-10 md:w-10', text: 'text-xl', icon: 22 },
    lg: { container: 'h-12 w-12 md:h-14 md:w-14', text: 'text-2xl', icon: 30 },
    xl: { container: 'h-16 w-16 md:h-20 md:w-20', text: 'text-3xl', icon: 40 },
  };

  const s = sizes[size];
  const showFallbackIcon = imgFailed || !imgSrc;

  return (
    <div className={`flex items-center gap-2.5 md:gap-3 ${className}`}>
      <div
        className={`relative shrink-0 overflow-hidden rounded-xl bg-[#052e08] ring-1 ring-white/10 shadow-sm flex items-center justify-center ${s.container}`}
      >
        {showFallbackIcon ? (
          <Recycle
            size={s.icon}
            strokeWidth={2}
            className="text-white shrink-0"
            aria-label="Recycling symbol"
          />
        ) : (
          <img
            src={imgSrc}
            alt="ReNova — E-Waste Recycling for a Greener Tomorrow"
            loading="eager"
            decoding="async"
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover"
            style={{ objectPosition: 'center 38%' }}
          />
        )}
      </div>
      {showText && (
        <div className="flex flex-col items-start leading-none">
          <span
            className={`font-black tracking-tight ${s.text} ${
              variant === 'light' ? 'text-white' : 'text-[var(--text-main)]'
            }`}
          >
            Re<span className="text-[var(--primary)]">Nova</span>
          </span>
          {size !== 'sm' && (
            <span className="text-[10px] font-medium tracking-widest uppercase text-[var(--text-muted)] mt-0.5 hidden sm:block">
              E-Waste Recycling
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
