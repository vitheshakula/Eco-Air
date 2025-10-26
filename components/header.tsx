"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Leaf, Home, Calculator } from "lucide-react"
import { motion } from "framer-motion"

export default function Header() {
  const pathname = usePathname()
  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Impact Calculator", path: "/calculator", icon: Calculator },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg shadow-sm">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-800">EcoAir Initiative</span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`text-slate-600 hover:text-green-600 transition-colors font-medium relative ${
                pathname === item.path ? "text-green-600" : ""
              }`}
            >
              {item.name}
              {pathname === item.path && (
                <motion.div layoutId="underline" className="absolute bottom-[-4px] left-0 w-full h-0.5 bg-green-500" />
              )}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}
