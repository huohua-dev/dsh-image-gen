/**
 * @copylee/dsh-image-gen Host bundle: Agent image tools, the paintings/gallery/settings
 * routes, and the conversation context line telling the model it can draw.
 */
import type { Context } from '@deepseek-ai/cordis';
import type { ImageAttachmentRef } from '@deepseek-ai/dsh-attachment';
import z from '@deepseek-ai/schemastery';
import { type ContextFormed, type UserMessage } from '@deepseek-ai/dsh-llm';
import { type PluginSettings } from './shared.js';
declare module '@deepseek-ai/dsh-llm' {
    interface MessageSourceMap {
        /** Background image job notices (finished / failed after the call returned). */
        'copylee-image-gen': {
            kind: 'copylee-image-gen';
        } & ContextFormed;
    }
}
export declare const name = "@copylee/dsh-image-gen";
export declare const inject: string[];
export interface Config {
    /** Override the folder holding settings.json / gallery.json. */
    dataDir?: string;
}
export declare const Config: z<Config>;
interface ExecLike {
    agent?: {
        session: {
            header: {
                id?: unknown;
                cwd?: string;
            };
            deriveMessages(): readonly unknown[];
        };
        status?: 'idle' | 'running';
        followup?(message: UserMessage): void;
        inject?(message: UserMessage): void;
    } | undefined;
    signal: AbortSignal;
}
/**
 * Tell the calling Agent that a background job failed, as a collapsed notice row: an idle Agent
 * is woken so it can retry or explain, a running one gets it as context for its next step.
 * Successes are not reported: the image already shows in the reply, and a notice would add a
 * step that turns the finished answer into "process" (DSH treats only the last step as final).
 */
export declare function notifyBackgroundJob(exec: ExecLike, outcome: {
    jobId: string;
    prompt: string;
    error: string;
}): void;
/** One line per enabled provider for the model's context and errors. */
export declare function providerDigest(settings: PluginSettings, keyed: ReadonlySet<string>): string;
export declare function apply(ctx: Context, config?: Config): void;
/** Recover the attachment from a tool result's presentation meta. */
export declare function imageAttachmentFromMeta(meta: unknown): ImageAttachmentRef | undefined;
export {};
