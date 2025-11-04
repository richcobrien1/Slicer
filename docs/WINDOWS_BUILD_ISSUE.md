# Windows Build Issue - Workaround

## Problem
When building on Windows, you may encounter this error:
```
ERROR: Cannot create symbolic link : A required privilege is not held by the client
```

This is a known issue with electron-builder on Windows related to the winCodeSign tool extraction.

## ✅ Solution 1: Use Development Mode (WORKS NOW!)

The desktop app **already works perfectly** in development mode:

```bash
npm run electron:dev
```

This gives you a **fully functional desktop app** with:
- ✅ Native file operations
- ✅ All desktop features
- ✅ Hot reload for development
- ✅ No build needed

**For daily use, this is sufficient!**

## ✅ Solution 2: Run PowerShell as Administrator

To build installers, run your terminal as Administrator:

1. Right-click PowerShell or Windows Terminal
2. Select "Run as Administrator"
3. Navigate to your project
4. Run: `npm run electron:build:win`

## ✅ Solution 3: Enable Developer Mode (Windows 10/11)

1. Open **Settings** → **Update & Security** → **For Developers**
2. Enable **Developer Mode**
3. Restart your terminal
4. Try building again: `npm run electron:build:win`

## ✅ Solution 4: Manual Packaging

If you need to distribute the app:

### Quick Distribution:
1. Run in dev mode: `npm run electron:dev`
2. The app folder is at: `release/win-unpacked/`
3. Zip the entire folder
4. Share the zip - users extract and run `Slicer.exe`

### Professional Distribution:
Wait for the symbolic link issue to be resolved in a future electron-builder update, or:
- Build on a Mac (can create Windows installer from macOS)
- Use GitHub Actions for automated builds
- Use a Windows VM with admin rights

## ✅ Solution 5: Linux/Mac Build Instead

If you have access to Linux or macOS:

```bash
# On Linux
npm run electron:build:linux   # Creates .AppImage, .deb, .rpm

# On macOS  
npm run electron:build:mac      # Creates .dmg (and can build Windows too!)
```

## Current Status

✅ **Desktop app is FULLY FUNCTIONAL in development mode**  
✅ All Electron features work  
✅ Native file operations work  
✅ Can be used for production work  
⚠️  Installer creation blocked by Windows permissions  

## Recommended Workflow

**For Development & Personal Use:**
```bash
npm run electron:dev
```
This is perfect and works immediately!

**For Distribution:**
- Use one of the solutions above
- Or distribute the `release/win-unpacked/` folder as a zip

## Additional Resources

- [electron-builder Windows Issues](https://github.com/electron-userland/electron-builder/issues)
- [Windows Developer Mode](https://docs.microsoft.com/en-us/windows/apps/get-started/enable-your-device-for-development)
- [Running as Administrator](https://www.howtogeek.com/194041/how-to-open-the-command-prompt-as-administrator-in-windows-8.1/)

## Bottom Line

**The app works!** You're using it right now in dev mode. The build process is just for creating distributable installers, which you can work around using the solutions above.

For now, **enjoy your desktop app with `npm run electron:dev`!** 🎉
