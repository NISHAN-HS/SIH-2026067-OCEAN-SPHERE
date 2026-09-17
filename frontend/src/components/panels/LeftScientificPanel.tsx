import React, { useState } from 'react';
import {
  Layers,
  ChevronDown,
  ChevronUp,
  Thermometer,
  Droplets,
  Wind,
  Waves,
  ShieldCheck,
  MapPin,
  AlertTriangle,
  Eye,
  EyeOff,
  Sliders,
  Calendar,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Info,
  Compass
} from 'lucide-react';
import { LayerState, DepthControl, TimeControlState } from '../../types';

interface LeftScientificPanelProps {
  layers: LayerState;
  onToggleLayer: (key: keyof LayerState) => void;
  depth: DepthControl;
  onChangeDepth: (depthMeters: number, preset: DepthControl['preset']) => void;
  timeState: TimeControlState;
  onTogglePlayback: () => void;
  onChangeDate: (date: string) => void;
}

export const LeftScientificPanel: React.FC<LeftScientificPanelProps> = ({
  layers,
  onToggleLayer,
  depth,
  onChangeDepth,
  timeState,
  onTogglePlayback,
  onChangeDate,
}) => {
  const [layersOpen, setLayersOpen] = useState(true);
  const [depthOpen, setDepthOpen] = useState(true);
  const [timeOpen, setTimeOpen] = useState(true);

  const depthPresets: Array<{ label: DepthControl['preset']; value: number }> = [
    { label: 'Surface', value: 0 },
    { label: '50m', value: 50 },
    { label: '100m', value: 100 },
    { label: '500m', value: 500 },
    { label: '1000m', value: 1000 },
    { label: '2000m', value: 2000 },
    { label: '5000m', value: 5000 },
  ];

  return (
    <aside className="w-[320px] shrink-0 h-[calc(100vh-70px-44px)] overflow-y-auto pr-1 space-y-3.5 scrollbar-thin select-none">
      
      {/* 1. SCIENTIFIC LAYER CONTROL CARD */}
      <div id="layers-section" className="bg-white dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-700/90 shadow-sm p-4 text-slate-800 dark:text-slate-200 transition-all">
        <div
          onClick={() => setLayersOpen(!layersOpen)}
          className="flex items-center justify-between cursor-pointer border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-3"
        >
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100">
            <Layers className="w-4 h-4 text-ocean-600" />
            <span>Layers</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-ocean-600 bg-ocean-50 border border-ocean-200 px-2 py-0.5 rounded-full">
              {Object.values(layers).filter(Boolean).length} Active
            </span>
            {layersOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>
        </div>

        {layersOpen && (
          <div className="space-y-2 text-xs">
            
            {/* Ocean Surface Layer */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 hover:bg-slate-100/80 transition-colors">
              <label className="flex items-center gap-2.5 cursor-pointer font-semibold text-slate-800 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={layers.surface}
                  onChange={() => onToggleLayer('surface')}
                  className="w-3.5 h-3.5 rounded text-ocean-600 focus:ring-ocean-500 cursor-pointer"
                />
                <span className="flex items-center gap-1.5">
                  <Waves className="w-3.5 h-3.5 text-sky-500" />
                  Ocean Surface
                </span>
              </label>
              {layers.surface ? <Eye className="w-3.5 h-3.5 text-ocean-600" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
            </div>

            {/* Temperature Layer with Gradient Indicator */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 space-y-1.5 hover:bg-slate-100/80 transition-colors">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2.5 cursor-pointer font-semibold text-slate-800 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={layers.temperature}
                    onChange={() => onToggleLayer('temperature')}
                    className="w-3.5 h-3.5 rounded text-ocean-600 focus:ring-ocean-500 cursor-pointer"
                  />
                  <span className="flex items-center gap-1.5">
                    <Thermometer className="w-3.5 h-3.5 text-rose-500" />
                    Temperature (SST)
                  </span>
                </label>
                {layers.temperature ? <Eye className="w-3.5 h-3.5 text-ocean-600" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
              </div>
              <div className="flex items-center gap-2 pt-0.5 pl-6">
                <span className="text-[10px] text-slate-400 font-mono">10°C</span>
                <div className="flex-1 h-2 rounded-full bg-gradient-to-r from-blue-600 via-teal-400 via-yellow-400 to-rose-600 shadow-inner"></div>
                <span className="text-[10px] text-slate-400 font-mono">34°C</span>
              </div>
            </div>

            {/* Salinity Layer with Gradient Indicator */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 space-y-1.5 hover:bg-slate-100/80 transition-colors">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2.5 cursor-pointer font-semibold text-slate-800 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={layers.salinity}
                    onChange={() => onToggleLayer('salinity')}
                    className="w-3.5 h-3.5 rounded text-ocean-600 focus:ring-ocean-500 cursor-pointer"
                  />
                  <span className="flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-cyan-500" />
                    Salinity Profiles
                  </span>
                </label>
                {layers.salinity ? <Eye className="w-3.5 h-3.5 text-ocean-600" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
              </div>
              <div className="flex items-center gap-2 pt-0.5 pl-6">
                <span className="text-[10px] text-slate-400 font-mono">32 PSU</span>
                <div className="flex-1 h-2 rounded-full bg-gradient-to-r from-cyan-400 via-teal-300 via-emerald-400 to-yellow-300 shadow-inner"></div>
                <span className="text-[10px] text-slate-400 font-mono">37 PSU</span>
              </div>
            </div>

            {/* Currents Vector Flow Layer */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 space-y-1.5 hover:bg-slate-100/80 transition-colors">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2.5 cursor-pointer font-semibold text-slate-800 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={layers.currents}
                    onChange={() => onToggleLayer('currents')}
                    className="w-3.5 h-3.5 rounded text-ocean-600 focus:ring-ocean-500 cursor-pointer"
                  />
                  <span className="flex items-center gap-1.5">
                    <Wind className="w-3.5 h-3.5 text-indigo-500" />
                    Current Vectors (U/V)
                  </span>
                </label>
                {layers.currents ? <Eye className="w-3.5 h-3.5 text-ocean-600" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
              </div>
              <div className="flex items-center gap-2 pt-0.5 pl-6">
                <span className="text-[10px] text-slate-400 font-mono">0.0 m/s</span>
                <div className="flex-1 h-2 rounded-full bg-gradient-to-r from-indigo-300 via-sky-400 to-blue-600 shadow-inner"></div>
                <span className="text-[10px] text-slate-400 font-mono">2.5 m/s</span>
              </div>
            </div>

            {/* Sea Surface Height */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 hover:bg-slate-100/80 transition-colors">
              <label className="flex items-center gap-2.5 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={layers.ssh}
                  onChange={() => onToggleLayer('ssh')}
                  className="w-3.5 h-3.5 rounded text-ocean-600 focus:ring-ocean-500 cursor-pointer"
                />
                <span className="flex items-center gap-1.5">
                  <Waves className="w-3.5 h-3.5 text-teal-500" />
                  Sea Surface Height (SSH)
                </span>
              </label>
              {layers.ssh ? <Eye className="w-3.5 h-3.5 text-ocean-600" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
            </div>

            {/* Forecast Reliability Layer (Core Innovation) */}
            <div className={`p-2.5 rounded-xl space-y-2 transition-colors ${layers.reliability ? 'bg-emerald-50/70 border border-emerald-200/90 dark:bg-emerald-900/30 dark:border-emerald-700/50' : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 hover:bg-slate-100/80'}`}>
              <div className="flex items-center justify-between">
                <label className={`flex items-center gap-2.5 cursor-pointer font-bold ${layers.reliability ? 'text-emerald-900 dark:text-emerald-100' : 'text-slate-800 dark:text-slate-200'}`}>
                  <input
                    type="checkbox"
                    checked={layers.reliability}
                    onChange={() => onToggleLayer('reliability')}
                    className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className={`w-3.5 h-3.5 ${layers.reliability ? 'text-emerald-600' : 'text-emerald-500 dark:text-emerald-400'}`} />
                    Forecast Reliability Overlay
                  </span>
                </label>
                {layers.reliability ? <Eye className="w-3.5 h-3.5 text-emerald-600" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
              </div>
              <div className="grid grid-cols-3 gap-1 text-[10px] font-bold text-center">
                <div className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Green: 80-100
                </div>
                <div className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                  Yellow: 60-80
                </div>
                <div className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300">
                  Red: 0-60
                </div>
              </div>
            </div>

            {/* Observation Stations & Alerts Toggles */}
            <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
              <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:bg-slate-800 cursor-pointer text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={layers.argo}
                    onChange={() => onToggleLayer('argo')}
                    className="w-3.5 h-3.5 rounded text-ocean-600"
                  />
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  Argo Float Stations
                </span>
                <span className="text-[10px] font-mono text-slate-400">1,240 live</span>
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:bg-slate-800 cursor-pointer text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={layers.buoys}
                    onChange={() => onToggleLayer('buoys')}
                    className="w-3.5 h-3.5 rounded text-ocean-600"
                  />
                  <MapPin className="w-3.5 h-3.5 text-blue-500" />
                  Moored Buoy Stations
                </span>
                <span className="text-[10px] font-mono text-slate-400">184 live</span>
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:bg-slate-800 cursor-pointer text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={layers.alerts}
                    onChange={() => onToggleLayer('alerts')}
                    className="w-3.5 h-3.5 rounded text-rose-600"
                  />
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                  Divergence Alerts
                </span>
                <span className="text-[10px] font-mono text-rose-600 font-bold">12 Active</span>
              </label>
            </div>

          </div>
        )}
      </div>

      {/* 2. DEPTH CONTROL CARD */}
      <div className="bg-white dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-700/90 shadow-sm p-4 text-slate-800 dark:text-slate-200">
        <div
          onClick={() => setDepthOpen(!depthOpen)}
          className="flex items-center justify-between cursor-pointer border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-3"
        >
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100">
            <Sliders className="w-4 h-4 text-ocean-600" />
            <span>Depth</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-ocean-700 bg-ocean-50 border border-ocean-200 px-2 py-0.5 rounded-lg">
              {depth.preset === 'Surface' ? 'Surface (0m)' : `${depth.currentDepth} m`}
            </span>
            {depthOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>
        </div>

        {depthOpen && (
          <div className="space-y-3 text-xs">
            {/* Range Slider */}
            <div>
              <div className="flex justify-between text-[11px] font-medium text-slate-500 mb-1">
                <span>Surface</span>
                <span className="font-bold text-ocean-600">{depth.currentDepth} m</span>
                <span>5000 m</span>
              </div>
              <input
                type="range"
                min="0"
                max="5000"
                step="50"
                value={depth.currentDepth}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  const matchedPreset = depthPresets.reduce((prev, curr) =>
                    Math.abs(curr.value - val) < Math.abs(prev.value - val) ? curr : prev
                  );
                  onChangeDepth(val, matchedPreset.label);
                }}
                className="w-full accent-ocean-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>

            {/* Depth Presets Quick Pills */}
            <div className="flex flex-wrap gap-1.5">
              {depthPresets.map((dp) => (
                <button
                  key={dp.label}
                  onClick={() => onChangeDepth(dp.value, dp.label)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    depth.preset === dp.label
                      ? 'bg-ocean-600 text-white shadow-xs scale-105'
                      : 'bg-slate-100 text-slate-600 dark:text-slate-400 hover:bg-slate-200/80 hover:text-slate-900'
                  }`}
                >
                  {dp.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. TIME CONTROL CARD */}
      <div className="bg-white dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-700/90 shadow-sm p-4 text-slate-800 dark:text-slate-200">
        <div
          onClick={() => setTimeOpen(!timeOpen)}
          className="flex items-center justify-between cursor-pointer border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-3"
        >
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100">
            <Calendar className="w-4 h-4 text-ocean-600" />
            <span>Time</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
              {timeState.selectedDate}
            </span>
            {timeOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>
        </div>

        {timeOpen && (
          <div className="space-y-3 text-xs">
            {/* Timeline Slider */}
            <div>
              <div className="flex justify-between text-[10px] font-medium text-slate-400 mb-1">
                <span>01 Jan 2026</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">12:00 UTC</span>
                <span>31 Dec 2026</span>
              </div>
              <input
                type="range"
                min="1"
                max="365"
                defaultValue="259"
                className="w-full accent-ocean-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={onTogglePlayback}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ocean-600 hover:bg-ocean-700 text-white font-bold text-xs shadow-xs transition-all"
              >
                {timeState.isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{timeState.isPlaying ? 'Pause' : 'Play Timeline'}</span>
              </button>

              <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                <span>Mode:</span>
                <span className="px-1.5 py-0.5 rounded bg-ocean-100 text-ocean-800 font-bold">
                  {timeState.isForecast ? 'Forecast' : 'Historical'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. EXPLORE THE OCEAN MINI CARD */}
      <div className="rounded-2xl bg-gradient-to-br from-ocean-900 to-slate-900 p-4 text-white shadow-md border border-slate-800">
        <div className="flex items-center gap-2 text-ocean-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Info className="w-4 h-4" />
          <span>Explore the Ocean</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Visualize, analyze and understand the world's oceans with real-time satellite, ARGO, and HYCOM historical model forecasts.
        </p>
      </div>

    </aside>
  );
};
