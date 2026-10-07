/** Small helpers shared by the plugin's same-origin JSON routes. */
import type { IncomingMessage, ServerResponse } from 'node:http'

export class RouteError extends Error {
  constructor(readonly status: number, message: string) {
    super(message)
  }
}

/** localhost, [::1] or any 127/8 address — the loopback set of DSH's own `/api` fence. */
export function isLoopbackHostname(hostname: string): boolean {
  if (hostname === 'localhost' || hostname === '[::1]') return true
  const parts = hostname.split('.')
  return parts.length === 4 && parts[0] === '127' && parts.every(part => /^\d{1,3}$/.test(part) && Number(part) <= 255)
}

/**
 * Browser-trust fence modeled on DSH's `isTrustedApiRequest`: the Host must
 * be loopback (defeats DNS rebinding), `Sec-Fetch-Site: cross-site` is
 * refused, and an attached Origin must name the same host.
 */
export function assertSameOrigin(req: IncomingMessage): void {
  const host = req.headers.host
  let hostUrl: URL | undefined
  try {
    hostUrl = host === undefined ? undefined : new URL(`http://${host}`)
  } catch {
    hostUrl = undefined
  }
  if (hostUrl === undefined || !isLoopbackHostname(hostUrl.hostname)) throw new RouteError(403, 'host-rejected')
  if (req.headers['sec-fetch-site'] === 'cross-site') throw new RouteError(403, 'cross-site')
  const origin = req.headers.origin
  if (origin === undefined) return
  let originHost: string | undefined
  try {
    originHost = new URL(origin).host
  } catch {
    originHost = undefined
  }
  if (originHost !== hostUrl.host) throw new RouteError(403, 'origin-rejected')
}

export async function readJsonBody(req: IncomingMessage, maxBytes: number): Promise<Record<string, unknown>> {
  if (!(req.headers['content-type'] ?? '').toLowerCase().startsWith('application/json')) throw new RouteError(415, 'json-required')
  const chunks: Buffer[] = []
  let bytes = 0
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as string)
    bytes += buffer.byteLength
    if (bytes > maxBytes) throw new RouteError(413, 'body-too-large')
    chunks.push(buffer)
  }
  let value: unknown
  try {
    value = JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    throw new RouteError(400, 'invalid-json')
  }
  if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new RouteError(400, 'invalid-request')
  return value as Record<string, unknown>
}

export function sendJson(res: ServerResponse, status: number, value: unknown): void {
  if (res.headersSent) {
    res.end()
    return
  }
  const body = JSON.stringify(value)
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' })
  res.end(body)
}

/**
 * Wrap a JSON handler: method gate, origin check, error mapping. Handler
 * errors become `{ error }` with their status (RouteError) or 500.
 */
export function jsonRoute(
  methods: readonly string[],
  handler: (req: IncomingMessage, res: ServerResponse) => Promise<unknown>,
): (req: IncomingMessage, res: ServerResponse) => Promise<void> {
  return async (req, res) => {
    try {
      if (!methods.includes(req.method ?? 'GET')) throw new RouteError(405, 'method-not-allowed')
      assertSameOrigin(req)
      const value = await handler(req, res)
      if (!res.writableEnded) sendJson(res, 200, value ?? { ok: true })
    } catch (error) {
      const status = error instanceof RouteError ? error.status : 500
      sendJson(res, status, { error: error instanceof Error ? error.message : String(error) })
    }
  }
}

/** Abort signal that fires when the browser disconnects before the answer. */
export function requestSignal(req: IncomingMessage, res: ServerResponse): AbortSignal {
  const controller = new AbortController()
  const abort = (): void => {
    if (!res.writableEnded) controller.abort(new Error('client disconnected'))
  }
  req.once('aborted', abort)
  res.once('close', abort)
  return controller.signal
}

export function str(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined
}

export function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
}
