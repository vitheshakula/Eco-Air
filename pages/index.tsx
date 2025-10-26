import React, { useState } from 'react';
import Head from 'next/head';
import FlightInfo from '../components/FlightInfo';
import EnvironmentalData from '../components/EnvironmentalData';
import EmissionCalculator from '../components/EmissionCalculator';
// import FlightMap from '../components/FlightMap'; // <-- 1. DELETE THIS LINE
import { useFlightData } from '../hooks/useFlightData';
import { useWeather } from '../hooks/useWeather';
import dynamic from 'next/dynamic'; // <-- 2. ADD THIS LINE

// 3. ADD THIS DYNAMIC IMPORT
const FlightMap = dynamic(
  () => import('../components/FlightMap'),
  { 
    ssr: false, // This is the crucial part
    loading: () => <div className="p-4 bg-white rounded shadow" style={{height: '400px'}}><p>Loading map...</p></div>
  }
);


export default function Home() {
  const [flight, setFlight] = useState('');
  const { info, position, loading, error } = useFlightData(flight || undefined);

  // For the map/emission calculator we need origin/destination coordinates.
  // For demo, allow user to type origin/destination lat/lon as fallbacks (not implemented UI for manual coords to keep concise).
  // If live position exists, use it to fetch weather.
  const { weather, loading: loadingWeather, error: weatherError } = useWeather(position?.lat, position?.lon, 60000);

  // placeholder origin/dest coordinates if not available: use live +/- small shift or null
  const origin = position ? { lat: position.lat + 1.5, lon: position.lon - 1.5 } : null;
  const destination = position ? { lat: position.lat - 2, lon: position.lon + 3 } : null;

  return (
    <>
      <Head>
        <title>EcoAir Initiative — Flight Dashboard</title>
      </Head>
      <main className="max-w-6xl mx-auto p-6 space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">EcoAir — Real-time Flight & Emission Dashboard</h1>
          <div className="text-sm text-slate-600">
            Provide keys in .env.local (see .env.example). OpenWeather and AviationStack recommended.
          </div>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            <div className="p-4 bg-white rounded shadow">
              <label className="block text-sm font-medium mb-2">Flight Number (IATA), e.g. BA117</label>
              <div className="flex space-x-2">
                <input className="flex-1 p-2 border rounded" value={flight} onChange={(e) => setFlight(e.target.value)} placeholder="Enter flight number" />
                <button className="px-3 py-2 bg-sky-600 text-white rounded" onClick={() => setFlight(flight.trim())}>Load</button>
              </div>
            </div>

            <div className="mt-4">
              <FlightInfo flightNumber={flight} info={info} position={position} loading={loading} error={error} />
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            {/* This component will now load correctly */}
            <FlightMap origin={origin} destination={destination} live={position ? { lat: position.lat, lon: position.lon } : null} emissionsPerKm={0.1} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EnvironmentalData weather={weather} loading={loadingWeather} error={weatherError} />
              <EmissionCalculator origin={origin} destination={destination} aircraftType={info?.aircraft} passengerLoadFactor={0.8} />
            </div>
          </div>
        </section>

        <footer className="text-sm text-slate-500">Notes: This demo uses AviationStack & OpenWeather/OpenSky samples. Add API keys to .env.local. Handle API limits and authentication for production.</footer>
      </main>
    </>
  );
}