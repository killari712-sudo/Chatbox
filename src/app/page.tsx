
"use client";

import { AuthView } from "@/components/views/AuthView";
import { ChatView } from "@/components/views/ChatView";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";


export default function Home() {
  const { user, loading, auth } = useAuth();
  
  useEffect(() => {
    if (!loading && !user) {
        // Here you could redirect or handle unauthenticated users.
        // For now, we'll just show the AuthView.
    }
  }, [user, loading, auth]);

  if (loading) {
    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <p>Loading...</p>
        </div>
    );
  }

  return user ? <ChatView /> : <AuthView />;
}
