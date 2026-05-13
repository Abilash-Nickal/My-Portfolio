import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { Plus, Pencil, Trash2, X, Save, Loader2, Image as ImageIcon, Award } from "lucide-react";

const emptyForm = { title: "", issuer: "", date: "", credentialId: "", link: "", skills: "", imageUrl: "", badgeUrl: "", description: "" };

const AdminCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "certificates"));
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const sortedData = data.sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return (isNaN(dateB) ? 0 : dateB) - (isNaN(dateA) ? 0 : dateA);
      });
      setCertificates(sortedData);
    } catch (error) {
      console.error("Error fetching certificates:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const openAdd = () => { setForm(emptyForm); setEditingId(null); setFormOpen(true); };
  const openEdit = (c) => {
    setForm({
      title: c.title || "",
      issuer: c.issuer || "",
      date: c.date || "",
      credentialId: c.credentialId || "",
      link: c.link || "",
      skills: c.skills || "",
      imageUrl: c.imageUrl || "",
      badgeUrl: c.badgeUrl || "",
      description: c.description || "",
    });
    setEditingId(c.id);
    setFormOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const dataToSave = { ...form };
      if (editingId) {
        await updateDoc(doc(db, "certificates", editingId), { ...dataToSave, updatedAt: serverTimestamp() });
      } else {
        await addDoc(collection(db, "certificates"), { ...dataToSave, createdAt: serverTimestamp() });
      }
      await fetchCertificates();
      setFormOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (c) => {
    if (!window.confirm("Delete this certificate?")) return;
    await deleteDoc(doc(db, "certificates", c.id));
    setCertificates((prev) => prev.filter((cert) => cert.id !== c.id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-white/40 text-sm">{certificates.length} certificate{certificates.length !== 1 ? "s" : ""}</p>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-black text-xs uppercase tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all">
          <Plus size={16} /> Add Certificate
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="text-cyan-400 animate-spin" size={32} /></div>
      ) : certificates.length === 0 ? (
        <div className="text-center py-20 text-white/20 text-sm">No certificates yet. Add your first one!</div>
      ) : (
        <div className="space-y-3">
          {certificates.map((c) => (
            <div key={c.id} className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 flex items-start justify-between gap-4 hover:border-cyan-400/20 transition-all">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-mono uppercase text-orange-400 tracking-widest bg-orange-400/10 px-2 py-0.5 rounded-md border border-orange-400/20">
                    {c.issuer || "No Issuer"}
                  </span>
                  {c.date && <span className="text-white/40 text-xs">{c.date}</span>}
                </div>
                <h3 className="text-white font-black text-base leading-tight mb-1 truncate">{c.title}</h3>
                {c.credentialId && <p className="text-white/30 text-xs mb-1">ID: {c.credentialId}</p>}
                <p className="text-white/40 text-sm line-clamp-1">{c.skills}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => openEdit(c)} className="p-2 rounded-lg text-white/40 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all"><Pencil size={15} /></button>
                <button onClick={() => handleDelete(c)} className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all"><Trash2 size={15} /></button>
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
              <h2 className="text-white font-black text-xl">{editingId ? "Edit Certificate" : "Add Certificate"}</h2>
              <button onClick={() => setFormOpen(false)} className="text-white/40 hover:text-white transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: "title", label: "Certificate Title", placeholder: "e.g. SOLIDWORKS Associate" },
                  { key: "issuer", label: "Issuer", placeholder: "e.g. Dassault Systèmes" },
                  { key: "date", label: "Issue Date", placeholder: "e.g. May 2026" },
                  { key: "credentialId", label: "Credential ID", placeholder: "e.g. C-BY7G4VA8KX" },
                  { key: "link", label: "Credential Link", placeholder: "https://..." },
                  { key: "skills", label: "Associated Skills", placeholder: "e.g. 3D Printing, Manufacturing" },
                  { key: "imageUrl", label: "Certificate Image URL", placeholder: "https://..." },
                  { key: "badgeUrl", label: "Badge Image URL", placeholder: "https://..." },
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
                <label className="block text-xs font-bold tracking-widest uppercase mb-1.5 text-white/40">Description (Optional)</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Additional details about the certification..."
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-sm resize-none"
                />
              </div>

              <button type="submit" disabled={saving} className="w-full py-3.5 bg-[#00f2ea] text-black font-black text-sm uppercase tracking-widest rounded-2xl hover:shadow-[0_0_30px_rgba(0,242,234,0.4)] transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                {saving ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : <><Save size={18} /> Save Certificate</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCertificates;
