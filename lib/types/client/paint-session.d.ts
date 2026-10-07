import type { AttachmentJson, GalleryItem } from '../gallery-types.js';
import { api } from './api.js';
export type PaintRequest = Parameters<typeof api.paint>[0];
export type PaintResult = Awaited<ReturnType<typeof api.paint>>;
export interface Board {
    /** Images of the last generation shown on the artboard. */
    batch: GalleryItem[];
    /** Image picked on the board or from history; null = empty canvas. */
    selectedId: string | null;
    error: string | null;
}
export interface PaintJob {
    projectId: string;
    count: number;
    prompt: string;
    startedAt: number;
    controller: AbortController;
}
export interface PaintSession {
    draft: {
        prompt: string;
        references: AttachmentJson[];
    };
    boards: ReadonlyMap<string, Board>;
    jobs: ReadonlyMap<string, PaintJob>;
}
export declare const EMPTY_BOARD: Board;
export declare function getPaintSession(): PaintSession;
export declare function subscribePaintSession(listener: () => void): () => void;
export declare function usePaintSession(): PaintSession;
/** Called whenever a job saved images, even with no page mounted to see it. */
export declare function onGalleryChanged(listener: () => void): () => void;
export declare function boardOf(session: PaintSession, projectId: string): Board;
type Patch<T> = Partial<T> | ((current: T) => Partial<T>);
export declare function setDraft(patch: Patch<PaintSession['draft']>): void;
export declare function updateBoard(projectId: string, patch: Patch<Board>): void;
/** Clear a project's artboard back to the empty canvas. */
export declare function clearBoard(projectId: string): void;
/**
 * Start a generation for one project (one job per project at a time). The
 * result lands on that project's board whether or not the page is mounted.
 */
export declare function startJob(request: PaintRequest, options: {
    /** Text for partial failures, e.g. “2 张失败：…”. */
    describeFailures: (failures: string[]) => string;
    paint?: (input: PaintRequest, signal: AbortSignal) => Promise<PaintResult>;
}): Promise<void>;
export declare function stopJob(projectId: string): void;
/** Tests only. */
export declare function resetPaintSession(): void;
export {};
