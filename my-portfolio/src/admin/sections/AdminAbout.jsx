import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Save, Loader2, Image as ImageIcon } from "lucide-react";

const AdminAbout = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    heading: "",
    subtitle: "",
    bio: "",
    imageUrl: "",
    imageUrl_hero: "",
    imageUrl_about: "",
    skillsSpeed: 10,
    gallerySpeed: 15
  });

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "profile", "main");
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setForm(snap.data());
      } else {
        // Initialize with default values if it doesn't exist
        setForm({
          heading: "About Me",
          subtitle: "Passionate Engineering Technology Student",
          bio: "I am a passionate and skilled engineer pursuing a Bachelor of Engineering Technology with Honours in Instrumentation and Automation...",
          imageUrl: "/profile.jpg",
          skillsSpeed: 10,
          gallerySpeed: 15
        });
      }
    } catch (err) {
      console.error("Failed to fetch profile info:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Use setDoc to implicitly create or overwrite the "main" document
      await setDoc(doc(db, "profile", "main"), form);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white font-black text-xl">Profile Info</h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="text-cyan-400 animate-spin" size={32} /></div>
      ) : (
        <div className="bg-[#0f0c18] border border-white/10 rounded-3xl p-6 w-full max-w-2xl shadow-2xl">
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase mb-1.5 text-white/40">Section Heading</label>
              <input
                type="text"
                value={form.heading}
                onChange={(e) => setForm((f) => ({ ...f, heading: e.target.value }))}
                placeholder="About Me"
                className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold tracking-widest uppercase mb-1.5 text-white/40">Role / Tagline</label>
              <input
                type="text"
                value={form.subtitle}
                onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                placeholder="Passionate Engineering Technology Student"
                className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold tracking-widest uppercase mb-1.5 text-white/40">Header Avatar (URL)</label>
              <div className="flex items-center gap-4">
                {form.imageUrl ? (
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/10 bg-black/50 flex-shrink-0">
                    <img src={form.imageUrl.startsWith("http") ? form.imageUrl : window.location.origin + form.imageUrl} alt="Header preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-xl border border-dashed border-white/20 flex items-center justify-center bg-black/20 text-white/20 flex-shrink-0">
                    <ImageIcon size={20} />
                  </div>
                )}
                
                <input
                  type="text"
                  value={form.imageUrl}
                  onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                  placeholder="e.g. /profile.jpg"
                  className="flex-1 w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold tracking-widest uppercase mb-1.5 text-white/40">Hero Section Image (URL)</label>
              <div className="flex items-center gap-4">
                {form.imageUrl_hero ? (
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/10 bg-black/50 flex-shrink-0">
                    <img src={form.imageUrl_hero.startsWith("http") ? form.imageUrl_hero : window.location.origin + form.imageUrl_hero} alt="Hero preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-xl border border-dashed border-white/20 flex items-center justify-center bg-black/20 text-white/20 flex-shrink-0">
                    <ImageIcon size={20} />
                  </div>
                )}
                
                <input
                  type="text"
                  value={form.imageUrl_hero || ""}
                  onChange={(e) => setForm((f) => ({ ...f, imageUrl_hero: e.target.value }))}
                  placeholder="Optional unique hero image"
                  className="flex-1 w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold tracking-widest uppercase mb-1.5 text-white/40">About Section Image (URL)</label>
              <div className="flex items-center gap-4">
                {form.imageUrl_about ? (
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/10 bg-black/50 flex-shrink-0">
                    <img src={form.imageUrl_about.startsWith("http") ? form.imageUrl_about : window.location.origin + form.imageUrl_about} alt="About preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-xl border border-dashed border-white/20 flex items-center justify-center bg-black/20 text-white/20 flex-shrink-0">
                    <ImageIcon size={20} />
                  </div>
                )}
                
                <input
                  type="text"
                  value={form.imageUrl_about || ""}
                  onChange={(e) => setForm((f) => ({ ...f, imageUrl_about: e.target.value }))}
                  placeholder="Optional unique about image"
                  className="flex-1 w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold tracking-widest uppercase mb-1.5 text-white/40">Bio / Description</label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                placeholder="I am a passionate..."
                rows={8}
                className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-sm resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase mb-1.5 text-white/40">Skills Speed (s)</label>
                <input
                  type="number"
                  value={form.skillsSpeed || 10}
                  onChange={(e) => setForm((f) => ({ ...f, skillsSpeed: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-sm"
                  min="0"
                  step="1"
                />
                <p className="mt-1 text-[10px] text-white/20 italic">Lower is faster (time for one full loop)</p>
              </div>
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase mb-1.5 text-white/40">Gallery Speed (s)</label>
                <input
                  type="number"
                  value={form.gallerySpeed || 15}
                  onChange={(e) => setForm((f) => ({ ...f, gallerySpeed: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-sm"
                  min="0"
                  step="1"
                />
                <p className="mt-1 text-[10px] text-white/20 italic">Lower is faster (time for one full loop)</p>
              </div>
            </div>

            <button type="submit" disabled={saving} className="w-full py-3 bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-black text-sm uppercase tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all disabled:opacity-60 flex items-center justify-center gap-2">
              {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Profile</>}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminAbout;
