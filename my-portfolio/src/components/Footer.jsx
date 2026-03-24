import { Link } from "react-router-dom";
import { Github, Linkedin, Mail } from "lucide-react";

const Footer = ({ isLightMode }) => {
  return (
    <footer
      className={`relative py-4 md:py-6 border-t text-center z-20 overflow-hidden transition-all duration-500 ${isLightMode
        ? "bg-gray-50 border-orange-500/20 shadow-[0_-10px_40px_-10px_rgba(249,115,22,0.15)]"
        : "bg-[#06050A] border-cyan-500/20 shadow-[0_-10px_40px_-10px_rgba(34,211,238,0.1)]"
        }`}
    >
      {/* Neon Aura Backgrounds */}
      <div
        className={`absolute -bottom-1/2 left-0 w-[60%] h-[100px] blur-[80px] pointer-events-none rounded-full ${isLightMode
          ? "bg-orange-500/30 mix-blend-multiply"
          : "bg-cyan-500/20 mix-blend-screen"
          }`}
      />
      <div
        className={`absolute -bottom-1/2 right-0 w-[60%] h-[100px] blur-[80px] pointer-events-none rounded-full ${isLightMode
          ? "bg-red-500/30 mix-blend-multiply"
          : "bg-blue-600/30 mix-blend-screen"
          }`}
      />

      {/* Glowing Neon Text */}
      <p
        className={`font-black text-xl md:text-2xl tracking-[0.2em] leading-none select-none relative z-10 transition-all duration-500 ${isLightMode
          ? "text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.6)]"
          : "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]"
          }`}
      >
        ARUMUGAM ABILASHAN
      </p>

      {/* Updated Footer Row: Admin (Left) | Copyright (Center) | Socials (Right) */}
      <div className="max-w-[var(--content-max-width)] mx-auto px-6 sm:px-8 lg:px-12 mt-6 relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <Link
          to="/admin"
          className={`font-mono text-[9px] tracking-widest uppercase transition-colors flex-shrink-0 order-3 md:order-1 ${isLightMode ? "text-gray-300 hover:text-orange-400" : "text-white/10 hover:text-white/30"
            }`}
        >
          ⚙ Admin Panel
        </Link>

        <p
          className={`font-mono text-[10px] tracking-widest relative z-10 order-1 md:order-2 ${isLightMode ? "text-gray-500" : "text-white/50"
            }`}
        >
          &copy; {new Date().getFullYear()} ALL RIGHTS RESERVED
        </p>

        <div className="flex items-center gap-6 order-2 md:order-3">
          <a
            href="https://github.com/Abilash-Nickal"
            target="_blank"
            rel="noreferrer"
            className={`transition-colors ${isLightMode ? "text-gray-400 hover:text-orange-500" : "text-white/20 hover:text-cyan-400"}`}
          >
            <Github size={18} />
          </a>
          <a
            href="https://linkedin.com/in/arumugam-abilashan-6916a2157"
            target="_blank"
            rel="noreferrer"
            className={`transition-colors ${isLightMode ? "text-gray-400 hover:text-orange-500" : "text-white/20 hover:text-cyan-400"}`}
          >
            <Linkedin size={18} />
          </a>
          <a
            href="mailto:abilash0asp@gmail.com"
            className={`transition-colors ${isLightMode ? "text-gray-400 hover:text-orange-500" : "text-white/20 hover:text-cyan-400"}`}
          >
            <Mail size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;