import React from 'react';
import { 
  Cpu, 
  GitFork, 
  FileCheck2, 
  Store, 
  ArrowRight, 
  Zap, 
  ShieldAlert, 
  Sparkles,
  Layers,
  BarChart3
} from 'lucide-react';
import { ModalType } from './InteractiveModals';

interface FeaturesSectionProps {
  onOpenModal: (type: ModalType) => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ onOpenModal }) => {
  const features = [
    {
      id: 'analysis',
      number: '01',
      title: 'AI Battery Analysis',
      description: 'Analyze battery data and estimate lifecycle potential.',
      detail: 'Rapid diagnostic algorithms process voltage relaxation curves, internal resistance, and state-of-health (SOH) within seconds.',
      icon: Cpu,
      color: '#10B981',
      accentBg: 'rgba(16, 185, 129, 0.12)',
      badge: 'Neural SOH Engine',
      actionLabel: 'Test Diagnostic Model',
      modalToOpen: 'analyze' as ModalType,
    },
    {
      id: 'matching',
      number: '02',
      title: 'Second-Life Matching',
      description: 'Identify potential next applications.',
      detail: 'Intelligently routes retired automotive modules to optimal use cases—such as stationary solar BESS, backup UPS, or low-speed vehicles.',
      icon: GitFork,
      color: '#14B8A6',
      accentBg: 'rgba(20, 184, 166, 0.12)',
      badge: 'Multimodal Routing',
      actionLabel: 'Explore Matching Matrix',
      modalToOpen: 'analyze' as ModalType,
    },
    {
      id: 'passport',
      number: '03',
      title: 'Digital Battery Passport',
      description: 'Track battery lifecycle information.',
      detail: 'Maintains tamper-evident cryptographic records of carbon footprint, origin, chemistry, and remaining health compliance.',
      icon: FileCheck2,
      color: '#06B6D4',
      accentBg: 'rgba(6, 182, 212, 0.12)',
      badge: 'EU Compliance Ready',
      actionLabel: 'Inspect Sample Passport',
      modalToOpen: 'passport' as ModalType,
    },
    {
      id: 'marketplace',
      number: '04',
      title: 'Circular Marketplace',
      description: 'Connect batteries with potential second-life buyers.',
      detail: 'A transparent B2B trading floor connecting EV fleet operators with renewable energy developers and certified repurposers.',
      icon: Store,
      color: '#10B981',
      accentBg: 'rgba(16, 185, 129, 0.12)',
      badge: 'Verified B2B Liquidity',
      actionLabel: 'Browse Available Lots',
      modalToOpen: 'marketplace' as ModalType,
    },
  ];

  return (
    <section id="product" className="py-20 bg-[#080D1A] relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            CORE CAPABILITIES
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Intelligence Layer for the Circular Battery Economy
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Eliminating guesswork for retired EV battery packs with physics-informed machine learning and transparent market infrastructure.
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="group relative bg-[#0C1427] hover:bg-[#0F1932] border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between shadow-xl shadow-black/30 hover:-translate-y-1"
                id={`feature-card-${item.id}`}
              >
                {/* Top Badge & Number */}
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className="p-3 rounded-xl transition-transform group-hover:scale-110 duration-300"
                      style={{ backgroundColor: item.accentBg }}
                    >
                      <Icon className="w-6 h-6" style={{ color: item.color }} />
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-500">
                      {item.number}
                    </span>
                  </div>

                  {/* Feature Title & Primary Description */}
                  <div className="space-y-2 mb-3">
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm font-semibold text-emerald-400/90 leading-snug">
                      {item.description}
                    </p>
                  </div>

                  {/* Detailed Explanation */}
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    {item.detail}
                  </p>
                </div>

                {/* Bottom Action / Tag */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between mt-auto">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">
                    {item.badge}
                  </span>
                  <button
                    onClick={() => onOpenModal(item.modalToOpen)}
                    className="text-xs font-semibold text-emerald-400 group-hover:text-emerald-300 flex items-center gap-1 cursor-pointer transition-transform group-hover:translate-x-0.5"
                  >
                    {item.actionLabel}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
