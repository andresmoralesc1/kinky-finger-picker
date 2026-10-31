import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { Player, GameMode } from '../types';
import * as Haptics from 'expo-haptics';
import { soundManager } from '../utils/sounds';

interface Props {
  players: Player[];
  mode?: GameMode;
  onComplete: (selectedPlayer: Player, targetPlayer: Player) => void;
}

export default function RouletteAnimation({ players, mode = 'hetero', onComplete }: Props) {
  const screenWidth = Dimensions.get('window').width;

  // Separate players into Left (e.g. Female / 1-5) and Right (e.g. Male / 6-0)
  const leftSidePlayers = players.filter(
    (p) => p.x < screenWidth / 2 || p.gender === 'female'
  );
  const rightSidePlayers = players.filter(
    (p) => p.x >= screenWidth / 2 || p.gender === 'male'
  );
  const hasBothSides = leftSidePlayers.length > 0 && rightSidePlayers.length > 0;

  const [highlightedLeftIdx, setHighlightedLeftIdx] = useState(0);
  const [highlightedRightIdx, setHighlightedRightIdx] = useState(0);
  const [highlightedAIdx, setHighlightedAIdx] = useState(0);
  const [highlightedBIdx, setHighlightedBIdx] = useState(players.length > 1 ? 1 : 0);
  const [isDone, setIsDone] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  // Keep latest indices in refs so timeout callback always has exact state
  const leftIdxRef = useRef(0);
  const rightIdxRef = useRef(0);
  const aIdxRef = useRef(0);
  const bIdxRef = useRef(players.length > 1 ? 1 : 0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let delay = 100;
    let iterations = 0;
    const maxIterations = 16 + Math.floor(Math.random() * 8);

    const cycle = () => {
      interval = setTimeout(() => {
        iterations++;

        if (iterations > maxIterations * 0.7) {
          delay += 45;
        }

        if (hasBothSides) {
          const nextL = (leftIdxRef.current + 1) % leftSidePlayers.length;
          const nextR = (rightIdxRef.current + 1) % rightSidePlayers.length;
          leftIdxRef.current = nextL;
          rightIdxRef.current = nextR;
          setHighlightedLeftIdx(nextL);
          setHighlightedRightIdx(nextR);
        } else {
          const nextA = (aIdxRef.current + 1) % players.length;
          let nextB = (bIdxRef.current + 1) % players.length;
          if (nextB === nextA && players.length > 1) {
            nextB = (nextB + 1) % players.length;
          }
          aIdxRef.current = nextA;
          bIdxRef.current = nextB;
          setHighlightedAIdx(nextA);
          setHighlightedBIdx(nextB);
        }

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        soundManager.playSound('tap');

        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.25,
            duration: 80,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 80,
            useNativeDriver: true,
          }),
        ]).start();

        if (iterations < maxIterations) {
          cycle();
        } else {
          setIsDone(true);
          setTimeout(() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            soundManager.playSound('winner');

            Animated.parallel([
              Animated.spring(scaleAnim, {
                toValue: 1.45,
                tension: 50,
                friction: 3,
                useNativeDriver: true,
              }),
              Animated.timing(glowAnim, {
                toValue: 1,
                duration: 350,
                useNativeDriver: true,
              }),
            ]).start(() => {
              setTimeout(() => {
                let actor: Player;
                let target: Player;

                if (hasBothSides) {
                  const left = leftSidePlayers[leftIdxRef.current];
                  const right = rightSidePlayers[rightIdxRef.current];
                  // 50% chance Left is actor, 50% chance Right is actor
                  const leftActs = Math.random() < 0.5;
                  actor = leftActs ? left : right;
                  target = leftActs ? right : left;
                } else {
                  actor = players[aIdxRef.current];
                  target = players[bIdxRef.current] || players[(aIdxRef.current + 1) % players.length];
                }

                onComplete(actor, target);
              }, 600);
            });
          }, 250);
        }
      }, delay);
    };

    cycle();

    return () => {
      if (interval) clearTimeout(interval);
    };
  }, []);

  const isPlayerHighlighted = (player: Player) => {
    if (hasBothSides) {
      const leftPlayer = leftSidePlayers[highlightedLeftIdx];
      const rightPlayer = rightSidePlayers[highlightedRightIdx];
      return player.id === leftPlayer?.id || player.id === rightPlayer?.id;
    } else {
      const pA = players[highlightedAIdx];
      const pB = players[highlightedBIdx];
      return player.id === pA?.id || player.id === pB?.id;
    }
  };

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Dark overlay */}
      <View style={styles.overlay} />

      {/* Roulette candidate highlights */}
      {players.map((player) => {
        if (!isPlayerHighlighted(player)) return null;

        return (
          <View key={player.id} style={{ position: 'absolute' }}>
            <Animated.View
              style={[
                styles.glow,
                {
                  left: player.x - 80,
                  top: player.y - 80,
                  backgroundColor: player.color,
                  opacity: glowAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.45, 0.9],
                  }),
                },
              ]}
            />
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
          </View>
        );
      })}
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
