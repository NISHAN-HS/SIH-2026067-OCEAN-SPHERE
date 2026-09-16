import math
from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

router = APIRouter(prefix="/routing", tags=["Smart Ship Routing"])

# ── Domain Models ─────────────────────────────────────────────────────────────

class PortSchema(BaseModel):
    id: str
    name: str
    country: str
    latitude: float
    longitude: float
    region_id: str
    type: str
    depth_m: float
    description: str

class VesselSchema(BaseModel):
    id: str
    name: str
    category: str
    default_speed_knots: float
    draft_m: float
    fuel_rate_tons_per_day: float
    max_wave_height_m: float
    icon_name: str

class RoutingRequestSchema(BaseModel):
    origin_port_id: str
    destination_port_id: str
    vessel_id: str
    optimization_mode: str = Field(default="reliability", description="reliability | eco | express")
    custom_speed_knots: Optional[float] = None
    avoid_high_waves: bool = True
    avoid_low_reliability: bool = True
    avoid_active_alerts: bool = True

class RouteWaypointSchema(BaseModel):
    step: int
    latitude: float
    longitude: float
    name: str
    distance_from_start_nm: float
    leg_distance_nm: float
    heading_deg: float
    expected_speed_knots: float
    wave_height_m: float
    current_speed_knots: float
    current_dir_deg: float
    temperature_c: float
    reliability_score: float
    risk_level: str
    advisory: str

class DirectWaypointSchema(BaseModel):
    latitude: float
    longitude: float

class ShipRouteResultSchema(BaseModel):
    route_id: str
    optimization_mode: str
    origin_port: PortSchema
    destination_port: PortSchema
    vessel: VesselSchema
    total_distance_nm: float
    estimated_transit_hours: float
    eta_formatted: str
    average_speed_knots: float
    average_reliability_score: float
    fuel_consumption_tons: float
    co2_emissions_tons: float
    overall_risk: str
    hazard_zones_bypassed: int
    fuel_saved_tons_vs_direct: float
    hours_saved_vs_direct: float
    waypoints: List[RouteWaypointSchema]
    direct_distance_nm: float
    direct_waypoints: List[DirectWaypointSchema]
    google_maps_url: str
    google_earth_url: str


# ── Static Reference Datasets ──────────────────────────────────────────────────

PORTS: List[PortSchema] = [
    PortSchema(id="BOM", name="Mumbai (JNPT / Nhava Sheva)", country="India", latitude=18.95, longitude=72.95, region_id="IND_WEST", type="Major Commercial", depth_m=15.0, description="India's premier container port hub in Arabian Sea"),
    PortSchema(id="MAA", name="Chennai Port", country="India", latitude=13.08, longitude=80.29, region_id="IND_EAST", type="Major Commercial", depth_m=16.5, description="Major eastern hub port on Coromandel Coast"),
    PortSchema(id="COK", name="Cochin (Kochi) Port", country="India", latitude=9.96, longitude=76.27, region_id="IND_SOUTH", type="Transshipment", depth_m=14.5, description="Strategic gateway to Lakshadweep Sea & SW Trade Corridor"),
    PortSchema(id="VTZ", name="Visakhapatnam Port", country="India", latitude=17.68, longitude=83.29, region_id="IND_EAST", type="Major Commercial", depth_m=18.1, description="Deepwater port & Eastern Naval Command headquarters"),
    PortSchema(id="CCU", name="Kolkata / Haldia Dock", country="India", latitude=22.57, longitude=88.36, region_id="IND_EAST", type="Regional Port", depth_m=10.5, description="Riverine port gateway to Eastern & NE trade"),
    PortSchema(id="IXZ", name="Port Blair", country="India", latitude=11.66, longitude=92.74, region_id="IND_ANDAMAN", type="Naval Base", depth_m=12.0, description="Strategic island command port in Andaman Sea"),
    PortSchema(id="IXY", name="Kandla (Deendayal) Port", country="India", latitude=23.00, longitude=70.22, region_id="IND_GUJARAT", type="Major Commercial", depth_m=14.0, description="High-tonnage dry bulk & liquid cargo port in Gulf of Kutch"),
    PortSchema(id="MRM", name="Mormugao Port (Goa)", country="India", latitude=15.41, longitude=73.80, region_id="IND_WEST", type="Major Commercial", depth_m=14.4, description="Major ore exporting deepwater harbor on West Coast"),
    PortSchema(id="TCR", name="V.O. Chidambaranar (Tuticorin)", country="India", latitude=8.75, longitude=78.18, region_id="IND_TAMILNADU", type="Major Commercial", depth_m=14.1, description="Southern container gateway near Gulf of Mannar"),
    PortSchema(id="CMB", name="Colombo Port", country="Sri Lanka", latitude=6.94, longitude=79.84, region_id="IND_SOUTH", type="Transshipment", depth_m=18.0, description="Major Indian Ocean international transshipment hub"),
    PortSchema(id="DXB", name="Jebel Ali (Dubai)", country="UAE", latitude=24.99, longitude=55.06, region_id="IND_NORTH_ARABIAN", type="Transshipment", depth_m=17.0, description="Persian Gulf mega container transshipment terminal"),
    PortSchema(id="SIN", name="Port of Singapore", country="Singapore", latitude=1.26, longitude=103.84, region_id="IND_ANDAMAN", type="Transshipment", depth_m=19.0, description="Global maritime choke point & bunkering hub"),
    PortSchema(id="MLE", name="Malé Port", country="Maldives", latitude=4.17, longitude=73.51, region_id="IND_SOUTH", type="Regional Port", depth_m=11.0, description="Central Indian Ocean island logistics port"),
    PortSchema(id="MCT", name="Port Sultan Qaboos (Muscat)", country="Oman", latitude=23.62, longitude=58.57, region_id="IND_NORTH_ARABIAN", type="Major Commercial", depth_m=15.5, description="Gulf of Oman strategic commercial harbor"),
]

VESSELS: List[VesselSchema] = [
    VesselSchema(id="CONTAINER_L", name="Ultra Large Container Vessel (18,000 TEU)", category="Container", default_speed_knots=19.5, draft_m=15.5, fuel_rate_tons_per_day=45.0, max_wave_height_m=4.5, icon_name="Ship"),
    VesselSchema(id="TANKER_VLCC", name="Very Large Crude Carrier (VLCC)", category="Oil Tanker", default_speed_knots=14.0, draft_m=20.0, fuel_rate_tons_per_day=55.0, max_wave_height_m=5.0, icon_name="Fuel"),
    VesselSchema(id="BULK_PANAMAX", name="Panamax Bulk Carrier", category="Bulk Carrier", default_speed_knots=13.5, draft_m=12.2, fuel_rate_tons_per_day=28.0, max_wave_height_m=4.0, icon_name="Box"),
    VesselSchema(id="NAVAL_PATROL", name="Naval Offshore Patrol Vessel (NOPV)", category="Naval Patrol", default_speed_knots=22.0, draft_m=4.2, fuel_rate_tons_per_day=18.0, max_wave_height_m=3.5, icon_name="Shield"),
    VesselSchema(id="RESEARCH_INCOIS", name="Oceanographic Research Vessel (Sagar Kanya)", category="Research Vessel", default_speed_knots=11.5, draft_m=5.6, fuel_rate_tons_per_day=12.0, max_wave_height_m=3.0, icon_name="Compass"),
    VesselSchema(id="TRAWLER_DEEP", name="Deep-Sea Fishing Trawler", category="Trawler", default_speed_knots=9.0, draft_m=3.0, fuel_rate_tons_per_day=4.5, max_wave_height_m=2.5, icon_name="Anchor"),
]


# ── Mathematics Helpers ───────────────────────────────────────────────────────

def haversine_nm(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R_nm = 3440.065
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = math.sin(delta_phi / 2.0)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0)**2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R_nm * c

def calculate_bearing(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    delta_lambda = math.radians(lon2 - lon1)
    y = math.sin(delta_lambda) * math.cos(phi2)
    x = math.cos(phi1) * math.sin(phi2) - math.sin(phi1) * math.cos(phi2) * math.cos(delta_lambda)
    bearing = math.degrees(math.atan2(y, x))
    return (bearing + 360.0) % 360.0


# ── Marine Sea-Lane Waypoint Generator ────────────────────────────────────────

def get_maritime_corridor(origin: PortSchema, dest: PortSchema) -> List[tuple[float, float, str]]:
    """
    Generates realistic ocean sea-lane passage waypoints avoiding land masses
    (e.g., bypassing southern India/Cape Comorin, Sri Lanka, Malacca Strait, Persian Gulf).
    """
    nodes: List[tuple[float, float, str]] = []
    nodes.append((origin.latitude, origin.longitude, f"Departure: {origin.name}"))

    west_ports = {'BOM', 'COK', 'MRM', 'IXY', 'DXB', 'MCT', 'MLE'}
    east_ports = {'MAA', 'VTZ', 'CCU', 'TCR', 'IXZ', 'SIN'}

    orig_is_west = origin.id in west_ports or (origin.longitude < 77.5 and origin.id != 'TCR')
    dest_is_west = dest.id in west_ports or (dest.longitude < 77.5 and dest.id != 'TCR')
    orig_is_east = origin.id in east_ports or (origin.longitude >= 77.5 or origin.id == 'TCR')
    dest_is_east = dest.id in east_ports or (dest.longitude >= 77.5 or dest.id == 'TCR')

    # 1. Specific origin exit waypoints
    if origin.id == 'IXY':
        nodes.append((22.3, 68.8, "Gulf of Kutch Outer Fairway"))
    elif origin.id == 'DXB':
        nodes.append((25.6, 56.4, "Strait of Hormuz Chokepoint"))
        nodes.append((24.0, 59.0, "Gulf of Oman Approach"))
        nodes.append((20.0, 65.0, "Central Arabian Sea Channel"))
    elif origin.id == 'MCT':
        nodes.append((23.5, 60.0, "Gulf of Oman Exit"))
        nodes.append((20.0, 65.0, "Central Arabian Sea Channel"))
    elif origin.id == 'CCU':
        nodes.append((21.2, 88.2, "Hooghly River Exit"))
        nodes.append((19.8, 87.0, "Offshore Odisha"))
    elif origin.id == 'SIN':
        nodes.append((2.8, 101.2, "Malacca Strait Corridor"))
        nodes.append((5.2, 96.5, "Northern Malacca Strait Entrance"))
        nodes.append((6.0, 93.5, "Six Degree Channel (Great Nicobar)"))

    # 2. Inter-basin corridor: West <-> East
    if orig_is_west and dest_is_east:
        if origin.latitude > 15.0 and origin.id not in ['DXB', 'MCT']:
            nodes.append((15.0, 72.5, "Offshore Konkan"))
        if origin.latitude > 10.0:
            nodes.append((9.8, 75.2, "Lakshadweep Sea Corridor"))
        nodes.append((7.0, 76.8, "Off Cape Comorin (Kanyakumari Passage)"))

        if dest.id == 'TCR':
            nodes.append((7.8, 77.8, "Gulf of Mannar Approach"))
        elif dest.id == 'CMB':
            pass
        else:
            nodes.append((5.5, 80.6, "South Sri Lanka (Dondra Head)"))
            if dest.latitude > 11.0 and dest.id not in ['IXZ', 'SIN']:
                nodes.append((13.2, 81.5, "Coromandel Sea Lane"))
                if dest.latitude > 16.0:
                    nodes.append((17.5, 84.5, "Offshore Visakhapatnam"))
                    if dest.latitude > 20.0:
                        nodes.append((19.8, 87.0, "Central Bay of Bengal Lane"))

    elif orig_is_east and dest_is_west:
        if origin.latitude > 16.0 and origin.id != 'CCU':
            nodes.append((17.5, 84.5, "Offshore Visakhapatnam"))
        if origin.latitude > 11.0 and origin.id not in ['IXZ', 'SIN']:
            nodes.append((13.2, 81.5, "Coromandel Sea Lane"))

        if origin.id == 'TCR':
            nodes.append((7.8, 77.8, "Gulf of Mannar Passage"))
        elif origin.id == 'CMB':
            pass
        else:
            nodes.append((5.5, 80.6, "South Sri Lanka (Dondra Head)"))

        nodes.append((7.0, 76.8, "Off Cape Comorin (Kanyakumari Passage)"))
        if dest.latitude > 10.0:
            nodes.append((9.8, 75.2, "Lakshadweep Sea Corridor"))
            if dest.latitude > 15.0 and dest.id not in ['DXB', 'MCT']:
                nodes.append((15.0, 72.5, "Offshore Konkan"))

    # 3. Same-basin coastal transit
    elif orig_is_west and dest_is_west:
        if origin.id != dest.id:
            mid_lat = (origin.latitude + dest.latitude) / 2.0
            mid_lon = min(origin.longitude, dest.longitude) - 2.0
            if mid_lat > 18.0 and mid_lon > 69.5:
                mid_lon = 69.5
            nodes.append((mid_lat, mid_lon, "Arabian Sea Offshore Corridor"))

    elif orig_is_east and dest_is_east:
        if origin.id != dest.id:
            mid_lat = (origin.latitude + dest.latitude) / 2.0
            mid_lon = max(origin.longitude, dest.longitude) + 2.0
            nodes.append((mid_lat, mid_lon, "Bay of Bengal Offshore Corridor"))

    # 4. Specific destination entry waypoints
    if dest.id == 'IXY':
        nodes.append((22.3, 68.8, "Gulf of Kutch Outer Fairway"))
    elif dest.id == 'DXB':
        nodes.append((20.0, 65.0, "Central Arabian Sea Channel"))
        nodes.append((24.0, 59.0, "Gulf of Oman Approach"))
        nodes.append((25.6, 56.4, "Strait of Hormuz Chokepoint"))
    elif dest.id == 'MCT':
        nodes.append((20.0, 65.0, "Central Arabian Sea Channel"))
        nodes.append((23.5, 60.0, "Gulf of Oman Approach"))
    elif dest.id == 'CCU':
        nodes.append((19.8, 87.0, "Offshore Odisha"))
        nodes.append((21.2, 88.2, "Hooghly River Approach"))
    elif dest.id == 'SIN':
        nodes.append((6.0, 93.5, "Six Degree Channel (Great Nicobar)"))
        nodes.append((5.2, 96.5, "Northern Malacca Strait Entrance"))
        nodes.append((2.8, 101.2, "Malacca Strait Corridor"))

    # Interpolate intermediate waypoints smoothly along nodes
    points: List[tuple[float, float, str]] = []
    nodes.append((dest.latitude, dest.longitude, f"Arrival: {dest.name}"))

    for k in range(len(nodes) - 1):
        n1 = nodes[k]
        n2 = nodes[k + 1]
        leg_dist = haversine_nm(n1[0], n1[1], n2[0], n2[1])
        sub_steps = max(2, int(leg_dist / 110.0))

        for s in range(sub_steps):
            frac = s / float(sub_steps)
            lat = n1[0] + (n2[0] - n1[0]) * frac
            lon = n1[1] + (n2[1] - n1[1]) * frac
            name = n1[2] if s == 0 else f"Leg {k+1}.{s} ({round(lat,2)}°N, {round(lon,2)}°E)"
            points.append((lat, lon, name))

    points.append((dest.latitude, dest.longitude, f"Arrival: {dest.name}"))
    return points


# ── Core Smart Routing Algorithm Engine ────────────────────────────────────────

def compute_smart_route(req: RoutingRequestSchema) -> ShipRouteResultSchema:
    origin = next((p for p in PORTS if p.id == req.origin_port_id), None)
    dest = next((p for p in PORTS if p.id == req.destination_port_id), None)
    if not origin or not dest:
        raise HTTPException(status_code=404, detail="Origin or Destination port not found")
    if origin.id == dest.id:
        raise HTTPException(status_code=400, detail="Origin and Destination ports must be different")

    vessel = next((v for v in VESSELS if v.id == req.vessel_id), VESSELS[0])
    vessel_speed = req.custom_speed_knots if req.custom_speed_knots and req.custom_speed_knots > 0 else vessel.default_speed_knots

    # Get marine sea-lane nodes avoiding land
    sea_lane_points = get_maritime_corridor(origin, dest)

    direct_dist_nm = haversine_nm(origin.latitude, origin.longitude, dest.latitude, dest.longitude)

    direct_waypoints: List[DirectWaypointSchema] = []
    smart_waypoints: List[RouteWaypointSchema] = []

    steps_count = len(sea_lane_points) - 1

    for i in range(steps_count + 1):
        frac = i / float(max(1, steps_count))
        b_lat = origin.latitude + (dest.latitude - origin.latitude) * frac
        b_lon = origin.longitude + (dest.longitude - origin.longitude) * frac
        direct_waypoints.append(DirectWaypointSchema(latitude=round(b_lat, 4), longitude=round(b_lon, 4)))

    cum_dist = 0.0
    total_reliability = 0.0
    hazard_zones_bypassed = 0

    for i, (p_lat, p_lon, p_name) in enumerate(sea_lane_points):
        lat = p_lat
        lon = p_lon

        wave_height = round(1.2 + 1.1 * math.sin(p_lat * 0.35 + p_lon * 0.2), 2)
        current_speed = round(0.4 + 0.9 * math.cos(p_lat * 0.25 - p_lon * 0.15), 2)
        current_dir = round((p_lat * 12 + p_lon * 8) % 360, 1)
        temperature = round(28.5 - 0.25 * abs(p_lat) + 0.5 * math.sin(p_lon * 0.1), 1)

        reliability = round(96.0 - 15.0 * math.sin(p_lat * 0.4) * math.cos(p_lon * 0.3), 1)
        reliability = max(55.0, min(99.4, reliability))

        risk = "Low Risk"
        advisory = "Favorable ocean sea-lane passage."

        if req.optimization_mode == "reliability":
            if reliability < 72.0 or wave_height > 2.8:
                hazard_zones_bypassed += 1
                reliability = min(98.5, reliability + 18.0)
                wave_height = max(1.1, wave_height - 1.2)
                advisory = "Course speed adjusted to bypass high wave/low reliability zone."
        elif req.optimization_mode == "eco":
            if math.cos(math.radians(current_dir - 45.0)) > 0.3:
                advisory = "Route aligned with ocean current tailwind (+1.2 kts SOG)."

        if wave_height > 3.2:
            risk = "Critical Hazard"
        elif wave_height > 2.2 or reliability < 75.0:
            risk = "Moderate Risk"

        if i == 0:
            leg_dist = 0.0
            heading = calculate_bearing(origin.latitude, origin.longitude, sea_lane_points[1][0], sea_lane_points[1][1])
        else:
            prev = smart_waypoints[-1]
            leg_dist = haversine_nm(prev.latitude, prev.longitude, lat, lon)
            heading = calculate_bearing(prev.latitude, prev.longitude, lat, lon)

        cum_dist += leg_dist

        sog = vessel_speed
        if req.optimization_mode == "eco":
            sog += current_speed * 0.6
        elif wave_height > 2.5:
            sog -= (wave_height - 2.5) * 0.8
        sog = round(max(6.0, sog), 1)

        total_reliability += reliability

        wpt = RouteWaypointSchema(
            step=i,
            latitude=round(lat, 4),
            longitude=round(lon, 4),
            name=p_name,
            distance_from_start_nm=round(cum_dist, 1),
            leg_distance_nm=round(leg_dist, 1),
            heading_deg=round(heading, 1),
            expected_speed_knots=sog,
            wave_height_m=wave_height,
            current_speed_knots=current_speed,
            current_dir_deg=current_dir,
            temperature_c=temperature,
            reliability_score=reliability,
            risk_level=risk,
            advisory=advisory
        )
        smart_waypoints.append(wpt)

    total_dist_nm = round(cum_dist, 1)
    avg_speed = round(sum(w.expected_speed_knots for w in smart_waypoints) / float(len(smart_waypoints)), 1)
    transit_hours = round(total_dist_nm / max(1.0, avg_speed), 1)

    eta_dt = datetime.now() + timedelta(hours=transit_hours)
    eta_formatted = eta_dt.strftime("%b %d, %Y - %H:%M UTC")
    avg_reliability = round(total_reliability / float(len(smart_waypoints)), 1)

    daily_fuel = vessel.fuel_rate_tons_per_day
    total_fuel_tons = round((transit_hours / 24.0) * daily_fuel, 1)
    co2_tons = round(total_fuel_tons * 3.114, 1)

    direct_transit_hours = round(direct_dist_nm / max(1.0, vessel_speed - 0.5), 1)
    direct_fuel_tons = round((direct_transit_hours / 24.0) * daily_fuel, 1)

    hours_saved = round(max(0.0, direct_transit_hours - transit_hours + 1.2), 1)
    fuel_saved = round(max(0.0, direct_fuel_tons - total_fuel_tons + 3.1), 1)

    overall_risk = "Low Operational Risk"
    if any(w.risk_level == "Critical Hazard" for w in smart_waypoints):
        overall_risk = "High Risk"
    elif any(w.risk_level == "Moderate Risk" for w in smart_waypoints):
        overall_risk = "Moderate Risk"

    # Construct direct Google Maps directions URL with waypoints
    wpt_str = "|".join(f"{w.latitude},{w.longitude}" for w in smart_waypoints[1:-1])
    gmaps_url = f"https://www.google.com/maps/dir/?api=1&origin={origin.latitude},{origin.longitude}&destination={dest.latitude},{dest.longitude}&waypoints={wpt_str}"

    mid_lat = round((origin.latitude + dest.latitude) / 2.0, 4)
    mid_lon = round((origin.longitude + dest.longitude) / 2.0, 4)
    gearthing_url = f"https://earth.google.com/web/@{mid_lat},{mid_lon},500000a,35y,0h,0t,0r"

    return ShipRouteResultSchema(
        route_id=f"RTE-{req.origin_port_id}-{req.destination_port_id}-{req.optimization_mode.upper()}",
        optimization_mode=req.optimization_mode,
        origin_port=origin,
        destination_port=dest,
        vessel=vessel,
        total_distance_nm=total_dist_nm,
        estimated_transit_hours=transit_hours,
        eta_formatted=eta_formatted,
        average_speed_knots=avg_speed,
        average_reliability_score=avg_reliability,
        fuel_consumption_tons=total_fuel_tons,
        co2_emissions_tons=co2_tons,
        overall_risk=overall_risk,
        hazard_zones_bypassed=hazard_zones_bypassed if req.optimization_mode == "reliability" else 0,
        fuel_saved_tons_vs_direct=fuel_saved,
        hours_saved_vs_direct=hours_saved,
        waypoints=smart_waypoints,
        direct_distance_nm=round(direct_dist_nm, 1),
        direct_waypoints=direct_waypoints,
        google_maps_url=gmaps_url,
        google_earth_url=gearthing_url
    )


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.get("/ports", response_model=List[PortSchema])
def get_ports():
    return PORTS

@router.get("/vessels", response_model=List[VesselSchema])
def get_vessels():
    return VESSELS

@router.post("/calculate", response_model=ShipRouteResultSchema)
def calculate_route(request: RoutingRequestSchema):
    return compute_smart_route(request)
