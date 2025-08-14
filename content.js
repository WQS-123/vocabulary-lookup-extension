let currentTooltip = null;
let tooltipTimeout = null;
let isLoading = false;

function createTooltip() {
  const tooltip = document.createElement('div');
  tooltip.className = 'vocab-tooltip';
  tooltip.innerHTML = `
    <div class="vocab-tooltip-content">
      <div class="vocab-loading">
        <div class="vocab-spinner"></div>
        <span>Looking up definition...</span>
      </div>
      <div class="vocab-definition" style="display: none;">
        <div class="vocab-header">
          <div class="vocab-word"></div>
          <div class="vocab-word-forms"></div>
        </div>
        <div class="vocab-pronunciation">
          <span class="pronunciation-text"></span>
          <button class="pronunciation-audio" style="display: none;">🔊</button>
        </div>
        <div class="vocab-meaning"></div>
        <div class="vocab-detailed-explanation"></div>
        <div class="vocab-examples">
          <div class="vocab-example-primary"></div>
          <div class="vocab-additional-examples"></div>
        </div>
        <div class="vocab-related-words">
          <div class="vocab-synonyms"></div>
          <div class="vocab-antonyms"></div>
        </div>
        <div class="vocab-additional-definitions"></div>
        <div class="vocab-source">Source: Free Dictionary API</div>
      </div>
      <div class="vocab-error" style="display: none;">
        <span>Could not find definition</span>
      </div>
    </div>
    <div class="vocab-tooltip-arrow"></div>
  `;
  
  tooltip.style.position = 'absolute';
  tooltip.style.zIndex = '999999';
  tooltip.style.display = 'none';
  
  document.body.appendChild(tooltip);
  return tooltip;
}

function positionTooltip(tooltip, x, y, selectedText) {
  const tooltipRect = tooltip.getBoundingClientRect();
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  
  let finalX = x;
  let finalY = y - tooltipRect.height - 10;
  
  // Adjust horizontal position if tooltip would go off-screen
  if (finalX + tooltipRect.width > windowWidth - 20) {
    finalX = windowWidth - tooltipRect.width - 20;
  }
  if (finalX < 20) {
    finalX = 20;
  }
  
  // Adjust vertical position if tooltip would go off-screen
  if (finalY < 20) {
    finalY = y + 30; // Position below the selection instead
    tooltip.querySelector('.vocab-tooltip-arrow').style.transform = 'rotate(180deg)';
    tooltip.querySelector('.vocab-tooltip-arrow').style.top = '-8px';
  } else {
    tooltip.querySelector('.vocab-tooltip-arrow').style.transform = 'rotate(0deg)';
    tooltip.querySelector('.vocab-tooltip-arrow').style.bottom = '-8px';
  }
  
  tooltip.style.left = finalX + 'px';
  tooltip.style.top = finalY + 'px';
}

async function lookupWord(word) {
  try {
    // Use the vocabulary API instance
    if (window.vocabularyAPI) {
      return await window.vocabularyAPI.lookupWord(word);
    }
    
    // Fallback to direct API call if vocabularyAPI not available
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
    
    if (response.ok) {
      const data = await response.json();
      if (data && data.length > 0) {
        const entry = data[0];
        return {
          word: entry.word,
          pronunciation: entry.phonetic || (entry.phonetics && entry.phonetics[0]?.text) || '',
          meaning: entry.meanings[0]?.definitions[0]?.definition || 'No definition available',
          example: entry.meanings[0]?.definitions[0]?.example || '',
          partOfSpeech: entry.meanings[0]?.partOfSpeech || ''
        };
      }
    }
    
    // If that fails, try vocabulary.com through background script
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({
        action: 'lookup',
        word: word
      }, (response) => {
        if (response && response.success) {
          resolve(response.data);
        } else {
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.error('Lookup error:', error);
    return null;
  }
}

function showDefinition(tooltip, data) {
  const loadingDiv = tooltip.querySelector('.vocab-loading');
  const definitionDiv = tooltip.querySelector('.vocab-definition');
  const errorDiv = tooltip.querySelector('.vocab-error');
  
  loadingDiv.style.display = 'none';
  
  if (data) {
    definitionDiv.style.display = 'block';
    errorDiv.style.display = 'none';
    
    // Word and word forms
    tooltip.querySelector('.vocab-word').textContent = data.word;
    const wordFormsDiv = tooltip.querySelector('.vocab-word-forms');
    if (data.wordForms && data.wordForms.length > 0) {
      wordFormsDiv.innerHTML = `Other forms: <em>${data.wordForms.join(', ')}</em>`;
    } else if (data.allPartsOfSpeech && data.allPartsOfSpeech.length > 1) {
      wordFormsDiv.innerHTML = `Forms: <em>${data.allPartsOfSpeech.join(', ')}</em>`;
    } else {
      wordFormsDiv.innerHTML = '';
    }
    
    // Handle pronunciation with audio button
    const pronunciationText = tooltip.querySelector('.pronunciation-text');
    const audioButton = tooltip.querySelector('.pronunciation-audio');
    
    pronunciationText.textContent = data.pronunciation;
    
    if (data.audioUrl) {
      audioButton.style.display = 'inline-block';
      audioButton.onclick = () => playPronunciation(data.audioUrl);
    } else {
      audioButton.style.display = 'none';
    }
    
    // Main meaning with part of speech
    tooltip.querySelector('.vocab-meaning').innerHTML = `
      ${data.partOfSpeech ? `<span class="part-of-speech">${data.partOfSpeech}</span> ` : ''}
      ${data.meaning}
    `;
    
    // Detailed explanation
    const detailedDiv = tooltip.querySelector('.vocab-detailed-explanation');
    if (data.detailedExplanation && data.detailedExplanation.trim()) {
      detailedDiv.innerHTML = `<div class="detailed-explanation">${data.detailedExplanation}</div>`;
      detailedDiv.style.display = 'block';
    } else {
      detailedDiv.style.display = 'none';
    }
    
    // Primary example
    const primaryExampleDiv = tooltip.querySelector('.vocab-example-primary');
    if (data.example) {
      primaryExampleDiv.innerHTML = `<em>${data.example}</em>`;
    } else {
      primaryExampleDiv.innerHTML = '';
    }
    
    // Additional examples
    const additionalExamplesDiv = tooltip.querySelector('.vocab-additional-examples');
    if (data.allExamples && data.allExamples.length > 1) {
      const extraExamples = data.allExamples.slice(1, 3); // Show up to 2 more
      additionalExamplesDiv.innerHTML = extraExamples.map(ex => `<em class="additional-example">${ex}</em>`).join('');
    } else {
      additionalExamplesDiv.innerHTML = '';
    }
    
    // Synonyms
    const synonymsDiv = tooltip.querySelector('.vocab-synonyms');
    if (data.synonyms && data.synonyms.length > 0) {
      synonymsDiv.innerHTML = `<strong>Similar words:</strong> ${data.synonyms.slice(0, 5).join(', ')}`;
    } else {
      synonymsDiv.innerHTML = '';
    }
    
    // Antonyms
    const antonymsDiv = tooltip.querySelector('.vocab-antonyms');
    if (data.antonyms && data.antonyms.length > 0) {
      antonymsDiv.innerHTML = `<strong>Opposite words:</strong> ${data.antonyms.slice(0, 5).join(', ')}`;
    } else {
      antonymsDiv.innerHTML = '';
    }
    
    // Additional definitions
    const additionalDefDiv = tooltip.querySelector('.vocab-additional-definitions');
    if (data.allDefinitions && data.allDefinitions.length > 1) {
      const extraDefs = data.allDefinitions.slice(1, 3); // Show up to 2 more definitions
      additionalDefDiv.innerHTML = extraDefs.map(def => 
        `<div class="additional-definition">
          ${def.partOfSpeech && def.partOfSpeech !== data.partOfSpeech ? `<span class="part-of-speech-small">${def.partOfSpeech}</span> ` : ''}
          ${def.definition}
        </div>`
      ).join('');
    } else {
      additionalDefDiv.innerHTML = '';
    }
    
    // Update source
    const sourceDiv = tooltip.querySelector('.vocab-source');
    sourceDiv.textContent = `Source: ${data.source || 'Dictionary'}`;
    
  } else {
    definitionDiv.style.display = 'none';
    errorDiv.style.display = 'block';
  }
  
  // Re-position tooltip after content is loaded
  const rect = tooltip.getBoundingClientRect();
  positionTooltip(tooltip, parseFloat(tooltip.style.left), parseFloat(tooltip.style.top) + rect.height);
}

function playPronunciation(audioUrl) {
  try {
    const audio = new Audio(audioUrl);
    audio.play().catch(error => {
      console.error('Error playing pronunciation:', error);
      // Fallback: try to use Web Speech API for text-to-speech
      const utterance = new SpeechSynthesisUtterance(currentTooltip.querySelector('.vocab-word').textContent);
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
    });
  } catch (error) {
    console.error('Error with audio playback:', error);
  }
}

function hideTooltip() {
  if (currentTooltip) {
    currentTooltip.style.display = 'none';
    if (tooltipTimeout) {
      clearTimeout(tooltipTimeout);
      tooltipTimeout = null;
    }
  }
}

function handleContextMenuRequest(word, position) {
  // Hide existing tooltip
  hideTooltip();
  
  if (word && word.length > 0 && word.length < 50) {
    // Check if it's likely a word or short phrase (no numbers, minimal punctuation)
    if (/^[a-zA-Z\s'-]+$/.test(word)) {
      if (!currentTooltip) {
        currentTooltip = createTooltip();
      }
      
      // Get current selection coordinates or use mouse position
      let x, y;
      if (position) {
        x = position.x;
        y = position.y;
      } else {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          x = rect.left + (rect.width / 2);
          y = rect.top + window.scrollY;
        } else {
          // Default to center of viewport if no selection
          x = window.innerWidth / 2;
          y = window.innerHeight / 2 + window.scrollY;
        }
      }
      
      // Show tooltip in loading state
      currentTooltip.style.display = 'block';
      positionTooltip(currentTooltip, x, y, word);
      
      // Show loading state
      currentTooltip.querySelector('.vocab-loading').style.display = 'block';
      currentTooltip.querySelector('.vocab-definition').style.display = 'none';
      currentTooltip.querySelector('.vocab-error').style.display = 'none';
      
      // Look up the word
      lookupWord(word.toLowerCase())
        .then(data => {
          if (currentTooltip && currentTooltip.style.display !== 'none') {
            showDefinition(currentTooltip, data);
          }
        });
      
      // Auto-hide after 15 seconds (longer for context menu triggered)
      tooltipTimeout = setTimeout(hideTooltip, 15000);
    }
  }
}

// Listen for messages from background script (context menu)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'showDefinition') {
    handleContextMenuRequest(request.word, request.position);
    sendResponse({ success: true });
  }
});

// Hide tooltip when clicking elsewhere
document.addEventListener('click', (event) => {
  if (currentTooltip && !currentTooltip.contains(event.target)) {
    hideTooltip();
  }
});

// Hide tooltip on scroll
document.addEventListener('scroll', hideTooltip);

// Hide tooltip on escape key
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    hideTooltip();
  }
});

console.log('Vocabulary Lookup extension loaded (Context Menu Mode)');