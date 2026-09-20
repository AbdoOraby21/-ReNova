import React from 'react';
import { Recycle } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'default' | 'footer' | 'light';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = true, variant = 'default' }) => {
  const sizes = {
    sm: { container: 'h-9 w-9', text: 'text-[1.05rem]', icon: 20 },
    md: { container: 'h-10 w-10', text: 'text-xl', icon: 24 },
    lg: { container: 'h-14 w-14', text: 'text-2xl', icon: 32 },
    xl: { container: 'h-20 w-20', text: 'text-3xl', icon: 44 },
  };

  const s = sizes[size];

  // Green rounded square app-icon container with centered white recycling symbol
  // Only the recycling symbol rotates slowly clockwise; the green shape stays static
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`relative shrink-0 overflow-hidden rounded-xl bg-[#052e08] ring-1 ring-white/10 shadow-sm flex items-center justify-center ${s.container}`}
        aria-hidden="true"
      >
        <Recycle
          size={s.icon}
          strokeWidth={2}
          className="text-white animate-spin-slow shrink-0"
          style={{ transformOrigin: 'center' }}
          aria-label="Recycling symbol"
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
