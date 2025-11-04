import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import * as THREE from 'three';

export const exportToSTL = (mesh, filename = 'model.stl') => {
  const exporter = new STLExporter();
  const result = exporter.parse(mesh, { binary: true });
  const blob = new Blob([result], { type: 'application/octet-stream' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  return true;
};

export const createMeshFromType = async (modelType) => {
  // Load the STL file for the given model type
  const loader = new STLLoader();
  
  // In Electron, use relative path from index.html location
  // In dev/web, use absolute path
  const isElectron = window.navigator.userAgent.toLowerCase().includes('electron');
  const url = isElectron 
    ? `./models/${modelType.toLowerCase()}.stl`  // Relative for Electron
    : `/models/${modelType.toLowerCase()}.stl`;  // Absolute for web
  
  console.log('Loading model from:', url, 'isElectron:', isElectron);
  
  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (geometry) => {
        console.log('Model loaded successfully:', modelType);
        const material = new THREE.MeshStandardMaterial({ 
          color: 0xFFD700, 
          metalness: 0.9, 
          roughness: 0.1 
        });
        const mesh = new THREE.Mesh(geometry, material);
        resolve(mesh);
      },
      undefined,
      (error) => {
        console.error('Model loading error:', error);
        reject(error);
      }
    );
  });
};
