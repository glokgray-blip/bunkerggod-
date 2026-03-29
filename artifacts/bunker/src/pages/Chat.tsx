import { useState, useRef, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { 
  useGetMessages, 
  useSendMessage, 
  useBurnHistory, 
  useListCharacters 
} from "@workspace/api-client-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Flame, ChevronLeft, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { CyberButton } from "@/components/ui/cyber-button";

export default function Chat() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  
  // Local optimistic state for chat
  const [localMessages, setLocalMessages] = useState<any[]>([]);

  // Fetch character details
  const { data: characters } = useListCharacters();
  const character = characters?.find(c => c.id === id) || { name: "Unknown Entity", id };

  // API Hooks
  const { data: apiMessages, refetch } = useGetMessages(id || "", {
    query: { retry: 1, enabled: !!id }
  });
  
  const sendMessageMutation = useSendMessage({
    mutation: {
      onSuccess: (newMessage) => {
        setLocalMessages(prev => [...prev, newMessage]);
        refetch();
      }
    }
  });

  const burnHistoryMutation = useBurnHistory({
    mutation: {
      onSuccess: () => {
        setLocalMessages([]);
        refetch();
      }
    }
  });

  // Sync local state with API when it loads
  useEffect(() => {
    if (apiMessages && apiMessages.length > 0 && localMessages.length === 0) {
      setLocalMessages(apiMessages);
    }
  }, [apiMessages]);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [localMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !id) return;

    const userMsg = {
      id: Date.now().toString(),
      characterId: id,
      content: input,
      role: "user",
      timestamp: new Date().toISOString()
    };
    
    setLocalMessages(prev => [...prev, userMsg]);
    setInput("");

    sendMessageMutation.mutate({
      characterId: id,
      data: { content: userMsg.content }
    });
  };

  const handleBurn = () => {
    if (!id) return;
    if (confirm("WARNING: Irreversible action. Burn all comms history?")) {
      burnHistoryMutation.mutate({ characterId: id });
    }
  };

  // Mock messages if empty and no API (for demo aesthetics)
  const displayMessages = localMessages.length > 0 ? localMessages : [
    { id: '1', role: 'assistant', content: `Connection established. I am ${character.name}. State your directive.`, timestamp: new Date().toISOString() }
  ];

  return (
    <div className="flex flex-col h-screen bg-black relative">
      {/* Background Matrix/Grid */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(0,240,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.5)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

      {/* Top Header */}
      <header className="glass-panel border-b border-primary/20 p-4 flex items-center justify-between z-10 sticky top-0">
        <button onClick={() => setLocation('/')} className="p-2 -ml-2 text-muted-foreground hover:text-primary transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <div className="flex flex-col items-center">
          <h2 className="font-display font-bold text-lg text-white neon-text-blue tracking-widest uppercase">
            {character.name}
          </h2>
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="w-3 h-3 text-green-400" />
            <span className="text-[10px] font-tech text-green-400 tracking-widest uppercase">Encrypted Comm</span>
          </div>
        </div>

        <button 
          onClick={handleBurn}
          disabled={burnHistoryMutation.isPending}
          className="p-2 -mr-2 text-destructive/70 hover:text-destructive hover:drop-shadow-[0_0_8px_rgba(255,0,0,0.8)] transition-all group relative"
          title="BURN HISTORY"
        >
          <Flame className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <span className="absolute -bottom-4 right-0 text-[8px] font-tech opacity-0 group-hover:opacity-100 text-destructive whitespace-nowrap">BURN</span>
        </button>
      </header>

      {/* Message List */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 z-10 scroll-smooth">
        <div className="text-center my-6">
          <p className="inline-block px-3 py-1 bg-black/60 border border-primary/20 rounded text-[10px] font-tech text-primary/60 uppercase tracking-widest">
            SESSION INITIATED
          </p>
        </div>

        <AnimatePresence initial={false}>
          {displayMessages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: isUser ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "flex w-full",
                  isUser ? "justify-end" : "justify-start"
                )}
              >
                <div className={cn(
                  "max-w-[80%] p-3 border relative group",
                  isUser 
                    ? "bg-primary/10 border-primary/30 rounded-l-xl rounded-tr-xl" 
                    : "bg-secondary/10 border-secondary/30 rounded-r-xl rounded-tl-xl"
                )}>
                  {/* Cyberpunk accent corner */}
                  <div className={cn(
                    "absolute w-2 h-2 border-t border-current top-0",
                    isUser ? "right-0 border-r" : "left-0 border-l",
                    isUser ? "text-primary" : "text-secondary"
                  )} />
                  
                  <p className="text-sm text-white/90 font-sans leading-relaxed break-words">
                    {msg.content}
                  </p>
                  <p className={cn(
                    "text-[10px] font-tech tracking-wider mt-2 opacity-50 text-right",
                    isUser ? "text-primary" : "text-secondary"
                  )}>
                    {format(new Date(msg.timestamp), 'HH:mm:ss')}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {sendMessageMutation.isPending && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
             <div className="px-4 py-2 bg-secondary/5 border border-secondary/20 rounded-r-xl rounded-tl-xl flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
             </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 glass-panel border-t border-primary/20 z-10 pb-safe">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="[ ENTER DIRECTIVE ]"
            className="flex-1 bg-black/50 border border-primary/30 rounded-none px-4 py-3 text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 font-tech uppercase tracking-wider transition-all"
          />
          <CyberButton 
            type="submit" 
            size="icon" 
            disabled={!input.trim() || sendMessageMutation.isPending}
            className="rounded-none h-auto w-14"
          >
            <Send className="w-5 h-5" />
          </CyberButton>
        </form>
      </div>
    </div>
  );
}
