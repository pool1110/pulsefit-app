'use client';

import React from 'react';
import { Settings, Sparkles, Download, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenInstallGuide: () => void;
  isInstallable: boolean;
  totalStreak: number;
}

export function Header({
  onOpenSettings,
  onOpenInstallGuide,
  isInstallable,
  totalStreak,
}: HeaderProps) {
  const todayFormatted = new Intl.DateTimeFormat('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl px-4 pt-safe pb-3">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              PulseFit
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-2.5 h-2.5 mr-1 text-emerald-400" />
              KI Powered
            </span>
          </div>
          <p className="text-xs text-zinc-400 capitalize">{todayFormatted}</p>
        </div>

        <div className="flex items-center space-x-2">
          {totalStreak > 0 && (
            <div className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
              <Flame className="w-4 h-4 fill-amber-400 animate-pulse" />
              <span>{totalStreak}d</span>
            </div>
          )}

          {isInstallable && (
            <Button
              variant="outline"
              size="icon"
              onClick={onOpenInstallGuide}
              className="h-9 w-9 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
              title="Zum Home-Bildschirm hinzufügen"
            >
              <Download className="w-4 h-4" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenSettings}
            className="h-9 w-9 text-zinc-300 hover:bg-zinc-800"
            title="Einstellungen"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
