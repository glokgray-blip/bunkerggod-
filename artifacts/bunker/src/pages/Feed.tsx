import { Radio, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function Feed() {
  return (
    <div className="min-h-screen pb-24 px-4 pt-12 flex flex-col">
      <header className="mb-6">
        <h2 className="text-sm font-tech tracking-[0.2em] text-muted-foreground mb-1">GLOBAL STREAM</h2>
        <h1 className="text-3xl font-display font-bold text-white/50">FEED</h1>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="mb-6 relative"
        >
          <div className="absolute inset-0 bg-white/20 blur-xl rounded-full" />
          <Radio className="w-20 h-20 text-white relative z-10" />
        </motion.div>
        
        <h3 className="font-display text-2xl font-bold text-white tracking-widest uppercase mb-2">
          Coming Soon
        </h3>
        <p className="font-tech text-sm text-white/60 tracking-[0.2em] max-w-[250px]">
          FUTURE REELS MODULE CURRENTLY OFFLINE. AWAITING DEPLOYMENT.
        </p>

        <div className="mt-12 inline-flex items-center gap-2 px-4 py-2 border border-dashed border-white/20 text-xs font-tech text-white/40">
          <AlertTriangle className="w-3 h-3" />
          SECTION CLASSIFIED
        </div>
      </div>
    </div>
  );
}
