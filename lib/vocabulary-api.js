// Vocabulary API Integration Module

class VocabularyAPI {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours
  }

  // Get cached result if available and not expired
  getCached(word) {
    const cached = this.cache.get(word.toLowerCase());
    if (cached && (Date.now() - cached.timestamp) < this.cacheExpiry) {
      return cached.data;
    }
    return null;
  }

  // Cache the result
  setCached(word, data) {
    this.cache.set(word.toLowerCase(), {
      data: data,
      timestamp: Date.now()
    });
  }

  // Clean up old cache entries
  cleanCache() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if ((now - value.timestamp) > this.cacheExpiry) {
        this.cache.delete(key);
      }
    }
  }

  // Fetch from Free Dictionary API
  async fetchFromFreeDictionary(word) {
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
      
      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      if (data && data.length > 0) {
        const entry = data[0];
        
        // Find the best audio pronunciation
        let audioUrl = '';
        let pronunciation = entry.phonetic || '';
        
        for (const phonetic of entry.phonetics || []) {
          if (phonetic.audio && phonetic.audio.trim()) {
            audioUrl = phonetic.audio;
            if (phonetic.text) {
              pronunciation = phonetic.text;
            }
            break;
          }
          if (!pronunciation && phonetic.text) {
            pronunciation = phonetic.text;
          }
        }

        // Collect all meanings and definitions for comprehensive display
        const allDefinitions = [];
        const allExamples = [];
        const partOfSpeechList = [];
        const synonymsList = [];
        const antonymsList = [];

        for (const meaning of entry.meanings || []) {
          if (meaning.partOfSpeech) {
            partOfSpeechList.push(meaning.partOfSpeech);
          }
          
          for (const def of meaning.definitions || []) {
            if (def.definition) {
              allDefinitions.push({
                definition: def.definition,
                partOfSpeech: meaning.partOfSpeech,
                example: def.example || '',
                synonyms: def.synonyms || [],
                antonyms: def.antonyms || []
              });
            }
            
            if (def.example) {
              allExamples.push(def.example);
            }
            
            if (def.synonyms) {
              synonymsList.push(...def.synonyms);
            }
            
            if (def.antonyms) {
              antonymsList.push(...def.antonyms);
            }
          }
          
          if (meaning.synonyms) {
            synonymsList.push(...meaning.synonyms);
          }
          
          if (meaning.antonyms) {
            antonymsList.push(...meaning.antonyms);
          }
        }

        // Primary definition (first one)
        const primaryDef = allDefinitions[0];
        
        // Create detailed explanation combining multiple definitions
        let detailedExplanation = '';
        if (allDefinitions.length > 1) {
          detailedExplanation = allDefinitions.slice(1, 3).map(def => 
            `${def.partOfSpeech ? `(${def.partOfSpeech}) ` : ''}${def.definition}`
          ).join(' ');
        }

        // Other word forms (from word variations if available)
        const wordForms = [];
        if (entry.word !== entry.word.toLowerCase()) {
          wordForms.push(entry.word.toLowerCase());
        }

        return {
          word: entry.word,
          pronunciation: pronunciation,
          audioUrl: audioUrl,
          meaning: primaryDef?.definition || 'No definition available',
          detailedExplanation: detailedExplanation,
          example: primaryDef?.example || allExamples[0] || '',
          allExamples: allExamples.slice(0, 3), // Limit to 3 examples
          partOfSpeech: primaryDef?.partOfSpeech || partOfSpeechList[0] || '',
          allPartsOfSpeech: [...new Set(partOfSpeechList)], // Remove duplicates
          synonyms: [...new Set(synonymsList)].slice(0, 8), // Limit and dedupe
          antonyms: [...new Set(antonymsList)].slice(0, 8), // Limit and dedupe
          wordForms: wordForms,
          allDefinitions: allDefinitions.slice(0, 4), // Limit to 4 definitions
          source: 'Free Dictionary API',
          sourceUrl: entry.sourceUrls?.[0] || ''
        };
      }
    } catch (error) {
      console.error('Free Dictionary API error:', error);
      return null;
    }
  }

  // Parse Vocabulary.com scraped data
  parseVocabularyData(html, word) {
    try {
      // Create a temporary DOM parser
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Try to extract definition from various selectors
      let definition = '';
      let example = '';
      let pronunciation = '';
      
      // Look for definition in common selectors
      const definitionSelectors = [
        '.definition',
        '.short',
        '.meaning',
        '[data-definition]',
        '.def-content'
      ];
      
      for (const selector of definitionSelectors) {
        const element = doc.querySelector(selector);
        if (element && element.textContent.trim()) {
          definition = element.textContent.trim();
          break;
        }
      }
      
      // Look for example
      const exampleElement = doc.querySelector('.example, .eg, .usage');
      if (exampleElement) {
        example = exampleElement.textContent.trim();
      }
      
      // Look for pronunciation
      const pronunciationElement = doc.querySelector('.pronunciation, .phonetic, .pron');
      if (pronunciationElement) {
        pronunciation = pronunciationElement.textContent.trim();
      }
      
      if (definition) {
        return {
          word: word,
          pronunciation: pronunciation,
          meaning: definition,
          example: example,
          partOfSpeech: '',
          source: 'Vocabulary.com'
        };
      }
    } catch (error) {
      console.error('Error parsing vocabulary.com data:', error);
    }
    
    return null;
  }

  // Fallback to simple definition extraction
  extractSimpleDefinition(text, word) {
    // Simple regex-based extraction for basic cases
    const patterns = [
      new RegExp(`${word}[^.]*?(?:is|means|refers to|defined as)\\s+([^.]+)`, 'i'),
      new RegExp(`(?:definition|meaning)\\s*:?\\s*([^.]+)`, 'i'),
      new RegExp(`^([^.]{20,100})`, 'm') // First substantial sentence
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return {
          word: word,
          pronunciation: '',
          meaning: match[1].trim(),
          example: '',
          partOfSpeech: '',
          source: 'Text extraction'
        };
      }
    }
    
    return null;
  }

  // Main lookup method
  async lookupWord(word) {
    if (!word || word.length === 0) {
      return null;
    }

    // Check cache first
    const cached = this.getCached(word);
    if (cached) {
      return cached;
    }

    // Clean old cache entries occasionally
    if (Math.random() < 0.1) {
      this.cleanCache();
    }

    let result = null;

    // Try Free Dictionary API first
    result = await this.fetchFromFreeDictionary(word);
    
    if (result) {
      this.setCached(word, result);
      return result;
    }

    // If all APIs fail, return null
    return null;
  }

  // Batch lookup for multiple words
  async lookupWords(words) {
    const results = [];
    for (const word of words) {
      const result = await this.lookupWord(word);
      results.push({ word, result });
    }
    return results;
  }

  // Get cache statistics
  getCacheStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }

  // Clear all cache
  clearCache() {
    this.cache.clear();
  }
}

// Create global instance
if (typeof window !== 'undefined') {
  window.vocabularyAPI = new VocabularyAPI();
}