import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { User, LogOut, Skull, Shield, Server, Edit3 } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";
import { motion } from "framer-motion";

export default function Profile() {
  const { logout, selfDestruct } = useAuth();
  const [apiUrl, setApiUrl] = useState(localStorage.getItem('bunker_api_url') || 'https://api.bunker.local');
  const [isEditingUrl, setIsEditingUrl] = useState(false);

  const saveApiUrl = () => {
    localStorage.setItem('bunker_api_url', apiUrl);
    setIsEditingUrl(false);
    // In a real app, this would reconfigure the Axios/Fetch instance.
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-12">
      <header className="mb-8 flex justify-between items-start">
        <div>
          <h2 className="text-sm font-tech tracking-[0.2em] text-primary mb-1">OPERATIVE</h2>
          <h1 className="text-3xl font-display font-bold">PROFILE</h1>
        </div>
        <button onClick={logout} className="p-2 border border-white/10 rounded bg-black/50 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors">
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      <div className="space-y-8">
        {/* User Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="p-6 glass rounded-2xl flex items-center gap-6"
        >
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary p-[2px]">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                <User className="w-10 h-10 text-white/50" />
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-black shadow-[0_0_10px_rgba(34,197,94,1)]" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-white mb-1">GHOST_USER</h2>
            <p className="font-tech text-xs text-muted-foreground uppercase tracking-widest">ID: {Math.random().toString(36).substr(2, 8).toUpperCase()}</p>
          </div>
        </motion.div>

        {/* Verification */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <h3 className="font-tech text-sm text-primary uppercase tracking-widest flex items-center gap-2">
            <Shield className="w-4 h-4" /> Identity Verification
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <CyberButton variant="glass" disabled className="opacity-50">
              VK ID (LINKED)
            </CyberButton>
            <CyberButton variant="glass" disabled className="opacity-50">
              YANDEX (LINKED)
            </CyberButton>
          </div>
        </motion.div>

        {/* Settings */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h3 className="font-tech text-sm text-secondary uppercase tracking-widest flex items-center gap-2">
            <Server className="w-4 h-4" /> System Configuration
          </h3>
          
          <div className="p-4 bg-black/40 border border-white/10 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <label className="text-xs font-tech text-white uppercase tracking-wider">API Endpoint</label>
              <button onClick={() => setIsEditingUrl(!isEditingUrl)} className="text-primary hover:text-primary/80">
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
            {isEditingUrl ? (
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={apiUrl} 
                  onChange={(e) => setApiUrl(e.target.value)}
                  className="flex-1 bg-black border border-primary/50 px-3 py-2 text-sm text-primary font-tech focus:outline-none"
                />
                <CyberButton size="sm" onClick={saveApiUrl}>SAVE</CyberButton>
              </div>
            ) : (
              <p className="font-mono text-sm text-muted-foreground truncate">{apiUrl}</p>
            )}
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="pt-8 border-t border-destructive/20"
        >
          <div className="p-6 bg-destructive/5 border border-destructive/30 rounded-xl">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-destructive/20 rounded-full text-destructive">
                <Skull className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display text-destructive font-bold text-lg mb-1">SELF-DESTRUCT</h3>
                <p className="text-xs font-sans text-destructive/70">
                  Wipes all local cache, resets app state, and scrubs stored keys. Action cannot be undone.
                </p>
              </div>
            </div>
            
            <CyberButton 
              variant="destructive" 
              className="w-full"
              onClick={() => {
                if(confirm("INITIATE PROTOCOL ZERO? All local data will be erased.")) {
                  selfDestruct();
                }
              }}
            >
              INITIATE PROTOCOL
            </CyberButton>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
