import React, { useEffect, useRef, useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Player, IntensityLevel, Question, QuestionCategory, Settings, GameMode } from '../types';
import { getRandomQuestion, formatQuestionForPair } from '../data/questions';
import ConfettiEffect from '../components/ConfettiEffect';
import { soundManager } from '../utils/sounds';
import AccessibleTouchable from '../components/AccessibleTouchable';
import { SwipeGesture } from '../components/SwipeGesture';

interface Props {
  player: Player;
  targetPlayer?: Player | null;
  mode?: GameMode;
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
  targetPlayer,
  mode = 'hetero',
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
  const [question, setQuestion] = useState(() =>
    getRandomQuestion(level, settings.categories, usedQuestionIds)
  );

  // Stable level change listener: only picks new question when levelUp or levelDown is clicked
  const currentLevelRef = useRef(level);
  useEffect(() => {
    if (currentLevelRef.current !== level) {
      currentLevelRef.current = level;
      setQuestion(getRandomQuestion(level, settings.categories, usedQuestionIds));
    }
  }, [level, settings.categories, usedQuestionIds]);

  const formattedQuestionText = useMemo(
    () => formatQuestionForPair(question.text, player, targetPlayer),
    [question.text, player, targetPlayer]
  );

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
      case 'mild': return ['#0B1B14', '#1A0808'];
      case 'spicy': return ['#2A0608', '#4A080C'];
      case 'extreme': return ['#3A0004', '#150002'];
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

  const handleSwipeComplete = () => onComplete(question.id);
  const handleSwipeSkip = () => {
    if (canSkip) handleSkip();
  };

  return (
    <SwipeGesture
      onSwipeRight={handleSwipeComplete}
      onSwipeLeft={handleSwipeSkip}
      enableRightSwipe={true}
      enableLeftSwipe={canSkip}
    >
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
        {/* Winner indicator / Interactive Pair indicator */}
        <View style={styles.winnerSection}>
          {targetPlayer ? (
            <View style={styles.pairHeaderContainer}>
              {/* Actor Player */}
              <View style={styles.pairPlayerCard}>
                <View style={[styles.winnerDot, { backgroundColor: player.color }]}>
                  <Text style={styles.pairDotNumber}>
                    {player.id >= 1001 && player.id <= 1010
                      ? (player.id === 1010 ? '0' : player.id - 1000)
                      : (player.gender === 'female' ? '♀️' : player.gender === 'male' ? '♂️' : '1')}
                  </Text>
                </View>
                <Text style={styles.pairRoleTitle}>
                  {player.gender === 'female' ? '♀️ Ella' : player.gender === 'male' ? '♂️ Él' : 'Jugador 1'}
                </Text>
                <Text style={styles.pairRoleSubtext}>
                  {question.type === 'dare' ? 'Realiza el reto' : 'Pregunta'}
                </Text>
              </View>

              {/* Interaction Arrow */}
              <View style={styles.pairArrowContainer}>
                <Text style={styles.pairArrow}>➔</Text>
                <Text style={styles.pairArrowLabel}>hacia</Text>
              </View>

              {/* Target Player */}
              <View style={styles.pairPlayerCard}>
                <View style={[styles.winnerDot, { backgroundColor: targetPlayer.color }]}>
                  <Text style={styles.pairDotNumber}>
                    {targetPlayer.id >= 1001 && targetPlayer.id <= 1010
                      ? (targetPlayer.id === 1010 ? '0' : targetPlayer.id - 1000)
                      : (targetPlayer.gender === 'female' ? '♀️' : targetPlayer.gender === 'male' ? '♂️' : '2')}
                  </Text>
                </View>
                <Text style={styles.pairRoleTitle}>
                  {targetPlayer.gender === 'female' ? '♀️ Ella' : targetPlayer.gender === 'male' ? '♂️ Él' : 'Jugador 2'}
                </Text>
                <Text style={styles.pairRoleSubtext}>
                  {question.type === 'dare' ? 'Recibe el reto' : 'Responde'}
                </Text>
              </View>
            </View>
          ) : (
            <>
              <Text style={styles.winnerLabel}>Jugador Seleccionado</Text>
              <View style={[styles.winnerDot, { backgroundColor: player.color }]}>
                <View style={styles.winnerDotInner} />
              </View>
            </>
          )}
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
            {question.type === 'dare' ? '💋 RETO' : '❓ PREGUNTA / VERDAD'}
          </Text>
          <Text style={styles.questionText}>{formattedQuestionText}</Text>
        </View>

        {/* Start Timer Button */}
        {!isTimerActive && timeLeft === settings.timerDuration && (
          <AccessibleTouchable
            style={styles.timerButton}
            onPress={handleStartTimer}
            accessibilityLabel="Iniciar cronómetro"
            accessibilityHint={`Iniciar cuenta regresiva de ${settings.timerDuration} segundos para el reto`}
            accessibilityRole="button"
          >
            <Text style={styles.timerButtonText}>⏱️ Iniciar Temporizador</Text>
          </AccessibleTouchable>
        )}

        {/* Level controls */}
        <View style={styles.levelControls}>
          <AccessibleTouchable
            style={[styles.levelButton, !canLevelDown && styles.levelButtonDisabled]}
            onPress={canLevelDown ? onChangeLevelDown : undefined}
            accessibilityLabel="Hacer más suave"
            accessibilityHint={canLevelDown ? "Disminuir intensidad" : "Ya está en el nivel más suave"}
            accessibilityRole="button"
            accessibilityState={{ disabled: !canLevelDown }}
          >
            <Text style={[styles.levelButtonText, !canLevelDown && styles.levelButtonTextDisabled]}>
              ⬇️ Más Suave
            </Text>
          </AccessibleTouchable>

          <AccessibleTouchable
            style={[styles.levelButton, !canLevelUp && styles.levelButtonDisabled]}
            onPress={canLevelUp ? onChangeLevelUp : undefined}
            accessibilityLabel="Hacer más picante"
            accessibilityHint={canLevelUp ? "Aumentar intensidad" : "Ya está en el nivel más caliente"}
            accessibilityRole="button"
            accessibilityState={{ disabled: !canLevelUp }}
          >
            <Text style={[styles.levelButtonText, !canLevelUp && styles.levelButtonTextDisabled]}>
              Más Picante ⬆️
            </Text>
          </AccessibleTouchable>
        </View>

        {/* Action buttons */}
        <View style={styles.actionButtons}>
          <AccessibleTouchable
            style={[styles.skipButton, !canSkip && styles.skipButtonDisabled]}
            onPress={handleSkip}
            accessibilityLabel={`Saltar reto. Quedan ${settings.skipLimit - skipCount} cambios`}
            accessibilityHint="Pasar de este reto"
            accessibilityRole="button"
            accessibilityState={{ disabled: !canSkip }}
          >
            <Text style={[styles.skipButtonText, !canSkip && styles.skipButtonTextDisabled]}>
              Pasar ({settings.skipLimit - skipCount})
            </Text>
          </AccessibleTouchable>

          <AccessibleTouchable
            style={styles.completeButton}
            onPress={handleComplete}
            accessibilityLabel="Completar reto"
            accessibilityHint="Marcar reto como cumplido y sumar experiencia"
            accessibilityRole="button"
          >
            <Text style={styles.completeButtonText}>
              {timeLeft === 0 ? "¡Tiempo Cumplido! →" : '¡Completado! →'}
            </Text>
          </AccessibleTouchable>
        </View>
      </Animated.View>
    </LinearGradient>
    </SwipeGesture>
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
    width: '100%',
    maxWidth: 620,
    alignSelf: 'center',
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
  pairHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  pairPlayerCard: {
    alignItems: 'center',
    minWidth: 80,
  },
  pairDotNumber: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  pairRoleTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 6,
  },
  pairRoleSubtext: {
    color: '#fff',
    fontSize: 11,
    opacity: 0.75,
    marginTop: 2,
    fontWeight: '600',
  },
  pairArrowContainer: {
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  pairArrow: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900',
    opacity: 0.9,
  },
  pairArrowLabel: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    opacity: 0.7,
    textTransform: 'uppercase',
    letterSpacing: 1,
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
    backgroundColor: 'rgba(20, 20, 28, 0.75)',
    borderRadius: 24,
    padding: 26,
    marginBottom: 22,
    minHeight: 180,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    shadowColor: '#E50914',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  questionType: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FF2A3A',
    marginBottom: 12,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  questionText: {
    fontSize: 22,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 32,
    fontWeight: '700',
  },
  timerButton: {
    backgroundColor: 'rgba(229, 9, 20, 0.15)',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(229, 9, 20, 0.6)',
  },
  timerButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  levelControls: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
    width: '100%',
  },
  levelButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 12,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelButtonDisabled: {
    opacity: 0.25,
  },
  levelButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  levelButtonTextDisabled: {
    opacity: 0.4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  skipButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingVertical: 16,
    borderRadius: 22,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.28)',
  },
  skipButtonDisabled: {
    opacity: 0.3,
  },
  skipButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  skipButtonTextDisabled: {
    opacity: 0.5,
  },
  completeButton: {
    flex: 1.4,
    backgroundColor: '#E50914',
    paddingVertical: 16,
    borderRadius: 22,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    shadowColor: '#E50914',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
