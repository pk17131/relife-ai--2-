import React from 'react';
import { 
  Play, 
  RotateCcw, 
  Sparkles, 
  ShieldCheck, 
  ShoppingBag, 
  Activity, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { AppPage } from '../types';

export type DemoBatteryId = 'RL-EV-001' | 'RL-EV-002' | 'RL-EV-003';

interface DemoModeControlProps {
  selectedBatteryId: DemoBatteryId;
  onSelectBattery: (id: DemoBatteryId) => void;
  onStartDemo: (id: DemoBatteryId) => void;
  onResetDemo: () => void;
  activePage: AppPage;
  onNavigate: (page: AppPage) => void;
  isDemoActive?: boolean;
}

const DEMO_BATTERIES: Array<{
  id: DemoBatteryId;
  type: string;
  chemistry: string;
  soh: string;
  score: number;
  application: string;
}> = [
  {
    id: 'RL-EV-001',
    type: 'EV',
    chemistry: 'LFP',
    soh: '72.5%',
    score: 84,
    application: 'Stationary Solar Storage',
  },
  {
    id: 'RL-EV-002',
    type: 'EV',
    chemistry: 'NMC',
    soh: '50.0%',
    score: 58,
    application: 'Refurbishment / Low-demand',
  },
  {
    id: 'RL-EV-003',
    type: 'UPS',
    chemistry: 'Lead Acid',
    soh: '30.0%',
    score: 25,
    application: 'Recycling / Assessment',
  },
];

export const DemoModeControl: React.FC<DemoModeControlProps> = ({
  selectedBatteryId,
  onSelectBattery,
  onStartDemo,
  onResetDemo,
  activePage,
  onNavigate,
  isDemoActive = false,
}) => {
  return (
    <div 
      className="bg-[#091124] border-b border-emerald-500/25 px-3 sm:px-6 py-2.5 shadow-md text-xs relative z-20"
      id="demo-mode-control-bar"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Left: Demo Badge & Battery Selector */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold font-mono text-[11px] tracking-wider uppercase shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Demo Mode</span>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
            {DEMO_BATTERIES.map((battery) => {
              const isSelected = selectedBatteryId === battery.id;
              return (
                <button
                  key={battery.id}
                  type="button"
                  onClick={() => onSelectBattery(battery.id)}
                  id={`demo-select-${battery.id.toLowerCase()}`}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span>{battery.id}</span>
                  <span className={`text-[10px] hidden sm:inline ${isSelected ? 'text-slate-900/80 font-bold' : 'text-slate-500'}`}>
                    ({battery.chemistry} • {battery.soh})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center: Guided Flow Step Tracker */}
        <div className="hidden xl:flex items-center gap-2 text-[11px] text-slate-400 font-mono">
          <span className="text-slate-500 uppercase tracking-wider text-[10px]">Flow:</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Select
          </span>
          <ArrowRight className="w-3 h-3 text-slate-600" />
          <span className={`flex items-center gap-1 ${activePage === 'analysis-results' ? 'text-emerald-300 font-bold' : 'text-slate-400'}`}>
            <Activity className="w-3 h-3" /> Analyze & Score
          </span>
          <ArrowRight className="w-3 h-3 text-slate-600" />
          <span className={`flex items-center gap-1 ${activePage === 'passport' ? 'text-emerald-300 font-bold' : 'text-slate-400'}`}>
            <ShieldCheck className="w-3 h-3" /> Digital Passport
          </span>
          <ArrowRight className="w-3 h-3 text-slate-600" />
          <span className={`flex items-center gap-1 ${activePage === 'marketplace' ? 'text-emerald-300 font-bold' : 'text-slate-400'}`}>
            <ShoppingBag className="w-3 h-3" /> Marketplace
          </span>
        </div>

        {/* Right: Actions (Start Demo & Reset Demo) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onStartDemo(selectedBatteryId)}
            id="start-demo-btn"
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start Demo</span>
          </button>

          <button
            type="button"
            onClick={onResetDemo}
            id="reset-demo-btn"
            title="Reset demo batteries and marketplace listings to initial state"
            className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 font-medium text-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </div>

      </div>
    </div>
  );
};
