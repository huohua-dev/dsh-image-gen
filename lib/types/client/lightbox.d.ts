import type { GalleryItem } from '../gallery-types.js';
import type { Translate } from './i18n.js';
export interface LightboxActions {
    onFavorite?: (item: GalleryItem) => void;
    onDelete?: (item: GalleryItem) => void;
    onDownload: (item: GalleryItem) => void;
    onCopy: (item: GalleryItem) => void;
    onUseAsReference?: (item: GalleryItem) => void;
    onReusePrompt?: (item: GalleryItem) => void;
    /** Show the image's file in the OS file manager. */
    onReveal?: (item: GalleryItem) => void;
}
export declare function Lightbox({ items, index, onIndex, onClose, t, actions, projectName }: {
    items: readonly GalleryItem[];
    index: number;
    onIndex: (index: number) => void;
    onClose: () => void;
    t: Translate;
    actions: LightboxActions;
    projectName?: (id: string) => string;
}): import("react").JSX.Element | null;
