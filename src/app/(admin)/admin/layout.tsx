"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Layout, Menu, Button, Tooltip, ConfigProvider } from "antd"
import {
  DashboardOutlined,
  FileTextOutlined,
  FolderOutlined,
  PictureOutlined,
  CustomerServiceOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlusOutlined,
  GlobalOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuOutlined,
  CloseOutlined,
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

  const menuItems = [
    {
      type: "group" as const,
      label: collapsed ? null : (
        <span className="text-[10px] font-bold tracking-wider text-white/35 uppercase">
          Tổng quan & Phân tích
        </span>
      ),
      children: [
        {
          key: "/admin/dashboard",
          icon: <DashboardOutlined className="text-sm" />,
          label: "Bảng điều khiển",
        },
      ],
    },
    {
      type: "group" as const,
      label: collapsed ? null : (
        <span className="text-[10px] font-bold tracking-wider text-white/35 uppercase">
          Quản trị Nội dung
        </span>
      ),
      children: [
        {
          key: "/admin/posts",
          icon: <FileTextOutlined className="text-sm" />,
          label: (
            <div className="flex items-center justify-between">
              <span>Quản lý Bài viết</span>
              {!collapsed && (
                <span className="py-0.2 rounded-full bg-white/10 px-1.5 text-[10px] font-medium text-white/60">
                  4
                </span>
              )}
            </div>
          ),
        },
        {
          key: "/admin/categories",
          icon: <FolderOutlined className="text-sm" />,
          label: "Chuyên mục (Taxonomy)",
        },
        {
          key: "/admin/media",
          icon: <PictureOutlined className="text-sm" />,
          label: "Thư viện Ảnh & File",
        },
      ],
    },
    {
      type: "group" as const,
      label: collapsed ? null : (
        <span className="text-[10px] font-bold tracking-wider text-white/35 uppercase">
          Khách hàng & Hệ thống
        </span>
      ),
      children: [
        {
          key: "/admin/enquiries",
          icon: <CustomerServiceOutlined className="text-sm" />,
          label: (
            <div className="flex items-center justify-between">
              <span>Yêu cầu Tư vấn</span>
              {!collapsed && (
                <span className="py-0.2 rounded-full bg-[#ff4d4f] px-1.5 text-[10px] font-bold text-white shadow-xs">
                  Mới
                </span>
              )}
            </div>
          ),
        },
        {
          key: "/admin/settings",
          icon: <SettingOutlined className="text-sm" />,
          label: "Cài đặt Hệ thống",
        },
      ],
    },
  ]

  const flatKeys = [
    "/admin/dashboard",
    "/admin/posts",
    "/admin/categories",
    "/admin/media",
    "/admin/enquiries",
    "/admin/settings",
  ]

  // Xác định active menu item
  const selectedKey =
    flatKeys.find((key) =>
      key === "/admin/dashboard" ? pathname === key : pathname.startsWith(key)
    ) || "/admin/dashboard"

  const mobileMenuItems = [
    { key: "/admin/dashboard", icon: <DashboardOutlined />, label: "Bảng điều khiển" },
    { key: "/admin/posts", icon: <FileTextOutlined />, label: "Quản lý Bài viết" },
    { key: "/admin/categories", icon: <FolderOutlined />, label: "Chuyên mục (Taxonomy)" },
    { key: "/admin/media", icon: <PictureOutlined />, label: "Thư viện Ảnh & File" },
    { key: "/admin/enquiries", icon: <CustomerServiceOutlined />, label: "Yêu cầu Tư vấn (Leads)" },
    { key: "/admin/settings", icon: <SettingOutlined />, label: "Cài đặt Hệ thống" },
  ]

  // Breadcrumb label helper
  const getBreadcrumb = () => {
    if (pathname.includes("/admin/posts/new")) return ["Quản lý Bài viết", "Thêm bài mới"]
    if (pathname.includes("/admin/posts") && pathname.includes("/edit"))
      return ["Quản lý Bài viết", "Chỉnh sửa bài viết"]
    if (pathname.includes("/admin/posts")) return ["Quản lý Bài viết", "Danh sách"]
    if (pathname.includes("/admin/categories")) return ["Nội dung CMS", "Quản lý Chuyên mục"]
    if (pathname.includes("/admin/media")) return ["Nội dung CMS", "Thư viện Hình ảnh"]
    if (pathname.includes("/admin/enquiries")) return ["Khách hàng & Tư vấn", "Danh sách Leads"]
    if (pathname.includes("/admin/settings")) return ["Hệ thống", "Cài đặt chung"]
    return ["Trang chủ", "Bảng điều khiển"]
  }

  const breadcrumbs = getBreadcrumb()

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1677ff",
          borderRadius: 8,
          fontFamily:
            "var(--font-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          fontSize: 13,
        },
        components: {
          Menu: {
            darkItemBg: "transparent",
            darkItemSelectedBg: "rgba(22, 119, 255, 0.15)",
            darkItemColor: "rgba(255, 255, 255, 0.70)",
            darkItemSelectedColor: "#ffffff",
            darkItemHoverBg: "rgba(255, 255, 255, 0.06)",
            darkItemHoverColor: "#ffffff",
            itemBorderRadius: 8,
            itemMarginInline: 10,
            itemMarginBlock: 4,
            itemHeight: 40,
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
              {/* Brand Header với Logo Doanh nghiệp & Tag Admin */}
              <div
                className={`flex h-16 items-center border-b border-white/[0.08] transition-all duration-200 select-none ${
                  collapsed ? "justify-center px-2" : "justify-between px-4"
                }`}
              >
                {collapsed ? (
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10 font-serif text-base font-bold text-[#40a9ff] shadow-inner">
                    L
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5">
                    <div className="pointer-events-none w-[130px]">
                      <LogoImage tone="dark" className="h-auto w-[130px]" priority />
                    </div>
                    <span className="rounded-full border border-blue-400/30 bg-blue-500/15 px-2 py-0.5 font-sans text-[10px] font-bold tracking-wider text-[#40a9ff] uppercase shadow-2xs">
                      Admin
                    </span>
                  </div>
                )}
              </div>

              {/* Nút Thêm bài viết mới (Co giãn thông minh khi thu/mở) */}
              <div className="p-3">
                {collapsed ? (
                  <Tooltip title="Thêm bài viết mới" placement="right">
                    <Button
                      type="primary"
                      icon={<PlusOutlined className="text-base text-white" />}
                      onClick={() => router.push("/admin/posts/new")}
                      className="!flex !h-10 !w-full !items-center !justify-center !rounded-xl !border !border-blue-400/30 !bg-gradient-to-r !from-[#1677ff] !to-[#0958d9] !shadow-[0_4px_12px_rgba(22,119,255,0.25)] transition-all hover:!from-[#4096ff] hover:!to-[#1677ff] hover:!shadow-[0_6px_16px_rgba(22,119,255,0.35)]"
                    />
                  </Tooltip>
                ) : (
                  <Button
                    type="primary"
                    icon={<PlusOutlined className="text-sm text-white" />}
                    onClick={() => router.push("/admin/posts/new")}
                    className="!flex !h-10 !w-full !items-center !justify-center !gap-2 !rounded-xl !border !border-blue-400/30 !bg-gradient-to-r !from-[#1677ff] !to-[#0958d9] !text-xs !font-semibold !text-white !shadow-[0_4px_12px_rgba(22,119,255,0.25)] transition-all hover:!from-[#4096ff] hover:!to-[#1677ff] hover:!shadow-[0_6px_16px_rgba(22,119,255,0.35)] active:scale-[0.98]"
                  >
                    Thêm bài viết mới
                  </Button>
                )}
              </div>

              {/* Danh sách Menu Navigation Ant Design */}
              <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[selectedKey]}
                items={menuItems}
                onClick={({ key }) => router.push(key)}
                className="border-none !bg-transparent font-medium"
              />
            </div>

            {/* Phần dưới Sider: Thẻ trạng thái, Xem website & Nút thu gọn */}
            <div className="border-t border-white/[0.08] pt-2">
              {/* Thẻ trạng thái hoạt động */}
              {!collapsed && (
                <div className="mx-3 mb-2 rounded-xl border border-white/[0.06] bg-white/[0.03] p-2.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 font-medium text-white/80">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                      </span>
                      <span>Hệ thống hoạt động</span>
                    </div>
                    <span className="font-mono text-[10px] text-white/40">v2.4</span>
                  </div>
                </div>
              )}

              {/* Nút Xem website khách */}
              <div className="px-3 pb-2 text-xs text-[#ffffff73]">
                {collapsed ? (
                  <Tooltip title="Xem website khách ↗" placement="right">
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
                      <span>Xem website khách</span>
                    </span>
                    <span className="text-white/40">↗</span>
                  </Link>
                )}
              </div>

              {/* Nút thu/mở Sider ở chân trang theo phong cách Ant Design */}
              <div
                onClick={handleToggleCollapse}
                className="flex h-11 cursor-pointer items-center justify-center border-t border-white/[0.08] text-white/60 transition-colors hover:bg-white/5 hover:text-white"
                title={collapsed ? "Mở rộng thanh menu" : "Thu gọn thanh menu"}
              >
                {collapsed ? (
                  <MenuUnfoldOutlined className="text-base text-white" />
                ) : (
                  <div className="flex items-center gap-2 text-xs">
                    <MenuFoldOutlined className="text-base" />
                    <span>Thu gọn thanh điều hướng</span>
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
                title={collapsed ? "Mở rộng thanh menu" : "Thu gọn thanh menu"}
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
                className="hidden items-center gap-1.5 text-xs text-[#595959] transition-colors hover:text-[#1677ff] sm:flex"
              >
                <GlobalOutlined />
                Trang chủ
              </Link>

              <div className="hidden h-4 w-px bg-[#f0f0f0] sm:block" />

              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1677ff]/10 text-xs font-semibold text-[#1677ff]">
                  <UserOutlined />
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
                <LogoutOutlined />
                <span className="hidden sm:inline">Đăng xuất</span>
              </button>

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
                    className="flex items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium text-[#595959] hover:bg-[#f5f5f5] hover:text-[#1677ff]"
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
                  Đăng xuất
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
