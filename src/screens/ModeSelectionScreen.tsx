import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GameMode } from '../types';
import AccessibleTouchable from '../components/AccessibleTouchable';

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

export default function ModeSelectionScreen({
  onSelectMode,
  onQuickPlay,
  onOpenSettings,
  onOpenStats,
  onOpenAchievements,
  onOpenDailyChallenges,
  onOpenAIChat,
  onOpenAIGenerator,
}: Props) {
  const logoScale = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(logoScale, {
          toValue: 1.05,
          duration: 900,
          useNativeDriver: false,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 900,
          useNativeDriver: false,
        }),
      ])
    );
    pulseAnimation.start();
    return () => pulseAnimation.stop();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollWrapper}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardWrapper}>
          {/* Top Bar: Badge left, Action Icons right */}
          <View style={styles.topBar}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>🌶️ 18+ PARTY GAME</Text>
            </View>

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
          </View>

          {/* Compact Brand Header */}
          <View style={styles.heroSection}>
            <Animated.Image
              source={require('../../assets/logo.png')}
              style={[styles.logo, { transform: [{ scale: logoScale }] }]}
              resizeMode="contain"
            />
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Kinky Finger Picker</Text>
              <Text style={styles.subtitle}>Put fingers on screen & break the ice</Text>
            </View>
          </View>

          {/* Compact Quick Play Button */}
          {onQuickPlay && (
            <TouchableOpacity
              onPress={onQuickPlay}
              activeOpacity={0.88}
              accessibilityRole="button"
              accessibilityLabel="Quick Play"
              accessibilityHint="Start a game immediately with Hetero mode and Mild level"
              style={styles.quickPlayTouchable}
            >
              <LinearGradient
                colors={['#FF006E', '#8338EC'] as const}
                style={styles.quickPlayGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.quickPlayEmoji}>🚀</Text>
                <View style={styles.quickPlayTextGroup}>
                  <Text style={styles.quickPlayTitle}>QUICK PLAY</Text>
                  <Text style={styles.quickPlaySub}>Hetero • Mild</Text>
                </View>
                <Text style={styles.quickPlayArrow}>→</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* Section Divider: Modes */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>CHOOSE GAME MODE</Text>
          </View>

          {/* Modes Grid: 3 columns side by side */}
          <View style={styles.modesGrid}>
            {/* Hetero */}
            <TouchableOpacity
              style={styles.gridCard}
              onPress={() => onSelectMode('hetero')}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Hetero mode"
              accessibilityHint="Choose Hetero mode with split screen for female and male players"
            >
              <LinearGradient
                colors={['#FF006E', '#FF1744'] as const}
                style={styles.cardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.cardEmoji}>♀️♂️</Text>
                <Text style={styles.cardTitle}>Hetero</Text>
                <Text style={styles.cardSub}>Split screen</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Gay */}
            <TouchableOpacity
              style={styles.gridCard}
              onPress={() => onSelectMode('gay')}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Gay mode"
              accessibilityHint="Choose Gay mode with full screen for male players"
            >
              <LinearGradient
                colors={['#3A86FF', '#8338EC'] as const}
                style={styles.cardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.cardEmoji}>♂️♂️</Text>
                <Text style={styles.cardTitle}>Gay</Text>
                <Text style={styles.cardSub}>All guys</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Lesbian */}
            <TouchableOpacity
              style={styles.gridCard}
              onPress={() => onSelectMode('lesbian')}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Lesbian mode"
              accessibilityHint="Choose Lesbian mode with full screen for female players"
            >
              <LinearGradient
                colors={['#FF6D00', '#FFBE0B'] as const}
                style={styles.cardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.cardEmoji}>♀️♀️</Text>
                <Text style={styles.cardTitle}>Lesbian</Text>
                <Text style={styles.cardSub}>All girls</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* AI Features: Compact horizontal pills */}
          {(onOpenAIChat || onOpenAIGenerator) && (
            <View style={styles.aiSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>AI FEATURES</Text>
              </View>

              <View style={styles.aiRow}>
                {onOpenAIChat && (
                  <TouchableOpacity
                    style={styles.aiPill}
                    onPress={onOpenAIChat}
                    activeOpacity={0.85}
                    accessibilityRole="button"
                    accessibilityLabel="AI Chat Assistant"
                  >
                    <LinearGradient
                      colors={['rgba(131, 56, 236, 0.25)', 'rgba(58, 134, 255, 0.25)'] as const}
                      style={styles.aiPillGradient}
                    >
                      <Text style={styles.aiPillEmoji}>💬</Text>
                      <Text style={styles.aiPillText}>AI Chat</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}

                {onOpenAIGenerator && (
                  <TouchableOpacity
                    style={styles.aiPill}
                    onPress={onOpenAIGenerator}
                    activeOpacity={0.85}
                    accessibilityRole="button"
                    accessibilityLabel="AI Question Generator"
                  >
                    <LinearGradient
                      colors={['rgba(255, 0, 110, 0.25)', 'rgba(131, 56, 236, 0.25)'] as const}
                      style={styles.aiPillGradient}
                    >
                      <Text style={styles.aiPillEmoji}>✨</Text>
                      <Text style={styles.aiPillText}>AI Generator</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
    width: '100%',
  },
  scrollWrapper: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 16,
    minHeight: '100%',
  },
  cardWrapper: {
    width: '100%',
    maxWidth: 580,
    alignItems: 'center',
  },
  topBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  badge: {
    backgroundColor: 'rgba(255, 0, 110, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 110, 0.4)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: '#FF006E',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  iconButtonText: {
    fontSize: 18,
  },
  heroSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 18,
    width: '100%',
    paddingHorizontal: 4,
  },
  logo: {
    width: 72,
    height: 72,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FF006E',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  quickPlayTouchable: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 18,
    elevation: 8,
    shadowColor: '#FF006E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  quickPlayGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
    gap: 12,
  },
  quickPlayEmoji: {
    fontSize: 26,
  },
  quickPlayTextGroup: {
    flex: 1,
  },
  quickPlayTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
  quickPlaySub: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  quickPlayArrow: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionHeader: {
    width: '100%',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#666',
    letterSpacing: 1,
  },
  modesGrid: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  gridCard: {
    flex: 1,
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  cardEmoji: {
    fontSize: 30,
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  cardSub: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
  },
  aiSection: {
    width: '100%',
    marginTop: 4,
  },
  aiRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
  },
  aiPill: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  aiPillGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
  },
  aiPillEmoji: {
    fontSize: 18,
  },
  aiPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
});
