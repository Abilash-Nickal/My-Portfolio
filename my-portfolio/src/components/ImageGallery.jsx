import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";

import { Play, X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

const GalleryRow = ({ images, direction, isLightMode, onImageClick }) => {
  // Double the images and use -50% translation for a perfect seamless infinite loop
  const doubled = [...images, ...images];
  const animationClass =
    direction === "left" ? "gallery-scroll-left" : "gallery-scroll-right";

  return (
    <div className={`flex ${animationClass} w-max hover:pause-on-hover`}>
      {doubled.map((img, idx) => (
        <div key={`${direction}-${idx}`} className="px-3">
          <div
            onClick={() => onImageClick(img)}
            className={`w-72 md:w-96 h-48 md:h-64 rounded-2xl overflow-hidden border shadow-xl flex-shrink-0 group relative cursor-pointer ${
              isLightMode
                ? "bg-gray-200 border-black/10"
                : "bg-[#0B0914] border-white/10"
            }`}
          >
            {img.videoUrl ? (
              <a 
                href={img.videoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="absolute inset-0 z-20 cursor-pointer"
                title="Watch Video"
              >
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md p-2 rounded-full border border-white/20 text-white group-hover:bg-cyan-500 group-hover:text-black transition-all">
                  <Play size={16} fill="currentColor" />
                </div>
              </a>
            ) : null}

            <div
              className={`absolute inset-0 bg-gradient-to-t z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6 ${
                isLightMode
                  ? "from-white/90 to-transparent"
                  : "from-[#0B0914]/90 to-transparent"
              }`}
            >
              <span
                className={`font-bold tracking-widest uppercase text-xs ${
                  isLightMode ? "text-gray-900" : "text-white"
                }`}
              >
                {img.tag || (direction === "left" ? "Project View" : "Interface")}
              </span>
            </div>
            <img
              src={img.url}
              alt="Gallery Item"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
              loading="lazy"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const ImageGallery = ({ isLightMode }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const fetchImages = async () => {
    setLoading(true);
    let allImages = [];

    // 1. Fetch from Firestore
    try {
      const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const firestoreImages = snap.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));
      allImages = [...firestoreImages];
    } catch (err) {
      console.error("Failed to load Firestore images", err);
    }

    // 2. Fetch from GitHub via JSDelivr (Bulletproof Architecture)
    try {
      const REPO_OWNER = "Abilash-Nickal";
      const REPO_NAME = "My-Portfolio";
      const FOLDER_PATH = "my-portfolio/src/assets/gallery"; 
      
      // 2a. Fetch gallery manifest instead of listing directory via GitHub API
      const response = await fetch(`https://cdn.jsdelivr.net/gh/${REPO_OWNER}/${REPO_NAME}/gallery-manifest.json`);
      if (response.ok) {
        const filenames = await response.json();
        const gitHubImages = filenames.map(name => ({
          url: `https://cdn.jsdelivr.net/gh/${REPO_OWNER}/${REPO_NAME}/${FOLDER_PATH}/${name}`,
          tag: null,
          videoUrl: null
        }));
        
        // Combine with firestore images, avoiding duplicates by URL
        const existingUrls = new Set(allImages.map(img => img.url));
        const uniqueGitHubImages = gitHubImages.filter(img => !existingUrls.has(img.url));
        allImages = [...allImages, ...uniqueGitHubImages];
      }
    } catch (err) {
      console.error("Failed to load GitHub gallery images via JSDelivr", err);
      
      // Optional: Legacy GitHub API Fallback (could be removed for 100% bulletproof)
      console.log("Attempting legacy GitHub API fallback...");
      try {
        const REPO_OWNER = "Abilash-Nickal";
        const REPO_NAME = "My-Portfolio";
        const FOLDER_PATH = "my-portfolio/src/assets/gallery";
        const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FOLDER_PATH}`);
        if (response.ok) {
          const data = await response.json();
          const gitHubImages = data
            .filter(file => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.name))
            .map(file => ({
              url: file.download_url,
              tag: null,
              videoUrl: null
            }));
          const existingUrls = new Set(allImages.map(img => img.url));
          const uniqueGitHubImages = gitHubImages.filter(img => !existingUrls.has(img.url));
          allImages = [...allImages, ...uniqueGitHubImages];
        }
      } catch (fallbackErr) {
        console.error("Fallback failed too", fallbackErr);
      }
    }

    // 3. Shuffle images for random order
    const shuffled = [...allImages].sort(() => Math.random() - 0.5);

    setImages(shuffled);
    setLoading(false);
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e) => {
    e?.stopPropagation();
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  if (loading && images.length === 0) return null;
  if (images.length === 0) return null;

  // Distribute images into 3 rows
  const row1 = images.filter((_, i) => i % 3 === 0);
  const row2 = images.filter((_, i) => i % 3 === 1);
  const row3 = images.filter((_, i) => i % 3 === 2);

  // If we don't have enough images for multiple rows, just show one or duplicate locally for the effect
  const finalRow1 = row1.length > 0 ? row1 : images;
  const finalRow2 = row2.length > 0 ? row2 : (row1.length > 0 ? row1 : images);
  const finalRow3 = row3.length > 0 ? row3 : (row1.length > 0 ? row1 : images);

  return (
    <section
      className={`py-20 overflow-hidden relative z-10 backdrop-blur-sm border-y w-full ${
        isLightMode
          ? "bg-gray-50/40 border-black/5"
          : "bg-[#0B0914]/40 border-white/5"
      }`}
    >
      <div className="max-w-[var(--content-max-width)] mx-auto px-6 sm:px-8 lg:px-12 mb-12 text-center md:text-left">
        <h2
          className={`text-xs font-black tracking-[0.4em] uppercase mb-4 block ${
            isLightMode ? "text-gray-400" : "text-white/30"
          }`}
        >
          Visual Showcase
        </h2>
        <h3
          className={`text-4xl md:text-5xl font-black tracking-tight ${
            isLightMode ? "text-gray-900" : "text-white"
          }`}
        >
          Project Gallery
        </h3>
      </div>

      <div className="flex flex-col gap-6 max-w-[100vw] overflow-hidden">
        <div className="w-full overflow-hidden">
          <GalleryRow
            images={finalRow1}
            direction="left"
            isLightMode={isLightMode}
            onImageClick={(img) => setSelectedImageIndex(images.indexOf(img))}
          />
        </div>
        <div className="w-full overflow-hidden">
          <GalleryRow
            images={finalRow2}
            direction="right"
            isLightMode={isLightMode}
            onImageClick={(img) => setSelectedImageIndex(images.indexOf(img))}
          />
        </div>
        <div className="w-full overflow-hidden">
          <GalleryRow
            images={finalRow3}
            direction="left"
            isLightMode={isLightMode}
            onImageClick={(img) => setSelectedImageIndex(images.indexOf(img))}
          />
        </div>
      </div>

      {/* Train Detail View Overlay */}
      {selectedImageIndex !== null && (
        <div 
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-10"
          onClick={() => setSelectedImageIndex(null)}
        >
          {/* Animated Background Blur */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-2xl overflow-hidden pointer-events-none">
            <div className="absolute inset-0 opacity-20">
               <div className="flex flex-col gap-20 py-20">
                  <div className="flex gallery-scroll-left w-max whitespace-nowrap">
                    {Array(10).fill(0).map((_, i) => (
                      <div key={i} className="w-[400px] h-[250px] mx-10 border-4 border-white/10 rounded-[3rem] bg-white/5" />
                    ))}
                  </div>
                  <div className="flex gallery-scroll-right w-max whitespace-nowrap">
                    {Array(10).fill(0).map((_, i) => (
                      <div key={i} className="w-[400px] h-[250px] mx-10 border-4 border-white/10 rounded-[3rem] bg-white/5" />
                    ))}
                  </div>
               </div>
            </div>
          </div>

          {/* Close Button */}
          <button 
            className="absolute top-6 right-6 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all border border-white/10"
            onClick={() => setSelectedImageIndex(null)}
          >
            <X size={24} />
          </button>

          {/* Left Arrow */}
          <button 
            className="absolute left-6 z-50 p-4 bg-white/5 hover:bg-white/10 rounded-full text-white backdrop-blur-md transition-all border border-white/5 hidden md:block"
            onClick={handlePrev}
          >
            <ChevronLeft size={32} />
          </button>

          {/* Right Arrow */}
          <button 
            className="absolute right-6 z-50 p-4 bg-white/5 hover:bg-white/10 rounded-full text-white backdrop-blur-md transition-all border border-white/5 hidden md:block"
            onClick={handleNext}
          >
            <ChevronRight size={32} />
          </button>

          {/* Central Image "Carriage" */}
          <div 
            className="relative z-10 w-full max-w-5xl aspect-[16/10] md:aspect-video bg-black/40 rounded-[2rem] md:rounded-[4rem] border-8 border-white/10 shadow-2xl overflow-hidden flex items-center justify-center p-4 md:p-8 group"
            onClick={(e) => e.stopPropagation()}
          >
             {/* Decorative "Train Carriage" Elements */}
             <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-white/10 to-transparent" />
             <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-black/40 to-transparent flex items-center justify-center gap-20">
                <div className="w-12 h-1 bg-white/20 rounded-full" />
                <div className="w-12 h-1 bg-white/20 rounded-full" />
                <div className="w-12 h-1 bg-white/20 rounded-full" />
             </div>

             <img 
               src={images[selectedImageIndex].url} 
               alt="Zoomed view" 
               className="max-w-full max-h-full object-contain rounded-xl md:rounded-3xl shadow-2xl transition-all duration-500"
             />

             {/* Mobile Navigation Taps */}
             <div className="absolute inset-y-0 left-0 w-1/4 z-20 md:hidden" onClick={handlePrev} />
             <div className="absolute inset-y-0 right-0 w-1/4 z-20 md:hidden" onClick={handleNext} />
             
             {/* Tag */}
             <div className="absolute top-8 left-8 bg-cyan-500 text-black px-6 py-2 rounded-full font-black text-[10px] tracking-[0.3em] uppercase">
                {images[selectedImageIndex].tag || "Visual Asset"}
             </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ImageGallery;
