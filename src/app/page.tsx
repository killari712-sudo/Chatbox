
"use client";

import { ChatView } from "@/components/views/ChatView";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { loading } = useAuth();

  if (loading) {
    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <p>Loading...</p>
        </div>
    );
  }

  return <ChatView />;
}
