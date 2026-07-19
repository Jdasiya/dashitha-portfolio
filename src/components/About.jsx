import React from 'react';
import { GraduationCap, Target, Heart, Award } from 'lucide-react';

export default function About({ about }) {
  if (!about) return null;

  return (
    <section id="about">
      <div className="container">
        <div className="section-title-wrap">
          <p className="section-subtitle">Get To Know Me</p>
          <h2 className="section-title">About <span>Me</span></h2>
        </div>

        <div className="about-grid">
          <div className="glass-panel about-card">
            <h3>My Journey</h3>
            <p>{about.intro}</p>
            
            <div className="about-details">
              <div className="about-detail-item">
                <div className="about-detail-icon">
                  <GraduationCap size={22} />
                </div>
                <div className="about-detail-content">
                  <h4>Education</h4>
                  <p>{about.education}</p>
                </div>
              </div>

              <div className="about-detail-item">
                <div className="about-detail-icon">
                  <Target size={22} />
                </div>
                <div className="about-detail-content">
                  <h4>Career Goal</h4>
                  <p>{about.careerGoals}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel about-card">
            <h3>Core Interests</h3>
            <p>I constantly expand my horizons and focus on areas where advanced coding overlaps with analytical frameworks:</p>
            
            <div className="interests-grid">
              {about.interests && about.interests.map((interest, idx) => (
                <div key={idx} className="interest-tag">
                  <Heart size={16} className="about-detail-icon" />
                  <span>{interest}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
