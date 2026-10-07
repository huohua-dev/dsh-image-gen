import type { Dispatcher } from 'undici';
import type { GlobalProxy, ProviderProxy } from './shared.js';
import { type SystemProxy } from './system-proxy.js';
/** Minimal fetch signature the adapters depend on. */
export type FetchLike = (url: string, init?: RequestInit) => Promise<Response>;
/** The proxy a request should use, or `undefined` for a direct connection. */
/** Error text when the system proxy is selected but nothing was detected. */
export declare const SYSTEM_PROXY_MISSING = "\u5DF2\u9009\u62E9\u300C\u7CFB\u7EDF\u4EE3\u7406\u300D\u4F46\u672A\u68C0\u6D4B\u5230\u7CFB\u7EDF\u4EE3\u7406\uFF1A\u8BF7\u5728\u7CFB\u7EDF\u8BBE\u7F6E\u91CC\u5F00\u542F\u4EE3\u7406\uFF08\u6216\u8BBE\u7F6E HTTPS_PROXY\uFF09\uFF0C\u6216\u6539\u7528\u81EA\u5B9A\u4E49\u4EE3\u7406\u5730\u5740";
/** Global mode, tolerating settings objects from before `mode` existed. */
export declare function globalMode(global: GlobalProxy): GlobalProxy['mode'];
/** Whether resolving this provider's route needs the detected system proxy. */
export declare function needsSystemProxy(proxy: ProviderProxy | undefined, global: GlobalProxy): boolean;
/**
 * The proxy a request should use, or `undefined` for a direct connection.
 * `system` is the detected OS proxy; required (else this throws) when the
 * provider or the inherited global mode is `system`.
 */
export declare function resolveProxyUrl(target: string, proxy: ProviderProxy | undefined, global: GlobalProxy, system?: SystemProxy | null): string | undefined;
/** Whether a target host matches one of the no-proxy patterns. */
export declare function bypassesProxy(target: string, patterns: readonly string[]): boolean;
/** Validate a proxy URL; returns an error message or `undefined` when usable. */
export declare function validateProxyUrl(raw: string): string | undefined;
/** One cached dispatcher per proxy URL. */
export declare function dispatcherFor(proxyUrl: string): Dispatcher;
/** Drop cached dispatchers (after settings change). */
export declare function resetDispatchers(): void;
/**
 * Build the fetch one provider's requests go through. Direct requests use the
 * runtime's global fetch; proxied requests use undici's fetch with the proxy
 * dispatcher (the global fetch may embed a different undici build).
 */
export declare function providerFetch(proxy: ProviderProxy | undefined, global: GlobalProxy): FetchLike;
