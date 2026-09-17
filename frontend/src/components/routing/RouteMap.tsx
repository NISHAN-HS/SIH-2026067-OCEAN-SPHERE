import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ShipRouteResult, RouteWaypoint, PortLocation } from '../../types';

// Fix Leaflet's default icon path issues with Webpack/Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Smooth an array of coordinates using a simple Catmull-Rom spline
function getCurvePoints(points: [number, number][], numOfSegments: number = 16): [number, number][] {
  if (points.length < 2) return points;
  const _pts = [points[0], ...points, points[points.length - 1]];
  const res: [number, number][] = [];

  for (let i = 1; i < _pts.length - 2; i++) {
    for (let t = 0; t <= numOfSegments; t++) {
      const p0 = _pts[i - 1], p1 = _pts[i], p2 = _pts[i + 1], p3 = _pts[i + 2];
      const t1 = t / numOfSegments, t2 = t1 * t1, t3 = t2 * t1;
      const x = 0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t1 + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3);
      const y = 0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t1 + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3);
      // Avoid pushing duplicate consecutive points
      if (res.length === 0 || res[res.length - 1][0] !== x || res[res.length - 1][1] !== y) {
        res.push([x, y]);
      }
    }
  }
  return res;
}

interface RouteMapProps {
  routeResult: ShipRouteResult | null;
  mapOrigin: PortLocation;
  mapDest: PortLocation;
  simStep: number;
  showDirectRoute: boolean;
  showWavesOverlay: boolean;
  showReliabilityOverlay: boolean;
  selectedWaypoint: RouteWaypoint | null;
  setSelectedWaypoint: (wpt: RouteWaypoint) => void;
}

const BoundsUpdater: React.FC<{ waypoints: RouteWaypoint[]; origin: PortLocation; dest: PortLocation }> = ({ waypoints, origin, dest }) => {
  const map = useMap();
  useEffect(() => {
    if (waypoints && waypoints.length > 0) {
      const bounds = L.latLngBounds(waypoints.map(w => [w.latitude, w.longitude]));
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      const bounds = L.latLngBounds([
        [origin.latitude, origin.longitude],
        [dest.latitude, dest.longitude]
      ]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, waypoints, origin, dest]);
  return null;
};

export const RouteMap: React.FC<RouteMapProps> = ({
  routeResult,
  mapOrigin,
  mapDest,
  simStep,
  showDirectRoute,
  showWavesOverlay,
  showReliabilityOverlay,
  selectedWaypoint,
  setSelectedWaypoint
}) => {
  const [mapType, setMapType] = useState<'hybrid' | 'standard'>('hybrid');
  
  const waypoints = routeResult?.waypoints || [];
  const activeWpt = waypoints[simStep] || waypoints[0];

  // Convert waypoints to a smooth curve array
  const rawPositions: [number, number][] = waypoints.map(w => [w.latitude, w.longitude]);
  const curvyPositions = getCurvePoints(rawPositions, 20);

  return (
    <div className="relative w-full h-[480px] rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 shadow-2xl z-0">
      
      {/* Map Type Control */}
      <div className="absolute top-4 right-4 z-[400] bg-slate-900/90 p-1.5 rounded-lg border border-slate-700 flex gap-1 shadow-lg backdrop-blur">
        <button 
          onClick={() => setMapType('hybrid')}
          className={`px-3 py-1 text-xs font-bold rounded ${mapType === 'hybrid' ? 'bg-ocean-600 text-white' : 'text-slate-400 hover:text-white'}`}
        >
          Satellite
        </button>
        <button 
          onClick={() => setMapType('standard')}
          className={`px-3 py-1 text-xs font-bold rounded ${mapType === 'standard' ? 'bg-ocean-600 text-white' : 'text-slate-400 hover:text-white'}`}
        >
          Map
        </button>
      </div>

      <MapContainer 
        center={[mapOrigin.latitude, mapOrigin.longitude]} 
        zoom={5} 
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
      >
        <BoundsUpdater waypoints={waypoints} origin={mapOrigin} dest={mapDest} />
        
        {/* Google Maps Base Layer (Tile Service) */}
        {mapType === 'hybrid' ? (
          <TileLayer
            url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
            attribution="&copy; Google Maps"
          />
        ) : (
          <TileLayer
            url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            attribution="&copy; Google Maps"
          />
        )}

        {/* Origin & Destination Markers */}
        <Marker position={[mapOrigin.latitude, mapOrigin.longitude]}>
          <Popup>
            <strong>Departure:</strong> {mapOrigin.name}
          </Popup>
        </Marker>
        <Marker position={[mapDest.latitude, mapDest.longitude]}>
          <Popup>
            <strong>Destination:</strong> {mapDest.name}
          </Popup>
        </Marker>

        {/* Direct Great Circle Route Line */}
        {showDirectRoute && (
          <Polyline
            positions={
              routeResult?.direct_waypoints?.length
                ? routeResult.direct_waypoints.map(w => [w.latitude, w.longitude])
                : [[mapOrigin.latitude, mapOrigin.longitude], [mapDest.latitude, mapDest.longitude]]
            }
            color="#f43f5e"
            weight={3}
            dashArray="8, 8"
            opacity={0.85}
          >
            <Popup>
              <div className="text-xs font-bold text-rose-600">
                Direct Great Circle Route (Unoptimized Standard Line)
              </div>
            </Popup>
          </Polyline>
        )}

        {/* Waves Grid Overlay */}
        {showWavesOverlay && waypoints.map((wpt, idx) => {
          const waveColor = wpt.wave_height_m > 3.0 ? '#ef4444' : wpt.wave_height_m > 2.0 ? '#f59e0b' : '#38bdf8';
          return (
            <CircleMarker
              key={`wave-grid-${idx}`}
              center={[wpt.latitude + 0.12, wpt.longitude + 0.12]}
              radius={Math.max(10, Math.min(22, wpt.wave_height_m * 6))}
              pathOptions={{
                color: waveColor,
                weight: 1.5,
                fillColor: waveColor,
                fillOpacity: 0.25,
                dashArray: '3, 3'
              }}
            >
              <Popup>
                <div className="text-xs">
                  <strong className="block text-sky-400">🌊 Sea State Wave Grid</strong>
                  <span>Wave Height: <b>{wpt.wave_height_m} m</b></span><br/>
                  <span>Surface Current: <b>{wpt.current_speed_knots} kts</b></span>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}

        {/* INCOIS Reliability Overlay */}
        {showReliabilityOverlay && waypoints.map((wpt, idx) => {
          const relColor = wpt.reliability_score >= 88 ? '#10b981' : wpt.reliability_score >= 75 ? '#f59e0b' : '#f43f5e';
          return (
            <CircleMarker
              key={`rel-grid-${idx}`}
              center={[wpt.latitude - 0.12, wpt.longitude - 0.12]}
              radius={Math.max(12, Math.min(26, (wpt.reliability_score / 100) * 20))}
              pathOptions={{
                color: relColor,
                weight: 1.5,
                fillColor: relColor,
                fillOpacity: 0.2
              }}
            >
              <Popup>
                <div className="text-xs">
                  <strong className="block text-emerald-400">🛡️ INCOIS Reliability Overlay</strong>
                  <span>Forecast Score: <b>{wpt.reliability_score}%</b></span><br/>
                  <span>Model Risk: <b>{wpt.risk_level}</b></span>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}

        {/* Smart Route Line */}
        {waypoints.length > 0 && (
          <>
            <Polyline 
              positions={rawPositions} 
              color="#0ea5e9" 
              weight={6} 
              opacity={0.4} 
              lineCap="round" 
              lineJoin="round" 
            />
            <Polyline 
              positions={rawPositions} 
              color="#10b981" 
              weight={3} 
              lineCap="round" 
              lineJoin="round" 
            />

            {/* Waypoint Nodes */}
            {waypoints.map((wpt, idx) => {
              const isSelected = selectedWaypoint?.step === wpt.step;
              const isSimCurrent = simStep === wpt.step;
              const color = wpt.risk_level === 'Critical Hazard' ? '#f43f5e' : wpt.risk_level === 'Moderate Risk' ? '#f59e0b' : '#10b981';
              
              return (
                <CircleMarker
                  key={`wpt-${idx}`}
                  center={[wpt.latitude, wpt.longitude]}
                  radius={isSelected || isSimCurrent ? 6 : 3}
                  pathOptions={{ color: '#fff', weight: 1.5, fillColor: color, fillOpacity: 1 }}
                  eventHandlers={{ click: () => setSelectedWaypoint(wpt) }}
                >
                  <Popup>
                    <div className="text-xs">
                      <strong className="block mb-1">{wpt.name}</strong>
                      <span className="block">Risk: <b style={{color}}>{wpt.risk_level}</b></span>
                      <span className="block">Reliability: {wpt.reliability_score}%</span>
                      <span className="block">Waves: {wpt.wave_height_m}m</span>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}

            {/* Active Ship Marker (Simulation) */}
            {activeWpt && (
              <CircleMarker
                center={[activeWpt.latitude, activeWpt.longitude]}
                radius={8}
                pathOptions={{ color: '#fff', weight: 2, fillColor: '#0284c7', fillOpacity: 1 }}
              />
            )}
          </>
        )}
      </MapContainer>
    </div>
  );
};
