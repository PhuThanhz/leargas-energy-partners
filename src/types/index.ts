import type { LucideIcon } from "lucide-react"

export type NavItem = {
  title: string
  href: string
  external?: boolean
}

export type Service = {
  title: string
  description: string
  icon: LucideIcon
}

export type Project = {
  title: string
  location: string
  capacity: string
  description: string
}

export type Stat = {
  value: string
  label: string
}

export * from "./blog"
