import React, { useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import ClientOnly from './ClientOnly';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MapUpdater from './MapUpdater'; // 1. Import the new component

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
  
  // This hook runs *only* on the client-side after mount
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default.src,
      iconUrl: require('leaflet/dist/images/marker-icon.png').default.src,
      shadowUrl: require('leaflet/dist/images/marker-shadow.png').default.src,
    });
  }, []); // Empty array ensures it runs only once

  const center = useMemo(() => {
    if (live) return [live.lat, live.lon] as [number, number];
    if (origin) return [origin.lat, origin.lon] as [number, number];
    if (destination) return [destination.lat, destination.lon] as [number, number];
    return [51.505, -0.09];
  }, [origin, destination, live]);

  // 2. Define the zoom level
  const zoom = 5;

  const routeColor = emissionsPerKm > 0.11 ? 'red' : emissionsPerKm > 0.095 ? 'orange' : 'green';

  const positions = useMemo(() => {
    const arr: [number, number][] = [];
    if (origin) arr.push([origin.lat, origin.lon]);
    if (live) arr.push([live.lat, live.lon]);
    if (destination) arr.push([destination.lat, destination.lon]);
    return arr;
  }, [origin, destination, live]);

  return (
    <div className="bg-white rounded shadow p-2">
      <h2 className="text-lg font-semibold px-2">Flight Map</h2>
      <div className="p-2">
        <ClientOnly>
          {/* 3. Pass zoom to MapContainer */}
          <MapContainer center={center} zoom={zoom} scrollWheelZoom style={{ height: 400, width: '100%' }}>
            
            {/* 4. Add the MapUpdater component here */}
            <MapUpdater center={center} zoom={zoom} />
            
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {positions.length >= 2 && (
              <>
                <Polyline positions={positions} color={routeColor} weight={4} />
                <Marker position={positions[0]}>
                  <Tooltip direction="top">Origin</Tooltip>
                </Marker>
                <Marker position={positions[positions.length - 1]}>
                  <Tooltip direction="top">Destination</Tooltip>
                </Marker>
              </>
            )}
            {live && (
              <Marker position={[live.lat, live.lon]}>
                <Tooltip direction="top">Live Position</Tooltip>
              </Marker>
            )}
          </MapContainer>
        </ClientOnly>
      </div>
    </div>
  );
}