import React from 'react';

interface ReLifeLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  lightBackground?: boolean;
}

export const ReLifeLogo: React.FC<ReLifeLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  lightBackground = false,
}) => {
  const sizeMap = {
    sm: { icon: 28, text: 'text-lg', badge: 'text-[9px]' },
    md: { icon: 38, text: 'text-xl', badge: 'text-[10px]' },
    lg: { icon: 48, text: 'text-2xl', badge: 'text-xs' },
    xl: { icon: 64, text: 'text-3xl', badge: 'text-xs' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Precision Geometric SVG Mark */}
      <div 
        className="relative flex items-center justify-center transition-transform hover:scale-105 duration-300"
        style={{ width: currentSize.icon, height: currentSize.icon }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_0_12px_rgba(16,185,129,0.35)]"
        >
          <defs>
            {/* Electric Green to Emerald & Teal Gradients */}
            <linearGradient id="relife-primary-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="60%" stopColor="#059669" />
              <stop offset="100%" stopColor="#0D9488" />
            </linearGradient>

            <linearGradient id="relife-bolt-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>

            <linearGradient id="relife-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#14B8A6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#047857" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Background Dark Emblem Housing */}
          <rect
            x="4"
            y="4"
            width="92"
            height="92"
            rx="24"
            fill={lightBackground ? "#F1F5F9" : "#0D1527"}
            stroke={lightBackground ? "#CBD5E1" : "#1E293B"}
            strokeWidth="2"
          />

          {/* Outer Circular Lifecycle Track with Directional Break */}
          <path
            d="M 50 14 A 36 36 0 1 1 20 68"
            stroke="url(#relife-ring-grad)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="4 6"
          />

          {/* Circular Lifecycle Arrow Head at Top */}
          <path
            d="M 44 9 L 52 14 L 46 21"
            fill="none"
            stroke="#10B981"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* The Geometric 'R' Form with Integrated Lightning/Energy Surge */}
          {/* Vertical Stem with Subtle Energy Notch */}
          <path
            d="M 32 28 L 32 72 M 32 30 L 48 30"
            stroke={lightBackground ? "#0F172A" : "#FFFFFF"}
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Upper Bowl of the 'R' */}
          <path
            d="M 32 30 H 52 C 60 30 66 35 66 43 C 66 51 59 55 50 55 H 32"
            stroke="url(#relife-primary-grad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Diagonal Leg of the 'R' sculpted as an Energy/Lightning Bolt */}
          <path
            d="M 48 54 L 62 62 L 56 65 L 68 74"
            stroke="url(#relife-bolt-grad)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Micro Energy Spark Node */}
          <circle cx="68" cy="74" r="3" fill="#34D399" />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={`font-extrabold tracking-tight ${currentSize.text} ${
                lightBackground ? 'text-slate-900' : 'text-white'
              }`}
            >
              ReLife
            </span>
            <span className="font-extrabold tracking-tight text-emerald-400">
              AI
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-medium text-[9px] uppercase tracking-wider ml-1">
              BETA
            </span>
          </div>
          <span
            className={`font-medium tracking-wide uppercase text-[9px] mt-1 ${
              lightBackground ? 'text-slate-500' : 'text-slate-400'
            }`}
          >
            Battery Intelligence
          </span>
        </div>
      )}
    </div>
  );
};
