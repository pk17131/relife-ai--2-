import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  TrendingUp, 
  Recycle, 
  Coins, 
  ShieldCheck, 
  QrCode, 
  BatteryCharging, 
  Layers, 
  Share2,
  FileCheck,
  Zap,
  Info,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  RotateCcw,
  Wrench,
  Bot,
  Store,
  Compass,
  Cpu,
  Tag
} from 'lucide-react';
import { AssessmentRecord, AppPage, FeasibilityLevel } from '../types';
import { CircularScoreIndicator } from './CircularScoreIndicator';
import { SecondLifeMatchScores } from './SecondLifeMatchScores';
import { BatteryHealthTimeline } from './BatteryHealthTimeline';
import { calculateSuitabilityScores } from '../services/suitabilityService';

interface AnalysisResultsViewProps {
  assessment: AssessmentRecord | null;
  onNavigate: (page: AppPage) => void;
  onSaveToBatteries: (assessment: AssessmentRecord) => void;
  onListOnMarketplace?: (assessment: AssessmentRecord) => void;
  isSaved?: boolean;
  isListed?: boolean;
}

export const AnalysisResultsView: React.FC<AnalysisResultsViewProps> = ({
  assessment,
  onNavigate,
  onSaveToBatteries,
  onListOnMarketplace,
  isSaved = false,
  isListed = false,
}) => {
  const [saved, setSaved] = useState(isSaved);
  const [whyExpanded, setWhyExpanded] = useState(true);

  if (!assessment) {
    return (
      <div className="text-center py-20 bg-[#0C1427] border border-slate-800 rounded-2xl max-w-xl mx-auto my-12 p-8">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
          <Zap className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">No Battery Assessment Loaded</h3>
        <p className="text-slate-400 text-xs mb-6">
          Input electrical and physical pack parameters to generate lifecycle and SOH diagnostic intelligence.
        </p>
        <button
          onClick={() => onNavigate('add-battery')}
          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors inline-flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
          id="empty-state-run-assessment-btn"
        >
          <Zap className="w-4 h-4" />
          Assess a Battery
        </button>
      </div>
    );
  }

  const handleSave = () => {
    setSaved(true);
    onSaveToBatteries(assessment);
  };

  // Extract or fallback values strictly adhering to requirements
  const batteryHealth = assessment.soh;
  const relifeScore = assessment.relifeScore || 84;
  const classification = assessment.classification || 'Second-Life Ready';
  const primaryRecommendation = assessment.recommendation || 'Stationary Solar Storage';
  const alternativeApps = assessment.alternativeApplications?.length 
    ? assessment.alternativeApplications 
    : ['Home Backup', 'Telecom Backup', 'Small Energy Storage'];

  const whyExplanation = assessment.whyRecommendation || 
    assessment.aiAnalysis?.reasoning ||
    "The battery retains approximately 72.5% of its original capacity. While it may no longer be optimal for demanding EV applications, its remaining capacity may make it suitable for stationary energy-storage applications, subject to professional testing.";

  const riskFlags = assessment.riskFlags?.length
    ? assessment.riskFlags
    : assessment.aiAnalysis?.riskFlags?.length
    ? assessment.aiAnalysis.riskFlags
    : [
        assessment.temperature > 35 
          ? `Operating temperature (${assessment.temperature}°C) indicates need for active thermal management.`
          : `Operating temperature (${assessment.temperature}°C) is within safe operational limits.`,
        `Cell voltage variance should be verified under load prior to permanent deployment.`,
        assessment.chemistry === 'NMC'
          ? 'NMC cathode requires active BMS overcurrent and cell-balancing telemetry.'
          : 'LFP cell chemistry offers high thermal runaway stability threshold.'
      ];

  const confidence = assessment.confidence || assessment.aiAnalysis?.confidence || 94;

  const suitability = React.useMemo(() => {
    return calculateSuitabilityScores({
      originalCapacity: assessment.originalCapacity,
      currentCapacity: assessment.currentCapacity,
      nominalVoltage: assessment.nominalVoltage,
      cycleCount: assessment.cycleCount,
      temperature: assessment.temperature,
      chemistry: assessment.chemistry,
      batteryId: assessment.batteryId,
    });
  }, [
    assessment.originalCapacity,
    assessment.currentCapacity,
    assessment.nominalVoltage,
    assessment.cycleCount,
    assessment.temperature,
    assessment.chemistry,
    assessment.batteryId,
  ]);

  // Lifecycle Options Cards
  const lifecycleOptions = assessment.lifecycleOptions || {
    reuse: 'Low',
    refurbish: 'Medium',
    repurpose: 'High',
    recycle: 'Low',
    recommended: 'Repurpose',
  };

  const getFeasibilityBadgeStyle = (level: FeasibilityLevel, isRecommended: boolean) => {
    if (isRecommended) {
      return 'bg-emerald-500 text-slate-950 font-black shadow-sm';
    }
    switch (level) {
      case 'High':
        return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
      case 'Medium':
        return 'bg-amber-500/15 text-amber-300 border border-amber-500/30';
      case 'Low':
        return 'bg-slate-800 text-slate-400 border border-slate-700';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Navigation & Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <button
            onClick={() => onNavigate('add-battery')}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 mb-2 transition-colors cursor-pointer"
            id="back-to-add-battery-btn"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Assessment Form
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Analysis Results
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
              {assessment.batteryId}
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Standardized SOH verification and second-life pathway recommendation.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saved}
            id="save-to-batteries-btn"
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer ${
              saved 
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30' 
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {saved ? 'Saved to My Batteries' : 'Save to My Batteries'}
          </button>

          <button
            onClick={() => onNavigate('passport')}
            id="header-view-passport-btn"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-emerald-400" />
            Digital Passport
          </button>
        </div>
      </div>

      {/* MANDATORY SAFETY NOTICE BANNER */}
      <div 
        className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/25 text-xs text-amber-200/90 flex items-start gap-3.5 shadow-sm"
        id="safety-notice-banner"
      >
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-amber-300 block uppercase tracking-wider text-[11px] font-mono">
            Safety & Diagnostic Advisory
          </span>
          <p className="leading-relaxed">
            AI-assisted prototype estimate. Professional battery diagnostics and safety certification are required before real-world deployment.
          </p>
        </div>
      </div>

      {/* CORE EVALUATION HERO BANNER (Animated Circular Score + Health + Classification) */}
      <div className="bg-gradient-to-br from-[#0D182E] to-[#0A1122] border border-emerald-500/20 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Circular Animated Score Indicator (0 to 84) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-800 pb-6 lg:pb-0 lg:pr-8">
            <CircularScoreIndicator
              score={relifeScore}
              classification={classification}
              size={185}
            />

            {/* SOH & Grade Highlights */}
            <div className="mt-5 w-full grid grid-cols-2 gap-3 max-w-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 font-mono block">Battery Health</span>
                <span className="text-xl font-extrabold text-emerald-400 font-mono tracking-tight" id="hero-battery-health-soh">
                  {batteryHealth}%
                </span>
                <span className="text-[9px] text-emerald-500/80 font-mono block">Calculated SOH</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 font-mono block">Grade Tier</span>
                <span className="text-xl font-extrabold text-teal-300 font-mono tracking-tight" id="hero-grade-tier">
                  {assessment.grade}
                </span>
                <span className="text-[9px] text-slate-500 font-mono block">ISO 14040/44</span>
              </div>
            </div>
          </div>

          {/* SECOND-LIFE RECOMMENDATION & SUMMARY */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Primary Recommendation
              </div>

              <h2 
                className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight"
                id="primary-recommendation-title"
              >
                {primaryRecommendation}
              </h2>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {assessment.pathwayDetail}
            </p>

            {/* Alternative Applications List */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-400 block mb-2 font-mono uppercase tracking-wider">
                Alternative Applications:
              </span>
              <div className="flex flex-wrap gap-2" id="alternative-applications-list">
                {alternativeApps.map((app, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-700/80 text-xs font-medium text-slate-200 flex items-center gap-1.5 shadow-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                    {app}
                  </span>
                ))}
              </div>
            </div>

            {/* EXPANDABLE "Why this recommendation?" SECTION */}
            <div className="pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setWhyExpanded(!whyExpanded)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 transition-colors cursor-pointer"
                id="toggle-why-recommendation-btn"
              >
                <div className="flex items-center gap-2 text-emerald-400">
                  <Info className="w-4 h-4" />
                  <span>Why this recommendation?</span>
                </div>
                {whyExpanded ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {whyExpanded && (
                <div 
                  className="mt-2.5 p-4 rounded-xl bg-[#080E1C] border border-slate-800/90 text-xs text-slate-300 leading-relaxed space-y-2 animate-in fade-in duration-200"
                  id="why-recommendation-content"
                >
                  <p className="font-sans">
                    {whyExplanation}
                  </p>
                  <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 flex items-center gap-2 font-mono">
                    <span className="text-emerald-400">●</span>
                    Recommended charge/discharge rate: <strong>0.2C to 0.5C float</strong>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* AI INTELLIGENCE DIAGNOSTIC LAYER */}
      <div 
        className="bg-gradient-to-br from-[#0B152B] via-[#091124] to-[#070D1B] border border-emerald-500/30 rounded-2xl p-6 space-y-5 shadow-xl relative overflow-hidden"
        id="ai-intelligence-diagnostic-layer"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                AI Lifecycle Intelligence Report
              </h3>
              <p className="text-xs text-slate-400">
                Multi-factor degradation inference & circular destiny mapping
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5">
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              AI-ASSISTED PROTOTYPE ESTIMATE
            </span>
          </div>
        </div>

        {/* 8-Item Core Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {/* 1. Battery Health */}
          <div className="p-3.5 rounded-xl bg-[#080E1D] border border-slate-800">
            <span className="text-slate-400 block text-[11px] font-mono">Battery Health</span>
            <span className="text-xl font-mono font-extrabold text-emerald-400 mt-1 block" id="diag-battery-health">
              {batteryHealth}%
            </span>
            <span className="text-[10px] text-slate-500">Calculated SOH</span>
          </div>

          {/* 2. ReLife Score */}
          <div className="p-3.5 rounded-xl bg-[#080E1D] border border-slate-800">
            <span className="text-slate-400 block text-[11px] font-mono">ReLife Score</span>
            <span className="text-xl font-mono font-extrabold text-white mt-1 block" id="diag-relife-score">
              {relifeScore} <span className="text-xs text-slate-400 font-normal">/ 100</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">Weighted Index</span>
          </div>

          {/* 3. Classification */}
          <div className="p-3.5 rounded-xl bg-[#080E1D] border border-slate-800">
            <span className="text-slate-400 block text-[11px] font-mono">Classification</span>
            <span className="text-sm font-bold text-teal-300 mt-1 block truncate" id="diag-classification">
              {classification}
            </span>
            <span className="text-[10px] text-slate-500">DIN SPEC 91472</span>
          </div>

          {/* 4. Confidence */}
          <div className="p-3.5 rounded-xl bg-[#080E1D] border border-slate-800">
            <span className="text-slate-400 block text-[11px] font-mono">Confidence</span>
            <span className="text-xl font-mono font-extrabold text-cyan-300 mt-1 block" id="diag-confidence">
              {confidence}%
            </span>
            <span className="text-[10px] text-slate-500">Model Reliability</span>
          </div>
        </div>

        {/* Best Next Life & Alternative Applications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="p-4 rounded-xl bg-[#080E1D] border border-emerald-500/20 space-y-1.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 block">
              Best Next Life
            </span>
            <h4 className="text-base font-bold text-white flex items-center gap-2" id="diag-best-next-life">
              <Zap className="w-4 h-4 text-emerald-400" />
              {primaryRecommendation}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Highest circular value retention with minimal refurbishment overhead.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#080E1D] border border-slate-800 space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
              Alternative Applications
            </span>
            <div className="flex flex-wrap gap-1.5" id="diag-alternative-apps">
              {alternativeApps.map((app, idx) => (
                <span 
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700/80 text-[11px] text-slate-200 font-medium"
                >
                  {app}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* AI Reasoning */}
        <div className="p-4 rounded-xl bg-[#080E1D] border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-slate-300 font-semibold text-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Reasoning</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans" id="diag-ai-reasoning">
            {whyExplanation}
          </p>
        </div>

        {/* Risk Flags */}
        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-amber-300 flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              Risk Flags & Diagnostic Notices ({riskFlags.length})
            </span>
            <span className="text-[10px] font-mono text-slate-400">Diagnostic Gate</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300" id="diag-risk-flags-list">
            {riskFlags.map((flag, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">›</span>
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Guided Demo Flow Quick Navigation */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs">
            <span className="text-slate-400 block font-mono text-[11px]">Recommended Next Step in Demo:</span>
            <span className="text-white font-semibold">Inspect verified provenance or list on circular marketplace</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('passport')}
              id="demo-next-passport-btn"
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              View Digital Passport
              <ArrowRight className="w-3 h-3" />
            </button>
            <button
              onClick={() => onNavigate('marketplace')}
              id="demo-next-marketplace-btn"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors border border-slate-700 flex items-center gap-1.5 cursor-pointer"
            >
              <Store className="w-3.5 h-3.5 text-slate-400" />
              Go to Marketplace
            </button>
          </div>
        </div>

      </div>

      {/* SECOND-LIFE MATCH SCORE (6 Applications with BEST NEXT LIFE highlighted) */}
      <SecondLifeMatchScores suitability={suitability} />

      {/* BATTERY HEALTH TIMELINE (Prototype Estimate) */}
      <BatteryHealthTimeline 
        soh={assessment.soh} 
        cycleCount={assessment.cycleCount} 
        batteryId={assessment.batteryId} 
      />

      {/* LIFECYCLE OPTIONS (Four Cards: Reuse, Refurbish, Repurpose, Recycle) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Lifecycle Options Assessment
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparative suitability matrix across circular economy pathways.
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
            Standard: DIN SPEC 91472
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="lifecycle-options-grid">
          
          {/* 1. REUSE */}
          <div className="bg-[#0C1427] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-3 relative hover:border-slate-700 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${getFeasibilityBadgeStyle(lifecycleOptions.reuse, false)}`}>
                  {lifecycleOptions.reuse}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Reuse</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct re-installation in original application without alteration.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
              Vehicle duty not advised
            </div>
          </div>

          {/* 2. REFURBISH */}
          <div className="bg-[#0C1427] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-3 relative hover:border-slate-700 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400">
                  <Wrench className="w-4 h-4" />
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${getFeasibilityBadgeStyle(lifecycleOptions.refurbish, false)}`}>
                  {lifecycleOptions.refurbish}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Refurbish</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cell balancing, BMS firmware updates, and contactor replacements.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
              Partial module repair
            </div>
          </div>

          {/* 3. REPURPOSE (HIGHLIGHTED & RECOMMENDED) */}
          <div 
            className="bg-gradient-to-b from-[#0F2228] to-[#0A1624] border-2 border-emerald-500 rounded-2xl p-5 flex flex-col justify-between space-y-3 relative shadow-lg shadow-emerald-950/40"
            id="lifecycle-card-repurpose-recommended"
          >
            {/* "Recommended" Highlight Tag */}
            <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] tracking-wider uppercase shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Recommended
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <Zap className="w-4 h-4" />
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${getFeasibilityBadgeStyle(lifecycleOptions.repurpose, true)}`}>
                  {lifecycleOptions.repurpose}
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-white mb-1 flex items-center gap-1.5">
                Repurpose
              </h4>
              <p className="text-xs text-emerald-100/80 leading-relaxed">
                Reconfigured into stationary residential solar or telecom backup storage.
              </p>
            </div>
            <div className="pt-3 border-t border-emerald-500/30 text-[11px] text-emerald-400 font-mono font-bold flex items-center justify-between">
              <span>Primary Pathway</span>
              <span>+7 to 9 Yrs</span>
            </div>
          </div>

          {/* 4. RECYCLE */}
          <div className="bg-[#0C1427] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-3 relative hover:border-slate-700 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                  <Recycle className="w-4 h-4" />
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${getFeasibilityBadgeStyle(lifecycleOptions.recycle, false)}`}>
                  {lifecycleOptions.recycle}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Recycle</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Shredding into black mass for hydrometallurgical material recovery.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
              Premature for 72.5% SOH
            </div>
          </div>

        </div>
      </div>

      {/* VALUE ESTIMATION CARDS (Labeled clearly: Prototype Estimate) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Coins className="w-4 h-4 text-emerald-400" />
                Value & Circularity Estimation
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-mono text-amber-300 font-bold uppercase tracking-wider">
                Prototype Estimate
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Algorithmic salvage and energy estimations. Not guaranteed real-world measurements.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5" id="value-estimation-cards">
          
          {/* Card 1: Estimated Second-Life Value */}
          <div className="bg-[#0C1427] border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Second-Life Value
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Prototype Estimate
              </span>
            </div>
            <div className="flex items-baseline gap-1 my-1">
              <span 
                className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight"
                id="estimated-value-inr"
              >
                ₹{assessment.estimatedValueInr.toLocaleString()}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Estimated market salvage value based on current decentralized energy storage demand.
            </p>
          </div>

          {/* Card 2: Estimated Usable Energy */}
          <div className="bg-[#0C1427] border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Usable Energy
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Prototype Estimate
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 my-1">
              <span 
                className="text-3xl sm:text-4xl font-extrabold font-mono text-teal-300 tracking-tight"
                id="estimated-usable-energy-wh"
              >
                {assessment.usableEnergyWh.toLocaleString()}
              </span>
              <span className="text-sm font-mono text-teal-400 font-bold">Wh</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Calculated from nominal pack voltage ({assessment.nominalVoltage}V) × retention capacity ({assessment.currentCapacity}Ah).
            </p>
          </div>

          {/* Card 3: Potential Waste Diversion */}
          <div className="bg-[#0C1427] border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Waste Diversion
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Prototype Estimate
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 my-1">
              <span 
                className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-400 tracking-tight"
                id="potential-waste-diversion-kg"
              >
                {assessment.wasteDivertedKg}
              </span>
              <span className="text-sm font-mono text-emerald-400 font-bold">kg</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              E-waste and toxic heavy metal weight diverted from premature scrap disposal.
            </p>
          </div>

        </div>
      </div>

      {/* DETAILED DIAGNOSTIC & DIGITAL PASSPORT SNAPSHOT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Electrochemical Capacity Retention */}
        <div className="bg-[#0C1427] border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BatteryCharging className="w-4 h-4 text-emerald-400" />
            Capacity & Impedance Telemetry
          </h3>

          <div className="space-y-4 text-xs">
            {/* Retention Bar */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1.5">
                <span>Capacity Retention</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {assessment.currentCapacity} Ah / {assessment.originalCapacity} Ah ({batteryHealth}%)
                </span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="h-full bg-emerald-500 rounded-full" 
                  style={{ width: `${Math.min(100, assessment.soh)}%` }} 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <span className="text-slate-400 block text-[11px]">Nominal Voltage</span>
                <span className="text-sm font-mono font-bold text-white">{assessment.nominalVoltage} V</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <span className="text-slate-400 block text-[11px]">Chemistry Type</span>
                <span className="text-sm font-mono font-bold text-teal-300">{assessment.chemistry}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <span className="text-slate-400 block text-[11px]">Total Recorded Cycles</span>
                <span className="text-sm font-mono font-bold text-white">{assessment.cycleCount}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <span className="text-slate-400 block text-[11px]">Operating Temperature</span>
                <span className="text-sm font-mono font-bold text-amber-300">{assessment.temperature} °C</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-slate-300 text-[11px] flex items-start gap-2">
              <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                LFP cell structure exhibits a flatter voltage plateau and superior thermal runaway resistance, enabling reliable cycling in stationary solar storage even at {batteryHealth}% SOH.
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Digital Battery Passport Preview */}
        <div className="bg-[#0C1427] border border-slate-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Digital Battery Passport
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                EU 2023/1542
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Cryptographically signed provenance document tracking carbon footprint, chemistry, and circularity.
            </p>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Passport Serial</span>
                  <p className="text-xs font-mono font-bold text-white">{assessment.passportId}</p>
                </div>
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <QrCode className="w-6 h-6" />
                </div>
              </div>

              <div className="text-[11px] space-y-1.5 pt-2 border-t border-slate-800">
                <div className="flex justify-between text-slate-300">
                  <span>Carbon Handprint:</span>
                  <span className="font-mono text-emerald-400">~148 kg CO₂e Offset</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Estimated Remaining Cycles:</span>
                  <span className="font-mono text-white">~{assessment.estimatedRemainingCycles.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Extended Life Expectancy:</span>
                  <span className="font-mono text-teal-300">{assessment.estimatedExtendedYears}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('passport')}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors border border-slate-700 flex items-center justify-center gap-2 cursor-pointer"
              id="view-passport-card-btn"
            >
              <QrCode className="w-3.5 h-3.5 text-emerald-400" />
              View Digital Passport
            </button>
            <button
              onClick={() => onNavigate('assistant')}
              className="flex-1 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-xs transition-colors border border-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer"
              id="ask-ai-assistant-btn"
            >
              <Bot className="w-3.5 h-3.5" />
              Ask AI Assistant
            </button>
          </div>
        </div>

      </div>

      {/* WORKING ACTION NAVIGATION BAR */}
      <div 
        className="p-6 rounded-2xl bg-[#0E172C] border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-5 shadow-lg"
        id="working-action-navigation-bar"
      >
        <div className="text-center md:text-left">
          <h4 className="text-sm font-bold text-white flex items-center justify-center md:justify-start gap-2">
            <Compass className="w-4 h-4 text-emerald-400" />
            Next Lifecycle Actions
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Access verified passport provenance, browse available BESS buyers, or evaluate another battery.
          </p>
        </div>

        {/* The 3 explicitly required working navigation buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full md:w-auto">
          {/* Button 1: View Digital Passport */}
          <button
            onClick={() => onNavigate('passport')}
            id="nav-view-digital-passport-btn"
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <QrCode className="w-3.5 h-3.5 text-emerald-400" />
            View Digital Passport
          </button>

          {/* Button 2: List on Marketplace / Explore Marketplace */}
          {isListed ? (
            <button
              onClick={() => onNavigate('marketplace')}
              id="nav-listed-marketplace-btn"
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 text-xs font-semibold transition-colors border border-teal-500/30 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Tag className="w-3.5 h-3.5 text-teal-400" />
              Listed on Marketplace
            </button>
          ) : (
            <button
              onClick={() => {
                if (onListOnMarketplace && assessment) {
                  onListOnMarketplace(assessment);
                } else {
                  onNavigate('marketplace');
                }
              }}
              id="nav-list-on-marketplace-btn"
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 text-xs font-semibold transition-colors border border-teal-500/30 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Tag className="w-3.5 h-3.5 text-teal-400" />
              List on Marketplace
            </button>
          )}

          {/* Button 3: Explore Marketplace */}
          <button
            onClick={() => onNavigate('marketplace')}
            id="nav-explore-marketplace-btn"
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Store className="w-3.5 h-3.5 text-slate-400" />
            Explore Marketplace
          </button>

          {/* Button 3: Analyze Another Battery */}
          <button
            onClick={() => onNavigate('add-battery')}
            id="nav-analyze-another-battery-btn"
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 stroke-[2.5]" />
            Analyze Another Battery
          </button>
        </div>
      </div>

    </div>
  );
};
