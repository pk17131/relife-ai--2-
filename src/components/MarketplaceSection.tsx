import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Filter, 
  ShieldCheck, 
  MapPin, 
  Zap, 
  ArrowRight, 
  Sparkles,
  Search,
  ExternalLink
} from 'lucide-react';
import { ModalType } from './InteractiveModals';

interface MarketplaceSectionProps {
  onOpenModal: (type: ModalType) => void;
}

export const MarketplaceSection: React.FC<MarketplaceSectionProps> = ({ onOpenModal }) => {
  const [selectedChemistry, setSelectedChemistry] = useState<string>('all');

  const lots = [
    {
      id: 'LOT-NMC-841',
      title: 'Tata Nexon EV Max Pack (40.5 kWh)',
      chemistry: 'NMC 811',
      soh: '81.4%',
      usableCapacity: '32.9 kWh Usable',
      location: 'Pune / Mumbai Hub',
      grade: 'Grade A (BESS Ready)',
      verified: true,
      price: '₹1,95,000',
      application: 'Solar Microgrid / Peak Shaving',
      remainingCycles: '2,400 Cycles',
    },
    {
      id: 'LOT-LFP-302',
      title: 'Commercial Fleet LFP Modules (48V 100Ah)',
      chemistry: 'LFP',
      soh: '84.0%',
      usableCapacity: '40.3 kWh Total Lot',
      location: 'Bengaluru Logistics',
      grade: 'Grade A (Microgrid)',
      verified: true,
      price: '₹2,72,000',
      application: 'Telecom Tower UPS / Rural Grid',
      remainingCycles: '3,800 Cycles',
    },
    {
      id: 'LOT-NMC-119',
      title: 'MG ZS EV Battery System (50.3 kWh)',
      chemistry: 'NMC 622',
      soh: '76.8%',
      usableCapacity: '38.6 kWh Usable',
      location: 'Delhi NCR Hub',
      grade: 'Grade B+ (Stationary)',
      verified: true,
      price: '₹2,30,000',
      application: 'Industrial Energy Storage',
      remainingCycles: '2,100 Cycles',
    },
  ];

  const filteredLots = selectedChemistry === 'all'
    ? lots
    : lots.filter((l) => l.chemistry.toLowerCase().includes(selectedChemistry.toLowerCase()));

  return (
    <section id="marketplace" className="py-20 bg-[#0A0F1D] relative border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-mono font-medium mb-3">
              <ShoppingBag className="w-3.5 h-3.5" />
              CIRCULAR MARKETPLACE PREVIEW
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Verified Second-Life Battery Lots
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Decommissioned automotive packs rigorously tested, graded, and certified for renewable BESS and commercial integration.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 bg-[#0D162B] p-1 rounded-xl border border-slate-800 self-start md:self-auto">
            {['all', 'NMC', 'LFP'].map((chem) => (
              <button
                key={chem}
                onClick={() => setSelectedChemistry(chem)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  selectedChemistry === chem
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {chem === 'all' ? 'All Chemistries' : chem}
              </button>
            ))}
          </div>
        </div>

        {/* Lots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredLots.map((lot) => (
            <div
              key={lot.id}
              className="bg-[#0D162B] hover:bg-[#0F1932] border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 shadow-xl group"
            >
              <div>
                {/* Lot Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {lot.id}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-teal-300 font-medium bg-teal-500/10 px-2 py-0.5 rounded">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {lot.grade}
                  </div>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors mb-2">
                  {lot.title}
                </h3>

                {/* Metric Summary Grid */}
                <div className="grid grid-cols-2 gap-2 bg-[#091020] p-3 rounded-xl border border-slate-800/80 mb-4 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Health (SOH)</span>
                    <span className="font-mono font-bold text-emerald-400">{lot.soh}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Cycle Reserve</span>
                    <span className="font-mono font-bold text-white">{lot.remainingCycles}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Usable Net</span>
                    <span className="font-mono text-slate-200">{lot.usableCapacity}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Location</span>
                    <span className="font-medium text-slate-300 truncate block">{lot.location}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-400 mb-4 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Optimal: {lot.application}</span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between mt-auto">
                <div>
                  <span className="text-[10px] text-slate-400 block">Reserve Price</span>
                  <span className="text-lg font-bold font-mono text-white">
                    {lot.price}
                  </span>
                </div>

                <button
                  onClick={() => onOpenModal('marketplace')}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 text-xs font-semibold transition-all border border-slate-700 flex items-center gap-1 cursor-pointer"
                >
                  View Details
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Callout */}
        <div className="mt-8 text-center">
          <button
            onClick={() => onOpenModal('marketplace')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0D162B] hover:bg-[#121F3D] text-slate-200 text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
          >
            <span>Open Complete Marketplace Directory</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
          </button>
        </div>

      </div>
    </section>
  );
};
