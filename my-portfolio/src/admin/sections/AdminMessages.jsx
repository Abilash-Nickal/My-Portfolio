import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase";
import { Loader2, Mail, Calendar } from "lucide-react";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      const q = query(collection(db, "messages"), orderBy("timestamp", "desc"));
      const snap = await getDocs(q);
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    fetchMessages();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-white/40 text-sm">{messages.length} message{messages.length !== 1 ? "s" : ""}</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="text-cyan-400 animate-spin" size={32} /></div>
      ) : messages.length === 0 ? (
        <div className="text-center py-20 text-white/20 text-sm">No messages yet. They'll appear here when someone submits the contact form.</div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 hover:border-cyan-400/20 transition-all">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="text-white font-black text-base">{msg.name}</h3>
                  <a href={`mailto:${msg.email}`} className="text-cyan-400 text-xs font-mono hover:underline flex items-center gap-1 mt-0.5">
                    <Mail size={12} />{msg.email}
                  </a>
                </div>
                {msg.timestamp && (
                  <span className="text-white/20 text-[10px] font-mono flex items-center gap-1 flex-shrink-0">
                    <Calendar size={10} />
                    {msg.timestamp.toDate().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </span>
                )}
              </div>
              <p className="text-white/60 text-sm leading-relaxed bg-black/20 rounded-xl p-4 border border-white/5">{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
