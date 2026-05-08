import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { AnimatePresence, motion } from "framer-motion";

import { BottomNav } from "@/components/layout/BottomNav";
import Login from "@/pages/Login";
import Characters from "@/pages/Characters";
import Chat from "@/pages/Chat";
import Browser from "@/pages/Browser";
import ChatsList from "@/pages/ChatsList";
import Feed from "@/pages/Feed";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 relative">
      <div className="scanlines" />
      <main className="mx-auto max-w-md bg-black min-h-screen shadow-2xl relative overflow-x-hidden z-10">
        {children}
      </main>
    </div>
  );
}

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedLayout>
      {children}
      <BottomNav />
    </ProtectedLayout>
  );
}

function Router() {
  const { isAuthenticated } = useAuth();
  const [location] = useLocation();

  if (!isAuthenticated) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="login"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Login />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.split("/")[1] || "root"}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <Switch location={location}>
          <Route path="/">
            <MainLayout><Characters /></MainLayout>
          </Route>
          <Route path="/browser">
            <MainLayout><Browser /></MainLayout>
          </Route>
          <Route path="/chats">
            <MainLayout><ChatsList /></MainLayout>
          </Route>
          <Route path="/feed">
            <MainLayout><Feed /></MainLayout>
          </Route>
          <Route path="/profile">
            <MainLayout><Profile /></MainLayout>
          </Route>

          {/* Detail Views without bottom nav */}
          <Route path="/chat/:id">
            <ProtectedLayout><Chat /></ProtectedLayout>
          </Route>

          <Route component={NotFound} />
        </Switch>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
