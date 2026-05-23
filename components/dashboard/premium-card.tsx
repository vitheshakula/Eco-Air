import type React from "react"
import { cn } from "@/lib/utils"

export function PremiumCard({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-cyan-400/10 bg-slate-950/70 shadow-[0_18px_54px_rgba(0,0,0,0.28)] backdrop-blur",
        className,
      )}
    >
      {children}
    </div>
  )
}

export function MetricTile({
  icon,
  label,
  value,
  detail,
  tone = "cyan",
}: {
  icon: React.ReactNode
  label: string
  value: string
  detail?: string
  tone?: "cyan" | "green" | "amber" | "rose"
}) {
  const tones = {
    cyan: "text-cyan-300 bg-cyan-400/10 border-cyan-400/20",
    green: "text-emerald-300 bg-emerald-400/10 border-emerald-400/20",
    amber: "text-amber-300 bg-amber-400/10 border-amber-400/20",
    rose: "text-rose-300 bg-rose-400/10 border-rose-400/20",
  }

  return (
    <PremiumCard className="min-w-0 p-4 transition hover:-translate-y-0.5 hover:border-cyan-300/30">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</div>
        <div className={cn("rounded-xl border p-2", tones[tone])}>{icon}</div>
      </div>
      <div className="mt-3 break-words text-2xl font-semibold text-white">{value}</div>
      {detail && <div className="mt-2 text-sm text-slate-400">{detail}</div>}
    </PremiumCard>
  )
}

export function SeverityPill({ level }: { level: "Low" | "Moderate" | "Elevated" | "High" }) {
  const className =
    level === "Low"
      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
      : level === "Moderate"
        ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-200"
        : level === "Elevated"
          ? "border-amber-400/30 bg-amber-400/10 text-amber-200"
          : "border-rose-400/30 bg-rose-400/10 text-rose-200"

  return <span className={cn("rounded-full border px-3 py-1 text-xs font-medium", className)}>{level} impact</span>
}
