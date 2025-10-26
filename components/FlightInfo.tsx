import React from 'react';

type Props = {
  flightNumber?: string;
  info?: any;
  position?: any;
  loading?: boolean;
  error?: string | null;
};

export default function FlightInfo({ flightNumber, info, position, loading, error }: Props) {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold">Flight Info {flightNumber ? ` — ${flightNumber}` : ''}</h2>
      {loading && <p className="text-sm text-slate-500">Loading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && !error && !info && <p className="text-sm text-slate-500">No data. Enter a flight number.</p>}
      {info && (
        <div className="mt-2 text-sm space-y-1">
          <div>Callsign: <strong>{info.callsign || '-'}</strong></div>
          <div>Aircraft: <strong>{info.aircraft || '-'}</strong></div>
          <div>Origin: <strong>{info.origin || '-'}</strong> → Destination: <strong>{info.destination || '-'}</strong></div>
          <div>Departure (scheduled): <strong>{info.departureTime || '-'}</strong></div>
          <div>Arrival (scheduled): <strong>{info.arrivalTime || '-'}</strong></div>
          <div>Status: <strong>{info.status || '-'}</strong></div>
        </div>
      )}
      {position && (
        <div className="mt-3 text-sm">
          <h3 className="font-medium">Live Position</h3>
          <div>Lat: {position.lat.toFixed(4)}, Lon: {position.lon.toFixed(4)}</div>
          <div>Altitude: {position.altitude ? `${Math.round(position.altitude)} m` : '—'}</div>
          <div>Speed: {position.speed ? `${Math.round(position.speed)} m/s` : '—'}</div>
        </div>
      )}
    </div>
  );
}
