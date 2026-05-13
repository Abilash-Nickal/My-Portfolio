import React, { useEffect, useState } from 'react';
import { X, Calendar, Award, ExternalLink, ShieldCheck, Diamond } from 'lucide-react';

const CertificateDetailOverlay = ({ certificate, onClose, isLightMode }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (certificate) {
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      document.body.style.overflow = '';
      setIsVisible(false);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [certificate]);

  if (!certificate) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div 
        className={`absolute inset-0 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'} ${isLightMode ? 'bg-white/80 backdrop-blur-md' : 'bg-black/80 backdrop-blur-md'}`}
        onClick={onClose}
      />
      <div className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl transition-all duration-500 transform ${isVisible ? 'translate-y-0 scale-100' : 'translate-y-8 scale-95'} ${isLightMode ? 'bg-white border border-gray-200' : 'bg-gray-900 border border-gray-800'}`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-colors ${isLightMode ? 'bg-gray-100 hover:bg-gray-200 text-gray-900' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6 sm:p-10">
          <div className="mb-8 border-b pb-8 border-gray-200 dark:border-gray-800">
            <h2 className={`text-3xl sm:text-4xl font-black mb-4 ${isLightMode ? 'text-gray-900' : 'text-white'}`}>
              {certificate.title}
            </h2>
            
            <div className="flex flex-col gap-3 mt-4">
              <div className={`flex items-center gap-2 text-lg font-medium ${isLightMode ? 'text-gray-800' : 'text-gray-200'}`}>
                <Award className="w-5 h-5 text-orange-500 dark:text-cyan-500" />
                {certificate.issuer}
              </div>
              
              {certificate.date && (
                <div className={`flex items-center gap-2 text-md ${isLightMode ? 'text-gray-600' : 'text-gray-400'}`}>
                  <Calendar className="w-4 h-4" />
                  Issued {certificate.date}
                </div>
              )}
              
              {certificate.credentialId && (
                <div className={`flex items-center gap-2 text-md ${isLightMode ? 'text-gray-600' : 'text-gray-400'}`}>
                  <ShieldCheck className="w-4 h-4" />
                  Credential ID {certificate.credentialId}
                </div>
              )}
            </div>
            
            {certificate.link && (
              <div className="mt-6">
                <a
                  href={certificate.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-bold transition-all border ${isLightMode ? 'border-gray-300 text-gray-700 hover:bg-gray-100' : 'border-gray-700 text-gray-300 hover:bg-gray-800'}`}
                >
                  Show credential <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>
          
          {certificate.skills && (
            <div className="mb-8">
              <div className={`flex items-center gap-2 font-bold text-lg mb-4 ${isLightMode ? 'text-gray-900' : 'text-white'}`}>
                <Diamond className="w-5 h-5" />
                Skills
              </div>
              <p className={`text-md ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                {certificate.skills}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {certificate.imageUrl && (
              <div className={`w-full rounded-2xl overflow-hidden border p-2 flex items-center justify-center ${isLightMode ? 'border-gray-200 bg-gray-50' : 'border-gray-800 bg-gray-950'}`}>
                <img src={certificate.imageUrl} alt="Certificate Document" className="max-w-full max-h-[40vh] object-contain rounded-xl" />
              </div>
            )}
            
            {certificate.badgeUrl && (
              <div className={`w-full rounded-2xl overflow-hidden border p-2 flex items-center justify-center ${isLightMode ? 'border-gray-200 bg-gray-50' : 'border-gray-800 bg-gray-950'}`}>
                <img src={certificate.badgeUrl} alt="Certificate Badge" className="max-w-full max-h-[40vh] object-contain rounded-xl" />
              </div>
            )}
          </div>

          {certificate.description && (
            <div className="mb-8">
              <h3 className={`text-xl font-bold mb-4 ${isLightMode ? 'text-gray-900' : 'text-white'}`}>About Certification</h3>
              <p className={`leading-relaxed ${isLightMode ? 'text-gray-600' : 'text-gray-400'}`}>
                {certificate.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificateDetailOverlay;
