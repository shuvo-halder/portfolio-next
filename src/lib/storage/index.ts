import { LocalStorageAdapter } from './local';
import type { StorageAdapter } from './types';

// Default to LocalStorageAdapter for robust local & Docker persistent volume storage.
// Can be extended with S3StorageAdapter when S3 credentials are configured.
export const storage: StorageAdapter = new LocalStorageAdapter();

export * from './types';
