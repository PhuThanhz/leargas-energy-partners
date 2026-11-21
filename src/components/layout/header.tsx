import { HeaderShell } from "@/components/layout/header-shell"
import { MobileNav } from "@/components/layout/mobile-nav"
import { NavLinks } from "@/components/layout/nav-links"
import { Logo } from "@/components/shared/logo"
import type { NavItem } from "@/types"

export function Header({ nav }: { nav: NavItem[] }) {
  return (
    <HeaderShell>
      <div className="wrap flex h-[68px] items-center justify-between gap-6 transition-[height] duration-500 md:h-[76px] md:group-data-[solid=true]:h-[68px]">
        <Logo />
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-9 text-[13.5px] xl:flex"
        >
          <NavLinks items={nav} />
        </nav>
        <MobileNav items={nav} />
      </div>
    </HeaderShell>
  )
}
