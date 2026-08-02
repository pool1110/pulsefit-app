'use client';

import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Key, Share, PlusSquare, Check, Sparkles, Smartphone, User, Scale, Download, Upload } from 'lucide-react';
import { DailyGoals, UserProfile } from '@/lib/types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  geminiApiKey: string;
  onSaveApiKey: (key: string) => void;
  goals: DailyGoals;
  onUpdateGoals: (goals: DailyGoals) => void;
  profile: UserProfile;
  onUpdateProfile: (profile: Partial<UserProfile>) => void;
  onAddWeightLog: (weight: number) => void;
  showInstallGuideOnly?: boolean;
}

export function SettingsModal({
  isOpen,
  onClose,
  geminiApiKey,
  onSaveApiKey,
  goals,
  onUpdateGoals,
  profile,
  onUpdateProfile,
  onAddWeightLog,
  showInstallGuideOnly = false,
}: SettingsModalProps) {
  const [apiKeyInput, setApiKeyInput] = useState(geminiApiKey);
  const [keySaved, setKeySaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'api' | 'goals' | 'backup' | 'pwa'>(
    showInstallGuideOnly ? 'pwa' : 'profile'
  );

  const [calInput, setCalInput] = useState(goals.calories);
  const [protInput, setProtInput] = useState(goals.protein);
  const [carbInput, setCarbInput] = useState(goals.carbs);
  const [fatInput, setFatInput] = useState(goals.fat);

  const [ageInput, setAgeInput] = useState(profile.age || 37);
  const [weightInput, setWeightInput] = useState(profile.weight || 81);
  const [targetWeightInput, setTargetWeightInput] = useState(profile.targetWeight || 78);
  const [profileSaved, setProfileSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExportData = () => {
    const backupData = {
      meals: localStorage.getItem('fit_app_meals'),
      habits: localStorage.getItem('fit_app_habits'),
      workouts: localStorage.getItem('fit_app_workouts'),
      goals: localStorage.getItem('fit_app_goals'),
      reports: localStorage.getItem('fit_app_weekly_reports'),
      profile: localStorage.getItem('fit_app_profile'),
      exportedAt: new Date().toISOString(),
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `pulsefit_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.meals) localStorage.setItem('fit_app_meals', data.meals);
        if (data.habits) localStorage.setItem('fit_app_habits', data.habits);
        if (data.workouts) localStorage.setItem('fit_app_workouts', data.workouts);
        if (data.goals) localStorage.setItem('fit_app_goals', data.goals);
        if (data.reports) localStorage.setItem('fit_app_weekly_reports', data.reports);
        if (data.profile) localStorage.setItem('fit_app_profile', data.profile);
        alert('Daten erfolgreich wiederhergestellt! Seite wird neu geladen.');
        window.location.reload();
      } catch (err) {
        alert('Ungültige Backup-Datei.');
      }
    };
    reader.readAsText(file);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      age: Number(ageInput),
      weight: Number(weightInput),
      targetWeight: Number(targetWeightInput),
    });
    onAddWeightLog(Number(weightInput));
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveApiKey(apiKeyInput.trim());
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2500);
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
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-zinc-800 shrink-0">
          <CardTitle className="text-lg font-bold text-white">Einstellungen</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-zinc-400">
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>

        {/* Tab switchers */}
        <div className="flex border-b border-zinc-800 bg-zinc-950/50 shrink-0 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2.5 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'profile'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Profil & Gewicht
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`flex-1 py-2.5 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'api'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Gemini Key
          </button>
          <button
            onClick={() => setActiveTab('goals')}
            className={`flex-1 py-2.5 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'goals'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Tagesziele
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`flex-1 py-2.5 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'backup'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Backup
          </button>
          <button
            onClick={() => setActiveTab('pwa')}
            className={`flex-1 py-2.5 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'pwa'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            iOS Guide
          </button>
        </div>

        <CardContent className="pt-4 space-y-4 overflow-y-auto flex-1">
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-start space-x-2">
                <Scale className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                <span>
                  Dein Gewicht & Alter helfen der Gemini KI, deine Kalorien- und Proteinziele präziser zu berechnen.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Alter (Jahre)
                  </label>
                  <input
                    type="number"
                    min={12}
                    max={100}
                    value={ageInput}
                    onChange={(e) => setAgeInput(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Aktuelles Gewicht (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min={30}
                    max={250}
                    value={weightInput}
                    onChange={(e) => setWeightInput(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Zielgewicht (kg, optional)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min={30}
                  max={250}
                  value={targetWeightInput}
                  onChange={(e) => setTargetWeightInput(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm"
                />
              </div>

              <Button type="submit" variant="default" className="w-full">
                {profileSaved ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Profil gespeichert!
                  </>
                ) : (
                  'Profil & Gewicht aktualisieren'
                )}
              </Button>

              <div className="pt-2">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                  Verlauf der Gewichtseinträge
                </h4>
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {profile.weightHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center px-3 py-1.5 rounded-lg bg-zinc-950/60 text-xs border border-zinc-800"
                    >
                      <span className="text-zinc-400">{item.date}</span>
                      <strong className="text-emerald-400">{item.weight} kg</strong>
                    </div>
                  ))}
                </div>
              </div>
            </form>
          )}

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

          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300">
                Sichere all deine Mahlzeiten, Habits und Gewichtseinträge in einer JSON-Datei oder stelle sie wieder her.
              </div>

              <Button variant="outline" onClick={handleExportData} className="w-full justify-center">
                <Download className="w-4 h-4 mr-2 text-emerald-400" />
                Daten als JSON sichern (Export)
              </Button>

              <input
                type="file"
                accept=".json"
                ref={fileInputRef}
                onChange={handleImportData}
                className="hidden"
              />

              <Button
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                className="w-full justify-center"
              >
                <Upload className="w-4 h-4 mr-2 text-cyan-400" />
                Backup wiederherstellen (Import)
              </Button>
            </div>
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
