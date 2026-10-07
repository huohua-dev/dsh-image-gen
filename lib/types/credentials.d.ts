import { type CredentialKey, type CredentialRecord } from '@deepseek-ai/dsh-credentials';
export interface KeyStore {
    get(providerId: string): Promise<string | undefined>;
    set(providerId: string, value: string): Promise<void>;
    unset(providerId: string): Promise<void>;
}
/** The subset of the DSH credentials service this plugin uses. */
export interface CredentialRecordsService {
    readRecord(key: CredentialKey): Promise<CredentialRecord | undefined>;
    modifyRecord(key: CredentialKey, mutate: (current: CredentialRecord | undefined) => Promise<CredentialRecord | undefined>): Promise<CredentialRecord | undefined>;
    deleteRecord(key: CredentialKey): Promise<void>;
}
export declare function hasRecordApi(value: unknown): value is CredentialRecordsService;
/** Keys in the DSH credential store. */
export declare function credentialKeyStore(service: CredentialRecordsService): KeyStore;
/** Fallback: keys in a private file next to the settings. */
export declare function fileKeyStore(dir: string): KeyStore;
/**
 * Prefer the DSH credential store; fall back to the file store when a read or
 * write through it fails (older hosts reject unknown record scopes).
 */
export declare function layeredKeyStore(primary: KeyStore | undefined, fallback: KeyStore): KeyStore;
