import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { renderMarkdown, createMarkup } from '../utils/markdownRenderer';
import LanguageToggle from './LanguageToggle';
import './PrecedenceFinder.css';

const PrecedenceFinder = () => {
    const [query, setQuery] = useState('');
    const [precedents, setPrecedents] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [language, setLanguage] = useState('en-IN');
    const [translatedPrecedents, setTranslatedPrecedents] = useState(null);
    const [translating, setTranslating] = useState(false);

    useEffect(() => {
        // When language changes or precedents changes, translate the precedents
        const performTranslation = async () => {
            if (!precedents || precedents.length === 0) return;
            
            // Don't translate if language is English
            if (language === 'en-IN') {
                setTranslatedPrecedents(null);
                return;
            }
            
            setTranslating(true);
            try {
                // Create a copy of the precedents array
                const translatedItems = [...precedents];
                
                // Translate each item's text using the translation service
                for (let i = 0; i < translatedItems.length; i++) {
                    const originalText = translatedItems[i].text;
                    const translatedText = await axios.post('http://localhost:8081/translate', {
                        text: originalText,
                        targetLanguage: language
                    });
                    
                    if (translatedText.data && translatedText.data.translatedText) {
                        translatedItems[i] = {
                            ...translatedItems[i],
                            text: translatedText.data.translatedText
                        };
                    }
                }
                
                setTranslatedPrecedents(translatedItems);
            } catch (err) {
                console.error("Translation error:", err);
                // Fallback to original precedents if translation fails
                setTranslatedPrecedents(precedents);
            } finally {
                setTranslating(false);
            }
        };

        performTranslation();
    }, [precedents, language]);

    const handleQuerySubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setPrecedents(null);
        setTranslatedPrecedents(null);

        try {
            const response = await axios.post("http://localhost:8081/query/legal", {
                query: query
            });

            if (Array.isArray(response.data.answer)) {
                setPrecedents(response.data.answer.length > 0 ? response.data.answer : []);
            } else {
                setPrecedents(response.data.answer ? [{ text: response.data.answer, score: "N/A" }] : []);
            }
        } catch (error) {
            console.error("Error fetching precedents:", error.response ? error.response.data : error);
            setError("Sorry, something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="precedence-finder-container">
            <div className="container">
                <h1 className="page-title">Find Legal Precedents</h1>
                <p className="page-description">
                    Search through thousands of case laws to find relevant precedents for your legal matters.
                </p>
                
                <div className="card question-card">
                    <form onSubmit={handleQuerySubmit}>
                        <div className="form-group">
                            <label htmlFor="query-input">Search Query</label>
                            <textarea
                                id="query-input"
                                className="legal-textarea"
                                placeholder="For example: Supreme Court judgments on right to privacy"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                rows="5"
                            />
                        </div>
                        
                        <div className="form-actions">
                            <button 
                                type="submit" 
                                className="btn btn-primary"
                                disabled={loading || !query.trim()}
                            >
                                {loading ? (
                                    <>
                                        <span className="loading-spinner"></span>
                                        <span className="loading-text">Searching...</span>
                                    </>
                                ) : 'Find Precedents'}
                            </button>
                        </div>
                    </form>
                </div>

                {error && (
                    <div className="error-message">
                        <p>{error}</p>
                    </div>
                )}

                {precedents !== null && (
                    <div className="response-container">
                        <div className="response-header">
                            <h2>Legal Precedents</h2>
                            
                            <LanguageToggle 
                                selectedLanguage={language}
                                onLanguageChange={setLanguage}
                            />
                        </div>
                        
                        {translating && (
                            <div className="translating-indicator">
                                <span className="loading-spinner"></span>
                                <span>Translating precedents...</span>
                            </div>
                        )}
                        
                        <div className="response-content">
                            {precedents.length > 0 ? (
                                (translatedPrecedents || precedents).map((item, index) => (
                                    <div key={index} className="precedent-item">
                                        <div dangerouslySetInnerHTML={createMarkup(renderMarkdown(item.text))} />
                                    </div>
                                ))
                            ) : (
                                <p className="no-results">No relevant precedents found. Please try different keywords.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PrecedenceFinder;
