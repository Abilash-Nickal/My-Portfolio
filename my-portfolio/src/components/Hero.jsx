import { Github, Linkedin, ArrowDown, Download } from "lucide-react";
import GhostTypingProfile from "./GhostTypingProfile";

const Hero = ({ isLightMode, onContactClick, profileData, shortcuts = [], onSelectProject }) => {
  return (
    <section
      id="profile"
      className="min-h-screen flex items-center pt-20 relative max-w-[var(--content-max-width)] mx-auto px-6 sm:px-8 lg:px-12"
    >
      <div className="w-full flex flex-col justify-center z-10 relative hero-content-wrapper">
        <GhostTypingProfile isLightMode={isLightMode} />

        <div className="mt-16 flex flex-col sm:flex-row items-start sm:items-center gap-8 max-w-3xl">
          <div
            className={`w-50 h-50 rounded-full flex-shrink-0 relative group p-1 z-10 ${isLightMode ? "bg-white" : "bg-[#0B0914]"
              }`}
          >
            <div
              className={`absolute inset-0 rounded-full border-2 opacity-50 animate-pulse ${isLightMode
                ? "border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.8)]"
                : "border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.8)]"
                }`}
            />
            <img
              src={profileData?.imageUrl_hero || profileData?.imageUrl || "me.jpg"}
              alt="Profile"
              className="w-full h-full object-cover rounded-full relative z-10 bg-gray-100"
            />
          </div>

          <div className="flex flex-col gap-6">
            <p
              className={`leading-relaxed text-xl font-light ${isLightMode ? "text-gray-700" : "text-gray-300"
                }`}
            >
              Hi! I&apos;m{" "}
              <strong
                className={`font-black ${isLightMode ? "text-gray-900" : "text-white"
                  }`}
              >
                {profileData?.name || "Abilashan  "}
              </strong>
              -- I design and build intelligent systems — from precision CAD modeling and industrial automation to modern web applications.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onContactClick}
                className={`flex items-center gap-3 px-8 py-2.5 rounded-full font-black text-xs tracking-widest uppercase transition-all hover:-translate-y-1 hover:scale-105 active:scale-95 flex-shrink-0 ${isLightMode
                  ? "bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.6)] hover:shadow-[0_0_35px_rgba(249,115,22,0.9)]"
                  : "bg-cyan-500 text-gray-900 shadow-[0_0_20px_rgba(34,211,238,0.6)] hover:shadow-[0_0_35px_rgba(34,211,238,0.9)]"
                  }`}
              >
                Get in touch
              </button>
              <a
                href="ABILASHAN Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 bg-transparent border px-6 py-2.5 rounded-full font-bold text-xs tracking-widest uppercase transition-all ${isLightMode
                  ? "border-black/20 hover:bg-black/5 hover:border-orange-500/50 hover:text-orange-500 hover:shadow-[0_0_15px_rgba(249,115,22,0.2)] text-gray-900"
                  : "border-white/20 hover:bg-white/5 hover:border-cyan-400/50 hover:text-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] text-white"
                  }`}
              >
                <Download size={16} /> Download CV
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 bg-transparent border px-6 py-2.5 rounded-full font-bold text-xs tracking-widest uppercase transition-all ${isLightMode
                  ? "border-black/20 hover:bg-black/5 hover:border-orange-500/50 hover:text-orange-500 hover:shadow-[0_0_15px_rgba(249,115,22,0.2)] text-gray-900"
                  : "border-white/20 hover:bg-white/5 hover:border-cyan-400/50 hover:text-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] text-white"
                  }`}
              >
                <Github size={16} /> GitHub
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 bg-transparent border px-6 py-2.5 rounded-full font-bold text-xs tracking-widest uppercase transition-all ${isLightMode
                  ? "border-black/20 hover:bg-black/5 hover:border-red-500/50 hover:text-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] text-gray-900"
                  : "border-white/20 hover:bg-white/5 hover:border-sky-400/50 hover:text-sky-400 hover:shadow-[0_0_15px_rgba(56,189,248,0.2)] text-white"
                  }`}
              >
                <Linkedin size={16} /> LinkedIn
              </a>

              {/* Shortcuts icons */}
              {shortcuts.length > 0 && (
                <div className="flex flex-wrap items-center gap-3 pl-4 border-l border-white/10 ml-2">
                  {shortcuts.map((s) => (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={s.title}
                      onClick={(e) => {
                        if (s.projectId) {
                          e.preventDefault();
                          onSelectProject(s.projectId);
                        }
                      }}
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all hover:-translate-y-1 hover:scale-110 ${isLightMode
                        ? "bg-white/50 border-black/5 hover:border-orange-500/50 hover:shadow-[0_0_15px_rgba(249,115,22,0.15)] shadow-sm"
                        : "bg-white/5 border-white/5 hover:border-cyan-400/50 hover:shadow-[0_0_15px_rgba(34,211,238,0.15)] shadow-xl"
                        }`}
                    >
                      {s.logoUrl ? (
                        <img src={s.logoUrl} alt={s.title} className="w-6 h-6 object-contain" />
                      ) : (
                        <span className={`text-[10px] font-black uppercase ${isLightMode ? 'text-gray-400' : 'text-white/20'}`}>
                          {s.title.substring(0, 2)}
                        </span>
                      )}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`absolute bottom-12 right-12 flex flex-col items-center animate-bounce hidden md:flex opacity-70 ${isLightMode ? "text-gray-400" : "text-gray-500"
          }`}
      >
        <span
          className="text-[10px] font-black tracking-[0.3em] uppercase mb-4"
          style={{ writingMode: "vertical-rl" }}
        >
          Scroll
        </span>
        <ArrowDown
          className={`w-4 h-4 ${isLightMode ? "text-orange-500" : "text-cyan-400"
            }`}
        />
      </div>
    </section>
  );
};

export default Hero;
