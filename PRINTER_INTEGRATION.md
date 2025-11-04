# Printer Integration Guide

## Overview
Complete printer and slicer integration system for direct model export and printing.

## Features

### 🖨️ Supported Connection Types
1. **Slicer Software** - Launch models directly in your slicer
   - PrusaSlicer
   - Ultimaker Cura
   - OrcaSlicer
   - SuperSlicer
   - Simplify3D
   - Bambu Studio

2. **Network Printers**
   - OctoPrint (REST API)
   - Klipper/Moonraker (REST API)
   - PrusaLink (REST API)

3. **USB Printers** (placeholder - requires serialport library)

## Usage

### Quick Start
1. Click **"Send to Printer"** button in Export Controls
2. First time: Printer dialog opens to add your printer
3. Add printer profile with connection details
4. Select printer and click "Use Selected"
5. Model exports as STL and sends to printer

### Setting Up Printers

#### Slicer Software Setup
1. Click "Send to Printer" → "Add New Printer"
2. Enter printer name (e.g., "My Prusa i3")
3. Select Connection Type: **Slicer**
4. Choose your slicer from dropdown
5. Browse to slicer executable path or use detected default
6. Click Save

**Default Slicer Paths:**
- **Windows:**
  - PrusaSlicer: `C:\Program Files\Prusa3D\PrusaSlicer\prusa-slicer.exe`
  - Cura: `C:\Program Files\Ultimaker Cura\Cura.exe`
  - OrcaSlicer: `C:\Program Files\OrcaSlicer\OrcaSlicer.exe`
  
- **macOS:**
  - PrusaSlicer: `/Applications/PrusaSlicer.app/Contents/MacOS/PrusaSlicer`
  - Cura: `/Applications/Ultimaker Cura.app/Contents/MacOS/cura`
  
- **Linux:**
  - PrusaSlicer: `/usr/bin/prusa-slicer`
  - Cura: `/usr/bin/cura`

#### OctoPrint Setup
1. Find your OctoPrint URL (e.g., `http://octopi.local` or `http://192.168.1.100`)
2. Generate API key in OctoPrint:
   - Settings → API → Copy "API Key"
3. In Printer Dialog:
   - Connection Type: **OctoPrint**
   - API URL: Your OctoPrint address
   - API Key: Paste your key
4. Click "Test Connection" to verify
5. Click Save

#### Klipper/Moonraker Setup
1. Find your Moonraker URL (e.g., `http://mainsailos.local` or `http://192.168.1.101:7125`)
2. In Printer Dialog:
   - Connection Type: **Klipper**
   - API URL: Your Moonraker address (port 7125)
   - API Key: Usually not required (leave blank)
3. Click "Test Connection" to verify
4. Click Save

#### PrusaLink Setup
1. Enable PrusaLink on your printer (Prusa MK4, XL, Mini+)
2. Find IP address in printer settings
3. Generate API key in PrusaLink web interface
4. In Printer Dialog:
   - Connection Type: **PrusaLink**
   - API URL: `http://[printer-ip]` (e.g., `http://192.168.1.102`)
   - API Key: Your PrusaLink key
5. Click "Test Connection" to verify
6. Click Save

### Default Printer
- Mark one printer as default with the star icon ⭐
- Default printer sends immediately without showing dialog
- Change default anytime in Printer Dialog

### Managing Printers
- **Edit:** Click edit icon (✏️) to modify settings
- **Delete:** Click delete icon (🗑️) to remove printer
- **Test:** Click "Test Connection" to verify network printers
- **Export/Import:** Backup printer profiles for other machines

## Workflow Examples

### Scenario 1: Quick Print to Default Slicer
```
1. Select model in gallery
2. Make modifications with AI chat
3. Click "Send to Printer"
4. PrusaSlicer opens with STL loaded
5. Slice and print
```

### Scenario 2: Send to OctoPrint
```
1. Select model
2. Click "Send to Printer"
3. Choose OctoPrint printer
4. File uploads automatically
5. Select file in OctoPrint web interface
6. Start print
```

### Scenario 3: Multiple Printers
```
1. Configure all your printers once
2. Set your most-used as default
3. Send to default with one click
4. Or open dialog to choose different printer
```

## Technical Details

### File Format
- Exports binary STL format (smaller file size)
- Filename: `{modelname}_print.stl`
- Compatible with all slicers and printers

### Progress Tracking
- Visual progress bar during export
- Upload percentage for network printers
- Success/error notifications

### Connection Testing
Network printers can test connection before saving:
- **OctoPrint:** Tests `/api/version` endpoint
- **Klipper:** Tests `/server/info` endpoint
- **PrusaLink:** Tests `/api/version` endpoint

### Error Handling
- Invalid API keys → Shows error with instructions
- Unreachable printers → Connection timeout message
- Missing slicer → Browse to correct path
- No printers configured → Shows setup wizard

## Files Created

### Core System
- `src/utils/printerProfiles.js` - Profile management and storage
- `src/utils/printerIntegration.js` - Printer/slicer communication
- `src/components/PrinterDialog.jsx` - UI for printer management
- `src/components/PrinterDialog.css` - Dialog styling

### Electron Integration
- `electron/main.js` - IPC handlers for slicer launching
- `electron/preload.js` - Exposed APIs for renderer
- `src/utils/electronUtils.js` - Helper functions

### Updated Components
- `src/components/ExportControls.jsx` - Integrated printer dialog

## Data Storage
- Printer profiles saved in `localStorage`
- Key: `'printerProfiles'`
- Export/import for backup/transfer

## Future Enhancements
- [ ] Printer auto-detection via mDNS
- [ ] USB serial printing with serialport
- [ ] G-code preview before sending
- [ ] Print queue management
- [ ] Multi-file batch printing
- [ ] Custom print profiles per printer
- [ ] Automatic slicer detection
- [ ] Cloud printer integration (Octoprint Anywhere, etc.)

## Troubleshooting

### Slicer Won't Launch
- Verify slicer path is correct
- Check file permissions
- Try manual slicer path entry
- Restart Electron app

### OctoPrint Upload Fails
- Check API URL format (include http://)
- Verify API key is correct
- Test network connection
- Check OctoPrint logs

### Klipper Connection Error
- Verify Moonraker is running (port 7125)
- Check firewall settings
- Try IP address instead of hostname
- Ensure printer is powered on

### PrusaLink Not Working
- Update to latest firmware
- Enable PrusaLink in printer settings
- Regenerate API key
- Check printer network connection

## Security Notes
- API keys stored in localStorage (browser only)
- Use HTTPS for network printers when possible
- Never share exported printer profiles publicly
- Regenerate API keys if compromised

## Support
For issues or questions:
1. Check printer documentation
2. Verify connection settings
3. Test connection in Printer Dialog
4. Check browser console for errors
5. Review slicer/printer logs
