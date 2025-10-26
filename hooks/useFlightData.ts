import { useEffect, useState, useRef } from 'react';
import { fetchFlightByNumber, fetchLivePositionByCallsign } from '../lib/api';

export function useFlightData(flightNumber?: string) {
  const [info, setInfo] = useState<any>(null);
  const [position, setPosition] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!flightNumber) return;
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const f = await fetchFlightByNumber(flightNumber);
        if (!mounted) return;
        setInfo(f);
        // attempt live position fetch by callsign if present
        if (f?.callsign) {
          const p = await fetchLivePositionByCallsign(f.callsign.trim());
          if (p && mounted) setPosition(p);
        } else {
          setPosition(null);
        }
      } catch (err: any) {
        setError(err.message || 'Unknown flight error');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    // poll
    intervalRef.current = window.setInterval(load, 15000);
    return () => {
      mounted = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [flightNumber]);

  return { info, position, loading, error, setInfo, setPosition };
}
