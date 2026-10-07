/** SiliconFlow `images/generations` adapter (Kolors, Qwen-Image, FLUX ...). */
import type { ImageMediaType } from '@deepseek-ai/dsh-attachment';
import { type FetchedImage } from './download.js';
import type { FetchLike } from './http.js';
export interface SiliconFlowInput {
    apiKey: string;
    baseURL: string;
    model: string;
    prompt: string;
    /** `WIDTHxHEIGHT`. */
    size?: string | undefined;
    negativePrompt?: string | undefined;
    seed?: number | undefined;
    /** At most one reference image (edit / image-to-image models). */
    sourceImages?: Array<{
        data: Uint8Array;
        mediaType: ImageMediaType;
    }> | undefined;
    maxBytes: number;
    signal: AbortSignal;
    fetch?: FetchLike | undefined;
}
export declare function generateSiliconFlowImage(input: SiliconFlowInput): Promise<FetchedImage>;
