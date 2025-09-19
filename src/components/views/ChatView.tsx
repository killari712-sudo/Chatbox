"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import type { Message } from "@/lib/types";
import { getChatResponse } from "@/app/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Loader2, Send, Sparkles } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

export function ChatView() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const avatarImage = PlaceHolderImages.find(p => p.id === "user-avatar");

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
        id: "welcome",
        role: "assistant",
        content: "Hello! How are you feeling today? I'm here to listen."
      }
    ]);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  }

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

  return (
    <div className="h-[calc(100vh-57px)] flex flex-col">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-6 max-w-4xl mx-auto">
          {messages.map((message) => (
            <div key={message.id} className={`flex items-start gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}>
              {message.role === 'assistant' && (
                <Avatar className="w-8 h-8 border">
                  <AvatarFallback><Bot className="w-5 h-5" /></AvatarFallback>
                </Avatar>
              )}
              <div className={`flex flex-col gap-2 max-w-[75%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-3 rounded-2xl animate-bubble-in ${message.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-card text-card-foreground rounded-bl-none shadow-sm'
                    }`}
                >
                  <p>{message.content}</p>
                </div>
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 animate-bubble-in" style={{ animationDelay: '0.2s' }}>
                    {message.suggestions.map((s, i) => (
                      <Badge key={i} variant="secondary" className="cursor-pointer hover:bg-accent" onClick={() => handleSuggestionClick(s)}>{s}</Badge>
                    ))}
                  </div>
                )}
                 {message.resources && (
                    <Card className="glassmorphism w-full animate-bubble-in" style={{ animationDelay: '0.3s' }}>
                        <CardHeader className="p-3">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-primary"/>
                                Suggested Resources
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 pt-0 text-sm">
                            <p>{message.resources}</p>
                        </CardContent>
                    </Card>
                 )}
              </div>
              {message.role === 'user' && (
                <Avatar className="w-8 h-8">
                  <AvatarImage src={avatarImage?.imageUrl} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isPending && (
            <div className="flex items-start gap-4">
                <Avatar className="w-8 h-8 border"><AvatarFallback><Bot className="w-5 h-5" /></AvatarFallback></Avatar>
                <div className="p-3 rounded-2xl bg-card text-card-foreground rounded-bl-none shadow-sm">
                    <Loader2 className="w-5 h-5 animate-spin" />
                </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 bg-background/80 backdrop-blur-lg border-t border-border">
        <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="pr-12 h-12 text-base rounded-full glassmorphism"
            disabled={isPending}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full"
            disabled={isPending || !input.trim()}
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
