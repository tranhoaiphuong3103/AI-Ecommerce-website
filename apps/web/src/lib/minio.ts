import { Client } from 'minio';

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
});

export const BUCKETS = {
  PRODUCTS: 'products',
  VIDEOS: 'videos',
  AVATARS: 'avatars',
} as const;

export async function uploadFile(
  bucket: string,
  fileName: string,
  fileBuffer: Buffer,
  metadata?: Record<string, string>
): Promise<string> {
  await minioClient.putObject(bucket, fileName, fileBuffer, fileBuffer.length, metadata);
  return `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${bucket}/${fileName}`;
}

export async function getFileUrl(bucket: string, fileName: string): Promise<string> {
  return await minioClient.presignedGetObject(bucket, fileName, 24 * 60 * 60);
}

export async function deleteFile(bucket: string, fileName: string): Promise<void> {
  await minioClient.removeObject(bucket, fileName);
}

export { minioClient };
