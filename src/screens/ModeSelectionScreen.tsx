import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, Animated, ScrollView } from 'react-native';
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
      <ScrollView
        style={styles.scrollWrapper}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardWrapper}>
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

          {/* Quick Play Button */}
          {onQuickPlay && (
            <View style={styles.quickPlayContainer}>
              <TouchableOpacity
                onPress={onQuickPlay}
                activeOpacity={0.9}
                accessibilityRole="button"
                accessibilityLabel="Quick Play"
                accessibilityHint="Start a game immediately with Hetero mode and Mild level"
                style={styles.quickPlayTouchable}
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
                  <Text style={styles.aiSubtext}>Suggestions & advice</Text>
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
                  <Text style={styles.aiSubtext}>Create questions</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    width: '100%',
  },
  scrollWrapper: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 24,
    paddingHorizontal: 16,
    minHeight: '100%',
  },
  cardWrapper: {
    width: '100%',
    maxWidth: 480,
    alignItems: 'center',
  },
  headerButtons: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginBottom: 16,
    zIndex: 10,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  iconButtonText: {
    fontSize: 22,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF006E',
    marginBottom: 8,
    textAlign: 'center',
  },
  logo: {
    width: 170,
    height: 170,
    marginBottom: 20,
  },
  quickPlayContainer: {
    width: '100%',
    marginBottom: 24,
  },
  quickPlayTouchable: {
    width: '100%',
    borderRadius: 22,
    overflow: 'hidden',
  },
  quickPlayButton: {
    width: '100%',
    height: 130,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    shadowColor: '#FF006E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  quickPlayEmoji: {
    fontSize: 44,
    marginBottom: 6,
  },
  quickPlayText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    letterSpacing: 1,
  },
  quickPlaySubtext: {
    fontSize: 15,
    color: '#fff',
    opacity: 0.9,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
    opacity: 0.85,
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 28,
  },
  button: {
    width: '100%',
    height: 110,
    borderRadius: 20,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  buttonEmoji: {
    fontSize: 36,
    marginBottom: 4,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  buttonSubtext: {
    fontSize: 13,
    color: '#fff',
    opacity: 0.9,
  },
  aiButtonsContainer: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },
  aiButton: {
    flex: 1,
    height: 110,
    borderRadius: 20,
    overflow: 'hidden',
  },
  aiGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  aiEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  aiText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  aiSubtext: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.85,
    textAlign: 'center',
  },
});
