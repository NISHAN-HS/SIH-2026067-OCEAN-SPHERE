import React, { useState } from 'react';
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

  const regAObj = regions.find(r => r.region_id === regionA) || regions[0] || { name: 'West Coast of India', region_id: 'IND_WEST' };
  const regBObj = regions.find(r => r.region_id === regionB) || regions[1] || { name: 'East Coast of India', region_id: 'IND_EAST' };

  // Comparison mock dataset for visual comparative bar charts
  const comparisonData = [
    { metric: 'Reliability (%)', RegionA: 91.2, RegionB: 78.5 },
    { metric: 'Accuracy (%)', RegionA: 94.5, RegionB: 88.2 },
    { metric: 'SST (°C)', RegionA: 28.4, RegionB: 29.1 },
    { metric: 'Salinity (PSU)', RegionA: 35.2, RegionB: 33.8 },
    { metric: 'Current Speed (x10 m/s)', RegionA: 2.4, RegionB: 3.8 }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 text-slate-800 dark:text-slate-100 space-y-6">
        
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
              <span className="font-extrabold text-emerald-600">91.2% (High)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-emerald-200/50">
              <span className="text-slate-600 dark:text-slate-400">Mean Temp MAE</span>
              <span className="font-mono font-bold">0.14 °C</span>
            </div>
            <div className="flex justify-between py-1 border-b border-emerald-200/50">
              <span className="text-slate-600 dark:text-slate-400">Salinity Bias</span>
              <span className="font-mono font-bold">0.12 PSU</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-600 dark:text-slate-400">Risk Assessment</span>
              <span className="font-bold text-emerald-600">Low Operational Risk</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/50 dark:bg-amber-950/20 space-y-2 text-xs">
            <span className="font-extrabold text-amber-800 dark:text-amber-400 uppercase tracking-wider block">
              {regBObj.name}
            </span>
            <div className="flex justify-between py-1 border-b border-amber-200/50">
              <span className="text-slate-600 dark:text-slate-400">Reliability Score</span>
              <span className="font-extrabold text-amber-600">78.5% (Moderate)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-amber-200/50">
              <span className="text-slate-600 dark:text-slate-400">Mean Temp MAE</span>
              <span className="font-mono font-bold">0.28 °C</span>
            </div>
            <div className="flex justify-between py-1 border-b border-amber-200/50">
              <span className="text-slate-600 dark:text-slate-400">Salinity Bias</span>
              <span className="font-mono font-bold">0.24 PSU</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-600 dark:text-slate-400">Risk Assessment</span>
              <span className="font-bold text-amber-600">Moderate Risk</span>
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
    </div>
  );
};
