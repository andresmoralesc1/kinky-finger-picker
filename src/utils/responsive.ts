import { Dimensions, Platform, ScaledSize } from 'react-native';

/**
 * Responsive design utilities for different screen sizes and orientations
 */

// Device size breakpoints (in dp/pt)
export const BREAKPOINTS = {
  PHONE_SMALL: 320,
  PHONE: 375,
  PHONE_LARGE: 414,
  TABLET_SMALL: 600,
  TABLET: 768,
  TABLET_LARGE: 1024,
  DESKTOP: 1280,
};

// Current screen dimensions
let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

/**
 * Device type based on screen width
 */
export type DeviceType = 'phone' | 'tablet' | 'desktop';

/**
 * Orientation
 */
export type Orientation = 'portrait' | 'landscape';

/**
 * Responsive utilities
 */
export const Responsive = {
  /**
   * Initialize responsive system with dimension change listener
   */
  init(callback?: (dimensions: ScaledSize) => void): () => void {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      screenWidth = window.width;
      screenHeight = window.height;
      callback?.(window);
    });

    return () => subscription?.remove();
  },

  /**
   * Get current device type
   */
  getDeviceType(): DeviceType {
    if (screenWidth >= BREAKPOINTS.DESKTOP) return 'desktop';
    if (screenWidth >= BREAKPOINTS.TABLET_SMALL) return 'tablet';
    return 'phone';
  },

  /**
   * Get current orientation
   */
  getOrientation(): Orientation {
    return screenWidth > screenHeight ? 'landscape' : 'portrait';
  },

  /**
   * Check if device is a tablet
   */
  isTablet(): boolean {
    return screenWidth >= BREAKPOINTS.TABLET_SMALL;
  },

  /**
   * Check if device is a phone
   */
  isPhone(): boolean {
    return screenWidth < BREAKPOINTS.TABLET_SMALL;
  },

  /**
   * Check if in landscape mode
   */
  isLandscape(): boolean {
    return screenWidth > screenHeight;
  },

  /**
   * Check if in portrait mode
   */
  isPortrait(): boolean {
    return screenHeight >= screenWidth;
  },

  /**
   * Scale value based on screen width
   * Reference: iPhone 11 Pro (375pt width)
   */
  wp(percentage: number): number {
    const baseWidth = 375;
    return (percentage * screenWidth) / baseWidth;
  },

  /**
   * Scale value based on screen height
   * Reference: iPhone 11 Pro (812pt height)
   */
  hp(percentage: number): number {
    const baseHeight = 812;
    return (percentage * screenHeight) / baseHeight;
  },

  /**
   * Get responsive font size
   */
  fontSize(size: number): number {
    const scale = screenWidth / 375;
    const newSize = size * scale;

    // Limit scaling to prevent too large or too small text
    if (Platform.OS === 'ios') {
      return Math.round(newSize);
    }
    // Android needs slightly different scaling
    return Math.round(newSize * 0.95);
  },

  /**
   * Get spacing based on device
   */
  spacing(base: number): number {
    const deviceType = this.getDeviceType();
    const multipliers = {
      phone: 1,
      tablet: 1.5,
      desktop: 2,
    };
    return base * multipliers[deviceType];
  },

  /**
   * Get responsive padding
   */
  padding(): number {
    const deviceType = this.getDeviceType();
    return deviceType === 'tablet' ? 40 : 20;
  },

  /**
   * Get max content width
   */
  maxContentWidth(): number {
    const deviceType = this.getDeviceType();
    if (deviceType === 'desktop') return 1200;
    if (deviceType === 'tablet') return 800;
    return screenWidth;
  },

  /**
   * Get number of columns for grid layout
   */
  getColumns(): number {
    const deviceType = this.getDeviceType();
    const orientation = this.getOrientation();

    if (deviceType === 'desktop') return 4;
    if (deviceType === 'tablet') {
      return orientation === 'landscape' ? 3 : 2;
    }
    return 1;
  },

  /**
   * Get current screen dimensions
   */
  getDimensions(): { width: number; height: number } {
    return { width: screenWidth, height: screenHeight };
  },

  /**
   * Check if screen is small (iPhone SE, etc)
   */
  isSmallScreen(): boolean {
    return screenWidth < BREAKPOINTS.PHONE;
  },

  /**
   * Get safe area insets (for notch, etc)
   */
  getSafeAreaInsets(): { top: number; bottom: number; left: number; right: number } {
    // Simplified - in production use react-native-safe-area-context
    const hasNotch = screenHeight >= 812 && Platform.OS === 'ios';

    return {
      top: hasNotch ? 44 : 20,
      bottom: hasNotch ? 34 : 0,
      left: 0,
      right: 0,
    };
  },
};

/**
 * Responsive style creator
 */
export const createResponsiveStyle = <T extends Record<string, any>>(
  phoneStyle: T,
  tabletStyle?: Partial<T>,
  desktopStyle?: Partial<T>
): T => {
  const deviceType = Responsive.getDeviceType();

  if (deviceType === 'desktop' && desktopStyle) {
    return { ...phoneStyle, ...desktopStyle };
  }

  if (deviceType === 'tablet' && tabletStyle) {
    return { ...phoneStyle, ...tabletStyle };
  }

  return phoneStyle;
};

/**
 * Get responsive button size
 */
export const getButtonSize = (): { height: number; minWidth: number; padding: number } => {
  const deviceType = Responsive.getDeviceType();

  const sizes = {
    phone: { height: 56, minWidth: 120, padding: 16 },
    tablet: { height: 64, minWidth: 160, padding: 24 },
    desktop: { height: 72, minWidth: 200, padding: 32 },
  };

  return sizes[deviceType];
};

/**
 * Responsive icon sizes
 */
export const getIconSize = (base: number = 24): number => {
  const deviceType = Responsive.getDeviceType();
  const multipliers = { phone: 1, tablet: 1.5, desktop: 2 };
  return base * multipliers[deviceType];
};
