/**
 * ModelScope API-Inference image adapter.
 *
 * ModelScope runs image generation as an asynchronous task: the submit call
 * (with `X-ModelScope-Async-Mode: true`) answers a `task_id`, and the task
 * endpoint is polled until it reports `SUCCEED` with `output_images` URLs.
 * A synchronous `images: [{ url }]` answer is accepted too, so a gateway that
 * flattens the flow keeps working.
 */
import type { ImageMediaType } from '@deepseek-ai/dsh-attachment';
import { type FetchedImage } from './download.js';
import type { FetchLike } from './http.js';
/** Default overall budget for one task, polling included. */
export declare const MODELSCOPE_DEFAULT_TIMEOUT_MS: number;
export interface ModelScopeInput {
    apiKey: string;
    baseURL: string;
    model: string;
    prompt: string;
    /** `WIDTHxHEIGHT`. */
    size?: string | undefined;
    negativePrompt?: string | undefined;
    seed?: number | undefined;
    /** Reference images for edit models such as `Qwen/Qwen-Image-Edit`. */
    sourceImages?: Array<{
        data: Uint8Array;
        mediaType: ImageMediaType;
    }> | undefined;
    maxBytes: number;
    signal: AbortSignal;
    fetch?: FetchLike | undefined;
    /** Poll interval; tests shorten it. */
    pollIntervalMs?: number | undefined;
    timeoutMs?: number | undefined;
}
/** Generate (or edit, when `sourceImages` is non-empty) one image. */
export declare function generateModelScopeImage(input: ModelScopeInput): Promise<FetchedImage>;
