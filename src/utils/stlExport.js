import * as THREE from 'three';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';

/**
 * Export a Three.js mesh or scene to STL format for 3D printing
 * @param {THREE.Mesh|THREE.Scene} object - The 3D object to export
 * @param {string} filename - Name for the downloaded file
 */
export const exportToSTL = (object, filename = 'model.stl') => {
  try {
    const exporter = new STLExporter();
    
    // Export as binary STL (more compact)
    const stlBinary = exporter.parse(object, { binary: true });
    
    // Create blob and download
    const blob = new Blob([stlBinary], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    
    // Clean up
    URL.revokeObjectURL(link.href);
    
    return true;
  } catch (error) {
    console.error('Error exporting STL:', error);
    return false;
  }
};

/**
 * Create a mesh from basic geometry type
 * @param {string} type - Type of geometry (Cube, Sphere, etc.)
 * @returns {THREE.Mesh} - The created mesh
 */
export const createMeshFromType = (type) => {
  let geometry;
  
  switch (type) {
    case 'Cube':
      geometry = new THREE.BoxGeometry(2, 2, 2);
      break;
    case 'Sphere':
      geometry = new THREE.SphereGeometry(1.5, 32, 32);
      break;
    case 'Cylinder':
      geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
      break;
    case 'Cone':
      geometry = new THREE.ConeGeometry(1, 2, 32);
      break;
    case 'Torus':
      geometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
      break;
    case 'Pyramid':
      geometry = new THREE.ConeGeometry(1.5, 2, 4);
      break;
    default:
      geometry = new THREE.BoxGeometry(2, 2, 2);
  }
  
  const material = new THREE.MeshStandardMaterial({ color: 0x646cff });
  return new THREE.Mesh(geometry, material);
};
