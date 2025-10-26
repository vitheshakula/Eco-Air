"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import FlightInputForm from "@/components/calculator/flight-input-form"
import ResultsDisplay from "@/components/calculator/results-display"
import EducationSection from "@/components/calculator/education-section"

// Haversine formula to calculate distance between two lat/lon points
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c // Distance in km
  return d
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180)
}

interface Airport {
  code: string
  name: string
  city: string
  state: string
  lat: number
  lon: number
}

interface CalculationResults {
  departureAirport: Airport
  destinationAirport: Airport
  flightNumber: string
  aircraft: string
  distance: string
  travelClass: string
  totalFuel: string
  co2Emissions: string
  co2PerPassenger: string
  passengers: number
  ecoFeePerPassengerINR: string
  totalFeeCollectedINR: string
  allocation: {
    treePlanting: number
    solarEnergy: number
    evInfrastructure: number
  }
}

export default function CalculatorPage() {
  const [results, setResults] = useState<CalculationResults | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Default aircraft and its data
  const defaultAircraft = "Airbus A320neo"
  const fuelPerKm = 2.5 // liters per km for A320neo
  const passengerCapacity = { economy: 186, business: 174 }

  const handleCalculate = (formData: {
    departureAirport: Airport
    destinationAirport: Airport
    flightNumber: string
    travelClass: "economy" | "business"
  }) => {
    setIsLoading(true)
    setResults(null)

    setTimeout(() => {
      const { departureAirport, destinationAirport, flightNumber, travelClass } = formData

      // 1. Calculate distance dynamically
      const distance = getDistanceFromLatLonInKm(
        departureAirport.lat,
        departureAirport.lon,
        destinationAirport.lat,
        destinationAirport.lon,
      )

      // 2. Use default aircraft data for calculation
      const totalFuel = distance * fuelPerKm
      const co2Emissions = totalFuel * 2.5

      const passengers = passengerCapacity[travelClass] || passengerCapacity.economy
      const co2PerPassenger = co2Emissions / passengers

      // 3. Calculate EcoFee with the aggressive rate
      const ecoFeePerPassengerINR = co2PerPassenger * 2.5
      const totalFeeCollectedINR = ecoFeePerPassengerINR * passengers

      const allocation = {
        treePlanting: totalFeeCollectedINR * 0.5,
        solarEnergy: totalFeeCollectedINR * 0.3,
        evInfrastructure: totalFeeCollectedINR * 0.2,
      }

      setResults({
        departureAirport,
        destinationAirport,
        flightNumber,
        aircraft: defaultAircraft,
        distance: distance.toFixed(0),
        travelClass: travelClass.charAt(0).toUpperCase() + travelClass.slice(1),
        totalFuel: totalFuel.toFixed(0),
        co2Emissions: co2Emissions.toFixed(0),
        co2PerPassenger: co2PerPassenger.toFixed(1),
        passengers,
        ecoFeePerPassengerINR: ecoFeePerPassengerINR.toFixed(2),
        totalFeeCollectedINR: totalFeeCollectedINR.toFixed(2),
        allocation,
      })
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-blue-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-6">
            EcoAir Passenger Portal
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Calculate your flight's environmental impact and discover how your
            <span className="font-bold text-green-700"> Accelerated Impact EcoFee </span>
            supports verified green projects across India.
          </p>
        </motion.div>

        <FlightInputForm onCalculate={handleCalculate} isLoading={isLoading} />

        <ResultsDisplay results={results} isLoading={isLoading} />

        {!results && !isLoading && <EducationSection />}
      </div>
    </div>
  )
}
