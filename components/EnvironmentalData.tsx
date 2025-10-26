import React from 'react';

type Props = {
  weather?: any;
  loading?: boolean;
  error?: string | null;
};

export default function EnvironmentalData({ weather, loading, error }: Props) {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold">Environmental Data</h2>
      {loading && <p className="text-sm text-slate-500">Loading weather...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!weather && !loading && <p className="text-sm text-slate-500">No weather data available.</p>}
      {weather && (
        <div className="mt-2 text-sm space-y-1">
          <div>Temperature: <strong>{weather.temp} °C</strong></div>
          <div>Humidity: <strong>{weather.humidity}%</strong></div>
          <div>Wind Speed: <strong>{weather.windSpeed} m/s</strong></div>
          <div>Conditions: <strong className="capitalize">{weather.description}</strong></div>
        </div>
      )}
    </div>
  );
}
