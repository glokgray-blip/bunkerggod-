import { Link } from "wouter";
import { MessageSquare, Shield, Lock } from "lucide-react";
import { motion } from "framer-motion";

export default function ChatsList() {
  // Static mock data representing P2P encrypted chats
  const conversations = [
    { id: "c1", name: "Agent K", avatarColor: "bg-blue-500", lastMessage: "Drop point secured. Awaiting signal.", time: "14:23", unread: 2 },
    { id: "c2", name: "ZeroCool", avatarColor: "bg-pink-500", lastMessage: "The mainframe is patched. We need another way.", time: "09:11", unread: 0 },
    { id: "c3", name: "Morpheus", avatarColor: "bg-green-500", lastMessage: "Hack the planet.", time: "Yesterday", unread: 0 },
    { id: "c4", name: "Trinity", avatarColor: "bg-purple-500", lastMessage: "Follow the white rabbit.", time: "Tuesday", unread: 1 },
  ];

  return (
    <div className="min-h-screen pb-24 px-4 pt-12">
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-sm font-tech tracking-[0.2em] text-secondary mb-1">SECURE COMMS</h2>
          <h1 className="text-3xl font-display font-bold">CHATS</h1>
          <div className="w-12 h-1 bg-secondary mt-4 rounded-full shadow-[0_0_10px_rgba(255,0,255,0.5)]" />
        </div>
        <div className="flex items-center gap-1 bg-black/60 border border-secondary/30 px-2 py-1 rounded">
          <Lock className="w-3 h-3 text-secondary" />
          <span className="text-[10px] font-tech text-secondary uppercase">E2E Active</span>
        </div>
      </header>

      {/* Info Banner */}
      <div className="mb-6 p-3 glass border-l-2 border-l-primary flex gap-3 items-start">
        <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-tech text-white uppercase tracking-wider mb-1">Total Anonymity Protocol</h4>
          <p className="text-[10px] font-sans text-muted-foreground leading-relaxed">
            All messages are heavily encrypted and routed through decentralized nodes. Metadata stripped.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {conversations.map((chat, idx) => (
          <motion.div
            key={chat.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            {/* Using a visually disabled link for mock data since we don't have user-to-user chat pages built, but UI is clickable */}
            <div className="p-4 glass-panel border border-white/5 rounded-lg flex items-center gap-4 cursor-pointer hover:bg-white/5 hover:border-white/20 transition-all group">
              <div className="relative">
                <div className={`w-12 h-12 rounded-full ${chat.avatarColor} flex items-center justify-center shadow-lg font-display font-bold text-white text-xl uppercase`}>
                  {chat.name.charAt(0)}
                </div>
                {chat.unread > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(255,0,255,0.8)] border border-black">
                    {chat.unread}
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-display font-bold text-white truncate group-hover:text-secondary transition-colors">
                    {chat.name}
                  </h3>
                  <span className="text-[10px] font-tech text-muted-foreground tracking-wider shrink-0 ml-2">
                    {chat.time}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate font-sans">
                  {chat.lastMessage}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
