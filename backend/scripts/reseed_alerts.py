import random
from datetime import datetime, timedelta
from sqlalchemy import text
from backend.database.connection import get_db_engine

# ── 7 OceanSphere Regions Bounding Box Definitions ──────────────────────────────
REGIONS_META = {
    'IND_WEST': {
        'name': 'West Coast of India (Arabian Sea)',
        'lat_min': 8.0, 'lat_max': 22.5, 'lon_min': 68.5, 'lon_max': 76.5,
        'templates': [
            ('CRITICAL', 'Thermal Divergence', 'HYCOM vs Argo SST bias exceeds {bias}°C — high thermal divergence off Goa coast.'),
            ('WARNING', 'Reliability Degraded', 'Forecast reliability score fell to {rel}% in grid sector IW-{sec} near Lakshadweep.'),
            ('CRITICAL', 'Current Velocity Anomaly', 'Observed surface current speed ({spd} m/s) is 1.8x model forecast — Ekman drift deviation.'),
            ('WARNING', 'Buoy Calibration Drift', 'Moored buoy INCOIS-B{sec} showing {bias}°C calibration drift — data flagged.'),
            ('WARNING', 'Thermocline Shoaling', 'Thermocline depth shoaled {depth}m over 48h — forecast skill degraded off Konkan coast.')
        ]
    },
    'IND_EAST': {
        'name': 'East Coast of India (Bay of Bengal)',
        'lat_min': 8.5, 'lat_max': 21.5, 'lon_min': 78.5, 'lon_max': 89.5,
        'templates': [
            ('WARNING', 'Salinity Anomaly', 'Surface salinity {sal} PSU above model baseline in Central Bay of Bengal.'),
            ('CRITICAL', 'Argo Float Dropout', '{count} Argo floats went silent — observation coverage blackout in BOB sector.'),
            ('CRITICAL', 'Cyclonic Circulation Precursor', 'Deep convection + low pressure area detected — SST {sst}°C near Visakhapatnam.'),
            ('WARNING', 'Monsoon Wind Shear', 'Strong SW monsoon wind shear — wave height model underestimating by {bias}m.'),
            ('WARNING', 'Freshwater Runoff Plume', 'Ganges-Brahmaputra plume anomaly — surface layer stratification spike.')
        ]
    },
    'IND_SOUTH': {
        'name': 'Southern Indian Ocean',
        'lat_min': 0.5, 'lat_max': 7.8, 'lon_min': 70.5, 'lon_max': 84.5,
        'templates': [
            ('CRITICAL', 'Current Speed Spike', 'Equatorial counter-current speed {spd} m/s — 45% above HYCOM prediction.'),
            ('CRITICAL', 'Deep Water Warming', 'Anomalous warming at 500m depth — +{bias}°C above climatological mean.'),
            ('WARNING', 'SSH Anomaly', 'Sea Surface Height anomaly +{depth}cm above satellite altimetry baseline.'),
            ('WARNING', 'Internal Wave Train', 'Large amplitude internal solitary waves detected near Chagos Trench.')
        ]
    },
    'IND_ANDAMAN': {
        'name': 'Andaman & Nicobar Region',
        'lat_min': 6.2, 'lat_max': 13.8, 'lon_min': 91.2, 'lon_max': 93.8,
        'templates': [
            ('CRITICAL', 'Tsunami Precursor Signal', 'Subsurface pressure anomaly detected — possible seismic-induced wave perturbation.'),
            ('WARNING', 'Observation Blackout', 'No Argo or buoy observations in sector for {sec}h — coverage blackout.'),
            ('CRITICAL', 'Coral Bleaching Threat', 'Degree Heating Weeks (DHW) > {rel} — severe thermal stress around Havelock Island.'),
            ('WARNING', 'Barotropic Tide Surge', 'Semidiurnal tide surge {bias}m above forecast near Port Blair.')
        ]
    },
    'IND_GUJARAT': {
        'name': 'Gujarat Coastal Zone',
        'lat_min': 20.2, 'lat_max': 23.8, 'lon_min': 68.2, 'lon_max': 71.8,
        'templates': [
            ('CRITICAL', 'Cyclone Precursor', 'Rapid ocean warming — SST {sst}°C, warm oceanic layer deepening off Gulf of Kutch.'),
            ('WARNING', 'Tidal Surge Risk', 'Spring tide + storm surge forecast — coastal risk elevated near Kandla Port.'),
            ('CRITICAL', 'Oil Slick Anomaly', 'Anomalous surface slick detected via SAR satellite — potential hydrocarbon spill.'),
            ('WARNING', 'Hypoxia Warning', 'Dissolved oxygen dropped below 2.0 mg/L in Gulf of Khambhat benthic layer.')
        ]
    },
    'IND_TAMILNADU': {
        'name': 'Tamil Nadu Coastal Zone',
        'lat_min': 8.2, 'lat_max': 13.2, 'lon_min': 78.2, 'lon_max': 80.8,
        'templates': [
            ('WARNING', 'Wave Height Anomaly', 'Observed wave heights {bias}m exceeding model forecast near Chennai Port.'),
            ('CRITICAL', 'Rip Current Warning', 'Strong rip current velocity ({spd} m/s) detected along Coromandel coast.'),
            ('WARNING', 'Coastal Erosion Threat', 'Sustained high wave energy — erosion risk elevated for Cuddalore coast.'),
            ('WARNING', 'Palk Strait Circulation', 'Current divergence in Palk Strait — shallow water bathymetry model deviation.')
        ]
    },
    'IND_NORTH_ARABIAN': {
        'name': 'North Arabian Sea',
        'lat_min': 20.2, 'lat_max': 24.8, 'lon_min': 60.2, 'lon_max': 69.8,
        'templates': [
            ('CRITICAL', 'Cold Upwelling Event', 'Cold upwelling event — SST dropped {bias}°C over 48h off North Arabian coast.'),
            ('WARNING', 'Chlorophyll Bloom', 'Massive Noctiluca algal bloom detected via satellite — impacting SST optical readings.'),
            ('WARNING', 'OMZ Layer Shoaling', 'Oxygen Minimum Zone shoaling to {depth}m depth — marine habitat alert.')
        ]
    }
}

def seed_alerts(num_alerts: int = 200):
    engine = get_db_engine()
    print("[Reseed] Connecting to PostgreSQL database...")

    with engine.begin() as conn:
        print("[Reseed] Clearing old static alert table data...")
        conn.execute(text("DELETE FROM alerts;"))

        region_keys = list(REGIONS_META.keys())
        now = datetime.now()

        inserted_count = 0

        for i in range(1, num_alerts + 1):
            region_id = region_keys[i % len(region_keys)]
            meta = REGIONS_META[region_id]
            
            # Select random template
            sev, alert_type, desc_tmpl = random.choice(meta['templates'])
            
            # Realistic coordinates within region bounds
            lat = round(random.uniform(meta['lat_min'], meta['lat_max']), 4)
            lon = round(random.uniform(meta['lon_min'], meta['lon_max']), 4)

            # Generate dynamic numbers for description
            desc = desc_tmpl.format(
                bias=round(random.uniform(1.2, 3.5), 1),
                rel=round(random.uniform(45.0, 68.0), 1),
                spd=round(random.uniform(1.2, 2.4), 1),
                depth=random.randint(25, 60),
                sal=round(random.uniform(1.1, 2.3), 1),
                sst=round(random.uniform(29.2, 31.5), 1),
                count=random.randint(2, 5),
                sec=random.randint(12, 88)
            )

            # Timestamps spread over the last 7 days
            hours_ago = random.uniform(0.1, 168.0)
            ts = (now - timedelta(hours=hours_ago)).strftime("%Y-%m-%d %H:%M:%S")
            alert_id = f"ALT_{now.year}_{i:04d}"

            query = text("""
                INSERT INTO alerts (alert_id, region_id, severity, alert_type, latitude, longitude, timestamp, description)
                VALUES (:alert_id, :region_id, :severity, :alert_type, :latitude, :longitude, :timestamp, :description);
            """)

            conn.execute(query, {
                "alert_id": alert_id,
                "region_id": region_id,
                "severity": sev,
                "alert_type": alert_type,
                "latitude": lat,
                "longitude": lon,
                "timestamp": ts,
                "description": desc
            })
            inserted_count += 1

        print(f"[Reseed] SUCCESS! Inserted {inserted_count} rich alerts evenly across all 7 regions.")

if __name__ == "__main__":
    seed_alerts(200)
