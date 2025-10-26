"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, Loader2, Plane, MapPin, AlertCircle } from "lucide-react"

interface Airport {
  code: string
  name: string
  city: string
  state: string
  lat: number
  lon: number
}

interface FlightInputFormProps {
  onCalculate: (data: {
    departureAirport: Airport
    destinationAirport: Airport
    flightNumber: string
    travelClass: "economy" | "business"
  }) => void
  isLoading: boolean
}

export default function FlightInputForm({ onCalculate, isLoading }: FlightInputFormProps) {
  const [departureAirport, setDepartureAirport] = useState("")
  const [destinationAirport, setDestinationAirport] = useState("")
  const [flightNumber, setFlightNumber] = useState("")
  const [travelClass, setTravelClass] = useState("economy")
  const [error, setError] = useState("")

  // Comprehensive list of Indian airports
  const indianAirports: Airport[] = [
    { code: "AGR", name: "Agra Airport", city: "Agra", state: "Uttar Pradesh", lat: 27.15, lon: 77.96 },
    { code: "AMD", name: "Ahmedabad Airport", city: "Ahmedabad", state: "Gujarat", lat: 23.07, lon: 72.63 },
    { code: "AJL", name: "Aizawl Airport", city: "Aizawl", state: "Mizoram", lat: 23.74, lon: 92.8 },
    { code: "ATQ", name: "Amritsar Airport", city: "Amritsar", state: "Punjab", lat: 31.7, lon: 74.79 },
    { code: "IXA", name: "Agartala Airport", city: "Agartala", state: "Tripura", lat: 23.88, lon: 91.24 },
    { code: "IXU", name: "Aurangabad Airport", city: "Aurangabad", state: "Maharashtra", lat: 19.86, lon: 75.39 },
    { code: "IXB", name: "Bagdogra Airport", city: "Bagdogra", state: "West Bengal", lat: 26.68, lon: 88.32 },
    { code: "BLR", name: "Bengaluru Airport", city: "Bengaluru", state: "Karnataka", lat: 13.19, lon: 77.7 },
    { code: "BUP", name: "Bathinda Airport", city: "Bathinda", state: "Punjab", lat: 30.27, lon: 74.75 },
    { code: "BHO", name: "Bhopal Airport", city: "Bhopal", state: "Madhya Pradesh", lat: 23.28, lon: 77.33 },
    { code: "BBI", name: "Bhubaneswar Airport", city: "Bhubaneswar", state: "Odisha", lat: 20.24, lon: 85.81 },
    { code: "BHJ", name: "Bhuj Airport", city: "Bhuj", state: "Gujarat", lat: 23.28, lon: 69.67 },
    { code: "BOM", name: "Mumbai Airport", city: "Mumbai", state: "Maharashtra", lat: 19.08, lon: 72.87 },
    { code: "CCU", name: "Kolkata Airport", city: "Kolkata", state: "West Bengal", lat: 22.65, lon: 88.44 },
    { code: "CJB", name: "Coimbatore Airport", city: "Coimbatore", state: "Tamil Nadu", lat: 11.03, lon: 77.04 },
    { code: "COK", name: "Kochi Airport", city: "Kochi", state: "Kerala", lat: 10.15, lon: 76.4 },
    { code: "IXC", name: "Chandigarh Airport", city: "Chandigarh", state: "Chandigarh", lat: 30.67, lon: 76.78 },
    { code: "MAA", name: "Chennai Airport", city: "Chennai", state: "Tamil Nadu", lat: 12.99, lon: 80.18 },
    { code: "DED", name: "Dehradun Airport", city: "Dehradun", state: "Uttarakhand", lat: 30.18, lon: 78.18 },
    { code: "DEL", name: "Delhi Airport", city: "Delhi", state: "Delhi", lat: 28.55, lon: 77.1 },
    {
      code: "DHM",
      name: "Dharamshala Airport",
      city: "Dharamshala",
      state: "Himachal Pradesh",
      lat: 32.16,
      lon: 76.26,
    },
    { code: "DIB", name: "Dibrugarh Airport", city: "Dibrugarh", state: "Assam", lat: 27.48, lon: 95.01 },
    { code: "DMU", name: "Dimapur Airport", city: "Dimapur", state: "Nagaland", lat: 25.88, lon: 93.77 },
    { code: "DIU", name: "Diu Airport", city: "Diu", state: "Daman and Diu", lat: 20.71, lon: 70.92 },
    { code: "GAY", name: "Gaya Airport", city: "Gaya", state: "Bihar", lat: 24.74, lon: 84.95 },
    { code: "GOI", name: "Goa Airport", city: "Goa", state: "Goa", lat: 15.38, lon: 73.83 },
    { code: "GAU", name: "Guwahati Airport", city: "Guwahati", state: "Assam", lat: 26.1, lon: 91.58 },
    { code: "GWL", name: "Gwalior Airport", city: "Gwalior", state: "Madhya Pradesh", lat: 26.29, lon: 78.22 },
    { code: "HBX", name: "Hubli Airport", city: "Hubli", state: "Karnataka", lat: 15.36, lon: 75.08 },
    { code: "HYD", name: "Hyderabad Airport", city: "Hyderabad", state: "Telangana", lat: 17.24, lon: 78.43 },
    { code: "IMF", name: "Imphal Airport", city: "Imphal", state: "Manipur", lat: 24.76, lon: 93.89 },
    { code: "IDR", name: "Indore Airport", city: "Indore", state: "Madhya Pradesh", lat: 22.72, lon: 75.8 },
    { code: "JLR", name: "Jabalpur Airport", city: "Jabalpur", state: "Madhya Pradesh", lat: 23.17, lon: 80.05 },
    { code: "JAI", name: "Jaipur Airport", city: "Jaipur", state: "Rajasthan", lat: 26.82, lon: 75.81 },
    { code: "JSA", name: "Jaisalmer Airport", city: "Jaisalmer", state: "Rajasthan", lat: 26.88, lon: 70.86 },
    { code: "IXJ", name: "Jammu Airport", city: "Jammu", state: "Jammu and Kashmir", lat: 32.68, lon: 74.83 },
    { code: "JGA", name: "Jamnagar Airport", city: "Jamnagar", state: "Gujarat", lat: 22.46, lon: 70.01 },
    { code: "JDH", name: "Jodhpur Airport", city: "Jodhpur", state: "Rajasthan", lat: 26.25, lon: 73.04 },
    { code: "JRH", name: "Jorhat Airport", city: "Jorhat", state: "Assam", lat: 26.73, lon: 94.17 },
    { code: "KNU", name: "Kanpur Airport", city: "Kanpur", state: "Uttar Pradesh", lat: 26.4, lon: 80.41 },
    { code: "IXY", name: "Kandla Airport", city: "Kandla", state: "Gujarat", lat: 23.11, lon: 70.1 },
    { code: "HJR", name: "Khajuraho Airport", city: "Khajuraho", state: "Madhya Pradesh", lat: 24.81, lon: 79.91 },
    { code: "LKO", name: "Lucknow Airport", city: "Lucknow", state: "Uttar Pradesh", lat: 26.76, lon: 80.88 },
    { code: "LUH", name: "Ludhiana Airport", city: "Ludhiana", state: "Punjab", lat: 30.85, lon: 75.95 },
    { code: "IXM", name: "Madurai Airport", city: "Madurai", state: "Tamil Nadu", lat: 9.83, lon: 78.09 },
    { code: "IXE", name: "Mangalore Airport", city: "Mangalore", state: "Karnataka", lat: 12.96, lon: 74.89 },
    { code: "NAG", name: "Nagpur Airport", city: "Nagpur", state: "Maharashtra", lat: 21.09, lon: 79.04 },
    { code: "PAT", name: "Patna Airport", city: "Patna", state: "Bihar", lat: 25.59, lon: 85.08 },
    { code: "PBD", name: "Porbandar Airport", city: "Porbandar", state: "Gujarat", lat: 21.64, lon: 69.65 },
    {
      code: "IXZ",
      name: "Port Blair Airport",
      city: "Port Blair",
      state: "Andaman and Nicobar",
      lat: 11.64,
      lon: 92.72,
    },
    { code: "PNQ", name: "Pune Airport", city: "Pune", state: "Maharashtra", lat: 18.58, lon: 73.91 },
    { code: "RPR", name: "Raipur Airport", city: "Raipur", state: "Chhattisgarh", lat: 21.18, lon: 81.73 },
    { code: "RJA", name: "Rajahmundry Airport", city: "Rajahmundry", state: "Andhra Pradesh", lat: 17.11, lon: 81.81 },
    { code: "RAJ", name: "Rajkot Airport", city: "Rajkot", state: "Gujarat", lat: 22.3, lon: 70.77 },
    { code: "IXR", name: "Ranchi Airport", city: "Ranchi", state: "Jharkhand", lat: 23.31, lon: 85.32 },
    { code: "SHL", name: "Shillong Airport", city: "Shillong", state: "Meghalaya", lat: 25.7, lon: 91.97 },
    { code: "SXR", name: "Srinagar Airport", city: "Srinagar", state: "Jammu and Kashmir", lat: 33.98, lon: 74.77 },
    { code: "STV", name: "Surat Airport", city: "Surat", state: "Gujarat", lat: 21.11, lon: 72.74 },
    {
      code: "TRZ",
      name: "Tiruchirappalli Airport",
      city: "Tiruchirappalli",
      state: "Tamil Nadu",
      lat: 10.76,
      lon: 78.7,
    },
    { code: "TIR", name: "Tirupati Airport", city: "Tirupati", state: "Andhra Pradesh", lat: 13.63, lon: 79.54 },
    {
      code: "TRV",
      name: "Thiruvananthapuram Airport",
      city: "Thiruvananthapuram",
      state: "Kerala",
      lat: 8.48,
      lon: 76.92,
    },
    { code: "UDR", name: "Udaipur Airport", city: "Udaipur", state: "Rajasthan", lat: 24.61, lon: 73.89 },
    { code: "BDQ", name: "Vadodara Airport", city: "Vadodara", state: "Gujarat", lat: 22.33, lon: 73.22 },
    { code: "VNS", name: "Varanasi Airport", city: "Varanasi", state: "Uttar Pradesh", lat: 25.45, lon: 82.85 },
    { code: "VGA", name: "Vijayawada Airport", city: "Vijayawada", state: "Andhra Pradesh", lat: 16.53, lon: 80.79 },
    {
      code: "VTZ",
      name: "Visakhapatnam Airport",
      city: "Visakhapatnam",
      state: "Andhra Pradesh",
      lat: 17.72,
      lon: 83.22,
    },
  ].sort((a, b) => a.city.localeCompare(b.city))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!departureAirport || !destinationAirport || !flightNumber || !travelClass) {
      setError("Please fill all fields to proceed.")
      return
    }

    if (departureAirport === destinationAirport) {
      setError("Departure and destination airports cannot be the same.")
      return
    }

    const depAirportData = indianAirports.find((a) => a.code === departureAirport)
    const destAirportData = indianAirports.find((a) => a.code === destinationAirport)

    if (depAirportData && destAirportData) {
      onCalculate({
        departureAirport: depAirportData,
        destinationAirport: destAirportData,
        flightNumber,
        travelClass: travelClass as "economy" | "business",
      })
    }
  }

  return (
    <Card className="max-w-5xl mx-auto shadow-2xl border-0 mb-12">
      <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
        <CardTitle className="text-3xl text-center flex items-center justify-center gap-3">
          <Plane className="w-8 h-8" />
          EcoAir Passenger Portal
        </CardTitle>
        <p className="text-center text-green-100 text-lg">
          Calculate your flight's environmental impact for any Indian domestic route
        </p>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Select Airports */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              Step 1: Select Your Route
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="departure" className="text-lg font-semibold">
                  Departure Airport
                </Label>
                <Select value={departureAirport} onValueChange={setDepartureAirport}>
                  <SelectTrigger id="departure" className="h-12">
                    <SelectValue placeholder="Select departure airport" />
                  </SelectTrigger>
                  <SelectContent>
                    {indianAirports.map((airport) => (
                      <SelectItem key={airport.code} value={airport.code}>
                        {airport.city} ({airport.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="destination" className="text-lg font-semibold">
                  Destination Airport
                </Label>
                <Select value={destinationAirport} onValueChange={setDestinationAirport}>
                  <SelectTrigger id="destination" className="h-12">
                    <SelectValue placeholder="Select destination airport" />
                  </SelectTrigger>
                  <SelectContent>
                    {indianAirports.map((airport) => (
                      <SelectItem key={airport.code} value={airport.code}>
                        {airport.city} ({airport.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Step 2: Flight Details */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Plane className="w-5 h-5 text-blue-600" />
              Step 2: Enter Flight Ticket Details
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="flightNumber" className="text-lg font-semibold">
                  Flight Number
                </Label>
                <input
                  id="flightNumber"
                  type="text"
                  value={flightNumber}
                  onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
                  placeholder="e.g., 6E201, AI101"
                  className="w-full h-12 px-4 border border-gray-200 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <Label htmlFor="travelClass" className="text-lg font-semibold">
                  Travel Class
                </Label>
                <Select value={travelClass} onValueChange={setTravelClass}>
                  <SelectTrigger id="travelClass" className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="economy">Economy Class</SelectItem>
                    <SelectItem value="business">Business Class</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Note: A common aircraft (Airbus A320neo) is used for estimation, as specific aircraft data is not
              available for all routes.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          )}

          <div className="pt-4">
            <Button
              type="submit"
              size="lg"
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 h-14 text-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                  Calculating Your Environmental Impact...
                </>
              ) : (
                <>
                  <Calculator className="mr-3 h-6 w-6" />
                  Calculate My EcoFee Impact
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
