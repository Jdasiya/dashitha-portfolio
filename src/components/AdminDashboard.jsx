import React, { useState } from 'react';
import { 
  User, Briefcase, Cpu, Folder, Book, Award, Download, LogOut, 
  RefreshCw, Plus, Trash, Edit2, Check, Lock, ArrowLeft, Eye 
} from 'lucide-react';

export default function AdminDashboard({ data, onUpdateData, onResetData, onClose }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('admin_auth') === 'true';
  });
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [activeTab, setActiveTab] = useState('personal');
  const [saveSuccess, setSaveSuccess] = useState('');

  // Editing state for nested lists
  const [editingItem, setEditingItem] = useState(null); // { type, index, values } or { type, action: 'add', values }

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid Administrator Password.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
  };

  const triggerSuccessMessage = (message = 'Settings Saved Locally!') => {
    setSaveSuccess(message);
    setTimeout(() => setSaveSuccess(''), 3000);
  };

  // 1. Personal Info Handlers
  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    onUpdateData({
      ...data,
      personal: {
        ...data.personal,
        [name]: value
      }
    });
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    onUpdateData({
      ...data,
      personal: {
        ...data.personal,
        contact: {
          ...data.personal.contact,
          [name]: value
        }
      }
    });
  };

  const handleAboutChange = (e) => {
    const { name, value } = e.target;
    onUpdateData({
      ...data,
      about: {
        ...data.about,
        [name]: value
      }
    });
  };

  // 2. Export / Download Handler
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "portfolio-data.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerSuccessMessage('Downloaded portfolio-data.json! Replace it in your public folder.');
  };

  // Password Login Screen
  if (!isAuthenticated) {
    return (
      <div className="container">
        <div className="glass-panel admin-login-wrap">
          <div style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--accent-cyan)' }}>
            <Lock size={40} />
          </div>
          <h2 className="admin-login-title">Admin Dashboard</h2>
          <form onSubmit={handleLogin} className="contact-form">
            <div className="form-group">
              <label className="form-label" htmlFor="admin-password">Administrator Password</label>
              <input
                type="password"
                id="admin-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (default: admin123)"
                className="form-input"
                required
              />
            </div>
            {loginError && <p style={{ color: '#ef4444', fontSize: '0.85rem' }}>{loginError}</p>}
            <button type="submit" className="admin-login-btn">
              Authenticate
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              className="btn-secondary" 
              style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}
            >
              <ArrowLeft size={16} /> Back to Portfolio
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Sidebar Menu Config
  const menuItems = [
    { id: 'personal', label: 'Profile Details', icon: <User size={18} /> },
    { id: 'experience', label: 'Experience Timeline', icon: <Briefcase size={18} /> },
    { id: 'skills', label: 'Technical Skills', icon: <Cpu size={18} /> },
    { id: 'projects', label: 'Projects Showcases', icon: <Folder size={18} /> },
    { id: 'research', label: 'Research Work', icon: <Book size={18} /> },
    { id: 'certifications', label: 'Certifications', icon: <Award size={18} /> },
  ];

  // EXPERIENCE CRUD
  const handleSaveExperience = (e) => {
    e.preventDefault();
    const list = [...(data.experience || [])];
    
    if (editingItem.action === 'add') {
      const newItem = {
        ...editingItem.values,
        id: `exp-${Date.now()}`
      };
      list.push(newItem);
    } else {
      list[editingItem.index] = editingItem.values;
    }

    onUpdateData({ ...data, experience: list });
    setEditingItem(null);
    triggerSuccessMessage();
  };

  const handleDeleteExperience = (index) => {
    if (window.confirm('Delete this work experience entry?')) {
      const list = (data.experience || []).filter((_, i) => i !== index);
      onUpdateData({ ...data, experience: list });
      triggerSuccessMessage();
    }
  };

  // SKILLS CRUD
  const handleSaveSkillCategory = (e) => {
    e.preventDefault();
    const categories = [...(data.skills || [])];
    if (editingItem.action === 'add') {
      categories.push({ category: editingItem.values.category, items: [] });
    } else {
      categories[editingItem.index].category = editingItem.values.category;
    }
    onUpdateData({ ...data, skills: categories });
    setEditingItem(null);
    triggerSuccessMessage();
  };

  const handleDeleteSkillCategory = (index) => {
    if (window.confirm('Delete this skill category and all its skills?')) {
      const list = (data.skills || []).filter((_, i) => i !== index);
      onUpdateData({ ...data, skills: list });
      triggerSuccessMessage();
    }
  };

  const handleAddSkillToCategory = (catIndex) => {
    const categories = [...(data.skills || [])];
    const skillName = prompt('Enter Skill Name:');
    if (!skillName) return;
    const skillLevel = parseInt(prompt('Enter Skill Level (0-100):') || '80', 10);
    
    categories[catIndex].items = [
      ...(categories[catIndex].items || []),
      { name: skillName, level: isNaN(skillLevel) ? 80 : skillLevel }
    ];
    onUpdateData({ ...data, skills: categories });
    triggerSuccessMessage('Skill Added!');
  };

  const handleDeleteSkillFromCategory = (catIndex, skillIndex) => {
    const categories = [...(data.skills || [])];
    categories[catIndex].items = categories[catIndex].items.filter((_, i) => i !== skillIndex);
    onUpdateData({ ...data, skills: categories });
    triggerSuccessMessage('Skill Deleted!');
  };

  // PROJECTS CRUD
  const handleSaveProject = (e) => {
    e.preventDefault();
    const list = [...(data.projects || [])];
    
    // Parse comma-separated tech stack
    const processedValues = {
      ...editingItem.values,
      techStack: typeof editingItem.values.techStack === 'string' 
        ? editingItem.values.techStack.split(',').map(s => s.trim()).filter(Boolean)
        : editingItem.values.techStack,
      achievements: typeof editingItem.values.achievements === 'string'
        ? editingItem.values.achievements.split('\n').map(s => s.trim()).filter(Boolean)
        : editingItem.values.achievements
    };

    if (editingItem.action === 'add') {
      processedValues.id = `proj-${Date.now()}`;
      list.push(processedValues);
    } else {
      list[editingItem.index] = processedValues;
    }

    onUpdateData({ ...data, projects: list });
    setEditingItem(null);
    triggerSuccessMessage();
  };

  const handleDeleteProject = (index) => {
    if (window.confirm('Delete this project entry?')) {
      const list = (data.projects || []).filter((_, i) => i !== index);
      onUpdateData({ ...data, projects: list });
      triggerSuccessMessage();
    }
  };

  // RESEARCH CRUD
  const handleSaveResearch = (e) => {
    e.preventDefault();
    const list = [...(data.research || [])];
    
    if (editingItem.action === 'add') {
      const newItem = {
        ...editingItem.values,
        id: `res-${Date.now()}`
      };
      list.push(newItem);
    } else {
      list[editingItem.index] = editingItem.values;
    }

    onUpdateData({ ...data, research: list });
    setEditingItem(null);
    triggerSuccessMessage();
  };

  const handleDeleteResearch = (index) => {
    if (window.confirm('Delete this research paper entry?')) {
      const list = (data.research || []).filter((_, i) => i !== index);
      onUpdateData({ ...data, research: list });
      triggerSuccessMessage();
    }
  };

  // CERTIFICATIONS CRUD
  const handleSaveCert = (e) => {
    e.preventDefault();
    const list = [...(data.certifications || [])];
    
    if (editingItem.action === 'add') {
      const newItem = {
        ...editingItem.values,
        id: `cert-${Date.now()}`
      };
      list.push(newItem);
    } else {
      list[editingItem.index] = editingItem.values;
    }

    onUpdateData({ ...data, certifications: list });
    setEditingItem(null);
    triggerSuccessMessage();
  };

  const handleDeleteCert = (index) => {
    if (window.confirm('Delete this certification entry?')) {
      const list = (data.certifications || []).filter((_, i) => i !== index);
      onUpdateData({ ...data, certifications: list });
      triggerSuccessMessage();
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      {/* Top Header */}
      <div className="admin-section-header" style={{ marginTop: '100px', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="admin-section-title">Admin Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Modify contents. Press <strong>"Export Config"</strong> to get the JSON file.
          </p>
        </div>
        <div className="admin-action-bar">
          <button onClick={onClose} className="admin-btn-action btn-add" style={{ background: '#1e293b', color: '#f8fafc' }}>
            <Eye size={15} /> Preview Site
          </button>
          <button onClick={handleExportJSON} className="admin-btn-action btn-export">
            <Download size={15} /> Export Config
          </button>
          <button 
            onClick={() => {
              if (window.confirm('Reset all changes back to public/portfolio-data.json defaults?')) {
                onResetData();
                triggerSuccessMessage('Restored pristine configurations.');
              }
            }} 
            className="admin-btn-action btn-edit-item"
          >
            <RefreshCw size={14} /> Reset Default
          </button>
          <button onClick={handleLogout} className="admin-btn-action btn-delete-item">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="form-status success" style={{ margin: '1rem 0' }}>
          <Check size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          {saveSuccess}
        </div>
      )}

      {/* Main Grid */}
      <div className="admin-container">
        {/* Sidebar Nav */}
        <div className="glass-panel admin-sidebar">
          <h3 className="admin-sidebar-title">Sections</h3>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setEditingItem(null);
              }}
              className={`admin-nav-item ${activeTab === item.id ? 'active' : ''}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        {/* Content Panel */}
        <div className="glass-panel admin-content">
          {/* TAB 1: PERSONAL DETAILS */}
          {activeTab === 'personal' && !editingItem && (
            <div>
              <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-cyan)' }}>Hero & Bio Details</h3>
              <div className="admin-form">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={data.personal?.name || ''}
                    onChange={handlePersonalChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Professional Titles</label>
                  <input
                    type="text"
                    name="title"
                    value={data.personal?.title || ''}
                    onChange={handlePersonalChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group admin-form-full">
                  <label className="form-label">Short Biography</label>
                  <textarea
                    name="bio"
                    value={data.personal?.bio || ''}
                    onChange={handlePersonalChange}
                    className="form-textarea"
                  ></textarea>
                </div>
                <div className="form-group">
                  <label className="form-label">Profile Image URL</label>
                  <input
                    type="text"
                    name="photoUrl"
                    value={data.personal?.photoUrl || ''}
                    onChange={handlePersonalChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">CV PDF Document Link</label>
                  <input
                    type="text"
                    name="cvUrl"
                    value={data.personal?.cvUrl || ''}
                    onChange={handlePersonalChange}
                    className="form-input"
                  />
                </div>

                <h3 className="admin-form-full" style={{ margin: '1.5rem 0 0.5rem', color: 'var(--accent-cyan)' }}>Contact Options</h3>
                
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={data.personal?.contact?.email || ''}
                    onChange={handleContactChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={data.personal?.contact?.phone || ''}
                    onChange={handleContactChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">LinkedIn URL</label>
                  <input
                    type="text"
                    name="linkedin"
                    value={data.personal?.contact?.linkedin || ''}
                    onChange={handleContactChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">GitHub Profile URL</label>
                  <input
                    type="text"
                    name="github"
                    value={data.personal?.contact?.github || ''}
                    onChange={handleContactChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group admin-form-full">
                  <label className="form-label">WhatsApp Contact Link</label>
                  <input
                    type="text"
                    name="whatsapp"
                    value={data.personal?.contact?.whatsapp || ''}
                    onChange={handleContactChange}
                    className="form-input"
                  />
                </div>

                <h3 className="admin-form-full" style={{ margin: '1.5rem 0 0.5rem', color: 'var(--accent-cyan)' }}>About Me Journey</h3>
                <div className="form-group admin-form-full">
                  <label className="form-label">Introduction Paragraph</label>
                  <textarea
                    name="intro"
                    value={data.about?.intro || ''}
                    onChange={handleAboutChange}
                    className="form-textarea"
                  ></textarea>
                </div>
                <div className="form-group">
                  <label className="form-label">Degree & Education</label>
                  <input
                    type="text"
                    name="education"
                    value={data.about?.education || ''}
                    onChange={handleAboutChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Future Career Goals</label>
                  <input
                    type="text"
                    name="careerGoals"
                    value={data.about?.careerGoals || ''}
                    onChange={handleAboutChange}
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EXPERIENCE TIMELINE */}
          {activeTab === 'experience' && (
            <div>
              {!editingItem ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <h3 style={{ color: 'var(--accent-cyan)' }}>Work History</h3>
                    <button 
                      onClick={() => setEditingItem({
                        type: 'experience',
                        action: 'add',
                        values: { company: '', role: '', period: '', description: '', points: [] }
                      })} 
                      className="admin-btn-action btn-add"
                    >
                      <Plus size={16} /> Add Role
                    </button>
                  </div>

                  <div className="admin-list">
                    {(data.experience || []).map((exp, index) => (
                      <div className="admin-list-item" key={exp.id || index}>
                        <div className="admin-list-item-info">
                          <h4>{exp.role} @ {exp.company}</h4>
                          <p>{exp.period}</p>
                        </div>
                        <div className="admin-list-item-actions">
                          <button 
                            onClick={() => setEditingItem({ type: 'experience', index, values: { ...exp } })} 
                            className="btn-edit-item"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleDeleteExperience(index)} className="btn-delete-item">
                            <Trash size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveExperience} className="admin-form">
                  <h3 className="admin-form-full" style={{ color: 'var(--accent-cyan)' }}>
                    {editingItem.action === 'add' ? 'Add Work Experience' : 'Edit Work Experience'}
                  </h3>
                  <div className="form-group">
                    <label className="form-label">Company Name</label>
                    <input
                      type="text"
                      value={editingItem.values.company}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        values: { ...editingItem.values, company: e.target.value }
                      })}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Role Title</label>
                    <input
                      type="text"
                      value={editingItem.values.role}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        values: { ...editingItem.values, role: e.target.value }
                      })}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Duration Period (e.g. 2024 - Present)</label>
                    <input
                      type="text"
                      value={editingItem.values.period}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        values: { ...editingItem.values, period: e.target.value }
                      })}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group admin-form-full">
                    <label className="form-label">Brief Description Summary</label>
                    <textarea
                      value={editingItem.values.description}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        values: { ...editingItem.values, description: e.target.value }
                      })}
                      className="form-textarea"
                      required
                    ></textarea>
                  </div>
                  <div className="form-group admin-form-full">
                    <label className="form-label">Bullet Point Achievements (One per line)</label>
                    <textarea
                      value={editingItem.values.points ? editingItem.values.points.join('\n') : ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        values: { ...editingItem.values, points: e.target.value.split('\n') }
                      })}
                      placeholder="Line 1: Led process audit models&#10;Line 2: Built dynamic dashboards"
                      className="form-textarea"
                    ></textarea>
                  </div>
                  <div className="admin-form-actions">
                    <button type="button" onClick={() => setEditingItem(null)} className="btn-secondary">Cancel</button>
                    <button type="submit" className="btn-primary">Save Entry</button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: TECHNICAL SKILLS */}
          {activeTab === 'skills' && (
            <div>
              {!editingItem ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <h3 style={{ color: 'var(--accent-cyan)' }}>Skill Groups & Levels</h3>
                    <button 
                      onClick={() => setEditingItem({
                        type: 'skills',
                        action: 'add',
                        values: { category: '' }
                      })} 
                      className="admin-btn-action btn-add"
                    >
                      <Plus size={16} /> Add Category
                    </button>
                  </div>

                  <div className="admin-list" style={{ gap: '1.5rem' }}>
                    {(data.skills || []).map((cat, catIdx) => (
                      <div key={catIdx} className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.01)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-normal)', paddingBottom: '0.5rem' }}>
                          <h4 style={{ fontSize: '1.15rem', color: '#f8fafc' }}>{cat.category}</h4>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button 
                              onClick={() => handleAddSkillToCategory(catIdx)} 
                              className="btn-edit-item" 
                              style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}
                            >
                              <Plus size={12} style={{ marginRight: '3px' }} /> Add Skill
                            </button>
                            <button 
                              onClick={() => setEditingItem({ type: 'skills', index: catIdx, values: { category: cat.category } })} 
                              className="btn-edit-item"
                              style={{ padding: '0.2rem 0.5rem' }}
                            >
                              <Edit2 size={12} />
                            </button>
                            <button 
                              onClick={() => handleDeleteSkillCategory(catIdx)} 
                              className="btn-delete-item"
                              style={{ padding: '0.2rem 0.5rem' }}
                            >
                              <Trash size={12} />
                            </button>
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                          {cat.items && cat.items.map((skill, skillIdx) => (
                            <span 
                              key={skillIdx} 
                              className="tech-tag" 
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.75rem', borderRadius: '8px' }}
                            >
                              <strong>{skill.name}</strong> ({skill.level}%)
                              <button 
                                type="button" 
                                onClick={() => handleDeleteSkillFromCategory(catIdx, skillIdx)}
                                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                              >
                                &times;
                              </button>
                            </span>
                          ))}
                          {(!cat.items || cat.items.length === 0) && (
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No skills in this category yet.</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveSkillCategory} className="admin-form">
                  <h3 className="admin-form-full" style={{ color: 'var(--accent-cyan)' }}>
                    {editingItem.action === 'add' ? 'Create Skill Category' : 'Rename Skill Category'}
                  </h3>
                  <div className="form-group admin-form-full">
                    <label className="form-label">Category Name</label>
                    <input
                      type="text"
                      value={editingItem.values.category}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        values: { ...editingItem.values, category: e.target.value }
                      })}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="admin-form-actions">
                    <button type="button" onClick={() => setEditingItem(null)} className="btn-secondary">Cancel</button>
                    <button type="submit" className="btn-primary">Save Category</button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 4: PROJECTS */}
          {activeTab === 'projects' && (
            <div>
              {!editingItem ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <h3 style={{ color: 'var(--accent-cyan)' }}>Showcase Projects</h3>
                    <button 
                      onClick={() => setEditingItem({
                        type: 'projects',
                        action: 'add',
                        values: { title: '', category: '', description: '', techStack: '', githubUrl: '', demoUrl: '', imageUrl: '', achievements: '' }
                      })} 
                      className="admin-btn-action btn-add"
                    >
                      <Plus size={16} /> Add Project
                    </button>
                  </div>

                  <div className="admin-list">
                    {(data.projects || []).map((project, index) => (
                      <div className="admin-list-item" key={project.id || index}>
                        <div className="admin-list-item-info">
                          <h4>{project.title}</h4>
                          <p>{project.category}</p>
                        </div>
                        <div className="admin-list-item-actions">
                          <button 
                            onClick={() => setEditingItem({
                              type: 'projects',
                              index,
                              values: {
                                ...project,
                                techStack: Array.isArray(project.techStack) ? project.techStack.join(', ') : project.techStack,
                                achievements: Array.isArray(project.achievements) ? project.achievements.join('\n') : project.achievements
                              }
                            })} 
                            className="btn-edit-item"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleDeleteProject(index)} className="btn-delete-item">
                            <Trash size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveProject} className="admin-form">
                  <h3 className="admin-form-full" style={{ color: 'var(--accent-cyan)' }}>
                    {editingItem.action === 'add' ? 'Add Project' : 'Edit Project'}
                  </h3>
                  <div className="form-group">
                    <label className="form-label">Project Title</label>
                    <input
                      type="text"
                      value={editingItem.values.title}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        values: { ...editingItem.values, title: e.target.value }
                      })}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Project Category (e.g. Machine Learning, Web App)</label>
                    <input
                      type="text"
                      value={editingItem.values.category}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        values: { ...editingItem.values, category: e.target.value }
                      })}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group admin-form-full">
                    <label className="form-label">Short Description</label>
                    <textarea
                      value={editingItem.values.description}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        values: { ...editingItem.values, description: e.target.value }
                      })}
                      className="form-textarea"
                      required
                    ></textarea>
                  </div>
                  <div className="form-group admin-form-full">
                    <label className="form-label">Technology Stack (Comma separated)</label>
                    <input
                      type="text"
                      value={editingItem.values.techStack}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        values: { ...editingItem.values, techStack: e.target.value }
                      })}
                      placeholder="React, FastAPI, Python, MongoDB"
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">GitHub URL</label>
                    <input
                      type="text"
                      value={editingItem.values.githubUrl}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        values: { ...editingItem.values, githubUrl: e.target.value }
                      })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Demo Deployment URL</label>
                    <input
                      type="text"
                      value={editingItem.values.demoUrl}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        values: { ...editingItem.values, demoUrl: e.target.value }
                      })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group admin-form-full">
                    <label className="form-label">Cover Image URL</label>
                    <input
                      type="text"
                      value={editingItem.values.imageUrl}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        values: { ...editingItem.values, imageUrl: e.target.value }
                      })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group admin-form-full">
                    <label className="form-label">Key Achievements (One per line)</label>
                    <textarea
                      value={editingItem.values.achievements}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        values: { ...editingItem.values, achievements: e.target.value }
                      })}
                      placeholder="Line 1: Achieved 94% prediction precision&#10;Line 2: Optimized data retrieval pipeline latency"
                      className="form-textarea"
                    ></textarea>
                  </div>
                  <div className="admin-form-actions">
                    <button type="button" onClick={() => setEditingItem(null)} className="btn-secondary">Cancel</button>
                    <button type="submit" className="btn-primary">Save Project</button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 5: RESEARCH */}
          {activeTab === 'research' && (
            <div>
              {!editingItem ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <h3 style={{ color: 'var(--accent-cyan)' }}>Research Publications</h3>
                    <button 
                      onClick={() => setEditingItem({
                        type: 'research',
                        action: 'add',
                        values: { title: '', authors: '', type: 'Conference Paper', venue: '', publicationDate: '', description: '', pdfUrl: '' }
                      })} 
                      className="admin-btn-action btn-add"
                    >
                      <Plus size={16} /> Add Publication
                    </button>
                  </div>

                  <div className="admin-list">
                    {(data.research || []).map((paper, index) => (
                      <div className="admin-list-item" key={paper.id || index}>
                        <div className="admin-list-item-info">
                          <h4>{paper.title}</h4>
                          <p>{paper.type} &bull; {paper.venue}</p>
                        </div>
                        <div className="admin-list-item-actions">
                          <button 
                            onClick={() => setEditingItem({ type: 'research', index, values: { ...paper } })} 
                            className="btn-edit-item"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleDeleteResearch(index)} className="btn-delete-item">
                            <Trash size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveResearch} className="admin-form">
                  <h3 className="admin-form-full" style={{ color: 'var(--accent-cyan)' }}>
                    {editingItem.action === 'add' ? 'Add Publication' : 'Edit Publication'}
                  </h3>
                  <div className="form-group admin-form-full">
                    <label className="form-label">Paper Title</label>
                    <input
                      type="text"
                      value={editingItem.values.title}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        values: { ...editingItem.values, title: e.target.value }
                      })}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Authors List</label>
                    <input
                      type="text"
                      value={editingItem.values.authors}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        values: { ...editingItem.values, authors: e.target.value }
                      })}
                      placeholder="Jayasingha, D. D. M., et al."
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Publication Type</label>
                    <select
                      value={editingItem.values.type}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        values: { ...editingItem.values, type: e.target.value }
                      })}
                      className="form-input"
                      style={{ background: '#0b0f19' }}
                    >
                      <option value="Conference Paper">Conference Paper</option>
                      <option value="Journal Paper">Journal Paper</option>
                      <option value="Research Poster">Research Poster</option>
                      <option value="Book Chapter">Book Chapter</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Venue (Conference/Journal Name)</label>
                    <input
                      type="text"
                      value={editingItem.values.venue}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        values: { ...editingItem.values, venue: e.target.value }
                      })}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Publication Date / Year</label>
                    <input
                      type="text"
                      value={editingItem.values.publicationDate}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        values: { ...editingItem.values, publicationDate: e.target.value }
                      })}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group admin-form-full">
                    <label className="form-label">Summary / Abstract</label>
                    <textarea
                      value={editingItem.values.description}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        values: { ...editingItem.values, description: e.target.value }
                      })}
                      className="form-textarea"
                      required
                    ></textarea>
                  </div>
                  <div className="form-group admin-form-full">
                    <label className="form-label">PDF / External Link URL</label>
                    <input
                      type="text"
                      value={editingItem.values.pdfUrl}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        values: { ...editingItem.values, pdfUrl: e.target.value }
                      })}
                      className="form-input"
                    />
                  </div>
                  <div className="admin-form-actions">
                    <button type="button" onClick={() => setEditingItem(null)} className="btn-secondary">Cancel</button>
                    <button type="submit" className="btn-primary">Save Publication</button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 6: CERTIFICATIONS */}
          {activeTab === 'certifications' && (
            <div>
              {!editingItem ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <h3 style={{ color: 'var(--accent-cyan)' }}>Certifications</h3>
                    <button 
                      onClick={() => setEditingItem({
                        type: 'certifications',
                        action: 'add',
                        values: { name: '', issuer: '', year: '', previewUrl: '' }
                      })} 
                      className="admin-btn-action btn-add"
                    >
                      <Plus size={16} /> Add Cert
                    </button>
                  </div>

                  <div className="admin-list">
                    {(data.certifications || []).map((cert, index) => (
                      <div className="admin-list-item" key={cert.id || index}>
                        <div className="admin-list-item-info">
                          <h4>{cert.name}</h4>
                          <p>{cert.issuer} &bull; {cert.year}</p>
                        </div>
                        <div className="admin-list-item-actions">
                          <button 
                            onClick={() => setEditingItem({ type: 'certifications', index, values: { ...cert } })} 
                            className="btn-edit-item"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleDeleteCert(index)} className="btn-delete-item">
                            <Trash size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveCert} className="admin-form">
                  <h3 className="admin-form-full" style={{ color: 'var(--accent-cyan)' }}>
                    {editingItem.action === 'add' ? 'Add Certification' : 'Edit Certification'}
                  </h3>
                  <div className="form-group admin-form-full">
                    <label className="form-label">Certification Name</label>
                    <input
                      type="text"
                      value={editingItem.values.name}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        values: { ...editingItem.values, name: e.target.value }
                      })}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Issuer (Google, IBM, Microsoft, etc.)</label>
                    <input
                      type="text"
                      value={editingItem.values.issuer}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        values: { ...editingItem.values, issuer: e.target.value }
                      })}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Year Attained</label>
                    <input
                      type="text"
                      value={editingItem.values.year}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        values: { ...editingItem.values, year: e.target.value }
                      })}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group admin-form-full">
                    <label className="form-label">Preview Certificate Image URL</label>
                    <input
                      type="text"
                      value={editingItem.values.previewUrl}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        values: { ...editingItem.values, previewUrl: e.target.value }
                      })}
                      className="form-input"
                    />
                  </div>
                  <div className="admin-form-actions">
                    <button type="button" onClick={() => setEditingItem(null)} className="btn-secondary">Cancel</button>
                    <button type="submit" className="btn-primary">Save Certification</button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
