import { put, del } from '@vercel/blob';

export const BUCKETS = {
  PRODUCTS: 'products',
  VIDEOS: 'videos',
  AVATARS: 'avatars',
} as const;

export async function uploadFile(
  bucket: string,
  fileName: string,
  fileBuffer: Buffer,
  metadata?: Record<string, string>,
): Promise<string> {
  const fullPath = `${bucket}/${fileName}`;

  const blob = await put(fullPath, fileBuffer, {
    access: 'public',
    addRandomSuffix: false,
    contentType: metadata?.['Content-Type'] || 'application/octet-stream',
  });

  return blob.url;
}

export async function getFileUrl(bucket: string, fileName: string): Promise<string> {
  return `${bucket}/${fileName}`;
}

export async function deleteFile(bucket: string, fileName: string): Promise<void> {
  const fullPath = `${bucket}/${fileName}`;
  await del(fullPath);
}
