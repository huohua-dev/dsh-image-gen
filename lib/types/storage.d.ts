/**
 * Directory holding this plugin's settings and gallery. Precedence: explicit
 * config, `COPYLEE_IMAGE_GEN_HOME`, `$DSH_HOME/storages/copylee-image-gen`, then
 * `~/.dsh/storages/copylee-image-gen` (next to DSH's own `workspace.json`).
 */
export declare function resolveDataDir(configured?: string): string;
/** Read and parse one JSON file; `undefined` when it does not exist. */
export declare function readJson(path: string): Promise<unknown>;
/** Atomically replace one JSON file (write a sibling, then rename). */
export declare function writeJson(path: string, value: unknown, mode?: number): Promise<void>;
/** Serialize async read-modify-write operations on one resource. */
export declare class Mutex {
    private tail;
    run<T>(task: () => Promise<T>): Promise<T>;
}
