import { useState } from "react";
import { X, Linkedin, Mail, Loader2, CheckCircle2 } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase"; // Assuming firebase.js is in src/

const Contact = ({ isOpen, onClose, isLightMode, onFormSubmit }) => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await addDoc(collection(db, "messages"), {
        ...formData,
        timestamp: serverTimestamp(),
      });
      
      setIsSuccess(true);
      
      // Allow user to see success state briefly
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({ name: "", email: "", message: "" });
        onClose();
        if (onFormSubmit) {
          onFormSubmit();
        }
      }, 2000);
      
    } catch (err) {
      console.error("Error submitting contact form: ", err);
      setError("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className={`fixed inset-0 backdrop-blur-md transition-opacity ${
          isLightMode ? "bg-white/10" : "bg-[#0B0914]/10"
        }`}
        onClick={onClose}
      />
      
      {/* Outer Wrapper for Animated Glowing Border */}
      <div className="relative w-full max-w-lg tw-fade-in tw-slide-up group mx-4">
        
        {/* Thick Smooth Glowing Dynamic Edge */}
        <div className={`absolute -inset-1 rounded-[2.5rem] blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse ${
          isLightMode
            ? "bg-gradient-to-r from-orange-400 via-red-500 to-amber-500"
            : "bg-gradient-to-r from-cyan-400 via-sky-500 to-emerald-400"
        }`} />
        
        {/* Actual Form Container */}
        <div
          className={`relative rounded-3xl p-6 md:p-8 border-2 shadow-2xl ${
            isLightMode
              ? "bg-white border-orange-500/50 backdrop-blur-xl"
              : "bg-[#0B0914] border-cyan-400/50 backdrop-blur-xl"
          }`}
        >
          <button
            onClick={onClose}
            className={`absolute top-6 right-6 p-2 rounded-full transition-colors ${
              isLightMode
                ? "hover:bg-gray-200 text-gray-500"
                : "hover:bg-white/10 text-white/50"
            }`}
          >
            <X size={20} />
          </button>
          
          <h3
            className={`text-3xl font-black mb-2 tracking-tight ${
              isLightMode ? "text-gray-900" : "text-white"
            }`}
          >
            Project Inquiries
          </h3>
          <p
            className={`mb-6 font-light ${
              isLightMode ? "text-gray-600" : "text-gray-400"
            }`}
          >
            Fill out the form below to request feedback or propose a project.
          </p>
          
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4 animate-fade-in">
              <CheckCircle2 size={64} className={isLightMode ? "text-orange-500" : "text-cyan-400"} />
              <p className={`text-xl font-bold ${isLightMode ? "text-gray-800" : "text-white"}`}>
                Message Sent Successfully!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm">
                  {error}
                </div>
              )}
              
              <div>
                <label
                  className={`block text-xs font-bold tracking-widest uppercase mb-2 ${
                    isLightMode ? "text-gray-500" : "text-white/50"
                  }`}
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all ${
                    isLightMode
                      ? "bg-gray-50 border-black/10 text-gray-900 focus:bg-white"
                      : "bg-black/30 border-white/10 text-white focus:bg-black/50"
                  }`}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label
                  className={`block text-xs font-bold tracking-widest uppercase mb-2 ${
                    isLightMode ? "text-gray-500" : "text-white/50"
                  }`}
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all ${
                    isLightMode
                      ? "bg-gray-50 border-black/10 text-gray-900 focus:bg-white"
                      : "bg-black/30 border-white/10 text-white focus:bg-black/50"
                  }`}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label
                  className={`block text-xs font-bold tracking-widest uppercase mb-2 ${
                    isLightMode ? "text-gray-500" : "text-white/50"
                  }`}
                >
                  Message / Request
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  rows={3}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all resize-none ${
                    isLightMode
                      ? "bg-gray-50 border-black/10 text-gray-900 focus:bg-white"
                      : "bg-black/30 border-white/10 text-white focus:bg-black/50"
                  }`}
                  placeholder="How can we collaborate?"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-8 py-4 rounded-xl font-black text-sm tracking-[0.2em] uppercase transition-all hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-3 mt-4 disabled:opacity-70 disabled:hover:translate-y-0 ${
                  isLightMode 
                    ? "bg-gradient-to-r from-orange-400 to-amber-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.5)] hover:shadow-[0_0_40px_rgba(249,115,22,0.9)] border-none" 
                    : "bg-gradient-to-r from-cyan-400 to-emerald-400 text-black shadow-[0_0_20px_rgba(34,211,238,0.5)] hover:shadow-[0_0_40px_rgba(34,211,238,0.9)] border-none"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Submit Request"
                )}
              </button>
            </form>
          )}

          {/* Social Links Row */}
          {!isSuccess && (
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10">
              <h4 className={`text-center text-[10px] font-black tracking-widest uppercase mb-4 ${isLightMode ? 'text-gray-400' : 'text-white/30'}`}>Or Connect Directly</h4>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="https://linkedin.com/in/arumugam-abilashan-6916a2157"
                  target="_blank"
                  rel="noreferrer"
                  className={`flex-1 flex w-full justify-center items-center gap-3 px-6 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all hover:-translate-y-1 shadow-md ${
                    isLightMode
                      ? "bg-[#0A66C2] text-white hover:shadow-[0_0_20px_rgba(10,102,194,0.4)]"
                      : "bg-[#0A66C2] text-white hover:shadow-[0_0_20px_rgba(10,102,194,0.6)]"
                  }`}
                >
                  <Linkedin size={18} /> LinkedIn
                </a>
                <a
                  href="mailto:abilash0asp@gmail.com"
                  className={`flex-1 flex w-full justify-center items-center gap-3 px-6 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all hover:-translate-y-1 shadow-md ${
                    isLightMode
                      ? "bg-orange-500 text-white hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]"
                      : "bg-cyan-500 text-black hover:shadow-[0_0_20px_rgba(34,211,238,0.5)]"
                  }`}
                >
                  <Mail size={18} /> Direct Mail
                </a>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default Contact;
