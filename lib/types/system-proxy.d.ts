export interface SystemProxy {
    /** Proxy URL with scheme, e.g. `http://127.0.0.1:7890`. */
    url: string;
    /** Human-readable origin, e.g. `Windows 系统代理`. */
    source: string;
    /** Hosts that bypass the proxy (from ProxyOverride / exceptions). */
    bypass: string[];
}
/** Runs a command and resolves its stdout ('' on any failure). */
export type CommandRunner = (file: string, args: string[]) => Promise<string>;
export declare const defaultRunner: CommandRunner;
/** Add a scheme to bare `host:port`; keep explicit http/https/socks schemes. */
export declare function normalizeProxyAddress(raw: string, defaultScheme?: string): string | undefined;
/** Pick from Windows `ProxyServer`: `host:port` or `http=..;https=..;socks=..`. */
export declare function pickWindowsProxy(server: string): string | undefined;
/** Windows `ProxyOverride` → no-proxy patterns (`<local>` = dotless hosts, kept as-is). */
export declare function parseProxyOverride(value: string): string[];
export declare function detectFromEnv(env: NodeJS.ProcessEnv): Promise<SystemProxy | null>;
export declare function detectWindows(run: CommandRunner): Promise<SystemProxy | null>;
export declare function detectMac(run: CommandRunner): Promise<SystemProxy | null>;
export declare function detectGnome(run: CommandRunner): Promise<SystemProxy | null>;
/** Detect the system proxy; `refresh` skips the 30 s cache. */
export declare function detectSystemProxy(options?: {
    refresh?: boolean;
    env?: NodeJS.ProcessEnv;
    platform?: NodeJS.Platform;
    run?: CommandRunner;
}): Promise<SystemProxy | null>;
/** Drop the cache (tests, settings changes). */
export declare function resetSystemProxyCache(): void;
