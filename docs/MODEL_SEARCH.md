# Voice-Activated Model Search Feature

## Overview
The voice-activated model search feature allows users to search for 3D models across multiple repositories using natural language voice commands. Simply press the 🎤 Voice button and say "find me a [model type]" to automatically search and import the top 10 results.

## Supported Platforms
1. **Thingiverse** - Requires API key
2. **Printables** - Public API (no key needed)
3. **MakerWorld** - Coming soon
4. **Creality Cloud** - Coming soon
5. **GrabCAD** - Coming soon
6. **StudioTripo** - Coming soon

## How to Use

### Basic Voice Search
1. Click the **🎤 Voice** button in the AI Customization panel
2. Say one of these commands:
   - "Find me a phone stand"
   - "Search for a gear"
   - "Get me a vase"
   - "Show me a toy car"
   - "I need a bracket"
   - "Look for a keychain"

### Search Types Supported
- **Function-based**: "find a bottle opener", "get a phone holder"
- **Dimension-based**: "find a 50mm gear", "get a 10cm cube"
- **Designer-based**: "find models by [designer name]"
- **Similar models**: "find something like this"

### Results
- Automatically searches across **all 6 platforms**
- Returns **top 10 results**
- Models are **automatically imported** to the gallery
- Each result shows:
  - Model name
  - Source platform
  - Creator name
  - Thumbnail preview
  - Download link

## API Key Setup

### Thingiverse
1. Go to [Thingiverse Apps](https://www.thingiverse.com/apps)
2. Create a new app
3. Copy your API access token
4. In Slicer: Click ⚙️ API Key → Enter Thingiverse key

### Printables
No API key needed - uses public search API.

### Other Platforms
API support coming soon. Models will be available once APIs are accessible.

## Voice Commands Examples

### General Search
- "Find me a phone case"
- "Search for gears"
- "Get a vase model"
- "Show me miniatures"

### Specific Search
- "Find me a 20mm gear"
- "Get a small bracket"
- "Search for hollow vases"
- "Find articulated toys"

### Category Search
- "Find mechanical parts"
- "Get some decorations"
- "Search for tools"
- "Find game pieces"

## Technical Details

### Search Process
1. **Voice Recognition**: Web Speech API captures your voice
2. **Intent Detection**: Analyzes keywords (find, search, get, etc.)
3. **Query Extraction**: Removes command words, keeps search terms
4. **Multi-Platform Search**: Queries all 6 repositories in parallel
5. **Result Processing**: Downloads metadata for top 10 matches
6. **Auto-Import**: Adds results to model gallery

### Search Keywords Detected
- find, search, look for
- get, download, import
- need, want, show me
- fetch, grab, pull

### Model Data Structure
```javascript
{
  id: unique_id,
  name: "Model Name",
  description: "Model description",
  thumbnail: "URL or emoji",
  downloadUrl: "https://...",
  source: "Thingiverse",
  creator: "Designer Name",
  isSearchResult: true
}
```

## Troubleshooting

### "No models found"
- Try different search terms
- Be more specific or more general
- Check spelling
- Try singular vs plural ("gear" vs "gears")

### "Search failed"
- Check internet connection
- Verify API keys are configured
- Platform may be temporarily unavailable
- Try again in a moment

### Voice not detected
- Use Chrome or Edge browser
- Allow microphone permissions
- Check microphone is working
- Speak clearly after clicking 🎤

## Privacy & Security

### API Keys
- Stored locally in browser localStorage
- Never sent to our servers
- Only used for direct API calls to model repositories
- Can be deleted anytime

### Voice Data
- Processed by browser's Web Speech API
- No voice data stored or transmitted
- Transcript used only for search
- Cleared after each search

## Future Enhancements

### Planned Features
- [ ] AI-powered search refinement
- [ ] Filter by license type
- [ ] Sort by popularity/date/rating
- [ ] Preview models before import
- [ ] Batch download options
- [ ] Search history
- [ ] Favorite searches
- [ ] Custom search profiles

### Additional Platforms
- [ ] MyMiniFactory
- [ ] Cults3D
- [ ] CGTrader
- [ ] Yeggi (meta-search)
- [ ] NIH 3D Print Exchange
- [ ] NASA 3D Resources

## API Rate Limits

### Thingiverse
- 300 requests/hour with API key
- Respect rate limits to avoid blocking

### Printables
- Public API - reasonable use expected
- No strict rate limits currently

### Best Practices
- Wait for search to complete before starting another
- Be specific to get better results faster
- Use API keys to increase limits

## Support

### Issues
- File bug reports on GitHub
- Include search query used
- Include browser console logs
- Mention which platform failed

### Feature Requests
- Suggest new platforms to support
- Request search filter options
- Propose UI improvements

## Credits
Built with ❤️ for the 3D printing community.

Uses APIs from:
- Thingiverse by MakerBot
- Printables by Prusa Research
- And more coming soon!
