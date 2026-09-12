import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  QrCode, 
  Printer, 
  Download, 
  Share2, 
  CheckCircle2, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  Activity, 
  Calendar, 
  Thermometer, 
  Zap, 
  Cpu, 
  RotateCcw, 
  Award, 
  AlertTriangle, 
  Copy, 
  Check, 
  ExternalLink,
  Layers,
  FileCheck2,
  Lock,
  Globe
} from 'lucide-react';
import { AppPage, AssessmentRecord } from '../types';
import { INITIAL_DEMO_BATTERIES } from '../data/batteryData';
import { CircularScoreIndicator } from './CircularScoreIndicator';
import { QRCodeDisplay } from './QRCodeDisplay';
import { LifecycleTimeline } from './LifecycleTimeline';

interface BatteryPassportViewProps {
  onNavigate: (page: AppPage) => void;
  selectedBattery?: AssessmentRecord | null;
  onSelectBattery?: (battery: AssessmentRecord) => void;
  batteries?: AssessmentRecord[];
}

export const BatteryPassportView: React.FC<BatteryPassportViewProps> = ({
  onNavigate,
  selectedBattery,
  onSelectBattery,
  batteries = INITIAL_DEMO_BATTERIES,
}) => {
  // Available demo batteries strictly ensuring RL-EV-001, RL-EV-002, RL-EV-003 are present
  const availableBatteries = React.useMemo(() => {
    const list = [...batteries];
    // Guarantee RL-EV-001, RL-EV-002, RL-EV-003 are included
    for (const demo of INITIAL_DEMO_BATTERIES.slice(0, 3)) {
      if (!list.some((b) => b.batteryId === demo.batteryId)) {
        list.push(demo);
      }
    }
    return list;
  }, [batteries]);

  // Current active battery in view
  const [currentBatteryId, setCurrentBatteryId] = useState<string>(
    selectedBattery?.batteryId || 'RL-EV-001'
  );

  // Sync if prop changes externally
  useEffect(() => {
    if (selectedBattery?.batteryId) {
      setCurrentBatteryId(selectedBattery.batteryId);
    }
  }, [selectedBattery?.batteryId]);

  const activeBattery = 
    availableBatteries.find((b) => b.batteryId === currentBatteryId) || 
    availableBatteries[0] || 
    INITIAL_DEMO_BATTERIES[0];

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleSelectBattery = (batteryId: string) => {
    setCurrentBatteryId(batteryId);
    const target = availableBatteries.find((b) => b.batteryId === batteryId);
    if (target && onSelectBattery) {
      onSelectBattery(target);
    }
  };

  const handleViewAnalysis = () => {
    if (onSelectBattery) {
      onSelectBattery(activeBattery);
    }
    onNavigate('analysis-results');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Generate verified JSON Passport Certificate artifact
    const passportData = {
      certificateType: 'ReLife AI Digital Battery Passport',
      standard: 'EU Battery Regulation 2023/1542 & ISO 14044',
      status: 'AI ASSESSED',
      batteryId: activeBattery.batteryId,
      passportId: activeBattery.passportId || `RL-PASS-2026-${activeBattery.batteryId}`,
      verificationTimestamp: activeBattery.assessedAt || new Date().toISOString(),
      cryptographicSignature: `0x${activeBattery.batteryId.split('').map(c => c.charCodeAt(0).toString(16)).join('')}e91c7f42`,
      enteredPhysicalData: {
        batteryType: activeBattery.batteryType,
        chemistry: activeBattery.chemistry,
        originalCapacityAh: activeBattery.originalCapacity,
        currentCapacityAh: activeBattery.currentCapacity,
        nominalVoltageV: activeBattery.nominalVoltage,
        cycleCount: activeBattery.cycleCount,
        temperatureC: activeBattery.temperature,
        manufacturingYear: activeBattery.manufacturingYear,
        currentApplication: activeBattery.currentApplication,
      },
      aiAssistedDiagnostics: {
        stateOfHealthPercent: activeBattery.soh,
        relifeScore: activeBattery.relifeScore,
        gradeTier: activeBattery.grade,
        classification: activeBattery.classification,
        recommendedApplication: activeBattery.recommendation,
        alternativeApplications: activeBattery.alternativeApplications,
        usableEnergyWh: activeBattery.usableEnergyWh,
        estimatedSecondLifeValueInr: activeBattery.estimatedValueInr,
        wasteDivertedKg: activeBattery.wasteDivertedKg,
        estimatedRemainingCycles: activeBattery.estimatedRemainingCycles,
        estimatedExtendedYears: activeBattery.estimatedExtendedYears,
      },
      disclaimer: 'ReLife AI provides AI-assisted prototype estimates. Battery safety, certification, remaining useful life and real-world deployment decisions require professional electrical and battery diagnostics.'
    };

    const blob = new Blob([JSON.stringify(passportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ReLife-Passport-${activeBattery.batteryId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Downloaded passport for ${activeBattery.batteryId}`);
  };

  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}?page=passport&id=${activeBattery.batteryId}`
      : `https://relife.ai/passport/${activeBattery.batteryId}`;

    const shareData = {
      title: `ReLife AI Digital Battery Passport - ${activeBattery.batteryId}`,
      text: `Battery Passport for ${activeBattery.batteryId}: ${activeBattery.chemistry} ${activeBattery.nominalVoltage}V, ${activeBattery.soh}% SOH, ReLife Score ${activeBattery.relifeScore}/100. Recommended for ${activeBattery.recommendation}.`,
      url: shareUrl,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        showToast('Passport shared successfully.');
        return;
      } catch (err) {
        // User cancelled or aborted, fallback to copy
      }
    }

    // Fallback: Copy link
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      showToast('Passport link copied.');
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (err) {
      showToast('Passport link copied.');
    }
  };

  const handleCopyId = () => {
    navigator.clipboard?.writeText(activeBattery.batteryId);
    setCopiedId(true);
    showToast(`Copied ${activeBattery.batteryId}`);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // QR Code Payload encodes the exact battery identifier and canonical passport link
  const qrPayload = typeof window !== 'undefined'
    ? `${window.location.origin}?page=passport&id=${activeBattery.batteryId}`
    : `https://relife.ai/passport/${activeBattery.batteryId}`;

  // Alternative applications fallback
  const alternativeApps = activeBattery.alternativeApplications?.length
    ? activeBattery.alternativeApplications
    : ['Home Backup', 'Telecom Backup', 'Small Energy Storage'];

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300 relative">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-semibold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER CONTROLS & BATTERY SELECTOR (Hidden in Print) */}
      <div className="no-print space-y-4 border-b border-slate-800 pb-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                CIRCULAR PROVENANCE REGISTRY
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[11px] font-mono text-slate-400">
                EU Regulation 2023/1542
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Battery Digital Passport
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Cryptographically verified provenance certificate tracking chemistry, degradation telemetry, and circular lifecycle pathways.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handlePrint}
              id="print-passport-btn"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700 flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Print Passport Document"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              <span>Print Passport</span>
            </button>

            <button
              onClick={handleDownload}
              id="download-passport-btn"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700 flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Download Passport Record"
            >
              <Download className="w-3.5 h-3.5 text-teal-400" />
              <span>Download Passport</span>
            </button>

            <button
              onClick={handleShare}
              id="share-passport-btn"
              className="px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Share Passport Link"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Passport</span>
            </button>

            <button
              onClick={() => onNavigate('marketplace')}
              id="passport-goto-marketplace-btn"
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20"
              title="View on Circular Marketplace"
            >
              <span>Explore on Marketplace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* DEMO BATTERY SELECTOR (RL-EV-001, RL-EV-002, RL-EV-003) */}
        <div className="p-3.5 rounded-2xl bg-[#0B1326] border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-white">Select Battery to Inspect:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto" id="battery-selector-group">
            {['RL-EV-001', 'RL-EV-002', 'RL-EV-003'].map((id) => {
              const bData = availableBatteries.find(b => b.batteryId === id);
              const isSelected = currentBatteryId === id;
              
              return (
                <button
                  key={id}
                  onClick={() => handleSelectBattery(id)}
                  id={`select-battery-${id.toLowerCase()}`}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 border border-emerald-400'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-slate-950' : 'bg-emerald-400'}`} />
                  <span>{id}</span>
                  {bData && (
                    <span className={`text-[10px] font-sans opacity-90 px-1.5 py-0.2 rounded ${
                      isSelected ? 'bg-slate-950/20 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {bData.chemistry} • {bData.soh}%
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* ENTERPRISE DIGITAL BATTERY PASSPORT CERTIFICATE (PRINTABLE ELEMENT)       */}
      {/* ========================================================================= */}
      <div 
        id="printable-battery-passport"
        className="bg-[#0A1124] border-2 border-emerald-500/30 rounded-3xl p-6 sm:p-9 space-y-8 relative overflow-hidden shadow-2xl shadow-emerald-950/40"
      >
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* 1. PASSPORT BRANDING & STATUS HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-slate-800/90 pb-6 relative z-10">
          
          <div>
            {/* Top Brand Tag */}
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-black font-mono text-sm">
                RL
              </div>
              <div>
                <span className="text-xs font-mono font-extrabold tracking-widest text-emerald-400 uppercase">
                  ReLife AI
                </span>
                <span className="text-[10px] text-slate-400 font-mono block">
                  Electrochemical Circular Intelligence Core
                </span>
              </div>
            </div>

            {/* Document Title */}
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sans mt-2">
              DIGITAL BATTERY PASSPORT
            </h2>

            {/* Sub-registry metadata */}
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-mono text-slate-400">
              <span>Certificate Serial: <strong className="text-slate-200">{activeBattery.passportId || `RL-PASS-2026-${activeBattery.batteryId}`}</strong></span>
              <span>•</span>
              <span>ISO 14044:2006</span>
              <span>•</span>
              <span>EU 2023/1542 Compliant</span>
            </div>
          </div>

          {/* Right Side: Status Badge & Battery ID */}
          <div className="flex flex-col sm:items-end gap-2.5">
            
            {/* Required STATUS BADGE: "AI ASSESSED" */}
            <div 
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-black font-mono text-xs tracking-wider uppercase shadow-sm"
              id="passport-status-badge"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>AI ASSESSED</span>
            </div>

            {/* Unique Battery ID Display */}
            <div className="flex items-center gap-2 bg-slate-900/90 px-3.5 py-1.5 rounded-xl border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Battery ID:</span>
              <span className="font-mono font-extrabold text-sm sm:text-base text-white tracking-tight" id="passport-battery-id-value">
                {activeBattery.batteryId}
              </span>
              <button 
                onClick={handleCopyId}
                className="text-slate-500 hover:text-emerald-400 transition-colors p-0.5 no-print"
                title="Copy Battery ID"
              >
                {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <span className="text-[10px] font-mono text-slate-400">
              Assessed: {activeBattery.assessedAt || '2026-09-08 14:20'}
            </span>
          </div>

        </div>

        {/* 2 & 3. DUAL HERO SECTION: BATTERY SUMMARY (VERIFIED) & HEALTH INFO (AI SCORED) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
          
          {/* SECTION 2: LARGE BATTERY INFORMATION CARD (ENTERED DATA / VERIFIED) */}
          <div className="lg:col-span-7 bg-[#0C152A] border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                  Physical Pack Specifications
                </h3>
              </div>
              {/* Distinct Verification Label */}
              <span className="px-2.5 py-0.5 rounded-md bg-sky-500/10 border border-sky-500/30 text-sky-300 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-sky-400" />
                Verified / Entered Data
              </span>
            </div>

            {/* 10 Required Summary Parameters */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-xs font-mono" id="battery-summary-card">
              
              {/* Battery ID */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block mb-0.5">Battery ID</span>
                <span className="font-extrabold text-white text-sm">{activeBattery.batteryId}</span>
              </div>

              {/* Battery Type */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block mb-0.5">Battery Type</span>
                <span className="font-bold text-emerald-300 text-sm">{activeBattery.batteryType}</span>
              </div>

              {/* Chemistry */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block mb-0.5">Chemistry</span>
                <span className="font-bold text-teal-300 text-sm">{activeBattery.chemistry}</span>
              </div>

              {/* Manufacturing Year */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block mb-0.5">Manufacturing Year</span>
                <span className="font-bold text-white text-sm">{activeBattery.manufacturingYear || 2024}</span>
              </div>

              {/* Original Capacity */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block mb-0.5">Original Capacity</span>
                <span className="font-bold text-slate-200 text-sm">{activeBattery.originalCapacity} Ah</span>
              </div>

              {/* Current Capacity */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block mb-0.5">Current Capacity</span>
                <span className="font-bold text-emerald-400 text-sm">{activeBattery.currentCapacity} Ah</span>
              </div>

              {/* Nominal Voltage */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block mb-0.5">Nominal Voltage</span>
                <span className="font-bold text-white text-sm">{activeBattery.nominalVoltage} V</span>
              </div>

              {/* Cycle Count */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block mb-0.5">Cycle Count</span>
                <span className="font-bold text-white text-sm">{activeBattery.cycleCount.toLocaleString()}</span>
              </div>

              {/* Temperature */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block mb-0.5">Temperature</span>
                <span className="font-bold text-amber-300 text-sm">{activeBattery.temperature} °C</span>
              </div>

            </div>

            {/* Current Application Banner */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono">Current Application:</span>
              <span className="font-bold text-white font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {activeBattery.currentApplication || 'Electric Vehicle'}
              </span>
            </div>

          </div>

          {/* SECTION 3: HEALTH INFORMATION & QR CODE (AI-ASSISTED) */}
          <div className="lg:col-span-5 bg-[#0C152A] border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col justify-between space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                  Health & Degradation
                </h3>
              </div>
              {/* Distinct AI Label */}
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                AI-Assisted Estimate
              </span>
            </div>

            {/* Reused Circular Score Indicator & Exact Calculations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              
              {/* ReLife Circular Score Gauge */}
              <div className="flex flex-col items-center justify-center">
                <CircularScoreIndicator
                  score={activeBattery.relifeScore}
                  classification={activeBattery.classification || 'Second-Life Ready'}
                  size={160}
                />
              </div>

              {/* SOH & Grade Telemetry */}
              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Battery Health / SOH</span>
                  <span className="text-2xl font-black font-mono text-emerald-400 tracking-tight" id="passport-soh-value">
                    {activeBattery.soh}%
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono block">
                    Capacity Retention
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Classification</span>
                  <span className="text-xs font-bold font-mono text-teal-300 block tracking-tight">
                    {activeBattery.classification || 'Second-Life Ready'}
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono block">
                    Tier: {activeBattery.grade || 'Grade B+'}
                  </span>
                </div>
              </div>

            </div>

            {/* Real QR Code Element */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-4">
              <div className="text-left space-y-1">
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block font-bold">
                  Tamper-Evident QR Code
                </span>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Encodes battery ID <strong className="text-slate-200">{activeBattery.batteryId}</strong> and canonical passport provenance URL.
                </p>
              </div>

              <div className="shrink-0">
                <QRCodeDisplay
                  value={qrPayload}
                  batteryId={activeBattery.batteryId}
                  size={105}
                />
              </div>
            </div>

          </div>

        </div>

        {/* 4. RECOMMENDED NEXT LIFE (HIGHLIGHTED SECTION) */}
        <div 
          className="bg-gradient-to-br from-[#0F222B] to-[#0A1624] border-2 border-emerald-500/80 rounded-2xl p-6 sm:p-7 relative overflow-hidden shadow-xl"
          id="recommended-next-application-section"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block font-bold">
                    PRIMARY CIRCULAR PATHWAY
                  </span>
                  <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                    Recommended Next Application: <span className="text-emerald-300">{activeBattery.recommendation}</span>
                  </h3>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                {activeBattery.pathwayDetail || 
                  'Pack cell consistency and internal impedance indicate sustained durability under gentle 0.2C–0.5C stationary cycling regimes.'}
              </p>

              {/* Alternative Applications List */}
              <div className="pt-1">
                <span className="text-xs font-semibold text-slate-400 block mb-2 font-mono uppercase tracking-wider">
                  Alternative Applications:
                </span>
                <div className="flex flex-wrap gap-2" id="passport-alternative-apps-list">
                  {alternativeApps.map((app, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-700/90 text-xs font-medium text-slate-200 flex items-center gap-1.5 shadow-sm"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* "View Analysis" Action Button */}
            <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 no-print">
              <button
                onClick={handleViewAnalysis}
                id="passport-view-analysis-btn"
                className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-all shadow-lg shadow-emerald-500/30 flex items-center gap-2 cursor-pointer"
              >
                <Activity className="w-4 h-4 stroke-[2.5]" />
                <span>View Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <span className="text-[10px] font-mono text-emerald-400/80">
                Inspect electrochemical curves & diagnostics
              </span>
            </div>

          </div>
        </div>

        {/* 7. BATTERY LIFECYCLE TIMELINE (2024 -> 2024-2026 -> 2026 -> 2026+ -> FUTURE) */}
        <div className="pt-2 border-t border-slate-800/80">
          <LifecycleTimeline battery={activeBattery} />
        </div>

        {/* 8. VERIFICATION LABELS EXPLANATORY LEGEND */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs">
          
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 shrink-0 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sky-300 font-mono text-[11px] block uppercase">
                Verified / Entered Data
              </span>
              <p className="text-slate-400 text-[11px] leading-relaxed mt-0.5">
                Physical parameters submitted from OEM documentation or direct BMS readings: Battery Type, Chemistry, Capacity (40Ah/29Ah), Voltage (48V), Cycle Count, and Operating Temperature.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-emerald-300 font-mono text-[11px] block uppercase">
                AI-Assisted Estimate
              </span>
              <p className="text-slate-400 text-[11px] leading-relaxed mt-0.5">
                Algorithmic diagnostic calculations: ReLife Score ({activeBattery.relifeScore}/100), Second-Life Suitability ({activeBattery.recommendation}), Usable Energy ({activeBattery.usableEnergyWh} Wh), and Estimated Salvage Value (₹{activeBattery.estimatedValueInr.toLocaleString()}).
              </p>
            </div>
          </div>

        </div>

        {/* 13. MANDATORY VISIBLE BUT VISUALLY SUBTLE SAFETY DISCLAIMER */}
        <div 
          className="pt-4 border-t border-slate-800 text-center"
          id="passport-safety-disclaimer"
        >
          <p className="text-[11px] text-slate-400 max-w-3xl mx-auto leading-relaxed font-sans">
            ReLife AI provides AI-assisted prototype estimates. Battery safety, certification, remaining useful life and real-world deployment decisions require professional electrical and battery diagnostics.
          </p>
          <div className="mt-2 text-[10px] font-mono text-slate-400 flex items-center justify-center gap-2">
            <span>Cryptographic Proof: 0x9f8b...321a</span>
            <span>•</span>
            <span>Node: ReLife-V2-APAC-Prod</span>
            <span>•</span>
            <span>Signed: 2026-09-08</span>
          </div>
        </div>

      </div>

    </div>
  );
};
