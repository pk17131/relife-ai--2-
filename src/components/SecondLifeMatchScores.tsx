import React from 'react';
import { 
  Sparkles, 
  Sun, 
  Home, 
  Radio, 
  Wrench, 
  Car, 
  Recycle, 
  CheckCircle2, 
  TrendingUp,
  Award
} from 'lucide-react';
import { SuitabilityItem, SuitabilityScoresResult } from '../services/suitabilityService';

interface SecondLifeMatchScoresProps {
  suitability: SuitabilityScoresResult;
  onSelectApplication?: (app: SuitabilityItem) => void;
  compact?: boolean;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'Solar Storage': Sun,
  'Home Backup': Home,
  'Telecom Backup': Radio,
  'Refurbishment': Wrench,
  'EV Reuse': Car,
  'Recycling': Recycle,
};

export const SecondLifeMatchScores: React.FC<SecondLifeMatchScoresProps> = ({
  suitability,
  onSelectApplication,
  compact = false,
}) => {
  const { scores, bestNextLife } = suitability;

  // Sort scores descending so highest score is prominent
  const sortedScores = [...scores].sort((a, b) => b.score - a.score);

  return (
    <div 
      className="bg-[#0A1224] border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5"
      id="second-life-match-scores-section"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              Second-Life Match Score
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-mono text-amber-300 font-bold uppercase tracking-wider">
              Prototype Estimate
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Multi-application suitability evaluation across 6 circular pathways.
          </p>
        </div>

        {/* Best Next Life Banner Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>BEST NEXT LIFE: <strong className="text-white underline decoration-emerald-400 underline-offset-2">{bestNextLife.category}</strong> ({bestNextLife.score}%)</span>
        </div>
      </div>

      {/* Grid of 6 Suitability Scores */}
      <div className={`grid grid-cols-1 ${compact ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-3'} gap-3.5`}>
        {sortedScores.map((item) => {
          const isBest = item.category === bestNextLife.category;
          const Icon = CATEGORY_ICONS[item.category] || Sparkles;

          // Color schemes
          let borderColor = 'border-slate-800 hover:border-slate-700';
          let bgColor = 'bg-[#080E1C]';
          let barFill = 'bg-slate-600';
          let textColor = 'text-slate-200';

          if (isBest) {
            borderColor = 'border-emerald-500 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/50';
            bgColor = 'bg-gradient-to-b from-[#0F2228] to-[#0A1624]';
            barFill = 'bg-gradient-to-r from-emerald-500 to-teal-400';
            textColor = 'text-emerald-300';
          } else if (item.score >= 70) {
            barFill = 'bg-teal-400';
            bgColor = 'bg-[#0A1428]';
          } else if (item.score >= 45) {
            barFill = 'bg-amber-400';
          } else {
            barFill = 'bg-slate-600';
          }

          return (
            <div
              key={item.id}
              onClick={() => onSelectApplication && onSelectApplication(item)}
              id={`suitability-card-${item.id}`}
              className={`rounded-xl p-4 border ${borderColor} ${bgColor} transition-all duration-200 flex flex-col justify-between space-y-3 relative overflow-hidden ${
                onSelectApplication ? 'cursor-pointer' : ''
              }`}
            >
              {/* Highlight ribbon for Best Next Life */}
              {isBest && (
                <div className="absolute top-0 right-0">
                  <div className="bg-emerald-500 text-slate-950 font-black text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-bl-lg flex items-center gap-1 shadow-sm">
                    <Sparkles className="w-2.5 h-2.5" />
                    BEST NEXT LIFE
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${isBest ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className={`text-xs font-bold ${textColor}`}>
                        {item.category}
                      </h4>
                      <span className="text-[10px] text-slate-500 font-mono block">
                        {item.title}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-mono font-extrabold text-white">
                      {item.score}%
                    </span>
                    <span className="text-[9px] text-slate-400 block font-mono">
                      Suitability
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800/80 my-2">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${barFill}`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>

              {/* Bottom metadata */}
              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Feasibility: <strong className={item.feasibility === 'High' ? 'text-emerald-400' : item.feasibility === 'Medium' ? 'text-amber-400' : 'text-slate-400'}>{item.feasibility}</strong></span>
                <span className="truncate max-w-[120px]">{item.operatingRange}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
