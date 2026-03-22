import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import ThreeBackground from './components/ThreeBackground';
import SkillDetailOverlay from './components/SkillDetailOverlay';
import ProjectDetailOverlay from './components/ProjectDetailOverlay';
import InteractiveParticles from './components/InteractiveParticles';
import Header from './components/Header';
import MobileMenu from './components/MobileMenu';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Education from './components/Education';
import ExperienceDetailOverlay from './components/ExperienceDetailOverlay';
import EducationDetailOverlay from './components/EducationDetailOverlay';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import ProtectedRoute from './admin/ProtectedRoute';
import ProjectShortcuts from './components/ProjectShortcuts';
import { useAuthState } from './hooks/useAuthState';

function Portfolio() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSkill, setActiveSkill] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeExperience, setActiveExperience] = useState(null);
  const [activeEducation, setActiveEducation] = useState(null);
  const [isLightMode, setIsLightMode] = useState(false);
  const [formSubmitAnimState, setFormSubmitAnimState] = useState('idle');
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [allSkills, setAllSkills] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [allProjects, setAllProjects] = useState([]);
  const [allShortcuts, setAllShortcuts] = useState([]);

  // Fetch projects and skills for linking
  useEffect(() => {
    const fetchData = async () => {
      // Fetch Projects
      try {
        const projSnap = await getDocs(collection(db, 'projects'));
        const projectsData = projSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        const sortedProjects = projectsData.sort((a, b) => {
          const orderA = a.order ?? 0;
          const orderB = b.order ?? 0;
          if (orderA !== orderB) return orderA - orderB;
          const dateA = a.createdAt?.toDate?.() || new Date(0);
          const dateB = b.createdAt?.toDate?.() || new Date(0);
          return dateB - dateA;
        });
        setAllProjects(sortedProjects);
      } catch (err) { console.error("Projects fetch failed:", err); }

      // Fetch Skills
      try {
        const skillSnap = await getDocs(collection(db, 'skills'));
        setAllSkills(skillSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) { console.error("Skills fetch failed:", err); }

      // Fetch Profile
      try {
        const profSnap = await getDocs(collection(db, 'profile'));
        const mainProf = profSnap.docs.find(d => d.id === 'main')?.data();
        if (mainProf) setProfileData(mainProf);
      } catch (err) { console.error("Profile fetch failed:", err); }

      // Fetch Shortcuts
      try {
        const shortcutSnap = await getDocs(collection(db, 'shortcuts'));
        const shortcutsData = shortcutSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setAllShortcuts(shortcutsData.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
      } catch (err) { console.error("Shortcuts fetch failed:", err); }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- BROWSER HISTORY MANAGEMENT (BACK BUTTON TO CLOSE OVERLAYS) ---
  const isAnyOverlayOpen = !!(selectedProject || activeSkill || activeExperience || activeEducation || isContactOpen);

  // 1. Listen for back button (popstate)
  useEffect(() => {
    const handlePopState = () => {
      if (isAnyOverlayOpen) {
        handleCloseOverlay();
        setIsContactOpen(false);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isAnyOverlayOpen]);

  // 2. Push state when an overlay is opened
  useEffect(() => {
    if (isAnyOverlayOpen) {
      // Only push if we aren't already in an overlay state
      if (window.history.state?.type !== 'overlay') {
        window.history.pushState({ type: 'overlay' }, '');
      }
    } else {
      // If we closed an overlay manually (not via back button) and we are STILL in an overlay state,
      // we might want to go back in history to sync.
      if (window.history.state?.type === 'overlay') {
        window.history.back();
      }
    }
  }, [isAnyOverlayOpen]);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const scrollToSection = (sectionId) => {
    setMobileMenuOpen(false);
    setActiveSkill(null);
    setSelectedProject(null);
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
    }
  };

  const handleFormSubmit = () => {
    setFormSubmitAnimState('scramble');
    setTimeout(() => {
      setFormSubmitAnimState('solve');
      setTimeout(() => {
        setFormSubmitAnimState('blast');
        setTimeout(() => {
          setFormSubmitAnimState('idle');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 1500);
      }, 1000);
    }, 2500);
  };

  const handleCloseOverlay = () => {
    setActiveSkill(null);
    setSelectedProject(null);
    setActiveExperience(null);
    setActiveEducation(null);
    setFormSubmitAnimState('idle');
  };

  return (
    <div className={`min-h-screen relative overflow-x-hidden transition-colors duration-500 selection:bg-cyan-500/30 ${isLightMode ? 'light-mode' : ''}`}>
      {/* Base Background Color Layer */}
      <div className={`fixed inset-0 -z-[200] transition-colors duration-500 ${isLightMode ? 'bg-white' : 'bg-[#0B0914]'}`} />
      
      {/* Gradient Backgrounds Layer */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        {isLightMode ? (
          <>
            <div className="absolute top-[10%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-orange-500/20 blur-[150px] mix-blend-multiply"></div>
            <div className="absolute top-[20%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-amber-400/20 blur-[150px] mix-blend-multiply"></div>
          </>
        ) : (
          <>
            <div className="absolute top-[10%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-red-600/15 blur-[150px] mix-blend-screen"></div>
            <div className="absolute top-[20%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-sky-500/15 blur-[150px] mix-blend-screen"></div>
          </>
        )}
      </div>

      <ThreeBackground activeSkill={activeSkill} isLightMode={isLightMode} formSubmitAnimState={formSubmitAnimState} />
      <InteractiveParticles isLightMode={isLightMode} />

      <div className={`relative z-10 transition-opacity duration-700 ${formSubmitAnimState !== 'idle' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <Header
          scrolled={scrolled}
          activeSkill={activeSkill}
          selectedProject={selectedProject}
          isLightMode={isLightMode}
          setIsLightMode={setIsLightMode}
          mobileMenuOpen={mobileMenuOpen}
          toggleMobileMenu={toggleMobileMenu}
          scrollToSection={scrollToSection}
          onContactClick={() => setIsContactOpen(true)}
          profileImage={profileData?.imageUrl}
        />

        {mobileMenuOpen && (
          <MobileMenu
            isLightMode={isLightMode}
            scrollToSection={scrollToSection}
            onClose={() => setMobileMenuOpen(false)}
            onContactClick={() => setIsContactOpen(true)}
          />
        )}


        <SkillDetailOverlay
          skill={activeSkill}
          onClose={handleCloseOverlay}
          isLightMode={isLightMode}
          projects={allProjects}
          onSelectProject={setSelectedProject}
        />
        <ProjectDetailOverlay
          project={selectedProject}
          onClose={handleCloseOverlay}
          isLightMode={isLightMode}
          allSkills={allSkills}
          onCommentClick={() => setIsContactOpen(true)}
        />
        <ExperienceDetailOverlay
          experience={activeExperience}
          onClose={handleCloseOverlay}
          isLightMode={isLightMode}
          allSkills={allSkills}
          allProjects={allProjects}
          onSelectProject={setSelectedProject}
        />
        <EducationDetailOverlay
          education={activeEducation}
          onClose={handleCloseOverlay}
          isLightMode={isLightMode}
          allSkills={allSkills}
          allProjects={allProjects}
          onSelectProject={setSelectedProject}
        />

        <main className={`relative z-10 pt-10 transition-all duration-1000 ${(activeSkill || selectedProject || activeExperience || activeEducation) ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
          <Hero isLightMode={isLightMode} onContactClick={() => setIsContactOpen(true)} profileData={profileData} shortcuts={allShortcuts} onSelectProject={setSelectedProject} />
          <About isLightMode={isLightMode} profileData={profileData} />
          <Skills onSelectSkill={setActiveSkill} isLightMode={isLightMode} skills={allSkills} />
          <Experience isLightMode={isLightMode} onSelectExperience={setActiveExperience} />
          <Education isLightMode={isLightMode} onSelectEducation={setActiveEducation} />
          <Projects isLightMode={isLightMode} onSelectProject={setSelectedProject} projects={allProjects} />

          <section id="contact-cta" className="py-40 max-w-[var(--content-max-width)] mx-auto px-6 sm:px-8 lg:px-12 text-center relative">
            <h2 className={`text-6xl md:text-8xl font-black mb-12 tracking-tighter drop-shadow-2xl ${isLightMode ? "text-gray-900" : "text-white"}`}>
              Let&apos;s build.
            </h2>
            <button
              onClick={() => setIsContactOpen(true)}
              className={`flex items-center justify-center gap-3 px-8 md:px-12 py-4 md:py-5 mx-auto rounded-full font-black text-xs md:text-sm tracking-[0.3em] uppercase transition-all hover:-translate-y-1 hover:scale-105 active:scale-95 ${isLightMode
                ? "bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.6)] hover:shadow-[0_0_40px_rgba(249,115,22,0.9)]"
                : "bg-cyan-500 text-gray-900 shadow-[0_0_20px_rgba(34,211,238,0.6)] hover:shadow-[0_0_40px_rgba(34,211,238,0.9)]"
                }`}
            >
              Get in touch
            </button>
          </section>
        </main>

        <ProjectShortcuts shortcuts={allShortcuts} isLightMode={isLightMode} onSelectProject={setSelectedProject} />

        <Footer isLightMode={isLightMode} />
      </div>

      <Contact
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        isLightMode={isLightMode}
        onFormSubmit={handleFormSubmit}
      />
    </div>
  );
}

function AdminRoute() {
  const { user, loading } = useAuthState();
  if (loading) return null;
  if (user) return <Navigate to="/admin/dashboard" replace />;
  return <AdminLogin />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/admin/login" element={<AdminRoute />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
