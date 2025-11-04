import { useState, useEffect } from 'react';
import './PrinterDialog.css';
import {
  getPrinterProfiles,
  savePrinterProfile,
  deletePrinterProfile,
  getDefaultPrinter,
  setDefaultPrinter,
  createPrinterProfile,
  validatePrinterProfile,
  ConnectionType,
  SlicerType,
  getDefaultSlicerPath
} from '../utils/printerProfiles';
import { testPrinterConnection } from '../utils/printerIntegration';

const PrinterDialog = ({ isOpen, onClose, onSelectPrinter }) => {
  const [printers, setPrinters] = useState([]);
  const [selectedPrinter, setSelectedPrinter] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPrinter, setEditingPrinter] = useState(null);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadPrinters();
    }
  }, [isOpen]);

  const loadPrinters = () => {
    const profiles = getPrinterProfiles();
    setPrinters(profiles);
    
    const defaultPrinter = getDefaultPrinter();
    if (defaultPrinter) {
      setSelectedPrinter(defaultPrinter.id);
    }
  };

  const handleAddPrinter = () => {
    const newPrinter = createPrinterProfile('New Printer', ConnectionType.SLICER);
    setEditingPrinter(newPrinter);
    setIsEditing(true);
  };

  const handleEditPrinter = (printer) => {
    setEditingPrinter({ ...printer });
    setIsEditing(true);
    setTestResult(null);
  };

  const handleSavePrinter = () => {
    const validation = validatePrinterProfile(editingPrinter);
    
    if (!validation.valid) {
      alert('Please fix the following errors:\n' + validation.errors.join('\n'));
      return;
    }
    
    savePrinterProfile(editingPrinter);
    setIsEditing(false);
    setEditingPrinter(null);
    loadPrinters();
  };

  const handleDeletePrinter = (printerId) => {
    if (confirm('Delete this printer profile?')) {
      deletePrinterProfile(printerId);
      loadPrinters();
    }
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setTestResult(null);
    
    try {
      const result = await testPrinterConnection(editingPrinter);
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: error.message
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSelectPrinter = () => {
    const printer = printers.find(p => p.id === selectedPrinter);
    if (printer) {
      onSelectPrinter(printer);
      onClose();
    }
  };

  const handleSetDefault = (printerId) => {
    setDefaultPrinter(printerId);
    loadPrinters();
  };

  if (!isOpen) return null;

  return (
    <div className="printer-dialog-overlay" onClick={onClose}>
      <div className="printer-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>🖨️ Select Printer</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {!isEditing ? (
          <>
            <div className="printer-list">
              {printers.length === 0 ? (
                <div className="empty-state">
                  <p>No printers configured</p>
                  <button className="add-btn" onClick={handleAddPrinter}>
                    ➕ Add Your First Printer
                  </button>
                </div>
              ) : (
                printers.map(printer => (
                  <div
                    key={printer.id}
                    className={`printer-item ${selectedPrinter === printer.id ? 'selected' : ''}`}
                    onClick={() => setSelectedPrinter(printer.id)}
                  >
                    <div className="printer-info">
                      <div className="printer-name">
                        {printer.name}
                        {getDefaultPrinter()?.id === printer.id && (
                          <span className="default-badge">Default</span>
                        )}
                      </div>
                      <div className="printer-type">{getConnectionTypeLabel(printer.type)}</div>
                      {printer.type === ConnectionType.SLICER && (
                        <div className="printer-detail">{printer.slicerType}</div>
                      )}
                      {(printer.type === ConnectionType.OCTOPRINT || 
                        printer.type === ConnectionType.KLIPPER || 
                        printer.type === ConnectionType.PRUSALINK) && (
                        <div className="printer-detail">{printer.apiUrl}</div>
                      )}
                    </div>
                    <div className="printer-actions">
                      <button
                        className="icon-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetDefault(printer.id);
                        }}
                        title="Set as default"
                      >
                        ⭐
                      </button>
                      <button
                        className="icon-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditPrinter(printer);
                        }}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        className="icon-btn delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePrinter(printer.id);
                        }}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="dialog-actions">
              <button className="secondary-btn" onClick={handleAddPrinter}>
                ➕ Add Printer
              </button>
              <div className="spacer"></div>
              <button className="secondary-btn" onClick={onClose}>
                Cancel
              </button>
              <button
                className="primary-btn"
                onClick={handleSelectPrinter}
                disabled={!selectedPrinter}
              >
                Send to Printer
              </button>
            </div>
          </>
        ) : (
          <div className="printer-editor">
            <div className="form-group">
              <label>Printer Name</label>
              <input
                type="text"
                value={editingPrinter.name}
                onChange={(e) => setEditingPrinter({ ...editingPrinter, name: e.target.value })}
                placeholder="My Printer"
              />
            </div>

            <div className="form-group">
              <label>Connection Type</label>
              <select
                value={editingPrinter.type}
                onChange={(e) => setEditingPrinter({ ...editingPrinter, type: e.target.value })}
              >
                <option value={ConnectionType.SLICER}>Slicer Software</option>
                <option value={ConnectionType.OCTOPRINT}>OctoPrint</option>
                <option value={ConnectionType.KLIPPER}>Klipper/Moonraker</option>
                <option value={ConnectionType.PRUSALINK}>PrusaLink</option>
                <option value={ConnectionType.USB}>USB (Direct)</option>
              </select>
            </div>

            {editingPrinter.type === ConnectionType.SLICER && (
              <>
                <div className="form-group">
                  <label>Slicer Type</label>
                  <select
                    value={editingPrinter.slicerType}
                    onChange={(e) => {
                      const slicerType = e.target.value;
                      setEditingPrinter({
                        ...editingPrinter,
                        slicerType,
                        slicerPath: getDefaultSlicerPath(slicerType)
                      });
                    }}
                  >
                    <option value={SlicerType.PRUSASLICER}>PrusaSlicer</option>
                    <option value={SlicerType.CURA}>Cura</option>
                    <option value={SlicerType.ORCASLICER}>OrcaSlicer</option>
                    <option value={SlicerType.SUPERSLICER}>SuperSlicer</option>
                    <option value={SlicerType.SIMPLIFY3D}>Simplify3D</option>
                    <option value={SlicerType.BAMBUSTUDIO}>Bambu Studio</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Slicer Executable Path</label>
                  <input
                    type="text"
                    value={editingPrinter.slicerPath}
                    onChange={(e) => setEditingPrinter({ ...editingPrinter, slicerPath: e.target.value })}
                    placeholder="C:\Program Files\PrusaSlicer\prusa-slicer.exe"
                  />
                  <small>Full path to slicer executable</small>
                </div>
              </>
            )}

            {(editingPrinter.type === ConnectionType.OCTOPRINT ||
              editingPrinter.type === ConnectionType.KLIPPER ||
              editingPrinter.type === ConnectionType.PRUSALINK) && (
              <>
                <div className="form-group">
                  <label>API URL</label>
                  <input
                    type="text"
                    value={editingPrinter.apiUrl}
                    onChange={(e) => setEditingPrinter({ ...editingPrinter, apiUrl: e.target.value })}
                    placeholder="http://octopi.local or http://192.168.1.100"
                  />
                  <small>Complete URL including http:// or https://</small>
                </div>

                <div className="form-group">
                  <label>API Key</label>
                  <input
                    type="password"
                    value={editingPrinter.apiKey}
                    onChange={(e) => setEditingPrinter({ ...editingPrinter, apiKey: e.target.value })}
                    placeholder="Your API key"
                  />
                  <small>Found in printer web interface settings</small>
                </div>

                <div className="form-group checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={editingPrinter.autoStart}
                      onChange={(e) => setEditingPrinter({ ...editingPrinter, autoStart: e.target.checked })}
                    />
                    Automatically start print after upload
                  </label>
                </div>

                <button
                  className="test-btn"
                  onClick={handleTestConnection}
                  disabled={testingConnection}
                >
                  {testingConnection ? '⏳ Testing...' : '🔍 Test Connection'}
                </button>

                {testResult && (
                  <div className={`test-result ${testResult.success ? 'success' : 'error'}`}>
                    {testResult.success ? '✅' : '❌'} {testResult.message}
                  </div>
                )}
              </>
            )}

            {editingPrinter.type === ConnectionType.USB && (
              <>
                <div className="form-group">
                  <label>Serial Port</label>
                  <input
                    type="text"
                    value={editingPrinter.port}
                    onChange={(e) => setEditingPrinter({ ...editingPrinter, port: e.target.value })}
                    placeholder="COM3 or /dev/ttyUSB0"
                  />
                </div>

                <div className="form-group">
                  <label>Baud Rate</label>
                  <select
                    value={editingPrinter.baudRate}
                    onChange={(e) => setEditingPrinter({ ...editingPrinter, baudRate: parseInt(e.target.value) })}
                  >
                    <option value="115200">115200</option>
                    <option value="250000">250000</option>
                    <option value="9600">9600</option>
                  </select>
                </div>

                <div className="info-box">
                  ⚠️ USB printing requires desktop app
                </div>
              </>
            )}

            <div className="dialog-actions">
              <button
                className="secondary-btn"
                onClick={() => {
                  setIsEditing(false);
                  setEditingPrinter(null);
                  setTestResult(null);
                }}
              >
                Cancel
              </button>
              <button className="primary-btn" onClick={handleSavePrinter}>
                Save Printer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function getConnectionTypeLabel(type) {
  const labels = {
    [ConnectionType.SLICER]: '🖥️ Slicer',
    [ConnectionType.OCTOPRINT]: '🐙 OctoPrint',
    [ConnectionType.KLIPPER]: '🚀 Klipper',
    [ConnectionType.PRUSALINK]: '🟠 PrusaLink',
    [ConnectionType.USB]: '🔌 USB'
  };
  return labels[type] || type;
}

export default PrinterDialog;
