import React from 'react';

const ProjectShortcuts = ({ shortcuts, isLightMode, onSelectProject }) => {
  if (!shortcuts || shortcuts.length === 0) return null;

  // Group shortcuts into columns of 6
  const columns = shortcuts.reduce((acc, shortcut, index) => {
    const columnIndex = Math.floor(index / 6);
    if (!acc[columnIndex]) acc[columnIndex] = [];
    acc[columnIndex].push(shortcut);
    return acc;
  }, []);

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[100] hidden lg:flex gap-3 pointer-events-none">
      {columns.map((column, colIdx) => (
        <div key={colIdx} className="flex flex-col gap-3 pointer-events-auto">
          {column.map((shortcut) => (
            <a
              key={shortcut.id}
              href={shortcut.url}
              target="_blank"
              rel="noopener noreferrer"
              title={shortcut.title}
              onClick={(e) => {
                if (shortcut.projectId) {
                  e.preventDefault();
                  onSelectProject(shortcut.projectId);
                }
              }}
              className={`w-15 h-15 rounded-xl border flex items-center justify-center transition-all duration-300 group hover:-translate-x-1 hover:scale-110 active:scale-95 ${isLightMode
                ? "bg-white/80 border-black/5 hover:border-orange-500/50 hover:shadow-[0_0_20px_rgba(249,115,22,0.2)] shadow-sm"
                : "bg-[#0f0c18]/80 border-white/5 backdrop-blur-md hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] shadow-xl"
                }`}
            >
              <div className="w-10 h-10 flex items-center justify-center overflow-hidden">
                {shortcut.logoUrl ? (
                  <img
                    src={shortcut.logoUrl}
                    alt={shortcut.title}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <span className={`text-[10px] font-black uppercase tracking-tighter ${isLightMode ? 'text-gray-400' : 'text-white/20'}`}>
                    {shortcut.title.substring(0, 2)}
                  </span>
                )}
              </div>
            </a>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ProjectShortcuts;
