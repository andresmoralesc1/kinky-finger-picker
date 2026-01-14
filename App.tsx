import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GameMode, IntensityLevel, Player, Settings, GameStats, Question, PlayerStats, UserProgress, Achievement, DailyChallengeProgress } from './src/types';
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
import DailyChallengesScreen from './src/screens/DailyChallengesScreen';
import AIChatScreen from './src/screens/AIChatScreen';
import AIQuestionGeneratorScreen from './src/screens/AIQuestionGeneratorScreen';
import AchievementUnlockedModal from './src/components/AchievementUnlockedModal';
import { StorageService, defaultSettings, defaultStats, defaultUserProgress } from './src/utils/storage';
import { soundManager } from './src/utils/sounds';
import { checkAchievements } from './src/utils/achievements';
import { isNewDay, resetDailyStats, updateChallengeProgress, getTotalXPReward } from './src/utils/dailyChallenges';

type Screen =
  | 'tutorial'
  | 'mode'
  | 'level'
  | 'game'
  | 'question'
  | 'settings'
  | 'stats'
  | 'customQuestions'
  | 'achievements'
  | 'dailyChallenges'
  | 'aiChat'
  | 'aiGenerator';

function LoadingScreen() {
  const spinValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Rotation animation
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={loadingStyles.container}>
      <Animated.Image
        source={require('./assets/logo.png')}
        style={[
          loadingStyles.logo,
          {
            transform: [{ scale: pulseValue }],
          },
        ]}
        resizeMode="contain"
      />
      <Text style={loadingStyles.title}>Kinky Finger Picker</Text>
      <Text style={loadingStyles.subtitle}>Loading your game...</Text>
    </View>
  );
}

const loadingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF006E',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#BBB',
  },
});

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
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallengeProgress | null>(null);

  // Load data on mount
  useEffect(() => {
    loadData();
    soundManager.init();
  }, []);

  const loadData = async () => {
    try {
      const [loadedSettings, loadedStats, loadedCustomQuestions, tutorialSeen, loadedUserProgress, loadedChallenges] = await Promise.all([
        StorageService.getSettings(),
        StorageService.getStats(),
        StorageService.getCustomQuestions(),
        StorageService.getTutorialSeen(),
        StorageService.getUserProgress(),
        StorageService.getDailyChallenges(),
      ]);

      setSettings(loadedSettings);
      setStats(loadedStats);
      setCustomQuestions(loadedCustomQuestions);
      setUserProgress(loadedUserProgress);

      // Check if it's a new day and reset daily challenges if needed
      if (isNewDay(loadedChallenges.date)) {
        const resetChallenges = resetDailyStats(loadedChallenges);
        setDailyChallenges(resetChallenges);
        await StorageService.saveDailyChallenges(resetChallenges);
      } else {
        setDailyChallenges(loadedChallenges);
      }

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

  const updateDailyChallenges = async (statsUpdate: Partial<DailyChallengeProgress['dailyStats']>) => {
    if (!dailyChallenges) return;

    // Update daily stats
    const updatedDailyStats = {
      ...dailyChallenges.dailyStats,
      ...statsUpdate,
    };

    // Update challenge progress based on new stats
    const updatedProgress = updateChallengeProgress(dailyChallenges, updatedDailyStats);

    // Check for newly completed challenges and award XP
    const newlyCompleted = updatedProgress.challenges.filter(
      (c, i) => c.completed && !dailyChallenges.challenges[i].completed
    );

    if (newlyCompleted.length > 0) {
      const totalXpEarned = newlyCompleted.reduce((sum, c) => sum + c.xpReward, 0);
      await StorageService.addXP(totalXpEarned);
      const updatedUserProgress = await StorageService.getUserProgress();
      setUserProgress(updatedUserProgress);
    }

    setDailyChallenges(updatedProgress);
    await StorageService.saveDailyChallenges(updatedProgress);
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

    // Update daily challenges - round played
    if (dailyChallenges) {
      updateDailyChallenges({
        roundsPlayed: dailyChallenges.dailyStats.roundsPlayed + 1,
        modeStats: {
          ...dailyChallenges.dailyStats.modeStats,
          [gameMode]: dailyChallenges.dailyStats.modeStats[gameMode] + 1,
        },
      });
    }

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

    // Update daily challenges - dare completed
    if (dailyChallenges) {
      const updatedLevelStats = {
        ...dailyChallenges.dailyStats.levelStats,
        [intensityLevel]: dailyChallenges.dailyStats.levelStats[intensityLevel] + 1,
      };

      const updatedCategoryStats = category
        ? {
            ...dailyChallenges.dailyStats.categoryStats,
            [category]: dailyChallenges.dailyStats.categoryStats[category as keyof typeof dailyChallenges.dailyStats.categoryStats] + 1,
          }
        : dailyChallenges.dailyStats.categoryStats;

      updateDailyChallenges({
        daresCompleted: dailyChallenges.dailyStats.daresCompleted + 1,
        consecutiveCompletions: dailyChallenges.dailyStats.consecutiveCompletions + 1,
        levelStats: updatedLevelStats,
        categoryStats: updatedCategoryStats,
      });
    }

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

    // Update daily challenges - reset consecutive completions
    if (dailyChallenges) {
      updateDailyChallenges({
        consecutiveCompletions: 0,
      });
    }

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

  const handleOpenDailyChallenges = () => {
    setCurrentScreen('dailyChallenges');
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
    return <LoadingScreen />;
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
          onOpenDailyChallenges={handleOpenDailyChallenges}
          onOpenAIChat={() => setCurrentScreen('aiChat')}
          onOpenAIGenerator={() => setCurrentScreen('aiGenerator')}
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
          onOpenCustomQuestions={handleOpenCustomQuestions}
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

      {currentScreen === 'dailyChallenges' && dailyChallenges && (
        <DailyChallengesScreen
          challengeProgress={dailyChallenges}
          onBack={() => setCurrentScreen('mode')}
        />
      )}

      {currentScreen === 'aiChat' && (
        <AIChatScreen
          level={intensityLevel}
          mode={gameMode}
          playerCount={stats.totalPlayers}
          onBack={() => setCurrentScreen('mode')}
        />
      )}

      {currentScreen === 'aiGenerator' && (
        <AIQuestionGeneratorScreen
          onBack={() => setCurrentScreen('mode')}
          onAddQuestions={(questions) => {
            // Add generated questions to custom questions
            StorageService.saveCustomQuestions([...customQuestions, ...questions]);
            setCustomQuestions(prev => [...prev, ...questions]);
            setCurrentScreen('mode');
          }}
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
