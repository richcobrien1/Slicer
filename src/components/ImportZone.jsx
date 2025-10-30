import { useState } from 'react';
import './ImportZone.css';

const ImportZone = ({ onFileImport }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.name.toLowerCase().endsWith('.stl')) {
      onFileImport(file);
    } else {
      alert('❌ Please drop a valid STL file');
    }
  };

  const handleClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.stl';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        onFileImport(file);
      }
    };
    
    input.click();
  };

  return (
    <div 
      className={`import-zone ${isDragging ? 'dragging' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <div className="import-content">
        <div className="import-icon">📁</div>
        <h3>Import STL File</h3>
        <p className="import-instruction">
          {isDragging ? 'Drop your file here!' : 'Drag & drop or click to browse'}
        </p>
        <div className="import-formats">
          <span className="format-badge">STL</span>
          <span className="format-badge">Binary</span>
          <span className="format-badge">ASCII</span>
        </div>
      </div>
    </div>
  );
};

export default ImportZone;
