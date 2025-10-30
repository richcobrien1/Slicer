import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import * as THREE from 'three';

// Helper function to create S shape - must be defined first
function createSShape() {
  const shape = new THREE.Shape();
  
  // Top curve of S
  shape.moveTo(0.2, 0.6);
  shape.bezierCurveTo(0.6, 0.6, 0.6, 0.3, 0.3, 0.3);
  
  // Middle to bottom curve
  shape.bezierCurveTo(0, 0.3, 0, 0, 0.3, 0);
  shape.bezierCurveTo(0.6, 0, 0.6, -0.3, 0.2, -0.3);
  
  // Inner cutout (make it hollow)
  const hole = new THREE.Path();
  hole.moveTo(0.25, 0.5);
  hole.bezierCurveTo(0.45, 0.5, 0.45, 0.35, 0.3, 0.35);
  hole.bezierCurveTo(0.15, 0.35, 0.15, 0.15, 0.3, 0.15);
  hole.bezierCurveTo(0.45, 0.15, 0.45, -0.15, 0.25, -0.15);
  
  shape.holes.push(hole);
  
  return shape;
}

// 1. Bold "S" Letter Logo
export const SLetterLogo = () => {
  return (
    <mesh rotation={[0.3, 0.5, 0]}>
      <extrudeGeometry
        args={[
          createSShape(),
          {
            depth: 0.3,
            bevelEnabled: true,
            bevelThickness: 0.05,
            bevelSize: 0.05,
            bevelSegments: 3
          }
        ]}
      />
      <meshStandardMaterial 
        color="#ff9800" 
        metalness={0.8} 
        roughness={0.2}
        emissive="#ff6600"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
};

// 2. Slicing Blade Logo
export const SlicingBladeLogo = () => {
  return (
    <group rotation={[0.3, 0.5, 0]}>
      {/* Blade */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.5, 0.1, 0.3]} />
        <meshStandardMaterial 
          color="#c0c0c0" 
          metalness={0.95} 
          roughness={0.1}
        />
      </mesh>
      {/* Cutting edge glow */}
      <mesh position={[0, 0, 0]} scale={[1.05, 1.5, 1.05]}>
        <boxGeometry args={[1.5, 0.1, 0.3]} />
        <meshStandardMaterial 
          color="#ff9800" 
          transparent
          opacity={0.3}
          emissive="#ff9800"
          emissiveIntensity={1}
        />
      </mesh>
    </group>
  );
};

// 3. Layer Stack Logo
export const LayerStackLogo = () => {
  const layers = 5;
  return (
    <group rotation={[0.2, 0.4, 0]}>
      {Array.from({ length: layers }).map((_, i) => (
        <mesh key={i} position={[0, i * 0.15 - 0.3, 0]}>
          <boxGeometry args={[1, 0.08, 1]} />
          <meshStandardMaterial 
            color={i === layers - 1 ? "#ff9800" : "#6B6B6B"}
            metalness={0.6} 
            roughness={0.4}
            emissive={i === layers - 1 ? "#ff6600" : "#3A3A3A"}
            emissiveIntensity={i === layers - 1 ? 0.3 : 0.1}
          />
        </mesh>
      ))}
    </group>
  );
};

// 4. Geometric Cube Logo
export const GeometricCubeLogo = () => {
  return (
    <group rotation={[0.3, 0.5, 0.2]}>
      {/* Main cube */}
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color="#ff9800"
          metalness={0.7}
          roughness={0.3}
          wireframe={false}
        />
      </mesh>
      {/* Inner frame */}
      <mesh scale={0.7}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color="#ff9800"
          metalness={0.9}
          roughness={0.1}
          wireframe={true}
        />
      </mesh>
    </group>
  );
};

// 5. Printer Nozzle Logo
export const PrinterNozzleLogo = () => {
  return (
    <group rotation={[0.3, 0, 0]}>
      {/* Nozzle body */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.5, 6]} />
        <meshStandardMaterial 
          color="#6B6B6B"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      {/* Nozzle tip */}
      <mesh position={[0, -0.15, 0]}>
        <coneGeometry args={[0.3, 0.4, 6]} />
        <meshStandardMaterial 
          color="#ff9800"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      {/* Print stream effect */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.05, 0.08, 0.3, 8]} />
        <meshStandardMaterial 
          color="#ff9800"
          transparent
          opacity={0.6}
          emissive="#ff9800"
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
};

// 6. Abstract Spiral Logo
export const SpiralLogo = () => {
  const points = [];
  for (let i = 0; i < 50; i++) {
    const angle = (i / 50) * Math.PI * 4;
    const radius = 0.3 + (i / 50) * 0.3;
    points.push(
      new THREE.Vector3(
        Math.cos(angle) * radius,
        (i / 50) * 0.8 - 0.4,
        Math.sin(angle) * radius
      )
    );
  }
  const curve = new THREE.CatmullRomCurve3(points);
  
  return (
    <mesh rotation={[0.3, 0.5, 0]}>
      <tubeGeometry args={[curve, 64, 0.05, 8, false]} />
      <meshStandardMaterial 
        color="#ff9800"
        metalness={0.8}
        roughness={0.2}
        emissive="#ff6600"
        emissiveIntensity={0.3}
      />
    </mesh>
  );
};

// Wrapper component with Canvas
export const LogoIcon = ({ type = 'sletter' }) => {
  const logos = {
    sletter: SLetterLogo,
    blade: SlicingBladeLogo,
    layers: LayerStackLogo,
    cube: GeometricCubeLogo,
    nozzle: PrinterNozzleLogo,
    spiral: SpiralLogo
  };
  
  const LogoComponent = logos[type] || SLetterLogo;
  
  return (
    <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
      <Suspense fallback={null}>
        <ambientLight intensity={1} />
        <directionalLight position={[2, 2, 2]} intensity={1.5} />
        <directionalLight position={[-2, -1, -2]} intensity={0.5} />
        <LogoComponent />
      </Suspense>
    </Canvas>
  );
};
