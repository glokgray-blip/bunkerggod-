import { AlertCircle, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { T } from "@/lib/constants";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black px-6 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mb-8 relative"
      >
        <div className="absolute inset-0 blur-2xl opacity-20 rounded-full bg-red-600 animate-pulse" />
        <AlertCircle className="h-24 w-24 text-red-500 relative z-10" style={{ filter: `drop-shadow(${T.glow("#ef4444")})` }} />
      </motion.div>

      <h1 className="font-display font-black text-5xl tracking-tighter text-white mb-4"
        style={{ textShadow: T.glowText("#ff3366") }}>
        404_VOID
      </h1>

      <p className="font-tech text-xs tracking-[0.3em] text-red-500 uppercase mb-12">
        DATA_PACKET_LOST_IN_TRANSMISSION
      </p>

      <div className="w-full max-w-xs p-6 rounded-sm border border-red-900/30 bg-red-950/5 mb-10">
        <p className="font-sans text-sm text-gray-400 leading-relaxed">
          The requested coordinate does not exist within the current node. Access denied or link corrupted.
        </p>
      </div>

      <Link href="/">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-3 px-8 py-4 font-display font-bold text-sm uppercase tracking-[0.2em] rounded-sm transition-all"
          style={{
            background: "rgba(0,240,255,0.08)",
            border: "1px solid rgba(0,240,255,0.4)",
            color: "#00f0ff",
            boxShadow: T.glow("#00f0ff")
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Nexus
        </motion.button>
      </Link>
    </div>
  );
}
