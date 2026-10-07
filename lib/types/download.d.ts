/** Shared response helpers for the adapters written for this plugin. */
import type { ImageMediaType } from '@deepseek-ai/dsh-attachment';
import type { FetchLike } from './http.js';
/** Image bytes returned before Attachment persistence. */
export interface FetchedImage {
    data: Uint8Array;
    mediaType: ImageMediaType;
}
/** Read a response body, failing once it exceeds `maxBytes`. */
export declare function readBoundedBytes(response: Response, maxBytes: number): Promise<Uint8Array>;
export declare function readBoundedText(response: Response, maxBytes: number): Promise<string>;
export declare function imageMediaType(value: string | null | undefined): ImageMediaType | undefined;
export declare function toDataUrl(image: {
    data: Uint8Array;
    mediaType: ImageMediaType;
}): string;
/** Download (or decode a data URL of) one generated image. */
export declare function downloadImage(url: string, options: {
    fetch: FetchLike;
    maxBytes: number;
    signal: AbortSignal;
    label: string;
}): Promise<FetchedImage>;
/**
 * Add a default API version segment when the base URL has no path at all.
 * Official ModelScope samples use `https://api-inference.modelscope.cn/` and
 * append `v1/...` themselves, so users paste the bare host; the image routes
 * live under `/v1`. A base that already carries a path is left untouched.
 */
export declare function ensureVersionedBase(baseURL: string, version?: string): string;
/** Join a base URL and a relative path without dropping the base path. */
export declare function joinURL(baseURL: string, path: string): string;
/** Sleep that rejects as soon as the signal aborts. */
export declare function abortableDelay(ms: number, signal: AbortSignal): Promise<void>;
