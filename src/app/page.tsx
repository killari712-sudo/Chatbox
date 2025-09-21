
"use client";

import { AuthView } from "@/components/views/AuthView";
import { ChatView } from "@/components/views/ChatView";
import { AuthProvider, useAuth } from "@/hooks/use-auth";

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (user) {
    return <ChatView />;
  }

  return <AuthView />;
}


export default function Home() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
