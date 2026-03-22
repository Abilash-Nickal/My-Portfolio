import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuthState } from "../hooks/useAuthState";
import AdminProjects from "./sections/AdminProjects";
import AdminExperience from "./sections/AdminExperience";
import AdminEducation from "./sections/AdminEducation";
import AdminMessages from "./sections/AdminMessages";
import AdminGallery from "./sections/AdminGallery";
import AdminAbout from "./sections/AdminAbout";
import AdminSkills from "./sections/AdminSkills";
import AdminShortcuts from "./sections/AdminShortcuts";
import { FolderKanban, Briefcase, GraduationCap, MessageSquare, Image as ImageIcon, LogOut, ChevronRight, UserCircle, Zap } from "lucide-react";

const tabs = [
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "skills", label: "Skills", icon: Zap },
  { id: "about", label: "Profile", icon: UserCircle },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "gallery", label: "Gallery", icon: ImageIcon },
  { id: "shortcuts", label: "Shortcuts", icon: Zap },
  { id: "messages", label: "Messages", icon: MessageSquare },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("projects");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAuthState();

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "projects": return <AdminProjects />;
      case "skills": return <AdminSkills />;
      case "about": return <AdminAbout />;
      case "experience": return <AdminExperience />;
      case "education": return <AdminEducation />;
      case "gallery": return <AdminGallery />;
      case "shortcuts": return <AdminShortcuts />;
      case "messages": return <AdminMessages />;
      default: return null;
    }
  };

  const ActiveIcon = tabs.find(t => t.id === activeTab)?.icon;

  return (
    <div className="min-h-screen bg-[#0B0914] flex font-sans">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-20"} transition-all duration-300 bg-[#0f0c18] border-r border-white/5 flex flex-col`}>
        {/* Logo */}
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-emerald-400 rounded-xl flex items-center justify-center font-black text-black text-sm flex-shrink-0">
            A
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="text-white font-black text-sm leading-tight">Admin Panel</p>
              <p className="text-white/30 text-[10px] truncate">{user?.email}</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isActive
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-400/20"
                    : "text-white/40 hover:text-white/80 hover:bg-white/5"
                }`}
              >
                <Icon size={18} className="flex-shrink-0" />
                {sidebarOpen && <span className="font-bold text-sm">{tab.label}</span>}
                {sidebarOpen && isActive && <ChevronRight size={14} className="ml-auto" />}
              </button>
            );
          })}
        </nav>

        {/* Sign Out */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={18} className="flex-shrink-0" />
            {sidebarOpen && <span className="font-bold text-sm">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 border-b border-white/5 flex items-center px-6 gap-4 bg-[#0f0c18]/50 backdrop-blur-sm">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white/30 hover:text-white/60 transition-colors p-1"
          >
            <div className="space-y-1.5">
              <div className="w-5 h-0.5 bg-current" />
              <div className="w-5 h-0.5 bg-current" />
              <div className="w-5 h-0.5 bg-current" />
            </div>
          </button>
          <div className="flex items-center gap-2">
            {ActiveIcon && <ActiveIcon size={16} className="text-cyan-400" />}
            <h1 className="text-white font-black text-lg capitalize">{activeTab}</h1>
          </div>
          <a
            href="/"
            target="_blank"
            className="ml-auto text-xs text-white/30 hover:text-white/60 font-bold tracking-widest uppercase transition-colors border border-white/10 hover:border-white/30 px-3 py-1.5 rounded-lg"
          >
            View Portfolio ↗
          </a>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
