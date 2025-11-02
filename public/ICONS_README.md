# App Icons

## Required Icons for Electron Build

### Windows
- **icon.ico** (256x256, 48x48, 32x32, 16x16)
  - Multi-resolution .ico file
  - Place in `public/` folder

### macOS  
- **icon.icns** (512x512, 256x256, 128x128, 64x64, 32x32, 16x16)
  - Apple Icon Image format
  - Place in `public/` folder

### Linux
- **icon.png** (512x512)
  - PNG format, high resolution
  - Place in `public/` folder

## Creating Icons

### From PNG Source

1. **Create a high-res PNG** (1024x1024 recommended)
   - Design your logo/icon
   - Export as PNG with transparency

2. **Convert to .ico (Windows)**
   - Use online tool: https://convertio.co/png-ico/
   - Or use ImageMagick:
     ```bash
     magick convert icon.png -define icon:auto-resize=256,48,32,16 icon.ico
     ```

3. **Convert to .icns (macOS)**
   - Use online tool: https://cloudconvert.com/png-to-icns
   - Or use iconutil on Mac:
     ```bash
     mkdir icon.iconset
     sips -z 16 16     icon.png --out icon.iconset/icon_16x16.png
     sips -z 32 32     icon.png --out icon.iconset/icon_16x16@2x.png
     sips -z 32 32     icon.png --out icon.iconset/icon_32x32.png
     sips -z 64 64     icon.png --out icon.iconset/icon_32x32@2x.png
     sips -z 128 128   icon.png --out icon.iconset/icon_128x128.png
     sips -z 256 256   icon.png --out icon.iconset/icon_128x128@2x.png
     sips -z 256 256   icon.png --out icon.iconset/icon_256x256.png
     sips -z 512 512   icon.png --out icon.iconset/icon_256x256@2x.png
     sips -z 512 512   icon.png --out icon.iconset/icon_512x512.png
     iconutil -c icns icon.iconset
     ```

## Icon Guidelines

### Design Tips
- **Simple & Clear**: Icon should be recognizable at 16x16
- **High Contrast**: Works on light and dark backgrounds
- **Brand Consistent**: Matches your app's visual identity
- **Transparent Background**: PNG with alpha channel

### Technical Requirements
- **Format**: PNG (source), ICO (Windows), ICNS (macOS)
- **Size**: At least 512x512 for source
- **Color Space**: RGB/RGBA
- **Bit Depth**: 32-bit (24-bit color + 8-bit alpha)

## Current Status

⚠️ **Placeholder icons needed!**

Currently using default Electron icon. To add your custom icons:

1. Design icon (1024x1024 PNG with transparency)
2. Convert to required formats (see above)
3. Place files in `public/`:
   ```
   public/
   ├── icon.png   (Linux)
   ├── icon.ico   (Windows)  
   └── icon.icns  (macOS)
   ```
4. Rebuild app: `npm run electron:build`

## Quick Icon Generation

Use this online tool to generate all formats:
https://www.electron.build/icons

1. Upload your 1024x1024 PNG
2. Download generated .ico, .icns, and various .png sizes
3. Place in `public/` folder

## Testing Icons

After adding icons:

```bash
# Test in development
npm run electron:dev

# Build and check
npm run electron:build
```

The icon should appear:
- In window title bar
- In taskbar/dock
- In alt-tab switcher
- On desktop shortcuts
- In installed apps list

## Resources

- [Electron Icon Documentation](https://www.electronjs.org/docs/latest/tutorial/icons)
- [electron-builder Icons Guide](https://www.electron.build/icons)
- [Free Icon Tools](https://icongram.jgog.in/)
- [macOS Icon Guidelines](https://developer.apple.com/design/human-interface-guidelines/app-icons)
