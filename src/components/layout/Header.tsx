import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SOSButton } from "./SOSButton";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { SidebarTrigger } from "../ui/sidebar";

export function Header({ activeView }: { activeView: string }) {
  const avatarImage = PlaceHolderImages.find(p => p.id === "user-avatar");
  
  const viewTitles: Record<string, string> = {
    dashboard: "Dashboard",
    chat: "AI Chat",
    suggestions: "Proactive Suggestions"
  };

  return (
    <header className="sticky top-0 z-10 flex h-[57px] items-center gap-4 border-b bg-background/60 px-4 backdrop-blur-lg md:px-6">
       <SidebarTrigger className="md:hidden" />
      <h1 className="flex-1 text-xl font-semibold tracking-tight font-headline">
        {viewTitles[activeView] || "EcosystemAI"}
      </h1>
      <div className="flex items-center gap-4">
        <SOSButton />
        <Avatar>
          <AvatarImage src={avatarImage?.imageUrl} alt="User avatar" data-ai-hint="profile picture" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
