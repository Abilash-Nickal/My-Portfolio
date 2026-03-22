import React, { useEffect, useState, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, ExternalLink, Github, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";

// --- CUSTOM TEXT FORMATTER ---
// This turns messy string data into beautifully formatted HTML (Paragraphs, Bullets, Bold Text)
const formatDescription = (text, isLightMode) => {
  if (!text) return null;

  const lines = text.split('\n');

  return lines.map((line, index) => {
    // 1. Handle empty lines (spacing)
    if (line.trim() === '') {
      return <div key={index} className="h-4"></div>;
    }

    // 2. Check if the line is a bullet point
    const isBullet = /^[-*•]\s/.test(line.trim());
    let content = line.trim();
    if (isBullet) content = content.substring(2);

    // 3. Process **bold** text
    const parts = content.split(/(\*\*.*?\*\*)/g);
    const formattedContent = parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className={`font-bold ${isLightMode ? 'text-gray-900' : 'text-white'}`}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });

    // Render Bullet Point
    if (isBullet) {
      return (
        <div key={index} className="flex items-start mb-3 ml-2 md:ml-4">
          <span className={`mr-3 mt-2.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${isLightMode ? 'bg-orange-500' : 'bg-cyan-400'}`}></span>
          <span className="flex-1 leading-relaxed text-justify">{formattedContent}</span>
        </div>
      );
    }

    // Render normal paragraph
    return <p key={index} className="mb-5 leading-relaxed text-justify">{formattedContent}</p>;
  });
};

const ProjectDetailOverlay = ({ project, onClose, isLightMode, allSkills = [], onCommentClick }) => {
  const [mounted] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Lock the background body scroll when the modal is open
  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
      setCurrentImageIndex(0); // Reset to first image
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [project]);

  // Ensure we have an array of images to map through
  const images = useMemo(() => {
    return project?.imageUrls && project.imageUrls.length > 0
      ? project.imageUrls
      : project?.images && project.images.length > 0
        ? project.images
        : project?.imageUrl
          ? [project.imageUrl]
          : ["/placeholder-image.jpg"];
  }, [project]);

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  // Helper to extract YouTube ID and return embed URL
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11)
      ? `https://www.youtube.com/embed/${match[2]}?autoplay=0&rel=0`
      : null;
  };

  const embedUrl = useMemo(() => getYouTubeEmbedUrl(project?.youtubeUrl), [project?.youtubeUrl]);

  // --- AUTO-PLAY SLIDER LOGIC ---
  useEffect(() => {
    if (!project || isPaused || images.length <= 1) return;

    const interval = setInterval(() => {
      nextImage();
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [project, isPaused, images.length, nextImage]);

  if (!project) return null;

  return createPortal(
    <div className={`relative z-[9999] ${isLightMode ? 'light-mode' : ''}`}>
      {/* Solid Background */}
      <div
        className={`fixed inset-0 z-[100] backdrop-blur-md tw-fade-in pointer-events-auto ${isLightMode ? "bg-white/10" : "bg-[#0B0914]/10"}`}
        onClick={onClose}
      />

      {/* Main Overlay Container - Scrollable on mobile */}
      <div className="fixed inset-0 z-[101] overflow-y-auto no-scrollbar flex flex-col md:flex-row pointer-events-none">

        {/* Media Panel (Video + Slider) - Shown first on mobile */}
        <div
          className="relative w-full md:w-[45%] h-screen flex flex-col pointer-events-auto overflow-hidden tw-fade-in tw-delay-300 order-1 flex-shrink-0"
        >
          {/* YouTube Video Section (Top) */}
          {embedUrl && (
            <div className={`relative w-full ${images.length > 0 ? 'h-[45%]' : 'h-full'} border-b border-white/10`}>
              <iframe
                src={embedUrl}
                title={`${project.title} Demo`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {/* Image Slider Section (Bottom or Full) */}
          <div
            className={`relative w-full ${embedUrl ? 'flex-grow' : 'h-full'} flex justify-center items-center overflow-hidden`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className={`absolute inset-0 ${isLightMode ? 'bg-gray-100' : 'bg-[#05040a]'}`}>
              {/* Main Image Display */}
              <div className="absolute inset-0 w-full h-full">
                <img
                  key={currentImageIndex} // Forces re-render for animation
                  src={images[currentImageIndex]}
                  alt={`${project.title} screenshot ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover tw-fade-in"
                />
              </div>


              {/* Slider Controls (Only show if >1 image) */}
              {images.length > 1 && (
                <div className="absolute inset-0 z-20 flex flex-col justify-between p-4 md:p-8 pointer-events-none">
                  {/* Vertical center arrows */}
                  <div className="flex-grow flex items-center justify-between w-full px-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); prevImage(); }}
                      className={`pointer-events-auto p-2 rounded-full backdrop-blur-md border transition-all hover:scale-110 ${isLightMode ? 'bg-white/50 border-white hover:bg-white text-black' : 'bg-black/50 border-white/10 hover:bg-black text-white'
                        }`}
                    >
                      <ChevronLeft size={18} />
                    </button>

                    <button
                      onClick={(e) => { e.stopPropagation(); nextImage(); }}
                      className={`pointer-events-auto p-2 rounded-full backdrop-blur-md border transition-all hover:scale-110 ${isLightMode ? 'bg-white/50 border-white hover:bg-white text-black' : 'bg-black/50 border-white/10 hover:bg-black text-white'
                        }`}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>

                  {/* Bottom Dots Navigation */}
                  <div className="flex justify-center gap-2 pb-2 pointer-events-auto">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`h-1.5 transition-all rounded-full ${currentImageIndex === idx
                          ? `w-6 ${isLightMode ? 'bg-orange-500' : 'bg-cyan-400'}`
                          : `w-1.5 ${isLightMode ? 'bg-black/30 hover:bg-black/50' : 'bg-white/30 hover:bg-white/50'}`
                          }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Panel - Shown second on mobile */}
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
              <X className="w-4 h-4 md:w-5 md:h-5 pointer-events-none" />
            </div>
          </button>

          {/* FIXED HEADER SECTION */}
          <div className="flex-shrink-0 p-8 md:px-16 lg:px-24 pt-20 md:pt-24 lg:pt-32 pb-6">
            <div className="tw-fade-in tw-slide-up tw-delay-300">
              <span className={`font-mono tracking-widest uppercase text-[10px] md:text-xs mb-4 block ${isLightMode ? "text-orange-500" : "text-cyan-400"}`}>
                {project?.category}
              </span>
              <h2 className={`text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase leading-none ${isLightMode ? "text-gray-900" : "text-white"}`}>
                {project?.title}
              </h2>
            </div>
          </div>

          {/* SCROLLABLE BODY SECTION */}
          <div className="flex-grow overflow-y-auto no-scrollbar p-8 md:px-16 lg:px-24">
            <div className="tw-fade-in tw-slide-up tw-delay-500 flex flex-col lg:flex-row gap-12">
              {/* Main Content Column */}
              <div className="flex-grow max-w-3xl">
                <div className="mb-12">
                  {/* --- APPLIED THE FORMATTER HERE --- */}
                  <div className={`text-base md:text-lg leading-relaxed font-light ${isLightMode ? "text-gray-600" : "text-gray-300"}`}>
                    {formatDescription(project?.desc, isLightMode)}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <h3 className={`text-[10px] md:text-xs font-black tracking-[0.3em] uppercase whitespace-nowrap ${isLightMode ? "text-gray-400" : "text-white/30"}`}>
                      Tech Stack
                    </h3>
                    <div className={`h-[1px] flex-grow ${isLightMode ? "bg-black/10" : "bg-white/10"}`} />
                  </div>
                  <div className="flex flex-wrap gap-3 md:gap-4">
                    {project?.skills && project.skills.length > 0 ? (
                      project.skills.map((skillId) => {
                        const skillDoc = allSkills.find(s =>
                          String(s.id) === String(skillId) ||
                          (s.skillId && String(s.skillId) === String(skillId))
                        );
                        if (!skillDoc) return null;
                        return (
                          <div
                            key={skillId}
                            className={`flex items-center gap-3 px-4 md:px-5 py-2.5 md:py-3 rounded-xl border transition-all group cursor-default ${isLightMode ? "bg-white hover:bg-gray-100 border-black/5" : "bg-white/[0.03] hover:bg-white/[0.08] border-white/5"}`}
                          >
                            {skillDoc.iconUrl && (
                              <img
                                src={skillDoc.iconUrl}
                                alt={skillDoc.name}
                                className="w-5 h-5 md:w-6 md:h-6 object-contain transition-all"
                              />
                            )}
                            <span className={`font-black tracking-widest text-[10px] md:text-xs uppercase ${isLightMode ? "text-gray-900 group-hover:text-orange-500" : "text-white group-hover:text-cyan-400"}`}>
                              {skillDoc.name}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      project?.tech?.split(' • ').map((t, idx) => (
                        <div
                          key={idx}
                          className={`flex justify-between items-center px-4 md:px-6 py-3 md:py-4 rounded-xl border transition-colors group cursor-default ${isLightMode ? "bg-white hover:bg-gray-100 border-black/5" : "bg-white/[0.03] hover:bg-white/[0.08] border-white/5"}`}
                        >
                          <span className={`font-black tracking-widest text-[10px] md:text-xs uppercase ${isLightMode ? "text-gray-900 group-hover:text-orange-500" : "text-white group-hover:text-cyan-400"}`}>
                            {t}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar Column (Tech Icons + Action Buttons) */}
              <div className="w-full lg:w-40 flex-shrink-0 flex flex-col gap-8 pb-24 lg:pt-0 lg:sticky lg:top-0 h-fit">
                {/* Compact Tech Icons Grid (Desktop Only) */}
                <div className="hidden lg:block">
                  <div className="flex items-center gap-4 mb-4">
                    <h3 className={`text-[10px] font-black tracking-[0.3em] uppercase whitespace-nowrap ${isLightMode ? "text-gray-400" : "text-white/30"}`}>
                      Tools
                    </h3>
                    <div className={`h-[1px] flex-grow ${isLightMode ? "bg-black/10" : "bg-white/10"}`} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {project?.skills && project.skills.length > 0 &&
                      project.skills.map((skillId) => {
                        const skillDoc = allSkills.find(s =>
                          String(s.id) === String(skillId) ||
                          (s.skillId && String(s.skillId) === String(skillId))
                        );
                        if (!skillDoc) return null;
                        return (
                          <div
                            key={skillId}
                            title={skillDoc.name}
                            className={`flex items-center justify-center p-2 rounded-2xl aspect-square border transition-all hover:scale-110 ${isLightMode ? "bg-white border-black/5" : "bg-white/[0.03] border-white/5"}`}
                          >
                            {skillDoc.iconUrl && (
                              <img
                                src={skillDoc.iconUrl}
                                alt={skillDoc.name}
                                className="w-8 h-8 object-contain transition-all"
                              />
                            )}
                          </div>
                        );
                      })
                    }
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4 mb-2 lg:hidden">
                    <h3 className={`text-[10px] font-black tracking-[0.3em] uppercase whitespace-nowrap ${isLightMode ? "text-gray-400" : "text-white/30"}`}>
                      Links & Actions
                    </h3>
                    <div className={`h-[1px] flex-grow ${isLightMode ? "bg-black/10" : "bg-white/10"}`} />
                  </div>

                  <button
                    onClick={() => project?.link && window.open(project.link, "_blank")}
                    className={`w-full flex justify-center items-center gap-3 px-6 py-4 rounded-xl text-[10px] md:text-xs font-black tracking-[0.2em] uppercase transition-all hover:scale-105 pointer-events-auto ${isLightMode ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "bg-cyan-400 text-gray-900 shadow-lg shadow-cyan-400/20"}`}
                  >
                    Live Demo <ExternalLink size={16} />
                  </button>

                  <button
                    className={`w-full flex justify-center items-center gap-3 px-6 py-4 rounded-xl text-[10px] md:text-xs font-black tracking-[0.2em] uppercase border transition-all hover:scale-105 pointer-events-auto ${isLightMode ? "border-gray-200 text-gray-700 hover:bg-gray-100 bg-white" : "border-white/10 text-white hover:bg-white/5"}`}
                    onClick={() => project?.github && window.open(project.github, "_blank")}
                  >
                    Source Code <Github size={16} />
                  </button>

                  <button
                    onClick={() => { onCommentClick?.(); onClose(); }}
                    className={`w-full flex justify-center items-center gap-3 px-6 py-4 rounded-xl text-[10px] md:text-xs font-black tracking-[0.2em] uppercase border border-dashed transition-all hover:scale-105 pointer-events-auto ${isLightMode ? "border-orange-500/30 text-orange-600 hover:bg-orange-50" : "border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/5"}`}
                  >
                    Write a comment <MessageSquare size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <style>{`
          /* Standardized Tailwind Animation Fallbacks */
          @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slide-up { from { opacity: 0; transform: translateY(2rem); } to { opacity: 1; transform: translateY(0); } }
          @keyframes slide-in-right { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
          
          .tw-fade-in { animation: fade-in 0.7s ease-out forwards; opacity: 0; }
          .tw-slide-up { animation: slide-up 0.7s ease-out forwards; opacity: 0; }
          .tw-slide-in-right { animation: slide-in-right 0.7s ease-out forwards; opacity: 0; }
          .tw-delay-300 { animation-delay: 300ms; }
          .tw-delay-500 { animation-delay: 500ms; }
          
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProjectDetailOverlay;