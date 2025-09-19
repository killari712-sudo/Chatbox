"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import type { Message } from "@/lib/types";
import { getChatResponse } from "@/app/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bot,
  Loader2,
  Send,
  Mic,
  Paperclip,
  Home,
  Map,
  BarChart,
  Flame,
  Swords,
  Pencil,
  Heart,
  Book,
  Users,
} from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function ChatView() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const avatarImage = PlaceHolderImages.find((p) => p.id === "user-avatar");

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  useEffect(() => {
    document.documentElement.setAttribute("data-mood", "neutral");
    setMessages([
      {
        id: "1",
        role: "assistant",
        content:
          "Hello! Welcome to your personal ecosystem. How can I assist you today?",
      },
      {
        id: "2",
        role: "user",
        content: "Hey! Just wanted to check my progress for the day.",
      },
      {
        id: "3",
        role: "assistant",
        content:
          "Of course. You've completed 3 of your 5 habits and maintained a 14-day streak. Your wellness score is up by 5% since yesterday. Fantastic work!",
      },
    ]);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
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
        if (result.mood) {
          document.documentElement.setAttribute("data-mood", result.mood);
        }
      }
    });
  };

  const navItems = [
    {
      group: null,
      items: [{ icon: Home, label: "Home" }],
    },
    {
      group: "PRODUCTIVITY",
      items: [
        { icon: Map, label: "Roadmaps" },
        { icon: BarChart, label: "My Journey" },
        { icon: Flame, label: "Habits" },
        { icon: Swords, label: "Challenges" },
      ],
    },
    {
      group: "WELLNESS",
      items: [
        { icon: Pencil, label: "Diary" },
        { icon: Heart, label: "Wellness" },
        { icon: Book, label: "Resources" },
      ],
    },
    {
      group: "COMMUNITY",
      items: [{ icon: Users, label: "Support Circles" }],
    },
  ];

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex h-screen bg-background text-foreground">
        <div className="w-16 flex flex-col items-center py-4 bg-card/30 border-r">
          <div className="p-2 rounded-lg bg-white mb-4">
            <Bot className="h-8 w-8 text-black" />
          </div>
        </div>
        <div className="flex flex-1 flex-col">
          <header className="flex h-[60px] items-center justify-between border-b bg-card/30 px-6">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold">Ecosystem</h1>
            </div>
          </header>
          <div className="flex-1 flex overflow-hidden">
            <main className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
                <div className="space-y-6 max-w-4xl mx-auto">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start gap-4 ${
                        message.role === "user" ? "justify-end" : ""
                      }`}
                    >
                      {message.role === "assistant" && (
                        <p className="text-sm font-semibold">AI</p>
                      )}
                      <div
                        className={`flex flex-col gap-2 max-w-[75%] ${
                          message.role === "user"
                            ? "items-end"
                            : "items-start"
                        }`}
                      >
                        <div
                          className={`p-4 rounded-lg animate-bubble-in ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-card"
                          }`}
                        >
                          <p>{message.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isPending && (
                    <div className="flex items-start gap-4">
                      <p className="text-sm font-semibold">AI</p>
                      <div className="p-4 rounded-lg bg-card">
                        <Loader2 className="w-5 h-5 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              <div className="p-4 bg-transparent">
                <div className="relative max-w-4xl mx-auto">
                  <form onSubmit={handleSubmit}>
                    <Paperclip className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      value={input}
                      onChange={handleInputChange}
                      placeholder="Type your message..."
                      className="h-14 pl-12 pr-24 rounded-full bg-card border-border text-base"
                      disabled={isPending}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        disabled
                      >
                        <Mic className="h-5 w-5" />
                      </Button>
                      <Button
                        type="submit"
                        size="icon"
                        className="w-10 h-10 rounded-full"
                        disabled={isPending || !input.trim()}
                      >
                        <Send className="w-5 h-5" />
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </main>
            <Sidebar side="right" collapsible="icon">
              <SidebarHeader className="p-2 border-b">
                <Avatar className="w-full h-10 border">
                  {avatarImage && (
                    <AvatarImage
                      src={avatarImage.imageUrl}
                      alt={avatarImage.description}
                      width={40}
                      height={40}
                      data-ai-hint={avatarImage.imageHint}
                    />
                  )}
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
              </SidebarHeader>
              <SidebarContent className="p-2">
                <SidebarMenu>
                  {navItems.map((group, groupIndex) => (
                    <SidebarGroup key={groupIndex} className="p-0">
                      {group.group && (
                        <SidebarGroupLabel className="px-2 text-xs uppercase tracking-wider text-muted-foreground">
                          {group.group}
                        </SidebarGroupLabel>
                      )}
                      {group.items.map((item, itemIndex) => (
                        <SidebarMenuItem key={itemIndex}>
                          <SidebarMenuButton
                            tooltip={item.label}
                            className="justify-start"
                          >
                            <item.icon className="shrink-0" />
                            <span>{item.label}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarGroup>
                  ))}
                </SidebarMenu>
              </SidebarContent>
            </Sidebar>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
