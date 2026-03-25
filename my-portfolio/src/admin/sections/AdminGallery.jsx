import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase";
import { Plus, Trash2, Loader2, Image as ImageIcon, Play, Github, FolderOpen, ChevronRight, Check, X } from "lucide-react";

const AdminGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newTag, setNewTag] = useState("");
  const [saving, setSaving] = useState(false);
  const [repoPickerOpen, setRepoPickerOpen] = useState(false);
  const [repoLoading, setRepoLoading] = useState(false);
  const [repoImages, setRepoImages] = useState([]);
  const [currentPath, setCurrentPath] = useState("");
  const [selectedRepoImages, setSelectedRepoImages] = useState([]); // For multiple selection
  const [isMultipleSelection, setIsMultipleSelection] = useState(false);

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

  const handleSelectFromRepo = async (imageUrls) => {
    const urls = Array.isArray(imageUrls) ? imageUrls : [imageUrls];
    
    if (isMultipleSelection) {
      setSaving(true);
      try {
        const promises = urls.map(url => 
          addDoc(collection(db, "gallery"), {
            url: url,
            videoUrl: null,
            tag: newTag.trim() || null,
            createdAt: serverTimestamp()
          })
        );
        await Promise.all(promises);
        fetchImages();
      } catch (error) {
        console.error("Bulk add failed:", error);
      } finally {
        setSaving(false);
      }
    } else {
      setNewImageUrl(urls[0]);
    }
    
    setRepoPickerOpen(false);
    setSelectedRepoImages([]);
    setIsMultipleSelection(false);
  };

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
            <button
              type="button"
              onClick={() => {
                setIsMultipleSelection(false);
                setRepoPickerOpen(true);
                fetchRepoContents("");
              }}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-cyan-400 hover:text-cyan-300 hover:bg-white/10 transition-all flex items-center gap-2"
              title="Pick from GitHub"
            >
              <Github size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Repo</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsMultipleSelection(true);
                setRepoPickerOpen(true);
                fetchRepoContents("");
              }}
              className="px-4 py-2 bg-cyan-400/10 border border-cyan-400/20 rounded-xl text-cyan-400 hover:bg-cyan-400/20 transition-all flex items-center gap-2"
              title="Bulk Select from Repo"
            >
              <Plus size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Bulk Repo</span>
            </button>
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
      {/* GitHub Repo Picker Modal */}
      {repoPickerOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0f0c18] border border-white/10 rounded-3xl p-6 w-full max-w-4xl shadow-2xl max-h-[85vh] flex flex-col">
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
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setRepoPickerOpen(false)} 
                  className="p-2 text-white/40 hover:text-white transition-colors bg-white/5 rounded-full"
                >
                  <X size={20} />
                </button>
                {isMultipleSelection && selectedRepoImages.length > 0 && (
                  <button
                    onClick={() => handleSelectFromRepo(selectedRepoImages)}
                    className="px-6 py-2 bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-black text-xs uppercase tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all flex items-center gap-2"
                  >
                    Confirm Selection ({selectedRepoImages.length})
                  </button>
                )}
              </div>
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
                            if (isMultipleSelection) {
                              setSelectedRepoImages(prev => 
                                prev.includes(rawUrl) 
                                  ? prev.filter(url => url !== rawUrl) 
                                  : [...prev, rawUrl]
                              );
                            } else {
                              handleSelectFromRepo([rawUrl]);
                            }
                          }
                        }}
                        className={`group flex flex-col items-center gap-3 p-3 rounded-2xl transition-all text-center border ${isMultipleSelection && selectedRepoImages.includes(`https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${item.path}`) ? "bg-cyan-400/10 border-cyan-400/40" : "hover:bg-white/5 border-transparent hover:border-white/10"}`}
                      >
                        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
                          {isDir ? (
                            <FolderOpen size={40} className="text-cyan-400/40 group-hover:text-cyan-400 transition-colors" />
                          ) : (
                            <img 
                              src={item.download_url} 
                              alt={item.name} 
                              className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${(isMultipleSelection && selectedRepoImages.includes(`https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${item.path}`)) ? "opacity-50" : ""}`} 
                            />
                          )}
                          <div className={`absolute inset-0 transition-opacity flex items-center justify-center ${(isMultipleSelection && selectedRepoImages.includes(`https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${item.path}`)) ? "bg-cyan-400/40 opacity-100" : "bg-cyan-400/20 opacity-0 group-hover:opacity-100"}`}>
                            {isDir ? <ChevronRight size={24} className="text-white" /> : <Check size={24} className="text-white" />}
                          </div>
                          {isMultipleSelection && !isDir && (
                            <div className={`absolute top-2 right-2 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedRepoImages.includes(`https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${item.path}`) ? "bg-cyan-400 border-cyan-400 scale-110" : "bg-black/50 border-white/40"}`}>
                              {selectedRepoImages.includes(`https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${item.path}`) && <Check size={12} className="text-black" strokeWidth={4} />}
                            </div>
                          )}
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

export default AdminGallery;
