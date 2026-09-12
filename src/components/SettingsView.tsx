import React, { useState } from 'react';
import { 
  Settings, 
  Building, 
  Bell, 
  ShieldCheck, 
  Download, 
  CheckCircle2, 
  Save,
  Database,
  Cpu
} from 'lucide-react';
import { AppPage } from '../types';

interface SettingsViewProps {
  onNavigate: (page: AppPage) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onNavigate }) => {
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [companyName, setCompanyName] = useState('Innovator Energy Labs');
  const [defaultCurrency, setDefaultCurrency] = useState('INR');
  const [alertThreshold, setAlertThreshold] = useState('70');
  const [emailAlerts, setEmailAlerts] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Settings & Preferences
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Configure enterprise workspace defaults, SOH alert thresholds, and export formats.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Workspace configuration saved successfully.</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="bg-[#0C1427] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        
        {/* Organization Info */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <Building className="w-4 h-4 text-emerald-400" />
            Organization Profile
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Company / Facility Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Currency Standard</label>
              <select
                value={defaultCurrency}
                onChange={(e) => setDefaultCurrency(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
              >
                <option value="INR">₹ INR (Indian Rupee)</option>
                <option value="USD">$ USD (US Dollar)</option>
                <option value="EUR">€ EUR (Euro)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Assessment & Alert Thresholds */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <Bell className="w-4 h-4 text-teal-400" />
            Diagnostic & Alert Thresholds
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Automotive Retirement SOH (%) Threshold
              </label>
              <input
                type="number"
                value={alertThreshold}
                onChange={(e) => setAlertThreshold(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                EV packs below this percentage are recommended for Second-Life BESS.
              </span>
            </div>

            <div className="flex flex-col justify-center">
              <label className="flex items-center gap-2 text-slate-300 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-emerald-500"
                />
                Send automated email alerts on battery degradation
              </label>
              <span className="text-[11px] text-slate-500 mt-1 block ml-6">
                Receive notifications when test batches finish grading.
              </span>
            </div>
          </div>
        </div>

        {/* Data Persistence Info */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <Database className="w-4 h-4 text-amber-400" />
            Data Storage & Environment
          </h2>
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
            <span className="text-slate-200 font-semibold block mb-1">Stage 2 Mode:</span>
            Using high-performance local deterministic memory with real-time SOH calculations. Enterprise sync and backend persistence are ready for future cloud connector activations.
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save Settings
          </button>
        </div>

      </form>

    </div>
  );
};
