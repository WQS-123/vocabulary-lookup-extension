// Popup JavaScript for Vocabulary Lookup Extension - Search History

document.addEventListener('DOMContentLoaded', function() {
  // Get DOM elements
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const historyList = document.getElementById('historyList');
  const clearHistoryBtn = document.getElementById('clearHistoryBtn');
  const openVocabularyButton = document.getElementById('openVocabulary');
  const todayCountSpan = document.getElementById('todayCount');
  const topWordSpan = document.getElementById('topWord');
  const noResults = document.getElementById('noResults');
  const emptyHistory = document.getElementById('emptyHistory');

  // State
  let allHistory = [];
  let filteredHistory = [];

  // Initialize
  loadSearchHistory();

  // Event listeners
  searchInput.addEventListener('input', handleSearch);
  clearSearchBtn.addEventListener('click', clearSearch);
  clearHistoryBtn.addEventListener('click', clearAllHistory);
  openVocabularyButton.addEventListener('click', openVocabulary);
  topWordSpan.addEventListener('click', handleTopWordClick);

  // Load search history from storage
  async function loadSearchHistory() {
    try {
      const response = await sendMessage({ action: 'getSearchHistory' });
      if (response.success) {
        allHistory = response.history || [];
        filteredHistory = [...allHistory];
        displayHistory();
        updateStats();
      } else {
        showError('Failed to load search history');
      }
    } catch (error) {
      console.error('Failed to load search history:', error);
      showError('Failed to load search history');
    }
  }

  // Display history items
  function displayHistory() {
    const loadingMessage = historyList.querySelector('.loading-message');
    if (loadingMessage) {
      loadingMessage.remove();
    }

    // Clear current content
    historyList.innerHTML = '';

    // Show appropriate state
    if (allHistory.length === 0) {
      emptyHistory.style.display = 'block';
      noResults.style.display = 'none';
      return;
    }

    emptyHistory.style.display = 'none';

    if (filteredHistory.length === 0) {
      noResults.style.display = 'block';
      return;
    }

    noResults.style.display = 'none';

    // Create history items
    filteredHistory.forEach(item => {
      const historyItem = createHistoryItem(item);
      historyList.appendChild(historyItem);
    });
  }

  // Create a single history item element
  function createHistoryItem(item) {
    const itemElement = document.createElement('div');
    itemElement.className = 'history-item';
    
    const timeString = formatTimestamp(item.timestamp);
    const countText = item.count > 1 ? ` (${item.count}x)` : '';
    
    itemElement.innerHTML = `
      <div class="history-content">
        <div class="word-section">
          <span class="word-text">${escapeHtml(item.word)}</span>
          <span class="search-count">${countText}</span>
        </div>
        <div class="history-meta">
          <span class="timestamp">${timeString}</span>
        </div>
      </div>
      <div class="history-actions">
        <button class="open-link-btn" title="Open definition">🔗</button>
      </div>
    `;

    // Add click handlers
    const openLinkBtn = itemElement.querySelector('.open-link-btn');
    openLinkBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openWordLink(item.url);
    });

    // Make the whole item clickable
    itemElement.addEventListener('click', () => {
      openWordLink(item.url);
    });

    return itemElement;
  }

  // Handle search input
  function handleSearch() {
    const query = searchInput.value.toLowerCase().trim();
    
    if (query === '') {
      filteredHistory = [...allHistory];
    } else {
      filteredHistory = allHistory.filter(item => 
        item.word.toLowerCase().includes(query)
      );
    }
    
    displayHistory();
    
    // Show/hide clear search button
    clearSearchBtn.style.display = query ? 'block' : 'none';
  }

  // Clear search
  function clearSearch() {
    searchInput.value = '';
    filteredHistory = [...allHistory];
    displayHistory();
    clearSearchBtn.style.display = 'none';
    searchInput.focus();
  }

  // Clear all history
  async function clearAllHistory() {
    if (!confirm('Are you sure you want to clear all search history?')) {
      return;
    }

    try {
      const response = await sendMessage({ action: 'clearSearchHistory' });
      if (response.success) {
        allHistory = [];
        filteredHistory = [];
        displayHistory();
        updateStats();
        searchInput.value = '';
        clearSearchBtn.style.display = 'none';
        showNotification('Search history cleared', 'success');
      } else {
        showError('Failed to clear search history');
      }
    } catch (error) {
      console.error('Failed to clear search history:', error);
      showError('Failed to clear search history');
    }
  }

  // Open word link
  async function openWordLink(url) {
    try {
      await sendMessage({ action: 'openWordLink', url: url });
    } catch (error) {
      console.error('Failed to open link:', error);
      showError('Failed to open link');
    }
  }

  // Open Vocabulary.com
  function openVocabulary() {
    chrome.tabs.create({ url: 'https://www.vocabulary.com' });
  }

  // Handle top word click
  function handleTopWordClick() {
    if (allHistory.length > 0 && topWordSpan.textContent !== '-') {
      const sortedByCount = [...allHistory].sort((a, b) => b.count - a.count);
      const topWordUrl = sortedByCount[0].url;
      openWordLink(topWordUrl);
    }
  }

  // Update statistics
  function updateStats() {
    // Calculate today's searches
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const todaySearches = allHistory.filter(item => item.timestamp >= todayStart);
    const todayCount = todaySearches.reduce((sum, item) => sum + item.count, 0);
    
    // Find most searched word
    let topWord = '-';
    if (allHistory.length > 0) {
      const sortedByCount = [...allHistory].sort((a, b) => b.count - a.count);
      topWord = sortedByCount[0].word;
      // Truncate if too long
      if (topWord.length > 12) {
        topWord = topWord.substring(0, 12) + '...';
      }
    }
    
    todayCountSpan.textContent = todayCount.toString();
    topWordSpan.textContent = topWord;
    
    // Add clickable style for top word if it exists
    if (topWord !== '-') {
      topWordSpan.style.cursor = 'pointer';
      topWordSpan.style.textDecoration = 'underline';
      topWordSpan.title = 'Click to search this word';
    } else {
      topWordSpan.style.cursor = 'default';
      topWordSpan.style.textDecoration = 'none';
      topWordSpan.title = '';
    }
  }

  // Format timestamp
  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  // Escape HTML to prevent XSS
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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

  // Show error message
  function showError(message) {
    showNotification(message, 'error');
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

  console.log('Search History popup script loaded');
});