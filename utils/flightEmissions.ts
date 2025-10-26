// Aircraft data with passenger capacity and fuel efficiency rating (1-10, higher is better)
const AIRCRAFT_DATA: Record<string, { capacity: number; efficiency: number }> = {
  'B77W': { capacity: 396, efficiency: 7.5 }, // Boeing 777-300ER
  'B788': { capacity: 330, efficiency: 8.5 }, // Boeing 787-8 Dreamliner
  'A320': { capacity: 180, efficiency: 7.0 }, // Airbus A320
  'B738': { capacity: 189, efficiency: 6.5 }, // Boeing 737-800
  'A321': { capacity: 200, efficiency: 7.2 }, // Airbus A321
  'A359': { capacity: 325, efficiency: 8.8 }, // Airbus A350-900
  'A388': { capacity: 525, efficiency: 6.8 }, // Airbus A380-800
  'B748': { capacity: 410, efficiency: 7.0 }, // Boeing 747-8
  'A220': { capacity: 135, efficiency: 8.2 }, // Airbus A220-300
  'E190': { capacity: 100, efficiency: 6.5 }, // Embraer E190
  'default': { capacity: 180, efficiency: 7.0 }
};

// Constants for calculations
const DEFAULT_LOAD_FACTOR = 0.82; // Global average load factor
const BASE_EMISSION_FACTOR = 0.12; // Base kg CO2 per passenger-km
const BASIC_OFFSET_COST_PER_TON = 8; // USD
const PREMIUM_OFFSET_COST_PER_TON = 40; // USD

// Distance-based emission adjustments
const DISTANCE_FACTORS = {
  short: { max: 1500, factor: 1.2 }, // Higher emissions per km for short flights
  medium: { max: 3500, factor: 1.0 },
  long: { max: Infinity, factor: 0.95 } // More efficient for long-haul
};

type Coordinates = {
  latitude: number;
  longitude: number;
};

type FlightData = {
  departure?: Coordinates;
  arrival?: Coordinates;
  aircraft?: { iata?: string };
  flight?: { number_of_passengers?: number };
};

type EmissionResult = {
  distance: number; // km
  estimatedPassengers: number;
  co2PerPassenger: number; // kg
  totalCo2: number; // tons
  basicOffsetCost: number; // USD per passenger
  premiumOffsetCost: number; // USD per passenger
  valid: boolean;
};

function calculateHaversineDistance(start: Coordinates, end: Coordinates): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(end.latitude - start.latitude);
  const dLon = toRad(end.longitude - start.longitude);
  const lat1 = toRad(start.latitude);
  const lat2 = toRad(end.latitude);

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

function getDistanceFactor(distance: number): number {
  if (distance <= DISTANCE_FACTORS.short.max) return DISTANCE_FACTORS.short.factor;
  if (distance <= DISTANCE_FACTORS.medium.max) return DISTANCE_FACTORS.medium.factor;
  return DISTANCE_FACTORS.long.factor;
}

export function calculateFlightEmissions(flightData: FlightData): EmissionResult {
  // Check if we have valid coordinates
  if (!flightData.departure?.latitude || !flightData.arrival?.latitude) {
    return {
      distance: 0,
      estimatedPassengers: 0,
      co2PerPassenger: 0,
      totalCo2: 0,
      basicOffsetCost: 0,
      premiumOffsetCost: 0,
      valid: false
    };
  }

  const distance = calculateHaversineDistance(flightData.departure!, flightData.arrival!);
  const aircraftType = flightData.aircraft?.iata || 'default';
  const aircraftData = AIRCRAFT_DATA[aircraftType] || AIRCRAFT_DATA.default;
  
  // Adjust emission factor based on aircraft efficiency and distance
  const distanceFactor = getDistanceFactor(distance);
  const efficiencyFactor = (10 - aircraftData.efficiency) / 10 + 0.5; // Convert efficiency to multiplier
  const adjustedEmissionFactor = BASE_EMISSION_FACTOR * distanceFactor * efficiencyFactor;
  
  const estimatedPassengers = flightData.flight?.number_of_passengers || 
    Math.round(aircraftData.capacity * DEFAULT_LOAD_FACTOR);

  const co2PerPassenger = distance * adjustedEmissionFactor;
  const totalCo2 = (co2PerPassenger * estimatedPassengers) / 1000;

  const basicOffsetCost = (co2PerPassenger / 1000) * BASIC_OFFSET_COST_PER_TON;
  const premiumOffsetCost = (co2PerPassenger / 1000) * PREMIUM_OFFSET_COST_PER_TON;

  return {
    distance: Math.round(distance),
    estimatedPassengers,
    co2PerPassenger: Math.round(co2PerPassenger * 10) / 10,
    totalCo2: Math.round(totalCo2 * 10) / 10,
    basicOffsetCost: Math.round(basicOffsetCost * 100) / 100,
    premiumOffsetCost: Math.round(premiumOffsetCost * 100) / 100,
    valid: true
  };
}
