import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';
import * as THREE from 'three';

export const exportToSTL = (mesh, filename = 'model.stl') => {
  const exporter = new STLExporter();
  const result = exporter.parse(mesh, { binary: true });
  const blob = new Blob([result], { type: 'application/octet-stream' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

export const createMeshFromType = (modelType) => {
  const group = new THREE.Group();
  const gold = 0xFFD700;
  const silver = 0xC0C0C0;
  const diamond = 0xB9F2FF;
  
  const metalMaterial = new THREE.MeshStandardMaterial({ 
    color: gold, 
    metalness: 0.9, 
    roughness: 0.1 
  });
  
  const gemMaterial = new THREE.MeshStandardMaterial({ 
    color: diamond, 
    metalness: 0.1, 
    roughness: 0.05,
    transparent: true,
    opacity: 0.9
  });

  switch (modelType) {
    case 'Ring': {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.5, 0.08, 32, 64),
        metalMaterial
      );
      ring.rotation.x = Math.PI / 2;
      group.add(ring);
      const gem = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.2, 0),
        gemMaterial
      );
      gem.position.y = 0.3;
      group.add(gem);
      break;
    }
    case 'Watch': {
      const face = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.4, 0.15, 64),
        new THREE.MeshStandardMaterial({ color: silver, metalness: 0.9, roughness: 0.1 })
      );
      face.rotation.x = Math.PI / 2;
      group.add(face);
      
      const band1 = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 1.2, 0.1),
        new THREE.MeshStandardMaterial({ color: silver, metalness: 0.9, roughness: 0.1 })
      );
      band1.position.z = 0.5;
      group.add(band1);
      
      const band2 = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 1.2, 0.1),
        new THREE.MeshStandardMaterial({ color: silver, metalness: 0.9, roughness: 0.1 })
      );
      band2.position.z = -0.5;
      group.add(band2);
      break;
    }
    case 'Pendant': {
      const gem = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 32, 32),
        new THREE.MeshStandardMaterial({ color: 0xFF1493, metalness: 0.9, roughness: 0.1 })
      );
      group.add(gem);
      const loop = new THREE.Mesh(
        new THREE.TorusGeometry(0.15, 0.03, 16, 32),
        metalMaterial
      );
      loop.position.y = 0.4;
      group.add(loop);
      break;
    }
    case 'Bracelet': {
      for (let i = 0; i < 8; i++) {
        const link = new THREE.Mesh(
          new THREE.TorusGeometry(0.7, 0.05, 16, 32),
          metalMaterial
        );
        link.rotation.z = (Math.PI * 2 * i) / 8;
        link.position.x = Math.cos((Math.PI * 2 * i) / 8) * 0.1;
        link.position.y = Math.sin((Math.PI * 2 * i) / 8) * 0.1;
        group.add(link);
      }
      break;
    }
    case 'Earring': {
      const hook = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.6, 16),
        metalMaterial
      );
      hook.position.y = 0.3;
      group.add(hook);
      const gem = new THREE.Mesh(
        new THREE.SphereGeometry(0.15, 32, 32),
        gemMaterial
      );
      gem.position.y = -0.1;
      group.add(gem);
      break;
    }
    case 'Crown': {
      const base = new THREE.Mesh(
        new THREE.TorusGeometry(0.8, 0.05, 16, 64),
        metalMaterial
      );
      group.add(base);
      for (let i = 0; i < 8; i++) {
        const spike = new THREE.Mesh(
          new THREE.CylinderGeometry(0.03, 0.05, 0.8, 16),
          metalMaterial
        );
        spike.position.set(
          Math.cos((Math.PI * 2 * i) / 8) * 0.8,
          0.4,
          Math.sin((Math.PI * 2 * i) / 8) * 0.8
        );
        group.add(spike);
        const jewel = new THREE.Mesh(
          new THREE.SphereGeometry(0.08, 16, 16),
          new THREE.MeshStandardMaterial({ color: 0x8B0000, metalness: 0.9, roughness: 0.1 })
        );
        jewel.position.set(
          Math.cos((Math.PI * 2 * i) / 8) * 0.8,
          0.8,
          Math.sin((Math.PI * 2 * i) / 8) * 0.8
        );
        group.add(jewel);
      }
      break;
    }
    case 'Brooch': {
      const knot = new THREE.Mesh(
        new THREE.TorusKnotGeometry(0.4, 0.08, 128, 16),
        new THREE.MeshStandardMaterial({ color: silver, metalness: 0.9, roughness: 0.1 })
      );
      group.add(knot);
      const gem = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 32, 32),
        gemMaterial
      );
      group.add(gem);
      break;
    }
    case 'Locket': {
      const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.4, 0.1, 64),
        metalMaterial
      );
      group.add(body);
      const loop = new THREE.Mesh(
        new THREE.TorusGeometry(0.1, 0.02, 16, 32),
        metalMaterial
      );
      loop.position.y = 0.5;
      group.add(loop);
      break;
    }
    case 'Cufflink': {
      const face = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.3, 0.08, 32),
        new THREE.MeshStandardMaterial({ color: silver, metalness: 0.9, roughness: 0.1 })
      );
      group.add(face);
      const connector = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 0.4, 16),
        new THREE.MeshStandardMaterial({ color: silver, metalness: 0.9, roughness: 0.1 })
      );
      connector.rotation.x = Math.PI / 2;
      connector.position.z = -0.3;
      group.add(connector);
      break;
    }
    case 'Necklace': {
      for (let i = 0; i < 20; i++) {
        const angle = (Math.PI * i) / 10 - Math.PI / 2;
        const pearl = new THREE.Mesh(
          new THREE.SphereGeometry(0.08, 16, 16),
          new THREE.MeshStandardMaterial({ color: 0xFFF5EE, metalness: 0.9, roughness: 0.1 })
        );
        pearl.position.set(
          Math.cos(angle) * 1.2,
          Math.sin(angle) * 0.3,
          0
        );
        group.add(pearl);
      }
      break;
    }
    case 'Anklet': {
      const band = new THREE.Mesh(
        new THREE.TorusGeometry(0.6, 0.03, 16, 64),
        new THREE.MeshStandardMaterial({ color: silver, metalness: 0.9, roughness: 0.1 })
      );
      group.add(band);
      for (let i = 0; i < 6; i++) {
        const charm = new THREE.Mesh(
          new THREE.SphereGeometry(0.05, 16, 16),
          gemMaterial
        );
        charm.position.set(
          Math.cos((Math.PI * 2 * i) / 6) * 0.6,
          Math.sin((Math.PI * 2 * i) / 6) * 0.6,
          -0.1
        );
        group.add(charm);
      }
      break;
    }
    case 'Tiara': {
      const base = new THREE.Mesh(
        new THREE.TorusGeometry(0.7, 0.04, 16, 64),
        new THREE.MeshStandardMaterial({ color: silver, metalness: 0.9, roughness: 0.1 })
      );
      base.position.y = -0.3;
      group.add(base);
      for (let i = 0; i < 5; i++) {
        const angle = (Math.PI * (i - 2)) / 6;
        const height = 0.5 + Math.cos(angle) * 0.3;
        const spike = new THREE.Mesh(
          new THREE.CylinderGeometry(0.02, 0.03, height, 16),
          new THREE.MeshStandardMaterial({ color: silver, metalness: 0.9, roughness: 0.1 })
        );
        spike.position.set(
          Math.sin(angle) * 0.7,
          height / 2 - 0.3,
          0
        );
        spike.rotation.z = -angle * 0.5;
        group.add(spike);
        const gem = new THREE.Mesh(
          new THREE.OctahedronGeometry(0.08, 0),
          gemMaterial
        );
        gem.position.set(
          Math.sin(angle) * 0.7,
          height - 0.3,
          0
        );
        group.add(gem);
      }
      break;
    }
    default: {
      const defaultMesh = new THREE.Mesh(
        new THREE.TorusGeometry(0.5, 0.1, 32, 64),
        metalMaterial
      );
      group.add(defaultMesh);
    }
  }

  return group;
};
