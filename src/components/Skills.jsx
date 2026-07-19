import React, { useEffect, useState } from 'react';
import { Code, Database, Cpu, Layers, Terminal } from 'lucide-react';

export default function Skills({ skills }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger progress bar animations after mounting
    const timer = setTimeout(() => setAnimate(true), 150);
    return () => clearTimeout(timer);
  }, []);

  if (!skills || skills.length === 0) return null;

  const getCategoryIcon = (category) => {
    const catLower = category.toLowerCase();
    if (catLower.includes('lang')) return <Code size={20} />;
    if (catLower.includes('web') || catLower.includes('front') || catLower.includes('back')) return <Layers size={20} />;
    if (catLower.includes('data') || catLower.includes('db') || catLower.includes('sql')) return <Database size={20} />;
    if (catLower.includes('ai') || catLower.includes('ml') || catLower.includes('machine') || catLower.includes('cloud')) return <Cpu size={20} />;
    return <Terminal size={20} />;
  };

  return (
    <section id="skills">
      <div className="container">
        <div className="section-title-wrap">
          <p className="section-subtitle">My Stack</p>
          <h2 className="section-title">Technical <span>Skills</span></h2>
        </div>

        <div className="skills-grid">
          {skills.map((cat, idx) => (
            <div className="glass-panel skills-category-card" key={idx}>
              <h3>
                {getCategoryIcon(cat.category)}
                <span>{cat.category}</span>
              </h3>
              
              <div className="skills-list">
                {cat.items && cat.items.map((skill, sIdx) => (
                  <div className="skill-item" key={sIdx}>
                    <div className="skill-header">
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-percentage">{skill.level}%</span>
                    </div>
                    <div className="skill-bar-bg">
                      <div 
                        className="skill-bar-fill" 
                        style={{ width: animate ? `${skill.level}%` : '0%' }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
