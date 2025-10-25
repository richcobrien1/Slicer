import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'slicer-3d-models';

export interface Model3D {
  id: string;
  userId: string;
  name: string;
  description?: string;
  fileKey: string;
  thumbnailKey?: string;
  fileSize: number;
  format: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Upload a 3D model file to Cloudflare R2
 */
export async function uploadModel(
  file: Buffer,
  userId: string,
  fileName: string,
  metadata?: Record<string, string>
): Promise<string> {
  const fileKey = `models/${userId}/${Date.now()}-${fileName}`;
  
  const upload = new Upload({
    client: r2Client,
    params: {
      Bucket: BUCKET_NAME,
      Key: fileKey,
      Body: file,
      ContentType: metadata?.contentType || 'application/octet-stream',
      Metadata: metadata,
    },
  });

  await upload.done();
  return fileKey;
}

/**
 * Get a 3D model file from Cloudflare R2
 */
export async function getModel(fileKey: string): Promise<Buffer> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
  });

  const response = await r2Client.send(command);
  const stream = response.Body as any;
  const chunks: Uint8Array[] = [];
  
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  
  return Buffer.concat(chunks);
}

/**
 * Delete a 3D model file from Cloudflare R2
 */
export async function deleteModel(fileKey: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
  });

  await r2Client.send(command);
}

/**
 * List all models for a user
 */
export async function listUserModels(userId: string): Promise<string[]> {
  const command = new ListObjectsV2Command({
    Bucket: BUCKET_NAME,
    Prefix: `models/${userId}/`,
  });

  const response = await r2Client.send(command);
  return response.Contents?.map(item => item.Key || '') || [];
}

/**
 * Generate a presigned URL for direct download
 */
export async function getPresignedUrl(fileKey: string, expiresIn = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
  });

  return await getSignedUrl(r2Client, command, { expiresIn });
}
