"use client"

import { PremiumCard } from "@/components/dashboard/premium-card"
import { Globe, Plane, TreePine, Zap } from "lucide-react"

export default function EducationSection() {
  const items = [
    {
      icon: Plane,
      title: "Route intelligence",
      copy: "Airport coordinates create a realistic great-circle distance before class and distance assumptions are applied.",
    },
    {
      icon: Globe,
      title: "Passenger footprint",
      copy: "The estimate represents one passenger's share of route emissions, making the suggested contribution easier to understand.",
    },
    {
      icon: TreePine,
      title: "Climate context",
      copy: "Tree-year and renewable-energy equivalents translate CO2 into tangible sustainability comparisons.",
    },
    {
      icon: Zap,
      title: "Capped contribution",
      copy: "The participation range is capped by cabin class and split across tree planting, renewable energy, and efficiency projects.",
    },
  ]

  return (
    <div className="mt-8">
      <h2 className="mb-5 text-xl font-semibold text-white">How Stratos Estimates Impact</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <PremiumCard key={item.title} className="p-5">
            <item.icon className="h-8 w-8 text-cyan-300" />
            <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">{item.copy}</p>
          </PremiumCard>
        ))}
      </div>
    </div>
  )
}
