# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chrome browser extension (Manifest V3) that provides instant word definitions through tooltips when users select text on any webpage. The extension uses multiple dictionary APIs with fallback mechanisms and includes caching for performance.

## Development Commands

### Extension Testing
- **Load in Chrome**: Navigate to `chrome://extensions/`, enable Developer mode, click "Load unpacked", select the project folder
- **Test Page**: Open `test.html` in Chrome to test functionality
- **View Console**: Access `chrome://extensions/` → Details → Inspect views: background page for background script logs

### Icon Management
- **Current Status**: Only `icon16.png` exists, missing icon32.png, icon48.png, icon128.png
- **Create Missing Icons**: Use `python3 create-png.py` pattern or convert SVG manually for other sizes
- **Alternative**: Use `manifest-no-icons.json` temporarily by renaming to `manifest.json`

### Development Dependencies
- **Canvas**: `npm install canvas` (for PNG generation from SVG)
- **No Build Process**: This is a simple extension with no build steps required

## Architecture Overview

### Core Components Architecture

1. **Content Script Flow** (`content.js`)
   - Handles text selection events (`mouseup`)
   - Creates and positions tooltips dynamically
   - Manages tooltip lifecycle (show/hide/auto-hide)
   - Communicates with background script for fallback API calls

2. **Background Service Worker** (`background.js`)
   - Handles extension lifecycle and settings
   - Manages vocabulary.com scraping as fallback
   - Stores user preferences in `chrome.storage.sync`
   - Updates extension badge based on enabled/disabled state

3. **API Integration Layer** (`lib/vocabulary-api.js`)
   - Primary: Free Dictionary API (`api.dictionaryapi.dev`)
   - Fallback: Vocabulary.com scraping via background script
   - In-memory caching with 24-hour expiry
   - Handles response parsing and data normalization

4. **Settings Interface** (`popup.html/popup.js`)
   - Toggle extension on/off
   - Configure auto-hide behavior
   - Control pronunciation and example display
   - Adjust tooltip hide delay (3-30 seconds)

### Data Flow Pattern

```
Text Selection → Content Script → API Lookup (Free Dict) → [Fallback: Background Script → Vocabulary.com] → Cache → Tooltip Display
```

### Extension Permissions

- `activeTab`: Access content on current tab for tooltip injection
- `storage`: Persist settings and cache definitions
- `https://api.dictionaryapi.dev/*`: Primary dictionary API
- `https://www.vocabulary.com/*`: Fallback dictionary scraping

## Key Technical Details

### Tooltip Positioning System
- Smart positioning prevents off-screen tooltips
- Automatically flips above/below selection based on viewport
- Responsive arrow positioning
- Handles scroll events to hide tooltips

### API Strategy
1. **First**: Free Dictionary API (reliable, structured JSON)
2. **Fallback**: Vocabulary.com scraping (when primary fails)
3. **Cache**: 24-hour in-memory storage to reduce API calls
4. **Error Handling**: Graceful degradation with user-friendly messages

### Settings Persistence
- Uses `chrome.storage.sync` for cross-device synchronization
- Default settings initialized on extension install
- Real-time settings updates without page refresh

## File Structure

```
vocabulary-lookup-extension/
├── manifest.json              # Extension configuration (Manifest V3)
├── content.js                 # Main content script (text selection, tooltips)
├── background.js              # Service worker (API fallback, settings)
├── popup.html/popup.js        # Settings popup interface
├── lib/vocabulary-api.js      # API integration and caching layer
├── styles/
│   ├── content.css           # Tooltip styling (sticky note design)
│   └── popup.css             # Settings popup styling
├── icons/                    # Extension icons (PNG format required)
├── test.html                 # Development testing page
└── INSTALLATION.md           # Setup instructions
```

## Common Issues & Solutions

### Extension Won't Load
1. Check for missing PNG icons (most common cause)
2. Temporarily use `manifest-no-icons.json` if icons missing
3. Check browser console for manifest validation errors

### Tooltip Not Appearing
1. Verify extension is enabled in popup settings
2. Check that text selection contains only letters/spaces/hyphens
3. Ensure content script loaded (check browser console)

### API Failures
- Primary API failures automatically trigger vocabulary.com fallback
- Network issues show "Could not find definition" error
- Cache reduces API dependency for repeated lookups

## Development Notes

- **No Build Process**: Direct file modification, reload extension to test
- **Debugging**: Use Chrome DevTools on content pages + background page inspection
- **Testing**: Use `test.html` or any web page with selectable text
- **Icon Requirements**: Chrome extensions require PNG format icons in multiple sizes
- **Manifest V3**: Uses service worker instead of background page, async message passing patterns