'use client';

import React, { useState } from 'react';
import { Settings, Sparkles, Download, Flame, Users, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserAccount } from '@/lib/store';

interface HeaderProps {
  users: UserAccount[];
  activeUser: UserAccount;
  onSwitchUser: (id: string) => void;
  onAddUser: (name: string) => void;
  onOpenSettings: () => void;
  onOpenInstallGuide: () => void;
  isInstallable: boolean;
  totalStreak: number;
}

export function Header({
  users,
  activeUser,
  onSwitchUser,
  onAddUser,
  onOpenSettings,
  onOpenInstallGuide,
  isInstallable,
  totalStreak,
}: HeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [showAddInput, setShowAddInput] = useState(false);

  const todayFormatted = new Intl.DateTimeFormat('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim()) return;
    onAddUser(newUserName.trim());
    setNewUserName('');
    setShowAddInput(false);
    setIsUserMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl px-4 pt-safe pb-3">
      <div className="flex items-center justify-between max-w-md mx-auto relative">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              PulseFit
            </h1>
            {/* Active User Switcher Pill */}
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-zinc-900 border border-zinc-700 text-emerald-400 hover:border-emerald-500/50 transition-colors"
            >
              <Users className="w-3 h-3 mr-1 text-emerald-400" />
              <span>{activeUser?.name || 'Profil'}</span>
            </button>
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

        {/* User Switcher Dropdown */}
        {isUserMenuOpen && (
          <div className="absolute top-12 left-0 z-50 w-64 bg-zinc-900 border border-zinc-800 rounded-2xl p-3 shadow-2xl animate-in fade-in duration-150">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-2 px-1">
              Familien-Profile ({users.length})
            </span>

            <div className="space-y-1 max-h-48 overflow-y-auto">
              {users.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    onSwitchUser(u.id);
                    setIsUserMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    u.id === activeUser.id
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                      : 'bg-zinc-950/60 text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  <span className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2" />
                    {u.name}
                  </span>
                  {u.id === activeUser.id && <span className="text-[10px] text-emerald-400 font-bold">Aktiv</span>}
                </button>
              ))}
            </div>

            {!showAddInput ? (
              <button
                onClick={() => setShowAddInput(true)}
                className="w-full mt-2 pt-2 border-t border-zinc-800 flex items-center justify-center text-xs text-emerald-400 hover:text-emerald-300 font-semibold py-1"
              >
                <UserPlus className="w-3.5 h-3.5 mr-1" />
                Familienmitglied hinzufügen
              </button>
            ) : (
              <form onSubmit={handleCreateUser} className="mt-2 pt-2 border-t border-zinc-800 flex space-x-2">
                <input
                  type="text"
                  placeholder="Name (z.B. Mama, Lisa)"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="flex-1 px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
                <Button type="submit" size="sm" className="h-7 text-xs px-2">
                  +
                </Button>
              </form>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
