/** Small helpers shared by the plugin's same-origin JSON routes. */
import type { IncomingMessage, ServerResponse } from 'node:http';
export declare class RouteError extends Error {
    readonly status: number;
    constructor(status: number, message: string);
}
/** localhost, [::1] or any 127/8 address — the loopback set of DSH's own `/api` fence. */
export declare function isLoopbackHostname(hostname: string): boolean;
/**
 * Browser-trust fence modeled on DSH's `isTrustedApiRequest`: the Host must
 * be loopback (defeats DNS rebinding), `Sec-Fetch-Site: cross-site` is
 * refused, and an attached Origin must name the same host.
 */
export declare function assertSameOrigin(req: IncomingMessage): void;
export declare function readJsonBody(req: IncomingMessage, maxBytes: number): Promise<Record<string, unknown>>;
export declare function sendJson(res: ServerResponse, status: number, value: unknown): void;
/**
 * Wrap a JSON handler: method gate, origin check, error mapping. Handler
 * errors become `{ error }` with their status (RouteError) or 500.
 */
export declare function jsonRoute(methods: readonly string[], handler: (req: IncomingMessage, res: ServerResponse) => Promise<unknown>): (req: IncomingMessage, res: ServerResponse) => Promise<void>;
/** Abort signal that fires when the browser disconnects before the answer. */
export declare function requestSignal(req: IncomingMessage, res: ServerResponse): AbortSignal;
export declare function str(value: unknown): string | undefined;
export declare function stringArray(value: unknown): string[];
