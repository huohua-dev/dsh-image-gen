/** DashScope Qwen Image generation and editing adapter. */
import type { ImageAttachmentRef, ImageMediaType } from '@deepseek-ai/dsh-attachment';
import type { FetchLike } from './http.js';
export interface DashScopeImageOptions {
    apiKey: string;
    endpoint: string;
    model: string;
    prompt: string;
    size?: string;
    maxBytes: number;
    signal?: AbortSignal;
    /** Proxy-aware fetch; defaults to the global one. */
    fetch?: FetchLike;
}
export interface DashScopeEditOptions extends DashScopeImageOptions {
    sourceImages: Array<{
        data: Uint8Array;
        mediaType: ImageMediaType;
    }>;
}
export declare function generateDashScopeImage(options: DashScopeImageOptions): Promise<{
    data: Uint8Array;
    mediaType: ImageAttachmentRef['mediaType'];
}>;
export declare function editDashScopeImage(options: DashScopeEditOptions): Promise<{
    data: Uint8Array;
    mediaType: ImageAttachmentRef['mediaType'];
}>;
