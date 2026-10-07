import { type SettingsView } from '../shared.js';
import type { Translate } from './i18n.js';
export declare function SettingsPanel({ t, onSaved }: {
    t: Translate;
    onSaved?: (view: SettingsView) => void;
}): import("react").JSX.Element;
