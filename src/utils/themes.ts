/**
 * Visual Themes System
 * Provides multiple color schemes for customization
 */

export type ThemeName = 'default' | 'neon' | 'pastel' | 'dark' | 'ocean' | 'sunset';

export interface Theme {
  id: ThemeName;
  name: string;
  emoji: string;
  unlockRequirement: {
    type: 'level' | 'achievement' | 'rounds';
    value: number | string;
  };
  colors: {
    background: string;
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    textSecondary: string;
    success: string;
    warning: string;
    danger: string;
    cardBackground: string;
    borderColor: string;
    playerColors: string[];
    gradients: {
      primary: string[];
      secondary: string[];
      accent: string[];
    };
  };
}

export const THEMES: Record<ThemeName, Theme> = {
  default: {
    id: 'default',
    name: 'Classic',
    emoji: '🎨',
    unlockRequirement: {
      type: 'level',
      value: 1,
    },
    colors: {
      background: '#000000',
      primary: '#FF006E',
      secondary: '#8338EC',
      accent: '#FFBE0B',
      text: '#FFFFFF',
      textSecondary: '#AAAAAA',
      success: '#06FFA5',
      warning: '#FFBE0B',
      danger: '#FF006E',
      cardBackground: '#1A1A1A',
      borderColor: '#333333',
      playerColors: [
        '#FF006E',
        '#8338EC',
        '#3A86FF',
        '#06FFA5',
        '#FFBE0B',
        '#FB5607',
      ],
      gradients: {
        primary: ['#FF006E', '#8338EC'],
        secondary: ['#8338EC', '#3A86FF'],
        accent: ['#FFBE0B', '#FB5607'],
      },
    },
  },

  neon: {
    id: 'neon',
    name: 'Neon Nights',
    emoji: '✨',
    unlockRequirement: {
      type: 'level',
      value: 5,
    },
    colors: {
      background: '#0A0A0A',
      primary: '#FF00FF',
      secondary: '#00FFFF',
      accent: '#FFFF00',
      text: '#FFFFFF',
      textSecondary: '#CCCCCC',
      success: '#00FF00',
      warning: '#FFD700',
      danger: '#FF1493',
      cardBackground: '#1A1A2E',
      borderColor: '#FF00FF',
      playerColors: [
        '#FF00FF',
        '#00FFFF',
        '#FFFF00',
        '#00FF00',
        '#FF1493',
        '#7FFF00',
      ],
      gradients: {
        primary: ['#FF00FF', '#00FFFF'],
        secondary: ['#00FFFF', '#FFFF00'],
        accent: ['#FFFF00', '#FF00FF'],
      },
    },
  },

  pastel: {
    id: 'pastel',
    name: 'Soft Pastel',
    emoji: '🌸',
    unlockRequirement: {
      type: 'level',
      value: 10,
    },
    colors: {
      background: '#F5F5F5',
      primary: '#FFB3D9',
      secondary: '#B4A7D6',
      accent: '#FFE5B4',
      text: '#2C2C2C',
      textSecondary: '#666666',
      success: '#B4E7CE',
      warning: '#FFE5B4',
      danger: '#FFB3C1',
      cardBackground: '#FFFFFF',
      borderColor: '#E0E0E0',
      playerColors: [
        '#FFB3D9',
        '#B4A7D6',
        '#A8D8EA',
        '#B4E7CE',
        '#FFE5B4',
        '#FFB3C1',
      ],
      gradients: {
        primary: ['#FFB3D9', '#B4A7D6'],
        secondary: ['#B4A7D6', '#A8D8EA'],
        accent: ['#FFE5B4', '#FFB3C1'],
      },
    },
  },

  dark: {
    id: 'dark',
    name: 'Midnight',
    emoji: '🌙',
    unlockRequirement: {
      type: 'rounds',
      value: 50,
    },
    colors: {
      background: '#0D1117',
      primary: '#C9D1D9',
      secondary: '#58A6FF',
      accent: '#F0883E',
      text: '#E6EDF3',
      textSecondary: '#8B949E',
      success: '#3FB950',
      warning: '#D29922',
      danger: '#F85149',
      cardBackground: '#161B22',
      borderColor: '#30363D',
      playerColors: [
        '#C9D1D9',
        '#58A6FF',
        '#F0883E',
        '#3FB950',
        '#D29922',
        '#F85149',
      ],
      gradients: {
        primary: ['#C9D1D9', '#58A6FF'],
        secondary: ['#58A6FF', '#F0883E'],
        accent: ['#F0883E', '#F85149'],
      },
    },
  },

  ocean: {
    id: 'ocean',
    name: 'Ocean Breeze',
    emoji: '🌊',
    unlockRequirement: {
      type: 'achievement',
      value: 'party_animal',
    },
    colors: {
      background: '#001220',
      primary: '#00D9FF',
      secondary: '#0088CC',
      accent: '#40E0D0',
      text: '#E0F7FF',
      textSecondary: '#80C0D0',
      success: '#00CED1',
      warning: '#FFD700',
      danger: '#FF6B6B',
      cardBackground: '#002535',
      borderColor: '#004460',
      playerColors: [
        '#00D9FF',
        '#0088CC',
        '#40E0D0',
        '#20B2AA',
        '#5F9EA0',
        '#48D1CC',
      ],
      gradients: {
        primary: ['#00D9FF', '#0088CC'],
        secondary: ['#0088CC', '#40E0D0'],
        accent: ['#40E0D0', '#20B2AA'],
      },
    },
  },

  sunset: {
    id: 'sunset',
    name: 'Sunset Vibes',
    emoji: '🌅',
    unlockRequirement: {
      type: 'achievement',
      value: 'dare_devil',
    },
    colors: {
      background: '#1A0E1F',
      primary: '#FF6B35',
      secondary: '#F7931E',
      accent: '#FDC830',
      text: '#FFF8E7',
      textSecondary: '#D4A574',
      success: '#FFB347',
      warning: '#F7931E',
      danger: '#E63946',
      cardBackground: '#2D1B2E',
      borderColor: '#4A2C3E',
      playerColors: [
        '#FF6B35',
        '#F7931E',
        '#FDC830',
        '#FFB347',
        '#FF9A00',
        '#E63946',
      ],
      gradients: {
        primary: ['#FF6B35', '#F7931E'],
        secondary: ['#F7931E', '#FDC830'],
        accent: ['#FDC830', '#FFB347'],
      },
    },
  },
};

export const getTheme = (themeName: ThemeName): Theme => {
  return THEMES[themeName] || THEMES.default;
};

export const isThemeUnlocked = (
  theme: Theme,
  userProgress: { level: number; achievements: Array<{ id: string; unlocked: boolean }>; stats: { totalRounds: number } }
): boolean => {
  const { type, value } = theme.unlockRequirement;

  switch (type) {
    case 'level':
      return userProgress.level >= (value as number);
    case 'achievement':
      return userProgress.achievements.some(
        a => a.id === value && a.unlocked
      );
    case 'rounds':
      return userProgress.stats.totalRounds >= (value as number);
    default:
      return false;
  }
};

export const getUnlockedThemes = (
  userProgress: { level: number; achievements: Array<{ id: string; unlocked: boolean }>; stats: { totalRounds: number } }
): Theme[] => {
  return Object.values(THEMES).filter(theme =>
    isThemeUnlocked(theme, userProgress)
  );
};

export const getLockedThemes = (
  userProgress: { level: number; achievements: Array<{ id: string; unlocked: boolean }>; stats: { totalRounds: number } }
): Theme[] => {
  return Object.values(THEMES).filter(
    theme => !isThemeUnlocked(theme, userProgress)
  );
};
