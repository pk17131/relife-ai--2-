import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Battery, 
  ArrowRight, 
  QrCode, 
  ShieldCheck, 
  CheckCircle2,
  Trash2,
  Download,
  Tag
} from 'lucide-react';
import { AssessmentRecord, AppPage } from '../types';

interface MyBatteriesViewProps {
  batteries: AssessmentRecord[];
  onNavigate: (page: AppPage) => void;
  onSelectBattery: (battery: AssessmentRecord) => void;
  onOpenPassport?: (battery: AssessmentRecord) => void;
  onListOnMarketplace?: (battery: AssessmentRecord) => void;
  onDeleteBattery?: (batteryId: string) => void;
}

export const MyBatteriesView: React.FC<MyBatteriesViewProps> = ({
  batteries,
  onNavigate,
  onSelectBattery,
  onOpenPassport,
  onListOnMarketplace,
  onDeleteBattery,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [chemistryFilter, setChemistryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = batteries.filter((b) => {
    const matchesSearch = b.batteryId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.recommendation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChem = chemistryFilter === 'ALL' || b.chemistry === chemistryFilter;
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchesSearch && matchesChem && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              My Batteries ({batteries.length})
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-semibold">
              Fleet Inventory
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Browse, manage, and monitor all batteries assessed for second-life repurposing or recycling.
          </p>
        </div>

        <button
          onClick={() => onNavigate('add-battery')}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Assess New Battery
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#0C1427] border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by ID or pathway..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Chemistry:</span>
          </div>
          <select
            value={chemistryFilter}
            onChange={(e) => setChemistryFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="ALL">All Chemistries</option>
            <option value="LFP">LFP</option>
            <option value="NMC">NMC</option>
            <option value="Lead Acid">Lead Acid</option>
          </select>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 ml-2">
            <span>Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="Assessed">Assessed</option>
            <option value="Repurposed">Repurposed</option>
            <option value="Listed">Listed</option>
            <option value="Recycling">Recycling</option>
          </select>
        </div>

      </div>

      {/* Batteries List Table */}
      <div className="bg-[#0C1427] border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase tracking-wider bg-slate-900/50">
                <th className="p-4 font-semibold">Battery ID</th>
                <th className="p-4 font-semibold">Type & Chem</th>
                <th className="p-4 font-semibold">Capacity (Curr/Orig)</th>
                <th className="p-4 font-semibold">Health (SOH)</th>
                <th className="p-4 font-semibold">ReLife Score</th>
                <th className="p-4 font-semibold">Recommended Pathway</th>
                <th className="p-4 font-semibold">Est. Value</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    No batteries match your current filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((battery) => (
                  <tr 
                    key={`${battery.id}-${battery.batteryId}`}
                    className="hover:bg-slate-900/60 transition-colors group cursor-pointer"
                    onClick={() => {
                      if (onOpenPassport) {
                        onOpenPassport(battery);
                      } else {
                        onSelectBattery(battery);
                      }
                    }}
                    title="Click to view Digital Battery Passport"
                  >
                    <td className="p-4 font-mono font-bold text-white flex items-center gap-2">
                      <Battery className="w-4 h-4 text-emerald-400" />
                      {battery.batteryId}
                    </td>
                    <td className="p-4 text-slate-300">
                      <span className="font-mono text-xs">{battery.batteryType}</span>
                      <span className="text-slate-500 ml-1">({battery.chemistry})</span>
                    </td>
                    <td className="p-4 font-mono text-slate-300">
                      {battery.currentCapacity}Ah / {battery.originalCapacity}Ah
                      <span className="text-slate-500 text-[10px] block font-sans">@ {battery.nominalVoltage}V</span>
                    </td>
                    <td className="p-4">
                      <span className={`font-mono font-bold ${
                        battery.soh >= 80 ? 'text-emerald-400' :
                        battery.soh >= 65 ? 'text-teal-400' :
                        battery.soh >= 50 ? 'text-amber-400' : 'text-red-400'
                      }`}>
                        {battery.soh}%
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold text-white">
                      <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 text-[11px]">
                        {battery.relifeScore} / 100
                      </span>
                    </td>
                    <td className="p-4 font-medium text-slate-200 max-w-xs truncate">
                      {battery.recommendation}
                    </td>
                    <td className="p-4 font-mono text-amber-300 font-semibold">
                      ₹{battery.estimatedValueInr.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                        battery.status === 'Repurposed' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : battery.status === 'Listed'
                          ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                          : battery.status === 'Recycling'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}>
                        {battery.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {battery.status === 'Listed' ? (
                          <button
                            onClick={() => onNavigate('marketplace')}
                            className="px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                            title="View in Marketplace"
                          >
                            <Tag className="w-3.5 h-3.5" />
                            <span>Listed</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              if (onListOnMarketplace) {
                                onListOnMarketplace(battery);
                              } else {
                                onNavigate('marketplace');
                              }
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                            title="List this battery on the Second-Life Marketplace"
                          >
                            <Tag className="w-3.5 h-3.5 text-teal-400" />
                            <span>List</span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (onOpenPassport) {
                              onOpenPassport(battery);
                            } else {
                              onSelectBattery(battery);
                              onNavigate('passport');
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                          title="View Digital Passport"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>Passport</span>
                        </button>
                        <button
                          onClick={() => {
                            onSelectBattery(battery);
                            onNavigate('analysis-results');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                          title="View Detailed Analysis"
                        >
                          Analysis <ArrowRight className="w-3 h-3 text-slate-400" />
                        </button>
                        {onDeleteBattery && (
                          <button
                            onClick={() => {
                              if (window.confirm(`Remove battery ${battery.batteryId} from your fleet inventory?`)) {
                                onDeleteBattery(battery.batteryId);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Delete Battery"
                            id={`delete-battery-${battery.batteryId.toLowerCase()}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
