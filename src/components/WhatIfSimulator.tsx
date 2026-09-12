import React, { useState, useMemo } from 'react';
import { 
  Sliders, 
  RotateCcw, 
  Sparkles, 
  Zap, 
  Info, 
  CheckCircle2, 
  Award, 
  ShieldCheck, 
  Leaf, 
  Coins, 
  BatteryCharging, 
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { 
  calculateSuitabilityScores, 
  BatteryInputParams, 
  SuitabilityScoresResult,
  SAFETY_DISCLAIMER 
} from '../services/suitabilityService';
import { SecondLifeMatchScores } from './SecondLifeMatchScores';
import { BatteryHealthTimeline } from './BatteryHealthTimeline';
import { AssessmentRecord, AppPage } from '../types';

interface WhatIfSimulatorProps {
  onSaveBattery?: (record: AssessmentRecord) => void;
  onNavigate?: (page: AppPage) => void;
  initialParams?: Partial<BatteryInputParams>;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  onSaveBattery,
  onNavigate,
  initialParams,
}) => {
  // Input parameters state
  const [originalCapacity, setOriginalCapacity] = useState<number>(initialParams?.originalCapacity || 40);
  const [currentCapacity, setCurrentCapacity] = useState<number>(initialParams?.currentCapacity || 29);
  const [nominalVoltage, setNominalVoltage] = useState<number>(initialParams?.nominalVoltage || 48);
  const [cycleCount, setCycleCount] = useState<number>(initialParams?.cycleCount || 1250);
  const [temperature, setTemperature] = useState<number>(initialParams?.temperature || 31);
  const [chemistry, setChemistry] = useState<string>(initialParams?.chemistry || 'LFP');

  // Simulation execution state
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [lastAnalyzedTime, setLastAnalyzedTime] = useState<string>('Just now');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Compute results dynamically using deterministic intelligence
  const simulationResult: SuitabilityScoresResult = useMemo(() => {
    return calculateSuitabilityScores({
      originalCapacity,
      currentCapacity: Math.min(currentCapacity, originalCapacity),
      nominalVoltage,
      cycleCount,
      temperature,
      chemistry,
    });
  }, [originalCapacity, currentCapacity, nominalVoltage, cycleCount, temperature, chemistry]);

  const handleAnalyzeClick = () => {
    setIsSimulating(true);
    setSavedSuccess(false);
    setTimeout(() => {
      setIsSimulating(false);
      setLastAnalyzedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 300);
  };

  // Presets for College Exhibition Judges
  const applyPreset = (preset: 'rl001' | 'rl002' | 'rl003' | 'fresh') => {
    setSavedSuccess(false);
    if (preset === 'rl001') {
      setOriginalCapacity(40);
      setCurrentCapacity(29);
      setNominalVoltage(48);
      setCycleCount(1250);
      setTemperature(31);
      setChemistry('LFP');
    } else if (preset === 'rl002') {
      setOriginalCapacity(50);
      setCurrentCapacity(25);
      setNominalVoltage(48);
      setCycleCount(1800);
      setTemperature(34);
      setChemistry('NMC');
    } else if (preset === 'rl003') {
      setOriginalCapacity(40);
      setCurrentCapacity(12);
      setNominalVoltage(48);
      setCycleCount(2500);
      setTemperature(38);
      setChemistry('LFP');
    } else {
      setOriginalCapacity(60);
      setCurrentCapacity(54);
      setNominalVoltage(48);
      setCycleCount(450);
      setTemperature(26);
      setChemistry('LFP');
    }
  };

  const handleSaveSimulatedBattery = () => {
    if (!onSaveBattery) return;
    const now = new Date().toISOString();
    const newRecord: AssessmentRecord = {
      id: `sim-${Date.now()}`,
      batteryId: `SIM-${Math.floor(100 + Math.random() * 900)}`,
      batteryType: 'EV',
      chemistry: (chemistry as any) || 'LFP',
      originalCapacity,
      currentCapacity: Math.min(currentCapacity, originalCapacity),
      nominalVoltage,
      cycleCount,
      temperature,
      manufacturingYear: 2024,
      currentApplication: 'Electric Vehicle',
      soh: simulationResult.soh,
      relifeScore: simulationResult.relifeScore,
      grade: simulationResult.soh >= 80 ? 'Grade A' : simulationResult.soh >= 65 ? 'Grade B+' : simulationResult.soh >= 45 ? 'Grade B' : 'Recycle Grade',
      classification: simulationResult.bestNextLife.category === 'Solar Storage' ? 'Second-Life Ready' : simulationResult.bestNextLife.category === 'Refurbishment' ? 'Refurbishment Candidate' : 'Recycling Priority',
      recommendation: simulationResult.bestNextLife.title,
      estimatedExtendedYears: simulationResult.soh >= 70 ? '+6 to 8 Years' : '+3 to 5 Years',
      pathwayDetail: simulationResult.bestNextLife.description,
      assessedAt: now.replace('T', ' ').substring(0, 16),
      passportId: `RL-PASS-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Assessed',
      safetyNotice: SAFETY_DISCLAIMER,
      estimatedValue: `₹${simulationResult.estimatedValueInr.toLocaleString()}`,
      estimatedValueInr: simulationResult.estimatedValueInr,
      usableEnergyWh: simulationResult.usableEnergyWh,
      estimatedRemainingCycles: Math.max(100, Math.round(1500 * (simulationResult.soh / 100))),
      wasteDivertedKg: simulationResult.wasteDivertedKg,
      carbonOffsetKg: Math.round(simulationResult.wasteDivertedKg * 1.8),
      confidence: 94,
      whyRecommendation: simulationResult.whyRecommendation,
      lifecycleOptions: {
        reuse: simulationResult.soh >= 80 ? 'High' : 'Low',
        refurbish: simulationResult.soh >= 45 && simulationResult.soh < 80 ? 'High' : 'Low',
        repurpose: simulationResult.soh >= 60 ? 'High' : 'Medium',
        recycle: simulationResult.soh < 45 ? 'High' : 'Low',
        recommended: simulationResult.soh >= 80 ? 'Reuse' : simulationResult.soh >= 60 ? 'Repurpose' : simulationResult.soh >= 45 ? 'Refurbish' : 'Recycle',
      },
      riskFlags: [
        temperature > 35 ? `Operating temperature (${temperature}°C) indicates need for active heat dissipation.` : `Operating temperature (${temperature}°C) is within safe operational envelope.`,
        `Cell voltage variance should be verified under load prior to final deployment.`
      ],
      alternativeApplications: simulationResult.scores.filter(s => s.category !== simulationResult.bestNextLife.category).slice(0, 3).map(s => s.category),
    };
    onSaveBattery(newRecord);
    setSavedSuccess(true);
  };

  return (
    <div className="space-y-6" id="what-if-battery-simulator">
      
      {/* Top Header & Presets */}
      <div className="bg-[#0A1224] border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  What-If Battery Simulator
                </h2>
                <p className="text-xs text-slate-400">
                  Try different battery telemetry to dynamically recalculate SOH, ReLife Score, and Best Next Life.
                </p>
              </div>
            </div>
          </div>

          {/* Prototype Badge */}
          <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" />
            Interactive Prototype Engine
          </span>
        </div>

        {/* Quick Presets for Exhibition Judges */}
        <div>
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
            Quick Judge Presets (Instant Telemetry Profiles):
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => applyPreset('rl001')}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-left text-xs transition-colors cursor-pointer"
              id="preset-rl-001"
            >
              <div className="font-bold text-emerald-400 flex items-center justify-between">
                <span>RL-EV-001</span>
                <span className="text-[10px] font-mono">72.5%</span>
              </div>
              <span className="text-[10px] text-slate-400 block truncate">40Ah → 29Ah • Solar</span>
            </button>

            <button
              onClick={() => applyPreset('rl002')}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-left text-xs transition-colors cursor-pointer"
              id="preset-rl-002"
            >
              <div className="font-bold text-amber-400 flex items-center justify-between">
                <span>RL-EV-002</span>
                <span className="text-[10px] font-mono">50.0%</span>
              </div>
              <span className="text-[10px] text-slate-400 block truncate">50Ah → 25Ah • Refurb</span>
            </button>

            <button
              onClick={() => applyPreset('rl003')}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-left text-xs transition-colors cursor-pointer"
              id="preset-rl-003"
            >
              <div className="font-bold text-rose-400 flex items-center justify-between">
                <span>RL-EV-003</span>
                <span className="text-[10px] font-mono">30.0%</span>
              </div>
              <span className="text-[10px] text-slate-400 block truncate">40Ah → 12Ah • Recycle</span>
            </button>

            <button
              onClick={() => applyPreset('fresh')}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-left text-xs transition-colors cursor-pointer"
              id="preset-fresh-pack"
            >
              <div className="font-bold text-cyan-400 flex items-center justify-between">
                <span>Fleet Grade</span>
                <span className="text-[10px] font-mono">90.0%</span>
              </div>
              <span className="text-[10px] text-slate-400 block truncate">60Ah → 54Ah • EV Reuse</span>
            </button>
          </div>
        </div>
      </div>

      {/* Control Sliders & Live Diagnostic Output Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: Parameter Sliders (5 cols) */}
        <div className="lg:col-span-5 bg-[#0A1224] border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              Tweak Battery Parameters
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Live Feedback</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* 1. Original Capacity */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-mono">
                <span className="text-slate-300 font-semibold">1. Original Capacity:</span>
                <span className="font-bold text-white">{originalCapacity} Ah</span>
              </div>
              <input
                type="range"
                min="20"
                max="120"
                step="1"
                value={originalCapacity}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setOriginalCapacity(val);
                  if (currentCapacity > val) setCurrentCapacity(val);
                }}
                className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                id="slider-original-capacity"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>20 Ah</span>
                <span>120 Ah</span>
              </div>
            </div>

            {/* 2. Current Capacity */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-mono">
                <span className="text-slate-300 font-semibold">2. Current Measured Capacity:</span>
                <span className="font-bold text-emerald-400">{currentCapacity} Ah</span>
              </div>
              <input
                type="range"
                min="5"
                max={originalCapacity}
                step="0.5"
                value={currentCapacity}
                onChange={(e) => setCurrentCapacity(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                id="slider-current-capacity"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>5 Ah</span>
                <span>Max: {originalCapacity} Ah</span>
              </div>
            </div>

            {/* 3. Nominal Voltage */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-mono">
                <span className="text-slate-300 font-semibold">3. Nominal Voltage:</span>
                <span className="font-bold text-teal-300">{nominalVoltage} V</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[24, 48, 60, 72].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setNominalVoltage(v)}
                    className={`py-1.5 rounded-lg font-mono text-xs font-bold border transition-colors ${
                      nominalVoltage === v 
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400' 
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {v}V
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Cycle Count */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-mono">
                <span className="text-slate-300 font-semibold">4. Operating Cycle Count:</span>
                <span className="font-bold text-slate-200">{cycleCount.toLocaleString()} cycles</span>
              </div>
              <input
                type="range"
                min="100"
                max="3500"
                step="50"
                value={cycleCount}
                onChange={(e) => setCycleCount(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                id="slider-cycle-count"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>100</span>
                <span>3,500</span>
              </div>
            </div>

            {/* 5. Temperature */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-mono">
                <span className="text-slate-300 font-semibold">5. Pack Temperature:</span>
                <span className={`font-bold ${temperature > 35 ? 'text-amber-400' : 'text-slate-200'}`}>
                  {temperature}°C
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                step="1"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                id="slider-temperature"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>10°C (Cool)</span>
                <span>50°C (Hot)</span>
              </div>
            </div>

            {/* Chemistry Selection */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <span className="text-slate-300 font-semibold font-mono block">Cell Chemistry:</span>
              <div className="grid grid-cols-3 gap-1.5">
                {['LFP', 'NMC', 'Lead Acid'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setChemistry(c)}
                    className={`py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                      chemistry === c
                        ? 'bg-teal-500 text-slate-950 border-teal-400'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Big Action Button */}
          <button
            onClick={handleAnalyzeClick}
            disabled={isSimulating}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
            id="run-simulation-btn"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            {isSimulating ? 'Simulating Degradation...' : 'Run Simulation Analysis'}
          </button>
        </div>

        {/* RIGHT: Dynamic Diagnostic Recalculations (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Top 4 Real-time Metrics Card */}
          <div className="bg-gradient-to-br from-[#0B152B] to-[#080E1C] border border-emerald-500/30 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                  Live Recalculated Output
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Formula: {currentCapacity}Ah / {originalCapacity}Ah
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Calculated SOH */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-500/30 text-center">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Calculated SOH</span>
                <span className="text-2xl font-black font-mono text-emerald-400 block mt-0.5" id="sim-soh-value">
                  {simulationResult.soh}%
                </span>
                <span className="text-[9px] text-slate-500 font-mono">Retention Index</span>
              </div>

              {/* ReLife Score */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">ReLife Score</span>
                <span className="text-2xl font-black font-mono text-white block mt-0.5" id="sim-relife-score">
                  {simulationResult.relifeScore}
                </span>
                <span className="text-[9px] text-emerald-400 font-mono">Out of 100</span>
              </div>

              {/* Usable Energy */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Usable Energy</span>
                <span className="text-2xl font-black font-mono text-teal-300 block mt-0.5" id="sim-usable-energy">
                  {simulationResult.usableEnergyKWh} <span className="text-xs font-normal text-slate-400">kWh</span>
                </span>
                <span className="text-[9px] text-slate-500 font-mono">{simulationResult.usableEnergyWh} Wh</span>
              </div>

              {/* Estimated Circular Value */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Estimated Value</span>
                <span className="text-2xl font-black font-mono text-amber-300 block mt-0.5" id="sim-estimated-value">
                  ₹{simulationResult.estimatedValueInr.toLocaleString()}
                </span>
                <span className="text-[9px] text-amber-500/80 font-mono">Prototype Estimate</span>
              </div>
            </div>

            {/* Best Next Life Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-slate-900 border border-emerald-500/40 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase font-mono tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  BEST NEXT LIFE RECOMMENDATION
                </span>
                <h4 className="text-lg font-extrabold text-white" id="sim-best-next-life-title">
                  {simulationResult.bestNextLife.title}
                </h4>
                <p className="text-xs text-slate-300">
                  {simulationResult.bestNextLife.description}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-2xl font-black font-mono text-emerald-400">
                  {simulationResult.bestNextLife.score}%
                </span>
                <span className="text-[9px] font-mono text-slate-400 block">Match Score</span>
              </div>
            </div>

            {/* WHY THIS RECOMMENDATION? EXPLANATION */}
            <div className="p-4 rounded-xl bg-[#080E1C] border border-slate-800 space-y-2" id="sim-why-recommendation-box">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <Info className="w-4 h-4 text-emerald-400" />
                <span>Why this recommendation?</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans" id="sim-why-recommendation-text">
                {simulationResult.whyRecommendation}
              </p>
              <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 font-mono flex items-center justify-between">
                <span>Thermal envelope: {temperature}°C</span>
                <span>Operational load: 0.2C - 0.5C</span>
              </div>
            </div>

            {/* MANDATORY SAFETY NOTICE */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5 text-xs text-amber-200/90 font-sans">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Safety Disclaimer:</strong> {simulationResult.safetyDisclaimer}
              </span>
            </div>

            {/* Save to Assessment Action */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                {savedSuccess ? '✅ Saved into active prototype inventory!' : 'Save this simulated test into session database:'}
              </span>
              <button
                onClick={handleSaveSimulatedBattery}
                disabled={savedSuccess}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  savedSuccess 
                    ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                }`}
                id="save-simulated-battery-btn"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {savedSuccess ? 'Saved' : 'Save Simulated Battery'}
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* SECOND-LIFE MATCH SCORE BREAKDOWN (All 6 options with Highest Highlighted) */}
      <SecondLifeMatchScores suitability={simulationResult} />

      {/* BATTERY HEALTH TIMELINE GRAPH (Prototype Estimate) */}
      <BatteryHealthTimeline
        soh={simulationResult.soh}
        cycleCount={cycleCount}
        batteryId="SIM-BATTERY"
        title="Simulated Degradation & Extended Second-Life Timeline"
      />

    </div>
  );
};
