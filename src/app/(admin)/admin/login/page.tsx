"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Check,
  ShieldCheck,
  Sparkles,
} from "lucide-react"

import { LogoImage } from "@/components/shared/logo"
import { saveAuth } from "@/lib/api/admin-client"

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = React.useState("admin")
  const [password, setPassword] = React.useState("admin123")
  const [showPassword, setShowPassword] = React.useState(false)
  const [remember, setRemember] = React.useState(true)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // 1. Gửi request xác thực sang Spring Boot backend
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      }).catch(() => null)

      if (res && res.ok) {
        const data = await res.json()
        saveAuth(data.token, data.user)
        router.push("/admin/dashboard")
        return
      }

      // 2. Fallback chế độ demo nếu backend chưa khởi động
      if (username === "admin" && password === "admin123") {
        saveAuth("demo-jwt-token-leargas-2026", {
          id: 1,
          username: "admin",
          email: "admin@leargasenergy.com",
          fullName: "Quản trị viên LÉARGAS",
          role: "ROLE_ADMIN",
        })
        router.push("/admin/dashboard")
        return
      }

      setError("Tên đăng nhập hoặc mật khẩu không chính xác.")
    } catch {
      setError("Không thể kết nối đến máy chủ xác thực.")
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = () => {
    setUsername("admin")
    setPassword("admin123")
    setError(null)
  }

  return (
    <div className="flex min-h-screen bg-[#fcfbf9]">
      {/* Cột Trái (Hero Showcase): Hiện trên màn hình lớn với ảnh nền năng lượng & tone xanh thương hiệu sang trọng */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-[#071710] p-12 text-[#f7f5ed] lg:flex xl:w-7/12">
        {/* Background Image với lớp gradient tone xanh rêu ngọc bảo (Forest Emerald) */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/wind.jpg"
            alt="LÉARGAS Clean Energy Infrastructure"
            fill
            priority
            className="object-cover object-center brightness-[0.45] contrast-[1.1] filter"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06140e] via-[#091f16]/80 to-[#071710]/90" />
        </div>

        {/* Logo trên nền tối ở góc trên */}
        <div className="relative z-10">
          <Link href="/" className="inline-block transition-opacity hover:opacity-90">
            <LogoImage tone="dark" className="w-[180px] md:w-[210px]" priority />
          </Link>
        </div>

        {/* Nội dung điểm nhấn thương hiệu giữa trang */}
        <div className="relative z-10 max-w-xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-xs font-medium tracking-wide text-[#e8dfc8] backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-[#c9a050]" />
            <span>Cổng Điều hành & Quản trị Doanh nghiệp</span>
          </div>

          <h2 className="font-serif text-3xl leading-snug font-light tracking-wide text-white sm:text-4xl">
            Kết nối Vốn Quốc tế & Phát triển Dự án Năng lượng Sạch.
          </h2>

          <p className="text-sm leading-relaxed font-light text-[#c0d4c8]">
            Đồng hành cùng các nhà đầu tư tổ chức, quỹ cơ sở hạ tầng và đối tác năng lượng tái tạo
            hàng đầu tại Việt Nam.
          </p>

          {/* Các chỉ số thống kê tiêu biểu */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <div className="font-serif text-2xl font-light text-white">26–38 GW</div>
              <div className="mt-0.5 text-xs text-[#9bb8a8]">Mục tiêu Điện gió PDP8</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <div className="font-serif text-2xl font-light text-white">10–15% / năm</div>
              <div className="mt-0.5 text-xs text-[#9bb8a8]">Tăng trưởng nhu cầu điện</div>
            </div>
          </div>
        </div>

        {/* Footer bên trái */}
        <div className="relative z-10 flex items-center justify-between text-xs text-[#7e9e8f]">
          <span>© {new Date().getFullYear()} LÉARGAS Energy Partners Pte. Ltd.</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-[#c9a050]" />
            Bảo mật cấp doanh nghiệp
          </span>
        </div>
      </div>

      {/* Cột Phải: Form Đăng nhập sạch sẽ, ấn tượng theo tone màu */}
      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:w-1/2 xl:w-5/12">
        <div className="mx-auto w-full max-w-[390px] space-y-7">
          {/* Logo trên nền sáng */}
          <div>
            <Link href="/" className="inline-block transition-opacity hover:opacity-90">
              <LogoImage tone="light" className="w-[180px] sm:w-[210px]" priority />
            </Link>
            <h1 className="mt-6 text-2xl font-semibold text-[#0c241b]">Đăng nhập Quản trị</h1>
            <p className="mt-1 text-xs text-[#718279]">
              Nhập tài khoản được cấp quyền để truy cập hệ thống
            </p>
          </div>

          {/* Hộp thông báo lỗi */}
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-[#ffccc7] bg-[#fff2f0] p-3 text-xs text-[#cf1322]">
              <AlertCircle className="h-4 w-4 shrink-0 text-[#ff4d4f]" />
              <span>{error}</span>
            </div>
          )}

          {/* Form đăng nhập */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Tên đăng nhập */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#1e382d]">
                Tên đăng nhập hoặc Email
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#88a093]">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full rounded-lg border border-[#d8dcd7] bg-white py-2.5 pr-3.5 pl-10 text-sm text-[#0c241b] placeholder-[#a2b4aa] transition-all hover:border-[#1e4e3a] focus:border-[#0f2b20] focus:ring-2 focus:ring-[#0f2b20]/15 focus:outline-none"
                />
              </div>
            </div>

            {/* Mật khẩu */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#1e382d]">Mật khẩu</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#88a093]">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-[#d8dcd7] bg-white py-2.5 pr-10 pl-10 text-sm text-[#0c241b] placeholder-[#a2b4aa] transition-all hover:border-[#1e4e3a] focus:border-[#0f2b20] focus:ring-2 focus:ring-[#0f2b20]/15 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#88a093] hover:text-[#0c241b]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Ghi nhớ & Điền mẫu */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex cursor-pointer items-center gap-2 text-xs text-[#52665b]">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-[#c2cbbf] text-[#0f2b20] focus:ring-[#0f2b20]"
                />
                Ghi nhớ đăng nhập
              </label>
              <button
                type="button"
                onClick={fillDemo}
                className="text-xs font-medium text-[#134431] hover:text-[#081f16] hover:underline"
              >
                Điền tài khoản mẫu
              </button>
            </div>

            {/* Nút bấm Đăng nhập theo tone màu xanh sang trọng */}
            <button
              type="submit"
              disabled={loading}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-[#0c241b] py-3 text-sm font-medium text-white shadow-md transition-all hover:bg-[#133829] active:scale-[0.99] disabled:opacity-60"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  Đăng nhập vào Portal
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Gợi ý thông tin đăng nhập mẫu */}
          <div className="rounded-xl border border-[#e1e6e0] bg-[#f4f7f3] p-4 text-xs text-[#4d6356]">
            <div className="flex items-center justify-between">
              <span className="font-medium text-[#133d2c]">Tài khoản thử nghiệm sẵn:</span>
              <button
                type="button"
                onClick={fillDemo}
                className="flex items-center gap-1 font-semibold text-[#133d2c] hover:underline"
              >
                <Check className="h-3.5 w-3.5" /> Điền nhanh
              </button>
            </div>
            <div className="mt-1.5 flex items-center gap-4 font-mono text-[11px] text-[#284838]">
              <span>
                Tên: <strong>admin</strong>
              </span>
              <span>
                Mật khẩu: <strong>admin123</strong>
              </span>
            </div>
          </div>

          {/* Mobile Footer */}
          <p className="text-center text-xs text-[#8c9c93] lg:hidden">
            © {new Date().getFullYear()} LÉARGAS Energy Partners Pte. Ltd.
          </p>
        </div>
      </div>
    </div>
  )
}
