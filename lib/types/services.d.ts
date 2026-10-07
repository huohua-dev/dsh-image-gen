/** The Host-side services the routes and tools share. */
import type { ImageAttachmentRef, ImageMediaType, StoredImageAttachment } from '@deepseek-ai/dsh-attachment';
import type { KeyStore } from './credentials.js';
import type { GalleryDb } from './gallery-db.js';
import type { AttachmentJson } from './gallery-types.js';
import { type Launcher } from './image-files.js';
import { type GenerationRequest, type GenerationResult } from './generate.js';
import type { FetchLike } from './http.js';
import type { SettingsStore } from './settings-store.js';
import type { ProviderEntry, SettingsView } from './shared.js';
export interface AttachmentService {
    readonly imageLimits: {
        maxImageBytes: number;
        maxImageDimension?: number;
        mediaTypes: readonly string[];
    };
    saveImage(input: {
        data: Uint8Array;
        mediaType: ImageMediaType;
        name?: string;
    }): Promise<ImageAttachmentRef>;
    readImage(ref: ImageAttachmentRef, signal?: AbortSignal): Promise<StoredImageAttachment>;
}
export interface PluginServices {
    settings: SettingsStore;
    keys: KeyStore;
    gallery: GalleryDb;
    attachments: AttachmentService;
    /** Tests inject a fake network. */
    fetch?: FetchLike;
    /** Plugin data folder (settings, gallery, default image folder). */
    dataDir: string;
    /** Opens the OS file manager; tests inject a recorder. */
    launch?: Launcher;
}
/** Settings as the browser may see them: key presence instead of keys. */
export declare function settingsView(services: PluginServices): Promise<SettingsView>;
/** The folder image copies currently go to. */
export declare function imageDir(services: PluginServices): Promise<string>;
/**
 * Write the readable copy for one gallery image. Never fails the caller:
 * a disk problem just leaves the item without `filePath`.
 */
export declare function saveImageCopy(services: PluginServices, attachment: AttachmentJson, data: Uint8Array, prompt: string): Promise<string | undefined>;
export declare function requireKey(services: PluginServices, entry: ProviderEntry): Promise<string>;
export declare function toAttachmentJson(ref: ImageAttachmentRef): AttachmentJson;
/** Generate one image with a provider and persist it as an attachment. */
export declare function generateAndStore(services: PluginServices, providerId: string | undefined, request: GenerationRequest, signal: AbortSignal): Promise<{
    entry: ProviderEntry;
    result: GenerationResult;
    attachment: ImageAttachmentRef;
}>;
