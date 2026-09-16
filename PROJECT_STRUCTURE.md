# OceanSphere Project Structure Guide

This document explains the organization and purpose of every directory and file in the **OceanSphere** project repository.

```
OceanSphere/
├── frontend/                   # React 18 + TypeScript + Vite + Tailwind CSS + CesiumJS UI
│   ├── public/                 # Static web assets, favicon, icons
│   ├── src/
│   │   ├── assets/             # Ocean branding, textures, SVGs
│   │   ├── components/
│   │   │   ├── globe/          # OceanGlobe.tsx (Interactive 3D Earth & layer controls)
│   │   │   ├── dashboard/      # MetricCard.tsx (Executive KPI cards)
│   │   │   ├── alerts/         # AlertTable.tsx (Searchable alert feed & acknowledgment)
│   │   │   ├── charts/         # Recharts line, bar, area, and pie chart components
│   │   │   ├── layout/         # Navbar.tsx & Footer.tsx
│   │   │   └── common/         # Common UI elements
│   │   ├── pages/
│   │   │   ├── Home/           # HomePage.tsx (Hero, 3D Globe preview & live KPIs)
│   │   │   ├── Globe/          # GlobePage.tsx (Full-screen 3D spatial analysis)
│   │   │   ├── Reliability/    # ReliabilityPage.tsx (Executive scorecard & regional comparison)
│   │   │   ├── Forecast/       # ForecastPage.tsx (HYCOM vs observation error analysis)
│   │   │   ├── Alerts/         # AlertsPage.tsx (Alert center & critical warnings)
│   │   │   ├── Regions/        # RegionsPage.tsx (Deep-dive regional analysis)
│   │   │   ├── Reports/        # ReportsPage.tsx (PDF, CSV & JSON dataset exports)
│   │   │   ├── About/          # AboutPage.tsx (INCOIS alignment & SIH methodology)
│   │   │   └── ModelAnalytics/ # ModelAnalyticsPage.tsx (Gradient Boosting metrics & live sandbox)
│   │   ├── services/           # api.ts (Axios REST client connected to http://127.0.0.1:8000)
│   │   ├── hooks/              # Custom React state & auto-refresh hooks
│   │   ├── contexts/           # Global application state
│   │   ├── types/              # index.ts (TypeScript interfaces for API payloads)
│   │   ├── utils/              # helpers.ts (Reliability color logic & formatters)
│   │   ├── styles/             # index.css (Tailwind CSS directives)
│   │   └── App.tsx             # Root router linking all 9 pages
│   ├── package.json            # Node.js dependencies manifest
│   └── vite.config.ts          # Vite configuration with API proxy
│
├── backend/                    # FastAPI REST API Backend
│   ├── api/
│   │   ├── routes/             # Modular API endpoints (/regions, /forecast, /reliability, etc.)
│   │   ├── middleware/         # CORS & logging middleware
│   │   └── dependencies/       # DB session dependencies
│   ├── database/
│   │   ├── schema/             # database.sql (PostgreSQL DDL schema)
│   │   ├── connection.py       # PostgreSQL (localhost:5432) engine with SQLite fallback
│   │   ├── models/             # SQLAlchemy ORM models
│   │   └── seed/               # Dataset import scripts
│   ├── services/               # Forecast, reliability, alert & region service logic
│   ├── ml/                     # ML model runner & feature scaling
│   │   ├── models/             # gradient_boosting.joblib & scaler.joblib
│   │   ├── prediction/         # predict.py (Live inference runner)
│   │   └── feature_engineering/# Bias calculations (temp_bias, sal_bias, current_bias)
│   ├── config/                 # settings.py (Pydantic settings)
│   ├── tests/                  # test_api_flow.py (Automated backend verification test)
│   ├── logs/                   # System runtime logs
│   ├── main.py                 # FastAPI entry point (`uvicorn backend.main:app --reload`)
│   └── requirements.txt        # Python dependencies manifest
│
├── datasets/                   # Raw & Processed Ocean Data Repository
│   ├── raw/                    # HYCOM, Argo, Buoy, Satellite & INCOIS datasets
│   ├── processed/              # Cleaned, matched, and training CSV/Parquet files
│   └── metadata/               # Data sources metadata
│
├── trained_models/             # Machine Learning Model Store
│   ├── gradient_boosting/      # Gradient Boosting joblib artifacts
│   ├── random_forest/          # Random Forest baseline
│   ├── xgboost/                # XGBoost baseline
│   └── model_metrics/          # MAE, RMSE & R² evaluation metrics
│
├── reports/                    # Generated Reports & Quality Audits
│   ├── daily/, weekly/, monthly/, model_reports/, evaluation_reports/
│
├── docs/                       # System & Architecture Documentation
│   ├── architecture/           # System architecture diagrams & specs
│   ├── database/               # PostgreSQL schema docs
│   ├── api/                    # OpenAPI specifications
│   └── sih_documents/          # SIH 2026 submission presentation materials
│
├── deployment/                 # Deployment & Cloud Configurations
│   ├── docker/                 # Dockerfiles for frontend & backend
│   ├── cloud_run/              # Google Cloud Run specs
│   ├── scripts/                # Startup & deployment scripts
│   └── nginx/                  # Nginx reverse proxy config
│
├── monitoring/                 # Monitoring & Health Checks
│   ├── logs/, analytics/, health_checks/
│
├── PROJECT_STRUCTURE.md       # Directory architecture documentation (this file)
├── docker-compose.yml          # Container orchestration manifest
├── .env                        # Environment configuration
├── .gitignore                  # Git exclusion rules
├── README.md                   # Software overview & quickstart guide
└── LICENSE                     # MIT Open Source License
```
