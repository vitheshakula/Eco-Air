"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { TreePine, Zap, Leaf } from "lucide-react"

interface CalculationResults {
  departureAirport: { city: string; code: string }
  destinationAirport: { city: string; code: string }
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

interface ResultsDisplayProps {
  results: CalculationResults | null
  isLoading: boolean
}

export default function ResultsDisplay({ results, isLoading }: ResultsDisplayProps) {
  if (!results && !isLoading) return null

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto mb-12">
        <Card className="border-0 shadow-2xl">
          <CardContent className="p-12 text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!results) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="max-w-5xl mx-auto mb-12"
    >
      <Card className="border-0 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl">
            {results.departureAirport.city} ({results.departureAirport.code}) → {results.destinationAirport.city} (
            {results.destinationAirport.code})
          </CardTitle>
          <p className="text-green-100">
            Flight {results.flightNumber} • {results.aircraft}
          </p>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Flight Details */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-slate-800">Flight Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Distance:</span>
                  <span className="font-semibold">{results.distance} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Travel Class:</span>
                  <span className="font-semibold">{results.travelClass}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Fuel:</span>
                  <span className="font-semibold">{results.totalFuel} liters</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Passengers:</span>
                  <span className="font-semibold">{results.passengers}</span>
                </div>
              </div>
            </div>

            {/* Emissions */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-slate-800">Environmental Impact</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Total CO2 Emissions:</span>
                  <span className="font-semibold text-red-600">{results.co2Emissions} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">CO2 Per Passenger:</span>
                  <span className="font-semibold text-orange-600">{results.co2PerPassenger} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">EcoFee Per Passenger:</span>
                  <span className="font-semibold text-green-600">₹{results.ecoFeePerPassengerINR}</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-slate-600 font-semibold">Total EcoFee Collected:</span>
                  <span className="font-bold text-lg text-green-600">₹{results.totalFeeCollectedINR}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Allocation */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-4 text-slate-800">Your Impact Allocation</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <TreePine className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-slate-600">Tree Planting</p>
                  <p className="font-bold text-lg">₹{results.allocation.treePlanting.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="w-8 h-8 text-yellow-600" />
                <div>
                  <p className="text-sm text-slate-600">Solar Energy</p>
                  <p className="font-bold text-lg">₹{results.allocation.solarEnergy.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Leaf className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-slate-600">EV Infrastructure</p>
                  <p className="font-bold text-lg">₹{results.allocation.evInfrastructure.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
