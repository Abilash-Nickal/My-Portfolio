import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ArrowRight, GraduationCap, Calendar, BookOpen } from "lucide-react";

const EducationDetailOverlay = ({ education, onClose, isLightMode, allSkills = [], allProjects = [], onSelectProject }) => {
  // Lock body scroll when open
  useEffect(() => {
    if (education) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [education]);

  if (!education) return null;

  // Filter skills that are explicitly linked or match by ID
  const relatedSkills = allSkills.filter((s) => {
    const isExplicitlyLinked = education.skills?.some(id => String(id) === String(s.id) || (s.skillId && String(id) === String(s.skillId)));
    return isExplicitlyLinked;
  });

  // Filter projects associated with this education
  const relatedProjects = allProjects.filter((p) => {
    const isExplicitlyLinked = education.projects?.some(id => String(id) === String(p.id));
    const isLegacyMatched = p.educationId === education.id || p.institution === education.institution;
    return isExplicitlyLinked || isLegacyMatched;
  });

  return createPortal(
    <div className={`relative z-[9999] ${isLightMode ? 'light-mode' : ''}`}>
      {/* Dimmer Background */}
      <div
        className={`fixed inset-0 z-[100] backdrop-blur-md tw-fade-in pointer-events-auto ${isLightMode ? "bg-white/10" : "bg-[#0B0914]/10"}`}
        onClick={onClose}
      />

      {/* Main Overlay Container - Scrollable on mobile */}
      <div className="fixed inset-0 z-[101] overflow-y-auto no-scrollbar flex flex-col md:flex-row pointer-events-none">
        
        {/* Visual Panel - Shown first on mobile, left on desktop */}
        <div className="relative w-full md:w-[45%] h-[40vh] md:h-screen flex justify-center items-center pointer-events-auto overflow-hidden tw-fade-in tw-delay-300 order-1 flex-shrink-0 bg-gradient-to-br from-transparent to-black/5">
           {education.imageUrl ? (
             <div className="relative group p-8 max-w-md w-full">
                <div className={`absolute inset-0 blur-3xl opacity-20 group-hover:opacity-30 transition-opacity ${isLightMode ? 'bg-red-500' : 'bg-emerald-400'}`} />
                <img 
                  src={education.imageUrl} 
                  alt={education.institution} 
                  className="w-full h-auto object-contain relative z-10 drop-shadow-2xl grayscale group-hover:grayscale-0 transition-all brightness-110"
                />
             </div>
           ) : (
             <GraduationCap size={120} className={isLightMode ? "text-gray-200" : "text-white/10"} />
           )}
           {/* Blend gradient */}
           <div className={`absolute inset-0 z-10 bg-gradient-to-t md:bg-gradient-to-l opacity-80 pointer-events-none ${isLightMode ? 'from-white via-transparent to-transparent' : 'from-[#0B0914] via-transparent to-transparent'}`} />
        </div>

        {/* Content Panel - Shown second on mobile, right on desktop */}
        <div
          className={`relative w-full md:w-[55%] min-h-screen md:h-screen backdrop-blur-3xl border-t md:border-t-0 md:border-l flex flex-col tw-slide-in-right pointer-events-auto order-2 ${isLightMode ? "bg-white/70 border-black/5" : "bg-[#183c3b]/25 border-cyan-400/1"}`}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className={`fixed top-8 right-8 md:top-12 md:right-12 lg:top-20 lg:right-20 z-[120] flex flex-row-reverse items-center gap-4 transition-all tracking-[0.2em] uppercase font-black text-[10px] md:text-xs group pointer-events-auto ${isLightMode ? "text-gray-500 hover:text-orange-500" : "text-white/60 hover:text-cyan-400"}`}
          >
            <span className="hidden sm:inline">Back to Overview</span>
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full border flex items-center justify-center transition-colors ${isLightMode ? "border-black/10 bg-white group-hover:border-orange-500" : "border-white/10 bg-[#0B0914] group-hover:border-cyan-400"}`}>
              <X className="w-4 h-4 md:w-5 md:h-5" />
            </div>
          </button>

          {/* FIXED HEADER SECTION */}
          <div className="flex-shrink-0 p-8 md:px-16 lg:px-24 pt-20 md:pt-24 lg:pt-32 pb-6">
            <div className="tw-fade-in tw-slide-up tw-delay-300">
              <div className="flex flex-wrap gap-4 mb-4">
                <span className={`flex items-center gap-2 font-mono tracking-widest uppercase text-[10px] md:text-xs ${isLightMode ? "text-red-500" : "text-emerald-400"}`}>
                  <GraduationCap size={14} /> {education.degree}
                </span>
                <span className={`flex items-center gap-2 font-mono tracking-widest uppercase text-[10px] md:text-xs text-gray-400`}>
                  <Calendar size={14} /> {education.year}
                </span>
              </div>
              <h2 className={`text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase leading-none ${isLightMode ? "text-gray-900" : "text-white"}`}>
                {education.institution}
              </h2>
            </div>
          </div>

          {/* SCROLLABLE BODY SECTION */}
          <div className="flex-grow overflow-y-auto no-scrollbar p-8 md:px-16 lg:px-24">
            <div className="tw-fade-in tw-slide-up tw-delay-500 max-w-xl">
              <div className="mb-12">
                <h3 className={`text-[10px] md:text-xs font-black tracking-[0.3em] uppercase mb-6 ${isLightMode ? "text-gray-400" : "text-white/30"}`}>
                  Academic Details
                </h3>
                <p className={`text-base md:text-lg leading-relaxed font-light ${isLightMode ? "text-gray-600" : "text-gray-400"}`}>
                  {education.desc}
                </p>
              </div>

              {/* Related Skills */}
              {relatedSkills.length > 0 && (
                <div className="mb-12">
                  <h3 className={`text-[10px] md:text-xs font-black tracking-[0.3em] uppercase mb-6 ${isLightMode ? "text-gray-400" : "text-white/30"}`}>
                    Core Competencies
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {relatedSkills.map((skill) => (
                      <div
                        key={skill.id}
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all ${isLightMode 
                          ? "bg-white border-black/5 hover:border-red-200" 
                          : "bg-white/[0.03] border-white/5 hover:border-emerald-400/30"}`}
                      >
                        {skill.iconUrl && <img src={skill.iconUrl} alt={skill.name} className="w-5 h-5 object-contain" />}
                        <span className={`text-xs font-bold ${isLightMode ? "text-gray-700" : "text-white/70"}`}>
                          {skill.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Projects */}
              {relatedProjects.length > 0 && (
                <div className="mb-12">
                  <h3 className={`text-[10px] md:text-xs font-black tracking-[0.3em] uppercase mb-6 ${isLightMode ? "text-gray-400" : "text-white/30"}`}>
                    Academic Projects
                  </h3>
                  <div className="space-y-3">
                    {relatedProjects.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => {
                          onClose();
                          setTimeout(() => {
                            if (onSelectProject) onSelectProject(project);
                          }, 400);
                        }}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left group transition-all ${isLightMode
                          ? "bg-white border-black/5 hover:border-red-300"
                          : "bg-white/[0.03] border-white/5 hover:border-emerald-400/30 hover:bg-white/[0.07]"
                          }`}
                      >
                        <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                          {(project.imageUrls?.[0] || project.imageUrl) ? (
                            <img
                              src={project.imageUrls?.[0] || project.imageUrl}
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-black text-gray-400">
                              {project.title?.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-black text-sm truncate ${isLightMode ? "text-gray-900" : "text-white"}`}>{project.title}</p>
                          <p className={`text-xs truncate ${isLightMode ? "text-gray-400" : "text-white/30"}`}>{project.category}</p>
                        </div>
                        <ArrowRight
                          size={16}
                          className={`flex-shrink-0 transition-transform group-hover:translate-x-1 ${isLightMode ? "text-red-400" : "text-emerald-400"}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="pb-24"></div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .tw-fade-in { animation: fade-in 0.7s ease-out forwards; opacity: 0; }
        .tw-slide-up { animation: slide-up 0.7s ease-out forwards; opacity: 0; }
        .tw-slide-in-left { animation: slide-in-left 0.7s ease-out forwards; opacity: 0; }
        .tw-delay-300 { animation-delay: 300ms; }
        .tw-delay-500 { animation-delay: 500ms; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(2rem); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-in-left { from { opacity: 0; transform: translateX(-100%); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
    </div>,
    document.body
  );
};

export default EducationDetailOverlay;
