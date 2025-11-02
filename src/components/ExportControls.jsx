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
      // Generate the STL file
      alert('⏳ Preparing model for printing...');
      const mesh = await createMeshFromType(selectedModel.name);
      const exporter = new (await import('three/examples/jsm/exporters/STLExporter')).STLExporter();
      const result = exporter.parse(mesh, { binary: true });
      
      const filename = `${selectedModel.name.toLowerCase()}_print.stl`;
      
      // Create a blob from the STL data
      const blob = new Blob([result], { type: 'application/sla' });
      const url = URL.createObjectURL(blob);
      
      // Trigger browser's print dialog
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = url;
      document.body.appendChild(iframe);
      
      // Wait for iframe to load then trigger print
      iframe.onload = () => {
        try {
          // Try to trigger print dialog
          iframe.contentWindow.print();
          
          // Clean up after a delay
          setTimeout(() => {
            document.body.removeChild(iframe);
            URL.revokeObjectURL(url);
          }, 1000);
          
          alert(`🖨️ Print dialog opened!\n\nIf print dialog didn't appear:\n1. Check your printer is connected\n2. Your browser may have blocked the print dialog\n3. Try the "Download STL" option instead`);
        } catch (printError) {
          console.error('Print dialog error:', printError);
          // Fallback to file save picker
          document.body.removeChild(iframe);
          URL.revokeObjectURL(url);
          fallbackToSavePicker(result, filename);
        }
      };
      
    } catch (error) {
      console.error('Send to printer error:', error);
      alert('❌ Error preparing file for printer. Please try again.');
    }
  };

  const fallbackToSavePicker = async (result, filename) => {
    try {
      if ('showSaveFilePicker' in window) {
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
        
        alert(`✅ File saved!\n\nSave to your printer's watch folder or import into your slicer.`);
      } else {
        // Final fallback - direct download
        const blob = new Blob([result], { type: 'application/sla' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert(`📥 File downloaded! Import into your slicer to print.`);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Fallback save error:', error);
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
