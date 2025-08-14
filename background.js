// Background Service Worker for Vocabulary Lookup Extension

// Default settings
const defaultSettings = {
  enabled: true,
  autoHide: true,
  showPronunciation: true,
  showExamples: true,
  hideDelay: 10000 // 10 seconds in milliseconds
};

// Initialize extension
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('Vocabulary Lookup extension installed/updated');
  
  // Initialize settings
  if (details.reason === 'install') {
    await chrome.storage.sync.set({ settings: defaultSettings });
    console.log('Default settings initialized');
  }
  
  // Create context menu
  chrome.contextMenus.create({
    id: 'vocabulary-lookup',
    title: 'Look up "%s" in Vocabulary.com',
    contexts: ['selection']
  });
  
  if (details.reason === 'install') {
    console.log('Welcome! Click the extension icon to access settings, or right-click on selected text to look it up on Vocabulary.com');
  }
});

// Message handler for popup communication
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleMessage(message, sender, sendResponse);
  return true; // Keep the message channel open for async responses
});

// Handle messages from popup and content scripts
async function handleMessage(message, sender, sendResponse) {
  try {
    switch (message.action) {
      case 'getSettings':
        const result = await chrome.storage.sync.get(['settings']);
        const settings = { ...defaultSettings, ...(result.settings || {}) };
        sendResponse({ success: true, settings });
        break;
        
      case 'updateSettings':
        await chrome.storage.sync.set({ settings: message.settings });
        sendResponse({ success: true });
        break;
        
      default:
        sendResponse({ success: false, error: 'Unknown action' });
    }
  } catch (error) {
    console.error('Error handling message:', error);
    sendResponse({ success: false, error: error.message });
  }
}

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'vocabulary-lookup' && info.selectionText) {
    // Clean the selected word and create vocabulary.com URL
    const cleanWord = info.selectionText.trim().toLowerCase();
    const vocabularyUrl = `https://www.vocabulary.com/dictionary/${encodeURIComponent(cleanWord)}`;
    
    // Get current window to position the popup relative to it
    const currentWindow = await chrome.windows.getCurrent();
    
    // Calculate optimal popup size and position
    const popupWidth = 450; // Slightly narrower for better fit
    const popupHeight = 650; // Good height for vocabulary content
    
    // Smart positioning - right side of current window, but adjust if too close to screen edge
    const margin = 10;
    let leftPosition = currentWindow.left + currentWindow.width - popupWidth - margin;
    let topPosition = currentWindow.top + 80;
    
    // Get screen dimensions (estimate)
    const screenWidth = currentWindow.left + currentWindow.width + 100; // rough estimate
    const screenHeight = currentWindow.top + currentWindow.height + 100;
    
    // Adjust if popup would go off-screen on the right
    if (leftPosition + popupWidth > screenWidth) {
      leftPosition = currentWindow.left - popupWidth - margin; // Position on left side instead
    }
    
    // Adjust if popup would go off-screen at bottom
    if (topPosition + popupHeight > screenHeight) {
      topPosition = screenHeight - popupHeight - margin;
    }
    
    // Ensure minimum top position
    if (topPosition < 50) {
      topPosition = 50;
    }
    
    console.log(`Opening popup for "${cleanWord}" at optimized position: ${leftPosition}, ${topPosition}`);
    
    // Create a small popup window
    chrome.windows.create({
      url: vocabularyUrl,
      type: 'popup',
      width: popupWidth,
      height: popupHeight,
      left: leftPosition,
      top: topPosition,
      focused: true
    });
  }
});

console.log('Simple Vocabulary Lookup background script loaded');