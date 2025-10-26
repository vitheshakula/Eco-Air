import React, { useMemo } from 'react';
import haversine from 'haversine-distance';

type Props = {
  origin?: { lat: number; lon: number } | null;
  destination?: { lat: number; lon: number } | null;
  aircraftType?: string | null;
  passengerLoadFactor?: number; // 0..1
};

export default function EmissionCalculator({ origin, destination, aircraftType, passengerLoadFactor = 0.8 }: Props) {
  const result = useMemo(() => {
    if (!origin || !destination) return null;
    const a = { latitude: origin.lat, longitude: origin.lon };
    const b = { latitude: destination.lat, longitude: destination.lon };
    const meters = haversine(a, b);
    const km = Math.max(1, meters / 1000);

    // coarse defaults (kg CO2 per passenger-km) by aircraft class
    const factorByType: Record<string, number> = {
      narrowbody: 0.09, // kg CO2/pax-km
      widebody: 0.11,
      regional: 0.12,
      default: 0.10,
    };
    // simple detection by string
    const typ = (aircraftType || '').toLowerCase();
    const factor =
      typ.includes('a320') || typ.includes('737') ? factorByType.narrowbody :
      typ.includes('777') || typ.includes('787') || typ.includes('a330') ? factorByType.widebody :
      typ.includes('e') || typ.includes('embraer') ? factorByType.regional :
      factorByType.default;

    const totalKgCO2 = km * factor * (1); // per passenger
    const perPassenger = totalKgCO2 / Math.max(1, passengerLoadFactor); // adjust for load factor
    return { km: Math.round(km), factor, totalKgCO2: Number(totalKgCO2.toFixed(2)), perPassenger: Number(perPassenger.toFixed(2)) };
  }, [origin, destination, aircraftType, passengerLoadFactor]);

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold">Emission Calculator</h2>
      {!result && <p className="text-sm text-slate-500">Provide origin & destination coordinates to compute emissions.</p>}
      {result && (
        <div className="mt-2 text-sm space-y-1">
          <div>Distance: <strong>{result.km} km</strong></div>
          <div>CO₂ factor: <strong>{(result.factor * 1000).toFixed(1)} g CO₂/pax·km</strong></div>
          <div>Estimated CO₂ (per pax): <strong>{result.perPassenger} kg</strong></div>
          <div>Estimated total CO₂ (per pax*km factor): <strong>{result.totalKgCO2} kg</strong></div>
        </div>
      )}
    </div>
  );
}
