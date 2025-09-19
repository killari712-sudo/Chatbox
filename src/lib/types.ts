import type { LucideIcon } from "lucide-react";

export type NavItem = {
  id: string;
  title: string;
  icon: LucideIcon;
  href: string;
};

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
  resources?: string;
};
