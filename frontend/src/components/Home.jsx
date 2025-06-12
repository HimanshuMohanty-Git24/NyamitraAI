import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <header className="hero-section">
        <div className="container">
          <h1 className="hero-title">
            Nyamitra AI <span className="highlight">Legal Research</span>
          </h1>
          <p className="hero-subtitle">
            Empowering legal professionals with AI-driven research tools and document generation
          </p>
          
          <div className="hero-cta">
            <Link to="/ask-question" className="btn btn-primary btn-lg">
              Start Exploring
            </Link>
            <a href="#features" className="btn btn-secondary btn-lg">
              Learn More
            </a>
          </div>
          
          <div className="hero-image">
            <div className="decoration-circle"></div>
            <div className="decoration-square"></div>
          </div>
        </div>
      </header>
      
      <section id="features" className="features-section">
        <div className="container">
          <h2 className="section-title">Our Services</h2>
          <p className="section-subtitle">
            Comprehensive legal research tools powered by artificial intelligence
          </p>
          
          <div className="features-grid">
            <Link to="/ask-question" className="feature-card">
              <div className="feature-icon">
                <div className="gavel-icon"></div>
              </div>
              <h3>Legal Questions</h3>
              <p>Get instant answers to your legal queries with references to relevant sections and precedents</p>
            </Link>
            
            <Link to="/find-precedents" className="feature-card">
              <div className="feature-icon">
                <div className="scale-icon"></div>
              </div>
              <h3>Find Precedents</h3>
              <p>Search through thousands of case laws to find relevant precedents for your legal matters</p>
            </Link>
            
            <Link to="/create-document" className="feature-card">
              <div className="feature-icon">
                <div className="document-icon"></div>
              </div>
              <h3>Generate Documents</h3>
              <p>Create professional legal documents, contracts, and agreements tailored to your specific needs</p>
            </Link>
          </div>
        </div>
      </section>
      
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">Trusted by Legal Professionals</h2>
          
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"Nyamitra AI has revolutionized our legal research process, saving us countless hours of work."</p>
              </div>
              <div className="testimonial-author">
                <div className="testimonial-avatar">A</div>
                <div className="testimonial-info">
                  <h4>Aditya Sharma</h4>
                  <p>Senior Advocate, Delhi High Court</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"The document generation feature is incredibly accurate and has streamlined our contract creation process."</p>
              </div>
              <div className="testimonial-author">
                <div className="testimonial-avatar">P</div>
                <div className="testimonial-info">
                  <h4>Priya Malhotra</h4>
                  <p>Corporate Lawyer, Mumbai</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"Finding relevant precedents has never been easier. This tool is indispensable for any legal professional."</p>
              </div>
              <div className="testimonial-author">
                <div className="testimonial-avatar">R</div>
                <div className="testimonial-info">
                  <h4>Rajesh Kumar</h4>
                  <p>Legal Researcher, National Law University</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;