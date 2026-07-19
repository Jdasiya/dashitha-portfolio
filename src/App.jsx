import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Research from './components/Research';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

export default function App() {
  const [data, setData] = useState(null);
  const [currentHash, setCurrentHash] = useState('#home');
  const [loading, setLoading] = useState(true);

  // Initialize and load configurations
  useEffect(() => {
    const loadData = async () => {
      try {
        // First check LocalStorage
        const localData = localStorage.getItem('portfolio_config_data');
        if (localData) {
          setData(JSON.parse(localData));
          setLoading(false);
          return;
        }

        // Fetch defaults
        const res = await fetch('/portfolio-data.json');
        if (!res.ok) {
          throw new Error('Failed to fetch default portfolio data');
        }
        const defaultData = await res.json();
        setData(defaultData);
      } catch (err) {
        console.error('Error loading portfolio configurations:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();

    // Listen to hash changes for router
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || '#home');
    };
    window.addEventListener('hashchange', handleHashChange);
    // Trigger initial check
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update logic
  const handleUpdateData = (newData) => {
    setData(newData);
    localStorage.setItem('portfolio_config_data', JSON.stringify(newData));
  };

  // Reset logic
  const handleResetData = async () => {
    try {
      localStorage.removeItem('portfolio_config_data');
      const res = await fetch('/portfolio-data.json');
      const defaultData = await res.json();
      setData(defaultData);
    } catch (err) {
      console.error('Error resetting default configs:', err);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#030712', color: '#00f2fe', fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem', letterSpacing: '0.05em' }}>
        LOADING CONFIGURATIONS...
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#030712', color: '#ef4444', fontFamily: 'Outfit, sans-serif', fontSize: '1.2rem', textAlign: 'center' }}>
        Error loading portfolio data.<br />
        Please check public/portfolio-data.json configuration.
      </div>
    );
  }

  const isAdminView = currentHash === '#admin';

  return (
    <>
      {/* Glow Mesh Ambient Particle Spheres */}
      <div className="glow-bg">
        <div className="glow-circle glow-1"></div>
        <div className="glow-circle glow-2"></div>
      </div>

      {isAdminView ? (
        <AdminDashboard
          data={data}
          onUpdateData={handleUpdateData}
          onResetData={handleResetData}
          onClose={() => {
            window.location.hash = '#home';
          }}
        />
      ) : (
        <>
          <Navbar currentHash={currentHash} setCurrentHash={setCurrentHash} />
          <Hero personal={data.personal} />
          <About about={data.about} />
          <Experience experience={data.experience} />
          <Skills skills={data.skills} />
          <Projects projects={data.projects} />
          <Research research={data.research} />
          <Certifications certifications={data.certifications} />
          <Contact contact={data.personal?.contact} />
          <Footer name={data.personal?.name} />
        </>
      )}
    </>
  );
}
