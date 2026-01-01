import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GameMode, IntensityLevel, Player, Settings, GameStats, Question, PlayerStats, UserProgress, Achievement } from './src/types';
import ModeSelectionScreen from './src/screens/ModeSelectionScreen';
import LevelSelectionScreen from './src/screens/LevelSelectionScreen';
import GameScreen from './src/screens/GameScreen';
import ImprovedGameScreen from './src/screens/ImprovedGameScreen';
import ImprovedQuestionScreen from './src/screens/ImprovedQuestionScreen';
import TutorialScreen from './src/screens/TutorialScreen';
import InteractiveOnboardingScreen from './src/screens/InteractiveOnboardingScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import StatsScreen from './src/screens/StatsScreen';
import CustomQuestionsScreen from './src/screens/CustomQuestionsScreen';
import AchievementsScreen from './src/screens/AchievementsScreen';
import AchievementUnlockedModal from './src/components/AchievementUnlockedModal';
import { StorageService, defaultSettings, defaultStats, defaultUserProgress } from './src/utils/storage';
import { soundManager } from './src/utils/sounds';
import { checkAchievements } from './src/utils/achievements';

type Screen =
  | 'tutorial'
  | 'mode'
  | 'level'
  | 'game'
  | 'question'
  | 'settings'
  | 'stats'
  | 'customQuestions'
  | 'achievements';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('tutorial');
  const [gameMode, setGameMode] = useState<GameMode>('hetero');
  const [intensityLevel, setIntensityLevel] = useState<IntensityLevel>('mild');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [stats, setStats] = useState<GameStats>(defaultStats);
  const [customQuestions, setCustomQuestions] = useState<Question[]>([]);
  const [usedQuestionIds, setUsedQuestionIds] = useState<string[]>([]);
  const [playerSkipCounts, setPlayerSkipCounts] = useState<Map<number, number>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [userProgress, setUserProgress] = useState<UserProgress>(defaultUserProgress);
  const [newlyUnlockedAchievements, setNewlyUnlockedAchievements] = useState<Achievement[]>([]);

  // Load data on mount
  useEffect(() => {
    loadData();
    soundManager.init();
  }, []);

  const loadData = async () => {
    try {
      const [loadedSettings, loadedStats, loadedCustomQuestions, tutorialSeen, loadedUserProgress] = await Promise.all([
        StorageService.getSettings(),
        StorageService.getStats(),
        StorageService.getCustomQuestions(),
        StorageService.getTutorialSeen(),
        StorageService.getUserProgress(),
      ]);

      setSettings(loadedSettings);
      setStats(loadedStats);
      setCustomQuestions(loadedCustomQuestions);
      setUserProgress(loadedUserProgress);

      // Apply sound settings
      soundManager.setSoundEnabled(loadedSettings.soundEnabled);
      soundManager.setMusicEnabled(loadedSettings.musicEnabled);

      // Show interactive onboarding if not seen
      if (!tutorialSeen && loadedSettings.showTutorial) {
        setCurrentScreen('tutorial'); // Will use InteractiveOnboardingScreen
      } else {
        setCurrentScreen('mode');
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setCurrentScreen('mode');
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (newSettings: Settings) => {
    setSettings(newSettings);
    await StorageService.saveSettings(newSettings);
    soundManager.setSoundEnabled(newSettings.soundEnabled);
    soundManager.setMusicEnabled(newSettings.musicEnabled);
  };

  const saveStats = async (newStats: GameStats) => {
    setStats(newStats);
    await StorageService.saveStats(newStats);
  };

  const updateUserProgress = async (updates: Partial<UserProgress['stats']>) => {
    const updatedProgress = { ...userProgress };
    updatedProgress.stats = { ...updatedProgress.stats, ...updates };

    // Check for newly unlocked achievements
    const { updatedAchievements, newlyUnlocked } = checkAchievements(
      updatedProgress,
      updatedProgress.achievements
    );

    updatedProgress.achievements = updatedAchievements;

    // Add XP from newly unlocked achievements
    if (newlyUnlocked.length > 0) {
      const totalXpEarned = newlyUnlocked.reduce((sum, ach) => sum + ach.xpReward, 0);
      const progressWithXp = await StorageService.addXP(totalXpEarned);
      updatedProgress.xp = progressWithXp.xp;
      updatedProgress.level = progressWithXp.level;

      // Show unlock modals
      setNewlyUnlockedAchievements(newlyUnlocked);
    }

    setUserProgress(updatedProgress);
    await StorageService.saveUserProgress(updatedProgress);
  };

  const handleTutorialComplete = async () => {
    await StorageService.setTutorialSeen();
    setCurrentScreen('mode');
  };

  const handleModeSelect = (mode: GameMode) => {
    setGameMode(mode);
    setCurrentScreen('level');
  };

  const handleLevelSelect = (level: IntensityLevel) => {
    setIntensityLevel(level);
    setCurrentScreen('game');
  };

  const handlePlayerSelected = (player: Player) => {
    setSelectedPlayer(player);

    // Update stats - track this player
    const newStats = { ...stats };
    newStats.totalRounds += 1;

    // Find or create player stats
    let playerStat = newStats.currentSession.find(p => p.playerId === player.id);
    if (!playerStat) {
      playerStat = {
        playerId: player.id,
        color: player.color,
        timesSelected: 0,
        daresCompleted: 0,
        daresSkipped: 0,
      };
      newStats.currentSession.push(playerStat);
    }
    playerStat.timesSelected += 1;

    saveStats(newStats);

    // Update user progress for achievements
    updateUserProgress({
      timesSelected: userProgress.stats.timesSelected + 1,
    });

    setCurrentScreen('question');
  };

  const handleQuestionComplete = (questionId: string, category?: string) => {
    // Mark question as used
    setUsedQuestionIds([...usedQuestionIds, questionId]);

    // Update stats
    const newStats = { ...stats };
    newStats.levelDistribution[intensityLevel] += 1;

    const playerStat = newStats.currentSession.find(p => p.playerId === selectedPlayer!.id);
    if (playerStat) {
      playerStat.daresCompleted += 1;
    }

    saveStats(newStats);

    // Update user progress for achievements
    const newConsecutive = userProgress.stats.consecutiveCompletions + 1;
    const updatedLevels = new Set(userProgress.stats.levelsPlayed);
    updatedLevels.add(intensityLevel);

    const updatedCategories = new Set(userProgress.stats.categoriesPlayed);
    if (category) {
      updatedCategories.add(category as any);
    }

    updateUserProgress({
      totalRounds: userProgress.stats.totalRounds + 1,
      totalDaresCompleted: userProgress.stats.totalDaresCompleted + 1,
      consecutiveCompletions: newConsecutive,
      maxConsecutiveCompletions: Math.max(newConsecutive, userProgress.stats.maxConsecutiveCompletions),
      levelsPlayed: updatedLevels,
      categoriesPlayed: updatedCategories,
    });

    // Move to next round
    setSelectedPlayer(null);
    setCurrentScreen('game');
  };

  const handleQuestionSkip = (questionId: string) => {
    // Mark question as used
    setUsedQuestionIds([...usedQuestionIds, questionId]);

    // Update skip count for this player
    const newSkipCounts = new Map(playerSkipCounts);
    const currentSkips = newSkipCounts.get(selectedPlayer!.id) || 0;
    newSkipCounts.set(selectedPlayer!.id, currentSkips + 1);
    setPlayerSkipCounts(newSkipCounts);

    // Update stats
    const newStats = { ...stats };
    const playerStat = newStats.currentSession.find(p => p.playerId === selectedPlayer!.id);
    if (playerStat) {
      playerStat.daresSkipped += 1;
    }

    saveStats(newStats);

    // Update user progress for achievements - reset consecutive completions
    updateUserProgress({
      totalDaresSkipped: userProgress.stats.totalDaresSkipped + 1,
      consecutiveCompletions: 0,
    });

    // Move to next round
    setSelectedPlayer(null);
    setCurrentScreen('game');
  };

  const handleBackToMode = () => {
    setCurrentScreen('mode');
    setSelectedPlayer(null);
    setUsedQuestionIds([]);
    setPlayerSkipCounts(new Map());
  };

  const handleBackToLevel = () => {
    setCurrentScreen('level');
    setSelectedPlayer(null);
  };

  const handleLevelUp = () => {
    if (intensityLevel === 'mild') {
      setIntensityLevel('spicy');
    } else if (intensityLevel === 'spicy') {
      setIntensityLevel('extreme');
    }
    setCurrentScreen('game');
  };

  const handleLevelDown = () => {
    if (intensityLevel === 'extreme') {
      setIntensityLevel('spicy');
    } else if (intensityLevel === 'spicy') {
      setIntensityLevel('mild');
    }
    setCurrentScreen('game');
  };

  const handleChangeLevel = () => {
    setCurrentScreen('level');
  };

  const handleOpenSettings = () => {
    setCurrentScreen('settings');
  };

  const handleOpenStats = () => {
    setCurrentScreen('stats');
  };

  const handleOpenAchievements = () => {
    setCurrentScreen('achievements');
  };

  const handleOpenCustomQuestions = () => {
    setCurrentScreen('customQuestions');
  };

  const handleCloseAchievementModal = () => {
    // Remove the first achievement from the queue
    setNewlyUnlockedAchievements(prev => prev.slice(1));
  };

  const handleQuickPlay = () => {
    // Quick Play: Default to Hetero + Mild and jump straight to game
    setGameMode('hetero');
    setIntensityLevel('mild');
    setCurrentScreen('game');
    soundManager.playSound('tap');
  };

  const handleResetStats = async () => {
    await StorageService.resetStats();
    const newStats = await StorageService.getStats();
    setStats(newStats);
  };

  const handleAddCustomQuestion = async (question: Question) => {
    await StorageService.addCustomQuestion(question);
    const questions = await StorageService.getCustomQuestions();
    setCustomQuestions(questions);
  };

  const handleDeleteCustomQuestion = async (id: string) => {
    await StorageService.deleteCustomQuestion(id);
    const questions = await StorageService.getCustomQuestions();
    setCustomQuestions(questions);
  };

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <>
      <StatusBar style="light" />

      {currentScreen === 'tutorial' && (
        <InteractiveOnboardingScreen onComplete={handleTutorialComplete} />
      )}

      {currentScreen === 'mode' && (
        <ModeSelectionScreen
          onSelectMode={handleModeSelect}
          onQuickPlay={handleQuickPlay}
          onOpenSettings={handleOpenSettings}
          onOpenStats={handleOpenStats}
          onOpenAchievements={handleOpenAchievements}
        />
      )}

      {currentScreen === 'level' && (
        <LevelSelectionScreen
          onSelectLevel={handleLevelSelect}
          onBack={handleBackToMode}
        />
      )}

      {currentScreen === 'game' && (
        <ImprovedGameScreen
          mode={gameMode}
          level={intensityLevel}
          onPlayerSelected={handlePlayerSelected}
          onBack={handleBackToLevel}
          onChangeLevel={handleChangeLevel}
        />
      )}

      {currentScreen === 'question' && selectedPlayer && (
        <ImprovedQuestionScreen
          player={selectedPlayer}
          level={intensityLevel}
          settings={settings}
          usedQuestionIds={usedQuestionIds}
          skipCount={playerSkipCounts.get(selectedPlayer.id) || 0}
          onComplete={handleQuestionComplete}
          onSkip={handleQuestionSkip}
          onChangeLevelUp={handleLevelUp}
          onChangeLevelDown={handleLevelDown}
          canLevelUp={intensityLevel !== 'extreme'}
          canLevelDown={intensityLevel !== 'mild'}
        />
      )}

      {currentScreen === 'settings' && (
        <SettingsScreen
          settings={settings}
          onUpdateSettings={saveSettings}
          onBack={() => setCurrentScreen('mode')}
          onResetStats={handleResetStats}
        />
      )}

      {currentScreen === 'stats' && (
        <StatsScreen
          stats={stats}
          onBack={() => setCurrentScreen('mode')}
        />
      )}

      {currentScreen === 'customQuestions' && (
        <CustomQuestionsScreen
          customQuestions={customQuestions}
          onAddQuestion={handleAddCustomQuestion}
          onDeleteQuestion={handleDeleteCustomQuestion}
          onBack={() => setCurrentScreen('settings')}
        />
      )}

      {currentScreen === 'achievements' && (
        <AchievementsScreen
          userProgress={userProgress}
          onBack={() => setCurrentScreen('mode')}
        />
      )}

      {/* Achievement Unlocked Modal */}
      {newlyUnlockedAchievements.length > 0 && (
        <AchievementUnlockedModal
          achievement={newlyUnlockedAchievements[0]}
          onClose={handleCloseAchievementModal}
        />
      )}
    </>
  );
}
