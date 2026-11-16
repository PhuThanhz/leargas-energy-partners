import { BatteryCharging, Leaf, SunMedium, Wind } from "lucide-react"

import type { Service } from "@/types"

export const services: Service[] = [
  {
    title: "Solar Development",
    description: "End-to-end development of utility-scale and rooftop solar projects.",
    icon: SunMedium,
  },
  {
    title: "Wind Energy",
    description: "Site assessment, permitting and delivery of onshore wind farms.",
    icon: Wind,
  },
  {
    title: "Energy Storage",
    description: "Battery storage solutions that stabilise the grid and maximise returns.",
    icon: BatteryCharging,
  },
  {
    title: "Sustainability Advisory",
    description: "Decarbonisation strategy and PPA advisory for corporate partners.",
    icon: Leaf,
  },
]
