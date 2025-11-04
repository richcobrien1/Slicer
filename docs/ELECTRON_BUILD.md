# Electron Desktop App - Build Instructions

## 🚀 Quick Start

### Development Mode (with hot reload)
```bash
npm run electron:dev
```
This will:
1. Start Vite dev server on port 5173
2. Wait for server to be ready
3. Launch Electron with hot reload

### Build Desktop Apps

#### Build for Current Platform
```bash
npm run electron:build
```

#### Build for Windows (.exe installer + portable)
```bash
npm run electron:build:win
```
Creates:
- `Slicer-1.0.0-x64.exe` - Installer (NSIS)
- `Slicer-1.0.0-x64-portable.exe` - Portable version
- `Slicer-1.0.0-arm64.exe` - ARM64 installer

#### Build for macOS (.dmg + .zip)
```bash
npm run electron:build:mac
```
Creates:
- `Slicer-1.0.0-x64.dmg` - Intel Mac installer
- `Slicer-1.0.0-arm64.dmg` - Apple Silicon (M1/M2) installer
- Zip archives for both architectures

#### Build for Linux (.AppImage, .deb, .rpm)
```bash
npm run electron:build:linux
```
Creates:
- `Slicer-1.0.0-x64.AppImage` - Universal Linux app
- `Slicer-1.0.0-amd64.deb` - Debian/Ubuntu package
- `Slicer-1.0.0-x86_64.rpm` - RedHat/Fedora package
- ARM64 versions for all formats

#### Build for All Platforms
```bash
npm run electron:build:all
```
Creates installers for Windows, macOS, and Linux (requires macOS to build .dmg)

## 📦 Output

Built applications are in the `release/` folder:
```
release/
├── Slicer-1.0.0-x64.exe              # Windows installer
├── Slicer-1.0.0-x64-portable.exe     # Windows portable
├── Slicer-1.0.0-x64.dmg              # macOS Intel
├── Slicer-1.0.0-arm64.dmg            # macOS Apple Silicon
├── Slicer-1.0.0-x64.AppImage         # Linux universal
├── Slicer-1.0.0-amd64.deb            # Debian/Ubuntu
└── Slicer-1.0.0-x86_64.rpm           # RedHat/Fedora
```

## 🎯 Features

### Native File Operations
- Open STL/3MF files directly from disk
- Save exported models
- Native file dialogs
- Drag & drop from desktop

### Platform Integration
- System tray icon (optional)
- Native notifications
- Auto-updates (configure in main.js)
- Deep linking support

### Security
- Context isolation enabled
- Node integration disabled
- Secure IPC communication via preload script

## 🔧 Configuration

### Icons
Place your icons in `public/`:
- `icon.png` - Linux (512x512)
- `icon.ico` - Windows (256x256)
- `icon.icns` - macOS (512x512 recommended)

### App Settings
Edit `package.json` build section:
```json
{
  "build": {
    "appId": "com.slicer.app",
    "productName": "Slicer",
    "copyright": "Copyright © 2025"
  }
}
```

### Window Settings
Edit `electron/main.js`:
```javascript
const mainWindow = new BrowserWindow({
  width: 1400,
  height: 900,
  // ... other options
});
```

## 🐛 Debugging

### View Electron Logs
Development mode automatically opens DevTools.

For production builds:
- Windows: `%APPDATA%\Slicer\logs`
- macOS: `~/Library/Logs/Slicer`
- Linux: `~/.config/Slicer/logs`

### Common Issues

**"App won't start"**
- Rebuild: `npm run build && npm run electron`
- Clear cache: Delete `dist/` folder

**"File operations not working"**
- Check preload.js is loaded
- Verify contextBridge is exposing APIs
- Check main.js IPC handlers

**"Build fails"**
- Ensure all dependencies installed: `npm install`
- On Linux: Install required packages:
  ```bash
  sudo apt-get install -y rpm
  ```

## 📱 Cross-Platform Notes

### Windows
- Code signing recommended for distribution
- Windows Defender may flag unsigned apps
- Use NSIS installer for professional deployment

### macOS
- Requires Apple Developer account for distribution
- Must be code signed and notarized
- Universal binary includes both Intel & ARM

### Linux
- AppImage is most universal format
- .deb for Debian/Ubuntu users
- .rpm for RedHat/Fedora users
- May need to set executable permissions

## 🚢 Distribution

### GitHub Releases
```bash
# Tag release
git tag v1.0.0
git push origin v1.0.0

# Build all platforms
npm run electron:build:all

# Upload files from release/ folder
```

### Auto-Updates
Configure in `electron/main.js`:
```javascript
const { autoUpdater } = require('electron-updater');
autoUpdater.checkForUpdatesAndNotify();
```

### Code Signing

**Windows:**
```bash
# Get code signing certificate
# Set environment variables:
# CSC_LINK=path/to/cert.pfx
# CSC_KEY_PASSWORD=your_password
npm run electron:build:win
```

**macOS:**
```bash
# Requires Apple Developer account
# Set environment variables:
# APPLE_ID=your@email.com
# APPLE_ID_PASSWORD=app-specific-password
npm run electron:build:mac
```

## 🎨 Customization

### Add Native Menus
Edit `electron/main.js`:
```javascript
const { Menu } = require('electron');

const template = [
  {
    label: 'File',
    submenu: [
      { label: 'Open...', click: () => { /* ... */ } },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }
];

Menu.setApplicationMenu(Menu.buildFromTemplate(template));
```

### Add System Tray
```javascript
const { Tray } = require('electron');

let tray = new Tray('path/to/icon.png');
tray.setContextMenu(Menu.buildFromTemplate([
  { label: 'Show App', click: () => mainWindow.show() },
  { label: 'Quit', click: () => app.quit() }
]));
```

## 📚 Resources

- [Electron Docs](https://www.electronjs.org/docs)
- [electron-builder Docs](https://www.electron.build/)
- [Electron Forge](https://www.electronforge.io/)
- [Awesome Electron](https://github.com/sindresorhus/awesome-electron)

## 🆘 Support

For issues specific to Electron integration:
1. Check console logs in DevTools
2. Review `electron/main.js` IPC handlers
3. Verify `electron/preload.js` API exposure
4. Test in development mode first

Happy building! 🎉
