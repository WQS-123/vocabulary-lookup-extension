# Vocabulary Lookup Extension 📚

A smart Chrome extension that opens Vocabulary.com definitions in convenient popup windows with intelligent positioning and comprehensive search history tracking.

<p align="center">
  <img src="icons/icon128.png" alt="Extension Icon" width="128" height="128">
</p>

## ✨ Features

- **🎯 Smart Popup Window** - Opens definitions in optimally positioned windows (450×650px)
- **🧠 Intelligent Positioning** - Automatically adjusts position to avoid going off-screen
- **📚 Search History** - Track and revisit all your vocabulary lookups with timestamps
- **🔍 History Search** - Filter through your search history to find previously looked up words
- **📊 Smart Statistics** - View today's searches and your most frequently looked up word
- **🔗 One-Click Reopening** - Click any history item to reopen definitions in popup windows
- **⚡ Right-Click Access** - Simply right-click any selected text
- **🎨 Modern Interface** - Clean, dark-mode optimized popup interface

## 🚀 How It Works

### 📖 Looking Up Words
1. **Select** any word or phrase on any webpage
2. **Right-click** to open the context menu  
3. **Click** "Look up [word] in Vocabulary.com"
4. **Enjoy** the definition in a smart popup window!
5. **Find it later** - All searches are automatically saved to your history

### 📚 Managing Search History
1. **Click** the extension icon in your browser toolbar
2. **Browse** your complete search history with timestamps and search counts
3. **Search** through history using the filter box
4. **Reopen** any previous search by clicking on history items
5. **View statistics** - See today's search count and your top word
6. **Clear history** when needed with the "Clear All" button

## 📦 Installation

### From Chrome Web Store
*Coming soon...*

### Manual Installation (Developer Mode)

1. **Download** this repository
   ```bash
   git clone https://github.com/yourusername/vocabulary-lookup-extension.git
   cd vocabulary-lookup-extension
   ```

2. **Open Chrome Extensions page**
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" (top-right toggle)

3. **Load the extension**
   - Click "Load unpacked"
   - Select the extension folder
   - The extension will appear in your extensions list

4. **Configure and test**
   - Click the extension icon to open settings
   - Open `test.html` or visit any webpage
   - Select text, right-click, and enjoy!

## 🛠️ Technical Details

### Architecture
- **Manifest V3** Chrome extension
- **Service Worker** background script for context menu handling and history management
- **Search History Interface** for viewing and managing vocabulary lookup history
- **Smart Window API** for intelligent popup positioning
- **Chrome Storage** for persistent search history and statistics

### Permissions
- `contextMenus` - Create right-click menu options
- `tabs` - Basic tab operations  
- `windows` - Create popup windows
- `storage` - Save user settings and statistics

### Browser Support
- Chrome 88+ (Manifest V3 support required)
- Edge 88+ (Chromium-based)

## 📁 Project Structure

```
vocabulary-lookup-extension/
├── manifest.json           # Extension configuration
├── background.js           # Service worker (context menu + history)
├── popup.html              # Search history interface
├── popup.js                # History display and search logic
├── styles/
│   └── popup.css          # Search history interface styling
├── icons/                  # Extension icons
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
├── test.html              # Testing page
└── docs/                  # Documentation
    ├── INSTALLATION.md
    ├── TROUBLESHOOTING.md
    └── POPUP_GUIDE.md
```

## 🎯 Use Cases

Perfect for:
- **📚 Academic Reading** - Look up technical terms and build a vocabulary reference
- **📰 News Articles** - Quick vocabulary checks with automatic history tracking
- **🌍 Language Learning** - Build and review your vocabulary learning progress
- **✍️ Writing** - Verify word meanings and revisit previous lookups
- **📖 E-books & Articles** - Create a personal vocabulary database while reading

## 🔧 Configuration

### Search History Interface (Click icon to access)
- **Search History**: Browse all your vocabulary lookups with timestamps
- **Search Filter**: Find specific words using the search box
- **Smart Statistics**: View today's search count and most frequently looked up word
- **One-Click Reopening**: Click any history item to reopen in popup window
- **History Management**: Clear all history when needed

### Popup Window Behavior
- **Position**: Right side of current window with intelligent adjustment
- **Size**: Optimized 450×650px window for best vocabulary.com experience
- **Margin**: 10px from screen edges
- **Auto-adjust**: Prevents off-screen positioning
- **Consistent Experience**: History items reopen with same positioning as original searches

## 🐛 Troubleshooting

### Common Issues

**Extension icon doesn't show search history?**
- Ensure extension is properly loaded and enabled
- Check that popup.html exists in extension folder
- Try reloading the extension

**Right-click menu doesn't appear?**
- Ensure text is properly selected
- Extension is always enabled (no settings toggle)
- Try reloading the extension

**Popup window doesn't open?**
- Verify `windows` permission is granted
- Check browser popup settings
- Ensure selected text is not empty
- See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for detailed solutions

**Search history not saving?**
- Check that local storage permissions are granted
- Verify background script is running
- History automatically limits to 100 most recent searches

### Getting Help

1. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. Open an [issue](../../issues) on GitHub
3. Include Chrome version and error messages

## 🔒 Privacy

- **Local Storage Only**: Search history is stored locally on your device
- **No Personal Data Collection**: The extension doesn't collect or transmit personal information
- **No Tracking**: No analytics or user tracking
- **External Connections**: Only connects to Vocabulary.com for word definitions
- **Minimal Permissions**: Only requires contextMenus, tabs, windows, and storage permissions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup

1. Clone the repository
2. Make your changes
3. Test with `test.html`
4. Submit a pull request

### Ideas for Enhancement

- [ ] Export search history to file
- [ ] Import/sync history across devices
- [ ] Add keyboard shortcuts for quick lookup
- [ ] Support for other dictionary sources
- [ ] Advanced history filtering and sorting
- [ ] Vocabulary learning features (spaced repetition)
- [ ] Offline word definitions cache

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Vocabulary.com](https://www.vocabulary.com) for providing excellent dictionary content
- Chrome Extensions team for the robust API
- All users who provide feedback and suggestions

## 📊 Stats

![GitHub stars](https://img.shields.io/github/stars/WQS-123/vocabulary-lookup-extension)
![GitHub forks](https://img.shields.io/github/forks/WQS-123/vocabulary-lookup-extension)
![GitHub issues](https://img.shields.io/github/issues/WQS-123/vocabulary-lookup-extension)
![Version](https://img.shields.io/badge/version-2.1.0-blue)
![Manifest](https://img.shields.io/badge/manifest-v3-green)

---

<p align="center">
  <strong>Happy Learning! 🎓</strong><br>
  Made with ❤️ for vocabulary enthusiasts
</p>