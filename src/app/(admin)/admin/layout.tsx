"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Layout, Menu, Button, Tooltip, ConfigProvider } from "antd"
import {
  DashboardOutlined,
  FileTextOutlined,
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
      key: "/admin/dashboard",
      icon: <DashboardOutlined className="text-sm" />,
      label: "Tổng quan",
    },
    {
      key: "/admin/posts",
      icon: <FileTextOutlined className="text-sm" />,
      label: "Quản lý Bài viết",
    },
    {
      key: "/admin/enquiries",
      icon: <CustomerServiceOutlined className="text-sm" />,
      label: "Yêu cầu Tư vấn (Leads)",
    },
    {
      key: "/admin/settings",
      icon: <SettingOutlined className="text-sm" />,
      label: "Cài đặt Hệ thống",
    },
  ]

  // Xác định active menu item
  const selectedKey =
    menuItems.find((item) =>
      item.key === "/admin/dashboard" ? pathname === item.key : pathname.startsWith(item.key)
    )?.key || "/admin/dashboard"

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
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1677ff",
          borderRadius: 6,
          fontFamily: "system-ui, -apple-system, sans-serif",
        },
        components: {
          Menu: {
            darkItemBg: "#001529",
            darkItemSelectedBg: "#1677ff",
            darkItemColor: "#ffffffa6",
            darkItemSelectedColor: "#ffffff",
            darkItemHoverBg: "rgba(255, 255, 255, 0.08)",
          },
          Layout: {
            siderBg: "#001529",
            headerBg: "#ffffff",
            bodyBg: "#f0f2f5",
          },
        },
      }}
    >
      <Layout className="min-h-screen bg-[#f0f2f5]">
        {/* Ant Design Sider (Màu xanh Navy kinh điển #001529, hỗ trợ thu/phóng) */}
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(val) => setCollapsed(val)}
          trigger={null}
          width={240}
          collapsedWidth={80}
          theme="dark"
          className="hidden !bg-[#001529] shadow-[2px_0_8px_0_rgba(29,35,41,0.05)] lg:block"
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
              {/* Brand Header */}
              <div
                className={`flex h-14 items-center border-b border-[#002140] transition-all duration-200 ${
                  collapsed ? "justify-center px-2" : "gap-2.5 px-5"
                }`}
              >
                {collapsed ? (
                  <span className="font-serif text-lg font-bold tracking-wider text-[#1677ff]">
                    L
                  </span>
                ) : (
                  <>
                    <span className="font-serif text-lg font-medium tracking-[0.15em] text-white">
                      LÉARGAS
                    </span>
                    <span className="rounded bg-[#1677ff] px-1.5 py-0.5 text-[10px] font-medium text-white">
                      Admin
                    </span>
                  </>
                )}
              </div>

              {/* Nút Thêm bài viết mới (Co giãn thông minh khi thu/mở) */}
              <div className="p-3">
                {collapsed ? (
                  <Tooltip title="Thêm bài viết mới" placement="right">
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => router.push("/admin/posts/new")}
                      className="!flex !h-10 !w-full !items-center !justify-center !rounded-lg !bg-[#1677ff] shadow-sm hover:!bg-[#4096ff]"
                    />
                  </Tooltip>
                ) : (
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => router.push("/admin/posts/new")}
                    className="!flex !h-9 !w-full !items-center !justify-center !gap-1.5 !rounded-lg !bg-[#1677ff] !text-xs !font-medium shadow-sm hover:!bg-[#4096ff]"
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
                className="border-none !bg-[#001529] font-medium"
              />
            </div>

            {/* Phần dưới Sider: Xem website & Nút thu gọn Ant Design */}
            <div>
              <div className="border-t border-[#002140] p-3 text-xs text-[#ffffff73]">
                {collapsed ? (
                  <Tooltip title="Xem website khách ↗" placement="right">
                    <Link
                      href="/"
                      target="_blank"
                      className="flex h-9 w-full items-center justify-center rounded-md text-[#ffffffa6] transition-colors hover:bg-white/5 hover:text-white"
                    >
                      <GlobalOutlined className="text-base" />
                    </Link>
                  </Tooltip>
                ) : (
                  <Link
                    href="/"
                    target="_blank"
                    className="flex items-center justify-between rounded-md px-2 py-1.5 text-[#ffffffa6] transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <span className="flex items-center gap-2">
                      <GlobalOutlined />
                      Xem website khách
                    </span>
                    <span>↗</span>
                  </Link>
                )}
              </div>

              {/* Nút thu/mở Sider ở chân trang theo phong cách Ant Design */}
              <div
                onClick={handleToggleCollapse}
                className="flex h-11 cursor-pointer items-center justify-center border-t border-[#002140] text-[#ffffffa6] transition-colors hover:bg-white/10 hover:text-white"
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
                {menuItems.map((item) => (
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
