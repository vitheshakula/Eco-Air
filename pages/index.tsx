import React, { useMemo, useState } from "react"
import Head from "next/head"
import dynamic from "next/dynamic"
import { Activity, Plane, Route, TreePine, WalletCards } from "lucide-react"
import { DashboardShell } from "@/components/dashboard/app-shell"
import { MetricTile, PremiumCard, SeverityPill } from "@/components/dashboard/premium-card"
import { INDIAN_AIRPORTS, getAirportByCode } from "@/data/airports"
import type { TravelClass } from "@/utils/flightEmissions"
import { calculateAviationEmissions } from "@/utils/flightEmissions"

const FlightMap = dynamic(() => import("../components/FlightMap"), {
  ssr: false,
  loading: () => (
    <PremiumCard className="flex h-[380px] items-center justify-center text-sm text-slate-400">
      Preparing route intelligence...
    </PremiumCard>
  ),
})

const defaultOrigin = "DEL"
const defaultDestination = "BOM"

export default function Home() {
  const [originCode, setOriginCode] = useState(defaultOrigin)
  const [destinationCode, setDestinationCode] = useState(defaultDestination)
  const [travelClass, setTravelClass] = useState<TravelClass>("economy")

  const origin = getAirportByCode(originCode)
  const destination = getAirportByCode(destinationCode)

  const result = useMemo(() => {
    if (!origin || !destination || origin.code === destination.code) return null
    return calculateAviationEmissions({ origin, destination, travelClass })
  }, [origin, destination, travelClass])

  const emissionsPerKm = result ? result.emissionsKg / result.distanceKm : 0.1
  const severity = result ? getSeverity(result.emissionsKg) : "Moderate"

  return (
    <>
      <Head>
        <title>Stratos - Route Intelligence</title>
      </Head>
      <DashboardShell
        active="dashboard"
        eyebrow="Climate intelligence"
        title="Route Intelligence"
        description="A partner-facing workspace for aviation impact estimation, climate contribution ranges, and visual route storytelling."
      >
        <div className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)] 2xl:grid-cols-[300px_minmax(0,1fr)_280px]">
          <PremiumCard className="p-5 xl:row-span-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-cyan-300">Route setup</div>
                <h2 className="mt-2 text-xl font-semibold text-white">Flight profile</h2>
              </div>
              <Plane className="h-5 w-5 text-emerald-300" />
            </div>

            <div className="mt-6 space-y-5">
              <SelectField label="Origin" value={originCode} onChange={setOriginCode} />
              <SelectField label="Destination" value={destinationCode} onChange={setDestinationCode} />
              <label className="block">
                <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                  Travel class
                </span>
                <select
                  className="h-12 w-full rounded-xl border border-white/10 bg-slate-900 px-3 text-sm text-white outline-none transition focus:border-cyan-300/60"
                  value={travelClass}
                  onChange={(event) => setTravelClass(event.target.value as TravelClass)}
                >
                  <option value="economy">Economy</option>
                  <option value="premium">Premium Economy</option>
                  <option value="business">Business</option>
                  <option value="first">First</option>
                </select>
              </label>
            </div>

            {originCode === destinationCode && (
              <div className="mt-5 rounded-xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">
                Select two different airports to generate an estimate.
              </div>
            )}

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Estimation model</div>
              <div className="mt-3 space-y-3 text-sm text-slate-300">
                <Assumption label="Distance" value="Great-circle route" />
                <Assumption label="Passenger factor" value="Distance based" />
                <Assumption label="Climate contribution" value="Capped route range" />
              </div>
            </div>
          </PremiumCard>

          <div className="space-y-5">
            <FlightMap
              origin={origin ? { lat: origin.lat, lon: origin.lon } : null}
              destination={destination ? { lat: destination.lat, lon: destination.lon } : null}
              live={null}
              emissionsPerKm={emissionsPerKm}
            />

            {result && (
              <div className="grid gap-4 md:grid-cols-3">
                <MetricTile
                  icon={<Route className="h-5 w-5" />}
                  label="Route distance"
                  value={`${result.distanceKm.toLocaleString()} km`}
                  detail="Coordinate based"
                  tone="cyan"
                />
                <MetricTile
                  icon={<Activity className="h-5 w-5" />}
                  label="CO2 estimate"
                  value={`${result.emissionsKg.toLocaleString()} kg`}
                  detail={`${result.assumptions.emissionFactorKgPerPassengerKm} kg / pax-km`}
                  tone={severity === "High" ? "rose" : severity === "Elevated" ? "amber" : "green"}
                />
                <MetricTile
                  icon={<WalletCards className="h-5 w-5" />}
                  label="Climate contribution"
                  value={`Rs. ${result.contributionINR.toLocaleString()}`}
                  detail={`Suggested range Rs. ${result.contributionRangeINR.low}-${result.contributionRangeINR.high}`}
                  tone="green"
                />
              </div>
            )}
          </div>

          {result && (
            <div className="grid gap-5 md:grid-cols-3 2xl:block 2xl:space-y-5">
              <PremiumCard className="p-5">
                <div className="text-xs uppercase tracking-[0.24em] text-cyan-300">Climate contribution</div>
                <div className="mt-3 text-3xl font-semibold text-white">Rs. {result.contributionINR.toLocaleString()}</div>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  A voluntary range for climate-aware partner programs.
                </p>
                <button className="mt-5 h-11 w-full rounded-xl bg-white text-sm font-semibold text-slate-950 transition hover:bg-cyan-100">
                  Review contribution
                </button>
              </PremiumCard>

              <PremiumCard className="p-5">
                <div className="text-xs uppercase tracking-[0.24em] text-cyan-300">Offset mix</div>
                <div className="mt-5 space-y-4">
                  <OffsetBar label="Tree planting" value={50} amount={result.offsetSuggestions.treePlantingINR} />
                  <OffsetBar label="Renewable energy" value={30} amount={result.offsetSuggestions.renewableEnergyINR} />
                  <OffsetBar label="Efficiency projects" value={20} amount={result.offsetSuggestions.efficiencyProjectsINR} />
                </div>
              </PremiumCard>

              <PremiumCard className="p-5">
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-200">
                  <TreePine className="h-4 w-4" />
                  Environmental comparison
                </div>
                <div className="mt-4 space-y-3 text-sm text-slate-300">
                  <Assumption label="Tree-year equivalent" value={`${result.treesEquivalent.toLocaleString()} trees`} />
                  <Assumption label="Driving equivalent" value={`${result.drivingKmEquivalent.toLocaleString()} km`} />
                  <Assumption label="Home electricity" value={`${result.householdElectricityDays.toLocaleString()} days`} />
                </div>
              </PremiumCard>
            </div>
          )}
        </div>
      </DashboardShell>
    </>
  )
}

function SelectField({
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
        {INDIAN_AIRPORTS.map((airport) => (
          <option key={airport.code} value={airport.code}>
            {airport.city} ({airport.code})
          </option>
        ))}
      </select>
    </label>
  )
}

function Assumption({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-medium text-slate-200">{value}</span>
    </div>
  )
}

function OffsetBar({ label, value, amount }: { label: string; value: number; amount: number }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-slate-300">{label}</span>
        <span className="text-slate-500">Rs. {amount.toLocaleString()}</span>
      </div>
      <div className="h-2 rounded-full bg-white/10">
        <div className="h-2 rounded-full bg-gradient-to-r from-emerald-300 to-cyan-300" style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

function getSeverity(emissionsKg: number): "Low" | "Moderate" | "Elevated" | "High" {
  if (emissionsKg < 80) return "Low"
  if (emissionsKg < 160) return "Moderate"
  if (emissionsKg < 280) return "Elevated"
  return "High"
}
