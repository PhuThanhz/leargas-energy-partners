"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { User, Lock, Eye, EyeOff, ArrowRight } from "lucide-react"
import { toast } from "sonner"

import { LogoImage } from "@/components/shared/logo"
import { saveAuth } from "@/lib/api/admin-client"

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [remember, setRemember] = React.useState(true)
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Gọi trực tiếp đến Backend Spring Boot (xác thực MySQL & cấp JWT)
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        let errorMsg = data?.detail || data?.title || "Tên đăng nhập hoặc mật khẩu không chính xác."
        if (errorMsg === "Invalid username or password") {
          errorMsg = "Tên đăng nhập hoặc mật khẩu không chính xác."
        }
        toast.error("Đăng nhập thất bại", {
          description: errorMsg,
        })
        return
      }

      // Lưu JWT Token và User Principal từ Spring Boot
      saveAuth(data.token, data.user)

      toast.success("Đăng nhập thành công!", {
        description: `Xin chào, ${data.user?.fullName || data.user?.username || "Quản trị viên"}.`,
      })

      // Chuyển hướng sang trang Dashboard
      setTimeout(() => {
        router.push("/admin/dashboard")
      }, 400)
    } catch {
      toast.error("Không thể kết nối đến máy chủ", {
        description: "Vui lòng kiểm tra lại dịch vụ Backend Spring Boot (cổng 8080).",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#f4f6f4] px-4 py-16">
      {/* Vùng hiệu ứng ánh sáng nền tinh tế */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0f2b20]/[0.035] blur-3xl" />
      </div>

      {/* Khung Card Form to rộng rãi, bo góc tròn mượt mà */}
      <div className="relative w-full max-w-[460px]">
        <div className="rounded-3xl border border-[#e2e8e3] bg-white p-8 shadow-[0_20px_50px_-15px_rgba(15,43,32,0.08),0_0_0_1px_rgba(15,43,32,0.03)] sm:p-11">
          {/* Khu vực Logo ấn tượng */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="relative flex w-full cursor-default items-center justify-center rounded-2xl border border-[#e8efe9] bg-gradient-to-b from-[#fbfdfb] to-[#f4f7f4] px-4 py-6 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)] select-none">
              <div className="pointer-events-none inline-block select-none">
                <LogoImage tone="light" className="w-[230px] sm:w-[260px]" priority />
              </div>
            </div>

            <p className="mt-3.5 text-xs font-medium tracking-wide text-[#6c7f74]">
              Hệ thống Quản trị & Điều hành Doanh nghiệp
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Tên đăng nhập */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#1c3327]">
                Tên đăng nhập hoặc Email
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#8aa093]">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nhập tên đăng nhập hoặc email"
                  className="w-full rounded-xl border border-[#d3ded6] bg-[#fbfdfb] py-3 pr-3.5 pl-10 text-sm text-[#1c3327] placeholder-[#a2b4aa] transition-all hover:border-[#0f2b20] focus:border-[#0f2b20] focus:bg-white focus:ring-4 focus:ring-[#0f2b20]/10 focus:outline-none"
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
                  placeholder="Nhập mật khẩu của bạn"
                  className="w-full rounded-xl border border-[#d3ded6] bg-[#fbfdfb] py-3 pr-11 pl-10 text-sm text-[#1c3327] placeholder-[#a2b4aa] transition-all hover:border-[#0f2b20] focus:border-[#0f2b20] focus:bg-white focus:ring-4 focus:ring-[#0f2b20]/10 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#8aa093] hover:text-[#1c3327]"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Ghi nhớ đăng nhập */}
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
            </div>

            {/* Nút bấm Đăng nhập chuẩn tone màu LÉARGAS */}
            <button
              type="submit"
              disabled={loading}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f2b20] py-3.5 text-[15px] font-semibold text-white shadow-[0_4px_16px_rgba(15,43,32,0.22)] transition-all hover:bg-[#153b2d] hover:shadow-[0_6px_20px_rgba(15,43,32,0.3)] active:scale-[0.99] disabled:opacity-60"
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
        </div>

        {/* Footer bản quyền */}
        <p className="mt-7 text-center text-xs text-[#8c9f94]">
          © {new Date().getFullYear()} LÉARGAS Energy Partners
        </p>
      </div>
    </div>
  )
}
