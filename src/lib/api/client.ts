import "server-only"

import { env } from "@/lib/env"

import { ApiError, type ProblemDetail } from "./errors"

type Query = Record<string, string | number | boolean | undefined>

type RequestOptions = Omit<RequestInit, "body"> & {
  query?: Query
  body?: unknown
  /** Abort the request after this many milliseconds. Default: 10s. */
  timeoutMs?: number
}

function buildUrl(path: string, query?: Query) {
  if (!env.API_BASE_URL) {
    throw new Error("API_BASE_URL is not configured")
  }
  const url = new URL(path.replace(/^\//, ""), env.API_BASE_URL.replace(/\/?$/, "/"))
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined) url.searchParams.set(key, String(value))
  }
  return url
}

/**
 * Single entry point for calling the Spring Boot backend.
 * Server-only: never expose backend URLs or credentials to the browser.
 */
export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { query, body, timeoutMs = 10_000, headers, ...init } = options

  const response = await fetch(buildUrl(path, query), {
    ...init,
    headers: {
      Accept: "application/json",
      ...(body !== undefined && { "Content-Type": "application/json" }),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal: init.signal ?? AbortSignal.timeout(timeoutMs),
  })

  if (!response.ok) {
    const problem = (await response.json().catch(() => undefined)) as ProblemDetail | undefined
    throw new ApiError(
      problem?.detail ?? problem?.title ?? `Request failed: ${response.status}`,
      response.status,
      problem
    )
  }

  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}
