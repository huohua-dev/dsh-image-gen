/** Route one generation/edit request to the adapter for the entry's protocol. */
import type { ImageMediaType } from '@deepseek-ai/dsh-attachment';
import { type FetchLike } from './http.js';
import { type GlobalProxy, type ProviderEntry } from './shared.js';
export interface SourceImage {
    data: Uint8Array;
    mediaType: ImageMediaType;
}
export interface GenerationRequest {
    prompt: string;
    model?: string | undefined;
    aspectRatio?: string | undefined;
    imageSize?: string | undefined;
    /** Explicit wire size; wins over ratio/tier. */
    size?: string | undefined;
    /** OpenAI-family quality tier. */
    quality?: string | undefined;
    negativePrompt?: string | undefined;
    seed?: number | undefined;
    /** Non-empty → edit / image-to-image. */
    sourceImages?: SourceImage[] | undefined;
}
export interface GenerationResult {
    data: Uint8Array;
    mediaType: ImageMediaType;
    model: string;
    /** Human summary of the size actually requested. */
    output: string;
}
/** Seedream takes pixel sizes or a bare tier (`2K`, `4K`). */
export declare function seedreamSize(aspectRatio?: string, imageSize?: string): string;
export declare function runGeneration(input: {
    entry: ProviderEntry;
    apiKey: string;
    globalProxy: GlobalProxy;
    request: GenerationRequest;
    maxBytes: number;
    signal: AbortSignal;
    /** Tests inject a fake fetch; production resolves the proxy. */
    fetch?: FetchLike;
}): Promise<GenerationResult>;
