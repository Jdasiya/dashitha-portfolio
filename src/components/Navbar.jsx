import React, { useState, useEffect } from 'react';
import { Menu, X, Settings } from 'lucide-react';

export default function Navbar({ currentHash, setCurrentHash }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Experience', href: '#experience' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Research', href: '#research' },
    { label: 'Certifications', href: '#certifications' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (href) => {
    setCurrentHash(href);
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="navbar" style={{ background: scrolled ? 'rgba(3, 7, 18, 0.85)' : 'rgba(3, 7, 18, 0.7)' }}>
      <div className="container nav-container">
        <a href="#home" onClick={() => handleNavClick('#home')} className="logo">
          <span>Dashitha</span>.me
        </a>

        {/* Desktop Menu */}
        <ul className={`nav-links ${isOpen ? 'mobile-open' : ''}`}>
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                className={`nav-link ${currentHash === item.href ? 'active' : ''}`}
              >
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#admin"
              onClick={(e) => {
                e.preventDefault();
                setCurrentHash('#admin');
                setIsOpen(false);
              }}
              className="btn-admin-nav"
            >
              <Settings size={14} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
              Admin
            </a>
          </li>
        </ul>

        {/* Mobile Toggle */}
        <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
}
