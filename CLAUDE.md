# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chrome browser extension (Manifest V3) that provides instant word definitions by opening Vocabulary.com pages in smart popup windows. Users right-click selected text to access definitions, and the extension includes a configurable popup interface for settings management and usage statistics.

## Development Commands

### Extension Testing
- **Load in Chrome**: Navigate to `chrome://extensions/`, enable Developer mode, click "Load unpacked", select the project folder
- **Test Popup Interface**: Click the extension icon to access settings popup
- **Test Right-Click Feature**: Select text, right-click, choose "Look up [word] in Vocabulary.com"
- **Test Page**: Open `test.html` in Chrome to test functionality with sample words
- **View Console**: Access `chrome://extensions/` → Details → Inspect views: background page for background script logs

### Icon Management
- **Current Status**: All required icons exist (icon16.png, icon32.png, icon48.png, icon128.png)
- **Icon Formats**: PNG format required for Chrome extensions
- **Testing**: Icons display correctly in extension toolbar and Chrome extensions page

### Development Dependencies
- **No Build Process**: This is a simple extension with no build steps required
- **Testing**: No additional dependencies needed for development

## Architecture Overview

### Core Components Architecture

1. **Background Service Worker** (`background.js`)
   - Handles extension lifecycle and settings management
   - Creates context menu items for right-click functionality
   - Manages popup window creation with smart positioning
   - Stores user preferences in `chrome.storage.sync`
   - Tracks usage statistics (words looked up, popups opened)
   - Handles message passing between popup and background scripts

2. **Settings Popup Interface** (`popup.html/popup.js/popup.css`)
   - Extension icon click opens settings popup
   - Toggle extension on/off functionality
   - Configure smart positioning and window size options
   - Display usage statistics with reset capability
   - Interactive test area with sample words
   - Responsive design with dark mode support

3. **Context Menu Integration**
   - Right-click on selected text shows "Look up [word] in Vocabulary.com"
   - Directly opens Vocabulary.com definition pages
   - Smart popup window positioning (right side of screen)
   - Configurable window sizes (Compact/Standard/Large)

4. **No Content Script Required**
   - Pure context menu approach eliminates content script injection
   - Simplified architecture with fewer permissions
   - Direct navigation to Vocabulary.com for full feature access

### Data Flow Pattern

```
Text Selection → Right-Click → Context Menu → Background Script → Smart Popup Window → Vocabulary.com
                                                     ↓
Settings Popup ← Chrome Storage ← Settings Management ← Message Passing
```

### Extension Permissions

- `contextMenus`: Create right-click menu items for selected text
- `tabs`: Basic tab operations and opening new tabs
- `windows`: Create and position popup windows
- `storage`: Persist user settings and usage statistics

## Key Technical Details

### Smart Window Positioning System
- Intelligent popup window placement on right side of current window
- Automatic adjustment to prevent off-screen positioning
- Configurable window sizes (400×600, 450×650, 500×700)
- Responsive positioning based on screen boundaries
- Maintains 10px margin from screen edges

### Settings Management
- Uses `chrome.storage.sync` for cross-device synchronization
- Default settings initialized on extension install
- Real-time settings updates via message passing
- Settings persist across browser sessions
- Reset functionality for usage statistics

### Usage Statistics Tracking
- Tracks total words looked up
- Counts popup windows opened
- Statistics displayed in popup interface
- Local storage for performance
- User-controlled reset capability

## File Structure

```
vocabulary-lookup-extension/
├── manifest.json              # Extension configuration (Manifest V3)
├── background.js              # Service worker (context menu, settings, statistics)
├── popup.html                 # Settings popup interface HTML
├── popup.js                   # Popup JavaScript logic and message handling
├── styles/
│   └── popup.css             # Settings popup styling with dark mode support
├── icons/                    # Extension icons (PNG format)
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
├── test.html                 # Development testing page with sample words
├── README.md                 # Project documentation
├── CLAUDE.md                 # Claude Code development guidance (this file)
└── docs/                     # Additional documentation
    ├── INSTALLATION.md
    ├── TROUBLESHOOTING.md
    └── POPUP_GUIDE.md
```

## Common Issues & Solutions

### Extension Won't Load
1. Check browser console for manifest validation errors
2. Verify all required PNG icons exist in icons/ folder
3. Ensure manifest.json syntax is valid (use JSON validator)
4. Check that all permissions are correctly specified

### Popup Interface Not Opening
1. Verify extension is properly loaded in Chrome extensions page
2. Check that popup.html, popup.js, and popup.css files exist
3. Ensure `default_popup` is correctly configured in manifest.json
4. Check browser console for JavaScript errors in popup

### Right-Click Menu Not Appearing
1. Verify extension is enabled in popup settings
2. Ensure text is properly selected before right-clicking
3. Check that contextMenus permission is granted
4. Verify background script is running (check service worker logs)

### Popup Window Not Opening
1. Check that `windows` permission is granted
2. Verify browser popup blocker settings
3. Ensure selected text is not empty or invalid
4. Check network connectivity to Vocabulary.com

## Development Notes

- **No Build Process**: Direct file modification, reload extension to test changes
- **Debugging**: Use Chrome DevTools + background service worker inspection (`chrome://extensions/` → Inspect views)
- **Testing**: Use `test.html` with sample words or any web page with selectable text
- **Popup Testing**: Click extension icon to test settings interface functionality
- **Message Passing**: Use async/await pattern for popup ↔ background communication
- **Icon Requirements**: Chrome extensions require PNG format icons (16, 32, 48, 128px sizes)
- **Manifest V3**: Uses service worker instead of background page, supports modern async patterns
- **Storage**: Use `chrome.storage.sync` for settings, `chrome.storage.local` for statistics
- **Window API**: Chrome windows API provides precise control over popup positioning and sizing

### Development Workflow

1. **Make Changes**: Edit HTML/JS/CSS files directly
2. **Reload Extension**: Go to `chrome://extensions/` and click reload button
3. **Test Popup**: Click extension icon to verify settings interface
4. **Test Context Menu**: Select text on any page, right-click, test lookup functionality
5. **Check Console**: Monitor background service worker logs for errors
6. **Verify Settings**: Ensure settings persist across extension reloads