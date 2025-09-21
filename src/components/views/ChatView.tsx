
"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import type { Message } from "@/lib/types";
import { getChatResponse } from "@/app/actions";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertOctagon,
  Bot,
  ChevronDown,
  Home,
  Loader2,
  LogOut,
  Map,
  Mic,
  Paperclip,
  Send,
  Users,
  X,
  NotebookPen,
  HeartPulse,
  MessageSquare,
  BarChart3,
  LogIn,
  HelpCircle,
  Phone,
} from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { DiaryView } from "./DiaryView";
import { QueryHubView } from "./QueryHubView";
import { WellnessView } from "./WellnessView";
import { MentorView } from "./MentorView";
import { HabitBuilderView } from "./HabitBuilderView";
import { RoadmapsView } from "./RoadmapsView";
import { FriendFinderView } from "./FriendFinderView";
import { useAuth } from "@/hooks/use-auth";
import { AuthView } from "./AuthView";
import { AvatarVoiceView } from "./AvatarVoiceView";


export function ChatView() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const [activeView, setActiveView] = useState("Home");
  const [isVoiceOverlayVisible, setVoiceOverlayVisible] = useState(false);
  const [isSosOverlayVisible, setSosOverlayVisible] = useState(false);
  const [isSidebarExpanded, setSidebarExpanded] = useState(true);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { user, signOut, loading } = useAuth();
  
  const userIsAnonymous = user?.isAnonymous;
  const userAvatarUrl = user && !userIsAnonymous ? user.photoURL : null;
  const guestAvatar = PlaceHolderImages.find((p) => p.id === "user-avatar");
  const userAvatar = userAvatarUrl ? {imageUrl: userAvatarUrl, id: "user-avatar"} : guestAvatar;
  const aiAvatar = PlaceHolderImages.find((p) => p.id === "ai-avatar");

  useEffect(() => {
    if (!loading && !user) {
      // User is a guest, they can continue using the app
    }
  }, [user, loading]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize textarea
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }


    startTransition(async () => {
      const result = await getChatResponse(input);
      if (result.error) {
        const errorMessage: Message = {
          id: Date.now().toString() + "-error",
          role: "assistant",
          content: result.error,
        };
        setMessages((prev) => [...prev, errorMessage]);
      } else {
        const assistantMessage: Message = {
          id: Date.now().toString() + "-assistant",
          role: "assistant",
          content: result.aiResponse!,
          suggestions: result.suggestions,
          resources: result.resources,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    });
  };

  const sidebarItems = [
      { type: 'item', icon: Home, label: 'Home' },
      { type: 'divider' },
      { type: 'item', icon: Map, label: 'Roadmaps' },
      { type: 'item', icon: BarChart3, label: 'Habit Builder' },
      { type: 'divider' },
      { type: 'item', icon: NotebookPen, label: 'Diary' },
      { type: 'item', icon: HeartPulse, label: 'Wellness' },
      { type: 'divider' },
      { type: 'item', icon: MessageSquare, label: 'Query Hub' },
      { type: 'item', icon: Users, label: 'Support' },
      { type: 'divider' },
      { type: 'item', icon: Bot, label: 'Avatar & Voice' },
      { type: 'item', icon: AlertOctagon, label: 'SOS Crisis', isSOS: true }
  ];

  const handleSidebarClick = (item: (typeof sidebarItems)[number]) => {
    if (item.type !== 'item') return;
  
    if (item.isSOS) {
      setSosOverlayVisible(true);
      return;
    }
    
    setActiveView(item.label);
  };

  const handleRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    const btn = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
    ripple.className = 'ripple';

    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'Home':
        return (
          <div id="chat-view" className="flex flex-col h-full overflow-hidden p-4 md:p-6">
            <ScrollArea id="chat-container" className="flex-grow w-full max-w-4xl mx-auto pr-4" ref={scrollAreaRef}>
              {messages.length === 0 && !isPending ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <h2 className="text-2xl font-semibold text-gray-600 mb-6">What can I help with?</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
                    <button className="suggestion-button" onClick={() => setActiveView('Query Hub')}>
                      <HelpCircle className="w-6 h-6 text-blue-500"/>
                      <span>Query Hub</span>
                    </button>
                    <button className="suggestion-button" onClick={() => setActiveView('Support')}>
                      <Users className="w-6 h-6 text-green-500"/>
                      <span>Support</span>
                    </button>
                    <button className="suggestion-button" onClick={() => setActiveView('Diary')}>
                      <NotebookPen className="w-6 h-6 text-purple-500"/>
                      <span>Diary</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex w-full items-start gap-3 animate-bubble-in ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {message.role === 'assistant' && aiAvatar && (
                          <Image src={aiAvatar.imageUrl} alt="AI Avatar" width={40} height={40} className="w-10 h-10 rounded-full border-2 border-gray-300" />
                      )}
                      <div className={`max-w-md md:max-w-lg p-3 px-4 rounded-2xl ${message.role === 'user' ? 'bg-blue-500 text-white rounded-br-lg' : 'bg-white/80 rounded-bl-lg'}`}>
                          <p>{message.content}</p>
                      </div>
                      {message.role === 'user' && userAvatar && (
                           <Image src={userAvatar.imageUrl} alt="User Avatar" width={40} height={40} className="w-10 h-10 rounded-full" />
                      )}
                    </div>
                  ))}
                  {isPending && (
                    <div className="flex items-start gap-4 animate-bubble-in">
                      {aiAvatar && <Image src={aiAvatar.imageUrl} alt="AI Avatar" width={40} height={40} className="w-10 h-10 rounded-full border-2 border-gray-300" />}
                      <div className="p-4 rounded-lg bg-white/80">
                        <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
          </div>
        );
      case 'Diary':
        return <DiaryView />;
      case 'Query Hub':
        return <QueryHubView />;
      case 'Wellness':
        return <WellnessView />;
      case 'Mentors':
        return <MentorView onNavigate={setActiveView} />;
      case 'Habit Builder':
        return <HabitBuilderView />;
      case 'Roadmaps':
        return <RoadmapsView onNavigate={setActiveView} />;
      case 'Support':
        return <FriendFinderView onNavigate={setActiveView} />;
      case 'Avatar & Voice':
        return <AvatarVoiceView />;
      default:
        return (
            <div className="absolute inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center p-8">
                <div className="glassmorphic-dark glowing-edge rounded-2xl p-8 max-w-3xl w-full">
                    <h2 className="text-3xl font-bold font-headline text-blue-800 mb-4">{activeView}</h2>
                    <p className="text-gray-600">This is the placeholder content for the {activeView} section. Dashboards, charts, and other components would be rendered here.</p>
                </div>
            </div>
        );
    }
  };


  return (
      <div className="h-screen w-screen flex flex-col font-body text-gray-800">
        <AuthView open={isAuthModalOpen} onOpenChange={setAuthModalOpen} />
        {/* TOP BAR */}
        <header className="w-full h-16 flex-shrink-0 flex items-center justify-between px-6 glassmorphic border-b z-30">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveView('Home')}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 7L12 12L22 7" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 12V22" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="font-bold text-lg font-headline text-gray-800">EcosystemAI</span>
            </div>
            {loading ? (
                <div className="h-8 w-24 bg-gray-200 animate-pulse rounded-md"></div>
            ) : user ? (
              <div className="flex items-center gap-4">
                  {userAvatar && <Image src={userAvatar.imageUrl} alt="User Avatar" width={40} height={40} className="rounded-full" />}
                  <div className="text-sm">
                    <div className="font-semibold">{user.isAnonymous ? 'Guest User' : user.displayName || 'User'}</div>
                    <div className="text-gray-500">{!user.isAnonymous && user.email}</div>
                  </div>
                  <Button onClick={signOut} variant="outline" size="sm">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                  </Button>
              </div>
            ) : (
                <div className="flex items-center gap-2">
                    <Button onClick={() => setAuthModalOpen(true)} size="sm">
                        <LogIn className="mr-2 h-4 w-4"/>
                        Sign In / Sign Up
                    </Button>
                </div>
            )}
        </header>

        {/* MAIN CONTAINER */}
        <div className="flex flex-grow overflow-hidden">
            {/* CENTER PANEL */}
            <main className="flex-grow flex flex-col h-full relative">
                {renderActiveView()}

                {/* CHAT INPUT BAR - Only show if Home is active */}
                {activeView === 'Home' && (
                  <div className="w-full flex-shrink-0 px-4 md:px-6 pb-4 md:pb-6 pt-2">
                    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto glassmorphic-dark glowing-edge rounded-full p-1 flex items-center gap-2 shadow-2xl shadow-black/10">
                        <Button type="button" variant="ghost" size="icon" className="w-8 h-8 rounded-full flex-shrink-0 hover:bg-blue-500/10">
                          <Paperclip className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Textarea
                          ref={inputRef}
                          value={input}
                          onChange={handleInputChange}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSubmit(e as any);
                            }
                          }}
                          rows={1}
                          placeholder="Type your message..."
                          className="w-full bg-transparent focus:outline-none text-gray-800 placeholder-gray-500 max-h-40 py-1.5 border-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none overflow-hidden text-sm"
                          disabled={isPending}
                        />
                        <Button type="button" onClick={() => {}} variant="ghost" size="icon" className="w-8 h-8 rounded-full flex-shrink-0 hover:bg-blue-500/10">
                          <Bot className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button type="button" onClick={() => setVoiceOverlayVisible(true)} variant="ghost" size="icon" className="w-8 h-8 rounded-full flex-shrink-0 hover:bg-blue-500/10">
                          <Mic className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button type="submit" size="icon" className="w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30 text-white flex-shrink-0" disabled={isPending || !input.trim()}>
                          <Send className="w-4 h-4" />
                        </Button>
                    </form>
                  </div>
                )}
            </main>
            
            {/* RIGHT SIDEBAR */}
            <aside 
              onMouseEnter={() => setSidebarExpanded(true)}
              onMouseLeave={() => setSidebarExpanded(false)}
              className="group flex-shrink-0 w-20 hover:w-64 bg-white/30 backdrop-blur-lg border-l h-full flex flex-col p-2 transition-all duration-300 ease-in-out"
            >
              <nav className="flex flex-col gap-2 flex-grow">
                  {sidebarItems.map((item, index) => {
                    if (item.type === 'divider') {
                      return (
                        <div key={index} className="flex items-center gap-4 px-4 py-2 transition-opacity duration-300">
                          <div className="h-px bg-gray-300/80 w-full flex-shrink-0"></div>
                        </div>
                      )
                    }
                    const Icon = item.icon;
                    return (
                       <button
                          key={index}
                          onClick={(e) => { handleSidebarClick(item); handleRipple(e); }}
                          className={`w-full h-14 flex items-center justify-start gap-4 px-4 rounded-full text-gray-600 hover:text-blue-600 ripple-btn ${item.isSOS ? 'hover:bg-red-500/10 text-red-500 hover:text-red-600' : 'hover:bg-blue-500/10'}`}
                        >
                          <Icon className="w-6 h-6 flex-shrink-0" />
                          <span className={`font-medium whitespace-nowrap transition-all duration-300 ${isSidebarExpanded ? 'opacity-100' : 'opacity-0'}`}>{item.label}</span>
                        </button>
                    );
                  })}
              </nav>
            </aside>
        </div>
        
        {/* OVERLAYS */}

        {isVoiceOverlayVisible && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-xl z-50 flex flex-col items-center justify-center">
              <div style={{animation: 'avatar-float 5s ease-in-out infinite'}}>
                <div className="absolute inset-0 bg-blue-400 rounded-full blur-3xl opacity-40"></div>
                {aiAvatar && <Image src={aiAvatar.imageUrl} alt="Assistant Avatar" width={144} height={144} className="w-36 h-36 rounded-full border-4 border-blue-400 shadow-2xl shadow-blue-500/50" />}
              </div>
              <p className="mt-8 text-2xl font-medium text-gray-600 tracking-wider">Listening...</p>
              <Button onClick={() => setVoiceOverlayVisible(false)} variant="ghost" size="icon" className="absolute top-8 right-8 text-gray-500 hover:text-gray-800 w-10 h-10">
                <X className="w-8 h-8" />
              </Button>
          </div>
        )}

        {isSosOverlayVisible && (
          <div className="fixed inset-0 bg-red-100/50 backdrop-blur-2xl z-50 flex items-center justify-center p-4">
              <div className="glassmorphic bg-red-500/10 border-red-500/30 rounded-3xl p-8 md:p-12 text-center max-w-lg w-full">
                  <AlertOctagon className="w-20 h-20 text-red-500 mx-auto animate-pulse" />
                  <h2 className="text-4xl md:text-5xl font-bold font-headline mt-6 text-red-900">Crisis Alert</h2>
                  <p className="text-red-800 mt-4 max-w-sm mx-auto">You've activated the SOS protocol. Help is being notified. Please stay calm.</p>
                  <Button className="mt-10 bg-red-600/80 border-2 border-red-400 text-white font-bold text-xl py-4 px-10 rounded-full transition-transform hover:scale-105 h-auto" style={{animation: 'pulse-glow 2s infinite'}}>
                    Connect to Support
                  </Button>
                  <Button onClick={() => setSosOverlayVisible(false)} variant="link" className="mt-6 text-red-700 hover:text-red-900">
                    Cancel Alert
                  </Button>
              </div>
          </div>
        )}
      </div>
  );
}

    