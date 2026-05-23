"use client"

import Link from "next/link"
import type React from "react"
import { useState } from "react"
import { BarChart3, Calculator, ChevronLeft, Info, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { StratosLogo } from "@/components/brand/stratos-logo"

export function DashboardShell({
  active,
  eyebrow,
  title,
  description,
  children,
}: {
  active: "dashboard" | "calculator" | "about"
  eyebrow: string
  title: string
  description: string
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <main className="min-h-screen bg-[#050b14] text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_30%_15%,rgba(20,184,166,0.16),transparent_32%),radial-gradient(circle_at_78%_10%,rgba(56,189,248,0.12),transparent_30%),linear-gradient(180deg,#07111f_0%,#050b14_46%,#020617_100%)]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1440px]">
        <Sidebar active={active} collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} />

        {mobileOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <button
              aria-label="Close navigation"
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-[min(22rem,88vw)] border-r border-white/10 bg-slate-950 px-5 py-5 shadow-2xl transition duration-200 ease-out">
              <div className="mb-6 flex items-center justify-between">
                <Brand collapsed={false} />
                <button
                  aria-label="Close navigation"
                  className="rounded-xl border border-white/10 p-2 text-slate-400 transition duration-200 ease-out hover:bg-white/5 hover:text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <NavLinks active={active} collapsed={false} onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        )}

        <section className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <header className="border-b border-white/10 bg-slate-950/40 px-5 py-5 backdrop-blur md:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="min-w-0">
                <button
                  aria-label="Open navigation"
                  className="mb-4 inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-300 transition duration-200 ease-out hover:bg-white/5 hover:text-white lg:hidden"
                  onClick={() => setMobileOpen(true)}
                >
                  <Menu className="h-4 w-4" />
                  Menu
                </button>
                <div className="text-xs font-medium uppercase tracking-[0.28em] text-cyan-300">{eyebrow}</div>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-5xl">{title}</h1>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400 md:text-base">{description}</p>
              </div>
            </div>
          </header>
          <div className="min-w-0 flex-1 px-4 py-5 md:px-7 md:py-6">{children}</div>
        </section>
      </div>
    </main>
  )
}

function Sidebar({
  active,
  collapsed,
  onToggle,
}: {
  active: "dashboard" | "calculator" | "about"
  collapsed: boolean
  onToggle: () => void
}) {
  return (
    <aside
      className={cn(
        "hidden shrink-0 flex-col border-r border-white/10 bg-slate-950/70 px-4 py-5 transition-[width] duration-300 ease-out lg:flex",
        collapsed ? "w-[5.25rem]" : "w-64",
      )}
    >
      <div className={cn("flex items-center justify-between gap-2", collapsed && "flex-col")}>
        <Brand collapsed={collapsed} />
        <button
          aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
          className="rounded-xl border border-white/10 p-2 text-slate-400 transition duration-200 ease-out hover:bg-white/5 hover:text-white"
          onClick={onToggle}
        >
          <ChevronLeft className={cn("h-4 w-4 transition", collapsed && "rotate-180")} />
        </button>
      </div>

      <NavLinks active={active} collapsed={collapsed} />
    </aside>
  )
}

function Brand({ collapsed }: { collapsed: boolean }) {
  return <StratosLogo collapsed={collapsed} subtitle="Clearer Skies" />
}

function NavLinks({
  active,
  collapsed,
  onNavigate,
}: {
  active: "dashboard" | "calculator" | "about"
  collapsed: boolean
  onNavigate?: () => void
}) {
  return (
    <nav className="mt-8 space-y-1.5">
      <NavItem active={active === "dashboard"} href="/" icon={<BarChart3 className="h-4 w-4" />} collapsed={collapsed} onNavigate={onNavigate}>
        Dashboard
      </NavItem>
      <NavItem active={active === "calculator"} href="/calculator" icon={<Calculator className="h-4 w-4" />} collapsed={collapsed} onNavigate={onNavigate}>
        Calculator
      </NavItem>
      <NavItem active={active === "about"} href="/about" icon={<Info className="h-4 w-4" />} collapsed={collapsed} onNavigate={onNavigate}>
        About
      </NavItem>
    </nav>
  )
}

function NavItem({
  active,
  href,
  icon,
  children,
  collapsed = false,
  onNavigate,
}: {
  active: boolean
  href: string
  icon: React.ReactNode
  children: React.ReactNode
  collapsed?: boolean
  onNavigate?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      title={typeof children === "string" ? children : undefined}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition duration-200 ease-out",
        collapsed && "justify-center px-0",
        active ? "bg-cyan-400/10 text-cyan-100 shadow-[inset_0_0_0_1px_rgba(103,232,249,0.08)]" : "text-slate-400 hover:bg-white/5 hover:text-white",
      )}
    >
      <span className="grid h-5 w-5 place-items-center transition duration-200 ease-out group-hover:scale-105">{icon}</span>
      {!collapsed && <span>{children}</span>}
      {active && <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-cyan-300" />}
    </Link>
  )
}
