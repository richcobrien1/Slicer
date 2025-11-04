/**
 * Printer Profile Management
 * Handles saving/loading printer configurations, slicer paths, and connection settings
 */

const PRINTER_PROFILES_KEY = 'printer_profiles';
const DEFAULT_PRINTER_KEY = 'default_printer_id';

/**
 * Printer connection types
 */
export const ConnectionType = {
  SLICER: 'slicer',        // Launch slicer software
  OCTOPRINT: 'octoprint',  // OctoPrint API
  KLIPPER: 'klipper',      // Klipper/Moonraker API
  PRUSALINK: 'prusalink',  // PrusaLink API
  USB: 'usb'               // Direct USB connection
};

/**
 * Supported slicer types
 */
export const SlicerType = {
  PRUSASLICER: 'prusaslicer',
  CURA: 'cura',
  ORCASLICER: 'orcaslicer',
  SUPERSLICER: 'superslicer',
  SIMPLIFY3D: 'simplify3d',
  BAMBUSTUDIO: 'bambustudio'
};

/**
 * Default slicer executable paths by platform
 */
export const DEFAULT_SLICER_PATHS = {
  win32: {
    prusaslicer: 'C:\\Program Files\\Prusa3D\\PrusaSlicer\\prusa-slicer.exe',
    cura: 'C:\\Program Files\\UltiMaker Cura 5.11.0\\Cura.exe',
    cura_alt: 'C:\\Program Files\\Ultimaker Cura\\Cura.exe', // Older Cura path
    cura_alt2: 'C:\\Program Files\\Cura\\Cura.exe', // Alternative Cura path
    orcaslicer: 'C:\\Program Files\\OrcaSlicer\\OrcaSlicer.exe',
    superslicer: 'C:\\Program Files\\SuperSlicer\\superslicer.exe',
    simplify3d: 'C:\\Program Files\\Simplify3D\\Simplify3D.exe',
    bambustudio: 'C:\\Program Files\\BambuStudio\\BambuStudio.exe'
  },
  darwin: {
    prusaslicer: '/Applications/PrusaSlicer.app/Contents/MacOS/PrusaSlicer',
    cura: '/Applications/Ultimaker Cura.app/Contents/MacOS/cura',
    orcaslicer: '/Applications/OrcaSlicer.app/Contents/MacOS/OrcaSlicer',
    superslicer: '/Applications/SuperSlicer.app/Contents/MacOS/SuperSlicer',
    simplify3d: '/Applications/Simplify3D.app/Contents/MacOS/Simplify3D',
    bambustudio: '/Applications/BambuStudio.app/Contents/MacOS/BambuStudio'
  },
  linux: {
    prusaslicer: '/usr/bin/prusa-slicer',
    cura: '/usr/bin/cura',
    orcaslicer: '/usr/bin/orcaslicer',
    superslicer: '/usr/bin/superslicer',
    simplify3d: '/usr/bin/simplify3d',
    bambustudio: '/usr/bin/bambustudio'
  }
};

/**
 * Get all saved printer profiles
 */
export function getPrinterProfiles() {
  const stored = localStorage.getItem(PRINTER_PROFILES_KEY);
  if (!stored) {
    return [];
  }
  
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error parsing printer profiles:', error);
    return [];
  }
}

/**
 * Save a printer profile
 */
export function savePrinterProfile(profile) {
  const profiles = getPrinterProfiles();
  
  // Generate ID if new profile
  if (!profile.id) {
    profile.id = `printer_${Date.now()}`;
  }
  
  // Check if updating existing profile
  const existingIndex = profiles.findIndex(p => p.id === profile.id);
  
  if (existingIndex >= 0) {
    profiles[existingIndex] = profile;
  } else {
    profiles.push(profile);
  }
  
  localStorage.setItem(PRINTER_PROFILES_KEY, JSON.stringify(profiles));
  
  return profile;
}

/**
 * Delete a printer profile
 */
export function deletePrinterProfile(profileId) {
  const profiles = getPrinterProfiles();
  const filtered = profiles.filter(p => p.id !== profileId);
  
  localStorage.setItem(PRINTER_PROFILES_KEY, JSON.stringify(filtered));
  
  // Clear default if it was deleted
  if (getDefaultPrinter()?.id === profileId) {
    setDefaultPrinter(null);
  }
}

/**
 * Get a specific printer profile by ID
 */
export function getPrinterProfile(profileId) {
  const profiles = getPrinterProfiles();
  return profiles.find(p => p.id === profileId);
}

/**
 * Set default printer
 */
export function setDefaultPrinter(profileId) {
  if (profileId) {
    localStorage.setItem(DEFAULT_PRINTER_KEY, profileId);
  } else {
    localStorage.removeItem(DEFAULT_PRINTER_KEY);
  }
}

/**
 * Get default printer profile
 */
export function getDefaultPrinter() {
  const defaultId = localStorage.getItem(DEFAULT_PRINTER_KEY);
  if (!defaultId) {
    // Return first printer if no default set
    const profiles = getPrinterProfiles();
    return profiles.length > 0 ? profiles[0] : null;
  }
  
  return getPrinterProfile(defaultId);
}

/**
 * Create a new printer profile template
 */
export function createPrinterProfile(name, type = ConnectionType.SLICER) {
  return {
    id: null, // Will be generated on save
    name: name || 'New Printer',
    type: type,
    
    // Slicer settings (for type: 'slicer')
    slicerType: SlicerType.PRUSASLICER,
    slicerPath: '',
    slicerArgs: '--load {file}', // {file} will be replaced with STL path
    
    // Network settings (for type: 'octoprint', 'klipper', 'prusalink')
    apiUrl: '',
    apiKey: '',
    
    // USB settings (for type: 'usb')
    port: '',
    baudRate: 115200,
    
    // General settings
    autoStart: false, // Auto-start print after upload
    
    created: Date.now(),
    modified: Date.now()
  };
}

/**
 * Validate printer profile
 */
export function validatePrinterProfile(profile) {
  const errors = [];
  
  if (!profile.name || profile.name.trim() === '') {
    errors.push('Printer name is required');
  }
  
  if (!profile.type) {
    errors.push('Connection type is required');
  }
  
  // Type-specific validation
  switch (profile.type) {
    case ConnectionType.SLICER:
      if (!profile.slicerPath || profile.slicerPath.trim() === '') {
        errors.push('Slicer path is required');
      }
      break;
      
    case ConnectionType.OCTOPRINT:
    case ConnectionType.KLIPPER:
    case ConnectionType.PRUSALINK:
      if (!profile.apiUrl || profile.apiUrl.trim() === '') {
        errors.push('API URL is required');
      }
      if (!profile.apiKey || profile.apiKey.trim() === '') {
        errors.push('API key is required');
      }
      break;
      
    case ConnectionType.USB:
      if (!profile.port || profile.port.trim() === '') {
        errors.push('Serial port is required');
      }
      break;
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Get default slicer path for current platform
 */
export function getDefaultSlicerPath(slicerType) {
  const platform = getPlatform();
  const paths = DEFAULT_SLICER_PATHS[platform];
  
  if (!paths) {
    return '';
  }
  
  return paths[slicerType] || '';
}

/**
 * Get current platform
 */
function getPlatform() {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (userAgent.includes('win')) {
    return 'win32';
  } else if (userAgent.includes('mac')) {
    return 'darwin';
  } else {
    return 'linux';
  }
}

/**
 * Export printer profiles (for backup)
 */
export function exportPrinterProfiles() {
  const profiles = getPrinterProfiles();
  const defaultPrinterId = localStorage.getItem(DEFAULT_PRINTER_KEY);
  
  const exportData = {
    version: 1,
    exported: new Date().toISOString(),
    defaultPrinterId,
    profiles
  };
  
  return JSON.stringify(exportData, null, 2);
}

/**
 * Import printer profiles (from backup)
 */
export function importPrinterProfiles(jsonString) {
  try {
    const importData = JSON.parse(jsonString);
    
    if (!importData.profiles || !Array.isArray(importData.profiles)) {
      throw new Error('Invalid import data format');
    }
    
    // Save all profiles
    localStorage.setItem(PRINTER_PROFILES_KEY, JSON.stringify(importData.profiles));
    
    // Restore default printer
    if (importData.defaultPrinterId) {
      localStorage.setItem(DEFAULT_PRINTER_KEY, importData.defaultPrinterId);
    }
    
    return {
      success: true,
      count: importData.profiles.length
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}
