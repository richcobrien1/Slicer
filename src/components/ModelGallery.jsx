import { useState } from 'react';
import './ModelGallery.css';

const ModelGallery = ({ onSelectModel }) => {
  // Kitchen utensil models - in production, these would come from a database/API
  const models = [
    { id: 1, name: 'Spoon', thumbnail: '🥄', description: 'Table spoon', modelPath: '/models/spoon.glb' },
    { id: 2, name: 'Fork', thumbnail: '🍴', description: 'Dinner fork', modelPath: '/models/fork.glb' },
    { id: 3, name: 'Knife', thumbnail: '🔪', description: 'Kitchen knife', modelPath: '/models/knife.glb' },
    { id: 4, name: 'Spatula', thumbnail: '🍳', description: 'Cooking spatula', modelPath: '/models/spatula.glb' },
    { id: 5, name: 'Whisk', thumbnail: '🥣', description: 'Wire whisk', modelPath: '/models/whisk.glb' },
    { id: 6, name: 'Ladle', thumbnail: '🥘', description: 'Soup ladle', modelPath: '/models/ladle.glb' },
    { id: 7, name: 'Peeler', thumbnail: '�', description: 'Vegetable peeler', modelPath: '/models/peeler.glb' },
    { id: 8, name: 'Tongs', thumbnail: '🦞', description: 'Kitchen tongs', modelPath: '/models/tongs.glb' },
    { id: 9, name: 'Grater', thumbnail: '⚙️', description: 'Cheese grater', modelPath: '/models/grater.glb' },
    { id: 10, name: 'Masher', thumbnail: '�', description: 'Potato masher', modelPath: '/models/masher.glb' },
    { id: 11, name: 'Turner', thumbnail: '🍔', description: 'Food turner', modelPath: '/models/turner.glb' },
    { id: 12, name: 'Strainer', thumbnail: '🧺', description: 'Mesh strainer', modelPath: '/models/strainer.glb' },
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
