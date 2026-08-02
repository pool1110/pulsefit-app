'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Moon, Check, Smile, Meh, Frown, Bell } from 'lucide-react';
import { SleepLog } from '@/lib/types';

interface SleepTrackerWidgetProps {
  todaySleepLog?: SleepLog;
  onSaveSleep: (hours: number, quality: 'good' | 'average' | 'poor') => void;
}

export function SleepTrackerWidget({ todaySleepLog, onSaveSleep }: SleepTrackerWidgetProps) {
  const [hours, setHours] = useState(todaySleepLog?.hours || 7.5);
  const [quality, setQuality] = useState<'good' | 'average' | 'poor'>(todaySleepLog?.quality || 'good');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    onSaveSleep(hours, quality);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleRequestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then((perm) => {
        if (perm === 'granted') {
          alert('Morgen-Erinnerung aktiviert! Du erhältst jeden Morgen eine Benachrichtigung für deinen Schlaf-Log.');
          new Notification('PulseFit Morgen-Erinnerung ☀️', {
            body: 'Guten Morgen! Vergiss nicht, deinen Schlaf und dein Frühstück einzutragen.',
            icon: '/icon.svg',
          });
        }
      });
    }
  };

  return (
    <Card className="bg-gradient-to-r from-indigo-950/40 via-zinc-900 to-zinc-900 border-indigo-500/30 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Moon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Morgen-Abfrage: Schlaf</h3>
            <p className="text-[11px] text-zinc-400">
              {todaySleepLog ? (
                <span>Erfasst: <strong className="text-indigo-300">{todaySleepLog.hours} Std.</strong> ({todaySleepLog.quality === 'good' ? 'Gut 😊' : 'Mittel 😐'})</span>
              ) : (
                'Wie viele Stunden hast du diese Nacht geschlafen?'
              )}
            </p>
          </div>
        </div>

        <button
          onClick={handleRequestNotificationPermission}
          className="text-[10px] px-2 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center hover:bg-indigo-500/20 transition-colors"
          title="Morgen-Erinnerung aktivieren"
        >
          <Bell className="w-3 h-3 mr-1" />
          Erinnerung
        </button>
      </div>

      <div className="space-y-3 pt-1">
        {/* Hours Selector */}
        <div className="flex items-center justify-between bg-zinc-950/60 p-2 rounded-xl border border-zinc-800">
          <span className="text-xs text-zinc-300 font-semibold">Schlafdauer:</span>
          <div className="flex items-center space-x-2">
            {[6, 7, 7.5, 8, 8.5].map((h) => (
              <button
                key={h}
                onClick={() => setHours(h)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                  hours === h
                    ? 'bg-indigo-500 text-white'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                {h}h
              </button>
            ))}
          </div>
        </div>

        {/* Quality Selector & Save */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-1.5">
            <button
              onClick={() => setQuality('good')}
              className={`p-2 rounded-xl border flex items-center space-x-1 text-xs font-semibold ${
                quality === 'good'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400'
              }`}
            >
              <Smile className="w-4 h-4" />
              <span>Gut</span>
            </button>

            <button
              onClick={() => setQuality('average')}
              className={`p-2 rounded-xl border flex items-center space-x-1 text-xs font-semibold ${
                quality === 'average'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400'
              }`}
            >
              <Meh className="w-4 h-4" />
              <span>Mittel</span>
            </button>

            <button
              onClick={() => setQuality('poor')}
              className={`p-2 rounded-xl border flex items-center space-x-1 text-xs font-semibold ${
                quality === 'poor'
                  ? 'bg-red-500/20 text-red-300 border-red-500/40'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400'
              }`}
            >
              <Frown className="w-4 h-4" />
              <span>Schlecht</span>
            </button>
          </div>

          <Button size="sm" onClick={handleSave} className="h-9 px-4 text-xs font-bold">
            {isSaved ? <Check className="w-4 h-4" /> : 'Speichern'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
