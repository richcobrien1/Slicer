'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { LogOut, Menu, X, Download } from 'lucide-react';
import dynamic from 'next/dynamic';
import ChatInterface from '@/components/ChatInterface';
import ModelPanel from '@/components/ModelPanel';

// Dynamic import for 3D viewer to avoid SSR issues
const ModelViewer = dynamic(() => import('@/components/ModelViewer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="text-gray-500">Loading 3D Viewer...</div>
    </div>
  ),
});

interface Model {
  id: string;
  name: string;
  description?: string;
  fileSize: number;
  format: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const loadModels = useCallback(async () => {
    try {
      const response = await fetch('/api/models');
      const data = await response.json();
      if (data.models) {
        setModels(data.models);
      }
    } catch (error) {
      console.error('Failed to load models:', error);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadModels();
    }
  }, [status, loadModels]);

  const handleUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', file.name);
      formData.append('description', 'Uploaded via dashboard');

      const response = await fetch('/api/models', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        await loadModels();
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleDelete = async (modelId: string) => {
    if (!confirm('Are you sure you want to delete this model?')) return;

    try {
      const response = await fetch(`/api/models?id=${modelId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadModels();
        if (selectedModelId === modelId) {
          setSelectedModelId(undefined);
        }
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleCopy = async (modelId: string) => {
    const model = models.find(m => m.id === modelId);
    if (model) {
      alert(`Copy functionality for "${model.name}" will be implemented soon!`);
    }
  };

  const handleRefine = (modelId: string) => {
    const model = models.find(m => m.id === modelId);
    if (model) {
      setSelectedModelId(modelId);
      alert(`Refine mode activated for "${model.name}". Use the chat to describe changes!`);
    }
  };

  const handleExportSLT = () => {
    if (!selectedModelId) {
      alert('Please select a model first');
      return;
    }
    alert('SLT export will be implemented. This will generate an ORCA-compatible .slt file for 3D printing.');
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">3D Slicer</h1>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-4">
            <span className="text-sm text-gray-600 hidden md:inline">
              {session.user?.name}
            </span>
            <button
              onClick={handleExportSLT}
              className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 text-sm"
              title="Export to SLT"
            >
              <Download size={16} />
              <span className="hidden md:inline">Export .slt</span>
            </button>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="p-2 text-gray-600 hover:text-red-500 hover:bg-gray-100 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
          {/* Left Panel - Model Library (mobile: collapsible) */}
          <div className={`${isMenuOpen ? 'block' : 'hidden'} md:block absolute md:relative z-10 inset-0 md:inset-auto bg-gray-50 md:bg-transparent p-4 md:p-0`}>
            <ModelPanel
              models={models}
              selectedModelId={selectedModelId}
              onSelect={setSelectedModelId}
              onUpload={handleUpload}
              onDelete={handleDelete}
              onCopy={handleCopy}
              onRefine={handleRefine}
            />
          </div>

          {/* Center Panel - 3D Viewer */}
          <div className="h-[40vh] md:h-full">
            <ModelViewer />
          </div>

          {/* Right Panel - Chat Interface */}
          <div className="h-[40vh] md:h-full">
            <ChatInterface />
          </div>
        </div>
      </div>
    </div>
  );
}
