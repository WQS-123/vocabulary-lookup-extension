// Simple Background Service Worker for Vocabulary Lookup Extension

// Initialize extension
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('Vocabulary Lookup extension installed/updated');
  
  // Create context menu
  chrome.contextMenus.create({
    id: 'vocabulary-lookup',
    title: 'Look up "%s" in Vocabulary.com',
    contexts: ['selection']
  });
  
  if (details.reason === 'install') {
    console.log('Welcome! Right-click on selected text to look it up on Vocabulary.com');
  }
});

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