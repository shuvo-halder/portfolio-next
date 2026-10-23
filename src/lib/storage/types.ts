export interface StorageFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  path: string;
}

export interface StorageAdapter {
  upload(file: Buffer, originalName: string, mimeType: string): Promise<StorageFile>;
  delete(filename: string): Promise<void>;
  getUrl(filename: string): string;
}
