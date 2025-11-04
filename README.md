# SLICER - AI Automated 3D Manufacturing

An intelligent 3D model customization and printing platform with AI-powered voice commands, real-time 3D visualization, and direct printer integration.

## 🌟 Features

### 🎨 3D Model Customization
- **Pre-built Model Library** - Curated collection of printable 3D models
- **Real-time 3D Viewer** - Interactive Three.js visualization with orbit controls
- **AI Voice Commands** - Customize models using natural language
- **Geometry Modifications** - Hollow models, add supports, drainage holes, base platforms
- **Boolean Operations** - Union, subtract, and modify model geometry
- **Model Search** - Find and import models from online repositories

### 🤖 AI-Powered Modifications
Speak or type commands like:
- *"Make this hollow with 2mm walls"*
- *"Add support structures for overhangs"*
- *"Create a 5mm base platform"*
- *"Add drainage holes for resin printing"*
- *"Scale this to 150%"*
- *"Rotate 45 degrees on the Z axis"*

### 🖨️ Direct Printer Integration

#### Slicer Software Integration
Send models directly to your favorite slicer:
- **PrusaSlicer** - Automatically launches with your model loaded
- **Ultimaker Cura** - Opens with print-ready STL
- **OrcaSlicer** - Bambu Lab ecosystem integration
- **Bambu Studio** - Native Bambu printer support
- **SuperSlicer** - Advanced PrusaSlicer fork
- **Simplify3D** - Professional slicing software

#### Network Printer Support
Upload directly to network-enabled printers:
- **OctoPrint** - REST API integration with any OctoPrint server
- **Klipper/Moonraker** - Direct upload to Klipper-based printers (Mainsail, Fluidd)
- **PrusaLink** - Native Prusa MK4, XL, and Mini+ support

#### Quick Setup
1. Click **"Send to Printer"** button
2. Add your printer with connection details
3. Mark as default for one-click printing
4. STL exports and sends automatically

### 📤 Export Options
- **Binary STL Export** - Optimized file size for 3D printing
- **Download to Computer** - Save files locally
- **Direct Printer Upload** - Send to configured printers
- **Drag & Drop Import** - Import your own STL files

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Modern web browser (Chrome, Firefox, Edge)
- Optional: 3D printer and slicer software

### Installation

```bash
# Clone the repository
git clone https://github.com/richcobrien1/Slicer.git
cd Slicer

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Building for Production

```bash
# Build web version
npm run build

# Preview production build
npm run preview

# Build Electron desktop app
npm run electron:build
```

## 📖 How to Use

### Basic Workflow

1. **Select a Model**
   - Browse the model gallery on the left
   - Click any model to load it in the 3D viewer
   - Or drag & drop your own STL file

2. **Customize with AI**
   - Type or speak commands in the AI Chat panel
   - Watch modifications happen in real-time
   - All changes are logged in the History panel

3. **Export & Print**
   - Click **"Download STL"** to save locally
   - Or click **"Send to Printer"** for direct printing
   - Configure your printer/slicer once, use forever

### Setting Up Your Printer

#### Option 1: Slicer Software (Recommended)

1. Click **"Send to Printer"** → **"Add New Printer"**
2. Enter a name (e.g., "My Prusa MK3S")
3. Select **Connection Type**: `Slicer`
4. Choose your slicer from the dropdown
5. Browse to your slicer's executable:
   - **Windows**: `C:\Program Files\Prusa3D\PrusaSlicer\prusa-slicer.exe`
   - **macOS**: `/Applications/PrusaSlicer.app`
   - **Linux**: `/usr/bin/prusa-slicer`
6. Click **Save**
7. Mark as default with the ⭐ icon

**What happens:** When you click "Send to Printer", the STL is saved and your slicer launches automatically with the file loaded. Configure settings, slice to G-code, and print!

#### Option 2: OctoPrint (Network Printer)

1. Find your OctoPrint URL (e.g., `http://octopi.local` or `http://192.168.1.100`)
2. Get your API key from OctoPrint:
   - Open OctoPrint → **Settings** → **API** → Copy **"API Key"**
3. In Printer Dialog:
   - **Connection Type**: `OctoPrint`
   - **API URL**: Your OctoPrint address
   - **API Key**: Paste your key
4. Click **"Test Connection"** to verify
5. Click **Save**

**What happens:** STL uploads directly to OctoPrint. Select it in your OctoPrint web interface to start printing.

#### Option 3: Klipper/Moonraker

1. Find your Moonraker URL (usually `http://[printer-ip]:7125`)
2. In Printer Dialog:
   - **Connection Type**: `Klipper`
   - **API URL**: Your Moonraker address (e.g., `http://192.168.1.101:7125`)
   - **API Key**: Leave blank (usually not required)
3. Click **"Test Connection"**
4. Click **Save**

**What happens:** STL uploads to your Klipper printer and appears in Mainsail or Fluidd interface.

#### Option 4: PrusaLink (Prusa Printers)

1. Enable PrusaLink on your printer (Prusa MK4, XL, Mini+)
2. Find IP address in printer settings
3. Generate API key in PrusaLink web interface
4. In Printer Dialog:
   - **Connection Type**: `PrusaLink`
   - **API URL**: `http://[printer-ip]`
   - **API Key**: Your PrusaLink key
5. Click **"Test Connection"**
6. Click **Save**

**What happens:** STL uploads directly to your Prusa printer.

### Managing Multiple Printers

- Add as many printers as you want
- Set one as **default** (⭐ icon) for quick access
- Switch printers anytime in the Printer Dialog
- Edit or delete printer profiles with ✏️ and 🗑️ buttons
- Export/import printer profiles for backup

## 🛠️ Technology Stack

### Frontend
- **React 19** - UI framework
- **Three.js** - 3D rendering and visualization
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Three.js helpers and utilities
- **three-bvh-csg** - Boolean operations (CSG)
- **Vite** - Build tool and dev server

### Backend & Services
- **Supabase** - Authentication and cloud storage
- **Stripe** - Premium subscriptions
- **OpenAI API** - AI voice command processing (optional)
- **Local Pattern Matching** - Offline AI commands

### Desktop App
- **Electron** - Cross-platform desktop application
- **IPC Handlers** - Slicer launching and file operations

## 📁 Project Structure

```
Slicer/
├── src/
│   ├── components/
│   │   ├── ModelGallery.jsx          # Model selection gallery
│   │   ├── ModelViewer.jsx           # Three.js 3D viewer
│   │   ├── AIChat.jsx                # AI command interface
│   │   ├── ExportControls.jsx        # Export and print controls
│   │   ├── PrinterDialog.jsx         # Printer management UI
│   │   └── Auth.jsx                  # User authentication
│   ├── utils/
│   │   ├── printerProfiles.js        # Printer configuration storage
│   │   ├── printerIntegration.js     # Printer API integrations
│   │   ├── geometryOps.js            # CSG boolean operations
│   │   ├── meshTransform.js          # 3D transformations
│   │   ├── stlExport.js              # STL file generation
│   │   ├── aiService.js              # AI command processing
│   │   └── electronUtils.js          # Electron IPC helpers
│   └── App.jsx                       # Main application
├── electron/
│   ├── main.js                       # Electron main process
│   └── preload.js                    # Electron preload script
├── docs/                             # Documentation
└── public/                           # Static assets
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Supabase (optional - for cloud features)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key

# Stripe (optional - for premium features)
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key

# OpenAI (optional - for advanced AI)
VITE_OPENAI_API_KEY=your_openai_key
```

**Note:** The app works fully offline without these. They only enable cloud storage, premium features, and advanced AI.

### Default Slicer Paths

The app auto-detects common slicer installations:

**Windows:**
- PrusaSlicer: `C:\Program Files\Prusa3D\PrusaSlicer\prusa-slicer.exe`
- Cura: `C:\Program Files\Ultimaker Cura\Cura.exe`
- OrcaSlicer: `C:\Program Files\OrcaSlicer\OrcaSlicer.exe`

**macOS:**
- PrusaSlicer: `/Applications/PrusaSlicer.app`
- Cura: `/Applications/Ultimaker Cura.app`

**Linux:**
- PrusaSlicer: `/usr/bin/prusa-slicer`
- Cura: `/usr/bin/cura`

You can manually browse to any custom path.

## 📚 Documentation

Detailed guides available in the `docs/` folder:

- **[PRINTER_INTEGRATION.md](docs/PRINTER_INTEGRATION.md)** - Complete printer setup guide
- **[GEOMETRY_MODIFICATIONS.md](docs/GEOMETRY_MODIFICATIONS.md)** - AI geometry commands
- **[DEPLOYMENT.md](docs/DEPLOYMENT.md)** - Deployment instructions
- **[ELECTRON_BUILD.md](docs/ELECTRON_BUILD.md)** - Desktop app building
- **[STRIPE_SETUP.md](docs/STRIPE_SETUP.md)** - Premium features setup

## 🎯 Use Cases

### Hobbyist 3D Printing
- Quick model customization without CAD software
- Voice commands for simple modifications
- One-click export to your favorite slicer

### Rapid Prototyping
- Fast iteration on functional parts
- Add supports and bases automatically
- Direct upload to network printers

### Resin Printing
- Auto-generate drainage holes
- Hollow models to save resin
- Optimize for SLA printing

### Educational
- Learn 3D printing concepts
- Experiment with geometry modifications
- Understand boolean operations

### Production
- Batch processing with saved configurations
- Multiple printer management
- Consistent export settings

## 🔐 Security & Privacy

- **Printer profiles stored locally** in browser localStorage
- **No API keys sent to servers** - all printer communication is direct
- **Optional cloud features** - works fully offline
- **Open source** - audit the code yourself

## 🐛 Troubleshooting

### Slicer Won't Launch
- Verify the slicer path is correct in printer settings
- Check file permissions on the slicer executable
- Try manually browsing to the slicer .exe file
- On macOS, allow the app in System Preferences → Security

### OctoPrint Upload Fails
- Verify API URL includes `http://` (not https)
- Check API key is copied correctly (no extra spaces)
- Test connection using the "Test Connection" button
- Check OctoPrint logs for upload errors

### Model Not Loading
- Ensure STL file is valid (try opening in another program)
- Check browser console (F12) for error messages
- Try refreshing the page
- Clear browser cache if models are corrupted

### Performance Issues
- Complex models may be slow on older hardware
- Try reducing model complexity in your slicer first
- Close other browser tabs to free up memory
- Use the desktop Electron app for better performance

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Three.js** - 3D rendering engine
- **React Three Fiber** - React integration for Three.js
- **three-bvh-csg** - Boolean operations library
- **Supabase** - Backend infrastructure
- **OctoPrint**, **Klipper**, **Prusa** - Printer API documentation

## 📧 Support

- **Issues**: [GitHub Issues](https://github.com/richcobrien1/Slicer/issues)
- **Discussions**: [GitHub Discussions](https://github.com/richcobrien1/Slicer/discussions)
- **Documentation**: Check the `docs/` folder

## 🗺️ Roadmap

### Upcoming Features
- [ ] Printer auto-detection via mDNS
- [ ] USB serial printing support
- [ ] G-code preview before printing
- [ ] Print queue management
- [ ] Cloud sync for printer profiles
- [ ] Multi-file batch printing
- [ ] Advanced geometry operations (loft, sweep, etc.)
- [ ] STL file repair tools
- [ ] Print time estimation
- [ ] Material usage calculator

---

**Made with ❤️ for the 3D printing community**
