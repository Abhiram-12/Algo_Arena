import React from 'react';
import '../styles/footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          <a href="/about" className="footer-link">About Us</a>
          <a href="/contact" className="footer-link">Contact</a>
          <a href="/privacy-policy" className="footer-link">Privacy Policy</a>
          <a href="/terms-of-service" className="footer-link">Terms of Service</a>
        </div>
        <div className="footer-socials">
          <a href="https://facebook.com" className="footer-social-link" aria-label="Facebook">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://twitter.com" className="footer-social-link" aria-label="Twitter">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://linkedin.com" className="footer-social-link" aria-label="LinkedIn">
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 AlgoArena. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
