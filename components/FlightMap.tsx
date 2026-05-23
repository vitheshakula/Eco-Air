import React, { useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import ClientOnly from './ClientOnly';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MapUpdater from './MapUpdater';

// --- Dynamic Imports ---
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Polyline = dynamic(
  () => import('react-leaflet').then((mod) => mod.Polyline),
  { ssr: false }
);
const Tooltip = dynamic(
  () => import('react-leaflet').then((mod) => mod.Tooltip),
  { ssr: false }
);

// --- Types ---
type LatLon = { lat: number; lon: number };
type Props = {
  origin?: LatLon | null;
  destination?: LatLon | null;
  live?: LatLon | null;
  emissionsPerKm?: number;
};

// --- Component ---
export default function FlightMap({ origin, destination, live, emissionsPerKm = 0.1 }: Props) {
  const markerIcon = useMemo(() => {
    return L.divIcon({
      className: "stratos-route-marker",
      html: '<span class="stratos-route-marker-core"></span>',
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });
  }, []);

  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default.src,
      iconUrl: require('leaflet/dist/images/marker-icon.png').default.src,
      shadowUrl: require('leaflet/dist/images/marker-shadow.png').default.src,
    });
  }, []);

  const routePositions = useMemo(() => {
    if (!origin || !destination) return [];
    return getGreatCirclePositions(origin, destination, 48);
  }, [origin, destination, live]);

  const center = useMemo(() => {
    if (routePositions.length) {
      const mid = routePositions[Math.floor(routePositions.length / 2)];
      return mid as [number, number];
    }
    if (live) return [live.lat, live.lon] as [number, number];
    if (origin) return [origin.lat, origin.lon] as [number, number];
    if (destination) return [destination.lat, destination.lon] as [number, number];
    return [22.9734, 78.6569] as [number, number];
  }, [origin, destination, live, routePositions]);

  const zoom = routePositions.length ? 5 : 4;

  const routeColor = emissionsPerKm > 0.11 ? '#FCA5A5' : emissionsPerKm > 0.095 ? '#FCD34D' : '#67E8F9';

  const markerPositions = useMemo(() => {
    const arr: [number, number][] = [];
    if (origin) arr.push([origin.lat, origin.lon]);
    if (live) arr.push([live.lat, live.lon]);
    if (destination) arr.push([destination.lat, destination.lon]);
    return arr;
  }, [origin, destination, live]);

  return (
    <div className="overflow-hidden rounded-2xl border border-cyan-400/10 bg-slate-950/70 shadow-[0_24px_80px_rgba(0,0,0,0.32)]">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">Route Map</h2>
          <p className="mt-1 text-xs text-slate-500">Coordinate-based corridor view</p>
        </div>
        <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
          Route intelligence
        </div>
      </div>
      <div className="p-3">
        <ClientOnly>
          <MapContainer
            center={center}
            zoom={zoom}
            scrollWheelZoom
            attributionControl={false}
            zoomControl={false}
            className="stratos-map"
            style={{ height: 340, width: '100%', borderRadius: 14 }}
          >
            
            <MapUpdater center={center} zoom={zoom} bounds={routePositions.length ? routePositions : markerPositions} />
            
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            {routePositions.length >= 2 && (
              <>
                <Polyline positions={routePositions} color="#E0F2FE" weight={8} opacity={0.12} />
                <Polyline positions={routePositions} color={routeColor} weight={3} opacity={0.76} />
                <Marker position={routePositions[0]} icon={markerIcon}>
                  <Tooltip direction="top">Origin</Tooltip>
                </Marker>
                <Marker position={routePositions[routePositions.length - 1]} icon={markerIcon}>
                  <Tooltip direction="top">Destination</Tooltip>
                </Marker>
              </>
            )}
            {live && (
              <Marker position={[live.lat, live.lon]} icon={markerIcon}>
                <Tooltip direction="top">Route position</Tooltip>
              </Marker>
            )}
          </MapContainer>
        </ClientOnly>
      </div>
    </div>
  );
}

function getGreatCirclePositions(origin: LatLon, destination: LatLon, segments: number): [number, number][] {
  const startLat = toRad(origin.lat);
  const startLon = toRad(origin.lon);
  const endLat = toRad(destination.lat);
  const endLon = toRad(destination.lon);

  const angle = 2 * Math.asin(Math.sqrt(
    Math.sin((endLat - startLat) / 2) ** 2 +
      Math.cos(startLat) * Math.cos(endLat) * Math.sin((endLon - startLon) / 2) ** 2,
  ));

  if (!Number.isFinite(angle) || angle === 0) {
    return [[origin.lat, origin.lon], [destination.lat, destination.lon]];
  }

  const points: [number, number][] = [];
  for (let i = 0; i <= segments; i++) {
    const fraction = i / segments;
    const a = Math.sin((1 - fraction) * angle) / Math.sin(angle);
    const b = Math.sin(fraction * angle) / Math.sin(angle);
    const x = a * Math.cos(startLat) * Math.cos(startLon) + b * Math.cos(endLat) * Math.cos(endLon);
    const y = a * Math.cos(startLat) * Math.sin(startLon) + b * Math.cos(endLat) * Math.sin(endLon);
    const z = a * Math.sin(startLat) + b * Math.sin(endLat);
    const lat = Math.atan2(z, Math.sqrt(x * x + y * y));
    const lon = Math.atan2(y, x);
    points.push([toDeg(lat), toDeg(lon)]);
  }

  return points;
}

function toRad(value: number) {
  return (value * Math.PI) / 180;
}

function toDeg(value: number) {
  return (value * 180) / Math.PI;
}
