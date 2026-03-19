import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { ArrowRight } from "lucide-react";

const Experience = ({ isLightMode, onSelectExperience }) => {
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const q = query(collection(db, "experience"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        setExperiences(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Firebase fetch error:", err);
      }
    };
    fetch();
  }, []);

  return (
    <section
      id="experience"
      className="py-32 max-w-[var(--content-max-width)] mx-auto px-6 sm:px-8 lg:px-12"
    >
      <div className="mb-20">
        <h2
          className={`text-xs font-black tracking-[0.4em] uppercase mb-4 block ${isLightMode ? "text-gray-400" : "text-white/30"
            }`}
        >
          History
        </h2>
        <h3
          className={`text-4xl md:text-5xl font-black tracking-tight ${isLightMode ? "text-gray-900" : "text-white"
            }`}
        >
          Experience
        </h3>
      </div>

      {experiences.length === 0 ? (
        <div className={`text-center py-10 text-sm ${isLightMode ? "text-gray-400" : "text-white/20"}`}>
          No experience added yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              onClick={() => onSelectExperience?.(exp)}
              className={`group relative p-8 rounded-[1.5rem] border transition-all duration-500 cursor-pointer backdrop-blur-md ${isLightMode
                ? "bg-white/40 border-black/5 hover:border-orange-500/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)]"
                : "bg-[#183c3b]/25  border-cyan-400/1 hover:border-cyan-400/40 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
                }`}
            >
              {exp.role && (
                <div
                  className={`absolute top-0 right-0 px-6 py-3 font-mono text-[10px] font-bold rounded-tr-[1.5rem] rounded-bl-3xl transition-colors ${isLightMode
                    ? "bg-orange-500/10 text-orange-500"
                    : "bg-emerald-500/10 text-emerald-400"
                    }`}
                >
                  {exp.role}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-6 mb-2">
                {exp.imageUrl && (
                  <div className={`w-36 h-36 rounded-[2rem] overflow-hidden flex-shrink-0 flex items-center justify-center p-6 border transition-all duration-500 ${isLightMode
                    ? "bg-white border-black/5 drop-shadow-sm"
                    : "bg-[#1a1a1e] border-white/5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.3)]"
                    }`}>
                    <img src={exp.imageUrl} alt={exp.company} className="w-full h-full object-contain" />
                  </div>
                )}
                <h4
                  className={`text-3xl sm:text-4xl font-black leading-tight flex-1 ${isLightMode ? "text-gray-900" : "text-white"
                    }`}
                >
                  {exp.company}
                </h4>
              </div>

              <div className="mt-8">
                <p
                  className={`font-mono text-[11px] uppercase tracking-[0.2em] font-bold ${isLightMode ? "text-orange-500" : "text-cyan-400"
                    }`}
                >
                  {exp.role}
                  {exp.period && (
                    <span className={`ml-2 font-normal normal-case ${isLightMode ? "text-gray-400" : "text-white/30"}`}>
                      · {exp.period}
                    </span>
                  )}
                </p>
              </div>

              <p
                className={`mt-4 font-light leading-relaxed transition-colors line-clamp-3 text-sm ${isLightMode
                  ? "text-gray-600 group-hover:text-gray-900"
                  : "text-gray-400 group-hover:text-gray-300"
                  }`}
              >
                {exp.desc}
              </p>

              <div className={`mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 ${isLightMode ? "text-orange-500" : "text-cyan-400"}`}>
                View Project Details <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Experience;