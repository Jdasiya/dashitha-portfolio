import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

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

export default function Contact({ contact }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState(null); // 'submitting', 'success', 'error'

  if (!contact) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error');
      return;
    }
    
    setStatus('submitting');
    
    // Simulate sending email
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1200);
  };

  return (
    <section id="contact">
      <div className="container">
        <div className="section-title-wrap">
          <p className="section-subtitle">Get In Touch</p>
          <h2 className="section-title">Contact <span>Me</span></h2>
        </div>

        <div className="contact-grid">
          {/* Info Card */}
          <div className="glass-panel contact-info-card">
            <div className="contact-header">
              <h3>Let's collaborate!</h3>
              <p>Feel free to reach out for research discussions, process analysis opportunities, or software project consultations.</p>
            </div>

            <div className="contact-methods">
              {contact.email && (
                <div className="contact-method-item">
                  <div className="contact-method-icon">
                    <Mail size={20} />
                  </div>
                  <div className="contact-method-detail">
                    <h4>Email</h4>
                    <a href={`mailto:${contact.email}`}>{contact.email}</a>
                  </div>
                </div>
              )}

              {contact.phone && (
                <div className="contact-method-item">
                  <div className="contact-method-icon">
                    <Phone size={20} />
                  </div>
                  <div className="contact-method-detail">
                    <h4>Call Me</h4>
                    <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                  </div>
                </div>
              )}

              <div className="contact-method-item">
                <div className="contact-method-icon">
                  <MapPin size={20} />
                </div>
                <div className="contact-method-detail">
                  <h4>Location</h4>
                  <p>SLIIT, Malabe, Sri Lanka</p>
                </div>
              </div>
            </div>

            <div className="hero-socials" style={{ marginTop: '1.5rem' }}>
              {contact.linkedin && (
                <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn">
                  <LinkedinIcon size={22} />
                </a>
              )}
              {contact.github && (
                <a href={contact.github} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="GitHub">
                  <GithubIcon size={22} />
                </a>
              )}
              {contact.whatsapp && (
                <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="WhatsApp">
                  <MessageSquare size={22} />
                </a>
              )}
            </div>
          </div>

          {/* Form Card */}
          <div className="glass-panel contact-form-card">
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label className="form-label" htmlFor="contact-name">Full Name</label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-email">Email Address</label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-subject">Subject</label>
                <input
                  type="text"
                  id="contact-subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can I help you?"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  className="form-textarea"
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="btn-primary submit-btn"
                disabled={status === 'submitting'}
              >
                <Send size={16} />
                {status === 'submitting' ? 'Sending...' : 'Send Message'}
              </button>

              {status === 'success' && (
                <div className="form-status success">
                  Your message has been sent successfully! I will get back to you soon.
                </div>
              )}

              {status === 'error' && (
                <div className="form-status error">
                  Please fill in all required fields and enter a valid email address.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
