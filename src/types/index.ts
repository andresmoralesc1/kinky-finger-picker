export type GameMode = 'hetero' | 'gay' | 'lesbian';

export type IntensityLevel = 'mild' | 'spicy' | 'extreme';

export type QuestionCategory = 'classic' | 'romantic' | 'party' | 'nsfw' | 'custom';

export interface Question {
  id: string;
  text: string;
  level: IntensityLevel;
  type: 'dare' | 'question';
  category: QuestionCategory;
  isCustom?: boolean;
}

export interface TouchPoint {
  id: number;
  x: number;
  y: number;
  timestamp: number;
}

export interface Player {
  id: number;
  x: number;
  y: number;
  color: string;
  gender?: 'male' | 'female';
}

export interface PlayerStats {
  playerId: number;
  color: string;
  timesSelected: number;
  daresCompleted: number;
  daresSkipped: number;
}

export interface GameStats {
  totalRounds: number;
  totalPlayers: number;
  currentSession: PlayerStats[];
  levelDistribution: {
    mild: number;
    spicy: number;
    extreme: number;
  };
  categoryDistribution: {
    classic: number;
    romantic: number;
    party: number;
    nsfw: number;
    custom: number;
  };
}

export type ThemeName = 'default' | 'neon' | 'pastel' | 'dark' | 'ocean' | 'sunset';

export interface Settings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticEnabled: boolean;
  avoidRepetition: boolean;
  skipLimit: number;
  timerDuration: number; // in seconds
  showTutorial: boolean;
  categories: QuestionCategory[];
  selectedTheme: ThemeName;
}

// Achievements System
export type AchievementCategory = 'milestone' | 'specialty' | 'collection' | 'challenge';
export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  icon: string; // emoji
  requirement: number; // required value to unlock
  progress: number; // current progress
  unlocked: boolean;
  unlockedAt?: Date;
  xpReward: number;
}

export interface UserProgress {
  level: number;
  xp: number;
  achievements: Achievement[];
  stats: {
    totalRounds: number;
    totalDaresCompleted: number;
    totalDaresSkipped: number;
    consecutiveCompletions: number;
    maxConsecutiveCompletions: number;
    levelsPlayed: Set<IntensityLevel>;
    categoriesPlayed: Set<QuestionCategory>;
    timesSelected: number;
    sharesCount: number;
    fastestCompletion: number; // in seconds
    longestSession: number; // rounds in single session
  };
}

// Daily Challenges System
export type DailyChallengeType =
  | 'rounds'
  | 'level_specific'
  | 'consecutive'
  | 'mode_specific'
  | 'category_specific'
  | 'social'
  | 'speed';

export type ChallengeDifficulty = 'normal' | 'hard' | 'epic';

export interface DailyChallenge {
  id: string;
  type: DailyChallengeType;
  title: string;
  description: string;
  difficulty: ChallengeDifficulty;
  requirement: number;
  progress: number;
  completed: boolean;
  xpReward: number;
  icon: string; // emoji
  // Type-specific requirements
  specificLevel?: IntensityLevel;
  specificMode?: GameMode;
  specificCategory?: QuestionCategory;
}

export interface DailyChallengeProgress {
  date: string; // ISO date string
  challenges: DailyChallenge[];
  streak: number; // consecutive days completed
  lastCompletedDate?: string; // ISO date string
  totalChallengesCompleted: number;
  // Daily progress tracking
  dailyStats: {
    roundsPlayed: number;
    daresCompleted: number;
    consecutiveCompletions: number;
    sharesCount: number;
    levelStats: {
      mild: number;
      spicy: number;
      extreme: number;
    };
    modeStats: {
      hetero: number;
      gay: number;
      lesbian: number;
    };
    categoryStats: {
      classic: number;
      romantic: number;
      party: number;
      nsfw: number;
      custom: number;
    };
    fastestCompletion: number;
  };
}
