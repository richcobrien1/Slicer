import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { uploadModel, listUserModels, deleteModel } from '@/lib/cloudflare-r2';
import { storeModelMetadata, getModelMetadata, deleteModelMetadata } from '@/lib/cloudflare-kv';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const modelKeys = await listUserModels(userId);
    
    // Get metadata for each model
    const models = await Promise.all(
      modelKeys.map(async (key) => {
        const modelId = key.split('/').pop()?.split('-')[0] || '';
        const metadata = await getModelMetadata(userId, modelId);
        return metadata;
      })
    );

    return NextResponse.json({ models: models.filter(Boolean) });
  } catch (error) {
    console.error('Error fetching models:', error);
    return NextResponse.json({ error: 'Failed to fetch models' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileKey = await uploadModel(buffer, userId, file.name, {
      contentType: file.type,
    });

    const modelId = Date.now().toString();
    const metadata = {
      id: modelId,
      userId,
      name: name || file.name,
      description,
      fileKey,
      fileSize: file.size,
      format: file.name.split('.').pop() || 'unknown',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await storeModelMetadata(userId, modelId, metadata);

    return NextResponse.json({ model: metadata });
  } catch (error) {
    console.error('Error uploading model:', error);
    return NextResponse.json({ error: 'Failed to upload model' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { searchParams } = new URL(request.url);
    const modelId = searchParams.get('id');

    if (!modelId) {
      return NextResponse.json({ error: 'Model ID required' }, { status: 400 });
    }

    const metadata = await getModelMetadata(userId, modelId);
    
    if (!metadata) {
      return NextResponse.json({ error: 'Model not found' }, { status: 404 });
    }

    await deleteModel(metadata.fileKey);
    await deleteModelMetadata(userId, modelId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting model:', error);
    return NextResponse.json({ error: 'Failed to delete model' }, { status: 500 });
  }
}
