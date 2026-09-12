import React from 'react';
import { 
  ArrowRight, 
  Zap, 
  ShoppingBag, 
  Sparkles, 
  ShieldCheck, 
  Activity,
  Layers,
  ChevronRight
} from 'lucide-react';
import { LifecycleVisual } from './LifecycleVisual';
import { ModalType } from './InteractiveModals';

interface HeroSectionProps {
  onOpenModal: (type: ModalType) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenModal }) => {
  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
      {/* Background Ambience & Engineering Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(#10B981 0.75px, transparent 0.75px), radial-gradient(#0D9488 0.75px, #0A0F1D 0.75px)`,
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 20px 20px',
        }}
      />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-center lg:text-left">
            
            {/* Stage/Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D182E] border border-emerald-500/30 text-emerald-400 text-xs font-medium backdrop-blur-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Climate-Tech & AI Battery Intelligence</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300 font-mono text-[11px]">v1.0 Stage</span>
            </div>

            {/* Main Prompt-Specified Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Give Every Battery <br className="hidden sm:inline" />
              <span className="text-emerald-400 drop-shadow-[0_0_24px_rgba(16,185,129,0.35)]">
                a Second Life.
              </span>
            </h1>

            {/* Prompt-Specified Subheading */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              AI-powered battery lifecycle intelligence that determines what a battery should become next.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={() => onOpenModal('analyze')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/35 hover:-translate-y-0.5 flex items-center justify-center gap-2.5 cursor-pointer"
                id="hero-analyze-battery-button"
              >
                <Zap className="w-4 h-4 fill-current" />
                Analyze a Battery
              </button>

              <button
                onClick={() => {
                  const el = document.querySelector('#marketplace');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else onOpenModal('marketplace');
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#0E172C] hover:bg-[#13203C] text-white font-semibold text-sm transition-all border border-slate-700/80 hover:border-slate-600 flex items-center justify-center gap-2.5 cursor-pointer"
                id="hero-explore-marketplace-button"
              >
                <ShoppingBag className="w-4 h-4 text-teal-400" />
                Explore Marketplace
              </button>
            </div>

            {/* Trust & Engineering Badges */}
            <div className="pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-2 sm:gap-4 text-left max-w-lg mx-auto lg:mx-0">
              <div className="space-y-0.5">
                <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider block">
                  Chemistry Agnostic
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-200">
                  LFP, NMC & NCA
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider block">
                  Characterization
                </span>
                <span className="text-xs sm:text-sm font-bold text-emerald-400">
                  EIS & ML Health
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider block">
                  Traceability
                </span>
                <span className="text-xs sm:text-sm font-bold text-teal-300">
                  Passport Ready
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Circular Lifecycle Visualization */}
          <div className="lg:col-span-6 flex justify-center">
            <LifecycleVisual />
          </div>

        </div>
      </div>
    </section>
  );
};
