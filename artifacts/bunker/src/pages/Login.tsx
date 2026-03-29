import { useAuth } from "@/hooks/use-auth";
import { CyberButton } from "@/components/ui/cyber-button";
import { Fingerprint, Shield, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const { login } = useAuth();

  return (
    <div className="min-h-screen w-full relative flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-40 mix-blend-screen"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}images/cyber-bg.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-10" />

      <div className="relative z-20 w-full max-w-sm px-6 flex flex-col items-center">
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-12 flex flex-col items-center"
        >
          <div className="w-32 h-32 mb-6 relative">
            <div className="absolute inset-0 animate-pulse bg-primary/20 rounded-full blur-2xl" />
            <img 
              src={`${import.meta.env.BASE_URL}images/bunker-logo.png`} 
              alt="BUNKER Logo" 
              className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]"
            />
          </div>
          
          <h1 className="text-6xl font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-primary neon-text-blue mb-2">
            BUNKER
          </h1>
          <p className="font-tech text-secondary font-bold tracking-[0.3em] uppercase text-sm neon-text-pink text-center">
            Maximum Privacy.<br/>Zero Compromise.
          </p>
        </motion.div>

        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="w-full space-y-4 glass p-8 rounded-xl border-t border-primary/50 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
          
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-tech text-xs tracking-widest text-muted-foreground uppercase">Secure Node Authentication</span>
          </div>

          <CyberButton 
            className="w-full flex items-center justify-center gap-3" 
            onClick={() => login('VK')}
          >
            <Zap className="w-4 h-4" />
            INITIATE VK LINK
          </CyberButton>

          <CyberButton 
            variant="secondary" 
            className="w-full flex items-center justify-center gap-3"
            onClick={() => login('Yandex')}
          >
            <Fingerprint className="w-4 h-4" />
            YANDEX BIOMETRICS
          </CyberButton>
        </motion.div>
      </div>
    </div>
  );
}
