import React from 'react';
import { FileText, Calendar, ExternalLink, Award } from 'lucide-react';

export default function Research({ research }) {
  if (!research || research.length === 0) return null;

  return (
    <section id="research">
      <div className="container">
        <div className="section-title-wrap">
          <p className="section-subtitle">Academic Research</p>
          <h2 className="section-title">Research <span>Publications</span></h2>
        </div>

        <div className="research-list">
          {research.map((paper, idx) => (
            <div className="glass-panel research-card" key={paper.id || idx}>
              <div className="research-badge">
                <FileText size={14} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                {paper.type}
              </div>
              
              <div className="research-info">
                <h3 className="research-paper-title">{paper.title}</h3>
                <p className="research-authors">{paper.authors}</p>
                <div className="research-venue">
                  <Award size={14} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                  {paper.venue} 
                  {paper.publicationDate && (
                    <span style={{ marginLeft: '10px' }}>
                      <Calendar size={14} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                      {paper.publicationDate}
                    </span>
                  )}
                </div>
                <p className="research-desc">{paper.description}</p>
                
                {paper.pdfUrl && paper.pdfUrl !== '#' && (
                  <a href={paper.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn-accent" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                    <ExternalLink size={14} />
                    View Publication
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
