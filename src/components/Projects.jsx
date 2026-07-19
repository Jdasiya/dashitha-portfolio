import React, { useState } from 'react';
import { ExternalLink, Info, X } from 'lucide-react';

const GithubIcon = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function Projects({ projects }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  if (!projects || projects.length === 0) return null;

  // Extract categories dynamically
  const categories = ['All', ...new Set(projects.map((p) => p.category))];

  const filteredProjects = activeFilter === 'All'
    ? projects
    : projects.filter((p) => p.category === activeFilter);

  return (
    <section id="projects">
      <div className="container">
        <div className="section-title-wrap">
          <p className="section-subtitle">Portfolio Showcases</p>
          <h2 className="section-title">Featured <span>Projects</span></h2>
        </div>

        {/* Filter Tabs */}
        <div className="projects-filter">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${activeFilter === cat ? 'active' : ''}`}
              onClick={() => setActiveFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <div className="glass-panel project-card" key={project.id}>
              <div className="project-img-container">
                <img 
                  src={project.imageUrl || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80'} 
                  alt={project.title} 
                  className="project-img" 
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                <div className="project-overlay">
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="project-overlay-link" title="Source Code">
                      <GithubIcon size={20} />
                    </a>
                  )}
                  {project.demoUrl && (
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="project-overlay-link" title="Live Demo">
                      <ExternalLink size={20} />
                    </a>
                  )}
                  <button onClick={() => setSelectedProject(project)} className="project-overlay-link" title="Project Details">
                    <Info size={20} />
                  </button>
                </div>
              </div>

              <div className="project-body">
                <span className="project-cat">{project.category}</span>
                <h3 className="project-card-title">{project.title}</h3>
                <p className="project-desc">{project.description}</p>
                <div className="project-tech">
                  {project.techStack && project.techStack.map((tech) => (
                    <span key={tech} className="tech-tag">{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Project Detail Modal */}
        {selectedProject && (
          <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
            <div className="glass-panel modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedProject(null)} aria-label="Close">
                <X size={20} />
              </button>
              
              <img 
                src={selectedProject.imageUrl || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80'} 
                alt={selectedProject.title} 
                className="modal-img" 
              />
              
              <span className="project-cat">{selectedProject.category}</span>
              <h3 className="modal-title">{selectedProject.title}</h3>
              
              <div className="modal-meta">
                {selectedProject.githubUrl && (
                  <span>
                    <GithubIcon size={16} />
                    <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>Source Repository</a>
                  </span>
                )}
                {selectedProject.demoUrl && (
                  <span>
                    <ExternalLink size={16} />
                    <a href={selectedProject.demoUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>Live Deployment</a>
                  </span>
                )}
              </div>

              <p className="modal-desc">{selectedProject.description}</p>
              
              {selectedProject.achievements && selectedProject.achievements.length > 0 && (
                <div>
                  <h4 className="modal-section-title">Key Achievements & Outcomes</h4>
                  <ul className="modal-achievements">
                    {selectedProject.achievements.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="project-tech" style={{ marginTop: '1rem' }}>
                {selectedProject.techStack && selectedProject.techStack.map((tech) => (
                  <span key={tech} className="tech-tag">{tech}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
