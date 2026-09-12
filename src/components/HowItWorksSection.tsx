import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  Binary, 
  GitCompare, 
  ZapOff, 
  SunMedium, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers
} from 'lucide-react';
import { ModalType } from './InteractiveModals';

interface HowItWorksProps {
  onOpenModal: (type: ModalType) => void;
}

export const HowItWorksSection: React.FC<HowItWorksProps> = ({ onOpenModal }) => {
  const [selectedStep, setSelectedStep] = useState<number>(1);

  const steps = [
    {
      number: '01',
      title: 'Assess',
      tagline: 'Rapid non-invasive diagnostic intake',
      icon: ClipboardCheck,
      color: '#38BDF8',
      summary: 'Automotive packs undergo non-invasive electrical and impedance characterization to capture live cell voltage spreads, internal resistance, and BMS logs.',
      keyPoints: [
        'Electrochemical impedance spectroscopy (EIS)',
        'Historical cycle count and depth-of-discharge logs',
        'Physical casing, thermal sensor, and harness integrity inspection'
      ],
      metricBadge: '< 5 Mins per Pack',
    },
    {
      number: '02',
      title: 'Analyze',
      tagline: 'Physics-informed neural degradation models',
      icon: Binary,
      color: '#10B981',
      summary: 'Our proprietary machine learning models compute the true State of Health (SOH), capacity fade trajectory, and remaining useful life (RUL) across diverse chemistries.',
      keyPoints: [
        'Remaining cycle life prediction within ±2.5% accuracy',
        'Cell-level imbalance and micro-short anomaly detection',
        'Thermal runaway safety risk scoring'
      ],
      metricBadge: '±2.5% SOH Accuracy',
    },
    {
      number: '03',
      title: 'Match',
      tagline: 'Automated pathway routing & grading',
      icon: GitCompare,
      color: '#14B8A6',
      summary: 'Based on degradation profiles, batteries are sorted into Grade A (Stationary Solar Storage), Grade B (Backup UPS / Telecom), or direct closed-loop material recycling.',
      keyPoints: [
        'Optimal economic & carbon avoidance calculation',
        'Instant pairing with verified commercial off-takers',
        'Digital Battery Passport minting with QR traceability'
      ],
      metricBadge: '4x Economic Upside',
    },
    {
      number: '04',
      title: 'Reuse',
      tagline: 'Stationary deployment & closed loop closure',
      icon: SunMedium,
      color: '#F59E0B',
      summary: 'Second-life packs are integrated into renewable energy microgrids and battery energy storage systems (BESS), extending pack life by 8 to 12 years before final recovery.',
      keyPoints: [
        'Buffers solar & wind generation for commercial sites',
        'Real-time cloud health monitoring during second life',
        'Automated end-of-life trigger for hydrometallurgical recycling'
      ],
      metricBadge: '+8–12 Years Extended',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-[#0A0F1D] relative border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-mono font-medium">
            <Layers className="w-3.5 h-3.5" />
            STANDARDIZED METHODOLOGY
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            A four-step closed-loop workflow transforming decommissioned mobility batteries into high-yield stationary energy assets.
          </p>
        </div>

        {/* 4 Steps Timeline Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          
          {/* Subtle connecting line across desktop */}
          <div className="hidden lg:block absolute top-12 left-12 right-12 h-0.5 bg-slate-800 pointer-events-none -z-0" />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = selectedStep === idx + 1;

            return (
              <div
                key={step.number}
                onClick={() => setSelectedStep(idx + 1)}
                className={`relative bg-[#0D162B] rounded-2xl p-6 border transition-all duration-300 cursor-pointer flex flex-col justify-between z-10 ${
                  isSelected
                    ? 'border-emerald-500 shadow-xl shadow-emerald-950/40 bg-[#0F1A34]'
                    : 'border-slate-800 hover:border-slate-700 hover:bg-[#0E182F]'
                }`}
                id={`how-it-works-step-${step.number}`}
              >
                <div>
                  {/* Step Number & Icon Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base transition-colors"
                      style={{
                        backgroundColor: isSelected ? step.color : '#1E293B',
                        color: isSelected ? '#0A0F1D' : '#94A3B8',
                      }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span 
                      className="font-mono text-2xl font-black tracking-tight"
                      style={{ color: isSelected ? step.color : '#475569' }}
                    >
                      {step.number}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-xl font-bold text-white mb-1">
                    {step.title}
                  </h3>
                  <p className="text-xs font-semibold text-emerald-400/90 mb-3">
                    {step.tagline}
                  </p>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {step.summary}
                  </p>
                </div>

                {/* Key Points Bullet List */}
                <div className="pt-4 border-t border-slate-800/80 space-y-2 mt-auto">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Performance</span>
                    <span className="text-white font-semibold">{step.metricBadge}</span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-slate-400">
                    {step.keyPoints.slice(0, 2).map((pt, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Deep-Dive Banner */}
        <div className="mt-10 p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#0D182E] to-teal-950/30 border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                Have retired battery packs ready for characterization?
              </h4>
              <p className="text-xs text-slate-300">
                Run our prototype assessment tool to obtain an estimated second-life viability score.
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenModal('analyze')}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20 whitespace-nowrap cursor-pointer flex items-center gap-1.5"
          >
            Launch Assessment Demo
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
