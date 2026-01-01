import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Achievement } from '../types';
import { getRarityColor, getRarityGlow } from '../utils/achievements';
import { soundManager } from '../utils/sounds';
import ConfettiEffect from './ConfettiEffect';

const { width } = Dimensions.get('window');

interface Props {
  achievement: Achievement;
  onClose: () => void;
}

export default function AchievementUnlockedModal({ achievement, onClose }: Props) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const rarityColor = getRarityColor(achievement.rarity);

  useEffect(() => {
    // Haptic & sound feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    soundManager.playSound('winner');

    // Entrance animation
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Glow pulsing
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Auto-dismiss after 5 seconds
    const timeout = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <View style={styles.overlay}>
      <Animated.View
        style={[
          styles.backdrop,
          {
            opacity: fadeAnim,
          },
        ]}
      />

      {/* Confetti */}
      <ConfettiEffect colors={[rarityColor, '#FFD700', '#fff']} particleCount={80} />

      {/* Achievement Card */}
      <Animated.View
        style={[
          styles.card,
          {
            transform: [{ scale: scaleAnim }],
            opacity: fadeAnim,
          },
        ]}
      >
        {/* Glow effect */}
        <Animated.View
          style={[
            styles.glowEffect,
            {
              backgroundColor: getRarityGlow(achievement.rarity),
              opacity: glowOpacity,
            },
          ]}
        />

        <LinearGradient
          colors={['#1a1a1a', '#0a0a0a']}
          style={styles.cardContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.unlockLabel}>🎉 ACHIEVEMENT UNLOCKED!</Text>
          </View>

          {/* Icon */}
          <View style={[styles.iconContainer, { borderColor: rarityColor }]}>
            <Animated.View
              style={[
                styles.iconGlow,
                {
                  borderColor: rarityColor,
                  opacity: glowOpacity,
                },
              ]}
            />
            <Text style={styles.icon}>{achievement.icon}</Text>
          </View>

          {/* Title & Description */}
          <Text style={[styles.title, { color: rarityColor }]}>
            {achievement.title}
          </Text>
          <Text style={styles.description}>{achievement.description}</Text>

          {/* Rarity Badge */}
          <View style={[styles.rarityBadge, { backgroundColor: rarityColor }]}>
            <Text style={styles.rarityText}>
              {achievement.rarity.toUpperCase()}
            </Text>
          </View>

          {/* XP Reward */}
          <View style={styles.xpContainer}>
            <Text style={styles.xpLabel}>XP Earned</Text>
            <Text style={styles.xpValue}>+{achievement.xpReward}</Text>
          </View>

          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Continue</Text>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  card: {
    width: width * 0.9,
    maxWidth: 400,
    borderRadius: 25,
    overflow: 'hidden',
    position: 'relative',
  },
  glowEffect: {
    position: 'absolute',
    top: -50,
    left: -50,
    right: -50,
    bottom: -50,
    borderRadius: 50,
  },
  cardContent: {
    padding: 30,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 25,
  },
  header: {
    marginBottom: 20,
  },
  unlockLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 2,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    marginBottom: 20,
    position: 'relative',
    overflow: 'visible',
  },
  iconGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 8,
  },
  icon: {
    fontSize: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  description: {
    fontSize: 16,
    color: '#bbb',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  rarityBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  rarityText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  xpContainer: {
    backgroundColor: '#06FFA5',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  xpLabel: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
  },
  xpValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  closeButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#fff',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
