
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
  AlertTriangle,
  BarChart3,
  BookOpen,
  Bot,
  GraduationCap,
  HeartPulse,
  HelpCircle,
  Home,
  Loader2,
  Map,
  MessageSquare,
  Mic,
  NotebookPen,
  Paperclip,
  Route,
  Send,
  Users,
  X,
} from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DiaryView } from "./DiaryView";
import { QueryHubView } from "./QueryHubView";
import { WellnessView } from "./WellnessView";
import { MentorView } from "./MentorView";
import { useAuth } from "@/hooks/useAuth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { HabitBuilderView } from "./HabitBuilderView";
import { RoadmapsView } from "./RoadmapsView";


export function ChatView() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const [activeView, setActiveView] = useState("Home");
  const [isVoiceOverlayVisible, setVoiceOverlayVisible] = useState(false);
  const [isSosOverlayVisible, setSosOverlayVisible] = useState(false);
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);
  const { user, auth } = useAuth();

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const userAvatar = PlaceHolderImages.find((p) => p.id === "user-avatar");
  const aiAvatar = PlaceHolderImages.find((p) => p.id === "ai-avatar");


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

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google: ", error);
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
      { type: 'item', icon: Home, label: 'Home', tooltip: 'Return to the main chat view.' },
      { type: 'divider', label: 'Productivity' },
      { type: 'item', icon: Map, label: 'Roadmaps', tooltip: 'View your personalized goals and progress.' },
      { type: 'item', icon: BarChart3, label: 'Habit Builder', tooltip: "Build and track your habits." },
      { type: 'divider', label: 'Wellness' },
      { type: 'item', icon: NotebookPen, label: 'Diary', tooltip: 'Your private, encrypted journal.' },
      { type: 'item', icon: HeartPulse, label: 'Wellness', tooltip: 'Monitor your wellness metrics.' },
      { type: 'divider', label: 'Community' },
      { type: 'item', icon: MessageSquare, label: 'Query Hub', tooltip: 'Ask questions and get answers from the community.' },
      { type: 'divider', label: 'Settings' },
      { type: 'item', icon: Bot, label: 'Avatar & Voice', tooltip: 'Customize your AI assistant.' },
      { type: 'item', icon: AlertOctagon, label: 'SOS Crisis', isSOS: true, tooltip: 'Immediate crisis support.' }
  ];

  const handleSidebarClick = (item: (typeof sidebarItems)[number]) => {
    if (item.type !== 'item') return;

    if (item.isSOS) {
      setSosOverlayVisible(true);
    } else {
      setActiveView(item.label);
    }
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

  const suggestionButtons = [
    { label: 'Query Hub', icon: HelpCircle, view: 'Query Hub' },
    { label: 'Diary', icon: NotebookPen, view: 'Diary' },
    { label: 'Wellness', icon: HeartPulse, view: 'Wellness' },
    { label: 'Habit Builder', icon: BarChart3, view: 'Habit Builder' },
    { label: 'Mentors', icon: GraduationCap, view: 'Mentors' },
  ];

  const renderActiveView = () => {
    switch (activeView) {
      case 'Home':
        return (
          <div id="chat-view" className="flex flex-col h-full overflow-hidden p-4 md:p-6">
             <div className="w-full flex-shrink-0 pb-4">
              <div className="flex justify-center gap-2 max-w-2xl mx-auto">
                {suggestionButtons.map((btn) => {
                  const Icon = btn.icon;
                  return (
                    <button
                      key={btn.label}
                      onClick={() => setActiveView(btn.view)}
                      className="suggestion-button flex-col h-auto py-2 px-3 text-xs"
                    >
                      <Icon className="w-5 h-5 mb-1" />
                      <span>{btn.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <ScrollArea id="chat-container" className="flex-grow w-full max-w-4xl mx-auto pr-4" ref={scrollAreaRef}>
              {messages.length === 0 && !isPending ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <h2 className="text-2xl font-semibold text-gray-600 mb-6">What can I help with?</h2>
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
                      {message.role === 'user' && user && user.photoURL && (
                           <Image src={user.photoURL} alt="User Avatar" width={40} height={40} className="w-10 h-10 rounded-full" />
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
    <TooltipProvider delayDuration={0}>
      <div className="h-screen w-screen flex flex-col font-body text-gray-800">
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
            <div className="relative">
                {user ? (
                   <div className="flex items-center gap-3">
                        {user.photoURL && <Image src={user.photoURL} alt="Avatar" width={32} height={32} className="w-8 h-8 rounded-full" />}
                        <span className="font-semibold text-gray-700 hidden sm:inline">{user.displayName}</span>
                   </div>
                ) : (
                    <Button onClick={handleSignIn} size="sm" className="rounded-full bg-blue-500 hover:bg-blue-600 text-white">
                        <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px" height="48px">
                            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.28-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                        </svg>
                        Sign in with Google
                    </Button>
                )}
            </div>
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
              className="group flex-shrink-0 w-20 hover:w-64 bg-white/30 backdrop-blur-lg border-l h-full overflow-y-auto overflow-x-hidden p-2 transition-all duration-300 ease-in-out"
            >
              <nav className="flex flex-col gap-2">
                  {sidebarItems.map((item, index) => {
                    if (item.type === 'divider') {
                      return (
                        <div key={index} className="flex items-center gap-4 px-4 py-2 transition-opacity duration-300">
                          <div className="h-px bg-gray-300/80 w-6 flex-shrink-0"></div>
                          <span className={`text-xs text-gray-500 uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${isSidebarExpanded ? 'opacity-100' : 'opacity-0'}`}>{item.label}</span>
                        </div>
                      )
                    }
                    const Icon = item.icon;
                    const button = (
                       <button
                          onClick={(e) => { handleSidebarClick(item); handleRipple(e); }}
                          className={`w-full h-14 flex items-center justify-start gap-4 px-4 rounded-full text-gray-600 hover:text-blue-600 ripple-btn ${item.isSOS ? 'hover:bg-red-500/10 text-red-500 hover:text-red-600' : 'hover:bg-blue-500/10'}`}
                        >
                          <Icon className="w-6 h-6 flex-shrink-0" />
                          <span className={`font-medium whitespace-nowrap transition-all duration-300 ${isSidebarExpanded ? 'opacity-100' : 'opacity-0'}`}>{item.label}</span>
                        </button>
                    );
                    return (
                      <Tooltip key={index}>
                        <TooltipTrigger asChild>
                          {button}
                        </TooltipTrigger>
                        {!isSidebarExpanded && (
                          <TooltipContent side="left" className="bg-gray-800 text-white font-semibold">
                            <p>{item.tooltip}</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    )
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
                  <AlertTriangle className="w-20 h-20 text-red-500 mx-auto animate-pulse" />
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
    </TooltipProvider>
  );
}

    
    

    
