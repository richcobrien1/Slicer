// Mesh transformation utilities for STL models
import * as THREE from 'three';
import {
  createHollow,
  addBase,
  addSupports as addGeometrySupports,
  addDrainageHoles,
  applyGeometryOperation
} from './geometryOps';

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
    case 'color':
      return colorMesh(mesh, parameters);
    case 'resize':
      return resizeMesh(mesh, parameters);
    case 'addBase':
      return addBasePlatform(mesh, parameters);
    case 'addHoles':
      return addDrainageHolesMesh(mesh, parameters);
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
function hollowMesh(mesh, { wallThickness = 0.002 }) {
  const newMesh = mesh.clone();
  const hollowedGeometry = createHollow(mesh.geometry.clone(), wallThickness);
  newMesh.geometry = hollowedGeometry;
  
  console.log(`Created hollow mesh with ${wallThickness}mm wall thickness`);
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
 * Add support structures
 */
function addSupports(mesh, { angle = 45, density = 0.01, thickness = 0.001 }) {
  const newMesh = mesh.clone();
  const supportedGeometry = addGeometrySupports(mesh.geometry.clone(), {
    overhangAngle: angle,
    supportDensity: density,
    supportThickness: thickness
  });
  newMesh.geometry = supportedGeometry;
  
  console.log(`Added support structures at ${angle}° overhang angle`);
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
 * Change mesh color
 */
function colorMesh(mesh, { color }) {
  const newMesh = mesh.clone();
  
  // Parse color string to THREE.Color
  let threeColor;
  if (color.startsWith('#')) {
    threeColor = new THREE.Color(color);
  } else {
    // Try to parse named colors
    threeColor = new THREE.Color(color.toLowerCase());
  }
  
  // Apply color to material
  if (newMesh.material) {
    newMesh.material = newMesh.material.clone();
    newMesh.material.color = threeColor;
  }
  
  return newMesh;
}

/**
 * Resize mesh to specific dimensions
 */
function resizeMesh(mesh, { width, height, depth }) {
  const newMesh = mesh.clone();
  const box = new THREE.Box3().setFromObject(mesh);
  const currentSize = new THREE.Vector3();
  box.getSize(currentSize);
  
  const scaleX = width ? width / currentSize.x : 1;
  const scaleY = height ? height / currentSize.y : 1;
  const scaleZ = depth ? depth / currentSize.z : 1;
  
  newMesh.geometry = newMesh.geometry.clone();
  newMesh.geometry.scale(scaleX, scaleY, scaleZ);
  newMesh.scale.set(scaleX, scaleY, scaleZ);
  
  return newMesh;
}

/**
 * Add base platform to model
 */
function addBasePlatform(mesh, { type = 'rectangular', height = 0.002, margin = 0.005 }) {
  const newMesh = mesh.clone();
  const basedGeometry = addBase(mesh.geometry.clone(), {
    type: type === 'circle' || type === 'round' || type === 'circular' ? 'circular' : 'rectangular',
    height,
    margin
  });
  newMesh.geometry = basedGeometry;
  
  console.log(`Added ${type} base platform with ${margin}m margin`);
  return newMesh;
}

/**
 * Add drainage holes to model
 */
function addDrainageHolesMesh(mesh, { diameter = 0.002, count = 2 }) {
  const newMesh = mesh.clone();
  const holedGeometry = addDrainageHoles(mesh.geometry.clone(), {
    holeDiameter: diameter,
    holeCount: count
  });
  newMesh.geometry = holedGeometry;
  
  console.log(`Added ${count} drainage holes (${diameter}m diameter)`);
  return newMesh;
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
