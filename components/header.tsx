"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Calculator, Info } from "lucide-react"
import { motion } from "framer-motion"
import { StratosLogo } from "@/components/brand/stratos-logo"

export default function Header() {
  const pathname = usePathname()
  const navItems = [
    { name: "Dashboard", path: "/", icon: Home },
    { name: "Calculator", path: "/calculator", icon: Calculator },
    { name: "About", path: "/about", icon: Info },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-lg">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <StratosLogo />
        <div className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                pathname === item.path ? "text-cyan-200" : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
              {pathname === item.path && (
                <motion.div layoutId="underline" className="absolute inset-0 -z-10 rounded-full bg-cyan-400/10" />
              )}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}
