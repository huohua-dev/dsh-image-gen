import type { Translate } from './i18n.js';
export declare function ModelList({ t, models, defaultModel, onChange, onFetch, fetchDisabled }: {
    t: Translate;
    models: readonly string[];
    defaultModel: string;
    onChange: (next: {
        models: string[];
        defaultModel: string;
    }) => void;
    /** Pull model ids from the provider; rejects with a readable message. */
    onFetch: () => Promise<FetchedModels>;
    fetchDisabled?: boolean;
}): import("react").JSX.Element;
/** What the provider's /models listing returned. */
export interface FetchedModels {
    models: string[];
    /** Subset that looks like image-generation models. */
    imageModels: string[];
}
export declare function ModelPicker({ t, fetched, existing, onClose, onConfirm }: {
    t: Translate;
    fetched: FetchedModels;
    existing: readonly string[];
    onClose: () => void;
    onConfirm: (ids: string[]) => void;
}): import("react").JSX.Element;
