import React, { useEffect, useState } from 'react';

interface CircularScoreIndicatorProps {
  score: number;
  maxScore?: number;
  classification: string;
  size?: number;
}

export const CircularScoreIndicator: React.FC<CircularScoreIndicatorProps> = ({
  score,
  maxScore = 100,
  classification,
  size = 190,
}) => {
  const [animatedScore, setAnimatedScore] = useState<number>(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1400; // 1.4s smooth animation
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Smooth cubic ease-out
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.round(easeOut * score);
      setAnimatedScore(currentVal);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [score]);

  const strokeWidth = 12;
  const center = size / 2;
  const radius = center - strokeWidth - 6;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / maxScore) * circumference;

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <div className="relative" style={{ width: size, height: size }}>
        
        {/* SVG Circular Gauge */}
        <svg 
          width={size} 
          height={size} 
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          <defs>
            <linearGradient id="scoreEmeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="60%" stopColor="#14B8A6" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
            <filter id="scoreGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#1E293B"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
          />

          {/* Animated Glowing Progress Stroke */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="url(#scoreEmeraldGradient)"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            filter="url(#scoreGlow)"
            className="transition-all duration-75 ease-out"
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-semibold mb-0.5">
            ReLife Score
          </span>
          
          <div className="flex items-baseline justify-center gap-1 leading-none my-0.5">
            <span 
              className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight"
              id="relife-animated-score-value"
            >
              {animatedScore}
            </span>
            <span className="text-xs font-mono font-bold text-slate-400">
              / {maxScore}
            </span>
          </div>

          <span className="text-[10px] text-emerald-400 font-mono font-medium">
            AI Scored
          </span>
        </div>
      </div>

      {/* Classification Tag below the circle */}
      <div className="mt-3">
        <span 
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold text-xs tracking-wide shadow-sm"
          id="relife-score-classification-badge"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {classification}
        </span>
      </div>
    </div>
  );
};
