import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LanguageToggle from './LanguageToggle';
import { renderMarkdown, createMarkup } from '../utils/markdownRenderer';
import { translateText } from '../utils/translationService';
import './LegalDocumentCreator.css';

const LegalDocumentCreator = () => {
    const [prompt, setPrompt] = useState('');
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [language, setLanguage] = useState('en-IN');
    const [translatedDocument, setTranslatedDocument] = useState(null);
    const [translating, setTranslating] = useState(false);

    useEffect(() => {
        // When language changes or document changes, translate the document
        const performTranslation = async () => {
            if (!document) return;
            
            // Don't translate if language is English
            if (language === 'en-IN') {
                setTranslatedDocument(null);
                return;
            }
              setTranslating(true);
            try {
                const translatedText = await translateText(document, language);
                setTranslatedDocument(translatedText);
            } catch (err) {
                console.error("Translation error:", err);
                // Fallback to original document if translation fails
                setTranslatedDocument(document);
            } finally {
                setTranslating(false);
            }
        };

        performTranslation();
    }, [document, language]);

    const handlePromptSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setDocument(null);
        setTranslatedDocument(null);

        try {
            const response = await axios.post("http://localhost:8081/generate_contract", {
                question: prompt
            });

            if (response.data && response.data.contract) {
                setDocument(response.data.contract);
            } else {
                setError("Failed to generate document. Please try again.");
            }
        } catch (error) {
            console.error("Error generating document:", error.response ? error.response.data : error);
            setError("Sorry, something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };    return (
        <div className="document-creator-container">
            <div className="container text-center">
                <h1 className="Heading">Create Your Legal Document Here</h1>
                <p className="page-description">
                    Create professional legal documents, contracts, and agreements tailored to your specific needs.
                </p>
                
                <div className="card question-card">
                    <form onSubmit={handlePromptSubmit}>
                        <div className="form-group">
                            <label htmlFor="prompt-input">Document Description</label>
                            <textarea
                                id="prompt-input"
                                className="legal-textarea"
                                placeholder="For example: Generate a residential rental agreement between John Doe (landlord) and Jane Smith (tenant) for a property in Mumbai with a monthly rent of Rs. 25,000 for a period of 11 months."
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                rows="5"
                            />
                        </div>
                        
                        <div className="form-actions">
                            <button 
                                type="submit" 
                                className="btn btn-primary"
                                disabled={loading || !prompt.trim()}
                            >
                                {loading ? (
                                    <>
                                        <span className="loading-spinner"></span>
                                        <span className="loading-text">Generating...</span>
                                    </>
                                ) : 'Generate Document'}
                            </button>
                        </div>
                    </form>
                </div>

                {error && (
                    <div className="error-message">
                        <p>{error}</p>
                    </div>
                )}

                {document && (
                    <div className="document-container">
                        <div className="document-header">
                            <h2>Generated Document</h2>
                            
                            <div className="document-actions">
                                <LanguageToggle 
                                    selectedLanguage={language}
                                    onLanguageChange={setLanguage}
                                />
                                
                                <button 
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => {
                                        const content = translatedDocument || document;
                                        const blob = new Blob([content], { type: 'text/plain' });
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = 'legal-document.txt';
                                        document.body.appendChild(a);
                                        a.click();
                                        document.body.removeChild(a);
                                        URL.revokeObjectURL(url);
                                    }}
                                >
                                    Download
                                </button>
                            </div>
                        </div>
                        
                        {translating && (
                            <div className="translating-indicator">
                                <span className="loading-spinner"></span>
                                <span>Translating document...</span>
                            </div>
                        )}
                        
                        <div className="document-content">
                            <div dangerouslySetInnerHTML={createMarkup(renderMarkdown(translatedDocument || document))} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LegalDocumentCreator;
