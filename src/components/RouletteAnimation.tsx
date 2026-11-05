import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { Player, GameMode, GroupInteractionContext, PlayerPair } from '../types';
import * as Haptics from 'expo-haptics';
import { soundManager } from '../utils/sounds';

interface Props {
  players: Player[];
  mode?: GameMode;
  onComplete: (selectedPlayer: Player, targetPlayer: Player, groupContext?: GroupInteractionContext) => void;
}

export default function RouletteAnimation({ players, mode = 'hetero', onComplete }: Props) {
  const screenWidth = Dimensions.get('window').width;
  const isGroupEven = players.length >= 4 && players.length % 2 === 0;

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
  const timeoutsRef = useRef<Set<NodeJS.Timeout>>(new Set());

  useEffect(() => {
    // Slower, dramatic roulette pulses: starts at 200ms and decelerates towards 450ms+
    let delay = 220;
    let iterations = 0;
    const maxIterations = 14 + Math.floor(Math.random() * 5);

    const safeTimeout = (cb: () => void, ms: number) => {
      const id = setTimeout(() => {
        timeoutsRef.current.delete(id);
        cb();
      }, ms);
      timeoutsRef.current.add(id);
      return id;
    };

    const cycle = () => {
      safeTimeout(() => {
        iterations++;

        // Decelerate dramatically in the final rounds for maximum suspense
        if (iterations > maxIterations * 0.6) {
          delay += 60;
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
        soundManager.playSound('tick');

        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.3,
            duration: 130,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 130,
            useNativeDriver: true,
          }),
        ]).start();

        if (iterations < maxIterations) {
          cycle();
        } else {
          setIsDone(true);
          safeTimeout(() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            soundManager.playSound('winner');

            // Winner celebration: glow stays lit and pulses proudly
            Animated.parallel([
              Animated.spring(scaleAnim, {
                toValue: 1.5,
                tension: 40,
                friction: 4,
                useNativeDriver: true,
              }),
              Animated.timing(glowAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
              }),
            ]).start(() => {
              // Keep selected players glowing and illuminated for a noticeable, satisfying pause
              safeTimeout(() => {
                if (isGroupEven) {
                  // Pair up all players into base couples
                  const pairs: PlayerPair[] = [];
                  if (hasBothSides && leftSidePlayers.length === rightSidePlayers.length) {
                    const shuffledL = [...leftSidePlayers].sort(() => 0.5 - Math.random());
                    const shuffledR = [...rightSidePlayers].sort(() => 0.5 - Math.random());
                    for (let i = 0; i < shuffledL.length; i++) {
                      pairs.push({
                        pairIndex: i + 1,
                        player1: shuffledL[i],
                        player2: shuffledR[i],
                      });
                    }
                  } else {
                    const shuffled = [...players].sort(() => 0.5 - Math.random());
                    for (let i = 0; i < shuffled.length; i += 2) {
                      pairs.push({
                        pairIndex: (i / 2) + 1,
                        player1: shuffled[i],
                        player2: shuffled[i + 1],
                      });
                    }
                  }

                  // Pick group dynamic mode
                  // Supported modes: 'couples' (Duelo), 'all_vs_one' (3 pa 1 / Todos contra 1), 'single_pair' (1 pareja al centro), 'cross_couples' (Intercambio)
                  const modes: Array<'couples' | 'all_vs_one' | 'single_pair' | 'cross_couples'> = [
                    'all_vs_one',
                    'couples',
                    'single_pair',
                    'cross_couples',
                  ];
                  const chosenMode = modes[Math.floor(Math.random() * modes.length)];

                  // Random solo player for all_vs_one
                  const randomSoloIndex = Math.floor(Math.random() * players.length);
                  const soloPlayer = players[randomSoloIndex];
                  const groupMembers = players.filter((_, idx) => idx !== randomSoloIndex);

                  let title = '';
                  let targetDescription = '';

                  switch (chosenMode) {
                    case 'all_vs_one':
                      title = `🎯 TODOS CONTRA UNO (${players.length - 1} PARA 1)`;
                      targetDescription = `¡1 jugador en el blanco frente a los otros ${players.length - 1}!`;
                      break;
                    case 'single_pair':
                      title = '👑 PAREJA ELEGIDA DEL GRUPO';
                      targetDescription = 'Esta pareja fue seleccionada al centro. ¡Los demás son jueces!';
                      break;
                    case 'cross_couples':
                      title = '🔀 INTERCAMBIO CRUZADO';
                      targetDescription = '¡Tensión entre parejas! Conexión cruzada entre participantes.';
                      break;
                    case 'couples':
                    default:
                      title = players.length === 4
                        ? '🔥 DUELO DE PAREJAS (2vs2)'
                        : `🔥 DINÁMICA DE ${pairs.length} PAREJAS`;
                      targetDescription = 'Todas las parejas participan al unísono o compiten entre sí.';
                      break;
                  }

                  const groupContext: GroupInteractionContext = {
                    totalPlayers: players.length,
                    pairs,
                    interactionType: chosenMode,
                    title,
                    targetDescription,
                    soloPlayer,
                    groupMembers,
                  };

                  if (chosenMode === 'all_vs_one') {
                    onComplete(soloPlayer, groupMembers[0], groupContext);
                  } else if (chosenMode === 'cross_couples' && pairs.length >= 2) {
                    onComplete(pairs[0].player1, pairs[1].player2, groupContext);
                  } else {
                    onComplete(pairs[0].player1, pairs[0].player2, groupContext);
                  }
                } else {
                  let actor: Player;
                  let target: Player;

                  if (hasBothSides) {
                    const left = leftSidePlayers[leftIdxRef.current];
                    const right = rightSidePlayers[rightIdxRef.current];
                    const leftActs = Math.random() < 0.5;
                    actor = leftActs ? left : right;
                    target = leftActs ? right : left;
                  } else {
                    actor = players[aIdxRef.current];
                    target = players[bIdxRef.current] || players[(aIdxRef.current + 1) % players.length];
                  }

                  onComplete(actor, target);
                }
              }, 1200);
            });
          }, 350);
        }
      }, delay);
    };

    cycle();

    return () => {
      timeoutsRef.current.forEach(t => clearTimeout(t));
      timeoutsRef.current.clear();
    };
  }, []);

  const isPlayerHighlighted = (player: Player) => {
    if (isGroupEven && isDone) {
      // In group even mode, highlight everyone upon completion as couples
      return true;
    }
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
                    outputRange: [0.45, 0.95],
                  }),
                },
                isDone && styles.winnerGlowActive,
              ]}
            />
            <Animated.View
              style={[
                styles.highlight,
                {
                  left: player.x - 60,
                  top: player.y - 60,
                  borderColor: isDone ? '#FFFFFF' : player.color,
                  backgroundColor: isDone ? player.color : 'transparent',
                  transform: [{ scale: scaleAnim }],
                },
                isDone && styles.winnerHighlightActive,
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
  winnerGlowActive: {
    width: 220,
    height: 220,
    borderRadius: 110,
    shadowColor: '#FFFFFF',
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 25,
  },
  winnerHighlightActive: {
    borderWidth: 8,
    shadowColor: '#FFFFFF',
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 22,
  },
});
