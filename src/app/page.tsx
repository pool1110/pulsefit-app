'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Header } from '@/components/layout/Header';
import { BottomNav, TabType } from '@/components/layout/BottomNav';
import { UpdateBanner } from '@/components/layout/UpdateBanner';
import { DashboardView } from '@/components/dashboard/DashboardView';
import { NutritionView } from '@/components/nutrition/NutritionView';
import { HabitsView } from '@/components/habits/HabitsView';
import { WeeklyView } from '@/components/weekly/WeeklyView';
import { SettingsModal } from '@/components/settings/SettingsModal';
import { OnboardingModal } from '@/components/onboarding/OnboardingModal';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const {
    isLoaded,
    users,
    activeUser,
    activeUserId,
    switchUser,
    addUser,
    deleteUser,
    meals,
    habits,
    workouts,
    sleepLogs,
    goals,
    weeklyReports,
    profile,
    workoutPlan,
    geminiApiKey,
    addSleepLog,
    setWorkoutPlan,
    updateProfile,
    addWeightLog,
    addMeal,
    deleteMeal,
    toggleHabit,
    addHabit,
    deleteHabit,
    addWorkout,
    deleteWorkout,
    updateGoals,
    saveApiKey,
    addWeeklyReport,
    getTodayString,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showPwaGuideOnly, setShowPwaGuideOnly] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [forceClosedOnboarding, setForceClosedOnboarding] = useState(false);

  const todayStr = getTodayString(0);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    if (isIos && !isStandalone) {
      setIsInstallable(true);
    }
  }, []);

  const handleUserSwitch = (userId: string) => {
    setForceClosedOnboarding(false);
    switchUser(userId);
  };

  const totalStreak = habits.reduce((max, h) => Math.max(max, h.currentStreak), 0);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
        <span className="text-xs font-semibold text-zinc-400">PulseFit wird geladen...</span>
      </div>
    );
  }

  const isOnboardingOpen = !profile.onboardingCompleted && !forceClosedOnboarding;

  const handleCompleteOnboarding = (profileData: any, newGoals: any) => {
    setForceClosedOnboarding(true);
    updateProfile(profileData);
    updateGoals(newGoals);
    if (profileData.weight) {
      addWeightLog(profileData.weight);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-emerald-500 selection:text-zinc-950">
      {/* Floating Automatic Update Notification Banner */}
      <UpdateBanner />

      {/* App Header with Family Profile Switcher */}
      <Header
        users={users}
        activeUser={activeUser}
        onSwitchUser={handleUserSwitch}
        onAddUser={addUser}
        onOpenSettings={() => {
          setShowPwaGuideOnly(false);
          setIsSettingsOpen(true);
        }}
        onOpenInstallGuide={() => {
          setShowPwaGuideOnly(true);
          setIsSettingsOpen(true);
        }}
        isInstallable={isInstallable}
        totalStreak={totalStreak}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 pt-4">
        {activeTab === 'dashboard' && (
          <DashboardView
            meals={meals}
            habits={habits}
            workouts={workouts}
            sleepLogs={sleepLogs}
            goals={goals}
            profile={profile}
            todayDate={todayStr}
            onToggleHabit={toggleHabit}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onAddWeightLog={addWeightLog}
            onAddSleepLog={addSleepLog}
            onUpdateProfile={updateProfile}
          />
        )}

        {activeTab === 'nutrition' && (
          <NutritionView
            meals={meals}
            todayDate={todayStr}
            targetCalories={goals.calories}
            targetProtein={goals.protein}
            onAddMeal={addMeal}
            onDeleteMeal={deleteMeal}
            geminiApiKey={geminiApiKey}
          />
        )}

        {activeTab === 'habits' && (
          <HabitsView
            habits={habits}
            workouts={workouts}
            profile={profile}
            workoutPlan={workoutPlan}
            todayDate={todayStr}
            geminiApiKey={geminiApiKey}
            onToggleHabit={toggleHabit}
            onAddHabit={addHabit}
            onDeleteHabit={deleteHabit}
            onAddWorkout={addWorkout}
            onDeleteWorkout={deleteWorkout}
            onSavePlan={setWorkoutPlan}
          />
        )}

        {activeTab === 'weekly' && (
          <WeeklyView
            meals={meals}
            habits={habits}
            workouts={workouts}
            goals={goals}
            reports={weeklyReports}
            profile={profile}
            geminiApiKey={geminiApiKey}
            onAddReport={addWeeklyReport}
          />
        )}
      </main>

      {/* iOS Floating Dock Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Settings & Profile Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        geminiApiKey={geminiApiKey}
        onSaveApiKey={saveApiKey}
        goals={goals}
        onUpdateGoals={updateGoals}
        profile={profile}
        onUpdateProfile={updateProfile}
        onAddWeightLog={addWeightLog}
        showInstallGuideOnly={showPwaGuideOnly}
      />

      {/* Onboarding Wizard Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        userName={activeUser.name}
        currentProfile={profile}
        onCompleteOnboarding={handleCompleteOnboarding}
      />
    </div>
  );
}
