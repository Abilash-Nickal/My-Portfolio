import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase";
import { Plus, Pencil, Trash2, X, Save, Loader2, Image as ImageIcon } from "lucide-react";
import skillsData from "../../data/skillsData";

const emptyForm = { name: "", sub: "", iconUrl: "", description: "", metrics: [] };

const AdminSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "skills"), orderBy("name", "asc"));
      const snap = await getDocs(q);
      setSkills(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch {
      // fallback without ordering if index doesn't exist
      const snap = await getDocs(collection(db, "skills"));
      setSkills(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }
    setLoading(false);
  };

  useEffect(() => { fetchSkills(); }, []);

  const seedFromDefault = async () => {
    if (!window.confirm("This will seed all default skills from skillsData.js into Firestore. Continue?")) return;
    setSeeding(true);
    for (const skill of skillsData) {
      await addDoc(collection(db, "skills"), {
        name: skill.name,
        sub: skill.sub,
        iconUrl: skill.iconUrl,
        skillId: skill.id,
        createdAt: serverTimestamp(),
      });
    }
    await fetchSkills();
    setSeeding(false);
  };

  const openAdd = () => { setForm(emptyForm); setEditingId(null); setFormOpen(true); };
  const openEdit = (s) => {
    setForm({ 
      name: s.name, 
      sub: s.sub || "", 
      iconUrl: s.iconUrl || "",
      description: s.description || "",
      metrics: s.metrics || []
    });
    setEditingId(s.id);
    setFormOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, "skills", editingId), { ...form, updatedAt: serverTimestamp() });
      } else {
        await addDoc(collection(db, "skills"), { ...form, createdAt: serverTimestamp() });
      }
      await fetchSkills();
      setFormOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (s) => {
    if (!window.confirm("Delete this skill?")) return;
    await deleteDoc(doc(db, "skills", s.id));
    setSkills((prev) => prev.filter((sk) => sk.id !== s.id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-white/40 text-sm">{skills.length} skill{skills.length !== 1 ? "s" : ""}</p>
        <div className="flex gap-2">
          {skills.length === 0 && (
            <button
              onClick={seedFromDefault}
              disabled={seeding}
              className="flex items-center gap-2 px-4 py-2 border border-cyan-400/30 text-cyan-400 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-cyan-400/10 transition-all disabled:opacity-50"
            >
              {seeding ? <Loader2 size={14} className="animate-spin" /> : null}
              Seed Defaults
            </button>
          )}
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-black text-xs uppercase tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all">
            <Plus size={16} /> Add Skill
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="text-cyan-400 animate-spin" size={32} /></div>
      ) : skills.length === 0 ? (
        <div className="text-center py-20 text-white/20 text-sm">
          No skills yet. <button onClick={seedFromDefault} className="text-cyan-400 underline">Seed defaults</button> or add manually.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {skills.map((s) => (
            <div key={s.id} className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex items-center gap-4 hover:border-cyan-400/20 transition-all group">
              {s.iconUrl ? (
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5 flex-shrink-0 flex items-center justify-center p-1.5">
                  <img src={s.iconUrl} alt={s.name} className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-xl bg-white/5 flex-shrink-0 flex items-center justify-center">
                  <ImageIcon size={20} className="text-white/20" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-sm truncate">{s.name}</h3>
                <p className="text-white/30 text-xs font-mono truncate">{s.sub}</p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg text-white/40 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(s)} className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all"><Trash2 size={14} /></button>
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
              <h2 className="text-white font-black text-xl">{editingId ? "Edit Skill" : "Add Skill"}</h2>
              <button onClick={() => setFormOpen(false)} className="text-white/40 hover:text-white transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              {[
                { key: "name", label: "Skill Name", placeholder: "e.g. Web Development" },
                { key: "sub", label: "Sub Label", placeholder: "e.g. 6 skills" },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-bold tracking-widest uppercase mb-1.5 text-white/40">{label}</label>
                  <input
                    type="text"
                    value={form[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    required={key === "name"}
                    className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-sm"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase mb-1.5 text-white/40">Icon URL</label>
                <div className="flex items-center gap-3">
                  {form.iconUrl ? (
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/10 flex-shrink-0 flex items-center justify-center p-1">
                      <img src={form.iconUrl} alt="Preview" className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-lg border border-dashed border-white/20 flex items-center justify-center bg-black/20 text-white/20 flex-shrink-0">
                      <ImageIcon size={14} />
                    </div>
                  )}
                  <input
                    type="url"
                    value={form.iconUrl}
                    onChange={(e) => setForm((f) => ({ ...f, iconUrl: e.target.value }))}
                    placeholder="https://cdn.../icon.svg"
                    className="flex-1 px-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest uppercase mb-1.5 text-white/40">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Detailed description of the skill..."
                  className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-sm min-h-[100px] resize-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold tracking-widest uppercase text-white/40">Metrics</label>
                  <button 
                    type="button" 
                    onClick={() => setForm(f => ({ ...f, metrics: [...f.metrics, { label: "", value: "" }] }))}
                    className="text-cyan-400 hover:text-cyan-300 text-[10px] font-black uppercase tracking-tighter"
                  >
                    + Add Metric
                  </button>
                </div>
                <div className="space-y-2">
                  {form.metrics.map((m, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={m.label}
                        onChange={(e) => {
                          const newMetrics = [...form.metrics];
                          newMetrics[idx].label = e.target.value;
                          setForm(f => ({ ...f, metrics: newMetrics }));
                        }}
                        placeholder="Label (e.g. Performance)"
                        className="flex-1 px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-xs"
                      />
                      <input
                        type="text"
                        value={m.value}
                        onChange={(e) => {
                          const newMetrics = [...form.metrics];
                          newMetrics[idx].value = e.target.value;
                          setForm(f => ({ ...f, metrics: newMetrics }));
                        }}
                        placeholder="Value (e.g. +85%)"
                        className="w-24 px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-xs"
                      />
                      <button 
                        type="button"
                        onClick={() => {
                          const newMetrics = form.metrics.filter((_, i) => i !== idx);
                          setForm(f => ({ ...f, metrics: newMetrics }));
                        }}
                        className="p-2 text-white/20 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={saving} className="w-full py-3 bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-black text-sm uppercase tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Skill</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSkills;
