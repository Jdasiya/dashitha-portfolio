import React from 'react';
import { Briefcase } from 'lucide-react';

export default function Experience({ experience }) {
  if (!experience || experience.length === 0) return null;

  return (
    <section id="experience">
      <div className="container">
        <div className="section-title-wrap">
          <p className="section-subtitle">Professional Path</p>
          <h2 className="section-title">Work <span>Experience</span></h2>
        </div>

        <div className="timeline">
          {experience.map((exp, index) => (
            <div className="timeline-item" key={exp.id || index}>
              <div className="timeline-dot"></div>
              <div className="glass-panel timeline-card">
                <div className="timeline-header">
                  <div>
                    <h3 className="timeline-role">{exp.role}</h3>
                    <p className="timeline-company">{exp.company}</p>
                  </div>
                  <span className="timeline-period">{exp.period}</span>
                </div>
                <div className="timeline-body">
                  <p>{exp.description}</p>
                  {exp.points && exp.points.length > 0 && (
                    <ul className="timeline-points">
                      {exp.points.map((point, pIdx) => (
                        <li key={pIdx}>{point}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
