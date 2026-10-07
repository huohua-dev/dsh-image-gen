import type { GalleryData, GalleryItem, GalleryProject, GalleryQuery, GalleryPage, FavoritePrompt, NewGalleryItem } from './gallery-types.js';
export * from './gallery-types.js';
/** Coerce untrusted stored data into a valid gallery. */
export declare function normalizeGallery(raw: unknown, now?: number): GalleryData;
export declare class GalleryDb {
    private readonly dir;
    private data;
    private readonly mutex;
    private readonly listeners;
    constructor(dir: string);
    get path(): string;
    private load;
    /** Run one mutation under the lock and persist it. */
    private mutate;
    onChange(listener: () => void): () => void;
    projects(): Promise<Array<GalleryProject & {
        count: number;
        cover?: GalleryItem['attachment'];
    }>>;
    list(query?: GalleryQuery): Promise<GalleryPage>;
    addItems(entries: readonly NewGalleryItem[]): Promise<GalleryItem[]>;
    updateItems(ids: readonly string[], patch: {
        favorite?: boolean;
        projectId?: string;
        tags?: string[];
    }): Promise<number>;
    /** Remove items; returns the removed records (callers clean up their files). */
    removeItems(ids: readonly string[]): Promise<GalleryItem[]>;
    get(id: string): Promise<GalleryItem | undefined>;
    findByJobId(jobId: string): Promise<GalleryItem | undefined>;
    /** Whether any item still points at this file. */
    fileInUse(path: string): Promise<boolean>;
    setFilePath(id: string, filePath: string): Promise<void>;
    createProject(name: string): Promise<GalleryProject>;
    renameProject(id: string, name: string): Promise<void>;
    /** Delete a project; its images move to the default board unless `deleteItems`. */
    deleteProject(id: string, deleteItems?: boolean): Promise<void>;
    reorderProjects(ids: readonly string[]): Promise<void>;
    favoritePrompts(): Promise<FavoritePrompt[]>;
    addFavoritePrompt(text: string): Promise<FavoritePrompt>;
    /** Rewrite a saved prompt; merges into an existing entry with the same text. */
    updateFavoritePrompt(id: string, text: string): Promise<FavoritePrompt>;
    removeFavoritePrompt(id: string): Promise<void>;
}
