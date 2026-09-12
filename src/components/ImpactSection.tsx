import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Recycle, 
  Coins, 
  BatteryCharging, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowUpRight 
} from 'lucide-react';
import { ModalType } from './InteractiveModals';

interface ImpactSectionProps {
  onOpenModal: (type: ModalType) => void;
}

export const ImpactSection: React.FC<ImpactSectionProps> = ({ onOpenModal }) => {
  const stats = [
    {
      id: 'stat-assessed',
      value: '128+',
      label: 'Batteries Assessed',
      context: 'Multi-chemistry traction packs characterized',
      icon: BatteryCharging,
      color: '#38BDF8',
      growth: '+24 this month',
    },
    {
      id: 'stat-candidates',
      value: '42',
      label: 'Second-Life Candidates',
      context: 'Graded suitable for stationary BESS and microgrids',
      icon: TrendingUp,
      color: '#10B981',
      growth: '32.8% Conversion rate',
    },
    {
      id: 'stat-waste',
      value: '1,240 kg',
      label: 'Estimated Waste Diverted',
      context: 'Hazardous materials kept out of premature landfill / shredding',
      icon: Recycle,
      color: '#14B8A6',
      growth: '~6.2 metric tons CO₂e saved',
    },
    {
      id: 'stat-value',
      value: '₹8.26L',
      label: 'Estimated Value Recovered',
      context: 'Economic salvage unlocked for fleet owners & aggregators',
      icon: Coins,
      color: '#F59E0B',
      growth: '4.1x vs raw scrap price',
    },
  ];

  return (
    <section id="impact" className="py-20 bg-[#080E1C] relative border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-medium">
            <BarChart3 className="w-3.5 h-3.5" />
            MEASURABLE CIRCULAR IMPACT
          </div>

          {/* Prompt specified heading */}
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            From Battery Waste to Battery Value
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Quantifying the economic and ecological transition as automotive batteries are given a second mission.
          </p>

          {/* Prototype / Demo Label Flag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>Prototype / Demo Metrics: Benchmark numbers based on initial testing cohort</span>
          </div>
        </div>

        {/* 4 Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="bg-[#0D162B] border border-slate-800 hover:border-slate-700 rounded-2xl p-6 shadow-xl shadow-black/40 flex flex-col justify-between transition-all duration-300 relative group overflow-hidden"
                id={item.id}
              >
                {/* Subtle color highlight bar */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1 opacity-75 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: item.color }}
                />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div 
                      className="p-2.5 rounded-xl"
                      style={{ backgroundColor: `${item.color}15` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: item.color }} />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60">
                      DEMO DATA
                    </span>
                  </div>

                  {/* Big Metric Display */}
                  <div 
                    className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight mb-2"
                    style={{ color: item.color }}
                  >
                    {item.value}
                  </div>

                  {/* Primary Label */}
                  <h3 className="text-base font-bold text-white mb-2">
                    {item.label}
                  </h3>

                  {/* Context Note */}
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.context}
                  </p>
                </div>

                {/* Growth / Insight Footer */}
                <div className="pt-4 border-t border-slate-800/80 mt-5 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-mono">Performance:</span>
                  <span className="text-emerald-400 font-semibold font-mono flex items-center gap-0.5">
                    {item.growth}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Circularity Comparison Card */}
        <div className="mt-12 bg-[#0C1427] border border-slate-800 rounded-2xl p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                Path Comparison
              </span>
              <h3 className="text-2xl font-bold text-white">
                Why Second Life Before Shredding Matters
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Premature hydrometallurgy or pyrometallurgy destroys intact electrochemical structures that still have 8–10 years of viable utility. ReLife AI captures that retained value first, before closing the material loop.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Diverts 78% upstream mining demand</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Cuts stationary BESS capex by up to 45%</span>
                </div>
              </div>
            </div>

            {/* Quick comparative bar visual */}
            <div className="bg-[#080E1C] p-5 rounded-xl border border-slate-800 space-y-4">
              <span className="text-xs font-mono text-slate-400 block uppercase">
                Carbon Payback Efficiency
              </span>

              {/* Path A: Second Life */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-emerald-400 font-medium">ReLife AI Second-Life Pathway</span>
                  <span className="font-mono text-white font-bold">92% Asset Utility</span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[92%]" />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Automotive duty (7 yrs) + Solar storage buffer (+10 yrs) + Hydrometallurgical recovery
                </span>
              </div>

              {/* Path B: Direct Scrap */}
              <div className="pt-2 border-t border-slate-800/80">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Direct Early Shredding / Scrap</span>
                  <span className="font-mono text-slate-400">35% Asset Utility</span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-600 rounded-full w-[35%]" />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Electrochemical capacity discarded at 75–80% remaining health
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
