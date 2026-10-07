/** Replace every occurrence of a known secret plus key-shaped values. */
export declare function redactSecrets(text: string, ...secrets: Array<string | undefined>): string;
/**
 * Readable, redacted detail for a failed provider response: the message (and
 * code) of a JSON error body, otherwise the text with whitespace collapsed.
 * Kept short: it is shown to the user and fed back to the model.
 */
export declare function providerErrorDetail(text: string, ...secrets: Array<string | undefined>): string;
