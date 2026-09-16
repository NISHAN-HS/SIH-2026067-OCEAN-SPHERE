# OceanSphere Architecture Specification

## 1. System Topology

```
+-------------------------------------------------------------------------+
|                    OCEANSPHERE REACT FRONTEND                            |
| (React 18 + TypeScript + Vite + Tailwind CSS + 3D Earth Globe Canvas)    |
+-------------------------------------------------------------------------+
                                    │
                                    │ HTTP / JSON API (30s Polling)
                                    ▼
+-------------------------------------------------------------------------+
|                     FASTAPI REST API BACKEND                            |
|  - GET /regions        - GET /forecast      - GET /observations         |
|  - GET /reliability    - GET /alerts        - GET /sources              |
|  - GET /models         - POST /predict                                  |
+-------------------------------------------------------------------------+
                    │                                   │
                    ▼                                   ▼
+-----------------------------------+   +---------------------------------+
|   GRADIENT BOOSTING ML ENGINE     |   |   POSTGRESQL DATABASE ENGINE    |
| (MAE: 0.124, R²: 0.9991 Accuracy) |   |    (ocean_reliability_db)     |
+-----------------------------------+   +---------------------------------+
```

## 2. Database Schema (`ocean_reliability_db`)

The system relies on 9 relational tables indexed for fast spatial and temporal queries:
1. `regions` (Geographic ocean basin bounds)
2. `data_sources` (Ingestion metadata & download dates)
3. `trained_models` (Model performance & joblib paths)
4. `forecast_data` (HYCOM numerical forecasts)
5. `observation_data` (Argo, Buoys, Satellite SST/INCOIS)
6. `reliability_scores` (Validation evaluations)
7. `alerts` (Anomaly alerts & critical warnings)
8. `model_predictions` (Prediction audit log)
9. `reports` (Exported report manifests)

## 3. Reliability Color Logic Formula

$$\text{Reliability Score} = 100 - (\text{temp\_bias} \times 20 + \text{sal\_bias} \times 15 + \text{current\_bias} \times 25)$$

- **Score $\ge 80$**: 🟢 Green (High Confidence, Low Risk)
- **Score $60 - 80$**: 🟡 Yellow (Moderate Confidence, Moderate Risk)
- **Score $< 60$**: 🔴 Red (Low Confidence, High Divergence Risk)
