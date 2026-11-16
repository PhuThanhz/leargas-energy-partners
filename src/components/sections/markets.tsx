"use client"

import { Globe, MapPin } from "lucide-react"
import { useState } from "react"

import { Reveal, RevealLines } from "@/components/motion/reveal"
import { Eyebrow } from "@/components/shared/eyebrow"
import { cn } from "@/lib/utils"

import { RegionArt } from "./region-art"

interface MarketDetail {
  id: string
  name: string
  subtitle: string
  tag: string
  metrics: { label: string; value: string }[]
  highlights: string[]
}

const marketDetails: MarketDetail[] = [
  {
    id: "vietnam",
    name: "Vietnam (Domestic Core)",
    subtitle:
      "Our headquarters & core focus. Deep government relations, provincial stakeholder alignment, and project execution truth.",
    tag: "PRIMARY MARKET",
    metrics: [
      { label: "Target Clean Energy Capacity (PDP8)", value: "130GW+ by 2030" },
      { label: "Key Regulatory Milestones", value: "Direct PPA (DPPA) & FiT Phase-out" },
      { label: "Transmission Corridors", value: "North-Central & South Offshore" },
    ],
    highlights: [
      "Provincial Peoples' Committee (PPC) and Ministry of Industry & Trade (MOIT) engagement.",
      "Transmission substation grid study & curtailment mitigation strategies.",
      "Local land clearance, compensation & environmental compliance.",
    ],
  },
  {
    id: "sea",
    name: "Southeast Asia (Regional Grid)",
    subtitle:
      "Cross-border energy opportunities connecting Vietnam's growing demand with regional resource abundance.",
    tag: "REGIONAL INTERCONNECT",
    metrics: [
      { label: "Key Corridors", value: "Laos Hydro Imports · ASEAN Power Grid" },
      { label: "Strategic Focus", value: "Cross-border PPA & Subsea HVDC Cables" },
      { label: "Market Drivers", value: "Singapore & Regional Green Energy Demand" },
    ],
    highlights: [
      "Cross-border power purchase agreements (PPA) structure and sovereign guarantees.",
      "Offshore wind export feasibility to regional manufacturing epicenters.",
      "Multi-jurisdictional tax structuring and concession treaties.",
    ],
  },
  {
    id: "apac",
    name: "Asia-Pacific & Global Capital",
    subtitle:
      "European, Japanese and international institutional capital providers deploying into Asia's premier green transition.",
    tag: "CAPITAL SYNDICATE",
    metrics: [
      { label: "Governance Benchmark", value: "OECD Standards & Equator Principles" },
      { label: "Typical Mandate Size", value: "$50M – $500M+ Project Finance" },
      { label: "Co-investor Network", value: "DFIs, Infrastructure Funds, Sovereign Wealth" },
    ],
    highlights: [
      "Institutional-grade financial modeling and bankability verification.",
      "Comprehensive anti-bribery, ESG, and regulatory compliance clearance.",
      "Co-investment syndication with international development finance institutions.",
    ],
  },
]

export function Markets() {
  const [activeMarket, setActiveMarket] = useState("vietnam")
  const current = marketDetails.find((m) => m.id === activeMarket) ?? marketDetails[0]!

  return (
    <section
      id="markets"
      className="relative overflow-hidden bg-[#eae4d5] py-[90px] text-ink md:py-[140px]"
    >
      <div className="wrap grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          <Reveal>
            <Eyebrow>Geographic Footprint · Regional Corridors</Eyebrow>
          </Reveal>
          <h2 className="my-6 font-heading text-[clamp(38px,4.5vw,66px)] leading-[1.04] font-medium tracking-[-0.015em]">
            <RevealLines
              lines={[
                "Rooted in Vietnam.",
                <span key="1" className="text-gold-deep italic">
                  Connected to global capital.
                </span>,
              ]}
            />
          </h2>
          <Reveal delay={0.1}>
            <p className="max-w-[520px] text-[15px] leading-[1.85] text-muted-foreground">
              Energy investment is inherently geopolitical and hyper-local. We translate
              on-the-ground regulatory realities, provincial authorities, and grid dynamics into
              institutional-grade clarity for international decision-makers.
            </p>
          </Reveal>

          {/* Interactive Geographic Selector Tabs */}
          <div className="mt-8 flex flex-wrap gap-2 border-b border-line pb-4">
            {marketDetails.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setActiveMarket(m.id)}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium tracking-wide transition-all",
                  activeMarket === m.id
                    ? "border-green bg-green text-gold shadow-sm"
                    : "border-line bg-paper/70 text-ink/75 hover:bg-paper hover:text-ink"
                )}
              >
                <MapPin className="size-3.5 shrink-0" />
                {m.name.split(" ")[0]}
              </button>
            ))}
          </div>

          {/* Active Jurisdiction Focus Dossier */}
          <div className="mt-6 rounded-[3px] border border-line bg-paper/90 p-6 shadow-xs md:p-7">
            <div className="flex items-center justify-between gap-4">
              <span className="font-mono text-[10px] font-semibold tracking-[0.25em] text-gold-deep uppercase">
                {current.tag}
              </span>
              <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                <Globe className="size-3.5 text-green" />
                JURISDICTION INTEL
              </span>
            </div>

            <h3 className="mt-2 font-heading text-[24px] font-medium text-ink">{current.name}</h3>
            <p className="mt-2 text-[13.5px] leading-[1.75] text-muted-foreground">
              {current.subtitle}
            </p>

            {/* Metrics Pills */}
            <div className="mt-5 grid gap-3 border-t border-line/70 pt-4 sm:grid-cols-3">
              {current.metrics.map((item) => (
                <div key={item.label} className="space-y-1">
                  <p className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
                    {item.label}
                  </p>
                  <p className="font-heading text-sm leading-snug font-semibold text-green">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Highlights List */}
            <ul className="mt-5 space-y-2 border-t border-line/70 pt-4">
              {current.highlights.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-2.5 text-xs leading-relaxed text-ink/80"
                >
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-red" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Conceptual Cartography / Map Card */}
        <Reveal delay={0.1} y={32} className="w-full">
          <div className="overflow-hidden rounded-[4px] border border-line/80 bg-green p-2 shadow-xl">
            <RegionArt />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
