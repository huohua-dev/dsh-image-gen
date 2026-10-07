/** Browser wrappers for the plugin's Host routes. */
import type { AttachmentJson, FavoritePrompt, GalleryItem, GalleryPage, GalleryProject, GalleryQuery } from '../gallery-types.js';
import { type GlobalProxy, type PluginSettings, type ProviderEntry, type SettingsView } from '../shared.js';
export type ProjectSummary = GalleryProject & {
    count: number;
    cover?: AttachmentJson;
};
/** `<img src>` for one durable attachment. */
export declare function imageUrl(attachment: AttachmentJson): string;
export declare const api: {
    settings: () => Promise<SettingsView>;
    saveSettings: (settings: PluginSettings) => Promise<SettingsView>;
    setKey: (providerId: string, key: string) => Promise<{
        ok: boolean;
        keyConfigured: boolean;
    }>;
    test: (input: {
        providerId: string;
        entry?: ProviderEntry;
        key?: string;
        proxy?: GlobalProxy;
    }) => Promise<{
        ok: boolean;
        message: string;
        latencyMs?: number;
    }>;
    testProxy: (proxyUrl: string) => Promise<{
        ok: boolean;
        message: string;
        latencyMs?: number;
    }>;
    models: (input: {
        providerId: string;
        entry?: ProviderEntry;
        key?: string;
    }) => Promise<{
        models: string[];
        imageModels: string[];
        total: number;
    }>;
    proxyStatus: () => Promise<{
        system: {
            url: string;
            source: string;
            bypass: string[];
        } | null;
    }>;
    paint: (input: {
        providerId: string;
        model?: string;
        prompt: string;
        negativePrompt?: string;
        aspectRatio?: string;
        imageSize?: string;
        /** Explicit `WxH`; wins over ratio / tier. */
        size?: string;
        quality?: string;
        seed?: number;
        count: number;
        references: AttachmentJson[];
        projectId: string;
    }, signal?: AbortSignal) => Promise<{
        items: GalleryItem[];
        failures: string[];
    }>;
    importImages: (images: Array<{
        data: string;
        mediaType: string;
        name?: string;
    }>) => Promise<{
        images: Array<{
            attachment: AttachmentJson;
        }>;
        failures: Array<{
            index: number;
            error: string;
        }>;
    }>;
    gallery: {
        revision: () => Promise<{
            revision: number;
        }>;
        projects: () => Promise<{
            revision: number;
            projects: ProjectSummary[];
        }>;
        list: (query: GalleryQuery) => Promise<GalleryPage & {
            revision: number;
        }>;
        update: (ids: string[], patch: {
            favorite?: boolean;
            projectId?: string;
        }) => Promise<{
            changed: number;
        }>;
        remove: (ids: string[]) => Promise<{
            removed: number;
        }>;
        createProject: (name: string) => Promise<{
            project: GalleryProject;
        }>;
        renameProject: (id: string, name: string) => Promise<unknown>;
        deleteProject: (id: string, deleteItems: boolean) => Promise<unknown>;
        reorderProjects: (ids: string[]) => Promise<unknown>;
        favoritePrompts: () => Promise<{
            prompts: FavoritePrompt[];
        }>;
        addFavoritePrompt: (text: string) => Promise<{
            prompt: FavoritePrompt;
        }>;
        updateFavoritePrompt: (id: string, text: string) => Promise<{
            prompt: FavoritePrompt;
        }>;
        reveal: (id: string) => Promise<{
            path: string;
        }>;
        openFolder: () => Promise<{
            path: string;
        }>;
        removeFavoritePrompt: (id: string) => Promise<unknown>;
        importAttachments: (attachments: AttachmentJson[], projectId: string) => Promise<{
            items: GalleryItem[];
        }>;
    };
};
/** Read a picked file as base64 (no data: prefix). */
export declare function fileToBase64(file: Blob): Promise<string>;
/** Host upload limits as the settings view reports them. */
export interface UploadLimits {
    maxImageBytes: number;
    maxImageDimension?: number;
    mediaTypes: readonly string[];
}
/**
 * Make one picked/pasted image fit the host's upload limits: an accepted
 * type, at most `maxImageDimension` per side and `maxImageBytes` in size.
 * Images that already fit are uploaded untouched; others are redrawn and
 * re-encoded (WebP when accepted, keeping transparency, else JPEG), shrinking
 * further until they fit.
 */
export declare function fitImage(file: Blob, limits: UploadLimits | undefined): Promise<Blob>;
/** Human-readable text for the import route's per-image error codes. */
export declare function describeUploadError(code: string, limits?: UploadLimits): string;
/** Upload picked files as durable attachments, shrinking them to the host limits first. */
export declare function uploadFiles(files: readonly File[], limits?: UploadLimits): Promise<AttachmentJson[]>;
/** Save an image to the user's disk. */
export declare function downloadImage(attachment: AttachmentJson, baseName?: string): Promise<void>;
/** Copy an image to the clipboard as PNG (the format browsers accept). */
export declare function copyImage(attachment: AttachmentJson): Promise<void>;
