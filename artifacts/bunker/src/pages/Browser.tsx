import { useState, useRef } from "react";
import { useAnalyzePage } from "@workspace/api-client-react";
import { Brain, Search, X, Shield, ShieldAlert, ShieldCheck, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Browser() {
  const [url, setUrl] = useState("https://en.wikipedia.org/wiki/Cyberpunk");
  const [inputUrl, setInputUrl] = useState(url);
  const [showSheet, setShowSheet] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const analyzeMutation = useAnalyzePage();

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    let finalUrl = inputUrl;
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }
    setUrl(finalUrl);
    setInputUrl(finalUrl);
  };

  const handleAnalyze = () => {
    setShowSheet(true);
    analyzeMutation.mutate({
      data: { url: url }
    });
  };

  return (
    <div className="flex flex-col h-screen bg-black pb-16"> {/* pb-16 for BottomNav */}
      {/* Custom URL Bar */}
      <form onSubmit={handleNavigate} className="p-3 glass-panel border-b border-primary/20 flex gap-2 items-center z-10 sticky top-0">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
          <input 
            type="text" 
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="w-full bg-black/60 border border-primary/30 px-10 py-2 text-sm text-white font-tech tracking-wide focus:outline-none focus:border-primary transition-colors rounded-sm"
          />
        </div>
      </form>

      {/* Webview Area */}
      <div className="flex-1 relative bg-black">
        {/* Placeholder background when loading or iframe fails */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <GlobeWireframe />
        </div>
        
        <iframe 
          ref={iframeRef}
          src={url} 
          className="w-full h-full border-none relative z-10 bg-white"
          sandbox="allow-scripts allow-same-origin"
          title="Bunker AI Browser"
          onError={() => console.log("Iframe load error - normal for many sites due to X-Frame-Options")}
        />

        {/* Floating Action Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAnalyze}
          className="absolute bottom-6 right-6 z-20 w-14 h-14 bg-secondary text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,0,255,0.6)] border border-white/20 hover:bg-secondary/90 transition-colors group overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 animate-ping" style={{ animationDuration: '3s' }} />
          <Brain className="w-6 h-6 relative z-10 group-hover:rotate-12 transition-transform" />
        </motion.button>
      </div>

      {/* Analysis Bottom Sheet */}
      <AnimatePresence>
        {showSheet && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSheet(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-primary/40 rounded-t-2xl max-h-[85vh] overflow-y-auto pb-safe shadow-[0_-20px_50px_rgba(0,0,0,0.8)]"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-secondary/20 rounded-lg border border-secondary/50">
                      <Brain className="w-6 h-6 text-secondary drop-shadow-[0_0_5px_rgba(255,0,255,0.8)]" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl text-white">NEURAL ANALYSIS</h3>
                      <p className="font-tech text-xs text-secondary uppercase tracking-widest">Target: {new URL(url).hostname}</p>
                    </div>
                  </div>
                  <button onClick={() => setShowSheet(false)} className="p-2 bg-black/50 border border-white/10 rounded-full hover:bg-white/10 text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {analyzeMutation.isPending ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <div className="relative w-16 h-16">
                      <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin" />
                      <div className="absolute inset-2 border-b-2 border-secondary rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                      <Brain className="absolute inset-0 m-auto w-6 h-6 text-white/50" />
                    </div>
                    <p className="font-tech text-primary uppercase tracking-[0.3em] animate-pulse">Extracting Data...</p>
                  </div>
                ) : analyzeMutation.isError ? (
                  <div className="p-4 bg-destructive/10 border border-destructive/50 rounded-lg text-destructive font-tech">
                    [ERROR] Neural link failed. Target might be blocking extraction.
                  </div>
                ) : analyzeMutation.data ? (
                  <div className="space-y-6">
                    {/* Privacy Risk Score */}
                    <div className="p-4 bg-black/60 border border-white/10 rounded-lg flex items-center justify-between">
                      <span className="font-tech text-sm text-muted-foreground uppercase tracking-widest">Privacy Threat Level</span>
                      <div className="flex items-center gap-2">
                        {analyzeMutation.data.privacyRisk === 'low' && <ShieldCheck className="w-5 h-5 text-green-500" />}
                        {analyzeMutation.data.privacyRisk === 'medium' && <Shield className="w-5 h-5 text-yellow-500" />}
                        {analyzeMutation.data.privacyRisk === 'high' && <ShieldAlert className="w-5 h-5 text-red-500" />}
                        <span className={cn(
                          "font-display font-bold uppercase",
                          analyzeMutation.data.privacyRisk === 'low' ? 'text-green-500' :
                          analyzeMutation.data.privacyRisk === 'medium' ? 'text-yellow-500' : 'text-red-500'
                        )}>
                          {analyzeMutation.data.privacyRisk}
                        </span>
                      </div>
                    </div>

                    {/* Summary */}
                    <div>
                      <h4 className="font-tech text-sm text-primary mb-2 uppercase tracking-widest flex items-center gap-2">
                        <ChevronRight className="w-4 h-4" /> Core Synthesis
                      </h4>
                      <p className="text-white/80 font-sans text-sm leading-relaxed p-4 bg-primary/5 border-l-2 border-primary/50">
                        {analyzeMutation.data.summary}
                      </p>
                    </div>

                    {/* Key Points */}
                    <div>
                      <h4 className="font-tech text-sm text-secondary mb-3 uppercase tracking-widest flex items-center gap-2">
                        <ChevronRight className="w-4 h-4" /> Extracted Vectors
                      </h4>
                      <ul className="space-y-2">
                        {analyzeMutation.data.keyPoints.map((point, i) => (
                          <li key={i} className="flex gap-3 text-sm text-white/70 font-sans items-start p-2 hover:bg-white/5 transition-colors rounded">
                            <span className="text-secondary mt-1 text-[10px]">■</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  // Fallback mock data if API is empty
                  <div className="p-4 bg-primary/10 border border-primary/30 text-primary font-tech">
                    [SYSTEM READY] Awaiting analyze command.
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Just a decorative component
function GlobeWireframe() {
  return (
    <svg viewBox="0 0 100 100" className="w-64 h-64 text-primary/30" fill="none" stroke="currentColor" strokeWidth="0.5">
      <circle cx="50" cy="50" r="48" />
      <ellipse cx="50" cy="50" rx="24" ry="48" />
      <ellipse cx="50" cy="50" rx="12" ry="48" />
      <path d="M 2 50 L 98 50" />
      <path d="M 10 25 L 90 25" />
      <path d="M 10 75 L 90 75" />
    </svg>
  )
}
