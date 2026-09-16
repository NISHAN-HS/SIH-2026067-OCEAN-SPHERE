-- ============================================================================
-- OceanSphere: Ocean Forecast Reliability & Decision Support System (SIH 2026)
-- PostgreSQL Database Schema
-- Database Name: ocean_reliability_db
-- ============================================================================

DROP TABLE IF EXISTS model_predictions CASCADE;
DROP TABLE IF EXISTS trained_models CASCADE;
DROP TABLE IF EXISTS data_sources CASCADE;
DROP TABLE IF EXISTS reliability_scores CASCADE;
DROP TABLE IF EXISTS alerts CASCADE;
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS observation_data CASCADE;
DROP TABLE IF EXISTS forecast_data CASCADE;
DROP TABLE IF EXISTS regions CASCADE;

-- 1. REGIONS TABLE
CREATE TABLE regions (
    id SERIAL PRIMARY KEY,
    region_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    lat_min DOUBLE PRECISION NOT NULL,
    lat_max DOUBLE PRECISION NOT NULL,
    lon_min DOUBLE PRECISION NOT NULL,
    lon_max DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. DATA SOURCES TABLE
CREATE TABLE data_sources (
    id SERIAL PRIMARY KEY,
    source_name VARCHAR(150) NOT NULL,
    source_type VARCHAR(50) NOT NULL,
    download_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    file_path TEXT NOT NULL,
    record_count INT DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. TRAINED MODELS TABLE
CREATE TABLE trained_models (
    id SERIAL PRIMARY KEY,
    model_name VARCHAR(100) NOT NULL,
    algorithm VARCHAR(100) NOT NULL,
    training_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    accuracy DOUBLE PRECISION NOT NULL,
    mae DOUBLE PRECISION,
    rmse DOUBLE PRECISION,
    r2_score DOUBLE PRECISION,
    model_path TEXT NOT NULL
);

-- 4. FORECAST DATA TABLE
CREATE TABLE forecast_data (
    id SERIAL PRIMARY KEY,
    region_id VARCHAR(50) REFERENCES regions(region_id) ON DELETE SET NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    depth DOUBLE PRECISION DEFAULT 0.0,
    temperature DOUBLE PRECISION,
    salinity DOUBLE PRECISION,
    u_velocity DOUBLE PRECISION,
    v_velocity DOUBLE PRECISION,
    speed DOUBLE PRECISION,
    sea_surface_height DOUBLE PRECISION,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. OBSERVATION DATA TABLE
CREATE TABLE observation_data (
    id SERIAL PRIMARY KEY,
    observation_id VARCHAR(100) NOT NULL,
    region_id VARCHAR(50) REFERENCES regions(region_id) ON DELETE SET NULL,
    source_type VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    depth DOUBLE PRECISION DEFAULT 0.0,
    temperature DOUBLE PRECISION,
    salinity DOUBLE PRECISION,
    current_speed DOUBLE PRECISION,
    sea_surface_height DOUBLE PRECISION,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. RELIABILITY SCORES TABLE
CREATE TABLE reliability_scores (
    id SERIAL PRIMARY KEY,
    region_id VARCHAR(50) REFERENCES regions(region_id) ON DELETE SET NULL,
    observation_id VARCHAR(100),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    depth DOUBLE PRECISION DEFAULT 0.0,
    forecast_temperature DOUBLE PRECISION,
    observed_temperature DOUBLE PRECISION,
    temperature_bias DOUBLE PRECISION,
    forecast_salinity DOUBLE PRECISION,
    observed_salinity DOUBLE PRECISION,
    salinity_bias DOUBLE PRECISION,
    forecast_current_speed DOUBLE PRECISION,
    observed_current_speed DOUBLE PRECISION,
    current_bias DOUBLE PRECISION,
    reliability_score DOUBLE PRECISION NOT NULL,
    confidence_level VARCHAR(50) NOT NULL,
    risk_level VARCHAR(50) NOT NULL,
    model_name VARCHAR(100) DEFAULT 'Gradient Boosting Regressor',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. ALERTS TABLE
CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
    alert_id VARCHAR(100) UNIQUE NOT NULL,
    region_id VARCHAR(50) REFERENCES regions(region_id) ON DELETE SET NULL,
    severity VARCHAR(20) NOT NULL,
    alert_type VARCHAR(100) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. MODEL PREDICTIONS TABLE
CREATE TABLE model_predictions (
    id SERIAL PRIMARY KEY,
    model_name VARCHAR(100) NOT NULL,
    region_id VARCHAR(50),
    input_features JSONB NOT NULL,
    predicted_score DOUBLE PRECISION NOT NULL,
    predicted_category VARCHAR(50) NOT NULL,
    confidence_level VARCHAR(50) NOT NULL,
    risk_level VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. REPORTS TABLE
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    report_type VARCHAR(100) NOT NULL,
    report_name VARCHAR(250) NOT NULL,
    file_path TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES FOR OPTIMIZED SPATIAL & TEMPORAL QUERIES
CREATE INDEX idx_forecast_region_id ON forecast_data(region_id);
CREATE INDEX idx_forecast_lat ON forecast_data(latitude);
CREATE INDEX idx_forecast_lon ON forecast_data(longitude);
CREATE INDEX idx_forecast_time ON forecast_data(timestamp);

CREATE INDEX idx_obs_region_id ON observation_data(region_id);
CREATE INDEX idx_obs_lat ON observation_data(latitude);
CREATE INDEX idx_obs_lon ON observation_data(longitude);
CREATE INDEX idx_obs_time ON observation_data(timestamp);

CREATE INDEX idx_rel_region_id ON reliability_scores(region_id);
CREATE INDEX idx_rel_lat ON reliability_scores(latitude);
CREATE INDEX idx_rel_lon ON reliability_scores(longitude);
CREATE INDEX idx_rel_time ON reliability_scores(timestamp);
CREATE INDEX idx_rel_score ON reliability_scores(reliability_score);
