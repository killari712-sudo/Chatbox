
"use client";

import { ChatView } from "@/components/views/ChatView";
import { AuthView } from "@/components/views/AuthView";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <p>Loading...</p>
        </div>
    );
  }

  if (!user) {
    return <AuthView />;
  }

  return <ChatView />;
}
