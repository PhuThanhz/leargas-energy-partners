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
  User,
  Menu,
  X,
  Plus,
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
      <div className="flex min-h-screen items-center justify-center bg-[#f0f2f5] text-[#595959]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#1677ff] border-t-transparent" />
      </div>
    )
  }

  const auth = getStoredAuth()
  const user = auth.user || {
    fullName: "Quản trị viên",
    email: "admin@leargasenergy.com",
    role: "ROLE_ADMIN",
  }

  const handleLogout = () => {
    clearAuth()
    router.push("/admin/login")
  }

  const navItems = [
    { href: "/admin/dashboard", label: "Tổng quan", icon: LayoutDashboard },
    { href: "/admin/posts", label: "Quản lý Bài viết", icon: FileText },
    { href: "/admin/enquiries", label: "Yêu cầu Tư vấn (Leads)", icon: Inbox },
    { href: "/admin/settings", label: "Cài đặt Hệ thống", icon: Settings },
  ]

  // Breadcrumb label helper
  const getBreadcrumb = () => {
    if (pathname.includes("/admin/posts/new")) return ["Quản lý Bài viết", "Thêm bài mới"]
    if (pathname.includes("/admin/posts") && pathname.includes("/edit"))
      return ["Quản lý Bài viết", "Chỉnh sửa bài viết"]
    if (pathname.includes("/admin/posts")) return ["Quản lý Bài viết", "Danh sách"]
    if (pathname.includes("/admin/enquiries")) return ["Khách hàng & Tư vấn", "Danh sách Leads"]
    if (pathname.includes("/admin/settings")) return ["Hệ thống", "Cài đặt chung"]
    return ["Trang chủ", "Bảng điều khiển"]
  }

  const breadcrumbs = getBreadcrumb()

  return (
    <div className="flex min-h-screen bg-[#f0f2f5] font-sans text-[#000000e0]">
      {/* Sider chuẩn phong cách Ant Design Pro (Màu xanh đen Navy kinh điển #001529) */}
      <aside className="hidden w-60 shrink-0 flex-col bg-[#001529] text-white lg:flex">
        {/* Brand header */}
        <div className="flex h-14 items-center gap-2.5 border-b border-[#002140] px-5">
          <span className="font-serif text-lg font-medium tracking-[0.15em] text-white">
            LÉARGAS
          </span>
          <span className="rounded bg-[#1677ff] px-1.5 py-0.5 text-[10px] font-medium text-white">
            Admin
          </span>
        </div>

        {/* Nút hành động nhanh Ant Design */}
        <div className="p-3">
          <Link
            href="/admin/posts/new"
            className="flex w-full items-center justify-center gap-1.5 rounded-md bg-[#1677ff] px-3 py-2 text-xs font-medium text-white shadow-sm transition-all hover:bg-[#4096ff] active:bg-[#0958d9]"
          >
            <Plus className="h-3.5 w-3.5" />
            Thêm bài viết mới
          </Link>
        </div>

        {/* Danh sách Menu Navigation phong cách Ant Design Pro */}
        <nav className="flex-1 space-y-1 px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const active =
              pathname === item.href ||
              (item.href !== "/admin/dashboard" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-xs font-medium transition-all ${
                  active
                    ? "bg-[#1677ff] font-semibold text-white shadow-sm"
                    : "text-[#ffffffa6] hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-white" : "text-[#ffffffa6]"}`} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer Sider */}
        <div className="border-t border-[#002140] p-3 text-xs text-[#ffffff73]">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between rounded-md px-2 py-1.5 transition-colors hover:bg-white/5 hover:text-white"
          >
            <span className="flex items-center gap-1.5">
              <ExternalLink className="h-3.5 w-3.5" />
              Xem website khách
            </span>
            <span>↗</span>
          </Link>
        </div>
      </aside>

      {/* Vùng nội dung chính */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header trên cùng phong cách Ant Design Pro: Màu trắng tinh khôi, shadow nhẹ */}
        <header className="flex h-14 items-center justify-between border-b border-[#f0f0f0] bg-white px-6 shadow-[0_1px_4px_rgba(0,21,41,0.08)]">
          {/* Breadcrumb bên trái */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#8c8c8c]">{breadcrumbs[0]}</span>
            <span className="text-[#d9d9d9]">/</span>
            <span className="font-medium text-[#262626]">{breadcrumbs[1]}</span>
          </div>

          {/* User profile & Action bên phải */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="hidden items-center gap-1.5 text-xs text-[#595959] hover:text-[#1677ff] sm:flex"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Trang chủ
            </Link>

            <div className="hidden h-4 w-px bg-[#f0f0f0] sm:block" />

            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1677ff]/10 text-xs font-semibold text-[#1677ff]">
                <User className="h-4 w-4" />
              </div>
              <span className="text-xs font-medium text-[#262626]">
                {user?.fullName || "Quản trị viên"}
              </span>
            </div>

            <button
              onClick={handleLogout}
              title="Đăng xuất"
              className="flex items-center gap-1 text-xs text-[#ff4d4f] hover:text-[#cf1322] hover:underline"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Đăng xuất</span>
            </button>

            {/* Nút menu cho mobile */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded p-1.5 text-[#595959] hover:bg-[#f5f5f5] lg:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </header>

        {/* Dropdown Menu trên mobile */}
        {mobileOpen && (
          <div className="border-b border-[#f0f0f0] bg-white p-3 lg:hidden">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium text-[#595959] hover:bg-[#f5f5f5] hover:text-[#1677ff]"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-xs text-[#ff4d4f] hover:bg-[#fff2f0]"
              >
                <LogOut className="h-4 w-4" />
                Đăng xuất
              </button>
            </nav>
          </div>
        )}

        {/* Nội dung trang: Background màu Ant Design #f0f2f5 */}
        <main className="flex-1 p-6 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
