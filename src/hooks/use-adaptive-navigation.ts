"use client";

import { useState, useEffect, useCallback } from 'react';
import type { NavItem } from '@/lib/types';
import { LayoutDashboard, MessagesSquare, Lightbulb } from 'lucide-react';

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', title: 'Dashboard', icon: LayoutDashboard, href: '#' },
  { id: 'chat', title: 'Chat', icon: MessagesSquare, href: '#' },
  { id: 'suggestions', title: 'Suggestions', icon: Lightbulb, href: '#' },
];

const STORAGE_KEY = 'ecosystemAI-nav-frequency';

export function useAdaptiveNavigation() {
  const [navItems, setNavItems] = useState(NAV_ITEMS);

  useEffect(() => {
    try {
      const storedFrequencies = localStorage.getItem(STORAGE_KEY);
      if (storedFrequencies) {
        const frequencies: Record<string, number> = JSON.parse(storedFrequencies);
        const sortedItems = [...NAV_ITEMS].sort((a, b) => {
          const freqA = frequencies[a.id] || 0;
          const freqB = frequencies[b.id] || 0;
          return freqB - freqA;
        });
        setNavItems(sortedItems);
      }
    } catch (error) {
      console.error("Failed to load or parse navigation frequencies from localStorage", error);
    }
  }, []);

  const recordInteraction = useCallback((itemId: string) => {
    try {
      const storedFrequencies = localStorage.getItem(STORAGE_KEY);
      const frequencies: Record<string, number> = storedFrequencies ? JSON.parse(storedFrequencies) : {};
      
      frequencies[itemId] = (frequencies[itemId] || 0) + 1;
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(frequencies));

      const sortedItems = [...navItems].sort((a, b) => {
        const freqA = frequencies[a.id] || 0;
        const freqB = frequencies[b.id] || 0;
        return freqB - freqA;
      });
      setNavItems(sortedItems);
    } catch (error) {
      console.error("Failed to update navigation frequencies in localStorage", error);
    }
  }, [navItems]);

  return { navItems, recordInteraction };
}
