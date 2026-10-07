/**
 * Constants and types shared by the Host bundle and the browser bundle.
 *
 * Nothing here may import a Node-only module: the client bundle pulls this
 * file in for route paths, protocol capabilities and the provider presets.
 */
/** npm package name; DSH's module loader and plugin loader key the plugin by it. */
export declare const PACKAGE_NAME = "@copylee/dsh-image-gen";
/**
 * Internal slug: route prefix, credential record scope, storage folder and
 * browser storage prefix. Distinct from shanliuling/dsh-image-gen's
 * `dsh-image-gen` so both plugins can be installed side by side.
 */
export declare const PLUGIN_SLUG = "copylee-image-gen";
/** Serve one durable attachment image to the browser. */
export declare const IMAGE_ROUTE = "/plugins/copylee-image-gen/image";
/** Turn browser-picked files into durable attachments. */
export declare const IMPORT_ROUTE = "/plugins/copylee-image-gen/import";
/** Read/write plugin settings (providers, proxy, storage); never returns keys. */
export declare const SETTINGS_ROUTE = "/plugins/copylee-image-gen/settings";
/** Set or clear one provider's API key. */
export declare const KEY_ROUTE = "/plugins/copylee-image-gen/key";
/** Probe one provider (or the proxy) for reachability. */
export declare const TEST_ROUTE = "/plugins/copylee-image-gen/test";
/** List a provider's models through its `/models` endpoint. */
export declare const MODELS_ROUTE = "/plugins/copylee-image-gen/models";
/** Generate from the paintings page. */
export declare const PAINT_ROUTE = "/plugins/copylee-image-gen/paint";
/** Detected system proxy for the settings page. */
export declare const PROXY_STATUS_ROUTE = "/plugins/copylee-image-gen/proxy-status";
/** Agent image jobs: `<JOBS_ROUTE>/<id>` status, `<JOBS_ROUTE>/<id>/image` bytes. Prefix route. */
export declare const JOBS_ROUTE = "/plugins/copylee-image-gen/jobs";
/** Global gallery (projects, items, favorite prompts). Prefix route. */
export declare const GALLERY_ROUTE = "/plugins/copylee-image-gen/gallery";
/** Wire protocols a provider entry can speak. Each maps to one adapter. */
export declare const PROVIDER_PROTOCOLS: readonly ["gemini", "openai", "openai-compat", "modelscope", "siliconflow", "seedream", "dashscope", "xai", "zhipu"];
export type ProviderProtocol = typeof PROVIDER_PROTOCOLS[number];
/** Human names for the protocol picker. */
export declare const PROTOCOL_LABELS: Record<ProviderProtocol, string>;
/** How one provider entry reaches the network. */
export type ProxyMode = 'inherit' | 'direct' | 'system' | 'custom';
/** Plugin-wide proxy mode. */
export type GlobalProxyMode = 'off' | 'system' | 'custom';
export interface ProviderProxy {
    mode: ProxyMode;
    /** Only read when `mode` is `custom`: `http://`, `https://`, `socks5://` or `socks5h://`. */
    url?: string;
}
/** OpenAI-compatible relay quirks (edit body shape and size table). */
export interface CompatOptions {
    editFormat?: 'multipart' | 'jsonImageUrlArray' | 'formReferenceImages';
    editExtra?: Record<string, unknown>;
    /** `ratio → tier → exact size`, e.g. `{ "16:9": { "2K": "2048x1152" } }`. */
    sizes?: Record<string, Record<string, string>>;
}
/** One configured image provider: a preset or a user-added endpoint. */
export interface ProviderEntry {
    /** Stable id; also the credential record id. `[a-z0-9-]`, ≤ 48 chars. */
    id: string;
    name: string;
    protocol: ProviderProtocol;
    /** Base URL (or the full endpoint for `gemini`). */
    baseURL: string;
    /** Models offered in the pickers; the first one is used when `defaultModel` is blank. */
    models: string[];
    defaultModel: string;
    enabled: boolean;
    proxy: ProviderProxy;
    /** True for shipped presets: editable and disableable but not deletable. */
    preset?: boolean;
    compat?: CompatOptions;
    /** Ark (Seedream) output controls. */
    ark?: ArkOutputOptions;
}
/** Plugin-wide proxy. */
export interface GlobalProxy {
    /** off = direct, system = OS/env proxy (auto-detected), custom = `url`. */
    mode: GlobalProxyMode;
    /** Derived from `mode` (kept for settings written by older versions). */
    enabled: boolean;
    url: string;
    /** Hosts that bypass the proxy: exact host, `.suffix`, `*.suffix`, or `*`. */
    noProxy: string[];
}
/** Every persisted setting except API keys. */
export interface PluginSettings {
    version: 1;
    providers: ProviderEntry[];
    /** Provider used by the Agent tools when a call names none. */
    activeProvider: string;
    proxy: GlobalProxy;
    /** Offer the image tools (paint_image, paint_images, edit_painting) to the Agent in conversations. */
    chatTools: boolean;
    /** Also write images generated in a conversation under that session's workspace. */
    saveToWorkspace: boolean;
    workspaceFolder: string;
    /** Folder for readable gallery image copies; '' = `<dataDir>/images`. */
    imageDir: string;
}
/** Provider entry as the browser sees it: adds key state, never the key. */
export interface ProviderView extends ProviderEntry {
    keyConfigured: boolean;
}
export interface SettingsView extends Omit<PluginSettings, 'providers'> {
    providers: ProviderView[];
    /** Folder actually used for image copies (resolved default when imageDir is empty). */
    effectiveImageDir: string;
    /** Host upload limits, so the browser can shrink images before uploading. */
    imageLimits?: {
        maxImageBytes: number;
        maxImageDimension?: number;
        mediaTypes: string[];
    };
}
export declare const ASPECT_RATIOS: readonly ["1:1", "3:2", "2:3", "4:3", "3:4", "4:5", "5:4", "16:9", "9:16", "21:9"];
export declare const IMAGE_SIZES: readonly ["1K", "2K", "4K"];
export type AspectRatio = typeof ASPECT_RATIOS[number];
export type ImageSize = typeof IMAGE_SIZES[number];
/** Ark (Seedream) output controls; every default reproduces Ark's own default. */
export interface ArkOutputOptions {
    outputFormat?: 'png' | 'jpeg';
    watermark?: boolean;
    background?: 'opaque' | 'transparent';
}
/**
 * Map the Ark output controls onto request-body fields. `background` is
 * opt-in per call site: Ark accepts `transparent` only on the edit path.
 */
export declare function arkOutputBody(options: ArkOutputOptions | undefined, { background }?: {
    background?: boolean;
}): Record<string, unknown>;
/** Shipped provider presets. Ids are stable: keys and settings refer to them. */
export declare const PRESET_PROVIDERS: readonly ProviderEntry[];
/** Default settings for a fresh install. */
export declare function defaultSettings(): PluginSettings;
/** The model a call should use: an explicit override, the default, then the first listed. */
export declare function effectiveModel(entry: ProviderEntry, override?: string): string;
/** One choice in a size picker. */
export interface SizeOption {
    /** Wire value (`1024x1024`, `2K`, ...). */
    value: string;
    label: string;
}
/** What the paintings page can ask a protocol for. */
export interface ProtocolCapabilities {
    /** Aspect ratios; empty when the protocol takes pixel sizes only. */
    ratios: readonly string[];
    /** Resolution tiers (Gemini/xAI); empty when the protocol has none. */
    tiers: readonly string[];
    /** Pixel or tier sizes keyed by ratio (OpenAI family, ModelScope...). */
    sizes?: Readonly<Record<string, string>>;
    /** Max reference images for editing; 0 = no editing. */
    maxReferences: number;
    /** Max images per request the paintings page may ask for. */
    maxCount: number;
    /** Explicit `WxH` sizes the protocol accepts; absent = ratio/tier only. */
    customSize?: SizeRange;
}
/** Pixel bounds and alignment for explicit `WxH` sizes. */
export interface SizeRange {
    min: number;
    max: number;
    step: number;
}
/** Long-side presets offered next to the standard size. */
export declare const RESOLUTION_PRESETS: readonly [{
    readonly id: "1k";
    readonly label: "1K";
    readonly longSide: 1024;
}, {
    readonly id: "1.5k";
    readonly label: "1.5K";
    readonly longSide: 1536;
}, {
    readonly id: "2k";
    readonly label: "2K";
    readonly longSide: 2048;
}];
/** Clamp one dimension into the range and onto the step grid. */
export declare function clampDimension(value: number, range: SizeRange): number;
/**
 * `WxH` for an aspect ratio and a long side, both dimensions aligned to
 * `step` (and clamped into `range` when given): 16:9 @ 2048 / 16 → 2048x1152.
 */
export declare function sizeForRatio(ratio: string, longSide: number, step: number, range?: SizeRange): {
    width: number;
    height: number;
};
/** Parse `WxH` / `W*H`; undefined when malformed. */
export declare function parseSize(value: string | undefined): {
    width: number;
    height: number;
} | undefined;
export declare const PROTOCOL_CAPABILITIES: Record<ProviderProtocol, ProtocolCapabilities>;
/** Capabilities of one entry, honouring an OpenAI-compatible relay's own size table. */
export declare function capabilitiesOf(entry: Pick<ProviderEntry, 'protocol' | 'compat'>): ProtocolCapabilities;
/**
 * Resolve the wire size for one request. Returns `{ size }` for pixel-size
 * protocols, `{ aspectRatio, imageSize }` for tier protocols.
 */
export declare function resolveSize(entry: Pick<ProviderEntry, 'protocol' | 'compat'>, request: {
    aspectRatio?: string | undefined;
    imageSize?: string | undefined;
    size?: string | undefined;
}): {
    size?: string;
    aspectRatio?: string;
    imageSize?: string;
};
