import React, { useState } from 'react';
import {
  MapPin,
  Copy,
  Check,
  Thermometer,
  Droplets,
  Wind,
  Waves,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  Activity,
  Layers,
  ChevronDown,
  ChevronUp,
  Sliders,
  ExternalLink,
  Scale
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';
import { SelectedLocationData, AlertItem } from '../../types';

interface RightIntelligencePanelProps {
  selectedLocation: SelectedLocationData;
  alerts?: AlertItem[];
  onOpenProfile?: () => void;
  onOpenCompare?: () => void;
  onSelectAlert?: (alert: AlertItem) => void;
}

export const RightIntelligencePanel: React.FC<RightIntelligencePanelProps> = ({
  selectedLocation,
  alerts = [],
  onOpenProfile,
  onOpenCompare,
  onSelectAlert,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeInsightTab, setActiveInsightTab] = useState<'temp' | 'current' | 'reliability'>('temp');

  const handleCopyCoords = () => {
    const coordStr = `${selectedLocation.latitude.toFixed(4)}° N, ${selectedLocation.longitude.toFixed(4)}° E`;
    navigator.clipboard.writeText(coordStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Mock Trend Chart Data based on selected depth / location
  const depthTrendData = [
    { depth: 0, temp: selectedLocation.temperature, velocity: selectedLocation.currentSpeed, reliability: selectedLocation.reliabilityScore },
    { depth: 50, temp: selectedLocation.temperature - 1.2, velocity: selectedLocation.currentSpeed * 0.85, reliability: selectedLocation.reliabilityScore - 1 },
    { depth: 100, temp: selectedLocation.temperature - 3.4, velocity: selectedLocation.currentSpeed * 0.65, reliability: selectedLocation.reliabilityScore - 2 },
    { depth: 500, temp: selectedLocation.temperature - 12.1, velocity: selectedLocation.currentSpeed * 0.3, reliability: selectedLocation.reliabilityScore - 3 },
    { depth: 1000, temp: 8.4, velocity: 0.12, reliability: selectedLocation.reliabilityScore - 1 },
    { depth: 2000, temp: 4.1, velocity: 0.05, reliability: selectedLocation.reliabilityScore },
    { depth: 3000, temp: 2.3, velocity: 0.02, reliability: selectedLocation.reliabilityScore + 1 }
  ];

  // Reliability Badge Color Logic
  const getReliabilityStyle = (score: number) => {
    if (score >= 80) {
      return {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        text: 'text-emerald-700',
        badgeBg: 'bg-emerald-500',
        label: 'High Reliability'
      };
    } else if (score >= 60) {
      return {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        text: 'text-amber-700',
        badgeBg: 'bg-amber-500',
        label: 'Moderate Reliability'
      };
    } else {
      return {
        bg: 'bg-rose-50',
        border: 'border-rose-200',
        text: 'text-rose-700',
        badgeBg: 'bg-rose-500',
        label: 'Low Reliability'
      };
    }
  };

  const relStyle = getReliabilityStyle(selectedLocation.reliabilityScore);

  return (
    <aside className="w-[350px] shrink-0 h-[calc(100vh-70px-44px)] overflow-y-auto pl-1 space-y-3.5 scrollbar-thin select-none">
      
      {/* 1. SELECTED LOCATION HEADER CARD */}
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200/90 shadow-sm p-4 text-slate-800">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-slate-900">
            <MapPin className="w-4 h-4 text-ocean-600" />
            <span>Selected Location</span>
          </div>
          <button
            onClick={handleCopyCoords}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-600 transition-colors flex items-center gap-1 text-[11px]"
            title="Copy Coordinates"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-base font-extrabold text-slate-900 font-mono tracking-tight">
              {selectedLocation.latitude.toFixed(4)}° N, {selectedLocation.longitude.toFixed(4)}° E
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
            <Waves className="w-3.5 h-3.5 text-ocean-500" />
            <span>{selectedLocation.oceanName}</span>
            {selectedLocation.regionId && (
              <span className="px-2 py-0.5 rounded bg-ocean-50 text-ocean-700 border border-ocean-200 text-[10px] font-bold">
                {selectedLocation.regionId}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons: View Profile & Compare */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
          <button
            onClick={onOpenProfile}
            className="py-2 px-3 rounded-xl bg-ocean-600 hover:bg-ocean-700 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all hover:scale-102"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>View Profile</span>
          </button>
          <button
            onClick={onOpenCompare}
            className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 flex items-center justify-center gap-1.5 transition-all"
          >
            <Scale className="w-3.5 h-3.5 text-slate-500" />
            <span>Compare</span>
          </button>
        </div>
      </div>

      {/* 2. OCEAN PARAMETERS CARD */}
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200/90 shadow-sm p-4 text-slate-800">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
            Ocean Parameters
          </h3>
          <span className="text-[10px] font-semibold text-slate-400">HYCOM + ARGO</span>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
            <span className="flex items-center gap-2 text-slate-600 font-medium">
              <Thermometer className="w-4 h-4 text-rose-500" />
              Temperature
            </span>
            <span className="font-bold font-mono text-slate-900 text-sm">
              {selectedLocation.temperature.toFixed(1)} °C
            </span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
            <span className="flex items-center gap-2 text-slate-600 font-medium">
              <Droplets className="w-4 h-4 text-cyan-500" />
              Salinity
            </span>
            <span className="font-bold font-mono text-slate-900 text-sm">
              {selectedLocation.salinity.toFixed(1)} PSU
            </span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
            <span className="flex items-center gap-2 text-slate-600 font-medium">
              <Waves className="w-4 h-4 text-sky-500" />
              Wave Height
            </span>
            <span className="font-bold font-mono text-slate-900 text-sm">
              {selectedLocation.waveHeight.toFixed(1)} m
            </span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
            <span className="flex items-center gap-2 text-slate-600 font-medium">
              <Wind className="w-4 h-4 text-indigo-500" />
              Current Speed
            </span>
            <span className="font-bold font-mono text-slate-900 text-sm">
              {selectedLocation.currentSpeed.toFixed(2)} m/s ({selectedLocation.currentDirection}°)
            </span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
            <span className="flex items-center gap-2 text-slate-600 font-medium">
              <Activity className="w-4 h-4 text-teal-500" />
              Ocean Depth
            </span>
            <span className="font-bold font-mono text-slate-900 text-sm">
              {selectedLocation.depth} m
            </span>
          </div>
        </div>
      </div>

      {/* 3. RELIABILITY & RISK ASSESSMENT CARD (Core Innovation) */}
      <div className={`rounded-2xl border ${relStyle.border} ${relStyle.bg} p-4 shadow-sm text-slate-800 space-y-3`}>
        <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-slate-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Forecast Reliability</span>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold text-white ${relStyle.badgeBg}`}>
            {relStyle.label}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-500 uppercase font-semibold block">Reliability Score</span>
            <span className={`text-3xl font-extrabold tracking-tight ${relStyle.text}`}>
              {selectedLocation.reliabilityScore.toFixed(1)}%
            </span>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-slate-500 uppercase font-semibold block">Forecast Accuracy</span>
            <span className="text-base font-bold text-slate-800 font-mono">
              {selectedLocation.forecastAccuracy.toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="space-y-1.5 text-xs border-t border-slate-200/60 pt-2.5">
          <div className="flex justify-between">
            <span className="text-slate-600">Confidence Level:</span>
            <span className="font-bold text-slate-900">{selectedLocation.confidenceLevel}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Risk Assessment:</span>
            <span className="font-bold text-slate-900">{selectedLocation.riskLevel}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Model Divergence:</span>
            <span className="font-mono text-slate-700">MAE 0.14 °C (Low)</span>
          </div>
        </div>
      </div>

      {/* 4. LIVE ALERTS & ANOMALIES CARD */}
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200/90 shadow-sm p-4 text-slate-800 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-slate-900">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <span>Live Alerts Feed</span>
          </div>
          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
            {alerts.length} Active
          </span>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-xs">
          {alerts.length > 0 ? (
            alerts.slice(0, 5).map((item, idx) => (
              <div
                key={idx}
                onClick={() => onSelectAlert && onSelectAlert(item)}
                className={`p-2.5 rounded-xl border flex items-start gap-2.5 cursor-pointer hover:scale-102 transition-all shadow-xs ${
                  item.severity === 'CRITICAL'
                    ? 'bg-rose-50/90 hover:bg-rose-100/90 border-rose-200 text-rose-900'
                    : 'bg-amber-50/90 hover:bg-amber-100/90 border-amber-200 text-amber-900'
                }`}
              >
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between font-bold text-[11px]">
                    <span>{item.alert_type}</span>
                    <span className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-white/70">{item.severity}</span>
                  </div>
                  <p className="text-[10px] text-slate-600 mt-0.5 line-clamp-2">{item.description}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-center text-[11px]">
              No active divergence alerts in selected region.
            </div>
          )}
        </div>
      </div>

      {/* 5. QUICK INSIGHTS TREND CHARTS */}
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200/90 shadow-sm p-4 text-slate-800 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
            Quick Insights
          </h3>
          
          <div className="flex items-center gap-1 text-[10px] font-semibold">
            <button
              onClick={() => setActiveInsightTab('temp')}
              className={`px-2 py-0.5 rounded-md transition-colors ${
                activeInsightTab === 'temp' ? 'bg-ocean-600 text-white font-bold' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              Temp
            </button>
            <button
              onClick={() => setActiveInsightTab('current')}
              className={`px-2 py-0.5 rounded-md transition-colors ${
                activeInsightTab === 'current' ? 'bg-ocean-600 text-white font-bold' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              Currents
            </button>
            <button
              onClick={() => setActiveInsightTab('reliability')}
              className={`px-2 py-0.5 rounded-md transition-colors ${
                activeInsightTab === 'reliability' ? 'bg-ocean-600 text-white font-bold' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              Reliability
            </button>
          </div>
        </div>

        {/* Chart View */}
        <div className="h-32 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            {activeInsightTab === 'temp' ? (
              <AreaChart data={depthTrendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="depth" stroke="#94a3b8" fontSize={9} tickFormatter={(val) => `${val}m`} />
                <YAxis stroke="#94a3b8" fontSize={9} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                  formatter={(val: any) => [`${Number(val).toFixed(1)} °C`, 'Temperature']}
                />
                <Area type="monotone" dataKey="temp" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#tempGrad)" />
              </AreaChart>
            ) : activeInsightTab === 'current' ? (
              <AreaChart data={depthTrendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="currGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="depth" stroke="#94a3b8" fontSize={9} tickFormatter={(val) => `${val}m`} />
                <YAxis stroke="#94a3b8" fontSize={9} domain={[0, 'auto']} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                  formatter={(val: any) => [`${Number(val).toFixed(2)} m/s`, 'Speed']}
                />
                <Area type="monotone" dataKey="velocity" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#currGrad)" />
              </AreaChart>
            ) : (
              <LineChart data={depthTrendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <XAxis dataKey="depth" stroke="#94a3b8" fontSize={9} tickFormatter={(val) => `${val}m`} />
                <YAxis stroke="#94a3b8" fontSize={9} domain={[50, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                  formatter={(val: any) => [`${Number(val).toFixed(1)}%`, 'Reliability']}
                />
                <Line type="monotone" dataKey="reliability" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

    </aside>
  );
};
