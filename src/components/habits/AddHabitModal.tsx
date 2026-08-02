'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { X, Check } from 'lucide-react';
import { Habit } from '@/lib/types';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHabit: (habit: Omit<Habit, 'id' | 'completedDates' | 'currentStreak' | 'bestStreak' | 'createdAt'>) => void;
}

export function AddHabitModal({ isOpen, onClose, onAddHabit }: AddHabitModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'fitness' | 'nutrition' | 'mindset' | 'lifestyle'>('fitness');
  const [targetPerWeek, setTargetPerWeek] = useState(7);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddHabit({
      title: title.trim(),
      category,
      targetPerWeek,
    });

    setTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg font-bold text-white">Neue Gewohnheit erstellen</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-zinc-400">
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Name der Gewohnheit
              </label>
              <input
                type="text"
                placeholder="z.B. 10.000 Schritte, Meditation..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Kategorie</label>
              <select
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-emerald-500 text-sm"
              >
                <option value="fitness">Fitness & Bewegung</option>
                <option value="nutrition">Ernährung & Hydration</option>
                <option value="lifestyle">Schlaf & Regeneration</option>
                <option value="mindset">Mindset & Fokus</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Ziel: {targetPerWeek} Tage pro Woche
              </label>
              <input
                type="range"
                min={1}
                max={7}
                value={targetPerWeek}
                onChange={(e) => setTargetPerWeek(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>
          </CardContent>

          <CardFooter className="flex space-x-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="w-1/3">
              Abbrechen
            </Button>
            <Button type="submit" variant="default" className="w-2/3">
              <Check className="w-4 h-4 mr-2" />
              Erstellen
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
