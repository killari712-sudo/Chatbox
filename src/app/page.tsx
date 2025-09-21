
"use client";

import { ChatView } from "@/components/views/ChatView";
import { AuthProvider } from "@/hooks/use-auth";

export default function Home() {
  return (
    <AuthProvider>
      <ChatView />
    </AuthProvider>
  );
}
