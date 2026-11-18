"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ShieldCheck,
  Lock,
  User as UserIcon,
  ArrowRight,
  AlertCircle,
  KeyRound,
} from "lucide-react"

import { saveAuth } from "@/lib/api/admin-client"

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = React.useState("admin")
  const [password, setPassword] = React.useState("admin123")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // 1. Try connecting to Spring Boot backend
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

      // 2. Offline fallback mode for local frontend preview
      if (username === "admin" && password === "admin123") {
        saveAuth("demo-jwt-token-leargas-2026", {
          id: 1,
          username: "admin",
          email: "admin@leargasenergy.com",
          fullName: "LÉARGAS Administrator",
          role: "ROLE_ADMIN",
        })
        router.push("/admin/dashboard")
        return
      }

      setError("Invalid username or password. (Hint: use admin / admin123)")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#07130e] px-4 py-12 text-[#f2efe9]">
      <div className="w-full max-w-md space-y-8">
        {/* Brand Header */}
        <div className="space-y-2 text-center">
          <Link href="/" className="inline-block">
            <span className="font-serif text-3xl font-light tracking-[0.25em] text-[#f9f6ee]">
              LÉARGAS
            </span>
          </Link>
          <div className="flex items-center justify-center gap-2">
            <span className="h-px w-6 bg-[#c9a050]/50" />
            <p className="text-xs tracking-[0.25em] text-[#c9a050] uppercase">
              Energy Partners — Management Portal
            </p>
            <span className="h-px w-6 bg-[#c9a050]/50" />
          </div>
        </div>

        {/* Login Box */}
        <div className="rounded-2xl border border-[#1a382b] bg-[#0a1b14]/90 p-8 shadow-2xl backdrop-blur-sm">
          <div className="mb-6 flex items-center justify-between border-b border-[#163626] pb-4">
            <div>
              <h2 className="font-serif text-lg font-light text-[#f9f6ee]">Sign in to Portal</h2>
              <p className="text-xs text-[#7a9987]">Enter your authorized credentials below</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#143023] text-[#c9a050]">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-950/40 p-3 text-xs text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-xs font-medium tracking-wider text-[#9cb5a6] uppercase">
                Username or Email
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#527360]">
                  <UserIcon className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full rounded-lg border border-[#1f4231] bg-[#07130e] py-2.5 pr-4 pl-10 text-sm text-[#f2efe9] placeholder-[#405c4d] transition-colors focus:border-[#c9a050] focus:ring-1 focus:ring-[#c9a050] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium tracking-wider text-[#9cb5a6] uppercase">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#527360]">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-[#1f4231] bg-[#07130e] py-2.5 pr-4 pl-10 text-sm text-[#f2efe9] placeholder-[#405c4d] transition-colors focus:border-[#c9a050] focus:ring-1 focus:ring-[#c9a050] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#c9a050] py-3 text-xs font-semibold tracking-wider text-[#07130e] uppercase transition-all hover:bg-[#dbb260] active:scale-[0.99] disabled:opacity-60"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#07130e] border-t-transparent" />
              ) : (
                <>
                  Authenticate & Continue
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Box */}
          <div className="mt-6 rounded-lg border border-[#1b3d2c]/60 bg-[#071710] p-3 text-xs text-[#8ca897]">
            <div className="mb-1 flex items-center gap-1.5 font-medium text-[#c9a050]">
              <KeyRound className="h-3.5 w-3.5" />
              <span>Default Initial Credentials:</span>
            </div>
            <div className="flex items-center justify-between font-mono text-[11px] text-[#b6cec1]">
              <span>
                Username: <strong>admin</strong>
              </span>
              <span>
                Password: <strong>admin123</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-[#527360]">
          © {new Date().getFullYear()} LÉARGAS Energy Partners Pte. Ltd. All rights reserved.
        </p>
      </div>
    </div>
  )
}
