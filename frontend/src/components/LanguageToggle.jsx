// src/components/LanguageToggle.jsx
import React, { useState } from 'react';
import { languageOptions } from '../utils/translationService';
import './LanguageToggle.css';

const LanguageToggle = ({ selectedLanguage, onLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedLanguageName = languageOptions.find(lang => lang.code === selectedLanguage)?.name || 'English';
  
  const handleLanguageSelect = (code) => {
      onLanguageChange(code);
      setIsOpen(false);
  };
  
  return (
    <div className="language-toggle">
      <button 
        className="language-toggle-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="language-icon"></span>
        <span>{selectedLanguageName}</span>
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}></span>
      </button>
      
      {isOpen && (
        <div className="language-dropdown">
          <ul>
            {languageOptions.map((language) => (
              <li key={language.code}>
                <button
                  className={`language-option ${selectedLanguage === language.code ? 'active' : ''}`}
                  onClick={() => handleLanguageSelect(language.code)}
                >
                  {language.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageToggle;