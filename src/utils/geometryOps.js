import * as THREE from 'three';
import { ADDITION, SUBTRACTION, INTERSECTION } from 'three-bvh-csg';
import { Brush, Evaluator } from 'three-bvh-csg';

/**
 * Geometry Operations for 3D Model Modification
 * Provides functions for hollowing, boolean operations, support generation, and base addition
 */

const evaluator = new Evaluator();

/**
 * Create a hollow version of a geometry with specified wall thickness
 * @param {THREE.BufferGeometry} geometry - Original geometry
 * @param {number} wallThickness - Wall thickness in model units (default: 2mm)
 * @returns {THREE.BufferGeometry} - Hollowed geometry
 */
export function createHollow(geometry, wallThickness = 0.002) {
  try {
    // Create brushes for boolean operation
    const outerBrush = new Brush(geometry);
    outerBrush.updateMatrixWorld();
    
    // Create inner geometry by scaling down
    const innerGeometry = geometry.clone();
    const boundingBox = new THREE.Box3().setFromBufferAttribute(innerGeometry.attributes.position);
    const size = boundingBox.getSize(new THREE.Vector3());
    
    // Calculate scale factor to create wall thickness
    const scaleX = Math.max(0.1, (size.x - wallThickness * 2) / size.x);
    const scaleY = Math.max(0.1, (size.y - wallThickness * 2) / size.y);
    const scaleZ = Math.max(0.1, (size.z - wallThickness * 2) / size.z);
    
    innerGeometry.scale(scaleX, scaleY, scaleZ);
    
    const innerBrush = new Brush(innerGeometry);
    innerBrush.updateMatrixWorld();
    
    // Subtract inner from outer to create hollow shell
    const result = evaluator.evaluate(outerBrush, innerBrush, SUBTRACTION);
    
    return result.geometry;
  } catch (error) {
    console.error('Error creating hollow geometry:', error);
    return geometry; // Return original on error
  }
}

/**
 * Add a base platform underneath the model
 * @param {THREE.BufferGeometry} geometry - Original geometry
 * @param {Object} options - Base options
 * @returns {THREE.BufferGeometry} - Geometry with base added
 */
export function addBase(geometry, options = {}) {
  try {
    const {
      type = 'rectangular', // 'rectangular' or 'circular'
      height = 0.002, // 2mm base height
      margin = 0.005, // 5mm margin around model
    } = options;
    
    // Get bounding box of model
    const boundingBox = new THREE.Box3().setFromBufferAttribute(geometry.attributes.position);
    const size = boundingBox.getSize(new THREE.Vector3());
    const center = boundingBox.getCenter(new THREE.Vector3());
    
    let baseGeometry;
    
    if (type === 'circular') {
      // Create circular base
      const radius = Math.max(size.x, size.z) / 2 + margin;
      baseGeometry = new THREE.CylinderGeometry(radius, radius, height, 32);
      baseGeometry.translate(center.x, boundingBox.min.y - height / 2, center.z);
    } else {
      // Create rectangular base
      const width = size.x + margin * 2;
      const depth = size.z + margin * 2;
      baseGeometry = new THREE.BoxGeometry(width, height, depth);
      baseGeometry.translate(center.x, boundingBox.min.y - height / 2, center.z);
    }
    
    // Union model with base
    const modelBrush = new Brush(geometry);
    const baseBrush = new Brush(baseGeometry);
    modelBrush.updateMatrixWorld();
    baseBrush.updateMatrixWorld();
    
    const result = evaluator.evaluate(modelBrush, baseBrush, ADDITION);
    
    return result.geometry;
  } catch (error) {
    console.error('Error adding base:', error);
    return geometry;
  }
}

/**
 * Generate support structures for overhangs
 * @param {THREE.BufferGeometry} geometry - Original geometry
 * @param {Object} options - Support options
 * @returns {THREE.BufferGeometry} - Geometry with supports added
 */
export function addSupports(geometry, options = {}) {
  try {
    const {
      overhangAngle = 45, // Angle threshold in degrees
      supportDensity = 0.01, // Distance between supports
      supportThickness = 0.001, // Support pillar thickness
    } = options;
    
    // Analyze geometry for overhangs
    const position = geometry.attributes.position;
    const normal = geometry.attributes.normal;
    const supportPoints = [];
    
    // Find faces that need support (normal.y < threshold)
    const angleThreshold = Math.cos(overhangAngle * Math.PI / 180);
    
    for (let i = 0; i < position.count; i += 3) {
      const nx = normal.getX(i);
      const ny = normal.getY(i);
      const nz = normal.getZ(i);
      
      // Check if face is an overhang (pointing down or sideways)
      if (ny < angleThreshold) {
        const x = position.getX(i);
        const y = position.getY(i);
        const z = position.getZ(i);
        supportPoints.push(new THREE.Vector3(x, y, z));
      }
    }
    
    // Get bounding box for support generation
    const boundingBox = new THREE.Box3().setFromBufferAttribute(position);
    const minY = boundingBox.min.y;
    
    // Create support pillars
    const supportGeometries = [];
    const addedSupports = new Set();
    
    supportPoints.forEach(point => {
      // Grid-snap support points to avoid too many
      const gridX = Math.round(point.x / supportDensity) * supportDensity;
      const gridZ = Math.round(point.z / supportDensity) * supportDensity;
      const key = `${gridX},${gridZ}`;
      
      if (!addedSupports.has(key) && point.y > minY + 0.001) {
        addedSupports.add(key);
        
        // Create cylindrical support from ground to point
        const height = point.y - minY;
        const supportGeom = new THREE.CylinderGeometry(
          supportThickness,
          supportThickness * 1.5, // Slightly wider at bottom
          height,
          8
        );
        supportGeom.translate(gridX, minY + height / 2, gridZ);
        supportGeometries.push(supportGeom);
      }
    });
    
    // Merge all supports with model
    if (supportGeometries.length === 0) {
      console.log('No supports needed for this model');
      return geometry;
    }
    
    // Merge support geometries
    let mergedSupports = supportGeometries[0];
    for (let i = 1; i < supportGeometries.length; i++) {
      const temp = new THREE.BufferGeometry();
      temp.setAttribute('position', 
        new THREE.BufferAttribute(
          new Float32Array([
            ...mergedSupports.attributes.position.array,
            ...supportGeometries[i].attributes.position.array
          ]),
          3
        )
      );
      mergedSupports = temp;
    }
    
    // Union model with supports
    const modelBrush = new Brush(geometry);
    const supportBrush = new Brush(mergedSupports);
    modelBrush.updateMatrixWorld();
    supportBrush.updateMatrixWorld();
    
    const result = evaluator.evaluate(modelBrush, supportBrush, ADDITION);
    
    console.log(`Generated ${supportGeometries.length} support structures`);
    return result.geometry;
  } catch (error) {
    console.error('Error adding supports:', error);
    return geometry;
  }
}

/**
 * Subtract one geometry from another (for creating holes)
 * @param {THREE.BufferGeometry} geometry - Main geometry
 * @param {THREE.BufferGeometry} subtractGeometry - Geometry to subtract
 * @returns {THREE.BufferGeometry} - Result geometry
 */
export function subtractGeometry(geometry, subtractGeometry) {
  try {
    const brushA = new Brush(geometry);
    const brushB = new Brush(subtractGeometry);
    brushA.updateMatrixWorld();
    brushB.updateMatrixWorld();
    
    const result = evaluator.evaluate(brushA, brushB, SUBTRACTION);
    return result.geometry;
  } catch (error) {
    console.error('Error in subtraction:', error);
    return geometry;
  }
}

/**
 * Union two geometries together
 * @param {THREE.BufferGeometry} geometryA - First geometry
 * @param {THREE.BufferGeometry} geometryB - Second geometry
 * @returns {THREE.BufferGeometry} - Result geometry
 */
export function unionGeometry(geometryA, geometryB) {
  try {
    const brushA = new Brush(geometryA);
    const brushB = new Brush(geometryB);
    brushA.updateMatrixWorld();
    brushB.updateMatrixWorld();
    
    const result = evaluator.evaluate(brushA, brushB, ADDITION);
    return result.geometry;
  } catch (error) {
    console.error('Error in union:', error);
    return geometryA;
  }
}

/**
 * Add drainage holes to a model (for resin printing)
 * @param {THREE.BufferGeometry} geometry - Original geometry
 * @param {Object} options - Hole options
 * @returns {THREE.BufferGeometry} - Geometry with holes
 */
export function addDrainageHoles(geometry, options = {}) {
  try {
    const {
      holeDiameter = 0.002, // 2mm holes
      holeCount = 2,
    } = options;
    
    const boundingBox = new THREE.Box3().setFromBufferAttribute(geometry.attributes.position);
    const size = boundingBox.getSize(new THREE.Vector3());
    const center = boundingBox.getCenter(new THREE.Vector3());
    
    let resultGeometry = geometry;
    
    // Create holes at bottom of model
    for (let i = 0; i < holeCount; i++) {
      const angle = (i / holeCount) * Math.PI * 2;
      const radius = Math.min(size.x, size.z) * 0.3;
      const x = center.x + Math.cos(angle) * radius;
      const z = center.z + Math.sin(angle) * radius;
      
      // Create cylinder for hole
      const holeGeometry = new THREE.CylinderGeometry(
        holeDiameter / 2,
        holeDiameter / 2,
        size.y,
        16
      );
      holeGeometry.translate(x, center.y, z);
      
      resultGeometry = subtractGeometry(resultGeometry, holeGeometry);
    }
    
    return resultGeometry;
  } catch (error) {
    console.error('Error adding drainage holes:', error);
    return geometry;
  }
}

/**
 * Apply geometry modification based on operation type
 * @param {THREE.BufferGeometry} geometry - Original geometry
 * @param {Object} operation - Operation details
 * @returns {THREE.BufferGeometry} - Modified geometry
 */
export function applyGeometryOperation(geometry, operation) {
  if (!geometry || !operation) return geometry;
  
  try {
    switch (operation.type) {
      case 'hollow':
        return createHollow(geometry, operation.wallThickness);
      
      case 'addBase':
        return addBase(geometry, operation.options);
      
      case 'addSupports':
        return addSupports(geometry, operation.options);
      
      case 'addHoles':
        return addDrainageHoles(geometry, operation.options);
      
      default:
        console.warn('Unknown geometry operation:', operation.type);
        return geometry;
    }
  } catch (error) {
    console.error('Error applying geometry operation:', error);
    return geometry;
  }
}
