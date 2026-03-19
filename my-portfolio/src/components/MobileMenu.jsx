const menuItems = [
  "Profile",
  "About",
  "Skills",
  "Experience",
  "Academic",
  "Projects",
  "Contact",
];

const MobileMenu = ({ isLightMode, scrollToSection, onClose, onContactClick }) => {
  return (
    <div
      className={`fixed inset-0 z-40 pt-32 px-10 md:hidden tw-fade-in backdrop-blur-xl ${
        isLightMode ? "bg-white/90" : "bg-[#0B0914]/90"
      }`}
    >
      {menuItems.map((item) => (
        <button
          key={item}
          onClick={() => {
            if (item.toLowerCase() === "contact") {
              onContactClick();
            } else {
              scrollToSection(item.toLowerCase());
            }
            onClose();
          }}
          className={`block w-full text-left py-4 text-2xl font-black tracking-tighter border-b ${
            isLightMode
              ? "border-black/5 text-gray-900"
              : "border-white/10 text-white"
          }`}
        >
          {item.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default MobileMenu;
