import React, { useState } from 'react';
import { 
  Battery, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  RotateCcw, 
  Thermometer, 
  Gauge, 
  Calendar,
  Layers,
  HelpCircle
} from 'lucide-react';
import { BatteryFormData, BatteryType, ChemistryType, ApplicationType, AssessmentRecord } from '../types';
import { calculateBatteryAssessment } from '../data/batteryData';
import { AnalysisLoadingScreen } from './AnalysisLoadingScreen';
import { analyzeBatteryWithAI } from '../services/aiBatteryService';

interface AddBatteryViewProps {
  onAnalysisComplete: (result: AssessmentRecord) => void;
}

const INITIAL_FORM: BatteryFormData = {
  batteryId: '',
  batteryType: 'EV',
  chemistry: 'LFP',
  originalCapacity: '',
  currentCapacity: '',
  nominalVoltage: '',
  cycleCount: '',
  temperature: '',
  manufacturingYear: '',
  currentApplication: 'Electric Vehicle',
};

export const AddBatteryView: React.FC<AddBatteryViewProps> = ({ onAnalysisComplete }) => {
  const [formData, setFormData] = useState<BatteryFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pendingAssessment, setPendingAssessment] = useState<AssessmentRecord | null>(null);
  const [demoLoadedNotification, setDemoLoadedNotification] = useState<string | null>(null);

  // Exact demo parameters specified in instructions
  const handleLoadDemoBattery = (demoId: 'RL-EV-001' | 'RL-EV-002' | 'RL-EV-003' = 'RL-EV-001') => {
    if (demoId === 'RL-EV-001') {
      setFormData({
        batteryId: 'RL-EV-001',
        batteryType: 'EV',
        chemistry: 'LFP',
        originalCapacity: 40,
        currentCapacity: 29,
        nominalVoltage: 48,
        cycleCount: 1250,
        temperature: 31,
        manufacturingYear: 2024,
        currentApplication: 'Electric Vehicle',
      });
      setDemoLoadedNotification('Loaded demo pack RL-EV-001 (48V 40Ah LFP Pack • SOH 72.5% • Stationary Solar Storage).');
    } else if (demoId === 'RL-EV-002') {
      setFormData({
        batteryId: 'RL-EV-002',
        batteryType: 'EV',
        chemistry: 'NMC',
        originalCapacity: 50,
        currentCapacity: 25,
        nominalVoltage: 48,
        cycleCount: 1800,
        temperature: 34,
        manufacturingYear: 2022,
        currentApplication: 'Electric Vehicle',
      });
      setDemoLoadedNotification('Loaded demo pack RL-EV-002 (48V 50Ah NMC Pack • SOH 50.0% • Refurbishment Candidate).');
    } else {
      setFormData({
        batteryId: 'RL-EV-003',
        batteryType: 'UPS',
        chemistry: 'Lead Acid',
        originalCapacity: 40,
        currentCapacity: 12,
        nominalVoltage: 48,
        cycleCount: 2500,
        temperature: 38,
        manufacturingYear: 2021,
        currentApplication: 'UPS',
      });
      setDemoLoadedNotification('Loaded demo pack RL-EV-003 (48V 40Ah Lead Acid Pack • SOH 30.0% • Recycling Priority).');
    }
    setErrors({});
    setTimeout(() => setDemoLoadedNotification(null), 4500);
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM);
    setErrors({});
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.batteryId.trim()) {
      newErrors.batteryId = 'Battery ID is required (e.g. RL-EV-001)';
    }

    if (formData.originalCapacity === '' || Number(formData.originalCapacity) <= 0) {
      newErrors.originalCapacity = 'Original capacity must be greater than 0 Ah';
    }

    if (formData.currentCapacity === '' || Number(formData.currentCapacity) <= 0) {
      newErrors.currentCapacity = 'Current capacity must be greater than 0 Ah';
    }

    // Validation: Error if Current > Original
    if (
      formData.originalCapacity !== '' &&
      formData.currentCapacity !== '' &&
      Number(formData.currentCapacity) > Number(formData.originalCapacity)
    ) {
      newErrors.currentCapacity = 'Current capacity cannot exceed original nominal capacity';
    }

    if (formData.nominalVoltage === '' || Number(formData.nominalVoltage) <= 0) {
      newErrors.nominalVoltage = 'Nominal voltage is required (e.g. 48V)';
    }

    if (formData.cycleCount === '' || Number(formData.cycleCount) < 0) {
      newErrors.cycleCount = 'Cycle count must be 0 or higher';
    }

    if (formData.temperature === '') {
      newErrors.temperature = 'Operating temperature is required';
    }

    if (formData.manufacturingYear === '' || Number(formData.manufacturingYear) < 2000) {
      newErrors.manufacturingYear = 'Valid manufacturing year is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Compute assessment via AI Analysis Service architecture
      const baseAssessment = calculateBatteryAssessment(formData);
      const aiResult = await analyzeBatteryWithAI({
        batteryId: formData.batteryId,
        batteryType: formData.batteryType,
        chemistry: formData.chemistry,
        originalCapacity: Number(formData.originalCapacity),
        currentCapacity: Number(formData.currentCapacity),
        nominalVoltage: Number(formData.nominalVoltage),
        cycleCount: Number(formData.cycleCount),
        temperature: Number(formData.temperature),
        manufacturingYear: Number(formData.manufacturingYear),
        currentApplication: formData.currentApplication,
      });

      const assessment: AssessmentRecord = {
        ...baseAssessment,
        relifeScore: aiResult.reLifeScore,
        classification: aiResult.healthClassification,
        recommendation: aiResult.secondLifeRecommendation,
        whyRecommendation: aiResult.reasoning,
        alternativeApplications: aiResult.alternativeApplications,
        riskFlags: aiResult.riskFlags,
        confidence: aiResult.confidence,
        aiAnalysis: aiResult,
        safetyNotice: 'AI-assisted prototype estimate. Professional battery diagnostics and safety certification are required before real-world deployment.',
      };

      setPendingAssessment(assessment);
      // Trigger the animated analysis sequence with exact 5 steps
      setIsAnalyzing(true);
    } catch {
      const fallback = calculateBatteryAssessment(formData);
      setPendingAssessment(fallback);
      setIsAnalyzing(true);
    }
  };

  const handleAnalysisAnimationComplete = () => {
    setIsAnalyzing(false);
    setIsSubmitting(false);
    if (pendingAssessment) {
      onAnalysisComplete(pendingAssessment);
    }
  };

  // Realtime preview of SOH if both capacities entered
  const liveSoh = (formData.originalCapacity && formData.currentCapacity && Number(formData.originalCapacity) > 0)
    ? Math.min(100, Math.round((Number(formData.currentCapacity) / Number(formData.originalCapacity)) * 1000) / 10)
    : null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300 relative">
      
      {/* 3-4 Second Professional Analysis Animation */}
      {isAnalyzing && (
        <AnalysisLoadingScreen
          batteryId={formData.batteryId || 'RL-EV-001'}
          onComplete={handleAnalysisAnimationComplete}
        />
      )}
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Add Battery for Lifecycle Intelligence
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Input physical, electrical, and operational metrics to run SOH degradation algorithms and pathway ranking.
          </p>
        </div>

        {/* Demo Quick-Load Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">Demo Presets:</span>
          <button
            type="button"
            onClick={() => handleLoadDemoBattery('RL-EV-001')}
            className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            id="load-demo-rl-ev-001-btn"
          >
            <Sparkles className="w-3.5 h-3.5" />
            RL-EV-001 (72.5%)
          </button>
          <button
            type="button"
            onClick={() => handleLoadDemoBattery('RL-EV-002')}
            className="px-3 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            id="load-demo-rl-ev-002-btn"
          >
            RL-EV-002 (50%)
          </button>
          <button
            type="button"
            onClick={() => handleLoadDemoBattery('RL-EV-003')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            id="load-demo-rl-ev-003-btn"
          >
            RL-EV-003 (30%)
          </button>
        </div>
      </div>

      {demoLoadedNotification && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{demoLoadedNotification}</span>
          </div>
          <button 
            type="button"
            onClick={() => setDemoLoadedNotification(null)}
            className="text-emerald-400 hover:text-emerald-200 text-xs font-mono cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Assessment Form */}
      <form onSubmit={handleSubmit} className="bg-[#0C1427] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-8">
        
        {/* Section 1: Identification & Chemistry */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-800">
            <Battery className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              1. Pack Identification & Cell Chemistry
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Battery ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Battery ID <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                value={formData.batteryId}
                onChange={(e) => setFormData({ ...formData, batteryId: e.target.value })}
                placeholder="e.g. RL-EV-001"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border text-white font-mono text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                  errors.batteryId ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-700'
                }`}
              />
              {errors.batteryId && (
                <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.batteryId}
                </p>
              )}
            </div>

            {/* Battery Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Battery Type <span className="text-emerald-400">*</span>
              </label>
              <select
                value={formData.batteryType}
                onChange={(e) => setFormData({ ...formData, batteryType: e.target.value as BatteryType })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="EV">EV (Electric Vehicle)</option>
                <option value="UPS">UPS (Uninterruptible Power Supply)</option>
                <option value="Solar">Solar / Stationary BESS</option>
                <option value="Laptop">Laptop / Portable Electronics</option>
                <option value="Other">Other Heavy Commercial</option>
              </select>
            </div>

            {/* Chemistry */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Chemistry <span className="text-emerald-400">*</span>
              </label>
              <select
                value={formData.chemistry}
                onChange={(e) => setFormData({ ...formData, chemistry: e.target.value as ChemistryType })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="LFP">LFP (Lithium Iron Phosphate)</option>
                <option value="NMC">NMC (Nickel Manganese Cobalt)</option>
                <option value="Lead Acid">Lead Acid (VRLA / AGM)</option>
                <option value="Other">Other / Solid State</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Capacity & Electrical Parameters */}
        <div>
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-teal-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                2. Capacity & Electrical Parameters
              </h2>
            </div>
            {liveSoh !== null && (
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                Live Calculated SOH: <strong>{liveSoh}%</strong>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Original Capacity */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Original Capacity (Ah) <span className="text-emerald-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  value={formData.originalCapacity}
                  onChange={(e) => setFormData({ ...formData, originalCapacity: e.target.value === '' ? '' : Number(e.target.value) })}
                  placeholder="e.g. 40"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border text-white font-mono text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.originalCapacity ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-700'
                  }`}
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-slate-500 font-mono">Ah</span>
              </div>
              {errors.originalCapacity && (
                <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.originalCapacity}
                </p>
              )}
            </div>

            {/* Current Capacity */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Current Capacity (Ah) <span className="text-emerald-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  value={formData.currentCapacity}
                  onChange={(e) => setFormData({ ...formData, currentCapacity: e.target.value === '' ? '' : Number(e.target.value) })}
                  placeholder="e.g. 29"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border text-white font-mono text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.currentCapacity ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-700'
                  }`}
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-slate-500 font-mono">Ah</span>
              </div>
              {errors.currentCapacity && (
                <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.currentCapacity}
                </p>
              )}
            </div>

            {/* Nominal Voltage */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nominal Voltage (V) <span className="text-emerald-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  value={formData.nominalVoltage}
                  onChange={(e) => setFormData({ ...formData, nominalVoltage: e.target.value === '' ? '' : Number(e.target.value) })}
                  placeholder="e.g. 48"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border text-white font-mono text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.nominalVoltage ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-700'
                  }`}
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-slate-500 font-mono">V</span>
              </div>
              {errors.nominalVoltage && (
                <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.nominalVoltage}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Operational History & Environmental Conditions */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-800">
            <Thermometer className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              3. Operational Stress & Usage History
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
            {/* Cycle Count */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Cycle Count <span className="text-emerald-400">*</span>
              </label>
              <input
                type="number"
                value={formData.cycleCount}
                onChange={(e) => setFormData({ ...formData, cycleCount: e.target.value === '' ? '' : Number(e.target.value) })}
                placeholder="e.g. 1250"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border text-white font-mono text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.cycleCount ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-700'
                }`}
              />
              {errors.cycleCount && (
                <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.cycleCount}
                </p>
              )}
            </div>

            {/* Temperature */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Temperature (°C) <span className="text-emerald-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: e.target.value === '' ? '' : Number(e.target.value) })}
                  placeholder="e.g. 31"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border text-white font-mono text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.temperature ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-700'
                  }`}
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-slate-500 font-mono">°C</span>
              </div>
              {errors.temperature && (
                <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.temperature}
                </p>
              )}
            </div>

            {/* Manufacturing Year */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Mfg Year <span className="text-emerald-400">*</span>
              </label>
              <input
                type="number"
                value={formData.manufacturingYear}
                onChange={(e) => setFormData({ ...formData, manufacturingYear: e.target.value === '' ? '' : Number(e.target.value) })}
                placeholder="e.g. 2024"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border text-white font-mono text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.manufacturingYear ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-700'
                }`}
              />
              {errors.manufacturingYear && (
                <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.manufacturingYear}
                </p>
              )}
            </div>

            {/* Current Application */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Current Application <span className="text-emerald-400">*</span>
              </label>
              <select
                value={formData.currentApplication}
                onChange={(e) => setFormData({ ...formData, currentApplication: e.target.value as ApplicationType })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Electric Vehicle">Electric Vehicle</option>
                <option value="Home Backup">Home Backup</option>
                <option value="UPS">UPS Standby</option>
                <option value="Solar Storage">Solar Storage</option>
                <option value="Laptop">Laptop / Electronic</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* FORMULA CALLOUT */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
          <Zap className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-slate-200 font-semibold">State of Health (SOH) Algorithmic Formula:</span>
            <p>
              <code className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 font-mono">SOH = (Current Capacity / Original Capacity) × 100</code>.
              Packs with SOH ≥ 65% are prioritized for stationary solar and home energy storage (BESS) repurposing.
            </p>
          </div>
        </div>

        {/* Form Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Form
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleLoadDemoBattery}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700 cursor-pointer"
            >
              Load Demo Battery
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              id="analyze-battery-submit-btn"
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-700 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  Calculating SOH...
                </>
              ) : (
                <>
                  Analyze Battery
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </div>
        </div>

      </form>

    </div>
  );
};
