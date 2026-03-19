import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const defaultRow1 = [
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&h=400&q=80",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&h=400&q=80",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&h=400&q=80",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&h=400&q=80",
];

const defaultRow2 = [
  "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=600&h=400&q=80",
  "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=600&h=400&q=80",
  "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&w=600&h=400&q=80",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&h=400&q=80",
];

const defaultRow3 = [
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&h=400&q=80",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&h=400&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&h=400&q=80",
  "https://images.unsplash.com/photo-1531297172864-dba2241c2ec3?auto=format&fit=crop&w=600&h=400&q=80",
];

const GalleryRow = ({ images, direction, isLightMode }) => {
  const tripled = [...images, ...images, ...images];
  const animationClass =
    direction === "left" ? "animate-scroll-left" : "animate-scroll-right";

  return (
    <div className={`flex gap-6 ${animationClass} w-max`}>
      {tripled.map((img, idx) => (
        <div
          key={`${direction}-${idx}`}
          className={`w-72 md:w-96 h-48 md:h-64 rounded-2xl overflow-hidden border shadow-xl flex-shrink-0 group relative ${
            isLightMode
              ? "bg-gray-200 border-black/10"
              : "bg-[#0B0914] border-white/10"
          }`}
        >
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
              {direction === "left" ? "Project View" : "Interface"}
            </span>
          </div>
          <img
            src={img}
            alt="Project"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
          />
        </div>
      ))}
    </div>
  );
};

const ImageGallery = ({ isLightMode }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const snap = await getDocs(collection(db, "gallery"));
        const data = snap.docs.map(d => d.data().url);
        setImages(data);
      } catch (err) {
        console.error("Failed to load gallery images", err);
      }
    };
    fetchImages();
  }, []);

  // Use defaults if empty or not enough images to stagger
  const displaySource = images.length >= 3 ? images : [...defaultRow1, ...defaultRow2, ...defaultRow3];

  // Distribute images into 3 rows
  const row1 = displaySource.filter((_, i) => i % 3 === 0);
  const row2 = displaySource.filter((_, i) => i % 3 === 1);
  const row3 = displaySource.filter((_, i) => i % 3 === 2);

  return (
    <section
      className={`py-20 overflow-hidden relative z-10 backdrop-blur-sm border-y w-full ${
        isLightMode
          ? "bg-gray-50/40 border-black/5"
          : "bg-[#0B0914]/40 border-white/5"
      }`}
    >
      <div className="flex flex-col gap-6 max-w-[100vw] overflow-hidden">
        <div className="w-full overflow-hidden">
          <GalleryRow
            images={row1.length ? row1 : defaultRow1}
            direction="left"
            isLightMode={isLightMode}
          />
        </div>
        <div className="w-full overflow-hidden">
          <GalleryRow
            images={row2.length ? row2 : defaultRow2}
            direction="right"
            isLightMode={isLightMode}
          />
        </div>
        <div className="w-full overflow-hidden">
          <GalleryRow
            images={row3.length ? row3 : defaultRow3}
            direction="left"
            isLightMode={isLightMode}
          />
        </div>
      </div>
    </section>
  );
};

export default ImageGallery;
