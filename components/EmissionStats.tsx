import { calculateFlightEmissions } from '../utils/flightEmissions';

type Props = {
  departure?: { latitude: number; longitude: number };
  arrival?: { latitude: number; longitude: number };
  aircraft?: { iata?: string };
  passengers?: number;
};

export default function EmissionStats({ departure, arrival, aircraft, passengers }: Props) {
  const emissions = calculateFlightEmissions({
    departure,
    arrival,
    aircraft,
    flight: { number_of_passengers: passengers }
  });

  if (!emissions.valid) {
    return <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold">Emission Data</h2>
      <p className="text-sm text-slate-500">Waiting for flight data...</p>
    </div>;
  }

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold">Emission Data</h2>
      <div className="mt-3 space-y-2 text-sm">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-slate-500">Flight Distance</p>
            <p className="font-medium">{emissions.distance} km</p>
          </div>
          <div>
            <p className="text-slate-500">Passengers</p>
            <p className="font-medium">{emissions.estimatedPassengers}</p>
          </div>
          <div>
            <p className="text-slate-500">CO₂ per Passenger</p>
            <p className="font-medium">{emissions.co2PerPassenger} kg</p>
          </div>
          <div>
            <p className="text-slate-500">Total CO₂</p>
            <p className="font-medium">{emissions.totalCo2} tons</p>
          </div>
        </div>
        <div className="pt-2 border-t">
          <p className="text-slate-500">Carbon Offset Cost per Passenger</p>
          <div className="grid grid-cols-2 gap-4 mt-1">
            <div>
              <p className="text-xs text-slate-500">Basic Offset</p>
              <p className="font-medium">${emissions.basicOffsetCost}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Premium Offset</p>
              <p className="font-medium">${emissions.premiumOffsetCost}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
