import React, { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import ImageGallery from "./ImageGallery";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";

const Projects = ({ isLightMode, onSelectProject, projects = [] }) => {
  const scrollRef = useRef(null);
  const projectsData = projects;
  const [activeFilter, setActiveFilter] = useState("All");

  // Extract unique categories (supporting comma-separated)
  const categories = ["All", ...new Set(projectsData.flatMap(p =>
    p.category ? p.category.split(',').map(s => s.trim()) : []
  ))];

  const filteredProjects = activeFilter === "All"
    ? projectsData
    : projectsData.filter(p =>
      p.category?.split(',').map(s => s.trim()).includes(activeFilter)
    );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("tw-in-view");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".project-card-animate");
    elements.forEach((el) => observer.observe(el));

    return () => elements.forEach((el) => observer.unobserve(el));
  }, [filteredProjects]);

  return (
    <section id="projects" className="py-20">
      <div className="max-w-[var(--content-max-width)] mx-auto px-6 sm:px-8 lg:px-12 mb-12 text-center md:text-left">
        <h2
          className={`text-xs font-black tracking-[0.4em] uppercase mb-4 block ${isLightMode ? "text-gray-400" : "text-white/30"
            }`}
        >
          Selected Works
        </h2>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <h3
            className={`text-4xl md:text-5xl font-black tracking-tight ${isLightMode ? "text-gray-900" : "text-white"
              }`}
          >
            Recent Projects
          </h3>

          {/* Filter Bar */}
          <div className="flex flex-wrap justify-center md:justify-end gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 rounded-full font-mono text-[10px] tracking-widest uppercase transition-all duration-300 border ${activeFilter === cat
                  ? isLightMode
                    ? "bg-orange-500 border-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)]"
                    : "bg-cyan-400 border-cyan-400 text-black shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                  : isLightMode
                    ? "bg-white border-black/5 text-gray-500 hover:border-orange-500/30"
                    : "bg-white/[0.03] border-white/5 text-white/40 hover:border-cyan-400/30"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className={`text-center py-10 text-sm max-w-[var(--content-max-width)] mx-auto px-6 ${isLightMode ? "text-gray-400" : "text-white/20"}`}>
          No projects found for "{activeFilter}".
        </div>
      ) : (
        <div className="max-w-[var(--content-max-width)] mx-auto px-6 sm:px-8 lg:px-12 mb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" ref={scrollRef}>
          {filteredProjects.map((project, i) => (
            <div
              key={project.id || i}
              onClick={() => onSelectProject(project)}
              style={{ transitionDelay: `${i * 100}ms` }}
              className={`project-card-animate tw-fade-in tw-slide-up group relative border rounded-[1.5rem] p-6 transition-all shadow-xl flex flex-col h-full cursor-pointer hover:-translate-y-2 backdrop-blur-md ${isLightMode
                ? "bg-white/60 border-black/5 hover:bg-gray-50 hover:border-orange-400/30"
                : "bg-[#183c3b]/25 border-cyan-400/1 hover:bg-white/[0.08] hover:border-cyan-400/40"
                }`}
            >
              {/* Multi-Category Badges - Top Left Corner-Hug Styled (matching education style but with glow) */}
              <div className="absolute top-0 left-0 flex gap-2 z-20 w-max max-w-[95%]">
                {project.category?.split(',').map((cat, idx) => (
                  <div
                    key={idx}
                    className={`px-4 py-2 font-mono text-[12px] font-black rounded-br-2xl whitespace-nowrap transition-all duration-500 uppercase tracking-widest ${isLightMode
                      ? "bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)] group-hover:shadow-[0_0_30px_rgba(249,115,22,0.6)]"
                      : "bg-cyan-400 text-black shadow-[0_0_20px_rgba(34,211,238,0.4)] group-hover:shadow-[0_0_30px_rgba(34,211,238,0.6)]"
                      }`}
                  >
                    {cat.trim()}
                  </div>
                )).slice(0, activeFilter === "All" ? 1 : undefined)}
              </div>

              {/* Association Logo - Top Right */}
              {project.associationLogoUrl && (
                <div className="absolute top-4 right-4 z-20 w-15 h-15 rounded-lg overflow-hidden border border-white/10 bg-black/20 flex items-center justify-center backdrop-blur-sm p-1">
                  <img src={project.associationLogoUrl} alt="Associate" className="w-full h-full object-contain" />
                </div>
              )}

              {project.imageUrl || project.imageUrls?.[0] ? (
                <div className={`rounded-2xl aspect-video border overflow-hidden flex items-center justify-center relative mb-6 ${isLightMode ? "border-black/10 text-gray-400 group-hover:shadow-[0_0_30px_rgba(249,115,22,0.15)]" : "border-white/5 text-white/20 group-hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]"
                  }`}>
                  <img
                    src={project.imageUrls?.[0] || project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${isLightMode ? "bg-orange-500" : "bg-cyan-500"
                    }`} />
                </div>
              ) : (
                <div className={`rounded-2xl aspect-video border overflow-hidden flex items-center justify-center font-black relative transition-shadow mb-6 ${isLightMode ? "bg-gray-100 border-black/10 text-gray-400 group-hover:shadow-[0_0_30px_rgba(249,115,22,0.15)]" : "bg-[#05040a] border-white/5 text-white/20 group-hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]"
                  }`}>
                  <span className="relative z-10 text-sm">PREVIEW</span>
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isLightMode ? "bg-gradient-to-br from-orange-500/10 to-transparent" : "bg-gradient-to-br from-cyan-500/10 to-transparent"
                    }`} />
                </div>
              )}

              <div className="flex flex-col flex-grow">
                <h4
                  className={`text-lg md:text-xl font-black mb-6 uppercase leading-tight ${isLightMode ? "text-gray-900" : "text-white"
                    }`}
                >
                  {project.title}
                </h4>
                <p
                  className={`text-xs leading-relaxed mb-6 line-clamp-2 ${isLightMode ? "text-gray-600" : "text-gray-400"
                    }`}
                >
                  {project.desc}
                </p>
                <button
                  className={`flex items-center gap-2 font-black text-[10px] tracking-widest uppercase group-hover:gap-3 transition-all mt-auto ${isLightMode ? "text-orange-500" : "text-cyan-400"
                    }`}
                >
                  Read More <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ImageGallery isLightMode={isLightMode} />
    </section>
  );
};

export default Projects;
