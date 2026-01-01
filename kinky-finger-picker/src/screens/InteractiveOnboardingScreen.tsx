import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, PanResponder, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Player } from '../types';
import { getRandomColor } from '../utils/colors';
import ConfettiEffect from '../components/ConfettiEffect';
import { soundManager } from '../utils/sounds';

const { width, height } = Dimensions.get('window');

interface Props {
  onComplete: () => void;
}

type OnboardingStep = 'welcome' | 'touch' | 'countdown' | 'selected' | 'question' | 'complete';

export default function InteractiveOnboardingScreen({ onComplete }: Props) {
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [players, setPlayers] = useState<Player[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const overlayOpacity = useRef(new Animated.Value(1)).current;
  const handsPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animate welcome
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (step === 'touch') {
      // Pulse animation for hands
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(handsPulse, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(handsPulse, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [step]);

  const handleStart = () => {
    soundManager.playSound('tap');
    Animated.timing(overlayOpacity, {
      toValue: 0.7,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setStep('touch');
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => step === 'touch',
      onMoveShouldSetPanResponder: () => step === 'touch',

      onPanResponderGrant: (evt) => {
        if (step !== 'touch') return;

        const touches = evt.nativeEvent.touches;
        if (touches.length >= 2) {
          const newPlayers: Player[] = touches.slice(0, 2).map((touch, index) => ({
            id: index,
            x: touch.pageX,
            y: touch.pageY,
            color: getRandomColor([]),
          }));

          setPlayers(newPlayers);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          soundManager.playSound('tap');

          // Hide overlay and start countdown
          Animated.timing(overlayOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start();

          startCountdown();
        }
      },

      onPanResponderRelease: () => {
        if (step === 'touch' && players.length < 2) {
          setPlayers([]);
        }
      },
    })
  ).current;

  const startCountdown = () => {
    setStep('countdown');
    setCountdown(3);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          selectPlayer();
          return null;
        }
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        soundManager.playSound('countdown');
        return prev - 1;
      });
    }, 1000);
  };

  const selectPlayer = () => {
    const randomIndex = Math.floor(Math.random() * players.length);
    const winner = players[randomIndex];
    setSelectedPlayer(winner);
    setStep('selected');
    setShowConfetti(true);

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    soundManager.playSound('winner');

    setTimeout(() => {
      setShowConfetti(false);
      setStep('question');
    }, 2000);
  };

  const handleComplete = () => {
    soundManager.playSound('complete');
    setStep('complete');
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* Background gradient */}
      <LinearGradient
        colors={['#8338EC', '#3A86FF', '#FF006E']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {showConfetti && <ConfettiEffect colors={['#FF006E', '#FFD700', '#fff']} />}

      {/* STEP 1: Welcome */}
      {step === 'welcome' && (
        <Animated.View
          style={[
            styles.centerContent,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.emoji}>🌶️</Text>
          <Text style={styles.welcomeTitle}>Kinky Finger Picker</Text>
          <Text style={styles.welcomeSubtitle}>Let's learn by playing!</Text>

          <TouchableOpacity style={styles.startButton} onPress={handleStart}>
            <Text style={styles.startButtonText}>Start ✨</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* STEP 2 & 3: Touch instruction + Countdown */}
      {(step === 'touch' || step === 'countdown') && (
        <>
          {/* Overlay instruction */}
          {step === 'touch' && (
            <Animated.View
              style={[
                styles.overlayInstruction,
                { opacity: overlayOpacity },
              ]}
              pointerEvents="none"
            >
              <Animated.View style={{ transform: [{ scale: handsPulse }] }}>
                <Text style={styles.handsEmoji}>👆👆</Text>
              </Animated.View>
              <Text style={styles.instructionText}>
                Put 2 fingers on the screen
              </Text>
              <Text style={styles.instructionSubtext}>
                anywhere you like
              </Text>
            </Animated.View>
          )}

          {/* Player dots */}
          {players.map((player) => (
            <View
              key={player.id}
              style={[
                styles.touchIndicator,
                {
                  left: player.x - 40,
                  top: player.y - 40,
                  backgroundColor: player.color,
                },
              ]}
            >
              <View style={styles.touchInner} />
            </View>
          ))}

          {/* Countdown */}
          {countdown !== null && (
            <View style={styles.countdownContainer}>
              <Text style={styles.countdownText}>{countdown}</Text>
            </View>
          )}
        </>
      )}

      {/* STEP 4: Selected */}
      {step === 'selected' && selectedPlayer && (
        <Animated.View style={styles.centerContent}>
          <Text style={styles.selectedEmoji}>🎉</Text>
          <Text style={styles.selectedTitle}>You got selected!</Text>
          <View
            style={[
              styles.winnerDot,
              { backgroundColor: selectedPlayer.color },
            ]}
          >
            <View style={styles.winnerInner} />
          </View>
          <Text style={styles.selectedSubtitle}>Tap anywhere to see your dare</Text>
        </Animated.View>
      )}

      {/* STEP 5: Question */}
      {step === 'question' && (
        <Animated.View style={[styles.centerContent, { opacity: fadeAnim }]}>
          <View style={styles.questionCard}>
            <Text style={styles.questionType}>💋 YOUR FIRST DARE</Text>
            <Text style={styles.questionText}>
              Tell everyone your favorite color!
            </Text>
          </View>

          <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
            <Text style={styles.completeButtonText}>Done! What's next? →</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* STEP 6: Complete */}
      {step === 'complete' && (
        <Animated.View style={styles.centerContent}>
          <Text style={styles.completeEmoji}>🎊</Text>
          <Text style={styles.completeTitle}>You're Ready!</Text>
          <Text style={styles.completeSubtitle}>
            Now let's pick your game mode
          </Text>

          <TouchableOpacity style={styles.startButton} onPress={onComplete}>
            <Text style={styles.startButtonText}>Let's Party! 🔥</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emoji: {
    fontSize: 100,
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  welcomeSubtitle: {
    fontSize: 20,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 50,
  },
  startButton: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 60,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  startButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#8338EC',
  },
  overlayInstruction: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  handsEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  instructionText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  instructionSubtext: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.8,
  },
  touchIndicator: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  touchInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  countdownContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -100,
    marginTop: -100,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,0,110,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 16,
  },
  countdownText: {
    fontSize: 100,
    fontWeight: 'bold',
    color: '#fff',
  },
  selectedEmoji: {
    fontSize: 100,
    marginBottom: 20,
  },
  selectedTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
  },
  winnerDot: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 16,
  },
  winnerInner: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  selectedSubtitle: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.8,
  },
  questionCard: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 25,
    padding: 40,
    marginBottom: 40,
    minWidth: width - 60,
  },
  questionType: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  questionText: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 32,
    fontWeight: '600',
  },
  completeButton: {
    backgroundColor: '#fff',
    paddingVertical: 18,
    paddingHorizontal: 50,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  completeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8338EC',
  },
  completeEmoji: {
    fontSize: 100,
    marginBottom: 20,
  },
  completeTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  completeSubtitle: {
    fontSize: 20,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 50,
    textAlign: 'center',
  },
});
