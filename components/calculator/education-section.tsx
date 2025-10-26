"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Plane, Globe, TreePine, Zap } from "lucide-react"

export default function EducationSection() {
  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-12 text-slate-800">Understanding Aviation Emissions</h2>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8">
            <Plane className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-bold mb-3">How We Calculate</h3>
            <p className="text-slate-600">
              We use the Haversine formula to calculate exact distances between airports, then apply industry-standard
              emission factors based on aircraft type and fuel consumption.
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-8">
            <Globe className="w-12 h-12 text-green-600 mb-4" />
            <h3 className="text-xl font-bold mb-3">Carbon Footprint</h3>
            <p className="text-slate-600">
              Aviation contributes approximately 2-3% of global carbon emissions. Each flight generates significant CO2,
              making offset programs essential for sustainability.
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-8">
            <TreePine className="w-12 h-12 text-emerald-600 mb-4" />
            <h3 className="text-xl font-bold mb-3">Tree Planting Impact</h3>
            <p className="text-slate-600">
              One mature tree absorbs approximately 20kg of CO2 annually. Our tree planting initiatives focus on
              reforestation in India's critical ecosystems.
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-8">
            <Zap className="w-12 h-12 text-yellow-600 mb-4" />
            <h3 className="text-xl font-bold mb-3">Renewable Energy</h3>
            <p className="text-slate-600">
              Solar and wind energy projects reduce reliance on fossil fuels. Our investments support verified renewable
              energy installations across India.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
