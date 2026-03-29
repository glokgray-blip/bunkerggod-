import { Link, useLocation } from "wouter";
import { Users, Globe, MessageSquare, Radio, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function BottomNav() {
  const [location] = useLocation();

  const tabs = [
    { name: "Lobby", path: "/", icon: Users },
    { name: "Net", path: "/browser", icon: Globe },
    { name: "Comms", path: "/chats", icon: MessageSquare },
    { name: "Feed", path: "/feed", icon: Radio },
    { name: "ID", path: "/profile", icon: UserCircle },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 glass-panel pb-safe">
      <nav className="flex justify-around items-center h-16 px-2 max-w-md mx-auto relative">
        {/* Animated indicator background */}
        <div className="absolute inset-0 pointer-events-none flex justify-around">
          {tabs.map((tab) => {
            const isActive = location === tab.path || (tab.path !== "/" && location.startsWith(tab.path));
            return (
              <div key={`bg-${tab.path}`} className="flex-1 flex justify-center items-end pb-1">
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="w-8 h-1 bg-primary rounded-full shadow-[0_0_10px_rgba(0,240,255,0.8)]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {tabs.map((tab) => {
          const isActive = location === tab.path || (tab.path !== "/" && location.startsWith(tab.path));
          const Icon = tab.icon;
          
          return (
            <Link key={tab.path} href={tab.path} className="flex-1 flex flex-col items-center justify-center py-2 relative group z-10">
              <Icon 
                className={cn(
                  "w-6 h-6 mb-1 transition-all duration-300",
                  isActive 
                    ? "text-primary drop-shadow-[0_0_8px_rgba(0,240,255,0.8)] scale-110" 
                    : "text-muted-foreground group-hover:text-primary/70"
                )} 
              />
              <span className={cn(
                "text-[10px] font-tech font-bold uppercase tracking-wider transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {tab.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
