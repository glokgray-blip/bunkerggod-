import { motion, AnimatePresence } from "framer-motion";
import { Radio, Lock, Terminal, Cpu, Database } from "lucide-react";
import { T } from "@/lib/constants";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

function DataStream() {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    const logs = [
      "INITIALIZING ENCRYPTED UPLINK...",
      "DECODING PACKETS FROM NODE_ALPHA...",
      "BYPASSING FIREWALL [SUCCESS]",
      "BUFFERING STREAM: 12%... 45%... 89%",
      "ERROR: BANDWIDTH RESTRICTED",
      "RE-ROUTING THROUGH MESH_BUNKER...",
      "WAITING FOR SYSTEM_CALIBRATION",
      "PROTOCOL_ZERO STANDBY",
    ];

    const interval = setInterval(() => {
      setLines((prev) => {
        const next = [...prev, logs[Math.floor(Math.random() * logs.length)]];
        if (next.length > 8) return next.slice(1);
        return next;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-xs mt-8 p-4 rounded-sm border border-cyan-500/20 bg-black/40 font-mono text-[9px] text-cyan-500/60 text-left overflow-hidden h-36">
      <AnimatePresence initial={false}>
        {lines.map((line, i) => (
          <motion.div
            key={`${line}-${i}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-1"
          >
            <span className="text-cyan-500/30 mr-2">›</span>
            {line}
          </motion.div>
        ))}
      </AnimatePresence>
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="inline-block w-1.5 h-3 bg-cyan-500/60 ml-1 translate-y-0.5"
      />
    </div>
  );
}

export default function Feed() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pb-24 px-6 text-center" style={{ background: "#050508" }}>
      <div className="relative mb-16">
        {[1, 2, 3].map((i) => (
          <motion.div key={i} animate={{ scale: [1, 1.4 + i * 0.35, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.8, ease: "easeInOut" }}
            className="absolute rounded-full border"
            style={{ inset: `${-i * 24}px`, borderColor: `rgba(0,240,255,${0.15 - i * 0.04})` }} />
        ))}

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-10 border border-dashed border-cyan-500/10 rounded-full"
        />

        <div className="relative w-24 h-24 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(0,240,255,0.05)",
            border: "1px solid rgba(0,240,255,0.3)",
            boxShadow: `0 0 40px rgba(0,240,255,0.1), ${T.borderGlow("#00f0ff")}`
          }}>
          <Radio className="w-10 h-10" style={{ color: "#00f0ff", filter: `drop-shadow(${T.glow("#00f0ff")})` }} />
        </div>

        <div className="absolute -top-6 -right-6 flex flex-col gap-2">
           <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }}>
             <Cpu className="w-4 h-4 text-pink-500" />
           </motion.div>
           <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}>
             <Database className="w-4 h-4 text-cyan-500" />
           </motion.div>
        </div>
      </div>

      <h1 className="font-display font-black text-4xl tracking-wider uppercase text-white mb-4" style={{ textShadow: T.glowText("#00f0ff") }}>
        {t("feed.header")}
      </h1>

      <div className="flex flex-col items-center gap-2 mb-8">
        <p className="font-tech text-xs tracking-[0.4em] uppercase" style={{ color: "#00f0ff80" }}>{t("feed.subheader")}</p>
        <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3 px-6 py-3 rounded-sm"
          style={{ background: "rgba(0,240,255,0.03)", border: "1px solid rgba(0,240,255,0.2)" }}>
          <Lock className="w-4 h-4 text-green-400" />
          <span className="font-tech text-xs tracking-[0.2em] uppercase text-green-400">{t("feed.comingSoon")}</span>
        </div>

        <p className="font-sans text-xs text-gray-500 max-w-xs leading-relaxed opacity-80">{t("feed.desc")}</p>
      </div>

      <DataStream />

      <div className="mt-12 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-3 h-3 text-cyan-500/40" />
          <span className="font-tech text-[10px] text-gray-700 tracking-[0.3em] uppercase">{t("feed.loading")}</span>
        </div>
        <div className="w-32 h-1 bg-gray-900 rounded-full overflow-hidden">
          <motion.div
            animate={{ x: [-128, 128] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-full h-full bg-cyan-500/30"
          />
        </div>
      </div>
    </div>
  );
}
