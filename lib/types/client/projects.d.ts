import { type ProjectSummary } from './api.js';
import type { Translate } from './i18n.js';
/** Pseudo-project ids used by the gallery tab's filter rows. */
export declare const ALL_PROJECTS = "__all__";
export declare const FAVORITES = "__favorites__";
export declare function ProjectList({ projects, current, onSelect, onChanged, t, showAll, onError, busyIds }: {
    projects: readonly ProjectSummary[];
    current: string;
    onSelect: (id: string) => void;
    onChanged: () => void;
    t: Translate;
    /** Gallery tab: prepend “全部” and “收藏” rows. */
    showAll?: {
        total: number;
        favorites: number;
    };
    onError: (message: string) => void;
    /** Projects with a generation running (paint tab). */
    busyIds?: ReadonlySet<string>;
}): import("react").JSX.Element;
/** Built-in project names follow the UI language. */
export declare function projectLabel(project: {
    id: string;
    name: string;
    builtin?: boolean;
}, t: Translate): string;
