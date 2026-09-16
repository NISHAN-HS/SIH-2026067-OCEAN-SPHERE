import axios from 'axios';
import { Region, ForecastData, ObservationData, ReliabilityScore, AlertItem, DataSourceMeta, TrainedModelMeta, PredictPayload, PredictResponse } from '../types';

const API_BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getRegions = async (): Promise<Region[]> => {
  try {
    const response = await api.get('/regions');
    return response.data.regions || [];
  } catch (error) {
    console.warn('[API] Failed to fetch /regions, returning fallback data:', error);
    return [
      { id: 1, region_id: 'IND_WEST', name: 'West Coast of India (Arabian Sea)', lat_min: 8.0, lat_max: 23.0, lon_min: 68.0, lon_max: 77.0 },
      { id: 2, region_id: 'IND_EAST', name: 'East Coast of India (Bay of Bengal)', lat_min: 8.0, lat_max: 22.0, lon_min: 78.0, lon_max: 90.0 },
      { id: 3, region_id: 'IND_SOUTH', name: 'Southern Indian Ocean', lat_min: 0.0, lat_max: 8.0, lon_min: 70.0, lon_max: 85.0 },
      { id: 4, region_id: 'IND_NORTH_ARABIAN', name: 'North Arabian Sea', lat_min: 20.0, lat_max: 25.0, lon_min: 60.0, lon_max: 70.0 },
      { id: 5, region_id: 'IND_ANDAMAN', name: 'Andaman & Nicobar Region', lat_min: 6.0, lat_max: 14.0, lon_min: 91.0, lon_max: 94.0 },
      { id: 6, region_id: 'IND_GUJARAT', name: 'Gujarat Coastal Zone', lat_min: 20.0, lat_max: 24.0, lon_min: 68.0, lon_max: 72.0 },
      { id: 7, region_id: 'IND_TAMILNADU', name: 'Tamil Nadu Coastal Zone', lat_min: 8.0, lat_max: 13.5, lon_min: 78.0, lon_max: 81.0 }
    ];
  }
};

export const getForecast = async (regionId?: string, limit: number = 100): Promise<ForecastData[]> => {
  try {
    const response = await api.get('/forecast', { params: { region_id: regionId, limit } });
    return response.data.data || [];
  } catch (error) {
    console.warn('[API] Failed to fetch /forecast:', error);
    return [];
  }
};

export const getObservations = async (sourceType?: string, limit: number = 100): Promise<ObservationData[]> => {
  try {
    const response = await api.get('/observations', { params: { source_type: sourceType, limit } });
    return response.data.data || [];
  } catch (error) {
    console.warn('[API] Failed to fetch /observations:', error);
    return [];
  }
};

export const getReliability = async (regionId?: string, minScore?: number, limit: number = 100): Promise<ReliabilityScore[]> => {
  try {
    const response = await api.get('/reliability', { params: { region_id: regionId, min_score: minScore, limit } });
    return response.data.data || [];
  } catch (error) {
    console.warn('[API] Failed to fetch /reliability:', error);
    return [];
  }
};

export const getAlerts = async (severity?: string, limit: number = 100): Promise<AlertItem[]> => {
  try {
    const response = await api.get('/alerts', { params: { severity, limit } });
    return response.data.data || [];
  } catch (error) {
    console.warn('[API] Failed to fetch /alerts:', error);
    return [];
  }
};

export const getSources = async (): Promise<DataSourceMeta[]> => {
  try {
    const response = await api.get('/sources');
    return response.data.sources || [];
  } catch (error) {
    console.warn('[API] Failed to fetch /sources:', error);
    return [];
  }
};

export const getModels = async (): Promise<TrainedModelMeta[]> => {
  try {
    const response = await api.get('/models');
    return response.data.models || [];
  } catch (error) {
    console.warn('[API] Failed to fetch /models:', error);
    return [];
  }
};

export const predictReliability = async (payload: PredictPayload): Promise<PredictResponse> => {
  try {
    const response = await api.post('/predict', payload);
    return response.data;
  } catch (error) {
    console.error('[API] Failed POST /predict:', error);
    // Local fallback calculation if API offline
    const t_bias = Math.abs(payload.forecast_temperature - payload.observed_temperature);
    const s_bias = Math.abs(payload.forecast_salinity - payload.observed_salinity);
    const c_bias = Math.abs(payload.forecast_current_speed - payload.observed_current_speed);
    const score = Math.max(0, Math.min(100, 100 - (t_bias * 20 + s_bias * 15 + c_bias * 25)));

    return {
      status: 'fallback',
      predicted_reliability_score: Number(score.toFixed(2)),
      predicted_category: score >= 80 ? 'High Reliability' : score >= 60 ? 'Moderate Reliability' : 'Low Reliability',
      confidence_level: score >= 80 ? 'High Confidence' : 'Medium Confidence',
      risk_level: score >= 80 ? 'Low Risk' : score >= 60 ? 'Moderate Risk' : 'High Risk',
      model_used: 'Gradient Boosting Regressor (Fallback)',
      timestamp: new Date().toISOString()
    };
  }
};
