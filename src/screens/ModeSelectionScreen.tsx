import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GameMode } from '../types';
import AccessibleTouchable from '../components/AccessibleTouchable';
import RainbowHeroTitle from '../components/RainbowHeroTitle';

interface Props {
  onSelectMode: (mode: GameMode) => void;
  onQuickPlay?: () => void;
  onOpenSettings?: () => void;
  onOpenStats?: () => void;
  onOpenAchievements?: () => void;
  onOpenDailyChallenges?: () => void;
}

export default function ModeSelectionScreen({
  onSelectMode,
  onQuickPlay,
  onOpenSettings,
  onOpenStats,
  onOpenAchievements,
  onOpenDailyChallenges,
}: Props) {
  const logoScale = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (process.env.NODE_ENV === 'test') return;
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(logoScale, {
          toValue: 1.05,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
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

          {/* Brand Header with 3D Layered Extrusion */}
          <View style={styles.heroSection}>
            <Animated.Image
              source={require('../../assets/logo.png')}
              style={[styles.logo, { transform: [{ scale: logoScale }] }]}
              resizeMode="contain"
            />
            <View style={styles.titleContainer}>
              <RainbowHeroTitle
                title="Kinky Finger Picker"
                tagline="Pon tus dedos en la pantalla y rompe el hielo"
              />
            </View>
          </View>

          {/* Hero Banner: Tacón Rojo */}
          <View style={styles.heroBannerCard}>
            <Image
              source={require('../../assets/red-heel.jpg')}
              style={styles.heroBannerImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(10, 0, 2, 0.4)', 'rgba(10, 0, 2, 0.95)'] as const}
              style={styles.heroBannerGradient}
            >
              <View style={styles.heroBannerPill}>
                <Text style={styles.heroBannerPillText}>👠 NOCHES SALVAJES</Text>
              </View>
              <Text style={styles.heroBannerCaption}>
                Atrévete a romper el hielo con desafíos picantes
              </Text>
            </LinearGradient>
          </View>

          {/* Compact Quick Play Button */}
          {onQuickPlay && (
            <TouchableOpacity
              onPress={onQuickPlay}
              activeOpacity={0.88}
              accessibilityRole="button"
              accessibilityLabel="Partida Rápida"
              accessibilityHint="Inicia una partida inmediata en modo Hetero y nivel Suave"
              style={styles.quickPlayTouchable}
            >
              <LinearGradient
                colors={['#E50914', '#9B0014'] as const}
                style={styles.quickPlayGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.quickPlayEmoji}>⚡</Text>
                <View style={styles.quickPlayTextGroup}>
                  <Text style={styles.quickPlayTitle}>PARTIDA RÁPIDA</Text>
                  <Text style={styles.quickPlaySub}>Hetero • Suave</Text>
                </View>
                <Text style={styles.quickPlayArrow}>→</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* Section Divider: Modes */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>ELIGE MODO DE JUEGO</Text>
          </View>

          {/* Modes Grid: 3 columns side by side */}
          <View style={styles.modesGrid}>
            {/* Hetero */}
            <TouchableOpacity
              style={styles.gridCard}
              onPress={() => onSelectMode('hetero')}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Modo Hetero"
              accessibilityHint="Modo mixto con pantalla dividida para mujeres y hombres"
            >
              <LinearGradient
                colors={['#E50914', '#700508'] as const}
                style={styles.cardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.cardEmoji}>♀️♂️</Text>
                <Text style={styles.cardTitle}>Hetero</Text>
                <Text style={styles.cardSub}>Pantalla dividida</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Gay */}
            <TouchableOpacity
              style={styles.gridCard}
              onPress={() => onSelectMode('gay')}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Modo Gay"
              accessibilityHint="Modo completo para chicos"
            >
              <LinearGradient
                colors={['#B81D24', '#4A0E17'] as const}
                style={styles.cardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.cardEmoji}>♂️♂️</Text>
                <Text style={styles.cardTitle}>Gay</Text>
                <Text style={styles.cardSub}>Solo chicos</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Lesbian */}
            <TouchableOpacity
              style={styles.gridCard}
              onPress={() => onSelectMode('lesbian')}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Modo Lesbiana"
              accessibilityHint="Modo completo para chicas"
            >
              <LinearGradient
                colors={['#FF2A3A', '#8B0010'] as const}
                style={styles.cardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.cardEmoji}>♀️♀️</Text>
                <Text style={styles.cardTitle}>Lesbiana</Text>
                <Text style={styles.cardSub}>Solo chicas</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
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
    backgroundColor: 'rgba(229, 9, 20, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(229, 9, 20, 0.5)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: '#FF2A3A',
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
    color: '#E50914',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#ccc',
    marginTop: 2,
  },
  heroBannerCard: {
    width: '100%',
    height: 155,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: 'rgba(229, 9, 20, 0.45)',
    backgroundColor: '#0A0002',
    position: 'relative',
    shadowColor: '#E50914',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  heroBannerImage: {
    width: '100%',
    height: '100%',
  },
  heroBannerGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    justifyContent: 'flex-end',
    padding: 14,
  },
  heroBannerPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(229, 9, 20, 0.35)',
    borderWidth: 1,
    borderColor: 'rgba(229, 9, 20, 0.7)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 4,
  },
  heroBannerPillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  heroBannerCaption: {
    color: '#EEEEEE',
    fontSize: 13,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  quickPlayTouchable: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 18,
    elevation: 8,
    shadowColor: '#E50914',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
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
    gap: 12,
    marginBottom: 16,
  },
  gridCard: {
    flex: 1,
    height: 126,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    shadowColor: '#E50914',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
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
    fontSize: 17,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  cardSub: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    fontWeight: '500',
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
