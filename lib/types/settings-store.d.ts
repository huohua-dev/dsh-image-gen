import { type PluginSettings, type ProviderEntry } from './shared.js';
/** Coerce untrusted JSON (disk or browser) into valid settings. Unknown fields drop. */
export declare function normalizeSettings(raw: unknown): PluginSettings;
/** Validation problems that should block a save (shown in the settings UI). */
export declare function validateSettings(settings: PluginSettings): string[];
/** Settings file owner. Reads are cached; writes are serialized and atomic. */
export declare class SettingsStore {
    private readonly dir;
    private cached;
    private readonly mutex;
    private readonly listeners;
    constructor(dir: string);
    get path(): string;
    get(): Promise<PluginSettings>;
    /** Replace settings with a normalized copy of `next`; throws on validation errors. */
    save(next: unknown): Promise<PluginSettings>;
    onChange(listener: (settings: PluginSettings) => void): () => void;
}
/** Look up one enabled provider, or throw an Agent-readable error. */
export declare function requireProvider(settings: PluginSettings, id?: string): ProviderEntry;
