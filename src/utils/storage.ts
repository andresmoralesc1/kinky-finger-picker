import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameStats, Settings, Question, UserProgress, Achievement, IntensityLevel, QuestionCategory, DailyChallengeProgress } from '../types';
import { initializeAchievements } from './achievements';
import { initializeDailyChallengeProgress } from './dailyChallenges';

const KEYS = {
  STATS: '@kinky_picker_stats',
  SETTINGS: '@kinky_picker_settings',
  CUSTOM_QUESTIONS: '@kinky_picker_custom_questions',
  TUTORIAL_SEEN: '@kinky_picker_tutorial_seen',
  USER_PROGRESS: '@kinky_picker_user_progress',
  DAILY_CHALLENGES: '@kinky_picker_daily_challenges',
};

export const defaultSettings: Settings = {
  soundEnabled: true,
  musicEnabled: true,
  hapticEnabled: true,
  avoidRepetition: true,
  skipLimit: 3,
  timerDuration: 60,
  showTutorial: true,
  categories: ['classic', 'romantic', 'party', 'nsfw'],
  selectedTheme: 'default',
};

export const defaultStats: GameStats = {
  totalRounds: 0,
  totalPlayers: 0,
  currentSession: [],
  levelDistribution: {
    mild: 0,
    spicy: 0,
    extreme: 0,
  },
  categoryDistribution: {
    classic: 0,
    romantic: 0,
    party: 0,
    nsfw: 0,
    custom: 0,
  },
};

export const defaultUserProgress: UserProgress = {
  level: 1,
  xp: 0,
  achievements: initializeAchievements(),
  stats: {
    totalRounds: 0,
    totalDaresCompleted: 0,
    totalDaresSkipped: 0,
    consecutiveCompletions: 0,
    maxConsecutiveCompletions: 0,
    levelsPlayed: new Set<IntensityLevel>(),
    categoriesPlayed: new Set<QuestionCategory>(),
    timesSelected: 0,
    sharesCount: 0,
    fastestCompletion: 0,
    longestSession: 0,
  },
};

export const StorageService = {
  // Settings
  async getSettings(): Promise<Settings> {
    try {
      const data = await AsyncStorage.getItem(KEYS.SETTINGS);
      return data ? JSON.parse(data) : defaultSettings;
    } catch {
      return defaultSettings;
    }
  },

  async saveSettings(settings: Settings): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  },

  // Stats
  async getStats(): Promise<GameStats> {
    try {
      const data = await AsyncStorage.getItem(KEYS.STATS);
      return data ? JSON.parse(data) : defaultStats;
    } catch {
      return defaultStats;
    }
  },

  async saveStats(stats: GameStats): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.STATS, JSON.stringify(stats));
    } catch (error) {
      console.error('Error saving stats:', error);
    }
  },

  async resetStats(): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.STATS, JSON.stringify(defaultStats));
    } catch (error) {
      console.error('Error resetting stats:', error);
    }
  },

  // Custom Questions
  async getCustomQuestions(): Promise<Question[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.CUSTOM_QUESTIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async saveCustomQuestions(questions: Question[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.CUSTOM_QUESTIONS, JSON.stringify(questions));
    } catch (error) {
      console.error('Error saving custom questions:', error);
    }
  },

  async addCustomQuestion(question: Question): Promise<void> {
    try {
      const questions = await this.getCustomQuestions();
      questions.push(question);
      await this.saveCustomQuestions(questions);
    } catch (error) {
      console.error('Error adding custom question:', error);
    }
  },

  async deleteCustomQuestion(id: string): Promise<void> {
    try {
      const questions = await this.getCustomQuestions();
      const filtered = questions.filter(q => q.id !== id);
      await this.saveCustomQuestions(filtered);
    } catch (error) {
      console.error('Error deleting custom question:', error);
    }
  },

  // Tutorial
  async getTutorialSeen(): Promise<boolean> {
    try {
      const data = await AsyncStorage.getItem(KEYS.TUTORIAL_SEEN);
      return data === 'true';
    } catch {
      return false;
    }
  },

  async setTutorialSeen(): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.TUTORIAL_SEEN, 'true');
    } catch (error) {
      console.error('Error setting tutorial seen:', error);
    }
  },

  // User Progress & Achievements
  async getUserProgress(): Promise<UserProgress> {
    try {
      const data = await AsyncStorage.getItem(KEYS.USER_PROGRESS);
      if (!data) return defaultUserProgress;

      const parsed = JSON.parse(data);
      // Convert Set back from array (since JSON doesn't support Set)
      return {
        ...parsed,
        stats: {
          ...parsed.stats,
          levelsPlayed: new Set(parsed.stats.levelsPlayed || []),
          categoriesPlayed: new Set(parsed.stats.categoriesPlayed || []),
        },
      };
    } catch {
      return defaultUserProgress;
    }
  },

  async saveUserProgress(progress: UserProgress): Promise<void> {
    try {
      // Convert Set to array for JSON serialization
      const toSave = {
        ...progress,
        stats: {
          ...progress.stats,
          levelsPlayed: Array.from(progress.stats.levelsPlayed),
          categoriesPlayed: Array.from(progress.stats.categoriesPlayed),
        },
      };
      await AsyncStorage.setItem(KEYS.USER_PROGRESS, JSON.stringify(toSave));
    } catch (error) {
      console.error('Error saving user progress:', error);
    }
  },

  async updateAchievements(achievements: Achievement[]): Promise<void> {
    try {
      const progress = await this.getUserProgress();
      progress.achievements = achievements;
      await this.saveUserProgress(progress);
    } catch (error) {
      console.error('Error updating achievements:', error);
    }
  },

  async addXP(amount: number): Promise<UserProgress> {
    try {
      const progress = await this.getUserProgress();
      progress.xp += amount;

      // Calculate new level
      const calculateLevel = (xp: number): number => {
        const XP_PER_LEVEL = [0, 100, 250, 500, 1000, 1500, 2500, 4000, 6000, 10000];
        let level = 1;
        for (let i = 0; i < XP_PER_LEVEL.length; i++) {
          if (xp >= XP_PER_LEVEL[i]) {
            level = i + 1;
          } else {
            break;
          }
        }
        return level;
      };

      progress.level = calculateLevel(progress.xp);
      await this.saveUserProgress(progress);
      return progress;
    } catch (error) {
      console.error('Error adding XP:', error);
      return defaultUserProgress;
    }
  },

  async resetUserProgress(): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.USER_PROGRESS, JSON.stringify(defaultUserProgress));
    } catch (error) {
      console.error('Error resetting user progress:', error);
    }
  },

  // Daily Challenges
  async getDailyChallenges(): Promise<DailyChallengeProgress> {
    try {
      const data = await AsyncStorage.getItem(KEYS.DAILY_CHALLENGES);
      if (!data) return initializeDailyChallengeProgress();

      const parsed = JSON.parse(data);
      return parsed;
    } catch {
      return initializeDailyChallengeProgress();
    }
  },

  async saveDailyChallenges(progress: DailyChallengeProgress): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.DAILY_CHALLENGES, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving daily challenges:', error);
    }
  },

  async resetDailyChallenges(): Promise<void> {
    try {
      const initialized = initializeDailyChallengeProgress();
      await AsyncStorage.setItem(KEYS.DAILY_CHALLENGES, JSON.stringify(initialized));
    } catch (error) {
      console.error('Error resetting daily challenges:', error);
    }
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(KEYS));
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};
