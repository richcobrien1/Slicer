import { useState } from 'react';
import { exportToSTL, createMeshFromType } from '../utils/stlExport';
import { isElectron, saveFile } from '../utils/electronUtils';
import { sendToPrinter } from '../utils/printerIntegration';
import { getDefaultPrinter } from '../utils/printerProfiles';
import PrinterDialog from './PrinterDialog';
import './ExportControls.css';

const ExportControls = ({ selectedModel, onModelImport }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preferredSlicer, setPreferredSlicer] = useState(() => {
    return localStorage.getItem('preferredSlicer') || null;
  });
  const [showSlicerSetup, setShowSlicerSetup] = useState(false);
  const [showPrinterDialog, setShowPrinterDialog] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendProgress, setSendProgress] = useState(null);

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

    // Check if default printer is configured
    const defaultPrinter = getDefaultPrinter();
    
    // If no default printer, open printer dialog
    if (!defaultPrinter) {
      setShowPrinterDialog(true);
      return;
    }

    // Send to default printer
    await sendToPrinterWithProfile(defaultPrinter);
  };

  const sendToPrinterWithProfile = async (printerProfile) => {
    if (!selectedModel) return;

    try {
      setIsSending(true);
      setSendProgress({ message: 'Generating STL...', percent: 0 });

      // Generate the STL file
      const mesh = await createMeshFromType(selectedModel.name);
      const exporter = new (await import('three/examples/jsm/exporters/STLExporter')).STLExporter();
      const result = exporter.parse(mesh, { binary: true });
      
      const filename = `${selectedModel.name.toLowerCase()}_print.stl`;
      const blob = new Blob([result], { type: 'application/sla' });

      setSendProgress({ message: 'Sending to printer...', percent: 50 });

      // Send to printer
      await sendToPrinter(blob, filename, printerProfile, (progress) => {
        setSendProgress(progress);
      });

      setSendProgress({ message: 'Success!', percent: 100 });
      
      // Show success message
      let successMessage = `✅ File sent successfully to ${printerProfile.name}!`;
      
      if (printerProfile.connectionType === 'slicer') {
        successMessage += '\n\n🎯 Slicer should open automatically.\nConfigure your print settings and slice to G-code.';
      } else if (printerProfile.connectionType === 'octoprint' || 
                 printerProfile.connectionType === 'klipper' || 
                 printerProfile.connectionType === 'prusalink') {
        successMessage += '\n\n🖨️ File uploaded to printer.\nSelect it in your printer interface to start printing.';
      }
      
      alert(successMessage);
      
      // Clear progress after short delay
      setTimeout(() => {
        setSendProgress(null);
        setIsSending(false);
      }, 1500);
      
    } catch (error) {
      console.error('Send to printer error:', error);
      setSendProgress(null);
      setIsSending(false);
      
      if (error.name !== 'AbortError') {
        alert(`❌ Error: ${error.message || 'Failed to send to printer. Please check your printer settings and try again.'}`);
      }
    }
  };

  const handlePrinterSelect = async (printer) => {
    setShowPrinterDialog(false);
    if (printer) {
      await sendToPrinterWithProfile(printer);
    }
  };

  const detectSlicerPaths = () => {
    // Common slicer installation paths
    const slicers = [];
    
    // Windows paths
    if (navigator.platform.includes('Win')) {
      slicers.push(
        { name: 'Ultimaker Cura', path: 'C:\\Program Files\\Ultimaker Cura\\Cura.exe', protocol: 'cura://' },
        { name: 'PrusaSlicer', path: 'C:\\Program Files\\Prusa3D\\PrusaSlicer\\prusa-slicer.exe', protocol: 'prusaslicer://' },
        { name: 'OrcaSlicer', path: 'C:\\Program Files\\OrcaSlicer\\OrcaSlicer.exe', protocol: null },
        { name: 'Bambu Studio', path: 'C:\\Program Files\\Bambu Studio\\BambuStudio.exe', protocol: null },
        { name: 'Simplify3D', path: 'C:\\Program Files\\Simplify3D\\Simplify3D.exe', protocol: null }
      );
    }
    
    // macOS paths
    if (navigator.platform.includes('Mac')) {
      slicers.push(
        { name: 'Ultimaker Cura', path: '/Applications/Ultimaker Cura.app', protocol: 'cura://' },
        { name: 'PrusaSlicer', path: '/Applications/PrusaSlicer.app', protocol: 'prusaslicer://' },
        { name: 'OrcaSlicer', path: '/Applications/OrcaSlicer.app', protocol: null },
        { name: 'Bambu Studio', path: '/Applications/Bambu Studio.app', protocol: null }
      );
    }
    
    // Linux paths
    if (navigator.platform.includes('Linux')) {
      slicers.push(
        { name: 'Ultimaker Cura', path: '/usr/bin/cura', protocol: 'cura://' },
        { name: 'PrusaSlicer', path: '/usr/bin/prusa-slicer', protocol: 'prusaslicer://' },
        { name: 'OrcaSlicer', path: '/usr/bin/orcaslicer', protocol: null }
      );
    }
    
    return slicers;
  };

  const openInSlicer = async (filePath, slicer) => {
    try {
      if (isElectron()) {
        // Use Electron to execute slicer
        const { openExternal } = await import('../utils/electronUtils');
        if (slicer.protocol) {
          // Use protocol handler if available
          await openExternal(`${slicer.protocol}${encodeURIComponent(filePath)}`);
        } else {
          // Try to execute directly
          alert(`Please open ${slicer.name} manually and load:\n${filePath}`);
        }
      } else {
        // Web version - try protocol handler
        if (slicer.protocol) {
          window.location.href = `${slicer.protocol}${encodeURIComponent(filePath)}`;
        } else {
          alert(`Please open ${slicer.name} manually and load the saved file.`);
        }
      }
    } catch (error) {
      console.error('Error opening slicer:', error);
      alert(`Couldn't auto-open ${slicer.name}. Please open it manually and load the file.`);
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
          disabled={!selectedModel || isSending}
          className="export-btn print-btn"
        >
          <span className="btn-icon">{isSending ? '⏳' : '🖨️'}</span>
          <div className="btn-content">
            <div className="btn-title">
              {isSending ? (sendProgress?.message || 'Sending...') : 'Send to Printer'}
            </div>
            <div className="btn-subtitle">
              {isSending && sendProgress?.percent !== undefined
                ? `${sendProgress.percent}%`
                : 'Direct print via slicer or network'}
            </div>
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
          {preferredSlicer && (
            <p className="preferred-slicer">
              🎯 Preferred: <strong>{preferredSlicer}</strong> 
              <button onClick={() => setShowSlicerSetup(true)} style={{marginLeft: '8px', fontSize: '11px'}}>
                Change
              </button>
            </p>
          )}
          {!preferredSlicer && (
            <button 
              onClick={() => setShowSlicerSetup(true)} 
              style={{marginTop: '8px', padding: '6px 12px', fontSize: '12px'}}
            >
              ⚙️ Setup Preferred Slicer
            </button>
          )}
        </div>
      )}

      {showSlicerSetup && (
        <div className="slicer-setup-modal" onClick={() => setShowSlicerSetup(false)}>
          <div className="slicer-setup-content" onClick={(e) => e.stopPropagation()}>
            <h3>🎯 Choose Your Preferred Slicer</h3>
            <p style={{fontSize: '13px', color: '#b0b0b0', marginBottom: '15px'}}>
              We'll automatically offer to open files in this slicer
            </p>
            <div className="slicer-options">
              {['Ultimaker Cura', 'PrusaSlicer', 'OrcaSlicer', 'Bambu Studio', 'Simplify3D', 'Other'].map(slicer => (
                <button
                  key={slicer}
                  className={`slicer-option ${preferredSlicer === slicer ? 'selected' : ''}`}
                  onClick={() => {
                    setPreferredSlicer(slicer);
                    localStorage.setItem('preferredSlicer', slicer);
                    setShowSlicerSetup(false);
                    alert(`✅ ${slicer} set as preferred slicer!`);
                  }}
                >
                  {slicer}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setShowSlicerSetup(false)}
              style={{marginTop: '15px', padding: '8px 16px'}}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showPrinterDialog && (
        <PrinterDialog 
          onClose={() => setShowPrinterDialog(false)}
          onSelectPrinter={handlePrinterSelect}
        />
      )}
    </div>
  );
};

export default ExportControls;
