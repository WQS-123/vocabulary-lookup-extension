# Vocabulary Lookup Extension 📚

A smart Chrome extension that opens Vocabulary.com definitions in a convenient popup window with configurable settings and intelligent positioning.

<p align="center">
  <img src="icons/icon128.png" alt="Extension Icon" width="128" height="128">
</p>

## ✨ Features

- **🎯 Smart Popup Window** - Opens definitions in a configurable window (400x600 to 500x700px)
- **🧠 Intelligent Positioning** - Automatically adjusts position to avoid going off-screen
- **⚙️ Customizable Settings** - Click extension icon to access settings popup
- **📊 Usage Statistics** - Track words looked up and popups opened
- **🔍 Full Vocabulary.com Experience** - Access all features including pronunciations, examples, etymology
- **⚡ Right-Click Access** - Simply right-click any selected text
- **🎨 Non-Intrusive Design** - Popup doesn't block main content

## 🚀 How It Works

### 📖 Looking Up Words
1. **Select** any word or phrase on any webpage
2. **Right-click** to open the context menu  
3. **Click** "Look up [word] in Vocabulary.com"
4. **Enjoy** the definition in a smart popup window!

### ⚙️ Accessing Settings
1. **Click** the extension icon in your browser toolbar
2. **Configure** popup settings (enable/disable, positioning, window size)
3. **View** usage statistics and reset if needed
4. **Test** the extension with sample words provided

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
- **Service Worker** background script for context menu handling and settings management
- **Popup Interface** for extension settings and configuration
- **Smart Window API** for intelligent popup positioning
- **Chrome Storage** for persistent settings and usage statistics

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
├── background.js           # Service worker (context menu + settings)
├── popup.html              # Settings popup interface
├── popup.js                # Popup JavaScript logic
├── styles/
│   └── popup.css          # Popup interface styling
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
- **📚 Academic Reading** - Look up technical terms without losing focus
- **📰 News Articles** - Quick vocabulary checks while reading
- **🌍 Language Learning** - Instant definitions for unknown words
- **✍️ Writing** - Verify word meanings and usage
- **📖 E-books & Articles** - Enhance reading comprehension

## 🔧 Configuration

### Extension Settings (Click icon to access)
- **Enable Extension**: Turn right-click word lookup on/off
- **Smart Positioning**: Automatically position popup windows optimally  
- **Window Size**: Choose from Compact (400×600), Standard (450×650), or Large (500×700)
- **Usage Statistics**: View words looked up and popups opened
- **Quick Test**: Try the extension with provided sample words

### Default Behavior
- **Position**: Right side of current window with intelligent adjustment
- **Margin**: 10px from screen edges
- **Auto-adjust**: Prevents off-screen positioning

## 🐛 Troubleshooting

### Common Issues

**Extension icon doesn't show popup?**
- Ensure extension is properly loaded and enabled
- Check that popup.html exists in extension folder
- Try reloading the extension

**Right-click menu doesn't appear?**
- Ensure text is properly selected
- Check that the extension is enabled in popup settings
- Try reloading the extension

**Popup window doesn't open?**
- Verify `windows` permission is granted
- Check browser popup settings
- Make sure extension is enabled in settings
- See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for detailed solutions

### Getting Help

1. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. Open an [issue](../../issues) on GitHub
3. Include Chrome version and error messages

## 🔒 Privacy

- **No Personal Data Collection**: The extension doesn't collect or store personal information
- **No Tracking**: No analytics or user tracking
- **External Connections**: Only connects to Vocabulary.com for word definitions
- **Minimal Permissions**: Only requires contextMenus, tabs, and windows permissions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup

1. Clone the repository
2. Make your changes
3. Test with `test.html`
4. Submit a pull request

### Ideas for Enhancement

- [ ] Add keyboard shortcuts
- [ ] Support for other dictionary sources  
- [ ] Advanced window positioning options
- [ ] Enhanced statistics and usage tracking
- [ ] Export lookup history
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
![Version](https://img.shields.io/badge/version-2.0.0-blue)
![Manifest](https://img.shields.io/badge/manifest-v3-green)

---

<p align="center">
  <strong>Happy Learning! 🎓</strong><br>
  Made with ❤️ for vocabulary enthusiasts
</p>