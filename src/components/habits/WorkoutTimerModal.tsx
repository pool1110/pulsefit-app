'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Play, Pause, RotateCcw, Timer, Volume2 } from 'lucide-react';

interface WorkoutTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WorkoutTimerModal({ isOpen, onClose }: WorkoutTimerModalProps) {
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      // Play web audio sound when timer finishes
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = 880; // A5 pitch
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.6);
      } catch (e) {
        console.error(e);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  if (!isOpen) return null;

  const handleSelectPreset = (seconds: number) => {
    setSelectedDuration(seconds);
    setTimeLeft(seconds);
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(selectedDuration);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progress = Math.min(100, Math.max(0, ((selectedDuration - timeLeft) / selectedDuration) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 shadow-2xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-zinc-800">
          <CardTitle className="text-lg font-bold text-white flex items-center space-x-2">
            <Timer className="w-5 h-5 text-emerald-400" />
            <span>Pausen- & Exercise-Timer</span>
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-zinc-400">
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>

        <CardContent className="pt-6 pb-6 space-y-6 text-center">
          {/* Preset Buttons */}
          <div className="flex justify-center space-x-2">
            {[30, 45, 60, 90, 120].map((preset) => (
              <button
                key={preset}
                onClick={() => handleSelectPreset(preset)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedDuration === preset
                    ? 'bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/20'
                    : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-white'
                }`}
              >
                {preset}s
              </button>
            ))}
          </div>

          {/* Big Circular Display */}
          <div className="relative w-48 h-48 mx-auto flex flex-col items-center justify-center rounded-full bg-zinc-950 border-4 border-zinc-800 shadow-2xl">
            <span className="text-5xl font-black text-white tracking-tight font-mono">
              {formatTime(timeLeft)}
            </span>
            <span className="text-xs uppercase font-bold text-emerald-400 mt-1">
              {timeLeft === 0 ? '🎉 Zeit abgelaufen!' : isActive ? 'Läuft...' : 'Bereit'}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handleReset}
              className="h-12 w-12 rounded-full border-zinc-700 text-zinc-300"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>

            <Button
              variant="gradient"
              onClick={() => setIsActive(!isActive)}
              className="h-14 px-8 rounded-full text-base"
            >
              {isActive ? (
                <>
                  <Pause className="w-6 h-6 mr-2" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-6 h-6 mr-2 fill-zinc-950" /> Start
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
