import { AccessibilityInfo, Platform } from 'react-native';

/**
 * Accessibility utilities for improved app usability
 */

// Screen reader status
let isScreenReaderEnabled = false;

export const AccessibilityService = {
  /**
   * Initialize accessibility service
   */
  async init(): Promise<void> {
    if (Platform.OS === 'web') {
      isScreenReaderEnabled = false;
      return;
    }

    try {
      isScreenReaderEnabled = await AccessibilityInfo.isScreenReaderEnabled();
      AccessibilityInfo.addEventListener('screenReaderChanged', (enabled) => {
        isScreenReaderEnabled = enabled;
      });
    } catch (error) {
      console.error('Error initializing accessibility:', error);
    }
  },

  /**
   * Check if screen reader is enabled
   */
  isScreenReaderEnabled(): boolean {
    return isScreenReaderEnabled;
  },

  /**
   * Announce message to screen reader
   */
  announce(message: string, options?: { queue?: boolean }): void {
    if (Platform.OS === 'web') return;

    try {
      AccessibilityInfo.announceForAccessibility(message);
    } catch (error) {
      console.error('Error announcing for accessibility:', error);
    }
  },

  /**
   * Set focus to an element (for screen readers)
   */
  setAccessibilityFocus(reactTag: number): void {
    if (Platform.OS === 'web') return;

    try {
      AccessibilityInfo.setAccessibilityFocus(reactTag);
    } catch (error) {
      console.error('Error setting accessibility focus:', error);
    }
  },
};

/**
 * Color blindness simulation and accessible colors
 */
export const ColorBlindness = {
  /**
   * Get accessible color variations for different types of color blindness
   */
  getAccessibleColors: (original: string): Record<string, string> => {
    // Mapping of original colors to accessible alternatives
    const colorMap: Record<string, Record<string, string>> = {
      '#FF006E': {
        normal: '#FF006E',
        protanopia: '#D4A017', // Gold instead of pink
        deuteranopia: '#D4A017',
        tritanopia: '#FF006E',
      },
      '#FB5607': {
        normal: '#FB5607',
        protanopia: '#FFD700',
        deuteranopia: '#FFD700',
        tritanopia: '#FB5607',
      },
      '#3A86FF': {
        normal: '#3A86FF',
        protanopia: '#3A86FF',
        deuteranopia: '#3A86FF',
        tritanopia: '#7B68EE',
      },
    };

    return colorMap[original] || { normal: original };
  },

  /**
   * Check if colors have sufficient contrast ratio
   */
  hasGoodContrast: (foreground: string, background: string): boolean => {
    // Simplified WCAG 2.0 contrast check
    // For production, use a proper contrast calculation library
    const getRelativeLuminance = (hex: string): number => {
      const rgb = parseInt(hex.slice(1), 16);
      const r = ((rgb >> 16) & 0xff) / 255;
      const g = ((rgb >> 8) & 0xff) / 255;
      const b = (rgb & 0xff) / 255;

      const [rs, gs, bs] = [r, g, b].map((c) =>
        c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      );

      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const l1 = getRelativeLuminance(foreground);
    const l2 = getRelativeLuminance(background);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

    // WCAG AA requires 4.5:1 for normal text, 3:1 for large text
    return ratio >= 4.5;
  },
};

/**
 * Generate accessible labels for UI elements
 */
export const generateAccessibilityLabel = (
  element: string,
  context?: Record<string, any>
): string => {
  const labels: Record<string, string> = {
    quickPlay: 'Quick Play button. Start a game immediately with default settings: Hetero mode and Mild intensity level',
    hetero: 'Hetero mode button. Starts split-screen mode for male and female players',
    gay: 'Gay mode button. Starts full-screen mode for male players',
    lesbian: 'Lesbian mode button. Starts full-screen mode for female players',
    mild: 'Mild intensity level. Flirty and playful questions and dares',
    spicy: 'Spicy intensity level. Getting hot with more intense challenges',
    extreme: 'Extreme intensity level. No limits, adults only content',
    settings: 'Settings button. Configure sound, haptics, timer, and game options',
    stats: 'Statistics button. View game statistics and player rankings',
    achievements: 'Achievements button. View unlocked achievements and progress',
    dailyChallenges: 'Daily Challenges button. View and complete daily challenges for rewards',
  };

  let label = labels[element] || element;

  if (context) {
    // Add contextual information
    Object.entries(context).forEach(([key, value]) => {
      label += `. ${key}: ${value}`;
    });
  }

  return label;
};

/**
 * Accessibility hint generator
 */
export const generateAccessibilityHint = (action: string): string => {
  const hints: Record<string, string> = {
    tap: 'Double tap to activate',
    select: 'Double tap to select this option',
    navigate: 'Double tap to navigate to this screen',
    toggle: 'Double tap to toggle this setting',
    dismiss: 'Double tap to dismiss',
    share: 'Double tap to share this content',
    skip: 'Double tap to skip this question',
  };

  return hints[action] || 'Double tap to activate';
};

/**
 * Convert emoji to accessible text
 */
export const emojiToText = (emoji: string): string => {
  const emojiMap: Record<string, string> = {
    '🚀': 'rocket',
    '🌶️': 'hot pepper',
    '🎯': 'target',
    '🏆': 'trophy',
    '📊': 'chart',
    '⚙️': 'settings gear',
    '♀️': 'female symbol',
    '♂️': 'male symbol',
    '🎉': 'party popper',
    '⏱️': 'timer',
    '📱': 'mobile phone',
    '✨': 'sparkles',
    '💫': 'dizzy',
    '🔥': 'fire',
  };

  return emojiMap[emoji] || emoji;
};

/**
 * Text size multipliers for accessibility
 */
export const getAccessibleFontSize = (baseSize: number, scale: number = 1): number => {
  // scale from 1.0 (normal) to 1.5 (large text)
  return Math.round(baseSize * scale);
};
