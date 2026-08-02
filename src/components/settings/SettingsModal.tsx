'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Key, Share, PlusSquare, Check, Sparkles, Smartphone } from 'lucide-react';
import { DailyGoals } from '@/lib/types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  geminiApiKey: string;
  onSaveApiKey: (key: string) => void;
  goals: DailyGoals;
  onUpdateGoals: (goals: DailyGoals) => void;
  showInstallGuideOnly?: boolean;
}

export function SettingsModal({
  isOpen,
  onClose,
  geminiApiKey,
  onSaveApiKey,
  goals,
  onUpdateGoals,
  showInstallGuideOnly = false,
}: SettingsModalProps) {
  const [apiKeyInput, setApiKeyInput] = useState(geminiApiKey);
  const [keySaved, setKeySaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'api' | 'goals' | 'pwa'>(
    showInstallGuideOnly ? 'pwa' : 'api'
  );

  const [calInput, setCalInput] = useState(goals.calories);
  const [protInput, setProtInput] = useState(goals.protein);
  const [carbInput, setCarbInput] = useState(goals.carbs);
  const [fatInput, setFatInput] = useState(goals.fat);

  if (!isOpen) return null;

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveApiKey(apiKeyInput.trim());
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 3000);
  };

  const handleSaveGoals = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateGoals({
      calories: Number(calInput),
      protein: Number(protInput),
      carbs: Number(carbInput),
      fat: Number(fatInput),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 shadow-2xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-zinc-800">
          <CardTitle className="text-lg font-bold text-white">Einstellungen</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-zinc-400">
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>

        {/* Tab switchers */}
        <div className="flex border-b border-zinc-800 bg-zinc-950/50">
          <button
            onClick={() => setActiveTab('api')}
            className={`flex-1 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'api'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Gemini KI Key
          </button>
          <button
            onClick={() => setActiveTab('goals')}
            className={`flex-1 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'goals'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Tagesziele
          </button>
          <button
            onClick={() => setActiveTab('pwa')}
            className={`flex-1 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'pwa'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            iOS PWA Installation
          </button>
        </div>

        <CardContent className="pt-4 space-y-4">
          {activeTab === 'api' && (
            <form onSubmit={handleSaveKey} className="space-y-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-start space-x-2">
                <Sparkles className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                <span>
                  Hinterlege deinen eigenen Google Gemini API-Schlüssel für unbegrenzte Foto-Analysen & Wochenberichte.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1 flex items-center">
                  <Key className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                  Gemini API Key
                </label>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 text-sm"
                />
              </div>

              <Button type="submit" variant="default" className="w-full">
                {keySaved ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Gespeichert!
                  </>
                ) : (
                  'Schlüssel speichern'
                )}
              </Button>
            </form>
          )}

          {activeTab === 'goals' && (
            <form onSubmit={handleSaveGoals} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Kalorienziel (kcal)
                </label>
                <input
                  type="number"
                  value={calInput}
                  onChange={(e) => setCalInput(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-emerald-400 mb-1">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    value={protInput}
                    onChange={(e) => setProtInput(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-cyan-400 mb-1">
                    Kohlenhydrate (g)
                  </label>
                  <input
                    type="number"
                    value={carbInput}
                    onChange={(e) => setCarbInput(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-amber-400 mb-1">
                    Fett (g)
                  </label>
                  <input
                    type="number"
                    value={fatInput}
                    onChange={(e) => setFatInput(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm"
                  />
                </div>
              </div>

              <Button type="submit" variant="default" className="w-full mt-2">
                Ziele aktualisieren
              </Button>
            </form>
          )}

          {activeTab === 'pwa' && (
            <div className="space-y-4 text-xs text-zinc-300">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                <Smartphone className="w-5 h-5" />
                <span>Als App auf dem iPhone installieren</span>
              </div>

              <p className="leading-relaxed">
                Installiere PulseFit als echte Progressive Web App ohne Browser-Leiste:
              </p>

              <ol className="space-y-3">
                <li className="flex items-start space-x-3 p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
                    <Share className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block font-semibold">1. Teilen-Button antippen</strong>
                    Tippe unten im Safari-Browser auf das Teilen-Symbol (Quadrat mit Pfeil).
                  </div>
                </li>

                <li className="flex items-start space-x-3 p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
                    <PlusSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block font-semibold">2. "Zum Home-Bildschirm"</strong>
                    Scrolle etwas nach unten und wähle den Menüpunkt <strong>"Zum Home-Bildschirm"</strong>.
                  </div>
                </li>

                <li className="flex items-start space-x-3 p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block font-semibold">3. Fertigstellen</strong>
                    Bestätige oben rechts mit "Hinzufügen". Die App erscheint nun wie eine native App auf deinem Startbildschirm!
                  </div>
                </li>
              </ol>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
