import { useEffect, useState, useRef } from 'react';
import { fetchWeatherForPoint } from '../lib/api';

export function useWeather(lat?: number, lon?: number, pollInterval = 60000) {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (lat == null || lon == null) return;
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const w = await fetchWeatherForPoint(lat, lon);
        if (!mounted) return;
        setWeather(w);
      } catch (err: any) {
        setError(err.message || 'Weather error');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    intervalRef.current = window.setInterval(load, pollInterval);
    return () => {
      mounted = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [lat, lon, pollInterval]);

  return { weather, loading, error, setWeather };
}
