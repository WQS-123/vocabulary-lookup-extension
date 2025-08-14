// Popup JavaScript for Vocabulary Lookup Extension

document.addEventListener('DOMContentLoaded', function() {
  // Get DOM elements
  const enabledToggle = document.getElementById('enabled');
  const smartPositioningToggle = document.getElementById('smartPositioning');
  const windowSizeSelect = document.getElementById('windowSize');
  const clearStatsButton = document.getElementById('clearStats');
  const reportIssueButton = document.getElementById('reportIssue');
  const openVocabularyButton = document.getElementById('openVocabulary');

  // Load current settings
  loadSettings();
  updateStats();

  // Event listeners for settings
  enabledToggle.addEventListener('change', saveSettings);
  smartPositioningToggle.addEventListener('change', saveSettings);
  windowSizeSelect.addEventListener('change', saveSettings);

  // Event listeners for buttons
  clearStatsButton.addEventListener('click', clearStats);
  reportIssueButton.addEventListener('click', reportIssue);
  openVocabularyButton.addEventListener('click', openVocabulary);

  // Load settings from storage
  async function loadSettings() {
    try {
      const response = await sendMessage({ action: 'getSettings' });
      if (response.success) {
        const settings = response.settings;
        
        enabledToggle.checked = settings.enabled;
        smartPositioningToggle.checked = settings.smartPositioning;
        windowSizeSelect.value = settings.windowSize || 'standard';
        
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
      smartPositioning: smartPositioningToggle.checked,
      windowSize: windowSizeSelect.value
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
      const result = await chrome.storage.local.get(['wordsLookedUp', 'popupsOpened']);
      
      document.getElementById('wordsLookedUp').textContent = result.wordsLookedUp || '0';
      document.getElementById('popupsOpened').textContent = result.popupsOpened || '0';
    } catch (error) {
      console.error('Failed to load stats:', error);
      document.getElementById('wordsLookedUp').textContent = '-';
      document.getElementById('popupsOpened').textContent = '-';
    }
  }

  // Clear statistics
  async function clearStats() {
    try {
      await chrome.storage.local.remove(['wordsLookedUp', 'popupsOpened']);
      
      // Update stats display
      document.getElementById('wordsLookedUp').textContent = '0';
      document.getElementById('popupsOpened').textContent = '0';
      
      showNotification('Statistics reset', 'success');
    } catch (error) {
      console.error('Failed to reset statistics:', error);
      showNotification('Failed to reset statistics', 'error');
    }
  }

  // Report issue
  function reportIssue() {
    const issueUrl = 'mailto:support@example.com?subject=Vocabulary Lookup Extension Issue&body=Please describe the issue you encountered:';
    chrome.tabs.create({ url: issueUrl });
  }

  // Open Vocabulary.com
  function openVocabulary() {
    chrome.tabs.create({ url: 'https://www.vocabulary.com' });
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

  console.log('Popup script loaded');
});