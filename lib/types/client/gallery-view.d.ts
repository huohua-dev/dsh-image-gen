import { type GalleryItem } from '../gallery-types.js';
import type { SettingsView } from '../shared.js';
import { type ProjectSummary } from './api.js';
import type { Translate } from './i18n.js';
export declare function GalleryView(props: {
    t: Translate;
    settings: SettingsView | null;
    projects: readonly ProjectSummary[];
    /** Project id, ALL_PROJECTS or FAVORITES. */
    filter: string;
    refreshKey: number;
    onGalleryChanged: () => void;
    onError: (message: string) => void;
    toast: (message: string) => void;
    /** Send an image to the paint tab as a reference / its prompt to the composer. */
    onUseAsReference: (item: GalleryItem) => void;
    onReusePrompt: (item: GalleryItem) => void;
    sideTop: JSX.Element;
}): import("react").JSX.Element;
