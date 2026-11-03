import React, { useEffect, useRef, useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Player, IntensityLevel, Question, QuestionCategory, Settings, GameMode, GroupInteractionContext } from '../types';
import { getRandomQuestion, formatQuestionForPair, formatQuestionForGroup } from '../data/questions';
import ConfettiEffect from '../components/ConfettiEffect';
import { soundManager } from '../utils/sounds';
import AccessibleTouchable from '../components/AccessibleTouchable';
import { SwipeGesture } from '../components/SwipeGesture';
import ShareCard from '../components/ShareCard';

interface Props {
  player: Player;
  targetPlayer?: Player | null;
  groupContext?: GroupInteractionContext | null;
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
  groupContext,
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
  const isGroupRound = Boolean(groupContext && groupContext.pairs && groupContext.pairs.length > 0);

  const [question, setQuestion] = useState(() =>
    getRandomQuestion(level, settings.categories, usedQuestionIds, isGroupRound)
  );

  // Stable level change listener: only picks new question when levelUp or levelDown is clicked
  const currentLevelRef = useRef(level);
  useEffect(() => {
    if (currentLevelRef.current !== level) {
      currentLevelRef.current = level;
      setQuestion(getRandomQuestion(level, settings.categories, usedQuestionIds, isGroupRound));
    }
  }, [level, settings.categories, usedQuestionIds, isGroupRound]);

  const formattedQuestionText = useMemo(() => {
    if (groupContext && groupContext.pairs && groupContext.pairs.length > 0) {
      return formatQuestionForGroup(question.text, groupContext);
    }
    return formatQuestionForPair(question.text, player, targetPlayer);
  }, [question.text, player, targetPlayer, groupContext]);

  const [showConfetti, setShowConfetti] = useState(true);
  const [timeLeft, setTimeLeft] = useState(settings.timerDuration);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [showPunishmentModal, setShowPunishmentModal] = useState(false);
  const [currentPunishment, setCurrentPunishment] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);

  // Party punishments when someone refuses a dare / challenge
  const PUNISHMENTS = [
    '🥃 Tomarse 1 shot de licor sin hacer caras.',
    '🍸 Beber 2 sorbos grandes del trago de la persona enfrente.',
    '💃 Hacer un baile sensual de 10 segundos al centro de la ronda.',
    '🤫 Dejar que la persona a tu derecha revise las últimas 3 fotos de tu galería.',
    '🍗 Recibir una nalgadita juguetona con consentimiento del grupo.',
    '🎭 Confesar en voz alta tu gusto culposo más vergonzoso.',
    '🔥 Enviar un emoji de fueguito 🔥 a la última persona con la que hablaste en WhatsApp.',
    '🍹 Servir y preparar la siguiente ronda de tragos para todos.',
    '💋 Dejar que el grupo decida quién te da un beso en la mejilla o cuello.',
    '🏋️‍♂️ Hacer 10 sentadillas o flexiones de forma seductora.',
  ];

  const handleOpenPunishment = () => {
    const randomPunishment = PUNISHMENTS[Math.floor(Math.random() * PUNISHMENTS.length)];
    setCurrentPunishment(randomPunishment);
    setShowPunishmentModal(true);
    soundManager.playSound('shot');
    if (settings.hapticEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  };

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
    const confettiTimer = setTimeout(() => setShowConfetti(false), 2000);
    return () => clearTimeout(confettiTimer);
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
    if (timeLeft > 30) return '#FFFFFF';
    if (timeLeft > 10) return '#FF4D5A';
    return '#E50914';
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
        {/* Winner indicator / Interactive Pair indicator / Group indicator */}
        <View style={styles.winnerSection}>
          {isGroupRound && groupContext ? (
            <View style={styles.groupContainer}>
              <View style={styles.groupBanner}>
                <Text style={styles.groupBannerText}>
                  {groupContext.totalPlayers === 4
                    ? '🔥 DINÁMICA DE CUARTETO (2 PAREJAS)'
                    : `🔥 DINÁMICA GRUPAL (${groupContext.totalPlayers} JUGADORES - ${groupContext.pairs.length} PAREJAS)`}
                </Text>
              </View>
              <View style={styles.pairsRow}>
                {groupContext.pairs.map((pair, pIdx) => (
                  <React.Fragment key={pair.pairIndex}>
                    <View style={styles.pairBox}>
                      <Text style={styles.pairBoxTitle}>Pareja {pair.pairIndex}</Text>
                      <View style={styles.pairDots}>
                        {/* Player 1 */}
                        <View style={[styles.groupDot, { backgroundColor: pair.player1.color }]}>
                          <Text style={styles.groupDotNumber}>
                            {pair.player1.id >= 1001 && pair.player1.id <= 1010
                              ? (pair.player1.id === 1010 ? '0' : pair.player1.id - 1000)
                              : (pair.player1.gender === 'female' ? '♀️' : pair.player1.gender === 'male' ? '♂️' : `${pair.pairIndex}A`)}
                          </Text>
                        </View>
                        <Text style={styles.pairPlus}>+</Text>
                        {/* Player 2 */}
                        <View style={[styles.groupDot, { backgroundColor: pair.player2.color }]}>
                          <Text style={styles.groupDotNumber}>
                            {pair.player2.id >= 1001 && pair.player2.id <= 1010
                              ? (pair.player2.id === 1010 ? '0' : pair.player2.id - 1000)
                              : (pair.player2.gender === 'female' ? '♀️' : pair.player2.gender === 'male' ? '♂️' : `${pair.pairIndex}B`)}
                          </Text>
                        </View>
                      </View>
                    </View>
                    {pIdx < groupContext.pairs.length - 1 && (
                      <View style={styles.groupVsContainer}>
                        <Text style={styles.groupVsText}>⚔️</Text>
                        <Text style={styles.groupVsSub}>VS</Text>
                      </View>
                    )}
                  </React.Fragment>
                ))}
              </View>
            </View>
          ) : targetPlayer ? (
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

        {/* Secondary Actions: Punishment (Shot) & Share */}
        <View style={styles.secondaryActionsRow}>
          <AccessibleTouchable
            style={styles.punishmentButton}
            onPress={handleOpenPunishment}
            accessibilityLabel="Castigo o Shot si alguien se acobarda"
            accessibilityHint="Muestra un castigo divertido para quien no cumpla el reto"
            accessibilityRole="button"
          >
            <Text style={styles.punishmentButtonText}>🥃 ¿Se acobardó? (Castigo)</Text>
          </AccessibleTouchable>

          <AccessibleTouchable
            style={styles.shareStoryButton}
            onPress={() => setShowShareModal(true)}
            accessibilityLabel="Compartir reto en historias"
            accessibilityHint="Genera una tarjeta elegante para compartir en Instagram o WhatsApp"
            accessibilityRole="button"
          >
            <Text style={styles.shareStoryButtonText}>📸 Compartir</Text>
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

      {/* Punishment / Shot Modal */}
      <Modal
        visible={showPunishmentModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPunishmentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.punishmentCard}>
            <Text style={styles.punishmentTitle}>🥃 ¡CASTIGO / SHOT!</Text>
            <Text style={styles.punishmentSubtitle}>
              Por no cumplir el reto, toca pagar penitencia:
            </Text>
            <View style={styles.punishmentBox}>
              <Text style={styles.punishmentText}>{currentPunishment}</Text>
            </View>
            <View style={styles.punishmentActions}>
              <TouchableOpacity
                style={styles.anotherPunishmentBtn}
                onPress={() => {
                  const randomPunishment = PUNISHMENTS[Math.floor(Math.random() * PUNISHMENTS.length)];
                  setCurrentPunishment(randomPunishment);
                  soundManager.playSound('shot');
                }}
              >
                <Text style={styles.anotherPunishmentBtnText}>🎲 Otro Castigo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.acceptPunishmentBtn}
                onPress={() => {
                  setShowPunishmentModal(false);
                  soundManager.playSound('complete');
                  onComplete(question.id);
                }}
              >
                <Text style={styles.acceptPunishmentBtnText}>¡Cumplido! ✓</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Share Card Modal */}
      {showShareModal && (
        <ShareCard
          title="Kinky Finger Picker"
          subtitle={formattedQuestionText}
          emoji={level === 'extreme' ? '🌶️🌶️🌶️' : level === 'spicy' ? '🌶️🌶️' : '🌶️'}
          stats={{
            level,
          }}
          onClose={() => setShowShareModal(false)}
        />
      )}
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
  groupContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(229, 9, 20, 0.4)',
    width: '100%',
    maxWidth: 520,
  },
  groupBanner: {
    backgroundColor: 'rgba(229, 9, 20, 0.25)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E50914',
  },
  groupBannerText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  pairsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  pairBox: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  pairBoxTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
    opacity: 0.9,
  },
  pairDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  groupDot: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  groupDotNumber: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  pairPlus: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    opacity: 0.8,
  },
  groupVsContainer: {
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  groupVsText: {
    fontSize: 18,
  },
  groupVsSub: {
    color: '#E50914',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
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
  secondaryActionsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginBottom: 12,
  },
  punishmentButton: {
    flex: 1.2,
    backgroundColor: 'rgba(255, 140, 0, 0.16)',
    paddingVertical: 12,
    borderRadius: 18,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 140, 0, 0.65)',
  },
  punishmentButtonText: {
    color: '#FFA040',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  shareStoryButton: {
    flex: 0.8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    borderRadius: 18,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  shareStoryButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  punishmentCard: {
    width: '100%',
    maxWidth: 460,
    backgroundColor: '#160809',
    borderRadius: 26,
    padding: 26,
    borderWidth: 2,
    borderColor: '#E50914',
    alignItems: 'center',
    shadowColor: '#E50914',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 18,
    elevation: 14,
  },
  punishmentTitle: {
    color: '#FFA040',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.8,
  },
  punishmentSubtitle: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  punishmentBox: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 18,
    padding: 20,
    width: '100%',
    marginBottom: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 140, 0, 0.4)',
  },
  punishmentText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '700',
  },
  punishmentActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  anotherPunishmentBtn: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  anotherPunishmentBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  acceptPunishmentBtn: {
    flex: 1.2,
    backgroundColor: '#E50914',
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.85)',
  },
  acceptPunishmentBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '900',
  },
});
