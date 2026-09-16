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
  observation_id: string;
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

