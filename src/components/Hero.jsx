import React from 'react';
import { Download, Mail, MessageSquare } from 'lucide-react';

const GithubIcon = ({ size = 22 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 22 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function Hero({ personal }) {
  if (!personal) return null;

  return (
    <section id="home" className="hero">
      <div className="container hero-content">
        <div className="hero-text">
          <h4>WELCOME TO MY PORTFOLIO</h4>
          <h1>Don Dashitha <br />Madhukara Jayasingha</h1>
          <h2>
            <span>{personal.title}</span>
          </h2>
          <p>{personal.bio}</p>
          
          <div className="hero-buttons">
            <a href={personal.cvUrl || '#'} className="btn-primary" download="Don_Dashitha_CV.pdf">
              <Download size={18} />
              Download CV
            </a>
            <a href="#contact" className="btn-accent">
              <Mail size={18} />
              Hire Me
            </a>
          </div>

          <div className="hero-socials">
            {personal.contact?.linkedin && (
              <a href={personal.contact.linkedin} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn">
                <LinkedinIcon size={22} />
              </a>
            )}
            {personal.contact?.github && (
              <a href={personal.contact.github} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="GitHub">
                <GithubIcon size={22} />
              </a>
            )}
            {personal.contact?.whatsapp && (
              <a href={personal.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="WhatsApp">
                <MessageSquare size={22} />
              </a>
            )}
            {personal.contact?.email && (
              <a href={`mailto:${personal.contact.email}`} className="social-icon" aria-label="Email">
                <Mail size={22} />
              </a>
            )}
          </div>
        </div>

        <div className="hero-image-wrap">
          <div className="image-glow"></div>
          <div className="hero-image-container">
            <img 
              src={personal.photoUrl || "https://api.dicebear.com/7.x/bottts/svg?seed=dashitha&backgroundColor=0f172a"} 
              alt="Don Dashitha Madhukara Jayasingha" 
              className="hero-image"
              onError={(e) => {
                e.target.src = "https://api.dicebear.com/7.x/bottts/svg?seed=dashitha&backgroundColor=0f172a";
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
