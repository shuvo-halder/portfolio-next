import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import type { StorageAdapter, StorageFile } from './types';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'application/pdf',
]);

const DANGEROUS_EXTENSIONS = new Set([
  '.exe',
  '.bat',
  '.cmd',
  '.sh',
  '.php',
  '.js',
  '.mjs',
  '.cjs',
  '.html',
  '.htm',
  '.vbs',
  '.ps1',
]);

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export class LocalStorageAdapter implements StorageAdapter {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.join(process.cwd(), 'public', 'uploads');
  }

  private async ensureDir() {
    await fs.mkdir(this.uploadDir, { recursive: true });
  }

  async upload(file: Buffer, originalName: string, mimeType: string): Promise<StorageFile> {
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      throw new Error(`Unsupported file type: ${mimeType}. Allowed: JPEG, PNG, WebP, GIF, SVG, PDF.`);
    }

    const maxSize = mimeType === 'application/pdf' ? MAX_PDF_SIZE_BYTES : MAX_IMAGE_SIZE_BYTES;
    if (file.length > maxSize) {
      throw new Error(`File size (${Math.round(file.length / 1024)}KB) exceeds limit of ${maxSize / (1024 * 1024)}MB`);
    }

    const rawExt = path.extname(originalName).toLowerCase();
    if (DANGEROUS_EXTENSIONS.has(rawExt)) {
      throw new Error(`Disallowed file extension: ${rawExt}`);
    }

    await this.ensureDir();

    const uniqueId = crypto.randomUUID();
    const sanitizedExt = rawExt && !rawExt.includes('..') ? rawExt : '.bin';
    const filename = `${uniqueId}${sanitizedExt}`;
    const destinationPath = path.join(this.uploadDir, filename);

    await fs.writeFile(destinationPath, file);

    const publicUrl = `/uploads/${filename}`;

    return {
      id: uniqueId,
      filename,
      originalName,
      mimeType,
      size: file.length,
      url: publicUrl,
      path: destinationPath,
    };
  }

  async delete(filename: string): Promise<void> {
    // Prevent path traversal
    const safeFilename = path.basename(filename);
    const targetPath = path.join(this.uploadDir, safeFilename);

    try {
      await fs.unlink(targetPath);
    } catch (err: unknown) {
      // If file doesn't exist, ignore
      if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw err;
      }
    }
  }

  getUrl(filename: string): string {
    const safeFilename = path.basename(filename);
    return `/uploads/${safeFilename}`;
  }
}
