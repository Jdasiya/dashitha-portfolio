import React from 'react';

export default function Footer({ name }) {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="copyright">
          &copy; {currentYear} {name || 'Don Dashitha Madhukara Jayasingha'}. All Rights Reserved.
        </div>
        <div style={{ color: '#64748b', fontSize: '0.85rem' }}>
          Designed & Built with React & Vanilla CSS
        </div>
      </div>
    </footer>
  );
}
