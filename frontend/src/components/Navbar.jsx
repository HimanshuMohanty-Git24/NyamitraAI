import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <div className="scale-icon logo-icon"></div>
          <span>Nyamitra</span>
        </Link>

        <button 
          className={`navbar-toggle ${menuOpen ? 'open' : ''}`} 
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link 
            to="/" 
            className={`navbar-link ${isActive('/')}`} 
            onClick={closeMenu}
          >
            Home
          </Link>
          <Link 
            to="/ask-question" 
            className={`navbar-link ${isActive('/ask-question')}`} 
            onClick={closeMenu}
          >
            Legal Questions
          </Link>
          <Link 
            to="/find-precedents" 
            className={`navbar-link ${isActive('/find-precedents')}`} 
            onClick={closeMenu}
          >
            Find Precedents
          </Link>
          <Link 
            to="/create-document" 
            className={`navbar-link ${isActive('/create-document')}`} 
            onClick={closeMenu}
          >
            Generate Documents
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;