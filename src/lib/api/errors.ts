/** Error thrown for non-2xx responses from the backend API. */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body?: unknown
  ) {
    super(message)
    this.name = "ApiError"
  }

  get isNotFound() {
    return this.status === 404
  }
}

/** Spring Boot `ProblemDetail` (RFC 9457) error body. */
export type ProblemDetail = {
  type?: string
  title?: string
  status?: number
  detail?: string
  instance?: string
}
