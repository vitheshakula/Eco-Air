// components/MapUpdater.tsx
import { useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';

type Props = {
  center: [number, number];
  zoom: number;
  bounds?: [number, number][];
}

const MapUpdater = ({ center, zoom, bounds }: Props) => {
  const map = useMap();

  // This effect runs when 'center' or 'zoom' changes
  useEffect(() => {
    if (bounds && bounds.length >= 2) {
      map.fitBounds(L.latLngBounds(bounds), { padding: [44, 44], maxZoom: 7 });
      return;
    }

    map.setView(center, zoom);
  }, [bounds, center, zoom, map]);

  return null;
}

export default MapUpdater;
