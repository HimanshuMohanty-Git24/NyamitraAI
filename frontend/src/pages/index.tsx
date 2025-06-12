import React, { useState } from 'react';
import ProcessingAnimation from '../../../components/ProcessingAnimation';

export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [response, setResponse] = useState("");
  
  const handleStartProcessing = () => {
    setIsProcessing(true);
    setShowResponse(false);
    setResponse(""); // Clear previous response
  };
  
  const handleAnimationComplete = () => {
    setIsProcessing(false);
    setShowResponse(true);
    setResponse("This is the LLM's response to your query.");
  };
  
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Legal Chatbot</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={handleStartProcessing}
          disabled={isProcessing}
          style={{
            padding: '10px 15px',
            backgroundColor: '#0056b3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isProcessing ? 'not-allowed' : 'pointer'
          }}
        >
          {isProcessing ? 'Processing...' : 'Test Animation'}
        </button>
      </div>
      
      {isProcessing && (
        <ProcessingAnimation onComplete={handleAnimationComplete} />
      )}
      
      {showResponse && (
        <div style={{
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px',
          marginTop: '20px',
          borderLeft: '4px solid #0056b3'
        }}>
          {response}
        </div>
      )}
    </div>
  );
}