import React, { useState } from 'react';
import { 
  BatteryCharging, 
  TrendingUp, 
  Recycle, 
  Coins, 
  Activity, 
  Plus, 
  ShoppingBag, 
  ShieldCheck, 
  ArrowRight, 
  Cpu, 
  Sparkles,
  AlertTriangle,
  Sliders,
  Award,
  Clock,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { AssessmentRecord, AppPage } from '../types';
import { BatteryHealthTimeline } from './BatteryHealthTimeline';
import { WhatIfSimulator } from './WhatIfSimulator';

interface DashboardViewProps {
  onNavigate: (page: AppPage) => void;
  onSelectBattery: (battery: AssessmentRecord) => void;
  batteries: AssessmentRecord[];
  marketplaceCount?: number;
  onLaunchExhibitionDemo?: () => void;
  onSaveBattery?: (record: AssessmentRecord) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onSelectBattery,
  batteries,
  marketplaceCount = 4,
  onLaunchExhibitionDemo,
  onSaveBattery,
}) => {
  const [showSimulator, setShowSimulator] = useState<boolean>(false);

  // Dynamic calculations from actual stored/demo battery data
  const totalBatteries = batteries.length;
  
  // Average SOH: (72.5 + 50 + 30) / 3 = 50.83% -> 50.8%
  const avgHealth = totalBatteries > 0 
    ? (batteries.reduce((sum, b) => sum + (Number(b.soh) || 0), 0) / totalBatteries).toFixed(1)
    : '0.0';

  // Second-Life Ready count: batteries matching 'Second-Life Ready' or SOH >= 65%
  const secondLifeReady = batteries.filter(b => 
    (b.classification && b.classification.toLowerCase().includes('second-life')) || 
    (b.recommendation && b.recommendation.toLowerCase().includes('solar')) || 
    b.soh >= 65
  ).length;

  // Estimated Circular Value: sum of estimatedValueInr: 18000 + 10500 + 3000 = 31500
  const totalValueInr = batteries.reduce((sum, b) => sum + (Number(b.estimatedValueInr) || 0), 0);

  // Total Usable Energy from active fleet in kWh
  const totalUsableKwh = batteries.reduce((sum, b) => {
    const wh = b.usableEnergyWh || ((b.currentCapacity || 0) * (b.nominalVoltage || 48));
    return sum + (wh / 1000);
  }, 0).toFixed(2);

  // Dynamic Lifecycle Breakdown based on real batteries
  const dynamicLifecycleData = [
    { 
      name: 'Second-Life Storage', 
      value: batteries.filter(b => b.recommendation?.toLowerCase().includes('solar') || b.soh >= 65).length || 1, 
      color: '#10B981' 
    },
    { 
      name: 'Refurbishment Candidate', 
      value: batteries.filter(b => b.recommendation?.toLowerCase().includes('refurbish') || (b.soh >= 45 && b.soh < 65)).length || 1, 
      color: '#14B8A6' 
    },
    { 
      name: 'Closed-Loop Recycling', 
      value: batteries.filter(b => b.recommendation?.toLowerCase().includes('recycle') || b.soh < 45).length || 1, 
      color: '#F59E0B' 
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              ReLife AI Dashboard
            </h1>
            <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-semibold">
              Live Fleet Ledger
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Standardized circular battery intelligence, SOH analytics, and second-life destination matching.
          </p>
        </div>

        {/* Action Buttons: EXHIBITION DEMO & Assess New Battery */}
        <div className="flex items-center flex-wrap gap-3">
          {onLaunchExhibitionDemo && (
            <button
              onClick={onLaunchExhibitionDemo}
              id="dashboard-header-exhibition-demo-btn"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2 cursor-pointer ring-2 ring-emerald-400/40"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              EXHIBITION DEMO
            </button>
          )}

          <button
            onClick={() => onNavigate('add-battery')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer"
            id="dashboard-header-assess-btn"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Assess New Battery
          </button>
        </div>
      </div>

      {/* MANDATORY PROTOTYPE SAFETY ADVISORY */}
      <div 
        className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-200/90 shadow-sm"
        id="dashboard-safety-notice"
      >
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>AI-assisted prototype estimate — not a safety certification.</strong> All metrics and recommendations are dynamically derived from demonstration telemetry data.
          </span>
        </div>
        <span className="font-mono text-[10px] text-amber-300 uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30 self-start sm:self-auto shrink-0">
          DIN SPEC 91472 / UL 1974
        </span>
      </div>

      {/* 5 DYNAMIC KPI CARDS (Calculated from actual stored/demo battery data) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
            Fleet Telemetry & Circular Summary
          </span>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded">
            Dynamic Calculation
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4" id="dynamic-kpi-grid">
          
          {/* Card 1: Total Batteries */}
          <div className="bg-[#0C1427] border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-medium">
                Total Batteries
              </span>
              <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
                <BatteryCharging className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold font-mono text-white" id="kpi-total-batteries">
                {totalBatteries}
              </div>
              <div className="flex items-center justify-between text-[11px] mt-2 pt-2 border-t border-slate-800/80">
                <span className="text-sky-400 font-mono font-bold">Demo Data</span>
                <span className="text-slate-500 font-mono">Assessed Packs</span>
              </div>
            </div>
          </div>

          {/* Card 2: Average Battery Health */}
          <div className="bg-[#0C1427] border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-medium">
                Average Battery Health
              </span>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold font-mono text-emerald-400" id="kpi-avg-health">
                {avgHealth}%
              </div>
              <div className="flex items-center justify-between text-[11px] mt-2 pt-2 border-t border-slate-800/80">
                <span className="text-emerald-400 font-mono font-bold">Based on Demo Dataset</span>
                <span className="text-slate-500 font-mono">Mean SOH</span>
              </div>
            </div>
          </div>

          {/* Card 3: Second-Life Ready */}
          <div className="bg-[#0C1427] border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-medium">
                Second-Life Ready
              </span>
              <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold font-mono text-teal-300" id="kpi-second-life-ready">
                {secondLifeReady}
              </div>
              <div className="flex items-center justify-between text-[11px] mt-2 pt-2 border-t border-slate-800/80">
                <span className="text-teal-400 font-mono font-bold">Prototype Classification</span>
                <span className="text-slate-500 font-mono">Qualified</span>
              </div>
            </div>
          </div>

          {/* Card 4: Marketplace Listings */}
          <div className="bg-[#0C1427] border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-medium">
                Marketplace Listings
              </span>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold font-mono text-white" id="kpi-marketplace-listings">
                {marketplaceCount}
              </div>
              <div className="flex items-center justify-between text-[11px] mt-2 pt-2 border-t border-slate-800/80">
                <span className="text-emerald-400 font-mono font-bold">Catalog Inventory</span>
                <span className="text-slate-500 font-mono">B2B Directory</span>
              </div>
            </div>
          </div>

          {/* Card 5: Estimated Circular Value */}
          <div className="bg-[#0C1427] border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-medium">
                Estimated Circular Value
              </span>
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <Coins className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold font-mono text-amber-300" id="kpi-estimated-value">
                ₹{totalValueInr.toLocaleString()}
              </div>
              <div className="flex items-center justify-between text-[11px] mt-2 pt-2 border-t border-slate-800/80">
                <span className="text-amber-400 font-mono font-bold">Prototype Estimate</span>
                <span className="text-slate-500 font-mono">₹18k + ₹10.5k + ₹3k</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* QUICK OPERATIONS & WHAT-IF TOGGLE BANNER */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0E172C] to-[#0A1224] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              College Exhibition Interactive Stations
            </h3>
            <p className="text-xs text-slate-400">
              Launch the 60-second guided demo, or adjust live parameters with the What-If Battery Simulator.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {onLaunchExhibitionDemo && (
            <button
              onClick={onLaunchExhibitionDemo}
              id="banner-exhibition-demo-btn"
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20"
            >
              <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
              Launch Exhibition Demo
            </button>
          )}

          <button
            onClick={() => setShowSimulator(!showSimulator)}
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
            id="toggle-simulator-btn"
          >
            <Sliders className="w-3.5 h-3.5 text-teal-400" />
            {showSimulator ? 'Hide What-If Simulator' : 'What-If Battery Simulator'}
            {showSimulator ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* WHAT-IF BATTERY SIMULATOR SECTION (Can be toggled or viewed inline) */}
      {showSimulator && (
        <div className="animate-in fade-in duration-300 border-2 border-emerald-500/30 rounded-3xl p-1 bg-[#060C1A]">
          <WhatIfSimulator
            onSaveBattery={onSaveBattery}
            onNavigate={onNavigate}
            initialParams={{
              originalCapacity: 40,
              currentCapacity: 29,
              nominalVoltage: 48,
              cycleCount: 1250,
              temperature: 31,
              chemistry: 'LFP'
            }}
          />
        </div>
      )}

      {/* BATTERY HEALTH TIMELINE (Clean graph showing health over time, clearly labeled "Prototype Estimate") */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Health Timeline Chart (8 cols) */}
        <div className="lg:col-span-8">
          <BatteryHealthTimeline
            soh={Number(avgHealth) || 72.5}
            cycleCount={1250}
            batteryId="RL-EV-001"
            title="Battery Health Timeline (Prototype Estimate)"
          />
        </div>

        {/* Dynamic Circular Distribution Breakdown (4 cols) */}
        <div className="lg:col-span-4 bg-[#0A1224] border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                Pathway Distribution
              </h3>
              <span className="text-[10px] font-mono text-slate-400">
                {totalBatteries} Stored Units
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Categorized destination pathways for current demonstration dataset.
            </p>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dynamicLifecycleData}
                  cx="50%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={68}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dynamicLifecycleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F1A34', borderColor: '#1E293B', borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 text-xs pt-1 border-t border-slate-800/80">
            {dynamicLifecycleData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-300 text-[11px]">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-mono text-white font-semibold">{item.value} pack{item.value > 1 ? 's' : ''}</span>
              </div>
            ))}
          </div>

          <div className="text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-800/60 flex items-center justify-between">
            <span>Usable Stored Energy:</span>
            <span className="text-emerald-400 font-bold">{totalUsableKwh} kWh</span>
          </div>
        </div>

      </div>

      {/* RECENT ASSESSMENTS TABLE */}
      <div className="bg-[#0C1427] border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Demo Battery Fleet Records
            </h3>
            <p className="text-xs text-slate-400">
              Verified diagnostic records from the demo battery dataset.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('my-batteries')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              View Full Fleet ({batteries.length}) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="pb-3 font-semibold">Battery ID</th>
                <th className="pb-3 font-semibold">Chemistry</th>
                <th className="pb-3 font-semibold">Health (SOH)</th>
                <th className="pb-3 font-semibold">ReLife Score</th>
                <th className="pb-3 font-semibold">Recommendation</th>
                <th className="pb-3 font-semibold">Estimated Value</th>
                <th className="pb-3 font-semibold text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {batteries.map((item) => (
                <tr 
                  key={`${item.id}-${item.batteryId}`} 
                  className="hover:bg-slate-900/60 transition-colors group cursor-pointer"
                  onClick={() => onSelectBattery(item)}
                >
                  <td className="py-3.5 font-mono font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    {item.batteryId}
                  </td>
                  <td className="py-3.5 text-slate-300">
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700/80 font-mono text-[11px]">
                      {item.chemistry} • {item.nominalVoltage}V
                    </span>
                  </td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono font-bold ${
                        item.soh >= 70 ? 'text-emerald-400' :
                        item.soh >= 45 ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {item.soh}%
                      </span>
                      <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                        <div 
                          className={`h-full rounded-full ${
                            item.soh >= 70 ? 'bg-emerald-400' :
                            item.soh >= 45 ? 'bg-amber-400' : 'bg-rose-400'
                          }`}
                          style={{ width: `${Math.min(100, item.soh)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 font-mono font-semibold text-white">
                    <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                      {item.relifeScore} / 100
                    </span>
                  </td>
                  <td className="py-3.5 text-slate-200 font-medium max-w-xs truncate">
                    {item.recommendation}
                  </td>
                  <td className="py-3.5 font-mono text-amber-300 font-bold">
                    ₹{(item.estimatedValueInr || 0).toLocaleString()}
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectBattery(item);
                      }}
                      className="text-emerald-400 hover:text-emerald-300 p-1.5 rounded hover:bg-slate-800 transition-colors"
                      title="Inspect Diagnostic Details"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
