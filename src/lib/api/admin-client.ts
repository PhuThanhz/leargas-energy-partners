/**
 * Client-side admin API client with automatic token attachment
 * and fallback support for offline/demo development.
 */

export interface AdminUser {
  id: number
  username: string
  email: string
  fullName: string
  role: string
}

export interface AuthState {
  token: string | null
  user: AdminUser | null
}

const STORAGE_KEY = "leargas_admin_auth"

export function getStoredAuth(): AuthState {
  if (typeof window === "undefined") {
    return { token: null, user: null }
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { token: null, user: null }
    return JSON.parse(raw)
  } catch {
    return { token: null, user: null }
  }
}

export function saveAuth(token: string, user: AdminUser): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }))
  document.cookie = `leargas_admin_token=${token}; path=/; max-age=86400; SameSite=Lax`
}

export function clearAuth(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORAGE_KEY)
  document.cookie = "leargas_admin_token=; path=/; max-age=0; SameSite=Lax"
}

export function isAuthenticated(): boolean {
  const auth = getStoredAuth()
  return Boolean(auth.token)
}

export const API_HOST =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" && process.env.NODE_ENV === "production"
    ? ""
    : "http://localhost:8080")

/** Turn a backend-relative media path (`/uploads/x.jpg`) into an absolute URL. */
export function resolveMediaUrl(url: string): string {
  if (!url || /^(https?:|data:)/.test(url)) return url
  return url.startsWith("/uploads/") ? `${API_HOST}${url}` : url
}

export async function adminFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const auth = getStoredAuth()
  const headers = new Headers(options.headers || {})

  if (!headers.has("Content-Type") && options.body && typeof options.body === "string") {
    headers.set("Content-Type", "application/json")
  }
  if (auth.token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${auth.token}`)
  }

  const url = `${API_HOST}${path.startsWith("/") ? path : `/${path}`}`

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      clearAuth()
      window.location.replace("/admin/login")
    }
    const err = await response.json().catch(() => ({ detail: `HTTP ${response.status}` }))
    throw new Error(err.detail || err.title || `Request failed with code ${response.status}`)
  }

  if (response.status === 204) {
    return {} as T
  }

  return response.json()
}

/** Upload a file to the media library and return its absolute URL. */
export async function adminUpload(file: File): Promise<string> {
  const body = new FormData()
  body.append("file", file)
  const data = await adminFetch<{ url: string }>("/api/admin/media/upload", {
    method: "POST",
    body,
  })
  return resolveMediaUrl(data.url)
}
