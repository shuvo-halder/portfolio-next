import { revalidatePath, updateTag } from 'next/cache';

/**
 * Next.js 16 cache invalidation helper.
 * Uses updateTag for instant read-your-own-writes in Server Actions,
 * plus revalidatePath on the public layouts.
 */
export function invalidateCache(tag?: string, path = '/') {
  if (tag) {
    try {
      updateTag(tag);
    } catch {
      // In case called outside a direct Server Action context
    }
  }
  revalidatePath(path, 'layout');
}
