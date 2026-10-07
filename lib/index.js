import { createRequire } from "node:module";
import z from "@deepseek-ai/schemastery";
import { Context, Service } from "@deepseek-ai/cordis";
import { homedir } from "node:os";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, realpath, rename, stat, unlink, writeFile } from "node:fs/promises";
import { connect } from "node:tls";
import { execFile, spawn } from "node:child_process";
//#region node_modules/.pnpm/@deepseek-ai+dsh-typert-protocol@0.2.0-rc.2_@deepseek-ai+cordis@4.0.4/node_modules/@deepseek-ai/dsh-typert-protocol/lib/index.js
/** The one Remote failure class shared by owners, the Gateway, and consumers. */
/**
* One Remote call failure: a real Error carrying its stable code and typed
* details. Owners throw it at the failure point; the Host Gateway encodes it
* onto the wire unchanged; the Client face rebuilds an instance for the
* `RemoteResult` error branch, so `throw result.error` keeps throw semantics.
* Discrimination is always by `code`, never by instanceof.
*/
var RemoteError = class extends Error {
	code;
	details;
	/** Structural marker: cross-realm/bundle identification never uses instanceof. */
	isDSHRemoteError = true;
	/**
	* @param code - stable failure code declared in {@link RemoteErrorDetailsMap}.
	* @param message - human diagnostic carried across the wire.
	* @param details - structured payload typed by the code.
	* @param options - standard Error options (`cause` survives in-process only).
	*/
	constructor(code, message, details, options) {
		super(message, options);
		this.code = code;
		this.details = details;
		this.name = "RemoteError";
	}
};
/**
* Remote decorators and explicit Gateway bindings backed by versioned
* descriptors carried on decorated class prototypes. Strict reflection
* remains a Typert compiler responsibility.
* @module @deepseek-ai/dsh-typert-protocol
*/
const TYPERT_REMOTE_SEGMENT_PATTERN = /^[A-Za-z0-9_$.-]+$/;
/**
* Test one generated Remote name against the Connection endpoint grammar.
* @param value - namespace, method, lookup, or Context segment.
* @returns whether the value can cross the shared RPC carrier unchanged.
*/
function isTypertRemoteSegment(value) {
	return value !== "." && value !== ".." && TYPERT_REMOTE_SEGMENT_PATTERN.test(value);
}
const REMOTE_METHOD_DESCRIPTOR = "@deepseek-ai/dsh-typert-protocol/remote-methods";
/**
* Bind one visible Service field to a Cordis key and Remote namespace. A
* service that owns a Cordis Context also gives its tree `ctx.invocation`,
* `undefined` outside a Remote call, so no `TypertRemoteService` is needed for
* a Host composition to read it.
* @param service - owning Service instance, normally `this`.
* @param serviceKey - exact Cordis service key.
* @param options - optional distinct wire namespace.
* @returns a frozen, inspectable binding with no compiler-injected metadata.
*/
function bindTypertRemote(service, serviceKey, options = {}) {
	validateName("service key", serviceKey);
	const namespace = options.namespace ?? serviceKey;
	validateName("namespace", namespace);
	const ctx = Reflect.get(service, "ctx");
	if (ctx instanceof Context) provideInvocationAccessor(ctx);
	return Object.freeze({
		service,
		serviceKey,
		namespace
	});
}
/** Cordis Service base that exposes its registered name through Typert Gateway. */
var TypertRemoteService = class extends Service {
	/** Visible binding consumed by the Gateway's source-mode discovery. */
	typertRemote;
	/**
	* Register the Service and bind the same key to Typert Gateway.
	* @param ctx - owning Cordis Context.
	* @param serviceKey - exact Cordis service key and default wire namespace.
	* @param options - optional distinct wire namespace.
	*/
	constructor(ctx, serviceKey, options = {}) {
		super(ctx, serviceKey);
		this.typertRemote = bindTypertRemote(this, this.name, options);
	}
};
/**
* Make `ctx.invocation` read as `undefined` outside a Remote call instead of the
* reflect service's "cannot get property" error; a call-derived Context shadows
* the accessor with its own property. The first Remote Service constructed in a
* tree registers it on the root, where it outlives any one Service.
*/
function provideInvocationAccessor(ctx) {
	if (Object.hasOwn(ctx.root.reflect.props, "invocation")) return;
	ctx.root.accessor("invocation", { get: () => void 0 });
}
function Remote(methodExportOrOptions, context) {
	if (typeof methodExportOrOptions === "string") {
		validateName("Remote export name", methodExportOrOptions);
		return remoteDecorator({ kind: "direct" }, void 0, methodExportOrOptions);
	}
	if (typeof methodExportOrOptions === "object") {
		if (remoteOptionMode(methodExportOrOptions) !== "stream" || Reflect.ownKeys(methodExportOrOptions).length !== 1) throw new TypeError("typert-protocol: Remote options must contain exactly mode: \"stream\"");
		return remoteDecorator({ kind: "direct" }, "stream");
	}
	if (context === void 0) throw new TypeError("typert-protocol: Remote decorator context is missing");
	addMarkerInitializer(context, { kind: "direct" });
}
function remoteOptionMode(options) {
	return Reflect.get(options, "mode");
}
function remoteDecorator(invocation, mode, exportName) {
	return function(_method, context) {
		addMarkerInitializer(context, invocation, mode, exportName);
	};
}
function readRemoteMethodDescriptor(prototype) {
	const property = Object.getOwnPropertyDescriptor(prototype, REMOTE_METHOD_DESCRIPTOR);
	if (property === void 0) return void 0;
	const descriptor = property.value;
	if (descriptor === null || typeof descriptor !== "object") throw new TypeError("typert-protocol: Remote method descriptor must be an object");
	const version = Reflect.get(descriptor, "version");
	if (version !== 1) throw new TypeError(`typert-protocol: unsupported Remote method descriptor version ${String(version)}`);
	const methods = Reflect.get(descriptor, "methods");
	if (!Array.isArray(methods)) throw new TypeError("typert-protocol: Remote method descriptor methods must be an array");
	return descriptor;
}
function addMarkerInitializer(context, invocation, mode, exportName) {
	if (context.private || context.static || typeof context.name !== "string") throw new TypeError("typert-protocol: Remote decorators require a public instance method with a string name");
	const method = context.name;
	context.addInitializer(function() {
		const prototype = Object.getPrototypeOf(this);
		if (prototype === null) throw new TypeError(`typert-protocol: cannot mark Remote method "${method}" on an object without a prototype`);
		mark(prototype, method, invocation, mode, exportName);
	});
}
function mark(prototype, method, invocation, mode, exportName) {
	const descriptor = readRemoteMethodDescriptor(prototype);
	const marker = Object.freeze({
		method,
		...exportName === void 0 || exportName === method ? {} : { exportName },
		...mode === void 0 ? {} : { mode },
		invocation: Object.freeze(invocation)
	});
	const current = descriptor?.methods.find((candidate) => candidate.method === method);
	if (current !== void 0) {
		if (current.exportName === marker.exportName && current.mode === marker.mode && sameInvocation(current.invocation, invocation)) return;
		throw new Error(`typert-protocol: Remote method "${method}" has conflicting invocation markers`);
	}
	Object.defineProperty(prototype, REMOTE_METHOD_DESCRIPTOR, {
		configurable: true,
		value: Object.freeze({
			version: 1,
			methods: Object.freeze([...descriptor?.methods ?? [], marker])
		})
	});
}
function sameInvocation(left, right) {
	if (left.kind === "direct") return right.kind === "direct";
	if (right.kind === "direct") return false;
	return left.context === right.context;
}
function validateName(subject, value) {
	if (!isTypertRemoteSegment(value)) throw new TypeError(`typert-protocol: ${subject} must contain only RPC endpoint segment characters`);
}
//#endregion
//#region node_modules/.pnpm/@deepseek-ai+dsh-util-values@0.2.0-rc.2_@deepseek-ai+cordis@4.0.4/node_modules/@deepseek-ai/dsh-util-values/lib/index.js
/** Duplicate-install-safe JSON and immutable-value helpers. @module @deepseek-ai/dsh-util-values */
/**
* Mark an unreachable closed-union branch.
* @param value - impossible value; an unhandled typed variant fails at the call site.
* @param context - optional switch-site label included in the failure message.
* @returns never; a runtime value that escaped its type always throws.
*/
function assertNever$1(value, context) {
	const rendered = JSON.stringify(value) ?? String(value);
	throw new Error(`unreachable variant${context ? ` in ${context}` : ""}: ${rendered}`);
}
/** Whether a realm-owned intrinsic prototype has a native constructor matching this engine's representation. */
function hasIntrinsicConstructor$1(prototype, name) {
	const constructor = Object.getOwnPropertyDescriptor(prototype, "constructor")?.value;
	if (typeof constructor !== "function") return false;
	try {
		return constructor.name === name && constructor.prototype === prototype && Function.prototype.toString.call(constructor) === Function.prototype.toString.call(name === "Array" ? Array : Object);
	} catch {
		return false;
	}
}
/** Whether a candidate is one realm's intrinsic `Object.prototype`. */
function isIntrinsicObjectPrototype$1(value) {
	return Object.getPrototypeOf(value) === null && hasIntrinsicConstructor$1(value, "Object");
}
/** Whether an array uses one realm's intrinsic `Array.prototype`, not a subclass or forged prototype. */
function hasPlainArrayPrototype$1(value) {
	const prototype = Object.getPrototypeOf(value);
	if (!Array.isArray(prototype) || !hasIntrinsicConstructor$1(prototype, "Array")) return false;
	const objectPrototype = Object.getPrototypeOf(prototype);
	return typeof objectPrototype === "object" && objectPrototype !== null && isIntrinsicObjectPrototype$1(objectPrototype);
}
/** Whether an object is a plain or null-prototype record from any JavaScript realm. */
function hasPlainObjectPrototype(value) {
	const prototype = Object.getPrototypeOf(value);
	return prototype === null || typeof prototype === "object" && isIntrinsicObjectPrototype$1(prototype);
}
/** Return every JSON-visible object key, or reject own data JSON would discard. */
function enumerableStringKeys(value) {
	const keys = Reflect.ownKeys(value);
	if (keys.some((key) => typeof key !== "string" || !Object.prototype.propertyIsEnumerable.call(value, key))) return void 0;
	return keys;
}
/** Validate lossless JSON iteratively, optionally materializing a detached snapshot. */
function walkJsonValue(value, detach) {
	const ancestors = /* @__PURE__ */ new Set();
	let root;
	const assign = (destination, item) => {
		if (destination === void 0) return;
		if (destination.kind === "root") root = item;
		else if (destination.kind === "array") destination.target[destination.index] = item;
		else Object.defineProperty(destination.target, destination.key, {
			value: item,
			enumerable: true,
			configurable: true,
			writable: true
		});
	};
	const tasks = [{
		kind: "visit",
		value,
		...detach ? { destination: { kind: "root" } } : {}
	}];
	for (let task = tasks.pop(); task !== void 0; task = tasks.pop()) {
		if (task.kind === "leave") {
			ancestors.delete(task.source);
			continue;
		}
		if (task.kind === "array-item") {
			if (!Object.prototype.hasOwnProperty.call(task.source, task.index)) return void 0;
			tasks.push({
				kind: "visit",
				value: task.source[task.index],
				...task.target === void 0 ? {} : { destination: {
					kind: "array",
					target: task.target,
					index: task.index
				} }
			});
			continue;
		}
		if (task.kind === "object-property") {
			tasks.push({
				kind: "visit",
				value: task.source[task.key],
				...task.target === void 0 ? {} : { destination: {
					kind: "object",
					target: task.target,
					key: task.key
				} }
			});
			continue;
		}
		const current = task.value;
		if (current === null) {
			assign(task.destination, null);
			continue;
		}
		if (typeof current === "boolean" || typeof current === "string") {
			assign(task.destination, current);
			continue;
		}
		if (typeof current === "number") {
			if (!Number.isFinite(current) || Object.is(current, -0)) return void 0;
			assign(task.destination, current);
			continue;
		}
		if (typeof current !== "object") return void 0;
		if (ancestors.has(current)) return void 0;
		if (Array.isArray(current)) {
			if (!hasPlainArrayPrototype$1(current)) return void 0;
			const length = current.length;
			if (Reflect.ownKeys(current).length !== length + 1) return void 0;
			const target = detach ? [] : void 0;
			if (target !== void 0) assign(task.destination, target);
			ancestors.add(current);
			tasks.push({
				kind: "leave",
				source: current
			});
			for (let index = length - 1; index >= 0; index--) tasks.push({
				kind: "array-item",
				source: current,
				index,
				...target === void 0 ? {} : { target }
			});
			continue;
		}
		if (!hasPlainObjectPrototype(current)) return void 0;
		const keys = enumerableStringKeys(current);
		if (keys === void 0) return void 0;
		const target = detach ? {} : void 0;
		if (target !== void 0) assign(task.destination, target);
		ancestors.add(current);
		tasks.push({
			kind: "leave",
			source: current
		});
		for (let index = keys.length - 1; index >= 0; index--) {
			const key = keys[index];
			/* v8 ignore next -- the loop is bounded by the captured key count. */
			if (key === void 0) return void 0;
			tasks.push({
				kind: "object-property",
				source: current,
				key,
				...target === void 0 ? {} : { target }
			});
		}
	}
	return detach ? root : true;
}
/**
* Validate and detach lossless JSON in one read per property.
* @param value - candidate value to validate and detach.
* @returns the detached snapshot, or `undefined` when the value is not losslessly JSON-serializable.
*/
function snapshotJsonValue(value) {
	return walkJsonValue(value, true);
}
/**
* Test the same lossless JSON rules as {@link snapshotJsonValue} without detaching the value.
* @param value - candidate value to test.
* @returns whether the value survives a JSON round trip without loss.
*/
function isJsonValue(value) {
	return walkJsonValue(value, false) === true;
}
/**
* Deep-freeze an object graph in place while leaving live AbortSignal objects mutable.
* @param value - value to freeze.
* @returns the same value after every reachable enumerable child is frozen.
*/
function deepFreeze(value) {
	const seen = /* @__PURE__ */ new WeakSet();
	const pending = [{
		kind: "visit",
		node: value
	}];
	while (pending.length > 0) {
		const task = pending.pop();
		/* v8 ignore next -- the loop condition guarantees one pending task. */
		if (task === void 0) continue;
		if (task.kind === "property") {
			pending.push({
				kind: "visit",
				node: task.source[task.key]
			});
			continue;
		}
		const node = task.node;
		if (node === null || typeof node !== "object") continue;
		if (node instanceof AbortSignal) continue;
		if (seen.has(node)) continue;
		seen.add(node);
		Object.freeze(node);
		const keys = Object.keys(node);
		for (let index = keys.length - 1; index >= 0; index--) {
			const key = keys[index];
			/* v8 ignore next -- the loop is bounded by the captured key count. */
			if (key === void 0) continue;
			pending.push({
				kind: "property",
				source: node,
				key
			});
		}
	}
	return value;
}
//#endregion
//#region node_modules/.pnpm/@deepseek-ai+dsh-util-crypto@0.2.0-rc.2_@deepseek-ai+cordis@4.0.4/node_modules/@deepseek-ai/dsh-util-crypto/lib/index.js
/**
* Random v4 UUID, minted from `crypto.getRandomValues`.
* @returns the UUID string.
*/
function randomUUID$1() {
	const bytes = globalThis.crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16));
	const hex = Array.from(bytes, (byte, index) => {
		return (index === 6 ? byte & 15 | 64 : index === 8 ? byte & 63 | 128 : byte).toString(16).padStart(2, "0");
	}).join("");
	return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
//#endregion
//#region node_modules/.pnpm/@deepseek-ai+dsh-brand@0.2.0-rc.2_@deepseek-ai+cordis@4.0.4/node_modules/@deepseek-ai/dsh-brand/lib/index.js
/**
* Duplicate-install-safe nominal primitive helpers.
*
* A brand makes structurally identical strings or numbers non-interchangeable
* at the type level: a `SessionId` cannot be passed where a `ToolCallId` is
* expected, and an event sequence cannot be passed as a log offset. Comparison,
* logging, and serialization retain the underlying primitive behavior.
*
* This package owns no concrete domain value and keeps no runtime identity or mutable
* state, so independently installed copies produce interchangeable values.
*
* @module @deepseek-ai/dsh-brand
*/
/**
* Apply a compile-time string brand without changing the value.
* @param value - string admitted by the domain that owns the target brand.
* @returns the same string with the requested compile-time brand.
*/
function brandString(value) {
	return value;
}
//#endregion
//#region node_modules/.pnpm/@deepseek-ai+dsh-timeout@0.2.0-rc.2_@deepseek-ai+cordis@4.0.4/node_modules/@deepseek-ai/dsh-timeout/lib/index.js
/** Largest delay Node schedules without clamping it to one millisecond. */
const MAX_TIMER_DELAY_MS = 2147483647;
//#endregion
//#region node_modules/.pnpm/@deepseek-ai+dsh-llm@0.2.0-rc.2_@deepseek-ai+cordis@4.0.4/node_modules/@deepseek-ai/dsh-llm/lib/index.js
/**
* Detach and deep-freeze a message whose identity already exists.
* @param message - complete message, including its stable identity.
* @returns an immutable snapshot that preserves the identity.
*/
function freezeMessage(message) {
	return deepFreeze(structuredClone(message));
}
/**
* Create one identified message and freeze it before publication.
* @param input - complete role, content, and source for a new message.
* @returns an immutable message with a fresh stable identity.
*/
function createMessage(input) {
	return deepFreeze(structuredClone({
		...input,
		id: brandString(randomUUID$1())
	}));
}
/**
* Create one identified user-role message and freeze it before publication.
* @param input - complete content and source for a new user message.
* @returns an immutable user message with a fresh stable identity.
*/
function createUserMessage(input) {
	return createMessage({
		...input,
		role: "user"
	});
}
/**
* Harness error base with a stable machine-routable code and chained cause.
* Package errors extend it so tool results and replay can retain failure class.
* @module @deepseek-ai/dsh-llm/error
*/
/**
* Base class for all harness errors. Carries a `code` (stable, programmatic —
* e.g. `NO_ADAPTER`, `INVALID_ARGS`, `INVARIANT`) distinct from the
* human-readable `message`, and supports `cause` chaining via the standard
* `ErrorOptions`. `name` defaults to the subclass constructor name.
*/
var HarnessError = class extends Error {
	/** Stable machine-routable failure class (e.g. `RATE_LIMIT`); route on this, never by parsing `message`. */
	code;
	constructor(message, code, options) {
		super(message, options);
		this.code = code;
		this.name = new.target.name;
	}
};
/**
* Canonical provider-neutral code for a response that completed normally but
* carried no content blocks at all. Providers occasionally emit a degenerate
* completion (a terminal stop with zero output); adapters classify it as this
* failure instead of yielding an empty assistant message, because an empty
* message silently ends the turn with nothing for the user or the loop to act
* on. The attempt produced nothing durable, so retry policy treats it as safe
* to repeat.
*/
const EMPTY_RESPONSE_CODE = "EMPTY_RESPONSE";
new RegExp(String.raw`(?:^|[^a-z0-9])context[\s_-](?:length|window)[\s_-]` + String.raw`(?:exceed(?:ed|s)?|overflow(?:ed)?|limit[\s_-]exceeded)(?:$|[^a-z0-9])`, "i");
new RegExp(String.raw`\b(?:request|prompt|input|messages?)\s+(?:is\s+|are\s+)?` + String.raw`too\s+(?:large|long)\s+for\s+(?:(?:this|the)\s+)?` + String.raw`(?:model(?:'s)?\s+)?context(?:\s+window)?\b`, "i");
new RegExp(String.raw`\b(?:input|prompt|request|messages?)\b.{0,40}` + String.raw`\b(?:exceed(?:s|ed)?|overflows?|is\s+larger\s+than)\b.{0,40}` + String.raw`\b(?:the\s+)?(?:model(?:'s)?\s+)?context(?:\s+(?:length|window))?\b`, "i");
/**
* Provider-owned request-retry policy configuration and resolution.
*
* Adapters expose one resolved policy per registered provider route; the
* optional dsh-llm-retry plugin executes it on the agent's failed-step extension point.
*
* @module @deepseek-ai/dsh-llm/retry-policy
*/
const DEFAULT_MAX_RETRIES = 5;
const DEFAULT_INITIAL_DELAY_MS = 500;
const DEFAULT_MAX_DELAY_MS = 1e4;
const DEFAULT_JITTER_RATIO = .1;
const DEFAULT_RETRYABLE_CODES = Object.freeze([
	EMPTY_RESPONSE_CODE,
	"RATE_LIMIT",
	"SERVER",
	"TIMEOUT",
	"TRANSPORT"
]);
const backoffSchema = z.object({
	initialDelayMs: z.number().max(MAX_TIMER_DELAY_MS).default(DEFAULT_INITIAL_DELAY_MS),
	maxDelayMs: z.number().max(MAX_TIMER_DELAY_MS).default(DEFAULT_MAX_DELAY_MS),
	jitterRatio: z.number().min(0).max(1).default(DEFAULT_JITTER_RATIO)
});
const normalPolicySchema = z.object({
	mode: z.const("normal").required(),
	maxRetries: z.number().step(1).min(0).max(Number.MAX_SAFE_INTEGER).default(DEFAULT_MAX_RETRIES),
	retryableCodes: z.array(z.string()).default([...DEFAULT_RETRYABLE_CODES]),
	backoff: backoffSchema
});
const alwaysPolicySchema = z.object({
	mode: z.const("always").required(),
	backoff: backoffSchema
});
z.union([normalPolicySchema, alwaysPolicySchema]);
const NORMAL_POLICY_KEYS = /* @__PURE__ */ new Set([
	"mode",
	"maxRetries",
	"retryableCodes",
	"backoff"
]);
const ALWAYS_POLICY_KEYS = /* @__PURE__ */ new Set([
	"mode",
	"maxRetries",
	"retryableCodes",
	"backoff"
]);
const BACKOFF_KEYS = /* @__PURE__ */ new Set([
	"initialDelayMs",
	"maxDelayMs",
	"jitterRatio"
]);
function validateKeys(value, allowed, path) {
	for (const key of Object.keys(value)) if (!allowed.has(key)) throw new Error(`${path}: unknown key "${key}"`);
}
function resolveBackoff(config, path) {
	if (config !== void 0) validateKeys(config, BACKOFF_KEYS, path);
	const initialDelayMs = config?.initialDelayMs ?? DEFAULT_INITIAL_DELAY_MS;
	const maxDelayMs = config?.maxDelayMs ?? DEFAULT_MAX_DELAY_MS;
	const jitterRatio = config?.jitterRatio ?? DEFAULT_JITTER_RATIO;
	if (!Number.isFinite(initialDelayMs) || initialDelayMs <= 0 || initialDelayMs > 2147483647) throw new Error(`${path}.initialDelayMs must be a positive finite number no greater than ${MAX_TIMER_DELAY_MS}`);
	if (!Number.isFinite(maxDelayMs) || maxDelayMs <= 0 || maxDelayMs > 2147483647) throw new Error(`${path}.maxDelayMs must be a positive finite number no greater than ${MAX_TIMER_DELAY_MS}`);
	if (initialDelayMs > maxDelayMs) throw new Error(`${path}.initialDelayMs must be less than or equal to maxDelayMs`);
	if (!Number.isFinite(jitterRatio) || jitterRatio < 0 || jitterRatio > 1) throw new Error(`${path}.jitterRatio must be between 0 and 1`);
	return Object.freeze({
		initialDelayMs,
		maxDelayMs,
		jitterRatio
	});
}
/**
* Validate, default, and detach one provider-owned retry policy.
* @param config - optional provider configuration; omission selects normal defaults.
* @param path - diagnostic path naming the provider config that owns the value.
* @returns an immutable policy safe to capture in provider registration state.
*/
function resolveRetryPolicy(config, path) {
	if (config === void 0) return Object.freeze({
		mode: "normal",
		maxRetries: DEFAULT_MAX_RETRIES,
		retryableCodes: DEFAULT_RETRYABLE_CODES,
		...resolveBackoff(void 0, `${path}.backoff`)
	});
	switch (config.mode) {
		case "normal": {
			validateKeys(config, NORMAL_POLICY_KEYS, path);
			const maxRetries = config.maxRetries ?? DEFAULT_MAX_RETRIES;
			const retryableCodes = config.retryableCodes ?? [...DEFAULT_RETRYABLE_CODES];
			if (!Number.isSafeInteger(maxRetries) || maxRetries < 0) throw new Error(`${path}.maxRetries must be a non-negative safe integer`);
			if (retryableCodes.length === 0) throw new Error(`${path}.retryableCodes must not be empty`);
			if (retryableCodes.some((code) => typeof code !== "string" || code.length === 0)) throw new Error(`${path}.retryableCodes must contain only non-empty strings`);
			if (new Set(retryableCodes).size !== retryableCodes.length) throw new Error(`${path}.retryableCodes must not contain duplicates`);
			return Object.freeze({
				mode: "normal",
				maxRetries,
				retryableCodes: Object.freeze([...retryableCodes]),
				...resolveBackoff(config.backoff, `${path}.backoff`)
			});
		}
		case "always":
			validateKeys(config, ALWAYS_POLICY_KEYS, path);
			return Object.freeze({
				mode: "always",
				...resolveBackoff(config.backoff, `${path}.backoff`)
			});
		default: throw new Error(`${path}.mode must be "normal" or "always"`);
	}
}
/**
* Field-wise equality over {@link LlmCallConfig} — the comparison a caller
* runs to decide whether a proposed configuration is a real change (worth a
* logged header snapshot) or the held one restated.
* @param a - one configuration.
* @param b - the other.
* @returns whether every field (including the `stop` list, element-wise) matches.
*/
function callConfigEquals(a, b) {
	if (a.provider !== b.provider || a.model !== b.model || a.reasoningEffort !== b.reasoningEffort || a.temperature !== b.temperature || a.maxTokens !== b.maxTokens) return false;
	if (a.stop === void 0 || b.stop === void 0) return a.stop === b.stop;
	return a.stop.length === b.stop.length && a.stop.every((s, i) => s === b.stop?.[i]);
}
/**
* Normalization for values thrown by a final LLM adapter boundary.
*
* @module @deepseek-ai/dsh-llm/adapter-failure
*/
/**
* Detach serializable provider facts from a value thrown by an adapter.
* @param value - arbitrary value thrown during adapter dispatch or iteration.
* @returns immutable provider-neutral facts suitable for a terminal finish chunk.
* @internal
*/
function normalizeLlmFailure(value) {
	const error = value instanceof Error ? value : new HarnessError(thrownMessage(value), "UNKNOWN", { cause: value });
	const carried = ownFailureSnapshot(error);
	if (carried !== void 0 && carried.code === ownErrorCode(error)) return carried;
	return Object.freeze({
		message: errorMessage$1(error),
		code: harnessErrorCode(error)
	});
}
/** Render a non-Error throw without letting hostile coercion escape normalization. */
function thrownMessage(value) {
	try {
		const message = String(value);
		return message.length > 0 ? message : "LLM adapter failed";
	} catch (_hostileThrownValue) {
		return "LLM adapter failed";
	}
}
/** Read a foreign error's own data-backed `code` without invoking accessors. */
function ownErrorCode(error) {
	try {
		const descriptor = Object.getOwnPropertyDescriptor(error, "code");
		return descriptor !== void 0 && "value" in descriptor ? descriptor.value : void 0;
	} catch (_sdkPropertyTrap) {
		return;
	}
}
/** Snapshot an own data property without invoking an SDK-defined accessor. */
function ownFailureSnapshot(error) {
	try {
		const descriptor = Object.getOwnPropertyDescriptor(error, "failure");
		return descriptor !== void 0 && "value" in descriptor ? failureSnapshot(descriptor.value) : void 0;
	} catch (_sdkPropertyTrap) {
		return;
	}
}
/** Validate and detach an arbitrary serializable failure payload. */
function failureSnapshot(value) {
	if (typeof value !== "object" || value === null) return void 0;
	try {
		const candidate = value;
		const message = candidate.message;
		const code = candidate.code;
		const status = candidate.status;
		const providerRetryAfterMs = candidate.providerRetryAfterMs;
		const requestId = candidate.requestId;
		const offloadImages = candidate.offloadImages;
		if (typeof message !== "string" || message.length === 0 || typeof code !== "string" || code.length === 0 || status !== void 0 && (!Number.isInteger(status) || status < 100 || status > 599) || providerRetryAfterMs !== void 0 && (!Number.isFinite(providerRetryAfterMs) || providerRetryAfterMs <= 0) || requestId !== void 0 && (typeof requestId !== "string" || requestId.length === 0) || offloadImages !== void 0 && (!Number.isSafeInteger(offloadImages) || offloadImages <= 0)) return void 0;
		return Object.freeze({
			message,
			code,
			...status === void 0 ? {} : { status },
			...providerRetryAfterMs === void 0 ? {} : { providerRetryAfterMs },
			...requestId === void 0 ? {} : { requestId },
			...offloadImages === void 0 ? {} : { offloadImages }
		});
	} catch (_sdkFailureGetter) {
		return;
	}
}
/** Read an SDK error message without letting an accessor replace the primary failure. */
function errorMessage$1(error) {
	try {
		const message = error.message;
		if (typeof message === "string" && message.length > 0) return message;
	} catch (_sdkMessageGetter) {}
	return "LLM adapter failed";
}
/** Trust only Harness-owned codes; third-party SDK codes are not our taxonomy. */
function harnessErrorCode(error) {
	return error instanceof HarnessError ? error.code : "UNKNOWN";
}
function quoted(value) {
	return JSON.stringify(value);
}
/**
* Stable text shown to a model that cannot accept one durable image reference.
* @param ref - durable normalized attachment omitted from the request.
* @returns deterministic text-only placeholder.
*/
function textOnlyImageText(ref) {
	return `[image omitted because this model accepts text only; attachment sha256:${String(ref.attachmentId).slice(7, 15)}]`;
}
/**
* True when typed model content contains an image block. This is the one image
* walk shared by every image policy (capability gating, text-only
* serialization, compaction survey), so a consumer cannot silently diverge.
* @param content - typed model content blocks.
* @returns whether any block is an image.
*/
function contentHasImage(content) {
	return content.some((block) => block.type === "image");
}
/**
* True when typed model content contains a file block.
* Reads current content on every call without retaining scan results.
* @param content - typed model content blocks.
* @returns whether any block is a file.
*/
function contentHasFile(content) {
	for (const block of content) if (block.type === "file") return true;
	return false;
}
/**
* Stable model-facing handle for one durable file reference: the address of
* the verbatim stored copy and the instruction to read it on demand. This is
* the only representation a provider ever receives for a file.
* @param ref - durable verbatim file reference.
* @param readonlyPath - execution-world path of the stored copy, when resolvable.
* @returns deterministic handle text naming the file, its size, and its address.
*/
function fileHandleText(ref, readonlyPath) {
	const digest = String(ref.attachmentId).slice(7, 15);
	const identity = `File ${quoted(ref.name)} (${ref.bytes} bytes, sha256:${digest})`;
	if (readonlyPath === void 0) return `[${identity} was uploaded, but the current execution environment cannot access a readable path. Report that limitation if its contents are needed; do not claim to have read it.]`;
	return `[${identity}: verbatim read-only copy saved at ${quoted(readonlyPath)}. Read that path with your file tools when its contents are needed; copy it to a writable location before modifying it. When delegating file work, include this saved path in the delegation prompt; only subagents sharing this execution environment can read it.]`;
}
/** Replace every file occurrence with handle text. */
function replaceFilesWithHandles(blocks, resolvePath) {
	let next;
	for (const [index, block] of blocks.entries()) {
		if (block.type === "file") {
			next ??= blocks.slice(0, index);
			next.push({
				type: "text",
				text: fileHandleText(block.attachment, resolvePath(block.attachment))
			});
			continue;
		}
		next?.push(block);
	}
	return next ?? blocks;
}
function projectFilesToText(messages, resolvePath) {
	if (!messages.some((message) => contentHasFile(message.content))) return messages;
	return messages.map((message) => {
		const content = replaceFilesWithHandles(message.content, resolvePath);
		return content === message.content ? message : {
			...message,
			content
		};
	});
}
/** Replace every image occurrence for a text-only model. */
function replaceImagesForTextModel(blocks) {
	let next;
	for (const [index, block] of blocks.entries()) {
		if (block.type === "image") {
			next ??= blocks.slice(0, index);
			next.push({
				type: "text",
				text: textOnlyImageText(block.attachment)
			});
			continue;
		}
		next?.push(block);
	}
	return next ?? blocks;
}
function projectImagesForTextModel(messages) {
	if (!messages.some((message) => contentHasImage(message.content))) return messages;
	return messages.map((message) => {
		const content = replaceImagesForTextModel(message.content);
		return content === message.content ? message : {
			...message,
			content
		};
	});
}
function withoutDeveloperMessages(messages) {
	const retained = messages.filter((message) => message.role !== "developer");
	return retained.length === messages.length ? messages : retained;
}
function toolDeclarations(tools, mode, history) {
	const declarations = new Map(history.tools.map((tool) => [tool.name, tool]));
	for (const update of history.updates) for (const tool of update.additions) if (!declarations.has(tool.name)) declarations.set(tool.name, {
		...tool,
		deferLoading: true
	});
	switch (mode) {
		case "in-history": return declarations;
		case "addition-only": {
			const activeNames = new Set(tools?.map((tool) => tool.name));
			for (const name of declarations.keys()) if (!activeNames.has(name)) declarations.delete(name);
			return declarations;
		}
		/* v8 ignore next 2 -- closed-union exhaustiveness guard */
		default: return assertNever$1(mode);
	}
}
/**
* Construct provider declarations from session-folded history without changing logged active tools.
* Unsupported routes and incomplete history use current declarations without developer updates.
* Explicitly deferred baseline tools become available only after their first retained addition.
* @param messages - complete request inputs, or the prefix selected for an auxiliary call.
* @param tools - currently active tool schemas.
* @param toolUpdate - the resolved route's update mode.
* @param history - immutable state folded from committed headers and developer messages.
* @returns provider declarations and the corresponding filtered history.
*/
function projectToolUpdates(messages, tools, toolUpdate, history) {
	if (toolUpdate === void 0) {
		let immediateTools = tools;
		if (tools?.some((tool) => tool.deferLoading === true)) immediateTools = tools.map(({ deferLoading: _loading, ...tool }) => tool);
		return {
			messages: withoutDeveloperMessages(messages),
			tools: immediateTools
		};
	}
	if (history === void 0) return {
		messages: withoutDeveloperMessages(messages),
		tools
	};
	const messageIds = new Set(messages.flatMap((message) => message.role === "developer" ? [message.id] : []));
	if (history.updates.some((update) => !messageIds.has(update.messageId))) return {
		messages: withoutDeveloperMessages(messages),
		tools
	};
	const declarations = toolDeclarations(tools, toolUpdate, history);
	const updateIds = new Set(history.updates.map((update) => update.messageId));
	const offered = new Set(history.tools.filter((tool) => !tool.deferLoading).map((tool) => tool.name));
	const projectedMessages = [];
	for (const message of messages) {
		if (message.role !== "developer") {
			projectedMessages.push(message);
			continue;
		}
		if (!updateIds.has(message.id)) continue;
		const content = message.content.filter((block) => {
			switch (block.type) {
				case "tool-addition":
					if (!declarations.has(block.toolName) || offered.has(block.toolName)) return false;
					offered.add(block.toolName);
					return true;
				case "tool-removal":
					if (toolUpdate !== "in-history") return false;
					return offered.delete(block.toolName);
				default: return true;
			}
		});
		if (content.length === 0) continue;
		if (content.length === message.content.length) projectedMessages.push(message);
		else projectedMessages.push({
			...message,
			content
		});
	}
	return {
		messages: projectedMessages.length === messages.length && projectedMessages.every((message, index) => message === messages[index]) ? messages : projectedMessages,
		tools: [...declarations.values()]
	};
}
/**
* Centralize the non-secret product identity every provider request sends as `User-Agent`, keeping
* adapters from drifting. See
* `.agents/notes/implemented/architecture/2026-06-21-mandatory-app-attribution-headers.md`.
*
* App-attribution vocabulary for provider requests.
* @module @deepseek-ai/dsh-llm/attribution
*/
const { version } = createRequire(import.meta.url)("../package.json");
/**
* LLM service: adapter registry with a waterfall-interceptable streaming call
* API. Exports the `LlmRuntime` default, the abstract `LlmAdapter` for
* provider backends, and `BlockAssembler` for chunk assembly.
*
* @module @deepseek-ai/dsh-llm
*/
var __runInitializers = function(thisArg, initializers, value) {
	var useValue = arguments.length > 2;
	for (var i = 0; i < initializers.length; i++) value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
	return useValue ? value : void 0;
};
var __esDecorate = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
	function accept(f) {
		if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
		return f;
	}
	var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
	var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
	var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
	var _, done = false;
	for (var i = decorators.length - 1; i >= 0; i--) {
		var context = {};
		for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
		for (var p in contextIn.access) context.access[p] = contextIn.access[p];
		context.addInitializer = function(f) {
			if (done) throw new TypeError("Cannot add initializers after decoration has completed");
			extraInitializers.push(accept(f || null));
		};
		var result = (0, decorators[i])(kind === "accessor" ? {
			get: descriptor.get,
			set: descriptor.set
		} : descriptor[key], context);
		if (kind === "accessor") {
			if (result === void 0) continue;
			if (result === null || typeof result !== "object") throw new TypeError("Object expected");
			if (_ = accept(result.get)) descriptor.get = _;
			if (_ = accept(result.set)) descriptor.set = _;
			if (_ = accept(result.init)) initializers.unshift(_);
		} else if (_ = accept(result)) if (kind === "field") initializers.unshift(_);
		else descriptor[key] = _;
	}
	if (target) Object.defineProperty(target, contextIn.name, descriptor);
	done = true;
};
/**
* Typed error for LLM-related failures. Extends {@link HarnessError}, so the
* `code` string (e.g. `AUTH`, `RATE_LIMIT`, `NO_ADAPTER`) is shared taxonomy.
*/
var LlmError = class extends HarnessError {
	/** Serializable facts retained beside this live Error. */
	failure;
	/**
	* @param message - non-empty human-readable failure summary.
	* @param code - non-empty stable provider-neutral machine code.
	* @param options - optional cause and validated serializable provider facts.
	*/
	constructor(message, code, options) {
		if (typeof message !== "string" || message.length === 0) throw new Error("LlmError message must be a non-empty string");
		if (typeof code !== "string" || code.length === 0) throw new Error("LlmError code must be a non-empty string");
		if (options?.status !== void 0 && (!Number.isInteger(options.status) || options.status < 100 || options.status > 599)) throw new Error("LlmError status must be an integer from 100 through 599");
		if (options?.providerRetryAfterMs !== void 0 && (!Number.isFinite(options.providerRetryAfterMs) || options.providerRetryAfterMs <= 0)) throw new Error("LlmError providerRetryAfterMs must be a positive finite number");
		if (options?.requestId !== void 0 && (typeof options.requestId !== "string" || options.requestId.length === 0)) throw new Error("LlmError requestId must be a non-empty string");
		super(message, code, options);
		this.name = "LlmError";
		this.failure = Object.freeze({
			message,
			code,
			...options?.status === void 0 ? {} : { status: options.status },
			...options?.providerRetryAfterMs === void 0 ? {} : { providerRetryAfterMs: options.providerRetryAfterMs },
			...options?.requestId === void 0 ? {} : { requestId: options.requestId },
			...options?.offloadImages === void 0 ? {} : { offloadImages: options.offloadImages }
		});
	}
};
(() => {
	let _classSuper = TypertRemoteService;
	let _instanceExtraInitializers = [];
	let _listProviders_decorators;
	let _listConfigurableProviders_decorators;
	let _remoteDiscoverModels_decorators;
	return class LlmRuntime extends _classSuper {
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_listProviders_decorators = [Remote];
			_listConfigurableProviders_decorators = [Remote];
			_remoteDiscoverModels_decorators = [Remote("discoverModels")];
			__esDecorate(this, null, _listProviders_decorators, {
				kind: "method",
				name: "listProviders",
				static: false,
				private: false,
				access: {
					has: (obj) => "listProviders" in obj,
					get: (obj) => obj.listProviders
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _listConfigurableProviders_decorators, {
				kind: "method",
				name: "listConfigurableProviders",
				static: false,
				private: false,
				access: {
					has: (obj) => "listConfigurableProviders" in obj,
					get: (obj) => obj.listConfigurableProviders
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _remoteDiscoverModels_decorators, {
				kind: "method",
				name: "remoteDiscoverModels",
				static: false,
				private: false,
				access: {
					has: (obj) => "remoteDiscoverModels" in obj,
					get: (obj) => obj.remoteDiscoverModels
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			if (_metadata) Object.defineProperty(this, Symbol.metadata, {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _metadata
			});
		}
		adapters = (__runInitializers(this, _instanceExtraInitializers), /* @__PURE__ */ new Map());
		directory = /* @__PURE__ */ new Map();
		discoveries = /* @__PURE__ */ new Map();
		constructor(ctx) {
			super(ctx, "llm");
		}
		/** Notify topology observers without letting one broken listener veto the commit. */
		emitAdaptersUpdated() {
			let invariantFailure;
			for (const listener of this.ctx.events.dispatch("emit", ["llm/adapters-updated"])) try {
				const returned = listener();
				if (returned != null && typeof returned.then === "function") Promise.resolve(returned).then(void 0, (error) => {
					this.warnAdaptersListenerFailure(error);
				});
			} catch (error) {
				if (error?.code === "INVARIANT") {
					invariantFailure ??= error;
					continue;
				}
				this.warnAdaptersListenerFailure(error);
			}
			if (invariantFailure !== void 0) throw invariantFailure;
		}
		/** Contained-listener diagnostic shared by the sync and async failure paths. */
		warnAdaptersListenerFailure(error) {
			this.ctx.logger.warn("llm: an llm/adapters-updated listener failed");
			this.ctx.logger.warn(error);
		}
		/**
		* Register an adapter for the given provider routes. Throws `LlmError` with code
		* `DUPLICATE_ADAPTER` if any provider already has an adapter (all-or-nothing).
		* Disposed with the fiber.
		* @param providers - every provider route this adapter should serve.
		* @param adapter - the adapter that streams calls for those providers.
		* @returns the disposer, carrying {@link AdapterRegistrationHandle.replace}.
		*/
		registerAdapter(providers, adapter) {
			const owned = /* @__PURE__ */ new Set();
			let released = false;
			const dispose = this.ctx.effect(function* () {
				if (providers.length === 0) throw new LlmError("an adapter must register at least one provider", "INVALID_ADAPTER");
				this.commitRoutes(owned, this.prepareRoutes(providers, adapter, owned));
				yield () => {
					released = true;
					for (const provider of owned) this.adapters.delete(provider);
					owned.clear();
					this.emitAdaptersUpdated();
				};
			}.bind(this), "llm.registerAdapter()");
			const handle = (() => void dispose());
			handle.replace = (next) => {
				if (released) throw new LlmError("a disposed adapter registration cannot replace its routes", "REGISTRATION_DISPOSED");
				this.commitRoutes(owned, this.prepareRoutes(next, adapter, owned));
			};
			return handle;
		}
		/**
		* Validate one candidate route set for `adapter`, treating routes this
		* registration already holds as available. Nothing is mutated: a rejected
		* candidate leaves the registry exactly as it was.
		*/
		prepareRoutes(providers, adapter, owned) {
			const unique = /* @__PURE__ */ new Set();
			const registrations = [];
			for (const provider of providers) {
				if (provider.length === 0) throw new LlmError("adapter provider names must be non-empty", "INVALID_ADAPTER");
				if (unique.has(provider) || this.adapters.has(provider) && !owned.has(provider)) throw new LlmError(`an adapter for provider "${provider}" is already registered`, "DUPLICATE_ADAPTER");
				const info = adapter.providerInfo(provider);
				if (typeof info.id !== "string" || info.id !== provider || typeof info.name !== "string" || info.name.length === 0) throw new LlmError(`adapter metadata for provider "${provider}" must preserve its id and have a non-empty name`, "INVALID_ADAPTER");
				unique.add(provider);
				const retryPolicy = adapter.providerRetryPolicy(provider) ?? resolveRetryPolicy(void 0, `llm: provider "${provider}" retryPolicy`);
				registrations.push({
					adapter,
					provider: {
						id: info.id,
						name: info.name
					},
					retryPolicy
				});
			}
			return registrations;
		}
		/**
		* Swap this registration's routes for the prepared ones in one synchronous
		* section, so no observer can see the registry between the release and the
		* re-registration. The route set's one mutation point is also where
		* `llm/adapters-updated` is published, so a `replace` announces itself
		* exactly like a first registration.
		*/
		commitRoutes(owned, registrations) {
			for (const provider of owned) this.adapters.delete(provider);
			owned.clear();
			for (const registration of registrations) {
				this.adapters.set(registration.provider.id, registration);
				owned.add(registration.provider.id);
			}
			this.emitAdaptersUpdated();
		}
		/**
		* Describe provider routes with a registered adapter.
		* @returns detached provider metadata in registration order.
		*/
		listProviders() {
			return [...this.adapters.values()].map(({ provider }) => ({ ...provider }));
		}
		/**
		* Declare provider routes an adapter plugin can activate through
		* configuration. Registration is all-or-nothing: an empty list, invalid
		* entry, or a provider already declared by any registration throws
		* `LlmError` without registering the rest. Disposed with the fiber.
		* @param entries - every configurable provider this plugin owns.
		* @returns a handle that withdraws all of them, and can atomically replace them.
		*/
		registerConfigurableProviders(entries) {
			let held = [];
			let disposed = false;
			/**
			* Validate a candidate set in full against everything this registration
			* does not already hold, then publish it. Nothing is written until the
			* whole set passes, so a refused candidate leaves the current entries in
			* place — the property that makes `replace` a swap rather than a
			* delete-then-add that can strand the directory empty.
			*/
			const commit = (candidates) => {
				const detached = [];
				const own = new Set(held.map((entry) => entry.provider));
				for (const entry of candidates) {
					if (entry.provider.length === 0 || entry.displayName.length === 0 || entry.settingsNs.length === 0) throw new LlmError("configurable providers need a non-empty provider, displayName, and settingsNs", "INVALID_DIRECTORY");
					if (entry.settingsPath.some((segment) => segment.length === 0)) throw new LlmError(`configurable provider "${entry.provider}" has an empty settingsPath segment`, "INVALID_DIRECTORY");
					if (this.directory.has(entry.provider) && !own.has(entry.provider) || detached.some((seen) => seen.provider === entry.provider)) throw new LlmError(`configurable provider "${entry.provider}" is already declared`, "DUPLICATE_DIRECTORY");
					detached.push({
						...entry,
						settingsPath: [...entry.settingsPath]
					});
				}
				for (const entry of held) this.directory.delete(entry.provider);
				for (const entry of detached) this.directory.set(entry.provider, entry);
				held = detached;
				this.emitAdaptersUpdated();
			};
			const dispose = this.ctx.effect(function* () {
				if (entries.length === 0) throw new LlmError("a configurable-provider registration must declare at least one provider", "INVALID_DIRECTORY");
				commit(entries);
				yield () => {
					disposed = true;
					for (const entry of held) this.directory.delete(entry.provider);
					held = [];
					this.emitAdaptersUpdated();
				};
			}.bind(this), "llm.registerConfigurableProviders()");
			const handle = (() => void dispose());
			handle.replace = (next) => {
				if (disposed) throw new LlmError("this configurable-provider registration was disposed", "REGISTRATION_DISPOSED");
				commit(next);
			};
			return handle;
		}
		/**
		* List every declared configurable provider, registered or dormant.
		* @returns detached directory entries in declaration order.
		*/
		listConfigurableProviders() {
			return [...this.directory.values()].map((entry) => ({
				...entry,
				settingsPath: [...entry.settingsPath]
			}));
		}
		/**
		* Offer to interrogate provider endpoints on behalf of the settings
		* namespace this plugin owns. The namespace is the key because that is what
		* a configuration surface already holds from the configurable-provider
		* directory, and because a provider being *added* has no route to name yet.
		* Disposed with the fiber.
		* @param settingsNs - the namespace whose profiles this discovery serves.
		* @param discover - interrogates one endpoint and must honor the supplied signal.
		* @returns the disposer that withdraws the offer.
		*/
		registerModelDiscovery(settingsNs, discover) {
			const dispose = this.ctx.effect(function* () {
				if (settingsNs.length === 0) throw new LlmError("model discovery needs a non-empty settings namespace", "INVALID_DISCOVERY");
				if (this.discoveries.has(settingsNs)) throw new LlmError(`model discovery for "${settingsNs}" is already registered`, "DUPLICATE_DISCOVERY");
				this.discoveries.set(settingsNs, discover);
				yield () => {
					this.discoveries.delete(settingsNs);
				};
			}.bind(this), "llm.registerModelDiscovery()");
			return () => void dispose();
		}
		/**
		* Interrogate one provider endpoint for the models it advertises. The
		* request describes a draft, not a stored route, so nothing here reads or
		* writes settings or credentials — the caller owns both, and the reply is
		* candidate metadata a surface may offer for adoption.
		* @param settingsNs - namespace whose registered discovery serves this draft.
		* @param request - the endpoint, protocol, and one-shot credential to use.
		* @param signal - caller cancellation.
		* @returns the advertised models, deduplicated in endpoint order.
		*/
		async discoverModels(settingsNs, request, signal) {
			const discover = this.discoveries.get(settingsNs);
			if (discover === void 0) throw new LlmError(`no model discovery is registered for "${settingsNs}"`, "NO_DISCOVERY");
			if ((request.provider ?? "").length === 0 && (request.baseURL ?? "").length === 0) throw new LlmError("model discovery needs a provider route or a baseURL", "INVALID_DISCOVERY");
			const discovered = signal === void 0 ? await discover(request) : await discover(request, signal);
			const seen = /* @__PURE__ */ new Set();
			const models = [];
			for (const model of discovered) {
				if (typeof model.id !== "string" || model.id.length === 0 || seen.has(model.id)) continue;
				seen.add(model.id);
				models.push({
					id: model.id,
					...model.name === void 0 ? {} : { name: model.name },
					...model.contextWindow === void 0 ? {} : { contextWindow: model.contextWindow },
					...model.maxTokens === void 0 ? {} : { maxTokens: model.maxTokens },
					...model.inputModalities === void 0 ? {} : { inputModalities: [...model.inputModalities] }
				});
			}
			return models;
		}
		/**
		* Remote adapter for one draft provider interrogation.
		* @param settingsNs - namespace whose registered discovery serves this draft.
		* @param request - endpoint, protocol, and one-shot credential to use.
		* @param signal - caller cancellation supplied by the Remote carrier.
		* @returns advertised models in endpoint order.
		* @throws RemoteError with `llm/model-discovery-rejected` when discovery refuses or fails.
		*/
		async remoteDiscoverModels(settingsNs, request, signal) {
			try {
				return await this.discoverModels(settingsNs, request, signal);
			} catch (error) {
				throw new RemoteError("llm/model-discovery-rejected", error instanceof Error ? error.message : String(error), {
					settingsNs,
					...request.baseURL === void 0 ? {} : { baseURL: request.baseURL }
				}, { cause: error });
			}
		}
		/**
		* Resolve the retry policy captured when one provider route was registered.
		* @param provider - registered provider route to inspect.
		* @returns the provider-owned policy, with normal defaults already resolved.
		*/
		providerRetryPolicy(provider) {
			return this.registration(provider).retryPolicy;
		}
		/**
		* Resolve provider-side request-image pricing for one exact route, or
		* `undefined` when the provider is unregistered or declares none. Unknown
		* providers degrade to `undefined` rather than throwing because callers
		* price durable history whose route may no longer be mounted.
		* @param provider - provider route named by a request header.
		* @param model - exact model id named by the same header.
		* @returns the owning adapter's image pricing for the route, when declared.
		*/
		imageRequestPricing(provider, model) {
			return this.adapters.get(provider)?.adapter.imageRequestPricing(provider, model);
		}
		/**
		* Resolve the exact text one durable file occurrence contributes to every
		* provider request in the current execution environment.
		* @param ref - durable verbatim file reference from model history.
		* @returns the same deterministic handle text used at adapter dispatch.
		*/
		fileRequestText(ref) {
			return fileHandleText(ref, this.fileReadPath(ref));
		}
		/** Detach typed adapter-owned modality metadata. */
		detachedModalities(modalities) {
			return modalities === void 0 ? void 0 : [...modalities];
		}
		/**
		* Discover models advertised by one registered provider. Catalog membership
		* does not constrain core routing. Catalog-driven entry points may restrict
		* selection and submission to the advertised models.
		* @param provider - registered provider route to inspect.
		* @returns detached model metadata in adapter-preferred order.
		*/
		async listModels(provider) {
			const models = await this.registration(provider).adapter.listModels(provider);
			const seen = /* @__PURE__ */ new Set();
			return models.map((model) => {
				if (typeof model.provider !== "string" || model.provider !== provider || typeof model.id !== "string" || model.id.length === 0 || typeof model.name !== "string" || model.name.length === 0 || model.description !== void 0 && typeof model.description !== "string" || seen.has(model.id)) throw new LlmError(`adapter returned invalid or duplicate model metadata for provider "${provider}"`, "INVALID_CATALOG");
				seen.add(model.id);
				const inputModalities = this.detachedModalities(model.inputModalities);
				return {
					provider: model.provider,
					id: model.id,
					name: model.name,
					...model.description === void 0 ? {} : { description: model.description },
					...inputModalities === void 0 ? {} : { inputModalities }
				};
			});
		}
		/**
		* Resolve and validate all metadata from the adapter that owns one exact
		* route. The result is detached from adapter-owned objects; catalog
		* membership remains advisory and does not control request routing.
		* @param provider - registered provider route to inspect.
		* @param model - exact model id passed to the adapter.
		* @param signal - optional cancellation for adapter-owned asynchronous lookup.
		* @returns exact model identity plus available context and reasoning metadata.
		*/
		async resolveModelInfo(provider, model, signal) {
			return this.resolveModelInfoFor(this.registration(provider), model, signal);
		}
		async resolveModelInfoFor(registration, model, signal) {
			const resolved = await registration.adapter.resolveModel(registration.provider.id, model, signal);
			return this.normalizeModelInfo(registration, model, resolved);
		}
		/** Validate and detach one adapter-returned exact model result. */
		normalizeModelInfo(registration, model, resolved) {
			const provider = registration.provider.id;
			if (typeof resolved.provider !== "string" || resolved.provider !== provider || typeof resolved.id !== "string" || resolved.id !== model || typeof resolved.name !== "string" || resolved.name.length === 0 || resolved.description !== void 0 && typeof resolved.description !== "string") throw new LlmError(`adapter returned invalid exact model metadata for provider "${provider}" model "${model}"`, "INVALID_MODEL_INFO");
			const context = resolved.context;
			if (context !== void 0 && (!Number.isInteger(context.contextWindow) || context.contextWindow <= 0)) throw new LlmError(`adapter returned invalid context metadata for provider "${provider}" model "${model}"`, "INVALID_MODEL_CONTEXT");
			const inputModalities = this.detachedModalities(resolved.inputModalities);
			const systemPromptUpdate = resolved.systemPromptUpdate;
			if (systemPromptUpdate !== void 0 && systemPromptUpdate !== "in-history") throw new LlmError(`adapter returned invalid system prompt update mode for provider "${provider}" model "${model}"`, "INVALID_MODEL_INFO");
			const toolUpdate = resolved.toolUpdate;
			if (toolUpdate !== void 0 && toolUpdate !== "in-history" && toolUpdate !== "addition-only") throw new LlmError(`adapter returned invalid tool update mode for provider "${provider}" model "${model}"`, "INVALID_MODEL_INFO");
			const defaultMaxTokens = resolved.defaultMaxTokens;
			if (defaultMaxTokens !== void 0 && (!Number.isSafeInteger(defaultMaxTokens) || defaultMaxTokens <= 0)) throw new LlmError(`adapter returned invalid default maxTokens for provider "${provider}" model "${model}"`, "INVALID_MODEL_MAX_TOKENS");
			const info = {
				provider,
				id: model,
				name: resolved.name,
				...resolved.description === void 0 ? {} : { description: resolved.description },
				...inputModalities === void 0 ? {} : { inputModalities },
				...context === void 0 ? {} : { context: { contextWindow: context.contextWindow } },
				...defaultMaxTokens === void 0 ? {} : { defaultMaxTokens },
				...resolved.systemPromptUpdate === void 0 ? {} : { systemPromptUpdate: resolved.systemPromptUpdate },
				...resolved.toolUpdate === void 0 ? {} : { toolUpdate: resolved.toolUpdate }
			};
			const reasoning = resolved.reasoning;
			if (reasoning === void 0) return info;
			if (reasoning.efforts.length === 0) throw new LlmError(`adapter returned invalid reasoning metadata for provider "${provider}" model "${model}"`, "INVALID_MODEL_REASONING");
			const seen = /* @__PURE__ */ new Set();
			const efforts = reasoning.efforts.map((effort) => {
				if (typeof effort.id !== "string" || effort.id.length === 0 || typeof effort.name !== "string" || effort.name.length === 0 || effort.description !== void 0 && typeof effort.description !== "string" || seen.has(effort.id)) throw new LlmError(`adapter returned invalid or duplicate reasoning effort metadata for provider "${provider}" model "${model}"`, "INVALID_MODEL_REASONING");
				seen.add(effort.id);
				return {
					id: effort.id,
					name: effort.name,
					...effort.description === void 0 ? {} : { description: effort.description }
				};
			});
			if (reasoning.defaultEffort !== void 0 && !seen.has(reasoning.defaultEffort)) throw new LlmError(`adapter returned an unknown default reasoning effort for provider "${provider}" model "${model}"`, "INVALID_MODEL_REASONING");
			return {
				...info,
				reasoning: {
					efforts,
					...reasoning.defaultEffort === void 0 ? {} : { defaultEffort: reasoning.defaultEffort }
				}
			};
		}
		/**
		* Validate a conversation call config against its exact model capability and
		* materialize adapter-configured defaults. Unsupported explicit efforts
		* reject before provider I/O; no clamping or aliasing is performed. This
		* standalone query does not bind a later dispatch; use {@link prepareCall}
		* when logging and streaming must share one adapter registration.
		* @param config - provider/model route and optional request controls.
		* @param signal - optional cancellation for adapter-owned capability lookup.
		* @returns a detached config only when a default must be materialized.
		*/
		async resolveCallConfig(config, signal) {
			return (await this.resolveCallFor(this.registration(config.provider), config, signal)).config;
		}
		async resolveCallFor(registration, config, signal) {
			const info = await this.resolveModelInfoFor(registration, config.model, signal);
			return this.resolveCallWithInfo(config, info);
		}
		/** Validate request controls against one already-bound exact model result. */
		resolveCallWithInfo(config, info) {
			const defaulted = config.maxTokens === void 0 && info.defaultMaxTokens !== void 0 ? {
				...config,
				maxTokens: info.defaultMaxTokens
			} : config;
			const reasoning = info.reasoning;
			const requested = defaulted.reasoningEffort;
			let resolvedConfig = defaulted;
			if (reasoning === void 0) {
				if (requested !== void 0) throw new LlmError(`provider "${config.provider}" model "${config.model}" does not support reasoning effort "${requested}"`, "UNSUPPORTED_REASONING_EFFORT");
			} else {
				const effective = requested ?? reasoning.defaultEffort;
				if (effective !== void 0) {
					if (!reasoning.efforts.some((effort) => effort.id === effective)) throw new LlmError(`provider "${config.provider}" model "${config.model}" does not support reasoning effort "${effective}"`, "UNSUPPORTED_REASONING_EFFORT");
					if (requested !== effective) resolvedConfig = {
						...defaulted,
						reasoningEffort: effective
					};
				}
			}
			return {
				config: resolvedConfig,
				...info.context === void 0 ? {} : { context: info.context },
				modelInfo: info
			};
		}
		/**
		* Resolve one call under its current adapter registration. The returned
		* one-shot handle keeps that registration across header logging and dispatch,
		* so HMR cannot combine one adapter's capability result with another adapter.
		* @param config - provider/model route and optional request controls.
		* @param signal - optional cancellation for adapter-owned capability lookup.
		* @returns a prepared config and its registration-bound stream entry point.
		*/
		async prepareCall(config, signal) {
			const registration = this.registration(config.provider);
			const adapterCall = await registration.adapter.prepareCall(config.provider, config.model, signal);
			const modelInfo = this.normalizeModelInfo(registration, config.model, adapterCall.model);
			const resolved = this.resolveCallWithInfo(config, modelInfo);
			const resolvedConfig = deepFreeze(structuredClone(resolved.config));
			const context = resolved.context === void 0 ? void 0 : deepFreeze(structuredClone(resolved.context));
			const adapterDefaults = deepFreeze({
				...config.reasoningEffort === void 0 && resolvedConfig.reasoningEffort !== void 0 ? { reasoningEffort: true } : {},
				...config.maxTokens === void 0 && resolvedConfig.maxTokens !== void 0 ? { maxTokens: true } : {}
			});
			let dispatched = false;
			return Object.freeze({
				config: resolvedConfig,
				retryPolicy: registration.retryPolicy,
				adapterDefaults,
				...context === void 0 ? {} : { context },
				...modelInfo.inputModalities === void 0 ? {} : { inputModalities: Object.freeze([...modelInfo.inputModalities]) },
				...modelInfo.systemPromptUpdate === void 0 ? {} : { systemPromptUpdate: modelInfo.systemPromptUpdate },
				...modelInfo.toolUpdate === void 0 ? {} : { toolUpdate: modelInfo.toolUpdate },
				stream: (options) => {
					if (dispatched) throw new LlmError("a prepared LLM call can only be dispatched once", "INVALID_PREPARED_CALL");
					if (!callConfigEquals(options, resolvedConfig)) throw new LlmError("prepared LLM call config changed before adapter dispatch", "INVALID_PREPARED_CALL");
					dispatched = true;
					return this.streamWithRegistration(options, {
						registration,
						config: resolvedConfig,
						modelInfo,
						dispatch: (options) => adapterCall.stream(options)
					});
				}
			});
		}
		registration(provider) {
			const registration = this.adapters.get(provider);
			if (!registration) throw new LlmError(`no adapter registered for provider "${provider}"`, "NO_ADAPTER");
			return registration;
		}
		/** Remove replay state whose historical route is owned by another adapter. */
		forAdapter(options, adapter) {
			const messages = options.messages.map((message) => {
				if (message.role !== "assistant") return message;
				const source = message.source;
				if (source.replayState === void 0) return message;
				if (this.adapters.get(source.provider)?.adapter === adapter) return message;
				return freezeMessage({
					...message,
					source: {
						kind: "model",
						provider: source.provider,
						model: source.model
					}
				});
			});
			if (messages.every((message, index) => message === options.messages[index])) return options;
			const filtered = {
				...options,
				messages
			};
			return Object.isFrozen(options) ? deepFreeze(filtered) : filtered;
		}
		/**
		* Resolve the current execution-world read path of one durable file
		* reference through the mounted attachment and filesystem providers.
		*/
		fileReadPath(ref) {
			let hostPath;
			try {
				hostPath = this.ctx.get("attachments")?.fileHostPath(ref);
			} catch {
				return;
			}
			if (hostPath === void 0) return void 0;
			return this.ctx.get("fs")?.processPathFromHostPath(hostPath);
		}
		/**
		* Final adapter boundary. Adapter selection, dispatch, iterator construction,
		* and iteration failures become one terminal failure chunk. Middleware and
		* downstream consumer failures remain thrown plugin or consumer errors.
		*/
		async *adapterStream(options, prepared) {
			let iterator;
			try {
				const registration = prepared?.registration ?? this.registration(options.provider);
				const adapter = registration.adapter;
				let modelInfo;
				let resolvedConfig;
				let dispatch;
				if (prepared === void 0) {
					const adapterCall = await adapter.prepareCall(options.provider, options.model, options.signal);
					modelInfo = this.normalizeModelInfo(registration, options.model, adapterCall.model);
					resolvedConfig = this.resolveCallWithInfo(options, modelInfo).config;
					dispatch = (options) => adapterCall.stream(options);
				} else {
					modelInfo = prepared.modelInfo;
					resolvedConfig = prepared.config;
					dispatch = prepared.dispatch;
				}
				if (prepared !== void 0 && !callConfigEquals(options, resolvedConfig)) throw new LlmError("prepared LLM call config changed before adapter dispatch", "INVALID_PREPARED_CALL");
				const resolvedOptions = callConfigEquals(options, resolvedConfig) ? options : Object.isFrozen(options) ? deepFreeze({
					...options,
					...resolvedConfig
				}) : {
					...options,
					...resolvedConfig
				};
				let projectedMessages = resolvedOptions.messages;
				if (projectedMessages.some((message) => contentHasFile(message.content))) projectedMessages = projectFilesToText(projectedMessages, (ref) => this.fileReadPath(ref));
				if (modelInfo.inputModalities !== void 0 && !modelInfo.inputModalities.includes("image") && projectedMessages.some((message) => contentHasImage(message.content))) projectedMessages = projectImagesForTextModel(projectedMessages);
				const projectedTools = projectToolUpdates(projectedMessages, resolvedOptions.tools, modelInfo.toolUpdate, resolvedOptions.toolHistory);
				projectedMessages = projectedTools.messages;
				let projectedOptions = resolvedOptions;
				if (projectedMessages !== resolvedOptions.messages || projectedTools.tools !== resolvedOptions.tools) {
					projectedOptions = {
						...resolvedOptions,
						messages: projectedMessages,
						...projectedTools.tools === void 0 ? {} : { tools: projectedTools.tools }
					};
					if (Object.isFrozen(resolvedOptions)) deepFreeze(projectedOptions);
				}
				iterator = dispatch(this.forAdapter(projectedOptions, adapter))[Symbol.asyncIterator]();
			} catch (error) {
				yield adapterFailureChunk(error, options.signal);
				return;
			}
			let completed = false;
			try {
				while (true) {
					let item;
					try {
						const next = await iterator.next();
						item = next.done ? { done: true } : {
							done: false,
							value: next.value
						};
					} catch (error) {
						completed = true;
						yield adapterFailureChunk(error, options.signal);
						return;
					}
					if (item.done) {
						completed = true;
						return;
					}
					yield item.value;
				}
			} finally {
				if (!completed) {
					const close = iterator.return?.bind(iterator);
					if (close) await close();
				}
			}
		}
		/**
		* Stream one model call as raw chunks (token-level deltas). Replay state is
		* retained only when the same adapter instance owns its historical provider
		* and the target provider. Final adapter selection remains fixed through
		* asynchronous exact-model resolution and dispatch. Adapter selection,
		* dispatch, and iteration failures become terminal `error` or `aborted`
		* finish chunks; middleware, nested-call, cleanup, and consumer failures
		* remain thrown.
		* @param options - the full request; `options.provider` selects the adapter.
		* @returns the chunk stream, possibly wrapped by `llm/stream` listeners.
		*/
		stream(options) {
			return this.streamWithRegistration(options);
		}
		streamWithRegistration(options, prepared) {
			return this.ctx.waterfall(this, "llm/stream", options, () => this.adapterStream(options, prepared));
		}
	};
})();
/** Convert one adapter throw into the stream protocol's terminal outcome. */
function adapterFailureChunk(error, signal) {
	const failure = normalizeLlmFailure(error);
	return {
		type: "finish",
		reason: signal?.aborted || failure.code === "ABORTED" ? {
			kind: "aborted",
			failure
		} : {
			kind: "error",
			failure
		}
	};
}
//#endregion
//#region node_modules/.pnpm/@deepseek-ai+dsh-scope@0.1.7-rc.2_@deepseek-ai+cordis@4.0.4_@deepseek-ai+dsh-invariants_0271d3a82adfe807020938592f267574/node_modules/@deepseek-ai/dsh-scope/lib/index.js
/**
* Shared insertion-ordered storage and effect ownership for scope-aware registries.
*
* @module @deepseek-ai/dsh-scope
*/
/**
* Insertion-ordered named entries with caller-owned duplicate diagnostics.
*
* Values are borrowed. Iterators are live within one nonempty table
* generation; draining the table detaches them from later insertions. Each
* successful insertion returns an idempotent undo for that exact entry.
*/
var NamedEntries = class {
	duplicateError;
	data = /* @__PURE__ */ new Map();
	constructor(duplicateError) {
		this.duplicateError = duplicateError;
	}
	/**
	* Insert one unique name.
	* @param name - name unique within this table.
	* @param value - borrowed value to retain.
	* @returns an idempotent undo that removes only this insertion.
	*/
	insert(name, value) {
		const data = this.data;
		if (data.has(name)) throw this.duplicateError(name);
		data.set(name, value);
		let active = true;
		return () => {
			if (!active) return;
			active = false;
			data.delete(name);
			if (data.size === 0 && this.data === data) this.data = /* @__PURE__ */ new Map();
		};
	}
	/**
	* Read one named value.
	* @param name - name to resolve.
	* @returns the retained value, or `undefined` when absent.
	*/
	get(name) {
		return this.data.get(name);
	}
	/**
	* Test one name for membership.
	* @param name - name to test.
	* @returns whether the table contains that name.
	*/
	has(name) {
		return this.data.has(name);
	}
	/**
	* Iterate live names in insertion order.
	* @returns the native live key iterator.
	*/
	keys() {
		return this.data.keys();
	}
	/**
	* Iterate live entries in insertion order.
	* @returns the native live entry iterator.
	*/
	entries() {
		return this.data.entries();
	}
	/**
	* Iterate live values in insertion order.
	* @returns the native live value iterator.
	*/
	values() {
		return this.data.values();
	}
	/**
	* Test whether this table has no entries.
	* @returns whether the table is empty.
	*/
	isEmpty() {
		return this.data.size === 0;
	}
};
/**
* Insertion-ordered anonymous entries with independent registration identity.
*
* Equal values remain separate registrations. Values are borrowed, and
* iterators are live within one nonempty table generation; draining the table
* detaches them from later appends.
*/
var AnonymousEntries = class {
	data = /* @__PURE__ */ new Map();
	/**
	* Append one independently owned value.
	* @param value - borrowed value to retain.
	* @returns an idempotent undo for this exact append.
	*/
	append(value) {
		const data = this.data;
		const key = Symbol();
		data.set(key, value);
		let active = true;
		return () => {
			if (!active) return;
			active = false;
			data.delete(key);
			if (data.size === 0 && this.data === data) this.data = /* @__PURE__ */ new Map();
		};
	}
	/**
	* Iterate live values in insertion order.
	* @returns the native live value iterator.
	*/
	values() {
		return this.data.values();
	}
	/**
	* Test whether this table has no entries.
	* @returns whether the table is empty.
	*/
	isEmpty() {
		return this.data.size === 0;
	}
};
/**
* Own the global and exact-scope layers for one registry.
*
* Reads never create scoped layers. Registrations derive both visibility and
* effect ownership from the supplied Cordis context, collect undo before
* notification, and reclaim only a completely empty aggregate layer.
*/
var ScopedLayers = class {
	createLayer;
	onChange;
	/** The eagerly constructed context-global layer. */
	global;
	scoped = /* @__PURE__ */ new Map();
	constructor(createLayer, onChange) {
		this.createLayer = createLayer;
		this.onChange = onChange;
		this.global = createLayer(void 0);
	}
	/**
	* Read an existing exact-scope overlay. Deliberately chain-blind: callers
	* addressing one scope's OWN contributions (its restrictions, its guards)
	* must not silently pick up an ancestor's — use {@link chainLayers} where
	* inheritance is the point.
	* @param scope - exact scope key; `undefined` denotes no overlay.
	* @returns the existing scoped layer, or `undefined` without creating one.
	*/
	peek(scope) {
		if (scope === void 0) return void 0;
		return this.scoped.get(scope);
	}
	/**
	* Existing overlays along the scope's parent chain ({@link scopeChainOf}),
	* farthest ancestor first and the exact scope last, so a caller layering
	* them in order gives the nearest scope the final word.
	* @param scope - viewing scope, or `undefined` for no overlays.
	* @returns the existing layers, nearest last; absent overlays are skipped.
	*/
	chainLayers(scope) {
		const layers = [];
		for (const key of scopeChainOf(scope).reverse()) {
			const layer = this.scoped.get(key);
			if (layer !== void 0) layers.push(layer);
		}
		return layers;
	}
	/**
	* Materialize global named entries followed by scope-chain shadows,
	* farthest ancestor first, so the nearest scope's entry wins a name.
	* @param scope - viewing scope, or `undefined` for the global view.
	* @param pick - select the named table from a layer.
	* @returns an insertion-ordered effective map.
	*/
	merge(scope, pick) {
		const merged = new Map(pick(this.global).entries());
		for (const layer of this.chainLayers(scope)) for (const [name, value] of pick(layer).entries()) merged.set(name, value);
		return merged;
	}
	/**
	* Attach one synchronous layer mutation to its registration context.
	* @param ctx - context that determines both scope visibility and effect ownership.
	* @param action - atomic mutation returning its synchronous undo.
	* @param options - Cordis effect label and optional change notification.
	* @returns the exact disposer returned by `ctx.effect()`.
	*/
	effect(ctx, action, options) {
		const scope = scopeOf(ctx);
		const notify = options.notify ?? true;
		return ctx.effect(function* () {
			let layer;
			let created = false;
			if (scope === void 0) layer = this.global;
			else {
				const existing = this.scoped.get(scope);
				if (existing === void 0) {
					layer = this.createLayer(scope);
					this.scoped.set(scope, layer);
					created = true;
				} else layer = existing;
			}
			let undo;
			try {
				undo = action(layer);
			} catch (error) {
				if (scope !== void 0 && created && layer.isEmpty()) this.scoped.delete(scope);
				throw error;
			}
			yield () => {
				undo();
				if (scope !== void 0 && layer.isEmpty()) this.scoped.delete(scope);
				if (notify) this.onChange();
			};
			if (notify) this.onChange();
		}.bind(this), options.label);
	}
};
/**
* Scoped-context primitive: mint a Cordis context that tags registrations with
* an opaque identity and build routing-only event carriers for that identity.
*
* @module @deepseek-ai/dsh-scope
*/
/** Context tag written by {@link createScope}. */
const kScope = Symbol("dsh.scope");
/** The key associated with each carrier. Presence distinguishes an unkeyed carrier from a non-carrier. */
const carrierKeys = /* @__PURE__ */ new WeakMap();
/**
* The enclosing scope of each key. One relation powers both directions of
* scope nesting: registration views inherit DOWN the chain (a child scope
* sees its ancestors' layers — {@link ScopedLayers}), and event admission
* extends UP it (a listener tagged with an ancestor receives events dispatched
* to a descendant key — {@link scopeTarget}).
*/
const scopeParents = /* @__PURE__ */ new WeakMap();
/**
* The chain from a key to its root ancestor.
* @param key - the starting key, or `undefined` for the empty chain.
* @returns keys nearest-first: `[key, parent, grandparent, …]`.
*/
function scopeChainOf(key) {
	const chain = [];
	for (let cursor = key; cursor !== void 0; cursor = scopeParents.get(cursor)) chain.push(cursor);
	return chain;
}
/**
* Read the nearest scope tag inherited by a context.
* @param ctx - context to inspect.
* @returns its scope key, or `undefined` for an unscoped context.
*/
function scopeOf(ctx) {
	return ctx[kScope];
}
/**
* Build an opaque receiver that preserves the base filter, admits untagged
* listeners globally, and admits tagged listeners for a matching key or any
* of its ancestors ({@link bindScopeParent}): a listener owned by an enclosing
* scope receives every descendant scope's events, which is what lets one
* standing composition observe each of the agents composed under it. A tag
* BELOW the dispatch key stays excluded — events flow up the chain, never
* down.
* @param base - subject or service whose existing Cordis filter is preserved.
* @param key - routed scope identity, or `undefined` for an unscoped subject.
* @returns a carrier whose subject remains available only through event arguments.
*/
function scopeTarget(base, key) {
	const baseFilter = base[Context.filter];
	const carrier = { [Context.filter](ctx) {
		if (baseFilter !== void 0 && !baseFilter.call(base, ctx)) return false;
		const tag = scopeOf(ctx);
		if (tag === void 0) return true;
		for (let cursor = key; cursor !== void 0; cursor = scopeParents.get(cursor)) if (cursor === tag) return true;
		return false;
	} };
	carrierKeys.set(carrier, key);
	return carrier;
}
//#endregion
//#region node_modules/.pnpm/@deepseek-ai+dsh-util-values@0.1.7-rc.2_@deepseek-ai+cordis@4.0.4/node_modules/@deepseek-ai/dsh-util-values/lib/index.js
/** Duplicate-install-safe JSON and immutable-value helpers. @module @deepseek-ai/dsh-util-values */
/**
* Mark an unreachable closed-union branch.
* @param value - impossible value; an unhandled typed variant fails at the call site.
* @param context - optional switch-site label included in the failure message.
* @returns never; a runtime value that escaped its type always throws.
*/
function assertNever(value, context) {
	const rendered = JSON.stringify(value) ?? String(value);
	throw new Error(`unreachable variant${context ? ` in ${context}` : ""}: ${rendered}`);
}
//#endregion
//#region node_modules/.pnpm/@deepseek-ai+dsh-sandbox@0.1.7-rc.2_@deepseek-ai+cordis@4.0.4_@deepseek-ai+dsh-llm@0.2._d9eeee1079743589077da41e152a44df/node_modules/@deepseek-ai/dsh-sandbox/lib/index.js
/**
* The escalation vocabulary and choreography shared by every sandbox-enforcing
* tool family (`@deepseek-ai/dsh-tool-bash`, `@deepseek-ai/dsh-tool-fs`): the
* strictly-wider ladder, the argument-pairing validation, the model-facing
* denial/hint markers, and {@link approveEscalation} — the ordered fail-closed
* sequence that resolves a `sandbox_permissions` request through a
* user-approval channel BEFORE anything executes. One home keeps the two
* families' approval ordering and verbatim error texts from drifting apart.
*
* The channel is a minimal STRUCTURAL function shape ({@link EscalationAsk}),
* not the approval service type: the tool layer — which owns the agent, the
* call id, and the tool name — closes over `ctx.approval.request(...)` and
* hands the closure down, so this package never depends on the approval or
* agent packages.
*
* @module dsh-sandbox/escalation
*/
/**
* The strictly-wider table: what a call whose effective mode is the key may
* escalate TO. Checked at EXECUTION, never baked into a tool schema — the
* schema's enum is {@link ESCALATION_TARGETS}, because schemas are
* registry-global while the effective mode is per-call truth.
*/
const WIDER_MODES = {
	"read-only": ["workspace-write", "danger-full-access"],
	"workspace-write": ["danger-full-access"]
};
/**
* The closed escalation-target vocabulary — every mode a call could ever
* escalate TO (`read-only` is the floor; nothing escalates to it). Advertised
* whenever the mounted capability confines: cutting the enum down to the modes
* wider than the composition's DEFAULT would strand a session whose effective
* mode sits below it (a `danger-full-access` default would advertise nothing
* while a narrower-switched session stays confined with no lever).
*/
const ESCALATION_TARGETS = ["workspace-write", "danger-full-access"];
/**
* Validate the escalation argument pairing a tool schema cannot express:
* `sandbox_permissions` and `justification` travel together — an approval
* prompt without a reason, or a reason driving nothing, is a malformed ask —
* and the justification must be a non-empty sentence.
* @param sandboxPermissions - the raw `sandbox_permissions` argument, if given.
* @param justification - the raw `justification` argument, if given.
*/
function validateEscalationArgs(sandboxPermissions, justification) {
	if (sandboxPermissions !== void 0 && justification === void 0) throw new Error("invalid escalation: sandbox_permissions requires a justification");
	if (justification !== void 0 && sandboxPermissions === void 0) throw new Error("invalid escalation: justification is only valid together with sandbox_permissions");
	if (justification !== void 0 && justification.trim().length === 0) throw new Error("invalid justification: expected a non-empty sentence");
}
/**
* Resolve a sandbox permission request before execution. Repeating the call's
* effective mode returns it without approval. A strictly wider mode requires
* approval and applies only to this call. Narrower or unsupported targets,
* missing approval services or agents for widening, and non-grant outcomes
* throw before execution.
* @param request - the escalation to judge (see {@link EscalationRequest}).
* @param approval - the approval ingredients the tool holds (see {@link EscalationApproval}).
* @returns the granted mode, consumed by the one call that asked.
*/
async function approveEscalation(request, approval) {
	const { requestedMode: mode, effectiveMode, justification, subject } = request;
	if (mode === effectiveMode) return effectiveMode;
	if (!(WIDER_MODES[effectiveMode] ?? []).includes(mode)) throw new Error(`sandbox escalation to "${mode}" is not strictly wider than this call's current "${effectiveMode}" mode`);
	if (approval.approver === void 0) throw new Error(`sandbox escalation to "${mode}" requires approval, but no approval service is composed`);
	if (approval.agent === void 0) throw new Error(`sandbox escalation to "${mode}" requires approval, but the call has no agent to route it through`);
	const outcome = await approval.approver.request({
		agent: approval.agent,
		toolName: approval.toolName,
		callId: approval.callId,
		reason: `escalate sandbox to ${mode}: ${justification}`,
		displayReason: {
			en: `Allow this operation with ${mode} permissions: ${justification}`,
			zh: `允许本次操作使用 ${mode} 权限：${justification}`
		},
		...approval.signal ? { signal: approval.signal } : {}
	});
	switch (outcome) {
		case "allowed-once": return mode;
		case "rejected": throw new Error(`the user rejected escalating this ${subject} to "${mode}"; it stays denied, so stop and explain instead of working around it`);
		case "cancelled": throw new Error(`approval for escalating to "${mode}" was cancelled`);
		case "unavailable": throw new Error(`sandbox escalation to "${mode}" requires approval, but no approval channel is available`);
		default: return assertNever(outcome, "EscalationOutcome");
	}
}
//#endregion
//#region node_modules/.pnpm/@deepseek-ai+dsh-tools@0.2.0-rc.2_19e83aa17bfe6ac845d3f328b6ca2719/node_modules/@deepseek-ai/dsh-tools/lib/index.js
/**
* Enforced JSON Schema subset shared by tool outputs, generated PTC mode
* types, subagents, and workflows. The subset accepts any JSON root, an
* annotation-only schema for unconstrained JSON, one scalar `type`, object
* `properties`/`required`/boolean `additionalProperties`, array `items`,
* type-correct scalar `enum`/`const`, and exact-one `oneOf`.
*
* Unsupported or misplaced keywords reject rather than being accepted without
* enforcement. Consumers that require an object root apply
* {@link assertObjectJsonSchema} before accepting input.
* @module dsh-tools/json-schema
*/
/**
* Thrown when a raw schema falls outside the enforced subset. `violations`
* lists every offending path instead of stopping at the first author error.
*/
var JsonSchemaError = class extends HarnessError {
	/** Individual schema violations in walk order. */
	violations;
	constructor(violations) {
		super(`unsupported JSON schema: ${violations.join("; ")}`, "UNSUPPORTED_SCHEMA");
		this.name = "JsonSchemaError";
		this.violations = violations;
	}
};
const CONSTRAINT_KEYWORDS = /* @__PURE__ */ new Set([
	"type",
	"oneOf",
	"properties",
	"required",
	"additionalProperties",
	"items",
	"enum",
	"const"
]);
const ANNOTATION_KEYWORDS = /* @__PURE__ */ new Set([
	"description",
	"title",
	"default",
	"examples"
]);
const SCHEMA_TYPES = [
	"object",
	"array",
	"string",
	"number",
	"integer",
	"boolean",
	"null"
];
/** Whether a realm-owned intrinsic prototype is backed by its native constructor. */
function hasIntrinsicConstructor(prototype, name) {
	const constructor = Object.getOwnPropertyDescriptor(prototype, "constructor")?.value;
	if (typeof constructor !== "function") return false;
	try {
		return constructor.name === name && constructor.prototype === prototype && Function.prototype.toString.call(constructor) === `function ${name}() { [native code] }`;
	} catch {
		return false;
	}
}
/** Whether a candidate is one realm's intrinsic `Object.prototype`. */
function isIntrinsicObjectPrototype(value) {
	return Object.getPrototypeOf(value) === null && hasIntrinsicConstructor(value, "Object");
}
/**
* Test for a realm-agnostic plain JSON record without accepting arrays or
* exotic objects.
* @param value - candidate record from any JavaScript realm.
* @returns Whether the value has a plain-object prototype chain.
*/
function isPlainJsonRecord(value) {
	if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
	try {
		const prototype = Object.getPrototypeOf(value);
		return prototype === null || typeof prototype === "object" && isIntrinsicObjectPrototype(prototype);
	} catch {
		return false;
	}
}
/** Whether an array uses one realm's intrinsic `Array.prototype`. */
function hasPlainArrayPrototype(value) {
	const prototype = Object.getPrototypeOf(value);
	if (!Array.isArray(prototype) || !hasIntrinsicConstructor(prototype, "Array")) return false;
	const objectPrototype = Object.getPrototypeOf(prototype);
	return typeof objectPrototype === "object" && objectPrototype !== null && isIntrinsicObjectPrototype(objectPrototype);
}
/** Return whether a record contains only own enumerable string keys. */
function hasOnlyEnumerableStringKeys(value) {
	try {
		return Reflect.ownKeys(value).every((key) => typeof key === "string" && Object.prototype.propertyIsEnumerable.call(value, key));
	} catch {
		return false;
	}
}
/**
* Test for an ordinary schema record whose keys survive JSON projection.
* @param value - candidate record from any JavaScript realm.
* @returns Whether the record has an intrinsic prototype and only own enumerable string keys.
*/
function isJsonSchemaRecord(value) {
	return isPlainJsonRecord(value) && hasOnlyEnumerableStringKeys(value);
}
/**
* Test for a dense ordinary array with no JSON-invisible decorations.
* @param value - candidate array from any JavaScript realm.
* @returns Whether the array is intrinsic, dense, and undecorated.
*/
function isPlainJsonArray(value) {
	if (!Array.isArray(value)) return false;
	try {
		if (!hasPlainArrayPrototype(value) || Reflect.ownKeys(value).length !== value.length + 1) return false;
		for (let index = 0; index < value.length; index++) if (!Object.hasOwn(value, index)) return false;
		return true;
	} catch {
		return false;
	}
}
/** Lossless finite JSON number, excluding negative zero. */
function isJsonNumber(value) {
	return typeof value === "number" && Number.isFinite(value) && !Object.is(value, -0);
}
/** Whether a scalar is valid for one declared schema type. */
function scalarMatches(type, value) {
	switch (type) {
		case "string": return typeof value === "string";
		case "number": return isJsonNumber(value);
		case "integer": return isJsonNumber(value) && Number.isInteger(value);
		case "boolean": return typeof value === "boolean";
		case "null": return value === null;
		/* v8 ignore next -- JsonSchemaScalarType is closed; this retains compile-time exhaustiveness. */
		default: return assertNever$1(type, "JsonSchemaType");
	}
}
/** Keywords that are invalid beside `oneOf`. */
const ONE_OF_SIBLING_KEYWORDS = [
	"properties",
	"required",
	"additionalProperties",
	"items",
	"enum",
	"const"
];
/** Validate object-only fields after its property schemas have been visited. */
function checkObjectSchemaTail(node, path, properties, violations) {
	const hasRequired = Object.hasOwn(node, "required");
	const required = hasRequired ? node.required : void 0;
	if (hasRequired) if (!isPlainJsonArray(required) || required.some((entry) => typeof entry !== "string")) violations.push(`${path}.required must be an array of strings`);
	else {
		const declared = isJsonSchemaRecord(properties) ? properties : {};
		for (const key of required) if (!Object.hasOwn(declared, key)) violations.push(`${path}.required names "${key}" which is not in properties`);
	}
	if (Object.hasOwn(node, "additionalProperties") && typeof node.additionalProperties !== "boolean") violations.push(`${path}.additionalProperties must be a boolean`);
}
/** Collect every violation for one raw schema tree without using the JavaScript call stack. */
function checkSchemaNode(root, rootPath, violations, seen) {
	const tasks = [{
		kind: "enter",
		node: root,
		path: rootPath
	}];
	for (let task = tasks.pop(); task !== void 0; task = tasks.pop()) {
		if (task.kind === "leave") {
			seen.delete(task.node);
			continue;
		}
		if (task.kind === "one-of-tail") {
			for (const key of ONE_OF_SIBLING_KEYWORDS) if (Object.hasOwn(task.node, key)) violations.push(`${task.path}.${key} is not supported beside oneOf`);
			continue;
		}
		if (task.kind === "object-tail") {
			checkObjectSchemaTail(task.node, task.path, task.properties, violations);
			continue;
		}
		const { node, path } = task;
		if (!isJsonSchemaRecord(node)) {
			violations.push(`${path} must be a schema object`);
			continue;
		}
		if (seen.has(node)) {
			violations.push(`${path} is circular`);
			continue;
		}
		seen.add(node);
		tasks.push({
			kind: "leave",
			node
		});
		for (const key of Object.keys(node)) {
			if (CONSTRAINT_KEYWORDS.has(key)) continue;
			if (ANNOTATION_KEYWORDS.has(key)) {
				try {
					if (!isJsonValue(node[key])) violations.push(`${path}.${key} annotation must be lossless JSON data`);
				} catch {
					violations.push(`${path}.${key} annotation must be lossless JSON data`);
				}
				continue;
			}
			violations.push(`${path}.${key} is not a supported keyword (subset: type/oneOf/properties/required/additionalProperties/items/enum/const + annotations)`);
		}
		if (Object.hasOwn(node, "description") && typeof node.description !== "string") violations.push(`${path}.description must be a string`);
		if (Object.hasOwn(node, "title") && typeof node.title !== "string") violations.push(`${path}.title must be a string`);
		const hasType = Object.hasOwn(node, "type");
		const hasOneOf = Object.hasOwn(node, "oneOf");
		if (hasType && hasOneOf) {
			violations.push(`${path} cannot declare both type and oneOf`);
			continue;
		}
		if (!hasType && !hasOneOf) {
			for (const key of ONE_OF_SIBLING_KEYWORDS) if (Object.hasOwn(node, key)) violations.push(`${path}.${key} requires type or oneOf`);
			continue;
		}
		if (hasOneOf) {
			const oneOf = node.oneOf;
			tasks.push({
				kind: "one-of-tail",
				node,
				path
			});
			if (!isPlainJsonArray(oneOf) || oneOf.length < 2) violations.push(`${path}.oneOf must be an array of at least two schemas`);
			else for (let index = oneOf.length - 1; index >= 0; index--) tasks.push({
				kind: "enter",
				node: oneOf[index],
				path: `${path}.oneOf[${index}]`
			});
			continue;
		}
		const type = node.type;
		if (typeof type !== "string" || !SCHEMA_TYPES.includes(type)) {
			violations.push(Array.isArray(type) ? `${path}.type must be a single type string (type arrays are not supported)` : `${path}.type must be one of ${SCHEMA_TYPES.join("/")}`);
			continue;
		}
		const schemaType = type;
		for (const [key, types] of Object.entries({
			properties: ["object"],
			required: ["object"],
			additionalProperties: ["object"],
			items: ["array"],
			enum: [
				"string",
				"number",
				"integer",
				"boolean",
				"null"
			],
			const: [
				"string",
				"number",
				"integer",
				"boolean",
				"null"
			]
		})) if (Object.hasOwn(node, key) && !types.includes(schemaType)) violations.push(`${path}.${key} is not supported on type "${schemaType}"`);
		switch (schemaType) {
			case "object": {
				const properties = Object.hasOwn(node, "properties") ? node.properties : void 0;
				tasks.push({
					kind: "object-tail",
					node,
					path,
					properties
				});
				if (Object.hasOwn(node, "properties")) if (!isJsonSchemaRecord(properties)) violations.push(`${path}.properties must be an object of schemas`);
				else {
					const entries = Object.entries(properties);
					for (let index = entries.length - 1; index >= 0; index--) {
						const entry = entries[index];
						/* v8 ignore next -- the loop is bounded by the captured entry count. */
						if (entry === void 0) continue;
						tasks.push({
							kind: "enter",
							node: entry[1],
							path: `${path}.properties.${entry[0]}`
						});
					}
				}
				break;
			}
			case "array":
				if (Object.hasOwn(node, "items")) tasks.push({
					kind: "enter",
					node: node.items,
					path: `${path}.items`
				});
				break;
			case "string":
			case "number":
			case "integer":
			case "boolean":
			case "null": {
				const hasEnum = Object.hasOwn(node, "enum");
				const allowed = hasEnum ? node.enum : void 0;
				const enumValid = isPlainJsonArray(allowed) && allowed.length > 0 && allowed.every((entry) => scalarMatches(schemaType, entry));
				if (hasEnum && !enumValid) violations.push(`${path}.enum must be a non-empty array of ${schemaType} values`);
				const hasConst = Object.hasOwn(node, "const");
				const declaredConst = hasConst ? node.const : void 0;
				const constValid = scalarMatches(schemaType, declaredConst);
				if (hasConst) {
					if (!constValid) violations.push(`${path}.const must be a ${schemaType} value`);
					else if (enumValid && !allowed.includes(declaredConst)) violations.push(`${path}.const must be one of ${path}.enum when both are declared`);
				}
				break;
			}
			/* v8 ignore next -- schemaType was narrowed from the closed SCHEMA_TYPES table above. */
			default: assertNever$1(schemaType, "JsonSchemaType");
		}
	}
}
/**
* Assert that an arbitrary raw schema uses only the enforced subset.
* Annotation-only schemas are accepted as the standard unconstrained-JSON
* form; callers that require an object root use {@link assertObjectJsonSchema}.
* @param schema - untrusted raw JSON Schema.
* @returns Assertion that the schema belongs to the supported subset.
*/
function assertSupportedJsonSchema(schema) {
	const violations = [];
	checkSchemaNode(schema, "schema", violations, /* @__PURE__ */ new Set());
	if (violations.length > 0) throw new JsonSchemaError(violations);
}
/** Safely test the lossless JSON boundary when a getter may throw. */
function safelyIsJsonValue(value) {
	try {
		return isJsonValue(value);
	} catch {
		return false;
	}
}
/** Root-aware diagnostic path for the parameter validator's empty sentinel. */
function diagnosticPath(path) {
	return path === "" ? "arguments" : path;
}
/** Append one object property without a leading dot at an implicit root. */
function propertyPath(path, key) {
	return path === "" ? key : `${path}.${key}`;
}
/** The generic exception-containment diagnostic owned by one valid schema node. */
function losslessValueViolation(path) {
	return [`"${diagnosticPath(path)}" must be a lossless JSON value`];
}
/** Append diagnostics without spreading a potentially wide child result as call arguments. */
function appendViolations(target, source) {
	for (const violation of source) target.push(violation);
}
/** Initialize one validation frame with empty aggregation state. */
function valueFrame(node, value, path) {
	return {
		node,
		value,
		path,
		catches: false,
		phase: "start",
		children: [],
		childIndex: 0,
		violations: [],
		tailViolations: [],
		matches: 0
	};
}
/** Validate one scalar node after its primitive type check. */
function checkScalarValue(node, value, path) {
	const allowed = Object.hasOwn(node, "enum") ? node.enum : void 0;
	if (allowed !== void 0 && !allowed.includes(value)) return [`"${diagnosticPath(path)}" must be one of ${JSON.stringify(allowed)}`];
	if (Object.hasOwn(node, "const") && value !== node.const) return [`"${diagnosticPath(path)}" must be ${JSON.stringify(node.const)}`];
	return [];
}
/** Validate one trusted schema/value pair with explicit frames rather than recursive calls. */
function checkValue(schema, value, path) {
	const frames = [valueFrame(schema, value, path)];
	let rootResult;
	const receive = (result) => {
		const parent = frames.at(-1);
		if (parent === void 0) {
			rootResult = result;
			return;
		}
		if (parent.kind === "oneOf") {
			if (result.length === 0) parent.matches++;
		} else appendViolations(parent.violations, result);
	};
	const finish = (result) => {
		frames.pop();
		receive(result);
	};
	while (frames.length > 0) {
		const frame = frames.at(-1);
		/* v8 ignore next -- the loop condition guarantees a current frame. */
		if (frame === void 0) break;
		try {
			if (frame.phase === "children") {
				if (frame.childIndex < frame.children.length) {
					const child = frame.children[frame.childIndex];
					/* v8 ignore next -- childIndex is bounded by children.length. */
					if (child === void 0) throw new Error("missing schema-value child frame");
					frame.childIndex++;
					frames.push(valueFrame(child.node, child.value, child.path));
					continue;
				}
				if (frame.kind === "oneOf") {
					finish(frame.matches === 1 ? [] : [`"${diagnosticPath(frame.path)}" must match exactly one oneOf branch (matched ${frame.matches})`]);
					continue;
				}
				appendViolations(frame.violations, frame.tailViolations);
				if (frame.violations.length > 0) finish(frame.violations);
				else if (frame.kind === "object") finish(safelyIsJsonValue(frame.value) ? [] : [`"${diagnosticPath(frame.path)}" must be a lossless JSON object`]);
				else finish(safelyIsJsonValue(frame.value) ? [] : [`"${diagnosticPath(frame.path)}" must be a dense lossless JSON array`]);
				continue;
			}
			const nodeType = Object.hasOwn(frame.node, "type") ? frame.node.type : void 0;
			frame.catches = !(nodeType !== void 0 && !SCHEMA_TYPES.includes(nodeType));
			const oneOf = Object.hasOwn(frame.node, "oneOf") ? frame.node.oneOf : void 0;
			if (oneOf !== void 0) {
				frame.kind = "oneOf";
				frame.children = Array.from(oneOf, (branch) => ({
					node: branch,
					value: frame.value,
					path: frame.path
				}));
				frame.childIndex = 0;
				frame.matches = 0;
				frame.phase = "children";
				continue;
			}
			if (nodeType === void 0) {
				finish(safelyIsJsonValue(frame.value) ? [] : losslessValueViolation(frame.path));
				continue;
			}
			switch (nodeType) {
				case "object": {
					if (!isPlainJsonRecord(frame.value)) {
						finish([`"${diagnosticPath(frame.path)}" must be an object`]);
						break;
					}
					const properties = Object.hasOwn(frame.node, "properties") ? frame.node.properties ?? {} : {};
					const violations = [];
					const required = Object.hasOwn(frame.node, "required") ? frame.node.required ?? [] : [];
					for (const key of required) if (!Object.hasOwn(frame.value, key) || frame.value[key] === void 0) violations.push(`missing required property "${propertyPath(frame.path, key)}"`);
					const children = [];
					for (const [key, child] of Object.entries(properties)) {
						if (!Object.hasOwn(frame.value, key) || frame.value[key] === void 0) continue;
						children.push({
							node: child,
							value: frame.value[key],
							path: propertyPath(frame.path, key)
						});
					}
					const tailViolations = [];
					if (Object.hasOwn(frame.node, "additionalProperties") && frame.node.additionalProperties === false) {
						for (const key of Object.keys(frame.value)) if (!Object.hasOwn(properties, key)) tailViolations.push(`"${propertyPath(frame.path, key)}" is not a declared property (additionalProperties: false)`);
					}
					frame.kind = "object";
					frame.children = children;
					frame.childIndex = 0;
					frame.violations = violations;
					frame.tailViolations = tailViolations;
					frame.phase = "children";
					break;
				}
				case "array": {
					if (!Array.isArray(frame.value)) {
						finish([`"${diagnosticPath(frame.path)}" must be an array`]);
						break;
					}
					const items = Object.hasOwn(frame.node, "items") ? frame.node.items : void 0;
					const children = items === void 0 ? [] : frame.value.flatMap((entry, index) => [{
						node: items,
						value: entry,
						path: `${frame.path}[${index}]`
					}]);
					frame.kind = "array";
					frame.children = children;
					frame.childIndex = 0;
					frame.violations = [];
					frame.phase = "children";
					break;
				}
				case "string":
					finish(typeof frame.value === "string" ? checkScalarValue(frame.node, frame.value, frame.path) : [`"${diagnosticPath(frame.path)}" must be a string`]);
					break;
				case "number":
					finish(typeof frame.value !== "number" ? [`"${diagnosticPath(frame.path)}" must be a number`] : !isJsonNumber(frame.value) ? [`"${diagnosticPath(frame.path)}" must be a finite JSON number`] : checkScalarValue(frame.node, frame.value, frame.path));
					break;
				case "integer":
					finish(!isJsonNumber(frame.value) || !Number.isInteger(frame.value) ? [`"${diagnosticPath(frame.path)}" must be an integer`] : checkScalarValue(frame.node, frame.value, frame.path));
					break;
				case "boolean":
					finish(typeof frame.value === "boolean" ? checkScalarValue(frame.node, frame.value, frame.path) : [`"${diagnosticPath(frame.path)}" must be a boolean`]);
					break;
				case "null":
					finish(frame.value === null ? checkScalarValue(frame.node, frame.value, frame.path) : [`"${diagnosticPath(frame.path)}" must be null`]);
					break;
				default: finish(assertNever$1(nodeType, "JsonSchemaType"));
			}
		} catch (error) {
			let failed = frames.pop();
			while (failed !== void 0 && !failed.catches) failed = frames.pop();
			if (failed === void 0) throw error;
			receive(losslessValueViolation(failed.path));
		}
	}
	/* v8 ignore next -- every root frame finishes or throws. */
	return rootResult ?? losslessValueViolation(path);
}
/**
* Validate a candidate value against an asserted raw schema. The function is
* total for arbitrary values and returns path-qualified violations.
* @param schema - a schema accepted by {@link assertSupportedJsonSchema}.
* @param value - the candidate JSON value.
* @param path - root label used in diagnostics.
* @returns All violations in walk order; empty means valid.
*/
function validateJsonSchemaValue(schema, value, path = "value") {
	return checkValue(schema, value, path);
}
/** Unified JSON-value schema DSL, inference, compilation, and typed tool helper. @module dsh-tools/schema */
const ANNOTATION_KEYS = [
	"description",
	"title",
	"default",
	"examples"
];
/** Throw one author-schema violation through the shared schema error type. */
function authorError(message) {
	throw new JsonSchemaError([message]);
}
/** Copy own annotation fields for validation by the raw-schema boundary. */
function copyAnnotations(source, target) {
	if (Object.hasOwn(source, "description")) target.description = source.description;
	if (Object.hasOwn(source, "title")) target.title = source.title;
	if (Object.hasOwn(source, "default")) target.default = source.default;
	if (Object.hasOwn(source, "examples")) target.examples = source.examples;
}
/** Reject author-only keys outside one node's declared vocabulary. */
function assertAuthorKeys(source, path, allowed) {
	for (const key of Object.keys(source)) if (!allowed.includes(key)) authorError(`${path}.${key} is not supported by the value schema DSL`);
}
/** Install a compiled node without giving `__proto__` assignment semantics. */
function assignCompiledNode(destination, node) {
	switch (destination.kind) {
		case "root":
			destination.holder.value = node;
			break;
		case "property":
			Object.defineProperty(destination.target, destination.key, {
				value: node,
				enumerable: true,
				configurable: true,
				writable: true
			});
			break;
		case "item":
			destination.target.items = node;
			break;
		case "one-of": destination.target[destination.index] = node;
	}
}
/** Install a compiled property map at its root or containing object node. */
function assignCompiledPropertyMap(destination, compiled) {
	if (destination.kind === "root") destination.holder.value = compiled;
	else destination.target.properties = compiled.properties;
}
/** Execute an author-schema compilation task graph without recursive descent. */
function runSchemaCompiler(initial) {
	const seen = /* @__PURE__ */ new Set();
	const tasks = [initial];
	for (let task = tasks.pop(); task !== void 0; task = tasks.pop()) {
		if (task.kind === "leave") {
			seen.delete(task.input);
			continue;
		}
		if (task.kind === "property-map-tail") {
			if (task.required.length > 0) {
				task.compiled.required = task.required;
				if (task.destination.kind === "object") task.destination.target.required = task.required;
			}
			continue;
		}
		if (task.kind === "property") {
			if (!isJsonSchemaRecord(task.property)) authorError(`${task.path} must be a value schema object`);
			if (Object.hasOwn(task.property, "required") && task.property.required !== true) authorError(`${task.path}.required must be true when present`);
			if (Object.hasOwn(task.property, "required") && task.property.required === true) task.required.push(task.key);
			tasks.push({
				kind: "value",
				input: task.property,
				path: task.path,
				allowRequired: true,
				destination: {
					kind: "property",
					target: task.properties,
					key: task.key
				}
			});
			continue;
		}
		if (task.kind === "property-map") {
			if (!isJsonSchemaRecord(task.input)) authorError(`${task.path} must be an object of value schemas`);
			if (seen.has(task.input)) authorError(`${task.path} is circular`);
			seen.add(task.input);
			const compiled = { properties: {} };
			const required = [];
			assignCompiledPropertyMap(task.destination, compiled);
			tasks.push({
				kind: "leave",
				input: task.input
			});
			tasks.push({
				kind: "property-map-tail",
				compiled,
				required,
				destination: task.destination
			});
			const entries = Object.entries(task.input);
			for (let index = entries.length - 1; index >= 0; index--) {
				const entry = entries[index];
				/* v8 ignore next -- the loop is bounded by the captured entry count. */
				if (entry === void 0) continue;
				tasks.push({
					kind: "property",
					property: entry[1],
					path: `${task.path}.${entry[0]}`,
					key: entry[0],
					properties: compiled.properties,
					required
				});
			}
			continue;
		}
		const { input, path } = task;
		if (!isJsonSchemaRecord(input)) authorError(`${path} must be a value schema object`);
		if (seen.has(input)) authorError(`${path} is circular`);
		seen.add(input);
		const authorKeys = [...ANNOTATION_KEYS, ...task.allowRequired ? ["required"] : []];
		const node = {};
		assignCompiledNode(task.destination, node);
		tasks.push({
			kind: "leave",
			input
		});
		if (Object.hasOwn(input, "oneOf")) {
			assertAuthorKeys(input, path, [
				...authorKeys,
				"oneOf",
				"type"
			]);
			if (Object.hasOwn(input, "type")) authorError(`${path} cannot declare both type and oneOf`);
			if (!isPlainJsonArray(input.oneOf)) authorError(`${path}.oneOf must be an array of at least two value schemas`);
			const branches = [];
			node.oneOf = branches;
			copyAnnotations(input, node);
			for (let index = input.oneOf.length - 1; index >= 0; index--) tasks.push({
				kind: "value",
				input: input.oneOf[index],
				path: `${path}.oneOf[${index}]`,
				allowRequired: false,
				destination: {
					kind: "one-of",
					target: branches,
					index
				}
			});
			continue;
		}
		const inputType = Object.hasOwn(input, "type") ? input.type : void 0;
		switch (inputType) {
			case "json":
				assertAuthorKeys(input, path, [...authorKeys, "type"]);
				copyAnnotations(input, node);
				break;
			case "object":
				assertAuthorKeys(input, path, [
					...authorKeys,
					"type",
					"properties",
					"additionalProperties"
				]);
				if (!Object.hasOwn(input, "additionalProperties") || typeof input.additionalProperties !== "boolean") authorError(`${path}.additionalProperties must be explicitly true or false`);
				node.type = "object";
				copyAnnotations(input, node);
				node.additionalProperties = input.additionalProperties;
				if (Object.hasOwn(input, "properties")) tasks.push({
					kind: "property-map",
					input: input.properties,
					path: `${path}.properties`,
					destination: {
						kind: "object",
						target: node
					}
				});
				break;
			case "array":
				assertAuthorKeys(input, path, [
					...authorKeys,
					"type",
					"items"
				]);
				node.type = "array";
				copyAnnotations(input, node);
				if (Object.hasOwn(input, "items")) tasks.push({
					kind: "value",
					input: input.items,
					path: `${path}.items`,
					allowRequired: false,
					destination: {
						kind: "item",
						target: node
					}
				});
				break;
			case "string":
			case "number":
			case "integer":
			case "boolean":
			case "null":
				assertAuthorKeys(input, path, [
					...authorKeys,
					"type",
					"enum",
					"const"
				]);
				node.type = inputType;
				copyAnnotations(input, node);
				if (Object.hasOwn(input, "enum")) {
					if (!isPlainJsonArray(input.enum)) authorError(`${path}.enum must be a non-empty array of scalar values`);
					node.enum = Array.from(input.enum, (entry) => entry);
				}
				if (Object.hasOwn(input, "const")) node.const = input.const;
				break;
			default: authorError(`${path}.type must be string/number/integer/boolean/null/array/object/json, or use oneOf`);
		}
	}
}
/** Compile one implicit property map, collecting per-property requiredness. */
function compilePropertyMap(input, path) {
	const holder = {};
	runSchemaCompiler({
		kind: "property-map",
		input,
		path,
		destination: {
			kind: "root",
			holder
		}
	});
	/* v8 ignore next -- the root task assigns before scheduling any descendants. */
	return holder.value ?? authorError(`${path} did not compile`);
}
/** Compile one author node without applying any consumer root restriction. */
function compileValueSchema(input, path) {
	const holder = {};
	runSchemaCompiler({
		kind: "value",
		input,
		path,
		allowRequired: false,
		destination: {
			kind: "root",
			holder
		}
	});
	/* v8 ignore next -- the root task assigns before scheduling any descendants. */
	return holder.value ?? authorError(`${path} did not compile`);
}
/**
* Compile one author-facing value schema to the enforced raw JSON Schema
* subset. The author-only `json` node becomes an annotation-only schema.
* @param spec - schema for any JSON-value root.
* @returns The asserted raw schema projection.
*/
function valueSchemaSpecToJsonSchema(spec) {
	const schema = compileValueSchema(spec, "schema");
	assertSupportedJsonSchema(schema);
	return schema;
}
/**
* Compile the implicit open parameter object into raw JSON Schema.
* @param spec - per-property parameter definitions.
* @returns An object-rooted raw schema with no implicit-root openness override.
*/
function parameterSchemaSpecToJsonSchema(spec) {
	const compiled = compilePropertyMap(spec, "parameters");
	const schema = {
		type: "object",
		properties: compiled.properties,
		...compiled.required === void 0 ? {} : { required: compiled.required }
	};
	assertSupportedJsonSchema(schema);
	return schema;
}
/** Invalid model-generated arguments for a typed tool. */
var ToolArgsError = class extends HarnessError {
	/** Individual violations in schema-walk order. */
	violations;
	constructor(violations) {
		super(`invalid arguments: ${violations.join("; ")}`, "INVALID_ARGS");
		this.name = "ToolArgsError";
		this.violations = violations;
	}
};
/**
* Define a first-party tool with inferred arguments and strict execution
* validation. Replay-only presenters validate softly and fall back to generic
* rendering for obsolete logged arguments.
* @param options - typed definition and optional finalizer and presenters.
* @returns A registry-ready definition.
*/
function defineTool(options) {
	const userExecute = options.execute;
	const userFinalizeContent = options.finalizeContent;
	const userProjectContent = options.projectContent;
	const userRender = options.output.render;
	const userPresentationMeta = options.output.presentationMeta;
	const userPresentCall = options.presentCall;
	const userPresentResult = options.presentResult;
	const userIsConcurrencySafe = options.isConcurrencySafe;
	if (options.timeoutMs !== void 0 && (!Number.isFinite(options.timeoutMs) || options.timeoutMs <= 0)) throw new Error(`defineTool(${options.name}): timeoutMs must be a positive finite number`);
	const parameters = parameterSchemaSpecToJsonSchema(options.parameters);
	const outputSchema = valueSchemaSpecToJsonSchema(options.output.schema);
	const validate = (args) => validateJsonSchemaValue(parameters, args, "");
	const tool = {
		name: options.name,
		description: options.description,
		parameters,
		output: {
			schema: outputSchema,
			render(args, value) {
				return userRender(args, value);
			},
			...userPresentationMeta !== void 0 ? { presentationMeta(args, value) {
				return userPresentationMeta(args, value);
			} } : {}
		},
		...options.deferLoading === true ? { deferLoading: options.deferLoading } : {},
		...options.timeoutMs !== void 0 ? { timeoutMs: options.timeoutMs } : {},
		async execute(args, exec) {
			const violations = validate(args);
			if (violations.length > 0) throw new ToolArgsError(violations);
			return userExecute(args, exec);
		}
	};
	if (userProjectContent) tool.projectContent = (exec, result) => userProjectContent(exec, result);
	if (userFinalizeContent) tool.finalizeContent = (exec, result) => userFinalizeContent(exec, result);
	if (userPresentCall) tool.presentCall = (args) => {
		if (validate(args).length > 0) return void 0;
		return userPresentCall(args);
	};
	if (userPresentResult) tool.presentResult = (args, result) => {
		if (validate(args).length > 0) return void 0;
		return userPresentResult(args, result);
	};
	if (userIsConcurrencySafe) tool.isConcurrencySafe = (args) => {
		if (validate(args).length > 0) return false;
		return userIsConcurrencySafe(args);
	};
	return tool;
}
/**
* PTC mode `run_code` transport. Programs call the registry's agent-visible
* tools through nested executions scheduled under the native concurrency
* contract; each sub-dispatch is logged for reconstruction, while only the
* outer curated result enters model history.
* @module @deepseek-ai/dsh-tools/src/ptc
*/
/** The model-facing name of the PTC mode tool. */
const RUN_CODE_NAME = "run_code";
/**
* The TypeScript flavor: the fallback for a schema read with no runtime
* mounted ({@link resolveFlavor} owns which readers reach that). A real
* assembly always resolves a runtime first, so the model never sees this
* fallback outside its own language.
*/
const TYPESCRIPT_FLAVOR = {
	description: "Execute a TypeScript program against the available tools. Takes two required arguments: `code`, the BODY of an async function (erasable syntax only; top-level `await` and `return` work), and `description`, a short summary of what the program does. Call tools as `await tools.name(args)` per the declarations in the system prompt. Only what you print or return is program output — curate it. Image-bearing subtool results are attached after the run.",
	codeDescription: "The program: the body of an async TypeScript function."
};
/** Per-language `run_code` schema flavors (see {@link RunCodeFlavor}); one entry per {@link PtcSdkLanguage}. */
const RUN_CODE_FLAVORS = {
	typescript: TYPESCRIPT_FLAVOR,
	python: {
		description: "Execute a Python program against the available tools. Takes two required arguments: `code`, the BODY of an async function (top-level `await` and `return` work), and `description`, a short summary of what the program does. Call tools as `await tools.name(args)` per the declarations in the system prompt. Use `print(...)` and/or `return <value>` for program output — curate it. Image-bearing subtool results are attached after the run.",
		codeDescription: "The program: the body of an async Python function."
	}
};
/**
* The `description` parameter's model-facing description: language-independent
* (the UI label contract is the same for every runtime), shared between the
* static spec and the language-aware `parameters` getter so the two emissions
* can never drift.
*/
const RUN_CODE_DESCRIPTION_PARAM_DESCRIPTION = "Clear, concise description of what this program does in active voice, 5-10 words (shown in the UI). Examples: \"Count TODO markers across packages\"; \"Read failing test and its fixture\"; \"Rename config key in every cordis.yml\".";
const RUN_CODE_CONTROLS = {
	timeoutMs: {
		type: "number",
		description: "Positive elapsed-time budget in milliseconds, capped by the deployment maximum."
	},
	sandbox_permissions: {
		type: "string",
		enum: [...ESCALATION_TARGETS],
		description: "Wider sandbox mode for this complete program execution; requires justification and approval."
	},
	justification: {
		type: "string",
		description: "Reason this complete program needs wider access, shown to the user for approval. Use the language of the user’s current request."
	}
};
function controlParameters(runtime) {
	if (runtime === void 0) return RUN_CODE_CONTROLS;
	return {
		...runtime.timeout === void 0 ? {} : { timeoutMs: {
			...RUN_CODE_CONTROLS.timeoutMs,
			description: `Positive elapsed-time budget in milliseconds, including nested tool and approval waits. Default ${runtime.timeout.defaultMs}; capped at ${runtime.timeout.maxMs}. Zero does not disable the deadline.`
		} },
		...runtime.sandboxMode === void 0 ? {} : {
			sandbox_permissions: RUN_CODE_CONTROLS.sandbox_permissions,
			justification: RUN_CODE_CONTROLS.justification
		}
	};
}
function escalationGuidance(runtime) {
	return runtime?.sandboxMode === void 0 ? "" : " A sandbox escalation approves this complete program for one execution only. Nested tools retain their own policies and approvals. Request wider access only after evidence of a denial. Earlier effects may already have completed: inspect them before explicitly retrying. Programs are never replayed automatically.";
}
/**
* Resolve the {@link RunCodeFlavor} for the loaded runtime's language, read at
* schema-emission time so the model-visible `run_code` schema always matches
* the SDK section's language. `peekRuntime` returns `undefined` only when no
* runtime is mounted, which reaches this function through definition readers
* and `schemas()` — the doc-catalog harvest is the only shipped one, and none
* of them feeds a model, because `wireSchemas` calls `requirePtcRuntime`
* before projecting — so that path degrades to {@link TYPESCRIPT_FLAVOR}. A
* mounted runtime whose language has no flavor entry fails loud, exactly as
* `requirePtcRuntime` rejects it at assembly. Keeping this table in step with
* `SDK_RENDERERS` is the compiler's job ({@link PtcSdkLanguage}); what this
* guard owns is the runtime-supplied language neither table knows, which never
* yields a wrong-language schema for a real runtime.
*/
function resolveFlavor(peekRuntime) {
	const runtime = peekRuntime();
	if (runtime === void 0) return TYPESCRIPT_FLAVOR;
	const flavor = RUN_CODE_FLAVORS[runtime.language];
	if (!Object.hasOwn(RUN_CODE_FLAVORS, runtime.language) || flavor === void 0) {
		const known = Object.keys(RUN_CODE_FLAVORS).map((name) => JSON.stringify(name)).join(", ");
		throw new Error(`dsh-tools: no run_code schema flavor registered for runtime language ${JSON.stringify(runtime.language)} (known: ${known})`);
	}
	return flavor;
}
/**
* Thrown by `run_code` when the program run itself failed — a program
* exception, a budget expiry, an abort, or substrate death. Extends
* {@link HarnessError} (`code: 'CODE_RUN_FAILED'`); the registry's execution
* pipeline converts it into a structured `isError` result whose text carries
* the failure kind plus the captured logs, so the model can self-correct.
*/
var CodeRunFailedError = class extends HarnessError {
	constructor(message) {
		super(message, "CODE_RUN_FAILED");
		this.name = "CodeRunFailedError";
	}
};
/**
* Snapshot one binding call's argument as lossless JSON, then snapshot that
* detached value again so dispatch and logging stay independent without
* reintroducing structured-clone's platform-specific nesting limit.
*/
function jsonNormalizeArgs(value) {
	let snapshot;
	try {
		snapshot = snapshotJsonValue(value);
	} catch (error) {
		throw new Error(`tool arguments must be lossless JSON: ${error instanceof Error ? error.message : String(error)}`);
	}
	if (snapshot === void 0) throw new Error("tool arguments must be lossless JSON (call the tool with an arguments object, e.g. `{}`)");
	const logged = snapshotJsonValue(snapshot);
	/* v8 ignore next -- snapshot is already a detached lossless JSON value. */
	if (logged === void 0) throw new Error("tool arguments could not be detached for durable logging");
	return {
		dispatched: snapshot,
		logged
	};
}
/** Two-space JSON presentation, matching the existing shallow `run_code` text contract. */
const JSON_INDENT = "  ";
/**
* ECMAScript caps `JSON.stringify`'s `space` string at ten characters. The
* renderer also caps TOTAL indentation there, compacting deeper subtrees, so
* formatted output remains linear in the canonical JSON size.
*/
const MAX_JSON_INDENT_CHARS = 10;
/** Render one non-string JSON root without recursive traversal or unbounded indentation growth. */
function renderJsonValue(value) {
	const chunks = [];
	const tasks = [{
		kind: "value",
		value,
		depth: 0,
		compact: false
	}];
	for (let task = tasks.pop(); task !== void 0; task = tasks.pop()) {
		if (task.kind === "text") {
			chunks.push(task.text);
			continue;
		}
		const current = task.value;
		if (current === null || typeof current === "boolean" || typeof current === "number") {
			chunks.push(String(current));
			continue;
		}
		if (typeof current === "string") {
			chunks.push(JSON.stringify(current));
			continue;
		}
		const compact = task.compact || (task.depth + 1) * 2 > MAX_JSON_INDENT_CHARS;
		const childDepth = task.depth + 1;
		if (Array.isArray(current)) {
			chunks.push("[");
			if (current.length === 0) {
				chunks.push("]");
				continue;
			}
			tasks.push({
				kind: "text",
				text: compact ? "]" : `\n${JSON_INDENT.repeat(task.depth)}]`
			});
			for (let index = current.length - 1; index >= 0; index--) {
				const item = current[index];
				/* v8 ignore next -- canonical JsonValue arrays are dense. */
				if (item === void 0) throw new Error("cannot render a sparse JSON array");
				tasks.push({
					kind: "value",
					value: item,
					depth: childDepth,
					compact
				});
				tasks.push({
					kind: "text",
					text: compact ? index === 0 ? "" : "," : `${index === 0 ? "\n" : ",\n"}${JSON_INDENT.repeat(childDepth)}`
				});
			}
			continue;
		}
		const keys = Object.keys(current);
		chunks.push("{");
		if (keys.length === 0) {
			chunks.push("}");
			continue;
		}
		tasks.push({
			kind: "text",
			text: compact ? "}" : `\n${JSON_INDENT.repeat(task.depth)}}`
		});
		for (let index = keys.length - 1; index >= 0; index--) {
			const key = keys[index];
			/* v8 ignore next -- the loop is bounded by the captured key count. */
			if (key === void 0) throw new Error("cannot render a missing JSON object key");
			const item = current[key];
			/* v8 ignore next -- canonical JsonValue records contain no undefined properties. */
			if (item === void 0) throw new Error("cannot render an undefined JSON object property");
			tasks.push({
				kind: "value",
				value: item,
				depth: childDepth,
				compact
			});
			tasks.push({
				kind: "text",
				text: compact ? `${index === 0 ? "" : ","}${JSON.stringify(key)}:` : `${index === 0 ? "\n" : ",\n"}${JSON_INDENT.repeat(childDepth)}${JSON.stringify(key)}: `
			});
		}
	}
	return chunks.join("");
}
/** Render one present program completion value for the model-facing result text. */
function renderValue(value) {
	return typeof value === "string" ? value : renderJsonValue(value);
}
/**
* Build the `run_code` {@link ToolDefinition}: required `code` and
* `description` parameters, executed through the dispatch bridge described
* above. The
* registry reserves it as presentation infrastructure under non-native modes,
* outside the filterable global/scoped capability layers.
* @param registry - the owning registry (sub-calls go through its `execute`,
*   bindings cover its registered tools).
* @param options - the registry-private capabilities described above.
* @returns the registry-ready definition.
*/
function createRunCodeTool(registry, options) {
	const { requireRuntime, peekRuntime, maxParallel, shapeDispatchLog } = options;
	const definition = defineTool({
		name: RUN_CODE_NAME,
		description: TYPESCRIPT_FLAVOR.description,
		parameters: {
			code: {
				type: "string",
				required: true,
				description: TYPESCRIPT_FLAVOR.codeDescription
			},
			description: {
				type: "string",
				required: true,
				description: RUN_CODE_DESCRIPTION_PARAM_DESCRIPTION
			},
			...RUN_CODE_CONTROLS
		},
		output: {
			schema: {
				type: "object",
				additionalProperties: false,
				properties: {
					logs: {
						type: "array",
						required: true,
						items: { type: "string" }
					},
					result: { type: "json" },
					sandbox: {
						type: "object",
						additionalProperties: false,
						properties: {
							mode: {
								type: "string",
								required: true,
								enum: [
									"read-only",
									"workspace-write",
									"danger-full-access"
								]
							},
							denied: {
								type: "boolean",
								required: true
							},
							enforcement: {
								type: "string",
								enum: ["full", "partial"]
							}
						}
					}
				}
			},
			render: (_args, value) => {
				const rendered = value.result === void 0 ? "" : renderValue(value.result);
				const parts = [value.logs.join("\n"), rendered].filter((part) => part.length > 0);
				if (value.sandbox?.enforcement === "partial") parts.push("File sandbox enforcement is partial on this host.");
				if (value.sandbox?.denied) parts.push(`The ${value.sandbox.mode} file sandbox denied an operation.${escalationGuidance(peekRuntime())}`);
				return [{
					type: "text",
					text: parts.length > 0 ? parts.join("\n") : "(run_code completed with no output)"
				}];
			}
		},
		async execute(args, exec) {
			if (args.description.trim().length === 0) throw new Error("invalid description: expected a non-empty string");
			const runtime = requireRuntime();
			validateEscalationArgs(args.sandbox_permissions, args.justification);
			if (args.timeoutMs !== void 0 && runtime.timeout === void 0) throw new Error("timeoutMs is not available for this PTC runtime");
			if (args.timeoutMs !== void 0 && (!Number.isFinite(args.timeoutMs) || args.timeoutMs <= 0)) throw new Error("invalid timeoutMs: expected a positive finite number");
			const standingPolicy = runtime.sandboxMode === void 0 ? void 0 : options.resolveSandboxPolicy(exec);
			let policy = standingPolicy;
			if (args.sandbox_permissions !== void 0 && args.justification !== void 0) {
				if (standingPolicy === void 0) throw new Error("sandbox_permissions is not available for this PTC runtime");
				const approvedMode = await approveEscalation({
					requestedMode: args.sandbox_permissions,
					justification: args.justification,
					effectiveMode: standingPolicy.mode,
					subject: "program"
				}, {
					approver: options.peekApprover(),
					agent: exec.agent,
					callId: exec.callId,
					toolName: RUN_CODE_NAME,
					signal: exec.signal
				});
				policy = {
					...standingPolicy,
					mode: approvedMode
				};
			}
			exec.signal.throwIfAborted();
			const runController = new AbortController();
			const onOuterAbort = () => {
				runController.abort(exec.signal.reason);
			};
			exec.signal.addEventListener("abort", onOuterAbort, { once: true });
			let dispatches = 0;
			const pendingQueue = [];
			const inFlight = /* @__PURE__ */ new Set();
			/** Tracked settle-event side work (log-content listener + append), drained at run settlement. */
			const logWork = /* @__PURE__ */ new Set();
			const commitQueue = [];
			let exclusiveActive = false;
			let driving = false;
			let driverRun = Promise.resolve();
			let wake;
			const wakeup = () => {
				const release = wake;
				wake = void 0;
				release?.();
			};
			/**
			* The single ordered lane. Each pass commits the head-of-line settled
			* dispatch (ordered post-execute), then starts the next queued entry if
			* its slot is free (ordered pre-execute), and otherwise sleeps until a
			* body settles or a new submission arrives. One run reaching the
			* empty-queues/empty-pool state is quiescence.
			*/
			const drive = () => {
				if (driving) return driverRun;
				driving = true;
				driverRun = (async () => {
					try {
						for (;;) {
							const signal = new Promise((resolve) => {
								wake = resolve;
							});
							const commitHead = commitQueue[0];
							if (commitHead !== void 0 && commitHead.settled) {
								commitQueue.shift();
								await commitHead.commit();
								if (commitHead.mode === "exclusive") exclusiveActive = false;
								continue;
							}
							const head = pendingQueue[0];
							if (head !== void 0) {
								if (runController.signal.aborted) {
									pendingQueue.shift();
									head.abandon();
									continue;
								}
								const mode = head.classify();
								if (!exclusiveActive && (mode === "exclusive" ? inFlight.size === 0 : inFlight.size < maxParallel)) {
									if (mode === "exclusive") exclusiveActive = true;
									head.mode = mode;
									pendingQueue.shift();
									commitQueue.push(head);
									await head.start();
									const flight = head.flight.finally(() => {
										inFlight.delete(flight);
										wakeup();
									});
									inFlight.add(flight);
									continue;
								}
							}
							if (pendingQueue.length === 0 && commitQueue.length === 0 && inFlight.size === 0) return;
							await signal;
						}
					} finally {
						driving = false;
						wake = void 0;
					}
				})();
				return driverRun;
			};
			/** Every dispatch settled AND committed; nothing can start (the run is aborted at call time). */
			const drainDispatches = async () => {
				await drive();
				while (logWork.size > 0) await Promise.allSettled([...logWork]);
			};
			const runOver = () => runController.signal.aborted;
			const binding = (schema) => async (rawArgs) => {
				const { name } = schema;
				if (runOver()) throw new Error(`run_code run is over (${String(runController.signal.reason)}); ${name} not dispatched`);
				const normalized = jsonNormalizeArgs(rawArgs);
				const n = ++dispatches;
				const subCallId = brandString(`${String(exec.callId)}:ptc:${n}`);
				const input = {
					callId: subCallId,
					rootCallId: exec.rootCallId,
					name,
					schema,
					arguments: normalized.dispatched,
					...exec.agent ? { agent: exec.agent } : {},
					parent: exec.token,
					signal: runController.signal
				};
				const scheduler = registry[TOOL_RUNTIME_SCHEDULER];
				const outcome = await new Promise((resolve, reject) => {
					let parked;
					const settle = (result) => {
						resolve(result.isError ? {
							isError: true,
							message: result.error.message
						} : {
							isError: false,
							value: result.value
						});
						const agent = exec.agent;
						if (agent === void 0) return;
						const task = (async () => {
							const logged = await shapeDispatchLog({
								exec,
								agent,
								subCallId,
								name,
								isError: result.isError,
								content: result.content
							});
							agent.session.append("tool/ptc-dispatch", {
								rootCallId: exec.rootCallId,
								parentCallId: exec.callId,
								subCallId,
								name,
								arguments: normalized.logged,
								isError: result.isError,
								...result.error?.info === void 0 ? {} : { error: result.error.info },
								content: logged
							});
						})().finally(() => {
							logWork.delete(task);
						});
						logWork.add(task);
					};
					pendingQueue.push({
						flight: Promise.resolve(),
						settled: false,
						classify: () => registry.executionMode(input).kind,
						abandon: () => {
							reject(/* @__PURE__ */ new Error(`run_code run is over (${String(runController.signal.reason)}); ${name} tool call abandoned`));
						},
						async start() {
							exec.agent?.session.append("tool/ptc-dispatch-start", {
								rootCallId: exec.rootCallId,
								parentCallId: exec.callId,
								subCallId,
								name,
								arguments: normalized.logged
							});
							const prepared = await scheduler.prepare(input);
							if (prepared.kind === "dispatch") {
								this.flight = scheduler.dispatch(prepared.exec).then((dispatchOutcome) => {
									parked = {
										kind: dispatchOutcome.kind,
										exec: prepared.exec,
										result: dispatchOutcome.result
									};
									this.settled = true;
								});
								return;
							}
							parked = {
								kind: prepared.kind,
								exec: prepared.exec,
								result: prepared.result
							};
							this.settled = true;
						},
						async commit() {
							/* v8 ignore next -- commit() runs only after `settled` flipped, which set parked. */
							if (parked === void 0) return;
							const result = parked.kind === "post-result" ? await scheduler.finalize(parked.exec, parked.result) : scheduler.finish(parked.exec, parked.result);
							if (!result.isError && result.content.some((block) => block.type === "image")) exec.deferContext(createUserMessage({
								content: result.content,
								source: { kind: "ptc-mode" }
							}));
							for (const context of result.additionalContexts ?? []) exec.deferContext(context);
							if (result.concludesTurn) exec.concludeTurn();
							settle(result);
							while (logWork.size > maxParallel) await Promise.race(logWork);
						}
					});
					wakeup();
					drive();
				});
				if (runOver()) throw new Error(`run_code run is over (${String(runController.signal.reason)}); ${name} result discarded`);
				if (outcome.isError) throw new Error(outcome.message);
				return outcome.value;
			};
			const functions = Object.create(null);
			for (const schema of registry.schemas(exec.agent)) {
				if (schema.name === "run_code") continue;
				Object.defineProperty(functions, schema.name, {
					enumerable: true,
					value: binding(deepFreeze(schema))
				});
			}
			try {
				let result;
				try {
					result = await runtime.run(runtime.resolve({
						program: args.code,
						bindings: [{
							global: "tools",
							functions,
							errorClass: {
								name: "ToolCallError",
								memberNameProperty: "toolName"
							}
						}],
						signal: runController.signal,
						...exec.agent?.session.header.cwd !== void 0 ? { cwd: exec.agent.session.header.cwd } : {},
						...policy !== void 0 ? { sandboxPolicy: policy } : {},
						...args.timeoutMs !== void 0 ? { timeoutMs: args.timeoutMs } : {}
					}));
				} finally {
					runController.abort("run_code settled");
					await drainDispatches();
				}
				if (result.error) {
					const logsText = result.logs.length > 0 ? `\nCaptured output:\n${result.logs.join("\n")}` : "";
					const sandboxText = result.sandbox === void 0 ? "" : `\nFile sandbox: ${result.sandbox.mode}${result.sandbox.enforcement === void 0 ? "" : `; enforcement: ${result.sandbox.enforcement}`}${result.sandbox.denied ? "; operation denied" : ""}.`;
					throw new CodeRunFailedError(`code run failed (${result.error.kind}): ${result.error.message}${logsText}${sandboxText}${result.sandbox?.denied ? escalationGuidance(runtime) : ""}`);
				}
				return {
					logs: result.logs,
					...result.sandbox === void 0 ? {} : { sandbox: result.sandbox },
					...result.value !== void 0 ? { result: result.value } : {}
				};
			} finally {
				exec.signal.removeEventListener("abort", onOuterAbort);
			}
		},
		presentCall: (args) => ({
			card: "generic",
			title: args.description,
			kind: "execute",
			rawInput: args.code
		})
	});
	Object.defineProperty(definition, "description", {
		enumerable: true,
		get: () => {
			const runtime = peekRuntime();
			const instructions = runtime?.executionInstructions;
			return resolveFlavor(peekRuntime).description + (instructions ? ` ${instructions}` : "") + (runtime === void 0 ? "" : " The working directory is the Session's current directory.") + escalationGuidance(runtime);
		}
	});
	Object.defineProperty(definition, "parameters", {
		enumerable: true,
		get: () => parameterSchemaSpecToJsonSchema({
			code: {
				type: "string",
				required: true,
				description: resolveFlavor(peekRuntime).codeDescription
			},
			description: {
				type: "string",
				required: true,
				description: RUN_CODE_DESCRIPTION_PARAM_DESCRIPTION
			},
			...controlParameters(peekRuntime())
		})
	});
	return definition;
}
/**
* PTC mode codegen: the pure projection from registered tool schemas to the TypeScript SDK
* text the model programs against (the `tools:sdk` prompt section). Sibling of
* `json-schema.ts` — `schemas()` (native function calling) and this module (the generated
* `declare const tools` API) are two projections of the same store.
* @module @deepseek-ai/dsh-tools/src/ts-types
*/
/** Property names that are valid bare TS identifiers; anything else is quoted. */
const IDENTIFIER$1 = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
/** Render an object key: bare when it is a valid identifier, quoted otherwise (every name stays reachable, no aliasing). */
function renderKey(name) {
	return IDENTIFIER$1.test(name) ? name : JSON.stringify(name);
}
/** One `indent`-deep line prefix (two spaces per level). */
function pad$1(indent) {
	return "  ".repeat(indent);
}
/** A one-line JSDoc block for a schema `description`, or no lines when there is none. */
function docLines$1(description, indent) {
	if (typeof description !== "string" || description.length === 0) return [];
	const collapsed = description.replace(/\s+/g, " ").trim();
	return [`${pad$1(indent)}/** ${collapsed.replaceAll("*/", String.raw`*\/`)} */`];
}
/** Render one scalar already validated by the unified schema boundary. */
function renderScalar(value) {
	return JSON.stringify(value);
}
/** Render a validated scalar `const`/`enum`, falling back to the broad type. */
function renderConstrainedScalar$1(node, type) {
	const broad = type === "integer" ? "number" : type;
	if (Object.hasOwn(node, "const")) return renderScalar(node.const);
	if (Object.hasOwn(node, "enum")) return node.enum.map(renderScalar).join(" | ");
	return broad;
}
/** Build one document from captured parts while retaining the legacy array-parenthesization test. */
function typeDocumentFrom(parts) {
	return {
		parts,
		containsUnionOrIntersection: parts.some((part) => typeof part === "string" ? part.includes("|") || part.includes("&") : part.containsUnionOrIntersection)
	};
}
/** Build a small document without an intermediate array at each call site. */
function typeDocument(...parts) {
	return typeDocumentFrom(parts);
}
/** Flatten a nested document with an explicit work stack. */
function flattenTypeDocument(document) {
	const chunks = [];
	const tasks = [document];
	for (let task = tasks.pop(); task !== void 0; task = tasks.pop()) {
		if (typeof task === "string") {
			chunks.push(task);
			continue;
		}
		for (let index = task.parts.length - 1; index >= 0; index--) {
			const part = task.parts[index];
			/* v8 ignore next -- the loop is bounded by the captured part count. */
			if (part !== void 0) tasks.push(part);
		}
	}
	return chunks.join("");
}
/** Initialize one schema-render frame with empty aggregation state. */
function schemaRenderFrame(node, indent) {
	return {
		node,
		indent,
		phase: "start",
		children: [],
		childIndex: 0,
		childDocuments: [],
		entries: []
	};
}
/** Render an already asserted schema to a composable document. */
function renderSupportedSchema(schema, indent) {
	const frames = [schemaRenderFrame(schema, indent)];
	let rootDocument;
	const finish = (document) => {
		frames.pop();
		const parent = frames.at(-1);
		if (parent === void 0) rootDocument = document;
		else parent.childDocuments.push(document);
	};
	while (frames.length > 0) {
		const frame = frames.at(-1);
		/* v8 ignore next -- the loop condition guarantees a current frame. */
		if (frame === void 0) break;
		if (frame.phase === "children") {
			if (frame.childIndex < frame.children.length) {
				const child = frame.children[frame.childIndex];
				/* v8 ignore next -- childIndex is bounded by children.length. */
				if (child === void 0) throw new Error("missing schema render child");
				frame.childIndex++;
				frames.push(schemaRenderFrame(child.node, child.indent));
				continue;
			}
			if (frame.kind === "oneOf") {
				const parts = [];
				for (let index = 0; index < frame.childDocuments.length; index++) {
					if (index > 0) parts.push(" | ");
					const child = frame.childDocuments[index];
					/* v8 ignore next -- child documents correspond one-to-one with children. */
					if (child !== void 0) parts.push(child);
				}
				finish(typeDocumentFrom(parts));
				continue;
			}
			if (frame.kind === "array") {
				const child = frame.childDocuments[0];
				/* v8 ignore next -- array frames always schedule exactly one child. */
				if (child === void 0) throw new Error("missing array item type");
				finish(child.containsUnionOrIntersection ? typeDocument("(", child, ")[]") : typeDocument(child, "[]"));
				continue;
			}
			const required = new Set(frame.node.required);
			const parts = ["{"];
			for (let index = 0; index < frame.entries.length; index++) {
				const entry = frame.entries[index];
				const child = frame.childDocuments[index];
				/* v8 ignore next -- object entries and child documents have the same length. */
				if (entry === void 0 || child === void 0) throw new Error("missing object property type");
				const [name, prop] = entry;
				for (const line of docLines$1(prop.description, frame.indent + 1)) parts.push("\n", line);
				parts.push("\n", `${pad$1(frame.indent + 1)}${renderKey(name)}${required.has(name) ? "" : "?"}: `, child, ";");
			}
			parts.push("\n", `${pad$1(frame.indent)}}`);
			const declared = typeDocumentFrom(parts);
			finish(frame.node.additionalProperties === false ? declared : typeDocument(declared, " & Record<string, JsonValue>"));
			continue;
		}
		const node = frame.node;
		if (node.oneOf !== void 0) {
			frame.kind = "oneOf";
			frame.children = Array.from(node.oneOf, (child) => ({
				node: child,
				indent: frame.indent
			}));
			frame.childIndex = 0;
			frame.childDocuments = [];
			frame.phase = "children";
			continue;
		}
		if (node.type === void 0) {
			finish(typeDocument("JsonValue"));
			continue;
		}
		switch (node.type) {
			case "string":
			case "number":
			case "integer":
			case "boolean":
			case "null":
				finish(typeDocument(renderConstrainedScalar$1(node, node.type)));
				break;
			case "array":
				if (node.items === void 0) finish(typeDocument("JsonValue[]"));
				else {
					frame.kind = "array";
					frame.children = [{
						node: node.items,
						indent: frame.indent
					}];
					frame.childIndex = 0;
					frame.childDocuments = [];
					frame.phase = "children";
				}
				break;
			case "object": {
				const open = node.additionalProperties !== false;
				const entries = Object.entries(node.properties ?? {});
				if (entries.length === 0) finish(typeDocument(open ? "Record<string, JsonValue>" : "Record<string, never>"));
				else {
					frame.kind = "object";
					frame.entries = entries;
					frame.children = entries.map(([, child]) => ({
						node: child,
						indent: frame.indent + 1
					}));
					frame.childIndex = 0;
					frame.childDocuments = [];
					frame.phase = "children";
				}
				break;
			}
			/* v8 ignore next -- assertSupportedJsonSchema narrowed this closed type union. */
			default: finish(typeDocument("unknown"));
		}
	}
	/* v8 ignore next -- every root frame produces one document. */
	return rootDocument ?? typeDocument("unknown");
}
/**
* Map one enforced JSON-Schema node to a TypeScript type literal. Supports
* every unified schema construct and returns `unknown` for malformed or
* unsupported inputs without throwing.
* @param schema - the JSON-Schema node (any shape; hostile inputs degrade).
* @param indent - the indentation level for nested object members.
* @returns the TS type text (multi-line for objects with properties).
*/
function jsonSchemaToTs(schema, indent = 0) {
	try {
		assertSupportedJsonSchema(schema);
		return flattenTypeDocument(renderSupportedSchema(schema, indent));
	} catch {
		return "unknown";
	}
}
/** The fixed model-facing usage contract rendered above the declarations (see the PTC mode Agent Note's "What the model sees"). */
const SDK_INSTRUCTIONS$1 = `## Writing code for run_code

\`run_code\` takes two required arguments: \`code\` — the body of an async TypeScript function (erasable syntax only — no \`enum\` or namespaces; type annotations are advisory, the code runs type-stripped) — and \`description\`, a short summary of what the program does. The declarations below are SDK bindings for this program. A declaration does not make its name a directly callable tool; only names supplied as separate tool schemas may be called directly.`;
const SDK_PROGRAM_INSTRUCTIONS = `Inside the program:

- Call tools as \`await tools.name(args)\` — quoted access for exotic names: \`tools["my-tool"](args)\`. Every call resolves to the tool's typed canonical JSON value. Tool arguments must be lossless JSON.
- A FAILED tool call rejects with \`ToolCallError\`, whose \`toolName\` identifies the failed tool and whose \`message\` is human-readable — \`try/catch\` it to handle and continue.
- Independent read-only calls MAY overlap under \`Promise.all\` (safe calls run concurrently; mutating calls run alone, in submission order). Sequence dependent work with \`await\`.
- Emit results with \`return\` and/or \`console.log(...)\`. Only what you print or return is program output. A successful tool result containing an image is attached after the run so you can inspect it on the next step; every other intermediate result stays out of the conversation, so extract just what you need.

Program-only SDK bindings:`;
/** Whether one string schema accepts the literal used by the bash example. */
function acceptsExampleString(schema, value) {
	return schema?.type === "string" && (schema.const === void 0 || schema.const === value) && (schema.enum === void 0 || schema.enum.includes(value));
}
/** Render the bash example only when its literal arguments satisfy the current parameter schema. */
function renderBashExample(schemas) {
	const bash = schemas.find((schema) => schema.name === "bash");
	if (bash === void 0) return "";
	const parameters = bash.parameters;
	if (parameters.type !== "object") return "";
	const required = parameters.required ?? [];
	if (required.some((name) => name !== "command" && name !== "description")) return "";
	if (!acceptsExampleString(parameters.properties?.command, "pwd")) return "";
	const needsDescription = required.includes("description");
	if (needsDescription && !acceptsExampleString(parameters.properties?.description, "Show current directory")) return "";
	return ` When no separate \`bash\` schema is supplied, invoke a declared \`bash\` binding inside \`run_code\`:\n\n\`run_code({ code: "return await tools.bash({ command: 'pwd'${needsDescription ? ", description: 'Show current directory'" : ""} })", description: "Show current directory" })\``;
}
/**
* Render the full `tools:sdk` prompt section: the fixed usage instructions
* plus one `declare const tools` interface covering every given tool.
* Deterministic — tools are emitted in lexicographic name order, so an
* unchanged tool set produces byte-identical text across assemblies. The sort
* is not a total order on byte-equal names, so two schemas sharing a name
* would render in argument order; the caller's visible-capability map is keyed
* by name, so the input never carries a duplicate.
* @param schemas - the tool schemas to declare (the caller excludes
*   `run_code` itself).
* @returns the complete section text.
*/
function renderToolsSdk(schemas) {
	const sorted = [...schemas].sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
	const argsMembers = [];
	const outputMembers = [];
	for (const schema of sorted) {
		argsMembers.push(...docLines$1(schema.description, 1));
		argsMembers.push(`${pad$1(1)}${renderKey(schema.name)}: ${jsonSchemaToTs(schema.parameters, 1)};`);
		outputMembers.push(`${pad$1(1)}${renderKey(schema.name)}: ${jsonSchemaToTs(schema.output, 1)};`);
	}
	const declaration = [
		`interface ToolArgsMap {${argsMembers.length > 0 ? `\n${argsMembers.join("\n")}\n` : ""}}`,
		`interface ToolOutputMap {${outputMembers.length > 0 ? `\n${outputMembers.join("\n")}\n` : ""}}`,
		"type ToolName = keyof ToolOutputMap",
		[
			"declare class ToolCallError extends Error {",
			"  readonly name: \"ToolCallError\";",
			"  readonly toolName: ToolName;",
			"}"
		].join("\n"),
		[
			"declare const tools: {",
			"  [K in ToolName]: (args: ToolArgsMap[K]) => Promise<ToolOutputMap[K]>;",
			"}"
		].join("\n")
	].join("\n\n");
	return `${SDK_INSTRUCTIONS$1}${renderBashExample(sorted)}\n\n${SDK_PROGRAM_INSTRUCTIONS}\n\n\`\`\`ts\ntype JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue }\n\n${declaration}\n\`\`\``;
}
/**
* PTC mode codegen — Python flavor. The pure projection from registered tool schemas to the
* Python SDK text the model programs against under `runtime.language === 'python'`. Sibling of
* {@link ./ts-types.ts | ts-types.ts}; the two files are two projections of the same registry
* store, keyed by the loaded {@link @deepseek-ai/dsh-ptc-runtime#PtcRuntime.language | PTC
* runtime's language}.
*
* Under `mode: 'ptc'` the native tool schemas are omitted from the request, so this generated
* SDK is the model's ONLY source for each tool's argument names, required fields, types,
* descriptions, and canonical output shapes; under `mode: 'both'` the native schemas ship
* alongside it and it is one of two. Object-shaped arguments and outputs therefore render as one
* named `TypedDict` per tool (and per nested object), not an opaque `dict[str, Any]`, so the
* shape survives into the program under the mode that has nothing else to carry it.
* @module @deepseek-ai/dsh-tools/src/py-types
*/
/**
* The reference grammar's `xid_start xid_continue*` — the set
* `str.isidentifier()` accepts on a CPython whose Unicode tables match the
* engine's. See {@link isBareIdentifier} for what a version skew does.
*/
const IDENTIFIER = /^[\p{XID_Start}_]\p{XID_Continue}*$/u;
/**
* Whether a name can be emitted as a bare Python identifier rather than
* routed to the subscript/`dict[str, Any]` path.
*
* Python identifiers are not ASCII: `路径` is as legal a field name as `path`,
* and rejecting it would degrade the whole enclosing object, dropping every
* field's name, requiredness, and type — information whose only source under
* `mode: 'ptc'` is this generated text.
*
* NFKC stability is a second and separate condition, because CPython
* normalizes identifiers at compile time while JSON keys are compared as
* written: `ﬁeld` would be declared and reachable as `field`, so the SDK would
* advertise a key under a spelling the harness never accepts, and two keys
* that normalize together would collapse into one declaration. Those names
* take the subscript path, which carries their exact bytes.
*
* `IDENTIFIER` matches `str.isidentifier()` (measured on Node 22.23.1 vs
* CPython 3.9.6 tables): the equivalence holds inside the two versions' shared
* tables, and the skew characters below are exactly where that pair diverges.
* The predicate as a whole is deliberately stricter than `isidentifier()`,
* which does not test NFKC stability: `'ﬁeld'.isidentifier()` is True and
* this returns false.
*
* Both conditions are evaluated against the ENGINE's Unicode tables, and the
* two sides are versioned independently — `\p{XID_Start}`/`\p{XID_Continue}`
* follow the running engine (Node 22.23.1 reports Unicode 17.0) while CPython
* follows its own (3.9.6 reports 13.0.0). The skew is not symmetric. A CPython
* older than the engine is the dangerous direction: a character added to either
* property since its tables (U+10570 Vithkuqi and U+1E290 Toto, 14.0; U+1E4D0
* Nag Mundari, 15.0; U+1C89 Cyrillic TJE, 16.0 — ages per `DerivedAge.txt`; all
* four are NFKC-stable and accepted here, and all four are `Cn` on that 3.9.6,
* which rejects them) is emitted bare and its tokenizer refuses the character,
* taking the whole SDK block down — the same parseability invariant
* {@link UNPRINTABLE}, {@link LONE_SURROGATE} and {@link MAX_LIST_NESTING}
* exist for. Both properties carry it: a character added only to `XID_Continue`
* passes the trailing `\p{XID_Continue}*` in a tail position and fails the same
* way — U+200C ZWNJ and U+200D ZWJ are that case, gaining `XID_Continue` in UCD
* 15.1 and absent from it in 13.0.0, 14.0.0 and 15.0.0, so `a\u{200C}b` is
* emitted bare here while `isidentifier()` is False on 3.9.6 and on 3.12.13
* (15.0.0). A CPython newer than the engine only routes a legal name to the
* subscript/`dict[str, Any]` path: less readable, still correct. The NFKC
* condition reduces to the same skew, since normalization stability guarantees
* an assigned character's normalization never changes afterwards.
*
* This predicate is not the only reader of engine tables. {@link camelCase}
* reads them at three further points — its split set, its head test, and its
* `toUpperCase()` case mapping — and this predicate's verdict gates none of
* them: a class name derived there reaches emitted text whenever any object
* shape in the tool's schema declares a `TypedDict`, including for a tool this
* predicate rejected. A tool named `zz-\u{1E4D0}x` with such parameters never
* reaches the skew here (the `-` rejects it outright) yet emits `class
* Zz\u{1E4D0}xArgs`, which that same 3.9.6 refuses — Nag Mundari arrived two
* releases after its tables. The case mapping is a separate table rather than
* an XID membership test, and it fails on names both conditions above accept:
* `\u{019B}` is XID_Start and NFKC-stable, so this predicate accepts it and
* `async def \u{019B}` compiles on 3.9.6, but Node uppercases it to
* `\u{A7DC}` — unassigned in that CPython, whose own `.upper()` is the identity
* here — and the declared `class \u{A7DC}Args` fails with `invalid
* non-printable character U+A7DC`. Closing the exposure therefore covers all
* four read points, not this predicate alone; it needs the target interpreter's
* version, which the backend reporting `language: 'python'` owns; the
* language-dispatch Agent Note records the deferral.
*
* The `ts-types` sibling keeps its own ASCII rule rather than sharing this
* one: ECMAScript identifiers are a different set (`$`) and are never
* normalized, so one predicate cannot be correct for both. ZWJ/ZWNJ are not
* part of that difference — both sets carry them on the engine's tables; what
* separates the two there is the CPython table version above.
* @param name - the raw schema field or tool name.
* @returns whether the name can be emitted bare.
*/
function isBareIdentifier(name) {
	return IDENTIFIER.test(name) && name.normalize("NFKC") === name;
}
/**
* Python hard keywords: reserved everywhere, so a tool or field named
* ``class`` or ``lambda`` is legal on the wire but not as an attribute
* (``tools.class`` would be a SyntaxError in the model program) and not as a
* class-syntax `TypedDict` field. Such a tool renders under subscript access
* and such an object degrades to ``dict[str, Any]`` — the model still reaches
* every tool and field without collisions.
* Soft keywords (``match``, ``case``, ``type``, ``_`` — the language
* reference's whole set) are deliberately ABSENT: each is special in exactly
* one syntactic position — a statement head (``match``, ``type``), a ``match``
* statement's clause head (``case``), or a pattern (``_``) — so ``match: str``
* as a field and ``async def match(...)`` as a method are both legal, and
* including them would needlessly degrade common search/regex tool fields to
* ``dict[str, Any]``. Underscore-leading names are handled separately, not
* here: a non-dunder ``__token`` name-mangles, a dunder present on
* ``object``/``type`` resolves before the proxy hook, and implicit
* special-method lookup bypasses the hook.
*/
const RESERVED = /* @__PURE__ */ new Set([
	"False",
	"None",
	"True",
	"and",
	"as",
	"assert",
	"async",
	"await",
	"break",
	"class",
	"continue",
	"def",
	"del",
	"elif",
	"else",
	"except",
	"finally",
	"for",
	"from",
	"global",
	"if",
	"import",
	"in",
	"is",
	"lambda",
	"nonlocal",
	"not",
	"or",
	"pass",
	"raise",
	"return",
	"try",
	"while",
	"with",
	"yield",
	"__debug__"
]);
/** `typing` symbols this module may emit, in the deterministic import order. */
const TYPING_ORDER = [
	"Any",
	"Literal",
	"NotRequired",
	"Protocol",
	"TypedDict"
];
/** `indent`-deep line prefix (four spaces per level to match PEP 8 output). */
function pad$2(indent) {
	return "    ".repeat(indent);
}
/**
* The `Cc` code points that survive the whitespace collapse in {@link describe}
* and have no printable form: the C0 controls, DEL, and the C1 controls. Only
* U+0009 to U+000D are absent, because ECMAScript `\s` already collapsed them —
* `\s` is TAB/VT/FF/SP/NBSP/ZWNBSP/Zs plus LF/CR/LS/PS, so no C1 code point is
* in it and the whole U+0080 to U+009F block reaches this rule intact. Those
* are not hypothetical input: they are what Windows-1252 bytes 0x80 to 0x9F
* (smart quotes, em dash) become when decoded as Latin-1.
* CPython rejects source containing a NUL outright
* (`SyntaxError: source code string cannot contain null bytes`), whether it
* sits in a docstring or in a comment, so one such byte anywhere in a schema
* description would make the whole generated SDK unparseable — under
* `mode: 'ptc'`, the model's only declaration of the tools. The rest are
* legal but invisible; escaping them with the same rule keeps the emitted text
* readable and the treatment uniform.
*
* The boundary is the category, not per-code-point addressability: `\xNN`
* addresses U+0000 to U+00FF, so one escape form covers `Cc` exactly. The
* invisible `Cf` formatting characters pass through by design — of them only
* U+00AD soft hyphen would fit `\xNN` at all, and escaping that one while
* U+200B ZWSP, U+200E/U+200F bidi marks, and U+2060 word joiner passed through
* would leave a rule that is neither category- nor addressability-shaped. The
* whole family is legal in both consumers, since only LF and CR terminate a
* Python string literal or a `#` comment. That set is the tokenizer's, not
* `str.splitlines()`': NEL (U+0085), LS (U+2028), and PS (U+2029) split a
* string at run time but do not end a physical line in source — measured on
* CPython 3.9.6 and 3.12.13, each accepted in both positions with the value
* round-tripping — so they are safe raw wherever they reach emitted text
* unescaped, which for all three is `JSON.stringify`, at two call sites:
* {@link pyScalar}'s literal path, and the subscript tool-name comment's own
* call, which a name carrying any of them always reaches, none being
* `XID_Continue`. The `description` path escapes NEL under the class above and
* folds LS and PS in {@link describe}'s `\s+` collapse, both being `\s`.
*/
const UNPRINTABLE = /[\u0000-\u0008\u000e-\u001f\u007f-\u009f]/g;
/**
* Unpaired surrogate code points, escaped by {@link describe} as `\uNNNN` —
* its own form, since `\xNN` stops at U+00FF. The `u` flag is what makes this
* the LONE ones: in Unicode mode a well-formed pair is a single astral code
* point outside D800 to DFFF, so an emoji in a description survives untouched.
*
* This is the NUL case from {@link UNPRINTABLE}, not the invisible-character
* case. Python source must be UTF-8-encodable and a lone surrogate is not, so
* `compile()` raises `UnicodeEncodeError: surrogates not allowed` for one
* anywhere in the text — measured on 3.9 for a string literal and for a `#`
* comment alike. A raw or MCP tool description reaches this: `JSON.parse` on a
* wire `"\ud800"` escape yields exactly such a code point.
*/
const LONE_SURROGATE = /[\ud800-\udfff]/gu;
/**
* The collapsed one-line `description` of a schema node (byte-stable across
* formatting churn), or `undefined` when the node carries none. Every caller
* passes an object — a validated property node, the `ToolSdkSchema` itself, or
* the `{ description }` wrapper {@link docLines} synthesizes — so only the
* description field needs guarding. A description that collapses
* to nothing (empty, or whitespace only) is `undefined` too: it documents the
* node no better than an absent one, and emitting it would leave an empty
* `"""` docstring or a bare `#   ` line in the SDK. Only ECMAScript whitespace
* folds, so a description of whitespace plus one surviving control character is
* NOT absent: it collapses to that character's visible escape.
*
* Control characters left over after the whitespace collapse are rendered as
* their `\xNN` escapes (see {@link UNPRINTABLE}) and unpaired surrogates as
* their `\uNNNN` escapes (see {@link LONE_SURROGATE}); the escape's own backslash is
* emitted literally by both consumers, since {@link docLines} doubles it into a
* Python source escape and a `#` comment carries it verbatim.
*/
function describe(schema) {
	const description = schema.description;
	if (typeof description !== "string") return void 0;
	const collapsed = description.replace(/\s+/g, " ").replace(UNPRINTABLE, (char) => `\\x${char.charCodeAt(0).toString(16).padStart(2, "0")}`).replace(LONE_SURROGATE, (char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`).trim();
	return collapsed.length === 0 ? void 0 : collapsed;
}
/**
* One-line docstring for a tool `description`, or no lines when there is none.
* Backslashes are doubled first, every quote is escaped, and a trailing
* backslash cannot survive: a description ending in `"` or an odd backslash
* would otherwise merge with (or escape) the closing triple quote and make
* the generated block — PTC mode's only SDK — syntactically invalid Python.
*/
function docLines(description, indent) {
	const collapsed = describe({ description });
	if (collapsed === void 0) return [];
	const escaped = collapsed.replaceAll("\\", "\\\\").replaceAll("\"", "\\\"");
	return [`${pad$2(indent)}"""${escaped}"""`];
}
/**
* CamelCase a name into a Python type identifier: non-identifier characters
* split words, `_` splits too (it is `XID_Continue`, so the split set names it
* explicitly), and a head that cannot start an identifier takes a `Tool`
* prefix. Unicode survives, so a `路径` field yields `路径`-based class names
* instead of collapsing to the bare prefix. A character that is not
* `XID_Continue` splits even when it is a letter, so a name whose NFKC folding
* would leave the identifier set is not carried through — the split set is the
* grammar's, not an ASCII approximation of it.
*
* The result is NFKC-normalized: these names are generated, never matched
* against a JSON key, so normalizing is free here and keeps what CPython
* compiles identical to what is emitted — unlike {@link isBareIdentifier},
* which must reject unstable names outright. Normalizing AFTER the prefix
* decision is what makes that hold at the seam the prefix creates: `Tool` +
* a combining-mark head composes there (`U+0301` gives `Tooĺ`, U+013A), so
* normalizing only the un-prefixed part would emit a name CPython compiles to
* a different symbol. The second call is idempotent on the un-prefixed arm.
*
* The split set, the head test, and `toUpperCase()` all read the engine's
* Unicode tables, so this function carries the same version skew
* {@link isBareIdentifier} documents, by paths independent of it: a class name
* derived here reaches emitted text whenever any object shape in the tool's
* schema declares a `TypedDict`, and the predicate's verdict on the tool name
* does not gate that. The case mapping is the one that can fail on a name the
* predicate accepted; the worked example is there.
* @param raw - the schema field or tool name to derive from.
* @returns a class-name segment safe to emit.
*/
function camelCase(raw) {
	const joined = raw.split(/[^\p{XID_Continue}]+|_+/u).filter((part) => part.length > 0).map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`).join("").normalize("NFKC");
	return (/^\p{XID_Start}/u.test(joined) ? joined : `Tool${joined}`).normalize("NFKC");
}
/** Class-name base cap keeping each emitted name — and total text — linear in schema depth. */
const MAX_CLASS_NAME_BASE = 120;
/**
* Deepest `list[…]` nesting emitted into one annotation before the item type
* degrades to `Any`. CPython's tokenizer rejects a logical line holding more
* than 200 simultaneously-open brackets (`MAXLEVEL`, `SyntaxError: too many
* nested parentheses`), so an array chain deeper than that would render an SDK
* block that is not valid Python at all — the same failure the docstring
* escaping in {@link docLines} exists to prevent. 180 leaves headroom for the
* few brackets an annotation can add around the chain, all of which count
* toward the same limit. Per emission site, counting brackets open at the
* chain's innermost point:
*
* - Return annotation, `async def f(self, args: X) -> chain:` — 180 `list[`
*   plus an innermost `Literal[`. The parameter list's `(` closed at the `)`
*   before the `->`, so it is NOT open here: 181.
* - TypedDict field, `field: NotRequired[chain]` — a class-body line with no
*   other open bracket, and its children start at `listDepth: 1` to reserve
*   the `NotRequired[`, so 179 `list[` plus `Literal[`: 181. Required fields
*   share that start for uniformity, spending one level of representable depth
*   on a bracket they never emit.
* - Argument annotation, `async def f(self, args: chain) -> Y:` — the `(` IS
*   still open around it: 180 `list[` plus `Literal[` plus the paren, 182, the
*   worst case. Reachable only through a raw `register()` whose `parameters`
*   is an array reached from the root through `oneOf` arms alone — the root
*   array itself, or one nested under any depth of unions, since an arm
*   inherits the enclosing depth unchanged (`A | B` opens no bracket). An
*   object ancestor takes it out of this case: its fields restart the chain at
*   the 181 site. `defineTool` compiles an object root, so the annotation is a
*   bare TypedDict class name or a one-bracket `dict[str, Any]` when that
*   object degrades — never a chain.
*
* A CPython grammar limit, not a deployment choice, so it is fixed rather than
* configurable. The sibling `ts-types` renderer needs no counterpart: nothing
* in the TypeScript grammar bounds nesting, and its SDK block is never type-
* checked. Only bracket nesting counts — a `oneOf` renders as a flat `A | B`
* chain and nested objects render as separate `class` statements, so neither
* accumulates open brackets at any depth. The invariant this cap serves is
* grammatical validity; see the `oneOf` arm in {@link renderType} for the one
* interpreter limit deliberately left uncapped.
*/
const MAX_LIST_NESTING = 180;
/**
* Cap a class-name base at {@link MAX_CLASS_NAME_BASE} (see the callers for
* why capping keeps the render linear). `slice` counts UTF-16 code units, so
* an astral character straddling the boundary would be cut in half and leave a
* lone surrogate — not an identifier character, and not even well-formed text;
* drop it rather than emit it.
*/
function capClassNameBase(base) {
	if (base.length <= MAX_CLASS_NAME_BASE) return base;
	const capped = base.slice(0, MAX_CLASS_NAME_BASE);
	return /[\uD800-\uDBFF]$/.test(capped) ? capped.slice(0, -1) : capped;
}
/**
* Reserve a unique class name from a base, suffixing `2`, `3`, … on collision.
* The base is capped at {@link MAX_CLASS_NAME_BASE} first: child class names
* derive from their parent's allocated name (`ParentChild`), so an unbounded
* schema of single-field objects would otherwise grow each name by one field
* per level and the sum of all names to Θ(depth²). Capping the base keeps each
* name — and the total emitted text — linear in depth. Collisions resume from
* the per-base counter in `state.nextClassCounter` rather than rescanning from
* `2`, so a deep chain sharing one capped base stays O(1) per allocation
* (amortized) instead of Θ(depth²) in time.
*/
function allocateClassName(base, state) {
	const capped = capClassNameBase(base);
	let name = capped;
	if (state.usedClassNames.has(name)) {
		let n = state.nextClassCounter.get(capped) ?? 2;
		while (state.usedClassNames.has(`${capped}${n}`)) n++;
		name = `${capped}${n}`;
		state.nextClassCounter.set(capped, n + 1);
	}
	state.usedClassNames.add(name);
	return name;
}
/**
* Append a child-name segment to a parent class-name base, capping the result
* at {@link MAX_CLASS_NAME_BASE}. Capping AT PROPAGATION (not only inside
* {@link allocateClassName}) keeps each level O(1): a deep `oneOf`- or
* object-chain would otherwise carry an ever-growing ConsString down the tree
* and re-materialize it (via `.length`/`.slice`) at every level — Θ(depth²).
* The bounded base plus the collision counter still yields unique names.
*
* The join is NFKC-normalized because both sides are separately normalized yet
* their concatenation need not be: a base ending in a Hangul L jamo or LV
* syllable composes with a following V or T jamo head (`가` + `ᆨ` gives `각`),
* so the emitted class name would differ from the symbol CPython compiles, and
* two byte-distinct names could fold onto one — `usedClassNames` dedupes by the
* raw bytes, so the collision counter would not see it. Normalizing costs
* O(cap + segment) per level, the same order as the `slice` it feeds. The other
* two join points need no counterpart: `Args`/`Output` start with `A`/`O` and
* {@link allocateClassName}'s suffix is digits, none of which compose backwards.
*/
function childClassName(base, segment) {
	return capClassNameBase(`${base}${segment}`.normalize("NFKC"));
}
/**
* Render one validated scalar as Python literal text (`True`/`False`,
* JSON-quoted strings, bare numbers). `null` cannot reach here: the `null`
* type renders directly as `None`, and the unified validator rejects a null
* `const`/`enum` entry on every other scalar type.
*
* A beyond-safe-range integral number takes `BigInt` digits rather than
* `String`: Python integers are arbitrary-precision, so the emitted digits ARE
* the value the model programs against, and `String` can give a different
* integer than the double holds (`2 ** 60` prints the rounded `...847000`, not
* the exact `...846976`) or no integer literal at all (`1e21` prints `1e+21`).
* `String`'s rounding is not a bug in it: `Number::toString` emits the shortest
* decimal string that re-reads to the same double, then pads to the exponent
* with zeros (1 significant digit for `1e20`, 16 for `2 ** 60`) — and when the
* shortest string is shorter than the double's exact value, those padded digits
* name an integer no double holds. Passing one back would have to cross the
* argument boundary as a JSON number — a double again — so the SDK would
* document a value no program can pass. `BigInt` needs no case split: where
* `String` is already exact (`2 ** 53`, `1e20`) the two agree byte for byte,
* and where it is not, `BigInt` is the exact one. The TS flavor needs no
* counterpart at all: its literal is re-read by a JS parser back into the same
* double.
*
* `JSON.stringify` is also what keeps this path's output parseable, and it is
* the only thing that does. It covers both classes of hazard: the two kinds of
* code point CPython refuses anywhere in source — NUL among the C0 controls,
* and the whole D800–DFFF unpaired-surrogate block, escaped under ES2019
* well-formed stringification, which the engines range guarantees — and the
* ones that break this line in particular, a bare `"` closing the literal
* early, a trailing odd backslash eating the closing quote, and a bare LF/CR
* ending it before its terminator. The `description` path carries
* {@link UNPRINTABLE} and {@link LONE_SURROGATE} because nothing quotes it,
* and folds newlines in {@link describe}.
*
* That leans on a coincidence worth naming: every escape `JSON.stringify` can
* emit (`\"`, `\\`, `\b`, `\f`, `\n`, `\r`, `\t`, `\uXXXX`) is also a Python
* escape denoting the same character, so the emitted `Literal[...]` both
* parses and decodes back to the value the schema declared. DEL, the C1
* controls (NEL among them), and LS/PS (U+2028/U+2029) do reach it raw —
* legal but invisible, byte-for-byte as in the TS flavor; escaping them is a
* both-flavors change. Those last three are legal here for the reason
* {@link UNPRINTABLE} records: they are `str.splitlines()` boundaries, not
* tokenizer line terminators. The subscript tool-name comment quotes its name
* through its own call to the same `JSON.stringify`, never through this
* function, and inherits both halves — escapes and pass-throughs alike.
*/
function pyScalar(value) {
	if (value === true) return "True";
	if (value === false) return "False";
	if (typeof value === "string") return JSON.stringify(value);
	if (typeof value === "number" && Number.isInteger(value) && !Number.isSafeInteger(value)) return BigInt(value).toString();
	return String(value);
}
/**
* Render a validated scalar `const`/`enum` as `Literal[...]`, falling back to
* the broad type. Deliberately deviates from PEP 586, which restricts `Literal`
* parameters to int/bool/str/bytes/enum/None: a non-integral number
* `const`/`enum` emits a float literal (`Literal[1.5]`) a strict checker would
* reject. An integral one does not deviate — {@link pyScalar} emits int digits,
* including for the beyond-safe-range values it widens through `BigInt`, and
* PEP 586 admits int parameters. Harmless either way — the stub is advisory
* prompt text, only required to parse — and keeping the exact value
* communicates the constraint to the model.
*/
function renderConstrainedScalar(node, broad, state) {
	if (node.const !== void 0) {
		state.typing.add("Literal");
		return `Literal[${pyScalar(node.const)}]`;
	}
	if (node.enum !== void 0) {
		state.typing.add("Literal");
		return `Literal[${node.enum.map(pyScalar).join(", ")}]`;
	}
	return broad;
}
/**
* Map one JSON-Schema node to a Python type expression, threading `state` to
* collect the `TypedDict` declarations and `typing` symbols a full render
* needs. `className` is the name to give an object node with properties (and
* the prefix for its nested objects). Handles every unified schema construct —
* `oneOf` (→ `X | Y`), `const`/`enum` (→ `Literal[...]`), `integer` (→ `int`),
* `null` (→ `None`) — and degrades an unsupported or malformed schema to `Any`
* without throwing, the same trusted-after-validation stance as the sibling
* {@link ./ts-types.ts | ts-types} renderer. {@link jsonSchemaToPy} is the
* context-free entry point; this is the collecting core.
*/
function renderType(schema, className, state) {
	const newFrame = (schema, className, listDepth) => ({
		schema,
		className,
		phase: "start",
		listDepth,
		children: [],
		childIndex: 0,
		childTypes: [],
		entries: []
	});
	try {
		assertSupportedJsonSchema(schema);
		const frames = [newFrame(schema, className, 0)];
		let result;
		const finish = (type) => {
			frames.pop();
			const parent = frames.at(-1);
			if (parent === void 0) result = type;
			else parent.childTypes.push(type);
		};
		while (frames.length > 0) {
			const frame = frames.at(-1);
			/* v8 ignore next -- the loop condition guarantees a current frame. */
			if (frame === void 0) break;
			if (frame.phase === "children") {
				if (frame.childIndex < frame.children.length) {
					const child = frame.children[frame.childIndex];
					/* v8 ignore next -- childIndex is bounded by children.length. */
					if (child === void 0) throw new Error("missing python render child");
					frame.childIndex++;
					frames.push(newFrame(child.schema, child.className, child.listDepth));
					continue;
				}
				if (frame.kind === "oneOf") {
					let union = "";
					for (const [index, childType] of frame.childTypes.entries()) union = index === 0 ? childType : `${union} | ${childType}`;
					finish(union);
					continue;
				}
				if (frame.kind === "array") {
					/* v8 ignore next -- the ?? arm needs a childless array frame, which start never builds. */
					finish(`list[${frame.childTypes[0] ?? "Any"}]`);
					continue;
				}
				const node = frame.node;
				const name = frame.allocated;
				/* v8 ignore next -- typeddict frames always set node and allocated at start. */
				if (node === void 0 || name === void 0) throw new Error("missing typeddict frame state");
				const required = new Set(node.required);
				const lines = [`class ${name}(TypedDict):`];
				for (let index = 0; index < frame.entries.length; index++) {
					const entry = frame.entries[index];
					const fieldType = frame.childTypes[index];
					/* v8 ignore next -- entries and childTypes correspond one-to-one. */
					if (entry === void 0 || fieldType === void 0) throw new Error("missing typeddict field type");
					const [field, fieldSchema] = entry;
					const description = describe(fieldSchema);
					if (description !== void 0) lines.push(`${pad$2(1)}# ${description}`);
					if (required.has(field)) lines.push(`${pad$2(1)}${field}: ${fieldType}`);
					else {
						state.typing.add("NotRequired");
						lines.push(`${pad$2(1)}${field}: NotRequired[${fieldType}]`);
					}
				}
				if (node.additionalProperties !== false) lines.push(`${pad$2(1)}# Additional keys beyond those declared are allowed.`);
				if (lines.length === 1) lines.push(`${pad$2(1)}pass`);
				state.classes.push(lines.join("\n"));
				finish(name);
				continue;
			}
			frame.phase = "children";
			const node = frame.schema;
			if (node.oneOf !== void 0) {
				frame.kind = "oneOf";
				frame.children = node.oneOf.map((branch, index) => ({
					schema: branch,
					className: childClassName(frame.className, `${index + 1}`),
					listDepth: frame.listDepth
				}));
				continue;
			}
			if (node.type === void 0) {
				state.typing.add("Any");
				finish("Any");
				continue;
			}
			switch (node.type) {
				case "string":
					finish(renderConstrainedScalar(node, "str", state));
					break;
				case "number":
					finish(renderConstrainedScalar(node, "float", state));
					break;
				case "integer":
					finish(renderConstrainedScalar(node, "int", state));
					break;
				case "boolean":
					finish(renderConstrainedScalar(node, "bool", state));
					break;
				case "null":
					finish("None");
					break;
				case "array":
					if (node.items === void 0) {
						state.typing.add("Any");
						finish("list[Any]");
						break;
					}
					if (frame.listDepth >= MAX_LIST_NESTING) {
						state.typing.add("Any");
						finish("Any");
						break;
					}
					frame.kind = "array";
					frame.children = [{
						schema: node.items,
						className: frame.className,
						listDepth: frame.listDepth + 1
					}];
					break;
				case "object": {
					const entries = Object.entries(node.properties ?? {});
					if (className === "" || !entries.every(([name]) => isBareIdentifier(name) && !RESERVED.has(name) && !(name.startsWith("__") && !name.endsWith("__")))) {
						state.typing.add("Any");
						finish("dict[str, Any]");
						break;
					}
					if (entries.length === 0 && node.additionalProperties !== false) {
						state.typing.add("Any");
						finish("dict[str, Any]");
						break;
					}
					frame.kind = "typeddict";
					frame.node = node;
					frame.allocated = allocateClassName(frame.className, state);
					state.typing.add("TypedDict");
					frame.entries = entries;
					/* v8 ignore next -- allocated is always set before children are built. */
					frame.children = entries.map(([field, child]) => ({
						schema: child,
						className: childClassName(frame.allocated ?? "", camelCase(field)),
						listDepth: 1
					}));
					break;
				}
				/* v8 ignore next 4 -- assertSupportedJsonSchema narrowed this closed type union. */
				default:
					state.typing.add("Any");
					finish("Any");
			}
		}
		/* v8 ignore next -- every root frame produces one expression. */
		return result ?? "Any";
	} catch {
		state.typing.add("Any");
		return "Any";
	}
}
/** The fixed model-facing usage contract rendered above the declarations. */
const SDK_INSTRUCTIONS = `## Writing code for run_code

\`run_code\` takes two required arguments: \`code\` — the body of an async Python function (top-level \`await\` and \`return\` both work) — and \`description\`, a short summary of what the program does. At run time exactly two of the names declared below are bound: \`tools\` and \`ToolCallError\`. Everything else is a STATIC STUB describing argument and return types — in particular the \`TypedDict\` classes do NOT exist at run time, so build arguments as plain \`dict\`/\`list\` JSON values: \`await tools.name({"field": 1})\`, never \`FooArgs(field=1)\`, which raises \`NameError\`. Inside the program:

- Call tools as \`await tools.name(args)\` — subscript access for exotic, reserved, or underscore-leading names: \`await tools["my-tool"](args)\`. Every call resolves to the tool's typed canonical JSON value (each method's return type below). Tool arguments must be lossless JSON.
- A FAILED tool call raises \`ToolCallError\`, whose \`toolName\` identifies the failed tool and whose message is human-readable — wrap in \`try/except\` to handle and continue.
- Independent read-only calls MAY overlap under \`asyncio.gather\` (safe calls run concurrently; mutating calls run alone, in submission order). Sequence dependent work with \`await\`.
- Emit the run's answer with \`print(...)\` and/or a top-level \`return <value>\`; the returned value must be lossless JSON. Only what you print and return is program output. A successful tool result containing an image is attached after the run so you can inspect it on the next step; every other intermediate result stays out of the conversation, so extract just what you need.

The available tools:`;
/**
* Render the full `tools:sdk` prompt section under `runtime.language ===
* 'python'`: the Python-flavored usage instructions plus one named `TypedDict`
* per tool argument or output object (and per nested object) and one awaitable
* method per visible tool on a `Tools` protocol — typed args in, the tool's
* canonical output value out — with a `tools: Tools` singleton the model calls
* into. The `typing` import line lists exactly the symbols the render used.
* Deterministic — tools are emitted in lexicographic name order, and class
* declarations precede the protocol in that same order (nested classes before
* the parent that references them), so an unchanged tool set produces
* byte-identical text across assemblies. The sort is not a total order on
* byte-equal names, so two schemas sharing a name would render in argument
* order; the caller's visible-capability map is keyed by name, so the input
* never carries a duplicate.
* @param schemas - the tool schemas plus canonical output schemas to declare
*   (the caller excludes `run_code` itself).
* @returns the complete section text.
*/
function renderToolsSdkPy(schemas) {
	const sorted = [...schemas].sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
	const state = {
		classes: [],
		usedClassNames: /* @__PURE__ */ new Set(),
		nextClassCounter: /* @__PURE__ */ new Map(),
		typing: /* @__PURE__ */ new Set(["Protocol"])
	};
	const members = [];
	let statements = 0;
	for (const schema of sorted) {
		const argType = renderType(schema.parameters, `${camelCase(schema.name)}Args`, state);
		const outputType = renderType(schema.output, `${camelCase(schema.name)}Output`, state);
		if (isBareIdentifier(schema.name) && !RESERVED.has(schema.name) && !schema.name.startsWith("_")) {
			const doc = docLines(schema.description, 2);
			members.push(doc.length > 0 ? `${pad$2(1)}async def ${schema.name}(self, args: ${argType}) -> ${outputType}:` : `${pad$2(1)}async def ${schema.name}(self, args: ${argType}) -> ${outputType}: ...`);
			members.push(...doc);
			statements += 1;
		} else {
			members.push(`${pad$2(1)}# tools[${JSON.stringify(schema.name)}](args: ${argType}) -> ${outputType}`);
			const description = describe(schema);
			if (description !== void 0) members.push(`${pad$2(1)}#   ${description}`);
		}
	}
	const body = (statements > 0 ? members : [`${pad$2(1)}pass`, ...members]).join("\n");
	const imports = TYPING_ORDER.filter((symbol) => state.typing.has(symbol));
	const classBlock = state.classes.length > 0 ? `${state.classes.join("\n\n")}\n\n` : "";
	return `${SDK_INSTRUCTIONS}\n\n\`\`\`python\n${`from typing import ${imports.join(", ")}\n\nclass ToolCallError(Exception):
    toolName: str\n\n${classBlock}class Tools(Protocol):\n${body}\n\ntools: Tools`}\n\`\`\``;
}
/**
* Tool registry, model presentation modes, and pre/guard/around/post/result
* execution pipeline.
* @module @deepseek-ai/dsh-tools
*/
/**
* Language → SDK-section renderer. The registry looks up the loaded
* `ctx.ptcRuntime.language` in this table when assembling the `tools:sdk`
* section under a non-native mode; a runtime whose language is not a key
* fails the assembly loudly (same idiom as `toolOrder` violations). Adding a
* new backend language is three parallel edits — a {@link PtcSdkLanguage}
* member, an entry here, and a `RUN_CODE_FLAVORS` entry in `ptc.ts` for
* its `run_code` schema strings — plus the renderer function this table points
* at. The `satisfies` clause pins this table's key set to that union, which
* the flavor table is checked against too, so any of the three left out is a
* typecheck failure. What no check reaches is the prose that names the values
* instead of deriving them: the seam's `dsh-ptc-runtime` README pair, its
* `PtcRuntime.language` JSDoc, and `docs/subsystems/ptc-runtime.md`
* with its zh pair, plus this package's own README pair and the
* {@link Config.mode} JSDoc.
*/
/**
* The model-facing statement of the `ptc` collapse. Names the consequence
* (the call fails) and the route (inside the program), because a rule the
* model can only discover by being denied is one it corrects too late.
*/
const PTC_ONLY_INSTRUCTION = `\`${RUN_CODE_NAME}\` is the only tool you can call directly — a tool call naming any other tool fails. Reach every tool the SDK declares below from inside the program.`;
const SDK_RENDERERS = {
	typescript: renderToolsSdk,
	python: renderToolsSdkPy
};
/**
* Scheduler entry point omitted from the generated named service API.
* @internal
*/
const TOOL_RUNTIME_SCHEDULER = Symbol("@deepseek-ai/dsh-tools.scheduler");
/** Canonical error code for cancellation after a tool body was invoked. */
const TOOL_ABORTED = "ABORTED";
/** Canonical error code for cancellation before a tool body was invoked. */
const TOOL_ABORTED_BEFORE_DISPATCH = "ABORTED_BEFORE_DISPATCH";
/**
* Thrown (internally) when the model requests a tool that isn't registered.
* Extends {@link HarnessError} (`code: 'UNKNOWN_TOOL'`) so an unknown-tool
* failure is as routable as a tool-thrown one — retry/sandbox/replay code can
* distinguish it from a tool body's own error.
*/
var ToolNotFoundError = class extends HarnessError {
	/**
	* @param toolName - the name the caller asked for.
	* @param reachableFrom - how the model reaches this tool instead, when the
	*   name IS visible and only the presentation denies calling it directly.
	*   Omitted for a name that is registered nowhere.
	*/
	constructor(toolName, reachableFrom) {
		super(reachableFrom === void 0 ? `unknown tool "${toolName}"` : `unknown tool "${toolName}": ${reachableFrom}`, "UNKNOWN_TOOL");
		this.name = "ToolNotFoundError";
	}
};
/** Thrown when a tool body or post-policy value violates its declared output. */
var ToolOutputError = class extends HarnessError {
	/** Schema/value violations in validation order. */
	violations;
	constructor(toolName, violations) {
		super(`tool "${toolName}" returned invalid output: ${violations.join("; ")}`, "INVALID_TOOL_OUTPUT");
		this.name = "ToolOutputError";
		this.violations = violations;
	}
};
/** Convert one projector exception into the canonical invalid-output failure. */
function projectionError(toolName, projector, error) {
	return new ToolOutputError(toolName, [`output.${projector} failed: ${errorMessage(error)}`]);
}
/** Snapshot one projector result before later durable-result materialization. */
function snapshotProjection(toolName, projector, candidate) {
	try {
		const detached = snapshotJsonValue(candidate);
		if (detached === void 0) throw new ToolOutputError(toolName, [`output.${projector} returned non-lossless JSON`]);
		return detached;
	} catch (error) {
		if (error instanceof ToolOutputError) throw error;
		throw projectionError(toolName, projector, error);
	}
}
/** Snapshot one body or policy value into the canonical invalid-output failure class. */
function snapshotToolValue(toolName, candidate) {
	try {
		const detached = snapshotJsonValue(candidate);
		if (detached === void 0) throw new ToolOutputError(toolName, ["value is not lossless JSON"]);
		return detached;
	} catch (error) {
		if (error instanceof ToolOutputError) throw error;
		throw new ToolOutputError(toolName, [`value snapshot failed: ${errorMessage(error)}`]);
	}
}
/**
* Best-effort human-readable message from an arbitrary thrown value: Error
* instances use `.message`; non-Error objects with a string `message`
* property (e.g. `throw { message: 'denied' }`) use it too; everything else
* is stringified.
*/
function errorMessage(error) {
	try {
		if (error instanceof Error) return error.message;
		if (typeof error === "object" && error !== null && "message" in error && typeof error.message === "string") return error.message;
		return String(error);
	} catch {
		return "<unprintable thrown value>";
	}
}
/** Derive one failure message from policy feedback without changing its rendered blocks. */
function failureMessageFromContent(content) {
	const text = content.map((block) => block.type === "text" ? block.text : `[${block.type} content]`).join("\n");
	return text.length > 0 ? text : "tool result blocked by post-execute policy";
}
/** Snapshot and freeze one durable tool-result projection or reject lossy data. */
function materializePresentation(candidate) {
	const detached = snapshotJsonValue(candidate);
	if (detached === void 0) throw new TypeError("tool result must be losslessly JSON-serializable");
	return deepFreeze(detached);
}
/** Structured `{ name, code }` for a thrown HarnessError, else undefined. */
function errorInfo(error) {
	try {
		return error instanceof HarnessError ? {
			name: error.name,
			code: error.code
		} : void 0;
	} catch {
		return;
	}
}
/** One scope's complete tool-registry contribution. */
var ToolLayer = class {
	tools;
	restrictions = new AnonymousEntries();
	guards = new AnonymousEntries();
	/**
	* Presentation this scope's agent declared for itself, shadowing the
	* deployment default. One cell rather than an entry table: two answers to
	* "which form does the model see" is a contradiction, not a merge.
	*/
	mode;
	constructor(scope) {
		this.tools = new NamedEntries((name) => /* @__PURE__ */ new Error(scope === void 0 ? `tool "${name}" is already registered (for a per-agent variant, register through that agent's \`agent.ctx\` instead)` : `tool "${name}" is already registered in this scope`));
	}
	/** Whether every contribution table in this aggregate layer is empty. */
	isEmpty() {
		return this.tools.isEmpty() && this.restrictions.isEmpty() && this.guards.isEmpty() && this.mode === void 0;
	}
	/** Whether every compiled restriction in this layer admits a global tool name. */
	admits(name) {
		for (const filter of this.restrictions.values()) if (filter.allow !== void 0 && !filter.allow.has(name) || filter.deny !== void 0 && filter.deny.has(name)) return false;
		return true;
	}
	/** First monotonic denial from this layer's live guard registrations. */
	guardReason(exec) {
		for (const guard of this.guards.values()) {
			const reason = guard(exec);
			if (reason !== void 0) return reason;
		}
	}
};
/** Resolve the run_code overlap cap at the owning config boundary (direct construction bypasses the Loader schema). */
function resolveMaxParallelSubCalls(value) {
	const maxParallelSubCalls = value ?? 10;
	if (!Number.isInteger(maxParallelSubCalls) || maxParallelSubCalls < 1) throw new Error("maxParallelSubCalls must be a positive integer");
	return maxParallelSubCalls;
}
/**
* Tool registry and execution pipeline. Scoped registrations shadow globals;
* one visibility resolver feeds presentation, lookup, and dispatch.
*/
var ToolRuntime = class extends Service {
	static inject = ["systemPrompt"];
	static Config = z.object({
		mode: z.union([
			"native",
			"ptc",
			"both"
		]).default("native"),
		maxParallelSubCalls: z.natural().min(1).default(10)
	});
	/** Internal staged view consumed by `dsh-agent-loop`'s parallel scheduler. */
	[TOOL_RUNTIME_SCHEDULER] = {
		prepare: (exec) => this.prepareScheduledExecution(exec),
		dispatch: (exec) => this.dispatchScheduledExecution(exec),
		finalize: (exec, result) => this.finalizeScheduledExecution(exec, result),
		finish: (exec, result) => this.finishScheduledExecution(exec, result)
	};
	/** Context deferred by a running tool body, keyed by its scheduler-owned execution. */
	deferredContexts = /* @__PURE__ */ new WeakMap();
	/** Executions whose tool body declared the current turn complete. */
	concludingExecutions = /* @__PURE__ */ new WeakSet();
	/** Original caller cancellation, kept outside the wrapper-mutable execution object. */
	cancellationStates = /* @__PURE__ */ new WeakMap();
	/** Definition-owned final content transform snapshotted before policy begins. */
	contentFinalizers = /* @__PURE__ */ new WeakMap();
	/** Execution-prepared content installed before post-execute policy. */
	contentProjectors = /* @__PURE__ */ new WeakMap();
	layers = new ScopedLayers((scope) => new ToolLayer(scope), () => {
		this.ctx.emit("tools/change");
	});
	/** Presentation for scopes that declare none; {@link presentAs} shadows it per scope. */
	defaultMode;
	maxParallelSubCalls;
	/**
	* Reserved presentation transport, kept outside the filterable registration
	* layers. Built on first need rather than at construction: which agents run
	* a PTC mode is no longer known when the service is constructed, and the
	* transport is stateless beyond its closures over `this`.
	*/
	ptcTransport;
	constructor(ctx, config = {}) {
		super(ctx, "tools");
		this.defaultMode = config.mode ?? "native";
		this.maxParallelSubCalls = resolveMaxParallelSubCalls(config.maxParallelSubCalls);
		ctx.systemPrompt.tools((context) => this.wireSchemas(context.scope));
		if (this.defaultMode !== "native") {
			ctx.systemPrompt.section(this.collapseSection());
			ctx.systemPrompt.section(this.sdkSection());
		}
	}
	/**
	* The prompt statement of the `ptc` executor collapse, registered wherever
	* {@link sdkSection} is and rendering empty outside an effective `ptc`.
	*
	* Every tool contributes its own guidance section naming its tool, none of
	* them qualify how that tool is reached, and they all render before the SDK.
	* Without this the model reads a catalog of tools it is told to use and no
	* statement that only `run_code` may be called, so it emits a native call,
	* receives `UNKNOWN_TOOL` for a tool the prompt just declared, and concludes
	* the deployment is inconsistent. Its order places the rule before that
	* guidance rather than after it.
	*
	* `both` renders empty: native calls do execute there, so the rule is false.
	* @returns the section registration.
	*/
	collapseSection() {
		return {
			name: "tools:ptc-only",
			order: this.ctx.systemPrompt.getSectionOrder("PTC_ONLY"),
			text: (context) => this.modeFor(context.scope) === "ptc" ? PTC_ONLY_INSTRUCTION : ""
		};
	}
	/**
	* The generated-SDK prompt section, registered globally by a PTC mode
	* deployment and per scope by {@link presentAs}.
	*
	* The body regenerates from the CALLING scope, and renders empty for an
	* agent presenting natively — an agent that opted out under a PTC mode
	* deployment still sees the global registration, and an empty section is
	* dropped from the rendered prompt.
	* @returns the section registration.
	*/
	sdkSection() {
		return {
			name: "tools:sdk",
			order: this.ctx.systemPrompt.getSectionOrder("TOOLS_SDK"),
			interpolate: false,
			text: (context) => {
				const mode = this.modeFor(context.scope);
				if (mode === "native") return "";
				const runtime = this.requirePtcRuntime(mode);
				const render = SDK_RENDERERS[runtime.language];
				/* v8 ignore next -- requirePtcRuntime rejects an unknown language before this runs. */
				if (render === void 0) throw new Error(`dsh-tools: no SDK renderer for ${runtime.language}`);
				return render(this.sdkSchemas(context.scope));
			}
		};
	}
	/**
	* The presentation one scope's agent sees: its own declaration, else the
	* deployment default.
	* @param scope - the calling agent, or undefined for the global view.
	* @returns the resolved presentation mode.
	*/
	modeFor(scope) {
		const layers = this.layers.chainLayers(scope);
		for (let index = layers.length - 1; index >= 0; index -= 1) {
			const mode = layers[index]?.mode;
			if (mode !== void 0) return mode;
		}
		return this.defaultMode;
	}
	/**
	* The reserved `run_code` transport, built on first need.
	*
	* It never enters the global layer: per-agent restrictions must not remove
	* it, and a scoped registration must not shadow it. The visibility resolver
	* appends it after resolving the filterable global/scoped capability layers,
	* and only for scopes whose mode actually presents it.
	* @returns the shared transport definition.
	*/
	requirePtcTransport() {
		this.ptcTransport ??= createRunCodeTool(this, {
			requireRuntime: () => this.requirePtcRuntime(this.defaultMode),
			peekApprover: () => this.ctx.get("approval"),
			resolveSandboxPolicy: (exec) => {
				const policy = this.ctx.get("sandboxPolicy");
				if (policy === void 0) throw new Error("dsh-tools: confined PTC runtime requires sandboxPolicy");
				return policy.resolve(exec.agent === void 0 ? {} : { session: exec.agent.session });
			},
			peekRuntime: () => this.ctx.get("ptcRuntime"),
			maxParallel: this.maxParallelSubCalls,
			shapeDispatchLog: (dispatch) => this.shapeDispatchLog(dispatch)
		});
		return this.ptcTransport;
	}
	/**
	* Present the calling scope's tools in `mode` instead of the deployment
	* default. Nearest scope on the chain wins, so a preset's standing
	* declaration covers every agent joined under it.
	*
	* Scoped only, and one declaration per scope: this is how an agent preset
	* composes PTC mode agents beside native ones in the same process, and a
	* process-global override would be the `mode` config field instead.
	* @param mode - the presentation the covered agents' models see.
	* @returns the exact disposer that restores the deployment default.
	*/
	presentAs(mode) {
		const ctx = this.ctx;
		if (scopeOf(ctx) === void 0) throw new Error("tools.presentAs() requires a scoped context (agent.ctx): a context-global presentation is the `mode` config field on the tools row");
		return ctx.effect(function* () {
			yield this.layers.effect(ctx, (layer) => {
				if (layer.mode !== void 0) throw new Error(`tools.presentAs("${mode}") conflicts with "${layer.mode}" already declared for this scope; one composition selects one presentation`);
				layer.mode = mode;
				return () => {
					layer.mode = void 0;
				};
			}, { label: "tools.presentAs()" });
			if (mode !== "native") {
				yield ctx.systemPrompt.section(this.collapseSection());
				yield ctx.systemPrompt.section(this.sdkSection());
			}
		}.bind(this), "tools.presentAs()");
	}
	/**
	* Build one scope's wire schemas and names for prompt-order validation.
	* Restrictions do not make known tools invalid, but a mode collapse does.
	*/
	wireSchemas(scope) {
		const view = this.view(scope);
		const mode = this.modeFor(scope);
		if (mode === "native") return {
			schemas: [...view.visible.values()].map((definition) => this.schemaOf(definition, false)),
			knownNames: [...view.knownNames]
		};
		this.requirePtcRuntime(mode);
		const schemas = [...view.visible.values()].map((definition) => this.schemaOf(definition, false));
		if (mode === "ptc") return {
			schemas: schemas.filter((schema) => schema.name === RUN_CODE_NAME),
			knownNames: [RUN_CODE_NAME]
		};
		return {
			schemas,
			knownNames: [...view.knownNames, RUN_CODE_NAME]
		};
	}
	/**
	* Resolve the PTC runtime or throw the actionable misconfiguration error.
	* Read at use time (assembly / run_code execution), NOT via static
	* `inject`: an inject entry would hold `ctx.tools` — and every tool plugin
	* behind it — hostage to a PTC runtime existing even under `mode:
	* 'native'`.
	*
	* Assembly and `run_code` execution read separately, so the language is not
	* bound to a request. Harmless while one published backend exists — both
	* reads return the same flavor — but a reload that swapped in a second
	* language between them would hand a program written against one SDK to the
	* other. Binding it is deferred until a second backend ships (the first
	* point it is testable).
	*/
	requirePtcRuntime(mode) {
		const runtime = this.ctx.get("ptcRuntime");
		if (!runtime) throw new Error(`dsh-tools: mode "${mode}" requires a PTC runtime — load a ctx.ptcRuntime implementation (e.g. @deepseek-ai/dsh-ptc-runtime-node) or set tools mode to "native"`);
		if (!Object.hasOwn(SDK_RENDERERS, runtime.language)) {
			const known = Object.keys(SDK_RENDERERS).map((name) => JSON.stringify(name)).join(", ");
			throw new Error(`dsh-tools: no SDK renderer registered for runtime language ${JSON.stringify(runtime.language)} (known: ${known})`);
		}
		return runtime;
	}
	/**
	* Register globally or in the calling agent scope. Scoped tools shadow
	* globals; duplicates within one layer and the reserved `run_code` name fail.
	* @param definition - tool schema, execution, and optional finalization/presentation callbacks.
	* @returns the exact disposer that unregisters the tool.
	*/
	register(definition) {
		const name = definition.name;
		const output = definition.output;
		if (output === void 0 || typeof output !== "object" || typeof output.render !== "function" || output.presentationMeta !== void 0 && typeof output.presentationMeta !== "function") throw new TypeError(`tool "${name}" must declare output { schema, render, presentationMeta? }`);
		assertSupportedJsonSchema(output.schema);
		const timeoutMs = definition.timeoutMs;
		if (timeoutMs !== void 0 && (!Number.isFinite(timeoutMs) || timeoutMs <= 0)) throw new TypeError(`tool "${name}" timeoutMs must be a positive finite number`);
		if (name === "run_code") throw new Error(`tool name "${RUN_CODE_NAME}" is reserved for the PTC mode presentation transport and cannot be registered or shadowed`);
		return this.layers.effect(this.ctx, (layer) => layer.tools.insert(name, definition), { label: "tools.register()" });
	}
	/**
	* Restrict global tools for the calling agent scope. Empty filters, unknown
	* names, scope-local names, and reserved transport names fail. Restrictions
	* intersect; scoped registrations remain visible.
	* @param filter - global-tool mask: `allow` (keep only) and/or `deny` (remove).
	* @returns the exact disposer that lifts this restriction.
	*/
	restrict(filter) {
		const scope = scopeOf(this.ctx);
		if (scope === void 0) throw new Error("tools.restrict() requires a scoped context (agent.ctx): a context-global restriction would mask every agent — deny the tool for the intended agent instead");
		const allow = filter.allow;
		const deny = filter.deny;
		if (allow === void 0 && deny === void 0) throw new Error("tools.restrict({}) is a no-op: pass `allow` and/or `deny` (an empty filter is almost always a materialized-empty-config bug)");
		const compiled = {
			...allow !== void 0 ? { allow: new Set(allow) } : {},
			...deny !== void 0 ? { deny: new Set(deny) } : {}
		};
		if ([...allow ?? [], ...deny ?? []].includes("run_code")) throw new Error(`tools.restrict() cannot name reserved PTC mode presentation transport "${RUN_CODE_NAME}"; restrict end-capability tools instead`);
		const known = this.view(scope).restrictableNames;
		const unknown = [...allow ?? [], ...deny ?? []].filter((name) => !known.has(name));
		if (unknown.length > 0) throw new Error(`tools.restrict() names unknown global tool${unknown.length > 1 ? "s" : ""} ${unknown.map((n) => `"${n}"`).join(", ")}; known global tools: ${[...known].sort().join(", ") || "(none)"}`);
		return this.layers.effect(this.ctx, (layer) => layer.restrictions.append(compiled), { label: "tools.restrict()" });
	}
	/**
	* Register a monotonic guard after the extensible `tools/pre-execute`
	* waterfall. A plain-context guard applies globally; one registered through
	* `agent.ctx` applies only to that agent. Any matching guard may deny by
	* returning a reason, while no guard can force-allow a call another guard
	* denied. The exact effect disposer is returned for ordered ownership and
	* HMR cleanup.
	* @param guard - synchronous check; a returned string denies the execution.
	* @returns the exact disposer that unregisters the guard.
	*/
	guard(guard) {
		return this.layers.effect(this.ctx, (layer) => layer.guards.append(guard), {
			label: "tools.guard()",
			notify: false
		});
	}
	/** First monotonic denial from the global then the scope chain's guard layers, farthest first. */
	guardReason(exec) {
		const globalReason = this.layers.global.guardReason(exec);
		if (globalReason !== void 0) return globalReason;
		if (exec.agent === void 0) return void 0;
		for (const layer of this.layers.chainLayers(exec.agent)) {
			const reason = layer.guardReason(exec);
			if (reason !== void 0) return reason;
		}
	}
	/**
	* Resolve every registry fact one scope needs in one layer traversal. The
	* visible map applies restrictions to the INHERITED surface, then the
	* scope's own registrations and the reserved presentation transport; the
	* other sets retain the pre-restriction facts needed by restriction and
	* prompt-order validation.
	*
	* A restriction filters what a scope inherits — the global layer and every
	* ancestor layer on its chain — and never what its OWN layer registers.
	* That exemption is what a per-child capability filter has to keep intact:
	* the delegation runtime registers a child's structured-output tool into the
	* child's own layer, and a filter naming the capabilities the child may use
	* must not strip the machinery it answers through.
	*
	* Reading the exempt set as "the global layer" instead of "not mine" held
	* only while every model-facing tool sat in the host composition. Once
	* presets moved them onto the agent plane they became an ANCESTOR
	* contribution, so a child's filter silently stopped constraining anything
	* it was given.
	* @param scope - the viewing scope (the agent), or undefined for the global view.
	* @returns the complete derived view for that scope.
	*/
	view(scope) {
		const layers = this.layers.chainLayers(scope);
		const own = this.layers.peek(scope);
		const inherited = new Map(this.layers.global.tools.entries());
		for (const layer of layers) {
			if (layer === own) continue;
			for (const [name, definition] of layer.tools.entries()) inherited.set(name, definition);
		}
		const visible = /* @__PURE__ */ new Map();
		const knownNames = /* @__PURE__ */ new Set();
		const restrictableNames = /* @__PURE__ */ new Set();
		for (const [name, definition] of inherited) {
			knownNames.add(name);
			restrictableNames.add(name);
			if (layers.every((layer) => layer.admits(name))) visible.set(name, definition);
		}
		if (own !== void 0) for (const [name, definition] of own.tools.entries()) {
			knownNames.add(name);
			visible.set(name, definition);
		}
		if (this.modeFor(scope) !== "native") visible.set(RUN_CODE_NAME, this.requirePtcTransport());
		return {
			visible,
			knownNames,
			restrictableNames
		};
	}
	/**
	* Look up a tool as one scope sees it (scoped
	* shadows global; a restricted-away global reads as absent). Presenters pass
	* the calling agent so the rendered card matches the definition that
	* actually executed.
	* @param name - the tool name as registered.
	* @param scope - the viewing scope (the agent); omitted = the global view.
	* @returns the definition the scope resolves, or undefined when none is visible.
	*/
	get(name, scope) {
		return this.view(scope).visible.get(name);
	}
	/**
	* Resolve the definition that MAY EXECUTE for a call, applying the mode
	* collapse at the operation boundary that owns it. The registry view
	* (`get`) is presentation-agnostic; here a MODEL-DIRECT call under `ptc`
	* may only name the reserved `run_code` transport, while a nested
	* sub-dispatch (a `parent` token set — the `run_code` SDK calling a tool
	* it bound) may call any visible tool. Denial surfaces as `UNKNOWN_TOOL`
	* through the executor, matching an absent definition.
	* @param name - the tool name as registered.
	* @param scope - the viewing scope (the agent); omitted = the global view.
	* @param nested - whether the call is a transport sub-dispatch, not a model-direct call.
	* @returns the definition that may run, or undefined when the call must be rejected.
	*/
	resolveExecution(name, scope, nested) {
		const tool = this.get(name, scope);
		if (tool === void 0) return void 0;
		if (this.collapses(name, scope, nested)) return void 0;
		return tool;
	}
	/**
	* Project visible definitions onto the allowlisted model-facing schema fields,
	* excluding execution and presentation callbacks.
	* @param scope - the viewing scope (the agent); omitted = the global view.
	* @returns one deep-cloned schema per visible tool.
	*/
	schemas(scope) {
		return [...this.view(scope).visible.values()].map((definition) => this.schemaOf(definition, true));
	}
	/** Project visible callable tools onto the generated PTC mode SDK contract. */
	sdkSchemas(scope) {
		return [...this.view(scope).visible.values()].filter((definition) => definition.name !== RUN_CODE_NAME).map((definition) => {
			const output = snapshotJsonValue(definition.output.schema);
			/* v8 ignore next -- registration already validated and retained this schema as lossless JSON. */
			if (output === void 0) throw new Error(`tool "${definition.name}" output schema must be lossless JSON before SDK projection`);
			return {
				...this.schemaOf(definition, true),
				output
			};
		});
	}
	/** Project one definition onto the model-facing schema fields. */
	schemaOf(definition, detachParameters) {
		const { name, description, parameters, deferLoading } = definition;
		const detached = detachParameters ? snapshotJsonValue(parameters) : parameters;
		if (detached === void 0) throw new Error(`tool "${name}" parameters must be lossless JSON before schema projection`);
		return {
			name,
			description,
			parameters: detached,
			...deferLoading === true ? { deferLoading } : {}
		};
	}
	/**
	* Classify a pending call through the caller's visible tool definition. Only
	* an exact `true` is parallel; unknown, hidden, undeclared, invalid, or
	* throwing classifiers are exclusive.
	* @param exec - call name, parsed arguments, and optional agent scope.
	* @returns the fail-closed scheduling mode.
	*/
	executionMode(exec) {
		const tool = this.resolveExecution(exec.name, exec.agent, exec.parent !== void 0);
		if (!tool?.isConcurrencySafe) return { kind: "exclusive" };
		try {
			return tool.isConcurrencySafe(exec.arguments) === true ? { kind: "parallel" } : { kind: "exclusive" };
		} catch {
			return { kind: "exclusive" };
		}
	}
	/**
	* Run the `tools/ptc-dispatch-log` waterfall over one settled sub-dispatch
	* and return the content the bridge should log on `tool/ptc-dispatch`.
	* Contained: when a listener throws, the method logs the original settled
	* content; that failure must not fail the dispatch or omit the settle event. Private:
	* the ONE consumer is the `run_code` bridge this registry constructs, which
	* receives it as a capability parameter (the `requireRuntime` idiom) — the
	* waterfall, not this invoker, is the public extension point.
	*/
	async shapeDispatchLog(dispatch) {
		try {
			return await this.ctx.waterfall(scopeTarget(this, dispatch.agent), "tools/ptc-dispatch-log", dispatch, () => Promise.resolve(dispatch.content));
		} catch (error) {
			this.ctx.logger.warn(`tools: ptc-dispatch-log listener failed for ${dispatch.name}: ${errorMessage(error)}; logging the original settled content`);
			return dispatch.content;
		}
	}
	/**
	* Whether the `ptc` mode collapse denies a model-direct call: only the
	* reserved `run_code` transport may be named. Nested sub-dispatches (a
	* `parent` token set) bypass the collapse. One home for the
	* security-relevant predicate, shared by {@link resolveExecution} and
	* {@link createExecution} so the two can never drift apart.
	*
	* Resolved through {@link modeFor}, NOT `defaultMode`: an agent given `ptc`
	* by an agent preset under a native deployment is the composition
	* `dsh-agent-tool-presentation` exists for, and reading the deployment default would
	* leave exactly that agent uncollapsed — announcing one surface while
	* executing another, which is the bypass this collapse closes.
	* @param name - the tool name as registered.
	* @param scope - the viewing scope whose effective presentation mode applies.
	* @param nested - whether the call is a transport sub-dispatch, not a model-direct call.
	*/
	collapses(name, scope, nested) {
		return !nested && this.modeFor(scope) === "ptc" && name !== "run_code";
	}
	/**
	* Execute through pre-policy, guards, around-dispatch, post-policy,
	* definition-owned content finalization, and final notification. Tool and
	* listener failures resolve as materialized error results; an invisible tool
	* reports `UNKNOWN_TOOL`. The returned outcome is the same lossless, frozen
	* snapshot final observers receive. Cancellation
	* arriving after entry and before final result materialization skips a
	* not-yet-started body with `ABORTED_BEFORE_DISPATCH` or replaces a
	* successful started outcome with `ABORTED`; already-started work is still
	* drained and may retain a tool-owned structured error.
	* @param exec - the typed same-process call input. The registry assigns its
	*   correlation token before policy begins.
	* @returns the materialized final result.
	*/
	async execute(exec) {
		return this.prepareExecution(exec, (prepared) => this.completeScheduledExecution(prepared));
	}
	async completeScheduledExecution(prepared) {
		switch (prepared.kind) {
			case "dispatch": {
				const dispatched = await this.dispatchScheduledExecution(prepared.exec);
				return dispatched.kind === "post-result" ? await this.finalizeScheduledExecution(prepared.exec, dispatched.result) : this.finishScheduledExecution(prepared.exec, dispatched.result);
			}
			case "post-result": return await this.finalizeScheduledExecution(prepared.exec, prepared.result);
			case "final-result": return this.finishScheduledExecution(prepared.exec, prepared.result);
			/* v8 ignore next -- closed-union exhaustiveness guard */
			default: return assertNever$1(prepared, "scheduled tool preparation");
		}
	}
	createExecution(exec) {
		const deferredContexts = [];
		const token = createExecutionToken();
		const callId = exec.callId;
		const rootCallId = exec.rootCallId ?? callId;
		const name = exec.name;
		const agent = exec.agent;
		const parent = exec.parent;
		const signal = exec.signal;
		const visible = this.get(name, agent);
		const collapsed = visible !== void 0 && this.collapses(name, agent, parent !== void 0);
		const concludingExecutions = this.concludingExecutions;
		const base = {
			token,
			callId,
			rootCallId,
			name,
			signal,
			...agent !== void 0 ? { agent } : {},
			...parent !== void 0 ? { parent } : {},
			...exec.schema !== void 0 ? { schema: exec.schema } : {},
			deferContext(context) {
				deferredContexts.push(context);
			},
			concludeTurn() {
				concludingExecutions.add(this);
			}
		};
		const capturedFinalizer = visible?.finalizeContent?.bind(visible);
		const capturedProjector = visible?.projectContent?.bind(visible);
		const finalizerFor = () => collapsed && !signal.aborted ? void 0 : capturedFinalizer;
		try {
			const detached = snapshotJsonValue(exec.arguments);
			if (detached === void 0) throw new TypeError("tool execution arguments must be losslessly JSON-serializable");
			const execution = {
				...base,
				arguments: deepFreeze(detached)
			};
			this.deferredContexts.set(execution, deferredContexts);
			this.contentFinalizers.set(execution, finalizerFor());
			if (!collapsed) this.contentProjectors.set(execution, capturedProjector);
			this.cancellationStates.set(execution, {
				callerSignal: signal,
				bodyInvoked: false
			});
			if (collapsed) {
				if (signal.aborted) return {
					kind: "final-result",
					exec: execution,
					result: toolAbortedBeforeDispatchResult()
				};
				return {
					kind: "final-result",
					exec: execution,
					result: toolErrorResult(new ToolNotFoundError(name, `only \`${RUN_CODE_NAME}\` is callable directly — call \`${name}\` from inside a \`${RUN_CODE_NAME}\` program instead`))
				};
			}
			return {
				kind: "ready",
				exec: execution
			};
		} catch (error) {
			const execution = {
				...base,
				arguments: void 0
			};
			this.contentFinalizers.set(execution, finalizerFor());
			return {
				kind: "final-result",
				exec: execution,
				result: toolErrorResult(error)
			};
		}
	}
	/**
	* Run the ordered pre-execute and monotonic guard stages for the scheduler.
	* @param input - the caller-supplied execution input.
	* @returns the prepared execution plus the next scheduler stage.
	* @internal
	*/
	async prepareScheduledExecution(input) {
		return this.prepareExecution(input, (prepared) => prepared);
	}
	async prepareExecution(input, next) {
		const created = this.createExecution(input);
		if (created.kind !== "ready") return next(created);
		const exec = created.exec;
		if (this.callerCancelled(exec)) return next({
			kind: "final-result",
			exec,
			result: toolAbortedBeforeDispatchResult()
		});
		try {
			const carrier = scopeTarget(this, exec.agent);
			const gate = await this.ctx.waterfall(carrier, "tools/pre-execute", exec, () => Promise.resolve({ kind: "allow" }));
			const askResolution = gate.kind === "ask" ? await this.serviceAsk(exec, gate) : {
				decision: gate,
				approvalCancelled: false
			};
			const { decision } = askResolution;
			if (this.callerCancelled(exec) && askResolution.approvalCancelled) return await next({
				kind: "post-result",
				exec,
				result: toolAbortedBeforeDispatchResult()
			});
			if (decision.kind === "cancel") return await next({
				kind: "post-result",
				exec,
				result: toolAbortedBeforeDispatchResult()
			});
			const denialReason = decision.kind === "allow" ? this.guardReason(exec) : decision.reason;
			const denialInfo = decision.kind === "deny" ? decision.info : void 0;
			if (denialReason !== void 0) return await next({
				kind: "post-result",
				exec,
				result: this.materializeFinalResult({
					content: [{
						type: "text",
						text: `Error: ${denialReason}`
					}],
					isError: true,
					error: {
						message: denialReason,
						...denialInfo === void 0 ? {} : { info: denialInfo }
					}
				})
			});
			if (this.callerCancelled(exec)) return await next({
				kind: "post-result",
				exec,
				result: toolAbortedBeforeDispatchResult()
			});
			return await next({
				kind: "dispatch",
				exec
			});
		} catch (error) {
			return next({
				kind: "final-result",
				exec,
				result: toolErrorResult(error)
			});
		}
	}
	/** Whether the original caller signal is currently aborted. */
	callerCancelled(exec) {
		const state = this.cancellationStates.get(exec);
		/* v8 ignore next -- only registry-minted executions reach the staged scheduler methods */
		if (state === void 0) throw new Error("tool registry scheduler invariant violated: missing cancellation state");
		return state.callerSignal.aborted;
	}
	/** Canonical cancellation outcome selected by whether the tool body started. */
	cancellationResult(exec, prior) {
		const state = this.cancellationStates.get(exec);
		/* v8 ignore next -- only registry-minted executions reach the staged scheduler methods */
		if (state === void 0) throw new Error("tool registry scheduler invariant violated: missing cancellation state");
		return state.bodyInvoked ? toolAbortedResult(prior) : toolAbortedBeforeDispatchResult(prior);
	}
	/**
	* Dispatch the registered body with the original caller signal fused back
	* into any around-wrapper replacement. Cancellation never abandons the body:
	* a started promise reaches quiescence before its outcome becomes `ABORTED`.
	*/
	async dispatchToolBody(exec) {
		const state = this.cancellationStates.get(exec);
		/* v8 ignore next -- only registry-minted executions reach the staged scheduler methods */
		if (state === void 0) throw new Error("tool registry scheduler invariant violated: missing cancellation state");
		const wrapperSignal = exec.signal;
		const fused = fuseToolSignals(state.callerSignal, wrapperSignal);
		const signal = fused.signal;
		if (isAborted(signal)) {
			fused.dispose();
			return toolAbortedBeforeDispatchResult();
		}
		exec.signal = signal;
		try {
			const tool = this.resolveExecution(exec.name, exec.agent, exec.parent !== void 0);
			if (!tool) throw new ToolNotFoundError(exec.name);
			state.bodyInvoked = true;
			const returned = await tool.execute(exec.arguments, exec);
			const result = this.createSuccessResult(exec, tool, returned);
			return isAborted(signal) ? toolAbortedResult(result) : result;
		} catch (error) {
			return toolErrorResult(error);
		} finally {
			fused.dispose();
			exec.signal = wrapperSignal;
		}
	}
	/**
	* Run around-dispatch and the tool body. Tool and unknown-tool failures still
	* receive post-execute; pipeline failures are already final.
	* @param exec - the prepared execution.
	* @returns whether the result still needs post-execute.
	* @internal
	*/
	async dispatchScheduledExecution(exec) {
		try {
			const mutableExec = exec;
			const carrier = scopeTarget(this, exec.agent);
			const result = await this.ctx.waterfall(carrier, "tools/execute", mutableExec, () => this.dispatchToolBody(mutableExec));
			const normalized = this.normalizeDispatchResult(exec, result);
			const deferredContexts = this.deferredContexts.get(exec);
			/* v8 ignore next -- dispatch only receives executions minted by this registry's prepare stage */
			if (deferredContexts === void 0) throw new Error("tool registry scheduler invariant violated: unprepared execution");
			const resultWithDeferredContexts = deferredContexts.length === 0 ? normalized : this.markCanonical(exec, {
				...normalized,
				additionalContexts: [...deferredContexts, ...normalized.additionalContexts ?? []]
			});
			return {
				kind: "post-result",
				result: this.callerCancelled(exec) && !resultWithDeferredContexts.isError ? this.cancellationResult(exec, resultWithDeferredContexts) : resultWithDeferredContexts
			};
		} catch (error) {
			return {
				kind: "final-result",
				result: toolErrorResult(error)
			};
		}
	}
	/**
	* Run ordered post-execute, then apply definition-owned content finalization,
	* materialize, and notify the final outcome.
	* @param exec - the prepared execution.
	* @param result - dispatch/pre result that still needs post-execute.
	* @returns the materialized final result.
	* @internal
	*/
	async finalizeScheduledExecution(exec, result) {
		try {
			const project = this.contentProjectors.get(exec);
			this.contentProjectors.delete(exec);
			const content = project?.(exec, result);
			const projected = content === void 0 ? result : this.markCanonical(exec, this.materializeFinalResult({
				...result,
				content
			}));
			const postResult = await this.postExecute(exec, projected);
			return this.finishScheduledExecution(exec, this.callerCancelled(exec) && !postResult.isError ? this.cancellationResult(exec, postResult) : postResult);
		} catch (error) {
			return this.finishScheduledExecution(exec, toolErrorResult(error));
		}
	}
	/**
	* Materialize the candidate, apply definition-owned content finalization,
	* then materialize and notify the authoritative result.
	* @param exec - the prepared execution.
	* @param result - final result.
	* @returns the materialized final result.
	* @internal
	*/
	finishScheduledExecution(exec, result) {
		let materializedResult;
		try {
			materializedResult = this.materializeFinalResult(result);
		} catch (error) {
			materializedResult = this.materializeFinalResult(toolErrorResult(error));
		}
		let finalResult;
		try {
			finalResult = this.materializeFinalResult(this.applyFinalContent(exec, materializedResult));
		} catch (error) {
			finalResult = this.materializeFinalResult(toolErrorResult(error));
		}
		this.notifyResult(exec, finalResult);
		return finalResult;
	}
	/** Apply the snapshotted tool-owned content transform without exposing other result fields. */
	applyFinalContent(exec, result) {
		const finalizeContent = this.contentFinalizers.get(exec);
		if (finalizeContent === void 0) return result;
		const content = finalizeContent(exec, result);
		return content === void 0 ? result : {
			...result,
			content
		};
	}
	/** Notify observers without exposing a mutation or error channel into the outcome. */
	notifyResult(exec, result) {
		Object.freeze(exec);
		const { name: toolName, callId } = exec;
		const reportFailure = (error) => {
			this.ctx.logger.warn(`tool "${toolName}" (${callId}): tools/result observer failed: ${errorMessage(error)}`);
		};
		const callbacks = this.ctx.events.dispatch("emit", [
			scopeTarget(this, exec.agent),
			"tools/result",
			exec,
			result
		]);
		for (const callback of callbacks) try {
			const returned = callback(exec, result);
			Promise.resolve(returned).catch(reportFailure);
		} catch (error) {
			reportFailure(error);
		}
	}
	/**
	* Resolve an `ask` decision to allow/deny through the approval seam. The
	* seam is consumed opportunistically with `ctx.get('approval')` — a
	* deployment that composes no ApprovalService keeps the historical degrade
	* to deny, and an unmount mid-session degrades the same way on the next ask.
	* An agent-less execution also degrades: without an agent there is no
	* session to audit to and no UI to route to. Otherwise the outcome maps
	* one-to-one — `allowed-once` proceeds; the three non-grants deny with
	* distinct reasons so the model can tell a human "no" from an absent
	* approval channel.
	*/
	async serviceAsk(exec, ask) {
		const approval = this.ctx.get("approval");
		if (approval === void 0) return {
			decision: {
				kind: "deny",
				reason: ask.reason ?? `tool "${exec.name}" requires approval (not yet supported)`
			},
			approvalCancelled: false
		};
		if (exec.agent === void 0) return {
			decision: {
				kind: "deny",
				reason: `tool "${exec.name}" requires approval, but the call has no agent to route it through`
			},
			approvalCancelled: false
		};
		const outcome = await approval.request({
			agent: exec.agent,
			toolName: exec.name,
			callId: exec.callId,
			...ask.reason !== void 0 ? { reason: ask.reason } : {},
			...ask.displayReason !== void 0 ? { displayReason: ask.displayReason } : {},
			signal: exec.signal
		});
		switch (outcome) {
			case "allowed-once": return {
				decision: { kind: "allow" },
				approvalCancelled: false
			};
			case "rejected": return {
				decision: {
					kind: "deny",
					reason: `the user rejected tool "${exec.name}"`
				},
				approvalCancelled: false
			};
			case "cancelled": return {
				decision: {
					kind: "deny",
					reason: `approval for tool "${exec.name}" was cancelled`
				},
				approvalCancelled: true
			};
			case "unavailable": return {
				decision: {
					kind: "deny",
					reason: `tool "${exec.name}" requires approval, but no approval channel is available`
				},
				approvalCancelled: false
			};
			default: return assertNever$1(outcome, "ApprovalOutcome");
		}
	}
	/**
	* Run the `tools/post-execute` waterfall over a dispatched `result` and apply
	* its {@link PostToolDecision}: `accept` keeps the call successful (replacing
	* `content` when given), `block` turns it into an `isError` whose content is
	* the corrective `feedback`. Either decision may attach `additionalContexts`,
	* which are ferried on the returned result for the loop's active-batch FIFO.
	* Context deferred by the tool body survives an accepted result but is
	* discarded when the outer call is blocked; a block exposes only context the
	* blocking decision explicitly supplied.
	* Runs inside `execute`'s outer try/catch (a throwing listener → isError).
	*/
	async postExecute(exec, result) {
		const decision = await this.ctx.waterfall(scopeTarget(this, exec.agent), "tools/post-execute", exec, result, () => Promise.resolve({ kind: "accept" }));
		const decisionContexts = decision.additionalContexts ?? [];
		if (decision.kind === "block") {
			const message = failureMessageFromContent(decision.feedback);
			return this.markCanonical(exec, {
				content: decision.feedback,
				isError: true,
				error: { message },
				...decisionContexts.length > 0 ? { additionalContexts: decisionContexts } : {}
			});
		}
		if (Object.hasOwn(decision, "content") && Object.hasOwn(decision, "value")) throw new TypeError("tools/post-execute accept decision cannot replace both value and content");
		const additionalContexts = [...result.additionalContexts ?? [], ...decisionContexts];
		if (Object.hasOwn(decision, "value")) {
			if (result.isError) throw new TypeError("tools/post-execute cannot replace the value of a failed result");
			const tool = this.resolveExecution(exec.name, exec.agent, exec.parent !== void 0);
			if (tool === void 0) throw new ToolNotFoundError(exec.name);
			const replaced = this.createSuccessResult(exec, tool, decision.value);
			return this.markCanonical(exec, {
				...replaced,
				...additionalContexts.length > 0 ? { additionalContexts } : {}
			});
		}
		return this.markCanonical(exec, {
			...result,
			...decision.content !== void 0 ? { content: decision.content } : {},
			...additionalContexts.length > 0 ? { additionalContexts } : {}
		});
	}
	/** Registry-normalized results and the exact dispatch that validated each value. */
	canonicalResults = /* @__PURE__ */ new WeakMap();
	/** Mark one registry-normalized result as canonical only for its owning dispatch. */
	markCanonical(exec, result) {
		this.canonicalResults.set(result, exec.token);
		return result;
	}
	/** Snapshot, validate, render, and optionally project one successful body value. */
	createSuccessResult(exec, tool, candidate) {
		const detached = snapshotToolValue(tool.name, candidate);
		const violations = validateJsonSchemaValue(tool.output.schema, detached, "value");
		if (violations.length > 0) throw new ToolOutputError(tool.name, violations);
		const value = deepFreeze(detached);
		let rendered;
		try {
			rendered = tool.output.render(exec.arguments, value);
		} catch (error) {
			throw projectionError(tool.name, "render", error);
		}
		const content = snapshotProjection(tool.name, "render", rendered);
		let meta;
		if (exec.parent === void 0 && tool.output.presentationMeta !== void 0) {
			let projected;
			try {
				projected = tool.output.presentationMeta(exec.arguments, value);
			} catch (error) {
				throw projectionError(tool.name, "presentationMeta", error);
			}
			meta = snapshotProjection(tool.name, "presentationMeta", projected);
		}
		const concludesTurn = this.concludingExecutions.has(exec);
		return this.markCanonical(exec, this.materializeFinalResult({
			isError: false,
			value,
			content,
			...meta !== void 0 ? { meta } : {},
			...concludesTurn ? { concludesTurn: true } : {}
		}));
	}
	/** Normalize an around-dispatch wrapper's authored result through the owning output contract. */
	normalizeDispatchResult(exec, result) {
		if (this.canonicalResults.get(result) === exec.token) return result;
		if (result.isError) return this.markCanonical(exec, {
			isError: true,
			error: result.error,
			content: result.content,
			...result.meta !== void 0 ? { meta: result.meta } : {},
			...result.additionalContexts !== void 0 ? { additionalContexts: result.additionalContexts } : {}
		});
		const tool = this.resolveExecution(exec.name, exec.agent, exec.parent !== void 0);
		if (tool === void 0) throw new ToolNotFoundError(exec.name);
		const normalized = this.createSuccessResult(exec, tool, result.value);
		return this.markCanonical(exec, {
			...normalized,
			...result.additionalContexts !== void 0 ? { additionalContexts: result.additionalContexts } : {}
		});
	}
	/** Materialize the authoritative commit outcome once, immediately before `tools/result`. */
	materializeFinalResult(result) {
		const presentation = {
			content: result.content,
			...result.meta !== void 0 ? { meta: result.meta } : {},
			...result.additionalContexts !== void 0 ? { additionalContexts: result.additionalContexts } : {}
		};
		if (result.isError) return materializePresentation({
			isError: true,
			error: result.error,
			...presentation
		});
		return deepFreeze({
			...materializePresentation({
				isError: false,
				...presentation,
				...result.concludesTurn === true ? { concludesTurn: true } : {}
			}),
			value: result.value
		});
	}
};
/** Mint a same-process correlation token whose identity is its value. */
function createExecutionToken() {
	return Symbol("dsh.tool.execution");
}
function toolErrorResult(error) {
	const info = errorInfo(error);
	const message = errorMessage(error);
	return {
		content: [{
			type: "text",
			text: `Error: ${message}`
		}],
		isError: true,
		error: {
			message,
			...info ? { info } : {}
		}
	};
}
/** Read live abort state across an await without treating it as synchronously immutable. */
function isAborted(signal) {
	return signal.aborted;
}
/**
* Fuse caller and wrapper cancellation without nesting `AbortSignal.any`.
* Keeping the relay dispatch-scoped also removes listeners when work settles.
*/
function fuseToolSignals(caller, wrapper) {
	if (caller === wrapper) return {
		signal: caller,
		dispose() {}
	};
	const controller = new AbortController();
	let listening = false;
	const dispose = () => {
		if (!listening) return;
		listening = false;
		caller.removeEventListener("abort", abortFromCaller);
		wrapper.removeEventListener("abort", abortFromWrapper);
	};
	const abortFrom = (source) => {
		const reason = source.reason;
		controller.abort(reason);
		dispose();
	};
	const abortFromCaller = () => {
		abortFrom(caller);
	};
	const abortFromWrapper = () => {
		abortFrom(wrapper);
	};
	if (wrapper.aborted) abortFromWrapper();
	else if (caller.aborted) abortFromCaller();
	else {
		listening = true;
		caller.addEventListener("abort", abortFromCaller, { once: true });
		wrapper.addEventListener("abort", abortFromWrapper, { once: true });
	}
	return {
		signal: controller.signal,
		dispose
	};
}
/** Canonical result when cancellation supersedes success after body invocation. */
function toolAbortedResult(prior) {
	const additionalContexts = prior?.additionalContexts ?? [];
	return {
		content: [{
			type: "text",
			text: "Error: tool call aborted"
		}],
		isError: true,
		error: {
			message: "tool call aborted",
			info: {
				name: "AbortError",
				code: TOOL_ABORTED
			}
		},
		...additionalContexts.length > 0 ? { additionalContexts } : {}
	};
}
/** Canonical result when cancellation prevents tool body invocation. */
function toolAbortedBeforeDispatchResult(prior) {
	const additionalContexts = prior?.additionalContexts ?? [];
	return {
		content: [{
			type: "text",
			text: "Error: tool call aborted before dispatch"
		}],
		isError: true,
		error: {
			message: "tool call aborted before dispatch",
			info: {
				name: "AbortError",
				code: TOOL_ABORTED_BEFORE_DISPATCH
			}
		},
		...additionalContexts.length > 0 ? { additionalContexts } : {}
	};
}
//#endregion
//#region node_modules/.pnpm/@deepseek-ai+dsh-credentials@0.2.0-rc.2_@deepseek-ai+cordis@4.0.4_@deepseek-ai+dsh-inva_6ce3c10b399f2e26f25399a027815ddb/node_modules/@deepseek-ai/dsh-credentials/lib/index.js
/** Both halves of a {@link CredentialKey}; the `/` between them is what keeps it out of {@link REF_PATTERN}. */
const KEY_SEGMENT_PATTERN = /^[a-z][a-z0-9-]*$/;
/**
* Whether a raw string could be a {@link credentialKey} segment at all.
* Consumers whose addressing units come from somewhere else — a settings dict
* key, a library's own provider id — ask this before building a key, because a
* unit outside the grammar can never have stored a record and should read as
* "nothing stored" rather than as a thrown error.
* @param value - candidate segment.
* @returns true when {@link credentialKey} would accept it as either segment.
*/
function isCredentialKeySegment(value) {
	return KEY_SEGMENT_PATTERN.test(value);
}
/**
* Brand a scope and an id as a {@link CredentialKey}.
* @param scope - the owning plugin's registered name, such as `llm-pi-ai`.
* @param id - that plugin's own addressing unit, such as a provider route key.
* @returns the branded key.
* @throws TypeError when either segment is not a lowercase hyphenated identifier.
*/
function credentialKey(scope, id) {
	for (const segment of [scope, id]) if (!KEY_SEGMENT_PATTERN.test(segment)) throw new TypeError(`credential key segment "${segment}" must match ${String(KEY_SEGMENT_PATTERN)}`);
	return brandString(`${scope}/${id}`);
}
//#endregion
//#region lib/types/shared.js
/**
* Constants and types shared by the Host bundle and the browser bundle.
*
* Nothing here may import a Node-only module: the client bundle pulls this
* file in for route paths, protocol capabilities and the provider presets.
*/
/** npm package name; DSH's module loader and plugin loader key the plugin by it. */
const PACKAGE_NAME = "@copylee/dsh-image-gen";
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
/** Agent image jobs: `<JOBS_ROUTE>/<id>` status, `<JOBS_ROUTE>/<id>/image` bytes. Prefix route. */
const JOBS_ROUTE = `${ROUTE_BASE}/jobs`;
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
/**
* Map the Ark output controls onto request-body fields. `background` is
* opt-in per call site: Ark accepts `transparent` only on the edit path.
*/
function arkOutputBody(options, { background = true } = {}) {
	if (options === void 0) return {};
	const body = {};
	if (options.outputFormat !== void 0) body.output_format = options.outputFormat;
	if (options.watermark !== void 0) body.watermark = options.watermark;
	if (background && options.background === "transparent") body.background = "transparent";
	return body;
}
/** Shipped provider presets. Ids are stable: keys and settings refer to them. */
const PRESET_PROVIDERS = [
	{
		id: "modelscope",
		name: "ModelScope 魔搭",
		protocol: "modelscope",
		baseURL: "https://api-inference.modelscope.cn/v1",
		models: [
			"Qwen/Qwen-Image",
			"Qwen/Qwen-Image-Edit",
			"black-forest-labs/FLUX.1-Krea-dev",
			"MusePublic/489_ckpt_FLUX_1"
		],
		defaultModel: "Qwen/Qwen-Image",
		enabled: true,
		proxy: { mode: "inherit" },
		preset: true
	},
	{
		id: "google",
		name: "Google Gemini",
		protocol: "gemini",
		baseURL: "https://generativelanguage.googleapis.com/v1beta/interactions",
		models: ["gemini-3.1-flash-image", "gemini-3-pro-image"],
		defaultModel: "gemini-3.1-flash-image",
		enabled: true,
		proxy: { mode: "inherit" },
		preset: true
	},
	{
		id: "openai",
		name: "OpenAI",
		protocol: "openai",
		baseURL: "https://api.openai.com/v1",
		models: ["gpt-image-2", "gpt-image-1"],
		defaultModel: "gpt-image-2",
		enabled: true,
		proxy: { mode: "inherit" },
		preset: true
	},
	{
		id: "siliconflow",
		name: "硅基流动 SiliconFlow",
		protocol: "siliconflow",
		baseURL: "https://api.siliconflow.cn/v1",
		models: [
			"Kwai-Kolors/Kolors",
			"Qwen/Qwen-Image",
			"Qwen/Qwen-Image-Edit"
		],
		defaultModel: "Kwai-Kolors/Kolors",
		enabled: true,
		proxy: { mode: "inherit" },
		preset: true
	},
	{
		id: "seedream",
		name: "火山方舟 Seedream",
		protocol: "seedream",
		baseURL: "https://ark.cn-beijing.volces.com/api/v3",
		models: ["doubao-seedream-5-0-260128", "doubao-seedream-4-0-250828"],
		defaultModel: "doubao-seedream-5-0-260128",
		enabled: true,
		proxy: { mode: "inherit" },
		preset: true,
		ark: {
			outputFormat: "jpeg",
			watermark: true,
			background: "opaque"
		}
	},
	{
		id: "dashscope",
		name: "阿里云百炼 DashScope",
		protocol: "dashscope",
		baseURL: "https://dashscope.aliyuncs.com/api/v1",
		models: ["qwen-image-3.0", "qwen-image-edit"],
		defaultModel: "qwen-image-3.0",
		enabled: true,
		proxy: { mode: "inherit" },
		preset: true
	},
	{
		id: "xai",
		name: "xAI Grok Imagine",
		protocol: "xai",
		baseURL: "https://api.x.ai/v1",
		models: ["grok-imagine-image"],
		defaultModel: "grok-imagine-image",
		enabled: true,
		proxy: { mode: "inherit" },
		preset: true
	},
	{
		id: "zhipu",
		name: "智谱 GLM-Image",
		protocol: "zhipu",
		baseURL: "https://open.bigmodel.cn/api/paas/v4",
		models: ["glm-image", "cogview-4"],
		defaultModel: "glm-image",
		enabled: true,
		proxy: { mode: "inherit" },
		preset: true
	},
	{
		id: "together",
		name: "Together AI",
		protocol: "openai-compat",
		baseURL: "https://api.together.xyz/v1",
		models: ["black-forest-labs/FLUX.1-schnell", "black-forest-labs/FLUX.1.1-pro"],
		defaultModel: "black-forest-labs/FLUX.1-schnell",
		enabled: true,
		proxy: { mode: "inherit" },
		preset: true
	},
	{
		id: "openai-compat",
		name: "OpenAI 兼容（中转站）",
		protocol: "openai-compat",
		baseURL: "",
		models: [],
		defaultModel: "",
		enabled: true,
		proxy: { mode: "inherit" },
		preset: true
	}
];
/** Default settings for a fresh install. */
function defaultSettings() {
	return {
		version: 1,
		providers: PRESET_PROVIDERS.map((entry) => structuredClone(entry)),
		activeProvider: "modelscope",
		proxy: {
			mode: "off",
			enabled: false,
			url: "",
			noProxy: [
				"localhost",
				"127.0.0.1",
				"::1"
			]
		},
		chatTools: true,
		saveToWorkspace: true,
		workspaceFolder: PLUGIN_SLUG,
		imageDir: ""
	};
}
/** The model a call should use: an explicit override, the default, then the first listed. */
function effectiveModel(entry, override) {
	const requested = override?.trim();
	if (requested !== void 0 && requested.length > 0) return requested;
	return entry.defaultModel.trim() || entry.models[0]?.trim() || "";
}
/** Parse `WxH` / `W*H`; undefined when malformed. */
function parseSize(value) {
	const match = /^\s*(\d{2,5})\s*[x*×]\s*(\d{2,5})\s*$/i.exec(value ?? "");
	return match === null ? void 0 : {
		width: Number(match[1]),
		height: Number(match[2])
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
/**
* Resolve the wire size for one request. Returns `{ size }` for pixel-size
* protocols, `{ aspectRatio, imageSize }` for tier protocols.
*/
function resolveSize(entry, request) {
	if (request.size !== void 0 && request.size.trim().length > 0) return { size: request.size.trim() };
	const caps = capabilitiesOf(entry);
	const ratio = request.aspectRatio !== void 0 && caps.ratios.includes(request.aspectRatio) ? request.aspectRatio : void 0;
	const table = entry.protocol === "openai-compat" ? entry.compat?.sizes : void 0;
	if (table !== void 0 && Object.keys(table).length > 0) {
		const row = table[ratio ?? Object.keys(table)[0]] ?? {};
		const tier = request.imageSize !== void 0 && row[request.imageSize] !== void 0 ? request.imageSize : Object.keys(row)[0];
		const size = tier === void 0 ? void 0 : row[tier];
		return size === void 0 ? {} : { size };
	}
	if (caps.sizes !== void 0) {
		const size = caps.sizes[ratio ?? caps.ratios[0] ?? "1:1"];
		return size === void 0 ? {} : { size };
	}
	const tier = request.imageSize !== void 0 && caps.tiers.includes(request.imageSize) ? request.imageSize : void 0;
	return {
		...ratio === void 0 ? {} : { aspectRatio: ratio },
		...tier === void 0 ? {} : { imageSize: tier }
	};
}
//#endregion
//#region lib/types/storage.js
/** Plugin-owned JSON storage under the DSH home, independent of any workspace. */
/**
* Directory holding this plugin's settings and gallery. Precedence: explicit
* config, `COPYLEE_IMAGE_GEN_HOME`, `$DSH_HOME/storages/copylee-image-gen`, then
* `~/.dsh/storages/copylee-image-gen` (next to DSH's own `workspace.json`).
*/
function resolveDataDir(configured) {
	const explicit = configured?.trim() || process.env.COPYLEE_IMAGE_GEN_HOME?.trim();
	if (explicit) return explicit;
	const dshHome = process.env.DSH_HOME?.trim() || join(process.env.USERPROFILE || process.env.HOME || homedir(), ".dsh");
	return join(dshHome, "storages", PLUGIN_SLUG);
}
/** Read and parse one JSON file; `undefined` when it does not exist. */
async function readJson(path) {
	let text;
	try {
		text = await readFile(path, "utf8");
	} catch (error) {
		if (error.code === "ENOENT") return void 0;
		throw error;
	}
	try {
		return JSON.parse(text);
	} catch {
		await rename(path, `${path}.corrupt-${String(Date.now())}`).catch(() => {});
		return;
	}
}
/** Atomically replace one JSON file (write a sibling, then rename). */
async function writeJson(path, value, mode) {
	await mkdir(dirname(path), { recursive: true });
	const staging = `${path}.${randomUUID()}.tmp`;
	try {
		await writeFile(staging, `${JSON.stringify(value, null, 2)}\n`, mode === void 0 ? "utf8" : {
			encoding: "utf8",
			mode
		});
		await rename(staging, path);
	} catch (error) {
		await unlink(staging).catch(() => {});
		throw error;
	}
}
/** Serialize async read-modify-write operations on one resource. */
var Mutex = class {
	tail = Promise.resolve();
	run(task) {
		const next = this.tail.then(task, task);
		this.tail = next.catch(() => {});
		return next;
	}
};
//#endregion
//#region lib/types/credentials.js
/**
* Per-provider API keys.
*
* Keys live in DSH's credential store as records `copylee-image-gen/<providerId>`
* (any number of user-added providers, no schema declaration needed). Hosts
* without the record API fall back to a 0600 `keys.json` beside the settings.
* Keys are only ever read on the Host; the browser sees configured/not.
*/
function hasRecordApi(value) {
	if (typeof value !== "object" || value === null) return false;
	const candidate = value;
	return typeof candidate.readRecord === "function" && typeof candidate.modifyRecord === "function" && typeof candidate.deleteRecord === "function";
}
function recordKey(providerId) {
	if (!isCredentialKeySegment(providerId)) throw new Error(`Provider id "${providerId}" cannot address a credential`);
	return credentialKey(PLUGIN_SLUG, providerId);
}
/** Keys in the DSH credential store. */
function credentialKeyStore(service) {
	return {
		async get(providerId) {
			const record = await service.readRecord(recordKey(providerId));
			const key = record?.kind === "api-key" ? record.key?.trim() : void 0;
			return key === void 0 || key.length === 0 ? void 0 : key;
		},
		async set(providerId, value) {
			const key = value.trim();
			if (key.length === 0) throw new Error("API key is empty");
			await service.modifyRecord(recordKey(providerId), async () => ({
				kind: "api-key",
				key
			}));
		},
		async unset(providerId) {
			await service.deleteRecord(recordKey(providerId));
		}
	};
}
/** Fallback: keys in a private file next to the settings. */
function fileKeyStore(dir) {
	const path = join(dir, "keys.json");
	const mutex = new Mutex();
	const load = async () => {
		const raw = await readJson(path);
		if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return {};
		return Object.fromEntries(Object.entries(raw).filter((pair) => typeof pair[1] === "string"));
	};
	return {
		async get(providerId) {
			const value = (await load())[providerId]?.trim();
			return value === void 0 || value.length === 0 ? void 0 : value;
		},
		set(providerId, value) {
			return mutex.run(async () => {
				const key = value.trim();
				if (key.length === 0) throw new Error("API key is empty");
				await writeJson(path, {
					...await load(),
					[providerId]: key
				}, 384);
			});
		},
		unset(providerId) {
			return mutex.run(async () => {
				const all = await load();
				delete all[providerId];
				await writeJson(path, all, 384);
			});
		}
	};
}
/**
* Prefer the DSH credential store; fall back to the file store when a read or
* write through it fails (older hosts reject unknown record scopes).
*/
function layeredKeyStore(primary, fallback) {
	if (primary === void 0) return fallback;
	return {
		async get(providerId) {
			try {
				const value = await primary.get(providerId);
				if (value !== void 0) return value;
			} catch {}
			return fallback.get(providerId);
		},
		async set(providerId, value) {
			try {
				await primary.set(providerId, value);
				await fallback.unset(providerId).catch(() => {});
			} catch {
				await fallback.set(providerId, value);
			}
		},
		async unset(providerId) {
			await primary.unset(providerId).catch(() => {});
			await fallback.unset(providerId);
		}
	};
}
//#endregion
//#region lib/types/gallery-types.js
/** Gallery wire types shared by the Host store and the browser client. */
const DEFAULT_PROJECT_ID = "default";
const CONVERSATION_PROJECT_ID = "conversation";
//#endregion
//#region lib/types/gallery-db.js
/**
* Global gallery: projects, generated images and favorite prompts.
*
* Deliberately independent of DSH workspaces — the gallery has its own
* project grouping, and every conversation's generations land in the
* built-in “对话” project. Image bytes stay in the DSH attachment store; this
* file keeps the metadata only.
*/
function builtinProjects(now) {
	return [{
		id: DEFAULT_PROJECT_ID,
		name: "默认画板",
		createdAt: now,
		order: 0,
		builtin: true
	}, {
		id: CONVERSATION_PROJECT_ID,
		name: "对话",
		createdAt: now,
		order: 1,
		builtin: true
	}];
}
/** Coerce untrusted stored data into a valid gallery. */
function normalizeGallery(raw, now = Date.now()) {
	const input = typeof raw === "object" && raw !== null ? raw : {};
	const projects = [];
	const ids = /* @__PURE__ */ new Set();
	if (Array.isArray(input.projects)) for (const candidate of input.projects) {
		const project = candidate;
		if (typeof project.id !== "string" || ids.has(project.id) || typeof project.name !== "string") continue;
		ids.add(project.id);
		projects.push({
			id: project.id,
			name: project.name,
			createdAt: typeof project.createdAt === "number" ? project.createdAt : now,
			order: typeof project.order === "number" ? project.order : projects.length,
			...project.builtin === true ? { builtin: true } : {}
		});
	}
	for (const builtin of builtinProjects(now)) {
		const existing = projects.find((project) => project.id === builtin.id);
		if (existing === void 0) projects.push(builtin);
		else existing.builtin = true;
	}
	projects.sort((a, b) => a.order - b.order);
	const items = [];
	if (Array.isArray(input.items)) {
		const seen = /* @__PURE__ */ new Set();
		for (const candidate of input.items) {
			const item = candidate;
			if (typeof item.id !== "string" || seen.has(item.id)) continue;
			if (typeof item.attachment !== "object" || item.attachment === null || typeof item.attachment.attachmentId !== "string") continue;
			seen.add(item.id);
			items.push({
				...item,
				projectId: typeof item.projectId === "string" && ids.has(item.projectId) || item.projectId === "default" || item.projectId === "conversation" ? item.projectId : DEFAULT_PROJECT_ID,
				prompt: typeof item.prompt === "string" ? item.prompt : "",
				createdAt: typeof item.createdAt === "number" ? item.createdAt : now,
				favorite: item.favorite === true
			});
		}
	}
	return {
		version: 1,
		projects,
		items,
		favoritePrompts: Array.isArray(input.favoritePrompts) ? input.favoritePrompts.filter((entry) => typeof entry.id === "string" && typeof entry.text === "string") : []
	};
}
/** Stable id for a prompt text; identical prompts dedupe. */
function promptId(text) {
	let hash = 2166136261;
	for (const char of text) {
		hash ^= char.codePointAt(0);
		hash = Math.imul(hash, 16777619) >>> 0;
	}
	return `p${hash.toString(36)}${String(text.length)}`;
}
var GalleryDb = class {
	dir;
	data;
	mutex = new Mutex();
	listeners = /* @__PURE__ */ new Set();
	constructor(dir) {
		this.dir = dir;
	}
	get path() {
		return join(this.dir, "gallery.json");
	}
	async load() {
		if (this.data === void 0) this.data = normalizeGallery(await readJson(this.path));
		return this.data;
	}
	/** Run one mutation under the lock and persist it. */
	mutate(change) {
		return this.mutex.run(async () => {
			const data = await this.load();
			const result = change(data);
			await writeJson(this.path, data);
			for (const listener of this.listeners) listener();
			return result;
		});
	}
	onChange(listener) {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	}
	async projects() {
		const data = await this.load();
		return data.projects.map((project) => {
			const members = data.items.filter((item) => item.projectId === project.id);
			const latest = members.reduce((best, item) => best === void 0 || item.createdAt > best.createdAt ? item : best, void 0);
			return {
				...project,
				count: members.length,
				...latest === void 0 ? {} : { cover: latest.attachment }
			};
		});
	}
	async list(query = {}) {
		const data = await this.load();
		const needle = query.query?.trim().toLowerCase() ?? "";
		let items = data.items.filter((item) => (query.projectId === void 0 || item.projectId === query.projectId) && (query.favorite !== true || item.favorite) && (query.providerId === void 0 || item.providerId === query.providerId) && (query.sessionId === void 0 || item.sessionId === query.sessionId) && (needle.length === 0 || item.prompt.toLowerCase().includes(needle) || item.model.toLowerCase().includes(needle) || (item.providerName ?? "").toLowerCase().includes(needle)));
		items = items.sort((a, b) => query.order === "asc" ? a.createdAt - b.createdAt : b.createdAt - a.createdAt);
		const offset = Math.max(0, query.offset ?? 0);
		const limit = Math.min(500, Math.max(1, query.limit ?? 100));
		return {
			total: items.length,
			items: items.slice(offset, offset + limit)
		};
	}
	addItems(entries) {
		return this.mutate((data) => {
			const now = Date.now();
			const created = entries.map((entry, index) => ({
				...entry,
				id: randomUUID(),
				createdAt: entry.createdAt ?? now + index,
				projectId: data.projects.some((project) => project.id === entry.projectId) ? entry.projectId : DEFAULT_PROJECT_ID,
				favorite: entry.favorite === true
			}));
			data.items.push(...created);
			return created;
		});
	}
	updateItems(ids, patch) {
		return this.mutate((data) => {
			if (patch.projectId !== void 0 && !data.projects.some((project) => project.id === patch.projectId)) throw new Error("目标项目不存在");
			const wanted = new Set(ids);
			let changed = 0;
			for (const item of data.items) {
				if (!wanted.has(item.id)) continue;
				if (patch.favorite !== void 0) item.favorite = patch.favorite;
				if (patch.projectId !== void 0) item.projectId = patch.projectId;
				if (patch.tags !== void 0) item.tags = patch.tags.filter((tag) => typeof tag === "string" && tag.trim().length > 0);
				changed++;
			}
			return changed;
		});
	}
	/** Remove items; returns the removed records (callers clean up their files). */
	removeItems(ids) {
		return this.mutate((data) => {
			const wanted = new Set(ids);
			const removed = data.items.filter((item) => wanted.has(item.id));
			data.items = data.items.filter((item) => !wanted.has(item.id));
			return removed;
		});
	}
	async get(id) {
		return (await this.load()).items.find((item) => item.id === id);
	}
	async findByJobId(jobId) {
		return (await this.load()).items.find((item) => item.jobId === jobId);
	}
	/** Whether any item still points at this file. */
	async fileInUse(path) {
		return (await this.load()).items.some((item) => item.filePath === path);
	}
	setFilePath(id, filePath) {
		return this.mutate((data) => {
			const item = data.items.find((entry) => entry.id === id);
			if (item !== void 0) item.filePath = filePath;
		});
	}
	createProject(name) {
		const trimmed = name.trim().slice(0, 64);
		if (trimmed.length === 0) return Promise.reject(/* @__PURE__ */ new Error("项目名称不能为空"));
		return this.mutate((data) => {
			const project = {
				id: randomUUID(),
				name: trimmed,
				createdAt: Date.now(),
				order: Math.max(0, ...data.projects.map((entry) => entry.order)) + 1
			};
			data.projects.push(project);
			return project;
		});
	}
	renameProject(id, name) {
		const trimmed = name.trim().slice(0, 64);
		if (trimmed.length === 0) return Promise.reject(/* @__PURE__ */ new Error("项目名称不能为空"));
		return this.mutate((data) => {
			const project = data.projects.find((entry) => entry.id === id);
			if (project === void 0) throw new Error("项目不存在");
			project.name = trimmed;
		});
	}
	/** Delete a project; its images move to the default board unless `deleteItems`. */
	deleteProject(id, deleteItems = false) {
		return this.mutate((data) => {
			const project = data.projects.find((entry) => entry.id === id);
			if (project === void 0) throw new Error("项目不存在");
			if (project.builtin === true) throw new Error("内置项目不能删除");
			data.projects = data.projects.filter((entry) => entry.id !== id);
			data.items = deleteItems ? data.items.filter((item) => item.projectId !== id) : data.items.map((item) => item.projectId === id ? {
				...item,
				projectId: DEFAULT_PROJECT_ID
			} : item);
		});
	}
	reorderProjects(ids) {
		return this.mutate((data) => {
			const position = new Map(ids.map((id, index) => [id, index]));
			for (const project of data.projects) project.order = position.get(project.id) ?? ids.length + project.order;
			data.projects.sort((a, b) => a.order - b.order);
			data.projects.forEach((project, index) => {
				project.order = index;
			});
		});
	}
	async favoritePrompts() {
		return [...(await this.load()).favoritePrompts].sort((a, b) => b.addedAt - a.addedAt);
	}
	addFavoritePrompt(text) {
		const trimmed = text.trim();
		if (trimmed.length === 0) return Promise.reject(/* @__PURE__ */ new Error("Prompt 为空"));
		return this.mutate((data) => {
			const id = promptId(trimmed);
			const existing = data.favoritePrompts.find((entry) => entry.id === id);
			if (existing !== void 0) return existing;
			const entry = {
				id,
				text: trimmed,
				addedAt: Date.now()
			};
			data.favoritePrompts.push(entry);
			return entry;
		});
	}
	/** Rewrite a saved prompt; merges into an existing entry with the same text. */
	updateFavoritePrompt(id, text) {
		const trimmed = text.trim();
		if (trimmed.length === 0) return Promise.reject(/* @__PURE__ */ new Error("Prompt 为空"));
		return this.mutate((data) => {
			const current = data.favoritePrompts.find((entry) => entry.id === id);
			if (current === void 0) throw new Error("收藏的 Prompt 不存在");
			const nextId = promptId(trimmed);
			const duplicate = data.favoritePrompts.find((entry) => entry.id === nextId && entry.id !== id);
			if (duplicate !== void 0) {
				data.favoritePrompts = data.favoritePrompts.filter((entry) => entry.id !== id);
				return duplicate;
			}
			current.id = nextId;
			current.text = trimmed;
			return current;
		});
	}
	removeFavoritePrompt(id) {
		return this.mutate((data) => {
			data.favoritePrompts = data.favoritePrompts.filter((entry) => entry.id !== id);
		});
	}
};
//#endregion
//#region lib/types/import-route.js
const MAX_IMAGES_PER_REQUEST = 8;
/**
* Strict base64 check in linear time. A regex with a quantified group (the
* obvious `^(?:[A-Za-z0-9+/]{4})*…$`) overflows V8's backtracking stack on
* multi-megabyte inputs and throws instead of matching.
*/
function isBase64(text) {
	if (text.length % 4 !== 0) return false;
	if (/[^A-Za-z0-9+/=]/.test(text)) return false;
	const pad = text.indexOf("=");
	return pad === -1 || pad >= text.length - 2 && /^=+$/.test(text.slice(pad));
}
/** base64 inflates bytes by 4/3; allow one full batch plus JSON overhead. */
function bodyLimit(maxImageBytes) {
	return MAX_IMAGES_PER_REQUEST * Math.ceil(maxImageBytes * 1.4) + 4096;
}
async function serveImport(req, res, deps) {
	try {
		await handleImport(req, res, deps);
	} catch {
		if (!res.headersSent) jsonError(res, 500, "import-failed");
	}
}
async function handleImport(req, res, deps) {
	if (req.method !== "POST") return jsonError(res, 405, "method-not-allowed");
	if (!(req.headers["content-type"] ?? "").toLowerCase().startsWith("application/json")) return jsonError(res, 415, "json-required");
	const origin = req.headers.origin;
	const host = req.headers.host;
	if (origin !== void 0 && host !== void 0 && origin !== `http://${host}` && origin !== `https://${host}`) return jsonError(res, 403, "origin-rejected");
	let body;
	try {
		body = JSON.parse(await readBody(req, bodyLimit(deps.maxImageBytes)));
	} catch {
		return jsonError(res, 400, "invalid-request");
	}
	const images = typeof body === "object" && body !== null ? body.images : void 0;
	if (!Array.isArray(images) || images.length === 0 || images.length > MAX_IMAGES_PER_REQUEST) return jsonError(res, 400, "invalid-image-count");
	const saved = [];
	const failures = [];
	for (const [index, item] of images.entries()) {
		const record = typeof item === "object" && item !== null ? item : void 0;
		if (record === void 0 || typeof record.data !== "string" || typeof record.mediaType !== "string") {
			failures.push({
				index,
				error: "invalid-item"
			});
			continue;
		}
		if (!deps.mediaTypes.includes(record.mediaType)) {
			failures.push({
				index,
				error: `unsupported-media-type: ${record.mediaType}`
			});
			continue;
		}
		if (!isBase64(record.data)) {
			failures.push({
				index,
				error: "invalid-base64"
			});
			continue;
		}
		const bytes = Buffer.from(record.data, "base64");
		if (bytes.byteLength === 0 || bytes.byteLength > deps.maxImageBytes) {
			failures.push({
				index,
				error: `size-out-of-range (max ${String(deps.maxImageBytes)} bytes)`
			});
			continue;
		}
		try {
			const attachment = await deps.saveImage({
				data: bytes,
				mediaType: record.mediaType,
				...typeof record.name === "string" && record.name.length > 0 ? { name: record.name } : {}
			});
			saved.push({ attachment });
		} catch {
			failures.push({
				index,
				error: "save-failed"
			});
		}
	}
	res.writeHead(200, {
		"content-type": "application/json",
		"cache-control": "no-store"
	});
	res.end(JSON.stringify({
		images: saved,
		failures
	}));
}
async function readBody(req, maxBytes) {
	const chunks = [];
	let bytes = 0;
	for await (const chunk of req) {
		const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
		bytes += buffer.byteLength;
		if (bytes > maxBytes) throw new Error("request-too-large");
		chunks.push(buffer);
	}
	return Buffer.concat(chunks).toString("utf8");
}
function jsonError(res, status, code) {
	res.writeHead(status, {
		"content-type": "application/json",
		"cache-control": "no-store"
	});
	res.end(JSON.stringify({ error: code }));
}
//#endregion
//#region lib/types/reference-image.js
/** Latest-DSH compatibility boundary for resolving conversation image references. */
/**
* Resolve one or more edit references while keeping every DSH-specific detail
* behind this compatibility boundary. Explicit selectors preserve caller order;
* without selectors, all images in the newest image-bearing message are used.
*/
async function resolveReferenceImages(input) {
	const sourceAttachmentIds = mergeSelectors({
		single: input.sourceAttachmentId,
		multiple: input.sourceAttachmentIds,
		singleName: "source_attachment_id",
		multipleName: "source_attachment_ids",
		equal: attachmentIdsEqual
	});
	const sourcePaths = mergeSelectors({
		single: input.sourcePath,
		multiple: input.sourcePaths,
		singleName: "source_path",
		multipleName: "source_paths",
		equal: (left, right) => left.trim() === right.trim()
	});
	if (sourceAttachmentIds !== void 0 && sourcePaths !== void 0) throw new Error("edit_painting accepts only one of source_attachment_id, source_attachment_ids, source_path, or source_paths");
	if (sourcePaths !== void 0) return Promise.all(sourcePaths.map((sourcePath) => readWorkspaceReferenceImage({
		sourcePath,
		...input.agent?.session.header?.cwd === void 0 ? {} : { workspaceRoot: input.agent.session.header.cwd },
		...input.maxBytes === void 0 ? {} : { maxBytes: input.maxBytes },
		signal: input.signal
	})));
	if (input.agent === void 0) throw new Error("edit_painting requires an active DSH agent session to resolve a reference image");
	const refs = findReferenceImages(input.agent.session.deriveMessages(), sourceAttachmentIds);
	if (refs.length === 0) {
		if (sourceAttachmentIds !== void 0) throw new Error(`edit_painting could not find image attachment ${sourceAttachmentIds[0]} in the current conversation`);
		throw new Error("edit_painting requires an image in the current conversation; upload or generate an image first");
	}
	if (sourceAttachmentIds !== void 0 && refs.length !== sourceAttachmentIds.length) {
		const missing = sourceAttachmentIds.find((id) => !refs.some((ref) => attachmentIdsEqual(String(ref.attachmentId), id)));
		throw new Error(`edit_painting could not find image attachment ${missing ?? "unknown"} in the current conversation`);
	}
	return Promise.all(refs.map(async (ref) => {
		const stored = await input.attachments.readImage(ref, input.signal);
		if (input.maxBytes !== void 0 && stored.data.byteLength > input.maxBytes) throw new Error(`edit_painting source image is too large (${stored.data.byteLength} bytes; maximum ${input.maxBytes})`);
		return {
			data: stored.data,
			mediaType: stored.ref.mediaType
		};
	}));
}
/** Find images in caller order, or every image in the newest image-bearing message. */
function findReferenceImages(messages, sourceAttachmentIds) {
	if (sourceAttachmentIds !== void 0) return sourceAttachmentIds.flatMap((id) => {
		const ref = findReferenceImage(messages, id);
		return ref === void 0 ? [] : [ref];
	});
	const latestHumanMessage = [...messages].reverse().find((message) => message.source?.kind === "user");
	if (latestHumanMessage !== void 0) {
		const refs = collectInBlocks(latestHumanMessage.content);
		if (refs.length > 0) return refs;
	}
	for (let index = messages.length - 1; index >= 0; index -= 1) {
		const refs = collectInBlocks(messages[index]?.content ?? []);
		if (refs.length > 0) return refs;
	}
	return [];
}
/**
* Read an explicitly named workspace image without exposing filesystem or DSH
* details to provider adapters. Both lexical and real-path containment are
* enforced so absolute paths, parent traversal, and symlink escapes fail.
*/
async function readWorkspaceReferenceImage(input) {
	const requested = input.sourcePath.trim();
	if (requested.length === 0) throw new Error("edit_painting source_path must not be empty");
	if (input.workspaceRoot === void 0) throw new Error("edit_painting source_path requires an active DSH session workspace");
	const root = resolve(input.workspaceRoot);
	const candidate = isAbsolute(requested) ? resolve(requested) : resolve(root, requested);
	if (!containsPath$1(root, candidate)) throw new Error("edit_painting source_path must stay inside the session workspace: " + requested);
	let realRoot;
	let realCandidate;
	try {
		[realRoot, realCandidate] = await Promise.all([realpath(root), realpath(candidate)]);
	} catch (error) {
		if (error.code === "ENOENT") throw new Error("edit_painting could not find workspace image: " + requested);
		throw error;
	}
	if (!containsPath$1(realRoot, realCandidate)) throw new Error("edit_painting source_path resolves outside the session workspace: " + requested);
	const file = await stat(realCandidate);
	if (!file.isFile()) throw new Error("edit_painting source_path is not a file: " + requested);
	if (input.maxBytes !== void 0 && file.size > input.maxBytes) throw new Error("edit_painting source image is too large (" + file.size + " bytes; maximum " + input.maxBytes + ")");
	const data = await readFile(realCandidate, { signal: input.signal });
	const mediaType = detectImageMediaType(data);
	if (mediaType === void 0) throw new Error("edit_painting source_path is not a supported PNG, JPEG, WebP, or GIF image: " + requested);
	return {
		data: new Uint8Array(data),
		mediaType
	};
}
/** Find the newest matching image in the effective, replacement-aware history. */
function findReferenceImage(messages, sourceAttachmentId) {
	for (let index = messages.length - 1; index >= 0; index -= 1) {
		const found = findInBlocks(messages[index]?.content ?? [], sourceAttachmentId);
		if (found !== void 0) return found;
	}
}
/** Validate an untrusted serialized image reference at an HTTP/UI boundary. */
function parseImageAttachmentRef(value) {
	const ref = record$1(value);
	if (ref === void 0) return void 0;
	if (typeof ref.attachmentId !== "string" || !imageMediaType$4(ref.mediaType)) return void 0;
	if (!nonNegativeInteger(ref.bytes) || !positiveInteger(ref.width) || !positiveInteger(ref.height)) return void 0;
	if (ref.name !== void 0 && typeof ref.name !== "string") return void 0;
	const originalDimensions = ref.originalDimensions === void 0 ? void 0 : parseDimensions(ref.originalDimensions);
	if (ref.originalDimensions !== void 0 && originalDimensions === void 0) return void 0;
	return {
		attachmentId: ref.attachmentId,
		mediaType: ref.mediaType,
		bytes: ref.bytes,
		width: ref.width,
		height: ref.height,
		...typeof ref.name === "string" ? { name: ref.name } : {},
		...originalDimensions === void 0 ? {} : { originalDimensions }
	};
}
/**
* Newest matching image in one message's blocks. Tool results arrive in two
* shapes: 0.1.7 promotes them to first-class `role: 'tool'` messages (walked
* by the message-level callers below), while <=0.1.6 nests them as blocks with
* a `content` array inside a message. The 0.1.7 `ContentBlock` union declares
* no nested `content`, so recurse only when a block actually carries one.
*/
function findInBlocks(blocks, sourceAttachmentId) {
	for (let index = blocks.length - 1; index >= 0; index -= 1) {
		const block = blocks[index];
		if (block === void 0) continue;
		if (block.type === "image") {
			if (sourceAttachmentId === void 0 || attachmentIdsEqual(String(block.attachment.attachmentId), sourceAttachmentId)) return block.attachment;
			continue;
		}
		const nested = block.content;
		if (Array.isArray(nested)) {
			const found = findInBlocks(nested, sourceAttachmentId);
			if (found !== void 0) return found;
		}
	}
}
function parseDimensions(value) {
	const dimensions = record$1(value);
	if (dimensions === void 0 || !positiveInteger(dimensions.width) || !positiveInteger(dimensions.height)) return void 0;
	return {
		width: dimensions.width,
		height: dimensions.height
	};
}
function imageMediaType$4(value) {
	return value === "image/png" || value === "image/jpeg" || value === "image/webp" || value === "image/gif";
}
function collectInBlocks(blocks) {
	const refs = [];
	for (const block of blocks) {
		if (block.type === "image") refs.push(block.attachment);
		const nested = block.content;
		if (Array.isArray(nested)) refs.push(...collectInBlocks(nested));
	}
	return refs;
}
function attachmentIdsEqual(actual, requested) {
	if (actual === requested) return true;
	const actualDigest = sha256Digest(actual);
	const requestedDigest = sha256Digest(requested);
	return actualDigest !== void 0 && actualDigest === requestedDigest;
}
function sha256Digest(value) {
	return /^(?:sha256:)?([0-9a-f]{64})$/i.exec(value.trim())?.[1]?.toLowerCase();
}
function mergeSelectors(input) {
	if (input.multiple === void 0) return input.single === void 0 ? void 0 : [input.single];
	if (input.multiple.length === 0) {
		if (input.single !== void 0) return [input.single];
		throw new Error(`edit_painting ${input.multipleName} must not be empty`);
	}
	const single = input.single;
	if (single !== void 0 && !input.multiple.some((value) => input.equal(single, value))) throw new Error(`edit_painting ${input.singleName} must also appear in ${input.multipleName} when both are provided`);
	return input.multiple;
}
function detectImageMediaType(data) {
	if (startsWith(data, [
		137,
		80,
		78,
		71,
		13,
		10,
		26,
		10
	])) return "image/png";
	if (startsWith(data, [
		255,
		216,
		255
	])) return "image/jpeg";
	if (ascii(data, 0, 6) === "GIF87a" || ascii(data, 0, 6) === "GIF89a") return "image/gif";
	if (ascii(data, 0, 4) === "RIFF" && ascii(data, 8, 4) === "WEBP") return "image/webp";
}
function startsWith(data, signature) {
	return signature.every((byte, index) => data[index] === byte);
}
function ascii(data, offset, length) {
	return String.fromCharCode(...data.subarray(offset, offset + length));
}
function containsPath$1(parent, child) {
	const rel = relative(parent, child);
	return rel === "" || rel !== ".." && !rel.startsWith(".." + sep) && !isAbsolute(rel);
}
function positiveInteger(value) {
	return typeof value === "number" && Number.isInteger(value) && value > 0;
}
function nonNegativeInteger(value) {
	return typeof value === "number" && Number.isInteger(value) && value >= 0;
}
function record$1(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value) ? value : void 0;
}
//#endregion
//#region lib/types/route-util.js
var RouteError = class extends Error {
	status;
	constructor(status, message) {
		super(message);
		this.status = status;
	}
};
/** localhost, [::1] or any 127/8 address — the loopback set of DSH's own `/api` fence. */
function isLoopbackHostname(hostname) {
	if (hostname === "localhost" || hostname === "[::1]") return true;
	const parts = hostname.split(".");
	return parts.length === 4 && parts[0] === "127" && parts.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255);
}
/**
* Browser-trust fence modeled on DSH's `isTrustedApiRequest`: the Host must
* be loopback (defeats DNS rebinding), `Sec-Fetch-Site: cross-site` is
* refused, and an attached Origin must name the same host.
*/
function assertSameOrigin(req) {
	const host = req.headers.host;
	let hostUrl;
	try {
		hostUrl = host === void 0 ? void 0 : new URL(`http://${host}`);
	} catch {
		hostUrl = void 0;
	}
	if (hostUrl === void 0 || !isLoopbackHostname(hostUrl.hostname)) throw new RouteError(403, "host-rejected");
	if (req.headers["sec-fetch-site"] === "cross-site") throw new RouteError(403, "cross-site");
	const origin = req.headers.origin;
	if (origin === void 0) return;
	let originHost;
	try {
		originHost = new URL(origin).host;
	} catch {
		originHost = void 0;
	}
	if (originHost !== hostUrl.host) throw new RouteError(403, "origin-rejected");
}
async function readJsonBody(req, maxBytes) {
	if (!(req.headers["content-type"] ?? "").toLowerCase().startsWith("application/json")) throw new RouteError(415, "json-required");
	const chunks = [];
	let bytes = 0;
	for await (const chunk of req) {
		const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
		bytes += buffer.byteLength;
		if (bytes > maxBytes) throw new RouteError(413, "body-too-large");
		chunks.push(buffer);
	}
	let value;
	try {
		value = JSON.parse(Buffer.concat(chunks).toString("utf8"));
	} catch {
		throw new RouteError(400, "invalid-json");
	}
	if (typeof value !== "object" || value === null || Array.isArray(value)) throw new RouteError(400, "invalid-request");
	return value;
}
function sendJson(res, status, value) {
	if (res.headersSent) {
		res.end();
		return;
	}
	const body = JSON.stringify(value);
	res.writeHead(status, {
		"content-type": "application/json; charset=utf-8",
		"cache-control": "no-store",
		"x-content-type-options": "nosniff"
	});
	res.end(body);
}
/**
* Wrap a JSON handler: method gate, origin check, error mapping. Handler
* errors become `{ error }` with their status (RouteError) or 500.
*/
function jsonRoute(methods, handler) {
	return async (req, res) => {
		try {
			if (!methods.includes(req.method ?? "GET")) throw new RouteError(405, "method-not-allowed");
			assertSameOrigin(req);
			const value = await handler(req, res);
			if (!res.writableEnded) sendJson(res, 200, value ?? { ok: true });
		} catch (error) {
			sendJson(res, error instanceof RouteError ? error.status : 500, { error: error instanceof Error ? error.message : String(error) });
		}
	};
}
/** Abort signal that fires when the browser disconnects before the answer. */
function requestSignal(req, res) {
	const controller = new AbortController();
	const abort = () => {
		if (!res.writableEnded) controller.abort(/* @__PURE__ */ new Error("client disconnected"));
	};
	req.once("aborted", abort);
	res.once("close", abort);
	return controller.signal;
}
function str(value) {
	return typeof value === "string" ? value : void 0;
}
function stringArray(value) {
	return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
}
//#endregion
//#region lib/types/jobs.js
/**
* Image jobs: every Agent generation gets a job id the model can embed in its
* reply as `![caption](genimg:<id>)`. A renderer (dsh-better-display) polls
* the job route and swaps its placeholder for the image once the job is done,
* so a background job may finish after the reply itself.
*/
/** Markdown image scheme of the cross-plugin contract: `![alt](genimg:<job id>)`. */
const GENIMG_SCHEME = "genimg:";
const JOB_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
/** Finished jobs kept in memory; older ones are answered from the gallery. */
const MAX_FINISHED = 200;
function isJobId(value) {
	return JOB_ID.test(value);
}
/** Ratio the placeholder should reserve before the provider answers. */
function expectedRatio(args) {
	const size = parseSize(args.size);
	if (size !== void 0) return size;
	const [w, h] = (args.aspect_ratio ?? "").split(":").map(Number);
	return w !== void 0 && h !== void 0 && w > 0 && h > 0 ? {
		width: w,
		height: h
	} : {
		width: 1,
		height: 1
	};
}
var JobRegistry = class {
	gallery;
	jobs = /* @__PURE__ */ new Map();
	disposed = false;
	/** True after {@link dispose}: jobs failing now were stopped, not broken. */
	get stopped() {
		return this.disposed;
	}
	constructor(gallery) {
		this.gallery = gallery;
	}
	/** Register a pending job; `run` starts it. */
	create(ratio) {
		const job = {
			id: randomUUID(),
			status: "pending",
			width: ratio.width,
			height: ratio.height
		};
		this.jobs.set(job.id, job);
		return publicStatus(job);
	}
	/**
	* Run the work under the job's own abort controller (never the tool call's
	* signal: a background job outlives its call; a blocking caller passes that
	* signal as `parent`). Settles the job; rejects with
	* the work's error so a blocking caller can report it.
	*/
	async run(id, work, parent) {
		const job = this.jobs.get(id);
		if (job === void 0) throw new Error(`unknown image job ${id}`);
		const controller = new AbortController();
		job.controller = controller;
		if (this.disposed) controller.abort(/* @__PURE__ */ new Error("image generation plugin stopped"));
		const abort = () => controller.abort(parent?.reason);
		if (parent?.aborted === true) abort();
		parent?.addEventListener("abort", abort, { once: true });
		try {
			const value = await work(controller.signal);
			Object.assign(job, {
				status: "done",
				attachment: value.attachment,
				width: value.attachment.width,
				height: value.attachment.height,
				...value.path === void 0 ? {} : { path: value.path }
			});
			return value;
		} catch (error) {
			Object.assign(job, {
				status: "failed",
				error: error instanceof Error ? error.message : String(error)
			});
			throw error;
		} finally {
			parent?.removeEventListener("abort", abort);
			delete job.controller;
			this.prune();
		}
	}
	/** Current status; finished jobs no longer in memory come from the gallery. */
	async status(id) {
		const job = this.jobs.get(id);
		if (job !== void 0) return {
			...publicStatus(job),
			...job.attachment === void 0 ? {} : { attachment: job.attachment }
		};
		const item = await this.gallery.findByJobId(id);
		if (item === void 0) return void 0;
		const path = item.savedTo ?? item.filePath;
		return {
			id,
			status: "done",
			width: item.attachment.width,
			height: item.attachment.height,
			attachment: item.attachment,
			...path === void 0 ? {} : { path }
		};
	}
	/** Abort running jobs (plugin unload); they settle as failed. */
	dispose() {
		this.disposed = true;
		for (const job of this.jobs.values()) job.controller?.abort(/* @__PURE__ */ new Error("image generation plugin stopped"));
	}
	prune() {
		const finished = [...this.jobs.values()].filter((job) => job.status !== "pending");
		for (const job of finished.slice(0, Math.max(0, finished.length - MAX_FINISHED))) this.jobs.delete(job.id);
	}
};
function publicStatus(job) {
	return {
		id: job.id,
		status: job.status,
		width: job.width,
		height: job.height,
		...job.error === void 0 ? {} : { error: job.error },
		...job.path === void 0 ? {} : { path: job.path }
	};
}
/**
* Prefix route under `/jobs`: `GET <base>/<id>` → status JSON,
* `GET <base>/<id>/image` → image bytes once done. Unknown ids (e.g. a pending
* job lost to a restart) answer `failed`, so a placeholder never spins forever.
*/
function jobsRoute(services, jobs, base) {
	return async (req, res) => {
		if (req.method !== "GET") return sendJson(res, 405, { error: "method-not-allowed" });
		if (req.headers["sec-fetch-site"] === "cross-site") return sendJson(res, 403, { error: "cross-site" });
		const path = new URL(req.url ?? "/", "http://local").pathname;
		const match = /^\/([^/]+)(\/image)?\/?$/.exec(path.startsWith(base) ? path.slice(base.length) : "");
		const id = match?.[1];
		if (id === void 0 || !isJobId(id)) return sendJson(res, 404, { error: "unknown-job" });
		const status = await jobs.status(id).catch(() => void 0);
		if (match?.[2] === void 0) {
			if (status === void 0) return sendJson(res, 200, {
				id,
				status: "failed",
				width: 1,
				height: 1,
				error: "expired"
			});
			const { attachment: _attachment, ...body } = status;
			return sendJson(res, 200, body);
		}
		const ref = parseImageAttachmentRef(status?.attachment);
		if (ref === void 0) return sendJson(res, status?.status === "pending" ? 409 : 404, { error: status?.status === "pending" ? "pending" : "image-unavailable" });
		try {
			const stored = await services.attachments.readImage(ref);
			res.writeHead(200, {
				"content-type": stored.ref.mediaType,
				"content-length": String(stored.data.byteLength),
				"cache-control": "private, max-age=31536000, immutable",
				"x-content-type-options": "nosniff"
			});
			res.end(stored.data);
		} catch {
			sendJson(res, 404, { error: "image-unavailable" });
		}
	};
}
//#endregion
//#region lib/types/system-proxy.js
/**
* Detect the OS / environment proxy (the “系统代理（自动检测）” mode).
*
* Order: environment variables → Windows Internet Settings (registry) →
* macOS `scutil --proxy` → GNOME `gsettings`. Results are cached for 30 s.
* Ported from dsh-free-search, extended with SOCKS and bypass lists.
*/
const defaultRunner = (file, args) => new Promise((resolve) => {
	execFile(file, args, {
		timeout: 3e3,
		windowsHide: true
	}, (error, stdout) => resolve(error ? "" : String(stdout)));
});
const ENV_NAMES = [
	"HTTPS_PROXY",
	"https_proxy",
	"HTTP_PROXY",
	"http_proxy",
	"ALL_PROXY",
	"all_proxy"
];
const CACHE_MS = 3e4;
/** Add a scheme to bare `host:port`; keep explicit http/https/socks schemes. */
function normalizeProxyAddress(raw, defaultScheme = "http") {
	const value = raw.trim();
	if (value.length === 0) return void 0;
	const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(value) ? value : `${defaultScheme}://${value}`;
	try {
		const url = new URL(withScheme);
		if (![
			"http:",
			"https:",
			"socks:",
			"socks4:",
			"socks5:",
			"socks5h:"
		].includes(url.protocol) || url.hostname.length === 0) return void 0;
		return withScheme.replace(/\/+$/, "");
	} catch {
		return;
	}
}
/** Pick from Windows `ProxyServer`: `host:port` or `http=..;https=..;socks=..`. */
function pickWindowsProxy(server) {
	const value = server.trim();
	if (value.length === 0) return void 0;
	if (!value.includes("=")) return normalizeProxyAddress(value);
	const parts = Object.fromEntries(value.split(";").map((part) => part.split("=").map((piece) => piece.trim())).filter((pair) => pair.length === 2 && pair[1].length > 0).map(([key, address]) => [key.toLowerCase(), address]));
	if (parts.https !== void 0) return normalizeProxyAddress(parts.https);
	if (parts.http !== void 0) return normalizeProxyAddress(parts.http);
	if (parts.socks !== void 0) return normalizeProxyAddress(parts.socks, "socks5");
}
/** Windows `ProxyOverride` → no-proxy patterns (`<local>` = dotless hosts, kept as-is). */
function parseProxyOverride(value) {
	return value.split(";").map((item) => item.trim()).filter((item) => item.length > 0);
}
async function detectFromEnv(env) {
	for (const name of ENV_NAMES) {
		const raw = env[name];
		if (raw === void 0 || raw.trim().length === 0) continue;
		const url = normalizeProxyAddress(raw);
		if (url === void 0) continue;
		const noProxy = env.NO_PROXY ?? env.no_proxy ?? "";
		return {
			url,
			source: `环境变量 ${name}`,
			bypass: noProxy.split(/[,\s]+/).filter((item) => item.length > 0)
		};
	}
	return null;
}
async function detectWindows(run) {
	const out = await run("reg", ["query", "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings"]);
	if (!/ProxyEnable\s+REG_DWORD\s+0x0*1\b/i.test(out)) return null;
	const url = pickWindowsProxy(/ProxyServer\s+REG_SZ\s+(.+)/i.exec(out)?.[1] ?? "");
	if (url === void 0) return null;
	return {
		url,
		source: "Windows 系统代理",
		bypass: parseProxyOverride(/ProxyOverride\s+REG_SZ\s+(.+)/i.exec(out)?.[1] ?? "")
	};
}
async function detectMac(run) {
	const out = await run("scutil", ["--proxy"]);
	const field = (key) => new RegExp(`\\b${key}\\s*:\\s*(\\S+)`).exec(out)?.[1];
	const bypass = [...out.matchAll(/^\s*\d+\s*:\s*(\S+)\s*$/gm)].map((match) => match[1]).filter((item) => !/^\d+$/.test(item));
	for (const [kind, scheme] of [
		["HTTPS", "http"],
		["HTTP", "http"],
		["SOCKS", "socks5"]
	]) if (field(`${kind}Enable`) === "1" && field(`${kind}Proxy`) !== void 0) {
		const url = normalizeProxyAddress(`${field(`${kind}Proxy`)}:${field(`${kind}Port`) ?? "80"}`, scheme);
		if (url !== void 0) return {
			url,
			source: "macOS 系统代理",
			bypass
		};
	}
	return null;
}
async function detectGnome(run) {
	if ((await run("gsettings", [
		"get",
		"org.gnome.system.proxy",
		"mode"
	])).trim() !== "'manual'") return null;
	const read = async (schema, key) => (await run("gsettings", [
		"get",
		`org.gnome.system.proxy.${schema}`,
		key
	])).trim().replace(/^'|'$/g, "");
	for (const [schema, scheme] of [
		["https", "http"],
		["http", "http"],
		["socks", "socks5"]
	]) {
		const host = await read(schema, "host");
		const port = await read(schema, "port");
		if (host.length > 0 && port !== "0" && port.length > 0) {
			const url = normalizeProxyAddress(`${host}:${port}`, scheme);
			if (url !== void 0) return {
				url,
				source: "GNOME 系统代理",
				bypass: []
			};
		}
	}
	return null;
}
let cache;
/** Detect the system proxy; `refresh` skips the 30 s cache. */
async function detectSystemProxy(options = {}) {
	const injected = options.env !== void 0 || options.platform !== void 0 || options.run !== void 0;
	if (!injected && options.refresh !== true && cache !== void 0 && Date.now() - cache.at < CACHE_MS) return cache.value;
	const env = options.env ?? process.env;
	const platform = options.platform ?? process.platform;
	const run = options.run ?? defaultRunner;
	let found = await detectFromEnv(env);
	if (found === null && platform === "win32") found = await detectWindows(run);
	if (found === null && platform === "darwin") found = await detectMac(run);
	if (found === null && platform === "linux") found = await detectGnome(run);
	if (!injected) cache = {
		at: Date.now(),
		value: found
	};
	return found;
}
/** Drop the cache (tests, settings changes). */
function resetSystemProxyCache() {
	cache = void 0;
}
//#endregion
//#region lib/types/http.js
/**
* Proxy-aware fetch for provider requests.
*
* Every provider call goes through {@link providerFetch}, which resolves the
* effective proxy for that provider (its own override, else the plugin-wide
* proxy) and hands undici a matching dispatcher. Only this plugin's image
* traffic is affected; the rest of DSH keeps its own networking.
*/
/** The proxy a request should use, or `undefined` for a direct connection. */
/** Error text when the system proxy is selected but nothing was detected. */
const SYSTEM_PROXY_MISSING = "已选择「系统代理」但未检测到系统代理：请在系统设置里开启代理（或设置 HTTPS_PROXY），或改用自定义代理地址";
/** Global mode, tolerating settings objects from before `mode` existed. */
function globalMode(global) {
	return global.mode ?? (global.enabled ? "custom" : "off");
}
/** Whether resolving this provider's route needs the detected system proxy. */
function needsSystemProxy(proxy, global) {
	const mode = proxy?.mode ?? "inherit";
	return mode === "system" || mode === "inherit" && globalMode(global) === "system";
}
/**
* The proxy a request should use, or `undefined` for a direct connection.
* `system` is the detected OS proxy; required (else this throws) when the
* provider or the inherited global mode is `system`.
*/
function resolveProxyUrl(target, proxy, global, system) {
	const mode = proxy?.mode ?? "inherit";
	if (mode === "direct") return void 0;
	if (mode === "custom") {
		const url = proxy?.url?.trim() ?? "";
		return url.length > 0 ? url : void 0;
	}
	if (needsSystemProxy(proxy, global)) {
		if (system === void 0 || system === null) throw new Error(SYSTEM_PROXY_MISSING);
		if (bypassesProxy(target, [...system.bypass, ...global.noProxy])) return void 0;
		return system.url;
	}
	if (globalMode(global) !== "custom") return void 0;
	const url = global.url.trim();
	if (url.length === 0) return void 0;
	if (bypassesProxy(target, global.noProxy)) return void 0;
	return url;
}
/** Whether a target host matches one of the no-proxy patterns. */
function bypassesProxy(target, patterns) {
	let host;
	try {
		host = new URL(target).hostname.toLowerCase().replace(/^\[|\]$/g, "");
	} catch {
		return false;
	}
	for (const raw of patterns) {
		const pattern = raw.trim().toLowerCase();
		if (pattern.length === 0) continue;
		if (pattern === "*") return true;
		if (pattern === "<local>") {
			if (!host.includes(".") && !host.includes(":")) return true;
			continue;
		}
		if (pattern.includes("*") && !pattern.startsWith("*.")) {
			if (new RegExp(`^${pattern.split("*").map((part) => part.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join(".*")}$`).test(host)) return true;
			continue;
		}
		if (pattern.startsWith("*.")) {
			const suffix = pattern.slice(1);
			if (host.endsWith(suffix) || host === pattern.slice(2)) return true;
			continue;
		}
		if (pattern.startsWith(".")) {
			if (host.endsWith(pattern) || host === pattern.slice(1)) return true;
			continue;
		}
		if (host === pattern) return true;
	}
	return false;
}
/** Validate a proxy URL; returns an error message or `undefined` when usable. */
function validateProxyUrl(raw) {
	let url;
	try {
		url = new URL(raw.trim());
	} catch {
		return "代理地址不是合法的 URL";
	}
	if (![
		"http:",
		"https:",
		"socks:",
		"socks5:",
		"socks5h:",
		"socks4:"
	].includes(url.protocol)) return "代理协议仅支持 http、https、socks5、socks5h、socks4";
	if (url.hostname.length === 0) return "代理地址缺少主机名";
}
const require = createRequire(import.meta.url);
let undiciModule;
const undici = () => undiciModule ??= require("undici");
let socksModule;
const socks = () => socksModule ??= require("socks");
const dispatchers = /* @__PURE__ */ new Map();
/** One cached dispatcher per proxy URL. */
function dispatcherFor(proxyUrl) {
	const cached = dispatchers.get(proxyUrl);
	if (cached !== void 0) return cached;
	const problem = validateProxyUrl(proxyUrl);
	if (problem !== void 0) throw new Error(problem);
	const url = new URL(proxyUrl);
	const dispatcher = url.protocol.startsWith("socks") ? socksAgent(url) : new (undici()).ProxyAgent(proxyUrl);
	dispatchers.set(proxyUrl, dispatcher);
	return dispatcher;
}
/** Drop cached dispatchers (after settings change). */
function resetDispatchers() {
	for (const dispatcher of dispatchers.values()) dispatcher.close().catch(() => {});
	dispatchers.clear();
}
function socksAgent(proxy) {
	const type = proxy.protocol === "socks4:" ? 4 : 5;
	const user = decodeURIComponent(proxy.username);
	const password = decodeURIComponent(proxy.password);
	const { SocksClient } = socks();
	return new (undici()).Agent({ connect(options, callback) {
		const host = options.hostname;
		const port = Number(options.port) || (options.protocol === "https:" ? 443 : 80);
		SocksClient.createConnection({
			proxy: {
				host: proxy.hostname,
				port: Number(proxy.port) || 1080,
				type,
				...user.length > 0 ? { userId: user } : {},
				...password.length > 0 ? { password } : {}
			},
			command: "connect",
			destination: {
				host,
				port
			}
		}).then(({ socket }) => {
			if (options.protocol !== "https:") {
				callback(null, socket);
				return;
			}
			const secure = connect({
				socket,
				servername: options.servername ?? host,
				ALPNProtocols: ["http/1.1"]
			});
			secure.once("secureConnect", () => callback(null, secure));
			secure.once("error", (error) => callback(error, null));
		}, (error) => callback(error instanceof Error ? error : new Error(String(error)), null));
	} });
}
/**
* Build the fetch one provider's requests go through. Direct requests use the
* runtime's global fetch; proxied requests use undici's fetch with the proxy
* dispatcher (the global fetch may embed a different undici build).
*/
function providerFetch(proxy, global) {
	return async (url, init) => {
		const proxyUrl = resolveProxyUrl(url, proxy, global, needsSystemProxy(proxy, global) ? await detectSystemProxy() : void 0);
		if (proxyUrl === void 0) return fetch(url, init);
		const dispatcher = dispatcherFor(proxyUrl);
		let request = init ?? {};
		if (request.body instanceof FormData) {
			const encoded = new Response(request.body);
			const headers = new Headers(request.headers);
			headers.set("content-type", encoded.headers.get("content-type") ?? "multipart/form-data");
			request = {
				...request,
				headers,
				body: new Uint8Array(await encoded.arrayBuffer())
			};
		}
		const headers = request.headers === void 0 ? void 0 : Object.fromEntries(new Headers(request.headers).entries());
		const { fetch: undiciFetch } = undici();
		return await undiciFetch(url, {
			...request,
			...headers === void 0 ? {} : { headers },
			dispatcher
		});
	};
}
//#endregion
//#region lib/types/download.js
/** Read a response body, failing once it exceeds `maxBytes`. */
async function readBoundedBytes$2(response, maxBytes) {
	if (response.body === null) return /* @__PURE__ */ new Uint8Array();
	const reader = response.body.getReader();
	const chunks = [];
	let bytes = 0;
	try {
		for (;;) {
			const next = await reader.read();
			if (next.done) break;
			bytes += next.value.byteLength;
			if (bytes > maxBytes) throw new Error(`Image response exceeded the ${String(maxBytes)} byte limit`);
			chunks.push(next.value);
		}
	} finally {
		reader.releaseLock();
	}
	const joined = new Uint8Array(bytes);
	let offset = 0;
	for (const chunk of chunks) {
		joined.set(chunk, offset);
		offset += chunk.byteLength;
	}
	return joined;
}
async function readBoundedText$3(response, maxBytes) {
	return new TextDecoder().decode(await readBoundedBytes$2(response, maxBytes));
}
function imageMediaType$3(value) {
	const mediaType = value?.split(";", 1)[0]?.trim().toLowerCase();
	return mediaType === "image/png" || mediaType === "image/jpeg" || mediaType === "image/webp" || mediaType === "image/gif" ? mediaType : void 0;
}
function toDataUrl$3(image) {
	return `data:${image.mediaType};base64,${Buffer.from(image.data).toString("base64")}`;
}
/** Download (or decode a data URL of) one generated image. */
async function downloadImage$2(url, options) {
	if (url.startsWith("data:")) {
		const match = /^data:([^;,]+);base64,(.*)$/s.exec(url.trim());
		if (match?.[2] === void 0) throw new Error(`${options.label} returned an invalid data URL`);
		const data = new Uint8Array(Buffer.from(match[2].replace(/\s+/g, ""), "base64"));
		if (data.byteLength === 0) throw new Error(`${options.label} returned empty image data`);
		if (data.byteLength > options.maxBytes) throw new Error(`${options.label} exceeded the ${String(options.maxBytes)} byte image limit`);
		const mediaType = detectImageMediaType(data) ?? imageMediaType$3(match[1]);
		if (mediaType === void 0) throw new Error(`${options.label} returned an unsupported image type`);
		return {
			data,
			mediaType
		};
	}
	const response = await options.fetch(url, {
		redirect: "follow",
		signal: options.signal
	});
	if (!response.ok) throw new Error(`${options.label} image download failed (${String(response.status)})`);
	const data = await readBoundedBytes$2(response, options.maxBytes);
	const mediaType = detectImageMediaType(data) ?? imageMediaType$3(response.headers.get("content-type"));
	if (mediaType === void 0) throw new Error(`${options.label} image download returned an unsupported content type`);
	return {
		data,
		mediaType
	};
}
/**
* Add a default API version segment when the base URL has no path at all.
* Official ModelScope samples use `https://api-inference.modelscope.cn/` and
* append `v1/...` themselves, so users paste the bare host; the image routes
* live under `/v1`. A base that already carries a path is left untouched.
*/
function ensureVersionedBase(baseURL, version = "/v1") {
	try {
		const url = new URL(baseURL);
		if (url.pathname === "" || url.pathname === "/") {
			url.pathname = version;
			return url.toString().replace(/\/$/, "");
		}
		return baseURL;
	} catch {
		return baseURL;
	}
}
/** Join a base URL and a relative path without dropping the base path. */
function joinURL(baseURL, path) {
	try {
		return new URL(path, baseURL.endsWith("/") ? baseURL : `${baseURL}/`).toString();
	} catch {
		throw new Error("Provider base URL must be an absolute URL");
	}
}
/** Sleep that rejects as soon as the signal aborts. */
function abortableDelay(ms, signal) {
	return new Promise((resolve, reject) => {
		if (signal.aborted) {
			reject(signal.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error("aborted"));
			return;
		}
		const timer = setTimeout(() => {
			signal.removeEventListener("abort", onAbort);
			resolve();
		}, ms);
		const onAbort = () => {
			clearTimeout(timer);
			reject(signal.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error("aborted"));
		};
		signal.addEventListener("abort", onAbort, { once: true });
	});
}
//#endregion
//#region lib/types/image-files.js
/**
* Readable image copies on disk and “show in file manager”.
*
* DSH's attachment store names objects by content hash without extensions,
* which is useless in a file manager. Every gallery image therefore also
* gets a copy under one folder (default `<dataDir>/images`, configurable):
* `<dir>/<YYYY-MM>/<YYYYMMDD-HHmmss>-<prompt-slug>-<digest8>.<ext>`.
*/
const EXTENSIONS = {
	"image/png": "png",
	"image/jpeg": "jpg",
	"image/webp": "webp",
	"image/gif": "gif"
};
/** The folder image copies go to. */
function resolveImageDir(configured, dataDir) {
	const value = configured?.trim() ?? "";
	return value.length > 0 && isAbsolute(value) ? value : join(dataDir, "images");
}
/** File-system-safe short slug of a prompt (keeps CJK letters). */
function promptSlug(prompt, max = 32) {
	const slug = prompt.normalize("NFKC").replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "").slice(0, max).replace(/-+$/g, "");
	return slug.length > 0 ? slug : "image";
}
function pad(value) {
	return String(value).padStart(2, "0");
}
/** Relative path of the copy for one image. */
function copyName(attachment, prompt, createdAt) {
	const date = new Date(createdAt);
	const month = `${String(date.getFullYear())}-${pad(date.getMonth() + 1)}`;
	const stamp = `${String(date.getFullYear())}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
	const digest = attachment.attachmentId.replace(/^sha256:/, "").slice(0, 8) || "img";
	return join(month, `${stamp}-${promptSlug(prompt)}-${digest}.${EXTENSIONS[attachment.mediaType]}`);
}
/** Write the copy; returns its absolute path. */
async function writeImageCopy(dir, attachment, data, prompt, createdAt = Date.now()) {
	const target = join(dir, copyName(attachment, prompt, createdAt));
	await mkdir(dirname(target), { recursive: true });
	await writeFile(target, data);
	return target;
}
/** Whether `child` lies inside `parent`. */
function isInside(parent, child) {
	const rel = relative(resolve(parent), resolve(child));
	return rel.length > 0 && !rel.startsWith("..") && !isAbsolute(rel) && !rel.split(sep).includes("..");
}
async function fileExists(path) {
	try {
		return (await stat(path)).isFile();
	} catch {
		return false;
	}
}
/** Delete a copy, but only one living inside the images folder. */
async function removeImageCopy(dir, path) {
	if (path === void 0 || !isInside(dir, path)) return;
	await unlink(path).catch(() => {});
}
const defaultLauncher = (command, args, options) => {
	const child = spawn(command, args, {
		detached: true,
		stdio: "ignore",
		...options
	});
	child.on("error", () => {});
	child.unref();
};
/** Select one file in Explorer / Finder; other platforms open its folder. */
function revealInFileManager(path, launch = defaultLauncher, platform = process.platform) {
	if (platform === "win32") launch("explorer.exe", [`/select,"${path}"`], { windowsVerbatimArguments: true });
	else if (platform === "darwin") launch("open", ["-R", path], {});
	else launch("xdg-open", [dirname(path)], {});
}
/** Open a folder in the OS file manager (created first if missing). */
async function openFolder(dir, launch = defaultLauncher, platform = process.platform) {
	await mkdir(dir, { recursive: true });
	if (platform === "win32") launch("explorer.exe", [`"${dir}"`], { windowsVerbatimArguments: true });
	else if (platform === "darwin") launch("open", [dir], {});
	else launch("xdg-open", [dir], {});
}
//#endregion
//#region lib/types/redact.js
/**
* Redact secret-shaped content from provider error messages.
*
* Error bodies from providers and relays surface in the conversation and in
* the settings UI. A relay may echo request headers — including the API key —
* inside its error body, so every adapter passes response text through here
* before embedding it in a thrown error, and also passes the live key so its
* exact value cannot survive even in non-standard formats.
*/
const REDACTED = "[REDACTED]";
const KEY_SHAPED_PATTERNS = [
	/\bsk-[A-Za-z0-9_-]{8,}/g,
	/\bAIza[A-Za-z0-9_-]{10,}/g,
	/\bBearer\s+[A-Za-z0-9._~+/=-]{8,}/gi,
	/\b(?:api[_-]?key|apikey|token|secret)["']?\s*[:=]\s*["']?[A-Za-z0-9._~+/=-]{8,}/gi,
	/\b(?:api[_-]?key|apikey|token|secret)\s*["'][A-Za-z0-9._~+/=-]{8,}["']/gi
];
/** Replace every occurrence of a known secret plus key-shaped values. */
function redactSecrets(text, ...secrets) {
	let redacted = text;
	for (const secret of secrets) if (secret !== void 0 && secret.length >= 8) redacted = redacted.split(secret).join(REDACTED);
	for (const pattern of KEY_SHAPED_PATTERNS) redacted = redacted.replace(pattern, REDACTED);
	return redacted;
}
const DETAIL_LIMIT = 600;
function textOf(value) {
	return typeof value === "string" && value.trim().length > 0 ? value.trim() : void 0;
}
/** `message (code)` from the common provider error shapes, or undefined. */
function jsonErrorSummary(value) {
	if (typeof value !== "object" || value === null) return void 0;
	const body = value;
	const nested = typeof body.error === "object" && body.error !== null ? body.error : void 0;
	const first = Array.isArray(body.errors) && typeof body.errors[0] === "object" && body.errors[0] !== null ? body.errors[0] : void 0;
	const source = nested ?? first ?? body;
	const message = textOf(source.message) ?? textOf(body.error) ?? textOf(body.message) ?? textOf(body.msg) ?? textOf(body.detail);
	if (message === void 0) return void 0;
	const code = textOf(source.code) ?? textOf(source.status) ?? textOf(source.type) ?? textOf(body.code);
	return code === void 0 || message.includes(code) ? message : `${message} (${code})`;
}
/**
* Readable, redacted detail for a failed provider response: the message (and
* code) of a JSON error body, otherwise the text with whitespace collapsed.
* Kept short: it is shown to the user and fed back to the model.
*/
function providerErrorDetail(text, ...secrets) {
	let parsed;
	try {
		parsed = JSON.parse(text);
	} catch {
		parsed = void 0;
	}
	const redacted = redactSecrets(jsonErrorSummary(parsed) ?? text.replace(/\s+/g, " ").trim(), ...secrets);
	return redacted.length > DETAIL_LIMIT ? `${redacted.slice(0, DETAIL_LIMIT)}…` : redacted;
}
//#endregion
//#region lib/types/dashscope.js
async function generateDashScopeImage(options) {
	assertQwenImageModel(options.model);
	const formattedSize = formatSize(options.size);
	return requestQwenImage({
		...options,
		requestBody: {
			model: options.model,
			input: { messages: [{
				role: "user",
				content: [{ text: options.prompt }]
			}] },
			parameters: { ...formattedSize === void 0 ? {} : { size: formattedSize } }
		},
		operation: "generation"
	});
}
async function editDashScopeImage(options) {
	if (options.sourceImages.length > 3) throw new Error(`DashScope image editing supports at most 3 reference images; this selection resolved ${options.sourceImages.length}. Select fewer images or choose a provider that supports more references. No images were omitted.`);
	assertQwenImageModel(options.model);
	const formattedSize = formatSize(options.size);
	return requestQwenImage({
		...options,
		requestBody: {
			model: options.model,
			input: { messages: [{
				role: "user",
				content: [...options.sourceImages.map((sourceImage) => ({ image: toDataUrl$2(sourceImage) })), { text: options.prompt }]
			}] },
			parameters: {
				prompt_extend: true,
				...formattedSize === void 0 ? {} : { size: formattedSize }
			}
		},
		operation: "editing"
	});
}
function assertQwenImageModel(model) {
	if (!model.toLowerCase().startsWith("qwen-image")) throw new Error(`Unsupported DashScope image model ${model}. Configure a qwen-image model.`);
}
function formatSize(size) {
	if (size === void 0 || size.length === 0) return void 0;
	return size.replace("x", "*");
}
function toDataUrl$2(image) {
	return `data:${image.mediaType};base64,${Buffer.from(image.data).toString("base64")}`;
}
async function requestQwenImage(options) {
	const base = options.endpoint.replace(/\/+$/, "");
	const response = await (options.fetch ?? fetch)(`${base}/services/aigc/multimodal-generation/generation`, {
		method: "POST",
		...options.signal ? { signal: options.signal } : {},
		headers: {
			"content-type": "application/json",
			authorization: `Bearer ${options.apiKey}`
		},
		body: JSON.stringify(options.requestBody)
	});
	if (!response.ok) {
		const errorText = providerErrorDetail(await response.text(), options.apiKey);
		throw new Error(`DashScope image ${options.operation} failed (${String(response.status)}): ${errorText}`);
	}
	const payload = await response.json();
	const imageUrl = extractImageUrl(payload);
	if (imageUrl === void 0) throw new Error(`DashScope image ${options.operation} returned no image URL: ${redactSecrets(payload.message ?? JSON.stringify(payload), options.apiKey)}`);
	return downloadImageBlob(imageUrl, options);
}
function extractImageUrl(response) {
	const contents = response.output?.choices?.[0]?.message?.content;
	if (!Array.isArray(contents)) return void 0;
	for (const item of contents) {
		if (item.image !== void 0 && item.image.length > 0) return item.image;
		if (item.image_url !== void 0 && item.image_url.length > 0) return item.image_url;
		if (item.url !== void 0 && item.url.length > 0) return item.url;
	}
}
async function downloadImageBlob(imageUrl, options) {
	const imageResponse = await (options.fetch ?? fetch)(imageUrl, { ...options.signal ? { signal: options.signal } : {} });
	if (!imageResponse.ok) throw new Error(`Failed to fetch DashScope image from URL (${String(imageResponse.status)})`);
	const buffer = await imageResponse.arrayBuffer();
	if (buffer.byteLength > options.maxBytes) throw new Error(`DashScope generated image (${String(buffer.byteLength)} bytes) exceeds the ${String(options.maxBytes)} byte limit`);
	const data = new Uint8Array(buffer);
	const mediaType = detectImageMediaType(data) ?? imageMediaType$2(imageResponse.headers.get("content-type"));
	if (mediaType === void 0) throw new Error(`DashScope image download returned an unsupported content type: ${imageResponse.headers.get("content-type") ?? "none"}`);
	return {
		data,
		mediaType
	};
}
function imageMediaType$2(value) {
	const mediaType = value?.split(";", 1)[0]?.trim().toLowerCase();
	return mediaType === "image/png" || mediaType === "image/jpeg" || mediaType === "image/webp" || mediaType === "image/gif" ? mediaType : void 0;
}
//#endregion
//#region lib/types/google.js
const ERROR_LIMIT$4 = 4096;
const REQUESTED_MEDIA_TYPE = "image/jpeg";
/** Send one native Google text-to-image request. */
function generateGoogleImage(input) {
	return requestGoogleImage({
		...input,
		operation: "generation",
		interactionInput: input.prompt
	});
}
/** Send one native Google image-editing request using already-resolved bytes. */
function editGoogleImage(input) {
	const interactionInput = input.sourceImages.length === 1 ? [{
		type: "image",
		mime_type: input.sourceImages[0].mediaType,
		data: Buffer.from(input.sourceImages[0].data).toString("base64")
	}, {
		type: "text",
		text: input.prompt
	}] : [...input.sourceImages.flatMap((sourceImage, index) => [{
		type: "text",
		text: `图 ${index + 1} (Image ${index + 1}):`
	}, {
		type: "image",
		mime_type: sourceImage.mediaType,
		data: Buffer.from(sourceImage.data).toString("base64")
	}]), {
		type: "text",
		text: input.prompt
	}];
	return requestGoogleImage({
		...input,
		operation: "editing",
		interactionInput
	});
}
/** Shared Google request, response parsing, decoding, and size enforcement. */
async function requestGoogleImage(input) {
	const label = `Google image ${input.operation}`;
	const response = await (input.fetch ?? fetch)(input.endpoint, {
		method: "POST",
		redirect: "error",
		signal: input.signal,
		headers: {
			"content-type": "application/json",
			"x-goog-api-key": input.apiKey
		},
		body: JSON.stringify({
			model: input.model,
			input: input.interactionInput,
			response_format: {
				type: "image",
				mime_type: REQUESTED_MEDIA_TYPE,
				aspect_ratio: input.aspectRatio,
				image_size: input.imageSize
			}
		})
	});
	const text = await readBoundedText$2(response, Math.ceil(input.maxBytes * 1.4) + ERROR_LIMIT$4, label);
	if (!response.ok) throw new Error(`${label} failed (${response.status}): ${providerErrorDetail(text, input.apiKey)}`);
	let payload;
	try {
		payload = JSON.parse(text);
	} catch {
		throw new Error(`${label} returned invalid JSON`);
	}
	const image = outputImage(payload);
	if (image === void 0) throw new Error(`${label} returned no image: ${redactSecrets(text, input.apiKey).slice(0, ERROR_LIMIT$4)}`);
	const data = decodeBase64$2(image.data, label);
	if (data.byteLength > input.maxBytes) throw new Error(`${label} exceeded the ${String(input.maxBytes)} byte image limit`);
	const mediaType = detectImageMediaType(data) ?? mediaTypeOf(image.mime_type ?? REQUESTED_MEDIA_TYPE);
	if (mediaType === void 0) throw new Error(`${label} returned unsupported media type ${JSON.stringify(image.mime_type)}`);
	return {
		data,
		mediaType
	};
}
function outputImage(value) {
	const interaction = record(value);
	if (interaction === void 0) return void 0;
	const direct = imageContent(interaction.output_image, false);
	if (direct !== void 0) return direct;
	if (!Array.isArray(interaction.steps)) return void 0;
	for (const step of interaction.steps) {
		const modelOutput = record(step);
		if (modelOutput?.type !== "model_output" || !Array.isArray(modelOutput.content)) continue;
		for (const content of modelOutput.content) {
			const image = imageContent(content, true);
			if (image !== void 0) return image;
		}
	}
}
function imageContent(value, requiresImageType) {
	const image = record(value);
	if (image === void 0 || requiresImageType && image.type !== "image" || typeof image.data !== "string") return void 0;
	return {
		data: image.data,
		mime_type: image.mime_type
	};
}
function record(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value) ? value : void 0;
}
function mediaTypeOf(value) {
	return value === "image/png" || value === "image/jpeg" || value === "image/webp" || value === "image/gif" ? value : void 0;
}
function decodeBase64$2(data, label) {
	const clean = data.replace(/\s+/g, "");
	if (clean.length === 0) throw new Error(`${label} returned invalid base64 image data`);
	const decoded = Buffer.from(clean, "base64");
	if (decoded.length === 0) throw new Error(`${label} returned invalid base64 image data`);
	return new Uint8Array(decoded);
}
async function readBoundedText$2(response, maxBytes, label) {
	if (response.body === null) return "";
	const reader = response.body.getReader();
	const chunks = [];
	let bytes = 0;
	try {
		for (;;) {
			const next = await reader.read();
			if (next.done) break;
			bytes += next.value.byteLength;
			if (bytes > maxBytes) throw new Error(`${label} response exceeded the ${String(maxBytes)} byte limit`);
			chunks.push(next.value);
		}
	} finally {
		reader.releaseLock();
	}
	const joined = new Uint8Array(bytes);
	let offset = 0;
	for (const chunk of chunks) {
		joined.set(chunk, offset);
		offset += chunk.byteLength;
	}
	return new TextDecoder().decode(joined);
}
//#endregion
//#region lib/types/modelscope.js
const ERROR_LIMIT$3 = 4096;
const RESPONSE_LIMIT$1 = 1048576;
/** Generate (or edit, when `sourceImages` is non-empty) one image. */
async function generateModelScopeImage(input) {
	const doFetch = input.fetch ?? fetch;
	const label = "ModelScope";
	const headers = {
		authorization: `Bearer ${input.apiKey}`,
		"content-type": "application/json",
		"x-modelscope-async-mode": "true"
	};
	const references = (input.sourceImages ?? []).map(toDataUrl$3);
	const base = ensureVersionedBase(input.baseURL);
	const submitURL = joinURL(base, "images/generations");
	const submit = await doFetch(submitURL, {
		method: "POST",
		redirect: "error",
		signal: input.signal,
		headers,
		body: JSON.stringify({
			model: input.model,
			prompt: input.prompt,
			...input.size === void 0 || input.size.length === 0 ? {} : { size: input.size },
			...input.negativePrompt === void 0 || input.negativePrompt.length === 0 ? {} : { negative_prompt: input.negativePrompt },
			...input.seed === void 0 ? {} : { seed: input.seed },
			...references.length === 0 ? {} : { image_url: references }
		})
	});
	const submitText = await readBoundedText$3(submit, RESPONSE_LIMIT$1);
	if (!submit.ok) throw new Error(`${label} image request failed (${String(submit.status)}) POST ${submitURL}: ${providerErrorDetail(submitText, input.apiKey)}`);
	const submitted = parseJson(submitText, label);
	const direct = imageUrlOf(submitted);
	if (direct !== void 0) return downloadImage$2(direct, {
		fetch: doFetch,
		maxBytes: input.maxBytes,
		signal: input.signal,
		label
	});
	const taskId = typeof submitted.task_id === "string" ? submitted.task_id : void 0;
	if (taskId === void 0) throw new Error(`${label} image request returned no task id: ${redactSecrets(submitText, input.apiKey).slice(0, ERROR_LIMIT$3)}`);
	const deadline = Date.now() + (input.timeoutMs ?? 3e5);
	const interval = input.pollIntervalMs ?? 3e3;
	const taskURL = joinURL(base, `tasks/${encodeURIComponent(taskId)}`);
	for (;;) {
		await abortableDelay(interval, input.signal);
		const poll = await doFetch(taskURL, {
			method: "GET",
			redirect: "error",
			signal: input.signal,
			headers: {
				authorization: `Bearer ${input.apiKey}`,
				"x-modelscope-task-type": "image_generation"
			}
		});
		const pollText = await readBoundedText$3(poll, RESPONSE_LIMIT$1);
		if (!poll.ok) throw new Error(`${label} task query failed (${String(poll.status)}) GET ${taskURL}: ${providerErrorDetail(pollText, input.apiKey)}`);
		const task = parseJson(pollText, label);
		const status = typeof task.task_status === "string" ? task.task_status.toUpperCase() : "";
		if (status === "SUCCEED" || status === "SUCCEEDED") {
			const url = imageUrlOf(task);
			if (url === void 0) throw new Error(`${label} task succeeded without an image`);
			return downloadImage$2(url, {
				fetch: doFetch,
				maxBytes: input.maxBytes,
				signal: input.signal,
				label
			});
		}
		if (status === "FAILED" || status === "CANCELED" || status === "CANCELLED") throw new Error(`${label} task ${status.toLowerCase()}: ${redactSecrets(JSON.stringify(task.errors ?? task.message ?? task), input.apiKey).slice(0, ERROR_LIMIT$3)}`);
		if (Date.now() > deadline) throw new Error(`${label} task ${taskId} did not finish in time`);
	}
}
function parseJson(text, label) {
	let value;
	try {
		value = JSON.parse(text);
	} catch {
		throw new Error(`${label} returned invalid JSON`);
	}
	if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error(`${label} returned an unexpected payload`);
	return value;
}
function imageUrlOf(payload) {
	const outputs = payload.output_images;
	if (Array.isArray(outputs) && typeof outputs[0] === "string" && outputs[0].length > 0) return outputs[0];
	const first = (Array.isArray(payload.images) ? payload.images : Array.isArray(payload.data) ? payload.data : void 0)?.[0];
	if (typeof first === "object" && first !== null) {
		const record = first;
		if (typeof record.url === "string" && record.url.length > 0) return record.url;
		if (typeof record.b64_json === "string" && record.b64_json.length > 0) return `data:image/png;base64,${record.b64_json}`;
	}
}
//#endregion
//#region lib/types/openai-compatible.js
const ERROR_LIMIT$2 = 4096;
async function generateOpenAICompatibleImage(input) {
	return parseImageResponse(await (input.fetch ?? fetch)(imageEndpoint$1(input.baseURL, "generations"), {
		method: "POST",
		redirect: "error",
		signal: input.signal,
		headers: {
			authorization: `Bearer ${input.apiKey}`,
			"content-type": "application/json"
		},
		body: JSON.stringify({
			model: input.model,
			prompt: input.prompt,
			...input.size === void 0 ? {} : { size: input.size },
			...input.quality === void 0 ? {} : { quality: input.quality },
			...input.provider === "seedream" ? {
				response_format: "url",
				...arkOutputBody(input.arkOptions, { background: false })
			} : {},
			...input.extraBody ?? {}
		})
	}), input.provider, input);
}
async function editOpenAICompatibleImage(input) {
	if (input.editFormat === "xaiJson") {
		const references = input.sourceImages.map((image) => ({
			type: "image_url",
			url: toDataUrl$1(image)
		}));
		return parseImageResponse(await (input.fetch ?? fetch)(imageEndpoint$1(input.baseURL, "edits"), {
			method: "POST",
			redirect: "error",
			signal: input.signal,
			headers: {
				authorization: `Bearer ${input.apiKey}`,
				"content-type": "application/json"
			},
			body: JSON.stringify({
				model: input.model,
				prompt: input.prompt,
				...references.length === 1 ? { image: references[0] } : { images: references },
				...input.quality === void 0 ? {} : { quality: input.quality },
				...input.extraBody ?? {}
			})
		}), "xai", input);
	}
	if (input.editFormat === "jsonImageUrlArray") {
		const body = {
			model: input.model,
			images: input.sourceImages.map((sourceImage) => ({ image_url: toDataUrl$1(sourceImage) })),
			prompt: input.prompt,
			n: 1,
			size: "auto",
			response_format: "url",
			...input.quality === void 0 ? {} : { quality: input.quality },
			...input.editExtra ?? {},
			...input.extraBody ?? {}
		};
		return parseImageResponse(await (input.fetch ?? fetch)(imageEndpoint$1(input.baseURL, "edits"), {
			method: "POST",
			redirect: "error",
			signal: input.signal,
			headers: {
				authorization: `Bearer ${input.apiKey}`,
				"content-type": "application/json"
			},
			body: JSON.stringify(body)
		}), "openai", input);
	}
	if (input.editFormat === "formReferenceImages") {
		const form = new FormData();
		form.append("model", input.model);
		form.append("prompt", input.prompt);
		if (input.size !== void 0 && input.size.length > 0) form.append("size", input.size);
		if (input.quality !== void 0) form.append("quality", input.quality);
		for (const [key, value] of Object.entries(input.extraBody ?? {})) form.append(key, String(value));
		form.append("response_format", "b64_json");
		form.append("reference_images", JSON.stringify(input.sourceImages.map((sourceImage) => Buffer.from(sourceImage.data).toString("base64"))));
		return parseImageResponse(await (input.fetch ?? fetch)(imageEndpoint$1(input.baseURL, "edits"), {
			method: "POST",
			redirect: "error",
			signal: input.signal,
			headers: { authorization: `Bearer ${input.apiKey}` },
			body: form
		}), "openai", input);
	}
	const form = new FormData();
	const imageField = input.sourceImages.length > 1 ? "image[]" : "image";
	input.sourceImages.forEach((sourceImage, index) => {
		const uploadBytes = new Uint8Array(sourceImage.data);
		const blob = new Blob([uploadBytes], { type: sourceImage.mediaType });
		const filename = `reference-${index + 1}.${extensionOf(sourceImage.mediaType)}`;
		form.append(imageField, blob, filename);
	});
	form.append("prompt", input.prompt);
	form.append("model", input.model);
	if (input.size !== void 0 && input.size.length > 0) form.append("size", input.size);
	if (input.quality !== void 0) form.append("quality", input.quality);
	for (const [key, value] of Object.entries(input.extraBody ?? {})) form.append(key, String(value));
	return parseImageResponse(await (input.fetch ?? fetch)(imageEndpoint$1(input.baseURL, "edits"), {
		method: "POST",
		redirect: "error",
		signal: input.signal,
		headers: { authorization: `Bearer ${input.apiKey}` },
		body: form
	}), "openai", input);
}
async function parseImageResponse(response, provider, input) {
	const text = await readBoundedText$1(response, Math.ceil(input.maxBytes * 1.4) + ERROR_LIMIT$2);
	if (!response.ok) throw new Error(`${provider} image request failed (${response.status}): ${providerErrorDetail(text, input.apiKey)}`);
	let payload;
	try {
		payload = JSON.parse(text);
	} catch {
		throw new Error(`${provider} image request returned invalid JSON`);
	}
	const image = firstImage$1(payload);
	if (image === void 0) throw new Error(`${provider} image request returned no image: ${redactSecrets(text, input.apiKey).slice(0, ERROR_LIMIT$2)}`);
	if (image.b64_json !== void 0) {
		const data = decodeBase64$1(image.b64_json, provider);
		return {
			data,
			mediaType: detectImageMediaType(data) ?? imageMediaType$1(image.mime_type) ?? "image/png"
		};
	}
	return downloadImage$1(image.url, provider, input);
}
function imageEndpoint$1(baseURL, operation) {
	try {
		return new URL(`images/${operation}`, baseURL.endsWith("/") ? baseURL : `${baseURL}/`).toString();
	} catch {
		throw new Error("Image endpoint must be an absolute URL");
	}
}
function toDataUrl$1(image) {
	return `data:${image.mediaType};base64,${Buffer.from(image.data).toString("base64")}`;
}
function firstImage$1(value) {
	if (typeof value !== "object" || value === null || Array.isArray(value)) return void 0;
	const record = value;
	const data = Array.isArray(record.data) ? record.data : Array.isArray(record.images) ? record.images : Array.isArray(record.output) ? record.output : void 0;
	if (data === void 0 || data.length === 0) return void 0;
	const candidate = data[0];
	if (typeof candidate !== "object" || candidate === null || Array.isArray(candidate)) return void 0;
	const item = candidate;
	const mime = typeof item.mime_type === "string" ? item.mime_type : typeof item.mime === "string" ? item.mime : void 0;
	return typeof item.b64_json === "string" && item.b64_json.length > 0 ? {
		b64_json: item.b64_json,
		...mime === void 0 ? {} : { mime_type: mime }
	} : typeof item.url === "string" && item.url.length > 0 ? {
		url: item.url,
		...mime === void 0 ? {} : { mime_type: mime }
	} : void 0;
}
async function downloadImage$1(url, provider, input) {
	if (url === void 0) throw new Error(`${provider} image request returned no image data`);
	if (url.startsWith("data:")) {
		const parsed = parseDataUrl(url);
		if (parsed === void 0) throw new Error(`${provider} image request returned invalid data URL`);
		const data = decodeBase64$1(parsed.base64, provider);
		return {
			data,
			mediaType: detectImageMediaType(data) ?? imageMediaType$1(parsed.mediaType) ?? "image/png"
		};
	}
	let response = await (input.fetch ?? fetch)(url, {
		redirect: "follow",
		signal: input.signal,
		...input.apiKey === void 0 ? {} : { headers: { authorization: `Bearer ${input.apiKey}` } }
	});
	if (!response.ok && input.apiKey !== void 0) response = await (input.fetch ?? fetch)(url, {
		redirect: "follow",
		signal: input.signal
	});
	if (!response.ok) throw new Error(`${provider} image download failed (${response.status})`);
	const data = await readBoundedBytes$1(response, input.maxBytes);
	const mediaType = detectImageMediaType(data) ?? imageMediaType$1(response.headers.get("content-type"));
	if (mediaType === void 0) throw new Error(`${provider} image download returned unsupported content type`);
	return {
		data,
		mediaType
	};
}
function parseDataUrl(value) {
	const match = /^data:([^;,]+);base64,(.*)$/s.exec(value.trim());
	return match?.[1] !== void 0 && match[2] !== void 0 ? {
		mediaType: match[1],
		base64: match[2]
	} : void 0;
}
function extensionOf(mediaType) {
	switch (mediaType) {
		case "image/jpeg": return "jpg";
		case "image/webp": return "webp";
		case "image/gif": return "gif";
		case "image/png": return "png";
	}
}
function decodeBase64$1(value, provider) {
	const clean = (parseDataUrl(value)?.base64 ?? value).replace(/\s+/g, "");
	if (clean.length === 0) throw new Error(`${provider} image request returned invalid base64 image data`);
	const decoded = Buffer.from(clean, "base64");
	if (decoded.length === 0) throw new Error(`${provider} image request returned invalid base64 image data`);
	return new Uint8Array(decoded);
}
function imageMediaType$1(value) {
	const mediaType = value?.split(";", 1)[0]?.trim().toLowerCase();
	return mediaType === "image/png" || mediaType === "image/jpeg" || mediaType === "image/webp" || mediaType === "image/gif" ? mediaType : void 0;
}
async function readBoundedText$1(response, maxBytes) {
	return new TextDecoder().decode(await readBoundedBytes$1(response, maxBytes));
}
async function readBoundedBytes$1(response, maxBytes) {
	if (response.body === null) return /* @__PURE__ */ new Uint8Array();
	const reader = response.body.getReader();
	const chunks = [];
	let bytes = 0;
	try {
		for (;;) {
			const next = await reader.read();
			if (next.done) break;
			bytes += next.value.byteLength;
			if (bytes > maxBytes) throw new Error(`Image response exceeded the ${String(maxBytes)} byte limit`);
			chunks.push(next.value);
		}
	} finally {
		reader.releaseLock();
	}
	const joined = new Uint8Array(bytes);
	let offset = 0;
	for (const chunk of chunks) {
		joined.set(chunk, offset);
		offset += chunk.byteLength;
	}
	return joined;
}
//#endregion
//#region lib/types/seedream.js
const ERROR_LIMIT$1 = 4096;
/** Edit one image through Ark ImageGenerations using a data-URL reference. */
async function editSeedreamImage(input) {
	const response = await (input.fetch ?? fetch)(imageEndpoint(input.baseURL), {
		method: "POST",
		redirect: "error",
		signal: input.signal,
		headers: {
			authorization: `Bearer ${input.apiKey}`,
			"content-type": "application/json"
		},
		body: JSON.stringify({
			model: input.model,
			prompt: input.prompt,
			image: input.sourceImages.map(toDataUrl),
			...input.size === void 0 || input.size.length === 0 ? {} : { size: input.size },
			...arkOutputBody(input.arkOptions),
			response_format: "b64_json"
		})
	});
	const text = await readBoundedText(response, Math.ceil(input.maxBytes * 1.4) + ERROR_LIMIT$1);
	if (!response.ok) throw new Error(`seedream image editing failed (${response.status}): ${providerErrorDetail(text, input.apiKey)}`);
	let payload;
	try {
		payload = JSON.parse(text);
	} catch {
		throw new Error("seedream image editing returned invalid JSON");
	}
	const image = firstImage(payload);
	if (image === void 0) throw new Error(`seedream image editing returned no image: ${redactSecrets(text, input.apiKey).slice(0, ERROR_LIMIT$1)}`);
	if (image.b64_json !== void 0) {
		const data = decodeBase64(image.b64_json);
		return {
			data,
			mediaType: detectImageMediaType(data) ?? imageMediaType(image.mime_type) ?? "image/png"
		};
	}
	return downloadImage(image.url, input);
}
function imageEndpoint(baseURL) {
	try {
		return new URL("images/generations", baseURL.endsWith("/") ? baseURL : `${baseURL}/`).toString();
	} catch {
		throw new Error("Seedream image endpoint must be an absolute URL");
	}
}
function toDataUrl(image) {
	return `data:${image.mediaType};base64,${Buffer.from(image.data).toString("base64")}`;
}
function firstImage(value) {
	if (typeof value !== "object" || value === null || Array.isArray(value)) return void 0;
	const record = value;
	const data = Array.isArray(record.data) ? record.data : Array.isArray(record.images) ? record.images : Array.isArray(record.output) ? record.output : void 0;
	if (data === void 0 || data.length === 0) return void 0;
	const candidate = data[0];
	if (typeof candidate !== "object" || candidate === null || Array.isArray(candidate)) return void 0;
	const item = candidate;
	const mime = typeof item.mime_type === "string" ? item.mime_type : typeof item.mime === "string" ? item.mime : void 0;
	return typeof item.b64_json === "string" && item.b64_json.length > 0 ? {
		b64_json: item.b64_json,
		...mime === void 0 ? {} : { mime_type: mime }
	} : typeof item.url === "string" && item.url.length > 0 ? {
		url: item.url,
		...mime === void 0 ? {} : { mime_type: mime }
	} : void 0;
}
async function downloadImage(url, input) {
	if (url === void 0) throw new Error("seedream image editing returned no image data");
	const response = await (input.fetch ?? fetch)(url, {
		redirect: "follow",
		signal: input.signal
	});
	if (!response.ok) throw new Error(`seedream image download failed (${response.status})`);
	const mediaType = imageMediaType(response.headers.get("content-type"));
	if (mediaType === void 0) throw new Error("seedream image download returned unsupported content type");
	return {
		data: await readBoundedBytes(response, input.maxBytes),
		mediaType
	};
}
function decodeBase64(value) {
	const clean = value.replace(/\s+/g, "");
	if (clean.length === 0) throw new Error("seedream image editing returned invalid base64 image data");
	const decoded = Buffer.from(clean, "base64");
	if (decoded.length === 0) throw new Error("seedream image editing returned invalid base64 image data");
	return new Uint8Array(decoded);
}
function imageMediaType(value) {
	const mediaType = value?.split(";", 1)[0]?.trim().toLowerCase();
	return mediaType === "image/png" || mediaType === "image/jpeg" || mediaType === "image/webp" || mediaType === "image/gif" ? mediaType : void 0;
}
async function readBoundedText(response, maxBytes) {
	return new TextDecoder().decode(await readBoundedBytes(response, maxBytes));
}
async function readBoundedBytes(response, maxBytes) {
	if (response.body === null) return /* @__PURE__ */ new Uint8Array();
	const reader = response.body.getReader();
	const chunks = [];
	let bytes = 0;
	try {
		for (;;) {
			const next = await reader.read();
			if (next.done) break;
			bytes += next.value.byteLength;
			if (bytes > maxBytes) throw new Error(`Image response exceeded the ${String(maxBytes)} byte limit`);
			chunks.push(next.value);
		}
	} finally {
		reader.releaseLock();
	}
	const joined = new Uint8Array(bytes);
	let offset = 0;
	for (const chunk of chunks) {
		joined.set(chunk, offset);
		offset += chunk.byteLength;
	}
	return joined;
}
//#endregion
//#region lib/types/siliconflow.js
const ERROR_LIMIT = 4096;
const RESPONSE_LIMIT = 1048576;
async function generateSiliconFlowImage(input) {
	const doFetch = input.fetch ?? fetch;
	const label = "SiliconFlow";
	const sources = input.sourceImages ?? [];
	if (sources.length > 1) throw new Error(`${label} accepts one reference image per request; got ${String(sources.length)}`);
	const endpoint = joinURL(ensureVersionedBase(input.baseURL), "images/generations");
	const response = await doFetch(endpoint, {
		method: "POST",
		redirect: "error",
		signal: input.signal,
		headers: {
			authorization: `Bearer ${input.apiKey}`,
			"content-type": "application/json"
		},
		body: JSON.stringify({
			model: input.model,
			prompt: input.prompt,
			batch_size: 1,
			...input.size === void 0 || input.size.length === 0 ? {} : { image_size: input.size },
			...input.negativePrompt === void 0 || input.negativePrompt.length === 0 ? {} : { negative_prompt: input.negativePrompt },
			...input.seed === void 0 ? {} : { seed: input.seed },
			...sources[0] === void 0 ? {} : { image: toDataUrl$3(sources[0]) }
		})
	});
	const text = await readBoundedText$3(response, RESPONSE_LIMIT);
	if (!response.ok) throw new Error(`${label} image request failed (${String(response.status)}) POST ${endpoint}: ${providerErrorDetail(text, input.apiKey)}`);
	let payload;
	try {
		payload = JSON.parse(text);
	} catch {
		throw new Error(`${label} returned invalid JSON`);
	}
	const record = typeof payload === "object" && payload !== null ? payload : {};
	const first = (Array.isArray(record.images) ? record.images : Array.isArray(record.data) ? record.data : [])[0];
	const url = typeof first?.url === "string" && first.url.length > 0 ? first.url : typeof first?.b64_json === "string" && first.b64_json.length > 0 ? `data:image/png;base64,${first.b64_json}` : void 0;
	if (url === void 0) throw new Error(`${label} returned no image: ${redactSecrets(text, input.apiKey).slice(0, ERROR_LIMIT)}`);
	return downloadImage$2(url, {
		fetch: doFetch,
		maxBytes: input.maxBytes,
		signal: input.signal,
		label
	});
}
//#endregion
//#region lib/types/xai-params.js
/** xAI's image routes use aspect_ratio/resolution rather than OpenAI's size. */
const RATIOS = /* @__PURE__ */ new Set([
	"auto",
	"1:1",
	"16:9",
	"9:16",
	"4:3",
	"3:4",
	"3:2",
	"2:3",
	"2:1",
	"1:2",
	"19.5:9",
	"9:19.5",
	"20:9",
	"9:20",
	"21:9",
	"5:2"
]);
function xaiToolParameters(options) {
	let ratio = options.aspectRatio;
	if (options.size !== void 0) {
		const match = /^(\d+)x(\d+)$/.exec(options.size);
		if (match === null) throw new Error("xAI size 请使用 WIDTHxHEIGHT；也可直接传 aspect_ratio");
		const width = Number(match[1]);
		const height = Number(match[2]);
		if (!Number.isSafeInteger(width) || !Number.isSafeInteger(height) || width <= 0 || height <= 0) throw new Error("xAI size 必须是正整数宽高");
		let divisor = width;
		let remainder = height;
		while (remainder !== 0) {
			const next = divisor % remainder;
			divisor = remainder;
			remainder = next;
		}
		const fromSize = `${String(width / divisor)}:${String(height / divisor)}`;
		if (ratio !== void 0 && ratio !== fromSize) throw new Error("xAI size 与 aspect_ratio 不一致");
		ratio = fromSize;
	}
	if (ratio !== void 0 && !RATIOS.has(ratio)) throw new Error(`xAI 不支持比例 ${ratio}`);
	const resolution = options.imageSize?.toLowerCase();
	if (resolution !== void 0 && resolution !== "1k" && resolution !== "2k") throw new Error(`xAI 不支持清晰度 ${options.imageSize}`);
	return {
		...ratio === void 0 || ratio === "auto" ? {} : { aspect_ratio: ratio },
		...resolution === void 0 ? {} : { resolution }
	};
}
//#endregion
//#region lib/types/generate.js
const SEEDREAM_2K = {
	"1:1": "2048x2048",
	"4:3": "2304x1728",
	"3:4": "1728x2304",
	"16:9": "2560x1440",
	"9:16": "1440x2560",
	"3:2": "2496x1664",
	"2:3": "1664x2496",
	"21:9": "3024x1296"
};
/** Seedream takes pixel sizes or a bare tier (`2K`, `4K`). */
function seedreamSize(aspectRatio, imageSize) {
	const tier = imageSize === "4K" ? "4K" : "2K";
	const base = aspectRatio === void 0 ? void 0 : SEEDREAM_2K[aspectRatio];
	if (base === void 0) return tier;
	if (tier === "2K") return base;
	const [w, h] = base.split("x").map(Number);
	return `${String(w * 2)}x${String(h * 2)}`;
}
async function runGeneration(input) {
	const { entry, apiKey, request, maxBytes, signal } = input;
	const doFetch = input.fetch ?? providerFetch(entry.proxy, input.globalProxy);
	const model = effectiveModel(entry, request.model);
	if (model.length === 0) throw new Error(`Image provider "${entry.name}" has no model; add one in Settings > Plugins > 图像生成.`);
	const sources = request.sourceImages ?? [];
	const caps = capabilitiesOf(entry);
	if (sources.length > 0) {
		if (caps.maxReferences === 0) throw new Error(`${entry.name} does not support image editing / reference images`);
		if (sources.length > caps.maxReferences) throw new Error(`${entry.name} accepts at most ${String(caps.maxReferences)} reference image(s); got ${String(sources.length)}`);
	}
	const sized = resolveSize(entry, request);
	const common = {
		apiKey,
		model,
		prompt: request.prompt,
		maxBytes,
		signal,
		fetch: doFetch
	};
	switch (entry.protocol) {
		case "gemini": {
			const aspectRatio = sized.aspectRatio ?? "1:1";
			const imageSize = sized.imageSize ?? "1K";
			const base = {
				...common,
				endpoint: entry.baseURL,
				aspectRatio,
				imageSize
			};
			return {
				...sources.length > 0 ? await editGoogleImage({
					...base,
					sourceImages: sources
				}) : await generateGoogleImage(base),
				model,
				output: `${aspectRatio}, ${imageSize}`
			};
		}
		case "xai": {
			const extraBody = xaiToolParameters({
				...sized.aspectRatio === void 0 ? {} : { aspectRatio: sized.aspectRatio },
				...sized.imageSize === void 0 ? {} : { imageSize: sized.imageSize },
				...sized.size === void 0 ? {} : { size: sized.size }
			});
			return {
				...sources.length > 0 ? await editOpenAICompatibleImage({
					...common,
					baseURL: entry.baseURL,
					sourceImages: sources,
					editFormat: "xaiJson",
					extraBody
				}) : await generateOpenAICompatibleImage({
					...common,
					provider: "xai",
					baseURL: entry.baseURL,
					extraBody
				}),
				model,
				output: [extraBody.aspect_ratio ?? "auto", extraBody.resolution].filter(Boolean).join(", ")
			};
		}
		case "seedream": {
			const size = sized.size ?? seedreamSize(sized.aspectRatio, sized.imageSize);
			const ark = entry.ark?.background === "transparent" ? {
				...entry.ark,
				outputFormat: "png"
			} : entry.ark;
			return {
				...sources.length > 0 ? await editSeedreamImage({
					...common,
					baseURL: entry.baseURL,
					sourceImages: sources,
					size,
					...ark === void 0 ? {} : { arkOptions: ark }
				}) : await generateOpenAICompatibleImage({
					...common,
					provider: "seedream",
					baseURL: entry.baseURL,
					size,
					...ark === void 0 ? {} : { arkOptions: ark }
				}),
				model,
				output: size
			};
		}
		case "dashscope": {
			const size = sized.size;
			const base = {
				...common,
				endpoint: entry.baseURL,
				...size === void 0 ? {} : { size }
			};
			return {
				...sources.length > 0 ? await editDashScopeImage({
					...base,
					sourceImages: sources
				}) : await generateDashScopeImage(base),
				model,
				output: size ?? "default"
			};
		}
		case "modelscope": return {
			...await generateModelScopeImage({
				...common,
				baseURL: entry.baseURL,
				size: sized.size,
				negativePrompt: request.negativePrompt,
				seed: request.seed,
				sourceImages: sources
			}),
			model,
			output: sized.size ?? "default"
		};
		case "siliconflow": return {
			...await generateSiliconFlowImage({
				...common,
				baseURL: entry.baseURL,
				size: sized.size,
				negativePrompt: request.negativePrompt,
				seed: request.seed,
				sourceImages: sources
			}),
			model,
			output: sized.size ?? "default"
		};
		case "openai":
		case "openai-compat":
		case "zhipu": {
			const size = sized.size;
			const quality = request.quality?.trim() || void 0;
			return {
				...sources.length > 0 ? await editOpenAICompatibleImage({
					...common,
					baseURL: entry.baseURL,
					sourceImages: sources,
					...size === void 0 ? {} : { size },
					...quality === void 0 ? {} : { quality },
					...entry.protocol === "openai-compat" && entry.compat?.editFormat !== void 0 ? { editFormat: entry.compat.editFormat } : {},
					...entry.protocol === "openai-compat" && entry.compat?.editExtra !== void 0 ? { editExtra: entry.compat.editExtra } : {}
				}) : await generateOpenAICompatibleImage({
					...common,
					provider: entry.protocol,
					baseURL: entry.baseURL,
					...size === void 0 ? {} : { size },
					...quality === void 0 ? {} : { quality }
				}),
				model,
				output: [size ?? "default", quality].filter(Boolean).join(", ")
			};
		}
	}
}
//#endregion
//#region lib/types/settings-store.js
/** Persisted plugin settings: providers, proxy and workspace saving. */
const PROVIDER_ID = /^[a-z0-9][a-z0-9-]{0,47}$/;
/** Coerce untrusted JSON (disk or browser) into valid settings. Unknown fields drop. */
function normalizeSettings(raw) {
	const base = defaultSettings();
	if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return base;
	const input = raw;
	const seen = /* @__PURE__ */ new Set();
	const providers = [];
	if (Array.isArray(input.providers)) for (const candidate of input.providers) {
		const entry = normalizeProvider(candidate);
		if (entry === void 0 || seen.has(entry.id)) continue;
		seen.add(entry.id);
		providers.push(entry);
	}
	for (const preset of PRESET_PROVIDERS) {
		const index = providers.findIndex((entry) => entry.id === preset.id);
		if (index === -1) providers.push(structuredClone(preset));
		else providers[index] = {
			...providers[index],
			preset: true
		};
	}
	const proxyRaw = typeof input.proxy === "object" && input.proxy !== null ? input.proxy : {};
	return {
		version: 1,
		providers,
		activeProvider: typeof input.activeProvider === "string" && providers.some((entry) => entry.id === input.activeProvider) ? input.activeProvider : base.activeProvider,
		proxy: {
			...globalProxyMode(proxyRaw),
			url: typeof proxyRaw.url === "string" ? proxyRaw.url.trim() : "",
			noProxy: Array.isArray(proxyRaw.noProxy) ? proxyRaw.noProxy.filter((item) => typeof item === "string").map((item) => item.trim()).filter((item) => item.length > 0) : base.proxy.noProxy
		},
		chatTools: typeof input.chatTools === "boolean" ? input.chatTools : base.chatTools,
		saveToWorkspace: typeof input.saveToWorkspace === "boolean" ? input.saveToWorkspace : base.saveToWorkspace,
		workspaceFolder: typeof input.workspaceFolder === "string" ? input.workspaceFolder.trim() : base.workspaceFolder,
		imageDir: typeof input.imageDir === "string" ? input.imageDir.trim() : base.imageDir
	};
}
function normalizeProvider(raw) {
	if (typeof raw !== "object" || raw === null) return void 0;
	const input = raw;
	const id = typeof input.id === "string" ? input.id.trim().toLowerCase() : "";
	if (!PROVIDER_ID.test(id)) return void 0;
	const protocol = typeof input.protocol === "string" && PROVIDER_PROTOCOLS.includes(input.protocol) ? input.protocol : void 0;
	if (protocol === void 0) return void 0;
	const preset = PRESET_PROVIDERS.find((entry) => entry.id === id);
	const effectiveProtocol = preset?.protocol ?? protocol;
	const models = Array.isArray(input.models) ? [...new Set(input.models.filter((item) => typeof item === "string").map((item) => item.trim()).filter((item) => item.length > 0))] : [];
	const proxyRaw = typeof input.proxy === "object" && input.proxy !== null ? input.proxy : {};
	const mode = proxyRaw.mode === "direct" || proxyRaw.mode === "custom" || proxyRaw.mode === "system" ? proxyRaw.mode : "inherit";
	const proxyUrl = typeof proxyRaw.url === "string" ? proxyRaw.url.trim() : "";
	const entry = {
		id,
		name: typeof input.name === "string" && input.name.trim().length > 0 ? input.name.trim().slice(0, 64) : preset?.name ?? id,
		protocol: effectiveProtocol,
		baseURL: typeof input.baseURL === "string" ? input.baseURL.trim() : preset?.baseURL ?? "",
		models,
		defaultModel: typeof input.defaultModel === "string" ? input.defaultModel.trim() : "",
		enabled: input.enabled !== false,
		proxy: mode === "custom" ? {
			mode,
			url: proxyUrl
		} : { mode }
	};
	const compat = normalizeCompat(input.compat);
	if (compat !== void 0 && effectiveProtocol === "openai-compat") entry.compat = compat;
	if (effectiveProtocol === "seedream" && typeof input.ark === "object" && input.ark !== null) {
		const ark = input.ark;
		entry.ark = {
			...ark.outputFormat === "png" || ark.outputFormat === "jpeg" ? { outputFormat: ark.outputFormat } : {},
			...typeof ark.watermark === "boolean" ? { watermark: ark.watermark } : {},
			...ark.background === "opaque" || ark.background === "transparent" ? { background: ark.background } : {}
		};
	}
	return entry;
}
function normalizeCompat(raw) {
	if (typeof raw !== "object" || raw === null) return void 0;
	const input = raw;
	const out = {};
	if (input.editFormat === "multipart" || input.editFormat === "jsonImageUrlArray" || input.editFormat === "formReferenceImages") out.editFormat = input.editFormat;
	if (typeof input.editExtra === "object" && input.editExtra !== null && !Array.isArray(input.editExtra)) out.editExtra = input.editExtra;
	if (typeof input.sizes === "object" && input.sizes !== null && !Array.isArray(input.sizes)) {
		const sizes = {};
		for (const [ratio, row] of Object.entries(input.sizes)) {
			if (typeof row !== "object" || row === null) continue;
			const tiers = {};
			for (const [tier, size] of Object.entries(row)) if (typeof size === "string" && size.trim().length > 0) tiers[tier] = size.trim();
			if (Object.keys(tiers).length > 0) sizes[ratio] = tiers;
		}
		out.sizes = sizes;
	}
	return out;
}
/**
* Global proxy mode with migration: settings from ≤0.1.2 only had
* `enabled` (+ url), which meant a custom proxy when on.
*/
function globalProxyMode(raw) {
	const mode = raw.mode === "off" || raw.mode === "system" || raw.mode === "custom" ? raw.mode : raw.enabled === true ? "custom" : "off";
	return {
		mode,
		enabled: mode !== "off"
	};
}
/** Validation problems that should block a save (shown in the settings UI). */
function validateSettings(settings) {
	const problems = [];
	if (settings.proxy.mode === "custom") {
		const problem = settings.proxy.url.length === 0 ? "已选择自定义代理但未填写代理地址" : validateProxyUrl(settings.proxy.url);
		if (problem !== void 0) problems.push(`全局代理：${problem}`);
	}
	for (const entry of settings.providers) {
		if (entry.proxy.mode === "custom") {
			const problem = (entry.proxy.url ?? "").length === 0 ? "选择了自定义代理但未填写地址" : validateProxyUrl(entry.proxy.url ?? "");
			if (problem !== void 0) problems.push(`${entry.name}：${problem}`);
		}
		if (entry.baseURL.length > 0) try {
			const url = new URL(entry.baseURL);
			if (url.protocol !== "http:" && url.protocol !== "https:") problems.push(`${entry.name}：端点必须是 http(s) 地址`);
		} catch {
			problems.push(`${entry.name}：端点不是合法的 URL`);
		}
	}
	if (settings.imageDir.length > 0 && !/^(?:[a-zA-Z]:[\\/]|\/|\\\\)/.test(settings.imageDir)) problems.push("图片保存目录必须是绝对路径");
	return problems;
}
/** Settings file owner. Reads are cached; writes are serialized and atomic. */
var SettingsStore = class {
	dir;
	cached;
	mutex = new Mutex();
	listeners = /* @__PURE__ */ new Set();
	constructor(dir) {
		this.dir = dir;
	}
	get path() {
		return join(this.dir, "settings.json");
	}
	async get() {
		if (this.cached !== void 0) return this.cached;
		this.cached = normalizeSettings(await readJson(this.path));
		return this.cached;
	}
	/** Replace settings with a normalized copy of `next`; throws on validation errors. */
	save(next) {
		return this.mutex.run(async () => {
			const settings = normalizeSettings(next);
			const problems = validateSettings(settings);
			if (problems.length > 0) throw new Error(problems.join("；"));
			await writeJson(this.path, settings);
			this.cached = settings;
			for (const listener of this.listeners) listener(settings);
			return settings;
		});
	}
	onChange(listener) {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	}
};
/** Look up one enabled provider, or throw an Agent-readable error. */
function requireProvider(settings, id) {
	const wanted = id?.trim() || settings.activeProvider;
	const entry = settings.providers.find((candidate) => candidate.id === wanted) ?? settings.providers.find((candidate) => candidate.name.toLowerCase() === wanted.toLowerCase());
	if (entry === void 0) {
		const known = settings.providers.filter((candidate) => candidate.enabled).map((candidate) => candidate.id).join(", ");
		throw new Error(`Unknown image provider "${wanted}". Configured providers: ${known}.`);
	}
	if (!entry.enabled) throw new Error(`Image provider "${entry.name}" is disabled in Settings > Plugins > 图像生成.`);
	if (entry.baseURL.length === 0) throw new Error(`Image provider "${entry.name}" has no endpoint; set its Base URL in Settings > Plugins > 图像生成.`);
	return entry;
}
//#endregion
//#region lib/types/services.js
/** Settings as the browser may see them: key presence instead of keys. */
async function settingsView(services) {
	const settings = await services.settings.get();
	const providers = await Promise.all(settings.providers.map(async (entry) => ({
		...entry,
		keyConfigured: await services.keys.get(entry.id).then((value) => value !== void 0, () => false)
	})));
	const limits = services.attachments.imageLimits;
	return {
		...settings,
		providers,
		effectiveImageDir: resolveImageDir(settings.imageDir, services.dataDir),
		imageLimits: {
			maxImageBytes: limits.maxImageBytes,
			...limits.maxImageDimension === void 0 ? {} : { maxImageDimension: limits.maxImageDimension },
			mediaTypes: [...limits.mediaTypes]
		}
	};
}
/** The folder image copies currently go to. */
async function imageDir(services) {
	return resolveImageDir((await services.settings.get()).imageDir, services.dataDir);
}
/**
* Write the readable copy for one gallery image. Never fails the caller:
* a disk problem just leaves the item without `filePath`.
*/
async function saveImageCopy(services, attachment, data, prompt) {
	try {
		return await writeImageCopy(await imageDir(services), attachment, data, prompt);
	} catch {
		return;
	}
}
async function requireKey(services, entry) {
	const key = await services.keys.get(entry.id);
	if (key === void 0) throw new Error(`${entry.name} 尚未配置 API Key，请到 设置 > 插件 > 图像生成 填写。(${entry.name} has no API key; set it in Settings > Plugins > Image generation.)`);
	return key;
}
function toAttachmentJson(ref) {
	return {
		attachmentId: String(ref.attachmentId),
		mediaType: ref.mediaType,
		bytes: ref.bytes,
		width: ref.width,
		height: ref.height,
		...ref.name === void 0 ? {} : { name: ref.name },
		...ref.originalDimensions === void 0 ? {} : { originalDimensions: {
			width: ref.originalDimensions.width,
			height: ref.originalDimensions.height
		} }
	};
}
/** Generate one image with a provider and persist it as an attachment. */
async function generateAndStore(services, providerId, request, signal) {
	const settings = await services.settings.get();
	const entry = requireProvider(settings, providerId);
	const result = await runGeneration({
		entry,
		apiKey: await requireKey(services, entry),
		globalProxy: settings.proxy,
		request,
		maxBytes: services.attachments.imageLimits.maxImageBytes,
		signal,
		...services.fetch === void 0 ? {} : { fetch: services.fetch }
	});
	if (!services.attachments.imageLimits.mediaTypes.includes(result.mediaType)) throw new Error(`This DSH deployment does not accept ${result.mediaType} images`);
	return {
		entry,
		result,
		attachment: await services.attachments.saveImage({
			data: result.data,
			mediaType: result.mediaType,
			name: "generated-image"
		})
	};
}
//#endregion
//#region lib/types/routes.js
/** Same-origin JSON routes backing the paintings page, gallery and settings. */
const SMALL_BODY = 262144;
const PROXY_PROBE_URL = "https://www.gstatic.com/generate_204";
/** `GET ?ref=<json>` → image bytes. Cross-site embeds are refused. */
function imageRoute(services) {
	return async (req, res) => {
		if (req.method !== "GET" && req.method !== "POST") return sendJson(res, 405, { error: "method-not-allowed" });
		if (req.headers["sec-fetch-site"] === "cross-site") return sendJson(res, 403, { error: "cross-site" });
		let raw;
		try {
			if (req.method === "GET") {
				const param = new URL(req.url ?? "/", "http://local").searchParams.get("ref");
				raw = param === null ? void 0 : JSON.parse(param);
			} else raw = (await readJsonBody(req, SMALL_BODY)).attachment;
		} catch {
			return sendJson(res, 400, { error: "invalid-request" });
		}
		const ref = parseImageAttachmentRef(raw);
		if (ref === void 0) return sendJson(res, 400, { error: "invalid-attachment" });
		try {
			const stored = await services.attachments.readImage(ref);
			res.writeHead(200, {
				"content-type": stored.ref.mediaType,
				"content-length": String(stored.data.byteLength),
				"cache-control": "private, max-age=31536000, immutable",
				"x-content-type-options": "nosniff"
			});
			res.end(stored.data);
		} catch {
			sendJson(res, 404, { error: "image-unavailable" });
		}
	};
}
/** GET → settings view; POST `{ settings }` → save, answer the new view. */
function settingsRoute(services) {
	return jsonRoute(["GET", "POST"], async (req) => {
		if (req.method === "POST") {
			const body = await readJsonBody(req, SMALL_BODY);
			const previous = await services.settings.get();
			const next = normalizeSettings(body.settings);
			const problems = validateSettings(next);
			if (problems.length > 0) throw new RouteError(400, problems.join("；"));
			for (const entry of next.providers) {
				if (sameEndpoint(previous.providers.find((candidate) => candidate.id === entry.id), entry)) continue;
				if (await services.keys.get(entry.id) === void 0) continue;
				await services.keys.unset(entry.id);
				if (await services.keys.get(entry.id) !== void 0) throw new RouteError(500, `${entry.name}：端点已改动，但旧 API Key 清除失败，设置未保存`);
			}
			try {
				await services.settings.save(body.settings);
			} catch (error) {
				throw new RouteError(400, error instanceof Error ? error.message : String(error));
			}
			resetDispatchers();
			resetSystemProxyCache();
		}
		return settingsView(services);
	});
}
/** POST `{ providerId, key }`; a blank/null key clears it. */
function keyRoute(services) {
	return jsonRoute(["POST"], async (req) => {
		const body = await readJsonBody(req, SMALL_BODY);
		const providerId = str(body.providerId)?.trim() ?? "";
		if (!(await services.settings.get()).providers.some((entry) => entry.id === providerId)) throw new RouteError(404, "unknown-provider");
		const key = str(body.key)?.trim() ?? "";
		if (key.length === 0) await services.keys.unset(providerId);
		else await services.keys.set(providerId, key);
		return {
			ok: true,
			keyConfigured: key.length > 0
		};
	});
}
/** Where a protocol lists its models (also the connection probe). */
function modelsURL(entry) {
	try {
		if (entry.protocol === "gemini") {
			const url = new URL(entry.baseURL);
			const version = /\/(v1(?:beta|alpha)?)\b/.exec(url.pathname)?.[1] ?? "v1beta";
			return `${url.origin}/${version}/models`;
		}
		if (entry.protocol === "dashscope") return `${new URL(entry.baseURL).origin}/compatible-mode/v1/models`;
		const raw = entry.protocol === "modelscope" || entry.protocol === "siliconflow" ? ensureVersionedBase(entry.baseURL) : entry.baseURL;
		const base = raw.endsWith("/") ? raw : `${raw}/`;
		return new URL("models", base).toString();
	} catch {
		return;
	}
}
function authHeaders(entry, key) {
	if (key === void 0) return {};
	return entry.protocol === "gemini" ? { "x-goog-api-key": key } : { authorization: `Bearer ${key}` };
}
/** Pull model ids out of OpenAI-style `{ data: [{ id }] }` or Gemini `{ models: [{ name }] }`. */
function modelIds(payload) {
	if (typeof payload !== "object" || payload === null) return [];
	const record = payload;
	const ids = (Array.isArray(record.data) ? record.data : Array.isArray(record.models) ? record.models : []).map((item) => {
		if (typeof item === "string") return item;
		const entry = item;
		return (typeof entry.id === "string" ? entry.id : typeof entry.name === "string" ? entry.name : "").replace(/^models\//, "");
	});
	return [...new Set(ids.filter((id) => id.length > 0))].sort();
}
/** Heuristic for “looks like an image-generation model”. */
const IMAGE_MODEL_HINT = /image|imagen|nano-banana|dall-?e|seedream|seededit|flux|kolors|cogview|wanx|wan-?2|hunyuan-?image|kandinsky|majicflus|sd-?xl|sd3|stable-diffusion|diffusion|midjourney|hidream|playground|recraft|ideogram|grok-imagine/i;
/** Split a model list into all ids and the image-like subset. */
function classifyModels(ids) {
	return {
		models: [...ids],
		imageModels: ids.filter((id) => IMAGE_MODEL_HINT.test(id))
	};
}
/** Merge a draft entry from the browser over the stored one (test before save). */
async function draftEntry(services, body) {
	const settings = await services.settings.get();
	const providerId = str(body.providerId)?.trim() ?? "";
	let entry = settings.providers.find((entry) => entry.id === providerId);
	if (body.entry !== void 0) {
		const merged = normalizeSettings({ providers: [body.entry] }).providers.find((candidate) => candidate.id === body.entry.id);
		if (merged !== void 0) entry = merged;
	}
	if (entry === void 0) throw new RouteError(404, "unknown-provider");
	const proxy = body.proxy === void 0 ? settings.proxy : normalizeSettings({ proxy: body.proxy }).proxy;
	const draftKey = str(body.key)?.trim();
	if (draftKey !== void 0 && draftKey.length > 0) return {
		entry,
		proxy,
		key: draftKey
	};
	if (!sameEndpoint(settings.providers.find((candidate) => candidate.id === entry.id), entry)) throw new RouteError(400, "端点 Base URL 或协议与已保存的不一致：已保存的 API Key 不会发往新端点，请在 API Key 栏填写 Key 后再试");
	return {
		entry,
		proxy,
		key: await services.keys.get(entry.id)
	};
}
/** Whether `next` still talks to the endpoint `stored` was keyed for. */
function sameEndpoint(stored, next) {
	return stored !== void 0 && stored.baseURL === next.baseURL && stored.protocol === next.protocol;
}
async function listModels(fetcher, entry, key, signal) {
	const url = modelsURL(entry);
	if (url === void 0) throw new RouteError(400, "端点不是合法的 URL");
	const response = await fetcher(url, {
		method: "GET",
		redirect: "follow",
		signal,
		headers: authHeaders(entry, key)
	});
	const text = await response.text();
	let ids = [];
	try {
		ids = modelIds(JSON.parse(text));
	} catch {}
	return {
		status: response.status,
		ids,
		text: redactSecrets(text, key).slice(0, 400)
	};
}
/**
* POST `{ providerId, entry?, key?, proxy? }` → connectivity verdict, or
* `{ proxyUrl }` → probe the proxy itself.
*/
function testRoute(services) {
	return jsonRoute(["POST"], async (req) => {
		const body = await readJsonBody(req, SMALL_BODY);
		const signal = AbortSignal.timeout(2e4);
		const started = Date.now();
		let proxyUrl = str(body.proxyUrl)?.trim();
		if (proxyUrl === "system") {
			const system = await detectSystemProxy({ refresh: true });
			if (system === null) return {
				ok: false,
				message: SYSTEM_PROXY_MISSING
			};
			proxyUrl = system.url;
		}
		if (proxyUrl !== void 0) {
			const problem = validateProxyUrl(proxyUrl);
			if (problem !== void 0) return {
				ok: false,
				message: problem
			};
			const fetcher = services.fetch ?? providerFetch({
				mode: "custom",
				url: proxyUrl
			}, {
				mode: "off",
				enabled: false,
				url: "",
				noProxy: []
			});
			try {
				const response = await fetcher(PROXY_PROBE_URL, {
					method: "GET",
					signal
				});
				return {
					ok: response.status < 500,
					status: response.status,
					latencyMs: Date.now() - started,
					message: `代理可用（HTTP ${String(response.status)}）`
				};
			} catch (error) {
				return {
					ok: false,
					message: `代理不可用：${error instanceof Error ? error.message : String(error)}`
				};
			}
		}
		const { entry, proxy, key } = await draftEntry(services, body);
		if (entry.baseURL.length === 0) return {
			ok: false,
			message: "尚未填写端点 Base URL"
		};
		if (key === void 0) return {
			ok: false,
			message: "尚未配置 API Key"
		};
		const fetcher = services.fetch ?? providerFetch(entry.proxy, proxy);
		try {
			const listed = await listModels(fetcher, entry, key, signal);
			const latencyMs = Date.now() - started;
			if (listed.status === 401 || listed.status === 403) return {
				ok: false,
				status: listed.status,
				latencyMs,
				message: `API Key 无效或无权限（HTTP ${String(listed.status)}）`
			};
			if (listed.status >= 200 && listed.status < 300) return {
				ok: true,
				status: listed.status,
				latencyMs,
				message: `连接成功：共 ${String(listed.ids.length)} 个模型，其中 ${String(classifyModels(listed.ids).imageModels.length)} 个识别为生图模型`
			};
			if (listed.status === 404 || listed.status === 405) return {
				ok: true,
				status: listed.status,
				latencyMs,
				message: "端点可达（该服务不提供模型列表，未校验 Key）"
			};
			return {
				ok: false,
				status: listed.status,
				latencyMs,
				message: `HTTP ${String(listed.status)}：${listed.text}`
			};
		} catch (error) {
			if (error instanceof RouteError) throw error;
			return {
				ok: false,
				message: `网络错误：${error instanceof Error ? error.message : String(error)}`
			};
		}
	});
}
/** GET → the detected system proxy (always re-detected). */
function proxyStatusRoute() {
	return jsonRoute(["GET", "POST"], async () => ({ system: await detectSystemProxy({ refresh: true }) }));
}
/** POST `{ providerId, entry?, key? }` → every model id plus the image-like subset. */
function modelsRoute(services) {
	return jsonRoute(["POST"], async (req) => {
		const { entry, proxy, key } = await draftEntry(services, await readJsonBody(req, SMALL_BODY));
		const listed = await listModels(services.fetch ?? providerFetch(entry.proxy, proxy), entry, key, AbortSignal.timeout(2e4));
		if (listed.status < 200 || listed.status >= 300) throw new RouteError(502, `拉取模型失败（HTTP ${String(listed.status)}）：${listed.text}`);
		return {
			...classifyModels(listed.ids),
			total: listed.ids.length
		};
	});
}
/** POST a paintings-page request: N images, saved straight into the gallery. */
function paintRoute(services) {
	return jsonRoute(["POST"], async (req, res) => {
		const body = await readJsonBody(req, 8388608);
		const signal = requestSignal(req, res);
		const prompt = str(body.prompt)?.trim() ?? "";
		if (prompt.length === 0) throw new RouteError(400, "Prompt 不能为空");
		const settings = await services.settings.get();
		let entry;
		try {
			entry = requireProvider(settings, str(body.providerId));
		} catch (error) {
			throw new RouteError(400, error instanceof Error ? error.message : String(error));
		}
		const caps = capabilitiesOf(entry);
		const count = Math.min(caps.maxCount, Math.max(1, Math.trunc(Number(body.count) || 1)));
		const refs = (Array.isArray(body.references) ? body.references : []).map(parseImageAttachmentRef);
		if (refs.some((ref) => ref === void 0)) throw new RouteError(400, "invalid-reference");
		const sourceImages = await Promise.all(refs.map(async (ref) => {
			const stored = await services.attachments.readImage(ref, signal);
			return {
				data: stored.data,
				mediaType: stored.ref.mediaType
			};
		}));
		const seedValue = Number(body.seed);
		const request = {
			prompt,
			model: str(body.model),
			aspectRatio: str(body.aspectRatio),
			imageSize: str(body.imageSize),
			size: str(body.size),
			quality: str(body.quality),
			negativePrompt: str(body.negativePrompt),
			...Number.isSafeInteger(seedValue) && seedValue >= 0 && body.seed !== null && body.seed !== "" ? { seed: seedValue } : {},
			sourceImages
		};
		const projectId = str(body.projectId) ?? "default";
		const batchId = randomUUID();
		const outcomes = await Promise.allSettled(Array.from({ length: count }, () => generateAndStore(services, entry.id, request, signal)));
		const done = outcomes.flatMap((outcome) => outcome.status === "fulfilled" ? [outcome.value] : []);
		const failures = outcomes.flatMap((outcome) => outcome.status === "rejected" ? [outcome.reason instanceof Error ? outcome.reason.message : String(outcome.reason)] : []);
		const copies = await Promise.all(done.map(({ attachment, result }) => saveImageCopy(services, toAttachmentJson(attachment), result.data, prompt)));
		const items = done.length === 0 ? [] : await services.gallery.addItems(done.map(({ attachment, result }, index) => ({
			attachment: toAttachmentJson(attachment),
			...copies[index] === void 0 ? {} : { filePath: copies[index] },
			prompt,
			...request.negativePrompt === void 0 || request.negativePrompt.length === 0 ? {} : { negativePrompt: request.negativePrompt },
			providerId: entry.id,
			providerName: entry.name,
			model: result.model || effectiveModel(entry, request.model),
			output: result.output,
			projectId,
			batchId,
			operation: sourceImages.length > 0 ? "edit" : "generate",
			...sourceImages.length > 0 ? { sourceAttachmentIds: refs.map((ref) => String(ref.attachmentId)) } : {}
		})));
		if (items.length === 0 && failures.length > 0) throw new RouteError(502, failures[0]);
		return {
			items,
			failures
		};
	});
}
/**
* Path of the item's readable copy, writing it now for items that predate
* copies or whose file was moved away.
*/
async function ensureCopy(services, item) {
	if (item.filePath !== void 0 && await fileExists(item.filePath)) return item.filePath;
	const ref = parseImageAttachmentRef(item.attachment);
	if (ref === void 0) throw new RouteError(404, "图片引用无效");
	const stored = await services.attachments.readImage(ref);
	if (item.filePath !== void 0 && isInside(await imageDir(services), item.filePath)) try {
		await mkdir(dirname(item.filePath), { recursive: true });
		await writeFile(item.filePath, stored.data);
		return item.filePath;
	} catch {}
	const path = await saveImageCopy(services, item.attachment, stored.data, item.prompt);
	if (path === void 0) throw new RouteError(500, "无法写入图片文件，请检查「图片保存目录」");
	await services.gallery.setFilePath(item.id, path);
	return path;
}
function attachmentList(value) {
	if (!Array.isArray(value)) return [];
	return value.map(parseImageAttachmentRef).filter((ref) => ref !== void 0).map(toAttachmentJson);
}
/** POST `{ op, ... }` — every gallery read and write. */
function galleryRoute(services) {
	let revision = 0;
	services.gallery.onChange(() => {
		revision++;
	});
	return jsonRoute(["POST"], async (req) => {
		const body = await readJsonBody(req, 2097152);
		const gallery = services.gallery;
		const ids = stringArray(body.ids);
		try {
			switch (body.op) {
				case "revision": return { revision };
				case "projects": return {
					revision,
					projects: await gallery.projects()
				};
				case "list": return {
					revision,
					...await gallery.list({
						projectId: str(body.projectId),
						favorite: body.favorite === true ? true : void 0,
						providerId: str(body.providerId),
						sessionId: str(body.sessionId),
						query: str(body.query),
						order: body.order === "asc" ? "asc" : "desc",
						offset: typeof body.offset === "number" ? body.offset : void 0,
						limit: typeof body.limit === "number" ? body.limit : void 0
					})
				};
				case "update": return { changed: await gallery.updateItems(ids, {
					...typeof body.favorite === "boolean" ? { favorite: body.favorite } : {},
					...typeof body.projectId === "string" ? { projectId: body.projectId } : {},
					...Array.isArray(body.tags) ? { tags: stringArray(body.tags) } : {}
				}) };
				case "remove": {
					const removed = await gallery.removeItems(ids);
					const dir = await imageDir(services);
					for (const item of removed) if (item.filePath !== void 0 && !await gallery.fileInUse(item.filePath)) await removeImageCopy(dir, item.filePath);
					return { removed: removed.length };
				}
				case "reveal": {
					const item = await gallery.get(str(body.id) ?? "");
					if (item === void 0) throw new RouteError(404, "图片不存在");
					const path = await ensureCopy(services, item);
					revealInFileManager(path, services.launch);
					return { path };
				}
				case "openFolder": {
					const dir = await imageDir(services);
					await openFolder(dir, services.launch);
					return { path: dir };
				}
				case "createProject": return { project: await gallery.createProject(str(body.name) ?? "") };
				case "renameProject": return gallery.renameProject(str(body.id) ?? "", str(body.name) ?? "");
				case "deleteProject": return gallery.deleteProject(str(body.id) ?? "", body.deleteItems === true);
				case "reorderProjects": return gallery.reorderProjects(ids);
				case "favoritePrompts": return { prompts: await gallery.favoritePrompts() };
				case "addFavoritePrompt": return { prompt: await gallery.addFavoritePrompt(str(body.text) ?? "") };
				case "updateFavoritePrompt": return { prompt: await gallery.updateFavoritePrompt(str(body.id) ?? "", str(body.text) ?? "") };
				case "removeFavoritePrompt": return gallery.removeFavoritePrompt(str(body.id) ?? "");
				case "import": {
					const attachments = attachmentList(body.attachments);
					if (attachments.length === 0) throw new RouteError(400, "no-attachments");
					const copies = await Promise.all(attachments.map(async (attachment) => {
						const stored = await services.attachments.readImage(attachment).catch(() => void 0);
						return stored === void 0 ? void 0 : saveImageCopy(services, attachment, stored.data, attachment.name ?? "import");
					}));
					return { items: await gallery.addItems(attachments.map((attachment, index) => ({
						attachment,
						...copies[index] === void 0 ? {} : { filePath: copies[index] },
						prompt: str(body.prompt) ?? "",
						providerId: "import",
						providerName: "导入",
						model: "",
						output: `${String(attachment.width)}x${String(attachment.height)}`,
						projectId: str(body.projectId) ?? "default",
						operation: "import"
					}))) };
				}
				default: throw new RouteError(400, "unknown-op");
			}
		} catch (error) {
			if (error instanceof RouteError) throw error;
			throw new RouteError(400, error instanceof Error ? error.message : String(error));
		}
	});
}
//#endregion
//#region lib/types/workspace-save.js
/** Persist one generated image as a file under the session workspace. */
/** File extension for each supported image media type. */
const EXTENSION = {
	"image/png": "png",
	"image/jpeg": "jpg",
	"image/webp": "webp",
	"image/gif": "gif"
};
/**
* Build the deterministic file name for a generated image:
* `image-<digest-prefix>.<ext>`. The digest prefix comes from the
* content-addressed attachment id, so the same image bytes always map to the
* same file name regardless of when they were generated, and re-saving simply
* overwrites the previous copy in place.
* @param attachmentId - durable attachment id (`sha256:<hex>`).
* @param mediaType - verified image media type.
* @returns the file name (no directory).
*/
function workspaceImageName(attachmentId, mediaType) {
	return `image-${(attachmentId.startsWith("sha256:") ? attachmentId.slice(7) : attachmentId).slice(0, 8).padEnd(8, "0")}.${EXTENSION[mediaType]}`;
}
/**
* Resolve the configured image folder inside the session workspace. The
* folder may nest, but must stay inside the workspace: absolute paths and
* parent-traversal segments are rejected for both separator styles.
*
* This lexical pass is necessary but not sufficient: `saveImageToWorkspace`
* additionally verifies the on-disk resolution so symlinked folders cannot
* escape the workspace.
* @param workspaceRoot - the session workspace directory.
* @param folder - configured subfolder; empty/blank means the workspace root.
* @returns the absolute image directory.
* @throws when the folder would escape the workspace root.
*/
function workspaceImageDir(workspaceRoot, folder) {
	const trimmed = (folder ?? "").trim();
	const root = resolve(workspaceRoot);
	const dir = trimmed === "" ? root : resolve(root, trimmed);
	if (!containsPath(root, dir)) throw new Error(`image workspace folder '${folder}' must stay inside the session workspace`);
	return dir;
}
/** True when `child` equals `parent` or lives underneath it (lexically). */
function containsPath(parent, child) {
	const rel = relative(parent, child);
	return rel === "" || rel !== ".." && !rel.startsWith(`..${sep}`) && !isAbsolute(rel);
}
/**
* Real path of the closest existing ancestor of `dir` (inclusive). Walking up
* lets us validate symlinked folder segments before creating anything under
* them.
*/
async function nearestExistingRealPath(dir) {
	let probe = dir;
	for (;;) try {
		return await realpath(probe);
	} catch (error) {
		if (error?.code !== "ENOENT") throw error;
		const parent = dirname(probe);
		if (parent === probe) throw error;
		probe = parent;
	}
}
/** Reject a directory whose on-disk resolution lands outside the workspace. */
function assertInsideWorkspace(realRoot, candidate, folder) {
	if (containsPath(realRoot, candidate)) return;
	throw new Error(`image workspace folder '${folder ?? ""}' must stay inside the session workspace (${candidate} resolves outside ${realRoot})`);
}
/**
* Write one generated image durably under the session workspace.
*
* Containment is enforced twice: lexically by `workspaceImageDir`, then
* against real paths, so a configured folder (or any intermediate segment)
* that is a symlink pointing outside the workspace is rejected before and
* after anything is created.
*
* The bytes are written to a same-directory staging file and renamed onto the
* target, so a crash never leaves a half-written image under its final name.
* Re-saving identical bytes rewrites the same file (the name is content-
* addressed), which keeps repeated generations idempotent. A cancellation is
* honoured up to and including the final rename: an aborted save never
* resolves successfully and never leaves the image behind under its final
* name.
* @param options - workspace root, configured folder, attachment identity, and image bytes.
* @returns the absolute path of the written file.
*/
async function saveImageToWorkspace(options) {
	const dir = workspaceImageDir(options.workspaceRoot, options.folder);
	options.signal?.throwIfAborted();
	const realRoot = await realpath(resolve(options.workspaceRoot));
	assertInsideWorkspace(realRoot, await nearestExistingRealPath(dir), options.folder);
	const name = workspaceImageName(options.attachmentId, options.mediaType);
	const target = join(dir, name);
	const staging = join(dir, `.${name}.${process.pid}-${randomUUID()}.tmp`);
	await mkdir(dir, { recursive: true });
	assertInsideWorkspace(realRoot, await realpath(dir), options.folder);
	try {
		await writeFile(staging, options.data, {
			flag: "wx",
			signal: options.signal
		});
		options.signal?.throwIfAborted();
		await rename(staging, target);
	} catch (error) {
		await unlink(staging).catch(() => {});
		throw error;
	}
	try {
		options.signal?.throwIfAborted();
	} catch (error) {
		await unlink(target).catch(() => {});
		throw error;
	}
	return target;
}
//#endregion
//#region lib/types/index.js
const name = PACKAGE_NAME;
const inject = [
	"tools",
	"attachments",
	"credentials",
	"webServer"
];
const Config = z.object({ dataDir: z.string().description("设置与画廊数据目录；留空使用 ~/.dsh/storages/copylee-image-gen") });
function isPending(value) {
	return "pending" in value;
}
/**
* Tell the calling Agent that a background job failed, as a collapsed notice row: an idle Agent
* is woken so it can retry or explain, a running one gets it as context for its next step.
* Successes are not reported: the image already shows in the reply, and a notice would add a
* step that turns the finished answer into "process" (DSH treats only the last step as final).
*/
function notifyBackgroundJob(exec, outcome) {
	const agent = exec.agent;
	if (agent === void 0) return;
	const subject = outcome.prompt.length > 60 ? `${outcome.prompt.slice(0, 57)}...` : outcome.prompt;
	const message = createUserMessage({
		content: [{
			type: "text",
			text: `Background image job ${outcome.jobId} failed: ${outcome.error}
Image prompt: ${outcome.prompt}
Its placeholder in your earlier reply now shows the failure. Tell the user briefly, and retry with paint_image (background: true) if a fix is obvious (another provider, a simpler prompt); otherwise explain what they can change.`
		}],
		source: {
			kind: "copylee-image-gen",
			form: "notice",
			summary: `Image generation failed: ${subject}`.slice(0, 120)
		}
	});
	try {
		if (agent.status === "idle" && agent.followup !== void 0) agent.followup(message);
		else agent.inject?.(message);
	} catch {}
}
/** One line per enabled provider for the model's context and errors. */
function providerDigest(settings, keyed) {
	if (!settings.chatTools) return "";
	const rows = settings.providers.filter((entry) => entry.enabled && entry.baseURL.length > 0 && keyed.has(entry.id)).map((entry) => {
		const caps = capabilitiesOf(entry);
		const model = effectiveModel(entry);
		const edit = caps.maxReferences > 0 ? `edit≤${String(caps.maxReferences)}` : "no-edit";
		const size = caps.customSize === void 0 ? `sizes via aspect_ratio${caps.tiers.length > 0 ? ` + image_size ${caps.tiers.join("/")}` : ""}` : `size ${String(caps.customSize.min)}–${String(caps.customSize.max)}px per side`;
		return `- ${entry.id}${entry.id === settings.activeProvider ? " (default)" : ""}: ${entry.name}, model ${model || "?"}, ${edit}, ${size}`;
	});
	if (rows.length === 0) return "Image generation tools (paint_image, edit_painting) are installed but no image provider has an API key yet; if the user asks for an image, tell them to configure one in Settings > Plugins > 图像生成.";
	return [
		"You can create images with paint_image / paint_images and modify images with edit_painting whenever a picture would genuinely help the user (they ask for an image, illustration, poster, logo, diagram-like visual, or edits to an attached image). Do not generate images unprompted for plain text questions.",
		"Pass `background: true` for an illustration that accompanies an explanation (a diagram for a lesson, a picture beside the text): the tool returns at once and you keep writing while the image renders. Keep the default blocking call when the image itself is the deliverable or your next words depend on it.",
		"Configured image providers (pass the id as `provider` only when the user asks for a specific one):",
		...rows
	].join("\n");
}
function apply(ctx, config = {}) {
	const dataDir = resolveDataDir(config.dataDir);
	const settings = new SettingsStore(dataDir);
	const credentialsService = ctx.get("credentials");
	const keys = layeredKeyStore(hasRecordApi(credentialsService) ? credentialKeyStore(credentialsService) : void 0, fileKeyStore(dataDir));
	const gallery = new GalleryDb(dataDir);
	const services = {
		settings,
		keys,
		gallery,
		attachments: ctx.attachments,
		dataDir
	};
	const jobs = new JobRegistry(gallery);
	ctx.effect(() => () => jobs.dispose(), `${PLUGIN_SLUG}: image jobs`);
	const route = (kind, path, handler) => {
		const safe = async (req, res) => {
			try {
				await handler(req, res);
			} catch (error) {
				if (res.headersSent) {
					res.destroy();
					return;
				}
				res.writeHead(500, {
					"content-type": "application/json",
					"cache-control": "no-store"
				});
				res.end(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }));
			}
		};
		ctx.effect(() => ctx.webServer.register({
			kind,
			path,
			handler: safe
		}), `${PLUGIN_SLUG}: ${path}`);
	};
	route("exact", IMAGE_ROUTE, imageRoute(services));
	route("exact", IMPORT_ROUTE, (req, res) => serveImport(req, res, {
		saveImage: (image) => ctx.attachments.saveImage(image),
		maxImageBytes: ctx.attachments.imageLimits.maxImageBytes,
		mediaTypes: ctx.attachments.imageLimits.mediaTypes
	}));
	route("exact", SETTINGS_ROUTE, settingsRoute(services));
	route("exact", KEY_ROUTE, keyRoute(services));
	route("exact", TEST_ROUTE, testRoute(services));
	route("exact", MODELS_ROUTE, modelsRoute(services));
	route("exact", PAINT_ROUTE, paintRoute(services));
	route("exact", GALLERY_ROUTE, galleryRoute(services));
	route("exact", PROXY_STATUS_ROUTE, proxyStatusRoute());
	route("prefix", JOBS_ROUTE, jobsRoute(services, jobs, JOBS_ROUTE));
	let digest = "";
	const refreshDigest = async () => {
		const current = await settings.get();
		const keyed = /* @__PURE__ */ new Set();
		await Promise.all(current.providers.map(async (entry) => {
			if (await keys.get(entry.id).catch(() => void 0) !== void 0) keyed.add(entry.id);
		}));
		digest = providerDigest(current, keyed);
	};
	refreshDigest().catch(() => {});
	ctx.effect(() => settings.onChange(() => {
		refreshDigest().catch(() => {});
	}), `${PLUGIN_SLUG}: digest refresh`);
	ctx.on("credentials/record-updated", (() => {
		refreshDigest().catch(() => {});
	}));
	ctx.inject(["systemPrompt"], (promptCtx) => {
		promptCtx.systemPrompt.context({
			name: `${PLUGIN_SLUG}:providers`,
			order: 60,
			text: () => digest
		});
	});
	/** Generate one image under a job and mirror it into the gallery. */
	const generateImage = async (jobId, args, exec, sourceImages, sourceIds, signal) => {
		const { entry, result, attachment } = await generateAndStore(services, args.provider, {
			prompt: args.prompt,
			model: args.model,
			aspectRatio: args.aspect_ratio,
			imageSize: args.image_size,
			size: args.size,
			negativePrompt: args.negative_prompt,
			sourceImages
		}, signal);
		const value = {
			jobId,
			attachment,
			provider: entry.id,
			model: result.model,
			output: result.output
		};
		const current = await settings.get();
		const workspaceRoot = exec.agent?.session.header.cwd;
		if (current.saveToWorkspace && workspaceRoot !== void 0) try {
			value.savedTo = await saveImageToWorkspace({
				workspaceRoot,
				folder: current.workspaceFolder,
				attachmentId: attachment.attachmentId,
				mediaType: result.mediaType,
				data: result.data,
				signal
			});
		} catch (error) {
			signal.throwIfAborted();
			value.saveError = error instanceof Error ? error.message : String(error);
		}
		const sessionId = exec.agent?.session.header.id;
		const filePath = await saveImageCopy(services, toAttachmentJson(attachment), result.data, args.prompt);
		await gallery.addItems([{
			attachment: toAttachmentJson(attachment),
			...filePath === void 0 ? {} : { filePath },
			prompt: args.prompt,
			...args.negative_prompt === void 0 ? {} : { negativePrompt: args.negative_prompt },
			providerId: entry.id,
			providerName: entry.name,
			model: result.model,
			output: result.output,
			projectId: CONVERSATION_PROJECT_ID,
			operation: sourceImages.length > 0 ? "edit" : "generate",
			...typeof sessionId === "string" ? { sessionId } : {},
			...value.savedTo === void 0 ? {} : { savedTo: value.savedTo },
			...sourceIds.length > 0 ? { sourceAttachmentIds: sourceIds } : {},
			jobId
		}]).catch((error) => {
			ctx.logger.warn(`${PLUGIN_SLUG}: failed to record gallery item: ${error instanceof Error ? error.message : String(error)}`);
		});
		return value;
	};
	/** Run one job; settles it with the finished attachment. */
	const runJob = (jobId, args, exec, sourceImages, sourceIds, parent) => jobs.run(jobId, async (signal) => {
		const value = await generateImage(jobId, args, exec, sourceImages, sourceIds, signal);
		return {
			attachment: toAttachmentJson(value.attachment),
			path: value.savedTo,
			value
		};
	}, parent).then((settled) => settled.value);
	/** Background job: failures are logged (the placeholder shows them) and reported to the Agent. */
	const startBackground = (jobId, args, exec, sourceImages, sourceIds) => runJob(jobId, args, exec, sourceImages, sourceIds).then(() => void 0, (error) => {
		const message = error instanceof Error ? error.message : String(error);
		ctx.logger.warn(`${PLUGIN_SLUG}: background image ${jobId} failed: ${message}`);
		if (!jobs.stopped) notifyBackgroundJob(exec, {
			jobId,
			prompt: args.prompt,
			error: message
		});
	});
	/** One generation as a job; `background` returns the pending job at once. */
	const generateForTool = async (args, exec, sourceImages, sourceIds) => {
		const job = jobs.create(expectedRatio(args));
		if (args.background !== true) return runJob(job.id, args, exec, sourceImages, sourceIds, exec.signal);
		startBackground(job.id, args, exec, sourceImages, sourceIds);
		return {
			jobId: job.id,
			pending: true
		};
	};
	/** The conversation tools; registered only while settings.chatTools is on. */
	const toolDefinitions = [];
	const providerParam = {
		type: "string",
		description: "Optional image provider id for this call only (see the configured providers in context); omit to use the default provider."
	};
	const sizeParams = {
		aspect_ratio: {
			type: "string",
			enum: [...ASPECT_RATIOS],
			description: "Optional aspect ratio; mapped to the closest size the provider supports."
		},
		image_size: {
			type: "string",
			enum: [
				"1K",
				"2K",
				"4K"
			],
			description: "Optional resolution tier for providers that have tiers (Gemini, Seedream, xAI)."
		},
		size: {
			type: "string",
			description: "Optional exact WIDTHxHEIGHT size such as 1536x1024 or 2048x1152; overrides aspect_ratio/image_size. Use it when the user asks for a resolution; each provider's allowed range is listed in context."
		},
		negative_prompt: {
			type: "string",
			description: "Optional things to avoid (ModelScope / SiliconFlow)."
		},
		background: {
			type: "boolean",
			description: "true: return immediately and finish the image in the background while you keep answering (best for an illustration inside an explanation; embed its genimg reference where it belongs and do not wait for it). Default false: wait for the finished image."
		}
	};
	toolDefinitions.push(defineTool({
		name: "paint_image",
		description: "Create a new image from a text prompt with the configured image provider. Call it on your own whenever the user wants a picture — an illustration, photo, poster, logo, icon, wallpaper, concept art, or a visual to accompany your answer — not only when they say \"generate\". Use edit_painting instead to change an existing image. Write a complete visual prompt: subject, composition, style, lighting, colors, and any exact text to render. The image is attached to the conversation and saved to the gallery; do not search for it afterwards.",
		parameters: {
			prompt: {
				type: "string",
				required: true,
				description: "Complete description of the image."
			},
			provider: providerParam,
			model: {
				type: "string",
				description: "Optional model id for this call only."
			},
			...sizeParams
		},
		output: imageOutput("Generated"),
		async execute(args, exec) {
			return generateForTool(args, exec, [], []);
		},
		presentResult: (_args, result) => imagePresentation(result)
	}));
	toolDefinitions.push(defineTool({
		name: "paint_images",
		description: "Generate several images in one call, one per prompt, in order (variations, a set of illustrations, storyboards). Prefer paint_image for a single image. A failed item is reported and does not stop the rest.",
		parameters: {
			prompts: {
				type: "array",
				items: { type: "string" },
				required: true,
				description: "Ordered complete prompts, 1–8."
			},
			provider: providerParam,
			model: {
				type: "string",
				description: "Optional model id applied to every item."
			},
			...sizeParams
		},
		output: batchOutput(),
		async execute(args, exec) {
			const input = args;
			if (input.prompts.length === 0) throw new Error("paint_images requires at least one prompt");
			if (input.prompts.length > 8) throw new Error("paint_images accepts at most 8 prompts per call; split larger batches");
			if (input.background === true) {
				const queued = input.prompts.map((prompt) => ({
					prompt,
					job: jobs.create(expectedRatio(input))
				}));
				(async () => {
					for (const { prompt, job } of queued) await startBackground(job.id, {
						...input,
						prompt
					}, exec, [], []);
				})();
				return {
					images: queued.map(({ prompt, job }) => ({
						jobId: job.id,
						pending: true,
						prompt
					})),
					failures: []
				};
			}
			const images = [];
			const failures = [];
			for (const [index, prompt] of input.prompts.entries()) {
				if (exec.signal.aborted) {
					failures.push({
						index,
						prompt,
						error: "aborted"
					});
					continue;
				}
				try {
					images.push({
						...await generateForTool({
							...input,
							prompt,
							background: false
						}, exec, [], []),
						prompt
					});
				} catch (error) {
					failures.push({
						index,
						prompt,
						error: error instanceof Error ? error.message : String(error)
					});
				}
			}
			if (images.length === 0 && failures.length > 0) throw new Error(failures.map((failure) => failure.error).join("\n"));
			return {
				images,
				failures
			};
		},
		presentResult: (_args, result) => imagePresentation(result)
	}));
	toolDefinitions.push(defineTool({
		name: "edit_painting",
		description: "Edit, combine or restyle existing images with the configured provider. Images attached to the latest user message are already available: call edit_painting right away with just a prompt — never search the disk or invent paths for them. For an older image in this conversation pass source_attachment_id(s); for a workspace file the user names pass source_path(s). Provide at most one selector. When the user wants a person/object kept identical, say so explicitly in the prompt (keep the same subject, change only …).",
		parameters: {
			prompt: {
				type: "string",
				required: true,
				description: "What to change, and what must stay the same."
			},
			provider: providerParam,
			model: {
				type: "string",
				description: "Optional model id for this call only (e.g. an edit model such as Qwen/Qwen-Image-Edit)."
			},
			source_attachment_id: {
				type: "string",
				description: "Attachment id of one earlier image in this conversation."
			},
			source_attachment_ids: {
				type: "array",
				items: { type: "string" },
				description: "Ordered attachment ids of several images; \"image 1/2\" in the prompt follow this order."
			},
			source_path: {
				type: "string",
				description: "Absolute or workspace-relative path of an image file in the session workspace."
			},
			source_paths: {
				type: "array",
				items: { type: "string" },
				description: "Ordered image file paths in the session workspace."
			},
			...sizeParams
		},
		output: imageOutput("Edited"),
		async execute(args, exec) {
			const input = args;
			const run = exec;
			const sources = await resolveReferenceImages({
				...run.agent === void 0 ? {} : { agent: run.agent },
				attachments: ctx.attachments,
				...typeof input.source_attachment_id === "string" ? { sourceAttachmentId: input.source_attachment_id } : {},
				...Array.isArray(input.source_attachment_ids) ? { sourceAttachmentIds: input.source_attachment_ids } : {},
				...typeof input.source_path === "string" ? { sourcePath: input.source_path } : {},
				...Array.isArray(input.source_paths) ? { sourcePaths: input.source_paths } : {},
				maxBytes: ctx.attachments.imageLimits.maxImageBytes,
				signal: run.signal
			});
			if (sources.length === 0) throw new Error("edit_painting found no reference image; attach one or pass source_attachment_id");
			const ids = [input.source_attachment_id, ...input.source_attachment_ids ?? []].filter((id) => typeof id === "string");
			return generateForTool(input, run, sources, ids);
		},
		presentResult: (_args, result) => imagePresentation(result)
	}));
	let unregisterTools;
	let disposed = false;
	const syncTools = async () => {
		const enabled = (await settings.get()).chatTools;
		if (disposed) return;
		if (enabled && unregisterTools === void 0) {
			const disposers = toolDefinitions.map((definition) => ctx.tools.register(definition));
			unregisterTools = () => {
				for (const dispose of disposers) dispose();
			};
		} else if (!enabled && unregisterTools !== void 0) {
			unregisterTools();
			unregisterTools = void 0;
		}
	};
	syncTools().catch((error) => ctx.logger.warn(`${PLUGIN_SLUG}: failed to register tools: ${String(error)}`));
	ctx.effect(() => settings.onChange(() => {
		syncTools().catch(() => {});
	}), `${PLUGIN_SLUG}: tool switch`);
	ctx.effect(() => () => {
		disposed = true;
		unregisterTools?.();
		unregisterTools = void 0;
	}, `${PLUGIN_SLUG}: tools`);
}
function attachmentSchema() {
	return {
		type: "object",
		additionalProperties: false,
		properties: {
			attachmentId: {
				type: "string",
				required: true
			},
			mediaType: {
				type: "string",
				required: true
			},
			bytes: {
				type: "integer",
				required: true
			},
			width: {
				type: "integer",
				required: true
			},
			height: {
				type: "integer",
				required: true
			},
			name: { type: "string" },
			originalDimensions: {
				type: "object",
				additionalProperties: false,
				properties: {
					width: {
						type: "integer",
						required: true
					},
					height: {
						type: "integer",
						required: true
					}
				}
			}
		}
	};
}
/** Fields of one image value: finished (attachment, provider…) or pending. */
function imageValueProperties() {
	return {
		jobId: {
			type: "string",
			required: true
		},
		pending: { type: "boolean" },
		attachment: attachmentSchema(),
		provider: { type: "string" },
		model: { type: "string" },
		output: { type: "string" },
		savedTo: { type: "string" },
		saveError: { type: "string" }
	};
}
/** The inline reference a renderer (dsh-better-display) turns into the image or its placeholder. */
function inlineReference(jobId) {
	return `Inline image reference: ${GENIMG_SCHEME}${jobId}`;
}
function imageOutput(verb) {
	return {
		schema: {
			type: "object",
			additionalProperties: false,
			properties: imageValueProperties()
		},
		render: (_args, value) => {
			if (isPending(value)) return [{
				type: "text",
				text: `Image job ${value.jobId} is running in the background. ${inlineReference(value.jobId)}. Keep answering: do not wait for, poll or search for the image. You will be notified only if it fails.`
			}];
			const saved = typeof value.savedTo === "string" ? ` Also saved to the workspace as ${value.savedTo}.` : typeof value.saveError === "string" ? ` Saving to the workspace failed: ${value.saveError}.` : "";
			return [{
				type: "text",
				text: `${verb} one image with ${value.provider}/${value.model} (${value.output}). Attachment ID: ${String(value.attachment.attachmentId)}. ${inlineReference(value.jobId)}. It is attached to the conversation and stored in the gallery.${saved} Reply to the user without reading or searching for the image.`
			}, {
				type: "image",
				attachment: value.attachment
			}];
		},
		presentationMeta: (args, value) => {
			const prompt = args.prompt;
			if (isPending(value)) return {
				kind: "copylee-image-gen",
				jobId: value.jobId,
				pending: true,
				prompt
			};
			return {
				kind: "copylee-image-gen",
				jobId: value.jobId,
				attachment: toAttachmentJson(value.attachment),
				provider: value.provider,
				model: value.model,
				output: value.output,
				...verb === "Edited" ? { operation: "edit" } : {},
				...typeof value.savedTo === "string" ? { savedTo: value.savedTo } : {},
				prompt
			};
		}
	};
}
function batchOutput() {
	const single = imageOutput("Generated");
	return {
		schema: {
			type: "object",
			additionalProperties: false,
			properties: {
				images: {
					type: "array",
					items: {
						type: "object",
						additionalProperties: false,
						properties: {
							...imageValueProperties(),
							prompt: {
								type: "string",
								required: true
							}
						}
					}
				},
				failures: {
					type: "array",
					items: {
						type: "object",
						additionalProperties: false,
						properties: {
							index: {
								type: "integer",
								required: true
							},
							prompt: {
								type: "string",
								required: true
							},
							error: {
								type: "string",
								required: true
							}
						}
					}
				}
			}
		},
		render: (_args, value) => {
			const pending = value.images.filter(isPending).length;
			return [{
				type: "text",
				text: `${pending === value.images.length && pending > 0 ? `Started ${String(pending)} background image jobs (generated one after another).` : `Generated ${String(value.images.length)} of ${String(value.images.length + value.failures.length)} images.`}${value.failures.map((failure) => `\n#${String(failure.index + 1)} failed: ${failure.error}`).join("")}`
			}, ...value.images.flatMap((image) => single.render({}, image).map((block) => block.type === "text" ? {
				...block,
				text: `${block.text}\nImage prompt: ${image.prompt}`
			} : block))];
		},
		presentationMeta: (_args, value) => ({
			kind: "copylee-image-gen-batch",
			images: value.images.map((image) => single.presentationMeta({ prompt: image.prompt }, image))
		})
	};
}
/** Recover the attachment from a tool result's presentation meta. */
function imageAttachmentFromMeta(meta) {
	if (typeof meta !== "object" || meta === null) return void 0;
	const value = meta;
	return value.kind === "copylee-image-gen" ? parseImageAttachmentRef(value.attachment) : void 0;
}
function imagePresentation(result) {
	const meta = result.meta;
	if (meta !== void 0 && meta !== null && meta.kind === "copylee-image-gen-batch" && Array.isArray(meta.images)) {
		const content = meta.images.flatMap((image) => {
			const attachment = imageAttachmentFromMeta(image);
			return attachment === void 0 ? [] : [{
				type: "image",
				attachment
			}];
		});
		return content.length === 0 ? void 0 : {
			card: "generic",
			title: "Generated images",
			content
		};
	}
	const attachment = imageAttachmentFromMeta(result.meta);
	return attachment === void 0 ? void 0 : {
		card: "generic",
		title: "Generated image",
		content: [{
			type: "image",
			attachment
		}]
	};
}
//#endregion
export { Config, apply, imageAttachmentFromMeta, inject, name, notifyBackgroundJob, providerDigest };
