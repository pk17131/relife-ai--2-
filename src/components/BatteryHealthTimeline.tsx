import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine,
  CartesianGrid
} from 'recharts';
import { Clock, AlertTriangle, TrendingDown, Info, ShieldCheck } from 'lucide-react';
import { generateHealthTimelineData } from '../services/suitabilityService';

interface BatteryHealthTimelineProps {
  soh: number;
  cycleCount: number;
  batteryId?: string;
  manufacturingYear?: number;
  title?: string;
  showDetails?: boolean;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#0A1224] border border-emerald-500/30 rounded-xl p-3 shadow-xl text-xs font-sans space-y-1">
        <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-1">
          <span className="font-bold text-white">{data.stage}</span>
          <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
            data.isProjected ? 'bg-amber-500/10 text-amber-300' : 'bg-emerald-500/10 text-emerald-400'
          }`}>
            {data.isProjected ? 'Projected 2nd Life' : '1st Life Recorded'}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4 pt-1">
          <span className="text-slate-400">State of Health (SOH):</span>
          <span className="font-mono font-extrabold text-emerald-400 text-sm">
            {data.soh}%
          </span>
        </div>
        <div className="flex items-center justify-between gap-4 text-[11px]">
          <span className="text-slate-500">Cumulative Cycles:</span>
          <span className="font-mono text-slate-300">{data.cycles.toLocaleString()} cycles</span>
        </div>
        <div className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-800/60">
          {data.phase} • Prototype Estimate
        </div>
      </div>
    );
  }
  return null;
};

export const BatteryHealthTimeline: React.FC<BatteryHealthTimelineProps> = ({
  soh,
  cycleCount,
  batteryId = 'RL-EV-001',
  manufacturingYear = 2024,
  title = 'Battery Health Timeline',
  showDetails = true,
}) => {
  const data = generateHealthTimelineData(soh, cycleCount, manufacturingYear);

  return (
    <div 
      className="bg-[#0A1224] border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4"
      id="battery-health-timeline-chart-card"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              {title}
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-mono text-amber-300 font-bold uppercase tracking-wider">
              Prototype Estimate
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Measured first-life degradation curve & projected second-life stationary trajectory.
          </p>
        </div>

        {/* Current State Quick Badge */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-400 block">Current Assessed SOH</span>
            <span className="text-base font-mono font-extrabold text-emerald-400">
              {soh}%
            </span>
          </div>
          <div className="h-8 w-px bg-slate-800 hidden sm:block" />
          <div className="text-right hidden sm:block">
            <span className="text-[10px] font-mono text-slate-400 block">Operating Cycles</span>
            <span className="text-base font-mono font-extrabold text-slate-200">
              {cycleCount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 20, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="sohGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                <stop offset="60%" stopColor="#059669" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#022c22" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
            <XAxis 
              dataKey="stage" 
              tick={{ fill: '#94A3B8', fontSize: 10, fontFamily: 'monospace' }}
              axisLine={{ stroke: '#334155' }}
              tickLine={{ stroke: '#334155' }}
            />
            <YAxis 
              domain={[0, 105]} 
              tick={{ fill: '#94A3B8', fontSize: 10, fontFamily: 'monospace' }}
              axisLine={{ stroke: '#334155' }}
              tickLine={{ stroke: '#334155' }}
              tickFormatter={(val) => `${val}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Reference Line for EV Retirement (75-80%) */}
            <ReferenceLine 
              y={75} 
              stroke="#F59E0B" 
              strokeDasharray="4 4" 
              label={{ 
                value: 'EV Retirement Threshold (75-80%)', 
                fill: '#FBBF24', 
                fontSize: 10, 
                position: 'insideTopRight' 
              }} 
            />

            {/* Reference Line for Recycling / EOL (<45%) */}
            <ReferenceLine 
              y={45} 
              stroke="#EF4444" 
              strokeDasharray="4 4" 
              label={{ 
                value: 'Recycling Phase (<45%)', 
                fill: '#F87171', 
                fontSize: 10, 
                position: 'insideBottomRight' 
              }} 
            />

            <Area 
              type="monotone" 
              dataKey="soh" 
              stroke="#10B981" 
              strokeWidth={2.5}
              fillOpacity={1} 
              fill="url(#sohGradient)" 
              dot={{ r: 4, fill: '#10B981', stroke: '#064E3B', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#34D399', stroke: '#FFFFFF', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Details */}
      {showDetails && (
        <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-2.5 rounded-xl bg-[#080E1C] border border-slate-800/60 flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
            <div>
              <span className="text-[11px] font-bold text-slate-200 block">1st Life (0–80% SOH)</span>
              <span className="text-[10px] text-slate-400">EV Traction duty cycles</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#080E1C] border border-slate-800/60 flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
            <div>
              <span className="text-[11px] font-bold text-slate-200 block">2nd Life (50–75% SOH)</span>
              <span className="text-[10px] text-slate-400">Stationary solar & UPS storage</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#080E1C] border border-slate-800/60 flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-400 shrink-0" />
            <div>
              <span className="text-[11px] font-bold text-slate-200 block">Recycling (&lt;45% SOH)</span>
              <span className="text-[10px] text-slate-400">Closed-loop mineral recovery</span>
            </div>
          </div>
        </div>
      )}

      {/* Safety Notice */}
      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>AI-assisted prototype estimate. Degradation rates vary by thermal conditions and C-rate profile. Not a safety certification.</span>
      </div>
    </div>
  );
};
