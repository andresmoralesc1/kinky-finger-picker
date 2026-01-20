import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IntensityLevel } from '../types';
import AccessibleTouchable from '../components/AccessibleTouchable';
import { SwipeableScreen } from '../components/SwipeGesture';

interface Props {
  onSelectLevel: (level: IntensityLevel) => void;
  onBack: () => void;
}

/**
 * Enhanced level selection screen with animations and micro-interactions
 *
 * Features:
 * - Staggered fade-in animations for buttons
 * - AccessibleTouchable for all interactive elements
 * - Improved accessibility labels
 * - Smooth hover/press states
 */
export default function LevelSelectionScreen({ onSelectLevel, onBack }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const mildAnim = useRef(new Animated.Value(0)).current;
  const spicyAnim = useRef(new Animated.Value(0)).current;
  const extremeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial fade-in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    // Staggered button animations
    const staggeredAnimations = [
      { anim: mildAnim, delay: 100 },
      { anim: spicyAnim, delay: 200 },
      { anim: extremeAnim, delay: 300 },
    ];

    staggeredAnimations.forEach(({ anim, delay }) => {
      Animated.timing(anim, {
        toValue: 1,
        delay,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  return (
    <SwipeableScreen onBack={onBack} canGoBack={true}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <AccessibleTouchable
          style={styles.backButton}
          onPress={onBack}
          accessibilityLabel="Go back"
          accessibilityHint="Return to mode selection"
          accessibilityRole="button"
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </AccessibleTouchable>

        <Text style={styles.title}>Choose Intensity</Text>
        <Text style={styles.subtitle}>How kinky do you want to start?</Text>

        <View style={styles.buttonsContainer}>
          <Animated.View style={{ opacity: mildAnim, flex: 1 }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => onSelectLevel('mild')}
              activeOpacity={0.9}
              accessibilityRole="button"
              accessibilityLabel="Mild intensity level"
              accessibilityHint="Flirty and playful questions for beginners"
            >
              <LinearGradient
                colors={['#06FFA5', '#00E676'] as const}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.buttonEmoji}>🌶️</Text>
                <Text style={styles.buttonText}>Mild</Text>
                <Text style={styles.buttonSubtext}>Flirty & playful</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={{ opacity: spicyAnim, flex: 1 }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => onSelectLevel('spicy')}
              activeOpacity={0.9}
              accessibilityRole="button"
              accessibilityLabel="Spicy intensity level"
              accessibilityHint="Getting hot with kisses and dares"
            >
              <LinearGradient
                colors={['#FB5607', '#FF6D00'] as const}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.buttonEmoji}>🌶️🌶️</Text>
                <Text style={styles.buttonText}>Spicy</Text>
                <Text style={styles.buttonSubtext}>Getting hot</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={{ opacity: extremeAnim, flex: 1 }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => onSelectLevel('extreme')}
              activeOpacity={0.9}
              accessibilityRole="button"
              accessibilityLabel="Extreme intensity level"
              accessibilityHint="No limits! Adult only content 18+"
            >
              <LinearGradient
                colors={['#FF006E', '#D500F9'] as const}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.buttonEmoji}>🌶️🌶️🌶️</Text>
                <Text style={styles.buttonText}>Extreme</Text>
                <Text style={styles.buttonSubtext}>No limits! 18+</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <Text style={styles.note}>You can change level during the game</Text>
      </Animated.View>
    </SwipeableScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FF006E',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 60,
    opacity: 0.8,
  },
  buttonsContainer: {
    width: '100%',
    flexDirection: 'row',
    gap: 20,
  },
  button: {
    flex: 1,
    height: 160,
    borderRadius: 20,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  buttonEmoji: {
    fontSize: 40,
    marginBottom: 5,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  buttonSubtext: {
    fontSize: 13,
    color: '#fff',
    opacity: 0.9,
  },
  note: {
    marginTop: 30,
    color: '#fff',
    opacity: 0.6,
    fontSize: 14,
  },
});
