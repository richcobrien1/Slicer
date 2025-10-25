/**
 * Cloudflare KV Store utilities for user session and metadata management
 */

const KV_API_URL = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_R2_ACCOUNT_ID}/storage/kv/namespaces/${process.env.CLOUDFLARE_KV_NAMESPACE_ID}`;
const KV_API_TOKEN = process.env.CLOUDFLARE_KV_API_TOKEN || '';

const headers: Record<string, string> = {
  Authorization: `Bearer ${KV_API_TOKEN}`,
  'Content-Type': 'application/json',
};

/**
 * Store a value in KV
 */
export async function kvSet(key: string, value: any, expirationTtl?: number): Promise<void> {
  const url = `${KV_API_URL}/values/${encodeURIComponent(key)}`;
  const params = new URLSearchParams();
  
  if (expirationTtl) {
    params.append('expiration_ttl', expirationTtl.toString());
  }

  const response = await fetch(`${url}?${params.toString()}`, {
    method: 'PUT',
    headers,
    body: typeof value === 'string' ? value : JSON.stringify(value),
  });

  if (!response.ok) {
    throw new Error(`KV set failed: ${response.statusText}`);
  }
}

/**
 * Get a value from KV
 */
export async function kvGet(key: string): Promise<any> {
  const url = `${KV_API_URL}/values/${encodeURIComponent(key)}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers,
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`KV get failed: ${response.statusText}`);
  }

  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/**
 * Delete a value from KV
 */
export async function kvDelete(key: string): Promise<void> {
  const url = `${KV_API_URL}/values/${encodeURIComponent(key)}`;
  
  const response = await fetch(url, {
    method: 'DELETE',
    headers,
  });

  if (!response.ok) {
    throw new Error(`KV delete failed: ${response.statusText}`);
  }
}

/**
 * List keys with a prefix
 */
export async function kvList(prefix?: string): Promise<string[]> {
  const url = `${KV_API_URL}/keys`;
  const params = new URLSearchParams();
  
  if (prefix) {
    params.append('prefix', prefix);
  }

  const response = await fetch(`${url}?${params.toString()}`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error(`KV list failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.result?.map((item: any) => item.name) || [];
}

/**
 * Store user model metadata
 */
export async function storeModelMetadata(userId: string, modelId: string, metadata: any): Promise<void> {
  const key = `user:${userId}:model:${modelId}`;
  await kvSet(key, metadata);
}

/**
 * Get user model metadata
 */
export async function getModelMetadata(userId: string, modelId: string): Promise<any> {
  const key = `user:${userId}:model:${modelId}`;
  return await kvGet(key);
}

/**
 * List all models for a user
 */
export async function listUserModels(userId: string): Promise<string[]> {
  const prefix = `user:${userId}:model:`;
  return await kvList(prefix);
}

/**
 * Delete user model metadata
 */
export async function deleteModelMetadata(userId: string, modelId: string): Promise<void> {
  const key = `user:${userId}:model:${modelId}`;
  await kvDelete(key);
}
