import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { renderMarkdown, createMarkup } from '../utils/markdownRenderer';
import LanguageToggle from './LanguageToggle';
import './QuestionInput.css';

const QuestionInput = () => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState(null); // Initially null to hide the response section
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [language, setLanguage] = useState('en-IN'); // Default language is English
    const [translatedAnswer, setTranslatedAnswer] = useState(null);
    const [translating, setTranslating] = useState(false);
    const [serverStatus, setServerStatus] = useState('checking');

    // Check server status on component mount
    useEffect(() => {
        const checkServerHealth = async () => {
            try {
                const response = await axios.get('http://localhost:8081/health');
                if (response.data.status === 'healthy') {
                    setServerStatus('connected');
                } else {
                    setServerStatus('error');
                }
            } catch (error) {
                console.error('Server health check failed:', error);
                setServerStatus('disconnected');
            }
        };
        
        checkServerHealth();
    }, []);

    useEffect(() => {
        // When language changes or answer changes, translate the answer
        const performTranslation = async () => {
            if (!answer || answer.length === 0) return;
            
            // Don't translate if language is English
            if (language === 'en-IN') {
                setTranslatedAnswer(null);
                return;
            }
            
            setTranslating(true);
            try {
                // Create a copy of the answer array
                const translatedItems = [...answer];
                  // Translate each item's text using the translation service
                for (let i = 0; i < translatedItems.length; i++) {
                    const originalText = translatedItems[i].text;
                    try {
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
                    } catch (err) {
                        console.error(`Translation error for item ${i}:`, err);
                        // Keep original text if translation fails for this item
                    }
                }
                
                setTranslatedAnswer(translatedItems);
            } catch (err) {
                console.error("Translation error:", err);
                // Fallback to original answer if translation fails
                setTranslatedAnswer(answer);
            } finally {
                setTranslating(false);
            }
        };

        performTranslation();
    }, [answer, language]);    const handleQuestionSubmit = async (event) => {
        event.preventDefault();
        
        // Validate question before submitting
        if (!question || !question.trim()) {
            setError("Please enter a question before submitting.");
            return;
        }
        
        setLoading(true);
        setError(null);
        setAnswer(null); // Reset answer on new query
        setTranslatedAnswer(null);

        // Debug: Log the question being sent
        console.log("Question being sent:", question);
        console.log("Question trimmed:", question.trim());
        console.log("Question length:", question ? question.length : 0);

        try {
            // Make sure your backend is running at this URL
            const response = await axios.post('http://localhost:8081/query/legal', {
                query: question.trim()
            });

            console.log("Received response:", response.data);

            try {
                if (response.data && response.data.answer) {
                    if (Array.isArray(response.data.answer)) {
                        setAnswer(response.data.answer.length > 0 ? response.data.answer : []); 
                    } else {
                        setAnswer([{ text: response.data.answer, score: "N/A" }]);
                    }
                } else if (response.data && response.data.response) {
                    // Alternative response format
                    const responseText = response.data.response;
                    setAnswer([{ text: responseText, score: "N/A" }]);
                } else {
                    throw new Error("Unexpected response format");
                }
            } catch (parseError) {
                console.error("Error parsing response:", parseError);
                setError("Received an unexpected response format. Please try again.");
            }
        } catch (error) {
            console.error("Error fetching response:", error.response ? error.response.data : error);
            setError("Sorry, something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };    

    return (
        <div className="question-input-container">
            <div className="container">
                <h1 className="page-title">Ask Your Legal Question</h1>
                <p className="page-description">
                    Ask any question related to Indian law and get accurate answers with relevant references.
                </p>
                
                <div className="card question-card">
                    <div className="server-status">
                        {serverStatus === 'checking' && (
                            <div className="status-indicator checking">
                                <span className="loading-spinner"></span>
                                Checking server connection...
                            </div>
                        )}
                        {serverStatus === 'connected' && (
                            <div className="status-indicator connected">
                                ✅ Server connected
                            </div>
                        )}
                        {serverStatus === 'disconnected' && (
                            <div className="status-indicator disconnected">
                                ❌ Server disconnected - Please start the backend server
                            </div>
                        )}
                    </div>
                    
                    <form onSubmit={handleQuestionSubmit}>
                        <div className="form-group">
                            <label htmlFor="question-input">Your Question</label>
                            <textarea
                                id="question-input"
                                className="legal-textarea"
                                placeholder="For example: What are the provisions for self-defense under Indian law?"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                rows="5"
                            />
                        </div>
                        
                        <div className="form-actions">
                            <button 
                                type="submit" 
                                className="btn btn-primary"
                                disabled={loading || !question.trim()}
                            >
                                {loading ? (
                                    <>
                                        <span className="loading-spinner"></span>
                                        <span className="loading-text">Processing...</span>
                                    </>
                                ) : 'Submit Question'}
                            </button>
                        </div>
                    </form>
                </div>

                {error && (
                    <div className="error-message">
                        <p>{error}</p>
                    </div>
                )}

                {answer !== null && (
                    <div className="response-container">
                        <div className="response-header">
                            <h2>Legal Response</h2>
                            
                            <LanguageToggle 
                                selectedLanguage={language}
                                onLanguageChange={setLanguage}
                            />
                        </div>
                        
                        {translating && (
                            <div className="translating-indicator">
                                <span className="loading-spinner"></span>
                                <span>Translating response...</span>
                            </div>
                        )}
                        
                        <div className="response-content">
                            {answer.length > 0 ? (
                                (translatedAnswer || answer).map((item, index) => (
                                    <div key={index} className="response-item">
                                        <div dangerouslySetInnerHTML={createMarkup(renderMarkdown(item.text))} />
                                    </div>
                                ))
                            ) : (
                                <p className="no-results">No relevant information found. Please try rephrasing your question.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuestionInput;
