import { useState, useEffect } from 'react'
import styles from '../styles/Home.module.css'

export default function Home() {
  const [userInput, setUserInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [showResponse, setShowResponse] = useState(false)
  const [response, setResponse] = useState('')

  useEffect(() => {
    let timer1, timer2, timer3;
    
    if (isProcessing) {
      setCurrentStep(1);
      timer1 = setTimeout(() => setCurrentStep(2), 1000);
      timer2 = setTimeout(() => setCurrentStep(3), 2000);
      timer3 = setTimeout(() => {
        setIsProcessing(false);
        setShowResponse(true);
      }, 3000);
    }
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isProcessing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    
    // Reset states
    setIsProcessing(true);
    setShowResponse(false);
    
    // Generate a sample response
    setResponse(`Based on Indian legal statutes and precedents, the answer to your query about '${userInput}' would typically involve consideration of relevant sections from the applicable laws and judicial interpretations.`);
    
    // Clear input
    setUserInput('');
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Legal Chatbot</h1>
        
        <div className={styles.chatContainer}>
          <form className={styles.inputForm} onSubmit={handleSubmit}>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask a legal question..."
              disabled={isProcessing}
              className={styles.input}
            />
            <button 
              type="submit" 
              disabled={isProcessing}
              className={styles.button}
            >
              Send
            </button>
          </form>
          
          {isProcessing && (
            <div className={styles.processingContainer}>
              <div className={`${styles.processingStep} ${currentStep >= 1 ? styles.active : ''}`}>
                <div className={styles.iconContainer}>
                  <img 
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAA30lEQVRIie2UMQrCQBBF3yhiJWprYeEFvICFjQewsBTvYmHrLbxAGi+QK3gCC0FIoaRIrAIWFvEbV7KbrAsWFvnw2Z15O/N3YGeM+QMSoA10X7nMHnYx5grUfIwbYA+cgLGLecp8CmyAVRFBDTgDY2AElMBB4xVgmBEPgAUw9RHMVKANbNXfAS1X8KF0GeCu/SFQdwn2QEfBEihkTl5DYClWwSQ4A00Fs9+QQDw47QRVoKHgkddYxpY/UXHTvUbA1iacyZsUcfAkwXQNlEDV2H5GS3YpFnFRXsZs+beTZnyID5M7NaGYD9NNAAAAAElFTkSuQmCC" 
                    alt="Document DB" 
                    className={styles.icon} 
                  />
                </div>
                <span>Finding the context in relevant documents in DB</span>
              </div>
              
              <div className={`${styles.processingStep} ${currentStep >= 2 ? styles.active : ''}`}>
                <div className={styles.iconContainer}>
                  <img 
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAABxUlEQVRIidWUv0tcQRDHP3PvRBTskoiFlX+AxSWdWKiNjdpo408QFCJWY5VCCzsbQYKFhZ2NaKEEtBGxUEhjY2dhYxPQwii5787YvOO9vXcvsVLIFzu7M9/5zu7Ozhy8b5MA7AMdYB9IjjIYdN5Uex6Ei7zzr4NyWVS7YP0OvgK+exKo6Wvg0LIOeJpzbmTkA/DLk1mEPgENYzsBbBXIzwEXWnc78AF457Ebcl49A77kBK2LDVu6eQ3UtWZerHFiDfgLTOckV1H7T+AEmNTaQyLW2yL5CNhrqdVQ6lYcdxW9V0B02nZW8RZ4CRx54nR05lcZC7RDOZvMoC2D2Yx3ybz6CKyoT1PN8eVzYA8oi3fBP2TRN0OgABWtOwMWPTENnXOb5FLWaWjw1rDNKsgmcO5JMK1+D4DPQI9U0uq5SrrhHnDveYOHcFJrr4D5LENWrAZw60l0B9yRdtpHnZsn/fwL8CFPeZgoQy8TF8CaY20oDYApsWpKA+6EsVjFPPsYu3TXDZ8eFQl5G6aA6pDzirLqi8yTziK0Vfwi/yN0VAZJEsYx6Qxpi1VUGY3KS+Cb+lT+V8Dq+AOcivUYOHnXeB/6DypQA5rvJb3LAAAAAElFTkSuQmCC" 
                    alt="Indian Kanoon" 
                    className={styles.icon} 
                  />
                </div>
                <span>Searching the information in the Indian Kanoon DB</span>
              </div>
              
              <div className={`${styles.processingStep} ${currentStep >= 3 ? styles.active : ''}`}>
                <div className={styles.iconContainer}>
                  <img 
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAABmklEQVRIie2UP0hCURTGf+/ZS6KhJWhwCeqVLW0FQoQ1NbRFU1NbW0NTtDg1tjq1tdXSEDjYFtTiUwqKIFpySXpB+Md73xuuT3s+X/ZHaPMHDpd7zne+851z74GZZpL+iKiTUJIklGG8BHwBKeBbRExnLCNJFRHZDcZYgXPgVUSqw+ZsBVgFToGfAVsL+HGNbY6KcRboAJ9Ac1ygRTnOYmfQA5aHBZiGFJU/1GbmlbkCDqwELgauXfP+oENgA3gHusB+0Cgi1hFwZGa3fscYVrHA2pliRF2YWcM1Vwv4wOnPIuoEzgZ1UJqCEPPA2ojYCMgBt66m9KBhHjgGVoA8MCcilX/cvQJ8uctXHnQA1IEb4NYRWheR1phz5IBFV5uXwBvQERHrmQ2p84hYZvJqm1nLMVUxsw/gQURWJ5HPzK7MLOWaK53vPANsAVvAOfAogxURmRsj1vOYa2lmdTPrOs52PIOAW4U++bAHXYnI9ogYYJLfASoi0gxuDvsNSsChI+TJzFJmVgMeJ5HPzC7MrG5mQ3vmTFPrF0jG6T67Qd2/AAAAAElFTkSuQmCC" 
                    alt="Web Search" 
                    className={styles.icon} 
                  />
                </div>
                <span>Finding relevant info in Web search</span>
              </div>
            </div>
          )}
          
          {showResponse && (
            <div className={styles.response}>
              {response}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}