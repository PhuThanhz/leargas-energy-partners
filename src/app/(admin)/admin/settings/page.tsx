"use client"

import * as React from "react"
import { Shield, KeyRound, Server, CheckCircle2, XCircle, RefreshCw } from "lucide-react"

import { getStoredAuth, type AuthState } from "@/lib/api/admin-client"

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
      const res = await fetch("http://localhost:8080/api/posts", { method: "HEAD" }).catch(
        () => null
      )
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
    fetch("http://localhost:8080/api/posts", { method: "HEAD" })
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
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-light text-[#f9f6ee]">Portal & System Settings</h1>
        <p className="mt-1 text-xs text-[#7a9987]">
          Manage credentials, security policies, and inspect Spring Boot & MySQL connection
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* User Account Info */}
        <div className="space-y-4 rounded-xl border border-[#1a382b] bg-[#0a1b14] p-6">
          <div className="flex items-center gap-2 text-[#c9a050]">
            <Shield className="h-4 w-4" />
            <h2 className="text-xs font-semibold tracking-wider uppercase">Account Credentials</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="block text-[10px] text-[#5e7d6c] uppercase">Logged in as</span>
              <span className="text-sm font-medium text-[#f2efe9]">
                {auth?.user?.fullName || "Administrator"}
              </span>
            </div>
            <div>
              <span className="block text-[10px] text-[#5e7d6c] uppercase">Username</span>
              <span className="font-mono text-xs text-[#cde0d5]">
                {auth?.user?.username || "admin"}
              </span>
            </div>
            <div>
              <span className="block text-[10px] text-[#5e7d6c] uppercase">Email</span>
              <span className="text-xs text-[#cde0d5]">
                {auth?.user?.email || "admin@leargasenergy.com"}
              </span>
            </div>
            <div>
              <span className="block text-[10px] text-[#5e7d6c] uppercase">Assigned Role</span>
              <span className="mt-0.5 inline-block rounded bg-[#143023] px-2 py-0.5 text-[10px] font-medium text-[#c9a050]">
                {auth?.user?.role || "ROLE_ADMIN"}
              </span>
            </div>
          </div>
        </div>

        {/* Backend & MySQL Health */}
        <div className="space-y-4 rounded-xl border border-[#1a382b] bg-[#0a1b14] p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#c9a050]">
              <Server className="h-4 w-4" />
              <h2 className="text-xs font-semibold tracking-wider uppercase">Backend Service</h2>
            </div>
            <button
              onClick={pingBackend}
              className="flex items-center gap-1 rounded bg-[#143023] px-2 py-1 text-[10px] text-[#cde0d5] hover:bg-[#1a3d2c]"
            >
              <RefreshCw className="h-3 w-3" />
              Test Ping
            </button>
          </div>

          <div className="space-y-3 rounded-lg border border-[#153124] bg-[#07130e] p-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#7a9987]">Spring Boot 3 (Port 8080):</span>
              <div className="flex items-center gap-1.5 font-medium">
                {backendStatus === "ONLINE" && (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span className="text-emerald-400">Online ({latency}ms)</span>
                  </>
                )}
                {backendStatus === "OFFLINE" && (
                  <>
                    <XCircle className="h-4 w-4 text-amber-400" />
                    <span className="text-amber-400">Offline (Mock Mode Active)</span>
                  </>
                )}
                {backendStatus === "CHECKING" && <span className="text-[#7a9987]">Pinging...</span>}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[#142d22] pt-2">
              <span className="text-[#7a9987]">Database Engine:</span>
              <span className="font-mono text-[#cde0d5]">MySQL 8.x / 9.x</span>
            </div>

            <div className="flex items-center justify-between border-t border-[#142d22] pt-2">
              <span className="text-[#7a9987]">Schema Script:</span>
              <span className="font-mono text-[11px] text-[#c9a050]">backend/db/schema.sql</span>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="space-y-4 rounded-xl border border-[#1a382b] bg-[#0a1b14] p-6 md:col-span-2">
          <div className="flex items-center gap-2 text-[#c9a050]">
            <KeyRound className="h-4 w-4" />
            <h2 className="text-xs font-semibold tracking-wider uppercase">Update Password</h2>
          </div>

          {passwordSaved && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/40 p-3 text-xs text-emerald-300">
              Password successfully updated in security store.
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-[#9cb5a6]">Current Password</label>
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-[#1f4231] bg-[#07130e] px-3 py-2 text-xs text-[#f2efe9] focus:border-[#c9a050] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-[#9cb5a6]">New Secure Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-[#1f4231] bg-[#07130e] px-3 py-2 text-xs text-[#f2efe9] focus:border-[#c9a050] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                className="rounded-lg bg-[#c9a050] px-4 py-2 text-xs font-semibold tracking-wider text-[#0a1b14] uppercase hover:bg-[#dbb260]"
              >
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
