import React, { useEffect, useRef } from 'react';
import { View, ActivityIndicator, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large' | number;
  color?: string;
  showBackground?: boolean;
  showPulse?: boolean;
}

/**
 * Enhanced loading spinner with animated message and optional background
 *
 * Features:
 * - Animated pulse effect
 * - Customizable message
 * - Optional background overlay
 * - Smooth spin animation
 * - Responsive sizing
 */
export const EnhancedLoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  size = 'large',
  color = '#FF006E',
  showBackground = true,
  showPulse = true,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    return () => pulseAnimation.stop();
  }, []);

  const containerStyle = showBackground ? styles.containerWithBg : styles.containerWithoutBg;
  const indicatorSize = size === 'small' ? 30 : size === 'large' ? 50 : (size as number);

  return (
    <Animated.View style={[containerStyle, { opacity: fadeAnim }]}>
      <Animated.View style={[styles.content, { transform: [{ scale: pulseAnim }] }]}>
        <ActivityIndicator size={size} color={color} />
        {message && (
          <Text style={[styles.message, { color }]}>{message}</Text>
        )}
      </Animated.View>
    </Animated.View>
  );
};

interface DotsLoadingProps {
  message?: string;
  dotCount?: number;
  dotSize?: number;
  color?: string;
  showBackground?: boolean;
}

/**
 * Dots loading animation with bouncing dots
 */
export const DotsLoading: React.FC<DotsLoadingProps> = ({
  message,
  dotCount = 3,
  dotSize = 12,
  color = '#FF006E',
  showBackground = true,
}) => {
  const dots = useRef(
    Array.from({ length: dotCount }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const animations = dots.map((anim) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: -10,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      )
    );

    // Stagger animations
    animations.forEach((anim, index) => {
      setTimeout(() => anim.start(), index * 150);
    });

    return () => animations.forEach((anim) => anim.stop());
  }, []);

  const containerStyle = showBackground ? styles.containerWithBg : styles.containerWithoutBg;

  return (
    <View style={containerStyle}>
      <View style={styles.dotsContainer}>
        {dots.map((anim, index) => (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                width: dotSize,
                height: dotSize,
                backgroundColor: color,
                transform: [{ translateY: anim }],
              },
            ]}
          />
        ))}
      </View>
      {message && <Text style={[styles.message, { color }]}>{message}</Text>}
    </View>
  );
};

interface ProgressLoadingProps {
  message?: string;
  progress: number; // 0-1
  color?: string;
  showPercentage?: boolean;
}

/**
 * Progress bar loading with percentage display
 */
export const ProgressLoading: React.FC<ProgressLoadingProps> = ({
  message,
  progress,
  color = '#FF006E',
  showPercentage = true,
}) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [progress]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const percentage = Math.round(progress * 100);

  return (
    <Animated.View style={[styles.containerWithBg, { opacity: fadeAnim }]}>
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBg}>
          <Animated.View
            style={[
              styles.progressBarFill,
              { width: progressWidth },
            ]}
          >
            <LinearGradient
              colors={[color, `${color}CC`]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.progressBarGradient}
            />
          </Animated.View>
        </View>
        {showPercentage && (
          <Text style={[styles.progressText, { color }]}>{percentage}%</Text>
        )}
        {message && <Text style={[styles.message, { color }]}>{message}</Text>}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  containerWithBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  containerWithoutBg: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  dot: {
    borderRadius: 10,
  },
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    minWidth: 200,
  },
  progressBarBg: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarGradient: {
    width: '100%',
    height: '100%',
  },
  progressText: {
    marginTop: 12,
    fontSize: 24,
    fontWeight: 'bold',
  },
});
