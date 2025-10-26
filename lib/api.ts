import axios from 'axios';

type FlightInfo = {
  flightNumber: string;
  callsign?: string;
  origin?: string;
  destination?: string;
  departureTime?: string;
  arrivalTime?: string;
  aircraft?: string;
  status?: string;
  lat?: number;
  lon?: number;
  altitude?: number;
  speed?: number;
};

type Weather = {
  temp: number;
  humidity: number;
  windSpeed: number;
  description: string;
  raw?: any;
};

const AVIATIONSTACK_KEY = process.env.NEXT_PUBLIC_AVIATIONSTACK_KEY;
const OPENWEATHER_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_KEY;

export async function fetchFlightByNumber(flightNumber: string): Promise<FlightInfo | null> {
  if (!AVIATIONSTACK_KEY) throw new Error('Missing AVIATIONSTACK API key (NEXT_PUBLIC_AVIATIONSTACK_KEY).');
  try {
    const url = `http://api.aviationstack.com/v1/flights?access_key=${AVIATIONSTACK_KEY}&flight_iata=${encodeURIComponent(flightNumber)}`;
    const { data } = await axios.get(url, { timeout: 8000 });
    const record = data?.data?.[0];
    if (!record) return null;
    return {
      flightNumber,
      callsign: record.flight?.icao || record.flight?.iata,
      origin: record.departure?.iata,
      destination: record.arrival?.iata,
      departureTime: record.departure?.scheduled,
      arrivalTime: record.arrival?.scheduled,
      aircraft: record.aircraft?.iata || record.aircraft?.registration,
      status: record.flight_status,
      // aviationstack doesn't provide live lat/lon in standard records; real-time position requires OpenSky or ADS-B sources
    };
  } catch (err: any) {
    throw new Error('Flight API error: ' + (err.message || String(err)));
  }
}

export async function fetchLivePositionByCallsign(callsign: string): Promise<{ lat: number; lon: number; altitude?: number; speed?: number } | null> {
  // Example using OpenSky "states/all" endpoint (public, limited rate). No API key required for basic usage.
  // For heavy use, use OpenSky credentials or a paid service.
  try {
    const url = `https://opensky-network.org/api/states/all?callsign=${encodeURIComponent(callsign)}`;
    const { data } = await axios.get(url, { timeout: 8000 });
    const states = data?.states;
    if (!states || !states.length) return null;
    // OpenSky returns array: [icao24, callsign, origin_country, time_position, last_contact, longitude, latitude, altitude, ...]
    const s = states[0];
    const lon = s[5];
    const lat = s[6];
    const altitude = s[7];
    const speed = s[9];
    if (lat == null || lon == null) return null;
    return { lat, lon, altitude, speed };
  } catch (err: any) {
    // Not fatal — return null for UI to show error
    return null;
  }
}

export async function fetchWeatherForPoint(lat: number, lon: number): Promise<Weather> {
  if (!OPENWEATHER_KEY) throw new Error('Missing OpenWeather API key (NEXT_PUBLIC_OPENWEATHER_KEY).');
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_KEY}`;
    const { data } = await axios.get(url, { timeout: 8000 });
    return {
      temp: data.main.temp,
      humidity: data.main.humidity,
      windSpeed: data.wind?.speed ?? 0,
      description: data.weather?.[0]?.description ?? 'unknown',
      raw: data,
    };
  } catch (err: any) {
    throw new Error('Weather API error: ' + (err.message || String(err)));
  }
}
