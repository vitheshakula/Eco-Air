"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { DashboardShell } from "@/components/dashboard/app-shell"
import type { Airport } from "@/data/airports"
import type { EmissionsResult, TravelClass } from "@/utils/flightEmissions"
import { calculateAviationEmissions } from "@/utils/flightEmissions"
import FlightInputForm from "@/components/calculator/flight-input-form"
import ResultsDisplay from "@/components/calculator/results-display"
import EducationSection from "@/components/calculator/education-section"

interface CalculationResults {
  departureAirport: Airport
  destinationAirport: Airport
  emissions: EmissionsResult
}

export default function CalculatorPage() {
  const [results, setResults] = useState<CalculationResults | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleCalculate = (formData: {
    departureAirport: Airport
    destinationAirport: Airport
    travelClass: TravelClass
  }) => {
    setIsLoading(true)
    setResults(null)

    setTimeout(() => {
      const { departureAirport, destinationAirport, travelClass } = formData

      setResults({
        departureAirport,
        destinationAirport,
        emissions: calculateAviationEmissions({
          origin: departureAirport,
          destination: destinationAirport,
          travelClass,
        }),
      })
      setIsLoading(false)
    }, 2000)
  }

  return (
    <DashboardShell
      active="calculator"
      eyebrow="Precision emissions calculator"
      title="Estimate Climate Contribution"
      description="Estimate passenger-level aviation emissions using airport coordinates, travel-class multipliers, and a capped climate contribution range."
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-8"
        >
          <p className="max-w-3xl text-sm leading-6 text-slate-400">
            Select a route and class to generate an explainable emissions estimate, suggested contribution, and offset
            allocation using transparent route-estimation assumptions.
          </p>
        </motion.div>

        <FlightInputForm onCalculate={handleCalculate} isLoading={isLoading} />

        <ResultsDisplay results={results} isLoading={isLoading} />

        {!results && !isLoading && <EducationSection />}
      </div>
    </DashboardShell>
  )
}
