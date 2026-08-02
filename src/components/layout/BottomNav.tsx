'use client';

import React from 'react';
import { LayoutDashboard, Camera, CheckSquare, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TabType = 'dashboard' | 'nutrition' | 'habits' | 'weekly';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    {
      id: 'dashboard' as TabType,
      label: 'Übersicht',
      icon: LayoutDashboard,
    },
    {
      id: 'nutrition' as TabType,
      label: 'Ernährung',
      icon: Camera,
      badge: 'KI',
    },
    {
      id: 'habits' as TabType,
      label: 'Habits & Sport',
      icon: CheckSquare,
    },
    {
      id: 'weekly' as TabType,
      label: 'Wochen-KI',
      icon: Sparkles,
      highlight: true,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/90 backdrop-blur-2xl border-t border-zinc-800/80 pb-safe pt-2 px-3">
      <div className="flex items-center justify-around max-w-md mx-auto h-14">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-all rounded-xl",
                isActive
                  ? "text-emerald-400 font-medium"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    "w-5 h-5 transition-transform duration-200",
                    isActive && "scale-110 text-emerald-400"
                  )}
                />
                {tab.badge && (
                  <span className="absolute -top-1 -right-3 px-1 py-0.2 text-[9px] font-extrabold bg-emerald-500 text-zinc-950 rounded-full leading-none">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] tracking-tight">{tab.label}</span>
              {isActive && (
                <div className="absolute bottom-1 w-5 h-0.5 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/50" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
