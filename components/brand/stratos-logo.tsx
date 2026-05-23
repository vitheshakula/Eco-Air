import Link from "next/link"
import type React from "react"
import { cn } from "@/lib/utils"

export function StratosMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label="Stratos"
      className={cn("h-10 w-10", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="14" fill="#06111F" />
      <rect x="0.75" y="0.75" width="46.5" height="46.5" rx="13.25" stroke="url(#stratos-border)" strokeOpacity="0.64" strokeWidth="1.5" />
      <path
        d="M14.2 31.2C11.5 24.8 14.1 17.2 20.4 13.7C26.7 10.1 34.4 11.9 38.4 17.4"
        stroke="#0E8FB4"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M18.2 13.1C17.5 21.4 22.4 29.4 30.2 32.2"
        stroke="#55C7EC"
        strokeWidth="4.2"
        strokeLinecap="round"
      />
      <path
        d="M12.5 21.8C18.1 28.2 26.4 31.4 35.2 30.3"
        stroke="#2FB8E3"
        strokeWidth="4.2"
        strokeLinecap="round"
      />
      <path
        d="M16.2 17.5C21.1 23 28.4 25.8 37.2 25.1"
        stroke="#86E6FF"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      <path
        d="M20.8 10.4C21.7 19.7 27.3 26.8 37.8 29.9"
        stroke="#67E8F9"
        strokeOpacity="0.78"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M26.5 17.6C32.2 16.8 38.6 17.9 43 20.5"
        stroke="#7DD3FC"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="stratos-border" x1="5" y1="4" x2="43" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#67E8F9" />
          <stop offset="1" stopColor="#34D399" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function StratosLogo({
  collapsed = false,
  href = "/",
  subtitle = "Clearer Skies",
  className,
}: {
  collapsed?: boolean
  href?: string
  subtitle?: string
  className?: string
}) {
  return (
    <Link href={href} className={cn("flex min-w-0 items-center gap-3", collapsed && "justify-center", className)}>
      <StratosMark className="shrink-0" />
      {!collapsed && (
        <span className="min-w-0">
          <span className="block font-semibold leading-tight text-white">Stratos</span>
          <span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.24em] text-cyan-200/90">
            {subtitle}
          </span>
        </span>
      )}
    </Link>
  )
}
