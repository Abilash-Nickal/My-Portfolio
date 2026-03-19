import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase";
import { Plus, Pencil, Trash2, X, Save, Loader2 } from "lucide-react";

const emptyForm = { company: "", role: "", period: "", desc: "", imageUrl: "", skills: [], projects: [] };

const AdminExperience = () => {
  const [items, setItems] = useState([]);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    // Fetch experiences
    const qExp = query(collection(db, "experience"), orderBy("createdAt", "desc"));
    const snapExp = await getDocs(qExp);
    setItems(snapExp.docs.map((d) => ({ id: d.id, ...d.data() })));

    // Fetch skills
    const snapSkills = await getDocs(collection(db, "skills"));
    setSkills(snapSkills.docs.map(d => ({ id: d.id, ...d.data() })));

    // Fetch projects
    const snapProjects = await getDocs(collection(db, "projects"));
    setProjects(snapProjects.docs.map(d => ({ id: d.id, ...d.data() })));
    
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => { setForm(emptyForm); setEditingId(null); setFormOpen(true); };
  const openEdit = (item) => { 
    setForm({ 
      company: item.company, 
      role: item.role, 
      period: item.period || "", 
      desc: item.desc, 
      imageUrl: item.imageUrl || "",
      skills: item.skills || [],
      projects: item.projects || []
    }); 
    setEditingId(item.id); 
    setFormOpen(true); 
  };

  const toggleArrayItem = (key, value) => {
    setForm(prev => {
      const arr = prev[key] || [];
      const newArr = arr.includes(value) 
        ? arr.filter(v => v !== value) 
        : [...arr, value];
      return { ...prev, [key]: newArr };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, "experience", editingId), { ...form, updatedAt: serverTimestamp() });
      } else {
        await addDoc(collection(db, "experience"), { ...form, createdAt: serverTimestamp() });
      }
      await fetchData();
      setFormOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this experience entry?")) return;
    await deleteDoc(doc(db, "experience", id));
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-white/40 text-sm">{items.length} entr{items.length !== 1 ? "ies" : "y"}</p>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-black text-xs uppercase tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all">
          <Plus size={16} /> Add Experience
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="text-cyan-400 animate-spin" size={32} /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-white/20 text-sm">No experience entries yet.</div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 flex items-start justify-between gap-4 hover:border-cyan-400/20 transition-all">
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-black text-base mb-0.5">{item.company}</h3>
                <p className="text-cyan-400 text-xs font-mono uppercase tracking-widest mb-2">{item.role} {item.period && <span className="text-white/20">· {item.period}</span>}</p>
                <p className="text-white/40 text-sm line-clamp-2">{item.desc}</p>
                {(item.skills?.length > 0 || item.projects?.length > 0) && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.skills?.length > 0 && <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-400/20">{item.skills.length} Skills</span>}
                    {item.projects?.length > 0 && <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-400/20">{item.projects.length} Projects</span>}
                  </div>
                )}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => openEdit(item)} className="p-2 rounded-lg text-white/40 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all"><Pencil size={15} /></button>
                <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0f0c18] border border-white/10 rounded-3xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-black text-xl">{editingId ? "Edit Experience" : "Add Experience"}</h2>
              <button onClick={() => setFormOpen(false)} className="text-white/40 hover:text-white transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: "company", label: "Company", placeholder: "Company Name" },
                  { key: "role", label: "Role", placeholder: "Software Engineer" },
                  { key: "period", label: "Period", placeholder: "2022 – 2024" },
                  { key: "imageUrl", label: "Company Logo (URL)", placeholder: "https://imgur.com/logo.png" },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs font-bold tracking-widest uppercase mb-1.5 text-white/40">{label}</label>
                    <input
                      type="text"
                      value={form[key]}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-sm"
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase mb-1.5 text-white/40">Description</label>
                <textarea
                  value={form.desc}
                  onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))}
                  placeholder="Describe your role and achievements..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-sm resize-none"
                />
              </div>

              {/* Skills Multi-select */}
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase mb-3 text-white/40">Skills Gained</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-32 overflow-y-auto p-3 bg-white/5 rounded-xl border border-white/10 no-scrollbar">
                  {skills.map(skill => (
                    <label key={skill.id} className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={form.skills?.includes(skill.id)}
                        onChange={() => toggleArrayItem("skills", skill.id)}
                        className="hidden"
                      />
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${form.skills?.includes(skill.id) ? "bg-cyan-500 border-cyan-500" : "border-white/20 group-hover:border-cyan-500/50"}`}>
                        {form.skills?.includes(skill.id) && <Plus size={12} className="text-black rotate-45" />}
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider truncate ${form.skills?.includes(skill.id) ? "text-cyan-400" : "text-white/40 group-hover:text-white/60"}`}>{skill.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Projects Multi-select */}
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase mb-3 text-white/40">Related Projects</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-32 overflow-y-auto p-3 bg-white/5 rounded-xl border border-white/10 no-scrollbar">
                  {projects.map(project => (
                    <label key={project.id} className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={form.projects?.includes(project.id)}
                        onChange={() => toggleArrayItem("projects", project.id)}
                        className="hidden"
                      />
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${form.projects?.includes(project.id) ? "bg-emerald-500 border-emerald-500" : "border-white/20 group-hover:border-emerald-500/50"}`}>
                        {form.projects?.includes(project.id) && <Plus size={12} className="text-black rotate-45" />}
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider truncate ${form.projects?.includes(project.id) ? "text-emerald-400" : "text-white/40 group-hover:text-white/60"}`}>{project.title}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={saving} className="w-full py-3 bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-black text-sm uppercase tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Experience</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminExperience;
