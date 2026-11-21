"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Layout, Menu, Button, Tooltip, ConfigProvider, Dropdown } from "antd"
import type { MenuProps } from "antd"
import {
  DashboardOutlined,
  FileTextOutlined,
  FolderOutlined,
  CustomerServiceOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  GlobalOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuOutlined,
  CloseOutlined,
  DownOutlined,
} from "@ant-design/icons"
import { LogoImage } from "@/components/shared/logo"

import { clearAuth, getStoredAuth, isAuthenticated } from "@/lib/api/admin-client"

const { Sider, Header, Content } = Layout
const emptySubscribe = () => () => {}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )

  const [collapsed, setCollapsed] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)

  // Khôi phục trạng thái thu gọn từ localStorage
  React.useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const saved = localStorage.getItem("leargas_sider_collapsed")
        if (saved === "true") {
          setCollapsed(true)
        }
      } catch {
        // ignore
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  const handleToggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem("leargas_sider_collapsed", String(next))
      } catch {
        // ignore
      }
      return next
    })
  }

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
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#059669] border-t-transparent" />
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

  const userMenuItems: MenuProps["items"] = [
    {
      key: "user-header",
      label: (
        <div className="px-1 py-1">
          <div className="font-semibold text-slate-900">
            {user?.fullName || "LÉARGAS Administrator"}
          </div>
          <div className="font-mono text-[11px] text-slate-500">
            {user?.email || "admin@leargasenergy.com"}
          </div>
          <div className="mt-1">
            <span className="py-0.2 rounded-full border border-emerald-200/60 bg-emerald-50 px-2 text-[10px] font-semibold text-emerald-700">
              ROLE_ADMIN
            </span>
          </div>
        </div>
      ),
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "settings",
      icon: <SettingOutlined className="text-slate-500" />,
      label: <Link href="/admin/settings">Settings</Link>,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      danger: true,
      icon: <LogoutOutlined />,
      label: "Sign out",
      onClick: handleLogout,
    },
  ]

  const menuItems = [
    {
      type: "group" as const,
      label: collapsed ? null : (
        <span className="text-[10px] font-bold tracking-wider text-white/35 uppercase">
          Overview
        </span>
      ),
      children: [
        {
          key: "/admin/dashboard",
          icon: <DashboardOutlined className="text-sm" />,
          label: "Dashboard",
        },
      ],
    },
    {
      type: "group" as const,
      label: collapsed ? null : (
        <span className="text-[10px] font-bold tracking-wider text-white/35 uppercase">
          Content
        </span>
      ),
      children: [
        {
          key: "/admin/website",
          icon: <GlobalOutlined className="text-sm" />,
          label: "Website",
        },
        {
          key: "/admin/posts",
          icon: <FileTextOutlined className="text-sm" />,
          label: "Posts",
        },
        {
          key: "/admin/categories",
          icon: <FolderOutlined className="text-sm" />,
          label: "Categories",
        },
      ],
    },
    {
      type: "group" as const,
      label: collapsed ? null : (
        <span className="text-[10px] font-bold tracking-wider text-white/35 uppercase">
          Clients & System
        </span>
      ),
      children: [
        {
          key: "/admin/enquiries",
          icon: <CustomerServiceOutlined className="text-sm" />,
          label: "Enquiries",
        },
        {
          key: "/admin/settings",
          icon: <SettingOutlined className="text-sm" />,
          label: "Settings",
        },
      ],
    },
  ]

  const flatKeys = [
    "/admin/dashboard",
    "/admin/website",
    "/admin/posts",
    "/admin/categories",
    "/admin/enquiries",
    "/admin/settings",
  ]

  // Xác định active menu item
  const selectedKey =
    flatKeys.find((key) =>
      key === "/admin/dashboard" ? pathname === key : pathname.startsWith(key)
    ) || "/admin/dashboard"

  const mobileMenuItems = [
    { key: "/admin/dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "/admin/website", icon: <GlobalOutlined />, label: "Website" },
    { key: "/admin/posts", icon: <FileTextOutlined />, label: "Posts" },
    { key: "/admin/categories", icon: <FolderOutlined />, label: "Categories" },
    { key: "/admin/enquiries", icon: <CustomerServiceOutlined />, label: "Enquiries" },
    { key: "/admin/settings", icon: <SettingOutlined />, label: "Settings" },
  ]

  // Breadcrumb label helper
  const getBreadcrumb = () => {
    if (pathname.includes("/admin/posts/new")) return ["Posts", "New post"]
    if (pathname.includes("/admin/posts") && pathname.includes("/edit"))
      return ["Posts", "Edit post"]
    if (pathname.includes("/admin/posts")) return ["Posts", "All posts"]
    if (pathname.includes("/admin/website")) return ["Content", "Website"]
    if (pathname.includes("/admin/categories")) return ["Content", "Categories"]
    if (pathname.includes("/admin/enquiries")) return ["Clients", "Enquiries"]
    if (pathname.includes("/admin/settings")) return ["System", "Settings"]
    return ["Home", "Dashboard"]
  }

  const breadcrumbs = getBreadcrumb()

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#059669",
          colorPrimaryHover: "#047857",
          colorPrimaryActive: "#065f46",
          borderRadius: 8,
          fontFamily:
            "var(--font-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          fontSize: 13,
        },
        components: {
          Menu: {
            darkItemBg: "transparent",
            darkItemSelectedBg: "rgba(5, 150, 105, 0.18)",
            darkItemColor: "rgba(255, 255, 255, 0.70)",
            darkItemSelectedColor: "#34d399",
            darkItemHoverBg: "rgba(255, 255, 255, 0.06)",
            darkItemHoverColor: "#ffffff",
            itemBorderRadius: 8,
            itemMarginInline: 10,
            itemMarginBlock: 4,
            itemHeight: 40,
          },
          Button: {
            colorPrimary: "#059669",
            colorPrimaryHover: "#047857",
            colorPrimaryActive: "#065f46",
            borderRadius: 8,
          },
          Layout: {
            siderBg: "#09121d",
            headerBg: "#ffffff",
            bodyBg: "#f0f2f5",
          },
        },
      }}
    >
      <Layout className="min-h-screen bg-[#f0f2f5]">
        {/* Ant Design Sider (Màu Dark Obsidian Navy sang trọng #09121d, hỗ trợ thu/phóng) */}
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(val) => setCollapsed(val)}
          trigger={null}
          width={248}
          collapsedWidth={80}
          theme="dark"
          className="hidden border-r border-white/[0.08] !bg-[#09121d] shadow-[4px_0_24px_rgba(0,0,0,0.12)] lg:block"
          style={{
            overflow: "auto",
            height: "100vh",
            position: "sticky",
            top: 0,
            left: 0,
          }}
        >
          <div className="flex h-full flex-col justify-between">
            <div>
              {/* Brand Header với Logo Doanh nghiệp & Tag Admin xanh ngọc mềm mại */}
              <div
                className={`flex h-16 items-center border-b border-white/[0.08] transition-all duration-200 select-none ${
                  collapsed ? "justify-center px-2" : "justify-between px-4"
                }`}
              >
                {collapsed ? (
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 font-serif text-base font-bold text-[#34d399] shadow-inner">
                    L
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5">
                    <div className="pointer-events-none w-[130px]">
                      <LogoImage tone="dark" className="h-auto w-[130px]" priority />
                    </div>
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 font-sans text-[10px] font-semibold tracking-wider text-[#34d399] uppercase shadow-2xs">
                      Admin
                    </span>
                  </div>
                )}
              </div>

              {/* Danh sách Menu Navigation Ant Design */}
              <div className="pt-2">
                <Menu
                  theme="dark"
                  mode="inline"
                  selectedKeys={[selectedKey]}
                  items={menuItems}
                  onClick={({ key }) => router.push(key)}
                  className="border-none !bg-transparent font-medium"
                />
              </div>
            </div>

            {/* Phần dưới Sider: Xem website & Nút thu gọn (Đã bỏ thẻ trạng thái theo yêu cầu) */}
            <div className="border-t border-white/[0.08] pt-2">
              {/* Nút Xem website khách */}
              <div className="px-3 pb-2 text-xs text-[#ffffff73]">
                {collapsed ? (
                  <Tooltip title="View website ↗" placement="right">
                    <Link
                      href="/"
                      target="_blank"
                      className="flex h-9 w-full items-center justify-center rounded-lg text-[#ffffffa6] transition-colors hover:bg-white/5 hover:text-white"
                    >
                      <GlobalOutlined className="text-base" />
                    </Link>
                  </Tooltip>
                ) : (
                  <Link
                    href="/"
                    target="_blank"
                    className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <span className="flex items-center gap-2">
                      <GlobalOutlined />
                      <span>View website</span>
                    </span>
                    <span className="text-white/40">↗</span>
                  </Link>
                )}
              </div>

              {/* Nút thu/mở Sider ở chân trang theo phong cách Ant Design */}
              <div
                onClick={handleToggleCollapse}
                className="flex h-11 cursor-pointer items-center justify-center border-t border-white/[0.08] text-white/60 transition-colors hover:bg-white/5 hover:text-white"
                title={collapsed ? "Expand menu" : "Collapse menu"}
              >
                {collapsed ? (
                  <MenuUnfoldOutlined className="text-base text-white" />
                ) : (
                  <div className="flex items-center gap-2 text-xs">
                    <MenuFoldOutlined className="text-base" />
                    <span>Collapse sidebar</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Sider>

        {/* Khung nội dung chính */}
        <Layout className="min-w-0 !bg-[#f0f2f5]">
          {/* Header phong cách Ant Design Pro: Màu trắng tinh khôi, shadow nhẹ */}
          <Header className="!flex !h-14 !items-center !justify-between !border-b !border-[#f0f0f0] !bg-white !px-4 !shadow-[0_1px_4px_rgba(0,21,41,0.08)] sm:!px-6">
            {/* Nút Toggle Sider & Breadcrumb bên trái */}
            <div className="flex items-center gap-3">
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={handleToggleCollapse}
                className="hidden !h-9 !w-9 !items-center !justify-center !text-base !text-[#595959] hover:!bg-[#f5f5f5] lg:!flex"
                title={collapsed ? "Expand menu" : "Collapse menu"}
              />

              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#8c8c8c]">{breadcrumbs[0]}</span>
                <span className="text-[#d9d9d9]">/</span>
                <span className="font-medium text-[#262626]">{breadcrumbs[1]}</span>
              </div>
            </div>

            {/* User profile & Action bên phải */}
            <div className="flex items-center gap-4">
              <Link
                href="/"
                target="_blank"
                className="hidden items-center gap-1.5 text-xs text-[#595959] transition-colors hover:text-[#059669] sm:flex"
              >
                <GlobalOutlined />
                Website
              </Link>

              <div className="hidden h-4 w-px bg-[#f0f0f0] sm:block" />

              <Dropdown menu={{ items: userMenuItems }} trigger={["click"]} placement="bottomRight">
                <div className="flex cursor-pointer items-center gap-2 rounded-full border border-slate-200/80 bg-slate-50/80 py-1 pr-3 pl-1.5 transition-all hover:border-slate-300 hover:bg-slate-100 active:scale-98">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#059669]/10 text-xs font-semibold text-[#059669]">
                    <UserOutlined />
                  </div>
                  <span className="text-xs font-medium text-slate-800">
                    {user?.fullName || "LÉARGAS Administrator"}
                  </span>
                  <DownOutlined className="text-[9px] text-slate-400" />
                </div>
              </Dropdown>

              {/* Nút menu cho mobile */}
              <Button
                type="text"
                icon={mobileOpen ? <CloseOutlined /> : <MenuOutlined />}
                onClick={() => setMobileOpen(!mobileOpen)}
                className="!h-9 !w-9 !text-[#595959] hover:!bg-[#f5f5f5] lg:!hidden"
              />
            </div>
          </Header>

          {/* Dropdown Menu trên mobile */}
          {mobileOpen && (
            <div className="border-b border-[#f0f0f0] bg-white p-3 lg:hidden">
              <nav className="space-y-1">
                {mobileMenuItems.map((item) => (
                  <Link
                    key={item.key}
                    href={item.key}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium text-[#595959] hover:bg-[#f5f5f5] hover:text-[#059669]"
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-xs text-[#ff4d4f] hover:bg-[#fff2f0]"
                >
                  <LogoutOutlined />
                  Sign out
                </button>
              </nav>
            </div>
          )}

          {/* Nội dung trang: Background màu Ant Design #f0f2f5 */}
          <Content className="p-4 sm:p-6">{children}</Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}
