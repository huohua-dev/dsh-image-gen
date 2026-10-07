import type { AttachmentJson } from './gallery-types.js';
/** The folder image copies go to. */
export declare function resolveImageDir(configured: string | undefined, dataDir: string): string;
/** File-system-safe short slug of a prompt (keeps CJK letters). */
export declare function promptSlug(prompt: string, max?: number): string;
/** Relative path of the copy for one image. */
export declare function copyName(attachment: AttachmentJson, prompt: string, createdAt: number): string;
/** Write the copy; returns its absolute path. */
export declare function writeImageCopy(dir: string, attachment: AttachmentJson, data: Uint8Array, prompt: string, createdAt?: number): Promise<string>;
/** Whether `child` lies inside `parent`. */
export declare function isInside(parent: string, child: string): boolean;
export declare function fileExists(path: string): Promise<boolean>;
/** Delete a copy, but only one living inside the images folder. */
export declare function removeImageCopy(dir: string, path: string | undefined): Promise<void>;
/** How the OS file manager is launched; injectable for tests. */
export type Launcher = (command: string, args: string[], options: {
    windowsVerbatimArguments?: boolean;
}) => void;
export declare const defaultLauncher: Launcher;
/** Select one file in Explorer / Finder; other platforms open its folder. */
export declare function revealInFileManager(path: string, launch?: Launcher, platform?: NodeJS.Platform): void;
/** Open a folder in the OS file manager (created first if missing). */
export declare function openFolder(dir: string, launch?: Launcher, platform?: NodeJS.Platform): Promise<void>;
