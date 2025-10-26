// components/MapUpdater.tsx
import { useMap } from 'react-leaflet';
import { useEffect } from 'react';

type Props = {
  center: [number, number];
  zoom: number;
}

const MapUpdater = ({ center, zoom }: Props) => {
  const map = useMap();

  // This effect runs when 'center' or 'zoom' changes
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return null;
}

export default MapUpdater;