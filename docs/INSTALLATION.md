# 🔧 Installation Guide for Vocabulary Lookup Extension

## Quick Start

### Step 1: Prepare the Extension

1. Make sure you have all the files in the `vocabulary-lookup-extension` folder
2. **Important**: Create PNG icons (the extension currently has SVG icons, but Chrome requires PNG format)

### Step 2: Create Missing Icons

Before installing, you need to create PNG icons. You can:

1. **Use an online converter** to convert the SVG icon to PNG format in these sizes:
   - icon16.png (16x16 pixels)
   - icon32.png (32x32 pixels) 
   - icon48.png (48x48 pixels)
   - icon128.png (128x128 pixels)

2. **Or create simple placeholder icons** using any image editor

3. **Or temporarily comment out** the icon references in `manifest.json` for testing

### Step 3: Install in Chrome

1. Open Google Chrome
2. Navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right corner)
4. Click **Load unpacked**
5. Select the `vocabulary-lookup-extension` folder
6. The extension should now appear in your extensions list

### Step 4: Test the Extension

1. Open the `test.html` file in Chrome (or any webpage)
2. Select any word or phrase
3. A tooltip should appear with the definition
4. Click the extension icon to access settings

## Troubleshooting

### Extension Won't Load
- **Check for missing PNG icons** - this is the most common issue
- Ensure all files are present in the directory
- Check the browser console for errors (`chrome://extensions/` → Details → Inspect views: background page)

### No Tooltip Appearing
- Ensure the extension is enabled
- Check if popup blocker is interfering
- Try refreshing the page
- Check extension settings (click the extension icon)

### API Errors
- Check internet connection
- The Free Dictionary API might be temporarily down
- Try different words if some don't work

## Development Notes

### Current Status
✅ Content script functionality  
✅ Tooltip styling and positioning  
✅ API integration  
✅ Background script  
✅ Settings popup  
❌ PNG icons (need to be created)  

### Next Steps
1. Create proper PNG icons
2. Test thoroughly on various websites
3. Optimize API calls and caching
4. Add more dictionary sources if needed
5. Publish to Chrome Web Store

### File Permissions
The extension needs these permissions:
- `activeTab`: To access content on the current tab
- `storage`: To save settings and cache definitions
- `https://www.vocabulary.com/*`: To access vocabulary.com for definitions
- `https://api.dictionaryapi.dev/*`: To access the free dictionary API

## Support

If you encounter issues:
1. Check the console for errors
2. Verify all files are present
3. Ensure PNG icons are created
4. Try loading on different websites

## Files Included

```
vocabulary-lookup-extension/
├── manifest.json           ✅ Extension configuration
├── content.js              ✅ Main functionality
├── background.js           ✅ Background service worker
├── popup.html             ✅ Settings interface
├── popup.js               ✅ Settings functionality
├── styles/
│   ├── content.css        ✅ Tooltip styling
│   └── popup.css          ✅ Popup styling
├── lib/
│   └── vocabulary-api.js  ✅ API integration
├── icons/
│   └── icon16.svg         ❌ Convert to PNG format
├── test.html              ✅ Test page
├── README.md              ✅ Documentation
└── INSTALLATION.md        ✅ This file
```

---

**Ready to install?** Follow the steps above and start looking up words instantly! 📚✨