import React from 'react';
import { Waves, Shield, Cpu, Database } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-ocean-500 flex items-center justify-center text-white font-bold">
            <Waves className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-white tracking-tight">OCEANSPHERE</span>
          <span className="text-slate-500">|</span>
          <span>Ocean Forecast Reliability & Decision Support System</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Database className="w-3.5 h-3.5 text-ocean-400" />
            <span>PostgreSQL (ocean_reliability_db)</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>Gradient Boosting ML (99.91% R²)</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>SIH 2026 Finals</span>
          </div>
        </div>

        <div className="text-slate-500 text-[11px]">
          &copy; {new Date().getFullYear()} OceanSphere Decision Support Team. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
