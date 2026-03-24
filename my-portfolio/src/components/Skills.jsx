const Skills = ({ onSelectSkill, isLightMode, skills = [] }) => {
  const isLoading = !skills || skills.length === 0;

  // Split skills into three rows for the moving train effect
  const count = skills?.length || 0;
  const third = Math.ceil(count / 3);
  
  const row1Skills = skills?.slice(0, third) || [];
  const row2Skills = skills?.slice(third, 2 * third) || [];
  const row3Skills = skills?.slice(2 * third) || [];

  // Double the arrays and use -50% translation for a perfect seamless infinite loop
  const doubledRow1 = [...row1Skills, ...row1Skills];
  const doubledRow2 = [...row2Skills, ...row2Skills];
  const doubledRow3 = [...row3Skills, ...row3Skills];

  return (
    <section id="skills" className="py-20 relative overflow-hidden">
      <div className="text-center mb-12 max-w-[var(--content-max-width)] mx-auto px-6 sm:px-8 lg:px-12">
        <h2
          className={`text-xs font-black tracking-[0.4em] uppercase mb-4 block ${
            isLightMode ? "text-gray-400" : "text-white/30"
          }`}
        >
          Interactive Stack
        </h2>
        <h3
          className={`text-4xl md:text-5xl font-black tracking-tight mb-4 ${
            isLightMode ? "text-gray-900" : "text-white"
          }`}
        >
          Core Competencies
        </h3>
        <p
          className={`font-light max-w-xl mx-auto ${
            isLightMode ? "text-gray-600" : "text-gray-400"
          }`}
        >
          Select a pillar to explore specialized experience and technical
          outcomes.
        </p>
      </div>

      {/* Infinite horizontal marquee - Row 1 (Left) */}
      <div className="w-full overflow-hidden mb-6">
        <div className="flex animate-scroll-left w-max">
          {doubledRow1.map((skill, idx) => (
            <div key={`r1-${skill.id}-${idx}`} className="px-3">
              <button
                onClick={() => onSelectSkill(skill)}
                className={`border rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center gap-4 md:gap-6 transition-all duration-300 group flex-shrink-0 w-40 md:w-56 ${
                  isLightMode
                    ? "bg-white border-black/5 hover:border-orange-500/50 hover:bg-gray-50 hover:shadow-[0_0_30px_rgba(249,115,22,0.15)]"
                    : "bg-[#0f0c18] border-white/10 hover:border-cyan-500/50 hover:bg-white/[0.05] hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]"
                }`}
              >
                <img
                  src={skill.iconUrl}
                  alt={skill.name}
                  className="w-12 h-12 md:w-16 md:h-16 object-contain opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 drop-shadow-md"
                />
                <div className="text-center">
                  <h4
                    className={`font-bold text-sm md:text-md leading-tight mb-1 md:mb-2 ${
                      isLightMode ? "text-gray-900" : "text-white"
                    }`}
                  >
                    {skill.name}
                  </h4>
                  <p className="text-gray-500 text-[10px] tracking-widest uppercase">
                    {skill.sub}
                  </p>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Infinite horizontal marquee - Row 2 (Right) */}
      <div className="w-full overflow-hidden mb-6">
        <div className="flex animate-scroll-right w-max">
          {doubledRow2.map((skill, idx) => (
            <div key={`r2-${skill.id}-${idx}`} className="px-3">
              <button
                onClick={() => onSelectSkill(skill)}
                className={`border rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center gap-4 md:gap-6 transition-all duration-300 group flex-shrink-0 w-40 md:w-56 ${
                  isLightMode
                    ? "bg-white border-black/5 hover:border-orange-500/50 hover:bg-gray-50 hover:shadow-[0_0_30px_rgba(249,115,22,0.15)]"
                    : "bg-[#0f0c18] border-white/10 hover:border-cyan-500/50 hover:bg-white/[0.05] hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]"
                }`}
              >
                <img
                  src={skill.iconUrl}
                  alt={skill.name}
                  className="w-12 h-12 md:w-16 md:h-16 object-contain opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 drop-shadow-md"
                />
                <div className="text-center">
                  <h4
                    className={`font-bold text-sm md:text-md leading-tight mb-1 md:mb-2 ${
                      isLightMode ? "text-gray-900" : "text-white"
                    }`}
                  >
                    {skill.name}
                  </h4>
                  <p className="text-gray-500 text-[10px] tracking-widest uppercase">
                    {skill.sub}
                  </p>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Infinite horizontal marquee - Row 3 (Left) */}
      <div className="w-full overflow-hidden">
        <div className="flex animate-scroll-left w-max">
          {doubledRow3.map((skill, idx) => (
            <div key={`r3-${skill.id}-${idx}`} className="px-3">
              <button
                onClick={() => onSelectSkill(skill)}
                className={`border rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center gap-4 md:gap-6 transition-all duration-300 group flex-shrink-0 w-40 md:w-56 ${
                  isLightMode
                    ? "bg-white border-black/5 hover:border-orange-500/50 hover:bg-gray-50 hover:shadow-[0_0_30px_rgba(249,115,22,0.15)]"
                    : "bg-[#0f0c18] border-white/10 hover:border-cyan-500/50 hover:bg-white/[0.05] hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]"
                }`}
              >
                <img
                  src={skill.iconUrl}
                  alt={skill.name}
                  className="w-12 h-12 md:w-16 md:h-16 object-contain opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 drop-shadow-md"
                />
                <div className="text-center">
                  <h4
                    className={`font-bold text-sm md:text-md leading-tight mb-1 md:mb-2 ${
                      isLightMode ? "text-gray-900" : "text-white"
                    }`}
                  >
                    {skill.name}
                  </h4>
                  <p className="text-gray-500 text-[10px] tracking-widest uppercase">
                    {skill.sub}
                  </p>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
