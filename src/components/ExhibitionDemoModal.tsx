import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Play, 
  Pause, 
  CheckCircle2, 
  BatteryCharging, 
  Cpu, 
  Award, 
  Sun, 
  Info, 
  QrCode, 
  Store, 
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Zap,
  ExternalLink
} from 'lucide-react';
import { AppPage, AssessmentRecord } from '../types';
import { calculateSuitabilityScores, SAFETY_DISCLAIMER } from '../services/suitabilityService';

interface ExhibitionDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: AppPage) => void;
  onSelectBattery: (battery: AssessmentRecord) => void;
  currentBattery?: AssessmentRecord;
}

const DEMO_PRESETS = [
  { id: 'RL-EV-001', name: 'RL-EV-001 (72.5% SOH)', orig: 40, curr: 29, volt: 48, cycles: 1250, temp: 31, chem: 'LFP', target: 'Solar Storage' },
  { id: 'RL-EV-002', name: 'RL-EV-002 (50.0% SOH)', orig: 50, curr: 25, volt: 48, cycles: 1800, temp: 34, chem: 'NMC', target: 'Refurbishment' },
  { id: 'RL-EV-003', name: 'RL-EV-003 (30.0% SOH)', orig: 40, curr: 12, volt: 48, cycles: 2500, temp: 38, chem: 'LFP', target: 'Recycling' },
];

export const ExhibitionDemoModal: React.FC<ExhibitionDemoModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onSelectBattery,
  currentBattery,
}) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('RL-EV-001');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Selected preset parameters
  const activePreset = DEMO_PRESETS.find(p => p.id === selectedPresetId) || DEMO_PRESETS[0];

  const suitability = calculateSuitabilityScores({
    batteryId: activePreset.id,
    originalCapacity: activePreset.orig,
    currentCapacity: activePreset.curr,
    nominalVoltage: activePreset.volt,
    cycleCount: activePreset.cycles,
    temperature: activePreset.temp,
    chemistry: activePreset.chem,
  });

  const STEPS = [
    { id: 'data', title: 'Battery Data', subtitle: 'Pack Ingestion' },
    { id: 'analyze', title: 'Analyze', subtitle: 'AI Diagnostics' },
    { id: 'soh', title: 'SOH', subtitle: 'Capacity Retention' },
    { id: 'relife', title: 'ReLife Score', subtitle: 'Circular Index' },
    { id: 'best-next-life', title: 'Best Next Life', subtitle: 'Suitability Match' },
    { id: 'why', title: 'Why Recommendation', subtitle: 'Explainable AI' },
    { id: 'passport', title: 'Digital Passport', subtitle: 'Chain-of-Custody' },
    { id: 'qr', title: 'QR Code', subtitle: 'Verifiable Ledger' },
    { id: 'marketplace', title: 'Marketplace', subtitle: 'Circular Value' },
  ];

  // Auto-play timer for booth presentations
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying && isOpen) {
      timer = setTimeout(() => {
        setActiveStep((prev) => (prev + 1) % STEPS.length);
      }, 4000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isPlaying, isOpen, activeStep, STEPS.length]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (activeStep < STEPS.length - 1) setActiveStep(activeStep + 1);
    else setActiveStep(0);
  };

  const handlePrev = () => {
    if (activeStep > 0) setActiveStep(activeStep - 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-[#0A1224] border border-emerald-500/40 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl shadow-emerald-950/50 overflow-hidden relative"
        id="exhibition-demo-modal"
      >
        
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#080E1D] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Exhibition Guided Demo
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-mono text-emerald-300 font-bold uppercase">
                  College Booth Mode
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Full 9-step circular battery lifecycle evaluation in 60 seconds
              </p>
            </div>
          </div>

          {/* Preset Selector & Controls */}
          <div className="flex items-center gap-2">
            <select
              value={selectedPresetId}
              onChange={(e) => {
                setSelectedPresetId(e.target.value);
                setActiveStep(0);
              }}
              className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-xl px-2.5 py-1.5 font-mono focus:outline-none focus:border-emerald-500"
              id="exhibition-preset-selector"
            >
              {DEMO_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isPlaying 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
              title={isPlaying ? 'Pause Auto-Play' : 'Start Auto-Play for Booth'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isPlaying ? 'Auto' : 'Play'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-800"
              id="close-exhibition-modal-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Interactive Step Ribbon */}
        <div className="bg-[#070B16] border-b border-slate-800 px-3 py-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 min-w-max">
            {STEPS.map((step, idx) => {
              const isActive = idx === activeStep;
              const isDone = idx < activeStep;

              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                      : isDone
                      ? 'bg-slate-900/90 text-emerald-400 border border-emerald-500/20 font-bold'
                      : 'bg-slate-900/50 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                  id={`exhibition-step-btn-${idx}`}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    isActive ? 'bg-slate-950 text-emerald-400 font-black' : isDone ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {idx + 1}
                  </span>
                  <span>{step.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Body Content - Dynamically Renders Active Step */}
        <div className="p-6 sm:p-8 flex-1 overflow-y-auto space-y-6">
          
          {/* STEP 1: BATTERY DATA */}
          {activeStep === 0 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  Step 1 of 9: Battery Pack Telemetry Ingestion
                </span>
                <span className="text-xs font-mono text-slate-400">Pack ID: {activePreset.id}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                <div className="p-3.5 rounded-2xl bg-[#080E1C] border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Original Capacity</span>
                  <span className="text-xl font-bold font-mono text-white mt-1 block">{activePreset.orig} Ah</span>
                  <span className="text-[10px] text-slate-400">OEM Factory Rating</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#080E1C] border border-emerald-500/30">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase block">Current Measured</span>
                  <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">{activePreset.curr} Ah</span>
                  <span className="text-[10px] text-slate-400">Remaining Charge</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#080E1C] border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Nominal Voltage</span>
                  <span className="text-xl font-bold font-mono text-teal-300 mt-1 block">{activePreset.volt} V</span>
                  <span className="text-[10px] text-slate-400">Standard 48V Architecture</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#080E1C] border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Operating Cycles</span>
                  <span className="text-xl font-bold font-mono text-slate-200 mt-1 block">{activePreset.cycles.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400">First-Life Fleet Usage</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#080E1C] border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Pack Temperature</span>
                  <span className="text-xl font-bold font-mono text-slate-200 mt-1 block">{activePreset.temp}°C</span>
                  <span className="text-[10px] text-slate-400">Thermal Envelope</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#080E1C] border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Cell Chemistry</span>
                  <span className="text-xl font-bold font-mono text-white mt-1 block">{activePreset.chem}</span>
                  <span className="text-[10px] text-slate-400">{activePreset.chem === 'LFP' ? 'Lithium Iron Phosphate' : 'Nickel Manganese Cobalt'}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                💡 <strong>Demonstration Note for Judges:</strong> ReLife AI ingests electrical parameters from real-world EV retirement fleets without requiring destructive testing.
              </p>
            </div>
          )}

          {/* STEP 2: ANALYZE */}
          {activeStep === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  Step 2 of 9: Multi-Factor Electrochemical Analysis
                </span>
                <span className="text-xs font-mono text-cyan-400 font-bold">Inference Active</span>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0B172E] to-[#070D1B] border border-emerald-500/30 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto animate-pulse">
                  <Cpu className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  Executing Deterministic AI Degradation Model
                </h3>
                <p className="text-xs text-slate-300 max-w-lg mx-auto">
                  Cross-referencing capacity fade ({activePreset.curr} Ah / {activePreset.orig} Ah), cumulative cycle stress ({activePreset.cycles} cycles), and cathode thermal runaway threshold ({activePreset.chem} @ {activePreset.temp}°C).
                </p>

                <div className="flex justify-center gap-2 pt-2">
                  <span className="px-3 py-1 rounded-lg bg-slate-900 text-xs font-mono text-emerald-400 border border-emerald-500/30">
                    Confidence: 94%
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-slate-900 text-xs font-mono text-amber-300 border border-amber-500/30">
                    Zero-Latency Deterministic Intelligence
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: SOH */}
          {activeStep === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  Step 3 of 9: State of Health (SOH) Verification
                </span>
                <span className="text-xs font-mono text-slate-400">Formula: (Current / Original) * 100</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                <div className="p-6 rounded-2xl bg-[#080E1C] border border-emerald-500/30 text-center space-y-2">
                  <span className="text-xs font-mono text-slate-400 uppercase">Verified State of Health</span>
                  <div className="text-5xl font-black font-mono text-emerald-400 tracking-tight">
                    {suitability.soh}%
                  </div>
                  <span className="text-xs font-mono text-slate-400 block pt-1">
                    {activePreset.curr} Ah / {activePreset.orig} Ah Retention
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="font-bold text-white block mb-1">Automotive Retirement Threshold</span>
                    <p className="text-slate-400">
                      EVs typically retire batteries at 75%–80% SOH. At {suitability.soh}%, this pack has concluded primary vehicle duty but retains massive stationary storage potential.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="font-bold text-teal-300 block mb-1">Usable Remaining Energy</span>
                    <p className="text-slate-400 font-mono">
                      {suitability.usableEnergyKWh} kWh ({suitability.usableEnergyWh} Wh) ready for secondary duty.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: RELIFE SCORE */}
          {activeStep === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  Step 4 of 9: ReLife Circular Composite Score
                </span>
                <span className="text-xs font-mono text-amber-300">Proprietary Metric</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-[#080E1C] border border-emerald-500/40 text-center flex flex-col justify-center">
                  <span className="text-xs font-mono text-slate-400 uppercase">ReLife Score</span>
                  <div className="text-4xl sm:text-5xl font-black font-mono text-white mt-1">
                    {suitability.relifeScore} <span className="text-lg text-emerald-400 font-normal">/ 100</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono mt-1">Composite Health Index</span>
                </div>

                <div className="sm:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
                  <h4 className="font-bold text-white">Weighted Evaluation Components:</h4>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Capacity Retention (60% Weight):</span>
                        <span className="font-mono text-emerald-400">{suitability.soh}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${suitability.soh}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Cycle Durability Factor (15% Weight):</span>
                        <span className="font-mono text-teal-300">{activePreset.cycles} cycles</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-teal-400 h-full rounded-full" style={{ width: `${Math.max(10, 100 - (activePreset.cycles / 3000) * 100)}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Cathode Stability Factor (15% Weight):</span>
                        <span className="font-mono text-cyan-300">{activePreset.chem}</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-cyan-400 h-full rounded-full" style={{ width: activePreset.chem === 'LFP' ? '95%' : '75%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: BEST NEXT LIFE */}
          {activeStep === 4 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  Step 5 of 9: Second-Life Match Score Ranking
                </span>
                <span className="text-xs font-mono text-emerald-300 font-bold">Highlight: Best Next Life</span>
              </div>

              {/* Best Next Life Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border-2 border-emerald-500 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" />
                    BEST NEXT LIFE
                  </div>
                  <h3 className="text-xl font-extrabold text-white">
                    {suitability.bestNextLife.title}
                  </h3>
                  <p className="text-xs text-slate-300">
                    {suitability.bestNextLife.description}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-3xl font-black font-mono text-emerald-400">
                    {suitability.bestNextLife.score}%
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 block">Match Score</span>
                </div>
              </div>

              {/* Mini List of all 6 applications */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                {suitability.scores.map((s) => (
                  <div 
                    key={s.id}
                    className={`p-3 rounded-xl border ${
                      s.category === suitability.bestNextLife.category 
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-white font-bold' 
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[11px] truncate">{s.category}</span>
                      <span className="font-mono">{s.score}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${s.category === suitability.bestNextLife.category ? 'bg-emerald-400' : 'bg-slate-600'}`} style={{ width: `${s.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: WHY RECOMMENDATION */}
          {activeStep === 5 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  Step 6 of 9: Explainable AI & Engineering Rationale
                </span>
                <span className="text-xs font-mono text-slate-400">Transparent Reasoning</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#080E1C] border border-emerald-500/30 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <Info className="w-4 h-4" />
                  <span>Why this recommendation?</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed font-sans bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                  "{suitability.whyRecommendation}"
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 block font-mono text-[10px]">OPERATIONAL LOAD PROFILE</span>
                    <span className="text-white font-semibold">0.2C to 0.5C gentle charge/discharge float</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 block font-mono text-[10px]">RECOMMENDED RECOVERY PATHWAY</span>
                    <span className="text-white font-semibold">{suitability.recoveryPathway}</span>
                  </div>
                </div>
              </div>

              {/* Mandatory Safety Notice */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200/90 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Safety Advisory:</strong> {SAFETY_DISCLAIMER}
                </span>
              </div>
            </div>
          )}

          {/* STEP 7: DIGITAL PASSPORT */}
          {activeStep === 6 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  Step 7 of 9: Digital Battery Passport (EU Battery Reg / DIN SPEC 91472)
                </span>
                <span className="text-xs font-mono text-teal-300 font-bold">Verified Ledger</span>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#09152C] to-[#070D1C] border border-slate-700 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-base font-extrabold text-white">Digital Battery Passport Certificate</h4>
                    <span className="text-[10px] font-mono text-slate-400">UID: {activePreset.id} • SHA-256 Provenance</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/40">
                    CERTIFIED PASSPORT
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-mono">Carbon Offset</span>
                    <span className="font-bold text-emerald-400 font-mono text-sm">~{Math.round(suitability.wasteDivertedKg * 1.8)} kg CO₂e</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-mono">Waste Diverted</span>
                    <span className="font-bold text-teal-300 font-mono text-sm">{suitability.wasteDivertedKg} kg</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-mono">Extended Life</span>
                    <span className="font-bold text-white font-mono text-sm">+6 to 8 Years</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-mono">Market Valuation</span>
                    <span className="font-bold text-amber-300 font-mono text-sm">₹{suitability.estimatedValueInr.toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      onClose();
                      onNavigate('passport');
                    }}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Open Full Digital Passport View</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 8: QR */}
          {activeStep === 7 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  Step 8 of 9: Verifiable Physical QR Code
                </span>
                <span className="text-xs font-mono text-slate-400">On-Pack Physical Tagging</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
                <div className="bg-white p-5 rounded-2xl flex flex-col items-center justify-center max-w-xs mx-auto text-slate-950 shadow-xl">
                  {/* Simulated QR Pattern */}
                  <div className="w-40 h-40 bg-slate-950 p-2 rounded-xl flex items-center justify-center relative">
                    <QrCode className="w-36 h-36 text-white" />
                  </div>
                  <span className="font-mono text-[10px] font-bold mt-2 text-slate-600">
                    Scan for Live Verification
                  </span>
                  <span className="font-mono text-xs font-extrabold text-slate-900">
                    relife.ai/p/{activePreset.id}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <h5 className="font-bold text-white mb-1">Instant Field Verification</h5>
                    <p className="text-slate-400">
                      Second-life solar installers or battery recyclers can instantly scan this on-pack QR code to verify chemical provenance, true SOH history, and safe operating guidelines.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <h5 className="font-bold text-emerald-400 mb-1">Decentralized Transparency</h5>
                    <p className="text-slate-400">
                      Prevents falsification of second-life battery capacities in secondary markets.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 9: MARKETPLACE */}
          {activeStep === 8 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  Step 9 of 9: Circular B2B Secondary Marketplace
                </span>
                <span className="text-xs font-mono text-amber-300 font-bold">Value Realization</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#080E1C] border border-emerald-500/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Marketplace Listing Ready</span>
                    <h4 className="text-lg font-bold text-white">
                      {activePreset.id} • {activePreset.chem} Secondary Storage Pack
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black font-mono text-emerald-400">
                      ₹{suitability.estimatedValueInr.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 block">Estimated Recovery Value</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  The verified pack is listed directly to solar installers, agricultural cold storage operators, and backup power builders. Buyers can review verified SOH, download the digital passport, and submit commercial quote requests.
                </p>

                <div className="pt-2 flex flex-wrap gap-3 justify-end">
                  <button
                    onClick={() => {
                      onClose();
                      onNavigate('marketplace');
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20"
                    id="exhibition-view-marketplace-btn"
                  >
                    <Store className="w-4 h-4" />
                    <span>Explore Live Circular Marketplace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Navigation Controls */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-[#080E1D] flex items-center justify-between gap-4">
          <button
            onClick={handlePrev}
            disabled={activeStep === 0}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeStep === 0
                ? 'bg-slate-900 text-slate-600 cursor-not-allowed'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Previous
          </button>

          <div className="text-xs font-mono text-slate-400">
            Step <strong className="text-white">{activeStep + 1}</strong> of {STEPS.length}
          </div>

          <button
            onClick={handleNext}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20"
            id="exhibition-next-step-btn"
          >
            {activeStep === STEPS.length - 1 ? 'Restart Demo' : 'Next Step'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
