'use client';

import { useState } from 'react';
import { Upload, Trash2, Download, Copy, Edit } from 'lucide-react';

interface Model {
  id: string;
  name: string;
  description?: string;
  fileSize: number;
  format: string;
  createdAt: string;
}

interface ModelPanelProps {
  models: Model[];
  selectedModelId?: string;
  onSelect?: (modelId: string) => void;
  onUpload?: (file: File) => void;
  onDelete?: (modelId: string) => void;
  onCopy?: (modelId: string) => void;
  onRefine?: (modelId: string) => void;
}

export default function ModelPanel({
  models,
  selectedModelId,
  onSelect,
  onUpload,
  onDelete,
  onCopy,
  onRefine,
}: ModelPanelProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload?.(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload?.(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Upload Area */}
      <div
        className={`p-4 border-2 border-dashed m-4 rounded-lg transition-colors ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <label className="flex flex-col items-center cursor-pointer">
          <Upload className="w-8 h-8 text-gray-400 mb-2" />
          <span className="text-sm text-gray-600">
            Drop 3D model or click to upload
          </span>
          <span className="text-xs text-gray-400 mt-1">
            STL, OBJ, 3MF formats
          </span>
          <input
            type="file"
            className="hidden"
            accept=".stl,.obj,.3mf"
            onChange={handleFileInput}
          />
        </label>
      </div>

      {/* Models Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-lg font-semibold mb-3 text-gray-900">Your Models</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {models.length === 0 ? (
            <div className="col-span-2 text-center py-8 text-gray-400">
              No models yet. Upload or create one to get started!
            </div>
          ) : (
            models.map((model) => (
              <div
                key={model.id}
                className={`border rounded-lg p-3 cursor-pointer transition-all ${
                  selectedModelId === model.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => onSelect?.(model.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900 truncate flex-1">
                    {model.name}
                  </h4>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {model.format.toUpperCase()}
                  </span>
                </div>
                
                {model.description && (
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                    {model.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{formatFileSize(model.fileSize)}</span>
                  <span>{new Date(model.createdAt).toLocaleDateString()}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRefine?.(model.id);
                    }}
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    <Edit size={12} />
                    Refine
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCopy?.(model.id);
                    }}
                    className="p-1 text-gray-600 hover:text-blue-500 transition-colors"
                    title="Copy"
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete?.(model.id);
                    }}
                    className="p-1 text-gray-600 hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
