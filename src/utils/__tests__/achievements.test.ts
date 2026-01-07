import {
  calculateLevel,
  getXpForNextLevel,
  initializeAchievements,
  checkAchievements,
  getRarityColor,
  getRarityGlow,
  XP_PER_LEVEL,
  ACHIEVEMENTS,
} from '../achievements';
import { UserProgress, Achievement } from '../../types';

describe('achievements utility functions', () => {
  describe('calculateLevel', () => {
    it('should return level 1 for 0 XP', () => {
      expect(calculateLevel(0)).toBe(1);
    });

    it('should return level 2 for 100 XP', () => {
      expect(calculateLevel(100)).toBe(2);
    });

    it('should return level 5 for 1000 XP', () => {
      expect(calculateLevel(1000)).toBe(5);
    });

    it('should return level 10 for 10000 XP or more', () => {
      expect(calculateLevel(10000)).toBe(10);
      expect(calculateLevel(15000)).toBe(10);
    });

    it('should handle edge cases correctly', () => {
      expect(calculateLevel(99)).toBe(1);
      expect(calculateLevel(249)).toBe(2);
      expect(calculateLevel(499)).toBe(3);
    });
  });

  describe('getXpForNextLevel', () => {
    it('should return correct XP for next level', () => {
      expect(getXpForNextLevel(1)).toBe(100);
      expect(getXpForNextLevel(2)).toBe(250);
      expect(getXpForNextLevel(5)).toBe(1500);
    });

    it('should return max level XP for level 10 and above', () => {
      expect(getXpForNextLevel(10)).toBe(10000);
      expect(getXpForNextLevel(15)).toBe(10000);
    });
  });

  describe('initializeAchievements', () => {
    it('should initialize all achievements with progress 0 and unlocked false', () => {
      const achievements = initializeAchievements();

      expect(achievements).toHaveLength(ACHIEVEMENTS.length);
      achievements.forEach(achievement => {
        expect(achievement.progress).toBe(0);
        expect(achievement.unlocked).toBe(false);
        expect(achievement.unlockedAt).toBeUndefined();
      });
    });

    it('should preserve all achievement properties', () => {
      const achievements = initializeAchievements();
      const firstAchievement = achievements[0];

      expect(firstAchievement.id).toBeDefined();
      expect(firstAchievement.title).toBeDefined();
      expect(firstAchievement.description).toBeDefined();
      expect(firstAchievement.category).toBeDefined();
      expect(firstAchievement.rarity).toBeDefined();
      expect(firstAchievement.icon).toBeDefined();
      expect(firstAchievement.requirement).toBeDefined();
      expect(firstAchievement.xpReward).toBeDefined();
    });
  });

  describe('checkAchievements', () => {
    let mockUserProgress: UserProgress;
    let mockAchievements: Achievement[];

    beforeEach(() => {
      mockUserProgress = {
        level: 1,
        xp: 0,
        achievements: [],
        stats: {
          totalRounds: 0,
          totalDaresCompleted: 0,
          totalDaresSkipped: 0,
          consecutiveCompletions: 0,
          maxConsecutiveCompletions: 0,
          levelsPlayed: new Set(),
          categoriesPlayed: new Set(),
          timesSelected: 0,
          sharesCount: 0,
          fastestCompletion: 0,
          longestSession: 0,
        },
      };

      mockAchievements = initializeAchievements();
    });

    it('should unlock "First Blood" achievement after 1 round', () => {
      mockUserProgress.stats.totalRounds = 1;

      const { updatedAchievements, newlyUnlocked } = checkAchievements(
        mockUserProgress,
        mockAchievements
      );

      const firstBlood = updatedAchievements.find(a => a.id === 'first_blood');
      expect(firstBlood?.unlocked).toBe(true);
      expect(firstBlood?.progress).toBe(1);
      expect(newlyUnlocked).toHaveLength(1);
      expect(newlyUnlocked[0].id).toBe('first_blood');
    });

    it('should unlock multiple achievements when requirements are met', () => {
      mockUserProgress.stats.totalRounds = 10;

      const { updatedAchievements, newlyUnlocked } = checkAchievements(
        mockUserProgress,
        mockAchievements
      );

      const firstBlood = updatedAchievements.find(a => a.id === 'first_blood');
      const partyStarter = updatedAchievements.find(a => a.id === 'party_starter');

      expect(firstBlood?.unlocked).toBe(true);
      expect(partyStarter?.unlocked).toBe(true);
      expect(newlyUnlocked).toHaveLength(2);
    });

    it('should not re-unlock already unlocked achievements', () => {
      const alreadyUnlocked = mockAchievements.map(a =>
        a.id === 'first_blood' ? { ...a, unlocked: true, unlockedAt: new Date('2024-01-01') } : a
      );

      mockUserProgress.stats.totalRounds = 10;

      const { newlyUnlocked } = checkAchievements(
        mockUserProgress,
        alreadyUnlocked
      );

      expect(newlyUnlocked.some(a => a.id === 'first_blood')).toBe(false);
    });

    it('should unlock "Explorer" when all 3 levels are played', () => {
      mockUserProgress.stats.levelsPlayed = new Set(['mild', 'spicy', 'extreme']);

      const { updatedAchievements } = checkAchievements(
        mockUserProgress,
        mockAchievements
      );

      const explorer = updatedAchievements.find(a => a.id === 'explorer');
      expect(explorer?.unlocked).toBe(true);
    });

    it('should unlock "Brave Soul" when extreme level is played', () => {
      mockUserProgress.stats.levelsPlayed = new Set(['extreme']);

      const { updatedAchievements } = checkAchievements(
        mockUserProgress,
        mockAchievements
      );

      const braveSoul = updatedAchievements.find(a => a.id === 'brave_soul');
      expect(braveSoul?.unlocked).toBe(true);
    });

    it('should unlock "Speed Demon" for completion under 10 seconds', () => {
      mockUserProgress.stats.fastestCompletion = 9;

      const { updatedAchievements } = checkAchievements(
        mockUserProgress,
        mockAchievements
      );

      const speedDemon = updatedAchievements.find(a => a.id === 'speed_demon');
      expect(speedDemon?.unlocked).toBe(true);
    });

    it('should NOT unlock "Speed Demon" for completion over 10 seconds', () => {
      mockUserProgress.stats.fastestCompletion = 11;

      const { updatedAchievements } = checkAchievements(
        mockUserProgress,
        mockAchievements
      );

      const speedDemon = updatedAchievements.find(a => a.id === 'speed_demon');
      expect(speedDemon?.unlocked).toBe(false);
    });
  });

  describe('getRarityColor', () => {
    it('should return correct colors for each rarity', () => {
      expect(getRarityColor('common')).toBe('#B0B0B0');
      expect(getRarityColor('rare')).toBe('#4A9EFF');
      expect(getRarityColor('epic')).toBe('#A335EE');
      expect(getRarityColor('legendary')).toBe('#FF8000');
    });
  });

  describe('getRarityGlow', () => {
    it('should return correct glow colors for each rarity', () => {
      expect(getRarityGlow('common')).toBe('rgba(176, 176, 176, 0.3)');
      expect(getRarityGlow('rare')).toBe('rgba(74, 158, 255, 0.5)');
      expect(getRarityGlow('epic')).toBe('rgba(163, 53, 238, 0.6)');
      expect(getRarityGlow('legendary')).toBe('rgba(255, 128, 0, 0.8)');
    });
  });

  describe('ACHIEVEMENTS constants', () => {
    it('should have correct number of achievements', () => {
      expect(ACHIEVEMENTS).toHaveLength(18);
    });

    it('should have achievements in all categories', () => {
      const categories = new Set(ACHIEVEMENTS.map(a => a.category));
      expect(categories.has('milestone')).toBe(true);
      expect(categories.has('specialty')).toBe(true);
      expect(categories.has('collection')).toBe(true);
      expect(categories.has('challenge')).toBe(true);
    });

    it('should have achievements of all rarities', () => {
      const rarities = new Set(ACHIEVEMENTS.map(a => a.rarity));
      expect(rarities.has('common')).toBe(true);
      expect(rarities.has('rare')).toBe(true);
      expect(rarities.has('epic')).toBe(true);
      expect(rarities.has('legendary')).toBe(true);
    });

    it('should have unique achievement IDs', () => {
      const ids = ACHIEVEMENTS.map(a => a.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ACHIEVEMENTS.length);
    });
  });

  describe('XP_PER_LEVEL constants', () => {
    it('should have correct progression', () => {
      expect(XP_PER_LEVEL).toHaveLength(10);
      expect(XP_PER_LEVEL[0]).toBe(0);
      expect(XP_PER_LEVEL[9]).toBe(10000);
    });

    it('should be in ascending order', () => {
      for (let i = 1; i < XP_PER_LEVEL.length; i++) {
        expect(XP_PER_LEVEL[i]).toBeGreaterThan(XP_PER_LEVEL[i - 1]);
      }
    });
  });
});
