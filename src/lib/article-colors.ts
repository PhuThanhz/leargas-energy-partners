/** Site default reading background (matches `--stone-soft`). */
export const DEFAULT_ARTICLE_BG = "#f3efe5"

/** Curated light backgrounds that keep the dark body text readable and fit the brand. */
export const ARTICLE_BACKGROUNDS: { label: string; value: string }[] = [
  { label: "Mặc định", value: "" },
  { label: "Trắng", value: "#ffffff" },
  { label: "Ngà", value: "#faf7f0" },
  { label: "Cát", value: "#efe7d8" },
  { label: "Xanh lá nhạt", value: "#edf1ea" },
  { label: "Xanh sương", value: "#e9efef" },
]

/** Relative luminance (WCAG) of a #rrggbb colour, 0 (black) … 1 (white). */
export function luminance(hex: string): number {
  const m = /^#([0-9a-f]{6})$/i.exec(hex)
  if (!m) return 1
  const n = parseInt(m[1]!, 16)
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    const v = c / 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!
}

/** Body text is dark green-grey (#33463c); below this the article gets hard to read. */
export function isTooDarkForText(hex: string) {
  return luminance(hex) < 0.55
}
