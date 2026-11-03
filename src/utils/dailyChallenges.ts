import {
  DailyChallenge,
  DailyChallengeProgress,
  DailyChallengeType,
  ChallengeDifficulty,
  IntensityLevel,
  GameMode,
  QuestionCategory,
} from '../types';

// All possible daily challenges
const CHALLENGE_TEMPLATES: Omit<DailyChallenge, 'progress' | 'completed'>[] = [
  // ROUNDS CHALLENGES
  {
    id: 'rounds_5',
    type: 'rounds',
    title: 'El Alma de la Fiesta',
    description: 'Juega 5 rondas hoy',
    difficulty: 'normal',
    requirement: 5,
    xpReward: 150,
    icon: '🎲',
  },
  {
    id: 'rounds_10',
    type: 'rounds',
    title: 'Fiestero Total',
    description: 'Juega 10 rondas hoy',
    difficulty: 'normal',
    requirement: 10,
    xpReward: 200,
    icon: '🎉',
  },
  {
    id: 'rounds_20',
    type: 'rounds',
    title: 'Sesión Maratónica',
    description: 'Juega 20 rondas hoy',
    difficulty: 'hard',
    requirement: 20,
    xpReward: 350,
    icon: '🏃',
  },

  // LEVEL SPECIFIC CHALLENGES
  {
    id: 'mild_master',
    type: 'level_specific',
    title: 'Maestro Suave',
    description: 'Completa 5 retos en nivel Suave',
    difficulty: 'normal',
    requirement: 5,
    xpReward: 150,
    icon: '🌶️',
    specificLevel: 'mild',
  },
  {
    id: 'spicy_expert',
    type: 'level_specific',
    title: 'Experto Picante',
    description: 'Completa 5 retos en nivel Picante',
    difficulty: 'normal',
    requirement: 5,
    xpReward: 200,
    icon: '🌶️🌶️',
    specificLevel: 'spicy',
  },
  {
    id: 'extreme_brave',
    type: 'level_specific',
    title: 'Valentía Extrema',
    description: 'Completa 3 retos en nivel Extremo',
    difficulty: 'hard',
    requirement: 3,
    xpReward: 300,
    icon: '🔥',
    specificLevel: 'extreme',
  },

  // CONSECUTIVE CHALLENGES
  {
    id: 'no_skip_5',
    type: 'consecutive',
    title: 'Sin Piedad',
    description: 'Completa 5 retos consecutivos sin saltar',
    difficulty: 'normal',
    requirement: 5,
    xpReward: 200,
    icon: '⚔️',
  },
  {
    id: 'no_skip_10',
    type: 'consecutive',
    title: 'Imparable',
    description: 'Completa 10 retos consecutivos sin saltar',
    difficulty: 'hard',
    requirement: 10,
    xpReward: 400,
    icon: '💪',
  },

  // MODE SPECIFIC CHALLENGES
  {
    id: 'gay_mode',
    type: 'mode_specific',
    title: 'Fiesta Rainbow',
    description: 'Juega 5 rondas en modo Gay',
    difficulty: 'normal',
    requirement: 5,
    xpReward: 150,
    icon: '🌈',
    specificMode: 'gay',
  },
  {
    id: 'lesbian_mode',
    type: 'mode_specific',
    title: 'Sesión Sáfica',
    description: 'Juega 5 rondas en modo Lésbico',
    difficulty: 'normal',
    requirement: 5,
    xpReward: 150,
    icon: '💖',
    specificMode: 'lesbian',
  },

  // CATEGORY SPECIFIC CHALLENGES
  {
    id: 'romantic_5',
    type: 'category_specific',
    title: 'Noche Romántica',
    description: 'Responde 5 preguntas Románticas',
    difficulty: 'normal',
    requirement: 5,
    xpReward: 150,
    icon: '💕',
    specificCategory: 'romantic',
  },
  {
    id: 'party_hard',
    type: 'category_specific',
    title: 'Fiesta Total',
    description: 'Responde 7 preguntas de Fiesta',
    difficulty: 'normal',
    requirement: 7,
    xpReward: 200,
    icon: '🎊',
    specificCategory: 'party',
  },
  {
    id: 'nsfw_brave',
    type: 'category_specific',
    title: 'Sin Límites',
    description: 'Responde 5 preguntas Picantes (+18)',
    difficulty: 'hard',
    requirement: 5,
    xpReward: 300,
    icon: '🔞',
    specificCategory: 'nsfw',
  },

  // SOCIAL CHALLENGES
  {
    id: 'share_3',
    type: 'social',
    title: 'Mariposa Social',
    description: 'Comparte 3 momentos hoy',
    difficulty: 'normal',
    requirement: 3,
    xpReward: 150,
    icon: '📱',
  },
  {
    id: 'share_5',
    type: 'social',
    title: 'Influencer',
    description: 'Comparte 5 momentos hoy',
    difficulty: 'hard',
    requirement: 5,
    xpReward: 300,
    icon: '📸',
  },

  // SPEED CHALLENGES
  {
    id: 'speed_15',
    type: 'speed',
    title: 'Demonio Veloz',
    description: 'Completa un reto en menos de 15 segundos',
    difficulty: 'hard',
    requirement: 1,
    xpReward: 300,
    icon: '⚡',
  },
  {
    id: 'speed_10',
    type: 'speed',
    title: 'Rayo Veloz',
    description: 'Completa un reto en menos de 10 segundos',
    difficulty: 'epic',
    requirement: 1,
    xpReward: 500,
    icon: '⚡⚡',
  },
];

// Get today's date as YYYY-MM-DD
export function getTodayDateString(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

// Check if it's a new day
export function isNewDay(lastDate?: string): boolean {
  if (!lastDate) return true;
  return lastDate !== getTodayDateString();
}

// Generate daily challenges for today
export function generateDailyChallenges(seed?: string): DailyChallenge[] {
  // Use date as seed for consistent daily rotation
  const dateString = seed || getTodayDateString();
  const hash = simpleHash(dateString);

  // Select 2-3 challenges based on date hash
  const numChallenges = 2 + (hash % 2); // 2 or 3 challenges
  const selectedChallenges: DailyChallenge[] = [];

  // Shuffle templates deterministically based on date
  const shuffled = [...CHALLENGE_TEMPLATES].sort((a, b) => {
    const hashA = simpleHash(dateString + a.id);
    const hashB = simpleHash(dateString + b.id);
    return hashA - hashB;
  });

  // Ensure variety: at most one of each type
  const usedTypes = new Set<DailyChallengeType>();

  for (const template of shuffled) {
    if (selectedChallenges.length >= numChallenges) break;
    if (usedTypes.has(template.type)) continue;

    selectedChallenges.push({
      ...template,
      progress: 0,
      completed: false,
    });
    usedTypes.add(template.type);
  }

  return selectedChallenges;
}

// Simple hash function for deterministic randomness
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Initialize daily challenge progress
export function initializeDailyChallengeProgress(): DailyChallengeProgress {
  return {
    date: getTodayDateString(),
    challenges: generateDailyChallenges(),
    streak: 0,
    totalChallengesCompleted: 0,
    dailyStats: {
      roundsPlayed: 0,
      daresCompleted: 0,
      consecutiveCompletions: 0,
      sharesCount: 0,
      levelStats: { mild: 0, spicy: 0, extreme: 0 },
      modeStats: { hetero: 0, gay: 0, lesbian: 0 },
      categoryStats: { classic: 0, romantic: 0, party: 0, nsfw: 0, custom: 0 },
      fastestCompletion: 0,
    },
  };
}

// Reset daily stats for a new day
export function resetDailyStats(
  progress: DailyChallengeProgress
): DailyChallengeProgress {
  // Check if all challenges were completed yesterday
  const allCompleted = progress.challenges.every(c => c.completed);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toISOString().split('T')[0];

  // Update streak
  let newStreak = progress.streak;
  if (allCompleted && progress.date === yesterdayString) {
    newStreak += 1;
  } else if (progress.date !== yesterdayString) {
    newStreak = 0; // Streak broken
  }

  return {
    date: getTodayDateString(),
    challenges: generateDailyChallenges(),
    streak: newStreak,
    lastCompletedDate: allCompleted ? progress.date : progress.lastCompletedDate,
    totalChallengesCompleted: progress.totalChallengesCompleted,
    dailyStats: {
      roundsPlayed: 0,
      daresCompleted: 0,
      consecutiveCompletions: 0,
      sharesCount: 0,
      levelStats: { mild: 0, spicy: 0, extreme: 0 },
      modeStats: { hetero: 0, gay: 0, lesbian: 0 },
      categoryStats: { classic: 0, romantic: 0, party: 0, nsfw: 0, custom: 0 },
      fastestCompletion: 0,
    },
  };
}

// Update challenge progress based on game action
export function updateChallengeProgress(
  progress: DailyChallengeProgress,
  dailyStats: DailyChallengeProgress['dailyStats']
): DailyChallengeProgress {
  const updatedChallenges = progress.challenges.map(challenge => {
    if (challenge.completed) return challenge;

    let newProgress = challenge.progress;

    switch (challenge.type) {
      case 'rounds':
        newProgress = dailyStats.roundsPlayed;
        break;

      case 'level_specific':
        if (challenge.specificLevel) {
          newProgress = dailyStats.levelStats[challenge.specificLevel];
        }
        break;

      case 'consecutive':
        newProgress = dailyStats.consecutiveCompletions;
        break;

      case 'mode_specific':
        if (challenge.specificMode) {
          newProgress = dailyStats.modeStats[challenge.specificMode];
        }
        break;

      case 'category_specific':
        if (challenge.specificCategory) {
          newProgress = dailyStats.categoryStats[challenge.specificCategory];
        }
        break;

      case 'social':
        newProgress = dailyStats.sharesCount;
        break;

      case 'speed':
        // Speed challenge: check if fastest completion meets requirement
        if (dailyStats.fastestCompletion > 0 &&
            dailyStats.fastestCompletion <= challenge.requirement) {
          newProgress = 1;
        }
        break;
    }

    const completed = newProgress >= challenge.requirement;

    return {
      ...challenge,
      progress: newProgress,
      completed,
    };
  });

  // Count newly completed challenges
  const newlyCompleted = updatedChallenges.filter(
    (c, i) => c.completed && !progress.challenges[i].completed
  );

  return {
    ...progress,
    challenges: updatedChallenges,
    dailyStats,
    totalChallengesCompleted:
      progress.totalChallengesCompleted + newlyCompleted.length,
  };
}

// Get total XP reward for completed challenges today
export function getTotalXPReward(progress: DailyChallengeProgress): number {
  const challengeXP = progress.challenges
    .filter(c => c.completed)
    .reduce((sum, c) => sum + c.xpReward, 0);

  // Streak bonus: +50 XP per day in streak (max 500)
  const streakBonus = Math.min(progress.streak * 50, 500);

  return challengeXP + streakBonus;
}

// Get difficulty color
export function getDifficultyColor(difficulty: ChallengeDifficulty): string {
  switch (difficulty) {
    case 'normal': return '#FFFFFF';
    case 'hard': return '#FF4D5A';
    case 'epic': return '#E50914';
  }
}

// Get difficulty text
export function getDifficultyText(difficulty: ChallengeDifficulty): string {
  switch (difficulty) {
    case 'normal': return 'NORMAL';
    case 'hard': return 'DIFÍCIL';
    case 'epic': return 'ÉPICO';
  }
}
