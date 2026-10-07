import type { IncomingMessage, ServerResponse } from 'node:http';
import type { GalleryDb } from './gallery-db.js';
import type { AttachmentJson } from './gallery-types.js';
import type { PluginServices } from './services.js';
/** Markdown image scheme of the cross-plugin contract: `![alt](genimg:<job id>)`. */
export declare const GENIMG_SCHEME = "genimg:";
export type JobState = 'pending' | 'done' | 'failed';
/** What the job route answers. `width`/`height` are the expected ratio while pending. */
export interface JobStatus {
    id: string;
    status: JobState;
    width: number;
    height: number;
    error?: string;
    /** Where the finished image is on disk (workspace copy, else the gallery copy), for "open file". */
    path?: string;
}
export declare function isJobId(value: string): boolean;
/** Ratio the placeholder should reserve before the provider answers. */
export declare function expectedRatio(args: {
    size?: string | undefined;
    aspect_ratio?: string | undefined;
}): {
    width: number;
    height: number;
};
export declare class JobRegistry {
    private readonly gallery;
    private readonly jobs;
    private disposed;
    /** True after {@link dispose}: jobs failing now were stopped, not broken. */
    get stopped(): boolean;
    constructor(gallery: GalleryDb);
    /** Register a pending job; `run` starts it. */
    create(ratio: {
        width: number;
        height: number;
    }): JobStatus;
    /**
     * Run the work under the job's own abort controller (never the tool call's
     * signal: a background job outlives its call; a blocking caller passes that
     * signal as `parent`). Settles the job; rejects with
     * the work's error so a blocking caller can report it.
     */
    run<T extends {
        attachment: AttachmentJson;
        path?: string | undefined;
    }>(id: string, work: (signal: AbortSignal) => Promise<T>, parent?: AbortSignal): Promise<T>;
    /** Current status; finished jobs no longer in memory come from the gallery. */
    status(id: string): Promise<(JobStatus & {
        attachment?: AttachmentJson;
    }) | undefined>;
    /** Abort running jobs (plugin unload); they settle as failed. */
    dispose(): void;
    private prune;
}
/**
 * Prefix route under `/jobs`: `GET <base>/<id>` → status JSON,
 * `GET <base>/<id>/image` → image bytes once done. Unknown ids (e.g. a pending
 * job lost to a restart) answer `failed`, so a placeholder never spins forever.
 */
export declare function jobsRoute(services: PluginServices, jobs: JobRegistry, base: string): (req: IncomingMessage, res: ServerResponse) => Promise<void>;
