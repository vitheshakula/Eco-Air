"use client"

import type React from "react"
import { useState } from "react"
import type { Airport } from "@/data/airports"
import { INDIAN_AIRPORTS, getAirportByCode } from "@/data/airports"
import type { TravelClass } from "@/utils/flightEmissions"
import { PremiumCard } from "@/components/dashboard/premium-card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Calculator, Loader2, Plane, MapPin, AlertCircle } from "lucide-react"

interface FlightInputFormProps {
  onCalculate: (data: {
    departureAirport: Airport
    destinationAirport: Airport
    travelClass: TravelClass
  }) => void
  isLoading: boolean
}

export default function FlightInputForm({ onCalculate, isLoading }: FlightInputFormProps) {
  const [departureAirport, setDepartureAirport] = useState("")
  const [destinationAirport, setDestinationAirport] = useState("")
  const [travelClass, setTravelClass] = useState<TravelClass>("economy")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!departureAirport || !destinationAirport || !travelClass) {
      setError("Please select a route and travel class to proceed.")
      return
    }

    if (departureAirport === destinationAirport) {
      setError("Departure and destination airports cannot be the same.")
      return
    }

    const depAirportData = getAirportByCode(departureAirport)
    const destAirportData = getAirportByCode(destinationAirport)

    if (depAirportData && destAirportData) {
      onCalculate({
        departureAirport: depAirportData,
        destinationAirport: destAirportData,
        travelClass,
      })
    } else {
      setError("This route is not available in the current airport set.")
    }
  }

  return (
    <PremiumCard className="mb-8 overflow-hidden">
      <div className="border-b border-white/10 bg-gradient-to-r from-emerald-400/10 to-cyan-400/10 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-300 text-slate-950">
            <Plane className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white">Precision Emissions Calculator</h2>
            <p className="mt-1 text-sm text-slate-400">Estimate any supported Indian domestic route.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <AirportSelect label="Origin airport" value={departureAirport} onChange={setDepartureAirport} />
          <AirportSelect label="Destination airport" value={destinationAirport} onChange={setDestinationAirport} />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
            <MapPin className="h-5 w-5 text-cyan-300" />
            Passenger profile
          </h3>
          <div className="max-w-md">
            <Label htmlFor="travelClass" className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Travel Class
            </Label>
            <select
              id="travelClass"
              value={travelClass}
              onChange={(event) => setTravelClass(event.target.value as TravelClass)}
              className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-slate-900 px-3 text-sm text-white outline-none transition focus:border-cyan-300/60"
            >
              <option value="economy">Economy</option>
              <option value="premium">Premium Economy</option>
              <option value="business">Business</option>
              <option value="first">First</option>
            </select>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-400">
            Economy uses a distance-based passenger-kilometer factor; premium cabins apply transparent multipliers for
            extra seat space.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-400/20 bg-rose-400/10 p-4 text-rose-200">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          className="h-14 w-full rounded-xl bg-cyan-300 text-lg font-semibold text-slate-950 hover:bg-cyan-200"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-3 h-6 w-6 animate-spin" />
              Tracing route corridor...
            </>
          ) : (
            <>
              <Calculator className="mr-3 h-6 w-6" />
              Estimate route impact
            </>
          )}
        </Button>
      </form>
    </PremiumCard>
  )
}

function AirportSelect({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-slate-500">{label}</span>
      <select
        className="h-12 w-full rounded-xl border border-white/10 bg-slate-900 px-3 text-sm text-white outline-none transition focus:border-cyan-300/60"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">Select airport</option>
        {INDIAN_AIRPORTS.map((airport) => (
          <option key={airport.code} value={airport.code}>
            {airport.city} ({airport.code})
          </option>
        ))}
      </select>
    </label>
  )
}
