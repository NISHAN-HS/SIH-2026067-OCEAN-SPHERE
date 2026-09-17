export interface Region {
  id: number;
  region_id: string;
  name: string;
  lat_min: number;
  lat_max: number;
  lon_min: number;
  lon_max: number;
}

export interface LayerState {
  surface: boolean;
  temperature: boolean;
  salinity: boolean;
  currents: boolean;
  northwardCurrent: boolean;
  eastwardCurrent: boolean;
  ssh: boolean;
  reliability: boolean;
  confidence: boolean;
  argo: boolean;
  buoys: boolean;
  observationPoints: boolean;
  predictionLayer: boolean;
  alerts: boolean;
  anomalyLayer: boolean;
  bathymetry: boolean;
}

export interface DepthControl {
  currentDepth: number; // in meters
  preset: 'Surface' | '50m' | '100m' | '500m' | '1000m' | '2000m' | '5000m';
}

export interface SelectedLocationData {
  latitude: number;
  longitude: number;
  oceanName: string;
  regionName?: string;
  regionId?: string;
  temperature: number; // °C
  salinity: number; // PSU
  currentSpeed: number; // m/s
  currentDirection: number; // deg
  waveHeight: number; // m
  depth: number; // m
  seaSurfaceHeight: number; // m
  reliabilityScore: number; // 0 - 100
  confidenceLevel: 'High Confidence' | 'Medium Confidence' | 'Low Confidence';
  riskLevel: 'Low Operational Risk' | 'Moderate Risk' | 'High Operational Risk';
  forecastAccuracy: number; // %
  lastUpdated: string;
  trend: 'Improving' | 'Stable' | 'Diverging';
}

export interface TimeControlState {
  selectedDate: string;
  isPlaying: boolean;
  playbackSpeed: number;
  isForecast: boolean;
}

export interface ForecastData {
  id: number;
  region_id: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  depth: number;
  temperature: number;
  salinity: number;
  u_velocity: number;
  v_velocity: number;
  speed: number;
  sea_surface_height: number;
}

export interface ObservationData {
  id: number;
  observation_id: string;
  region_id: string;
  source_type: 'ARGO' | 'BUOY' | 'SATELLITE_INCOIS';
  timestamp: string;
  latitude: number;
  longitude: number;
  depth: number;
  temperature: number;
  salinity: number;
  current_speed: number;
  sea_surface_height: number;
}

export interface ReliabilityScore {
  id: number;
  region_id: string;
  observation_id?: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  depth: number;
  forecast_temperature: number;
  observed_temperature: number;
  temperature_bias: number;
  forecast_salinity: number;
  observed_salinity: number;
  salinity_bias: number;
  forecast_current_speed: number;
  observed_current_speed: number;
  current_bias: number;
  reliability_score: number;
  confidence_level: 'High Confidence' | 'Medium Confidence' | 'Low Confidence';
  risk_level: 'Low Risk' | 'Moderate Risk' | 'High Risk';
  model_name: string;
}

export interface AlertItem {
  id: number;
  alert_id: string;
  region_id: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  alert_type: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  description: string;
}

export interface DataSourceMeta {
  id: number;
  source_name: string;
  source_type: string;
  download_date: string;
  file_path: string;
  record_count: number;
  last_updated: string;
}

export interface TrainedModelMeta {
  id: number;
  model_name: string;
  algorithm: string;
  training_date: string;
  accuracy: number;
  mae: number;
  rmse: number;
  r2_score: number;
  model_path: string;
}

export interface PredictPayload {
  region_id?: string;
  latitude: number;
  longitude: number;
  depth?: number;
  forecast_temperature: number;
  observed_temperature: number;
  forecast_salinity: number;
  observed_salinity: number;
  forecast_current_speed: number;
  observed_current_speed: number;
}

export interface PredictResponse {
  status: string;
  predicted_reliability_score: number;
  predicted_category: string;
  confidence_level: string;
  risk_level: string;
  model_used: string;
  timestamp: string;
}

export interface PortLocation {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  region_id: string;
  type: 'Major Commercial' | 'Naval Base' | 'Transshipment' | 'Regional Port';
  depth_m: number;
  description: string;
}

export interface VesselProfile {
  id: string;
  name: string;
  category: 'Container' | 'Oil Tanker' | 'Bulk Carrier' | 'Naval Patrol' | 'Research Vessel' | 'Trawler';
  default_speed_knots: number;
  draft_m: number;
  fuel_rate_tons_per_day: number;
  max_wave_height_m: number;
  icon_name: string;
}

export interface RouteWaypoint {
  step: number;
  latitude: number;
  longitude: number;
  name: string;
  distance_from_start_nm: number;
  leg_distance_nm: number;
  heading_deg: number;
  expected_speed_knots: number;
  wave_height_m: number;
  current_speed_knots: number;
  current_dir_deg: number;
  temperature_c: number;
  reliability_score: number;
  risk_level: 'Low Risk' | 'Moderate Risk' | 'High Risk' | 'Critical Hazard';
  advisory: string;
}

export interface ShipRouteResult {
  route_id: string;
  optimization_mode: 'reliability' | 'eco' | 'express';
  origin_port: PortLocation;
  destination_port: PortLocation;
  vessel: VesselProfile;
  total_distance_nm: number;
  estimated_transit_hours: number;
  eta_formatted: string;
  average_speed_knots: number;
  average_reliability_score: number;
  fuel_consumption_tons: number;
  co2_emissions_tons: number;
  overall_risk: 'Low Operational Risk' | 'Moderate Risk' | 'High Risk';
  hazard_zones_bypassed: number;
  fuel_saved_tons_vs_direct: number;
  hours_saved_vs_direct: number;
  waypoints: RouteWaypoint[];
  direct_distance_nm: number;
  direct_waypoints: Array<{ latitude: number; longitude: number }>;
  google_maps_url: string;
  google_earth_url: string;
}

export interface RoutingRequest {
  origin_port_id: string;
  destination_port_id: string;
  vessel_id: string;
  optimization_mode: 'reliability' | 'eco' | 'express';
  custom_speed_knots?: number;
  avoid_high_waves?: boolean;
  avoid_low_reliability?: boolean;
  avoid_active_alerts?: boolean;
}


