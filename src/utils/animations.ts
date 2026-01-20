import { Animated } from 'react-native';

/**
 * Reusable animation utilities for micro-interactions
 *
 * Features:
 * - Pulse animation for important elements
 * - Shake animation for errors
 * - Bounce animation for highlights
 * - Fade in/out utilities
 * - Scale animations
 */

/**
 * Create a pulse animation (scales up and down repeatedly)
 * @param animatedValue The Animated.Value to animate
 * @param minScale Minimum scale (default: 1)
 * @param maxScale Maximum scale (default: 1.05)
 * @param duration Duration in ms (default: 1000)
 * @returns Animation object to control start/stop
 */
export const createPulseAnimation = (
  animatedValue: Animated.Value,
  minScale: number = 1,
  maxScale: number = 1.05,
  duration: number = 1000
) => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: maxScale,
        duration: duration / 2,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: minScale,
        duration: duration / 2,
        useNativeDriver: true,
      }),
    ])
  );
};

/**
 * Create a bounce animation
 * @param animatedValue The Animated.Value to animate
 * @returns Animation object
 */
export const createBounceAnimation = (animatedValue: Animated.Value) => {
  return Animated.sequence([
    Animated.spring(animatedValue, {
      toValue: 1.1,
      tension: 200,
      friction: 5,
      useNativeDriver: true,
    }),
    Animated.spring(animatedValue, {
      toValue: 1,
      tension: 200,
      friction: 5,
      useNativeDriver: true,
    }),
  ]);
};

/**
 * Create a shake animation (for errors/warnings)
 * @param animatedValue The Animated.Value to animate (should use translateX)
 * @returns Animation object
 */
export const createShakeAnimation = (animatedValue: Animated.Value) => {
  return Animated.sequence([
    Animated.timing(animatedValue, {
      toValue: 10,
      duration: 50,
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue, {
      toValue: -10,
      duration: 50,
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue, {
      toValue: 10,
      duration: 50,
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 50,
      useNativeDriver: true,
    }),
  ]);
};

/**
 * Create a fade in animation
 * @param animatedValue The Animated.Value to animate
 * @param duration Duration in ms (default: 300)
 * @returns Animation object
 */
export const createFadeInAnimation = (
  animatedValue: Animated.Value,
  duration: number = 300
) => {
  return Animated.timing(animatedValue, {
    toValue: 1,
    duration,
    useNativeDriver: true,
  });
};

/**
 * Create a fade out animation
 * @param animatedValue The Animated.Value to animate
 * @param duration Duration in ms (default: 300)
 * @returns Animation object
 */
export const createFadeOutAnimation = (
  animatedValue: Animated.Value,
  duration: number = 300
) => {
  return Animated.timing(animatedValue, {
    toValue: 0,
    duration,
    useNativeDriver: true,
  });
};

/**
 * Create a scale up animation (for pop-in effects)
 * @param animatedValue The Animated.Value to animate
 * @returns Animation object
 */
export const createScaleUpAnimation = (animatedValue: Animated.Value) => {
  return Animated.spring(animatedValue, {
    toValue: 1,
    tension: 50,
    friction: 7,
    useNativeDriver: true,
  });
};

/**
 * Create a slide in animation from a specific direction
 * @param animatedValue The Animated.Value to animate (translateX or translateY)
 * @param from Starting position (negative or positive number)
 * @param duration Duration in ms (default: 300)
 * @returns Animation object
 */
export const createSlideInAnimation = (
  animatedValue: Animated.Value,
  from: number,
  duration: number = 300
) => {
  return Animated.timing(animatedValue, {
    toValue: 0,
    duration,
    useNativeDriver: true,
  });
};

/**
 * Create a rotation animation
 * @param animatedValue The Animated.Value to animate
 * @param rotations Number of rotations (default: 1)
 * @param duration Duration in ms (default: 1000)
 * @returns Animation object
 */
export const createRotationAnimation = (
  animatedValue: Animated.Value,
  rotations: number = 1,
  duration: number = 1000
) => {
  return Animated.timing(animatedValue, {
    toValue: rotations,
    duration,
    useNativeDriver: true,
  });
};

/**
 * Stagger children animations with delays
 * @param animations Array of animation functions to run
 * @param delay Delay between each animation in ms
 * @returns Parallel animation with staggered delays
 */
export const createStaggeredAnimation = (
  animations: Array<() => Animated.CompositeAnimation>,
  delay: number = 100
) => {
  return Animated.parallel(
    animations.map((animation, index) =>
      Animated.sequence([
        Animated.delay(index * delay),
        animation(),
      ])
    )
  );
};

/**
 * Run an animation with a completion callback
 * @param animation The animation to run
 * @param onComplete Callback when animation completes
 */
export const runAnimation = (
  animation: Animated.CompositeAnimation,
  onComplete?: () => void
) => {
  animation.start(({ finished }) => {
    if (finished && onComplete) {
      onComplete();
    }
  });
};
