import { Achievement, AchievementCategory, AchievementRarity, UserProgress, IntensityLevel, QuestionCategory } from '../types';

// Define all achievements
export const ACHIEVEMENTS: Omit<Achievement, 'progress' | 'unlocked' | 'unlockedAt'>[] = [
  // MILESTONE ACHIEVEMENTS
  {
    id: 'first_blood',
    title: 'Primera Sangre',
    description: 'Completa tu primer reto',
    category: 'milestone',
    rarity: 'common',
    icon: '🎯',
    requirement: 1,
    xpReward: 50,
  },
  {
    id: 'party_starter',
    title: 'El Alma de la Fiesta',
    description: 'Juega 10 rondas',
    category: 'milestone',
    rarity: 'common',
    icon: '🎉',
    requirement: 10,
    xpReward: 100,
  },
  {
    id: 'party_animal',
    title: 'Fiestero Total',
    description: 'Juega 50 rondas',
    category: 'milestone',
    rarity: 'rare',
    icon: '🦁',
    requirement: 50,
    xpReward: 250,
  },
  {
    id: 'legend',
    title: 'Leyenda',
    description: 'Juega 100 rondas',
    category: 'milestone',
    rarity: 'epic',
    icon: '👑',
    requirement: 100,
    xpReward: 500,
  },
  {
    id: 'immortal',
    title: 'Inmortal',
    description: 'Juega 500 rondas',
    category: 'milestone',
    rarity: 'legendary',
    icon: '⚡',
    requirement: 500,
    xpReward: 1000,
  },

  // SPECIALTY ACHIEVEMENTS
  {
    id: 'dare_devil',
    title: 'Temerario',
    description: 'Completa 10 retos sin saltar ninguno',
    category: 'specialty',
    rarity: 'rare',
    icon: '😈',
    requirement: 10,
    xpReward: 200,
  },
  {
    id: 'lucky_one',
    title: 'El Afortunado',
    description: 'Sé seleccionado 20 veces',
    category: 'specialty',
    rarity: 'common',
    icon: '🍀',
    requirement: 20,
    xpReward: 150,
  },
  {
    id: 'brave_soul',
    title: 'Alma Valiente',
    description: 'Completa un reto en nivel Extremo',
    category: 'specialty',
    rarity: 'rare',
    icon: '🔥',
    requirement: 1,
    xpReward: 200,
  },
  {
    id: 'speed_demon',
    title: 'Demonio Veloz',
    description: 'Completa un reto en menos de 10 segundos',
    category: 'specialty',
    rarity: 'epic',
    icon: '⚡',
    requirement: 1,
    xpReward: 300,
  },
  {
    id: 'unstoppable',
    title: 'Imparable',
    description: 'Completa 5 retos consecutivos sin saltar',
    category: 'specialty',
    rarity: 'rare',
    icon: '💪',
    requirement: 5,
    xpReward: 250,
  },

  // COLLECTION ACHIEVEMENTS
  {
    id: 'explorer',
    title: 'Explorador',
    description: 'Juega los 3 niveles de intensidad',
    category: 'collection',
    rarity: 'common',
    icon: '🗺️',
    requirement: 3,
    xpReward: 100,
  },
  {
    id: 'versatile',
    title: 'Versátil',
    description: 'Responde preguntas de todas las categorías',
    category: 'collection',
    rarity: 'rare',
    icon: '🎭',
    requirement: 4,
    xpReward: 200,
  },
  {
    id: 'social_butterfly',
    title: 'Mariposa Social',
    description: 'Comparte 5 momentos',
    category: 'collection',
    rarity: 'common',
    icon: '📱',
    requirement: 5,
    xpReward: 150,
  },
  {
    id: 'influencer',
    title: 'Influencer',
    description: 'Comparte 20 momentos',
    category: 'collection',
    rarity: 'epic',
    icon: '📸',
    requirement: 20,
    xpReward: 400,
  },

  // CHALLENGE ACHIEVEMENTS
  {
    id: 'no_mercy',
    title: 'Sin Piedad',
    description: 'Completa una sesión sin ningún salto',
    category: 'challenge',
    rarity: 'epic',
    icon: '⚔️',
    requirement: 1,
    xpReward: 350,
  },
  {
    id: 'marathon_player',
    title: 'Maratonista',
    description: 'Juega 30 o más rondas en una sola sesión',
    category: 'challenge',
    rarity: 'rare',
    icon: '🏃',
    requirement: 30,
    xpReward: 300,
  },
  {
    id: 'comeback_king',
    title: 'Rey del Regreso',
    description: 'Sé seleccionado 3 veces seguidas',
    category: 'challenge',
    rarity: 'epic',
    icon: '🎲',
    requirement: 3,
    xpReward: 400,
  },
  {
    id: 'ultimate_champion',
    title: 'Campeón Definitivo',
    description: 'Alcanza el Nivel 10',
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
