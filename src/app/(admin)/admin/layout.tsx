"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  Inbox,
  Settings,
  ExternalLink,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  PlusCircle,
} from "lucide-react"

import { clearAuth, getStoredAuth, isAuthenticated } from "@/lib/api/admin-client"

const emptySubscribe = () => () => {}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const isLoginPage = pathname === "/admin/login"

  React.useEffect(() => {
    if (!isLoginPage && !isAuthenticated()) {
      router.push("/admin/login")
    }
  }, [isLoginPage, router])

  if (isLoginPage) {
    return <>{children}</>
  }

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07130e] text-[#e8dfc8]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#c9a050] border-t-transparent" />
      </div>
    )
  }

  const auth = getStoredAuth()
  const user = auth.user || {
    fullName: "Administrator",
    email: "admin@leargasenergy.com",
    role: "ROLE_ADMIN",
  }

  const handleLogout = () => {
    clearAuth()
    router.push("/admin/login")
  }

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/posts", label: "Articles (CMS)", icon: FileText },
    { href: "/admin/enquiries", label: "Enquiries (CRM)", icon: Inbox },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="flex min-h-screen bg-[#07130e] text-[#f2efe9]">
      {/* Sidebar for desktop */}
      <aside className="hidden w-64 flex-col border-r border-[#1a382b] bg-[#0a1b14] lg:flex">
        {/* Brand header */}
        <div className="flex h-18 items-center justify-between border-b border-[#1a382b] px-6">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <span className="font-serif text-lg font-light tracking-[0.18em] text-[#f9f6ee]">
              LÉARGAS
            </span>
            <span className="rounded bg-[#1a3d2c] px-1.5 py-0.5 text-[10px] font-medium tracking-wider text-[#d4af37] uppercase">
              Portal
            </span>
          </Link>
        </div>

        {/* Action button */}
        <div className="p-4">
          <Link
            href="/admin/posts/new"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#c9a050] px-4 py-2 text-xs font-semibold tracking-wider text-[#0a1b14] uppercase shadow-md transition-all hover:bg-[#dbb260] active:scale-[0.98]"
          >
            <PlusCircle className="h-4 w-4" />
            New Article
          </Link>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 space-y-1 px-3 py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const active =
              pathname === item.href ||
              (item.href !== "/admin/dashboard" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-[#163626] text-[#e8dfc8] shadow-sm"
                    : "text-[#9cb5a6] hover:bg-[#0f281e] hover:text-[#f2efe9]"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-[#c9a050]" : "text-[#7a9987]"}`} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer actions */}
        <div className="space-y-3 border-t border-[#1a382b] p-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between rounded-lg px-3 py-2 text-xs text-[#9cb5a6] transition-colors hover:bg-[#0f281e] hover:text-[#f2efe9]"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="h-3.5 w-3.5" />
              View Public Website
            </span>
            <span className="text-[10px] text-[#63806f]">↗</span>
          </Link>

          <div className="flex items-center justify-between border-t border-[#142d22] pt-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1b3d2d] text-xs font-bold text-[#c9a050]">
                {user?.fullName?.charAt(0) || "A"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-[#f2efe9]">
                  {user?.fullName || "Administrator"}
                </p>
                <p className="flex items-center gap-1 text-[10px] text-[#7a9987]">
                  <ShieldCheck className="h-3 w-3 text-[#c9a050]" />
                  {user?.role || "ROLE_ADMIN"}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              className="rounded p-1.5 text-[#7a9987] transition-colors hover:bg-[#1a382b] hover:text-[#f87171]"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content wrapper */}
      <div className="flex flex-1 flex-col overflow-x-hidden">
        {/* Mobile top bar */}
        <header className="flex h-16 items-center justify-between border-b border-[#1a382b] bg-[#0a1b14] px-4 lg:hidden">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <span className="font-serif text-base tracking-[0.18em] text-[#f9f6ee]">LÉARGAS</span>
            <span className="rounded bg-[#1a3d2c] px-1.5 py-0.5 text-[9px] font-medium text-[#d4af37] uppercase">
              Portal
            </span>
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded p-2 text-[#9cb5a6] hover:bg-[#112a1e]"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>

        {/* Mobile dropdown menu */}
        {mobileOpen && (
          <div className="border-b border-[#1a382b] bg-[#0a1b14] p-4 lg:hidden">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#9cb5a6] hover:bg-[#0f281e]"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
              <div className="pt-2">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#f87171] hover:bg-[#1f1515]"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </nav>
          </div>
        )}

        {/* Main page content area */}
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
