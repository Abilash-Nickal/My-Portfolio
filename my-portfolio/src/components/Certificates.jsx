import React from 'react';

const Certificates = ({ isLightMode, certificates, onSelectCertificate }) => {
  if (!certificates || certificates.length === 0) {
    return (
      <section id="certificates" className="py-20 relative z-10 overflow-hidden">
        <div className="max-w-[var(--content-max-width)] mx-auto px-6 sm:px-8 lg:px-12 mb-12">
          <h2 className={`text-4xl md:text-5xl font-black mb-4 ${isLightMode ? "text-gray-900" : "text-white"}`}>
            Certifications
          </h2>
          <div className={`w-20 h-1.5 rounded-full ${isLightMode ? "bg-orange-500" : "bg-cyan-500"}`} />
          <p className={`mt-8 ${isLightMode ? "text-gray-600" : "text-gray-400"}`}>No certifications added yet.</p>
        </div>
      </section>
    );
  }

  // Duplicate for seamless infinite scroll
  const scrollItems = [...certificates, ...certificates, ...certificates, ...certificates];

  return (
    <section id="certificates" className="py-20 relative z-10 overflow-hidden">
      <div className="max-w-[var(--content-max-width)] mx-auto px-6 sm:px-8 lg:px-12 mb-12">
        <h2 className={`text-4xl md:text-5xl font-black mb-4 ${isLightMode ? "text-gray-900" : "text-white"}`}>
          Certifications
        </h2>
        <div className={`w-20 h-1.5 rounded-full ${isLightMode ? "bg-orange-500" : "bg-cyan-500"}`} />
      </div>

      <div className="relative flex overflow-x-hidden group">
        <div className="animate-marquee-cert flex gap-6 px-4 whitespace-nowrap group-hover:[animation-play-state:paused]">
          {scrollItems.map((cert, index) => (
            <div
              key={`${cert.id || index}-${index}`}
              onClick={() => onSelectCertificate(cert)}
              className={`flex-shrink-0 cursor-pointer w-80 p-6 rounded-2xl transition-all duration-300 transform hover:-translate-y-2 border backdrop-blur-sm ${
                isLightMode
                  ? "bg-white/70 border-gray-200 hover:shadow-[0_10px_30px_rgba(249,115,22,0.15)]"
                  : "bg-gray-800/40 border-gray-700/50 hover:border-cyan-500/50 hover:shadow-[0_10px_30px_rgba(34,211,238,0.15)]"
              }`}
            >
              <div className="relative w-full h-40 rounded-xl overflow-hidden mb-4">
                {cert.imageUrl ? (
                  <img src={cert.imageUrl} alt={cert.title} className="w-full h-full object-cover" />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center ${isLightMode ? "bg-gray-200" : "bg-gray-700"}`}>
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
              </div>
              <h3 className={`text-xl font-bold mb-2 truncate ${isLightMode ? "text-gray-900" : "text-white"}`}>
                {cert.title}
              </h3>
              <p className={`text-sm mb-4 truncate ${isLightMode ? "text-gray-600" : "text-gray-400"}`}>
                {cert.issuer}
              </p>
              <div className={`text-sm font-semibold flex justify-between items-center ${isLightMode ? "text-orange-600" : "text-cyan-400"}`}>
                <span>{cert.date || 'View Details'}</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certificates;
