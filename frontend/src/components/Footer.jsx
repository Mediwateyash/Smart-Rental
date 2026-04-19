// src/components/Footer.jsx
import React from "react";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3 className="footer-logo">Rentify</h3>
            <p className="footer-tagline">Making rental management smarter and easier for everyone.</p>
          </div>

          <div className="footer-dev">
            <p className="dev-text">Designed and Developed by <span className="dev-name">Diwate yash</span></p>
            <div className="footer-social">
              <a
                href="https://www.linkedin.com/in/diwateyash2004/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link linkedin"
                title="LinkedIn Profile"
              >
                <i className="fab fa-linkedin"></i> LinkedIn
              </a>
              <a
                href="https://github.com/Mediwateyash"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link github"
                title="GitHub Profile"
              >
                <i className="fab fa-github"></i> GitHub
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Rentify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
