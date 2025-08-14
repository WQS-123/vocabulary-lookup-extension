// Popup JavaScript for Vocabulary Lookup Extension

document.addEventListener('DOMContentLoaded', function() {
  // Get DOM elements
  const enabledToggle = document.getElementById('enabled');
  const autoHideToggle = document.getElementById('autoHide');
  const showPronunciationToggle = document.getElementById('showPronunciation');
  const showExamplesToggle = document.getElementById('showExamples');
  const hideDelaySlider = document.getElementById('hideDelay');
  const hideDelayValue = document.getElementById('hideDelayValue');
  const clearCacheButton = document.getElementById('clearCache');
  const reportIssueButton = document.getElementById('reportIssue');
  const rateExtensionButton = document.getElementById('rateExtension');

  // Load current settings
  loadSettings();
  updateStats();

  // Event listeners for settings
  enabledToggle.addEventListener('change', saveSettings);
  autoHideToggle.addEventListener('change', saveSettings);
  showPronunciationToggle.addEventListener('change', saveSettings);
  showExamplesToggle.addEventListener('change', saveSettings);
  hideDelaySlider.addEventListener('input', function() {
    hideDelayValue.textContent = hideDelaySlider.value + 's';
    saveSettings();
  });

  // Event listeners for buttons
  clearCacheButton.addEventListener('click', clearCache);
  reportIssueButton.addEventListener('click', reportIssue);
  rateExtensionButton.addEventListener('click', rateExtension);

  // Load settings from storage
  async function loadSettings() {
    try {
      const response = await sendMessage({ action: 'getSettings' });
      if (response.success) {
        const settings = response.settings;
        
        enabledToggle.checked = settings.enabled;
        autoHideToggle.checked = settings.autoHide;
        showPronunciationToggle.checked = settings.showPronunciation;
        showExamplesToggle.checked = settings.showExamples;
        hideDelaySlider.value = settings.hideDelay / 1000; // Convert ms to seconds
        hideDelayValue.textContent = (settings.hideDelay / 1000) + 's';
        
        // Update UI state based on enabled status
        updateUIState(settings.enabled);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      showNotification('Failed to load settings', 'error');
    }
  }

  // Save settings to storage
  async function saveSettings() {
    const settings = {
      enabled: enabledToggle.checked,
      autoHide: autoHideToggle.checked,
      showPronunciation: showPronunciationToggle.checked,
      showExamples: showExamplesToggle.checked,
      hideDelay: parseInt(hideDelaySlider.value) * 1000 // Convert seconds to ms
    };

    try {
      const response = await sendMessage({ 
        action: 'updateSettings', 
        settings: settings 
      });
      
      if (response.success) {
        updateUIState(settings.enabled);
        showNotification('Settings saved', 'success');
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      showNotification('Failed to save settings', 'error');
    }
  }

  // Update UI state based on enabled status
  function updateUIState(enabled) {
    const settingItems = document.querySelectorAll('.setting-item');
    settingItems.forEach((item, index) => {
      if (index > 0) { // Skip the first item (enabled toggle)
        if (enabled) {
          item.style.opacity = '1';
          item.style.pointerEvents = 'auto';
        } else {
          item.style.opacity = '0.5';
          item.style.pointerEvents = 'none';
        }
      }
    });
  }

  // Update usage statistics
  async function updateStats() {
    try {
      // Get current stats from storage
      const result = await chrome.storage.local.get(['wordsLookedUp', 'cacheSize']);
      
      document.getElementById('wordsLookedUp').textContent = result.wordsLookedUp || '0';
      document.getElementById('cacheSize').textContent = result.cacheSize || '0';
    } catch (error) {
      console.error('Failed to load stats:', error);
      document.getElementById('wordsLookedUp').textContent = '-';
      document.getElementById('cacheSize').textContent = '-';
    }
  }

  // Clear cache
  async function clearCache() {
    try {
      await chrome.storage.local.remove(['cache', 'cacheSize']);
      
      // Update stats
      document.getElementById('cacheSize').textContent = '0';
      
      showNotification('Cache cleared', 'success');
    } catch (error) {
      console.error('Failed to clear cache:', error);
      showNotification('Failed to clear cache', 'error');
    }
  }

  // Report issue
  function reportIssue() {
    const issueUrl = 'mailto:support@example.com?subject=Vocabulary Lookup Extension Issue&body=Please describe the issue you encountered:';
    chrome.tabs.create({ url: issueUrl });
  }

  // Rate extension
  function rateExtension() {
    // This would typically open the Chrome Web Store page for the extension
    const storeUrl = 'https://chrome.google.com/webstore/detail/vocabulary-lookup/';
    chrome.tabs.create({ url: storeUrl });
  }

  // Send message to background script
  function sendMessage(message) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(response);
        }
      });
    });
  }

  // Show notification
  function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 16px;
      border-radius: 6px;
      color: white;
      font-size: 14px;
      font-weight: 500;
      z-index: 10000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      ${type === 'success' ? 'background: #4CAF50;' : 
        type === 'error' ? 'background: #f44336;' : 
        'background: #2196F3;'}
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  // Update hide delay value in real-time
  hideDelaySlider.addEventListener('input', function() {
    hideDelayValue.textContent = hideDelaySlider.value + 's';
  });

  // Initialize slider value display
  hideDelayValue.textContent = hideDelaySlider.value + 's';

  console.log('Popup script loaded');
});