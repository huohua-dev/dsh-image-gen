import { type ProtocolCapabilities, type SizeRange } from '../shared.js';
import type { Translate } from './i18n.js';
export type ResolutionMode = 'std' | '1k' | '1.5k' | '2k' | 'custom';
export interface ResolutionState {
    res: ResolutionMode;
    w: number;
    h: number;
    /** Keep W:H on the selected ratio while editing custom sizes. */
    lock: boolean;
}
export declare const DEFAULT_RESOLUTION: ResolutionState;
/** Presets whose size fits the range without clamping either side. */
export declare function presetsFor(range: SizeRange, ratio: string): Array<{
    id: ResolutionMode;
    label: string;
    width: number;
    height: number;
}>;
/**
 * The explicit `WxH` the request should carry, or undefined for the
 * provider's standard size (ratio table / tier).
 */
export declare function explicitSize(caps: ProtocolCapabilities | undefined, ratio: string, state: ResolutionState): string | undefined;
export declare function ResolutionPicker({ t, caps, ratio, value, onChange }: {
    t: Translate;
    caps: ProtocolCapabilities;
    ratio: string;
    value: ResolutionState;
    onChange: (next: ResolutionState) => void;
}): import("react").JSX.Element | null;
