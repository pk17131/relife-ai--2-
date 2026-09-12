import React, { useState } from 'react';
import { 
  X, 
  Zap, 
  Cpu, 
  CheckCircle2, 
  ArrowRight, 
  BatteryMedium, 
  ShieldCheck, 
  Download, 
  FileText,
  Sliders,
  ExternalLink,
  Sparkles,
  Building,
  Mail,
  User,
  ShoppingBag
} from 'lucide-react';
import { ReLifeLogo } from './ReLifeLogo';

export type ModalType = 
  | 'analyze' 
  | 'marketplace' 
  | 'login' 
  | 'get-started' 
  | 'passport' 
  | null;

interface InteractiveModalsProps {
  activeModal: ModalType;
  onClose: () => void;
  onOpenModal: (type: ModalType) => void;
}

export const InteractiveModals: React.FC<InteractiveModalsProps> = ({
  activeModal,
  onClose,
  onOpenModal,
}) => {
  // Simulator State for "Analyze a Battery"
  const [packChemistry, setPackChemistry] = useState<string>('NMC 811');
  const [initialCapacity, setInitialCapacity] = useState<number>(64);
  const [mileageKm, setMileageKm] = useState<number>(85000);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<boolean>(false);

  // Form states for login/get-started
  const [loginEmail, setLoginEmail] = useState<string>('engineer@fleet-oem.com');
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);
  const [onboardSubmitted, setOnboardSubmitted] = useState<boolean>(false);

  if (!activeModal) return null;

  const handleRunAnalysis = () => {
    setAnalyzing(true);
    setAnalysisResult(false);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalysisResult(true);
    }, 850);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginSuccess(true);
    setTimeout(() => {
      setLoginSuccess(false);
      onClose();
    }, 1200);
  };

  const handleOnboardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOnboardSubmitted(true);
    setTimeout(() => {
      setOnboardSubmitted(false);
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#050914]/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div 
        className="relative w-full max-w-2xl bg-[#0C1427] border border-slate-700/80 rounded-2xl shadow-2xl p-5 sm:p-7 text-slate-100 my-8 z-10 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Subtle accent border at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ========================================================= */}
        {/* 1. ANALYZE A BATTERY MODAL */}
        {/* ========================================================= */}
        {activeModal === 'analyze' && (
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Battery Lifecycle Diagnostic Simulator
                </h3>
                <p className="text-xs text-slate-400">
                  Interactive AI pathway evaluator for retired traction packs
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {/* Input Parameters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900/70 p-3.5 rounded-xl border border-slate-800">
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">
                    Cell Chemistry
                  </label>
                  <select
                    value={packChemistry}
                    onChange={(e) => setPackChemistry(e.target.value)}
                    className="w-full bg-slate-800 text-slate-100 text-xs rounded-lg px-2.5 py-2 border border-slate-700 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="NMC 811">NMC 811 (High Density)</option>
                    <option value="LFP (LiFePO4)">LFP (Iron Phosphate)</option>
                    <option value="NMC 622">NMC 622</option>
                    <option value="NCA">NCA (Nickel Cobalt Al)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">
                    Original Pack Capacity
                  </label>
                  <select
                    value={initialCapacity}
                    onChange={(e) => setInitialCapacity(Number(e.target.value))}
                    className="w-full bg-slate-800 text-slate-100 text-xs rounded-lg px-2.5 py-2 border border-slate-700 focus:outline-none focus:border-emerald-500"
                  >
                    <option value={30}>30.2 kWh (Compact EV)</option>
                    <option value={40}>40.0 kWh (Crossover EV)</option>
                    <option value={64}>64.0 kWh (Long Range)</option>
                    <option value={80}>80.0 kWh (Commercial/SUV)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">
                    Recorded EV Mileage
                  </label>
                  <select
                    value={mileageKm}
                    onChange={(e) => setMileageKm(Number(e.target.value))}
                    className="w-full bg-slate-800 text-slate-100 text-xs rounded-lg px-2.5 py-2 border border-slate-700 focus:outline-none focus:border-emerald-500"
                  >
                    <option value={55000}>55,000 km (~88% SOH)</option>
                    <option value={85000}>85,000 km (~79% SOH)</option>
                    <option value={140000}>140,000 km (~71% SOH)</option>
                    <option value={220000}>220,000 km (~58% SOH)</option>
                  </select>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleRunAnalysis}
                disabled={analyzing}
                className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-60 cursor-pointer"
              >
                {analyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    Running Neural Degradation Matrix...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-current" />
                    Simulate AI Lifecycle Assessment
                  </>
                )}
              </button>

              {/* Diagnostic Results Card */}
              {analysisResult && (
                <div className="bg-[#08101F] border border-emerald-500/30 rounded-xl p-4 space-y-3.5 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                        Assessment Confirmed
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      ID: RL-2026-NMC-094
                    </span>
                  </div>

                  {/* Top Verdict */}
                  <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30">
                    <span className="text-[10px] uppercase font-mono text-emerald-300 block mb-0.5">
                      Recommended Next-Life Pathway
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                        Stationary Solar BESS (Microgrid Buffering)
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-mono font-bold text-xs">
                        94.8% Match
                      </span>
                    </div>
                  </div>

                  {/* Diagnostic Metric Breakdown */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">State of Health (SOH)</span>
                      <span className="text-base font-bold font-mono text-emerald-400">79.2%</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Remaining Cycles</span>
                      <span className="text-base font-bold font-mono text-white">2,850 cyc</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Added Usable Life</span>
                      <span className="text-base font-bold font-mono text-teal-300">+9.4 Years</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Recovered Value</span>
                      <span className="text-base font-bold font-mono text-amber-400">₹1,48,500</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-slate-400">
                      Eligible for instant listing on the ReLife Circular Marketplace.
                    </span>
                    <button
                      onClick={() => onOpenModal('marketplace')}
                      className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      View Buyer Listings <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. EXPLORE MARKETPLACE MODAL */}
        {/* ========================================================= */}
        {activeModal === 'marketplace' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    ReLife Circular Marketplace
                  </h3>
                  <p className="text-xs text-slate-400">
                    Verified second-life battery inventory available for BESS & solar integration
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline-flex items-center px-2 py-1 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-300">
                PROTOTYPE DIRECTORY
              </span>
            </div>

            {/* Inventory List Preview */}
            <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
              {[
                {
                  id: 'LOT-NMC-841',
                  pack: 'Tata Nexon EV Max Pack',
                  chemistry: 'NMC • 40.5 kWh',
                  soh: '81.4%',
                  grade: 'Grade A (BESS Ready)',
                  quantity: '14 Packs Available',
                  price: '₹1,95,000 / pack',
                  location: 'Pune / Mumbai Hub',
                },
                {
                  id: 'LOT-LFP-302',
                  pack: 'Commercial Fleet LFP Modules',
                  chemistry: 'LFP • 3.2V 100Ah Cells',
                  soh: '84.0%',
                  grade: 'Grade A (Microgrid)',
                  quantity: '180 Modules Available',
                  price: '₹3,400 / module',
                  location: 'Bengaluru Logistics',
                },
                {
                  id: 'LOT-NMC-119',
                  pack: 'MG ZS EV Battery System',
                  chemistry: 'NMC • 50.3 kWh',
                  soh: '76.8%',
                  grade: 'Grade B+ (Stationary)',
                  quantity: '6 Packs Available',
                  price: '₹2,30,000 / pack',
                  location: 'Delhi NCR Hub',
                },
              ].map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                        {item.id}
                      </span>
                      <h4 className="text-sm font-bold text-white">{item.pack}</h4>
                    </div>
                    <p className="text-xs text-slate-300">
                      {item.chemistry} • SOH: <span className="text-emerald-400 font-semibold">{item.soh}</span> • {item.location}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="text-teal-300">{item.grade}</span>
                      <span>•</span>
                      <span>{item.quantity}</span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                    <span className="text-sm font-bold font-mono text-emerald-400">
                      {item.price}
                    </span>
                    <button
                      onClick={() => onOpenModal('get-started')}
                      className="mt-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-colors border border-slate-700 cursor-pointer"
                    >
                      Reserve Lot
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
              <span>All packs include verified digital battery impedance test records.</span>
              <button
                onClick={() => onOpenModal('get-started')}
                className="text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
              >
                Join Buyer Network →
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 3. DIGITAL BATTERY PASSPORT MODAL */}
        {/* ========================================================= */}
        {activeModal === 'passport' && (
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Digital Battery Passport Preview
                </h3>
                <p className="text-xs text-slate-400">
                  EU Battery Regulation compliant digital traceability for secondary use
                </p>
              </div>
            </div>

            <div className="bg-[#080E1D] border border-slate-800 rounded-xl p-4 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-white p-1 rounded-lg shrink-0 flex items-center justify-center">
                    {/* Simulated QR Code SVG */}
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <rect width="100" height="100" fill="white" />
                      <rect x="10" y="10" width="30" height="30" fill="black" />
                      <rect x="16" y="16" width="18" height="18" fill="white" />
                      <rect x="20" y="20" width="10" height="10" fill="black" />
                      
                      <rect x="60" y="10" width="30" height="30" fill="black" />
                      <rect x="66" y="16" width="18" height="18" fill="white" />
                      <rect x="70" y="20" width="10" height="10" fill="black" />

                      <rect x="10" y="60" width="30" height="30" fill="black" />
                      <rect x="16" y="66" width="18" height="18" fill="white" />
                      <rect x="20" y="70" width="10" height="10" fill="black" />

                      <rect x="50" y="50" width="10" height="10" fill="black" />
                      <rect x="65" y="55" width="15" height="10" fill="black" />
                      <rect x="50" y="70" width="20" height="10" fill="black" />
                      <rect x="75" y="75" width="15" height="15" fill="black" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase">
                      QR Passport Token: #RL-PASS-8092-A
                    </span>
                    <h4 className="text-base font-bold text-white">
                      Automotive Pack Repurpose Certificate
                    </h4>
                    <p className="text-xs text-slate-400">
                      Manufacturer: Tata Motors • Pack: 40.5 kWh LFP • Vin: MAT6129481
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                  VERIFIED AUDIT
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Initial Automotive Duty</span>
                  <span className="font-semibold text-white">4.2 Years (88,400 km)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Carbon Footprint Incurred</span>
                  <span className="font-semibold text-white">61.2 kg CO₂e / kWh</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Critical Raw Materials</span>
                  <span className="font-semibold text-white">Li: 3.8kg • Co: 0kg (LFP)</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => alert('Digital Passport JSON downloaded (Simulation).')}
                  className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Verified Schema (.json)
                </button>
                <button
                  onClick={onClose}
                  className="text-xs text-emerald-400 hover:underline"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 4. LOGIN MODAL */}
        {/* ========================================================= */}
        {activeModal === 'login' && (
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <ReLifeLogo size="sm" showText={false} />
              <div>
                <h3 className="text-xl font-bold text-white">
                  Access ReLife Intelligence
                </h3>
                <p className="text-xs text-slate-400">
                  Login for Fleet Operators, OEM Partners & BESS Integrators
                </p>
              </div>
            </div>

            {loginSuccess ? (
              <div className="p-6 text-center space-y-2 bg-emerald-950/40 border border-emerald-500/30 rounded-xl">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">Authentication Verified</h4>
                <p className="text-xs text-slate-300">
                  Session initialized in demo environment. Loading dashboard...
                </p>
              </div>
            ) : (
              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Corporate Email
                  </label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="name@company.com"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Password / SSO
                  </label>
                  <input
                    type="password"
                    required
                    defaultValue="demo12345"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="••••••••••••"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded accent-emerald-500" />
                    Remember credentials
                  </label>
                  <span className="text-emerald-400 hover:underline cursor-pointer">
                    Forgot password?
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 cursor-pointer mt-2"
                >
                  Sign In to Enterprise Workspace
                </button>

                <div className="pt-2 text-center text-[11px] text-slate-400">
                  Need a corporate account?{' '}
                  <button
                    type="button"
                    onClick={() => onOpenModal('get-started')}
                    className="text-emerald-400 font-semibold hover:underline cursor-pointer"
                  >
                    Request Pilot Access
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* 5. GET STARTED MODAL */}
        {/* ========================================================= */}
        {activeModal === 'get-started' && (
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Join ReLife AI Pilot Program
                </h3>
                <p className="text-xs text-slate-400">
                  Partner with us to assess retired packs or procure tested second-life modules
                </p>
              </div>
            </div>

            {onboardSubmitted ? (
              <div className="p-6 text-center space-y-2 bg-emerald-950/40 border border-emerald-500/30 rounded-xl">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">Pilot Application Received</h4>
                <p className="text-xs text-slate-300">
                  Our engineering team will connect with your battery technical lead within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleOnboardSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Dr. Anand Verma"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Organization
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="NextGen Energy Mobility"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Primary Interest
                  </label>
                  <select className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500">
                    <option>We have used EV batteries to assess & monetize</option>
                    <option>We want to purchase tested second-life packs for Solar BESS</option>
                    <option>We need Digital Battery Passport compliance tools</option>
                    <option>We are an authorized battery recycler / shredder</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Estimated Annual Battery Volume
                  </label>
                  <select className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500">
                    <option>Pilot stage (1 - 50 packs)</option>
                    <option>Medium scale (50 - 500 packs/year)</option>
                    <option>Industrial scale (500+ packs/year)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 cursor-pointer mt-2"
                >
                  Submit Pilot Intake
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
