// Mesh transformation utilities for STL models
import * as THREE from 'three';

/**
 * Apply AI transformation instructions to a mesh
 * @param {THREE.Mesh} mesh - The mesh to transform
 * @param {Object} instructions - Transformation instructions from AI
 * @returns {THREE.Mesh} - The transformed mesh
 */
export function applyTransformation(mesh, instructions) {
  if (!mesh || !instructions) {
    throw new Error('Invalid mesh or instructions');
  }

  const { operation, parameters } = instructions;

  switch (operation) {
    case 'scale':
      return scaleMesh(mesh, parameters);
    case 'hollow':
      return hollowMesh(mesh, parameters);
    case 'mirror':
      return mirrorMesh(mesh, parameters);
    case 'rotate':
      return rotateMesh(mesh, parameters);
    case 'move':
      return moveMesh(mesh, parameters);
    case 'support':
      return addSupports(mesh, parameters);
    default:
      throw new Error(`Operation not implemented: ${operation}`);
  }
}

/**
 * Scale mesh by a factor
 */
function scaleMesh(mesh, { factor }) {
  if (!factor || factor <= 0) {
    throw new Error('Scale factor must be positive');
  }
  
  const newMesh = mesh.clone();
  newMesh.scale.multiplyScalar(factor);
  newMesh.geometry = newMesh.geometry.clone();
  newMesh.geometry.scale(factor, factor, factor);
  
  return newMesh;
}

/**
 * Create hollow mesh with wall thickness
 */
function hollowMesh(mesh, { wallThickness }) {
  // This is a simplified version - full implementation would require CSG operations
  const newMesh = mesh.clone();
  const scaleFactor = 1 - (wallThickness * 2 / getBoundingSize(mesh));
  
  // Create inner mesh (scaled down)
  const innerGeometry = mesh.geometry.clone();
  innerGeometry.scale(scaleFactor, scaleFactor, scaleFactor);
  
  // In production, you'd use CSG to subtract inner from outer
  // For now, we'll just return the outer mesh with modified material
  newMesh.geometry = mesh.geometry.clone();
  
  return newMesh;
}

/**
 * Mirror mesh along an axis
 */
function mirrorMesh(mesh, { axis }) {
  const newMesh = mesh.clone();
  newMesh.geometry = newMesh.geometry.clone();
  
  const positions = newMesh.geometry.attributes.position.array;
  const axisIndex = axis === 'x' ? 0 : axis === 'y' ? 1 : 2;
  
  for (let i = axisIndex; i < positions.length; i += 3) {
    positions[i] *= -1;
  }
  
  newMesh.geometry.attributes.position.needsUpdate = true;
  newMesh.geometry.computeVertexNormals();
  
  return newMesh;
}

/**
 * Rotate mesh
 */
function rotateMesh(mesh, { axis, degrees }) {
  const newMesh = mesh.clone();
  const radians = (degrees * Math.PI) / 180;
  
  if (axis === 'x') {
    newMesh.rotation.x += radians;
  } else if (axis === 'y') {
    newMesh.rotation.y += radians;
  } else if (axis === 'z') {
    newMesh.rotation.z += radians;
  }
  
  return newMesh;
}

/**
 * Move mesh
 */
function moveMesh(mesh, { x = 0, y = 0, z = 0 }) {
  const newMesh = mesh.clone();
  newMesh.position.x += x;
  newMesh.position.y += y;
  newMesh.position.z += z;
  
  return newMesh;
}

/**
 * Add support structures (simplified)
 */
function addSupports(mesh, { angle = 45, density = 0.5 }) {
  // This is a placeholder - full support generation is complex
  // Would need to analyze geometry, find overhangs, generate pillars
  const newMesh = mesh.clone();
  
  // For now, just return the mesh
  // In production, you'd add support geometry here
  console.log(`Would add supports at ${angle}° angle with ${density} density`);
  
  return newMesh;
}

/**
 * Get bounding box size of mesh
 */
function getBoundingSize(mesh) {
  const box = new THREE.Box3().setFromObject(mesh);
  const size = new THREE.Vector3();
  box.getSize(size);
  return Math.max(size.x, size.y, size.z);
}

/**
 * Get mesh statistics
 */
export function getMeshStats(mesh) {
  if (!mesh || !mesh.geometry) {
    return null;
  }
  
  const geometry = mesh.geometry;
  const box = new THREE.Box3().setFromObject(mesh);
  const size = new THREE.Vector3();
  box.getSize(size);
  
  // Calculate volume (approximate for mesh)
  let volume = 0;
  const positions = geometry.attributes.position.array;
  
  for (let i = 0; i < positions.length; i += 9) {
    const v1 = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]);
    const v2 = new THREE.Vector3(positions[i + 3], positions[i + 4], positions[i + 5]);
    const v3 = new THREE.Vector3(positions[i + 6], positions[i + 7], positions[i + 8]);
    
    // Signed volume of tetrahedron
    volume += v1.dot(v2.cross(v3)) / 6;
  }
  
  return {
    vertices: positions.length / 3,
    faces: positions.length / 9,
    volume: Math.abs(volume),
    dimensions: {
      x: size.x.toFixed(2),
      y: size.y.toFixed(2),
      z: size.z.toFixed(2)
    }
  };
}
