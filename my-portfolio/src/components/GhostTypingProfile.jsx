import { useState, useEffect } from "react";

const phrases = [
  { top: "SOLVING", middle: "design", bottom: "PROBLEMS" },
  { top: "CRAFTING", middle: "digital", bottom: "EXPERIENCES" },
  { top: "BUILDING", middle: "web", bottom: "SOLUTIONS" },
];

const GhostTypingProfile = ({ isLightMode }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setBlink((prev) => !prev), 500);
    return () => clearTimeout(timeout);
  }, [blink]);

  useEffect(() => {
    const current = phrases[index];
    const totalLen =
      current.top.length + current.middle.length + current.bottom.length;

    if (subIndex === totalLen && !isDeleting) {
      const timeout = setTimeout(() => setIsDeleting(true), 2500);
      return () => clearTimeout(timeout);
    }
    if (subIndex === 0 && isDeleting) {
      setTimeout(() => {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % phrases.length);
      }, 0);
      return;
    }

    const timeout = setTimeout(
      () => {
        setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
      },
      isDeleting ? 40 : 120
    );

    return () => clearTimeout(timeout);
  }, [subIndex, isDeleting, index]);

  const current = phrases[index];
  const topLen = current.top.length;
  const midLen = current.middle.length;

  const dispTop = current.top.substring(0, subIndex);
  const dispMid =
    subIndex > topLen
      ? current.middle.substring(0, subIndex - topLen)
      : "";
  const dispBot =
    subIndex > topLen + midLen
      ? current.bottom.substring(0, subIndex - topLen - midLen)
      : "";

  const cursorClass = `${
    isLightMode ? "text-orange-500" : "text-cyan-400"
  } ${blink ? "opacity-100" : "opacity-0"}`;

  return (
    <h1
      className={`text-5xl sm:text-7xl lg:text-9xl font-black leading-[0.8] tracking-tighter mix-blend-difference min-h-[200px] md:min-h-[250px] ${
        isLightMode ? "text-gray-900" : "text-white"
      }`}
    >
      {dispTop}
      {subIndex <= topLen && <span className={cursorClass}>|</span>}
      <br />
      <span
        className={`font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r lowercase text-6xl sm:text-8xl lg:text-[11rem] ml-8 sm:ml-16 drop-shadow-lg ${
          isLightMode
            ? "from-orange-400 via-orange-500 to-red-500"
            : "from-sky-400 via-cyan-400 to-emerald-400"
        }`}
      >
        {dispMid}
      </span>
      {subIndex > topLen && subIndex <= topLen + midLen && (
        <span className={cursorClass}>|</span>
      )}
      <br />
      {dispBot}
      {subIndex > topLen + midLen && (
        <span className={cursorClass}>|</span>
      )}
    </h1>
  );
};

export default GhostTypingProfile;
