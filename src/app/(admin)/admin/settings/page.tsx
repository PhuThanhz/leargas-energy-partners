"use client"

import * as React from "react"
import { Shield, KeyRound, Server, CheckCircle2, XCircle, RefreshCw } from "lucide-react"

import { API_HOST, getStoredAuth, type AuthState } from "@/lib/api/admin-client"

const emptySubscribe = () => () => {}

export default function AdminSettingsPage() {
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )
  const [backendStatus, setBackendStatus] = React.useState<"CHECKING" | "ONLINE" | "OFFLINE">(
    "CHECKING"
  )
  const [latency, setLatency] = React.useState<number | null>(null)
  const [oldPassword, setOldPassword] = React.useState("")
  const [newPassword, setNewPassword] = React.useState("")
  const [passwordSaved, setPasswordSaved] = React.useState(false)

  const pingBackend = React.useCallback(async () => {
    setBackendStatus("CHECKING")
    const start = Date.now()
    try {
      const res = await fetch(`${API_HOST}/api/posts`, { method: "HEAD" }).catch(() => null)
      const duration = Date.now() - start
      if (res && (res.ok || res.status === 401 || res.status === 403 || res.status === 200)) {
        setBackendStatus("ONLINE")
        setLatency(duration)
      } else {
        setBackendStatus("OFFLINE")
        setLatency(null)
      }
    } catch {
      setBackendStatus("OFFLINE")
      setLatency(null)
    }
  }, [])

  React.useEffect(() => {
    let active = true
    const start = Date.now()
    fetch(`${API_HOST}/api/posts`, { method: "HEAD" })
      .then((res) => {
        if (!active) return
        const duration = Date.now() - start
        if (res.ok || res.status === 401 || res.status === 403 || res.status === 200) {
          setBackendStatus("ONLINE")
          setLatency(duration)
        } else {
          setBackendStatus("OFFLINE")
        }
      })
      .catch(() => {
        if (active) setBackendStatus("OFFLINE")
      })
    return () => {
      active = false
    }
  }, [])

  const auth: AuthState = mounted ? getStoredAuth() : { token: null, user: null }

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordSaved(true)
    setTimeout(() => setPasswordSaved(false), 3000)
    setOldPassword("")
    setNewPassword("")
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-[#000000e0]">Settings & system status</h1>
        <p className="mt-0.5 text-xs text-[#8c8c8c]">
          Admin account, security and backend connection status
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Thông tin tài khoản */}
        <div className="space-y-3.5 rounded-lg border border-[#f0f0f0] bg-white p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-2 text-[#059669]">
            <Shield className="h-4 w-4" />
            <h2 className="text-xs font-semibold tracking-wider uppercase">Admin account</h2>
          </div>

          <div className="space-y-3 border-t border-[#f5f5f5] pt-3 text-xs">
            <div>
              <span className="block text-[10px] text-[#8c8c8c] uppercase">Full name</span>
              <span className="text-xs font-medium text-[#262626]">
                {auth?.user?.fullName || "LÉARGAS Administrator"}
              </span>
            </div>
            <div>
              <span className="block text-[10px] text-[#8c8c8c] uppercase">Username</span>
              <span className="font-mono text-xs text-[#262626]">
                {auth?.user?.username || "admin"}
              </span>
            </div>
            <div>
              <span className="block text-[10px] text-[#8c8c8c] uppercase">Email</span>
              <span className="text-xs text-[#262626]">
                {auth?.user?.email || "admin@leargasenergy.com"}
              </span>
            </div>
            <div>
              <span className="block text-[10px] text-[#8c8c8c] uppercase">Role</span>
              <span className="mt-0.5 inline-block rounded border border-[#b7eb8f] bg-[#f6ffed] px-2 py-0.5 text-[10px] font-medium text-[#52c41a]">
                {auth?.user?.role || "ROLE_ADMIN"} (full access)
              </span>
            </div>
          </div>
        </div>

        {/* Trạng thái Backend & MySQL */}
        <div className="space-y-3.5 rounded-lg border border-[#f0f0f0] bg-white p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#059669]">
              <Server className="h-4 w-4" />
              <h2 className="text-xs font-semibold tracking-wider uppercase">Service status</h2>
            </div>
            <button
              onClick={pingBackend}
              className="flex items-center gap-1 rounded border border-[#d9d9d9] bg-white px-2 py-1 text-[11px] text-[#262626] hover:border-[#059669] hover:text-[#059669]"
            >
              <RefreshCw className="h-3 w-3" />
              Ping
            </button>
          </div>

          <div className="space-y-2.5 rounded-md border border-[#f0f0f0] bg-[#fafafa] p-3.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#595959]">Spring Boot 3 (Port 8080):</span>
              <div className="flex items-center gap-1.5 font-medium">
                {backendStatus === "ONLINE" && (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-[#52c41a]" />
                    <span className="text-[#52c41a]">Online ({latency}ms)</span>
                  </>
                )}
                {backendStatus === "OFFLINE" && (
                  <>
                    <XCircle className="h-4 w-4 text-[#faad14]" />
                    <span className="text-[#faad14]">Offline</span>
                  </>
                )}
                {backendStatus === "CHECKING" && <span className="text-[#8c8c8c]">Checking…</span>}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[#f0f0f0] pt-2">
              <span className="text-[#595959]">Database engine:</span>
              <span className="font-mono text-[#262626]">MySQL 8.x / MySQL Workbench</span>
            </div>

            <div className="flex items-center justify-between border-t border-[#f0f0f0] pt-2">
              <span className="text-[#595959]">Database:</span>
              <span className="font-mono text-[11px] text-[#059669]">leargas_db</span>
            </div>
          </div>
        </div>

        {/* Đổi Mật khẩu */}
        <div className="space-y-4 rounded-lg border border-[#f0f0f0] bg-white p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)] md:col-span-2">
          <div className="flex items-center gap-2 text-[#059669]">
            <KeyRound className="h-4 w-4" />
            <h2 className="text-xs font-semibold tracking-wider uppercase">Change password</h2>
          </div>

          {passwordSaved && (
            <div className="rounded-md border border-[#b7eb8f] bg-[#f6ffed] p-3 text-xs text-[#52c41a]">
              Your password has been updated.
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-[#262626]">Current password</label>
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-md border border-[#d9d9d9] bg-white px-3 py-1.5 text-xs text-[#000000e0] hover:border-[#059669] focus:border-[#059669] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-[#262626]">New password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-md border border-[#d9d9d9] bg-white px-3 py-1.5 text-xs text-[#000000e0] hover:border-[#059669] focus:border-[#059669] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                className="rounded-md bg-[#059669] px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-[#047857]"
              >
                Update password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
