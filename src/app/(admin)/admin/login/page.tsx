"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { User, Lock, Eye, EyeOff, AlertCircle } from "lucide-react"

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
    <div className="flex min-h-screen items-center justify-center bg-[#f5f6f8] px-4 py-12">
      <div className="w-full max-w-[380px]">
        {/* Khối Card Đăng nhập tối giản, thanh lịch, chuẩn doanh nghiệp */}
        <div className="rounded-xl border border-[#e8e9eb] bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          {/* Logo chính thức */}
          <div className="mb-7 flex flex-col items-center text-center">
            <Link href="/" className="inline-block transition-opacity hover:opacity-90">
              <LogoImage tone="light" className="w-[170px]" priority />
            </Link>
            <p className="mt-3 text-xs text-[#8c8c8c]">Hệ thống Quản trị Doanh nghiệp</p>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-md border border-[#ffccc7] bg-[#fff2f0] p-2.5 text-xs text-[#cf1322]">
              <AlertCircle className="h-4 w-4 shrink-0 text-[#ff4d4f]" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Tên đăng nhập */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#262626]">
                Tên đăng nhập
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#bfbfbf]">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full rounded-md border border-[#d9d9d9] bg-white py-2 pr-3 pl-9 text-sm text-[#262626] transition-all hover:border-[#0f2b20] focus:border-[#0f2b20] focus:ring-1 focus:ring-[#0f2b20] focus:outline-none"
                />
              </div>
            </div>

            {/* Mật khẩu */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#262626]">Mật khẩu</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#bfbfbf]">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-md border border-[#d9d9d9] bg-white py-2 pr-10 pl-9 text-sm text-[#262626] transition-all hover:border-[#0f2b20] focus:border-[#0f2b20] focus:ring-1 focus:ring-[#0f2b20] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#bfbfbf] hover:text-[#595959]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Tùy chọn */}
            <div className="flex items-center justify-between pt-0.5 text-xs">
              <label className="flex cursor-pointer items-center gap-1.5 text-[#595959]">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-[#d9d9d9] text-[#0f2b20] focus:ring-[#0f2b20]"
                />
                Ghi nhớ đăng nhập
              </label>
              <button
                type="button"
                onClick={fillDemo}
                className="font-medium text-[#0f2b20] hover:underline"
              >
                Điền mẫu
              </button>
            </div>

            {/* Nút bấm Đăng nhập chuẩn tone màu LÉARGAS */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center rounded-md bg-[#0f2b20] py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#163f30] active:scale-[0.99] disabled:opacity-60"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                "Đăng nhập"
              )}
            </button>
          </form>

          {/* Gợi ý tài khoản mẫu gọn gàng */}
          <div className="mt-6 border-t border-[#f0f0f0] pt-4 text-center text-[11px] text-[#8c8c8c]">
            Tài khoản thử nghiệm:{" "}
            <span className="font-mono font-medium text-[#262626]">admin / admin123</span>
          </div>
        </div>

        {/* Bản quyền tối giản */}
        <p className="mt-6 text-center text-xs text-[#bfbfbf]">
          © {new Date().getFullYear()} LÉARGAS Energy Partners
        </p>
      </div>
    </div>
  )
}
