"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { User, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Check } from "lucide-react"

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
    <div className="relative flex min-h-screen items-center justify-center bg-[#f4f6f4] px-4 py-16">
      {/* Vùng hiệu ứng ánh sáng ngọc lục bảo tinh tế ở nền */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0f2b20]/[0.035] blur-3xl" />
      </div>

      {/* Khung Card Form: Bo góc tròn mượt mà (rounded-3xl), kích thước to rộng rãi (max-w-[460px]) */}
      <div className="relative w-full max-w-[460px]">
        <div className="rounded-3xl border border-[#e2e8e3] bg-white p-8 shadow-[0_20px_50px_-15px_rgba(15,43,32,0.08),0_0_0_1px_rgba(15,43,32,0.03)] sm:p-11">
          {/* Khu vực Logo ấn tượng với kích thước lớn và hiệu ứng sang trọng */}
          <div className="mb-8 flex flex-col items-center text-center">
            {/* Khung viền bo tròn mềm mại cho Logo */}
            <div className="relative flex w-full items-center justify-center rounded-2xl border border-[#e8efe9] bg-gradient-to-b from-[#fbfdfb] to-[#f4f7f4] px-4 py-6 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]">
              <Link href="/" className="inline-block transition-transform hover:scale-[1.02]">
                <LogoImage tone="light" className="w-[230px] sm:w-[260px]" priority />
              </Link>
            </div>

            <p className="mt-3.5 text-xs font-medium tracking-wide text-[#6c7f74]">
              Hệ thống Quản trị & Điều hành Doanh nghiệp
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-[#ffccc7] bg-[#fff2f0] p-3 text-xs text-[#cf1322]">
              <AlertCircle className="h-4 w-4 shrink-0 text-[#ff4d4f]" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Tên đăng nhập */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#1c3327]">
                Tên đăng nhập
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#8aa093]">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full rounded-xl border border-[#d3ded6] bg-[#fbfdfb] py-3 pr-3.5 pl-10 text-sm text-[#1c3327] transition-all hover:border-[#0f2b20] focus:border-[#0f2b20] focus:bg-white focus:ring-4 focus:ring-[#0f2b20]/10 focus:outline-none"
                />
              </div>
            </div>

            {/* Mật khẩu */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#1c3327]">Mật khẩu</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#8aa093]">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[#d3ded6] bg-[#fbfdfb] py-3 pr-11 pl-10 text-sm text-[#1c3327] transition-all hover:border-[#0f2b20] focus:border-[#0f2b20] focus:bg-white focus:ring-4 focus:ring-[#0f2b20]/10 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#8aa093] hover:text-[#1c3327]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Ghi nhớ & Điền mẫu */}
            <div className="flex items-center justify-between pt-0.5 text-xs">
              <label className="flex cursor-pointer items-center gap-2 text-[#566e61]">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded-md border-[#c7d5cb] text-[#0f2b20] focus:ring-[#0f2b20]"
                />
                Ghi nhớ đăng nhập
              </label>
              <button
                type="button"
                onClick={fillDemo}
                className="font-medium text-[#0f2b20] hover:text-[#184634] hover:underline"
              >
                Điền tài khoản mẫu
              </button>
            </div>

            {/* Nút bấm Đăng nhập to đẹp, bo góc bo tròn, màu xanh chuẩn LÉARGAS */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f2b20] py-3.5 text-[15px] font-semibold text-white shadow-[0_4px_16px_rgba(15,43,32,0.22)] transition-all hover:bg-[#153b2d] hover:shadow-[0_6px_20px_rgba(15,43,32,0.3)] active:scale-[0.99] disabled:opacity-60"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  Đăng nhập
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Hộp gợi ý tài khoản mẫu bo góc tròn mượt mà */}
          <div className="mt-7 rounded-2xl border border-[#e3ebe4] bg-[#f7faf7] p-3.5 text-xs text-[#526a5c]">
            <div className="flex items-center justify-between">
              <span className="font-medium text-[#1c3b2b]">Tài khoản thử nghiệm:</span>
              <button
                type="button"
                onClick={fillDemo}
                className="flex items-center gap-1 font-semibold text-[#0f2b20] hover:underline"
              >
                <Check className="h-3.5 w-3.5" /> Tự động điền
              </button>
            </div>
            <div className="mt-1 flex items-center gap-4 font-mono text-[11px] text-[#2c4737]">
              <span>
                Tên: <strong>admin</strong>
              </span>
              <span>
                Mật khẩu: <strong>admin123</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Footer bản quyền */}
        <p className="mt-7 text-center text-xs text-[#8c9f94]">
          © {new Date().getFullYear()} LÉARGAS Energy Partners
        </p>
      </div>
    </div>
  )
}
