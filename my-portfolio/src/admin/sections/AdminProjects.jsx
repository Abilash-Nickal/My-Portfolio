import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase";
import { Plus, Pencil, Trash2, X, Save, Loader2, Image as ImageIcon, Zap, Github, FolderOpen, ChevronRight, Check } from "lucide-react";

const emptyForm = { title: "", category: "", tech: "", desc: "", github: "", link: "", youtubeUrl: "", imageUrls: [""], skills: [], order: 0, associationLogoUrl: "" };

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [isFullDescOpen, setIsFullDescOpen] = useState(false);
  const [repoPickerOpen, setRepoPickerOpen] = useState(false);
  const [repoLoading, setRepoLoading] = useState(false);
  const [repoImages, setRepoImages] = useState([]);
  const [currentPath, setCurrentPath] = useState("");
  const [selectedImageSlot, setSelectedImageSlot] = useState(null);

  const REPO_OWNER = "Abilash-Nickal";
  const REPO_NAME = "My-Portfolio";

  const fetchRepoContents = async (path = "") => {
    setRepoLoading(true);
    const targetPath = path || "portfolio-images";
    try {
      const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${targetPath}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setRepoImages(data);
        setCurrentPath(targetPath);
      }
    } catch (error) {
      console.error("Error fetching repo contents:", error);
    }
    setRepoLoading(false);
  };

  const handleSelectFromRepo = (imageUrl) => {
    if (selectedImageSlot !== null) {
      const newUrls = [...(form.imageUrls || [""])];
      newUrls[selectedImageSlot] = imageUrl;
      setForm((f) => ({ ...f, imageUrls: newUrls }));
      setRepoPickerOpen(false);
      setSelectedImageSlot(null);
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "projects"));
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      // In-memory sort to avoid index requirements
      const sortedData = data.sort((a, b) => {
        const orderA = a.order ?? 0;
        const orderB = b.order ?? 0;
        if (orderA !== orderB) return orderA - orderB;
        return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
      });
      setProjects(sortedData);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
    setLoading(false);
  };

  const fetchSkills = async () => {
    try {
      const snap = await getDocs(collection(db, "skills"));
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setAllSkills(data.sort((a, b) => a.name.localeCompare(b.name)));
    } catch {
      setAllSkills([]);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchSkills();
  }, []);

  const openAdd = () => { setForm(emptyForm); setEditingId(null); setFormOpen(true); };
  const openEdit = (p) => {
    setForm({
      title: p.title,
      category: p.category,
      tech: p.tech,
      desc: p.desc,
      github: p.github || "",
      link: p.link || "",
      youtubeUrl: p.youtubeUrl || "",
      imageUrls: p.imageUrls || (p.imageUrl ? [p.imageUrl] : [""]),
      skills: p.skills || [],
      order: p.order || 0,
      associationLogoUrl: p.associationLogoUrl || "",
    });
    setEditingId(p.id);
    setFormOpen(true);
  };

  const toggleSkill = (skillId) => {
    setForm((f) => ({
      ...f,
      skills: f.skills.includes(skillId)
        ? f.skills.filter((s) => s !== skillId)
        : [...f.skills, skillId],
    }));
  };

  const toggleCategory = (cat) => {
    const currentCats = form.category ? form.category.split(',').map(s => s.trim()).filter(Boolean) : [];
    const newCats = currentCats.includes(cat) 
      ? currentCats.filter(c => c !== cat)
      : [...currentCats, cat];
    setForm(f => ({ ...f, category: newCats.join(', ') }));
  };


  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const cleanImageUrls = (form.imageUrls || []).filter((url) => url.trim().length > 0);
      const projectDataToSave = {
        title: form.title,
        category: form.category,
        tech: form.tech,
        desc: form.desc,
        github: form.github,
        link: form.link,
        youtubeUrl: form.youtubeUrl,
        imageUrls: cleanImageUrls,
        skills: form.skills,
        order: Number(form.order) || 0,
        associationLogoUrl: form.associationLogoUrl,
      };
      if (editingId) {
        await updateDoc(doc(db, "projects", editingId), { ...projectDataToSave, updatedAt: serverTimestamp() });
      } else {
        await addDoc(collection(db, "projects"), { ...projectDataToSave, createdAt: serverTimestamp() });
      }
      await fetchProjects();
      setFormOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p) => {
    if (!window.confirm("Delete this project?")) return;
    await deleteDoc(doc(db, "projects", p.id));
    setProjects((prev) => prev.filter((proj) => proj.id !== p.id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-white/40 text-sm">{projects.length} project{projects.length !== 1 ? "s" : ""}</p>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-black text-xs uppercase tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all">
          <Plus size={16} /> Add Project
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="text-cyan-400 animate-spin" size={32} /></div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 text-white/20 text-sm">No projects yet. Add your first one!</div>
      ) : (
        <div className="space-y-3">
          {projects.map((p) => (
            <div key={p.id} className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 flex items-start justify-between gap-4 hover:border-cyan-400/20 transition-all">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {p.category?.split(',').map((cat, idx) => (
                    <span key={idx} className="text-[10px] font-mono uppercase text-cyan-400 tracking-widest bg-cyan-400/10 px-2 py-0.5 rounded-md border border-cyan-400/20">
                      {cat.trim()}
                    </span>
                  ))}
                  {p.skills && p.skills.length > 0 && (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400/60 font-mono">
                      <Zap size={10} />{p.skills.length} skill{p.skills.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <h3 className="text-white font-black text-base leading-tight mb-1 truncate">{p.title}</h3>
                <p className="text-white/40 text-sm line-clamp-1">{p.desc}</p>
                <p className="text-white/20 text-xs mt-1 font-mono">{p.tech}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => openEdit(p)} className="p-2 rounded-lg text-white/40 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all"><Pencil size={15} /></button>
                <button onClick={() => handleDelete(p)} className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0f0c18] border border-white/10 rounded-3xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-black text-xl">{editingId ? "Edit Project" : "Add Project"}</h2>
              <button onClick={() => setFormOpen(false)} className="text-white/40 hover:text-white transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: "title", label: "Title", placeholder: "My Awesome Project" },
                  { key: "tech", label: "Tech Stack", placeholder: "React • Node.js • Firebase" },
                  { key: "link", label: "Live Link (optional)", placeholder: "https://..." },
                  { key: "github", label: "Source Code (GitHub) Link (optional)", placeholder: "https://github.com/..." },
                  { key: "youtubeUrl", label: "YouTube Video Link (optional)", placeholder: "https://youtube.com/watch?v=..." },
                  { key: "order", label: "Display Order", placeholder: "0", type: "number" },
                  { key: "associationLogoUrl", label: "Association Logo URL (Company/Org)", placeholder: "https://..." },
                ].map(({ key, label, placeholder, type = "text" }) => (
                  <div key={key}>
                    <label className="block text-xs font-bold tracking-widest uppercase mb-1.5 text-white/40">{label}</label>
                    <input
                      type={type}
                      value={form[key]}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-sm"
                    />
                  </div>
                ))}
              </div>

              {/* Enhanced Category Picker */}
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase mb-1.5 text-white/40">Categories (Click to toggle or type above)</label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  placeholder="UX/UI, Frontend, React"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-sm mb-3"
                />
                <div className="flex flex-wrap gap-2 p-3 bg-white/5 rounded-xl border border-white/10 max-h-32 overflow-y-auto no-scrollbar">
                  {[...new Set(["Frontend", "Backend", "Fullstack", "UX/UI", "Mobile", ...projects.flatMap(p => p.category ? p.category.split(',').map(s => s.trim()) : [])])].filter(Boolean).sort().map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all ${form.category?.split(',').map(s => s.trim()).includes(cat) 
                        ? "bg-cyan-500 border-cyan-500 text-black shadow-[0_0_10px_rgba(34,211,238,0.3)]" 
                        : "bg-white/5 border-white/10 text-white/40 hover:border-cyan-500/50 hover:text-white"}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>


              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-3">
                    <label className="block text-xs font-bold tracking-widest uppercase text-white/40">Description</label>
                    <button
                      type="button"
                      onClick={() => setIsFullDescOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1 bg-cyan-400/10 border border-cyan-400/30 rounded-lg text-cyan-400 text-[10px] font-black uppercase tracking-widest hover:bg-cyan-400/20 transition-all"
                    >
                      <Zap size={12} /> Write Detailed Description
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      type="button" 
                      onClick={() => {
                        const textarea = document.getElementById("project-desc");
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const text = form.desc;
                        const before = text.substring(0, start);
                        const after = text.substring(end);
                        const selected = text.substring(start, end) || "Subheading";
                        const newText = before + "### " + selected + after;
                        setForm(f => ({ ...f, desc: newText }));
                      }}
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-white/5 border border-white/10 text-white/40 hover:text-cyan-400 hover:border-cyan-400/30 transition-all"
                    >
                      Subhead
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        const textarea = document.getElementById("project-desc");
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const text = form.desc;
                        const before = text.substring(0, start);
                        const after = text.substring(end);
                        const selected = text.substring(start, end) || "bold text";
                        const newText = before + "**" + selected + "**" + after;
                        setForm(f => ({ ...f, desc: newText }));
                      }}
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-white/5 border border-white/10 text-white/40 hover:text-orange-400 hover:border-orange-400/30 transition-all"
                    >
                      Bold
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        const textarea = document.getElementById("project-desc");
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const text = form.desc;
                        const before = text.substring(0, start);
                        const after = text.substring(end);
                        const selected = text.substring(start, end) || "List item";
                        const newText = before + "- " + selected + after;
                        setForm(f => ({ ...f, desc: newText }));
                      }}
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-white/5 border border-white/10 text-white/40 hover:text-emerald-400 hover:border-emerald-400/30 transition-all"
                    >
                      List
                    </button>
                  </div>
                </div>
                <textarea
                  id="project-desc"
                  value={form.desc}
                  onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))}
                  placeholder="Describe the project... Use ### for subheadings, **bold** for bold, or - for bullets."
                  rows={6}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-sm resize-none leading-relaxed"
                />
              </div>

              {/* Skills Picker - Re-styled like the image */}
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase mb-3 text-white/40">Skills Involved</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-32 overflow-y-auto p-3 bg-white/5 rounded-xl border border-white/10 no-scrollbar">
                  {allSkills.map(skill => (
                    <label key={skill.id} className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={form.skills?.includes(skill.id)}
                        onChange={() => toggleSkill(skill.id)}
                        className="hidden"
                      />
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${form.skills?.includes(skill.id) ? "bg-cyan-500 border-cyan-500" : "border-white/20 group-hover:border-cyan-500/50"}`}>
                        {form.skills?.includes(skill.id) && <Plus size={12} className="text-black rotate-45" />}
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider truncate ${form.skills?.includes(skill.id) ? "text-cyan-400" : "text-white/40 group-hover:text-white/60"}`}>{skill.name}</span>
                    </label>
                  ))}
                  {allSkills.length === 0 && <p className="text-[10px] text-white/20 uppercase font-mono py-1">No skills found</p>}
                </div>
              </div>

              {/* Image URLs Field */}
              <div>
                <div className="flex items-center justify-between mb-3 text-white/40">
                  <label className="block text-xs font-bold tracking-widest uppercase">Project Images</label>
                  <span className="text-[10px] font-mono">{form.imageUrls?.length || 0}/10</span>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar p-1">
                  {(form.imageUrls || [""]).map((url, index) => (
                    <div key={index} className="flex items-center gap-3 group">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-white/10 bg-white/5 flex-shrink-0">
                        {url ? (
                          <img src={url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/10"><ImageIcon size={14} /></div>
                        )}
                      </div>
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => {
                          const newUrls = [...(form.imageUrls || [""])];
                          newUrls[index] = e.target.value;
                          setForm((f) => ({ ...f, imageUrls: newUrls }));
                        }}
                        placeholder="Image URL"
                        className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedImageSlot(index);
                          setRepoPickerOpen(true);
                          fetchRepoContents("");
                        }}
                        className="p-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                        title="Pick from GitHub"
                      >
                        <Github size={18} />
                      </button>
                      {(form.imageUrls?.length > 1) && (
                        <button
                          type="button"
                          onClick={() => {
                            const newUrls = form.imageUrls.filter((_, i) => i !== index);
                            setForm((f) => ({ ...f, imageUrls: newUrls }));
                          }}
                          className="p-2 text-white/20 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  {(!form.imageUrls || form.imageUrls.length < 10) && (
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, imageUrls: [...(f.imageUrls || [""]), ""] }))}
                      className="w-full py-2 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-cyan-400 border border-dashed border-cyan-400/20 rounded-xl hover:bg-cyan-400/5 transition-all"
                    >
                      <Plus size={14} /> Add Image Slot
                    </button>
                  )}
                </div>
              </div>

              <button type="submit" disabled={saving} className="w-full py-3.5 bg-[#00f2ea] text-black font-black text-sm uppercase tracking-widest rounded-2xl hover:shadow-[0_0_30px_rgba(0,242,234,0.4)] transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                {saving ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : <><Save size={18} /> Save Project</>}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Full Screen Description Editor Overlay */}
      {isFullDescOpen && (
        <div className="fixed inset-0 z-[100] bg-[#0B0914] flex flex-col p-6 animate-in fade-in zoom-in duration-300">
          <div className="max-w-5xl mx-auto w-full h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center text-cyan-400">
                  <Pencil size={20} />
                </div>
                <div>
                  <h2 className="text-white font-black text-xl tracking-tight uppercase">Detailed Project Description</h2>
                  <p className="text-white/40 text-[10px] font-mono tracking-widest uppercase mt-0.5">Editing Content</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Re-use toolbar in full screen */}
                <div className="hidden sm:flex gap-2 mr-4">
                    <button 
                      type="button" 
                      onClick={() => {
                        const textarea = document.getElementById("full-desc");
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const text = form.desc;
                        const before = text.substring(0, start);
                        const after = text.substring(end);
                        const selected = text.substring(start, end) || "Subheading";
                        const newText = before + "### " + selected + after;
                        setForm(f => ({ ...f, desc: newText }));
                      }}
                      className="text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-cyan-400 hover:border-cyan-400/30 transition-all"
                    >
                      Subhead
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        const textarea = document.getElementById("full-desc");
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const text = form.desc;
                        const before = text.substring(0, start);
                        const after = text.substring(end);
                        const selected = text.substring(start, end) || "bold text";
                        const newText = before + "**" + selected + "**" + after;
                        setForm(f => ({ ...f, desc: newText }));
                      }}
                      className="text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-orange-400 hover:border-orange-400/30 transition-all"
                    >
                      Bold
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        const textarea = document.getElementById("full-desc");
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const text = form.desc;
                        const before = text.substring(0, start);
                        const after = text.substring(end);
                        const selected = text.substring(start, end) || "List item";
                        const newText = before + "- " + selected + after;
                        setForm(f => ({ ...f, desc: newText }));
                      }}
                      className="text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-emerald-400 hover:border-emerald-400/30 transition-all"
                    >
                      List
                    </button>
                </div>
                <button
                  onClick={() => setIsFullDescOpen(false)}
                  className="px-6 py-2.5 bg-cyan-400 text-black font-black text-xs uppercase tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all"
                >
                  Done
                </button>
              </div>
            </div>

            <textarea
              id="full-desc"
              value={form.desc}
              onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))}
              placeholder="Describe the project in detail... Use the toolbar above for formatting."
              className="flex-1 w-full bg-white/[0.02] border border-white/5 rounded-3xl p-8 text-white text-lg placeholder-white/5 focus:outline-none focus:border-cyan-400/20 transition-all resize-none leading-relaxed no-scrollbar shadow-inner"
            />

            <div className="mt-6 flex justify-between items-center text-[10px] font-mono tracking-widest text-white/20 uppercase">
              <div className="flex gap-6">
                <span>{form.desc?.length || 0} Characters</span>
                <span>{form.desc?.split(/\s+/).filter(Boolean).length || 0} Words</span>
              </div>
              <p>Tips: Use `###` for subheadings, `**bold**` for focus.</p>
            </div>
          </div>
        </div>
      )}
      {/* GitHub Repo Picker Modal */}
      {repoPickerOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0f0c18] border border-white/10 rounded-3xl p-6 w-full max-w-3xl shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white">
                  <Github size={24} />
                </div>
                <div>
                  <h2 className="text-white font-black text-xl uppercase tracking-tight">Repository Browser</h2>
                  <p className="text-white/40 text-[10px] font-mono tracking-widest uppercase mt-0.5">{REPO_OWNER}/{REPO_NAME}</p>
                </div>
              </div>
              <button 
                onClick={() => setRepoPickerOpen(false)} 
                className="p-2 text-white/40 hover:text-white transition-colors bg-white/5 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar pb-2">
              <button 
                onClick={() => fetchRepoContents("portfolio-images")}
                className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all ${currentPath === "portfolio-images" ? "bg-cyan-400 text-black" : "bg-white/5 text-white/40 hover:text-white"}`}
              >
                Images Root
              </button>
              {currentPath.replace("portfolio-images", "").split('/').filter(Boolean).map((part, i, arr) => (
                <div key={i} className="flex items-center gap-2">
                  <ChevronRight size={12} className="text-white/20" />
                  <button 
                    onClick={() => {
                      const parts = currentPath.split('/');
                      const newPath = parts.slice(0, parts.indexOf("portfolio-images") + i + 2).join('/');
                      fetchRepoContents(newPath);
                    }}
                    className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all ${i === arr.length - 1 ? "bg-cyan-400 text-black" : "bg-white/5 text-white/40 hover:text-white"}`}
                  >
                    {part}
                  </button>
                </div>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar min-h-0 bg-black/20 rounded-2xl border border-white/5 p-4">
              {repoLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="animate-spin text-cyan-400" size={32} />
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {repoImages.map((item) => {
                    const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(item.name);
                    const isDir = item.type === "dir";

                    if (!isImage && !isDir) return null;

                    return (
                      <button
                        key={item.sha}
                        onClick={() => {
                          if (isDir) {
                            fetchRepoContents(item.path);
                          } else {
                            const rawUrl = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${item.path}`;
                            handleSelectFromRepo(rawUrl);
                          }
                        }}
                        className="group flex flex-col items-center gap-3 p-3 rounded-2xl hover:bg-white/5 transition-all text-center border border-transparent hover:border-white/10"
                      >
                        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
                          {isDir ? (
                            <FolderOpen size={40} className="text-cyan-400/40 group-hover:text-cyan-400 transition-colors" />
                          ) : (
                            <img 
                              src={item.download_url} 
                              alt={item.name} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                            />
                          )}
                          <div className="absolute inset-0 bg-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            {isDir ? <ChevronRight size={24} className="text-white" /> : <Check size={24} className="text-white" />}
                          </div>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 group-hover:text-white truncate w-full px-1">
                          {item.name}
                        </span>
                      </button>
                    );
                  })}
                  {repoImages.length === 0 && (
                    <div className="col-span-full py-20 text-center text-white/20 text-xs uppercase tracking-widest font-mono">
                      This folder is empty
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjects;