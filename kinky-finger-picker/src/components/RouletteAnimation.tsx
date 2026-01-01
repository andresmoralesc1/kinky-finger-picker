import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { Player } from '../types';
import * as Haptics from 'expo-haptics';
import { soundManager } from '../utils/sounds';

const { width, height } = Dimensions.get('window');

interface Props {
  players: Player[];
  onComplete: (selectedPlayer: Player) => void;
}

export default function RouletteAnimation({ players, onComplete }: Props) {
  const [currentHighlight, setCurrentHighlight] = useState(0);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let delay = 100; // Initial speed
    let iterations = 0;
    const maxIterations = 15 + Math.floor(Math.random() * 10); // Random stop point

    const cycle = () => {
      interval = setTimeout(() => {
        iterations++;

        // Slow down progressively
        if (iterations > maxIterations * 0.7) {
          delay += 50; // Slow down
        }

        // Highlight next player
        setCurrentHighlight((prev) => (prev + 1) % players.length);

        // Haptic tick
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        soundManager.playSound('tap');

        // Pulse animation
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.3,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start();

        // Continue or finish
        if (iterations < maxIterations) {
          cycle();
        } else {
          // Final selection
          const finalIndex = currentHighlight;
          setTimeout(() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            soundManager.playSound('winner');

            // Big finale animation
            Animated.parallel([
              Animated.spring(scaleAnim, {
                toValue: 1.5,
                tension: 50,
                friction: 3,
                useNativeDriver: true,
              }),
              Animated.timing(glowAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
              }),
            ]).start(() => {
              setTimeout(() => {
                onComplete(players[finalIndex]);
              }, 500);
            });
          }, 300);
        }
      }, delay);
    };

    cycle();

    return () => {
      if (interval) clearTimeout(interval);
    };
  }, []);

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Overlay */}
      <View style={styles.overlay} />

      {/* Highlight current player */}
      {players.map((player, index) => (
        <View key={player.id} style={{ position: 'absolute' }}>
          {index === currentHighlight && (
            <>
              {/* Glow effect */}
              <Animated.View
                style={[
                  styles.glow,
                  {
                    left: player.x - 80,
                    top: player.y - 80,
                    backgroundColor: player.color,
                    opacity: glowAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.4, 0.8],
                    }),
                  },
                ]}
              />
              {/* Highlight ring */}
              <Animated.View
                style={[
                  styles.highlight,
                  {
                    left: player.x - 60,
                    top: player.y - 60,
                    borderColor: player.color,
                    transform: [{ scale: scaleAnim }],
                  },
                ]}
              />
            </>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  glow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
  },
  highlight: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 6,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 16,
    elevation: 16,
  },
});
