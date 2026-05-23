import type { Airport } from "@/data/airports"

export type TravelClass = "economy" | "premium" | "business" | "first"

export type EmissionsInput = {
  origin: Airport
  destination: Airport
  travelClass: TravelClass
}

export type EmissionsResult = {
  distanceKm: number
  travelClass: TravelClass
  emissionsKg: number
  emissionsTonnes: number
  contributionINR: number
  contributionRangeINR: {
    low: number
    high: number
  }
  treesEquivalent: number
  householdElectricityDays: number
  drivingKmEquivalent: number
  renewableKwhEquivalent: number
  offsetSuggestions: {
    treePlantingINR: number
    renewableEnergyINR: number
    efficiencyProjectsINR: number
  }
  assumptions: {
    baseEmissionFactorKgPerPassengerKm: number
    classMultiplier: number
    emissionFactorKgPerPassengerKm: number
    contributionBasis: string
  }
}

const OFFSET_REFERENCE_INR_PER_TONNE = 1400
const TREE_CO2_ABSORPTION_KG_PER_YEAR = 20
const GRID_CO2_KG_PER_KWH = 0.7
const AVG_HOUSEHOLD_KWH_PER_DAY = 4.5
const AVG_CAR_KG_CO2_PER_KM = 0.12

const CLASS_MULTIPLIERS: Record<TravelClass, number> = {
  economy: 1,
  premium: 1.3,
  business: 1.8,
  first: 2.4,
}

export const TRAVEL_CLASS_LABELS: Record<TravelClass, string> = {
  economy: "Economy",
  premium: "Premium Economy",
  business: "Business",
  first: "First",
}

function toRadians(degrees: number) {
  return degrees * (Math.PI / 180)
}

export function calculateDistanceKm(origin: Airport, destination: Airport) {
  const radiusKm = 6371
  const dLat = toRadians(destination.lat - origin.lat)
  const dLon = toRadians(destination.lon - origin.lon)
  const lat1 = toRadians(origin.lat)
  const lat2 = toRadians(destination.lat)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return radiusKm * c
}

function getEconomyEmissionFactor(distanceKm: number) {
  if (distanceKm < 500) return 0.12
  if (distanceKm < 1500) return 0.105
  if (distanceKm < 3000) return 0.098
  return 0.09
}

function getContributionRange(emissionsKg: number, travelClass: TravelClass) {
  const base = (emissionsKg / 1000) * OFFSET_REFERENCE_INR_PER_TONNE
  const classCap = {
    economy: { min: 79, max: 599 },
    premium: { min: 119, max: 899 },
    business: { min: 179, max: 1499 },
    first: { min: 249, max: 2199 },
  }[travelClass]
  const low = clamp(roundToNearest(base * 0.8, 10), classCap.min, classCap.max)
  const high = clamp(roundToNearest(base * 1.4, 10), classCap.min + 50, classCap.max)

  return {
    low: Math.min(low, high),
    high: Math.max(low, high),
  }
}

export function calculateAviationEmissions(input: EmissionsInput): EmissionsResult {
  const distanceKm = calculateDistanceKm(input.origin, input.destination)
  const classMultiplier = CLASS_MULTIPLIERS[input.travelClass]
  const emissionFactorKgPerPassengerKm = getEconomyEmissionFactor(distanceKm)
  const emissionsKg = distanceKm * emissionFactorKgPerPassengerKm * classMultiplier
  const contributionRangeINR = getContributionRange(emissionsKg, input.travelClass)
  const contributionINR = roundToNearest((contributionRangeINR.low + contributionRangeINR.high) / 2, 10)

  return {
    distanceKm: Math.round(distanceKm),
    travelClass: input.travelClass,
    emissionsKg: round(emissionsKg, 1),
    emissionsTonnes: round(emissionsKg / 1000, 3),
    contributionINR,
    contributionRangeINR,
    treesEquivalent: Math.ceil(emissionsKg / TREE_CO2_ABSORPTION_KG_PER_YEAR),
    householdElectricityDays: Math.ceil(emissionsKg / (GRID_CO2_KG_PER_KWH * AVG_HOUSEHOLD_KWH_PER_DAY)),
    drivingKmEquivalent: Math.ceil(emissionsKg / AVG_CAR_KG_CO2_PER_KM),
    renewableKwhEquivalent: Math.ceil(emissionsKg / GRID_CO2_KG_PER_KWH),
    offsetSuggestions: {
      treePlantingINR: round(contributionINR * 0.45, 2),
      renewableEnergyINR: round(contributionINR * 0.35, 2),
      efficiencyProjectsINR: round(contributionINR * 0.2, 2),
    },
    assumptions: {
      baseEmissionFactorKgPerPassengerKm: 0.105,
      classMultiplier,
      emissionFactorKgPerPassengerKm,
      contributionBasis: "Voluntary climate contribution range using a reference carbon support cost",
    },
  }
}

function round(value: number, decimals: number) {
  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}

function roundToNearest(value: number, nearest: number) {
  return Math.round(value / nearest) * nearest
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}
