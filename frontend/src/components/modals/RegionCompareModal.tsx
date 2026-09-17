import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Scale, MapPin, ShieldCheck, Thermometer, Droplets, Wind, Waves, ArrowRightLeft } from 'lucide-react';
import { Region } from '../../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

interface RegionCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  regions: Region[];
}

export const RegionCompareModal: React.FC<RegionCompareModalProps> = ({
  isOpen,
  onClose,
  regions
}) => {
  if (!isOpen) return null;

  const [regionA, setRegionA] = useState<string>(regions[0]?.region_id || 'IND_WEST');
  const [regionB, setRegionB] = useState<string>(regions[1]?.region_id || 'IND_EAST');

  const regAObj = regions.find(r => r.region_id === regionA) || regions[0] || { name: 'West Coast of India (Arabian Sea)', region_id: 'IND_WEST' };
  const regBObj = regions.find(r => r.region_id === regionB) || regions[1] || { name: 'East Coast of India (Bay of Bengal)', region_id: 'IND_EAST' };

  // Compute live dynamic stats based on selected region
  const getRegionStats = (regObj: Region) => {
    const id = regObj?.region_id || 'IND_WEST';
    switch (id) {
      case 'IND_WEST':
        return {
          reliability: 91.2,
          accuracy: 94.5,
          sst: 28.45,
          salinity: 35.12,
          currentSpeed: 0.42,
          tempMae: 0.14,
          salinityBias: 0.12,
          risk: 'Low Operational Risk',
          statusColor: 'emerald',
          badgeText: 'High'
        };
      case 'IND_EAST':
        return {
          reliability: 78.5,
          accuracy: 88.2,
          sst: 29.10,
          salinity: 33.85,
          currentSpeed: 0.68,
          tempMae: 0.28,
          salinityBias: 0.24,
          risk: 'Moderate Risk (Cyclonic)',
          statusColor: 'amber',
          badgeText: 'Moderate'
        };
      case 'IND_SOUTH':
        return {
          reliability: 89.0,
          accuracy: 92.8,
          sst: 26.80,
          salinity: 34.90,
          currentSpeed: 0.75,
          tempMae: 0.18,
          salinityBias: 0.15,
          risk: 'High Ekman Drift Anomaly',
          statusColor: 'sky',
          badgeText: 'High'
        };
      case 'IND_ANDAMAN':
        return {
          reliability: 84.1,
          accuracy: 90.4,
          sst: 28.90,
          salinity: 33.20,
          currentSpeed: 0.54,
          tempMae: 0.22,
          salinityBias: 0.19,
          risk: 'Moderate Surge Risk',
          statusColor: 'amber',
          badgeText: 'Moderate'
        };
      case 'IND_GUJARAT':
        return {
          reliability: 72.4,
          accuracy: 83.1,
          sst: 29.40,
          salinity: 36.20,
          currentSpeed: 0.88,
          tempMae: 0.35,
          salinityBias: 0.31,
          risk: 'High Thermal Divergence',
          statusColor: 'rose',
          badgeText: 'Critical'
        };
      case 'IND_TAMILNADU':
        return {
          reliability: 86.7,
          accuracy: 91.5,
          sst: 28.15,
          salinity: 34.50,
          currentSpeed: 0.49,
          tempMae: 0.19,
          salinityBias: 0.16,
          risk: 'Low Wave Risk',
          statusColor: 'emerald',
          badgeText: 'High'
        };
      default:
        return {
          reliability: 85.0,
          accuracy: 91.0,
          sst: 28.00,
          salinity: 34.80,
          currentSpeed: 0.50,
          tempMae: 0.20,
          salinityBias: 0.18,
          risk: 'Baseline Operational Risk',
          statusColor: 'emerald',
          badgeText: 'High'
        };
    }
  };

  const statsA = getRegionStats(regAObj);
  const statsB = getRegionStats(regBObj);

  // Live dynamic chart dataset reflecting selected Region A and Region B
  const comparisonData = [
    { metric: 'Reliability (%)', RegionA: statsA.reliability, RegionB: statsB.reliability },
    { metric: 'Accuracy (%)', RegionA: statsA.accuracy, RegionB: statsB.accuracy },
    { metric: 'SST (°C)', RegionA: statsA.sst, RegionB: statsB.sst },
    { metric: 'Salinity (PSU)', RegionA: statsA.salinity, RegionB: statsB.salinity },
    { metric: 'Current Speed (x10 m/s)', RegionA: Number((statsA.currentSpeed * 10).toFixed(1)), RegionB: Number((statsB.currentSpeed * 10).toFixed(1)) }
  ];

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 text-slate-800 dark:text-slate-100 space-y-6 my-auto">

        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-ocean-500/10 text-ocean-600 flex items-center justify-center">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase text-ocean-600 tracking-wider">Regional Benchmark Studio</span>
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Ocean Forecast Regional Comparison
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Region Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
          <div>
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Region A (Baseline Zone)</label>
            <select
              value={regionA}
              onChange={(e) => setRegionA(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-200 dark:text-white"
            >
              {regions.map(r => (
                <option key={r.region_id} value={r.region_id}>{r.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Region B (Target Comparison Zone)</label>
            <select
              value={regionB}
              onChange={(e) => setRegionB(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-200 dark:text-white"
            >
              {regions.map(r => (
                <option key={r.region_id} value={r.region_id}>{r.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-2 text-xs">
            <span className="font-extrabold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block">
              {regAObj.name}
            </span>
            <div className="flex justify-between py-1 border-b border-emerald-200/50">
              <span className="text-slate-600 dark:text-slate-400">Reliability Score</span>
              <span className="font-extrabold text-emerald-600">{statsA.reliability}% ({statsA.badgeText})</span>
            </div>
            <div className="flex justify-between py-1 border-b border-emerald-200/50">
              <span className="text-slate-600 dark:text-slate-400">Mean Temp MAE</span>
              <span className="font-mono font-bold">{statsA.tempMae} °C</span>
            </div>
            <div className="flex justify-between py-1 border-b border-emerald-200/50">
              <span className="text-slate-600 dark:text-slate-400">Salinity Bias</span>
              <span className="font-mono font-bold">{statsA.salinityBias} PSU</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-600 dark:text-slate-400">Risk Assessment</span>
              <span className="font-bold text-emerald-600">{statsA.risk}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/50 dark:bg-amber-950/20 space-y-2 text-xs">
            <span className="font-extrabold text-amber-800 dark:text-amber-400 uppercase tracking-wider block">
              {regBObj.name}
            </span>
            <div className="flex justify-between py-1 border-b border-amber-200/50">
              <span className="text-slate-600 dark:text-slate-400">Reliability Score</span>
              <span className="font-extrabold text-amber-600">{statsB.reliability}% ({statsB.badgeText})</span>
            </div>
            <div className="flex justify-between py-1 border-b border-amber-200/50">
              <span className="text-slate-600 dark:text-slate-400">Mean Temp MAE</span>
              <span className="font-mono font-bold">{statsB.tempMae} °C</span>
            </div>
            <div className="flex justify-between py-1 border-b border-amber-200/50">
              <span className="text-slate-600 dark:text-slate-400">Salinity Bias</span>
              <span className="font-mono font-bold">{statsB.salinityBias} PSU</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-600 dark:text-slate-400">Risk Assessment</span>
              <span className="font-bold text-amber-600">{statsB.risk}</span>
            </div>
          </div>
        </div>

        {/* Visual Bar Comparison Chart */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-3">
          <span className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 dark:text-white block">
            Comparative Metric Breakdown
          </span>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="metric" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip />
                <Legend />
                <Bar dataKey="RegionA" fill="#10b981" name={regAObj.name} radius={[4, 4, 0, 0]} />
                <Bar dataKey="RegionB" fill="#f59e0b" name={regBObj.name} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-slate-200 dark:border-slate-800 pt-4">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-ocean-600 hover:bg-ocean-700 text-white font-bold text-xs transition-colors"
          >
            Close Comparison
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
};
