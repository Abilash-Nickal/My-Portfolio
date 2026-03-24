import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { ArrowRight } from "lucide-react";

const Education = ({ isLightMode, onSelectEducation }) => {
  const [education, setEducation] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const q = query(collection(db, "education"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        setEducation(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Firebase fetch error:", err);
      }
    };
    fetch();
  }, []);

  return (
    <section
      id="academic"
      className="py-20 max-w-[var(--content-max-width)] mx-auto px-6 sm:px-8 lg:px-12"
    >
      <div className="mb-12">
        <h2
          className={`text-xs font-black tracking-[0.4em] uppercase mb-4 block ${isLightMode ? "text-gray-400" : "text-white/30"
            }`}
        >
          Education
        </h2>
        <h3
          className={`text-4xl md:text-5xl font-black tracking-tight ${isLightMode ? "text-gray-900" : "text-white"
            }`}
        >
          Academic Journey
        </h3>
      </div>

      {education.length === 0 ? (
        <div className={`text-center py-10 text-sm ${isLightMode ? "text-gray-400" : "text-white/20"}`}>
          No education entries added yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {education.map((edu, i) => (
            <div
              key={edu.id}
              onClick={() => onSelectEducation?.(edu)}
              className={`group relative p-8 rounded-[1.5rem] border transition-all duration-500 cursor-pointer backdrop-blur-md ${isLightMode
                ? "bg-white/40 border-black/5 hover:border-orange-500/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)]"
                : "bg-[#183c3b]/25 border-cyan-400/1 hover:border-cyan-400/60 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
                }`}
            >
              {edu.year && (
                <div
                  className={`absolute top-0 right-0 px-6 py-3 font-mono text-[10px] font-bold rounded-tr-[1.5rem] rounded-bl-3xl transition-colors ${isLightMode
                    ? "bg-red-500/10 text-red-500"
                    : "bg-emerald-500/10 text-emerald-400"
                    }`}
                >
                  {edu.year}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-6 mb-2">
                {edu.imageUrl && (
                  <div className={`w-36 h-36 rounded-[2rem] overflow-hidden flex-shrink-0 flex items-center justify-center p-6 border transition-all duration-500 ${isLightMode
                    ? "bg-white border-black/5 drop-shadow-sm"
                    : "bg-[#1a1a1e] border-white/5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.3)]"
                    }`}>
                    <img src={edu.imageUrl} alt={edu.institution} className="w-full h-full object-contain" />
                  </div>
                )}
                <h4
                  className={`text-3xl sm:text-4xl font-black leading-tight flex-1 ${isLightMode ? "text-gray-900" : "text-white"
                    }`}
                >
                  {edu.degree}
                </h4>
              </div>

              <div className="mt-8">
                <p
                  className={`font-mono text-[11px] uppercase tracking-[0.2em] font-bold ${isLightMode ? "text-red-500" : "text-emerald-400"
                    }`}
                >
                  {edu.institution}
                </p>
              </div>

              <p
                className={`mt-4 font-light leading-relaxed transition-colors line-clamp-3 text-sm ${isLightMode
                  ? "text-gray-600 group-hover:text-gray-900"
                  : "text-gray-400 group-hover:text-gray-300"
                  }`}
              >
                {edu.desc}
              </p>

              <div className={`mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 ${isLightMode ? "text-red-500" : "text-emerald-400"}`}>
                View Academic Details <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Education;