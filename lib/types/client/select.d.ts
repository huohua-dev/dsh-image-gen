/**
 * Dropdown in DSH's Menu style (ported from the dsh-free-search Select):
 * input-like trigger with a rotating chevron, a fixed-position floating card
 * (34px rows, trailing check on the selected row, optional group labels and
 * right-hand detail), keyboard navigation, and upward placement when the
 * space below runs out. `editable` adds a filter box that also accepts a
 * free-form value (model ids).
 */
import { type ReactNode } from 'react';
export interface SelectOption {
    value: string;
    label: string;
    group?: string;
    detail?: string;
}
export declare function Select(props: {
    options: readonly SelectOption[];
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    /** Accessible name of the trigger. */
    label?: string;
    id?: string;
    /** Shrink to content (toolbars) instead of filling the row. */
    compact?: boolean;
    /** Show a filter box that also commits free text on Enter. */
    editable?: boolean;
    /** Placeholder for the editable filter box. */
    editablePlaceholder?: string;
    /** Shown on the trigger when the value matches no option. */
    placeholder?: string;
    /** Extra node on the trigger before the chevron. */
    adornment?: ReactNode;
}): import("react").JSX.Element;
