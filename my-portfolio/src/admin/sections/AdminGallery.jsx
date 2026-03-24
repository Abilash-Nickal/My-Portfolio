import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase";
import { Plus, Trash2, Loader2, Image as ImageIcon, Play } from "lucide-react";

const AdminGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newTag, setNewTag] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchImages = async () => {
    setLoading(true);
    const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    setImages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };

  useEffect(() => { fetchImages(); }, []);

  const handleAddImage = async (e) => {
    e.preventDefault();
    if (!newImageUrl.trim()) return;

    setSaving(true);
    try {
      await addDoc(collection(db, "gallery"), {
        url: newImageUrl,
        videoUrl: newVideoUrl.trim() || null,
        tag: newTag.trim() || null,
        createdAt: serverTimestamp()
      });
      setNewImageUrl("");
      setNewVideoUrl("");
      setNewTag("");
      fetchImages();
    } catch (error) {
      console.error("Failed to add gallery item:", error);
      alert("Failed to add gallery item.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (imageObj) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    
    try {
      await deleteDoc(doc(db, "gallery", imageObj.id));
      setImages(prev => prev.filter(img => img.id !== imageObj.id));
    } catch {
      console.error("Delete failed");
      alert("Failed to delete image.");
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <p className="text-white/40 text-sm whitespace-nowrap">{images.length} image{images.length !== 1 ? "s" : ""}</p>
        
        <form onSubmit={handleAddImage} className="flex flex-col flex-1 max-w-2xl gap-3">
          <div className="flex gap-2">
            <input
              type="url"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="Image URL (e.g. from Imgur)"
              className="flex-1 px-4 py-2 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-sm"
              required
            />
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Custom Tag (Optional)"
              className="w-40 px-4 py-2 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-sm"
            />
          </div>
          <div className="flex gap-2">
            <input
              type="url"
              value={newVideoUrl}
              onChange={(e) => setNewVideoUrl(e.target.value)}
              placeholder="Video URL (Optional, Youtube/MP4)"
              className="flex-1 px-4 py-2 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-sm"
            />
            <button 
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-black text-xs uppercase tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all disabled:opacity-60 whitespace-nowrap"
            >
              {saving ? (
                <><Loader2 size={16} className="animate-spin" /> Saving...</>
              ) : (
                <><Plus size={16} /> Add to Gallery</>
              )}
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="text-cyan-400 animate-spin" size={32} /></div>
      ) : images.length === 0 ? (
        <div className="text-center py-20 text-white/20 text-sm flex flex-col items-center gap-4">
          <ImageIcon size={48} className="text-white/10" />
          <p>No images in gallery yet. Upload some to show them off!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.id} className="group relative aspect-square rounded-2xl overflow-hidden bg-white/[0.03] border border-white/5">
              <img 
                src={img.url} 
                alt="Gallery item"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              
              <div className="absolute top-2 left-2 flex gap-1">
                {img.tag && (
                  <span className="px-2 py-0.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[10px] text-white/70 uppercase tracking-tighter">
                    {img.tag}
                  </span>
                )}
                {img.videoUrl && (
                  <span className="p-1 bg-cyan-500/80 backdrop-blur-md rounded-full text-black">
                    <Play size={10} fill="currentColor" />
                  </span>
                )}
              </div>

              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button 
                  onClick={() => handleDelete(img)}
                  className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 hover:scale-110 transition-all shadow-xl"
                  title="Delete image"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminGallery;
