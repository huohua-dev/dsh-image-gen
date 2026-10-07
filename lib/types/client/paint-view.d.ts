import type { AttachmentJson, GalleryItem } from '../gallery-types.js';
import { type ProviderView, type SettingsView } from '../shared.js';
import type { Translate } from './i18n.js';
/** Providers the paintings page can use right now. */
export declare function readyProviders(settings: SettingsView | null): ProviderView[];
export declare function PaintView(props: {
    t: Translate;
    settings: SettingsView | null;
    projectId: string;
    /** History of the current project (newest first). */
    history: readonly GalleryItem[];
    /** Re-read gallery data after a change. */
    onGalleryChanged: () => void;
    onError: (message: string) => void;
    toast: (message: string) => void;
    onOpenSettings: () => void;
    /** Prompt / reference handed over from another tab. */
    injected: {
        text?: string;
        reference?: AttachmentJson;
        nonce: number;
    } | null;
    sideTop: JSX.Element;
    /** Bumps when gallery data (incl. saved prompts) changes elsewhere. */
    refreshKey: number;
}): import("react").JSX.Element;
