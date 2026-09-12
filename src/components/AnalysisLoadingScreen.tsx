import React, { useState, useEffect } from 'react';
import { 
  Battery, 
  CheckCircle2, 
  Activity, 
  Search, 
  Layers, 
  Sparkles, 
  Zap, 
  Cpu
} from 'lucide-react';

interface AnalysisLoadingScreenProps {
  batteryId: string;
  onComplete: () => void;
}

const ANALYSIS_STEPS = [
  { id: 1, message: 'Reading battery data...', icon: Activity },
  { id: 2, message: 'Evaluating health indicators...', icon: Battery },
  { id: 3, message: 'Estimating second-life potential...', icon: Zap },
  { id: 4, message: 'Matching applications...', icon: Search },
  { id: 5, message: 'Generating ReLife Score...', icon: Sparkles },
];

export const AnalysisLoadingScreen: React.FC<AnalysisLoadingScreenProps> = ({
  batteryId,
  onComplete,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(10);

  useEffect(() => {
    // Total duration: 3.6 seconds (~600ms per step across 6 steps)
    const stepDuration = 600;
    
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < ANALYSIS_STEPS.length - 1) {
          const nextIndex = prev + 1;
          setProgressPercent(Math.round(((nextIndex + 1) / ANALYSIS_STEPS.length) * 100));
          return nextIndex;
        } else {
          clearInterval(interval);
          setProgressPercent(100);
          // Wait briefly at 100% before triggering completion
          setTimeout(() => {
            onComplete();
          }, 350);
          return prev;
        }
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, [onComplete]);

  const activeStep = ANALYSIS_STEPS[currentStepIndex];

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#080E1E]/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
      id="analysis-loading-screen"
    >
      <div className="max-w-lg w-full bg-[#0C152A] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/50 relative overflow-hidden text-center">
        
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Central Animated Scanner Graphic */}
        <div className="relative w-28 h-28 mx-auto mb-6 flex items-center justify-center">
          {/* Outer rotating dashed ring */}
          <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30 border-dashed animate-[spin_6s_linear_infinite]" />
          
          {/* Middle counter-rotating ring */}
          <div className="absolute inset-2 rounded-full border border-teal-400/40 border-t-transparent border-b-transparent animate-[spin_3s_linear_infinite_reverse]" />
          
          {/* Inner pulse ring */}
          <div className="absolute inset-4 rounded-full bg-emerald-500/10 border border-emerald-500/50 animate-pulse" />

          {/* Central Battery Icon */}
          <div className="relative z-10 w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-inner">
            <Battery className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        {/* Battery Target Info */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 mb-4">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Analyzing Pack: <strong className="text-white">{batteryId || 'RL-EV-001'}</strong></span>
        </div>

        {/* Primary Animated Message */}
        <div className="min-h-[44px] flex items-center justify-center mb-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight transition-all duration-300 flex items-center justify-center gap-2">
            <span className="text-emerald-400">⚡</span>
            <span>{activeStep.message}</span>
          </h2>
        </div>

        {/* Progress Bar with Percentage */}
        <div className="space-y-2 mb-8">
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span>Diagnostic Engine</span>
            <span className="text-emerald-400 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Sequential Checklist of Steps */}
        <div className="space-y-2.5 text-left border-t border-slate-800 pt-5">
          {ANALYSIS_STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            
            return (
              <div 
                key={step.id} 
                className={`flex items-center justify-between text-xs transition-colors duration-200 ${
                  isCurrent 
                    ? 'text-emerald-300 font-semibold pl-1 border-l-2 border-emerald-400' 
                    : isCompleted 
                    ? 'text-slate-400' 
                    : 'text-slate-600'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : isCurrent ? (
                    <div className="w-4 h-4 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                  )}
                  <span>{step.message}</span>
                </div>

                <span className="text-[10px] font-mono">
                  {isCompleted && <span className="text-emerald-400 font-medium">Verified</span>}
                  {isCurrent && <span className="text-amber-400 animate-pulse">Running</span>}
                  {!isCompleted && !isCurrent && <span className="text-slate-600">Pending</span>}
                </span>
              </div>
            );
          })}
        </div>

        {/* Bottom System Tag & Safety Label */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col items-center gap-1.5">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider uppercase font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            AI-ASSISTED PROTOTYPE ESTIMATE
          </span>
          <p className="text-[10px] text-slate-500 font-mono">
            Professional diagnostics are required before real-world deployment.
          </p>
        </div>
      </div>
    </div>
  );
};
