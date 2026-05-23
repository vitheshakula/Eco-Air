import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Compass, Leaf, Route, Users } from "lucide-react"
import { StratosLogo } from "@/components/brand/stratos-logo"

const process = [
  ["Airports", "Choose an origin and destination."],
  ["Route", "Trace the corridor with coordinate-based distance."],
  ["Cabin", "Reflect class differences with transparent assumptions."],
  ["Story", "Translate emissions into clear climate context."],
]

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050b14] text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(20,184,166,0.16),transparent_34%),radial-gradient(circle_at_82%_22%,rgba(56,189,248,0.13),transparent_32%),linear-gradient(180deg,#07111f_0%,#050b14_48%,#020617_100%)]" />

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 max-sm:flex-col max-sm:items-start md:px-8">
        <StratosLogo href="/about" subtitle="Clearer Skies" />
        <nav className="flex max-w-full items-center gap-2 overflow-x-auto rounded-full border border-white/10 bg-white/[0.04] p-1 text-sm backdrop-blur">
          <TopLink href="/">Dashboard</TopLink>
          <TopLink href="/calculator">Calculator</TopLink>
          <TopLink href="/about" active>
            About
          </TopLink>
        </nav>
      </header>

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl items-center gap-10 px-5 pb-20 pt-10 md:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(300px,440px)]">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-emerald-200">
            <Compass className="h-3.5 w-3.5" />
            Aviation impact, made visible
          </div>
          <h1 className="max-w-4xl text-5xl font-semibold leading-[0.98] tracking-tight text-white md:text-7xl">
            A clearer layer between flight and climate awareness.
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-slate-400 md:text-lg">
            Stratos helps partners explain aviation impact through transparent route intelligence, calm environmental
            storytelling, and climate participation ideas people can see.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/calculator"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-cyan-300 px-6 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
            >
              Explore an estimate
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/10 px-6 text-sm font-medium text-slate-200 transition hover:bg-white/5"
            >
              View route intelligence
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[440px]">
          <div className="absolute inset-8 rounded-full bg-cyan-300/10 blur-3xl" />
          <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.34)] backdrop-blur">
            <Image
              src="/stratos-globe.png"
              alt="Atmospheric Earth visualization for Stratos"
              width={520}
              height={520}
              priority
              className="rounded-[1.5rem] opacity-95"
            />
            <div className="mt-5 flex items-center justify-between text-sm">
              <span className="text-slate-400">Climate participation</span>
              <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-emerald-200">
                Transparent by design
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto grid max-w-7xl gap-10 px-5 py-24 md:px-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="text-sm uppercase tracking-[0.28em] text-cyan-300">The problem</div>
        <div>
          <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-white md:text-5xl">
            Flight impact is often invisible.
          </h2>
          <p className="mt-6 max-w-3xl text-base leading-8 text-slate-400">
            Most people understand distance, price, and time. Far fewer can see how a route translates into climate
            impact or what responsible participation could mean. Stratos keeps the conversation clear, measured, and
            human.
          </p>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="min-h-[420px] rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_25%_20%,rgba(52,211,153,0.16),transparent_34%),linear-gradient(135deg,rgba(15,23,42,0.92),rgba(2,6,23,0.78))] p-8 md:p-10">
            <div className="text-sm uppercase tracking-[0.28em] text-emerald-200">What Stratos does</div>
            <h2 className="mt-8 max-w-2xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
              A clearer way to talk about aviation impact.
            </h2>
            <p className="mt-7 max-w-2xl text-base leading-8 text-slate-400">
              Stratos turns an airport pair into a route story: estimated emissions, contribution ranges, and accessible
              comparisons for education, awareness, and climate-conscious travel programs.
            </p>
          </div>
          <div className="space-y-4">
            <EditorialPoint icon={<Route className="h-5 w-5" />} title="Route estimation" text="Airport-to-airport impact, grounded in coordinates and distance." />
            <EditorialPoint icon={<Leaf className="h-5 w-5" />} title="Climate contribution" text="Transparent ranges without guilt or hard claims." />
            <EditorialPoint icon={<Users className="h-5 w-5" />} title="Partner storytelling" text="A visual language for NGOs, campaigns, and climate-conscious travel programs." />
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-24 md:px-8">
        <div className="mb-10 max-w-2xl">
          <div className="text-sm uppercase tracking-[0.28em] text-cyan-300">How it works</div>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-5xl">Clear enough to trust.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {process.map(([title, text], index) => (
            <div key={title} className="relative border-t border-white/15 pt-5">
              <div className="mb-8 text-sm text-cyan-300">0{index + 1}</div>
              <h3 className="text-xl font-semibold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-8 md:p-12">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <div className="text-sm uppercase tracking-[0.28em] text-emerald-200">Partnerships</div>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-5xl">
                Built for organizations that make climate conversations clearer.
              </h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Partner title="NGOs and initiatives" text="Explain aviation impact in a format audiences can quickly understand." />
              <Partner title="Awareness campaigns" text="Pair route estimates with calm environmental storytelling." />
              <Partner title="Travel programs" text="Introduce contribution ideas without overclaiming." />
              <Partner title="Education partners" text="Use transparent assumptions to teach tradeoffs." />
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-4xl px-5 py-24 text-center md:px-8">
        <div className="text-sm uppercase tracking-[0.28em] text-cyan-300">Positioning</div>
        <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white md:text-5xl">
          Awareness, not authority.
        </h2>
        <p className="mt-6 text-base leading-8 text-slate-400">
          Stratos is not a certified emissions authority, a carbon accounting registry, or live airline operations
          software. It is an exploratory platform for transparent estimation, partner education, and thoughtful climate
          awareness.
        </p>
      </section>
    </main>
  )
}

function TopLink({ href, active, children }: { href: string; active?: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={
        active
          ? "rounded-full bg-cyan-300 px-4 py-2 text-slate-950"
          : "rounded-full px-4 py-2 text-slate-300 transition hover:bg-white/5 hover:text-white"
      }
    >
      {children}
    </Link>
  )
}

function EditorialPoint({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="border-t border-white/15 pt-6">
      <div className="mb-8 w-fit rounded-full border border-cyan-300/15 bg-cyan-300/10 p-3 text-cyan-200">{icon}</div>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-400">{text}</p>
    </div>
  )
}

function Partner({ title, text }: { title: string; text: string }) {
  return (
    <div className="border-t border-white/15 pt-5">
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
    </div>
  )
}
