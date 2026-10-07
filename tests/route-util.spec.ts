import type { IncomingMessage } from 'node:http'
import { describe, expect, it } from 'vitest'
import { RouteError, assertSameOrigin, isLoopbackHostname } from '../src/route-util.js'

function req(headers: Record<string, string>): IncomingMessage {
  return { headers } as unknown as IncomingMessage
}

function rejection(headers: Record<string, string>): string | undefined {
  try {
    assertSameOrigin(req(headers))
    return undefined
  } catch (error) {
    expect(error).toBeInstanceOf(RouteError)
    expect((error as RouteError).status).toBe(403)
    return (error as RouteError).message
  }
}

describe('assertSameOrigin', () => {
  it('admits loopback hosts, with or without a same-host Origin', () => {
    for (const host of ['127.0.0.1:19387', 'localhost:19387', '[::1]:19387', 'LOCALHOST:19387', '127.0.0.1', '127.1.2.3:80']) {
      expect(rejection({ host }), host).toBeUndefined()
    }
    expect(rejection({ host: '127.0.0.1:19387', origin: 'http://127.0.0.1:19387' })).toBeUndefined()
    expect(rejection({ host: 'localhost:19387', origin: 'http://localhost:19387', 'sec-fetch-site': 'same-origin' })).toBeUndefined()
    expect(rejection({ host: 'localhost:19387', 'sec-fetch-site': 'none' })).toBeUndefined()
    expect(rejection({ host: 'localhost:19387', 'sec-fetch-site': 'same-site' })).toBeUndefined()
  })

  it('refuses a missing or non-loopback Host (DNS rebinding)', () => {
    expect(rejection({})).toBe('host-rejected')
    for (const host of ['evil.example:19387', 'localhost.evil.example:19387', '127.0.0.1.nip.io:19387', '192.168.1.5:19387', '0.0.0.0:19387', '[::2]:19387', 'bad host']) {
      expect(rejection({ host }), host).toBe('host-rejected')
    }
    // A rebound page sends a matching Origin; the Host still gives it away.
    expect(rejection({ host: 'evil.example:19387', origin: 'http://evil.example:19387' })).toBe('host-rejected')
  })

  it('refuses Sec-Fetch-Site: cross-site even on a loopback Host', () => {
    expect(rejection({ host: '127.0.0.1:19387', 'sec-fetch-site': 'cross-site' })).toBe('cross-site')
  })

  it('refuses an Origin naming another host', () => {
    expect(rejection({ host: '127.0.0.1:19387', origin: 'https://evil.example' })).toBe('origin-rejected')
    expect(rejection({ host: '127.0.0.1:19387', origin: 'http://127.0.0.1:8080' })).toBe('origin-rejected')
    expect(rejection({ host: '127.0.0.1:19387', origin: 'null' })).toBe('origin-rejected')
  })
})

describe('isLoopbackHostname', () => {
  it('matches the DSH loopback set', () => {
    expect(['localhost', '[::1]', '127.0.0.1', '127.255.255.255'].every(isLoopbackHostname)).toBe(true)
    expect(['localhost.', '::1', '128.0.0.1', '127.0.0.256', '127.0.0', 'example.com'].some(isLoopbackHostname)).toBe(false)
  })
})
