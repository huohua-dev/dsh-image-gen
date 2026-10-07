/**
 * @copylee/dsh-image-gen browser bundle.
 *
 * - Left sidebar entry “绘画” (`sidebar.panellist`) opening a global page in
 *   the `main` seat — the same mechanism DSH's own 自动化任务 uses, so the
 *   gallery lives outside any project/session.
 * - Settings page under 设置 > 插件 (`settings.plugins.tab`, plus the older
 *   `settings.plugin.item` seat for hosts that still have it).
 * - Result cards for the Agent image tools (`tool.call.toolview`).
 */
import type { Context } from '@deepseek-ai/cordis';
export { PaintingsPage } from './paintings-page.js';
export { SettingsPanel } from './settings-view.js';
/** Panel id shared by the sidebar entry and its `main` page. */
export declare const PANEL_ID = "copylee-image-gen.paintings";
export declare const inject: string[];
export declare function apply(ctx: Context): void;
