/** Volcengine Ark Seedream image-editing adapter. */
import type { ImageMediaType } from '@deepseek-ai/dsh-attachment';
import type { GeneratedCompatibleImage } from './openai-compatible.js';
import { type ArkOutputOptions } from './shared.js';
import type { FetchLike } from './http.js';
/** Edit one image through Ark ImageGenerations using a data-URL reference. */
export declare function editSeedreamImage(input: {
    apiKey: string;
    baseURL: string;
    model: string;
    prompt: string;
    sourceImages: Array<{
        data: Uint8Array;
        mediaType: ImageMediaType;
    }>;
    size?: string;
    maxBytes: number;
    signal: AbortSignal;
    /** Proxy-aware fetch; defaults to the global one. */
    fetch?: FetchLike;
    /**
     * Ark output controls. The edit path is the only one Ark lets request a
     * transparent background, and it requires every reference image to carry an
     * alpha channel — see `arkOutputBody`.
     */
    arkOptions?: ArkOutputOptions;
}): Promise<GeneratedCompatibleImage>;
