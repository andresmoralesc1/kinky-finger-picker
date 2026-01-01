import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Player, IntensityLevel } from '../types';
import { getRandomQuestion } from '../data/questions';

interface Props {
  player: Player;
  level: IntensityLevel;
  onNext: () => void;
  onChangeLevelUp: () => void;
  onChangeLevelDown: () => void;
  canLevelUp: boolean;
  canLevelDown: boolean;
}

export default function QuestionScreen({
  player,
  level,
  onNext,
  onChangeLevelUp,
  onChangeLevelDown,
  canLevelUp,
  canLevelDown,
}: Props) {
  const question = getRandomQuestion(level);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getLevelColor = (): readonly [string, string] => {
    switch (level) {
      case 'mild': return ['#06FFA5', '#00E676'];
      case 'spicy': return ['#FB5607', '#FF6D00'];
      case 'extreme': return ['#FF006E', '#D500F9'];
    }
  };

  const getLevelEmoji = () => {
    switch (level) {
      case 'mild': return '🌶️';
      case 'spicy': return '🌶️🌶️';
      case 'extreme': return '🌶️🌶️🌶️';
    }
  };

  return (
    <LinearGradient
      colors={getLevelColor()}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Winner indicator */}
        <View style={styles.winnerSection}>
          <Text style={styles.winnerLabel}>Selected Player</Text>
          <View style={[styles.winnerDot, { backgroundColor: player.color }]}>
            <View style={styles.winnerDotInner} />
          </View>
        </View>

        {/* Level indicator */}
        <View style={styles.levelBadge}>
          <Text style={styles.levelBadgeText}>
            {getLevelEmoji()} {level.toUpperCase()}
          </Text>
        </View>

        {/* Question */}
        <View style={styles.questionContainer}>
          <Text style={styles.questionType}>
            {question.type === 'dare' ? '💋 DARE' : '❓ QUESTION'}
          </Text>
          <Text style={styles.questionText}>{question.text}</Text>
        </View>

        {/* Level controls */}
        <View style={styles.levelControls}>
          <TouchableOpacity
            style={[styles.levelButton, !canLevelDown && styles.levelButtonDisabled]}
            onPress={canLevelDown ? onChangeLevelDown : undefined}
            disabled={!canLevelDown}
          >
            <Text style={styles.levelButtonText}>⬇️ Milder</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.levelButton, !canLevelUp && styles.levelButtonDisabled]}
            onPress={canLevelUp ? onChangeLevelUp : undefined}
            disabled={!canLevelUp}
          >
            <Text style={styles.levelButtonText}>Hotter ⬆️</Text>
          </TouchableOpacity>
        </View>

        {/* Next button */}
        <TouchableOpacity style={styles.nextButton} onPress={onNext}>
          <Text style={styles.nextButtonText}>Next Round →</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  winnerSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  winnerLabel: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 15,
    fontWeight: '600',
  },
  winnerDot: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  winnerDotInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  levelBadge: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 40,
  },
  levelBadgeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  questionContainer: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 25,
    padding: 30,
    marginBottom: 40,
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionType: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    opacity: 0.9,
  },
  questionText: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 32,
    fontWeight: '600',
  },
  levelControls: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 30,
  },
  levelButton: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  levelButtonDisabled: {
    opacity: 0.3,
  },
  levelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 50,
    paddingVertical: 20,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  nextButtonText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
