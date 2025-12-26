import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

let isConnected = false;

export async function getRedisClient() {
  if (!isConnected) {
    await redisClient.connect();
    isConnected = true;
  }
  return redisClient;
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const client = await getRedisClient();
  const value = await client.get(key);
  return value ? JSON.parse(value) : null;
}

export async function cacheSet(
  key: string,
  value: unknown,
  expirationSeconds?: number,
): Promise<void> {
  const client = await getRedisClient();
  const serialized = JSON.stringify(value);
  if (expirationSeconds) {
    await client.setEx(key, expirationSeconds, serialized);
  } else {
    await client.set(key, serialized);
  }
}

export async function cacheDel(key: string): Promise<void> {
  const client = await getRedisClient();
  await client.del(key);
}

export { redisClient };
