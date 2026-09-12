import React from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  Recycle, 
  BatteryCharging, 
  Car, 
  Sun, 
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { AssessmentRecord } from '../types';

interface LifecycleTimelineProps {
  battery: AssessmentRecord;
}

export const LifecycleTimeline: React.FC<LifecycleTimelineProps> = ({ battery }) => {
  const mfgYear = battery.manufacturingYear || 2024;
  const firstLifeRange = `${mfgYear}–2026`;
  const recommendation = battery.recommendation || 'Solar Storage';

  const stages = [
    {
      id: 'mfg',
      year: `${mfgYear}`,
      title: 'MANUFACTURED',
      subtitle: 'OEM Pack Integration',
      description: `Factory fresh cell assembly. 48V nominal voltage, ${battery.originalCapacity} Ah rating.`,
      icon: BatteryCharging,
      status: 'completed',
      isFuture: false,
    },
    {
      id: 'first-life',
      year: firstLifeRange,
      title: 'FIRST LIFE',
      subtitle: battery.currentApplication || 'Electric Vehicle',
      description: `Active duty in commercial transport. Accumulated ${battery.cycleCount.toLocaleString()} operating cycles.`,
      icon: Car,
      status: 'completed',
      isFuture: false,
    },
    {
      id: 'assessment',
      year: '2026',
      title: 'RELIFE AI ASSESSMENT',
      subtitle: `SOH ${battery.soh}% • Score ${battery.relifeScore}/100`,
      description: `Electrochemical impedance and capacity retention certified. Ranked as ${battery.classification}.`,
      icon: ShieldCheck,
      status: 'current',
      isFuture: false,
    },
    {
      id: 'second-life',
      year: '2026+',
      title: 'POTENTIAL SECOND LIFE',
      subtitle: recommendation,
      description: `Repurposed for stationary buffering. Estimated service life: ${battery.estimatedExtendedYears || '+7 to 9 Years'}.`,
      icon: Sun,
      status: 'projected',
      isFuture: true,
    },
    {
      id: 'recovery',
      year: 'FUTURE',
      title: 'MATERIAL RECOVERY',
      subtitle: 'Closed-Loop Recycling',
      description: `Hydrometallurgical extraction of critical minerals (${battery.chemistry === 'LFP' ? 'Lithium, Iron & Phosphate' : 'Nickel, Cobalt & Lithium'}).`,
      icon: Recycle,
      status: 'projected',
      isFuture: true,
    },
  ];

  return (
    <div className="space-y-4" id="battery-lifecycle-timeline">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-400" />
          Battery Circular Lifecycle Timeline
        </h3>
        <span className="text-[11px] font-mono text-slate-400">
          ISO 14040/44 Chain-of-Custody
        </span>
      </div>

      {/* Responsive Horizontal / Vertical Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 relative">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isLast = idx === stages.length - 1;

          return (
            <div 
              key={stage.id}
              className={`relative rounded-2xl p-4 transition-all duration-300 flex flex-col justify-between ${
                stage.status === 'completed'
                  ? 'bg-slate-900/80 border border-slate-800'
                  : stage.status === 'current'
                  ? 'bg-gradient-to-b from-[#0F2625] to-[#0A1624] border-2 border-emerald-400/90 shadow-lg shadow-emerald-950/50'
                  : 'bg-[#080E1C]/60 border border-dashed border-teal-500/40 hover:border-teal-400/70'
              }`}
            >
              {/* Connector line on desktop */}
              {!isLast && (
                <div 
                  className={`hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-3 h-[2px] ${
                    stage.isFuture ? 'border-t-2 border-dashed border-teal-500/40' : 'bg-emerald-500/50'
                  }`} 
                />
              )}

              <div>
                {/* Header Tag / Year & Stage Type */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-xs font-mono font-black tracking-tight px-2 py-0.5 rounded ${
                    stage.isFuture 
                      ? 'bg-teal-500/10 text-teal-300 border border-teal-500/20' 
                      : stage.status === 'current'
                      ? 'bg-emerald-500 text-slate-950 font-extrabold'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {stage.year}
                  </span>

                  {stage.isFuture ? (
                    <span className="text-[9px] font-mono uppercase tracking-wider text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/20 font-semibold flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      Projected
                    </span>
                  ) : stage.status === 'current' ? (
                    <span className="text-[9px] font-mono uppercase tracking-wider text-emerald-300 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      Active
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      Verified
                    </span>
                  )}
                </div>

                {/* Icon & Stage Title */}
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                    stage.status === 'current' 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : stage.isFuture
                      ? 'bg-teal-500/10 text-teal-400'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <h4 className={`text-xs font-bold tracking-tight ${
                    stage.status === 'current' ? 'text-white' : stage.isFuture ? 'text-teal-200' : 'text-slate-200'
                  }`}>
                    {stage.title}
                  </h4>
                </div>

                {/* Subtitle */}
                <div className={`text-[11px] font-medium mb-2 ${
                  stage.status === 'current' ? 'text-emerald-300 font-mono' : 'text-slate-400'
                }`}>
                  {stage.subtitle}
                </div>

                {/* Description */}
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {stage.description}
                </p>
              </div>

              {/* Status footer for future vs verified */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                <span className={stage.isFuture ? 'text-teal-400 italic' : 'text-slate-400'}>
                  {stage.isFuture ? 'Estimated Stage' : 'Logged & Sealed'}
                </span>
                {stage.status === 'completed' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                {stage.status === 'current' && <Zap className="w-3 h-3 text-emerald-400 fill-emerald-400" />}
                {stage.isFuture && <Sparkles className="w-3 h-3 text-teal-400" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
