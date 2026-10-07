import type { IncomingMessage, ServerResponse } from 'node:http';
import { CONVERSATION_PROJECT_ID } from './gallery-types.js';
import { type PluginServices } from './services.js';
import { type ProviderEntry } from './shared.js';
/** `GET ?ref=<json>` → image bytes. Cross-site embeds are refused. */
export declare function imageRoute(services: PluginServices): (req: IncomingMessage, res: ServerResponse) => Promise<void>;
/** GET → settings view; POST `{ settings }` → save, answer the new view. */
export declare function settingsRoute(services: PluginServices): (req: IncomingMessage, res: ServerResponse) => Promise<void>;
/** POST `{ providerId, key }`; a blank/null key clears it. */
export declare function keyRoute(services: PluginServices): (req: IncomingMessage, res: ServerResponse) => Promise<void>;
/** Where a protocol lists its models (also the connection probe). */
export declare function modelsURL(entry: Pick<ProviderEntry, 'protocol' | 'baseURL'>): string | undefined;
/** Pull model ids out of OpenAI-style `{ data: [{ id }] }` or Gemini `{ models: [{ name }] }`. */
export declare function modelIds(payload: unknown): string[];
/** Heuristic for “looks like an image-generation model”. */
export declare const IMAGE_MODEL_HINT: RegExp;
/** Split a model list into all ids and the image-like subset. */
export declare function classifyModels(ids: readonly string[]): {
    models: string[];
    imageModels: string[];
};
/**
 * POST `{ providerId, entry?, key?, proxy? }` → connectivity verdict, or
 * `{ proxyUrl }` → probe the proxy itself.
 */
export declare function testRoute(services: PluginServices): (req: IncomingMessage, res: ServerResponse) => Promise<void>;
/** GET → the detected system proxy (always re-detected). */
export declare function proxyStatusRoute(): (req: IncomingMessage, res: ServerResponse) => Promise<void>;
/** POST `{ providerId, entry?, key? }` → every model id plus the image-like subset. */
export declare function modelsRoute(services: PluginServices): (req: IncomingMessage, res: ServerResponse) => Promise<void>;
/** POST a paintings-page request: N images, saved straight into the gallery. */
export declare function paintRoute(services: PluginServices): (req: IncomingMessage, res: ServerResponse) => Promise<void>;
/** POST `{ op, ... }` — every gallery read and write. */
export declare function galleryRoute(services: PluginServices): (req: IncomingMessage, res: ServerResponse) => Promise<void>;
export { CONVERSATION_PROJECT_ID };
