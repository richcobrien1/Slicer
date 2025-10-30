import { useState } from 'react';
import { exportToSTL, createMeshFromType } from '../utils/stlExport';
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
      const fileName = file.name.replace('.stl', '');
      
      try {
        // Check if File System Access API is available
        if ('showSaveFilePicker' in window) {
          // Read the file as ArrayBuffer for direct printing
          const arrayBuffer = await file.arrayBuffer();
          
          const options = {
            suggestedName: `print_${fileName}.stl`,
            types: [{
              description: 'STL Files',
              accept: { 'application/sla': ['.stl'] }
            }]
          };
          
          const handle = await window.showSaveFilePicker(options);
          const writable = await handle.createWritable();
          await writable.write(arrayBuffer);
          await writable.close();
          
          alert(`🖨️ ${fileName} sent to printer!\n\nNext steps:\n1. Configure print settings in your slicer\n2. Send to printer\n\nFile saved to your printer's folder.`);
        } else {
          // Fallback - download the file
          const url = URL.createObjectURL(file);
          const a = document.createElement('a');
          a.href = url;
          a.download = `print_${fileName}.stl`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          alert(`🖨️ ${fileName} ready for printing!\n\nFile downloaded. Import into your slicer software to print.`);
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
      // Check if File System Access API is available
      if ('showSaveFilePicker' in window) {
        // Modern approach - let user choose where to save (e.g., printer's watch folder)
        const mesh = await createMeshFromType(selectedModel.name);
        const exporter = new (await import('three/examples/jsm/exporters/STLExporter')).STLExporter();
        const result = exporter.parse(mesh, { binary: true });
        
        const filename = `${selectedModel.name.toLowerCase()}_print.stl`;
        
        const options = {
          suggestedName: filename,
          types: [{
            description: 'STL Files',
            accept: { 'application/sla': ['.stl'] }
          }]
        };
        
        const handle = await window.showSaveFilePicker(options);
        const writable = await handle.createWritable();
        await writable.write(result);
        await writable.close();
        
        alert(`✅ File saved!\n\nNext steps:\n1. Your slicer software should detect the file\n2. Configure print settings\n3. Send to printer\n\nTip: Save directly to your slicer's watch folder for auto-import!`);
      } else {
        // Fallback - just download the file
        alert('⏳ Loading model...');
        const mesh = await createMeshFromType(selectedModel.name);
        const filename = `${selectedModel.name.toLowerCase()}_print.stl`;
        exportToSTL(mesh, filename);
        
        alert(`📥 File downloaded!\n\nNext steps:\n1. Open your slicer (Cura, PrusaSlicer, etc.)\n2. Import the downloaded STL file\n3. Configure settings and slice\n4. Send to your 3D printer\n\nTip: Most printers accept files via:\n- SD card\n- USB cable\n- Network (OctoPrint, WiFi)`);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        // User cancelled the file picker
        return;
      }
      console.error('Send to printer error:', error);
      alert('❌ Error preparing file for printer. Please try again.');
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
