// Translation service utility for Sarvam AI API integration
import axios from 'axios';

/**
 * Available languages for translation
 */
export const languageOptions = [
  { code: 'en-IN', name: 'English' },
  { code: 'hi-IN', name: 'Hindi' },
  { code: 'ta-IN', name: 'Tamil' },
  { code: 'te-IN', name: 'Telugu' },
  { code: 'kn-IN', name: 'Kannada' },
  { code: 'ml-IN', name: 'Malayalam' },
  { code: 'bn-IN', name: 'Bengali' },
  { code: 'mr-IN', name: 'Marathi' },
  { code: 'gu-IN', name: 'Gujarati' },
  { code: 'pa-IN', name: 'Punjabi' }
];

/**
 * Translates text to the specified target language
 * @param {string} text - The text to translate
 * @param {string} targetLanguage - The target language code (e.g., 'hi-IN', 'ta-IN')
 * @returns {Promise<string>} - The translated text
 */
export const translateText = async (text, targetLanguage) => {
  // If language is English or text is empty, return the original text
  if (targetLanguage === 'en-IN' || !text.trim()) {
    return text;
  }

  try {
    const response = await axios.post('http://localhost:8081/translate', {
      text,
      targetLanguage
    });

    if (response.data && response.data.translatedText) {
      return response.data.translatedText;
    } else {
      console.error('Translation response missing translated text:', response.data);
      return text; // Fallback to original text
    }
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Fallback to original text on error
  }
};