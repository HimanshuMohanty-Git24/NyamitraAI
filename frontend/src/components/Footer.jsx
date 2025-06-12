import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="scale-icon logo-icon"></div>
              <span>Nyamitra</span>
            </div>
            <p className="footer-tagline">
              Empowering legal research with AI
            </p>
          </div>
          
          <div className="footer-links">
            <div className="footer-links-column">
              <h4>Navigation</h4>
              <Link to="/" className="footer-link">Home</Link>
              <Link to="/ask-question" className="footer-link">Legal Questions</Link>
              <Link to="/find-precedents" className="footer-link">Find Precedents</Link>
              <Link to="/create-document" className="footer-link">Generate Documents</Link>
            </div>
            
            <div className="footer-links-column">
              <h4>Resources</h4>
              <a href="#" className="footer-link">Legal Articles</a>
              <a href="#" className="footer-link">Research Tools</a>
              <a href="#" className="footer-link">FAQs</a>
            </div>
            
            <div className="footer-links-column">
              <h4>Contact</h4>
              <a href="mailto:info@nyamitra.ai" className="footer-link">info@nyamitra.ai</a>
              <a href="tel:+91-123-456-7890" className="footer-link">+91 123 456 7890</a>
              <a href="#" className="footer-link">Contact Form</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="copyright">
            &copy; {currentYear} Nyamitra AI Legal Research. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <a href="#" className="footer-link">Privacy Policy</a>
            <a href="#" className="footer-link">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;