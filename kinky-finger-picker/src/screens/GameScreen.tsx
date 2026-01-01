import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  PanResponder,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { GameMode, IntensityLevel, Player } from '../types';
import { getRandomColor } from '../utils/colors';

const { width, height } = Dimensions.get('window');

interface Props {
  mode: GameMode;
  level: IntensityLevel;
  onPlayerSelected: (player: Player) => void;
  onBack: () => void;
  onChangeLevel: () => void;
}

export default function GameScreen({ mode, level, onPlayerSelected, onBack, onChangeLevel }: Props) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const usedColors = useRef<string[]>([]);

  const countdownAnim = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: (evt) => {
        if (isSelecting) return;

        const touches = evt.nativeEvent.touches;
        const newPlayers: Player[] = [];

        touches.forEach((touch, index) => {
          const x = touch.pageX;
          const y = touch.pageY;

          // Check if touch is in valid zone based on mode
          const isValidTouch = mode === 'hetero'
            ? true // Split screen validation happens in rendering
            : true; // Full screen - all touches valid

          if (isValidTouch) {
            const color = getRandomColor(usedColors.current);
            usedColors.current.push(color);

            newPlayers.push({
              id: index,
              x,
              y,
              color,
              gender: mode === 'hetero' ? (x < width / 2 ? 'female' : 'male') : undefined,
            });
          }
        });

        setPlayers(newPlayers);

        if (newPlayers.length >= 2) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          startCountdown();
        }
      },

      onPanResponderRelease: () => {
        if (!isSelecting) {
          setPlayers([]);
          setCountdown(null);
          usedColors.current = [];
        }
      },
    })
  ).current;

  const startCountdown = () => {
    setIsSelecting(true);
    setCountdown(3);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          selectRandomPlayer();
          return null;
        }
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        return prev - 1;
      });
    }, 1000);
  };

  const selectRandomPlayer = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const randomIndex = Math.floor(Math.random() * players.length);
    const winner = players[randomIndex];

    // Animate selection
    Animated.sequence([
      Animated.timing(countdownAnim, {
        toValue: 1.5,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(countdownAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        onPlayerSelected(winner);
        setIsSelecting(false);
        setPlayers([]);
        usedColors.current = [];
      }, 500);
    });
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
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.levelButton} onPress={onChangeLevel}>
          <Text style={[styles.levelText, { color: getLevelColor() }]}>
            {getLevelEmoji()} {level.toUpperCase()}
          </Text>
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
      {players.length === 0 && (
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionTitle}>Ready to Play?</Text>
          <Text style={styles.instructionText}>
            All players touch the screen with one finger
          </Text>
          <Text style={styles.instructionSubtext}>
            Minimum 2 players
          </Text>
        </View>
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
          <Text style={styles.countdownText}>{countdown}</Text>
        </Animated.View>
      )}

      {/* Player touch indicators */}
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

      {/* Player count */}
      {players.length > 0 && countdown === null && (
        <View style={styles.playerCountContainer}>
          <Text style={styles.playerCountText}>
            {players.length} player{players.length > 1 ? 's' : ''} detected
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
