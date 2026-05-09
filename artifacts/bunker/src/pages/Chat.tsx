import { useState, useRef, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Flame, ChevronLeft, ShieldCheck, AlertTriangle, Hash } from "lucide-react";
import { AI_CHARACTERS, N8N_WEBHOOK, API_BASE_URL, T } from "@/lib/constants";
import { useTranslation } from "react-i18next";

// ── Types ──────────────────────────────────────────────────
interface Msg {
  id:          string;
  role:        "user" | "assistant" | "error";
  content:     string;
  timestamp:   string;
}

// ── API send helper (Port 3005) ──────────────────────────────
async function sendMessageToApi(characterId: string, message: string, userId?: string): Promise<string> {
  const resolvedUserId = userId || "test_user_timokha";
  // The backend might expect characterId in the URL or body
  const url = `${API_BASE_URL}/messages/${characterId}`;

  console.log("[BUNKER] → API request:", { url, message, userId: resolvedUserId });

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: message, userId: resolvedUserId }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    // Support various response formats
    return data.content || data.reply || data.text || (typeof data === 'string' ? data : JSON.stringify(data));
  } catch (err) {
    console.error("[BUNKER] API Error:", err);
    // Fallback to n8n if local API fails, or just throw
    return sendToN8n(characterId, message, resolvedUserId);
  }
}

// ── n8n send helper (Legacy fallback) ───────────────────────
async function sendToN8n(webhookName: string, message: string, userId?: string): Promise<string> {
  const resolvedUserId = userId ?? "test_user_timokha";
  const body = { character: webhookName, message, userId: resolvedUserId };

  try {
    const res = await fetch(N8N_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return data?.output || data?.text || data?.reply || String(data);
  } catch (err) {
    throw err;
  }
}

// ── Component ──────────────────────────────────────────────
export default function Chat() {
  const { id }         = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { t }          = useTranslation();
  const scrollRef      = useRef<HTMLDivElement>(null);

  const char = AI_CHARACTERS.find(c => c.id === id) ?? {
    id:          id ?? "unknown",
    webhookName: id ?? "unknown",
    name:        "Агент",
    avatar:      "🤖",
    status:      "online" as const,
    specialty:   "",
    description: "",
    color:       { hex: "#00f0ff" },
    greeting:    t("chat.greeting"),
    locked:      false,
  };
  const neon = char.color.hex;

  const [messages, setMessages] = useState<Msg[]>([
    {
      id:        "greeting",
      role:      "assistant",
      content:   char.greeting || t("chat.greeting"),
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input,       setInput]       = useState("");
  const [loading,     setLoading]     = useState(false);
  const [burnConfirm, setBurnConfirm] = useState(false);
  const [burning,     setBurning]     = useState(false);
  const [userId]                      = useState(() => localStorage.getItem("bunker_user_id") || "UID_UNKNOWN");

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  // ── Send ────────────────────────────────────────────────
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Msg = {
      id:        `u_${Date.now()}`,
      role:      "user",
      content:   text,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const reply = await sendMessageToApi(char.id, text, userId);
      setMessages(prev => [...prev, {
        id:        `a_${Date.now()}`,
        role:      "assistant",
        content:   reply,
        timestamp: new Date().toISOString(),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        id:        `e_${Date.now()}`,
        role:      "error",
        content:   "Соединение разорвано. Повторите попытку.",
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  // ── Burn ────────────────────────────────────────────────
  const handleBurnClick = () => {
    if (!burnConfirm) {
      setBurnConfirm(true);
      setTimeout(() => setBurnConfirm(false), 3000);
      return;
    }
    setBurnConfirm(false);
    setBurning(true);
    setTimeout(() => {
      setMessages([]);
      setBurning(false);
    }, 600);
  };

  return (
    <div className="flex flex-col h-screen relative overflow-hidden" style={{ background: "#050508" }}>
      {/* Grid bg */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(${neon}55 1px, transparent 1px), linear-gradient(90deg, ${neon}55 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }} />
      <div className="absolute top-0 inset-x-0 h-32 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${neon}15 0%, transparent 70%)` }} />

      {/* ── Header ── */}
      <header
        className="flex items-center justify-between px-4 py-3 z-10 sticky top-0"
        style={{
          background:    "rgba(5,5,10,0.88)",
          borderBottom:  `1px solid ${neon}25`,
          backdropFilter: "blur(16px)",
          boxShadow:     `0 4px 20px ${neon}08`,
        }}
      >
        <button onClick={() => setLocation("/")} className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center flex-1 mx-2">
          <div className="flex items-center gap-2">
            <span className="text-xl hidden sm:block">{char.avatar}</span>
            <h2 className="font-display font-bold text-sm sm:text-base tracking-widest uppercase text-white truncate max-w-[120px] sm:max-w-none"
              style={{ textShadow: T.glowText(neon) }}>
              {char.name}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-2.5 h-2.5" style={{ color: "#00ff88" }} />
              <span className="font-tech text-[8px] tracking-widest uppercase" style={{ color: "#00ff88" }}>
                SECURE
              </span>
            </div>
            <div className="flex items-center gap-1 opacity-60">
              <Hash className="w-2.5 h-2.5" style={{ color: neon }} />
              <span className="font-tech text-[8px] tracking-widest uppercase" style={{ color: neon }}>
                {userId.slice(0, 8)}
              </span>
            </div>
          </div>
        </div>

        <motion.button
          onClick={handleBurnClick}
          whileTap={{ scale: 0.9 }}
          className="p-2 -mr-2 flex flex-col items-center gap-0.5 transition-all"
          style={{
            color:  burnConfirm ? "#ff3366" : "#444",
            filter: burnConfirm ? `drop-shadow(${T.glow("#ff3366")})` : "none",
          }}
        >
          <Flame className={`w-6 h-6 ${burnConfirm ? "animate-pulse" : ""}`} />
          <span className="font-tech text-[8px] tracking-wider uppercase">
            {burnConfirm ? t("chat.burnConfirm") : t("chat.burn")}
          </span>
        </motion.button>
      </header>

      {/* ── Session banner ── */}
      <div className="z-10 px-4 pt-4">
        <div className="flex items-center justify-center py-1.5 rounded-sm"
          style={{ background: `${neon}08`, border: `1px solid ${neon}15` }}>
          <span className="font-tech text-[9px] tracking-[0.25em] uppercase"
            style={{ color: `${neon}80` }}>
            {t("chat.sessionStart")}
          </span>
        </div>
      </div>

      {/* ── Messages ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 z-10 no-scrollbar">

        {/* Burn flash */}
        <AnimatePresence>
          {burning && (
            <motion.div key="burn"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
              style={{ background: "rgba(255,0,0,0.07)" }}>
              <motion.div
                animate={{ scale: [1, 1.4, 0.8, 1.2, 0], opacity: [1, 0.8, 1, 0.5, 0] }}
                transition={{ duration: 0.6 }}
                style={{ color: "#ff3366", filter: `drop-shadow(${T.glowStrong("#ff3366")})` }}>
                <Flame className="w-24 h-24" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message bubbles */}
        <AnimatePresence initial={false}>
          {messages.map(msg => {
            const isUser  = msg.role === "user";
            const isError = msg.role === "error";

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, x: isUser ? 16 : -16 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
              >
                {/* Avatar for assistant / error */}
                {!isUser && (
                  <div className="flex-shrink-0 mr-2 mt-1">
                    <div className="w-7 h-7 rounded-sm flex items-center justify-center text-sm"
                      style={{
                        background: isError ? "rgba(255,51,102,0.12)" : `${neon}15`,
                        border:     `1px solid ${isError ? "rgba(255,51,102,0.3)" : `${neon}30`}`,
                      }}>
                      {isError ? <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> : char.avatar}
                    </div>
                  </div>
                )}

                <div
                  className="max-w-[85%] px-4 py-3 relative group"
                  style={{
                    background:   isUser  ? `${neon}10`
                                : isError ? "rgba(255,51,102,0.08)"
                                :           "rgba(20,20,30,0.85)",
                    border:       `1px solid ${
                                    isUser  ? `${neon}40`
                                  : isError ? "rgba(255,51,102,0.4)"
                                  :           `${neon}25`
                                }`,
                    boxShadow:    isUser  ? `0 0 15px ${neon}12`
                                : isError ? "0 0 15px rgba(255,51,102,0.1)"
                                :           `inset 0 0 10px ${neon}05`,
                    borderRadius: isUser ? "12px 2px 12px 12px" : "2px 12px 12px 12px",
                  }}
                >
                  {/* Decorative Glow Line */}
                  <div className={`absolute top-0 bottom-0 w-[1px] opacity-40 transition-all group-hover:opacity-100 ${isUser ? "-left-[1px]" : "-right-[1px]"}`}
                    style={{ background: isError ? "#ff3366" : neon, boxShadow: T.glow(isError ? "#ff3366" : neon) }} />

                  {/* Corner accent */}
                  <div className="absolute w-2.5 h-2.5 border-t"
                    style={{
                      top: -1,
                      [isUser ? "right" : "left"]: -1,
                      borderRight:    isUser ? `2px solid ${neon}` : undefined,
                      borderLeft:    !isUser ? `2px solid ${isError ? "#ff3366" : neon}` : undefined,
                      borderTopColor: isUser ? neon : isError ? "#ff3366" : neon,
                      filter: `drop-shadow(${T.glow(isError ? "#ff3366" : neon)})`
                    }}
                  />
                  <p className="text-sm leading-relaxed whitespace-pre-wrap"
                    style={{ color: isError ? "#ff6680" : "rgba(255,255,255,0.9)" }}>
                    {msg.content}
                  </p>
                  <p className="font-tech text-[9px] tracking-wider mt-2 text-right"
                    style={{ color: isUser ? `${neon}60` : "rgba(255,255,255,0.22)" }}>
                    {format(new Date(msg.timestamp), "HH:mm:ss")}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {loading && (
            <motion.div key="typing"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex justify-start">
              <div className="flex-shrink-0 mr-2 mt-1">
                <div className="w-7 h-7 rounded-sm flex items-center justify-center text-sm"
                  style={{ background: `${neon}15`, border: `1px solid ${neon}30` }}>
                  {char.avatar}
                </div>
              </div>
              <div className="px-5 py-3.5 flex items-center gap-1.5"
                style={{
                  background:   "rgba(20,20,30,0.8)",
                  border:       "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "2px 12px 12px 12px",
                }}>
                {[0, 0.2, 0.4].map((d, i) => (
                  <motion.div key={i}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.65, repeat: Infinity, delay: d }}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: neon, boxShadow: `0 0 6px ${neon}` }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Input bar ── */}
      <div className="px-4 pb-6 pt-3 z-10 sm:pb-8"
        style={{
          background:    "rgba(5,5,10,0.95)",
          borderTop:     `1px solid ${neon}30`,
          backdropFilter: "blur(20px)",
        }}>
        <form onSubmit={handleSend} className="flex gap-2 max-w-4xl mx-auto w-full">
          <div className="relative flex-1 group">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={t("chat.placeholder")}
              disabled={loading}
              className="w-full bg-transparent py-3.5 px-4 text-sm font-tech uppercase tracking-widest placeholder:tracking-widest focus:outline-none transition-all disabled:opacity-50"
              style={{
                background:  "rgba(0,0,0,0.7)",
                border:     `1px solid ${input ? `${neon}80` : "rgba(255,255,255,0.15)"}`,
                color:       neon,
                boxShadow:   input ? `0 0 15px ${neon}15, inset 0 0 10px ${neon}10` : "inset 0 0 5px rgba(0,0,0,0.5)",
                caretColor:  neon,
              }}
            />
            {/* Input focus accent */}
            <div className={`absolute bottom-0 left-0 h-[2px] transition-all duration-300 ${input ? "w-full" : "w-0"}`}
              style={{ background: neon, boxShadow: T.glow(neon) }} />
          </div>

          <motion.button
            type="submit"
            disabled={!input.trim() || loading}
            whileTap={{ scale: 0.95 }}
            className="px-6 flex items-center justify-center font-display font-bold text-xs tracking-widest uppercase disabled:opacity-20 transition-all relative overflow-hidden"
            style={{
              background: `${neon}20`,
              border:     `1px solid ${neon}60`,
              color:       neon,
              boxShadow:   input.trim() && !loading ? T.glow(neon) : undefined,
            }}
          >
             <Send className={`w-5 h-5 ${loading ? "animate-pulse" : ""}`} />
          </motion.button>
        </form>
      </div>
    </div>
  );
}
