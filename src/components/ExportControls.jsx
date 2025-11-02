import { useState } from 'react';
import { exportToSTL, createMeshFromType } from '../utils/stlExport';
import { isElectron, saveFile } from '../utils/electronUtils';
import './ExportControls.css';

const ExportControls = ({ selectedModel, onModelImport }) => {
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

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.name.toLowerCase().endsWith('.stl')) {
      const fileName = file.name.replace(/\.stl$/i, '');
      
      try {
        // Convert file to blob and use our unified save function
        const blob = new Blob([await file.arrayBuffer()], { type: 'application/sla' });
        const suggestedName = `print_${fileName}.stl`;
        
        const savedPath = await saveFile(blob, suggestedName);
        
        if (savedPath) {
          alert(`🖨️ ${fileName} ready for printing!\n\n✅ Saved: ${typeof savedPath === 'string' ? savedPath : suggestedName}\n\nNext steps:\n1. Open in your slicer (Cura, PrusaSlicer, etc.)\n2. Configure settings and slice\n3. Send to your 3D printer\n\nTip: Save to your printer's watch folder!`);
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          return;
        }
        console.error('Print error:', error);
        alert('❌ Error preparing file for printer. Please try again.');
      }
    } else {
      alert('❌ Please drop a valid STL file');
    }
  };
  const handleExport = async () => {
    if (!selectedModel) {
      alert('Please select a model first');
      return;
    }

    try {
      // Show loading message
      alert('⏳ Loading model for export...');
      
      // Create mesh from selected model type
      const mesh = await createMeshFromType(selectedModel.name);
      
      // Export to STL
      const filename = `${selectedModel.name.toLowerCase()}_${Date.now()}.stl`;
      const success = exportToSTL(mesh, filename);
      
      if (success) {
        alert(`✅ ${selectedModel.name} exported successfully as ${filename}`);
      } else {
        alert('❌ Error exporting model. Please try again.');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('❌ Error loading model for export. Please try again.');
    }
  };

  const handleSendToPrinter = async () => {
    if (!selectedModel) {
      alert('Please select a model first');
      return;
    }

    try {
      // Generate the STL file
      const mesh = await createMeshFromType(selectedModel.name);
      const exporter = new (await import('three/examples/jsm/exporters/STLExporter')).STLExporter();
      const result = exporter.parse(mesh, { binary: true });
      
      const filename = `${selectedModel.name.toLowerCase()}_print.stl`;
      const blob = new Blob([result], { type: 'application/sla' });

      // Use native save dialog (works in both Electron and modern browsers)
      const savedPath = await saveFile(blob, filename);
      
      if (savedPath) {
        alert(`🖨️ File ready for printing!\n\n✅ Saved: ${typeof savedPath === 'string' ? savedPath : filename}\n\nNext steps:\n1. Open in your slicer software (Cura, PrusaSlicer, etc.)\n2. Configure print settings\n3. Send to your 3D printer\n\nTip: Save to your printer's watch folder for automatic detection!`);
      }
      
    } catch (error) {
      console.error('Send to printer error:', error);
      if (error.name !== 'AbortError') {
        alert('❌ Error preparing file for printer. Please try again.');
      }
    }
  };



  return (
    <div 
      className={`export-controls ${isDragging ? 'dragging' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="drag-overlay">
          <div className="drag-message">
            <p>�️</p>
            <p>Drop to print directly</p>
          </div>
        </div>
      )}
      <h2>📤 Export Options</h2>
      <div className="export-buttons">
        <button 
          onClick={handleExport}
          disabled={!selectedModel}
          className="export-btn download-btn"
        >
          <span className="btn-icon">💾</span>
          <div className="btn-content">
            <div className="btn-title">Download STL</div>
            <div className="btn-subtitle">Save file for printing</div>
          </div>
        </button>

        <button 
          onClick={handleSendToPrinter}
          disabled={!selectedModel}
          className="export-btn print-btn"
        >
          <span className="btn-icon">🖨️</span>
          <div className="btn-content">
            <div className="btn-title">Send to Printer</div>
            <div className="btn-subtitle">Direct print via USB/Network</div>
          </div>
        </button>
      </div>

      {selectedModel && (
        <div className="export-info">
          <p>✓ Ready to export: <strong>{selectedModel.name}</strong></p>
          <p className="info-text">
            STL files are optimized for 3D printing and compatible with all major slicers 
            (Cura, PrusaSlicer, Simplify3D, etc.)
          </p>
        </div>
      )}
    </div>
  );
};

export default ExportControls;
