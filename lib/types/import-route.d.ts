/** Upload endpoint turning browser-picked image files into DSH attachments. */
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { ImageAttachmentRef, ImageMediaType } from '@deepseek-ai/dsh-attachment';
export interface ImportRouteDeps {
    /** Durable attachment store; computes dimensions and content-addresses the bytes. */
    saveImage(image: {
        data: Uint8Array;
        mediaType: ImageMediaType;
        name?: string;
    }): Promise<ImageAttachmentRef>;
    /** Per-image byte cap from the host attachment limits. */
    maxImageBytes: number;
    /** Accepted media types from the host attachment limits. */
    mediaTypes: readonly string[];
}
/**
 * Strict base64 check in linear time. A regex with a quantified group (the
 * obvious `^(?:[A-Za-z0-9+/]{4})*…$`) overflows V8's backtracking stack on
 * multi-megabyte inputs and throws instead of matching.
 */
export declare function isBase64(text: string): boolean;
export declare function serveImport(req: IncomingMessage, res: ServerResponse, deps: ImportRouteDeps): Promise<void>;
