/** Vietnamese-aware slug: "Định hướng PDP8" → "dinh-huong-pdp8". */
export function slugify(text: string): string {
  return text
    .replace(/[đĐ]/g, "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s-]+/g, "-")
}

/**
 * Give every <h2>/<h3> without an id a stable, unique id derived from its text,
 * so the public article can build its table of contents and anchor links.
 */
export function addHeadingIds(html: string): string {
  const used = new Set<string>()
  for (const [, id] of html.matchAll(/<h[23][^>]*\sid="([^"]+)"/g)) used.add(id!)

  return html.replace(/<h([23])((?:\s[^>]*)?)>([\s\S]*?)<\/h\1>/g, (match, level, attrs, inner) => {
    if (/\sid="/.test(attrs)) return match
    const base = slugify(inner.replace(/<[^>]+>/g, "").replace(/&[a-z#0-9]+;/gi, " ")) || "muc"
    let id = base
    for (let n = 2; used.has(id); n++) id = `${base}-${n}`
    used.add(id)
    return `<h${level}${attrs} id="${id}">${inner}</h${level}>`
  })
}

/** Build a table of contents from `<h2 id="…">` headings in the post HTML. */
export function getTableOfContents(html: string) {
  return [...html.matchAll(/<h2[^>]*\sid="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/g)].map(
    ([, id, title]) => ({
      id: id!,
      title: title!.replace(/<[^>]+>/g, ""),
    })
  )
}
