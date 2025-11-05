# AI Model Loading Feature - User Guide

## Overview
The AI assistant in SLICER can search for and load STL models directly into the Model Gallery panel. You can either add models to your existing collection or completely replace the gallery with new search results.

This feature searches across **6 major 3D model platforms simultaneously**, downloading up to 10 models per search and displaying them with real-time 3D previews.

## Quick Start

### Step 1: Access the AI Assistant
- Located in the **right panel** of the application
- Look for the **🤖 AI ASSISTANT** header
- You can either **type** commands or use **voice input** (🎤 button)

### Step 2: Choose Your Command Type

**Replace Mode** - Clears gallery and loads only new models:
```
🎤 "Load top 10 backscratchers"
🎤 "Load phone holders"
🎤 "Replace with cable organizers"
🎤 "Show only desk accessories"
```

**Add Mode** - Adds models to your existing gallery:
```
🎤 "Find me some phone stands"
🎤 "Search for cable clips"
🎤 "Get me tool holders"
🎤 "Show me bookmarks"
```

### Step 3: Review & Select
- Models appear in the **left panel** (Model Gallery)
- Each model shows a **3D preview** that you can rotate
- **Click** any model to select it for viewing/modification
- **Hover** over thumbnails to enable manual rotation

## Detailed Usage Examples

### For Product Designers
```
User: "Load top 10 phone stands"
Result: Gallery clears, 10 phone stand models load
Action: Select one, then say "Make it 20% bigger"
```

### For Makers & Hobbyists
```
User: "Find cable management clips"
Result: 10 cable clip models added to gallery
Action: "Also find wall mounting brackets"
Result: 10 more models added (20 total in gallery)
```

### For Production Planning
```
User: "Replace with production jigs"
Result: Gallery clears, shows only jig models
Action: Review options, select best fit
Action: "Export to STL" or "Send to Printer"
```

## How It Works

### 1. Natural Language Processing
The AI analyzes your command to understand your intent:
- **Voice Input**: Click 🎤 microphone button and speak naturally
- **Text Input**: Type your command in the AI prompt field
- **Intent Detection**: AI determines if you want to replace or add models

### 2. Command Keywords Reference

#### Replace Keywords (Clears gallery, loads only new results)
Use these words to start fresh:
- **"Load"** - "Load top 10 vases"
- **"Replace"** - "Replace with tool holders"
- **"Show only"** - "Show only phone accessories"
- **"Clear and"** - "Clear and get organizers"
- **"Reset and"** - "Reset and load brackets"

#### Add Keywords (Keeps existing models, adds new ones)
Use these words to expand your collection:
- **"Find"** - "Find me cable clips"
- **"Search"** - "Search for wall hooks"
- **"Look for"** - "Look for desk accessories"
- **"Get"** - "Get some tool holders"
- **"Show me"** - "Show me phone stands"
- **"Import"** - "Import bookmarks"
- **"Fetch"** - "Fetch some organizers"

### 3. Multi-Platform Search Engine
The system searches across **6 major platforms** simultaneously:
- **Thingiverse** - Largest community repository
- **Printables** - Prusa's curated collection
- **MakerWorld** - Bambu Lab's marketplace
- **Creality Cloud** - Creality's model library
- **GrabCAD** - Professional CAD models
- **StudioTripo** - AI-generated models

### 4. Intelligent Model Processing
1. **Search**: Queries all platforms at once for best results
2. **Filter**: Selects top 10 most relevant models
3. **Download**: Automatically fetches STL files
4. **Process**: Generates 3D thumbnails in real-time
5. **Display**: Shows models in gallery with interactive previews
6. **Ready**: Click any model to view, modify, or export

### 5. Performance Optimization
- **Lazy Loading**: Only loads visible thumbnails first
- **Progressive Display**: Models appear as they download
- **Smart Caching**: Previously loaded models stay in memory
- **Viewport Detection**: Renders only what you can see

## Advanced Features

### Voice Commands
The microphone button (🎤) enables hands-free operation:

**Best Practices for Voice Input:**
1. Click the microphone button (turns red when listening)
2. Speak clearly and naturally
3. Use complete phrases: "Load top 10 backscratchers"
4. The AI shows a "Listening..." indicator
5. During search, shows "Searching across 6 platforms..."

**Voice Command Tips:**
- **Be Specific**: "Load desk organizers" > "Load organizers"
- **Include Numbers**: "Load top 10 phone stands" works great
- **Natural Language**: Speak as you normally would
- **Wait for Prompt**: Ensure you see "Listening..." before speaking

### Search Quality Tips

#### Getting Better Results
1. **Use Specific Terms**: 
   - ✅ "Load cable management clips"
   - ❌ "Load things"

2. **Include Details**:
   - ✅ "Find phone stands with cable management"
   - ❌ "Find phone stuff"

3. **Use Common Names**:
   - ✅ "Load desk organizers"
   - ❌ "Load table tidiers"

4. **Try Variations**:
   - If "backscratchers" finds nothing, try "back scratchers" or "massage tools"

#### Understanding Results
- **Model Count**: Up to 10 models per search
- **Platform Mix**: Results come from all available platforms
- **Quality Filter**: AI prioritizes well-rated, printable models
- **Format**: Only STL files (standard for 3D printing)

### Model Management

#### Viewing Models
- **3D Preview**: Each thumbnail shows rotating 3D preview
- **Hover Interaction**: Hover to manually rotate/zoom
- **Click Selection**: Click to load full model in main viewer
- **Auto-Rotate**: Thumbnails rotate automatically when not hovered

#### Organizing Your Gallery
- **Replace Mode**: Start fresh with new category
- **Add Mode**: Build a diverse collection
- **Delete**: Click 🗑️ on imported models to remove
- **Selection**: Currently selected model is highlighted

### API Configuration (Optional)

Some platforms offer better results with API keys:

1. Click **⚙️ Settings** in AI Assistant panel
2. Scroll to **"🔍 Model Search API Keys"**
3. Enter keys for platforms you want to use:
   - **Thingiverse**: Get from apps.thingiverse.com
   - **Printables**: Public API (no key needed)
   - Other platforms as they become available

**Note**: The feature works without API keys, but keys may provide:
- Higher rate limits
- Better search quality
- Access to premium models
- Faster download speeds

## Real-World Workflows

### Scenario 1: Rapid Prototyping
**Goal**: Find and customize a phone stand for production

```
Step 1: "Load top 10 phone stands"
→ Gallery clears, 10 phone stand models appear

Step 2: Click through models to review designs
→ Thumbnails show 3D previews
→ Click model for full view in main panel

Step 3: "Make it 20% bigger"
→ AI scales the selected model
→ Changes appear in real-time

Step 4: "Export to STL"
→ Download ready for 3D printing or further work
```

**Time Saved**: Minutes instead of hours searching individual sites

### Scenario 2: Building a Project Library
**Goal**: Collect various cable management solutions

```
Step 1: "Find cable clips"
→ 10 cable clip models added to gallery

Step 2: "Also find cable organizers"
→ 10 organizer models added (20 total now)

Step 3: "Get cable routing brackets"
→ 10 bracket models added (30 total)

Step 4: Browse entire collection
→ Compare designs side-by-side
→ Select best options for your project
```

**Benefit**: Build comprehensive collections without switching platforms

### Scenario 3: Category-Focused Work
**Goal**: Work on tool organization project

```
Step 1: "Replace with tool organizers"
→ Gallery clears completely
→ 10 tool organizer models load
→ Clean workspace for focused work

Step 2: Review and select preferred design
→ Click model to load in viewer
→ Rotate, zoom, inspect details

Step 3: "Add a base platform"
→ AI modifies design
→ Export customized version
```

**Advantage**: Stay focused on one category without distractions

### Scenario 4: Client Presentation
**Goal**: Show multiple options to client quickly

```
Step 1: "Load desk accessories"
→ Present curated collection instantly

Step 2: Client feedback in real-time
→ "Show me more minimalist designs"
→ Gallery updates with new options

Step 3: "Make this one blue"
→ Customize selected model live
→ Export approved designs immediately
```

**Impact**: Professional presentations with instant customization

### Scenario 5: Production Planning
**Goal**: Evaluate manufacturing options

```
Step 1: "Load production jigs"
→ 10 jig designs from multiple platforms

Step 2: Compare complexity and printability
→ 3D previews show structural details
→ Identify easiest to manufacture

Step 3: "Send to Printer"
→ Direct integration with slicer/printer
→ Start production immediately
```

**Efficiency**: From search to production in minutes

## Troubleshooting

### No Models Found
**Problem**: Search returns no results

**Solutions**:
1. **Try Different Keywords**: "back scratchers" vs "backscratchers"
2. **Broaden Search**: "tools" instead of "specific tool name"
3. **Check Spelling**: Voice input might misinterpret
4. **Use Common Terms**: Standard names work better
5. **Try Category Names**: "desk accessories", "cable management", etc.

### Models Not Loading
**Problem**: Search completes but models don't appear

**Solutions**:
1. **Check Internet**: Ensure stable connection
2. **Wait Longer**: Large files take time to download
3. **Refresh Page**: Reload the application
4. **Clear Cache**: Browser settings → Clear cache
5. **Check Console**: DevTools may show specific errors

### Voice Input Not Working
**Problem**: Microphone button doesn't respond

**Solutions**:
1. **Browser Permission**: Allow microphone access in browser
2. **Use Chrome/Edge**: Best support for speech recognition
3. **Check Microphone**: Test in system settings
4. **Refresh Page**: Reload and try again
5. **Use Text**: Type commands as alternative

### Search Too Slow
**Problem**: Takes long time to find models

**Possible Causes**:
1. **Platform Delays**: Some sites respond slower
2. **Network Speed**: Check internet connection
3. **File Size**: Large models take longer
4. **Server Load**: Platform may be busy

**Tips**:
- Be patient - searching 6 platforms takes time
- Use specific terms to reduce irrelevant results
- Consider API keys for faster access

### Model Preview Not Rendering
**Problem**: Thumbnails show empty/gray boxes

**Solutions**:
1. **Scroll Position**: Scroll to trigger lazy loading
2. **GPU Check**: Ensure hardware acceleration enabled
3. **Browser Update**: Use latest browser version
4. **WebGL Support**: Verify browser supports WebGL
5. **Memory**: Close other tabs to free resources

## Pro Tips & Best Practices

### Search Strategy
1. **Start Broad, Then Narrow**: 
   - First: "Load organizers"
   - Then: "Load cable organizers" if needed

2. **Use Industry Terms**:
   - ✅ "jigs", "fixtures", "brackets"
   - ❌ Made-up or unclear terms

3. **Think Like a Maker**:
   - What would this be called on Thingiverse?
   - What category would it be in?

### Workflow Optimization
1. **Replace for New Projects**: Start fresh each project
2. **Add for Exploration**: Build collections over time
3. **Combine with AI Mods**: Load → Select → Modify → Export
4. **Use Voice for Speed**: Faster than typing and clicking

### Quality Control
1. **Preview Before Selecting**: Hover to inspect models
2. **Check Complexity**: Some models are very detailed
3. **Consider Print Time**: Simpler models print faster
4. **Test Small First**: Print at reduced scale initially

### Keyboard Shortcuts (Coming Soon)
- `Ctrl + M`: Focus AI prompt
- `Ctrl + Space`: Toggle microphone
- `Escape`: Clear current selection
- `Delete`: Remove selected model

## System Requirements

### Minimum Requirements
- **Browser**: Chrome 90+, Edge 90+, Firefox 88+
- **Internet**: Stable broadband connection
- **RAM**: 4GB minimum
- **GPU**: WebGL 2.0 support

### Recommended Specifications
- **Browser**: Latest Chrome or Edge
- **Internet**: 10+ Mbps download speed
- **RAM**: 8GB or more
- **GPU**: Dedicated graphics card
- **Storage**: SSD for better performance

### Platform Support
- ✅ **Windows**: Full support
- ✅ **macOS**: Full support
- ✅ **Linux**: Full support
- ✅ **Electron App**: Native desktop performance
- ⚠️ **Mobile**: Limited (touch interface coming)

## Privacy & Security

### Data Handling
- **No Model Upload**: Your searches stay private
- **Local Storage**: Imported models stored locally
- **API Keys**: Encrypted in browser storage
- **No Tracking**: We don't track your searches

### Platform Connections
- Direct API calls to model platforms
- No intermediary servers
- Standard HTTPS encryption
- Rate limiting for fair use

## Support & Resources

### Getting Help
1. **Documentation**: Check `/docs` folder
2. **GitHub Issues**: Report bugs or request features
3. **Community**: Join discussions
4. **Email Support**: support@slicer.app (if available)

### Additional Resources
- [MODEL_SEARCH.md](./MODEL_SEARCH.md) - Technical details
- [AI_FEATURES.md](./AI_FEATURES.md) - All AI capabilities
- [README.md](./README.md) - Main documentation
- Platform APIs: Links to Thingiverse, Printables, etc.

## Frequently Asked Questions

**Q: Can I save my favorite searches?**
A: Coming in a future update. For now, use the prompt library.

**Q: Why only 10 models per search?**
A: Balance between variety and performance. More models = longer load times.

**Q: Can I search for non-STL formats?**
A: Currently STL only. Support for OBJ, 3MF planned.

**Q: Do I need accounts on these platforms?**
A: No, but API keys (optional) may provide better results.

**Q: Can I use this offline?**
A: No, requires internet to search and download models.

**Q: Is this free?**
A: Yes! Model search is free. Some platforms may have premium models.

**Q: Can I upload my own models?**
A: Yes, drag & drop STL files into the Model Gallery.

**Q: How do I combine multiple models?**
A: Load models, select one, use AI to add features, or use external CAD software.

---

## Technical Implementation Details

### Components Modified

**1. App.jsx**
- Added `replaceExisting` parameter to `handleModelsFound()`
- Supports both adding and replacing models in gallery
- Manages state for imported and search result models

**2. ModelGallery.jsx**
- Converted to `forwardRef` component for parent access
- Added `replaceModels()` method via `useImperativeHandle`
- Clears selection when replacing models
- Implements lazy loading for performance

**3. AIChat.jsx**
- Enhanced `detectAndHandleSearch()` to detect replace intent
- Updated `handleModelSearch()` to pass replace flag
- Better keyword detection for different actions
- Real-time search status indicators

### API Structure

```javascript
// Add models to existing gallery
handleModelsFound(models, false);

// Replace all models in gallery
handleModelsFound(models, true);
```

### Event Flow
```
User Input → Keyword Detection → Platform Search → 
Download STL → Generate Thumbnail → Display → User Selection
```

---

**Last Updated**: November 5, 2025
**Version**: 1.0.0
**Feature Status**: ✅ Production Ready
