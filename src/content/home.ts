import type { ApproachStep, BrandValue, LensItem, Market, Milestone, Service } from "@/types"

export const capabilities = [
  "Market entry",
  "Project development",
  "Mergers & acquisitions",
  "Regulatory & legal",
  "Government relations",
  "Capital & financing",
  "Partners & contractors",
]

export const services: Service[] = [
  {
    title: "Market entry & strategy",
    description: "A clear read on Vietnam before capital is committed.",
    points: ["Market & policy assessment", "Entry structure", "Opportunity screening"],
  },
  {
    title: "Mergers & acquisitions",
    description: "Buy-side and sell-side, from origination to closing.",
    points: ["Deal origination", "Due diligence coordination", "Negotiation & closing"],
  },
  {
    title: "Project development",
    description: "Permits, land and grid – the milestones that make a project investable.",
    points: ["Development roadmap", "Permits & approvals", "Grid & land"],
  },
  {
    title: "Regulatory & government relations",
    description: "Engaging the right authorities, alongside legal counsel.",
    points: ["Regulatory navigation", "Stakeholder engagement", "Legal coordination"],
  },
  {
    title: "Capital & financing",
    description: "Structuring capital and connecting you with lenders and co-investors.",
    points: ["Financing strategy", "Investor introductions", "Co-investment structuring"],
  },
  {
    title: "Partners & contractors",
    description: "Finding and vetting local partners, EPC contractors and suppliers.",
    points: ["Partner search", "Contractor selection", "JV structuring"],
  },
]

export const markets: Market[] = [
  { name: "Vietnam", note: "Home market · deep local network" },
  { name: "Southeast Asia", note: "Regional opportunity assessment" },
  { name: "Asia-Pacific", note: "Cross-border capital & partners" },
]

export const approachSteps: ApproachStep[] = [
  {
    label: "Discover",
    title: "Understand your ambition",
    description:
      "We start with your investment thesis, return objectives and risk appetite – and translate them into a clear mandate.",
  },
  {
    label: "Connect",
    title: "Open the right doors",
    description:
      "We identify opportunities, partners and counterparties – and introduce you to the people who matter on the ground.",
  },
  {
    label: "Execute",
    title: "Turn plans into transactions",
    description:
      "We coordinate due diligence, negotiations, approvals and specialist advisers through to signing and closing.",
  },
  {
    label: "Grow",
    title: "Stay alongside you",
    description:
      "After the deal, we remain a partner through development, construction and operation – solving issues as they arise.",
  },
]

export const lensItems: LensItem[] = [
  {
    title: "International standards",
    description:
      "European-educated founders who speak the language of global investors – governance, reporting and discipline included.",
  },
  {
    title: "Local ground truth",
    description:
      "Deep understanding of how things get done in Vietnam – the market, the regulators and the relationships behind every project.",
  },
  {
    title: "Partnership for the long term",
    description:
      "Boutique by design: senior attention on every mandate, and a commitment that lasts beyond the transaction.",
  },
]

export const brandValues: BrandValue[] = [
  {
    colour: "Irish green",
    swatch: "bg-green",
    name: "The explorer's spirit",
    description:
      "Léargas is Irish for insight. Green honours founders who crossed continents to learn – and came home to build.",
  },
  {
    colour: "Gold",
    swatch: "bg-gold",
    name: "Standards that endure",
    description:
      "Distinction, discretion and professionalism – the quality of advice our clients expect from a trusted partner.",
  },
  {
    colour: "Red",
    swatch: "bg-red",
    name: "Vietnamese resilience",
    description:
      "The determination to see long-term goals through. The upward stroke above the É: a vision set high, and the drive to reach it.",
  },
]

export const milestones: Milestone[] = [
  {
    stage: "Today",
    title: "Strategic & investment advisory",
    description:
      "A boutique advisory firm guiding investors into Vietnam's energy sector and supporting every stage of their investment.",
    current: true,
  },
  {
    stage: "Next",
    title: "Co-investment partnerships",
    description:
      "Aligning with investors on selected opportunities – bringing local origination and execution capability to the table.",
  },
  {
    stage: "Ambition",
    title: "An investment platform for APAC",
    description:
      "A trusted platform where international capital finds quality projects in Vietnam and across Asia-Pacific – and turns them into lasting returns.",
  },
]
