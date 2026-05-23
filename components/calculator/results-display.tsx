"use client"

import type { EmissionsResult } from "@/utils/flightEmissions"
import { TRAVEL_CLASS_LABELS } from "@/utils/flightEmissions"
import { MetricTile, PremiumCard, SeverityPill } from "@/components/dashboard/premium-card"
import { motion } from "framer-motion"
import { Activity, Car, Home, Route, TreePine, WalletCards } from "lucide-react"

interface CalculationResults {
  departureAirport: { city: string; code: string }
  destinationAirport: { city: string; code: string }
  emissions: EmissionsResult
}

interface ResultsDisplayProps {
  results: CalculationResults | null
  isLoading: boolean
}

export default function ResultsDisplay({ results, isLoading }: ResultsDisplayProps) {
  if (!results && !isLoading) return null

  if (isLoading) {
    return (
      <PremiumCard className="mb-8 overflow-hidden p-8">
        <div className="space-y-5">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-cyan-300">Preparing route intelligence</div>
            <p className="mt-2 text-sm text-slate-400">Estimating climate context...</p>
          </div>
          <div className="relative h-2 overflow-hidden rounded-full bg-white/10">
            <div className="absolute inset-y-0 left-0 w-1/2 animate-pulse rounded-full bg-gradient-to-r from-transparent via-cyan-200/70 to-transparent" />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <LoadingTile />
            <LoadingTile />
            <LoadingTile />
          </div>
        </div>
      </PremiumCard>
    )
  }

  if (!results) return null

  const { emissions } = results
  const severity = getSeverity(emissions.emissionsKg)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="space-y-5"
    >
      <PremiumCard className="overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-white/10 bg-gradient-to-r from-emerald-400/10 to-cyan-400/10 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-cyan-300">Calculation complete</div>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              {results.departureAirport.city} ({results.departureAirport.code}) to {results.destinationAirport.city} (
              {results.destinationAirport.code})
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              {TRAVEL_CLASS_LABELS[emissions.travelClass]} class estimate based on airport coordinates.
            </p>
          </div>
          <SeverityPill level={severity} />
        </div>

        <div className="grid gap-4 p-6 md:grid-cols-3">
          <MetricTile
            icon={<Route className="h-5 w-5" />}
            label="Distance"
            value={`${emissions.distanceKm.toLocaleString()} km`}
            detail="Great-circle estimate"
            tone="cyan"
          />
          <MetricTile
            icon={<Activity className="h-5 w-5" />}
            label="CO2 footprint"
            value={`${emissions.emissionsKg.toLocaleString()} kg`}
            detail={`${emissions.emissionsTonnes} tonnes CO2`}
            tone={severity === "High" ? "rose" : severity === "Elevated" ? "amber" : "green"}
          />
          <MetricTile
            icon={<WalletCards className="h-5 w-5" />}
            label="Climate contribution"
            value={`Rs. ${emissions.contributionINR.toLocaleString()}`}
            detail={`Suggested range Rs. ${emissions.contributionRangeINR.low}-${emissions.contributionRangeINR.high}`}
            tone="green"
          />
        </div>
      </PremiumCard>

      <div className="grid gap-5 lg:grid-cols-2">
        <PremiumCard className="p-6">
          <h3 className="text-lg font-semibold text-white">Environmental context</h3>
          <div className="mt-5 space-y-4 text-sm">
            <StoryRow icon={<Car className="h-4 w-4 text-cyan-300" />} label="Driving equivalent" value={`${emissions.drivingKmEquivalent.toLocaleString()} km`} />
            <StoryRow icon={<TreePine className="h-4 w-4 text-emerald-300" />} label="Tree-year equivalent" value={`${emissions.treesEquivalent.toLocaleString()} trees`} />
            <StoryRow icon={<Home className="h-4 w-4 text-amber-300" />} label="Home electricity equivalent" value={`${emissions.householdElectricityDays.toLocaleString()} days`} />
          </div>
        </PremiumCard>

        <PremiumCard className="p-6">
          <h3 className="text-lg font-semibold text-white">Contribution allocation</h3>
          <div className="mt-5 space-y-4">
            <Allocation label="Tree planting" value={50} amount={emissions.offsetSuggestions.treePlantingINR} />
            <Allocation label="Solar energy" value={30} amount={emissions.offsetSuggestions.renewableEnergyINR} />
            <Allocation label="Efficiency projects" value={20} amount={emissions.offsetSuggestions.efficiencyProjectsINR} />
          </div>
        </PremiumCard>
      </div>
    </motion.div>
  )
}

function LoadingTile() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="h-3 w-24 rounded-full bg-white/10" />
      <div className="mt-5 h-7 w-28 rounded-full bg-cyan-200/10" />
      <div className="mt-4 h-3 w-36 rounded-full bg-white/10" />
    </div>
  )
}

function StoryRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center gap-3 text-slate-400">
        {icon}
        {label}
      </div>
      <strong className="text-right text-white">{value}</strong>
    </div>
  )
}

function Allocation({ label, value, amount }: { label: string; value: number; amount: number }) {
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
