import React from 'react';
import { createPortal } from 'react-dom';
import { X, Layers, Thermometer, Droplets, Wind, Waves, ShieldCheck, MapPin, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { LayerState } from '../../types';

interface GlobalLayersModalProps {
  isOpen: boolean;
  onClose: () => void;
  layers: LayerState;
  onToggleLayer: (key: keyof LayerState) => void;
}

export const GlobalLayersModal: React.FC<GlobalLayersModalProps> = ({
  isOpen,
  onClose,
  layers,
  onToggleLayer,
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-slate-900 dark:text-white space-y-5 relative my-auto max-h-[90vh] overflow-y-auto">

        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-ocean-500/10 text-ocean-600 dark:text-ocean-400 border border-ocean-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Scientific Globe Layers</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Toggle live oceanography layers & observation overlays</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Layers Grid List */}
        <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1 text-xs">
          
          {/* Surface */}
          <button
            onClick={() => onToggleLayer('surface')}
            className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all ${
              layers.surface
                ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-300 dark:border-sky-800 font-bold text-sky-900 dark:text-sky-100'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Waves className="w-4 h-4 text-sky-500" />
              <span>Ocean Surface Bathymetry</span>
            </div>
            {layers.surface ? <Eye className="w-4 h-4 text-sky-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
          </button>

          {/* SST Temperature */}
          <button
            onClick={() => onToggleLayer('temperature')}
            className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all ${
              layers.temperature
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 font-bold text-rose-900 dark:text-rose-100'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Thermometer className="w-4 h-4 text-rose-500" />
              <span>Sea Surface Temp (SST Heatmap)</span>
            </div>
            {layers.temperature ? <Eye className="w-4 h-4 text-rose-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Salinity */}
          <button
            onClick={() => onToggleLayer('salinity')}
            className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all ${
              layers.salinity
                ? 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-300 dark:border-cyan-800 font-bold text-cyan-900 dark:text-cyan-100'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Droplets className="w-4 h-4 text-cyan-500" />
              <span>Salinity Depth Profiles</span>
            </div>
            {layers.salinity ? <Eye className="w-4 h-4 text-cyan-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Currents */}
          <button
            onClick={() => onToggleLayer('currents')}
            className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all ${
              layers.currents
                ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800 font-bold text-indigo-900 dark:text-indigo-100'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Wind className="w-4 h-4 text-indigo-500" />
              <span>Current Vectors Streamlines</span>
            </div>
            {layers.currents ? <Eye className="w-4 h-4 text-indigo-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Forecast Reliability */}
          <button
            onClick={() => onToggleLayer('reliability')}
            className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all ${
              layers.reliability
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 font-bold text-emerald-900 dark:text-emerald-100'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>INCOIS Forecast Reliability Overlay</span>
            </div>
            {layers.reliability ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Argo Floats */}
          <button
            onClick={() => onToggleLayer('argo')}
            className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all ${
              layers.argo
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 font-bold text-amber-900 dark:text-amber-100'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-amber-500" />
              <span>Argo Float Observation Stations</span>
            </div>
            {layers.argo ? <Eye className="w-4 h-4 text-amber-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Divergence Alerts */}
          <button
            onClick={() => onToggleLayer('alerts')}
            className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all ${
              layers.alerts
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 font-bold text-rose-900 dark:text-rose-100'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span>Active Divergence Alerts</span>
            </div>
            {layers.alerts ? <Eye className="w-4 h-4 text-rose-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
          </button>

        </div>

        {/* Footer */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-ocean-600 hover:bg-ocean-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all"
          >
            Apply & Close
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
};
