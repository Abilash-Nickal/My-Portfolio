import { Menu, X, Sun, Moon } from "lucide-react";

const navItems = ["Profile", "About", "Skills", "Experience", "Academic", "Projects"];

const Header = ({
  scrolled,
  activeSkill,
  selectedProject,
  isLightMode,
  setIsLightMode,
  mobileMenuOpen,
  toggleMobileMenu,
  scrollToSection,
  onContactClick,
  profileImage
}) => {
  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${isLightMode
        ? scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-black/5 py-4 text-gray-900"
          : "bg-gradient-to-b from-white/80 to-transparent py-6 text-gray-900"
        : scrolled
          ? "bg-[#0B0914]/80 backdrop-blur-xl border-b border-white/5 py-4 text-white"
          : "bg-gradient-to-b from-[#0B0914]/80 to-transparent py-6 text-white"
        } ${(activeSkill || selectedProject)
          ? "-translate-y-full opacity-0 pointer-events-none"
          : "translate-y-0 opacity-100"
        }`}
    >
      <nav className="max-w-[var(--content-max-width)] mx-auto px-6 sm:px-8 lg:px-12 flex justify-between items-center">
        <div
          className="cursor-pointer group flex items-center"
          onClick={() => scrollToSection("profile")}
        >
          <div className="relative">
            <div className={`absolute inset-0 rounded-full blur-[8px] opacity-40 group-hover:opacity-70 transition-opacity ${isLightMode ? "bg-orange-500" : "bg-cyan-400"
              }`} />
            <div className={`relative w-15 h-15 rounded-full border-2 overflow-hidden transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${isLightMode ? "border-orange-500/30 group-hover:border-orange-500" : "border-cyan-400/30 group-hover:border-cyan-400"
              }`}>
              <img
                src={profileImage || "/me.jpg"}
                alt="Profile"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>
          <span className={`ml-4 text-xl font-black tracking-tighter transition-all duration-500 ${isLightMode
            ? "bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent"
            : "bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent"
            }`}>
            ABILASHAN
          </span>
        </div>

        <div className="flex items-center gap-4 lg:gap-8">
          <ul className="hidden md:flex space-x-8 items-center">
            {navItems.map((item) => (
              <li key={item}>
                <button
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className={`text-xs font-black tracking-[0.2em] uppercase transition-colors relative group ${isLightMode
                    ? "text-gray-500 hover:text-gray-900"
                    : "text-white/50 hover:text-white"
                    }`}
                >
                  {item}
                  <span
                    className={`absolute -bottom-1 left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full ${isLightMode ? "bg-orange-500" : "bg-cyan-400"
                      }`}
                  />
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsLightMode(!isLightMode)}
              className={`p-2 rounded-full transition-colors flex items-center justify-center ${isLightMode
                ? "bg-gray-100 text-orange-500 hover:bg-gray-200"
                : "bg-white/10 text-cyan-400 hover:bg-white/20"
                }`}
              aria-label="Toggle Theme"
            >
              {isLightMode ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <button
              onClick={onContactClick}
              className="hidden md:block btn-outline-gradient px-8 py-2 rounded-full font-black text-xs tracking-widest uppercase transition-all hover:scale-105 shadow-lg"
            >
              Contact
            </button>

            <div className="md:hidden flex items-center">
              <button onClick={toggleMobileMenu}>
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
