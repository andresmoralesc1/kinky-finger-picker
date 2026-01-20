import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GameMode } from '../types';
import { SpringButton } from '../components/SpringButton';
import AccessibleTouchable from '../components/AccessibleTouchable';

const { width, height } = Dimensions.get('window');

interface Props {
  onSelectMode: (mode: GameMode) => void;
  onQuickPlay?: () => void;
  onOpenSettings?: () => void;
  onOpenStats?: () => void;
  onOpenAchievements?: () => void;
  onOpenDailyChallenges?: () => void;
  onOpenAIChat?: () => void;
  onOpenAIGenerator?: () => void;
}

/**
 * Enhanced mode selection screen with improved animations and micro-interactions
 *
 * Features:
 * - Animated logo with pulse effect
 * - Spring buttons for all interactive elements
 * - Improved accessibility labels
 * - Smooth hover/press states
 * - Enhanced visual hierarchy
 */
export default function ModeSelectionScreen({
  onSelectMode,
  onQuickPlay,
  onOpenSettings,
  onOpenStats,
  onOpenAchievements,
  onOpenDailyChallenges,
  onOpenAIChat,
  onOpenAIGenerator
}: Props) {
  const logoScale = React.useRef(new Animated.Value(1)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    // Initial animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Subtle logo pulse
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.spring(logoScale, {
          toValue: 1.05,
          tension: 20,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 20,
          friction: 5,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Header buttons */}
      <View style={styles.headerButtons}>
        {onOpenDailyChallenges && (
          <AccessibleTouchable
            style={styles.iconButton}
            onPress={onOpenDailyChallenges}
            accessibilityLabel="Daily Challenges"
            accessibilityHint="View your daily challenges and rewards"
            accessibilityRole="button"
          >
            <Text style={styles.iconButtonText}>🎯</Text>
          </AccessibleTouchable>
        )}
        {onOpenAchievements && (
          <AccessibleTouchable
            style={styles.iconButton}
            onPress={onOpenAchievements}
            accessibilityLabel="Achievements"
            accessibilityHint="View your unlocked achievements"
            accessibilityRole="button"
          >
            <Text style={styles.iconButtonText}>🏆</Text>
          </AccessibleTouchable>
        )}
        {onOpenStats && (
          <AccessibleTouchable
            style={styles.iconButton}
            onPress={onOpenStats}
            accessibilityLabel="Statistics"
            accessibilityHint="View your game statistics"
            accessibilityRole="button"
          >
            <Text style={styles.iconButtonText}>📊</Text>
          </AccessibleTouchable>
        )}
        {onOpenSettings && (
          <AccessibleTouchable
            style={styles.iconButton}
            onPress={onOpenSettings}
            accessibilityLabel="Settings"
            accessibilityHint="Open settings to customize the game"
            accessibilityRole="button"
          >
            <Text style={styles.iconButtonText}>⚙️</Text>
          </AccessibleTouchable>
        )}
      </View>

      <Text style={styles.title}>Kinky Finger Picker</Text>

      {/* Logo with animation */}
      <Animated.Image
        source={require('../../assets/logo.png')}
        style={[styles.logo, { transform: [{ scale: logoScale }] }]}
        resizeMode="contain"
      />

      {/* Quick Play Button - Using SpringButton */}
      {onQuickPlay && (
        <View style={styles.quickPlayContainer}>
          <TouchableOpacity
            onPress={onQuickPlay}
            activeOpacity={0.9}
            accessibilityRole="button"
            accessibilityLabel="Quick Play"
            accessibilityHint="Start a game immediately with Hetero mode and Mild level"
          >
            <LinearGradient
              colors={['#FF006E', '#8338EC'] as const}
              style={styles.quickPlayButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.quickPlayEmoji}>🚀</Text>
              <Text style={styles.quickPlayText}>QUICK PLAY</Text>
              <Text style={styles.quickPlaySubtext}>Hetero • Mild</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.subtitle}>Or choose your mode</Text>

      <View style={styles.buttonsContainer}>
        {/* Hetero Mode Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => onSelectMode('hetero')}
          activeOpacity={0.9}
          accessibilityRole="button"
          accessibilityLabel="Hetero mode"
          accessibilityHint="Choose Hetero mode with split screen for female and male players"
        >
          <LinearGradient
            colors={['#FF006E', '#FF1744'] as const}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.buttonEmoji}>♀️♂️</Text>
            <Text style={styles.buttonText}>Hetero</Text>
            <Text style={styles.buttonSubtext}>Split screen mode</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Gay Mode Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => onSelectMode('gay')}
          activeOpacity={0.9}
          accessibilityRole="button"
          accessibilityLabel="Gay mode"
          accessibilityHint="Choose Gay mode with full screen for male players"
        >
          <LinearGradient
            colors={['#3A86FF', '#8338EC'] as const}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.buttonEmoji}>♂️♂️</Text>
            <Text style={styles.buttonText}>Gay</Text>
            <Text style={styles.buttonSubtext}>Full screen mode</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Lesbian Mode Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => onSelectMode('lesbian')}
          activeOpacity={0.9}
          accessibilityRole="button"
          accessibilityLabel="Lesbian mode"
          accessibilityHint="Choose Lesbian mode with full screen for female players"
        >
          <LinearGradient
            colors={['#FF6D00', '#FFBE0B'] as const}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.buttonEmoji}>♀️♀️</Text>
            <Text style={styles.buttonText}>Lesbian</Text>
            <Text style={styles.buttonSubtext}>Full screen mode</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* AI Features Section */}
      <Text style={styles.subtitle}>🤖 AI-Powered Features</Text>

      <View style={styles.aiButtonsContainer}>
        {/* AI Chat Button */}
        {onOpenAIChat && (
          <TouchableOpacity
            style={styles.aiButton}
            onPress={onOpenAIChat}
            activeOpacity={0.9}
            accessibilityRole="button"
            accessibilityLabel="AI Chat Assistant"
            accessibilityHint="Chat with AI assistant for suggestions and advice"
          >
            <LinearGradient
              colors={['#8338EC', '#3A86FF'] as const}
              style={styles.aiGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.aiEmoji}>💬</Text>
              <Text style={styles.aiText}>AI Chat</Text>
              <Text style={styles.aiSubtext}>Get suggestions & advice</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* AI Generator Button */}
        {onOpenAIGenerator && (
          <TouchableOpacity
            style={styles.aiButton}
            onPress={onOpenAIGenerator}
            activeOpacity={0.9}
            accessibilityRole="button"
            accessibilityLabel="AI Question Generator"
            accessibilityHint="Generate custom questions with AI"
          >
            <LinearGradient
              colors={['#FF006E', '#8338EC', '#3A86FF'] as const}
              style={styles.aiGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.aiEmoji}>✨</Text>
              <Text style={styles.aiText}>AI Generator</Text>
              <Text style={styles.aiSubtext}>Create custom questions</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
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
  headerButtons: {
    position: 'absolute',
    top: 50,
    right: 20,
    flexDirection: 'row',
    gap: 10,
    zIndex: 10,
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  iconButtonText: {
    fontSize: 24,
  },
  quickPlayContainer: {
    width: '100%',
    marginBottom: 30,
  },
  quickPlayButton: {
    width: '100%',
    height: 140,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    shadowColor: '#FF006E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  quickPlayEmoji: {
    fontSize: 50,
    marginBottom: 8,
  },
  quickPlayText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    letterSpacing: 1,
  },
  quickPlaySubtext: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FF006E',
    marginBottom: 10,
    textAlign: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 30,
    opacity: 0.8,
  },
  buttonsContainer: {
    width: '100%',
    gap: 20,
  },
  aiButtonsContainer: {
    width: '100%',
    gap: 15,
    marginTop: 10,
  },
  aiButton: {
    width: '100%',
    height: 100,
    borderRadius: 20,
  },
  aiGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  aiEmoji: {
    fontSize: 30,
    marginBottom: 5,
  },
  aiText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 3,
  },
  aiSubtext: {
    fontSize: 13,
    color: '#fff',
    opacity: 0.9,
  },
  button: {
    width: '100%',
    height: 120,
    borderRadius: 20,
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  buttonSubtext: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
});
