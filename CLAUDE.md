# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chrome browser extension (Manifest V3) that provides instant word definitions by opening Vocabulary.com pages in smart popup windows. Users right-click selected text to access definitions, and the extension includes a comprehensive search history interface that tracks all vocabulary lookups with timestamps, search counts, and intelligent filtering capabilities.

## Development Commands

### Extension Testing
- **Load in Chrome**: Navigate to `chrome://extensions/`, enable Developer mode, click "Load unpacked", select the project folder
- **Test Search History Interface**: Click the extension icon to view search history popup
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
   - Handles extension lifecycle and search history management
   - Creates context menu items for right-click functionality
   - Manages popup window creation with smart positioning
   - Stores search history in `chrome.storage.local` with 100-item limit
   - Tracks search statistics and word frequency counts
   - Handles message passing between popup and background scripts
   - Manages duplicate word detection and search count incrementing

2. **Search History Interface** (`popup.html/popup.js/popup.css`)
   - Extension icon click opens search history popup
   - Display chronological list of all vocabulary lookups
   - Search/filter functionality to find specific words
   - Click any history item to reopen definition in popup window
   - Smart statistics showing today's searches and top word
   - Clear history functionality with confirmation
   - Modern dark-mode optimized responsive design

3. **Context Menu Integration**
   - Right-click on selected text shows "Look up [word] in Vocabulary.com"
   - Directly opens Vocabulary.com definition pages
   - Smart popup window positioning (right side of screen)
   - Optimized window size (450×650px) for best vocabulary.com experience
   - Automatic search history recording with timestamp and count tracking

4. **No Content Script Required**
   - Pure context menu approach eliminates content script injection
   - Simplified architecture with fewer permissions
   - Direct navigation to Vocabulary.com for full feature access

### Data Flow Pattern

```
Text Selection → Right-Click → Context Menu → Background Script → Smart Popup Window → Vocabulary.com
                                                     ↓
                                            Search History Storage
                                                     ↓
History Interface ← Message Passing ← History Management ← Chrome Storage (Local)
```

### Extension Permissions

- `contextMenus`: Create right-click menu items for selected text
- `tabs`: Basic tab operations and opening new tabs
- `windows`: Create and position popup windows
- `storage`: Persist search history and usage statistics

## Key Technical Details

### Smart Window Positioning System
- Intelligent popup window placement on right side of current window
- Automatic adjustment to prevent off-screen positioning
- Optimized window size (450×650px) for vocabulary.com content
- Responsive positioning based on screen boundaries
- Maintains 10px margin from screen edges
- Consistent positioning for both context menu and history reopened searches

### Search History Management
- Uses `chrome.storage.local` for fast local access to search history
- Automatic history recording for all vocabulary lookups
- Duplicate word detection with search count incrementing
- History limited to 100 most recent searches (FIFO)
- Real-time history updates via message passing
- Complete history clearing functionality

### Search Statistics and Analytics
- Tracks individual word search counts with timestamp data
- Calculates daily search statistics (today's count)
- Identifies most frequently searched word (top word)
- Real-time statistics display in popup interface
- Clickable top word for quick re-lookup
- Statistics automatically update when history changes

## File Structure

```
vocabulary-lookup-extension/
├── manifest.json              # Extension configuration (Manifest V3)
├── background.js              # Service worker (context menu, history, statistics)
├── popup.html                 # Search history interface HTML
├── popup.js                   # History display, search, and interaction logic
├── styles/
│   └── popup.css             # Search history interface styling with dark mode
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

### Search History Interface Not Opening
1. Verify extension is properly loaded in Chrome extensions page
2. Check that popup.html, popup.js, and popup.css files exist
3. Ensure `default_popup` is correctly configured in manifest.json
4. Check browser console for JavaScript errors in popup
5. Verify search history data is accessible in local storage

### Right-Click Menu Not Appearing
1. Extension is always enabled (no toggle required)
2. Ensure text is properly selected before right-clicking
3. Check that contextMenus permission is granted
4. Verify background script is running (check service worker logs)

### Popup Window Not Opening
1. Check that `windows` permission is granted
2. Verify browser popup blocker settings
3. Ensure selected text is not empty or invalid
4. Check network connectivity to Vocabulary.com

### Search History Not Saving
1. Verify `storage` permission is granted for local storage
2. Check background script service worker logs for storage errors
3. Ensure search history limit (100 items) is not causing issues
4. Test with simple word searches to verify storage functionality

## Development Notes

- **No Build Process**: Direct file modification, reload extension to test changes
- **Debugging**: Use Chrome DevTools + background service worker inspection (`chrome://extensions/` → Inspect views)
- **Testing**: Use `test.html` with sample words or any web page with selectable text
- **History Testing**: Click extension icon to test search history interface
- **History Verification**: Perform multiple searches and verify history tracking
- **Message Passing**: Use async/await pattern for popup ↔ background communication
- **Icon Requirements**: Chrome extensions require PNG format icons (16, 32, 48, 128px sizes)
- **Manifest V3**: Uses service worker instead of background page, supports modern async patterns
- **Storage**: Use `chrome.storage.local` for search history and statistics (fast access)
- **Window API**: Chrome windows API provides precise control over popup positioning and sizing

### Development Workflow

1. **Make Changes**: Edit HTML/JS/CSS files directly
2. **Reload Extension**: Go to `chrome://extensions/` and click reload button
3. **Test History Interface**: Click extension icon to verify search history display
4. **Test Context Menu**: Select text on any page, right-click, test lookup functionality
5. **Verify History Tracking**: Confirm searches are saved and displayed correctly
6. **Test History Features**: Try search filtering, history clearing, and item reopening
7. **Check Console**: Monitor background service worker logs for errors