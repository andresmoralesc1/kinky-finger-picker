import { Achievement, AchievementCategory, AchievementRarity, UserProgress, IntensityLevel, QuestionCategory } from '../types';

// Define all achievements
export const ACHIEVEMENTS: Omit<Achievement, 'progress' | 'unlocked' | 'unlockedAt'>[] = [
  // MILESTONE ACHIEVEMENTS
  {
    id: 'first_blood',
    title: 'First Blood',
    description: 'Complete your first dare',
    category: 'milestone',
    rarity: 'common',
    icon: '🎯',
    requirement: 1,
    xpReward: 50,
  },
  {
    id: 'party_starter',
    title: 'Party Starter',
    description: 'Play 10 rounds',
    category: 'milestone',
    rarity: 'common',
    icon: '🎉',
    requirement: 10,
    xpReward: 100,
  },
  {
    id: 'party_animal',
    title: 'Party Animal',
    description: 'Play 50 rounds',
    category: 'milestone',
    rarity: 'rare',
    icon: '🦁',
    requirement: 50,
    xpReward: 250,
  },
  {
    id: 'legend',
    title: 'Legend',
    description: 'Play 100 rounds',
    category: 'milestone',
    rarity: 'epic',
    icon: '👑',
    requirement: 100,
    xpReward: 500,
  },
  {
    id: 'immortal',
    title: 'Immortal',
    description: 'Play 500 rounds',
    category: 'milestone',
    rarity: 'legendary',
    icon: '⚡',
    requirement: 500,
    xpReward: 1000,
  },

  // SPECIALTY ACHIEVEMENTS
  {
    id: 'dare_devil',
    title: 'Dare Devil',
    description: 'Complete 10 dares without skipping',
    category: 'specialty',
    rarity: 'rare',
    icon: '😈',
    requirement: 10,
    xpReward: 200,
  },
  {
    id: 'lucky_one',
    title: 'Lucky One',
    description: 'Get selected 20 times',
    category: 'specialty',
    rarity: 'common',
    icon: '🍀',
    requirement: 20,
    xpReward: 150,
  },
  {
    id: 'brave_soul',
    title: 'Brave Soul',
    description: 'Complete a dare on Extreme level',
    category: 'specialty',
    rarity: 'rare',
    icon: '🔥',
    requirement: 1,
    xpReward: 200,
  },
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Complete a dare in under 10 seconds',
    category: 'specialty',
    rarity: 'epic',
    icon: '⚡',
    requirement: 1,
    xpReward: 300,
  },
  {
    id: 'unstoppable',
    title: 'Unstoppable',
    description: 'Complete 5 consecutive dares without skipping',
    category: 'specialty',
    rarity: 'rare',
    icon: '💪',
    requirement: 5,
    xpReward: 250,
  },

  // COLLECTION ACHIEVEMENTS
  {
    id: 'explorer',
    title: 'Explorer',
    description: 'Play all 3 intensity levels',
    category: 'collection',
    rarity: 'common',
    icon: '🗺️',
    requirement: 3,
    xpReward: 100,
  },
  {
    id: 'versatile',
    title: 'Versatile',
    description: 'Answer questions from all categories',
    category: 'collection',
    rarity: 'rare',
    icon: '🎭',
    requirement: 4,
    xpReward: 200,
  },
  {
    id: 'social_butterfly',
    title: 'Social Butterfly',
    description: 'Share 5 moments',
    category: 'collection',
    rarity: 'common',
    icon: '📱',
    requirement: 5,
    xpReward: 150,
  },
  {
    id: 'influencer',
    title: 'Influencer',
    description: 'Share 20 moments',
    category: 'collection',
    rarity: 'epic',
    icon: '📸',
    requirement: 20,
    xpReward: 400,
  },

  // CHALLENGE ACHIEVEMENTS
  {
    id: 'no_mercy',
    title: 'No Mercy',
    description: 'Complete a session without any skips',
    category: 'challenge',
    rarity: 'epic',
    icon: '⚔️',
    requirement: 1,
    xpReward: 350,
  },
  {
    id: 'marathon_player',
    title: 'Marathon Player',
    description: 'Play 30+ rounds in a single session',
    category: 'challenge',
    rarity: 'rare',
    icon: '🏃',
    requirement: 30,
    xpReward: 300,
  },
  {
    id: 'comeback_king',
    title: 'Comeback King',
    description: 'Get selected 3 times in a row',
    category: 'challenge',
    rarity: 'epic',
    icon: '🎲',
    requirement: 3,
    xpReward: 400,
  },
  {
    id: 'ultimate_champion',
    title: 'Ultimate Champion',
    description: 'Reach Level 10',
    category: 'challenge',
    rarity: 'legendary',
    icon: '🏆',
    requirement: 10,
    xpReward: 1000,
  },
];

// XP required for each level
export const XP_PER_LEVEL = [
  0,     // Level 1
  100,   // Level 2
  250,   // Level 3
  500,   // Level 4
  1000,  // Level 5
  1500,  // Level 6
  2500,  // Level 7
  4000,  // Level 8
  6000,  // Level 9
  10000, // Level 10
];

export function calculateLevel(xp: number): number {
  let level = 1;
  for (let i = 0; i < XP_PER_LEVEL.length; i++) {
    if (xp >= XP_PER_LEVEL[i]) {
      level = i + 1;
    } else {
      break;
    }
  }
  return level;
}

export function getXpForNextLevel(currentLevel: number): number {
  if (currentLevel >= XP_PER_LEVEL.length) {
    return XP_PER_LEVEL[XP_PER_LEVEL.length - 1];
  }
  return XP_PER_LEVEL[currentLevel];
}

export function initializeAchievements(): Achievement[] {
  return ACHIEVEMENTS.map(achievement => ({
    ...achievement,
    progress: 0,
    unlocked: false,
  }));
}

// Check and update achievements based on user progress
export function checkAchievements(
  userProgress: UserProgress,
  achievements: Achievement[]
): { updatedAchievements: Achievement[]; newlyUnlocked: Achievement[] } {
  const newlyUnlocked: Achievement[] = [];

  const updatedAchievements = achievements.map(achievement => {
    if (achievement.unlocked) return achievement;

    let currentProgress = 0;

    // Calculate progress based on achievement ID
    switch (achievement.id) {
      // Milestone achievements
      case 'first_blood':
      case 'party_starter':
      case 'party_animal':
      case 'legend':
      case 'immortal':
        currentProgress = userProgress.stats.totalRounds;
        break;

      // Specialty achievements
      case 'dare_devil':
        currentProgress = userProgress.stats.maxConsecutiveCompletions;
        break;
      case 'lucky_one':
        currentProgress = userProgress.stats.timesSelected;
        break;
      case 'brave_soul':
        currentProgress = userProgress.stats.levelsPlayed.has('extreme') ? 1 : 0;
        break;
      case 'speed_demon':
        currentProgress = userProgress.stats.fastestCompletion > 0 && userProgress.stats.fastestCompletion <= 10 ? 1 : 0;
        break;
      case 'unstoppable':
        currentProgress = userProgress.stats.consecutiveCompletions;
        break;

      // Collection achievements
      case 'explorer':
        currentProgress = userProgress.stats.levelsPlayed.size;
        break;
      case 'versatile':
        currentProgress = userProgress.stats.categoriesPlayed.size;
        break;
      case 'social_butterfly':
      case 'influencer':
        currentProgress = userProgress.stats.sharesCount;
        break;

      // Challenge achievements
      case 'no_mercy':
        // This is checked manually when session ends
        currentProgress = achievement.progress;
        break;
      case 'marathon_player':
        currentProgress = userProgress.stats.longestSession;
        break;
      case 'comeback_king':
        // This is checked manually during gameplay
        currentProgress = achievement.progress;
        break;
      case 'ultimate_champion':
        currentProgress = userProgress.level;
        break;
    }

    const wasUnlocked = achievement.unlocked;
    const isNowUnlocked = currentProgress >= achievement.requirement;

    if (!wasUnlocked && isNowUnlocked) {
      newlyUnlocked.push({
        ...achievement,
        progress: currentProgress,
        unlocked: true,
        unlockedAt: new Date(),
      });
    }

    return {
      ...achievement,
      progress: currentProgress,
      unlocked: isNowUnlocked,
      unlockedAt: isNowUnlocked && !wasUnlocked ? new Date() : achievement.unlockedAt,
    };
  });

  return { updatedAchievements, newlyUnlocked };
}

export function getRarityColor(rarity: AchievementRarity): string {
  switch (rarity) {
    case 'common': return '#B0B0B0';
    case 'rare': return '#4A9EFF';
    case 'epic': return '#A335EE';
    case 'legendary': return '#FF8000';
  }
}

export function getRarityGlow(rarity: AchievementRarity): string {
  switch (rarity) {
    case 'common': return 'rgba(176, 176, 176, 0.3)';
    case 'rare': return 'rgba(74, 158, 255, 0.5)';
    case 'epic': return 'rgba(163, 53, 238, 0.6)';
    case 'legendary': return 'rgba(255, 128, 0, 0.8)';
  }
}
