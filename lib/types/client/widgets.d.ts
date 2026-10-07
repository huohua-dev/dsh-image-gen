/** Small UI primitives styled with the plugin's DSH-aligned stylesheet. */
import { type ReactNode } from 'react';
export declare function Switch({ checked, onChange, label, disabled }: {
    checked: boolean;
    onChange: (value: boolean) => void;
    label: string;
    disabled?: boolean;
}): import("react").JSX.Element;
/** Portal everything into a `.dig-root` so tokens apply outside the page tree. */
export declare function Portal({ children }: {
    children: ReactNode;
}): import("react").ReactPortal;
export declare function Modal({ title, children, onClose, actions, wide }: {
    title: string;
    children?: ReactNode;
    onClose: () => void;
    actions: ReactNode;
    wide?: boolean;
}): import("react").JSX.Element;
export interface MenuItem {
    label: string;
    icon?: ReactNode;
    danger?: boolean;
    onSelect: () => void;
}
/** Anchored popup menu; closes on outside click, Escape, or selection. */
export declare function Menu({ anchor, items, onClose }: {
    anchor: HTMLElement;
    items: readonly MenuItem[];
    onClose: () => void;
}): import("react").JSX.Element;
/** Menu trigger state: `[anchor, open(event), close]`. */
export declare function useMenu(): [HTMLElement | null, (event: {
    currentTarget: HTMLElement;
    stopPropagation(): void;
}) => void, () => void];
/** Transient message at the bottom of the screen. */
export declare function useToast(): [ReactNode, (message: string) => void];
/** A glyph of the aspect ratio for ratio chips. */
export declare function RatioGlyph({ ratio }: {
    ratio: string;
}): import("react").JSX.Element | null;
