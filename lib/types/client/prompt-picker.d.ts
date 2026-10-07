import type { FavoritePrompt } from '../gallery-types.js';
import type { Translate } from './i18n.js';
export declare function PromptPicker({ t, anchor, prompt, prompts, onReload, onUse, onClose, onError }: {
    t: Translate;
    /** Element the popover opens above (the composer). */
    anchor: HTMLElement;
    prompt: string;
    prompts: readonly FavoritePrompt[];
    onReload: () => void;
    onUse: (text: string, mode: 'replace' | 'append') => void;
    onClose: () => void;
    onError: (message: string) => void;
}): import("react").JSX.Element | null;
