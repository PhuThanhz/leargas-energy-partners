import type { SectionKey } from "@/content/site"

/** Describes the editable fields of a website section; the admin form is generated from it. */
export type Field =
  | { type: "text" | "textarea" | "url"; key: string; label: string; help?: string }
  | { type: "image"; key: string; label: string; help?: string }
  | { type: "strings"; key: string; label: string; itemLabel: string; help?: string }
  | {
      type: "list"
      key: string
      label: string
      itemLabel: string
      fields: Field[]
      help?: string
    }

export interface SectionSchema {
  key: SectionKey
  label: string
  description: string
  /** Where the section appears on the website, for the "View on website" link. */
  anchor: string
  fields: Field[]
}

const headline = (help = "The second line is shown in gold italics."): Field[] => [
  { type: "text", key: "title", label: "Headline" },
  { type: "text", key: "accent", label: "Headline (accent line)", help },
]

export const WEBSITE_SECTIONS: SectionSchema[] = [
  {
    key: "hero",
    label: "Hero",
    description: "The full-screen opening with the rotating photos.",
    anchor: "/",
    fields: [
      { type: "text", key: "line1", label: "Headline line 1" },
      { type: "text", key: "line2", label: "Headline line 2" },
      { type: "text", key: "accent", label: "Headline line 3 (gold)" },
      { type: "textarea", key: "intro", label: "Intro text" },
      { type: "text", key: "primaryCta", label: "Gold button" },
      { type: "text", key: "secondaryCta", label: "Outline button" },
      {
        type: "list",
        key: "slides",
        label: "Background photos",
        itemLabel: "Photo",
        help: "They cross-fade every few seconds, in this order.",
        fields: [{ type: "image", key: "", label: "Photo" }],
      },
    ],
  },
  {
    key: "marquee",
    label: "Capabilities ticker",
    description: "The scrolling green band under the hero.",
    anchor: "/",
    fields: [{ type: "strings", key: "items", label: "Capabilities", itemLabel: "Capability" }],
  },
  {
    key: "about",
    label: "Who we are",
    description: "Portrait photo, headline, key numbers and the two pillars.",
    anchor: "/#about",
    fields: [
      ...headline(),
      { type: "textarea", key: "intro", label: "Intro text" },
      { type: "image", key: "image", label: "Portrait photo" },
      { type: "text", key: "caption", label: "Photo caption" },
      {
        type: "list",
        key: "stats",
        label: "Key numbers",
        itemLabel: "Number",
        fields: [
          { type: "text", key: "value", label: "Value", help: "e.g. 26–38" },
          { type: "text", key: "unit", label: "Unit", help: "e.g. GW" },
          { type: "text", key: "label", label: "Label" },
        ],
      },
      {
        type: "list",
        key: "pillars",
        label: "Pillars",
        itemLabel: "Pillar",
        fields: [
          { type: "text", key: "code", label: "Small label", help: "e.g. GLOBAL" },
          { type: "text", key: "title", label: "Title" },
          { type: "textarea", key: "description", label: "Description" },
        ],
      },
    ],
  },
  {
    key: "services",
    label: "Services",
    description: "The expanding photo panels, one per service.",
    anchor: "/#services",
    fields: [
      ...headline(),
      { type: "textarea", key: "intro", label: "Intro text" },
      {
        type: "list",
        key: "items",
        label: "Services",
        itemLabel: "Service",
        help: "The first word of each title is shown on the narrow, collapsed panel.",
        fields: [
          { type: "text", key: "title", label: "Title" },
          { type: "textarea", key: "description", label: "Description" },
          { type: "image", key: "image", label: "Photo" },
        ],
      },
    ],
  },
  {
    key: "portfolio",
    label: "Portfolio",
    description: "The drifting photo reel of energy segments.",
    anchor: "/#portfolio",
    fields: [
      ...headline(),
      { type: "textarea", key: "intro", label: "Intro text" },
      {
        type: "list",
        key: "slides",
        label: "Segments",
        itemLabel: "Segment",
        fields: [
          { type: "text", key: "kicker", label: "Tab name", help: "e.g. Onshore" },
          { type: "text", key: "title", label: "Title" },
          { type: "text", key: "capacity", label: "Capacity", help: "e.g. 50MW – 250MW" },
          { type: "image", key: "image", label: "Photo" },
        ],
      },
    ],
  },
  {
    key: "insights",
    label: "Insights",
    description: "Heading above the latest blog posts. The posts themselves come from Posts.",
    anchor: "/#insights",
    fields: [...headline(), { type: "text", key: "linkLabel", label: "Link to blog" }],
  },
  {
    key: "contact",
    label: "How we work & contact",
    description: "The process timeline and the closing call to action.",
    anchor: "/#approach",
    fields: [
      { type: "text", key: "stepsTitle", label: "Timeline heading" },
      {
        type: "list",
        key: "steps",
        label: "Steps",
        itemLabel: "Step",
        help: "Numbered automatically: 01, 02, 03…",
        fields: [
          { type: "text", key: "title", label: "Title" },
          { type: "textarea", key: "detail", label: "Description" },
        ],
      },
      ...headline(),
      { type: "text", key: "buttonLabel", label: "Button" },
      { type: "text", key: "note", label: "Text next to the button" },
      { type: "image", key: "image", label: "Background photo" },
    ],
  },
  {
    key: "footer",
    label: "Footer",
    description: "Closing statement, description, offices and LinkedIn.",
    anchor: "/#contact",
    fields: [
      { type: "text", key: "line1", label: "Statement line 1" },
      { type: "text", key: "line2", label: "Statement line 2" },
      { type: "text", key: "accent", label: "Statement line 3 (gold)" },
      { type: "textarea", key: "description", label: "Description under the logo" },
      { type: "strings", key: "presence", label: "Offices", itemLabel: "City" },
      { type: "url", key: "linkedin", label: "LinkedIn URL" },
      { type: "image", key: "image", label: "Background photo" },
    ],
  },
  {
    key: "navigation",
    label: "Menu",
    description: "Links in the top menu and the footer.",
    anchor: "/",
    fields: [
      {
        type: "list",
        key: "items",
        label: "Menu links",
        itemLabel: "Link",
        help: "Section links: /#about, /#services, /#portfolio, /#approach, /#insights, /#contact. Blog: /blog",
        fields: [
          { type: "text", key: "title", label: "Label" },
          { type: "text", key: "href", label: "Link" },
        ],
      },
    ],
  },
]

/** An empty value for a field, used when adding a new list item. */
export function emptyValue(field: Field): unknown {
  switch (field.type) {
    case "image":
      return { src: "", alt: "" }
    case "strings":
      return []
    case "list":
      return []
    default:
      return ""
  }
}

export function emptyItem(fields: Field[]): unknown {
  // A list of a single key-less field (e.g. hero photos) stores the bare value.
  if (fields.length === 1 && fields[0]!.key === "") return emptyValue(fields[0]!)
  return Object.fromEntries(fields.map((f) => [f.key, emptyValue(f)]))
}
