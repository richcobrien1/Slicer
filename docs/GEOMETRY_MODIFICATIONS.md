# Geometry Modification Features

The Slicer app now supports actual geometry modifications using advanced 3D mesh operations. These features go beyond simple transformations (scale, rotate) to actually modify the mesh structure itself.

## 🔧 Technical Implementation

### Libraries Used
- **three-bvh-csg**: Industry-standard Constructive Solid Geometry (CSG) library
- **three-mesh-bvh**: Bounding Volume Hierarchy for efficient mesh operations
- **Three.js**: Core 3D rendering and geometry handling

### Core Module
All geometry operations are implemented in `src/utils/geometryOps.js` and integrated into `src/utils/meshTransform.js`.

## 🛠️ Available Operations

### 1. Hollowing
Creates a hollow version of your model with specified wall thickness - perfect for saving material and reducing print time.

**How it works:**
- Creates an inner scaled-down version of the geometry
- Uses CSG subtraction to remove inner volume from outer shell
- Preserves structural integrity while reducing material usage

**Voice Commands:**
- "Make it hollow"
- "Make it hollow with 2mm walls"
- "Make it hollow with 3mm walls"

**Parameters:**
- `wallThickness`: Wall thickness in meters (default: 0.002 = 2mm)

**Example Usage:**
```javascript
import { createHollow } from './utils/geometryOps';

const hollowedGeometry = createHollow(originalGeometry, 0.002);
```

---

### 2. Support Structure Generation
Automatically analyzes your model and generates support structures for overhanging features - essential for FDM printing.

**How it works:**
- Analyzes mesh normals to detect overhangs
- Identifies surfaces exceeding the overhang angle threshold
- Generates cylindrical support pillars from build plate to overhang points
- Grid-snaps supports to avoid excessive density

**Voice Commands:**
- "Add support structures"
- "Add supports"
- "Add supports for 45 degree overhangs"
- "Add supports for 60 degree overhangs"

**Parameters:**
- `overhangAngle`: Threshold angle in degrees (default: 45°)
- `supportDensity`: Distance between supports in meters (default: 0.01)
- `supportThickness`: Support pillar diameter in meters (default: 0.001)

**Example Usage:**
```javascript
import { addSupports } from './utils/geometryOps';

const supportedGeometry = addSupports(originalGeometry, {
  overhangAngle: 45,
  supportDensity: 0.01,
  supportThickness: 0.001
});
```

---

### 3. Base Platform Addition
Adds a solid base platform underneath your model to improve bed adhesion and stability.

**How it works:**
- Calculates model bounding box
- Creates rectangular or circular base geometry with margin
- Uses CSG union to merge base with model
- Positions base at bottom of model

**Types:**
- **Rectangular**: Best for most models, provides maximum contact area
- **Circular**: Aesthetic option, good for cylindrical models

**Voice Commands:**
- "Add a base"
- "Add a rectangular base"
- "Add a circular base"
- "Add a round base"

**Parameters:**
- `type`: 'rectangular' or 'circular' (default: 'rectangular')
- `height`: Base thickness in meters (default: 0.002 = 2mm)
- `margin`: Extra space around model in meters (default: 0.005 = 5mm)

**Example Usage:**
```javascript
import { addBase } from './utils/geometryOps';

const basedGeometry = addBase(originalGeometry, {
  type: 'rectangular',
  height: 0.002,
  margin: 0.005
});
```

---

### 4. Drainage Holes
Adds drainage holes to hollow models - critical for resin printing to allow uncured resin to drain out.

**How it works:**
- Analyzes model dimensions and position
- Creates cylindrical hole geometries at strategic locations
- Uses CSG subtraction to remove hole volumes from model
- Distributes holes evenly around model bottom

**Voice Commands:**
- "Add drainage holes"
- "Add 2 drainage holes"
- "Add 4 holes"
- "Add 3mm drainage holes"

**Parameters:**
- `holeDiameter`: Hole diameter in meters (default: 0.002 = 2mm)
- `holeCount`: Number of holes to add (default: 2)

**Example Usage:**
```javascript
import { addDrainageHoles } from './utils/geometryOps';

const holedGeometry = addDrainageHoles(originalGeometry, {
  holeDiameter: 0.002,
  holeCount: 2
});
```

---

### 5. Boolean Operations
Low-level CSG operations for advanced mesh manipulation.

**Operations Available:**
- **Subtraction**: Remove one geometry from another (creates holes, cutouts)
- **Union**: Merge two geometries into one
- **Intersection**: Keep only overlapping portions

**Example Usage:**
```javascript
import { subtractGeometry, unionGeometry } from './utils/geometryOps';

// Create a hole by subtracting a cylinder
const holeGeometry = new THREE.CylinderGeometry(0.005, 0.005, 0.1, 16);
const resultGeometry = subtractGeometry(modelGeometry, holeGeometry);

// Merge two models
const mergedGeometry = unionGeometry(modelA, modelB);
```

---

## 🎤 AI Voice Integration

All geometry operations are integrated with the AI voice assistant. The local pattern matching recognizes natural language commands and converts them to geometry operations.

### Supported Command Patterns

**Hollowing:**
- "hollow" keyword triggers operation
- Extracts wall thickness from phrases like "2mm", "3mm walls"
- Default: 2mm walls

**Support Structures:**
- "support" keyword triggers operation
- Extracts angle from phrases like "45 degrees", "60 degree overhangs"
- Default: 45° overhang threshold

**Base Platforms:**
- "base" or "platform" keywords trigger operation
- "circle", "round", "circular" → circular base
- Otherwise → rectangular base
- Fixed margins: 5mm, height: 2mm

**Drainage Holes:**
- "hole" or "drain" keywords trigger operation
- Extracts count from phrases like "2 holes", "4 drainage holes"
- Extracts diameter from phrases like "3mm", "5mm holes"
- Defaults: 2 holes, 2mm diameter

---

## 📐 Units and Measurements

All internal operations use **meters** as the base unit, but voice commands accept **millimeters** for user convenience.

**Conversions:**
- Wall thickness: `mm / 1000` → meters
- Hole diameter: `mm / 1000` → meters
- Base height: `mm / 1000` → meters
- Margins: `mm / 1000` → meters

**Default Values:**
- Wall thickness: 2mm (0.002m)
- Support thickness: 1mm (0.001m)
- Support density: 10mm (0.01m)
- Base height: 2mm (0.002m)
- Base margin: 5mm (0.005m)
- Hole diameter: 2mm (0.002m)

---

## 🔄 Integration with Existing Features

### meshTransform.js Integration
The geometry operations are integrated into the existing transformation pipeline:

```javascript
// Updated functions use real CSG operations
function hollowMesh(mesh, { wallThickness = 0.002 }) {
  const hollowedGeometry = createHollow(mesh.geometry.clone(), wallThickness);
  mesh.geometry = hollowedGeometry;
  return mesh;
}

function addSupports(mesh, { angle = 45, density = 0.01, thickness = 0.001 }) {
  const supportedGeometry = addGeometrySupports(mesh.geometry.clone(), {
    overhangAngle: angle,
    supportDensity: density,
    supportThickness: thickness
  });
  mesh.geometry = supportedGeometry;
  return mesh;
}
```

### AI Service Integration
Pattern matching in `aiService.js` recognizes geometry commands:

```javascript
// Hollow detection
if (lower.includes('hollow')) {
  const wallMatch = lower.match(/(\d+)\s*mm/);
  const thickness = wallMatch ? parseFloat(wallMatch[1]) / 1000 : 0.002;
  return { 
    operation: 'hollow', 
    parameters: { wallThickness: thickness }, 
    explanation: `Making model hollow with ${wallMatch ? wallMatch[1] : 2}mm walls` 
  };
}

// Support detection
if (lower.includes('support')) {
  const angleMatch = lower.match(/(\d+)\s*degree/);
  const angle = angleMatch ? parseFloat(angleMatch[1]) : 45;
  return { 
    operation: 'support', 
    parameters: { angle, density: 0.01, thickness: 0.001 }, 
    explanation: `Adding support structures for overhangs > ${angle}°` 
  };
}
```

---

## 🧪 Testing

To test geometry modifications:

1. **Hollowing Test:**
   ```
   Voice: "Make it hollow with 2mm walls"
   Expected: Model becomes hollow shell, significant volume reduction
   ```

2. **Support Test:**
   ```
   Voice: "Add support structures"
   Expected: Cylindrical supports appear under overhangs
   ```

3. **Base Test:**
   ```
   Voice: "Add a rectangular base"
   Expected: Solid platform appears beneath model with 5mm margin
   ```

4. **Drainage Holes Test:**
   ```
   Voice: "Add 2 drainage holes"
   Expected: 2mm holes appear at bottom of model
   ```

---

## ⚠️ Known Limitations

1. **Performance**: CSG operations on complex meshes (>100k vertices) may take several seconds
2. **Memory**: Large models require significant memory for boolean operations
3. **Support Generation**: May create excessive supports on very detailed models
4. **Hollowing**: Wall thickness must be reasonable relative to model size
5. **Error Handling**: If CSG operation fails, original geometry is returned

---

## 🚀 Future Enhancements

Potential improvements for geometry operations:

- [ ] Adaptive support generation (thinner supports for lighter models)
- [ ] Custom support shapes (tree supports, conical supports)
- [ ] Lattice infill patterns for hollow models
- [ ] Automatic hole placement optimization for drainage
- [ ] Raft and brim generation
- [ ] Text/logo embossing on models
- [ ] Automatic model repair (fix non-manifold edges, holes)
- [ ] Variable wall thickness for hollowing
- [ ] Support interface layers
- [ ] Multi-material support structures

---

## 📚 API Reference

### createHollow(geometry, wallThickness)
Creates hollow version of geometry.

**Parameters:**
- `geometry` (THREE.BufferGeometry): Original geometry
- `wallThickness` (number): Wall thickness in meters

**Returns:** THREE.BufferGeometry

---

### addBase(geometry, options)
Adds base platform to geometry.

**Parameters:**
- `geometry` (THREE.BufferGeometry): Original geometry
- `options` (Object):
  - `type` (string): 'rectangular' or 'circular'
  - `height` (number): Base height in meters
  - `margin` (number): Margin around model in meters

**Returns:** THREE.BufferGeometry

---

### addSupports(geometry, options)
Generates support structures.

**Parameters:**
- `geometry` (THREE.BufferGeometry): Original geometry
- `options` (Object):
  - `overhangAngle` (number): Threshold in degrees
  - `supportDensity` (number): Spacing in meters
  - `supportThickness` (number): Pillar diameter in meters

**Returns:** THREE.BufferGeometry

---

### addDrainageHoles(geometry, options)
Adds drainage holes for resin printing.

**Parameters:**
- `geometry` (THREE.BufferGeometry): Original geometry
- `options` (Object):
  - `holeDiameter` (number): Hole diameter in meters
  - `holeCount` (number): Number of holes

**Returns:** THREE.BufferGeometry

---

### subtractGeometry(geometryA, geometryB)
Boolean subtraction operation.

**Parameters:**
- `geometryA` (THREE.BufferGeometry): Main geometry
- `geometryB` (THREE.BufferGeometry): Geometry to subtract

**Returns:** THREE.BufferGeometry

---

### unionGeometry(geometryA, geometryB)
Boolean union operation.

**Parameters:**
- `geometryA` (THREE.BufferGeometry): First geometry
- `geometryB` (THREE.BufferGeometry): Second geometry

**Returns:** THREE.BufferGeometry

---

## 💡 Tips for Best Results

1. **Hollowing:**
   - Use wall thickness of at least 1.5mm for FDM printing
   - Use wall thickness of at least 2mm for resin printing
   - Thicker walls = stronger models

2. **Support Structures:**
   - 45° is standard for PLA
   - Use 60° for better bridging materials (PETG, ABS)
   - Reduce support density for cleaner removal

3. **Base Platforms:**
   - Use rectangular bases for maximum bed adhesion
   - Use circular bases for aesthetic models
   - Increase margin for unstable models

4. **Drainage Holes:**
   - Always use for hollow resin prints
   - Place at lowest points for best drainage
   - 2-4 holes is usually sufficient

---

## 📝 Version History

**v1.0.0** - Initial Implementation
- Basic hollowing with CSG subtraction
- Support structure generation with overhang analysis
- Rectangular and circular base platforms
- Drainage hole generation
- Boolean operations (union, subtract, intersect)
- AI voice command integration
- Local pattern matching for geometry commands
