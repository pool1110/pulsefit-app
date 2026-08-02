'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { X, Dumbbell } from 'lucide-react';
import { Workout } from '@/lib/types';

interface AddWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWorkout: (workout: Omit<Workout, 'id'>) => void;
}

export function AddWorkoutModal({ isOpen, onClose, onAddWorkout }: AddWorkoutModalProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<Workout['type']>('strength');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [caloriesBurned, setCaloriesBurned] = useState(350);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const todayStr = new Date().toISOString().split('T')[0];

    onAddWorkout({
      title: title.trim(),
      type,
      durationMinutes,
      caloriesBurned,
      date: todayStr,
      timestamp: new Date().toISOString(),
      notes: notes.trim() || undefined,
    });

    setTitle('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg font-bold text-white flex items-center space-x-2">
            <Dumbbell className="w-5 h-5 text-emerald-400" />
            <span>Workout protokollieren</span>
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-zinc-400">
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Titel des Trainings
              </label>
              <input
                type="text"
                placeholder="z.B. Oberkörper Hypertrophie, 5km Lauf..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Typ</label>
                <select
                  value={type}
                  onChange={(e: any) => setType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-emerald-500 text-sm"
                >
                  <option value="strength">Krafttraining</option>
                  <option value="cardio">Ausdauer / Lauf</option>
                  <option value="hiit">HIIT Intervall</option>
                  <option value="flexibility">Yoga / Mobilität</option>
                  <option value="other">Sonstiges</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Dauer (Minuten)</label>
                <input
                  type="number"
                  min={5}
                  max={300}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-emerald-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Geschätzte verbrannte Kalorien (kcal)
              </label>
              <input
                type="number"
                min={0}
                max={2000}
                value={caloriesBurned}
                onChange={(e) => setCaloriesBurned(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-emerald-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Notizen (optional)</label>
              <textarea
                placeholder="Gewichte, Übungen, Gefühl..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 text-sm"
              />
            </div>
          </CardContent>

          <CardFooter className="flex space-x-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="w-1/3">
              Abbrechen
            </Button>
            <Button type="submit" variant="default" className="w-2/3">
              Workout speichern
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
