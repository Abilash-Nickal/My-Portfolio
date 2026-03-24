import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const About = ({ isLightMode, profileData }) => {
  const [profile, setProfile] = useState({
    heading: "About Me",
    subtitle: "Multidisciplinary Engineer & Researcher",
    bio: `I am a builder at heart. My engineering journey started hands-on with electrical systems, which sparked a deep fascination with how complex machines operate. Today, I combine my practical background with advanced robotics, CAD design, and software development.

Currently serving as a Student Researcher at the University of Colombo and previously an Automation Engineering Intern at Hemas Consumer Brands, I thrive in environments where I can design physical systems and write the code that brings them to life.`,
    imageUrl: "/profile.jpg"
  });

  useEffect(() => {
    if (profileData) {
      setProfile(profileData);
    }
  }, [profileData]);

  return (
    <section
      id="about"
      className="py-20 max-w-[var(--content-max-width)] mx-auto px-6 sm:px-8 lg:px-12 relative z-10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="relative mx-auto lg:mx-0 max-w-md w-full">
          <div
            className={`absolute inset-0 rounded-3xl blur-2xl opacity-20 ${isLightMode
              ? "bg-gradient-to-tr from-orange-400 to-red-500"
              : "bg-gradient-to-tr from-indigo-500 to-purple-500"
              }`}
          />
          <div
            className={`relative border rounded-3xl p-2 ${isLightMode
              ? "bg-white border-black/5 shadow-[0_0_40px_rgba(0,0,0,0.1)]"
              : "bg-[#111115] border-white/10 shadow-2xl"
              }`}
          >
            <img
              src={profile.imageUrl_about || profile.imageUrl}
              alt={profile.heading}
              className="rounded-2xl w-full h-auto object-cover aspect-[4/5] grayscale hover:grayscale-0 transition-all duration-500"
            />
          </div>
        </div>

        <div>
          <h2
            className={`text-5xl md:text-6xl font-black mb-4 tracking-tight ${isLightMode ? "text-gray-900" : "text-white"
              }`}
          >
            {profile.heading}
          </h2>
          <h3
            className={`text-xl md:text-2xl font-bold mb-6 ${isLightMode ? "text-gray-600" : "text-gray-300"
              }`}
          >
            {profile.subtitle}
          </h3>
          <div
            className={`w-16 h-1 mb-8 rounded-full bg-gradient-to-r ${isLightMode
              ? "from-orange-400 to-red-500"
              : "from-sky-400 to-emerald-400"
              }`}
          />
          <p
            className={`leading-relaxed text-lg mb-8 whitespace-pre-line ${isLightMode ? "text-gray-600" : "text-gray-400"
              }`}
          >
            {profile.bio}
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
