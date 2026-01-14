import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  GestureResponderHandlers,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { GameMode, IntensityLevel, Player } from '../types';
import { getRandomColor } from '../utils/colors';
import { soundManager } from '../utils/sounds';
import RouletteAnimation from '../components/RouletteAnimation';
import RippleEffect from '../components/RippleEffect';
import PulsingCircle from '../components/PulsingCircle';
import BounceAnimation from '../components/BounceAnimation';
import GlowEffect from '../components/GlowEffect';

const { width, height } = Dimensions.get('window');

interface Props {
  mode: GameMode;
  level: IntensityLevel;
  onPlayerSelected: (player: Player) => void;
  onBack: () => void;
  onChangeLevel: () => void;
}

interface RippleData {
  id: number;
  x: number;
  y: number;
  color: string;
}

export default function ImprovedGameScreen({ mode, level, onPlayerSelected, onBack, onChangeLevel }: Props) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [showRoulette, setShowRoulette] = useState(false);
  const [ripples, setRipples] = useState<RippleData[]>([]);
  const usedColors = useRef<string[]>([]);
  const rippleIdCounter = useRef(0);

  // Track active touches by their identifier
  const activeTouches = useRef<Map<number, Player>>(new Map());
  const countdownTimeout = useRef<NodeJS.Timeout | null>(null);

  const countdownAnim = useRef(new Animated.Value(1)).current;

  const addRipple = (x: number, y: number, color: string) => {
    const ripple: RippleData = {
      id: rippleIdCounter.current++,
      x,
      y,
      color,
    };
    setRipples(prev => [...prev, ripple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== ripple.id));
    }, 600);
  };

  const handleTouchStart = (evt: any) => {
    if (isSelecting) return;

    const touches = evt.nativeEvent.touches;

    // Process all current touches
    touches.forEach((touch: any) => {
      const touchId = touch.identifier;

      // Only add if we haven't already tracked this touch
      if (!activeTouches.current.has(touchId)) {
        const x = touch.pageX;
        const y = touch.pageY;
        const color = getRandomColor(usedColors.current);
        usedColors.current.push(color);

        const player: Player = {
          id: touchId,
          x,
          y,
          color,
          gender: mode === 'hetero' ? (x < width / 2 ? 'female' : 'male') : undefined,
        };

        activeTouches.current.set(touchId, player);
        addRipple(x, y, color);
      }
    });

    // Update players state with all active touches
    const allPlayers = Array.from(activeTouches.current.values());
    setPlayers(allPlayers);

    // Check if we have enough players to start countdown
    if (allPlayers.length >= 2 && !countdown && countdownTimeout.current === null) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      soundManager.playSound('tap');

      // Small delay to ensure all touches are registered
      countdownTimeout.current = setTimeout(() => {
        startCountdown();
        countdownTimeout.current = null;
      }, 300);
    }
  };

  const handleTouchMove = (evt: any) => {
    if (isSelecting) return;

    const touches = evt.nativeEvent.touches;

    // Update positions of existing touches
    touches.forEach((touch: any) => {
      const touchId = touch.identifier;
      const existingPlayer = activeTouches.current.get(touchId);

      if (existingPlayer) {
        activeTouches.current.set(touchId, {
          ...existingPlayer,
          x: touch.pageX,
          y: touch.pageY,
        });
      }
    });

    const allPlayers = Array.from(activeTouches.current.values());
    setPlayers(allPlayers);
  };

  const handleTouchEnd = (evt: any) => {
    if (isSelecting) return;

    // Remove touches that ended
    const changedTouches = evt.nativeEvent.changedTouches;
    changedTouches.forEach((touch: any) => {
      activeTouches.current.delete(touch.identifier);
    });

    // If we lost players, reset
    const remainingPlayers = Array.from(activeTouches.current.values());

    if (remainingPlayers.length < 2) {
      setPlayers(remainingPlayers);
      setCountdown(null);
      usedColors.current = [];

      if (countdownTimeout.current) {
        clearTimeout(countdownTimeout.current);
        countdownTimeout.current = null;
      }
    } else {
      setPlayers(remainingPlayers);
    }
  };

  const startCountdown = () => {
    setIsSelecting(true);
    setCountdown(3);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          // Start roulette animation
          setShowRoulette(true);
          return null;
        }
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        soundManager.playSound('countdown');

        // Bounce animation on countdown
        Animated.sequence([
          Animated.timing(countdownAnim, {
            toValue: 1.2,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(countdownAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start();

        return prev - 1;
      });
    }, 1000);
  };

  const handleRouletteComplete = (winner: Player) => {
    onPlayerSelected(winner);
    setIsSelecting(false);
    setPlayers([]);
    setShowRoulette(false);
    usedColors.current = [];
  };

  const getLevelColor = () => {
    switch (level) {
      case 'mild': return '#06FFA5';
      case 'spicy': return '#FB5607';
      case 'extreme': return '#FF006E';
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
    <View
      style={styles.container}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderGrant={handleTouchStart}
      onResponderMove={handleTouchMove}
      onResponderRelease={handleTouchEnd}
      onResponderTerminationRequest={() => false}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.levelButton} onPress={onChangeLevel}>
          <GlowEffect color={getLevelColor()} intensity={15}>
            <Text style={[styles.levelText, { color: getLevelColor() }]}>
              {getLevelEmoji()} {level.toUpperCase()}
            </Text>
          </GlowEffect>
        </TouchableOpacity>
      </View>

      {/* Split screen divider for hetero mode */}
      {mode === 'hetero' && (
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerTextLeft}>♀️</Text>
          <Text style={styles.dividerTextRight}>♂️</Text>
        </View>
      )}

      {/* Instruction text */}
      {players.length === 0 && !isSelecting && (
        <BounceAnimation trigger={true}>
          <View style={styles.instructionContainer}>
            <Text style={styles.instructionTitle}>Ready to Play?</Text>
            <Text style={styles.instructionText}>
              All players touch the screen with one finger
            </Text>
            <Text style={styles.instructionSubtext}>
              Minimum 2 players
            </Text>
          </View>
        </BounceAnimation>
      )}

      {/* Countdown */}
      {countdown !== null && (
        <Animated.View
          style={[
            styles.countdownContainer,
            {
              transform: [{ scale: countdownAnim }],
            },
          ]}
        >
          <GlowEffect color="#FF006E" intensity={20}>
            <Text style={styles.countdownText}>{countdown}</Text>
          </GlowEffect>
        </Animated.View>
      )}

      {/* Player touch indicators with pulse */}
      {players.map((player) => (
        <View key={player.id}>
          <View
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
          {/* Pulsing effect while waiting */}
          {!showRoulette && countdown === null && (
            <PulsingCircle x={player.x} y={player.y} color={player.color} />
          )}
        </View>
      ))}

      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <RippleEffect
          key={ripple.id}
          x={ripple.x}
          y={ripple.y}
          color={ripple.color}
        />
      ))}

      {/* Roulette animation */}
      {showRoulette && (
        <RouletteAnimation
          players={players}
          onComplete={handleRouletteComplete}
        />
      )}

      {/* Player count */}
      {players.length > 0 && countdown === null && !showRoulette && (
        <View style={styles.playerCountContainer}>
          <Text style={styles.playerCountText}>
            {players.length === 0 ? 'Waiting for players...' : 
               players.length === 1 ? '1 player detected - need 1 more!' : 
               `${players.length} players detected - Get ready!`}
          </Text>
          <Text style={styles.playerCountSubtext}>
            Hold still...
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  levelButton: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
  },
  levelText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    position: 'absolute',
    left: width / 2,
    top: 0,
    bottom: 0,
    zIndex: 5,
  },
  dividerLine: {
    width: 2,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dividerTextLeft: {
    position: 'absolute',
    fontSize: 40,
    left: -60,
    top: '50%',
    marginTop: -20,
  },
  dividerTextRight: {
    position: 'absolute',
    fontSize: 40,
    left: 20,
    top: '50%',
    marginTop: -20,
  },
  instructionContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    marginTop: -60,
  },
  instructionTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  instructionText: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: 10,
  },
  instructionSubtext: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.5,
  },
  countdownContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -75,
    marginTop: -75,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,0,110,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  countdownText: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#fff',
  },
  touchIndicator: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 15,
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
  playerCountContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  playerCountText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  playerCountSubtext: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.6,
  },
});
