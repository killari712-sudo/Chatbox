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

export type WellnessMetric = {
    date: string; // YYYY-MM-DD
    calories?: number;
    sleep?: number; // hours
    hydration?: number; // cups
    heartRate?: number; // bpm
    steps?: number;
    mood?: string;
};

export type WellnessGoal = {
    id: string;
    text: string;
    progress: number; // 0 to 1
    category: string;
};
