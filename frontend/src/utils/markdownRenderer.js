// Utility function to detect and render markdown in text
export const renderMarkdown = (text) => {
  if (!text) return '';
  
  // Replace markdown headers
  text = text.replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^#### (.*$)/gm, '<h4>$1</h4>');
  
  // Replace markdown lists
  text = text.replace(/^\* (.*$)/gm, '<li>$1</li>')
    .replace(/^- (.*$)/gm, '<li>$1</li>');
  
  // Wrap lists in <ul> tags
  const hasLists = text.includes('<li>');
  if (hasLists) {
    text = '<ul>' + text + '</ul>';
    // Fix multiple adjacent lists
    text = text.replace(/<\/ul>\s*<ul>/g, '');
  }
  
  // Replace bold text
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.*?)__/g, '<strong>$1</strong>');
  
  // Replace italic text
  text = text.replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/_(.*?)_/g, '<em>$1</em>');
  
  // Replace code blocks
  text = text.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
  
  // Replace inline code
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Replace links
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // Replace line breaks
  text = text.replace(/\n/g, '<br />');
  
  return text;
};

// Create a component to safely render HTML content
export const createMarkup = (htmlContent) => {
  return { __html: htmlContent };
};