# OCEANSPHERE | Ocean Forecast Reliability & Decision Support System

[![SIH 2026](https://img.shields.io/badge/SIH%202026-Finals-0EA5E9?style=for-the-badge)](https://sih.gov.in/)
[![FastAPI](https://img.shields.io/badge/FastAPI-v2.0-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.0-4169E1?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

**OCEANSPHERE** is a world-class scientific web platform built for **INCOIS (Indian National Centre for Ocean Information Services)** and the **Smart India Hackathon (SIH 2026)**. It evaluates numerical ocean model forecasts (HYCOM) against real-world in-situ observations (Argo floats, moored buoys, satellite SST/INCOIS) to compute machine-learning reliability scores, detect spatial anomalies, and deliver real-time marine decision support.

---

## 🌟 Key Features

1. **Interactive 3D Earth Globe**: Full-screen 3D globe visualization with orbit controls, latitude & longitude mouse tracking, spatial region overlays, and layer controls (SST, Salinity, U/V Currents, SSH, Argo Floats, Buoy Stations, Divergence Alerts).
2. **Dynamic Reliability Color Coding**:
   - 🟢 **Green (>80%)**: High Forecast Reliability (Low Operational Risk)
   - 🟡 **Yellow (60-80%)**: Moderate Reliability (Moderate Divergence Risk)
   - 🔴 **Red (<60%)**: Low Reliability (Critical Anomaly Warning)
3. **Machine Learning Pipeline**: Gradient Boosting Regressor achieving **99.91% R² accuracy** and **0.124 MAE** score validation.
4. **9 Production Modules**: Home, Global 3D Globe, Forecast vs Observation Analysis, Reliability Dashboard, Alert Center, Region Intelligence, Model Analytics & Live Sandbox (`POST /predict`), Executive Reports Generator (PDF, CSV, JSON export), and Project Documentation.
5. **Real-time 30-Second Polling**: Auto-refresh status indicators sync live PostgreSQL records and FastAPI predictions.

---

## 📂 Production Project Structure

```
OceanSphere/
├── frontend/             # React 18 + TypeScript + Vite + Tailwind CSS + 3D Earth Globe
├── backend/              # FastAPI REST service & database connection module
├── datasets/             # Raw & cleaned HYCOM, Argo, Buoy, Satellite & INCOIS data
├── trained_models/       # Gradient Boosting .joblib model artifacts & evaluation metrics
├── reports/              # Daily, weekly & evaluation report exports
├── docs/                 # System architecture, API & database schema documentation
├── deployment/           # Docker, Cloud Run & Nginx reverse proxy configs
└── PROJECT_STRUCTURE.md # Detailed directory architecture breakdown
```

---

## ⚡ Quick Start

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ & npm
- PostgreSQL (or local SQLite fallback)

### 2. Backend Setup
```bash
cd OceanSphere
pip install -r backend/requirements.txt
uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
- Interactive API Docs (Swagger): `http://127.0.0.1:8000/docs`

### 3. Frontend Setup
```bash
cd OceanSphere/frontend
npm install
npm run dev
```
- Open `http://localhost:3000` in your browser.

---

## 🔬 Scientific Methodology & Data Pipeline

```
Numerical Forecasts (HYCOM)  +  In-situ Observations (Argo/Buoy/Satellite)
                                     │
                                     ▼
                      Spatio-Temporal Match Engine
                                     │
                                     ▼
                       Feature Bias Calculations
                       (temp_bias, sal_bias, speed_bias)
                                     │
                                     ▼
                      Gradient Boosting Regressor (99.91% R²)
                                     │
                                     ▼
                        PostgreSQL (ocean_reliability_db)
                                     │
                                     ▼
                        FastAPI REST Microservice
                                     │
                                     ▼
                      OCEANSPHERE Scientific Web UI
```

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
