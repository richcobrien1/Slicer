import { useState } from 'react';
import './ModelGallery.css';

const ModelGallery = ({ onSelectModel }) => {
  // Refined jewelry and accessory models - in production, these would come from a database/API
  const models = [
    { id: 1, name: 'Ring', thumbnail: 'í²', description: 'Diamond ring', modelPath: '/models/ring.glb' },
    { id: 2, name: 'Watch', thumbnail: 'âŒš', description: 'Wrist watch', modelPath: '/models/watch.glb' },
    { id: 3, name: 'Pendant', thumbnail: 'í³¿', description: 'Heart pendant', modelPath: '/models/pendant.glb' },
    { id: 4, name: 'Bracelet', thumbnail: 'í³¿', description: 'Chain bracelet', modelPath: '/models/bracelet.glb' },
    { id: 5, name: 'Earring', thumbnail: 'í²Ž', description: 'Stud earring', modelPath: '/models/earring.glb' },
    { id: 6, name: 'Crown', thumbnail: 'í±‘', description: 'Royal crown', modelPath: '/models/crown.glb' },
    { id: 7, name: 'Brooch', thumbnail: 'í´±', description: 'Pin brooch', modelPath: '/models/brooch.glb' },
    { id: 8, name: 'Locket', thumbnail: 'í´’', description: 'Photo locket', modelPath: '/models/locket.glb' },
    { id: 9, name: 'Cufflink', thumbnail: 'í´˜', description: 'Dress cufflink', modelPath: '/models/cufflink.glb' },
    { id: 10, name: 'Necklace', thumbnail: 'í³¿', description: 'Pearl necklace', modelPath: '/models/necklace.glb' },
    { id: 11, name: 'Anklet', thumbnail: 'â›“ï¸', description: 'Chain anklet', modelPath: '/models/anklet.glb' },
    { id: 12, name: 'Tiara', thumbnail: 'í±¸', description: 'Princess tiara', modelPath: '/models/tiara.glb' },
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
