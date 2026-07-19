import React, { useState } from 'react';
import { Award, Calendar, Eye, X } from 'lucide-react';

export default function Certifications({ certifications }) {
  const [activeCert, setActiveCert] = useState(null);

  if (!certifications || certifications.length === 0) return null;

  return (
    <section id="certifications">
      <div className="container">
        <div className="section-title-wrap">
          <p className="section-subtitle">Credential Gallery</p>
          <h2 className="section-title">Certifications <span>& Badges</span></h2>
        </div>

        <div className="certs-grid">
          {certifications.map((cert, idx) => (
            <div className="glass-panel cert-card" key={cert.id || idx}>
              <div className="cert-img-wrap">
                <img 
                  src={cert.previewUrl || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80'} 
                  alt={cert.name} 
                  className="cert-img"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80';
                  }}
                />
              </div>

              <h3 className="cert-title">{cert.name}</h3>
              
              <div className="cert-meta">
                <span className="cert-issuer">
                  <Award size={14} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                  {cert.issuer}
                </span>
                <span className="cert-year">
                  <Calendar size={14} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                  {cert.year}
                </span>
              </div>

              {cert.previewUrl && (
                <button className="cert-btn" onClick={() => setActiveCert(cert)}>
                  <Eye size={14} />
                  Preview Certificate
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Certificate Zoom Modal */}
        {activeCert && (
          <div className="modal-overlay" onClick={() => setActiveCert(null)}>
            <div className="glass-panel modal-content" style={{ maxWidth: '600px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setActiveCert(null)}>
                <X size={20} />
              </button>
              
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.4rem' }}>{activeCert.name}</h3>
              
              <img 
                src={activeCert.previewUrl || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80'} 
                alt={activeCert.name} 
                style={{ width: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }} 
              />
              
              <p style={{ marginTop: '1.5rem', color: '#94a3b8' }}>
                Issued by <strong style={{ color: '#f8fafc' }}>{activeCert.issuer}</strong> in {activeCert.year}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
