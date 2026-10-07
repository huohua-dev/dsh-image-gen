window.__ModuleLoader__.load({
	id: "@copylee/dsh-image-gen",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		//#region \0rolldown/runtime.js
		var __create = Object.create;
		var __defProp = Object.defineProperty;
		var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
		var __getOwnPropNames = Object.getOwnPropertyNames;
		var __getProtoOf = Object.getPrototypeOf;
		var __hasOwnProp = Object.prototype.hasOwnProperty;
		var __copyProps = (to, from, except, desc) => {
			if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
				key = keys[i];
				if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
					get: ((k) => from[k]).bind(null, key),
					enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
				});
			}
			return to;
		};
		var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
			value: mod,
			enumerable: true
		}) : target, mod));
		//#endregion
		let react_jsx_runtime = require("react/jsx-runtime");
		let react = require("react");
		react = __toESM(react, 1);
		let react_dom = require("react-dom");
		//#region node_modules/.pnpm/lucide-react@1.49.0_@types+react@18.3.31_react@18.3.1/node_modules/lucide-react/dist/esm/shared/src/utils/toKebabCase.mjs
		/**
		* @license lucide-react v1.49.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const toKebabCase = (string) => string?.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.49.0_@types+react@18.3.31_react@18.3.1/node_modules/lucide-react/dist/esm/shared/src/utils/toLucideIconData.mjs
		/**
		* @license lucide-react v1.49.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		function toLucideIconData(iconName, iconNode, aliases = []) {
			if (iconNode == null) throw new Error("[lucide]: iconNode is required when icon name is used");
			return {
				name: toKebabCase(iconName),
				size: 24,
				node: iconNode,
				...aliases.length > 0 ? { aliases } : {}
			};
		}
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.49.0_@types+react@18.3.31_react@18.3.1/node_modules/lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs
		/**
		* @license lucide-react v1.49.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const toCamelCase = (string) => {
			let out = "";
			let upperNext = false;
			for (const ch of string) {
				if (ch === "-" || ch === "_" || ch <= " ") {
					upperNext = out.length > 0;
					continue;
				}
				if (out.length === 0) out += ch.toLowerCase();
				else out += upperNext ? ch.toUpperCase() : ch;
				upperNext = false;
			}
			return out;
		};
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.49.0_@types+react@18.3.31_react@18.3.1/node_modules/lucide-react/dist/esm/shared/src/utils/toPascalCase.mjs
		/**
		* @license lucide-react v1.49.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const toPascalCase = (string) => {
			const camelCase = toCamelCase(string);
			return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
		};
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.49.0_@types+react@18.3.31_react@18.3.1/node_modules/lucide-react/dist/esm/shared/src/utils/mergeClasses.mjs
		/**
		* @license lucide-react v1.49.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const mergeClasses = (...classes) => classes.filter((className, index, array) => {
			return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
		}).join(" ").trim();
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.49.0_@types+react@18.3.31_react@18.3.1/node_modules/lucide-react/dist/esm/shared/src/build/defaultAttributes.mjs
		/**
		* @license lucide-react v1.49.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const defaultAttributes = {
			xmlns: "http://www.w3.org/2000/svg",
			width: 24,
			height: 24,
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			"stroke-width": 2,
			"stroke-linecap": "round",
			"stroke-linejoin": "round"
		};
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.49.0_@types+react@18.3.31_react@18.3.1/node_modules/lucide-react/dist/esm/shared/src/build/buildLucideIconNode.mjs
		/**
		* @license lucide-react v1.49.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		function isDefined(value) {
			return value !== null && value !== void 0;
		}
		function buildLucideIconNode(icon, params = {}) {
			const attributeNames = params.attributeNames ?? {};
			const getAttributeName = (attributeName) => attributeNames[attributeName] ?? attributeName;
			const viewBoxWidth = icon.size ?? icon.width ?? defaultAttributes["width"];
			const viewBoxHeight = icon.size ?? icon.height ?? defaultAttributes["height"];
			const aliasClassNames = icon.aliases?.filter((alias) => typeof alias === "string" && alias.trim() !== "").map((alias) => `lucide-${alias}`) ?? [];
			const iconClassNames = [...icon.name ? [`lucide-${icon.name}`] : [], ...aliasClassNames];
			const classNamesFromClassName = params.className?.split(" ").filter(Boolean) ?? [];
			const className = params.includeDefaultClasses === false ? mergeClasses(...classNamesFromClassName) : mergeClasses("lucide", ...iconClassNames, ...classNamesFromClassName);
			const calculatedStrokeWidth = params.absoluteStrokeWidth ? Number(params.strokeWidth ?? defaultAttributes["stroke-width"]) * Number(icon.size ?? icon.width ?? defaultAttributes["width"]) / Number(params.size ?? params.width ?? defaultAttributes["width"]) : params.strokeWidth ?? defaultAttributes["stroke-width"];
			return [
				"svg",
				{
					...Object.entries(defaultAttributes).reduce((attrs, [attrName, value]) => {
						attrs[getAttributeName(attrName)] = value;
						return attrs;
					}, {}),
					..."color" in params && params.color && { [getAttributeName("stroke")]: params.color },
					..."size" in params && isDefined(params.size) && {
						[getAttributeName("width")]: params.size,
						[getAttributeName("height")]: params.size
					},
					..."width" in params && isDefined(params.width) && { [getAttributeName("width")]: params.width },
					..."height" in params && isDefined(params.height) && { [getAttributeName("height")]: params.height },
					[getAttributeName("stroke-width")]: calculatedStrokeWidth,
					...className && { [getAttributeName("class")]: className },
					[getAttributeName("viewBox")]: `0 0 ${viewBoxWidth} ${viewBoxHeight}`,
					...params.hasA11yProp === false ? { [getAttributeName("aria-hidden")]: "true" } : {},
					..."attributes" in params && params.attributes
				},
				icon.node.map((child) => {
					const [name, attrs, children] = child;
					const nextAttrs = params.nonScalingStroke ? {
						[getAttributeName("vector-effect")]: "non-scaling-stroke",
						...attrs
					} : attrs;
					return children ? [
						name,
						nextAttrs,
						children
					] : [name, nextAttrs];
				})
			];
		}
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.49.0_@types+react@18.3.31_react@18.3.1/node_modules/lucide-react/dist/esm/shared/src/build/buildLucideIconForReact.mjs
		/**
		* @license lucide-react v1.49.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		function buildLucideIconForReact(icon, params = {}) {
			return buildLucideIconNode(icon, {
				...params,
				attributeNames: {
					...params.attributeNames,
					class: "className",
					"stroke-width": "strokeWidth",
					"stroke-linecap": "strokeLinecap",
					"stroke-linejoin": "strokeLinejoin",
					"vector-effect": "vectorEffect"
				}
			});
		}
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.49.0_@types+react@18.3.31_react@18.3.1/node_modules/lucide-react/dist/esm/shared/src/utils/hasA11yProp.mjs
		/**
		* @license lucide-react v1.49.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const hasA11yProp = (props) => {
			for (const prop in props) if (prop.startsWith("aria-") || prop === "role" || prop === "title") return true;
			return false;
		};
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.49.0_@types+react@18.3.31_react@18.3.1/node_modules/lucide-react/dist/esm/context.mjs
		/**
		* @license lucide-react v1.49.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const LucideContext = (0, react.createContext)({});
		const useLucideContext = () => (0, react.useContext)(LucideContext);
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.49.0_@types+react@18.3.31_react@18.3.1/node_modules/lucide-react/dist/esm/Icon.mjs
		/**
		* @license lucide-react v1.49.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const Icon = (0, react.forwardRef)(({ color, size, width, height, strokeWidth, absoluteStrokeWidth, nonScalingStroke, className = "", children, iconNode = [], icon = {
			node: iconNode,
			aliases: [],
			size: 24
		}, ...rest }, ref) => {
			const { size: contextSize = 24, strokeWidth: contextStrokeWidth = 2, absoluteStrokeWidth: contextAbsoluteStrokeWidth = false, nonScalingStroke: contextNonScalingStroke = false, color: contextColor = "currentColor", className: contextClass = "" } = useLucideContext() ?? {};
			const hasAccessibleProp = Boolean(children) || hasA11yProp(rest);
			const [name, svgAttributes, builtIconNode = []] = buildLucideIconForReact(icon, {
				color: color ?? contextColor,
				width: width ?? size ?? contextSize,
				height: height ?? size ?? contextSize,
				strokeWidth: strokeWidth ?? contextStrokeWidth,
				absoluteStrokeWidth: absoluteStrokeWidth ?? contextAbsoluteStrokeWidth,
				nonScalingStroke: nonScalingStroke ?? contextNonScalingStroke,
				className: mergeClasses(contextClass, className),
				hasA11yProp: hasAccessibleProp,
				attributes: rest
			});
			return (0, react.createElement)(name, {
				ref,
				...svgAttributes
			}, [...builtIconNode.map(([tag, attrs]) => (0, react.createElement)(tag, attrs)), ...Array.isArray(children) ? children : [children]]);
		});
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.49.0_@types+react@18.3.31_react@18.3.1/node_modules/lucide-react/dist/esm/createLucideIcon.mjs
		/**
		* @license lucide-react v1.49.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		function createLucideIcon(iconDataOrName, iconNode = [], aliases = []) {
			const iconData = typeof iconDataOrName === "string" ? toLucideIconData(iconDataOrName, iconNode, aliases) : iconDataOrName;
			const Component = (0, react.forwardRef)(({ className, ...props }, ref) => (0, react.createElement)(Icon, {
				ref,
				icon: iconData,
				className,
				...props
			}));
			if (iconData.name) Component.displayName = toPascalCase(iconData.name);
			return Component;
		}
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.49.0_@types+react@18.3.31_react@18.3.1/node_modules/lucide-react/dist/esm/icons/bookmark-check.mjs
		/**
		* @license lucide-react v1.49.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const __iconData$32 = {
			name: "bookmark-check",
			size: 24,
			node: [["path", {
				d: "M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z",
				key: "oz39mx"
			}], ["path", {
				d: "m9 10 2 2 4-4",
				key: "1gnqz4"
			}]]
		};
		__iconData$32.node;
		const BookmarkCheck = createLucideIcon(__iconData$32);
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.49.0_@types+react@18.3.31_react@18.3.1/node_modules/lucide-react/dist/esm/icons/bookmark.mjs
		/**
		* @license lucide-react v1.49.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const __iconData$31 = {
			name: "bookmark",
			size: 24,
			node: [["path", {
				d: "M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z",
				key: "oz39mx"
			}]]
		};
		__iconData$31.node;
		const Bookmark = createLucideIcon(__iconData$31);
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.49.0_@types+react@18.3.31_react@18.3.1/node_modules/lucide-react/dist/esm/icons/check.mjs
		/**
		* @license lucide-react v1.49.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const __iconData$30 = {
			name: "check",
			size: 24,
			node: [["path", {
				d: "M20 6 9 17l-5-5",
				key: "1gmf2c"
			}]]
		};
		__iconData$30.node;
		const Check = createLucideIcon(__iconData$30);
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.49.0_@types+react@18.3.31_react@18.3.1/node_modules/lucide-react/dist/esm/icons/chevron-left.mjs
		/**
		* @license lucide-react v1.49.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const __iconData$29 = {
			name: "chevron-left",
			size: 24,
			node: [["path", {
				d: "m15 18-6-6 6-6",
				key: "1wnfg3"
			}]]
		};
		__iconData$29.node;
		const ChevronLeft = createLucideIcon(__iconData$29);
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.49.0_@types+react@18.3.31_react@18.3.1/node_modules/lucide-react/dist/esm/icons/chevron-right.mjs
		/**
		* @license lucide-react v1.49.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const __iconData$28 = {
			name: "chevron-right",
			size: 24,
			node: [["path", {
				d: "m9 18 6-6-6-6",
				key: "mthhwq"
			}]]
		};
		__iconData$28.node;
		const ChevronRight = createLucideIcon(__iconData$28);
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.49.0_@types+react@18.3.31_react@18.3.1/node_modules/lucide-react/dist/esm/icons/copy.mjs
		/**
		* @license lucide-react v1.49.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const __iconData$27 = {
			name: "copy",
			size: 24,
			node: [["rect", {
				width: "14",
				height: "14",
				x: "8",
				y: "8",
				rx: "2",
				ry: "2",
				key: "17jyea"
			}], ["path", {
				d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",
				key: "zix9uf"
			}]]
		};
		__iconData$27.node;
		const Copy = createLucideIcon(__iconData$27);
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.49.0_@types+react@18.3.31_react@18.3.1/node_modules/lucide-react/dist/esm/icons/download.mjs
		/**
		* @license lucide-react v1.49.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const __iconData$26 = {
			name: "download",
			size: 24,
			node: [
				["path", {
					d: "M12 15V3",
					key: "m9g1x1"
				}],
				["path", {
					d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",
					key: "ih7n3h"
				}],
				["path", {
					d: "m7 10 5 5 5-5",
					key: "brsn70"
				}]
			]
		};
		__iconData$26.node;
		const Download = createLucideIcon(__iconData$26);
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.49.0_@types+react@18.3.31_react@18.3.1/node_modules/lucide-react/dist/esm/icons/ellipsis.mjs
		/**
		* @license lucide-react v1.49.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const __iconData$25 = {
			name: "ellipsis",
			size: 24,
			node: [
				["circle", {
					cx: "12",
					cy: "12",
					r: "1",
					key: "41hilf"
				}],
				["circle", {
					cx: "19",
					cy: "12",
					r: "1",
					key: "1wjl8i"
				}],
				["circle", {
					cx: "5",
					cy: "12",
					r: "1",
					key: "1pcz8c"
				}]
			],
			aliases: ["more-horizontal"]
		};
		__iconData$25.node;
		const Ellipsis = createLucideIcon(__iconData$25);
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.49.0_@types+react@18.3.31_react@18.3.1/node_modules/lucide-react/dist/esm/icons/eraser.mjs
		/**
		* @license lucide-react v1.49.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const __iconData$24 = {
			name: "eraser",
			size: 24,
			node: [["path", {
				d: "M21 21H8a2 2 0 0 1-1.42-.587l-3.994-3.999a2 2 0 0 1 0-2.828l10-10a2 2 0 0 1 2.829 0l5.999 6a2 2 0 0 1 0 2.828L12.834 21",
				key: "g5wo59"
			}], ["path", {
				d: "m5.082 11.09 8.828 8.828",
				key: "1wx5vj"
			}]]
		};
		__iconData$24.node;
		const Eraser = createLucideIcon(__iconData$24);
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.49.0_@types+react@18.3.31_react@18.3.1/node_modules/lucide-react/dist/esm/icons/folder-input.mjs
		/**
		* @license lucide-react v1.49.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const __iconData$23 = {
			name: "folder-input",
			size: 24,
			node: [
				["path", {
					d: "M2 9V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1",
					key: "fm4g5t"
				}],
				["path", {
					d: "M2 13h10",
					key: "pgb2dq"
				}],
				["path", {
					d: "m9 16 3-3-3-3",
					key: "6m91ic"
				}]
			]
		};
		__iconData$23.node;
		const FolderInput = createLucideIcon(__iconData$23);
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.49.0_@types+react@18.3.31_react@18.3.1/node_modules/lucide-react/dist/esm/icons/folder-open.mjs
		/**
		* @license lucide-react v1.49.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const __iconData$22 = {
			name: "folder-open",
			size: 24,
			node: [["path", {
				d: "m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",
				key: "usdka0"
			}]]
		};
		__iconData$22.node;
		const FolderOpen = createLucideIcon(__iconData$22);
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.49.0_@types+react@18.3.31_react@18.3.1/node_modules/lucide-react/dist/esm/icons/folder.mjs
		/**
		* @license lucide-react v1.49.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const __iconData$21 = {
			name: "folder",
			size: 24,
			node: [["path", {
				d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
				key: "1kt360"
			}]]
		};
		__iconData$21.node;
		const Folder = createLucideIcon(__iconData$21);
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.49.0_@types+react@18.3.31_react@18.3.1/node_modules/lucide-react/dist/esm/icons/globe.mjs
		/**
		* @license lucide-react v1.49.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const __iconData$20 = {
			name: "globe",
			size: 24,
			node: [
				["circle", {
					cx: "12",
					cy: "12",
					r: "10",
					key: "1mglay"
				}],
				["path", {
					d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",
					key: "13o1zl"
				}],
				["path", {
					d: "M2 12h20",
					key: "9i4pu4"
				}]
			]
		};
		__iconData$20.node;
		const Globe = createLucideIcon(__iconData$20);
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.49.0_@types+react@18.3.31_react@18.3.1/node_modules/lucide-react/dist/esm/icons/image-plus.mjs
		/**
		* @license lucide-react v1.49.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const __iconData$19 = {
			name: "image-plus",
			size: 24,
			node: [
				["path", {
					d: "M16 5h6",
					key: "1vod17"
				}],
				["path", {
					d: "M19 2v6",
					key: "4bpg5p"
				}],
				["path", {
					d: "M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5",
					key: "1ue2ih"
				}],
				["path", {
					d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",
					key: "1xmnt7"
				}],
				["circle", {
					cx: "9",
					cy: "9",
					r: "2",
					key: "af1f0g"
				}]
			]
		};
		__iconData$19.node;
		const ImagePlus = createLucideIcon(__iconData$19);
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.49.0_@types+react@18.3.31_react@18.3.1/node_modules/lucide-react/dist/esm/icons/images.mjs
		/**
		* @license lucide-react v1.49.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const __iconData$18 = {
			name: "images",
			size: 24,
			node: [
				["path", {
					d: "m22 11-1.296-1.296a2.4 2.4 0 0 0-3.408 0L11 16",
					key: "9kzy35"
				}],
				["path", {
					d: "M4 8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2",
					key: "1t0f0t"
				}],
				["circle", {
					cx: "13",
					cy: "7",
					r: "1",
					fill: "currentColor",
					key: "1obus6"
				}],
				["rect", {
					x: "8",
					y: "2",
					width: "14",
					height: "14",
					rx: "2",
					key: "1gvhby"
				}]
			]
		};
		__iconData$18.node;
		const Images = createLucideIcon(__iconData$18);
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.49.0_@types+react@18.3.31_react@18.3.1/node_modules/lucide-react/dist/esm/icons/link-2.mjs
		/**
		* @license lucide-react v1.49.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const __iconData$17 = {
			name: "link-2",
			size: 24,
			node: [
				["path", {
					d: "M9 17H7A5 5 0 0 1 7 7h2",
					key: "8i5ue5"
				}],
				["path", {
					d: "M15 7h2a5 5 0 1 1 0 10h-2",
					key: "1b9ql8"
				}],
				["line", {
					x1: "8",
					x2: "16",
					y1: "12",
					y2: "12",
					key: "1jonct"
				}]
			]
		};
		__iconData$17.node;
		const Link2 = createLucideIcon(__iconData$17);
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.49.0_@types+react@18.3.31_react@18.3.1/node_modules/lucide-react/dist/esm/icons/link-2-off.mjs
		/**
		* @license lucide-react v1.49.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const __iconData$16 = {
			name: "link-2-off",
			size: 24,
			node: [
				["path", {
					d: "M9 17H7A5 5 0 0 1 7 7",
					key: "10o201"
				}],
				["path", {
					d: "M15 7h2a5 5 0 0 1 4 8",
					key: "1d3206"
				}],
				["line", {
					x1: "8",
					x2: "12",
					y1: "12",
					y2: "12",
					key: "rvw6j4"
				}],
				["line", {
					x1: "2",
					x2: "22",
					y1: "2",
					y2: "22",
					key: "a6p6uj"
				}]
			]
		};
		__iconData$16.node;
		const Link2Off = createLucideIcon(__iconData$16);
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.49.0_@types+react@18.3.31_react@18.3.1/node_modules/lucide-react/dist/esm/icons/loader-circle.mjs
		/**
		* @license lucide-react v1.49.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const __iconData$15 = {
			name: "loader-circle",
			size: 24,
			node: [["path", {
				d: "M21 12a9 9 0 1 1-6.219-8.56",
				key: "13zald"
			}]],
			aliases: ["loader-2"]
		};
		__iconData$15.node;
		const LoaderCircle = createLucideIcon(__iconData$15);
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.49.0_@types+react@18.3.31_react@18.3.1/node_modules/lucide-react/dist/esm/icons/maximize-2.mjs
		/**
		* @license lucide-react v1.49.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const __iconData$14 = {
			name: "maximize-2",
			size: 24,
			node: [
				["path", {
					d: "M15 3h6v6",
					key: "1q9fwt"
				}],
				["path", {
					d: "m21 3-7 7",
					key: "1l2asr"
				}],
				["path", {
					d: "m3 21 7-7",
					key: "tjx5ai"
				}],
				["path", {
					d: "M9 21H3v-6",
					key: "wtvkvv"
				}]
			]
		};
		__iconData$14.node;
		const Maximize2 = createLucideIcon(__iconData$14);
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.49.0_@types+react@18.3.31_react@18.3.1/node_modules/lucide-react/dist/esm/icons/message-square.mjs
		/**
		* @license lucide-react v1.49.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const __iconData$13 = {
			name: "message-square",
			size: 24,
			node: [["path", {
				d: "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",
				key: "18887p"
			}]]
		};
		__iconData$13.node;
		const MessageSquare = createLucideIcon(__iconData$13);
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.49.0_@types+react@18.3.31_react@18.3.1/node_modules/lucide-react/dist/esm/icons/palette.mjs
		/**
		* @license lucide-react v1.49.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const __iconData$12 = {
			name: "palette",
			size: 24,
			node: [
				["path", {
					d: "M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z",
					key: "e79jfc"
				}],
				["circle", {
					cx: "13.5",
					cy: "6.5",
					r: ".5",
					fill: "currentColor",
					key: "1okk4w"
				}],
				["circle", {
					cx: "17.5",
					cy: "10.5",
					r: ".5",
					fill: "currentColor",
					key: "f64h9f"
				}],
				["circle", {
					cx: "6.5",
					cy: "12.5",
					r: ".5",
					fill: "currentColor",
					key: "qy21gx"
				}],
				["circle", {
					cx: "8.5",
					cy: "7.5",
					r: ".5",
					fill: "currentColor",
					key: "fotxhn"
				}]
			]
		};
		__iconData$12.node;
		const Palette = createLucideIcon(__iconData$12);
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.49.0_@types+react@18.3.31_react@18.3.1/node_modules/lucide-react/dist/esm/icons/pencil.mjs
		/**
		* @license lucide-react v1.49.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const __iconData$11 = {
			name: "pencil",
			size: 24,
			node: [["path", {
				d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
				key: "1a8usu"
			}], ["path", {
				d: "m15 5 4 4",
				key: "1mk7zo"
			}]]
		};
		__iconData$11.node;
		const Pencil = createLucideIcon(__iconData$11);
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.49.0_@types+react@18.3.31_react@18.3.1/node_modules/lucide-react/dist/esm/icons/plus.mjs
		/**
		* @license lucide-react v1.49.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const __iconData$10 = {
			name: "plus",
			size: 24,
			node: [["path", {
				d: "M5 12h14",
				key: "1ays0h"
			}], ["path", {
				d: "M12 5v14",
				key: "s699le"
			}]]
		};
		__iconData$10.node;
		const Plus = createLucideIcon(__iconData$10);
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.49.0_@types+react@18.3.31_react@18.3.1/node_modules/lucide-react/dist/esm/icons/refresh-cw.mjs
		/**
		* @license lucide-react v1.49.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const __iconData$9 = {
			name: "refresh-cw",
			size: 24,
			node: [
				["path", {
					d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",
					key: "v9h5vc"
				}],
				["path", {
					d: "M21 3v5h-5",
					key: "1q7to0"
				}],
				["path", {
					d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",
					key: "3uifl3"
				}],
				["path", {
					d: "M8 16H3v5",
					key: "1cv678"
				}]
			]
		};
		__iconData$9.node;
		const RefreshCw = createLucideIcon(__iconData$9);
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.49.0_@types+react@18.3.31_react@18.3.1/node_modules/lucide-react/dist/esm/icons/rotate-ccw.mjs
		/**
		* @license lucide-react v1.49.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const __iconData$8 = {
			name: "rotate-ccw",
			size: 24,
			node: [["path", {
				d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
				key: "1357e3"
			}], ["path", {
				d: "M3 3v5h5",
				key: "1xhq8a"
			}]]
		};
		__iconData$8.node;
		const RotateCcw = createLucideIcon(__iconData$8);
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.49.0_@types+react@18.3.31_react@18.3.1/node_modules/lucide-react/dist/esm/icons/search.mjs
		/**
		* @license lucide-react v1.49.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const __iconData$7 = {
			name: "search",
			size: 24,
			node: [["path", {
				d: "m21 21-4.34-4.34",
				key: "14j7rj"
			}], ["circle", {
				cx: "11",
				cy: "11",
				r: "8",
				key: "4ej97u"
			}]]
		};
		__iconData$7.node;
		const Search = createLucideIcon(__iconData$7);
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.49.0_@types+react@18.3.31_react@18.3.1/node_modules/lucide-react/dist/esm/icons/settings.mjs
		/**
		* @license lucide-react v1.49.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const __iconData$6 = {
			name: "settings",
			size: 24,
			node: [["path", {
				d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
				key: "1i5ecw"
			}], ["circle", {
				cx: "12",
				cy: "12",
				r: "3",
				key: "1v7zrd"
			}]]
		};
		__iconData$6.node;
		const Settings = createLucideIcon(__iconData$6);
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.49.0_@types+react@18.3.31_react@18.3.1/node_modules/lucide-react/dist/esm/icons/sparkles.mjs
		/**
		* @license lucide-react v1.49.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const __iconData$5 = {
			name: "sparkles",
			size: 24,
			node: [
				["path", {
					d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",
					key: "1s2grr"
				}],
				["path", {
					d: "M20 2v4",
					key: "1rf3ol"
				}],
				["path", {
					d: "M22 4h-4",
					key: "gwowj6"
				}],
				["circle", {
					cx: "4",
					cy: "20",
					r: "2",
					key: "6kqj1y"
				}]
			],
			aliases: ["stars"]
		};
		__iconData$5.node;
		const Sparkles = createLucideIcon(__iconData$5);
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.49.0_@types+react@18.3.31_react@18.3.1/node_modules/lucide-react/dist/esm/icons/square-check-big.mjs
		/**
		* @license lucide-react v1.49.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const __iconData$4 = {
			name: "square-check-big",
			size: 24,
			node: [["path", {
				d: "M21 10.656V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.344",
				key: "2acyp4"
			}], ["path", {
				d: "m9 11 3 3L22 4",
				key: "1pflzl"
			}]],
			aliases: ["check-square"]
		};
		__iconData$4.node;
		const SquareCheckBig = createLucideIcon(__iconData$4);
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.49.0_@types+react@18.3.31_react@18.3.1/node_modules/lucide-react/dist/esm/icons/square.mjs
		/**
		* @license lucide-react v1.49.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const __iconData$3 = {
			name: "square",
			size: 24,
			node: [["rect", {
				width: "18",
				height: "18",
				x: "3",
				y: "3",
				rx: "2",
				key: "afitv7"
			}]]
		};
		__iconData$3.node;
		const Square = createLucideIcon(__iconData$3);
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.49.0_@types+react@18.3.31_react@18.3.1/node_modules/lucide-react/dist/esm/icons/star.mjs
		/**
		* @license lucide-react v1.49.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const __iconData$2 = {
			name: "star",
			size: 24,
			node: [["path", {
				d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
				key: "r04s7s"
			}]]
		};
		__iconData$2.node;
		const Star = createLucideIcon(__iconData$2);
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.49.0_@types+react@18.3.31_react@18.3.1/node_modules/lucide-react/dist/esm/icons/trash.mjs
		/**
		* @license lucide-react v1.49.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const __iconData$1 = {
			name: "trash",
			size: 24,
			node: [
				["path", {
					d: "M10 11v6",
					key: "nco0om"
				}],
				["path", {
					d: "M14 11v6",
					key: "outv1u"
				}],
				["path", {
					d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",
					key: "miytrc"
				}],
				["path", {
					d: "M3 6h18",
					key: "d0wm0j"
				}],
				["path", {
					d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
					key: "e791ji"
				}]
			],
			aliases: ["trash-2"]
		};
		__iconData$1.node;
		const Trash = createLucideIcon(__iconData$1);
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.49.0_@types+react@18.3.31_react@18.3.1/node_modules/lucide-react/dist/esm/icons/x.mjs
		/**
		* @license lucide-react v1.49.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const __iconData = {
			name: "x",
			size: 24,
			node: [["path", {
				d: "M18 6 6 18",
				key: "1bl5f8"
			}], ["path", {
				d: "m6 6 12 12",
				key: "d8bk6v"
			}]]
		};
		__iconData.node;
		const X = createLucideIcon(__iconData);
		//#endregion
		//#region lib/types/shared.js
		/**
		* Internal slug: route prefix, credential record scope, storage folder and
		* browser storage prefix. Distinct from shanliuling/dsh-image-gen's
		* `dsh-image-gen` so both plugins can be installed side by side.
		*/
		const PLUGIN_SLUG = "copylee-image-gen";
		const ROUTE_BASE = `/plugins/${PLUGIN_SLUG}`;
		/** Serve one durable attachment image to the browser. */
		const IMAGE_ROUTE = `${ROUTE_BASE}/image`;
		/** Turn browser-picked files into durable attachments. */
		const IMPORT_ROUTE = `${ROUTE_BASE}/import`;
		/** Read/write plugin settings (providers, proxy, storage); never returns keys. */
		const SETTINGS_ROUTE = `${ROUTE_BASE}/settings`;
		/** Set or clear one provider's API key. */
		const KEY_ROUTE = `${ROUTE_BASE}/key`;
		/** Probe one provider (or the proxy) for reachability. */
		const TEST_ROUTE = `${ROUTE_BASE}/test`;
		/** List a provider's models through its `/models` endpoint. */
		const MODELS_ROUTE = `${ROUTE_BASE}/models`;
		/** Generate from the paintings page. */
		const PAINT_ROUTE = `${ROUTE_BASE}/paint`;
		/** Detected system proxy for the settings page. */
		const PROXY_STATUS_ROUTE = `${ROUTE_BASE}/proxy-status`;
		`${ROUTE_BASE}`;
		/** Global gallery (projects, items, favorite prompts). Prefix route. */
		const GALLERY_ROUTE = `${ROUTE_BASE}/gallery`;
		/** Wire protocols a provider entry can speak. Each maps to one adapter. */
		const PROVIDER_PROTOCOLS = [
			"gemini",
			"openai",
			"openai-compat",
			"modelscope",
			"siliconflow",
			"seedream",
			"dashscope",
			"xai",
			"zhipu"
		];
		/** Human names for the protocol picker. */
		const PROTOCOL_LABELS = {
			gemini: "Google Gemini",
			openai: "OpenAI Images",
			"openai-compat": "OpenAI 兼容",
			modelscope: "ModelScope 魔搭",
			siliconflow: "SiliconFlow 硅基流动",
			seedream: "火山方舟 Seedream",
			dashscope: "阿里云百炼 DashScope",
			xai: "xAI Grok Imagine",
			zhipu: "智谱 GLM-Image"
		};
		const ASPECT_RATIOS = [
			"1:1",
			"3:2",
			"2:3",
			"4:3",
			"3:4",
			"4:5",
			"5:4",
			"16:9",
			"9:16",
			"21:9"
		];
		const IMAGE_SIZES = [
			"1K",
			"2K",
			"4K"
		];
		/** The model a call should use: an explicit override, the default, then the first listed. */
		function effectiveModel(entry, override) {
			const requested = override?.trim();
			if (requested !== void 0 && requested.length > 0) return requested;
			return entry.defaultModel.trim() || entry.models[0]?.trim() || "";
		}
		/** Long-side presets offered next to the standard size. */
		const RESOLUTION_PRESETS = [
			{
				id: "1k",
				label: "1K",
				longSide: 1024
			},
			{
				id: "1.5k",
				label: "1.5K",
				longSide: 1536
			},
			{
				id: "2k",
				label: "2K",
				longSide: 2048
			}
		];
		/** Clamp one dimension into the range and onto the step grid. */
		function clampDimension(value, range) {
			const safe = Number.isFinite(value) ? value : range.min;
			const stepped = Math.round(safe / range.step) * range.step;
			return Math.min(Math.floor(range.max / range.step) * range.step, Math.max(Math.ceil(range.min / range.step) * range.step, stepped));
		}
		/**
		* `WxH` for an aspect ratio and a long side, both dimensions aligned to
		* `step` (and clamped into `range` when given): 16:9 @ 2048 / 16 → 2048x1152.
		*/
		function sizeForRatio(ratio, longSide, step, range) {
			const [rw, rh] = ratio.split(":").map(Number);
			const w = rw !== void 0 && rw > 0 ? rw : 1;
			const h = rh !== void 0 && rh > 0 ? rh : 1;
			const scale = longSide / Math.max(w, h);
			const align = (value) => {
				const aligned = Math.max(step, Math.round(value / step) * step);
				return range === void 0 ? aligned : clampDimension(aligned, range);
			};
			return {
				width: align(w * scale),
				height: align(h * scale)
			};
		}
		const OPENAI_SIZES = {
			"1:1": "1024x1024",
			"3:2": "1536x1024",
			"2:3": "1024x1536"
		};
		const SQUARE_FAMILY_SIZES = {
			"1:1": "1024x1024",
			"4:3": "1152x864",
			"3:4": "864x1152",
			"3:2": "1248x832",
			"2:3": "832x1248",
			"16:9": "1280x720",
			"9:16": "720x1280"
		};
		const PROTOCOL_CAPABILITIES = {
			gemini: {
				ratios: ASPECT_RATIOS,
				tiers: IMAGE_SIZES,
				maxReferences: 14,
				maxCount: 4
			},
			openai: {
				ratios: Object.keys(OPENAI_SIZES),
				tiers: [],
				sizes: OPENAI_SIZES,
				maxReferences: 16,
				maxCount: 4,
				customSize: {
					min: 256,
					max: 4096,
					step: 16
				}
			},
			"openai-compat": {
				ratios: Object.keys(OPENAI_SIZES),
				tiers: [],
				sizes: OPENAI_SIZES,
				maxReferences: 16,
				maxCount: 4,
				customSize: {
					min: 256,
					max: 4096,
					step: 16
				}
			},
			modelscope: {
				ratios: Object.keys(SQUARE_FAMILY_SIZES),
				tiers: [],
				sizes: SQUARE_FAMILY_SIZES,
				maxReferences: 1,
				maxCount: 4,
				customSize: {
					min: 64,
					max: 2048,
					step: 16
				}
			},
			siliconflow: {
				ratios: Object.keys(SQUARE_FAMILY_SIZES),
				tiers: [],
				sizes: SQUARE_FAMILY_SIZES,
				maxReferences: 1,
				maxCount: 4,
				customSize: {
					min: 256,
					max: 2048,
					step: 32
				}
			},
			seedream: {
				ratios: [
					"1:1",
					"4:3",
					"3:4",
					"16:9",
					"9:16",
					"3:2",
					"2:3",
					"21:9"
				],
				tiers: ["2K", "4K"],
				maxReferences: 10,
				maxCount: 4,
				customSize: {
					min: 1024,
					max: 4096,
					step: 16
				}
			},
			dashscope: {
				ratios: [
					"1:1",
					"4:3",
					"3:4",
					"16:9",
					"9:16"
				],
				tiers: [],
				sizes: {
					"1:1": "1328*1328",
					"4:3": "1472*1104",
					"3:4": "1104*1472",
					"16:9": "1664*928",
					"9:16": "928*1664"
				},
				maxReferences: 3,
				maxCount: 4,
				customSize: {
					min: 512,
					max: 2048,
					step: 16
				}
			},
			xai: {
				ratios: [
					"1:1",
					"3:2",
					"2:3",
					"4:3",
					"3:4",
					"16:9",
					"9:16",
					"21:9"
				],
				tiers: ["1K", "2K"],
				maxReferences: 5,
				maxCount: 4
			},
			zhipu: {
				ratios: [
					"1:1",
					"4:3",
					"3:4",
					"16:9",
					"9:16"
				],
				tiers: [],
				sizes: {
					"1:1": "1024x1024",
					"4:3": "1152x864",
					"3:4": "864x1152",
					"16:9": "1344x768",
					"9:16": "768x1344"
				},
				maxReferences: 0,
				maxCount: 4,
				customSize: {
					min: 512,
					max: 2048,
					step: 32
				}
			}
		};
		/** Capabilities of one entry, honouring an OpenAI-compatible relay's own size table. */
		function capabilitiesOf(entry) {
			const base = PROTOCOL_CAPABILITIES[entry.protocol];
			const table = entry.compat?.sizes;
			if (entry.protocol !== "openai-compat" || table === void 0 || Object.keys(table).length === 0) return base;
			const ratios = Object.keys(table);
			const tiers = [...new Set(ratios.flatMap((ratio) => Object.keys(table[ratio] ?? {})))];
			return {
				...base,
				ratios,
				tiers,
				sizes: void 0
			};
		}
		//#endregion
		//#region lib/types/client/api.js
		async function call(url, body, init = {}) {
			const response = await fetch(url, {
				method: body === void 0 ? "GET" : "POST",
				credentials: "same-origin",
				cache: "no-store",
				...body === void 0 ? {} : {
					headers: { "content-type": "application/json" },
					body: JSON.stringify(body)
				},
				...init
			});
			const text = await response.text();
			let payload;
			try {
				payload = text.length === 0 ? {} : JSON.parse(text);
			} catch {
				throw new Error(response.status === 504 ? "请求超时（反向代理中断），请重试" : `请求失败（HTTP ${String(response.status)}）`);
			}
			if (!response.ok) {
				const message = payload.error;
				throw new Error(typeof message === "string" ? message : `请求失败（HTTP ${String(response.status)}）`);
			}
			return payload;
		}
		/** `<img src>` for one durable attachment. */
		function imageUrl(attachment) {
			return `${IMAGE_ROUTE}?ref=${encodeURIComponent(JSON.stringify(attachment))}`;
		}
		const api = {
			settings: () => call(SETTINGS_ROUTE),
			saveSettings: (settings) => call(SETTINGS_ROUTE, { settings }),
			setKey: (providerId, key) => call(KEY_ROUTE, {
				providerId,
				key
			}),
			test: (input) => call(TEST_ROUTE, input),
			testProxy: (proxyUrl) => call(TEST_ROUTE, { proxyUrl }),
			models: (input) => call(MODELS_ROUTE, input),
			proxyStatus: () => call(PROXY_STATUS_ROUTE),
			paint: (input, signal) => call(PAINT_ROUTE, input, signal === void 0 ? {} : { signal }),
			importImages: (images) => call(IMPORT_ROUTE, { images }),
			gallery: {
				revision: () => call(GALLERY_ROUTE, { op: "revision" }),
				projects: () => call(GALLERY_ROUTE, { op: "projects" }),
				list: (query) => call(GALLERY_ROUTE, {
					op: "list",
					...query
				}),
				update: (ids, patch) => call(GALLERY_ROUTE, {
					op: "update",
					ids,
					...patch
				}),
				remove: (ids) => call(GALLERY_ROUTE, {
					op: "remove",
					ids
				}),
				createProject: (name) => call(GALLERY_ROUTE, {
					op: "createProject",
					name
				}),
				renameProject: (id, name) => call(GALLERY_ROUTE, {
					op: "renameProject",
					id,
					name
				}),
				deleteProject: (id, deleteItems) => call(GALLERY_ROUTE, {
					op: "deleteProject",
					id,
					deleteItems
				}),
				reorderProjects: (ids) => call(GALLERY_ROUTE, {
					op: "reorderProjects",
					ids
				}),
				favoritePrompts: () => call(GALLERY_ROUTE, { op: "favoritePrompts" }),
				addFavoritePrompt: (text) => call(GALLERY_ROUTE, {
					op: "addFavoritePrompt",
					text
				}),
				updateFavoritePrompt: (id, text) => call(GALLERY_ROUTE, {
					op: "updateFavoritePrompt",
					id,
					text
				}),
				reveal: (id) => call(GALLERY_ROUTE, {
					op: "reveal",
					id
				}),
				openFolder: () => call(GALLERY_ROUTE, { op: "openFolder" }),
				removeFavoritePrompt: (id) => call(GALLERY_ROUTE, {
					op: "removeFavoritePrompt",
					id
				}),
				importAttachments: (attachments, projectId) => call(GALLERY_ROUTE, {
					op: "import",
					attachments,
					projectId
				})
			}
		};
		/** Read a picked file as base64 (no data: prefix). */
		function fileToBase64(file) {
			return new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = () => {
					const result = String(reader.result);
					resolve(result.slice(result.indexOf(",") + 1));
				};
				reader.onerror = () => reject(reader.error ?? /* @__PURE__ */ new Error("read failed"));
				reader.readAsDataURL(file);
			});
		}
		/** Load a blob into a canvas-drawable bitmap (null when the browser cannot decode it). */
		async function decode(blob) {
			try {
				return await createImageBitmap(blob);
			} catch {
				return null;
			}
		}
		function encode(canvas, type, quality) {
			return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
		}
		/**
		* Make one picked/pasted image fit the host's upload limits: an accepted
		* type, at most `maxImageDimension` per side and `maxImageBytes` in size.
		* Images that already fit are uploaded untouched; others are redrawn and
		* re-encoded (WebP when accepted, keeping transparency, else JPEG), shrinking
		* further until they fit.
		*/
		async function fitImage(file, limits) {
			if (limits === void 0) return file;
			const typeOk = limits.mediaTypes.includes(file.type);
			const bytesOk = file.size <= limits.maxImageBytes;
			const maxSide = limits.maxImageDimension;
			const bitmap = typeOk && bytesOk && maxSide === void 0 ? null : await decode(file);
			if (bitmap === null) return file;
			const dimsOk = maxSide === void 0 || bitmap.width <= maxSide && bitmap.height <= maxSide;
			if (typeOk && bytesOk && dimsOk) {
				bitmap.close?.();
				return file;
			}
			const target = limits.mediaTypes.includes("image/webp") ? "image/webp" : limits.mediaTypes.includes("image/jpeg") ? "image/jpeg" : "image/png";
			let scale = maxSide === void 0 ? 1 : Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
			let quality = .9;
			let best = file;
			for (let attempt = 0; attempt < 6; attempt += 1) {
				const canvas = document.createElement("canvas");
				canvas.width = Math.max(1, Math.round(bitmap.width * scale));
				canvas.height = Math.max(1, Math.round(bitmap.height * scale));
				canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
				const blob = await encode(canvas, target, quality);
				if (blob === null) break;
				best = blob;
				if (blob.size <= limits.maxImageBytes) break;
				scale *= .8;
				quality = .82;
			}
			bitmap.close?.();
			return best;
		}
		/** Human-readable text for the import route's per-image error codes. */
		function describeUploadError(code, limits) {
			if (code.startsWith("size-out-of-range")) return limits === void 0 ? "图片过大" : `图片过大（上限 ${(limits.maxImageBytes / 1024 / 1024).toFixed(0)} MB）`;
			if (code.startsWith("unsupported-media-type")) return `不支持的图片格式${code.includes(":") ? `（${code.split(":")[1].trim()}）` : ""}`;
			if (code === "invalid-base64" || code === "invalid-item") return "图片数据无效";
			if (code === "save-failed") return "图片保存失败";
			return code;
		}
		/** Upload picked files as durable attachments, shrinking them to the host limits first. */
		async function uploadFiles(files, limits) {
			const images = await Promise.all(files.map(async (file) => {
				const blob = await fitImage(file, limits);
				return {
					data: await fileToBase64(blob),
					mediaType: blob.type || "image/png",
					name: file.name
				};
			}));
			let result;
			try {
				result = await api.importImages(images);
			} catch (error) {
				const message = error instanceof Error ? error.message : String(error);
				throw new Error(`上传失败：${describeUploadError(message, limits)}`);
			}
			if (result.images.length === 0 && result.failures.length > 0) throw new Error(`上传失败：${[...new Set(result.failures.map((failure) => describeUploadError(failure.error, limits)))].join("，")}`);
			return result.images.map((image) => image.attachment);
		}
		/** Save an image to the user's disk. */
		async function downloadImage(attachment, baseName = "image") {
			const response = await fetch(imageUrl(attachment), { credentials: "same-origin" });
			if (!response.ok) throw new Error(`下载失败（HTTP ${String(response.status)}）`);
			const blob = await response.blob();
			const ext = attachment.mediaType.split("/")[1]?.replace("jpeg", "jpg") ?? "png";
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `${baseName}.${ext}`;
			document.body.appendChild(link);
			link.click();
			link.remove();
			setTimeout(() => URL.revokeObjectURL(url), 1e3);
		}
		/** Copy an image to the clipboard as PNG (the format browsers accept). */
		async function copyImage(attachment) {
			let blob = await (await fetch(imageUrl(attachment), { credentials: "same-origin" })).blob();
			if (blob.type !== "image/png") {
				const bitmap = await createImageBitmap(blob);
				const canvas = document.createElement("canvas");
				canvas.width = bitmap.width;
				canvas.height = bitmap.height;
				canvas.getContext("2d")?.drawImage(bitmap, 0, 0);
				blob = await new Promise((resolve, reject) => canvas.toBlob((value) => value === null ? reject(/* @__PURE__ */ new Error("encode failed")) : resolve(value), "image/png"));
			}
			await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
		}
		//#endregion
		//#region lib/types/client/i18n.js
		/** Plugin copy (zh / en) and the hook that follows DSH's active locale. */
		const zh = {
			panel: "绘画",
			accent: "强调色",
			accentOrange: "陶土橙",
			accentBlue: "蓝色",
			accentBlack: "黑色",
			proxyOff: "关闭",
			proxySystem: "系统代理（自动检测）",
			proxySystemShort: "系统代理",
			proxyDetecting: "正在检测系统代理…",
			proxyDetected: "检测到系统代理：{url}（{source}）",
			proxyNotFound: "未检测到系统代理：请在系统设置里开启代理（或设置 HTTPS_PROXY 环境变量），或改用「自定义」。",
			proxySystemMissing: "系统代理（未检测到，请求会失败）",
			redetect: "重新检测",
			fetchedSummary: "共 {total} 个模型 · 识别为生图模型 {image} 个 · 已添加 {added} 个",
			modelFilterLabel: "模型筛选",
			imageModelsOnly: "生图相关",
			alreadyAdded: "已添加",
			noModelsReturned: "该服务商没有返回任何模型",
			noImageModels: "没有识别出生图模型，切到「全部」查看完整列表",
			revealInFolder: "在文件夹中显示",
			revealedAt: "已在文件管理器中打开：{path}",
			workspaceCopy: "工作区副本",
			imageDir: "图片保存目录",
			imageDirHint: "每张图都会在这里保存一份可读文件名的副本（当前：{path}）。留空使用默认目录，自定义请填绝对路径。",
			openFolder: "打开文件夹",
			clearPrompt: "清空提示词",
			editPrompt: "编辑（Ctrl+Enter 或点空白处保存，Esc 取消）",
			savePromptEmpty: "输入 Prompt 后可收藏",
			promptSavedToggle: "已收藏（点击取消）",
			searchPrompts: "搜索收藏的 Prompt",
			appendPrompt: "追加到当前 Prompt",
			noPromptsHint: "还没有收藏的 Prompt，输入后点上方「收藏 Prompt」",
			promptPickerKeys: "点击替换 · Shift+Enter 追加 · Esc 关闭",
			openPromptPicker: "收藏的 Prompt（/ 或 Ctrl+K）",
			pixelSize: "分辨率",
			standardSize: "标准",
			customSize: "自定义",
			width: "宽",
			height: "高",
			lockRatio: "锁定比例",
			unlockRatio: "解除比例锁定",
			sizeRangeHint: "每边 {min}–{max}px，按 {step} 对齐",
			sizeSupportHint: "服务商或模型可能不支持所有尺寸，若报错请换回「标准」",
			noModels: "还没有模型，在下方添加或点击「拉取模型」",
			setDefault: "设为默认",
			addModelPlaceholder: "输入模型 ID，回车添加（可用逗号分隔多个）",
			add: "添加",
			addSelected: "添加所选",
			noNewModels: "没有可添加的新模型，列表里已经包含该服务商返回的全部模型。",
			modelFilter: "搜索或输入自定义模型 ID",
			resizeComposer: "拖动调整输入框高度，双击恢复自动",
			createdAt: "时间",
			source: "来源",
			file: "文件",
			tabPaint: "绘画",
			tabGallery: "图库",
			tabPrompts: "收藏 Prompt",
			projects: "画廊项目",
			newProject: "新建项目",
			projectName: "项目名称",
			rename: "重命名",
			delete: "删除",
			deleteProject: "删除项目",
			deleteProjectConfirm: "删除项目「{name}」？其中的图片会移到「默认画板」。",
			deleteProjectAndImages: "同时删除其中的图片",
			cancel: "取消",
			confirm: "确定",
			save: "保存",
			provider: "服务商",
			model: "模型",
			ratio: "比例",
			resolution: "清晰度",
			quality: "质量",
			count: "数量",
			seed: "随机种子",
			seedHint: "留空随机",
			negativePrompt: "反向提示词",
			references: "参考图",
			addReference: "添加参考图",
			referencesUnsupported: "当前服务商不支持参考图",
			promptPlaceholder: "描述你想要的画面，Enter 生成，Shift+Enter 换行，/ 打开收藏的 Prompt",
			generate: "生成",
			generating: "生成中…",
			elapsed: "已用 {s} 秒",
			newCanvas: "新画板",
			newCanvasHint: "清空画板和输入框，开始新的创作（也可再次点击选中的历史图片取消选中）",
			generatingInProject: "此项目正在生成",
			stop: "停止",
			emptyCanvas: "在下方输入描述开始创作",
			noProviders: "还没有可用的服务商，请先到 设置 > 插件 > 图像生成 配置 API Key",
			openSettings: "去设置",
			history: "历史",
			download: "下载",
			copy: "复制",
			copied: "已复制",
			favorite: "收藏",
			unfavorite: "取消收藏",
			useAsReference: "作为参考图",
			reusePrompt: "复用 Prompt",
			moveTo: "移动到…",
			search: "搜索 Prompt / 模型",
			all: "全部",
			favorites: "收藏",
			allProviders: "全部服务商",
			allProjects: "全部项目",
			selected: "已选 {n} 张",
			selectAll: "全选",
			batchSelect: "批量管理",
			newest: "最新优先",
			oldest: "最早优先",
			clearSelection: "取消选择",
			deleteConfirm: "删除选中的 {n} 张图片？",
			importImages: "导入图片",
			emptyGallery: "还没有图片",
			loadMore: "加载更多",
			savePrompt: "收藏 Prompt",
			promptSaved: "已收藏",
			noPrompts: "还没有收藏的 Prompt",
			usePrompt: "使用",
			fromConversation: "来自对话",
			failedN: "{n} 张生成失败：{error}",
			defaultLabel: "默认",
			autoRatio: "自动",
			settingsTitle: "图像生成",
			providers: "服务商",
			addProvider: "添加服务商",
			presetTag: "预置",
			enabled: "启用",
			name: "名称",
			protocol: "接口协议",
			baseURL: "API 地址",
			baseURLHintGemini: "完整的 Interactions 端点 URL",
			baseURLHint: "Base URL，例如 https://api.example.com/v1",
			apiKey: "API Key",
			apiKeySet: "已配置（不回显）",
			apiKeyPlaceholder: "粘贴 API Key",
			saveKey: "保存 Key",
			clearKey: "清除",
			models: "模型列表",
			modelsHint: "标为「默认」的模型会被 Agent 和绘画页优先使用；悬停一行可设为默认或删除",
			searchModels: "搜索模型",
			selectedModels: "已选 {n} 个",
			fetchModels: "拉取模型",
			defaultModel: "默认模型",
			setDefaultProvider: "设为 Agent 默认",
			isDefaultProvider: "Agent 默认服务商",
			proxy: "代理",
			proxyInherit: "跟随全局",
			proxyDirect: "直连",
			proxyCustom: "自定义",
			proxyUrl: "代理地址",
			proxyUrlHint: "http://、https://、socks5:// 或 socks5h://，可带 user:pass@",
			globalProxy: "全局代理",
			globalProxyHint: "仅作用于本插件的生图请求，不影响 DSH 其他网络流量。",
			noProxy: "不走代理的主机",
			noProxyHint: "逗号分隔，支持 .example.com / *.example.com",
			testProxy: "测试代理",
			testConnection: "测试连接",
			testing: "测试中…",
			storage: "存储",
			conversation: "对话",
			backgroundJobs: "{count} 张图片在后台生成，完成后显示在回复正文中。",
			dismiss: "关闭",
			chatTools: "允许 Agent 在对话中生图",
			chatToolsHint: "关闭后对话中不再提供 paint_image / paint_images / edit_painting 工具；绘画页不受影响。",
			saveToWorkspace: "对话中生成的图片同时保存到会话工作区",
			workspaceFolder: "工作区子目录",
			galleryNote: "画廊与工作区无关：所有图片都保存在全局画廊中，可在左侧「绘画」入口查看。",
			saved: "已保存",
			unsaved: "有未保存的修改",
			discard: "放弃修改",
			deleteProvider: "删除服务商",
			deleteProviderConfirm: "删除服务商「{name}」？其 API Key 也会被清除。",
			compatAdvanced: "中转站高级选项",
			editFormat: "编辑请求格式",
			sizesTable: "尺寸表（JSON）",
			sizesTableHint: "比例 → 档位 → 像素，例如 {\"16:9\":{\"2K\":\"2048x1152\"}}",
			seedreamWatermark: "添加 AI 水印",
			seedreamFormat: "输出格式",
			invalidJson: "JSON 格式不正确",
			keyMissing: "未配置 Key",
			keyResetOnSave: "已改动 Base URL 或协议：保存后会清除已保存的 API Key，需要重新填写",
			resultShown: "图片已生成",
			imageUnavailable: "图片不可用",
			openInGallery: "在画廊中查看"
		};
		const en = {
			panel: "Paintings",
			accent: "Accent colour",
			accentOrange: "Terracotta",
			accentBlue: "Blue",
			accentBlack: "Black",
			proxyOff: "Off",
			proxySystem: "System proxy (auto-detect)",
			proxySystemShort: "System proxy",
			proxyDetecting: "Detecting the system proxy…",
			proxyDetected: "System proxy detected: {url} ({source})",
			proxyNotFound: "No system proxy detected: turn one on in your OS settings (or set HTTPS_PROXY), or use “Custom”.",
			proxySystemMissing: "system proxy (not detected — requests will fail)",
			redetect: "Detect again",
			fetchedSummary: "{total} models · {image} look like image models · {added} already added",
			modelFilterLabel: "Model filter",
			imageModelsOnly: "Image models",
			alreadyAdded: "Added",
			noModelsReturned: "The provider returned no models",
			noImageModels: "No image models recognized — switch to “All” for the full list",
			revealInFolder: "Show in folder",
			revealedAt: "Opened in the file manager: {path}",
			workspaceCopy: "Workspace copy",
			imageDir: "Image folder",
			imageDirHint: "Every image is also saved here with a readable file name (now: {path}). Leave empty for the default; custom folders need an absolute path.",
			openFolder: "Open folder",
			clearPrompt: "Clear prompt",
			editPrompt: "Edit (Ctrl+Enter or click away to save, Esc cancels)",
			savePromptEmpty: "Type a prompt to save it",
			promptSavedToggle: "Saved (click to remove)",
			searchPrompts: "Search saved prompts",
			appendPrompt: "Append to the current prompt",
			noPromptsHint: "No saved prompts yet — type one and click “Save prompt” above",
			promptPickerKeys: "Click to replace · Shift+Enter to append · Esc to close",
			openPromptPicker: "Saved prompts (/ or Ctrl+K)",
			pixelSize: "Resolution",
			standardSize: "Standard",
			customSize: "Custom",
			width: "Width",
			height: "Height",
			lockRatio: "Lock aspect ratio",
			unlockRatio: "Unlock aspect ratio",
			sizeRangeHint: "{min}–{max}px per side, multiples of {step}",
			sizeSupportHint: "Not every provider/model accepts every size; switch back to Standard if it fails",
			noModels: "No models yet — add one below or fetch them",
			setDefault: "Make default",
			addModelPlaceholder: "Model ID, Enter to add (comma separates several)",
			add: "Add",
			addSelected: "Add selected",
			noNewModels: "Nothing new to add: every model the provider returned is already listed.",
			modelFilter: "Search or type a custom model ID",
			resizeComposer: "Drag to resize the prompt box; double-click to reset",
			createdAt: "Created",
			source: "Source",
			file: "File",
			tabPaint: "Paint",
			tabGallery: "Gallery",
			tabPrompts: "Saved prompts",
			projects: "Projects",
			newProject: "New project",
			projectName: "Project name",
			rename: "Rename",
			delete: "Delete",
			deleteProject: "Delete project",
			deleteProjectConfirm: "Delete project “{name}”? Its images move to “Default board”.",
			deleteProjectAndImages: "Also delete its images",
			cancel: "Cancel",
			confirm: "OK",
			save: "Save",
			provider: "Provider",
			model: "Model",
			ratio: "Aspect ratio",
			resolution: "Resolution",
			quality: "Quality",
			count: "Count",
			seed: "Seed",
			seedHint: "Random when empty",
			negativePrompt: "Negative prompt",
			references: "Reference images",
			addReference: "Add reference",
			referencesUnsupported: "This provider does not take reference images",
			promptPlaceholder: "Describe the image. Enter to generate, Shift+Enter for a new line, / for saved prompts",
			generate: "Generate",
			generating: "Generating…",
			elapsed: "{s}s elapsed",
			newCanvas: "New canvas",
			newCanvasHint: "Clear the artboard and composer to start over (click a selected history image again to deselect it)",
			generatingInProject: "Generating in this project",
			stop: "Stop",
			emptyCanvas: "Describe an image below to start",
			noProviders: "No provider is ready yet. Add an API key in Settings > Plugins > Image generation.",
			openSettings: "Open settings",
			history: "History",
			download: "Download",
			copy: "Copy",
			copied: "Copied",
			favorite: "Favorite",
			unfavorite: "Unfavorite",
			useAsReference: "Use as reference",
			reusePrompt: "Reuse prompt",
			moveTo: "Move to…",
			search: "Search prompt / model",
			all: "All",
			favorites: "Favorites",
			allProviders: "All providers",
			allProjects: "All projects",
			selected: "{n} selected",
			selectAll: "Select all",
			batchSelect: "Select",
			newest: "Newest first",
			oldest: "Oldest first",
			clearSelection: "Clear selection",
			deleteConfirm: "Delete {n} selected image(s)?",
			importImages: "Import images",
			emptyGallery: "No images yet",
			loadMore: "Load more",
			savePrompt: "Save prompt",
			promptSaved: "Saved",
			noPrompts: "No saved prompts yet",
			usePrompt: "Use",
			fromConversation: "From a conversation",
			failedN: "{n} image(s) failed: {error}",
			defaultLabel: "Default",
			autoRatio: "Auto",
			settingsTitle: "Image generation",
			providers: "Providers",
			addProvider: "Add provider",
			presetTag: "Preset",
			enabled: "Enabled",
			name: "Name",
			protocol: "API protocol",
			baseURL: "API URL",
			baseURLHintGemini: "Full Interactions endpoint URL",
			baseURLHint: "Base URL, e.g. https://api.example.com/v1",
			apiKey: "API key",
			apiKeySet: "Configured (hidden)",
			apiKeyPlaceholder: "Paste API key",
			saveKey: "Save key",
			clearKey: "Clear",
			models: "Models",
			modelsHint: "The “Default” model is used first by the Agent and the paint page; hover a row to make it default or remove it",
			searchModels: "Search models",
			selectedModels: "{n} selected",
			fetchModels: "Fetch models",
			defaultModel: "Default model",
			setDefaultProvider: "Make Agent default",
			isDefaultProvider: "Agent default provider",
			proxy: "Proxy",
			proxyInherit: "Use global",
			proxyDirect: "Direct",
			proxyCustom: "Custom",
			proxyUrl: "Proxy URL",
			proxyUrlHint: "http://, https://, socks5:// or socks5h://, optionally with user:pass@",
			globalProxy: "Global proxy",
			globalProxyHint: "Applies only to this plugin’s image requests; the rest of DSH is unaffected.",
			noProxy: "Bypass hosts",
			noProxyHint: "Comma separated; .example.com / *.example.com supported",
			testProxy: "Test proxy",
			testConnection: "Test connection",
			testing: "Testing…",
			storage: "Storage",
			conversation: "Conversations",
			backgroundJobs: "{count} image(s) generating in the background; they appear in the reply when done.",
			dismiss: "Dismiss",
			chatTools: "Let the Agent generate images in conversations",
			chatToolsHint: "When off, conversations no longer offer paint_image / paint_images / edit_painting; the paintings page is unaffected.",
			saveToWorkspace: "Also save images generated in conversations to the session workspace",
			workspaceFolder: "Workspace subfolder",
			galleryNote: "The gallery is not tied to workspaces: every image is kept in the global gallery, opened from “Paintings” in the sidebar.",
			saved: "Saved",
			unsaved: "Unsaved changes",
			discard: "Discard",
			deleteProvider: "Delete provider",
			deleteProviderConfirm: "Delete provider “{name}”? Its API key is cleared too.",
			compatAdvanced: "Relay options",
			editFormat: "Edit request format",
			sizesTable: "Size table (JSON)",
			sizesTableHint: "ratio → tier → pixels, e.g. {\"16:9\":{\"2K\":\"2048x1152\"}}",
			seedreamWatermark: "Add AI watermark",
			seedreamFormat: "Output format",
			invalidJson: "Invalid JSON",
			keyMissing: "No key",
			keyResetOnSave: "Base URL or protocol changed: saving clears the stored API key; enter it again afterwards",
			resultShown: "Image generated",
			imageUnavailable: "Image unavailable",
			openInGallery: "Open in gallery"
		};
		function translator(lang) {
			const dict = lang === "en" ? en : zh;
			return (key, vars) => {
				let text = dict[key];
				if (vars !== void 0) for (const [name, value] of Object.entries(vars)) text = text.split(`{${name}}`).join(String(value));
				return text;
			};
		}
		function langOf(locale) {
			return (locale?.getSnapshot()?.active ?? (typeof navigator === "undefined" ? "zh" : navigator.language)).toLowerCase().startsWith("zh") ? "zh" : "en";
		}
		/** Translator following DSH's language switch. */
		function useT(locale) {
			const [lang, setLang] = (0, react.useState)(() => langOf(locale));
			(0, react.useEffect)(() => {
				if (locale === void 0) return;
				return locale.subscribe(() => setLang(langOf(locale)));
			}, [locale]);
			return translator(lang);
		}
		//#endregion
		//#region lib/types/client/widgets.js
		/** Small UI primitives styled with the plugin's DSH-aligned stylesheet. */
		function Switch({ checked, onChange, label, disabled }) {
			return (0, react_jsx_runtime.jsx)("button", {
				type: "button",
				role: "switch",
				"aria-checked": checked,
				"aria-label": label,
				disabled,
				className: "dig-switch",
				onClick: () => onChange(!checked)
			});
		}
		/** Portal everything into a `.dig-root` so tokens apply outside the page tree. */
		function Portal({ children }) {
			return (0, react_dom.createPortal)((0, react_jsx_runtime.jsx)("div", {
				className: "dig-root",
				style: { background: "transparent" },
				children
			}), document.body);
		}
		function Modal({ title, children, onClose, actions, wide }) {
			(0, react.useEffect)(() => {
				const onKey = (event) => {
					if (event.key === "Escape") onClose();
				};
				window.addEventListener("keydown", onKey);
				return () => window.removeEventListener("keydown", onKey);
			}, [onClose]);
			return (0, react_jsx_runtime.jsx)(Portal, { children: (0, react_jsx_runtime.jsx)("div", {
				className: "dig-modal-wrap",
				onMouseDown: (event) => {
					if (event.target === event.currentTarget) onClose();
				},
				children: (0, react_jsx_runtime.jsxs)("div", {
					className: wide === true ? "dig-modal dig-modal-wide" : "dig-modal",
					role: "dialog",
					"aria-modal": "true",
					"aria-label": title,
					children: [
						(0, react_jsx_runtime.jsx)("h2", { children: title }),
						children,
						(0, react_jsx_runtime.jsx)("div", {
							className: "dig-modal-actions",
							children: actions
						})
					]
				})
			}) });
		}
		/** Anchored popup menu; closes on outside click, Escape, or selection. */
		function Menu({ anchor, items, onClose }) {
			const ref = (0, react.useRef)(null);
			const [position, setPosition] = (0, react.useState)({
				top: -9999,
				left: -9999
			});
			(0, react.useLayoutEffect)(() => {
				const rect = anchor.getBoundingClientRect();
				const menu = ref.current;
				const width = menu?.offsetWidth ?? 180;
				const height = menu?.offsetHeight ?? 200;
				let left = rect.right - width;
				if (left < 8) left = Math.min(rect.left, window.innerWidth - width - 8);
				let top = rect.bottom + 4;
				if (top + height > window.innerHeight - 8) top = Math.max(8, rect.top - height - 4);
				setPosition({
					top,
					left: Math.max(8, left)
				});
			}, [anchor]);
			(0, react.useEffect)(() => {
				const onDown = (event) => {
					if (ref.current?.contains(event.target) !== true && !anchor.contains(event.target)) onClose();
				};
				const onKey = (event) => {
					if (event.key === "Escape") onClose();
				};
				document.addEventListener("mousedown", onDown);
				window.addEventListener("keydown", onKey);
				return () => {
					document.removeEventListener("mousedown", onDown);
					window.removeEventListener("keydown", onKey);
				};
			}, [anchor, onClose]);
			return (0, react_jsx_runtime.jsx)(Portal, { children: (0, react_jsx_runtime.jsx)("div", {
				ref,
				className: "dig-menu",
				role: "menu",
				style: {
					top: position.top,
					left: position.left
				},
				children: items.map((item, index) => (0, react_jsx_runtime.jsxs)("button", {
					type: "button",
					role: "menuitem",
					className: item.danger === true ? "dig-danger" : void 0,
					onClick: () => {
						onClose();
						item.onSelect();
					},
					children: [item.icon, item.label]
				}, index))
			}) });
		}
		/** Menu trigger state: `[anchor, open(event), close]`. */
		function useMenu() {
			const [anchor, setAnchor] = (0, react.useState)(null);
			return [
				anchor,
				(0, react.useCallback)((event) => {
					event.stopPropagation();
					const target = event.currentTarget;
					setAnchor((current) => current === target ? null : target);
				}, []),
				(0, react.useCallback)(() => setAnchor(null), [])
			];
		}
		/** Transient message at the bottom of the screen. */
		function useToast() {
			const [message, setMessage] = (0, react.useState)(null);
			const timer = (0, react.useRef)(void 0);
			const show = (0, react.useCallback)((text) => {
				setMessage(text);
				clearTimeout(timer.current);
				timer.current = setTimeout(() => setMessage(null), 2200);
			}, []);
			(0, react.useEffect)(() => () => clearTimeout(timer.current), []);
			return [message === null ? null : (0, react_jsx_runtime.jsx)(Portal, { children: (0, react_jsx_runtime.jsx)("div", {
				className: "dig-toast",
				role: "status",
				children: message
			}) }), show];
		}
		/** A glyph of the aspect ratio for ratio chips. */
		function RatioGlyph({ ratio }) {
			const [w, h] = ratio.split(":").map(Number);
			if (!w || !h) return null;
			const scale = 12 / Math.max(w, h);
			return (0, react_jsx_runtime.jsx)("span", {
				className: "dig-ratio-glyph",
				style: {
					width: Math.max(4, Math.round(w * scale)),
					height: Math.max(4, Math.round(h * scale))
				}
			});
		}
		//#endregion
		//#region lib/types/client/lightbox.js
		/** Full-screen viewer with metadata and actions for one gallery image. */
		function Lightbox({ items, index, onIndex, onClose, t, actions, projectName }) {
			const item = items[index];
			(0, react.useEffect)(() => {
				const onKey = (event) => {
					if (event.key === "Escape") onClose();
					else if (event.key === "ArrowLeft" && index > 0) onIndex(index - 1);
					else if (event.key === "ArrowRight" && index < items.length - 1) onIndex(index + 1);
				};
				window.addEventListener("keydown", onKey);
				return () => window.removeEventListener("keydown", onKey);
			}, [
				index,
				items.length,
				onClose,
				onIndex
			]);
			if (item === void 0) return null;
			const date = new Date(item.createdAt).toLocaleString();
			return (0, react_jsx_runtime.jsx)(Portal, { children: (0, react_jsx_runtime.jsx)("div", {
				className: "dig-overlay",
				role: "dialog",
				"aria-modal": "true",
				children: (0, react_jsx_runtime.jsxs)("div", {
					className: "dig-lightbox",
					children: [(0, react_jsx_runtime.jsxs)("div", {
						className: "dig-lightbox-stage",
						onMouseDown: (event) => {
							if (event.target === event.currentTarget) onClose();
						},
						children: [
							(0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: "dig-icon-btn dig-lightbox-close",
								"aria-label": "close",
								onClick: onClose,
								children: (0, react_jsx_runtime.jsx)(X, { size: 18 })
							}),
							index > 0 && (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: "dig-nav",
								style: { left: 16 },
								"aria-label": "previous",
								onClick: () => onIndex(index - 1),
								children: (0, react_jsx_runtime.jsx)(ChevronLeft, { size: 22 })
							}),
							(0, react_jsx_runtime.jsx)("img", {
								src: imageUrl(item.attachment),
								alt: item.prompt
							}),
							index < items.length - 1 && (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: "dig-nav",
								style: { right: 16 },
								"aria-label": "next",
								onClick: () => onIndex(index + 1),
								children: (0, react_jsx_runtime.jsx)(ChevronRight, { size: 22 })
							})
						]
					}), (0, react_jsx_runtime.jsxs)("aside", {
						className: "dig-lightbox-info",
						children: [
							(0, react_jsx_runtime.jsx)("h3", { children: "Prompt" }),
							(0, react_jsx_runtime.jsx)("div", {
								className: "dig-lightbox-prompt",
								children: item.prompt || "—"
							}),
							item.negativePrompt !== void 0 && item.negativePrompt.length > 0 && (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [(0, react_jsx_runtime.jsx)("h3", { children: t("negativePrompt") }), (0, react_jsx_runtime.jsx)("div", {
								className: "dig-lightbox-prompt",
								children: item.negativePrompt
							})] }),
							(0, react_jsx_runtime.jsxs)("dl", {
								className: "dig-kv",
								children: [
									(0, react_jsx_runtime.jsx)("dt", { children: t("provider") }),
									(0, react_jsx_runtime.jsx)("dd", { children: item.providerName ?? item.providerId }),
									item.model.length > 0 && (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [(0, react_jsx_runtime.jsx)("dt", { children: t("model") }), (0, react_jsx_runtime.jsx)("dd", { children: item.model })] }),
									(0, react_jsx_runtime.jsx)("dt", { children: t("resolution") }),
									(0, react_jsx_runtime.jsxs)("dd", { children: [`${String(item.attachment.width)} × ${String(item.attachment.height)}`, item.output ? ` · ${item.output}` : ""] }),
									projectName !== void 0 && (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [(0, react_jsx_runtime.jsx)("dt", { children: t("projects") }), (0, react_jsx_runtime.jsx)("dd", { children: projectName(item.projectId) })] }),
									(0, react_jsx_runtime.jsx)("dt", { children: t("createdAt") }),
									(0, react_jsx_runtime.jsx)("dd", { children: date }),
									item.sessionId !== void 0 && (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [(0, react_jsx_runtime.jsx)("dt", { children: t("source") }), (0, react_jsx_runtime.jsx)("dd", { children: t("fromConversation") })] }),
									item.filePath !== void 0 && (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [(0, react_jsx_runtime.jsx)("dt", { children: t("file") }), (0, react_jsx_runtime.jsx)("dd", { children: item.filePath })] }),
									item.savedTo !== void 0 && (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [(0, react_jsx_runtime.jsx)("dt", { children: t("workspaceCopy") }), (0, react_jsx_runtime.jsx)("dd", { children: item.savedTo })] })
								]
							}),
							(0, react_jsx_runtime.jsxs)("div", {
								className: "dig-lightbox-actions",
								children: [
									(0, react_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "dig-btn dig-btn-sm",
										onClick: () => actions.onDownload(item),
										children: [(0, react_jsx_runtime.jsx)(Download, { size: 14 }), t("download")]
									}),
									(0, react_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "dig-btn dig-btn-sm",
										onClick: () => actions.onCopy(item),
										children: [(0, react_jsx_runtime.jsx)(Copy, { size: 14 }), t("copy")]
									}),
									actions.onFavorite !== void 0 && (0, react_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "dig-btn dig-btn-sm",
										onClick: () => actions.onFavorite?.(item),
										children: [(0, react_jsx_runtime.jsx)(Star, {
											size: 14,
											fill: item.favorite ? "#f5a623" : "none",
											color: item.favorite ? "#f5a623" : "currentColor"
										}), item.favorite ? t("unfavorite") : t("favorite")]
									}),
									actions.onUseAsReference !== void 0 && (0, react_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "dig-btn dig-btn-sm",
										onClick: () => actions.onUseAsReference?.(item),
										children: [(0, react_jsx_runtime.jsx)(ImagePlus, { size: 14 }), t("useAsReference")]
									}),
									actions.onReveal !== void 0 && (0, react_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "dig-btn dig-btn-sm",
										onClick: () => actions.onReveal?.(item),
										children: [(0, react_jsx_runtime.jsx)(FolderOpen, { size: 14 }), t("revealInFolder")]
									}),
									actions.onReusePrompt !== void 0 && item.prompt.length > 0 && (0, react_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "dig-btn dig-btn-sm",
										onClick: () => actions.onReusePrompt?.(item),
										children: [(0, react_jsx_runtime.jsx)(RotateCcw, { size: 14 }), t("reusePrompt")]
									}),
									actions.onDelete !== void 0 && (0, react_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "dig-btn dig-btn-sm dig-btn-danger",
										onClick: () => actions.onDelete?.(item),
										children: [(0, react_jsx_runtime.jsx)(Trash, { size: 14 }), t("delete")]
									})
								]
							})
						]
					})]
				})
			}) });
		}
		//#endregion
		//#region lib/types/client/image-card.js
		/** Conversation card for paint_image / paint_images / edit_painting results. */
		function isAttachment(value) {
			return typeof value === "object" && value !== null && typeof value.attachmentId === "string" && typeof value.mediaType === "string";
		}
		function resultFromMeta(meta) {
			if (typeof meta !== "object" || meta === null) return void 0;
			const value = meta;
			if (value.kind !== "copylee-image-gen" || !isAttachment(value.attachment)) return void 0;
			return {
				attachment: value.attachment,
				prompt: typeof value.prompt === "string" ? value.prompt : "",
				provider: typeof value.provider === "string" ? value.provider : "",
				model: typeof value.model === "string" ? value.model : "",
				output: typeof value.output === "string" ? value.output : ""
			};
		}
		/** Background jobs a result started (`background: true`); their images show in the reply. */
		function pendingJobs(block) {
			const meta = block?.meta ?? block?.resultView?.meta;
			if (typeof meta !== "object" || meta === null) return [];
			const entries = meta.kind === "copylee-image-gen-batch" ? meta.images : [meta];
			return Array.isArray(entries) ? entries.flatMap((entry) => {
				const value = entry;
				return value.kind === "copylee-image-gen" && value.pending === true && typeof value.jobId === "string" ? [value.jobId] : [];
			}) : [];
		}
		/** Every image a tool-call block carries, from meta first, then content. */
		function imageResults(block) {
			if (block === void 0) return [];
			const meta = block.meta ?? block.resultView?.meta;
			if (typeof meta === "object" && meta !== null && meta.kind === "copylee-image-gen-batch") {
				const images = meta.images;
				if (Array.isArray(images)) return images.map(resultFromMeta).filter((entry) => entry !== void 0);
			}
			const single = resultFromMeta(meta);
			if (single !== void 0) return [single];
			return ((block.resultView?.card === "generic" ? block.resultView.content : block.content) ?? []).flatMap((item) => item.type === "image" && isAttachment(item.attachment) ? [{
				attachment: item.attachment,
				prompt: "",
				provider: "",
				model: "",
				output: ""
			}] : []);
		}
		function ImageToolCard(props) {
			const t = useT(props.locale);
			const results = imageResults(props.block);
			const pending = pendingJobs(props.block);
			const [open, setOpen] = (0, react.useState)(null);
			if (results.length === 0 && pending.length > 0) return (0, react_jsx_runtime.jsx)("div", {
				className: "dig-root",
				style: { background: "transparent" },
				children: (0, react_jsx_runtime.jsx)("div", {
					className: "dig-hint",
					children: t("backgroundJobs").replace("{count}", String(pending.length))
				})
			});
			if (results.length === 0) {
				if (props.phase !== void 0 ? props.phase !== "result" : props.block === void 0 || !("kind" in props.block)) return (0, react_jsx_runtime.jsx)("div", {
					className: "dig-root",
					style: { background: "transparent" },
					children: (0, react_jsx_runtime.jsx)("div", {
						className: "dig-skeleton",
						style: {
							width: 240,
							height: 180
						}
					})
				});
				const text = (props.block?.content ?? props.block?.resultView?.content ?? []).filter((item) => item.type === "text").map((item) => item.text).join("\n");
				return (0, react_jsx_runtime.jsx)("div", {
					className: "dig-root",
					style: { background: "transparent" },
					children: text.length > 0 ? (0, react_jsx_runtime.jsx)("div", {
						className: "dig-error",
						style: { margin: 0 },
						children: text
					}) : null
				});
			}
			const items = results.map((result, index) => ({
				id: `${result.attachment.attachmentId}:${String(index)}`,
				attachment: result.attachment,
				prompt: result.prompt,
				providerId: result.provider,
				model: result.model,
				output: result.output,
				createdAt: Date.now(),
				projectId: "conversation",
				favorite: false
			}));
			return (0, react_jsx_runtime.jsxs)("div", {
				className: "dig-root",
				style: { background: "transparent" },
				children: [(0, react_jsx_runtime.jsx)("div", {
					className: "dig-card-chat",
					children: items.map((item, index) => (0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("div", {
						className: "dig-chat-img",
						role: "button",
						tabIndex: 0,
						onClick: () => setOpen(index),
						onKeyDown: (event) => {
							if (event.key === "Enter") setOpen(index);
						},
						children: (0, react_jsx_runtime.jsx)("img", {
							src: imageUrl(item.attachment),
							alt: item.prompt,
							loading: "lazy"
						})
					}), (0, react_jsx_runtime.jsxs)("div", {
						className: "dig-chat-meta",
						children: [
							(0, react_jsx_runtime.jsx)("span", { children: [item.providerId, item.model].filter(Boolean).join(" · ") }),
							(0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: "dig-icon-btn",
								title: t("download"),
								onClick: () => {
									downloadImage(item.attachment, "copylee-image");
								},
								children: (0, react_jsx_runtime.jsx)(Download, { size: 14 })
							}),
							(0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: "dig-icon-btn",
								title: t("copy"),
								onClick: () => {
									copyImage(item.attachment);
								},
								children: (0, react_jsx_runtime.jsx)(Copy, { size: 14 })
							})
						]
					})] }, item.id))
				}), open !== null && (0, react_jsx_runtime.jsx)(Lightbox, {
					items,
					index: open,
					onIndex: setOpen,
					onClose: () => setOpen(null),
					t,
					actions: {
						onDownload: (item) => {
							downloadImage(item.attachment, "copylee-image");
						},
						onCopy: (item) => {
							copyImage(item.attachment);
						}
					}
				})]
			});
		}
		//#endregion
		//#region lib/types/gallery-types.js
		/** Gallery wire types shared by the Host store and the browser client. */
		const DEFAULT_PROJECT_ID = "default";
		function ProjectList({ projects, current, onSelect, onChanged, t, showAll, onError, busyIds }) {
			const [editing, setEditing] = (0, react.useState)(null);
			const [draft, setDraft] = (0, react.useState)("");
			const [creating, setCreating] = (0, react.useState)(false);
			const [deleting, setDeleting] = (0, react.useState)(null);
			const [deleteItems, setDeleteItems] = (0, react.useState)(false);
			const [menuAnchor, openMenu, closeMenu] = useMenu();
			const [menuFor, setMenuFor] = (0, react.useState)(null);
			const commitRename = async (id) => {
				const name = draft.trim();
				setEditing(null);
				if (name.length === 0) return;
				try {
					await api.gallery.renameProject(id, name);
					onChanged();
				} catch (error) {
					onError(error instanceof Error ? error.message : String(error));
				}
			};
			const commitCreate = async () => {
				const name = draft.trim();
				setCreating(false);
				if (name.length === 0) return;
				try {
					const { project } = await api.gallery.createProject(name);
					onChanged();
					onSelect(project.id);
				} catch (error) {
					onError(error instanceof Error ? error.message : String(error));
				}
			};
			const row = (id, label, icon, count) => (0, react_jsx_runtime.jsxs)("div", {
				className: "dig-proj",
				role: "button",
				tabIndex: 0,
				"aria-current": current === id,
				onClick: () => onSelect(id),
				onKeyDown: (event) => {
					if (event.key === "Enter") onSelect(id);
				},
				children: [
					icon,
					(0, react_jsx_runtime.jsx)("span", {
						className: "dig-proj-name",
						children: label
					}),
					(0, react_jsx_runtime.jsx)("span", {
						className: "dig-proj-count",
						children: count
					}),
					(0, react_jsx_runtime.jsx)("span", { style: {
						width: 22,
						flex: "none"
					} })
				]
			}, id);
			return (0, react_jsx_runtime.jsxs)("div", {
				className: "dig-side-section",
				children: [
					(0, react_jsx_runtime.jsxs)("div", {
						className: "dig-section-title",
						children: [(0, react_jsx_runtime.jsx)("span", { children: t("projects") }), (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: "dig-icon-btn",
							title: t("newProject"),
							"aria-label": t("newProject"),
							onClick: () => {
								setDraft("");
								setCreating(true);
							},
							children: (0, react_jsx_runtime.jsx)(Plus, { size: 15 })
						})]
					}),
					(0, react_jsx_runtime.jsxs)("div", {
						className: "dig-proj-list dig-scroll",
						children: [
							showAll !== void 0 && row("__all__", t("allProjects"), (0, react_jsx_runtime.jsx)(Images, { size: 15 }), showAll.total),
							showAll !== void 0 && row("__favorites__", t("favorites"), (0, react_jsx_runtime.jsx)(Star, { size: 15 }), showAll.favorites),
							projects.map((project) => {
								const active = current === project.id;
								const icon = project.id === "conversation" ? (0, react_jsx_runtime.jsx)(MessageSquare, { size: 15 }) : active ? (0, react_jsx_runtime.jsx)(FolderOpen, { size: 15 }) : (0, react_jsx_runtime.jsx)(Folder, { size: 15 });
								if (editing === project.id) return (0, react_jsx_runtime.jsxs)("div", {
									className: "dig-proj",
									"aria-current": active,
									children: [icon, (0, react_jsx_runtime.jsx)("input", {
										className: "dig-proj-input",
										autoFocus: true,
										value: draft,
										onChange: (event) => setDraft(event.target.value),
										onBlur: () => {
											commitRename(project.id);
										},
										onKeyDown: (event) => {
											if (event.key === "Enter") commitRename(project.id);
											if (event.key === "Escape") setEditing(null);
										}
									})]
								}, project.id);
								return (0, react_jsx_runtime.jsxs)("div", {
									className: "dig-proj",
									role: "button",
									tabIndex: 0,
									"aria-current": active,
									onClick: () => onSelect(project.id),
									onDoubleClick: () => {
										if (project.builtin !== true) {
											setDraft(project.name);
											setEditing(project.id);
										}
									},
									onKeyDown: (event) => {
										if (event.key === "Enter") onSelect(project.id);
									},
									children: [
										icon,
										(0, react_jsx_runtime.jsx)("span", {
											className: "dig-proj-name",
											title: project.name,
											children: projectLabel(project, t)
										}),
										busyIds?.has(project.id) === true && (0, react_jsx_runtime.jsx)(LoaderCircle, {
											size: 13,
											className: "dig-spin dig-proj-busy",
											"aria-label": t("generatingInProject")
										}),
										(0, react_jsx_runtime.jsx)("span", {
											className: "dig-proj-count",
											children: project.count
										}),
										(0, react_jsx_runtime.jsx)("button", {
											type: "button",
											className: "dig-icon-btn",
											style: {
												width: 22,
												height: 22
											},
											"aria-label": "more",
											"aria-expanded": menuFor?.id === project.id && menuAnchor !== null,
											onClick: (event) => {
												setMenuFor(project);
												openMenu(event);
											},
											children: (0, react_jsx_runtime.jsx)(Ellipsis, { size: 14 })
										})
									]
								}, project.id);
							}),
							creating && (0, react_jsx_runtime.jsxs)("div", {
								className: "dig-proj",
								children: [(0, react_jsx_runtime.jsx)(Folder, { size: 15 }), (0, react_jsx_runtime.jsx)("input", {
									className: "dig-proj-input",
									autoFocus: true,
									placeholder: t("projectName"),
									value: draft,
									onChange: (event) => setDraft(event.target.value),
									onBlur: () => {
										commitCreate();
									},
									onKeyDown: (event) => {
										if (event.key === "Enter") commitCreate();
										if (event.key === "Escape") setCreating(false);
									}
								})]
							})
						]
					}),
					menuAnchor !== null && menuFor !== null && (0, react_jsx_runtime.jsx)(Menu, {
						anchor: menuAnchor,
						onClose: closeMenu,
						items: [{
							label: t("rename"),
							icon: (0, react_jsx_runtime.jsx)(Pencil, { size: 14 }),
							onSelect: () => {
								setDraft(menuFor.name);
								setEditing(menuFor.id);
							}
						}, ...menuFor.builtin === true ? [] : [{
							label: t("deleteProject"),
							icon: (0, react_jsx_runtime.jsx)(Trash, { size: 14 }),
							danger: true,
							onSelect: () => {
								setDeleteItems(false);
								setDeleting(menuFor);
							}
						}]]
					}),
					deleting !== null && (0, react_jsx_runtime.jsxs)(Modal, {
						title: t("deleteProject"),
						onClose: () => setDeleting(null),
						actions: (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [(0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: "dig-btn",
							onClick: () => setDeleting(null),
							children: t("cancel")
						}), (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: "dig-btn dig-btn-primary",
							style: {
								background: "var(--dig-danger)",
								borderColor: "var(--dig-danger)"
							},
							onClick: () => {
								const target = deleting;
								setDeleting(null);
								api.gallery.deleteProject(target.id, deleteItems).then(() => {
									if (current === target.id) onSelect(showAll === void 0 ? "default" : "__all__");
									onChanged();
								}, (error) => onError(error instanceof Error ? error.message : String(error)));
							},
							children: t("delete")
						})] }),
						children: [(0, react_jsx_runtime.jsx)("p", {
							style: { margin: 0 },
							children: t("deleteProjectConfirm", { name: deleting.name })
						}), (0, react_jsx_runtime.jsxs)("label", {
							className: "dig-row",
							style: { fontSize: 13 },
							children: [(0, react_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: deleteItems,
								onChange: (event) => setDeleteItems(event.target.checked)
							}), t("deleteProjectAndImages")]
						})]
					})
				]
			});
		}
		/** Built-in project names follow the UI language. */
		function projectLabel(project, t) {
			if (project.builtin !== true) return project.name;
			if (project.id === "conversation" && project.name === "对话") return t("fromConversation") === "来自对话" ? "对话" : "Conversations";
			if (project.id === "default" && project.name === "默认画板") return t("panel") === "绘画" ? "默认画板" : "Default board";
			return project.name;
		}
		//#endregion
		//#region lib/types/client/select.js
		/**
		* Dropdown in DSH's Menu style (ported from the dsh-free-search Select):
		* input-like trigger with a rotating chevron, a fixed-position floating card
		* (34px rows, trailing check on the selected row, optional group labels and
		* right-hand detail), keyboard navigation, and upward placement when the
		* space below runs out. `editable` adds a filter box that also accepts a
		* free-form value (model ids).
		*/
		const ROW = 34;
		function CheckIcon() {
			return (0, react_jsx_runtime.jsx)("svg", {
				viewBox: "0 0 16 16",
				width: 14,
				height: 14,
				"aria-hidden": "true",
				children: (0, react_jsx_runtime.jsx)("path", {
					d: "M3.5 8.5 6.5 11.5 12.5 4.5",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: 1.7,
					strokeLinecap: "round",
					strokeLinejoin: "round"
				})
			});
		}
		function ChevronIcon() {
			return (0, react_jsx_runtime.jsx)("svg", {
				className: "dig-select-chevron",
				viewBox: "0 0 16 16",
				width: 14,
				height: 14,
				"aria-hidden": "true",
				children: (0, react_jsx_runtime.jsx)("path", {
					d: "M4 6l4 4 4-4",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: 1.6,
					strokeLinecap: "round",
					strokeLinejoin: "round"
				})
			});
		}
		function Select(props) {
			const { options, value, disabled, editable } = props;
			const [open, setOpen] = (0, react.useState)(false);
			const [active, setActive] = (0, react.useState)(-1);
			const [pos, setPos] = (0, react.useState)(null);
			const [query, setQuery] = (0, react.useState)("");
			const triggerRef = (0, react.useRef)(null);
			const listRef = (0, react.useRef)(null);
			const filterRef = (0, react.useRef)(null);
			const baseId = (0, react.useId)();
			const visible = (0, react.useMemo)(() => {
				const needle = query.trim().toLowerCase();
				return needle.length === 0 ? options : options.filter((option) => option.label.toLowerCase().includes(needle) || option.value.toLowerCase().includes(needle));
			}, [options, query]);
			const selected = options.find((option) => option.value === value);
			visible.findIndex((option) => option.value === value);
			const place = (0, react.useCallback)(() => {
				const el = triggerRef.current;
				if (el === null) return;
				const rect = el.getBoundingClientRect();
				const margin = 12;
				const below = window.innerHeight - rect.bottom - margin;
				const above = rect.top - margin;
				const want = Math.min(360, options.length * ROW + (editable === true ? 52 : 12));
				const up = below < Math.min(want, 220) && above > below;
				const maxHeight = Math.max(120, Math.min(360, up ? above - 4 : below - 4));
				const width = Math.max(Math.min(rect.width, 440), props.compact === true ? 200 : 0);
				const left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8));
				setPos(up ? {
					left,
					width,
					bottom: window.innerHeight - rect.top + 4,
					maxHeight
				} : {
					left,
					width,
					top: rect.bottom + 4,
					maxHeight
				});
			}, [
				options.length,
				props.compact,
				editable
			]);
			const close = (0, react.useCallback)((refocus) => {
				setOpen(false);
				setQuery("");
				if (refocus) triggerRef.current?.focus();
			}, []);
			const openMenu = () => {
				if (disabled === true) return;
				place();
				setActive(Math.max(0, options.findIndex((option) => option.value === value)));
				setOpen(true);
			};
			const commit = (next) => {
				close(true);
				if (next !== value) props.onChange(next);
			};
			const choose = (index) => {
				const option = visible[index];
				if (option !== void 0) commit(option.value);
			};
			(0, react.useEffect)(() => {
				if (!open) return;
				const onPointer = (event) => {
					const target = event.target;
					if (listRef.current?.contains(target) === true || triggerRef.current?.contains(target) === true) return;
					close(false);
				};
				const onScroll = (event) => {
					if (listRef.current?.contains(event.target) === true) return;
					place();
				};
				document.addEventListener("pointerdown", onPointer, true);
				window.addEventListener("scroll", onScroll, true);
				window.addEventListener("resize", place);
				if (editable === true) requestAnimationFrame(() => filterRef.current?.focus());
				return () => {
					document.removeEventListener("pointerdown", onPointer, true);
					window.removeEventListener("scroll", onScroll, true);
					window.removeEventListener("resize", place);
				};
			}, [
				open,
				place,
				close,
				editable
			]);
			(0, react.useEffect)(() => {
				if (!open || active < 0 || listRef.current === null) return;
				const row = listRef.current.querySelector(`[data-index="${String(active)}"]`);
				if (row !== null && typeof row.scrollIntoView === "function") row.scrollIntoView({ block: "nearest" });
			}, [open, active]);
			const onKeyDown = (event) => {
				if (disabled === true) return;
				if (!open) {
					if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Enter" || event.key === " ") {
						event.preventDefault();
						openMenu();
					}
					return;
				}
				if (event.key === "Escape") {
					event.preventDefault();
					close(true);
				} else if (event.key === "Tab") close(false);
				else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
					event.preventDefault();
					if (visible.length === 0) return;
					const step = event.key === "ArrowDown" ? 1 : -1;
					setActive((index) => (index + step + visible.length) % visible.length);
				} else if (event.key === "Home" || event.key === "End") {
					event.preventDefault();
					setActive(event.key === "Home" ? 0 : visible.length - 1);
				} else if (event.key === "Enter" || event.key === " " && editable !== true) {
					event.preventDefault();
					if (active >= 0 && active < visible.length) choose(active);
					else if (editable === true && query.trim().length > 0) commit(query.trim());
				}
			};
			const listId = `${baseId}-list`;
			const rows = [];
			let lastGroup;
			visible.forEach((option, index) => {
				if (option.group !== void 0 && option.group !== lastGroup) rows.push((0, react_jsx_runtime.jsx)("div", {
					className: "dig-menu-label",
					role: "presentation",
					children: option.group
				}, `g-${option.group}`));
				lastGroup = option.group;
				const isSelected = option.value === value;
				rows.push((0, react_jsx_runtime.jsxs)("div", {
					id: `${baseId}-${String(index)}`,
					role: "option",
					"aria-selected": isSelected,
					"data-index": index,
					className: index === active ? "dig-menu-item dig-menu-item-active" : "dig-menu-item",
					onPointerMove: () => setActive(index),
					onPointerDown: (event) => event.preventDefault(),
					onClick: () => choose(index),
					children: [
						(0, react_jsx_runtime.jsx)("span", {
							className: "dig-menu-item-label",
							title: option.label,
							children: option.label
						}),
						option.detail !== void 0 && (0, react_jsx_runtime.jsx)("span", {
							className: "dig-menu-detail",
							children: option.detail
						}),
						(0, react_jsx_runtime.jsx)("span", {
							className: "dig-menu-check",
							children: isSelected ? (0, react_jsx_runtime.jsx)(CheckIcon, {}) : null
						})
					]
				}, option.value));
			});
			const freeText = editable === true ? query.trim() : "";
			const offerFree = freeText.length > 0 && !options.some((option) => option.value === freeText);
			return (0, react_jsx_runtime.jsxs)("div", {
				className: props.compact === true ? "dig-select-wrap dig-select-compact" : "dig-select-wrap",
				children: [(0, react_jsx_runtime.jsxs)("button", {
					ref: triggerRef,
					id: props.id,
					type: "button",
					className: open ? "dig-select dig-select-open" : "dig-select",
					disabled,
					"aria-label": props.label,
					"aria-haspopup": "listbox",
					"aria-expanded": open,
					"aria-controls": open ? listId : void 0,
					"aria-activedescendant": open && active >= 0 && editable !== true ? `${baseId}-${String(active)}` : void 0,
					onClick: () => open ? close(false) : openMenu(),
					onKeyDown,
					children: [
						(0, react_jsx_runtime.jsx)("span", {
							className: selected === void 0 && value.length === 0 ? "dig-select-value dig-select-placeholder" : "dig-select-value",
							children: selected?.label ?? (value.length > 0 ? value : props.placeholder ?? "")
						}),
						props.adornment,
						(0, react_jsx_runtime.jsx)(ChevronIcon, {})
					]
				}), open && pos !== null && (0, react_jsx_runtime.jsx)(Portal, { children: (0, react_jsx_runtime.jsxs)("div", {
					ref: listRef,
					id: listId,
					role: "listbox",
					"aria-label": props.label,
					className: "dig-menu-pop",
					style: {
						left: pos.left,
						width: pos.width,
						maxHeight: pos.maxHeight,
						...pos.top !== void 0 ? { top: pos.top } : { bottom: pos.bottom }
					},
					children: [
						editable === true && (0, react_jsx_runtime.jsx)("div", {
							className: "dig-menu-filter",
							children: (0, react_jsx_runtime.jsx)("input", {
								ref: filterRef,
								className: "dig-input",
								value: query,
								placeholder: props.editablePlaceholder,
								"aria-label": props.editablePlaceholder ?? props.label,
								"aria-activedescendant": active >= 0 ? `${baseId}-${String(active)}` : void 0,
								onChange: (event) => {
									setQuery(event.target.value);
									setActive(0);
								},
								onKeyDown
							})
						}),
						offerFree && (0, react_jsx_runtime.jsxs)("div", {
							className: active === -1 || visible.length === 0 ? "dig-menu-item dig-menu-item-active" : "dig-menu-item",
							role: "option",
							"aria-selected": false,
							onPointerDown: (event) => event.preventDefault(),
							onClick: () => commit(freeText),
							children: [(0, react_jsx_runtime.jsxs)("span", {
								className: "dig-menu-item-label",
								children: [
									"“",
									freeText,
									"”"
								]
							}), (0, react_jsx_runtime.jsx)("span", {
								className: "dig-menu-detail",
								children: "↵"
							})]
						}),
						rows,
						rows.length === 0 && !offerFree && (0, react_jsx_runtime.jsx)("div", {
							className: "dig-menu-empty",
							children: "—"
						})
					]
				}) })]
			});
		}
		//#endregion
		//#region lib/types/client/gallery-view.js
		/** The “图库” tab: every image across gallery projects, with filters and bulk actions. */
		const PAGE = 120;
		function GalleryView(props) {
			const { t, filter } = props;
			const [query, setQuery] = (0, react.useState)("");
			const [providerId, setProviderId] = (0, react.useState)("");
			const [order, setOrder] = (0, react.useState)("desc");
			const [items, setItems] = (0, react.useState)([]);
			const [total, setTotal] = (0, react.useState)(0);
			const [limit, setLimit] = (0, react.useState)(PAGE);
			const [selecting, setSelecting] = (0, react.useState)(false);
			const [selected, setSelected] = (0, react.useState)(/* @__PURE__ */ new Set());
			const [lightbox, setLightbox] = (0, react.useState)(null);
			const [confirmDelete, setConfirmDelete] = (0, react.useState)(null);
			const [moveAnchor, openMove, closeMove] = useMenu();
			const load = (0, react.useCallback)(async () => {
				try {
					const page = await api.gallery.list({
						...filter === "__all__" || filter === "__favorites__" ? {} : { projectId: filter },
						...filter === "__favorites__" ? { favorite: true } : {},
						...providerId.length > 0 ? { providerId } : {},
						...query.trim().length > 0 ? { query: query.trim() } : {},
						order,
						limit
					});
					setItems(page.items);
					setTotal(page.total);
				} catch (error) {
					props.onError(error instanceof Error ? error.message : String(error));
				}
			}, [
				filter,
				providerId,
				query,
				order,
				limit,
				props.onError
			]);
			(0, react.useEffect)(() => {
				const timer = setTimeout(() => {
					load();
				}, query.length > 0 ? 200 : 0);
				return () => clearTimeout(timer);
			}, [
				load,
				props.refreshKey,
				query.length
			]);
			(0, react.useEffect)(() => {
				setSelected(/* @__PURE__ */ new Set());
				setLimit(PAGE);
			}, [filter]);
			const toggle = (id) => setSelected((current) => {
				const next = new Set(current);
				if (next.has(id)) next.delete(id);
				else next.add(id);
				return next;
			});
			const after = () => {
				props.onGalleryChanged();
				load();
			};
			const ids = [...selected];
			const projectName = (id) => {
				const project = props.projects.find((entry) => entry.id === id);
				return project === void 0 ? id : projectLabel(project, t);
			};
			const importFiles = async (files) => {
				try {
					const attachments = await uploadFiles(files.filter((file) => file.type.startsWith("image/")), props.settings?.imageLimits);
					const target = filter === "__all__" || filter === "__favorites__" ? DEFAULT_PROJECT_ID : filter;
					await api.gallery.importAttachments(attachments, target);
					after();
				} catch (error) {
					props.onError(error instanceof Error ? error.message : String(error));
				}
			};
			const providerOptions = props.settings?.providers ?? [];
			return (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
				(0, react_jsx_runtime.jsx)("aside", {
					className: "dig-side",
					children: props.sideTop
				}),
				(0, react_jsx_runtime.jsxs)("section", {
					className: "dig-gallery",
					children: [(0, react_jsx_runtime.jsxs)("div", {
						className: "dig-toolbar",
						children: [
							(0, react_jsx_runtime.jsxs)("div", {
								className: "dig-search",
								children: [(0, react_jsx_runtime.jsx)(Search, { size: 14 }), (0, react_jsx_runtime.jsx)("input", {
									className: "dig-input",
									placeholder: t("search"),
									value: query,
									onChange: (event) => setQuery(event.target.value)
								})]
							}),
							(0, react_jsx_runtime.jsx)(Select, {
								compact: true,
								label: t("provider"),
								value: providerId,
								options: [
									{
										value: "",
										label: t("allProviders")
									},
									...providerOptions.map((entry) => ({
										value: entry.id,
										label: entry.name
									})),
									{
										value: "import",
										label: t("importImages")
									}
								],
								onChange: setProviderId
							}),
							(0, react_jsx_runtime.jsx)(Select, {
								compact: true,
								label: t("newest"),
								value: order,
								options: [{
									value: "desc",
									label: t("newest")
								}, {
									value: "asc",
									label: t("oldest")
								}],
								onChange: (next) => setOrder(next)
							}),
							(0, react_jsx_runtime.jsx)("span", { className: "dig-spacer" }),
							selecting ? (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
								(0, react_jsx_runtime.jsx)("span", {
									className: "dig-hint",
									children: t("selected", { n: selected.size })
								}),
								(0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: "dig-btn dig-btn-sm",
									onClick: () => setSelected(new Set(items.map((item) => item.id))),
									children: t("selectAll")
								}),
								(0, react_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "dig-btn dig-btn-sm",
									disabled: selected.size === 0,
									onClick: () => {
										api.gallery.update(ids, { favorite: true }).then(after);
									},
									children: [(0, react_jsx_runtime.jsx)(Star, { size: 13 }), t("favorite")]
								}),
								(0, react_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "dig-btn dig-btn-sm",
									disabled: selected.size === 0,
									onClick: openMove,
									children: [(0, react_jsx_runtime.jsx)(FolderInput, { size: 13 }), t("moveTo")]
								}),
								(0, react_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "dig-btn dig-btn-sm",
									disabled: selected.size === 0,
									onClick: () => {
										for (const item of items.filter((entry) => selected.has(entry.id))) downloadImage(item.attachment, `copylee-image-${item.id.slice(0, 8)}`);
									},
									children: [(0, react_jsx_runtime.jsx)(Download, { size: 13 }), t("download")]
								}),
								(0, react_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "dig-btn dig-btn-sm dig-btn-danger",
									disabled: selected.size === 0,
									onClick: () => setConfirmDelete(ids),
									children: [(0, react_jsx_runtime.jsx)(Trash, { size: 13 }), t("delete")]
								}),
								(0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: "dig-icon-btn",
									"aria-label": t("clearSelection"),
									onClick: () => {
										setSelecting(false);
										setSelected(/* @__PURE__ */ new Set());
									},
									children: (0, react_jsx_runtime.jsx)(X, { size: 15 })
								})
							] }) : (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [(0, react_jsx_runtime.jsxs)("label", {
								className: "dig-btn dig-btn-sm",
								style: { cursor: "pointer" },
								children: [
									(0, react_jsx_runtime.jsx)(ImagePlus, { size: 13 }),
									t("importImages"),
									(0, react_jsx_runtime.jsx)("input", {
										type: "file",
										accept: "image/*",
										multiple: true,
										hidden: true,
										onChange: (event) => {
											importFiles([...event.target.files ?? []]);
											event.target.value = "";
										}
									})
								]
							}), (0, react_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "dig-btn dig-btn-sm",
								onClick: () => setSelecting(true),
								children: [(0, react_jsx_runtime.jsx)(SquareCheckBig, { size: 13 }), t("batchSelect")]
							})] })
						]
					}), (0, react_jsx_runtime.jsxs)("div", {
						className: "dig-grid dig-scroll",
						children: [
							items.length === 0 && (0, react_jsx_runtime.jsxs)("div", {
								className: "dig-empty",
								children: [(0, react_jsx_runtime.jsx)(Images, {
									size: 36,
									strokeWidth: 1.4
								}), t("emptyGallery")]
							}),
							items.map((item, index) => (0, react_jsx_runtime.jsxs)("div", {
								className: "dig-card",
								role: "button",
								tabIndex: 0,
								"aria-selected": selecting ? selected.has(item.id) : void 0,
								title: item.prompt,
								onClick: () => selecting ? toggle(item.id) : setLightbox(index),
								onKeyDown: (event) => {
									if (event.key === "Enter") {
										if (selecting) toggle(item.id);
										else setLightbox(index);
									}
								},
								children: [
									(0, react_jsx_runtime.jsx)("img", {
										src: imageUrl(item.attachment),
										alt: item.prompt,
										loading: "lazy"
									}),
									selecting && (0, react_jsx_runtime.jsx)("span", {
										className: "dig-card-check",
										children: selected.has(item.id) && (0, react_jsx_runtime.jsx)(Check, { size: 14 })
									}),
									!selecting && item.favorite && (0, react_jsx_runtime.jsx)(Star, {
										size: 16,
										className: "dig-card-star",
										fill: "#f5a623"
									}),
									(0, react_jsx_runtime.jsx)("div", {
										className: "dig-card-overlay",
										children: item.prompt || item.providerName
									})
								]
							}, item.id)),
							items.length < total && (0, react_jsx_runtime.jsx)("div", {
								className: "dig-empty",
								style: { padding: 16 },
								children: (0, react_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "dig-btn dig-btn-sm",
									onClick: () => setLimit((current) => current + PAGE),
									children: [
										t("loadMore"),
										" (",
										items.length,
										"/",
										total,
										")"
									]
								})
							})
						]
					})]
				}),
				moveAnchor !== null && (0, react_jsx_runtime.jsx)(Menu, {
					anchor: moveAnchor,
					onClose: closeMove,
					items: props.projects.map((project) => ({
						label: projectLabel(project, t),
						onSelect: () => {
							api.gallery.update(ids, { projectId: project.id }).then(() => {
								setSelected(/* @__PURE__ */ new Set());
								after();
							});
						}
					}))
				}),
				confirmDelete !== null && (0, react_jsx_runtime.jsx)(Modal, {
					title: t("delete"),
					onClose: () => setConfirmDelete(null),
					actions: (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [(0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: "dig-btn",
						onClick: () => setConfirmDelete(null),
						children: t("cancel")
					}), (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: "dig-btn dig-btn-primary",
						style: {
							background: "var(--dig-danger)",
							borderColor: "var(--dig-danger)"
						},
						onClick: () => {
							const target = confirmDelete;
							setConfirmDelete(null);
							api.gallery.remove(target).then(() => {
								setSelected(/* @__PURE__ */ new Set());
								setLightbox(null);
								after();
							});
						},
						children: t("delete")
					})] }),
					children: (0, react_jsx_runtime.jsx)("p", {
						style: { margin: 0 },
						children: t("deleteConfirm", { n: confirmDelete.length })
					})
				}),
				lightbox !== null && (0, react_jsx_runtime.jsx)(Lightbox, {
					items,
					index: lightbox,
					onIndex: setLightbox,
					onClose: () => setLightbox(null),
					t,
					projectName,
					actions: {
						onDownload: (item) => {
							downloadImage(item.attachment, `copylee-image-${item.id.slice(0, 8)}`);
						},
						onReveal: (item) => {
							api.gallery.reveal(item.id).then((result) => props.toast(t("revealedAt", { path: result.path })), (error) => props.onError(error instanceof Error ? error.message : String(error)));
						},
						onCopy: (item) => {
							copyImage(item.attachment).then(() => props.toast(t("copied")), (error) => props.onError(error instanceof Error ? error.message : String(error)));
						},
						onFavorite: (item) => {
							api.gallery.update([item.id], { favorite: !item.favorite }).then(after);
						},
						onDelete: (item) => setConfirmDelete([item.id]),
						onUseAsReference: (item) => {
							setLightbox(null);
							props.onUseAsReference(item);
						},
						onReusePrompt: (item) => {
							setLightbox(null);
							props.onReusePrompt(item);
						}
					}
				})
			] });
		}
		//#endregion
		//#region lib/types/client/resolution.js
		/**
		* Resolution row for pixel-size protocols: 标准 (the provider's table size),
		* long-side presets (1K / 1.5K / 2K) that fit the provider's range, and a
		* custom W × H pair with an aspect lock.
		*/
		const DEFAULT_RESOLUTION = {
			res: "std",
			w: 1024,
			h: 1024,
			lock: true
		};
		/** Presets whose size fits the range without clamping either side. */
		function presetsFor(range, ratio) {
			return RESOLUTION_PRESETS.flatMap((preset) => {
				const size = sizeForRatio(ratio, preset.longSide, range.step);
				return size.width >= range.min && size.height >= range.min && size.width <= range.max && size.height <= range.max ? [{
					id: preset.id,
					label: preset.label,
					...size
				}] : [];
			});
		}
		/**
		* The explicit `WxH` the request should carry, or undefined for the
		* provider's standard size (ratio table / tier).
		*/
		function explicitSize(caps, ratio, state) {
			const range = caps?.customSize;
			if (range === void 0 || state.res === "std") return void 0;
			if (state.res === "custom") return `${String(clampDimension(state.w, range))}x${String(clampDimension(state.h, range))}`;
			const preset = presetsFor(range, ratio).find((entry) => entry.id === state.res);
			return preset === void 0 ? void 0 : `${String(preset.width)}x${String(preset.height)}`;
		}
		/** Height that keeps `width` on `ratio`. */
		function lockedHeight(width, ratio, range) {
			const [rw, rh] = ratio.split(":").map(Number);
			if (rw === void 0 || rh === void 0 || rw <= 0 || rh <= 0) return width;
			return clampDimension(width * rh / rw, range);
		}
		function ResolutionPicker({ t, caps, ratio, value, onChange }) {
			const range = caps.customSize;
			if (range === void 0) return null;
			const presets = presetsFor(range, ratio);
			const mode = value.res === "custom" || value.res === "std" || presets.some((preset) => preset.id === value.res) ? value.res : "std";
			const standard = caps.sizes?.[ratio]?.replace("*", "×").replace("x", "×") ?? (caps.tiers.length > 0 ? caps.tiers.join(" / ") : "");
			const caption = mode === "std" ? standard : mode === "custom" ? `${String(clampDimension(value.w, range))}×${String(clampDimension(value.h, range))}` : (() => {
				const preset = presets.find((entry) => entry.id === mode);
				return preset === void 0 ? "" : `${String(preset.width)}×${String(preset.height)}`;
			})();
			const startCustom = () => {
				const current = caption.match(/(\d+)×(\d+)/);
				const w = current === null ? value.w : Number(current[1]);
				const h = current === null ? value.h : Number(current[2]);
				onChange({
					...value,
					res: "custom",
					w: clampDimension(w, range),
					h: clampDimension(h, range)
				});
			};
			const setWidth = (raw, commit) => {
				const w = Number(raw.replace(/\D/g, "")) || 0;
				const width = commit ? clampDimension(w, range) : w;
				onChange({
					...value,
					w: width,
					...value.lock ? { h: lockedHeight(Math.max(width, range.min), ratio, range) } : {}
				});
			};
			const setHeight = (raw, commit) => {
				const h = Number(raw.replace(/\D/g, "")) || 0;
				const height = commit ? clampDimension(h, range) : h;
				if (!value.lock) {
					onChange({
						...value,
						h: height
					});
					return;
				}
				const [rw, rh] = ratio.split(":").map(Number);
				const width = rw !== void 0 && rh !== void 0 && rw > 0 && rh > 0 ? clampDimension(Math.max(height, range.min) * rw / rh, range) : height;
				onChange({
					...value,
					h: height,
					w: width
				});
			};
			return (0, react_jsx_runtime.jsxs)("div", {
				className: "dig-field",
				children: [
					(0, react_jsx_runtime.jsxs)("span", {
						className: "dig-label",
						children: [t("pixelSize"), (0, react_jsx_runtime.jsx)("span", {
							className: "dig-hint",
							children: caption
						})]
					}),
					(0, react_jsx_runtime.jsxs)("div", {
						className: "dig-chips",
						role: "group",
						"aria-label": t("pixelSize"),
						children: [
							(0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: "dig-chip",
								"aria-pressed": mode === "std",
								onClick: () => onChange({
									...value,
									res: "std"
								}),
								children: t("standardSize")
							}),
							presets.map((preset) => (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: "dig-chip",
								title: `${String(preset.width)}×${String(preset.height)}`,
								"aria-pressed": mode === preset.id,
								onClick: () => onChange({
									...value,
									res: preset.id
								}),
								children: preset.label
							}, preset.id)),
							(0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: "dig-chip",
								"aria-pressed": mode === "custom",
								onClick: startCustom,
								children: t("customSize")
							})
						]
					}),
					mode === "custom" && (0, react_jsx_runtime.jsxs)("div", {
						className: "dig-size-row",
						children: [
							(0, react_jsx_runtime.jsx)("input", {
								className: "dig-input",
								inputMode: "numeric",
								"aria-label": t("width"),
								value: value.w === 0 ? "" : String(value.w),
								onChange: (event) => setWidth(event.target.value, false),
								onBlur: (event) => setWidth(event.target.value, true)
							}),
							(0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: "dig-icon-btn",
								"aria-pressed": value.lock,
								title: value.lock ? t("unlockRatio") : t("lockRatio"),
								"aria-label": value.lock ? t("unlockRatio") : t("lockRatio"),
								onClick: () => onChange({
									...value,
									lock: !value.lock,
									...!value.lock ? { h: lockedHeight(clampDimension(value.w, range), ratio, range) } : {}
								}),
								children: value.lock ? (0, react_jsx_runtime.jsx)(Link2, { size: 15 }) : (0, react_jsx_runtime.jsx)(Link2Off, { size: 15 })
							}),
							(0, react_jsx_runtime.jsx)("input", {
								className: "dig-input",
								inputMode: "numeric",
								"aria-label": t("height"),
								value: value.h === 0 ? "" : String(value.h),
								onChange: (event) => setHeight(event.target.value, false),
								onBlur: (event) => setHeight(event.target.value, true)
							})
						]
					}),
					mode === "custom" && (0, react_jsx_runtime.jsx)("span", {
						className: "dig-hint",
						children: t("sizeRangeHint", {
							min: range.min,
							max: range.max,
							step: range.step
						})
					}),
					mode !== "std" && (0, react_jsx_runtime.jsx)("span", {
						className: "dig-hint",
						children: t("sizeSupportHint")
					})
				]
			});
		}
		//#endregion
		//#region lib/types/client/prompt-picker.js
		/**
		* Saved-prompt popover anchored to the composer: save/unsave the current
		* prompt, search, click to replace, “追加” to append, delete — without
		* leaving the paint tab. Opened by the bookmark button, `/` in an empty
		* prompt box, or Ctrl/⌘+K.
		*/
		function PromptPicker({ t, anchor, prompt, prompts, onReload, onUse, onClose, onError }) {
			const [query, setQuery] = (0, react.useState)("");
			const [active, setActive] = (0, react.useState)(0);
			const [pos, setPos] = (0, react.useState)(null);
			const ref = (0, react.useRef)(null);
			const searchRef = (0, react.useRef)(null);
			const current = prompt.trim();
			const saved = prompts.find((entry) => entry.text === current);
			const visible = (0, react.useMemo)(() => {
				const needle = query.trim().toLowerCase();
				return needle.length === 0 ? prompts : prompts.filter((entry) => entry.text.toLowerCase().includes(needle));
			}, [prompts, query]);
			(0, react.useLayoutEffect)(() => {
				const place = () => {
					const rect = anchor.getBoundingClientRect();
					const width = Math.min(rect.width, 560);
					setPos({
						left: rect.left,
						width,
						bottom: window.innerHeight - rect.top + 6,
						maxHeight: Math.max(200, Math.min(440, rect.top - 16))
					});
				};
				place();
				window.addEventListener("resize", place);
				return () => window.removeEventListener("resize", place);
			}, [anchor]);
			(0, react.useEffect)(() => {
				searchRef.current?.focus();
				const onDown = (event) => {
					const target = event.target;
					if (ref.current?.contains(target) !== true && !anchor.contains(target)) onClose();
				};
				document.addEventListener("pointerdown", onDown, true);
				return () => document.removeEventListener("pointerdown", onDown, true);
			}, [anchor, onClose]);
			(0, react.useEffect)(() => {
				ref.current?.querySelector(`[data-index="${String(active)}"]`)?.scrollIntoView?.({ block: "nearest" });
			}, [active]);
			const toggleSaved = () => {
				(saved === void 0 ? api.gallery.addFavoritePrompt(current) : api.gallery.removeFavoritePrompt(saved.id)).then(onReload, (error) => onError(error instanceof Error ? error.message : String(error)));
			};
			const remove = (id) => {
				api.gallery.removeFavoritePrompt(id).then(onReload, (error) => onError(error instanceof Error ? error.message : String(error)));
			};
			const onKeyDown = (event) => {
				if (event.key === "Escape") {
					event.preventDefault();
					onClose();
				} else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
					event.preventDefault();
					if (visible.length === 0) return;
					setActive((index) => (index + (event.key === "ArrowDown" ? 1 : -1) + visible.length) % visible.length);
				} else if (event.key === "Enter" && !event.nativeEvent.isComposing) {
					event.preventDefault();
					const entry = visible[active];
					if (entry !== void 0) onUse(entry.text, event.shiftKey ? "append" : "replace");
				}
			};
			if (pos === null) return null;
			return (0, react_jsx_runtime.jsx)(Portal, { children: (0, react_jsx_runtime.jsxs)("div", {
				ref,
				className: "dig-menu-pop dig-prompt-pop",
				role: "dialog",
				"aria-label": t("tabPrompts"),
				style: {
					left: pos.left,
					width: pos.width,
					bottom: pos.bottom,
					maxHeight: pos.maxHeight
				},
				onKeyDown,
				children: [
					(0, react_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "dig-menu-item dig-prompt-save",
						disabled: current.length === 0,
						onClick: toggleSaved,
						children: [saved === void 0 ? (0, react_jsx_runtime.jsx)(Bookmark, { size: 15 }) : (0, react_jsx_runtime.jsx)(BookmarkCheck, { size: 15 }), (0, react_jsx_runtime.jsx)("span", {
							className: "dig-menu-item-label",
							children: current.length === 0 ? t("savePromptEmpty") : saved === void 0 ? t("savePrompt") : t("promptSavedToggle")
						})]
					}),
					(0, react_jsx_runtime.jsxs)("div", {
						className: "dig-menu-filter dig-search",
						style: { maxWidth: "none" },
						children: [(0, react_jsx_runtime.jsx)(Search, { size: 14 }), (0, react_jsx_runtime.jsx)("input", {
							ref: searchRef,
							className: "dig-input",
							value: query,
							placeholder: t("searchPrompts"),
							"aria-label": t("searchPrompts"),
							onChange: (event) => {
								setQuery(event.target.value);
								setActive(0);
							}
						})]
					}),
					(0, react_jsx_runtime.jsxs)("div", {
						className: "dig-prompt-list",
						role: "listbox",
						"aria-label": t("tabPrompts"),
						children: [
							visible.map((entry, index) => (0, react_jsx_runtime.jsxs)("div", {
								role: "option",
								"aria-selected": index === active,
								"data-index": index,
								className: index === active ? "dig-menu-item dig-menu-item-active dig-prompt-item" : "dig-menu-item dig-prompt-item",
								title: entry.text,
								onPointerMove: () => setActive(index),
								onClick: () => onUse(entry.text, "replace"),
								children: [
									(0, react_jsx_runtime.jsx)("span", {
										className: "dig-prompt-item-text",
										children: entry.text
									}),
									(0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: "dig-icon-btn",
										title: t("appendPrompt"),
										"aria-label": t("appendPrompt"),
										onClick: (event) => {
											event.stopPropagation();
											onUse(entry.text, "append");
										},
										children: (0, react_jsx_runtime.jsx)(Plus, { size: 14 })
									}),
									(0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: "dig-icon-btn",
										title: t("delete"),
										"aria-label": t("delete"),
										onClick: (event) => {
											event.stopPropagation();
											remove(entry.id);
										},
										children: (0, react_jsx_runtime.jsx)(X, { size: 14 })
									})
								]
							}, entry.id)),
							prompts.length === 0 && (0, react_jsx_runtime.jsx)("div", {
								className: "dig-menu-empty",
								children: t("noPromptsHint")
							}),
							prompts.length > 0 && visible.length === 0 && (0, react_jsx_runtime.jsx)("div", {
								className: "dig-menu-empty",
								children: "—"
							})
						]
					}),
					(0, react_jsx_runtime.jsx)("div", {
						className: "dig-prompt-foot",
						children: t("promptPickerKeys")
					})
				]
			}) });
		}
		//#endregion
		//#region lib/types/client/paint-session.js
		/**
		* Paint-tab state that must outlive the component: the composer draft, each
		* project's artboard and the running generation jobs. DSH unmounts the page
		* when the user opens a conversation (and the 绘画/图库 tabs unmount each
		* other), while the request keeps running; keeping this at module level
		* lets the page pick the job back up — skeleton, stop button, result — on
		* return.
		*/
		const EMPTY_BOARD = Object.freeze({
			batch: [],
			selectedId: null,
			error: null
		});
		let state = {
			draft: {
				prompt: "",
				references: []
			},
			boards: /* @__PURE__ */ new Map(),
			jobs: /* @__PURE__ */ new Map()
		};
		const listeners = /* @__PURE__ */ new Set();
		const galleryListeners = /* @__PURE__ */ new Set();
		function commit(next) {
			state = next;
			for (const listener of listeners) listener();
		}
		function getPaintSession() {
			return state;
		}
		function subscribePaintSession(listener) {
			listeners.add(listener);
			return () => {
				listeners.delete(listener);
			};
		}
		function usePaintSession() {
			return (0, react.useSyncExternalStore)(subscribePaintSession, getPaintSession, getPaintSession);
		}
		/** Called whenever a job saved images, even with no page mounted to see it. */
		function onGalleryChanged(listener) {
			galleryListeners.add(listener);
			return () => {
				galleryListeners.delete(listener);
			};
		}
		function boardOf(session, projectId) {
			return session.boards.get(projectId) ?? EMPTY_BOARD;
		}
		function setDraft(patch) {
			const draft = {
				...state.draft,
				...typeof patch === "function" ? patch(state.draft) : patch
			};
			commit({
				...state,
				draft
			});
		}
		function updateBoard(projectId, patch) {
			const current = boardOf(state, projectId);
			const boards = new Map(state.boards);
			boards.set(projectId, {
				...current,
				...typeof patch === "function" ? patch(current) : patch
			});
			commit({
				...state,
				boards
			});
		}
		/** Clear a project's artboard back to the empty canvas. */
		function clearBoard(projectId) {
			updateBoard(projectId, {
				batch: [],
				selectedId: null,
				error: null
			});
		}
		/**
		* Start a generation for one project (one job per project at a time). The
		* result lands on that project's board whether or not the page is mounted.
		*/
		async function startJob(request, options) {
			const projectId = request.projectId;
			if (state.jobs.has(projectId)) return;
			const controller = new AbortController();
			const job = {
				projectId,
				count: request.count,
				prompt: request.prompt,
				startedAt: Date.now(),
				controller
			};
			const jobs = new Map(state.jobs);
			jobs.set(projectId, job);
			commit({
				...state,
				jobs
			});
			updateBoard(projectId, { error: null });
			const paint = options.paint ?? ((input, signal) => api.paint(input, signal));
			let saved = false;
			try {
				const result = await paint(request, controller.signal);
				saved = result.items.length > 0;
				updateBoard(projectId, {
					batch: result.items,
					selectedId: result.items[0]?.id ?? null,
					error: result.failures.length > 0 ? options.describeFailures(result.failures) : null
				});
			} catch (failure) {
				if (!controller.signal.aborted) updateBoard(projectId, { error: failure instanceof Error ? failure.message : String(failure) });
			} finally {
				const rest = new Map(state.jobs);
				if (rest.get(projectId) === job) rest.delete(projectId);
				commit({
					...state,
					jobs: rest
				});
				if (saved) for (const listener of galleryListeners) listener();
			}
		}
		function stopJob(projectId) {
			state.jobs.get(projectId)?.controller.abort();
		}
		//#endregion
		//#region lib/types/client/paint-view.js
		/**
		* The “绘画” tab: parameters on the left, artboard + prompt composer in the
		* middle, the current project's history on the right (Cherry Studio layout).
		*/
		const PARAMS_KEY = "copylee-image-gen.paint.v1";
		const COMPOSER_KEY = "copylee-image-gen.composer.h";
		const COMPOSER_MIN = 72;
		/** Default cap for the auto-growing prompt box: 40% of the viewport. */
		function defaultComposerCap() {
			return Math.round(window.innerHeight * .4);
		}
		function loadComposerCap() {
			try {
				const value = Number(localStorage.getItem(COMPOSER_KEY));
				return Number.isFinite(value) && value >= COMPOSER_MIN ? value : null;
			} catch {
				return null;
			}
		}
		function saveComposerCap(value) {
			try {
				if (value === null) localStorage.removeItem(COMPOSER_KEY);
				else localStorage.setItem(COMPOSER_KEY, String(Math.round(value)));
			} catch {}
		}
		const QUALITIES = [
			"auto",
			"low",
			"medium",
			"high"
		];
		function loadParams() {
			try {
				const raw = localStorage.getItem(PARAMS_KEY);
				return raw === null ? {} : JSON.parse(raw);
			} catch {
				return {};
			}
		}
		function saveParams(state) {
			try {
				localStorage.setItem(PARAMS_KEY, JSON.stringify(state));
			} catch {}
		}
		/** Providers the paintings page can use right now. */
		function readyProviders(settings) {
			return (settings?.providers ?? []).filter((entry) => entry.enabled && entry.keyConfigured && entry.baseURL.length > 0);
		}
		function PaintView(props) {
			const { t, settings, history } = props;
			const providers = (0, react.useMemo)(() => readyProviders(settings), [settings]);
			const initial = (0, react.useMemo)(loadParams, []);
			const [params, setParams] = (0, react.useState)(() => ({
				providerId: initial.providerId ?? "",
				model: initial.model ?? "",
				ratio: initial.ratio ?? "1:1",
				tier: initial.tier ?? "",
				quality: initial.quality ?? "auto",
				count: initial.count ?? 1,
				seed: "",
				negative: initial.negative ?? "",
				sizes: typeof initial.sizes === "object" && initial.sizes !== null ? initial.sizes : {}
			}));
			const session = usePaintSession();
			const projectId = props.projectId;
			const board = boardOf(session, projectId);
			const busy = session.jobs.get(projectId) ?? null;
			const prompt = session.draft.prompt;
			const references = session.draft.references;
			const error = board.error;
			const currentBatch = board.batch;
			const selectedId = board.selectedId;
			const setPrompt = (next) => setDraft((draft) => ({ prompt: typeof next === "function" ? next(draft.prompt) : next }));
			const setReferences = (next) => setDraft((draft) => ({ references: next(draft.references) }));
			const setCurrentBatch = (next) => updateBoard(projectId, (current) => ({ batch: typeof next === "function" ? next(current.batch) : next }));
			const setSelectedId = (id) => updateBoard(projectId, { selectedId: id });
			const [now, setNow] = (0, react.useState)(Date.now);
			(0, react.useEffect)(() => {
				if (busy === null) return;
				setNow(Date.now());
				const timer = setInterval(() => setNow(Date.now()), 1e3);
				return () => clearInterval(timer);
			}, [busy]);
			const [lightbox, setLightbox] = (0, react.useState)(null);
			const fileInput = (0, react.useRef)(null);
			const promptRef = (0, react.useRef)(null);
			const composerRef = (0, react.useRef)(null);
			const [pickerOpen, setPickerOpen] = (0, react.useState)(false);
			const [savedPrompts, setSavedPrompts] = (0, react.useState)([]);
			const reloadPrompts = (0, react.useCallback)(() => {
				api.gallery.favoritePrompts().then((result) => setSavedPrompts(result.prompts), () => {});
			}, []);
			(0, react.useEffect)(reloadPrompts, [reloadPrompts, props.refreshKey]);
			const promptSaved = prompt.trim().length > 0 && savedPrompts.some((entry) => entry.text === prompt.trim());
			const usePrompt = (text, mode) => {
				setPrompt((current) => mode === "append" && current.trim().length > 0 ? `${current.replace(/\s+$/, "")}\n${text}` : text);
				setPickerOpen(false);
				requestAnimationFrame(() => {
					const area = promptRef.current;
					if (area === null) return;
					area.focus();
					area.setSelectionRange(area.value.length, area.value.length);
				});
			};
			const [composerCap, setComposerCap] = (0, react.useState)(loadComposerCap);
			(0, react.useLayoutEffect)(() => {
				const area = promptRef.current;
				if (area === null) return;
				const max = Math.round(window.innerHeight * .7);
				if (composerCap !== null) {
					area.style.height = `${String(Math.min(Math.max(composerCap, COMPOSER_MIN), max))}px`;
					return;
				}
				area.style.height = "auto";
				area.style.height = `${String(Math.min(Math.max(area.scrollHeight, COMPOSER_MIN), defaultComposerCap()))}px`;
			}, [prompt, composerCap]);
			/** Drag the grip above the prompt box to change its height cap. */
			const startResize = (event) => {
				const area = promptRef.current;
				if (area === null) return;
				event.preventDefault();
				const startY = event.clientY;
				const startHeight = area.getBoundingClientRect().height;
				const max = Math.round(window.innerHeight * .7);
				let next = startHeight;
				const onMove = (move) => {
					next = Math.min(max, Math.max(COMPOSER_MIN, startHeight + (startY - move.clientY)));
					area.style.height = `${String(next)}px`;
				};
				const onUp = () => {
					window.removeEventListener("pointermove", onMove);
					window.removeEventListener("pointerup", onUp);
					setComposerCap(next);
					saveComposerCap(next);
				};
				window.addEventListener("pointermove", onMove);
				window.addEventListener("pointerup", onUp);
			};
			const provider = providers.find((entry) => entry.id === params.providerId) ?? providers.find((entry) => entry.id === settings?.activeProvider) ?? providers[0];
			const caps = provider === void 0 ? void 0 : capabilitiesOf(provider);
			const resolution = {
				...DEFAULT_RESOLUTION,
				...provider === void 0 ? {} : params.sizes[provider.id]
			};
			const setResolution = (next) => {
				if (provider === void 0) return;
				setParams((current) => ({
					...current,
					sizes: {
						...current.sizes,
						[provider.id]: next
					}
				}));
			};
			const freeRatio = resolution.res === "custom" && !resolution.lock && caps?.customSize !== void 0;
			const model = provider === void 0 ? "" : params.providerId === provider.id && params.model.length > 0 ? params.model : effectiveModel(provider);
			(0, react.useEffect)(() => {
				saveParams(params);
			}, [params]);
			(0, react.useEffect)(() => {
				const injected = props.injected;
				if (injected === null) return;
				if (injected.text !== void 0) setPrompt(injected.text);
				if (injected.reference !== void 0) addReference(injected.reference);
			}, [props.injected]);
			const update = (patch) => setParams((current) => ({
				...current,
				...patch
			}));
			const selectProvider = (id) => {
				const next = providers.find((entry) => entry.id === id);
				update({
					providerId: id,
					model: next === void 0 ? "" : effectiveModel(next),
					tier: ""
				});
			};
			const boardItems = currentBatch.length > 0 ? currentBatch : history.filter((item) => item.id === selectedId);
			const selected = boardItems.find((item) => item.id === selectedId) ?? boardItems[0];
			const addReferenceFiles = async (files) => {
				const images = files.filter((file) => file.type.startsWith("image/"));
				if (images.length === 0) return;
				if (caps === void 0 || caps.maxReferences === 0) {
					props.onError(t("referencesUnsupported"));
					return;
				}
				try {
					const uploaded = await uploadFiles(images, settings?.imageLimits);
					setReferences((current) => [...current, ...uploaded].slice(-caps.maxReferences));
				} catch (failure) {
					props.onError(failure instanceof Error ? failure.message : String(failure));
				}
			};
			const addReference = (attachment) => {
				if (caps === void 0 || caps.maxReferences === 0) {
					props.onError(t("referencesUnsupported"));
					return;
				}
				setReferences((current) => [...current.filter((ref) => ref.attachmentId !== attachment.attachmentId), attachment].slice(-caps.maxReferences));
			};
			const generate = async () => {
				const text = prompt.trim();
				if (text.length === 0 || provider === void 0 || busy !== null) return;
				const count = Math.min(params.count, caps?.maxCount ?? 1);
				const tier = caps?.tiers.includes(params.tier) === true ? params.tier : caps?.tiers[0];
				const seed = Number(params.seed);
				const size = explicitSize(caps, params.ratio, resolution);
				await startJob({
					providerId: provider.id,
					...model.length > 0 ? { model } : {},
					prompt: text,
					...params.negative.trim().length > 0 ? { negativePrompt: params.negative.trim() } : {},
					...caps !== void 0 && caps.ratios.includes(params.ratio) ? { aspectRatio: params.ratio } : {},
					...tier === void 0 ? {} : { imageSize: tier },
					...size === void 0 ? {} : { size },
					...(provider.protocol === "openai" || provider.protocol === "openai-compat") && params.quality !== "auto" ? { quality: params.quality } : {},
					...params.seed.trim().length > 0 && Number.isSafeInteger(seed) ? { seed } : {},
					count,
					references,
					projectId
				}, { describeFailures: (failures) => t("failedN", {
					n: failures.length,
					error: failures[0] ?? ""
				}) });
			};
			/** Back to an empty canvas with a fresh composer (the running job, if any, keeps going). */
			const newCanvas = () => {
				clearBoard(projectId);
				setDraft({
					prompt: "",
					references: []
				});
				setLightbox(null);
				promptRef.current?.focus();
			};
			/** Deselect: empty canvas, keep the draft. */
			const deselect = () => updateBoard(projectId, {
				batch: [],
				selectedId: null
			});
			const act = {
				download: (item) => {
					downloadImage(item.attachment, `copylee-image-${item.id.slice(0, 8)}`).catch((failure) => props.onError(String(failure)));
				},
				copy: (item) => {
					copyImage(item.attachment).then(() => props.toast(t("copied")), (failure) => props.onError(failure instanceof Error ? failure.message : String(failure)));
				},
				favorite: (item) => {
					api.gallery.update([item.id], { favorite: !item.favorite }).then(() => {
						setCurrentBatch((batch) => batch.map((entry) => entry.id === item.id ? {
							...entry,
							favorite: !item.favorite
						} : entry));
						props.onGalleryChanged();
					});
				},
				reveal: (item) => {
					api.gallery.reveal(item.id).then((result) => props.toast(t("revealedAt", { path: result.path })), (failure) => props.onError(failure instanceof Error ? failure.message : String(failure)));
				},
				remove: (item) => {
					api.gallery.remove([item.id]).then(() => {
						setCurrentBatch((batch) => batch.filter((entry) => entry.id !== item.id));
						if (selectedId === item.id) setSelectedId(null);
						props.onGalleryChanged();
					});
				}
			};
			const lightboxItems = currentBatch.length > 0 ? currentBatch : [...history];
			/** Show a history image; clicking the one already shown deselects it. */
			const pickHistory = (id) => {
				if (busy === null && selected?.id === id) deselect();
				else updateBoard(projectId, {
					batch: [],
					selectedId: id
				});
			};
			return (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
				(0, react_jsx_runtime.jsxs)("aside", {
					className: "dig-side",
					children: [props.sideTop, (0, react_jsx_runtime.jsx)("div", {
						className: "dig-params dig-scroll",
						children: providers.length === 0 ? (0, react_jsx_runtime.jsxs)("div", {
							className: "dig-notice",
							children: [(0, react_jsx_runtime.jsx)("p", {
								style: { margin: "0 0 8px" },
								children: t("noProviders")
							}), (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: "dig-btn dig-btn-sm",
								onClick: props.onOpenSettings,
								children: t("openSettings")
							})]
						}) : (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
							(0, react_jsx_runtime.jsxs)("div", {
								className: "dig-field",
								children: [(0, react_jsx_runtime.jsx)("label", {
									className: "dig-label",
									htmlFor: "dig-provider",
									children: t("provider")
								}), (0, react_jsx_runtime.jsx)(Select, {
									id: "dig-provider",
									label: t("provider"),
									value: provider?.id ?? "",
									options: providers.map((entry) => ({
										value: entry.id,
										label: entry.name,
										...entry.preset === true ? {} : { detail: PROTOCOL_LABELS[entry.protocol] }
									})),
									onChange: selectProvider
								})]
							}),
							(0, react_jsx_runtime.jsxs)("div", {
								className: "dig-field",
								children: [(0, react_jsx_runtime.jsx)("label", {
									className: "dig-label",
									htmlFor: "dig-model",
									children: t("model")
								}), (0, react_jsx_runtime.jsx)(Select, {
									id: "dig-model",
									label: t("model"),
									editable: true,
									editablePlaceholder: t("modelFilter"),
									value: model,
									options: (provider === void 0 ? [] : provider.models.includes(model) || model.length === 0 ? provider.models : [model, ...provider.models]).map((id) => ({
										value: id,
										label: id
									})),
									onChange: (next) => update({
										providerId: provider?.id ?? "",
										model: next
									})
								})]
							}),
							caps !== void 0 && caps.ratios.length > 0 && (0, react_jsx_runtime.jsxs)("div", {
								className: "dig-field",
								children: [(0, react_jsx_runtime.jsx)("span", {
									className: "dig-label",
									children: t("ratio")
								}), (0, react_jsx_runtime.jsx)("div", {
									className: "dig-chips",
									role: "group",
									"aria-label": t("ratio"),
									children: caps.ratios.map((ratio) => (0, react_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "dig-chip",
										"aria-pressed": !freeRatio && params.ratio === ratio,
										onClick: () => {
											update({ ratio });
											if (resolution.res === "custom" && caps.customSize !== void 0) {
												const fitted = sizeForRatio(ratio, Math.max(resolution.w, resolution.h), caps.customSize.step, caps.customSize);
												setResolution({
													...resolution,
													lock: true,
													w: fitted.width,
													h: fitted.height
												});
											}
										},
										children: [(0, react_jsx_runtime.jsx)(RatioGlyph, { ratio }), ratio]
									}, ratio))
								})]
							}),
							caps !== void 0 && caps.tiers.length > 0 && (0, react_jsx_runtime.jsxs)("div", {
								className: "dig-field",
								children: [(0, react_jsx_runtime.jsx)("span", {
									className: "dig-label",
									children: t("resolution")
								}), (0, react_jsx_runtime.jsx)("div", {
									className: "dig-chips",
									role: "group",
									"aria-label": t("resolution"),
									children: caps.tiers.map((tier) => (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: "dig-chip",
										"aria-pressed": (caps.tiers.includes(params.tier) ? params.tier : caps.tiers[0]) === tier,
										onClick: () => update({ tier }),
										children: tier
									}, tier))
								})]
							}),
							caps?.customSize !== void 0 && (0, react_jsx_runtime.jsx)(ResolutionPicker, {
								t,
								caps,
								ratio: caps.ratios.includes(params.ratio) ? params.ratio : caps.ratios[0] ?? "1:1",
								value: resolution,
								onChange: setResolution
							}),
							(provider?.protocol === "openai" || provider?.protocol === "openai-compat") && (0, react_jsx_runtime.jsxs)("div", {
								className: "dig-field",
								children: [(0, react_jsx_runtime.jsx)("span", {
									className: "dig-label",
									children: t("quality")
								}), (0, react_jsx_runtime.jsx)("div", {
									className: "dig-chips",
									role: "group",
									"aria-label": t("quality"),
									children: QUALITIES.map((quality) => (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: "dig-chip",
										"aria-pressed": params.quality === quality,
										onClick: () => update({ quality }),
										children: quality
									}, quality))
								})]
							}),
							(0, react_jsx_runtime.jsxs)("div", {
								className: "dig-field",
								children: [(0, react_jsx_runtime.jsx)("span", {
									className: "dig-label",
									children: t("count")
								}), (0, react_jsx_runtime.jsx)("div", {
									className: "dig-chips",
									role: "group",
									"aria-label": t("count"),
									children: Array.from({ length: caps?.maxCount ?? 1 }, (_, index) => index + 1).map((count) => (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: "dig-chip",
										"aria-pressed": params.count === count,
										onClick: () => update({ count }),
										children: count
									}, count))
								})]
							}),
							(provider?.protocol === "modelscope" || provider?.protocol === "siliconflow") && (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [(0, react_jsx_runtime.jsxs)("div", {
								className: "dig-field",
								children: [(0, react_jsx_runtime.jsx)("label", {
									className: "dig-label",
									htmlFor: "dig-negative",
									children: t("negativePrompt")
								}), (0, react_jsx_runtime.jsx)("textarea", {
									id: "dig-negative",
									className: "dig-textarea",
									rows: 2,
									value: params.negative,
									onChange: (event) => update({ negative: event.target.value })
								})]
							}), (0, react_jsx_runtime.jsxs)("div", {
								className: "dig-field",
								children: [(0, react_jsx_runtime.jsx)("label", {
									className: "dig-label",
									htmlFor: "dig-seed",
									children: t("seed")
								}), (0, react_jsx_runtime.jsx)("input", {
									id: "dig-seed",
									className: "dig-input",
									inputMode: "numeric",
									placeholder: t("seedHint"),
									value: params.seed,
									onChange: (event) => update({ seed: event.target.value.replace(/[^0-9]/g, "") })
								})]
							})] }),
							(0, react_jsx_runtime.jsxs)("div", {
								className: "dig-field",
								children: [(0, react_jsx_runtime.jsxs)("span", {
									className: "dig-label",
									children: [t("references"), caps !== void 0 && caps.maxReferences > 0 ? (0, react_jsx_runtime.jsxs)("span", {
										className: "dig-hint",
										children: ["≤ ", caps.maxReferences]
									}) : null]
								}), caps !== void 0 && caps.maxReferences === 0 ? (0, react_jsx_runtime.jsx)("span", {
									className: "dig-hint",
									children: t("referencesUnsupported")
								}) : (0, react_jsx_runtime.jsxs)("div", {
									className: "dig-refs",
									children: [
										references.map((ref) => (0, react_jsx_runtime.jsxs)("div", {
											className: "dig-ref",
											children: [(0, react_jsx_runtime.jsx)("img", {
												src: imageUrl(ref),
												alt: ""
											}), (0, react_jsx_runtime.jsx)("button", {
												type: "button",
												"aria-label": t("delete"),
												onClick: () => setReferences((current) => current.filter((entry) => entry.attachmentId !== ref.attachmentId)),
												children: (0, react_jsx_runtime.jsx)(X, { size: 12 })
											})]
										}, ref.attachmentId)),
										(0, react_jsx_runtime.jsx)("button", {
											type: "button",
											className: "dig-ref",
											style: {
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												cursor: "pointer",
												color: "var(--dig-fg3)"
											},
											title: t("addReference"),
											"aria-label": t("addReference"),
											onClick: () => fileInput.current?.click(),
											children: (0, react_jsx_runtime.jsx)(ImagePlus, { size: 18 })
										}),
										(0, react_jsx_runtime.jsx)("input", {
											ref: fileInput,
											type: "file",
											accept: "image/*",
											multiple: true,
											hidden: true,
											onChange: (event) => {
												addReferenceFiles([...event.target.files ?? []]);
												event.target.value = "";
											}
										})
									]
								})]
							})
						] })
					})]
				}),
				(0, react_jsx_runtime.jsxs)("section", {
					className: "dig-center",
					onDragOver: (event) => {
						if (event.dataTransfer.types.includes("Files")) event.preventDefault();
					},
					onDrop: (event) => {
						if (event.dataTransfer.files.length === 0) return;
						event.preventDefault();
						addReferenceFiles([...event.dataTransfer.files]);
					},
					children: [
						(0, react_jsx_runtime.jsxs)("div", {
							className: "dig-board",
							tabIndex: -1,
							onKeyDown: (event) => {
								if (event.key === "Escape" && lightbox === null && !pickerOpen && selected !== void 0) {
									event.preventDefault();
									deselect();
								}
							},
							children: [busy !== null ? (0, react_jsx_runtime.jsx)("div", {
								className: "dig-board-grid",
								style: busy.count === 1 ? {
									gridTemplateColumns: "minmax(0,1fr)",
									maxWidth: 520,
									maxHeight: 520
								} : void 0,
								children: Array.from({ length: busy.count }, (_, index) => (0, react_jsx_runtime.jsx)("div", {
									className: "dig-board-cell dig-skeleton",
									children: index === 0 && (0, react_jsx_runtime.jsxs)("div", {
										className: "dig-busy",
										children: [
											(0, react_jsx_runtime.jsx)(LoaderCircle, {
												size: 22,
												className: "dig-spin"
											}),
											t("generating"),
											(0, react_jsx_runtime.jsx)("span", {
												className: "dig-hint",
												children: t("elapsed", { s: Math.max(0, Math.round((now - busy.startedAt) / 1e3)) })
											})
										]
									})
								}, index))
							}) : selected === void 0 ? (0, react_jsx_runtime.jsxs)("div", {
								className: "dig-board-empty",
								children: [(0, react_jsx_runtime.jsx)(Palette, {
									size: 40,
									strokeWidth: 1.4
								}), (0, react_jsx_runtime.jsx)("div", { children: t("emptyCanvas") })]
							}) : boardItems.length > 1 ? (0, react_jsx_runtime.jsx)("div", {
								className: "dig-board-grid",
								children: boardItems.map((item, index) => (0, react_jsx_runtime.jsx)("div", {
									className: "dig-board-cell",
									"aria-current": item.id === selected.id,
									onClick: () => setSelectedId(item.id),
									onDoubleClick: () => setLightbox(index),
									children: (0, react_jsx_runtime.jsx)("img", {
										src: imageUrl(item.attachment),
										alt: item.prompt
									})
								}, item.id))
							}) : (0, react_jsx_runtime.jsx)("img", {
								className: "dig-board-img",
								src: imageUrl(selected.attachment),
								alt: selected.prompt,
								onClick: () => setLightbox(Math.max(0, lightboxItems.findIndex((item) => item.id === selected.id)))
							}), busy === null && selected !== void 0 && (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [(0, react_jsx_runtime.jsxs)("div", {
								className: "dig-board-tools",
								children: [
									(0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: "dig-icon-btn",
										title: t("useAsReference"),
										onClick: () => addReference(selected.attachment),
										children: (0, react_jsx_runtime.jsx)(ImagePlus, { size: 16 })
									}),
									(0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: "dig-icon-btn",
										title: selected.favorite ? t("unfavorite") : t("favorite"),
										"aria-pressed": selected.favorite,
										onClick: () => act.favorite(selected),
										children: (0, react_jsx_runtime.jsx)(Star, {
											size: 16,
											fill: selected.favorite ? "#f5a623" : "none"
										})
									}),
									(0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: "dig-icon-btn",
										title: t("copy"),
										onClick: () => act.copy(selected),
										children: (0, react_jsx_runtime.jsx)(Copy, { size: 16 })
									}),
									(0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: "dig-icon-btn",
										title: t("download"),
										onClick: () => act.download(selected),
										children: (0, react_jsx_runtime.jsx)(Download, { size: 16 })
									}),
									(0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: "dig-icon-btn",
										title: t("revealInFolder"),
										onClick: () => act.reveal(selected),
										children: (0, react_jsx_runtime.jsx)(FolderOpen, { size: 16 })
									}),
									(0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: "dig-icon-btn",
										title: "Zoom",
										onClick: () => setLightbox(Math.max(0, lightboxItems.findIndex((item) => item.id === selected.id))),
										children: (0, react_jsx_runtime.jsx)(Maximize2, { size: 16 })
									}),
									(0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: "dig-icon-btn",
										title: t("delete"),
										onClick: () => act.remove(selected),
										children: (0, react_jsx_runtime.jsx)(Trash, { size: 16 })
									})
								]
							}), (0, react_jsx_runtime.jsxs)("div", {
								className: "dig-board-meta",
								title: selected.prompt,
								children: [
									selected.providerName ?? selected.providerId,
									" · ",
									selected.model,
									" · ",
									selected.attachment.width,
									"×",
									selected.attachment.height
								]
							})] })]
						}),
						error !== null && (0, react_jsx_runtime.jsxs)("div", {
							className: "dig-error dig-board-error",
							role: "alert",
							children: [(0, react_jsx_runtime.jsx)("span", {
								className: "dig-board-error-text",
								children: error
							}), (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: "dig-icon-btn",
								title: t("dismiss"),
								"aria-label": t("dismiss"),
								onClick: () => updateBoard(projectId, { error: null }),
								children: (0, react_jsx_runtime.jsx)(X, { size: 14 })
							})]
						}),
						(0, react_jsx_runtime.jsxs)("div", {
							className: "dig-composer",
							ref: composerRef,
							children: [
								(0, react_jsx_runtime.jsx)("div", {
									className: "dig-composer-grip",
									role: "separator",
									"aria-orientation": "horizontal",
									"aria-label": t("resizeComposer"),
									title: t("resizeComposer"),
									tabIndex: 0,
									onPointerDown: startResize,
									onDoubleClick: () => {
										setComposerCap(null);
										saveComposerCap(null);
									},
									onKeyDown: (event) => {
										if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
										event.preventDefault();
										const current = promptRef.current?.getBoundingClientRect().height ?? COMPOSER_MIN;
										const next = Math.min(Math.round(window.innerHeight * .7), Math.max(COMPOSER_MIN, current + (event.key === "ArrowUp" ? 24 : -24)));
										setComposerCap(next);
										saveComposerCap(next);
									}
								}),
								references.length > 0 && (0, react_jsx_runtime.jsx)("div", {
									className: "dig-refs",
									children: references.map((ref) => (0, react_jsx_runtime.jsxs)("div", {
										className: "dig-ref",
										style: {
											width: 40,
											height: 40
										},
										children: [(0, react_jsx_runtime.jsx)("img", {
											src: imageUrl(ref),
											alt: ""
										}), (0, react_jsx_runtime.jsx)("button", {
											type: "button",
											"aria-label": t("delete"),
											onClick: () => setReferences((current) => current.filter((entry) => entry.attachmentId !== ref.attachmentId)),
											children: (0, react_jsx_runtime.jsx)(X, { size: 10 })
										})]
									}, ref.attachmentId))
								}),
								(0, react_jsx_runtime.jsx)("textarea", {
									ref: promptRef,
									value: prompt,
									placeholder: t("promptPlaceholder"),
									rows: 3,
									onChange: (event) => setPrompt(event.target.value),
									onPaste: (event) => {
										const files = [...event.clipboardData.files].filter((file) => file.type.startsWith("image/"));
										if (files.length > 0) {
											event.preventDefault();
											addReferenceFiles(files);
										}
									},
									onKeyDown: (event) => {
										if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
											event.preventDefault();
											generate();
										} else if (event.key === "/" && prompt.length === 0 || event.key.toLowerCase() === "k" && (event.ctrlKey || event.metaKey)) {
											event.preventDefault();
											setPickerOpen(true);
										}
									}
								}),
								(0, react_jsx_runtime.jsxs)("div", {
									className: "dig-composer-row",
									children: [
										(0, react_jsx_runtime.jsx)("button", {
											type: "button",
											className: "dig-icon-btn",
											title: t("addReference"),
											disabled: caps === void 0 || caps.maxReferences === 0,
											onClick: () => fileInput.current?.click(),
											children: (0, react_jsx_runtime.jsx)(ImagePlus, { size: 16 })
										}),
										(0, react_jsx_runtime.jsx)("button", {
											type: "button",
											className: "dig-icon-btn dig-bookmark-btn",
											title: t("openPromptPicker"),
											"aria-label": t("openPromptPicker"),
											"aria-expanded": pickerOpen,
											"aria-pressed": promptSaved,
											onClick: () => setPickerOpen((open) => !open),
											children: (0, react_jsx_runtime.jsx)(Bookmark, {
												size: 16,
												fill: promptSaved ? "currentColor" : "none"
											})
										}),
										(0, react_jsx_runtime.jsx)("button", {
											type: "button",
											className: "dig-icon-btn",
											title: t("clearPrompt"),
											"aria-label": t("clearPrompt"),
											disabled: prompt.length === 0,
											onClick: () => {
												setPrompt("");
												promptRef.current?.focus();
											},
											children: (0, react_jsx_runtime.jsx)(Eraser, { size: 16 })
										}),
										(0, react_jsx_runtime.jsx)("span", { className: "dig-spacer" }),
										busy !== null ? (0, react_jsx_runtime.jsxs)("button", {
											type: "button",
											className: "dig-btn",
											onClick: () => stopJob(projectId),
											children: [(0, react_jsx_runtime.jsx)(Square, {
												size: 12,
												fill: "currentColor"
											}), t("stop")]
										}) : (0, react_jsx_runtime.jsxs)("button", {
											type: "button",
											className: "dig-btn dig-btn-primary",
											disabled: prompt.trim().length === 0 || provider === void 0,
											onClick: () => {
												generate();
											},
											children: [(0, react_jsx_runtime.jsx)(Sparkles, { size: 14 }), t("generate")]
										})
									]
								})
							]
						})
					]
				}),
				(0, react_jsx_runtime.jsxs)("aside", {
					className: "dig-history",
					"aria-label": t("history"),
					children: [
						(0, react_jsx_runtime.jsxs)("div", {
							className: "dig-section-title",
							style: { padding: "12px 14px 4px" },
							children: [(0, react_jsx_runtime.jsx)("span", { children: t("history") }), (0, react_jsx_runtime.jsx)("span", { children: history.length })]
						}),
						(0, react_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "dig-btn dig-btn-sm dig-new-canvas",
							title: t("newCanvasHint"),
							onClick: newCanvas,
							children: [(0, react_jsx_runtime.jsx)(Plus, { size: 14 }), t("newCanvas")]
						}),
						(0, react_jsx_runtime.jsx)("div", {
							className: "dig-history-list dig-scroll",
							children: history.map((item) => (0, react_jsx_runtime.jsxs)("div", {
								className: "dig-thumb",
								role: "button",
								tabIndex: 0,
								title: item.prompt,
								"aria-current": selected?.id === item.id,
								onClick: () => pickHistory(item.id),
								onKeyDown: (event) => {
									if (event.key === "Enter") pickHistory(item.id);
								},
								children: [(0, react_jsx_runtime.jsx)("img", {
									src: imageUrl(item.attachment),
									alt: "",
									loading: "lazy"
								}), (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: "dig-thumb-del",
									"aria-label": t("delete"),
									onClick: (event) => {
										event.stopPropagation();
										act.remove(item);
									},
									children: (0, react_jsx_runtime.jsx)(X, { size: 12 })
								})]
							}, item.id))
						})
					]
				}),
				pickerOpen && composerRef.current !== null && (0, react_jsx_runtime.jsx)(PromptPicker, {
					t,
					anchor: composerRef.current,
					prompt,
					prompts: savedPrompts,
					onReload: reloadPrompts,
					onUse: usePrompt,
					onClose: () => setPickerOpen(false),
					onError: props.onError
				}),
				lightbox !== null && (0, react_jsx_runtime.jsx)(Lightbox, {
					items: lightboxItems,
					index: lightbox,
					onIndex: setLightbox,
					onClose: () => setLightbox(null),
					t,
					actions: {
						onDownload: act.download,
						onReveal: act.reveal,
						onCopy: act.copy,
						onFavorite: act.favorite,
						onDelete: (item) => {
							act.remove(item);
							setLightbox(null);
						},
						onUseAsReference: (item) => {
							addReference(item.attachment);
							setLightbox(null);
						},
						onReusePrompt: (item) => {
							setPrompt(item.prompt);
							setLightbox(null);
						}
					}
				})
			] });
		}
		//#endregion
		//#region lib/types/client/accent.js
		/**
		* The accent colour shared by the copylee DSH plugins (docs/ui-spec.md).
		*
		* One choice — terracotta orange by default, blue or black — is kept in the
		* browser under a key every plugin reads, and painted as two CSS variables on
		* `<body>`, where the Host keeps its own theme variables. A plugin's styles
		* only ever write `var(--cl-accent)` / `var(--cl-accent-ink)`, so changing the
		* colour in any plugin's settings recolours all of them at once.
		*
		* This file is identical in every plugin; change it in all of them together.
		*/
		const ACCENTS = {
			orange: {
				name: "陶土橙",
				accent: "#D97757",
				ink: "#FFFFFF"
			},
			blue: {
				name: "蓝色",
				accent: "#3D63E6",
				ink: "#FFFFFF"
			},
			black: {
				name: "黑色",
				accent: "var(--dsw-alias-label-primary, #1F1E1D)",
				ink: "var(--dsw-alias-bg-base, #FFFFFF)"
			}
		};
		const ACCENT_IDS = Object.keys(ACCENTS);
		const DEFAULT_ACCENT = "orange";
		`${ACCENTS[DEFAULT_ACCENT].accent}`;
		`${ACCENTS[DEFAULT_ACCENT].ink}`;
		const KEY = "copylee.dsh.accent";
		const EVENT = "copylee-dsh-accent";
		function isAccent(value) {
			return typeof value === "string" && Object.hasOwn(ACCENTS, value);
		}
		/** The choice made in this browser, or null while none has been made. */
		function storedAccent() {
			try {
				const stored = localStorage.getItem(KEY);
				return isAccent(stored) ? stored : null;
			} catch {
				return null;
			}
		}
		function readAccent() {
			return storedAccent() ?? "orange";
		}
		function paint() {
			const colors = ACCENTS[readAccent()];
			document.body?.style.setProperty("--cl-accent", colors.accent);
			document.body?.style.setProperty("--cl-accent-ink", colors.ink);
		}
		/** Choose the accent for every plugin. */
		function writeAccent(accent) {
			try {
				localStorage.setItem(KEY, accent);
			} catch {}
			paint();
			window.dispatchEvent(new Event(EVENT));
		}
		/** Paint the current accent and keep it current. Returns the undo for plugin disposal. */
		function installAccent() {
			if (typeof document === "undefined") return () => {};
			paint();
			if (document.body === null) document.addEventListener("DOMContentLoaded", paint, { once: true });
			window.addEventListener(EVENT, paint);
			window.addEventListener("storage", paint);
			return () => {
				window.removeEventListener(EVENT, paint);
				window.removeEventListener("storage", paint);
			};
		}
		function useAccent() {
			const [accent, setAccent] = react.useState(readAccent);
			react.useEffect(() => {
				const sync = () => setAccent(readAccent());
				window.addEventListener(EVENT, sync);
				window.addEventListener("storage", sync);
				return () => {
					window.removeEventListener(EVENT, sync);
					window.removeEventListener("storage", sync);
				};
			}, []);
			return [accent, writeAccent];
		}
		/** A row of round swatches: one of them is always chosen. */
		function AccentPicker({ label = "强调色", hint = "", names }) {
			const [accent, choose] = useAccent();
			const h = react.createElement;
			const name = (id) => names?.[id] ?? ACCENTS[id].name;
			return h("div", { style: {
				display: "flex",
				alignItems: "center",
				gap: 10,
				fontSize: 13,
				flexWrap: "wrap"
			} }, h("span", { style: { fontWeight: 500 } }, label), h("span", {
				role: "radiogroup",
				"aria-label": label,
				style: {
					display: "inline-flex",
					gap: 8
				}
			}, ...ACCENT_IDS.map((id) => h("button", {
				key: id,
				type: "button",
				role: "radio",
				"aria-checked": accent === id,
				"aria-label": name(id),
				title: name(id),
				onClick: () => choose(id),
				style: {
					width: 18,
					height: 18,
					padding: 0,
					borderRadius: "50%",
					cursor: "pointer",
					background: ACCENTS[id].accent,
					border: "2px solid var(--dsw-alias-bg-base, #fff)",
					boxShadow: accent === id ? "0 0 0 2px var(--dsw-alias-label-primary, #1F1E1D)" : "0 0 0 1px var(--dsw-alias-border-l2, rgba(127,127,127,.35))"
				}
			}))), h("span", { style: {
				fontSize: 12,
				color: "var(--dsw-alias-label-tertiary, #888)"
			} }, hint ? `${name(accent)} · ${hint}` : name(accent)));
		}
		//#endregion
		//#region lib/types/client/model-list.js
		/**
		* Provider model list: one row per model with a “默认” toggle and a delete
		* button, an add row, and a fetch-and-pick dialog (providers such as
		* SiliconFlow list hundreds of models, so fetched ids are chosen, not merged).
		*/
		function ModelList({ t, models, defaultModel, onChange, onFetch, fetchDisabled }) {
			const [draft, setDraft] = (0, react.useState)("");
			const [fetching, setFetching] = (0, react.useState)(false);
			const [fetchError, setFetchError] = (0, react.useState)(null);
			const [picker, setPicker] = (0, react.useState)(null);
			const effectiveDefault = defaultModel.length > 0 && models.includes(defaultModel) ? defaultModel : models[0] ?? "";
			const add = (ids) => {
				const next = [...models];
				for (const raw of ids) {
					const id = raw.trim();
					if (id.length > 0 && !next.includes(id)) next.push(id);
				}
				onChange({
					models: next,
					defaultModel: defaultModel.length > 0 ? defaultModel : next[0] ?? ""
				});
			};
			const remove = (id) => {
				const next = models.filter((model) => model !== id);
				onChange({
					models: next,
					defaultModel: defaultModel === id ? next[0] ?? "" : defaultModel
				});
			};
			const submitDraft = () => {
				if (draft.trim().length === 0) return;
				add(draft.split(/[\n,]+/));
				setDraft("");
			};
			const fetchModels = async () => {
				setFetching(true);
				setFetchError(null);
				try {
					setPicker(await onFetch());
				} catch (error) {
					setFetchError(error instanceof Error ? error.message : String(error));
				} finally {
					setFetching(false);
				}
			};
			return (0, react_jsx_runtime.jsxs)("div", {
				className: "dig-field",
				children: [
					(0, react_jsx_runtime.jsxs)("span", {
						className: "dig-label",
						children: [(0, react_jsx_runtime.jsxs)("span", { children: [
							t("models"),
							" ",
							(0, react_jsx_runtime.jsxs)("span", {
								className: "dig-hint",
								children: [
									"(",
									models.length,
									")"
								]
							})
						] }), (0, react_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "dig-btn dig-btn-sm",
							disabled: fetching || fetchDisabled === true,
							onClick: () => {
								fetchModels();
							},
							children: [fetching ? (0, react_jsx_runtime.jsx)(LoaderCircle, {
								size: 13,
								className: "dig-spin"
							}) : (0, react_jsx_runtime.jsx)(RefreshCw, { size: 13 }), t("fetchModels")]
						})]
					}),
					(0, react_jsx_runtime.jsxs)("div", {
						className: "dig-models",
						role: "list",
						children: [
							models.length === 0 && (0, react_jsx_runtime.jsx)("div", {
								className: "dig-models-empty",
								children: t("noModels")
							}),
							models.map((model) => (0, react_jsx_runtime.jsxs)("div", {
								className: "dig-model-row",
								role: "listitem",
								children: [
									(0, react_jsx_runtime.jsx)("span", {
										className: "dig-model-id",
										title: model,
										children: model
									}),
									model === effectiveDefault ? (0, react_jsx_runtime.jsx)("span", {
										className: "dig-badge dig-badge-accent",
										children: t("defaultLabel")
									}) : (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: "dig-model-action",
										onClick: () => onChange({
											models: [...models],
											defaultModel: model
										}),
										children: t("setDefault")
									}),
									(0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: "dig-icon-btn dig-model-remove",
										"aria-label": `${t("delete")} ${model}`,
										onClick: () => remove(model),
										children: (0, react_jsx_runtime.jsx)(X, { size: 14 })
									})
								]
							}, model)),
							(0, react_jsx_runtime.jsxs)("div", {
								className: "dig-model-add",
								children: [(0, react_jsx_runtime.jsx)("input", {
									className: "dig-input",
									value: draft,
									placeholder: t("addModelPlaceholder"),
									onChange: (event) => setDraft(event.target.value),
									onKeyDown: (event) => {
										if (event.key === "Enter" && !event.nativeEvent.isComposing) {
											event.preventDefault();
											submitDraft();
										}
									}
								}), (0, react_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "dig-btn dig-btn-sm",
									disabled: draft.trim().length === 0,
									onClick: submitDraft,
									children: [(0, react_jsx_runtime.jsx)(Plus, { size: 13 }), t("add")]
								})]
							})
						]
					}),
					(0, react_jsx_runtime.jsx)("span", {
						className: "dig-hint",
						children: t("modelsHint")
					}),
					fetchError !== null && (0, react_jsx_runtime.jsx)("span", {
						className: "dig-test-result dig-test-fail",
						children: fetchError
					}),
					picker !== null && (0, react_jsx_runtime.jsx)(ModelPicker, {
						t,
						fetched: picker,
						existing: models,
						onClose: () => setPicker(null),
						onConfirm: (ids) => {
							add(ids);
							setPicker(null);
						}
					})
				]
			});
		}
		function ModelPicker({ t, fetched, existing, onClose, onConfirm }) {
			const [filter, setFilter] = (0, react.useState)(fetched.imageModels.length > 0 ? "image" : "all");
			const [query, setQuery] = (0, react.useState)("");
			const [chosen, setChosen] = (0, react.useState)(/* @__PURE__ */ new Set());
			const added = (0, react.useMemo)(() => new Set(existing), [existing]);
			const pool = filter === "image" ? fetched.imageModels : fetched.models;
			const visible = (0, react.useMemo)(() => {
				const needle = query.trim().toLowerCase();
				return needle.length === 0 ? pool : pool.filter((id) => id.toLowerCase().includes(needle));
			}, [pool, query]);
			const addedCount = fetched.models.filter((id) => added.has(id)).length;
			const toggle = (id) => setChosen((current) => {
				const next = new Set(current);
				if (next.has(id)) next.delete(id);
				else next.add(id);
				return next;
			});
			return (0, react_jsx_runtime.jsxs)(Modal, {
				title: t("fetchModels"),
				onClose,
				wide: true,
				actions: (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
					(0, react_jsx_runtime.jsx)("span", {
						className: "dig-hint",
						style: { marginRight: "auto" },
						children: t("selectedModels", { n: chosen.size })
					}),
					(0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: "dig-btn",
						onClick: onClose,
						children: t("cancel")
					}),
					(0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: "dig-btn dig-btn-primary",
						disabled: chosen.size === 0,
						onClick: () => onConfirm(fetched.models.filter((id) => chosen.has(id))),
						children: t("addSelected")
					})
				] }),
				children: [
					(0, react_jsx_runtime.jsx)("div", {
						className: "dig-hint",
						children: t("fetchedSummary", {
							total: fetched.models.length,
							image: fetched.imageModels.length,
							added: addedCount
						})
					}),
					(0, react_jsx_runtime.jsxs)("div", {
						className: "dig-row",
						style: { flexWrap: "wrap" },
						children: [
							(0, react_jsx_runtime.jsxs)("div", {
								className: "dig-chips",
								role: "radiogroup",
								"aria-label": t("modelFilterLabel"),
								children: [(0, react_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "dig-chip",
									role: "radio",
									"aria-checked": filter === "image",
									"aria-pressed": filter === "image",
									onClick: () => setFilter("image"),
									children: [
										t("imageModelsOnly"),
										" (",
										fetched.imageModels.length,
										")"
									]
								}), (0, react_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "dig-chip",
									role: "radio",
									"aria-checked": filter === "all",
									"aria-pressed": filter === "all",
									onClick: () => setFilter("all"),
									children: [
										t("all"),
										" (",
										fetched.models.length,
										")"
									]
								})]
							}),
							(0, react_jsx_runtime.jsxs)("div", {
								className: "dig-search",
								style: { maxWidth: "none" },
								children: [(0, react_jsx_runtime.jsx)(Search, { size: 14 }), (0, react_jsx_runtime.jsx)("input", {
									className: "dig-input",
									autoFocus: true,
									value: query,
									placeholder: t("searchModels"),
									onChange: (event) => setQuery(event.target.value)
								})]
							}),
							(0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: "dig-btn dig-btn-sm",
								onClick: () => setChosen(/* @__PURE__ */ new Set([...chosen, ...visible.filter((id) => !added.has(id))])),
								children: t("selectAll")
							}),
							(0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: "dig-btn dig-btn-sm",
								onClick: () => setChosen(/* @__PURE__ */ new Set()),
								children: t("clearSelection")
							})
						]
					}),
					(0, react_jsx_runtime.jsxs)("div", {
						className: "dig-pick-list dig-scroll",
						role: "listbox",
						"aria-multiselectable": "true",
						children: [visible.map((id) => {
							const isAdded = added.has(id);
							return (0, react_jsx_runtime.jsxs)("label", {
								className: isAdded ? "dig-pick-row dig-pick-added" : "dig-pick-row",
								role: "option",
								"aria-selected": isAdded || chosen.has(id),
								"aria-disabled": isAdded,
								children: [
									(0, react_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: isAdded || chosen.has(id),
										disabled: isAdded,
										onChange: () => toggle(id)
									}),
									(0, react_jsx_runtime.jsx)("span", {
										className: "dig-model-id",
										title: id,
										children: id
									}),
									isAdded && (0, react_jsx_runtime.jsx)("span", {
										className: "dig-badge",
										children: t("alreadyAdded")
									})
								]
							}, id);
						}), visible.length === 0 && (0, react_jsx_runtime.jsx)("div", {
							className: "dig-models-empty",
							children: fetched.models.length === 0 ? t("noModelsReturned") : filter === "image" && query.trim().length === 0 ? t("noImageModels") : "—"
						})]
					})
				]
			});
		}
		//#endregion
		//#region lib/types/client/settings-view.js
		/**
		* Settings: Cherry-Studio-style provider list + detail, global proxy and
		* storage. Used both as the DSH settings page and inside the paintings page.
		*/
		const GENERAL = "__general__";
		function stripView(view) {
			const { effectiveImageDir: _dir, ...rest } = view;
			return {
				...rest,
				providers: view.providers.map(({ keyConfigured: _ignored, ...entry }) => entry)
			};
		}
		function newProviderId(existing) {
			for (let index = 1;; index++) {
				const id = `custom-${String(index)}`;
				if (!existing.some((entry) => entry.id === id)) return id;
			}
		}
		function SettingsPanel({ t, onSaved }) {
			const [view, setView] = (0, react.useState)(null);
			const [draft, setDraft] = (0, react.useState)(null);
			const [selected, setSelected] = (0, react.useState)(GENERAL);
			const [error, setError] = (0, react.useState)(null);
			const [saving, setSaving] = (0, react.useState)(false);
			const [savedFlash, setSavedFlash] = (0, react.useState)(false);
			const [keyInput, setKeyInput] = (0, react.useState)("");
			const [test, setTest] = (0, react.useState)({ running: false });
			const [proxyTest, setProxyTest] = (0, react.useState)({ running: false });
			const [systemProxy, setSystemProxy] = (0, react.useState)({
				loading: true,
				system: null
			});
			const detectProxy = () => {
				setSystemProxy((current) => ({
					...current,
					loading: true
				}));
				api.proxyStatus().then((result) => setSystemProxy({
					loading: false,
					system: result.system
				}), () => setSystemProxy({
					loading: false,
					system: null
				}));
			};
			(0, react.useEffect)(detectProxy, []);
			const runProxyTest = (target) => {
				setProxyTest({ running: true });
				api.testProxy(target).then((result) => setProxyTest({
					running: false,
					ok: result.ok,
					message: result.latencyMs === void 0 ? result.message : `${result.message} · ${String(result.latencyMs)}ms`
				}), (failure) => setProxyTest({
					running: false,
					ok: false,
					message: String(failure)
				}));
			};
			const [confirmDelete, setConfirmDelete] = (0, react.useState)(null);
			const [sizesText, setSizesText] = (0, react.useState)("");
			const [sizesError, setSizesError] = (0, react.useState)(null);
			(0, react.useEffect)(() => {
				api.settings().then((next) => {
					setView(next);
					setDraft(stripView(next));
					setSelected((current) => current === GENERAL ? next.providers[0]?.id ?? GENERAL : current);
				}, (failure) => setError(failure instanceof Error ? failure.message : String(failure)));
			}, []);
			const entry = draft?.providers.find((candidate) => candidate.id === selected);
			const keyConfigured = view?.providers.find((candidate) => candidate.id === selected)?.keyConfigured === true;
			const dirty = (0, react.useMemo)(() => view !== null && draft !== null && JSON.stringify(stripView(view)) !== JSON.stringify(draft), [view, draft]);
			(0, react.useEffect)(() => {
				setKeyInput("");
				setTest({ running: false });
				setSizesText(entry?.compat?.sizes === void 0 || Object.keys(entry.compat.sizes).length === 0 ? "" : JSON.stringify(entry.compat.sizes, null, 2));
				setSizesError(null);
			}, [selected]);
			if (draft === null || view === null) return (0, react_jsx_runtime.jsx)("div", {
				className: "dig-root",
				style: { padding: 24 },
				children: error ?? (0, react_jsx_runtime.jsx)(LoaderCircle, {
					size: 18,
					className: "dig-spin"
				})
			});
			const systemLabel = () => systemProxy.system === null ? t("proxySystemMissing") : `${t("proxySystemShort")} ${systemProxy.system.url}`;
			/** Where a provider's requests actually go, for the hint under its proxy chips. */
			const routeLabel = (mode) => {
				if (mode === "direct") return t("proxyDirect");
				if (mode === "system") return systemLabel();
				if (draft.proxy.mode === "system") return systemLabel();
				if (draft.proxy.mode === "custom" && draft.proxy.url.length > 0) return draft.proxy.url;
				return t("proxyDirect");
			};
			const patchEntry = (patch) => {
				setDraft((current) => current === null ? current : {
					...current,
					providers: current.providers.map((candidate) => candidate.id === selected ? {
						...candidate,
						...patch
					} : candidate)
				});
			};
			const save = async (next = draft) => {
				setSaving(true);
				setError(null);
				try {
					const saved = await api.saveSettings(next);
					setView(saved);
					setDraft(stripView(saved));
					onSaved?.(saved);
					setSavedFlash(true);
					setTimeout(() => setSavedFlash(false), 1600);
				} catch (failure) {
					setError(failure instanceof Error ? failure.message : String(failure));
				} finally {
					setSaving(false);
				}
			};
			const refreshView = async () => {
				const next = await api.settings();
				setView((current) => current === null ? next : {
					...current,
					providers: current.providers.map((candidate) => ({
						...candidate,
						keyConfigured: next.providers.find((other) => other.id === candidate.id)?.keyConfigured ?? false
					}))
				});
				onSaved?.(next);
			};
			const saveKey = async (value) => {
				if (entry === void 0) return;
				setError(null);
				try {
					if (!view.providers.some((candidate) => candidate.id === entry.id)) await save();
					await api.setKey(entry.id, value);
					setKeyInput("");
					await refreshView();
				} catch (failure) {
					setError(failure instanceof Error ? failure.message : String(failure));
				}
			};
			const runTest = async () => {
				if (entry === void 0) return;
				setTest({ running: true });
				try {
					const result = await api.test({
						providerId: entry.id,
						entry,
						...keyInput.trim().length > 0 ? { key: keyInput.trim() } : {},
						proxy: draft.proxy
					});
					setTest({
						running: false,
						ok: result.ok,
						message: result.latencyMs === void 0 ? result.message : `${result.message} · ${String(result.latencyMs)}ms`
					});
				} catch (failure) {
					setTest({
						running: false,
						ok: false,
						message: failure instanceof Error ? failure.message : String(failure)
					});
				}
			};
			const addProvider = () => {
				const id = newProviderId(draft.providers);
				const created = {
					id,
					name: t("addProvider") === "添加服务商" ? `自定义服务商 ${id.slice(7)}` : `Custom ${id.slice(7)}`,
					protocol: "openai-compat",
					baseURL: "",
					models: [],
					defaultModel: "",
					enabled: true,
					proxy: { mode: "inherit" }
				};
				setDraft({
					...draft,
					providers: [...draft.providers, created]
				});
				setSelected(id);
			};
			return (0, react_jsx_runtime.jsxs)("div", {
				className: "dig-root dig-settings",
				children: [
					(0, react_jsx_runtime.jsxs)("nav", {
						className: "dig-settings-list",
						"aria-label": t("providers"),
						children: [
							(0, react_jsx_runtime.jsx)("div", {
								className: "dig-side-section",
								style: { paddingBottom: 0 },
								children: (0, react_jsx_runtime.jsxs)("div", {
									className: "dig-proj",
									role: "button",
									tabIndex: 0,
									"aria-current": selected === GENERAL,
									onClick: () => setSelected(GENERAL),
									onKeyDown: (event) => {
										if (event.key === "Enter") setSelected(GENERAL);
									},
									children: [(0, react_jsx_runtime.jsx)(Globe, { size: 15 }), (0, react_jsx_runtime.jsxs)("span", {
										className: "dig-proj-name",
										children: [
											t("globalProxy"),
											" / ",
											t("storage")
										]
									})]
								})
							}),
							(0, react_jsx_runtime.jsxs)("div", {
								className: "dig-section-title",
								style: { padding: "10px 18px 4px" },
								children: [(0, react_jsx_runtime.jsx)("span", { children: t("providers") }), (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: "dig-icon-btn",
									title: t("addProvider"),
									"aria-label": t("addProvider"),
									onClick: addProvider,
									children: (0, react_jsx_runtime.jsx)(Plus, { size: 15 })
								})]
							}),
							(0, react_jsx_runtime.jsx)("div", {
								className: "dig-scroll",
								style: {
									flex: 1,
									minHeight: 0,
									padding: "0 12px 12px"
								},
								children: draft.providers.map((candidate) => {
									const ready = view.providers.find((other) => other.id === candidate.id)?.keyConfigured === true;
									return (0, react_jsx_runtime.jsxs)("div", {
										className: "dig-proj",
										role: "button",
										tabIndex: 0,
										"aria-current": selected === candidate.id,
										onClick: () => setSelected(candidate.id),
										onKeyDown: (event) => {
											if (event.key === "Enter") setSelected(candidate.id);
										},
										children: [
											(0, react_jsx_runtime.jsx)("span", { className: ready && candidate.enabled ? "dig-dot dig-dot-ok" : "dig-dot" }),
											(0, react_jsx_runtime.jsx)("span", {
												className: "dig-proj-name",
												style: { opacity: candidate.enabled ? 1 : .5 },
												children: candidate.name
											}),
											candidate.id === draft.activeProvider && (0, react_jsx_runtime.jsx)("span", {
												className: "dig-badge",
												children: t("defaultLabel")
											})
										]
									}, candidate.id);
								})
							})
						]
					}),
					(0, react_jsx_runtime.jsxs)("div", {
						className: "dig-settings-detail dig-scroll",
						children: [
							selected === GENERAL || entry === void 0 ? (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
								(0, react_jsx_runtime.jsx)("h2", { children: t("globalProxy") }),
								(0, react_jsx_runtime.jsx)("p", {
									className: "dig-hint",
									style: { margin: 0 },
									children: t("globalProxyHint")
								}),
								(0, react_jsx_runtime.jsx)("div", {
									className: "dig-chips",
									role: "radiogroup",
									"aria-label": t("globalProxy"),
									children: [
										"off",
										"system",
										"custom"
									].map((mode) => (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: "dig-chip",
										role: "radio",
										"aria-checked": draft.proxy.mode === mode,
										"aria-pressed": draft.proxy.mode === mode,
										onClick: () => {
											setDraft({
												...draft,
												proxy: {
													...draft.proxy,
													mode,
													enabled: mode !== "off"
												}
											});
											setProxyTest({ running: false });
										},
										children: mode === "off" ? t("proxyOff") : mode === "system" ? t("proxySystem") : t("proxyCustom")
									}, mode))
								}),
								draft.proxy.mode === "system" && (0, react_jsx_runtime.jsxs)("div", {
									className: "dig-field",
									children: [(0, react_jsx_runtime.jsx)("div", {
										className: systemProxy.system === null && !systemProxy.loading ? "dig-notice dig-notice-warn" : "dig-notice",
										children: systemProxy.loading ? t("proxyDetecting") : systemProxy.system === null ? t("proxyNotFound") : t("proxyDetected", {
											url: systemProxy.system.url,
											source: systemProxy.system.source
										})
									}), (0, react_jsx_runtime.jsxs)("div", {
										className: "dig-row",
										children: [
											(0, react_jsx_runtime.jsx)("button", {
												type: "button",
												className: "dig-btn dig-btn-sm",
												disabled: systemProxy.loading,
												onClick: detectProxy,
												children: t("redetect")
											}),
											(0, react_jsx_runtime.jsx)("button", {
												type: "button",
												className: "dig-btn dig-btn-sm",
												disabled: systemProxy.system === null || proxyTest.running,
												onClick: () => runProxyTest("system"),
												children: proxyTest.running ? t("testing") : t("testProxy")
											}),
											proxyTest.message !== void 0 && (0, react_jsx_runtime.jsx)("span", {
												className: `dig-test-result ${proxyTest.ok === true ? "dig-test-ok" : "dig-test-fail"}`,
												children: proxyTest.message
											})
										]
									})]
								}),
								draft.proxy.mode === "custom" && (0, react_jsx_runtime.jsxs)("div", {
									className: "dig-field",
									children: [
										(0, react_jsx_runtime.jsx)("label", {
											className: "dig-label",
											htmlFor: "dig-proxy-url",
											children: t("proxyUrl")
										}),
										(0, react_jsx_runtime.jsxs)("div", {
											className: "dig-row",
											children: [(0, react_jsx_runtime.jsx)("input", {
												id: "dig-proxy-url",
												className: "dig-input",
												placeholder: "http://127.0.0.1:7890",
												value: draft.proxy.url,
												onChange: (event) => setDraft({
													...draft,
													proxy: {
														...draft.proxy,
														url: event.target.value
													}
												})
											}), (0, react_jsx_runtime.jsx)("button", {
												type: "button",
												className: "dig-btn dig-btn-sm",
												disabled: draft.proxy.url.trim().length === 0 || proxyTest.running,
												onClick: () => runProxyTest(draft.proxy.url.trim()),
												children: proxyTest.running ? t("testing") : t("testProxy")
											})]
										}),
										(0, react_jsx_runtime.jsx)("span", {
											className: "dig-hint",
											children: t("proxyUrlHint")
										}),
										proxyTest.message !== void 0 && (0, react_jsx_runtime.jsx)("span", {
											className: `dig-test-result ${proxyTest.ok === true ? "dig-test-ok" : "dig-test-fail"}`,
											children: proxyTest.message
										})
									]
								}),
								(0, react_jsx_runtime.jsxs)("div", {
									className: "dig-field",
									children: [
										(0, react_jsx_runtime.jsx)("label", {
											className: "dig-label",
											htmlFor: "dig-no-proxy",
											children: t("noProxy")
										}),
										(0, react_jsx_runtime.jsx)("input", {
											id: "dig-no-proxy",
											className: "dig-input",
											value: draft.proxy.noProxy.join(", "),
											onChange: (event) => setDraft({
												...draft,
												proxy: {
													...draft.proxy,
													noProxy: event.target.value.split(/[,\s]+/).filter((item) => item.length > 0)
												}
											})
										}),
										(0, react_jsx_runtime.jsx)("span", {
											className: "dig-hint",
											children: t("noProxyHint")
										})
									]
								}),
								(0, react_jsx_runtime.jsx)("div", { className: "dig-divider" }),
								(0, react_jsx_runtime.jsx)("h2", { children: t("conversation") }),
								(0, react_jsx_runtime.jsxs)("div", {
									className: "dig-field",
									children: [(0, react_jsx_runtime.jsxs)("div", {
										className: "dig-row",
										children: [(0, react_jsx_runtime.jsx)(Switch, {
											checked: draft.chatTools,
											label: t("chatTools"),
											onChange: (chatTools) => setDraft({
												...draft,
												chatTools
											})
										}), (0, react_jsx_runtime.jsx)("span", {
											style: { fontSize: 13 },
											children: t("chatTools")
										})]
									}), (0, react_jsx_runtime.jsx)("span", {
										className: "dig-hint",
										children: t("chatToolsHint")
									})]
								}),
								(0, react_jsx_runtime.jsx)("div", { className: "dig-divider" }),
								(0, react_jsx_runtime.jsx)("h2", { children: t("storage") }),
								(0, react_jsx_runtime.jsxs)("div", {
									className: "dig-row",
									children: [(0, react_jsx_runtime.jsx)(Switch, {
										checked: draft.saveToWorkspace,
										label: t("saveToWorkspace"),
										onChange: (saveToWorkspace) => setDraft({
											...draft,
											saveToWorkspace
										})
									}), (0, react_jsx_runtime.jsx)("span", {
										style: { fontSize: 13 },
										children: t("saveToWorkspace")
									})]
								}),
								(0, react_jsx_runtime.jsxs)("div", {
									className: "dig-field",
									children: [(0, react_jsx_runtime.jsx)("label", {
										className: "dig-label",
										htmlFor: "dig-ws-folder",
										children: t("workspaceFolder")
									}), (0, react_jsx_runtime.jsx)("input", {
										id: "dig-ws-folder",
										className: "dig-input",
										value: draft.workspaceFolder,
										disabled: !draft.saveToWorkspace,
										onChange: (event) => setDraft({
											...draft,
											workspaceFolder: event.target.value
										})
									})]
								}),
								(0, react_jsx_runtime.jsxs)("div", {
									className: "dig-field",
									children: [
										(0, react_jsx_runtime.jsx)("label", {
											className: "dig-label",
											htmlFor: "dig-image-dir",
											children: t("imageDir")
										}),
										(0, react_jsx_runtime.jsxs)("div", {
											className: "dig-row",
											children: [(0, react_jsx_runtime.jsx)("input", {
												id: "dig-image-dir",
												className: "dig-input",
												placeholder: view.effectiveImageDir,
												value: draft.imageDir,
												onChange: (event) => setDraft({
													...draft,
													imageDir: event.target.value
												})
											}), (0, react_jsx_runtime.jsxs)("button", {
												type: "button",
												className: "dig-btn dig-btn-sm",
												onClick: () => {
													api.gallery.openFolder().catch((failure) => setError(failure instanceof Error ? failure.message : String(failure)));
												},
												children: [(0, react_jsx_runtime.jsx)(FolderOpen, { size: 13 }), t("openFolder")]
											})]
										}),
										(0, react_jsx_runtime.jsx)("span", {
											className: "dig-hint",
											children: t("imageDirHint", { path: view.effectiveImageDir })
										})
									]
								}),
								(0, react_jsx_runtime.jsx)("div", {
									className: "dig-notice",
									children: t("galleryNote")
								}),
								(0, react_jsx_runtime.jsx)("div", {
									className: "dig-field",
									children: (0, react_jsx_runtime.jsx)(AccentPicker, {
										label: t("accent"),
										names: {
											orange: t("accentOrange"),
											blue: t("accentBlue"),
											black: t("accentBlack")
										}
									})
								})
							] }) : (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
								(0, react_jsx_runtime.jsxs)("h2", { children: [
									entry.name,
									entry.preset === true && (0, react_jsx_runtime.jsx)("span", {
										className: "dig-badge",
										children: t("presetTag")
									}),
									keyConfigured ? (0, react_jsx_runtime.jsx)("span", {
										className: "dig-badge dig-badge-ok",
										children: t("apiKeySet")
									}) : (0, react_jsx_runtime.jsx)("span", {
										className: "dig-badge",
										children: t("keyMissing")
									}),
									(0, react_jsx_runtime.jsx)("span", { className: "dig-spacer" }),
									(0, react_jsx_runtime.jsx)(Switch, {
										checked: entry.enabled,
										label: t("enabled"),
										onChange: (enabled) => patchEntry({ enabled })
									})
								] }),
								(0, react_jsx_runtime.jsxs)("div", {
									className: "dig-row",
									style: { flexWrap: "wrap" },
									children: [draft.activeProvider === entry.id ? (0, react_jsx_runtime.jsxs)("span", {
										className: "dig-hint",
										children: ["✓ ", t("isDefaultProvider")]
									}) : (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: "dig-btn dig-btn-sm",
										onClick: () => setDraft({
											...draft,
											activeProvider: entry.id
										}),
										children: t("setDefaultProvider")
									}), entry.preset !== true && (0, react_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "dig-btn dig-btn-sm dig-btn-danger",
										onClick: () => setConfirmDelete(entry),
										children: [(0, react_jsx_runtime.jsx)(Trash, { size: 13 }), t("deleteProvider")]
									})]
								}),
								(0, react_jsx_runtime.jsxs)("div", {
									className: "dig-field",
									children: [(0, react_jsx_runtime.jsx)("label", {
										className: "dig-label",
										htmlFor: "dig-name",
										children: t("name")
									}), (0, react_jsx_runtime.jsx)("input", {
										id: "dig-name",
										className: "dig-input",
										value: entry.name,
										onChange: (event) => patchEntry({ name: event.target.value })
									})]
								}),
								(0, react_jsx_runtime.jsxs)("div", {
									className: "dig-field",
									children: [(0, react_jsx_runtime.jsx)("label", {
										className: "dig-label",
										htmlFor: "dig-protocol",
										children: t("protocol")
									}), (0, react_jsx_runtime.jsx)(Select, {
										id: "dig-protocol",
										label: t("protocol"),
										value: entry.protocol,
										disabled: entry.preset === true,
										options: PROVIDER_PROTOCOLS.map((protocol) => ({
											value: protocol,
											label: PROTOCOL_LABELS[protocol]
										})),
										onChange: (protocol) => patchEntry({ protocol })
									})]
								}),
								(0, react_jsx_runtime.jsxs)("div", {
									className: "dig-field",
									children: [
										(0, react_jsx_runtime.jsx)("label", {
											className: "dig-label",
											htmlFor: "dig-base",
											children: t("baseURL")
										}),
										(0, react_jsx_runtime.jsx)("input", {
											id: "dig-base",
											className: "dig-input",
											placeholder: "https://",
											value: entry.baseURL,
											onChange: (event) => patchEntry({ baseURL: event.target.value })
										}),
										(0, react_jsx_runtime.jsx)("span", {
											className: "dig-hint",
											children: entry.protocol === "gemini" ? t("baseURLHintGemini") : t("baseURLHint")
										}),
										keyConfigured && view.providers.some((saved) => saved.id === entry.id && (saved.baseURL !== entry.baseURL.trim() || saved.protocol !== entry.protocol)) && (0, react_jsx_runtime.jsx)("div", {
											className: "dig-notice dig-notice-warn",
											children: t("keyResetOnSave")
										})
									]
								}),
								(0, react_jsx_runtime.jsxs)("div", {
									className: "dig-field",
									children: [(0, react_jsx_runtime.jsx)("label", {
										className: "dig-label",
										htmlFor: "dig-key",
										children: t("apiKey")
									}), (0, react_jsx_runtime.jsxs)("div", {
										className: "dig-row",
										children: [
											(0, react_jsx_runtime.jsx)("input", {
												id: "dig-key",
												className: "dig-input",
												type: "password",
												autoComplete: "off",
												placeholder: keyConfigured ? t("apiKeySet") : t("apiKeyPlaceholder"),
												value: keyInput,
												onChange: (event) => setKeyInput(event.target.value)
											}),
											(0, react_jsx_runtime.jsx)("button", {
												type: "button",
												className: "dig-btn dig-btn-sm",
												disabled: keyInput.trim().length === 0,
												onClick: () => {
													saveKey(keyInput.trim());
												},
												children: t("saveKey")
											}),
											keyConfigured && (0, react_jsx_runtime.jsx)("button", {
												type: "button",
												className: "dig-btn dig-btn-sm",
												onClick: () => {
													saveKey("");
												},
												children: t("clearKey")
											})
										]
									})]
								}),
								(0, react_jsx_runtime.jsx)(ModelList, {
									t,
									models: entry.models,
									defaultModel: entry.defaultModel,
									fetchDisabled: entry.baseURL.length === 0,
									onChange: (next) => patchEntry(next),
									onFetch: async () => {
										const result = await api.models({
											providerId: entry.id,
											entry,
											...keyInput.trim().length > 0 ? { key: keyInput.trim() } : {}
										});
										return {
											models: result.models,
											imageModels: result.imageModels
										};
									}
								}),
								(0, react_jsx_runtime.jsxs)("div", {
									className: "dig-field",
									children: [
										(0, react_jsx_runtime.jsx)("span", {
											className: "dig-label",
											children: t("proxy")
										}),
										(0, react_jsx_runtime.jsx)("div", {
											className: "dig-chips",
											role: "radiogroup",
											"aria-label": t("proxy"),
											children: [
												"inherit",
												"direct",
												"system",
												"custom"
											].map((mode) => (0, react_jsx_runtime.jsx)("button", {
												type: "button",
												className: "dig-chip",
												role: "radio",
												"aria-checked": entry.proxy.mode === mode,
												"aria-pressed": entry.proxy.mode === mode,
												onClick: () => patchEntry({ proxy: mode === "custom" ? {
													mode,
													url: entry.proxy.url ?? ""
												} : { mode } }),
												children: mode === "inherit" ? t("proxyInherit") : mode === "direct" ? t("proxyDirect") : mode === "system" ? t("proxySystemShort") : t("proxyCustom")
											}, mode))
										}),
										entry.proxy.mode === "custom" && (0, react_jsx_runtime.jsx)("input", {
											className: "dig-input",
											placeholder: "socks5://127.0.0.1:1080",
											value: entry.proxy.url ?? "",
											onChange: (event) => patchEntry({ proxy: {
												mode: "custom",
												url: event.target.value
											} })
										}),
										entry.proxy.mode !== "custom" && (0, react_jsx_runtime.jsxs)("span", {
											className: "dig-hint",
											children: ["→ ", routeLabel(entry.proxy.mode)]
										})
									]
								}),
								entry.protocol === "openai-compat" && (0, react_jsx_runtime.jsxs)("details", {
									className: "dig-field",
									children: [
										(0, react_jsx_runtime.jsx)("summary", {
											className: "dig-label",
											style: {
												cursor: "pointer",
												justifyContent: "flex-start"
											},
											children: t("compatAdvanced")
										}),
										(0, react_jsx_runtime.jsxs)("div", {
											className: "dig-field",
											style: { marginTop: 8 },
											children: [(0, react_jsx_runtime.jsx)("label", {
												className: "dig-label",
												htmlFor: "dig-edit-format",
												children: t("editFormat")
											}), (0, react_jsx_runtime.jsx)(Select, {
												id: "dig-edit-format",
												label: t("editFormat"),
												value: entry.compat?.editFormat ?? "multipart",
												options: [
													{
														value: "multipart",
														label: "multipart (OpenAI)"
													},
													{
														value: "jsonImageUrlArray",
														label: "JSON images[].image_url"
													},
													{
														value: "formReferenceImages",
														label: "form reference_images"
													}
												],
												onChange: (editFormat) => patchEntry({ compat: {
													...entry.compat,
													editFormat
												} })
											})]
										}),
										(0, react_jsx_runtime.jsxs)("div", {
											className: "dig-field",
											children: [
												(0, react_jsx_runtime.jsx)("label", {
													className: "dig-label",
													htmlFor: "dig-sizes",
													children: t("sizesTable")
												}),
												(0, react_jsx_runtime.jsx)("textarea", {
													id: "dig-sizes",
													className: "dig-textarea",
													rows: 4,
													value: sizesText,
													placeholder: "{\"1:1\":{\"1K\":\"1024x1024\"}}",
													onChange: (event) => {
														setSizesText(event.target.value);
														if (event.target.value.trim().length === 0) {
															setSizesError(null);
															patchEntry({ compat: {
																...entry.compat,
																sizes: {}
															} });
															return;
														}
														try {
															const parsed = JSON.parse(event.target.value);
															setSizesError(null);
															patchEntry({ compat: {
																...entry.compat,
																sizes: parsed
															} });
														} catch {
															setSizesError(t("invalidJson"));
														}
													}
												}),
												(0, react_jsx_runtime.jsx)("span", {
													className: sizesError === null ? "dig-hint" : "dig-test-result dig-test-fail",
													children: sizesError ?? t("sizesTableHint")
												})
											]
										})
									]
								}),
								entry.protocol === "seedream" && (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [(0, react_jsx_runtime.jsxs)("div", {
									className: "dig-row",
									children: [(0, react_jsx_runtime.jsx)(Switch, {
										checked: entry.ark?.watermark !== false,
										label: t("seedreamWatermark"),
										onChange: (watermark) => patchEntry({ ark: {
											...entry.ark,
											watermark
										} })
									}), (0, react_jsx_runtime.jsx)("span", {
										style: { fontSize: 13 },
										children: t("seedreamWatermark")
									})]
								}), (0, react_jsx_runtime.jsxs)("div", {
									className: "dig-field",
									children: [(0, react_jsx_runtime.jsx)("label", {
										className: "dig-label",
										htmlFor: "dig-ark-format",
										children: t("seedreamFormat")
									}), (0, react_jsx_runtime.jsx)(Select, {
										id: "dig-ark-format",
										label: t("seedreamFormat"),
										value: entry.ark?.outputFormat ?? "jpeg",
										options: [{
											value: "jpeg",
											label: "JPEG"
										}, {
											value: "png",
											label: "PNG"
										}],
										onChange: (outputFormat) => patchEntry({ ark: {
											...entry.ark,
											outputFormat
										} })
									})]
								})] }),
								(0, react_jsx_runtime.jsxs)("div", {
									className: "dig-row",
									children: [(0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: "dig-btn",
										disabled: test.running,
										onClick: () => {
											runTest();
										},
										children: test.running ? (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [(0, react_jsx_runtime.jsx)(LoaderCircle, {
											size: 14,
											className: "dig-spin"
										}), t("testing")] }) : t("testConnection")
									}), test.message !== void 0 && (0, react_jsx_runtime.jsx)("span", {
										className: `dig-test-result ${test.ok === true ? "dig-test-ok" : "dig-test-fail"}`,
										children: test.message
									})]
								})
							] }),
							error !== null && (0, react_jsx_runtime.jsx)("div", {
								className: "dig-error",
								style: { margin: 0 },
								role: "alert",
								children: error
							}),
							(dirty || savedFlash) && (0, react_jsx_runtime.jsxs)("div", {
								className: "dig-savebar",
								children: [
									(0, react_jsx_runtime.jsx)("span", {
										className: "dig-hint",
										style: { flex: 1 },
										children: dirty ? t("unsaved") : t("saved")
									}),
									dirty && (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: "dig-btn dig-btn-sm",
										onClick: () => setDraft(stripView(view)),
										children: t("discard")
									}),
									dirty && (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: "dig-btn dig-btn-sm dig-btn-primary",
										disabled: saving || sizesError !== null,
										onClick: () => {
											save();
										},
										children: saving ? "…" : t("save")
									})
								]
							})
						]
					}),
					confirmDelete !== null && (0, react_jsx_runtime.jsx)(Modal, {
						title: t("deleteProvider"),
						onClose: () => setConfirmDelete(null),
						actions: (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [(0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: "dig-btn",
							onClick: () => setConfirmDelete(null),
							children: t("cancel")
						}), (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: "dig-btn dig-btn-primary",
							style: {
								background: "var(--dig-danger)",
								borderColor: "var(--dig-danger)"
							},
							onClick: () => {
								const target = confirmDelete;
								setConfirmDelete(null);
								const next = {
									...draft,
									providers: draft.providers.filter((candidate) => candidate.id !== target.id),
									activeProvider: draft.activeProvider === target.id ? draft.providers.find((candidate) => candidate.id !== target.id)?.id ?? "" : draft.activeProvider
								};
								setSelected(GENERAL);
								(async () => {
									if (view.providers.some((candidate) => candidate.id === target.id)) await api.setKey(target.id, "").catch(() => {});
									await save(next);
								})();
							},
							children: t("delete")
						})] }),
						children: (0, react_jsx_runtime.jsx)("p", {
							style: { margin: 0 },
							children: t("deleteProviderConfirm", { name: confirmDelete.name })
						})
					})
				]
			});
		}
		//#endregion
		//#region lib/types/client/paintings-page.js
		/**
		* Global “绘画” page mounted from the left sidebar. Not bound to any DSH
		* workspace or session: projects here are the gallery's own grouping.
		*/
		const STATE_KEY = "copylee-image-gen.page.v1";
		const POLL_MS = 4e3;
		function loadState() {
			try {
				return JSON.parse(localStorage.getItem(STATE_KEY) ?? "{}");
			} catch {
				return {};
			}
		}
		function PaintingsPage({ locale }) {
			const t = useT(locale);
			const [initial] = (0, react.useState)(loadState);
			const [tab, setTab] = (0, react.useState)(initial.tab ?? "paint");
			const [settings, setSettings] = (0, react.useState)(null);
			const [projects, setProjects] = (0, react.useState)([]);
			const [projectId, setProjectId] = (0, react.useState)(initial.project ?? "default");
			const [galleryFilter, setGalleryFilter] = (0, react.useState)(initial.galleryFilter ?? "__all__");
			const [history, setHistory] = (0, react.useState)([]);
			const [favoritesCount, setFavoritesCount] = (0, react.useState)(0);
			const [refreshKey, setRefreshKey] = (0, react.useState)(0);
			const [revision, setRevision] = (0, react.useState)(null);
			const [error, setError] = (0, react.useState)(null);
			const [injected, setInjected] = (0, react.useState)(null);
			const [toastNode, toast] = useToast();
			(0, react.useEffect)(() => {
				try {
					localStorage.setItem(STATE_KEY, JSON.stringify({
						tab: tab === "settings" ? "paint" : tab,
						project: projectId,
						galleryFilter
					}));
				} catch {}
			}, [
				tab,
				projectId,
				galleryFilter
			]);
			const loadSettings = (0, react.useCallback)(() => {
				api.settings().then(setSettings, (failure) => setError(failure instanceof Error ? failure.message : String(failure)));
			}, []);
			(0, react.useEffect)(loadSettings, [loadSettings]);
			const bump = (0, react.useCallback)(() => setRefreshKey((key) => key + 1), []);
			const onError = (0, react.useCallback)((message) => setError(message), []);
			(0, react.useEffect)(() => onGalleryChanged(bump), [bump]);
			const session = usePaintSession();
			(0, react.useEffect)(() => {
				let cancelled = false;
				(async () => {
					try {
						const [projectList, page, favorites] = await Promise.all([
							api.gallery.projects(),
							api.gallery.list({
								projectId,
								limit: 200
							}),
							api.gallery.list({
								favorite: true,
								limit: 1
							})
						]);
						if (cancelled) return;
						setProjects(projectList.projects);
						setRevision(projectList.revision);
						setHistory(page.items);
						setFavoritesCount(favorites.total);
						if (!projectList.projects.some((project) => project.id === projectId)) setProjectId(DEFAULT_PROJECT_ID);
					} catch (failure) {
						if (!cancelled) setError(failure instanceof Error ? failure.message : String(failure));
					}
				})();
				return () => {
					cancelled = true;
				};
			}, [projectId, refreshKey]);
			(0, react.useEffect)(() => {
				const timer = setInterval(() => {
					if (document.visibilityState !== "visible") return;
					api.gallery.revision().then((next) => {
						if (revision !== null && next.revision !== revision) bump();
					}, () => {});
				}, POLL_MS);
				return () => clearInterval(timer);
			}, [revision, bump]);
			const total = projects.reduce((sum, project) => sum + project.count, 0);
			const projectList = (gallery) => (0, react_jsx_runtime.jsx)(ProjectList, {
				projects,
				current: gallery ? galleryFilter : projectId,
				onSelect: (id) => gallery ? setGalleryFilter(id) : setProjectId(id),
				onChanged: bump,
				t,
				onError,
				...gallery ? { showAll: {
					total,
					favorites: favoritesCount
				} } : { busyIds: new Set(session.jobs.keys()) }
			});
			const tabButton = (key, label, icon) => (0, react_jsx_runtime.jsxs)("button", {
				type: "button",
				role: "tab",
				className: "dig-tab",
				"aria-selected": tab === key,
				onClick: () => setTab(key),
				children: [icon, label]
			});
			return (0, react_jsx_runtime.jsxs)("div", {
				className: "dig-root dig-page",
				children: [
					(0, react_jsx_runtime.jsxs)("header", {
						className: "dig-head",
						children: [
							(0, react_jsx_runtime.jsx)("h1", { children: t("panel") }),
							(0, react_jsx_runtime.jsxs)("div", {
								className: "dig-tabs",
								role: "tablist",
								children: [
									tabButton("paint", t("tabPaint"), (0, react_jsx_runtime.jsx)(Palette, { size: 15 })),
									tabButton("gallery", t("tabGallery"), (0, react_jsx_runtime.jsx)(Images, { size: 15 })),
									tabButton("prompts", t("tabPrompts"), (0, react_jsx_runtime.jsx)(Bookmark, { size: 15 }))
								]
							}),
							(0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: "dig-icon-btn",
								"aria-label": t("settingsTitle"),
								title: t("settingsTitle"),
								"aria-pressed": false,
								onClick: () => setTab(tab === "settings" ? "paint" : "settings"),
								children: (0, react_jsx_runtime.jsx)(Settings, { size: 17 })
							})
						]
					}),
					error !== null && (0, react_jsx_runtime.jsx)("div", {
						className: "dig-error",
						role: "alert",
						onClick: () => setError(null),
						style: { cursor: "pointer" },
						children: error
					}),
					(0, react_jsx_runtime.jsxs)("div", {
						className: "dig-body",
						children: [
							tab === "paint" && (0, react_jsx_runtime.jsx)(PaintView, {
								t,
								settings,
								projectId,
								history,
								onGalleryChanged: bump,
								onError,
								toast,
								onOpenSettings: () => setTab("settings"),
								injected,
								sideTop: projectList(false),
								refreshKey
							}),
							tab === "gallery" && (0, react_jsx_runtime.jsx)(GalleryView, {
								t,
								settings,
								projects,
								filter: galleryFilter,
								refreshKey,
								onGalleryChanged: bump,
								onError,
								toast,
								onUseAsReference: (item) => {
									setInjected({
										reference: item.attachment,
										nonce: Date.now()
									});
									setTab("paint");
								},
								onReusePrompt: (item) => {
									setInjected({
										text: item.prompt,
										nonce: Date.now()
									});
									setTab("paint");
								},
								sideTop: projectList(true)
							}),
							tab === "prompts" && (0, react_jsx_runtime.jsx)(PromptsView, {
								t,
								refreshKey,
								onUse: (text) => {
									setInjected({
										text,
										nonce: Date.now()
									});
									setTab("paint");
								},
								onError
							}),
							tab === "settings" && (0, react_jsx_runtime.jsx)("div", {
								className: "dig-scroll",
								style: {
									flex: 1,
									minWidth: 0,
									padding: 16
								},
								children: (0, react_jsx_runtime.jsx)(SettingsPanel, {
									t,
									onSaved: setSettings
								})
							})
						]
					}),
					toastNode
				]
			});
		}
		function PromptsView({ t, refreshKey, onUse, onError }) {
			const [prompts, setPrompts] = (0, react.useState)([]);
			const load = (0, react.useCallback)(() => {
				api.gallery.favoritePrompts().then((result) => setPrompts(result.prompts), (failure) => onError(String(failure)));
			}, [onError]);
			(0, react.useEffect)(load, [load, refreshKey]);
			const [editing, setEditing] = (0, react.useState)(null);
			const [draft, setDraft] = (0, react.useState)("");
			const cancelled = (0, react.useRef)(false);
			const startEdit = (prompt) => {
				cancelled.current = false;
				setDraft(prompt.text);
				setEditing(prompt.id);
			};
			const commit = (id) => {
				setEditing(null);
				if (cancelled.current) {
					cancelled.current = false;
					return;
				}
				const original = prompts.find((entry) => entry.id === id);
				if (original === void 0 || draft.trim() === original.text || draft.trim().length === 0) return;
				api.gallery.updateFavoritePrompt(id, draft).then(load, (failure) => onError(failure instanceof Error ? failure.message : String(failure)));
			};
			return (0, react_jsx_runtime.jsx)("div", {
				className: "dig-scroll",
				style: {
					flex: 1,
					minWidth: 0
				},
				children: (0, react_jsx_runtime.jsxs)("div", {
					className: "dig-prompts",
					children: [prompts.length === 0 && (0, react_jsx_runtime.jsxs)("div", {
						className: "dig-empty",
						children: [(0, react_jsx_runtime.jsx)(Bookmark, {
							size: 32,
							strokeWidth: 1.4
						}), t("noPrompts")]
					}), prompts.map((prompt) => (0, react_jsx_runtime.jsxs)("div", {
						className: "dig-prompt-row",
						children: [
							editing === prompt.id ? (0, react_jsx_runtime.jsx)(AutoTextarea, {
								className: "dig-textarea dig-prompt-text dig-prompt-edit",
								value: draft,
								onChange: setDraft,
								onBlur: () => commit(prompt.id),
								onKeyDown: (event) => {
									if (event.key === "Escape") {
										cancelled.current = true;
										setEditing(null);
									}
									if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) commit(prompt.id);
								}
							}) : (0, react_jsx_runtime.jsx)("div", {
								className: "dig-prompt-text",
								role: "button",
								tabIndex: 0,
								title: t("editPrompt"),
								style: { cursor: "text" },
								onClick: () => startEdit(prompt),
								onKeyDown: (event) => {
									if (event.key === "Enter") startEdit(prompt);
								},
								children: prompt.text
							}),
							(0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: "dig-icon-btn",
								title: t("editPrompt"),
								"aria-label": t("editPrompt"),
								onClick: () => startEdit(prompt),
								children: (0, react_jsx_runtime.jsx)(Pencil, { size: 15 })
							}),
							(0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: "dig-btn dig-btn-sm",
								onClick: () => onUse(prompt.text),
								children: t("usePrompt")
							}),
							(0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: "dig-icon-btn",
								"aria-label": t("delete"),
								onClick: () => {
									api.gallery.removeFavoritePrompt(prompt.id).then(load);
								},
								children: (0, react_jsx_runtime.jsx)(Trash, { size: 15 })
							})
						]
					}, prompt.id))]
				})
			});
		}
		/**
		* Textarea that opens at the height of its whole text and keeps growing
		* while typing (up to 70% of the viewport, then scrolls), with the caret
		* placed at the end.
		*/
		function AutoTextarea({ value, onChange, onBlur, onKeyDown, className }) {
			const ref = (0, react.useRef)(null);
			(0, react.useLayoutEffect)(() => {
				const area = ref.current;
				if (area === null) return;
				area.style.height = "auto";
				area.style.height = `${String(Math.min(Math.max(area.scrollHeight + 2, 96), Math.round(window.innerHeight * .7)))}px`;
			}, [value]);
			(0, react.useEffect)(() => {
				const area = ref.current;
				if (area === null) return;
				area.focus();
				area.setSelectionRange(area.value.length, area.value.length);
			}, []);
			return (0, react_jsx_runtime.jsx)("textarea", {
				ref,
				className,
				value,
				onChange: (event) => onChange(event.target.value),
				onBlur,
				onKeyDown
			});
		}
		//#endregion
		//#region lib/types/client/style.js
		/**
		* Plugin stylesheet. Every color comes from DSH's `--dsw-*` design tokens
		* (with neutral fallbacks), so light/dark themes follow the host. Metrics
		* mirror DSH's own pages (ui-schedule): 14px body, 20px/500 page title,
		* 28px pill filters, 8–10px radii, hairline borders.
		*/
		const STYLE = String.raw`
.dig-root{--dig-fg:var(--dsw-alias-label-primary,#1f2329);--dig-fg2:var(--dsw-alias-label-secondary,#4e5969);--dig-fg3:var(--dsw-alias-label-tertiary,#86909c);--dig-caption:var(--dsw-alias-label-caption,#a9aeb8);--dig-bg:var(--dsw-alias-bg-base,#fff);--dig-layer:var(--dsw-alias-bg-layer-1,#f7f8fa);--dig-side:var(--dsw-specific-sidebar-fill,var(--dsw-alias-bg-layer-1,#f7f8fa));--dig-hover:var(--dsw-alias-interactive-bg-hover,rgba(0,0,0,.05));--dig-border:var(--dsw-alias-border-l2,rgba(0,0,0,.1));--dig-border-soft:var(--dsw-alias-border-l4,rgba(0,0,0,.06));--dig-accent:var(--cl-accent,#D97757);--dig-accent-ink:var(--cl-accent-ink,#fff);--dig-danger:var(--dsw-alias-state-error-primary,#e5484d);--dig-focus:var(--dig-accent);--dig-radius:10px;--dig-elev:var(--dsw-elevation-prominent,0 8px 24px rgba(0,0,0,.12));color:var(--dig-fg);background:var(--dig-bg);font-size:14px;line-height:1.6;box-sizing:border-box}
.dig-root *,.dig-root *::before,.dig-root *::after{box-sizing:border-box}
.dig-page{display:flex;flex-direction:column;width:100%;height:100%;min-width:0;min-height:0;overflow:hidden}
.dig-head{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:12px;padding:12px 18px;flex:none}
.dig-head h1{margin:0;font-size:20px;font-weight:500;line-height:28px;flex:none}
.dig-tabs{display:flex;align-items:center;gap:6px;min-width:0;overflow-x:auto}
.dig-tab{height:28px;padding:0 12px;border:0;border-radius:14px;background:transparent;color:var(--dig-fg3);font:inherit;font-size:14px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;white-space:nowrap;flex:none}
.dig-tab:hover{background:var(--dig-hover);color:var(--dig-fg)}
.dig-tab[aria-selected=true]{background:var(--dig-hover);color:var(--dig-fg);font-weight:500}
.dig-spacer{flex:1}
.dig-body{flex:1;min-height:0;display:flex;border-top:.5px solid var(--dig-border-soft)}
.dig-scroll{overflow:auto;scrollbar-gutter:stable;--dsh-scrollbar-width:9px;--dsh-scrollbar-thumb-border:2px}
.dig-side{width:272px;flex:none;display:flex;flex-direction:column;min-height:0;border-right:.5px solid var(--dig-border-soft);background:var(--dig-side)}
.dig-side-section{padding:12px 12px 4px}
.dig-section-title{display:flex;align-items:center;justify-content:space-between;color:var(--dig-fg3);font-size:12px;line-height:20px;padding:0 6px 4px}
.dig-proj-list{display:flex;flex-direction:column;gap:1px;max-height:34vh;overflow:auto}
.dig-proj{display:flex;align-items:center;gap:8px;height:34px;padding:0 6px 0 10px;border-radius:8px;cursor:pointer;color:var(--dig-fg);user-select:none;position:relative}
.dig-proj:hover{background:var(--dig-hover)}
.dig-proj[aria-current=true]{background:var(--dig-hover);font-weight:500}
.dig-proj-name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dig-proj-count{color:var(--dig-caption);font-size:12px}
.dig-proj .dig-icon-btn{opacity:0}
.dig-proj:hover .dig-icon-btn,.dig-proj .dig-icon-btn[aria-expanded=true]{opacity:1}
.dig-proj-input{flex:1;min-width:0;height:26px;border:1px solid var(--dig-accent);border-radius:6px;background:var(--dig-bg);color:var(--dig-fg);font:inherit;padding:0 6px;outline:none}
.dig-params{flex:1;min-height:0;padding:8px 18px 18px;display:flex;flex-direction:column;gap:14px;border-top:.5px solid var(--dig-border-soft)}
.dig-field{display:flex;flex-direction:column;gap:6px}
.dig-label{font-size:12px;line-height:20px;color:var(--dig-fg2);display:flex;align-items:center;justify-content:space-between;gap:8px}
.dig-hint{font-size:12px;line-height:18px;color:var(--dig-fg3)}
.dig-select,.dig-input,.dig-textarea{width:100%;min-width:0;border:.5px solid var(--dsw-alias-border-l4,var(--dig-border));border-radius:var(--dsw-radius-md,8px);background:var(--dsw-alias-bg-layer-3,var(--dig-bg));color:var(--dig-fg);font:inherit;font-size:13px;line-height:1.5;outline:none;transition:border-color .13s}
.dig-select,.dig-input{height:34px;padding:0 12px}
.dig-select:hover:not(:disabled),.dig-input:hover:not(:disabled),.dig-textarea:hover:not(:disabled){border-color:var(--dsw-alias-border-l3,var(--dig-border))}
.dig-select-wrap{position:relative;display:flex;min-width:0;width:100%}
.dig-select-compact{width:auto;min-width:150px;flex:none}
.dig-select{display:flex;align-items:center;gap:8px;text-align:left;cursor:pointer;padding-right:10px}
.dig-select:disabled{color:var(--dig-fg3);cursor:default}
.dig-select-open{border-color:var(--dig-accent)!important}
.dig-select-value{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dig-select-placeholder{color:var(--dig-fg3)}
.dig-select-chevron{flex:none;color:var(--dig-fg3);transition:transform .15s ease}
.dig-select-open .dig-select-chevron{transform:rotate(180deg)}
.dig-menu-pop,.dig-menu{position:fixed;z-index:1100;box-sizing:border-box;min-width:160px;padding:4px;overflow-y:auto;overscroll-behavior:contain;border-radius:var(--dsw-radius-lg,12px);background:var(--dsw-menu-surface-fill,var(--dsw-alias-bg-layer-1,var(--dig-bg)));backdrop-filter:var(--dsw-menu-backdrop-filter,none);-webkit-backdrop-filter:var(--dsw-menu-backdrop-filter,none);box-shadow:var(--dsw-elevation-prominent,0 10px 32px rgba(0,0,0,.16),0 0 0 .5px rgba(0,0,0,.1));color:var(--dig-fg);animation:dig-menu-in .12s ease-out}
@keyframes dig-menu-in{from{opacity:0;transform:translateY(-2px)}to{opacity:1;transform:none}}
.dig-menu-label{padding:6px 8px 2px;color:var(--dig-fg3);font-size:11px;line-height:16px;font-weight:500;user-select:none}
.dig-menu-label:not(:first-child){margin-top:4px;padding-top:8px;border-top:.5px solid var(--dig-border)}
.dig-menu-item{display:flex;align-items:center;gap:8px;min-height:34px;padding:6px 8px;border-radius:var(--dsw-radius-md,8px);color:var(--dig-fg);font-size:13px;line-height:20px;cursor:pointer;user-select:none}
.dig-menu-item-active{background:var(--dig-hover)}
.dig-menu-item-label{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dig-menu-detail{flex:none;color:var(--dig-fg3);font-size:12px;line-height:18px}
.dig-menu-check{flex:none;display:inline-flex;width:14px;height:14px;color:var(--dig-fg)}
.dig-menu-filter{position:sticky;top:-4px;z-index:1;margin:-4px -4px 4px;padding:8px 8px 4px;background:inherit}
.dig-menu-filter .dig-input{height:30px}
.dig-menu-empty{padding:8px;color:var(--dig-fg3);font-size:12px;text-align:center}
@media (prefers-reduced-motion:reduce){.dig-menu-pop,.dig-menu{animation:none}.dig-select-chevron{transition:none}}
.dig-textarea{padding:8px 10px;resize:vertical;min-height:64px;line-height:1.55}
.dig-select:focus-visible,.dig-input:focus,.dig-textarea:focus{border-color:var(--dig-focus)}
.dig-chips{display:flex;flex-wrap:wrap;gap:6px}
.dig-chip{min-width:44px;height:28px;padding:0 10px;border-radius:8px;border:.5px solid var(--dig-border);background:var(--dig-bg);color:var(--dig-fg2);font:inherit;font-size:12px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px}
.dig-chip:hover{background:var(--dig-hover);color:var(--dig-fg)}
.dig-chip[aria-pressed=true]{border-color:var(--dig-accent);color:var(--dig-accent);background:color-mix(in srgb,var(--dig-accent) 8%,transparent)}
.dig-ratio-glyph{display:inline-block;border:1.5px solid currentColor;border-radius:2px}
.dig-btn{height:32px;padding:0 14px;border-radius:16px;border:.5px solid var(--dig-border);background:var(--dig-bg);color:var(--dig-fg);font:inherit;font-size:13px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px;white-space:nowrap}
.dig-btn:hover:not(:disabled){background:var(--dig-hover)}
.dig-btn:disabled{opacity:.5;cursor:not-allowed}
.dig-btn-primary{background:var(--dig-accent);border-color:var(--dig-accent);color:var(--dig-accent-ink)}
.dig-btn-primary:hover:not(:disabled){background:color-mix(in srgb,var(--dig-accent) 88%,#000)}
.dig-btn-danger{color:var(--dig-danger)}
.dig-btn-sm{height:28px;padding:0 10px;font-size:12px;border-radius:14px}
.dig-icon-btn{width:28px;height:28px;border:0;border-radius:6px;background:transparent;color:var(--dig-fg3);cursor:pointer;display:inline-flex;align-items:center;justify-content:center;flex:none;padding:0}
.dig-icon-btn:hover:not(:disabled){background:var(--dig-hover);color:var(--dig-fg)}
.dig-icon-btn:disabled{opacity:.4;cursor:not-allowed}
.dig-icon-btn[aria-pressed=true]{color:#f5a623}
.dig-root button:focus-visible,.dig-root [tabindex]:focus-visible{outline:2px solid var(--dig-focus);outline-offset:1px}
.dig-center{flex:1;min-width:0;display:flex;flex-direction:column;min-height:0}
.dig-board{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;padding:24px 24px 36px;position:relative;overflow:hidden}
.dig-board-empty{display:flex;flex-direction:column;align-items:center;gap:12px;color:var(--dig-fg3);text-align:center;max-width:360px}
.dig-board-empty svg{color:var(--dig-caption)}
.dig-board-img{max-width:100%;max-height:100%;object-fit:contain;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,.08);background:var(--dig-layer);cursor:zoom-in}
.dig-board-grid{display:grid;gap:12px;width:100%;height:100%;grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-rows:minmax(0,1fr)}
.dig-board-grid .dig-board-cell{min-height:0;display:flex;align-items:center;justify-content:center;border-radius:8px;cursor:pointer;position:relative}
.dig-board-grid .dig-board-cell[aria-current=true]{outline:2px solid var(--dig-accent);outline-offset:2px}
.dig-board-grid img{max-width:100%;max-height:100%;object-fit:contain;border-radius:8px}
.dig-board-tools{position:absolute;top:12px;right:16px;display:flex;gap:4px;padding:4px;border-radius:10px;background:color-mix(in srgb,var(--dig-bg) 88%,transparent);backdrop-filter:blur(8px);box-shadow:0 1px 4px rgba(0,0,0,.08)}
.dig-board-meta{position:absolute;left:16px;right:16px;bottom:10px;color:var(--dig-fg3);font-size:12px;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dig-busy{display:flex;flex-direction:column;align-items:center;gap:10px;color:var(--dig-fg3)}
.dig-spin{animation:dig-spin 1s linear infinite}
@keyframes dig-spin{to{transform:rotate(360deg)}}
.dig-skeleton{border-radius:8px;background:linear-gradient(90deg,var(--dig-layer),var(--dig-hover),var(--dig-layer));background-size:200% 100%;animation:dig-shimmer 1.4s ease-in-out infinite}
@keyframes dig-shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
.dig-composer{flex:none;margin:0 24px 20px;border:.5px solid var(--dig-border);border-radius:16px;background:var(--dig-bg);box-shadow:0 2px 12px rgba(0,0,0,.04);padding:10px 12px 10px 14px;display:flex;flex-direction:column;gap:8px}
.dig-composer:focus-within{border-color:var(--dig-focus)}
.dig-composer textarea{border:0;outline:none;resize:none;background:transparent;color:var(--dig-fg);font:inherit;font-size:14px;line-height:1.6;min-height:68px;width:100%;padding:0;overflow-y:auto}
.dig-composer-row{display:flex;align-items:center;gap:8px}
.dig-refs{display:flex;gap:8px;flex-wrap:wrap}
.dig-ref{width:52px;height:52px;border-radius:8px;overflow:hidden;position:relative;border:.5px solid var(--dig-border);background:var(--dig-layer)}
.dig-ref img{width:100%;height:100%;object-fit:cover}
.dig-ref button{position:absolute;top:2px;right:2px;width:18px;height:18px;border-radius:9px;border:0;background:rgba(0,0,0,.55);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0}
.dig-history{width:112px;flex:none;border-left:.5px solid var(--dig-border-soft);display:flex;flex-direction:column;min-height:0;background:var(--dig-side)}
.dig-board:focus{outline:none}
.dig-new-canvas{margin:4px 12px 0;justify-content:center}
.dig-proj-busy{flex:none;color:var(--dig-accent)}
.dig-history-list{flex:1;min-height:0;padding:8px 12px 12px;display:flex;flex-direction:column;gap:8px}
.dig-thumb{width:100%;aspect-ratio:1;border-radius:8px;overflow:hidden;position:relative;cursor:pointer;border:.5px solid var(--dig-border-soft);background:var(--dig-layer);flex:none;padding:0}
.dig-thumb img{width:100%;height:100%;object-fit:cover;display:block}
.dig-thumb[aria-current=true]{outline:2px solid var(--dig-accent);outline-offset:1px}
.dig-thumb .dig-thumb-del{position:absolute;top:3px;right:3px;width:20px;height:20px;border-radius:10px;border:0;background:rgba(0,0,0,.55);color:#fff;display:none;align-items:center;justify-content:center;cursor:pointer;padding:0}
.dig-thumb:hover .dig-thumb-del{display:flex}
.dig-board-error{display:flex;align-items:flex-start;gap:8px;flex-shrink:0;max-height:96px}
.dig-board-error-text{flex:1;min-width:0;max-height:78px;overflow:auto}
.dig-error{margin:0 24px 10px;padding:8px 12px;border-radius:8px;background:color-mix(in srgb,var(--dig-danger) 10%,transparent);color:var(--dig-danger);font-size:12px;line-height:18px;white-space:pre-wrap;word-break:break-word}
.dig-notice{padding:12px 14px;border-radius:10px;background:var(--dig-side);color:var(--dig-fg2);font-size:12px;line-height:20px}
.dig-gallery{flex:1;min-width:0;display:flex;flex-direction:column;min-height:0}
.dig-toolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:12px 24px}
.dig-toolbar .dig-select-wrap{width:auto}
.dig-search{position:relative;flex:1;min-width:180px;max-width:360px}
.dig-search svg{position:absolute;left:10px;top:50%;transform:translateY(-50%);z-index:1;pointer-events:none;color:var(--dig-fg3)}
.dig-search .dig-input{padding-left:32px;width:100%}
.dig-grid{flex:1;min-height:0;padding:4px 24px 24px;display:grid;grid-template-columns:repeat(auto-fill,minmax(168px,1fr));gap:12px;align-content:start}
.dig-card{position:relative;border-radius:10px;overflow:hidden;background:var(--dig-layer);aspect-ratio:1;cursor:pointer;border:.5px solid var(--dig-border-soft)}
.dig-card img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .2s}
.dig-card:hover img{transform:scale(1.03)}
.dig-card-overlay{position:absolute;inset:auto 0 0 0;padding:20px 8px 6px;background:linear-gradient(transparent,rgba(0,0,0,.55));color:#fff;font-size:11px;line-height:16px;opacity:0;transition:opacity .15s;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.dig-card:hover .dig-card-overlay{opacity:1}
.dig-card-check{position:absolute;top:6px;left:6px;width:22px;height:22px;border-radius:11px;border:1.5px solid #fff;background:rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center;color:#fff}
.dig-card[aria-selected=true]{outline:2px solid var(--dig-accent);outline-offset:-2px}
.dig-card[aria-selected=true] .dig-card-check{background:var(--dig-accent);border-color:var(--dig-accent);color:var(--dig-accent-ink)}
.dig-card-star{position:absolute;top:6px;right:6px;color:#f5a623;filter:drop-shadow(0 1px 2px rgba(0,0,0,.4))}
.dig-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:64px 20px;color:var(--dig-fg3);grid-column:1/-1}
.dig-overlay{position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,.72);display:flex;align-items:stretch;justify-content:center}
.dig-lightbox{display:flex;width:100%;height:100%}
.dig-lightbox-stage{flex:1;min-width:0;display:flex;align-items:center;justify-content:center;padding:48px;position:relative}
.dig-lightbox-stage img{max-width:100%;max-height:100%;object-fit:contain;border-radius:6px;box-shadow:0 10px 40px rgba(0,0,0,.4)}
.dig-lightbox-info{width:320px;flex:none;background:var(--dig-bg);color:var(--dig-fg);padding:20px;display:flex;flex-direction:column;gap:12px;overflow:auto}
.dig-lightbox-info h3{margin:0;font-size:14px;font-weight:500}
.dig-lightbox-prompt{white-space:pre-wrap;word-break:break-word;font-size:13px;line-height:1.6;background:var(--dig-layer);border-radius:8px;padding:10px 12px;max-height:40vh;overflow:auto}
.dig-kv{display:grid;grid-template-columns:72px 1fr;gap:4px 8px;font-size:12px;color:var(--dig-fg2)}
.dig-kv dt{color:var(--dig-fg3)}
.dig-kv dd{margin:0;word-break:break-all}
.dig-lightbox-actions{display:flex;flex-wrap:wrap;gap:8px}
.dig-lightbox-close{position:absolute;top:14px;left:14px;color:#fff;background:rgba(255,255,255,.12)}
.dig-lightbox-close:hover{background:rgba(255,255,255,.22)!important;color:#fff!important}
.dig-nav{position:absolute;top:50%;transform:translateY(-50%);width:40px;height:40px;border-radius:20px;color:#fff;background:rgba(255,255,255,.12);border:0;cursor:pointer;display:flex;align-items:center;justify-content:center}
.dig-nav:hover{background:rgba(255,255,255,.24)}
.dig-modal-wrap{position:fixed;inset:0;z-index:1001;background:rgba(0,0,0,.32);display:flex;align-items:center;justify-content:center;padding:16px}
.dig-modal{width:min(420px,100%);background:var(--dig-bg);color:var(--dig-fg);border-radius:14px;box-shadow:var(--dig-elev);padding:20px;display:flex;flex-direction:column;gap:14px}
.dig-size-row{display:flex;align-items:center;gap:6px}
.dig-size-row .dig-input{flex:1;min-width:0;text-align:center;font-variant-numeric:tabular-nums}
.dig-size-row .dig-icon-btn[aria-pressed=true]{color:var(--dig-accent)}
.dig-prompt-pop{display:flex;flex-direction:column;overflow:hidden}
.dig-prompt-save{width:100%;border:0;background:transparent;font:inherit;text-align:left;color:var(--dig-fg)}
.dig-prompt-save:hover:not(:disabled){background:var(--dig-hover)}
.dig-prompt-save:disabled{color:var(--dig-fg3);cursor:default}
.dig-prompt-pop .dig-menu-filter{position:relative;margin:4px 0;padding:0 4px}
.dig-prompt-pop .dig-menu-filter svg{left:14px}
.dig-prompt-list{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain}
.dig-prompt-item{align-items:flex-start}
.dig-prompt-item-text{flex:1;min-width:0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;white-space:pre-wrap;word-break:break-word}
.dig-prompt-item .dig-icon-btn{width:24px;height:24px;opacity:0}
.dig-prompt-item:hover .dig-icon-btn,.dig-prompt-item-active .dig-icon-btn{opacity:1}
.dig-prompt-foot{padding:6px 8px 2px;border-top:.5px solid var(--dig-border-soft);color:var(--dig-fg3);font-size:11px}
.dig-bookmark-btn[aria-pressed=true]{color:var(--dig-accent)}
.dig-notice-warn{background:color-mix(in srgb,#f5a623 12%,transparent);color:var(--dig-fg)}
.dig-prompt-edit{resize:vertical;min-height:96px;font-size:13px;line-height:1.6;padding:8px 10px}
.dig-modal-wide{width:min(620px,100%)}
.dig-models{display:flex;flex-direction:column;border:.5px solid var(--dsw-alias-border-l4,var(--dig-border));border-radius:var(--dsw-radius-md,8px);background:var(--dsw-alias-bg-layer-3,var(--dig-bg));overflow:hidden}
.dig-model-row{display:flex;align-items:center;gap:8px;min-height:36px;padding:0 6px 0 12px;border-bottom:.5px solid var(--dig-border-soft)}
.dig-model-row:hover{background:var(--dig-hover)}
.dig-model-id{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px;font-family:var(--dsw-font-mono,ui-monospace,SFMono-Regular,Menlo,monospace)}
.dig-model-action{border:0;background:transparent;color:var(--dig-fg3);font:inherit;font-size:12px;cursor:pointer;padding:2px 6px;border-radius:6px;opacity:0}
.dig-model-row:hover .dig-model-action,.dig-model-action:focus-visible{opacity:1}
.dig-model-action:hover{color:var(--dig-accent);background:var(--dig-hover)}
.dig-model-remove{opacity:0;width:24px;height:24px}
.dig-model-row:hover .dig-model-remove,.dig-model-remove:focus-visible{opacity:1}
.dig-model-add{display:flex;gap:8px;align-items:center;padding:8px}
.dig-model-add .dig-input{height:30px;background:var(--dig-bg)}
.dig-models-empty{padding:12px;color:var(--dig-fg3);font-size:12px;text-align:center;border-bottom:.5px solid var(--dig-border-soft)}
.dig-badge.dig-badge-accent{background:color-mix(in srgb,var(--dig-accent) 12%,transparent);color:var(--dig-accent)}
.dig-pick-list{max-height:min(46vh,420px);border:.5px solid var(--dig-border-soft);border-radius:8px;padding:4px}
.dig-pick-row{display:flex;align-items:center;gap:10px;min-height:32px;padding:0 8px;border-radius:6px;cursor:pointer}
.dig-pick-row:hover{background:var(--dig-hover)}
.dig-pick-added{cursor:default;color:var(--dig-fg3)}
.dig-pick-row input{accent-color:var(--dig-accent);margin:0}
.dig-composer-grip{height:10px;margin:-10px -12px -2px -14px;cursor:ns-resize;display:flex;align-items:center;justify-content:center;touch-action:none}
.dig-composer-grip::before{content:"";width:36px;height:4px;border-radius:2px;background:var(--dig-border);opacity:0;transition:opacity .15s}
.dig-composer:hover .dig-composer-grip::before,.dig-composer-grip:focus-visible::before{opacity:1}
.dig-modal h2{margin:0;font-size:16px;font-weight:500}
.dig-modal-actions{display:flex;justify-content:flex-end;gap:8px}
.dig-menu button{display:flex;align-items:center;gap:8px;width:100%;min-height:34px;padding:6px 8px;border:0;border-radius:var(--dsw-radius-md,8px);background:transparent;color:inherit;font:inherit;font-size:13px;line-height:20px;cursor:pointer;text-align:left}
.dig-menu button:hover{background:var(--dig-hover)}
.dig-menu button.dig-danger{color:var(--dig-danger)}
.dig-toast{position:fixed;left:50%;bottom:32px;transform:translateX(-50%);z-index:1003;background:var(--dig-fg);color:var(--dig-bg);border-radius:8px;padding:8px 14px;font-size:13px;box-shadow:var(--dig-elev)}
.dig-prompts{padding:8px 24px 24px;display:flex;flex-direction:column;gap:8px;max-width:960px;width:100%;margin:0 auto}
.dig-prompt-row{display:flex;gap:12px;align-items:flex-start;padding:12px 14px;border-radius:10px;border:.5px solid var(--dig-border-soft)}
.dig-prompt-row:hover{background:var(--dig-hover)}
.dig-prompt-text{flex:1;min-width:0;white-space:pre-wrap;word-break:break-word;font-size:13px}
/* settings */
.dig-settings{display:flex;min-height:520px;height:100%;border:.5px solid var(--dig-border-soft);border-radius:12px;overflow:hidden;background:var(--dig-bg)}
.dig-settings-list{width:220px;flex:none;border-right:.5px solid var(--dig-border-soft);background:var(--dig-side);display:flex;flex-direction:column;min-height:0}
.dig-settings-list .dig-proj{height:36px}
.dig-settings-detail{flex:1;min-width:0;padding:20px 24px 32px;display:flex;flex-direction:column;gap:18px}
.dig-settings-detail h2{margin:0;font-size:16px;font-weight:500;display:flex;align-items:center;gap:8px}
.dig-row{display:flex;gap:8px;align-items:center}
.dig-row>.dig-input,.dig-row>.dig-select{flex:1}
.dig-badge{font-size:11px;line-height:18px;padding:0 6px;border-radius:9px;background:var(--dig-hover);color:var(--dig-fg3);font-weight:400;flex:none}
.dig-badge-ok{background:color-mix(in srgb,#2fb36d 14%,transparent);color:#2a9d61}
.dig-dot{width:6px;height:6px;border-radius:3px;background:var(--dig-caption);flex:none}
.dig-dot-ok{background:#2fb36d}
.dig-switch{position:relative;width:34px;height:20px;flex:none;border-radius:10px;border:0;background:var(--dig-border);cursor:pointer;padding:0;transition:background .15s}
.dig-switch::after{content:"";position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:8px;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.2);transition:transform .15s}
.dig-switch[aria-checked=true]{background:var(--dig-accent)}
.dig-switch[aria-checked=true]::after{transform:translateX(14px);background:var(--dig-accent-ink)}
.dig-test-result{font-size:12px;line-height:18px}
.dig-test-ok{color:#2a9d61}
.dig-test-fail{color:var(--dig-danger)}
.dig-savebar{position:sticky;bottom:0;display:flex;align-items:center;gap:8px;padding:10px 14px;border-radius:10px;background:var(--dig-side);border:.5px solid var(--dig-border)}
.dig-divider{height:.5px;background:var(--dig-border-soft);margin:2px 0}
.dig-card-chat{display:flex;flex-wrap:wrap;gap:8px;margin:4px 0}
.dig-chat-img{position:relative;border-radius:10px;overflow:hidden;background:var(--dig-layer);border:.5px solid var(--dig-border-soft);max-width:min(420px,100%);cursor:zoom-in}
.dig-chat-img img{display:block;max-width:100%;max-height:420px;object-fit:contain}
.dig-chat-meta{font-size:12px;color:var(--dig-fg3);margin-top:4px;display:flex;gap:8px;align-items:center;flex-wrap:wrap}
@media (max-width:900px){.dig-history{display:none}.dig-side{width:232px}}
@media (max-width:640px){.dig-head{grid-template-columns:minmax(0,1fr) auto;gap:8px;padding:10px 12px}.dig-head>.dig-tabs{grid-column:1/-1;grid-row:2}.dig-head>.dig-icon-btn{grid-column:2;grid-row:1}.dig-body{flex-direction:column}.dig-side{width:100%;max-height:42vh;border-right:0;border-bottom:.5px solid var(--dig-border-soft)}.dig-lightbox{flex-direction:column}.dig-lightbox-info{width:100%;max-height:45vh}.dig-settings{flex-direction:column}.dig-settings-list{width:100%;max-height:200px}}
`;
		//#endregion
		//#region lib/types/client/index.js
		/** Panel id shared by the sidebar entry and its `main` page. */
		const PANEL_ID = "copylee-image-gen.paintings";
		const inject = ["slots", "locale"];
		function PaintingsIcon({ size }) {
			return (0, react_jsx_runtime.jsx)(Palette, {
				size: size ?? 16,
				strokeWidth: 1.6
			});
		}
		function SettingsCard(props) {
			const t = useT(props.locale);
			return (0, react_jsx_runtime.jsx)("div", {
				style: {
					height: "100%",
					minHeight: 560
				},
				children: (0, react_jsx_runtime.jsx)(SettingsPanel, { t })
			});
		}
		function apply(ctx) {
			const locale = ctx.get("locale");
			const label = () => translator(langOf(locale))("panel");
			ctx.effect(() => installAccent(), `${PLUGIN_SLUG}: accent colour`);
			ctx.effect(() => {
				const style = document.createElement("style");
				style.dataset.plugin = PLUGIN_SLUG;
				style.textContent = STYLE;
				document.head.appendChild(style);
				return () => style.remove();
			}, `${PLUGIN_SLUG}: styles`);
			const slots = ctx.slots;
			const register = slots.register.bind(slots);
			const seat = slots.inject.bind(slots);
			seat("main", () => register({
				name: "main",
				key: PANEL_ID,
				inject: () => ({ locale })
			}, PaintingsPage));
			seat("sidebar.panellist", () => register({
				name: "sidebar.panellist",
				id: PANEL_ID,
				order: 20,
				label
			}, PaintingsIcon));
			seat("settings.plugins.tab", () => register({
				name: "settings.plugins.tab",
				id: PLUGIN_SLUG,
				order: 30,
				label: () => langOf(locale) === "zh" ? "图像生成" : "Image generation",
				inject: () => ({ locale })
			}, SettingsCard));
			seat("settings.plugin.item", () => register({
				name: "settings.plugin.item",
				key: PLUGIN_SLUG,
				inject: () => ({ locale })
			}, SettingsCard));
			for (const tool of [
				"paint_image",
				"paint_images",
				"edit_painting"
			]) seat("tool.call.toolview", () => register({
				name: "tool.call.toolview",
				key: tool,
				inject: () => ({ locale })
			}, ImageToolCard));
		}
		//#endregion
		exports.PANEL_ID = PANEL_ID;
		exports.PaintingsPage = PaintingsPage;
		exports.SettingsPanel = SettingsPanel;
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map