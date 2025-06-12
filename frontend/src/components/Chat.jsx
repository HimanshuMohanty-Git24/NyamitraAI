import React from "react";
import { renderMarkdown, createMarkup } from '../utils/markdownRenderer';
import './Chat.css';

const Chat = ({ response }) => {
  // If response is a string, process it, otherwise handle it as-is
  const processedResponse = typeof response === 'string' 
    ? response.split('. ').map(item => item.trim()).filter(item => item)
    : response;

  return (
    <div className="chat-container">
      <h2>Response</h2>
      <div className="chat-response">
        {Array.isArray(processedResponse) ? (
          processedResponse.map((item, index) => (
            <div key={index} className="chat-message">
              <div dangerouslySetInnerHTML={createMarkup(renderMarkdown(item))} />
            </div>
          ))
        ) : (
          <div className="chat-message">
            <div dangerouslySetInnerHTML={createMarkup(renderMarkdown(processedResponse))} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;