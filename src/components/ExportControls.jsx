import { exportToSTL, createMeshFromType } from '../utils/stlExport';
import './ExportControls.css';

const ExportControls = ({ selectedModel }) => {
  const handleExport = () => {
    if (!selectedModel) {
      alert('Please select a model first');
      return;
    }

    // Create mesh from selected model type
    const mesh = createMeshFromType(selectedModel.name);
    
    // Export to STL
    const filename = `${selectedModel.name.toLowerCase()}_${Date.now()}.stl`;
    const success = exportToSTL(mesh, filename);
    
    if (success) {
      alert(`✅ ${selectedModel.name} exported successfully as ${filename}`);
    } else {
      alert('❌ Error exporting model. Please try again.');
    }
  };

  const handleSendToPrinter = () => {
    if (!selectedModel) {
      alert('Please select a model first');
      return;
    }

    // Simulate sending to printer
    alert(`🖨️ Sending ${selectedModel.name} to printer...\n\nIn production, this would connect to your 3D printer via:\n- USB connection\n- Network (Wi-Fi/Ethernet)\n- Cloud printing service\n- Printer software API (OctoPrint, etc.)`);
  };

  return (
    <div className="export-controls">
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
