import type { AttachmentJson } from '../gallery-types.js';
import { type LocaleService } from './i18n.js';
interface ImageResult {
    attachment: AttachmentJson;
    prompt: string;
    provider: string;
    model: string;
    output: string;
}
type Block = {
    kind?: string;
    meta?: unknown;
    content?: Array<{
        type: string;
        text?: string;
        attachment?: AttachmentJson;
    }>;
    resultView?: {
        card?: string;
        meta?: unknown;
        content?: Array<{
            type: string;
            text?: string;
            attachment?: AttachmentJson;
        }>;
    } | null;
};
/** Background jobs a result started (`background: true`); their images show in the reply. */
export declare function pendingJobs(block: Block | undefined): string[];
/** Every image a tool-call block carries, from meta first, then content. */
export declare function imageResults(block: Block | undefined): ImageResult[];
export declare function ImageToolCard(props: {
    block?: Block;
    phase?: 'preparing' | 'start' | 'result';
    locale?: LocaleService | undefined;
}): import("react").JSX.Element;
export {};
