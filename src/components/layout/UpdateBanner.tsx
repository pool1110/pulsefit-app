'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Rocket, RefreshCw, X } from 'lucide-react';

export function UpdateBanner() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    navigator.serviceWorker.getRegistration().then((reg) => {
      if (!reg) return;

      // Check for updates periodically every 30 seconds
      const interval = setInterval(() => {
        reg.update();
      }, 30000);

      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (!newWorker) return;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            setUpdateAvailable(true);
          }
        });
      });

      if (reg.waiting) {
        setUpdateAvailable(true);
      }

      return () => clearInterval(interval);
    });

    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  }, []);

  const handleUpdate = () => {
    setIsUpdating(true);
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg && reg.waiting) {
          reg.waiting.postMessage({ type: 'SKIP_WAITING' });
        } else {
          window.location.reload();
        }
      });
    } else {
      window.location.reload();
    }
  };

  if (!updateAvailable) return null;

  return (
    <div className="fixed top-3 left-4 right-4 z-50 max-w-md mx-auto animate-in slide-in-from-top-4 duration-300">
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-950 to-zinc-900 border border-emerald-500/60 shadow-2xl backdrop-blur-xl flex items-center justify-between text-white">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <Rocket className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-white">Neues Update verfügbar! 🚀</h4>
            <p className="text-[11px] text-zinc-300">Neue Funktionen & Verbesserungen bereit.</p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <Button
            size="sm"
            onClick={handleUpdate}
            disabled={isUpdating}
            className="h-8 px-3 text-xs font-black bg-emerald-500 hover:bg-emerald-400 text-zinc-950 border-0 shadow-lg"
          >
            {isUpdating ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1" />
            ) : (
              'Aktualisieren'
            )}
          </Button>

          <button
            onClick={() => setUpdateAvailable(false)}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
