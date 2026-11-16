import { readFile } from "node:fs/promises"
import { join } from "node:path"

import { ImageResponse } from "next/og"

import { siteConfig } from "@/config/site"

export const alt = siteConfig.title
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public/brand/logo-on-dark.png"))
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background: "#01422e",
        color: "#ffffff",
      }}
    >
      <img src={logoSrc} width={420} height={114} alt="" />
      <div style={{ display: "flex", flexDirection: "column", fontSize: 64, lineHeight: 1.1 }}>
        <span>Where global capital meets</span>
        <span style={{ color: "#f9c21e" }}>Vietnam&apos;s energy future.</span>
      </div>
      <div
        style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 22, color: "#cfe0d8" }}
      >
        <div style={{ width: 28, height: 4, background: "#ee0f1f", transform: "skewX(-50deg)" }} />
        Boutique strategic &amp; investment advisory · Vietnam &amp; APAC
      </div>
    </div>,
    size
  )
}
