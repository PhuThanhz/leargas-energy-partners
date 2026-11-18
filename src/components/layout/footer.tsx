import Image from "next/image"
import Link from "next/link"

import { BackToTop, FooterWordmark } from "@/components/layout/footer-motion"
import { LineDraw, RevealLines } from "@/components/motion/reveal"
import { LinkedInIcon } from "@/components/shared/linkedin-icon"
import { LogoImage } from "@/components/shared/logo"
import { mainNav } from "@/config/navigation"
import { siteConfig } from "@/config/site"
import { photos } from "@/content/media"

const presence = ["Hanoi", "Ho Chi Minh City"]

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-[#00140e] text-white">
      {/* Turbines on the horizon, barely there, with a warm glow behind the statement */}
      <Image
        src={photos.silhouette.src}
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover object-bottom opacity-[0.14] mix-blend-luminosity"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,#00140e_0%,rgba(0,20,14,0.85)_45%,rgba(0,20,14,0.6)_100%)]" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 -z-10 size-[700px] rounded-full bg-[radial-gradient(circle,rgba(246,231,180,0.08)_0%,transparent_70%)]"
      />

      <div className="wrap pt-[clamp(72px,12vh,128px)]">
        {/* Statement */}
        <div>
          <h2 className="font-heading text-[clamp(38px,5.2vw,80px)] leading-[1] font-semibold tracking-[-0.03em]">
            <RevealLines
              lines={[
                "Global perspective.",
                "Local insight.",
                <span key="2" className="text-gold-pale italic">
                  Lasting value.
                </span>,
              ]}
            />
          </h2>
        </div>

        <LineDraw className="mt-[clamp(48px,8vh,88px)] bg-white/12" />

        {/* Directory */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-[clamp(40px,7vh,72px)] lg:grid-cols-12 lg:gap-12">
          <div className="col-span-2 lg:col-span-4">
            <Link href="/" aria-label={`${siteConfig.name} home`} className="inline-block">
              <LogoImage className="w-[200px] md:w-[220px]" />
            </Link>
            <p className="mt-6 max-w-[340px] text-[14px] leading-[1.7] text-white/55">
              Boutique strategic and investment advisory, connecting international capital with
              energy across Vietnam.
            </p>
          </div>

          <nav aria-label="Footer" className="col-span-2 lg:col-span-3 lg:col-start-6">
            <p className="text-[13px] text-white/40">Explore</p>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-[15px]">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group/f relative text-white/80 transition-colors hover:text-white"
                  >
                    {item.title}
                    <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-gold-pale transition-transform duration-500 group-hover/f:scale-x-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-2">
            <p className="text-[13px] text-white/40">Presence</p>
            <ul className="mt-5 space-y-3 text-[15px] text-white/80">
              {presence.map((city) => (
                <li key={city}>{city}</li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="text-[13px] text-white/40">Connect</p>
            <a
              href={siteConfig.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-5 inline-flex items-center gap-3 text-[15px] text-white/80 transition-colors hover:text-white"
            >
              <LinkedInIcon className="size-7 transition-transform duration-300 group-hover:-translate-y-0.5" />
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      <FooterWordmark />

      <div className="relative border-t border-white/10">
        <div className="wrap flex flex-col items-start justify-between gap-4 py-6 text-[13px] text-white/45 sm:flex-row sm:items-center">
          <Copyright />
          <BackToTop />
        </div>
      </div>
    </footer>
  )
}

async function Copyright() {
  "use cache"
  return (
    <span>
      &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
    </span>
  )
}
