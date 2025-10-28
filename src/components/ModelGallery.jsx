import { useState } from 'react';
import './ModelGallery.css';

const ModelGallery = ({ onSelectModel }) => {
  // Sample 3D models - in production, these would come from a database/API
  const models = [
    { id: 1, name: 'Cube', thumbnail: '📦', description: 'Simple cube', modelPath: '/models/cube.glb' },
    { id: 2, name: 'Sphere', thumbnail: '⚽', description: 'Round sphere', modelPath: '/models/sphere.glb' },
    { id: 3, name: 'Cylinder', thumbnail: '🥫', description: 'Cylinder shape', modelPath: '/models/cylinder.glb' },
    { id: 4, name: 'Cone', thumbnail: '🔺', description: 'Cone shape', modelPath: '/models/cone.glb' },
    { id: 5, name: 'Torus', thumbnail: '🍩', description: 'Donut/ring shape', modelPath: '/models/torus.glb' },
    { id: 6, name: 'Pyramid', thumbnail: '🔼', description: 'Pyramid shape', modelPath: '/models/pyramid.glb' },
    { id: 7, name: 'Tetrahedron', thumbnail: '🔷', description: 'Tetrahedron', modelPath: '/models/tetrahedron.glb' },
    { id: 8, name: 'Octahedron', thumbnail: '💠', description: 'Octahedron', modelPath: '/models/octahedron.glb' },
    { id: 9, name: 'Dodecahedron', thumbnail: '⬢', description: 'Dodecahedron', modelPath: '/models/dodecahedron.glb' },
    { id: 10, name: 'Icosahedron', thumbnail: '💎', description: 'Icosahedron', modelPath: '/models/icosahedron.glb' },
    { id: 11, name: 'Ring', thumbnail: '⭕', description: 'Ring shape', modelPath: '/models/ring.glb' },
    { id: 12, name: 'Capsule', thumbnail: '💊', description: 'Capsule shape', modelPath: '/models/capsule.glb' },
  ];

  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = (model) => {
    setSelectedId(model.id);
    onSelectModel(model);
  };

  return (
    <div className="model-gallery">
      <h2>Select a 3D Model</h2>
      <div className="gallery-grid">
        {models.map((model) => (
          <div
            key={model.id}
            className={`model-card ${selectedId === model.id ? 'selected' : ''}`}
            onClick={() => handleSelect(model)}
          >
            <div className="model-thumbnail">{model.thumbnail}</div>
            <h3>{model.name}</h3>
            <p>{model.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModelGallery;
