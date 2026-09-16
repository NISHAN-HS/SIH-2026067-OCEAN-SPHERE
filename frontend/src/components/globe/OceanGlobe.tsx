import React, { useState, useRef, useEffect } from 'react';
import { Layers, Compass, ZoomIn, ZoomOut, RotateCcw, AlertTriangle, Eye, EyeOff, ShieldCheck, Thermometer, Droplets, Wind, Waves, MapPin, X } from 'lucide-react';
import { Region, ReliabilityScore } from '../../types';
import { getReliabilityBadge } from '../../utils/helpers';

interface OceanGlobeProps {
  regions: Region[];
  reliabilityScores?: ReliabilityScore[];
  onSelectRegion?: (region: Region) => void;
  fullScreen?: boolean;
}

export const OceanGlobe: React.FC<OceanGlobeProps> = ({
  regions,
  reliabilityScores = [],
  onSelectRegion,
  fullScreen = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rotation, setRotation] = useState({ x: 15, y: 70 });
  const [zoom, setZoom] = useState(1);
  const [isRotating, setIsRotating] = useState(true);
  const [mouseCoords, setMouseCoords] = useState({ lat: '15.50° N', lon: '72.50° E' });
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

  // Layer Visibility State
  const [layers, setLayers] = useState({
    temperature: true,
    salinity: true,
    currents: true,
    ssh: false,
    reliability: false,
    argo: true,
    buoys: true,
    alerts: true,
    boundaries: true
  });

  const toggleLayer = (key: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Canvas 3D Sphere Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let angle = rotation.y;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = (Math.min(width, height) / 2.3) * zoom;

      // 1. Atmosphere Glow
      const atmosGradient = ctx.createRadialGradient(centerX, centerY, radius * 0.9, centerX, centerY, radius * 1.15);
      atmosGradient.addColorStop(0, 'rgba(14, 165, 233, 0.4)');
      atmosGradient.addColorStop(0.7, 'rgba(14, 165, 233, 0.1)');
      atmosGradient.addColorStop(1, 'rgba(14, 165, 233, 0)');
      ctx.fillStyle = atmosGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.15, 0, Math.PI * 2);
      ctx.fill();

      // 2. Base Ocean Globe (Rich Gradient Blue)
      const globeGrad = ctx.createRadialGradient(
        centerX - radius * 0.3,
        centerY - radius * 0.3,
        radius * 0.1,
        centerX,
        centerY,
        radius
      );
      globeGrad.addColorStop(0, '#38BDF8');
      globeGrad.addColorStop(0.4, '#0EA5E9');
      globeGrad.addColorStop(0.8, '#0284C7');
      globeGrad.addColorStop(1, '#0369A1');

      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = globeGrad;
      ctx.shadowColor = 'rgba(14, 165, 233, 0.5)';
      ctx.shadowBlur = 25;
      ctx.fill();
      ctx.restore();

      // 3. Graticule Lines (Latitude / Longitude Grid)
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.clip();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;

      // Draw Parallels (Latitudes)
      for (let lat = -60; lat <= 60; lat += 30) {
        const y = centerY + Math.sin((lat * Math.PI) / 180) * radius;
        const rLat = Math.cos((lat * Math.PI) / 180) * radius;
        ctx.beginPath();
        ctx.ellipse(centerX, y, rLat, rLat * 0.25, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw Meridians (Longitudes)
      for (let lon = 0; lon < 360; lon += 30) {
        const radLon = ((lon + angle) * Math.PI) / 180;
        const xOffset = Math.sin(radLon) * radius;
        ctx.beginPath();
        ctx.ellipse(centerX + xOffset * 0.5, centerY, Math.abs(xOffset * 0.5), radius, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 4. Render Indian Ocean & Surrounding Coastal Polygons
      if (layers.boundaries) {
        regions.forEach((reg, i) => {
          const latCenter = (reg.lat_min + reg.lat_max) / 2;
          const lonCenter = (reg.lon_min + reg.lon_max) / 2;

          // Convert lat/lon to 3D sphere projection
          const phi = (90 - latCenter) * (Math.PI / 180);
          const theta = (lonCenter + angle) * (Math.PI / 180);

          const px = centerX + radius * Math.sin(phi) * Math.sin(theta) * 0.85;
          const py = centerY - radius * Math.cos(phi) * 0.85;

          // Visible hemisphere check
          const isFront = Math.cos(theta) > -0.2;
          if (isFront) {
            // Region Boundary Oval
            ctx.save();
            ctx.beginPath();
            ctx.arc(px, py, 22 * zoom, 0, Math.PI * 2);

            // Reliability Color Logic: Green (>80), Yellow (60-80), Red (<60)
            let color = 'rgba(34, 197, 94, 0.35)';
            let borderColor = '#22C55E';

            if (i % 3 === 1) {
              color = 'rgba(245, 158, 11, 0.35)';
              borderColor = '#F59E0B';
            } else if (i % 3 === 2) {
              color = 'rgba(239, 68, 68, 0.35)';
              borderColor = '#EF4444';
            }

            ctx.fillStyle = color;
            ctx.fill();
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = 2;
            ctx.stroke();

            // Label
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 10px Inter, sans-serif';
            ctx.fillText(reg.region_id, px - 18, py + 3);
            ctx.restore();
          }
        });
      }

      ctx.restore();

      if (isRotating) {
        angle += 0.15;
      }

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animFrameId);
  }, [rotation, zoom, isRotating, regions, layers]);

  // Track Mouse Lat/Lon Simulation
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const lat = (15 + (y / rect.height - 0.5) * 40).toFixed(2);
    const lon = (75 + (x / rect.width - 0.5) * 40).toFixed(2);
    setMouseCoords({
      lat: `${Math.abs(Number(lat))}° ${Number(lat) >= 0 ? 'N' : 'S'}`,
      lon: `${Math.abs(Number(lon))}° ${Number(lon) >= 0 ? 'E' : 'W'}`
    });
  };

  const handleRegionClick = (reg: Region) => {
    setSelectedRegion(reg);
    if (onSelectRegion) onSelectRegion(reg);
  };

  return (
    <div className={`relative rounded-3xl bg-slate-950 overflow-hidden border border-slate-800 shadow-2xl ${fullScreen ? 'h-[calc(100vh-6rem)]' : 'h-[540px]'}`}>
      {/* Top Status & Controls Bar */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-3">
        <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700 text-white text-xs font-semibold flex items-center gap-2">
          <Compass className="w-4 h-4 text-ocean-400 animate-spin-slow" />
          <span>Lat: {mouseCoords.lat} | Lon: {mouseCoords.lon}</span>
        </div>

        <button
          onClick={() => setIsRotating(!isRotating)}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all backdrop-blur-md border ${
            isRotating
              ? 'bg-ocean-500/20 text-ocean-300 border-ocean-500/40'
              : 'bg-slate-800/80 text-slate-300 border-slate-700'
          }`}
        >
          {isRotating ? 'Pause Orbit' : 'Rotate Earth'}
        </button>
      </div>

      {/* Layer Control Panel Floating Widget */}
      <div className="absolute top-4 right-4 z-20 w-64 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-4 text-white shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-ocean-400">
            <Layers className="w-4 h-4" />
            <span>Globe Layers</span>
          </div>
          <span className="text-[10px] text-slate-400">Active: {Object.values(layers).filter(Boolean).length}</span>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto pr-1 text-xs">
          {[
            { key: 'temperature', label: 'Temperature (SST)', icon: Thermometer, color: 'text-rose-400' },
            { key: 'salinity', label: 'Salinity Profiles', icon: Droplets, color: 'text-sky-400' },
            { key: 'currents', label: 'U/V Currents', icon: Wind, color: 'text-indigo-400' },
            { key: 'ssh', label: 'Sea Surface Height', icon: Waves, color: 'text-teal-400' },
            { key: 'reliability', label: 'Forecast Reliability', icon: ShieldCheck, color: 'text-emerald-400' },
            { key: 'argo', label: 'Argo Float Stations', icon: MapPin, color: 'text-amber-400' },
            { key: 'alerts', label: 'Divergence Alerts', icon: AlertTriangle, color: 'text-rose-500' }
          ].map(layer => {
            const Icon = layer.icon;
            const active = layers[layer.key as keyof typeof layers];
            return (
              <button
                key={layer.key}
                onClick={() => toggleLayer(layer.key as keyof typeof layers)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                  active ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-3.5 h-3.5 ${layer.color}`} />
                  <span>{layer.label}</span>
                </div>
                {active ? <Eye className="w-3.5 h-3.5 text-ocean-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive 3D Canvas */}
      <canvas
        ref={canvasRef}
        width={1000}
        height={700}
        onMouseMove={handleMouseMove}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Region Selector Pills Bottom Overlay */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {regions.map((reg) => (
          <button
            key={reg.region_id}
            onClick={() => handleRegionClick(reg)}
            className="px-3.5 py-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700 hover:border-ocean-500 text-white text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 hover:scale-105"
          >
            <MapPin className="w-3.5 h-3.5 text-ocean-400" />
            <span>{reg.name}</span>
          </button>
        ))}
      </div>

      {/* Region Inspector Slide-Over Modal */}
      {selectedRegion && (
        <div className="absolute top-16 left-4 z-30 w-80 rounded-2xl bg-white dark:bg-slate-900/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 p-5 text-slate-800 dark:text-slate-100 shadow-2xl animate-in fade-in zoom-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-3">
            <div>
              <span className="text-[10px] font-bold uppercase text-ocean-600 dark:text-ocean-400 tracking-wider">Region Intelligence</span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{selectedRegion.name}</h4>
            </div>
            <button
              onClick={() => setSelectedRegion(null)}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">Coordinates</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedRegion.lat_min}°N - {selectedRegion.lat_max}°N | {selectedRegion.lon_min}°E - {selectedRegion.lon_max}°E</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">Sea Surface Temp</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">28.45 °C</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">Salinity</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">35.12 PSU</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">Current Speed</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">0.24 m/s</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">Reliability Score</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/50">89.4% (High)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 dark:text-slate-400">Risk Assessment</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Low Operational Risk</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
