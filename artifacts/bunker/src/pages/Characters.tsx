import { Link } from "wouter";
import { motion } from "framer-motion";
import { Lock, Star } from "lucide-react";
import { AI_CHARACTERS, T } from "@/lib/constants";
import { useTranslation } from "react-i18next";

const STATUS_COLORS: Record<string, string> = {
  online:  "#00ff88",
  busy:    "#ffd700",
  offline: "#ff3366",
};

export default function Characters() {
  const { t } = useTranslation();
  const onlineCount = AI_CHARACTERS.filter(c => c.status === "online" && !c.locked).length;

  return (
    <div className="min-h-screen pb-28 px-4 pt-12 no-scrollbar overflow-y-auto">
      <header className="mb-8">
        <p className="font-tech text-xs tracking-[0.3em] mb-1 uppercase"
          style={{ color: "#00f0ff", textShadow: T.glowText("#00f0ff") }}>
          {t("characters.nodeStatus")} — {t("characters.onlineCount", { count: onlineCount })}
        </p>
        <h1 className="font-display font-black text-3xl tracking-wider uppercase text-white"
          style={{ textShadow: T.glowText("#00f0ff") }}>
          {t("characters.header")}
        </h1>
        <div className="mt-3 h-[2px] w-14 rounded-full" style={{ background: "#00f0ff", boxShadow: T.glow("#00f0ff") }} />
      </header>

      <div className="grid grid-cols-2 gap-4">
        {AI_CHARACTERS.map((char, i) => {
          const neon        = char.locked ? "#444" : char.color.hex;
          const statusColor = STATUS_COLORS[char.status] ?? "#888";

          const card = (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, type: "spring", stiffness: 260, damping: 20 }}
              whileTap={char.locked ? {} : { scale: 0.95 }}
              className="relative h-52 p-4 flex flex-col justify-between overflow-hidden rounded-sm"
              style={{
                background: char.locked ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.55)",
                border: `1px solid ${char.locked ? "rgba(255,255,255,0.06)" : `${neon}30`}`,
                boxShadow: char.locked ? "none" : `inset 0 0 20px ${neon}08`,
                backdropFilter: "blur(12px)",
                cursor: char.locked ? "default" : "pointer",
              }}
            >
              {/* Ambient glow (free only) */}
              {!char.locked && (
                <motion.div
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                  className="absolute top-0 right-0 w-16 h-16 rounded-full pointer-events-none"
                  style={{ background: `radial-gradient(circle, ${neon}30 0%, transparent 70%)` }}
                />
              )}

              {/* Scan sweep (free only) */}
              {!char.locked && (
                <motion.div
                  initial={{ y: "-100%", opacity: 0 }}
                  whileHover={{ y: "400%", opacity: [0, 0.6, 0] }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-x-0 h-8 pointer-events-none"
                  style={{ background: `linear-gradient(0deg, transparent, ${neon}30, transparent)` }}
                />
              )}

              {/* Dim overlay for locked */}
              {char.locked && (
                <div className="absolute inset-0 rounded-sm pointer-events-none" style={{ background: "rgba(0,0,0,0.45)" }} />
              )}

              {/* Top row: avatar + status/premium */}
              <div className="flex items-start justify-between z-10">
                <div
                  className="w-11 h-11 rounded-sm flex items-center justify-center text-2xl"
                  style={{
                    background: char.locked ? "rgba(255,255,255,0.04)" : `${neon}12`,
                    border: `1px solid ${char.locked ? "rgba(255,255,255,0.08)" : `${neon}35`}`,
                    filter: char.locked ? "grayscale(0.8) brightness(0.6)" : undefined,
                  }}>
                  {char.avatar}
                </div>

                {char.locked ? (
                  /* Premium badge */
                  <div className="flex items-center gap-1 px-2 py-1 rounded-sm"
                    style={{ background: "rgba(255,215,0,0.12)", border: "1px solid rgba(255,215,0,0.35)" }}>
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="font-tech text-[9px] uppercase tracking-widest text-yellow-400">
                      {t("characters.premium")}
                    </span>
                  </div>
                ) : (
                  /* Status badge */
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-sm"
                    style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <motion.div
                      animate={char.status === "online" ? { opacity: [1, 0.3, 1] } : {}}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: statusColor, boxShadow: `0 0 6px ${statusColor}` }}
                    />
                    <span className="font-tech text-[9px] uppercase tracking-widest" style={{ color: statusColor }}>
                      {t(`characters.status.${char.status}`)}
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom: name + specialty */}
              <div className="z-10">
                <h3
                  className="font-display font-bold text-lg uppercase tracking-wide leading-tight"
                  style={{
                    color: char.locked ? "#555" : "white",
                    textShadow: char.locked ? "none" : T.glowText(neon),
                  }}>
                  {char.name}
                </h3>
                <p className="font-tech text-[11px] mt-1 uppercase tracking-wider"
                  style={{ color: char.locked ? "#333" : "#555" }}>
                  {char.specialty}
                </p>

                {char.locked ? (
                  /* Lock row */
                  <div className="mt-3 flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-yellow-500" />
                    <span className="font-tech text-[9px] text-yellow-600 uppercase tracking-wider">
                      {t("characters.locked")}
                    </span>
                  </div>
                ) : (
                  <div className="mt-3 h-[1px] w-full rounded-full opacity-40"
                    style={{ background: `linear-gradient(90deg, ${neon}, transparent)` }} />
                )}
              </div>
            </motion.div>
          );

          return char.locked
            ? <div key={char.id}>{card}</div>
            : <Link key={char.id} href={`/chat/${char.id}`}>{card}</Link>;
        })}
      </div>
    </div>
  );
}
