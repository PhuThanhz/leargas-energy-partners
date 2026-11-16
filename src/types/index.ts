export type NavItem = {
  title: string
  href: string
}

export type Service = {
  title: string
  description: string
  points: string[]
}

export type Market = {
  name: string
  note: string
}

export type ApproachStep = {
  label: string
  title: string
  description: string
}

export type LensItem = {
  title: string
  description: string
}

export type BrandValue = {
  colour: string
  swatch: string
  name: string
  description: string
}

export type Milestone = {
  stage: string
  title: string
  description: string
  current?: boolean
}

export * from "./blog"
