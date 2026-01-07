import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Player, IntensityLevel, Question, QuestionCategory, Settings } from '../types';
import { getRandomQuestion } from '../data/questions';
import ConfettiEffect from '../components/ConfettiEffect';
import { soundManager } from '../utils/sounds';

interface Props {
  player: Player;
  level: IntensityLevel;
  settings: Settings;
  usedQuestionIds: string[];
  skipCount: number;
  onComplete: (questionId: string) => void;
  onSkip: (questionId: string) => void;
  onChangeLevelUp: () => void;
  onChangeLevelDown: () => void;
  canLevelUp: boolean;
  canLevelDown: boolean;
}

export default function ImprovedQuestionScreen({
  player,
  level,
  settings,
  usedQuestionIds,
  skipCount,
  onComplete,
  onSkip,
  onChangeLevelUp,
  onChangeLevelDown,
  canLevelUp,
  canLevelDown,
}: Props) {
  const question = getRandomQuestion(level, settings.categories, usedQuestionIds);
  const [showConfetti, setShowConfetti] = useState(true);
  const [timeLeft, setTimeLeft] = useState(settings.timerDuration);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const timerAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (settings.hapticEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    soundManager.playSound('winner');

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

    // Hide confetti after 2 seconds
    setTimeout(() => setShowConfetti(false), 2000);
  }, []);

  useEffect(() => {
    if (!isTimerActive) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsTimerActive(false);
          if (settings.hapticEnabled) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          }
          soundManager.playSound('complete');
          return 0;
        }

        // Pulse animation when time is running low
        if (prev <= 10) {
          Animated.sequence([
            Animated.timing(timerAnim, {
              toValue: 1.2,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(timerAnim, {
              toValue: 1,
              duration: 100,
              useNativeDriver: true,
            }),
          ]).start();

          if (settings.hapticEnabled) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          soundManager.playSound('countdown');
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerActive]);

  const handleStartTimer = () => {
    setIsTimerActive(true);
    soundManager.playSound('tap');
  };

  const handleComplete = () => {
    soundManager.playSound('complete');
    onComplete(question.id);
  };

  const handleSkip = () => {
    if (skipCount >= settings.skipLimit) {
      if (settings.hapticEnabled) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      return;
    }
    soundManager.playSound('skip');
    onSkip(question.id);
  };

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

  const getTimerColor = () => {
    if (timeLeft > 30) return '#06FFA5';
    if (timeLeft > 10) return '#FFBE0B';
    return '#FF006E';
  };

  const canSkip = skipCount < settings.skipLimit;

  return (
    <LinearGradient
      colors={getLevelColor()}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {showConfetti && <ConfettiEffect colors={[player.color, '#fff', '#FFD700']} />}

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

        {/* Level and Category badges */}
        <View style={styles.badgesRow}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelBadgeText}>
              {getLevelEmoji()} {level.toUpperCase()}
            </Text>
          </View>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>
              {question.category.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Timer */}
        {isTimerActive && (
          <Animated.View
            style={[
              styles.timerContainer,
              { transform: [{ scale: timerAnim }] }
            ]}
          >
            <Text style={[styles.timerText, { color: getTimerColor() }]}>
              {timeLeft}s
            </Text>
          </Animated.View>
        )}

        {/* Question */}
        <View style={styles.questionContainer}>
          <Text style={styles.questionType}>
            {question.type === 'dare' ? '💋 DARE' : '❓ QUESTION'}
          </Text>
          <Text style={styles.questionText}>{question.text}</Text>
        </View>

        {/* Start Timer Button */}
        {!isTimerActive && timeLeft === settings.timerDuration && (
          <TouchableOpacity style={styles.timerButton} onPress={handleStartTimer}>
            <Text style={styles.timerButtonText}>⏱️ Start Timer</Text>
          </TouchableOpacity>
        )}

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

        {/* Action buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.skipButton, !canSkip && styles.skipButtonDisabled]}
            onPress={handleSkip}
            disabled={!canSkip}
            accessibilityRole="button"
            accessibilityLabel={`Skip dare, ${settings.skipLimit - skipCount} skips remaining`}
            accessibilityHint="Skip this dare without earning XP"
            accessibilityState={{ disabled: !canSkip }}
          >
            <Text style={[styles.skipButtonText, !canSkip && styles.skipButtonTextDisabled]}>
              Skip ({settings.skipLimit - skipCount} left)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.completeButton}
            onPress={handleComplete}
            accessibilityRole="button"
            accessibilityLabel="Complete dare"
            accessibilityHint="Mark this dare as completed and earn XP"
          >
            <Text style={styles.completeButtonText}>
              {timeLeft === 0 ? "Time's Up! →" : 'Completed! →'}
            </Text>
          </TouchableOpacity>
        </View>
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
    marginBottom: 20,
  },
  winnerLabel: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 12,
    fontWeight: '600',
  },
  winnerDot: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  winnerDotInner: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  levelBadge: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  levelBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  categoryBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  categoryBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  timerContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 20,
  },
  timerText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  questionContainer: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    minHeight: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    opacity: 0.9,
  },
  questionText: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '600',
  },
  timerButton: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  timerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  levelControls: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  levelButton: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  levelButtonDisabled: {
    opacity: 0.3,
  },
  levelButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  skipButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  skipButtonDisabled: {
    opacity: 0.3,
  },
  skipButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  skipButtonTextDisabled: {
    opacity: 0.5,
  },
  completeButton: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  completeButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
