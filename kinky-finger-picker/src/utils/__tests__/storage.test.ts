import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageService, defaultSettings, defaultStats, defaultUserProgress } from '../storage';
import { Question, Settings, GameStats, IntensityLevel, QuestionCategory } from '../../types';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage');

describe('StorageService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Settings', () => {
    it('should return default settings when no data is stored', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const settings = await StorageService.getSettings();

      expect(settings).toEqual(defaultSettings);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@kinky_picker_settings');
    });

    it('should return stored settings when data exists', async () => {
      const customSettings: Settings = {
        ...defaultSettings,
        soundEnabled: false,
        skipLimit: 5,
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(customSettings));

      const settings = await StorageService.getSettings();

      expect(settings).toEqual(customSettings);
      expect(settings.soundEnabled).toBe(false);
      expect(settings.skipLimit).toBe(5);
    });

    it('should save settings correctly', async () => {
      const customSettings: Settings = {
        ...defaultSettings,
        hapticEnabled: false,
      };

      await StorageService.saveSettings(customSettings);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@kinky_picker_settings',
        JSON.stringify(customSettings)
      );
    });

    it('should handle errors when getting settings', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const settings = await StorageService.getSettings();

      expect(settings).toEqual(defaultSettings);
    });
  });

  describe('Stats', () => {
    it('should return default stats when no data is stored', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const stats = await StorageService.getStats();

      expect(stats).toEqual(defaultStats);
    });

    it('should save stats correctly', async () => {
      const customStats: GameStats = {
        ...defaultStats,
        totalRounds: 10,
        levelDistribution: { mild: 5, spicy: 3, extreme: 2 },
      };

      await StorageService.saveStats(customStats);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@kinky_picker_stats',
        JSON.stringify(customStats)
      );
    });

    it('should reset stats to default', async () => {
      await StorageService.resetStats();

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@kinky_picker_stats',
        JSON.stringify(defaultStats)
      );
    });
  });

  describe('Custom Questions', () => {
    it('should return empty array when no custom questions exist', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const questions = await StorageService.getCustomQuestions();

      expect(questions).toEqual([]);
    });

    it('should return stored custom questions', async () => {
      const mockQuestions: Question[] = [
        {
          id: 'custom_1',
          text: 'My custom question',
          level: 'mild',
          type: 'question',
          category: 'custom',
          isCustom: true,
        },
      ];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockQuestions));

      const questions = await StorageService.getCustomQuestions();

      expect(questions).toEqual(mockQuestions);
      expect(questions).toHaveLength(1);
    });

    it('should add a custom question', async () => {
      const existingQuestions: Question[] = [];
      const newQuestion: Question = {
        id: 'custom_2',
        text: 'New question',
        level: 'spicy',
        type: 'dare',
        category: 'custom',
        isCustom: true,
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(existingQuestions));

      await StorageService.addCustomQuestion(newQuestion);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@kinky_picker_custom_questions',
        JSON.stringify([newQuestion])
      );
    });

    it('should delete a custom question by id', async () => {
      const questions: Question[] = [
        { id: 'custom_1', text: 'Q1', level: 'mild', type: 'question', category: 'custom' },
        { id: 'custom_2', text: 'Q2', level: 'mild', type: 'question', category: 'custom' },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(questions));

      await StorageService.deleteCustomQuestion('custom_1');

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@kinky_picker_custom_questions',
        JSON.stringify([questions[1]])
      );
    });
  });

  describe('Tutorial', () => {
    it('should return false when tutorial has not been seen', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const seen = await StorageService.getTutorialSeen();

      expect(seen).toBe(false);
    });

    it('should return true when tutorial has been seen', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('true');

      const seen = await StorageService.getTutorialSeen();

      expect(seen).toBe(true);
    });

    it('should mark tutorial as seen', async () => {
      await StorageService.setTutorialSeen();

      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@kinky_picker_tutorial_seen', 'true');
    });
  });

  describe('User Progress', () => {
    it('should return default user progress when no data exists', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const progress = await StorageService.getUserProgress();

      expect(progress.level).toBe(1);
      expect(progress.xp).toBe(0);
      expect(progress.stats.totalRounds).toBe(0);
    });

    it('should convert arrays back to Sets when retrieving progress', async () => {
      const storedProgress = {
        ...defaultUserProgress,
        stats: {
          ...defaultUserProgress.stats,
          levelsPlayed: ['mild', 'spicy'],
          categoriesPlayed: ['classic', 'party'],
        },
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(storedProgress));

      const progress = await StorageService.getUserProgress();

      expect(progress.stats.levelsPlayed).toBeInstanceOf(Set);
      expect(progress.stats.levelsPlayed.size).toBe(2);
      expect(progress.stats.levelsPlayed.has('mild')).toBe(true);
      expect(progress.stats.categoriesPlayed).toBeInstanceOf(Set);
      expect(progress.stats.categoriesPlayed.size).toBe(2);
    });

    it('should convert Sets to arrays when saving progress', async () => {
      const progress = {
        ...defaultUserProgress,
        stats: {
          ...defaultUserProgress.stats,
          levelsPlayed: new Set<IntensityLevel>(['mild', 'extreme']),
          categoriesPlayed: new Set<QuestionCategory>(['romantic']),
        },
      };

      await StorageService.saveUserProgress(progress);

      const savedData = (AsyncStorage.setItem as jest.Mock).mock.calls[0][1];
      const parsed = JSON.parse(savedData);

      expect(Array.isArray(parsed.stats.levelsPlayed)).toBe(true);
      expect(Array.isArray(parsed.stats.categoriesPlayed)).toBe(true);
      expect(parsed.stats.levelsPlayed).toContain('mild');
      expect(parsed.stats.levelsPlayed).toContain('extreme');
    });

    it('should add XP and update level correctly', async () => {
      const initialProgress = {
        ...defaultUserProgress,
        xp: 50,
        level: 1,
        stats: {
          ...defaultUserProgress.stats,
          levelsPlayed: [],  // Serialize Sets as arrays for mock
          categoriesPlayed: [],
        },
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(initialProgress));

      const updatedProgress = await StorageService.addXP(100);

      expect(updatedProgress.xp).toBe(150);
      expect(updatedProgress.level).toBe(2); // Should level up to 2
    });

    it('should reset user progress', async () => {
      // Clear previous mock calls to ensure we're testing only this reset
      jest.clearAllMocks();

      await StorageService.resetUserProgress();

      const calls = (AsyncStorage.setItem as jest.Mock).mock.calls;
      const lastCall = calls[calls.length - 1];
      const savedData = lastCall[1];
      const parsed = JSON.parse(savedData);

      expect(parsed.level).toBe(1);
      expect(parsed.xp).toBe(0);
    });
  });

  describe('Clear All', () => {
    it('should clear all storage keys', async () => {
      await StorageService.clearAll();

      expect(AsyncStorage.multiRemove).toHaveBeenCalled();
      const calledKeys = (AsyncStorage.multiRemove as jest.Mock).mock.calls[0][0];
      expect(calledKeys).toContain('@kinky_picker_stats');
      expect(calledKeys).toContain('@kinky_picker_settings');
      expect(calledKeys).toContain('@kinky_picker_tutorial_seen');
    });
  });
});
