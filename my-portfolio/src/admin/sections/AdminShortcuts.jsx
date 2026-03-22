import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { Plus, Pencil, Trash2, X, Save, Loader2, Image as ImageIcon, Link as LinkIcon } from "lucide-react";

const emptyForm = { title: "", url: "", logoUrl: "", order: 0, projectId: "" };

const AdminShortcuts = () => {
  const [shortcuts, setShortcuts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchShortcuts = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "shortcuts"));
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const sortedData = data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      setShortcuts(sortedData);
    } catch (error) {
      console.error("Error fetching shortcuts:", error);
    }
    setLoading(false);
  };

  const fetchProjects = async () => {
    try {
      const snap = await getDocs(collection(db, "projects"));
      setProjects(snap.docs.map(d => ({ id: d.id, title: d.data().title })));
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  useEffect(() => {
    fetchShortcuts();
    fetchProjects();
  }, []);

  const openAdd = () => { setForm(emptyForm); setEditingId(null); setFormOpen(true); };
  const openEdit = (s) => {
    setForm({
      title: s.title,
      url: s.url || "",
      logoUrl: s.logoUrl || "",
      order: s.order || 0,
      projectId: s.projectId || "",
    });
    setEditingId(s.id);
    setFormOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const shortcutData = {
        ...form,
        order: Number(form.order) || 0,
      };
      if (editingId) {
        await updateDoc(doc(db, "shortcuts", editingId), { ...shortcutData, updatedAt: serverTimestamp() });
      } else {
        await addDoc(collection(db, "shortcuts"), { ...shortcutData, createdAt: serverTimestamp() });
      }
      await fetchShortcuts();
      setFormOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (s) => {
    try {
      console.log("HandleDelete called for:", s.id, s.title);
      // Removed confirm for verification
      await deleteDoc(doc(db, "shortcuts", s.id));
      console.log("DeleteDoc call finished");
      setShortcuts((prev) => prev.filter((item) => item.id !== s.id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-white/40 text-sm">{shortcuts.length} shortcut{shortcuts.length !== 1 ? "s" : ""}</p>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-black text-xs uppercase tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all">
          <Plus size={16} /> Add Shortcut
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="text-cyan-400 animate-spin" size={32} /></div>
      ) : shortcuts.length === 0 ? (
        <div className="text-center py-20 text-white/20 text-sm">No shortcuts yet. Add your first one!</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {shortcuts.map((s) => (
            <div key={s.id} className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 flex items-center justify-between gap-4 hover:border-cyan-400/20 transition-all">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {s.logoUrl ? (
                    <img src={s.logoUrl} alt={s.title} className="w-full h-full object-contain p-2" />
                  ) : (
                    <ImageIcon size={20} className="text-white/10" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="text-white font-black text-sm truncate">{s.title}</h3>
                  <p className="text-white/20 text-[10px] font-mono truncate">{s.url}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(s)} className="p-2 rounded-lg text-white/40 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all"><Pencil size={15} /></button>
                <button onClick={() => handleDelete(s)} className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0f0c18] border border-white/10 rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-black text-xl">{editingId ? "Edit Shortcut" : "Add Shortcut"}</h2>
              <button onClick={() => setFormOpen(false)} className="text-white/40 hover:text-white transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase mb-1.5 text-white/40">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="App Title"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-sm"
                  required
                />
              </div>
              {!form.projectId && (
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase mb-1.5 text-white/40">URL / Link</label>
                  <div className="relative">
                    <LinkIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                    <input
                      type="url"
                      value={form.url}
                      onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                      placeholder="https://..."
                      className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-sm"
                      required={!form.projectId}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold tracking-widest uppercase mb-1.5 text-white/40">Link to Internal Project (Optional)</label>
                <select
                  value={form.projectId}
                  onChange={(e) => setForm((f) => ({ ...f, projectId: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-sm"
                >
                  <option value="" className="bg-[#0f0c18]">-- None (External Link) --</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id} className="bg-[#0f0c18]">{p.title}</option>
                  ))}
                </select>
                {form.projectId && <p className="mt-1 text-[10px] text-cyan-400 font-mono italic">Note: This will open the project overlay.</p>}
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest uppercase mb-1.5 text-white/40">Logo Image URL</label>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {form.logoUrl ? (
                      <img src={form.logoUrl} alt="Preview" className="w-full h-full object-contain p-1" />
                    ) : (
                      <ImageIcon size={16} className="text-white/10" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={form.logoUrl}
                    onChange={(e) => setForm((f) => ({ ...f, logoUrl: e.target.value }))}
                    placeholder="Cloudinary/Imgur Link"
                    className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase mb-1.5 text-white/40">Display Order</label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))}
                  placeholder="0"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-sm"
                />
              </div>
              <button type="submit" disabled={saving} className="w-full py-3.5 bg-[#00f2ea] text-black font-black text-sm uppercase tracking-widest rounded-2xl hover:shadow-[0_0_30px_rgba(0,242,234,0.4)] transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                {saving ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : <><Save size={18} /> Save Shortcut</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminShortcuts;
