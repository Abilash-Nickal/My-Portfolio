import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ArrowRight } from "lucide-react";

const SkillDetailOverlay = ({ skill, onClose, isLightMode, projects = [], onSelectProject }) => {
  // Lock body scroll when open
  useEffect(() => {
    if (skill) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [skill]);

  if (!skill) return null;

  // Filter projects that have this skill tagged
  const relatedProjects = projects.filter((p) => {
    if (!p.skills || !Array.isArray(p.skills)) return false;
    return p.skills.some((id) =>
      String(id) === String(skill.id) ||
      (skill.skillId && String(id) === String(skill.skillId))
    );
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
        
        {/* CSS Tumble Cube Animation Panel - Shown first on mobile, left on desktop */}
        <div className="relative w-full md:w-[45%] h-[40vh] md:h-screen flex justify-center items-center pointer-events-auto overflow-hidden tw-fade-in tw-delay-300 order-1 flex-shrink-0">
          <div className="tumble-container scale-75 md:scale-100">
            <div className="tumble-box">
              <div className="tumble-cube">
                {skill.iconUrl && (
                  <img
                    src={skill.iconUrl}
                    alt={skill.name}
                    className="w-24 h-24 object-contain"
                  />
                )}
              </div>
            </div>
          </div>
          {/* Blend gradient */}
          <div className={`absolute inset-0 z-10 bg-gradient-to-t md:bg-gradient-to-l opacity-80 pointer-events-none ${isLightMode ? 'from-white via-transparent to-transparent' : 'from-[#0B0914] via-transparent to-transparent'}`} />
        </div>

        {/* Content Panel - Shown second on mobile */}
        <div
          className={`relative w-full md:w-[55%] min-h-screen md:h-screen backdrop-blur-3xl border-t md:border-t-0 md:border-l flex flex-col tw-slide-in-right pointer-events-auto order-2 ${isLightMode ? "bg-white/70 border-black/5" : "bg-[#0B0914]/70 border-white/5"}`}
        >
          {/* Close Button - Fixed to top-right of the screen */}
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
              <span className={`font-mono tracking-widest uppercase text-[10px] md:text-xs mb-4 block ${isLightMode ? "text-orange-500" : "text-cyan-400"}`}>
                Technical Breakdown
              </span>
              <h2 className={`text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase leading-none ${isLightMode ? "text-gray-900" : "text-white"}`}>
                {skill.name}
              </h2>
            </div>
          </div>

          {/* SCROLLABLE BODY SECTION */}
          <div className="flex-grow overflow-y-auto no-scrollbar p-8 md:px-16 lg:px-24">
            <div className="tw-fade-in tw-slide-up tw-delay-500 max-w-xl">
              <div className="mb-12">
                <p className={`text-base md:text-lg leading-relaxed font-light ${isLightMode ? "text-gray-600" : "text-gray-400"}`}>
                  {skill.description || skill.sub || "A deep dive into my core technical competencies and specialized expertise in this domain."}
                </p>
              </div>

              {/* Related Projects */}
              {relatedProjects.length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center gap-4 mb-6">
                    <h3 className={`text-[10px] md:text-xs font-black tracking-[0.3em] uppercase whitespace-nowrap ${isLightMode ? "text-gray-400" : "text-white/30"}`}>
                      Related Projects
                    </h3>
                    <div className={`h-[1px] flex-grow ${isLightMode ? "bg-black/10" : "bg-white/10"}`} />
                  </div>
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
                          ? "bg-white border-black/5 hover:border-orange-300"
                          : "bg-white/[0.03] border-white/5 hover:border-cyan-400/30 hover:bg-white/[0.07]"
                          }`}
                      >
                        {(project.imageUrls?.[0] || project.imageUrl) ? (
                          <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                            <img
                              src={project.imageUrls?.[0] || project.imageUrl}
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center ${isLightMode ? "bg-gray-100" : "bg-white/5"}`}>
                            <span className={`text-xs font-black ${isLightMode ? "text-gray-400" : "text-white/20"}`}>
                              {project.title?.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className={`font-black text-sm truncate ${isLightMode ? "text-gray-900" : "text-white"}`}>{project.title}</p>
                          <p className={`text-xs truncate ${isLightMode ? "text-gray-400" : "text-white/30"}`}>{project.category}</p>
                        </div>
                        <ArrowRight
                          size={16}
                          className={`flex-shrink-0 transition-transform group-hover:translate-x-1 ${isLightMode ? "text-orange-400" : "text-cyan-400"}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Metrics */}
              <div className="mb-12">
                <div className={`flex items-center gap-4 mb-6`}>
                  <h3 className={`text-[10px] md:text-xs font-black tracking-[0.3em] uppercase whitespace-nowrap ${isLightMode ? "text-gray-400" : "text-white/30"}`}>
                    Key Skills & Metrics
                  </h3>
                  <div className={`h-[1px] flex-grow ${isLightMode ? "bg-black/10" : "bg-white/10"}`} />
                </div>

                <div className={`grid gap-3`}>
                  {(skill.metrics && skill.metrics.length > 0 ? skill.metrics : [
                    { label: "Performance Scale", value: "+85%" },
                    { label: "User Engagement", value: "2.4x" },
                    { label: "Architecture Quality", value: "Tier 1" },
                  ]).map((item, i) => (
                    <div
                      key={i}
                      className={`flex justify-between items-center p-4 rounded-xl border transition-colors group cursor-default ${isLightMode
                        ? "bg-white hover:bg-gray-100 border-black/5"
                        : "bg-white/[0.03] hover:bg-white/[0.08] border-white/5"
                        }`}
                    >
                      <span className={`font-medium transition-colors text-[10px] md:text-sm ${isLightMode ? "text-gray-600 group-hover:text-gray-900" : "text-gray-400 group-hover:text-white"}`}>
                        {item.label}
                      </span>
                      <span className={`font-black tracking-tight text-sm md:text-base ${isLightMode ? "text-orange-500" : "text-cyan-400"}`}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pb-24"></div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* Animations */
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(2rem); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-in-left { from { opacity: 0; transform: translateX(-100%); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slide-in-right { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
        
        .tw-fade-in { animation: fade-in 0.7s ease-out forwards; opacity: 0; }
        .tw-slide-up { animation: slide-up 0.7s ease-out forwards; opacity: 0; }
        .tw-slide-in-left { animation: slide-in-left 0.7s ease-out forwards; opacity: 0; }
        .tw-slide-in-right { animation: slide-in-right 0.7s ease-out forwards; opacity: 0; }
        .tw-delay-300 { animation-delay: 300ms; }
        .tw-delay-500 { animation-delay: 500ms; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>,
    document.body
  );
};

export default SkillDetailOverlay;
