import React, { useState, useEffect } from 'react';
import { 
  Car, 
  Cpu, 
  RefreshCw, 
  SunMedium, 
  Recycle, 
  Zap, 
  Activity, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface StageInfo {
  id: string;
  name: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  metricLabel: string;
  metricValue: string;
  status: string;
  angle: number; // in degrees for circular position
  color: string;
  accentBg: string;
}

const LIFECYCLE_STAGES: StageInfo[] = [
  {
    id: 'ev',
    name: 'Electric Vehicle',
    shortLabel: 'EV Pack',
    icon: Car,
    description: 'Automotive battery pack retires from EV after reaching ~75–80% original capacity.',
    metricLabel: 'Typical SOH',
    metricValue: '75% – 82%',
    status: 'Primary Life Complete',
    angle: 270, // Top
    color: '#38BDF8',
    accentBg: 'rgba(56, 189, 248, 0.12)',
  },
  {
    id: 'assessment',
    name: 'AI Assessment',
    shortLabel: 'AI Diagnostic',
    icon: Cpu,
    description: 'Electrochemical impedance spectroscopy and machine learning predict remaining useful life (RUL).',
    metricLabel: 'Diagnostic Accuracy',
    metricValue: '99.2%',
    status: 'Rapid Characterization',
    angle: 342, // Top-right
    color: '#10B981',
    accentBg: 'rgba(16, 185, 129, 0.15)',
  },
  {
    id: 'second-life',
    name: 'Second Life',
    shortLabel: 'Repurposing',
    icon: RefreshCw,
    description: 'Graded cells are reconditioned, balanced, and packaged with digital battery passport certification.',
    metricLabel: 'Carbon Avoided',
    metricValue: '4.8 tCO₂e / MWh',
    status: 'Cell-Level Sorting',
    angle: 54, // Bottom-right
    color: '#14B8A6',
    accentBg: 'rgba(20, 184, 166, 0.15)',
  },
  {
    id: 'solar-storage',
    name: 'Solar Storage',
    shortLabel: 'Solar BESS',
    icon: SunMedium,
    description: 'Repurposed stationary storage buffers clean solar power for microgrids and commercial sites for 8–10+ yrs.',
    metricLabel: 'Added Lifespan',
    metricValue: '+8 to 12 Yrs',
    status: 'Stationary Grid Buffering',
    angle: 126, // Bottom-left
    color: '#F59E0B',
    accentBg: 'rgba(245, 158, 11, 0.15)',
  },
  {
    id: 'recycling',
    name: 'Recycling',
    shortLabel: 'Closed Loop',
    icon: Recycle,
    description: 'At true end-of-life, hydrometallurgy extracts 95%+ lithium, nickel, and cobalt back to cathode precursor grade.',
    metricLabel: 'Material Recovery',
    metricValue: '96.5% Yield',
    status: 'Closed-Loop Circularity',
    angle: 198, // Top-left
    color: '#10B981',
    accentBg: 'rgba(16, 185, 129, 0.15)',
  },
];

export const LifecycleVisual: React.FC = () => {
  const [activeStageId, setActiveStageId] = useState<string>('assessment');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  // Auto rotate through stages slowly if user hasn't manually selected
  useEffect(() => {
    if (!autoRotate) return;
    const interval = setInterval(() => {
      setActiveStageId((prevId) => {
        const currentIndex = LIFECYCLE_STAGES.findIndex((s) => s.id === prevId);
        const nextIndex = (currentIndex + 1) % LIFECYCLE_STAGES.length;
        return LIFECYCLE_STAGES[nextIndex].id;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [autoRotate]);

  const activeStage = LIFECYCLE_STAGES.find((s) => s.id === activeStageId) || LIFECYCLE_STAGES[1];

  // Helper to calculate coordinates on circle radius (radius = 160)
  const getCoordinates = (deg: number, r: number) => {
    const rad = (deg * Math.PI) / 180;
    return {
      x: 220 + r * Math.cos(rad),
      y: 220 + r * Math.sin(rad),
    };
  };

  return (
    <div 
      className="relative w-full max-w-xl mx-auto flex flex-col items-center select-none"
      onMouseEnter={() => setAutoRotate(false)}
      onMouseLeave={() => setAutoRotate(true)}
    >
      {/* Background Aura */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none rounded-full" />

      {/* Main Circular Container */}
      <div className="relative w-[340px] h-[340px] sm:w-[440px] sm:h-[440px] flex items-center justify-center">
        
        {/* SVG Orbit and Flow Paths */}
        <svg
          viewBox="0 0 440 440"
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <defs>
            {/* Gradient definition for circular track */}
            <linearGradient id="orbit-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
              <stop offset="25%" stopColor="#14B8A6" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#0EA5E9" stopOpacity="0.6" />
              <stop offset="75%" stopColor="#F59E0B" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.8" />
            </linearGradient>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Concentric Decorative Tech Circles */}
          <circle
            cx="220"
            cy="220"
            r="205"
            fill="none"
            stroke="#1E293B"
            strokeWidth="1"
            strokeDasharray="3 6"
            className="opacity-40"
          />
          <circle
            cx="220"
            cy="220"
            r="160"
            fill="none"
            stroke="#334155"
            strokeWidth="1.5"
            className="opacity-60"
          />
          
          {/* Active Flow Orbit Track */}
          <circle
            cx="220"
            cy="220"
            r="160"
            fill="none"
            stroke="url(#orbit-grad)"
            strokeWidth="2.5"
            strokeDasharray="18 12"
            className="animate-spin-slow origin-center opacity-80"
          />

          {/* Inner Safety Halo */}
          <circle
            cx="220"
            cy="220"
            r="96"
            fill="#0B132B"
            stroke="#1E293B"
            strokeWidth="1.5"
          />

          {/* Connection Lines to Central Battery */}
          {LIFECYCLE_STAGES.map((st) => {
            const coords = getCoordinates(st.angle, 160);
            const isCurrent = st.id === activeStageId;
            return (
              <line
                key={`line-${st.id}`}
                x1="220"
                y1="220"
                x2={coords.x}
                y2={coords.y}
                stroke={isCurrent ? st.color : '#334155'}
                strokeWidth={isCurrent ? '2' : '1'}
                strokeDasharray={isCurrent ? 'none' : '4 4'}
                className="transition-colors duration-300"
                opacity={isCurrent ? 0.9 : 0.3}
              />
            );
          })}
        </svg>

        {/* Center: Interactive EV Battery Pack Module */}
        <div 
          className="relative z-10 w-36 h-36 sm:w-44 sm:h-44 rounded-2xl bg-gradient-to-b from-[#0F1D38] to-[#0A1124] border border-emerald-500/30 p-3 sm:p-4 flex flex-col justify-between shadow-2xl shadow-emerald-950/50 backdrop-blur-md group"
          id="center-ev-battery"
        >
          {/* Pack Header & Status Indicator */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-emerald-300 font-semibold">
                BMS LIVE
              </span>
            </div>
            <div className="px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 text-[9px] font-mono text-slate-300">
              64 kWh NMC
            </div>
          </div>

          {/* Battery Schematic Cells Visual */}
          <div className="my-1.5 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-emerald-400" />
                State of Health
              </span>
              <span className="font-mono text-emerald-400 font-bold">78.4%</span>
            </div>

            {/* 8-Cell Bank Progress Array */}
            <div className="grid grid-cols-8 gap-1 bg-slate-900/90 p-1.5 rounded-lg border border-slate-800">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={`h-4 rounded-sm transition-all duration-300 ${
                    i < 6 
                      ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]' 
                      : i === 6 
                      ? 'bg-emerald-500/60' 
                      : 'bg-slate-700/40'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Quick Real-Time Pathway Verdict */}
          <div className="bg-emerald-950/40 border border-emerald-500/20 rounded-lg px-2 py-1 flex items-center justify-between">
            <span className="text-[9px] text-emerald-300/80">Path:</span>
            <span className="text-[10px] font-semibold text-emerald-300 truncate font-mono">
              BESS Solar Grid
            </span>
          </div>
        </div>

        {/* 5 Outer Orbital Lifecycle Stage Nodes */}
        {LIFECYCLE_STAGES.map((stage) => {
          const isSelected = stage.id === activeStageId;
          const coords = getCoordinates(stage.angle, 160);
          const Icon = stage.icon;

          return (
            <button
              key={stage.id}
              onClick={() => {
                setActiveStageId(stage.id);
                setAutoRotate(false);
              }}
              aria-label={`Select stage: ${stage.name}`}
              className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-all duration-300 ${
                isSelected ? 'scale-110 z-30' : 'hover:scale-105'
              }`}
              style={{
                left: `${(coords.x / 440) * 100}%`,
                top: `${(coords.y / 440) * 100}%`,
              }}
            >
              <div
                className={`relative flex items-center justify-center w-11 h-11 sm:w-13 sm:h-13 rounded-xl transition-all duration-300 ${
                  isSelected
                    ? 'bg-slate-900 border-2 shadow-lg'
                    : 'bg-[#0B1328] border border-slate-700/80 hover:border-slate-500'
                }`}
                style={{
                  borderColor: isSelected ? stage.color : undefined,
                  boxShadow: isSelected ? `0 0 20px ${stage.color}55` : undefined,
                }}
              >
                <Icon
                  className="w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300"
                  style={{ color: isSelected ? stage.color : '#94A3B8' }}
                />

                {/* Sub-label badge beneath node */}
                <div
                  className={`absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 py-0.5 rounded text-[10px] font-medium transition-all ${
                    isSelected
                      ? 'bg-slate-800 text-white border border-slate-700 shadow-sm font-semibold'
                      : 'text-slate-400 opacity-80 group-hover:opacity-100'
                  }`}
                >
                  {stage.shortLabel}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Stage Detail Card under the visual */}
      <div className="w-full mt-8 bg-[#0D162B] border border-slate-800/90 rounded-xl p-4 sm:p-5 shadow-lg shadow-black/40 transition-all duration-300 relative overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-1 transition-all duration-500" 
          style={{ 
            backgroundColor: activeStage.color,
            width: `${((LIFECYCLE_STAGES.findIndex(s => s.id === activeStage.id) + 1) / LIFECYCLE_STAGES.length) * 100}%` 
          }} 
        />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div 
              className="p-2.5 rounded-lg shrink-0"
              style={{ backgroundColor: activeStage.accentBg }}
            >
              {React.createElement(activeStage.icon, {
                className: "w-5 h-5",
                style: { color: activeStage.color }
              })}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">
                  Stage 0{LIFECYCLE_STAGES.findIndex(s => s.id === activeStage.id) + 1}
                </span>
                <span className="text-slate-600">•</span>
                <h4 className="text-base font-bold text-white">
                  {activeStage.name}
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                  {activeStage.status}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md leading-relaxed">
                {activeStage.description}
              </p>
            </div>
          </div>

          {/* Metric Snapshot */}
          <div className="sm:border-l sm:border-slate-800 sm:pl-4 flex flex-row sm:flex-col justify-between sm:justify-center items-end sm:items-start shrink-0 bg-slate-900/60 sm:bg-transparent p-2 sm:p-0 rounded-lg">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider">
              {activeStage.metricLabel}
            </span>
            <span 
              className="text-lg font-mono font-bold"
              style={{ color: activeStage.color }}
            >
              {activeStage.metricValue}
            </span>
          </div>
        </div>

        {/* Step Progression Pips */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
          <span className="flex items-center gap-1 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Click any phase to inspect circular battery flow
          </span>
          <div className="flex items-center gap-1.5">
            {LIFECYCLE_STAGES.map((s) => (
              <button
                key={`pip-${s.id}`}
                onClick={() => {
                  setActiveStageId(s.id);
                  setAutoRotate(false);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  s.id === activeStageId 
                    ? 'w-6 bg-emerald-400' 
                    : 'w-2 bg-slate-700 hover:bg-slate-500'
                }`}
                title={s.name}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
