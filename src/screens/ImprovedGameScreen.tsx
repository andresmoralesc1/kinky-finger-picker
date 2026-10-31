import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  GestureResponderEvent,
  NativeSyntheticEvent,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { GameMode, IntensityLevel, Player } from '../types';
import { getRandomColor } from '../utils/colors';
import { soundManager } from '../utils/sounds';
import RouletteAnimation from '../components/RouletteAnimation';
import RippleEffect from '../components/RippleEffect';
import PulsingCircle from '../components/PulsingCircle';
import BounceAnimation from '../components/BounceAnimation';
import GlowEffect from '../components/GlowEffect';
import AccessibleTouchable from '../components/AccessibleTouchable';

// Get dimensions dynamically (will update on orientation change)
const getWindowDimensions = () => Dimensions.get('window');

// Proper types for touch events
interface Touch {
  identifier: number;
  pageX: number;
  pageY: number;
}

interface Props {
  mode: GameMode;
  level: IntensityLevel;
  onPlayerSelected: (player: Player, targetPlayer?: Player) => void;
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
  const [screenWidth, setScreenWidth] = useState(getWindowDimensions().width);
  const usedColors = useRef<string[]>([]);
  const rippleIdCounter = useRef(0);

  // Track active touches by their identifier
  const activeTouches = useRef<Map<number, Player>>(new Map());
  const activeMouseTouchId = useRef<number | null>(null);
  const countdownTimeout = useRef<NodeJS.Timeout | null>(null);
  const rippleTimeouts = useRef<Set<NodeJS.Timeout>>(new Set());

  const countdownAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const headerAnim = useRef(new Animated.Value(-50)).current;
  const playerCountAnim = useRef(new Animated.Value(100)).current;

  // Fade-in animation on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(headerAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Update screen width on orientation change
  useEffect(() => {
    const updateDimensions = () => {
      const newWidth = getWindowDimensions().width;
      setScreenWidth(newWidth);
    };

    const subscription = Dimensions.addEventListener('change', updateDimensions);
    return () => subscription?.remove();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clear countdown timeout
      if (countdownTimeout.current) {
        clearTimeout(countdownTimeout.current);
      }
      // Clear all ripple timeouts
      rippleTimeouts.current.forEach(timeout => clearTimeout(timeout));
      rippleTimeouts.current.clear();
    };
  }, []);

  // Keyboard shortcut simulator for desktop:
  // Keys 1-5 simulate left side (e.g. Female in hetero mode)
  // Keys 6-0 simulate right side (e.g. Male in hetero mode)
  const handleClearTouches = useCallback(() => {
    activeTouches.current.clear();
    setPlayers([]);
    setCountdown(null);
    if (countdownTimeout.current) {
      clearTimeout(countdownTimeout.current);
      countdownTimeout.current = null;
    }
  }, []);

  const toggleVirtualTouch = useCallback((keyIndex: number) => {
    if (isSelecting) return;

    const virtualId = 1000 + keyIndex; // Distinct numeric ID for keys 1..10
    const dims = getWindowDimensions();
    const width = dims.width;
    const height = dims.height;

    if (activeTouches.current.has(virtualId)) {
      // Remove player
      activeTouches.current.delete(virtualId);
      const remaining = Array.from(activeTouches.current.values());
      setPlayers(remaining);
      if (remaining.length < 2) {
        setCountdown(null);
        if (countdownTimeout.current) {
          clearTimeout(countdownTimeout.current);
          countdownTimeout.current = null;
        }
      }
      return;
    }

    // Determine position based on side: 1-5 is left, 6-10 (0) is right
    const isLeftSide = keyIndex <= 5;
    const sideSlot = isLeftSide ? keyIndex - 1 : keyIndex - 6; // 0..4
    const totalSlots = 5;

    // Distribute Y vertically between 25% and 75% of screen height
    const yMargin = height * 0.22;
    const availableHeight = height * 0.56;
    const y = yMargin + (availableHeight / (totalSlots - 1)) * sideSlot;

    // Distribute X: left side is ~25% from left, right side is ~75% from left
    const x = isLeftSide ? width * 0.25 : width * 0.75;

    const color = getRandomColor(usedColors.current);
    usedColors.current.push(color);

    const player: Player = {
      id: virtualId,
      x,
      y,
      color,
      gender: mode === 'hetero' ? (isLeftSide ? 'female' : 'male') : undefined,
    };

    activeTouches.current.set(virtualId, player);
    addRipple(x, y, color);

    const allPlayers = Array.from(activeTouches.current.values());
    setPlayers(allPlayers);

    if (allPlayers.length >= 2 && !countdown && countdownTimeout.current === null) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      soundManager.playSound('tap');
      countdownTimeout.current = setTimeout(() => {
        startCountdown();
        countdownTimeout.current = null;
      }, 300);
    }
  }, [isSelecting, countdown, mode]);

  // Listen to keyboard on web
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      const key = e.key;
      let slot: number | null = null;
      if (['1', '2', '3', '4', '5'].includes(key)) {
        slot = parseInt(key, 10);
      } else if (['6', '7', '8', '9'].includes(key)) {
        slot = parseInt(key, 10);
      } else if (key === '0') {
        slot = 10;
      } else if (key === 'Escape' || key === 'c' || key === 'C') {
        e.preventDefault();
        handleClearTouches();
        return;
      }

      if (slot !== null) {
        e.preventDefault();
        toggleVirtualTouch(slot);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleVirtualTouch, handleClearTouches]);

  const addRipple = (x: number, y: number, color: string) => {
    const ripple: RippleData = {
      id: rippleIdCounter.current++,
      x,
      y,
      color,
    };
    setRipples(prev => [...prev, ripple]);

    // Remove ripple after animation - track timeout for cleanup
    const timeout = setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== ripple.id));
      rippleTimeouts.current.delete(timeout);
    }, 600);
    rippleTimeouts.current.add(timeout);
  };

  const handleTouchStart = (evt: GestureResponderEvent) => {
    if (isSelecting) return;

    const nativeEvt = evt.nativeEvent as any;
    const rawTouches = (nativeEvt?.touches || []) as unknown as Touch[];

    if (rawTouches.length > 0) {
      // Process all current touches (mobile / tablet / touch devices)
      rawTouches.forEach((touch: Touch) => {
        const t = touch as any;
        const touchId = touch.identifier;
        const x = t.pageX ?? t.clientX ?? 0;
        const y = t.pageY ?? t.clientY ?? 0;

        // Only add if we haven't already tracked this touch
        if (!activeTouches.current.has(touchId)) {
          const color = getRandomColor(usedColors.current);
          usedColors.current.push(color);

          const player: Player = {
            id: touchId,
            x,
            y,
            color,
            gender: mode === 'hetero' ? (x < screenWidth / 2 ? 'female' : 'male') : undefined,
          };

          activeTouches.current.set(touchId, player);
          addRipple(x, y, color);
        }
      });
    } else if (typeof nativeEvt?.pageX === 'number' || typeof nativeEvt?.clientX === 'number') {
      // Desktop / mouse support: clicking places a pin right at the cursor, or removes if clicked on existing
      const x = nativeEvt.pageX ?? nativeEvt.clientX;
      const y = nativeEvt.pageY ?? nativeEvt.clientY;

      const existingEntry = Array.from(activeTouches.current.entries()).find(([_, p]) => {
        const dx = p.x - x;
        const dy = p.y - y;
        return Math.sqrt(dx * dx + dy * dy) < 45;
      });

      if (existingEntry) {
        const [existingId] = existingEntry;
        activeTouches.current.delete(existingId);
        activeMouseTouchId.current = null;
        const allPlayers = Array.from(activeTouches.current.values());
        setPlayers(allPlayers);
        if (allPlayers.length < 2) {
          setCountdown(null);
          if (countdownTimeout.current) {
            clearTimeout(countdownTimeout.current);
            countdownTimeout.current = null;
          }
        }
        return;
      } else {
        const touchId = Date.now();
        activeMouseTouchId.current = touchId;
        const color = getRandomColor(usedColors.current);
        usedColors.current.push(color);

        const player: Player = {
          id: touchId,
          x,
          y,
          color,
          gender: mode === 'hetero' ? (x < screenWidth / 2 ? 'female' : 'male') : undefined,
        };

        activeTouches.current.set(touchId, player);
        addRipple(x, y, color);
      }
    }

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

  const handleTouchMove = (evt: GestureResponderEvent) => {
    if (isSelecting) return;

    const nativeEvt = evt.nativeEvent as any;
    const touches = (nativeEvt?.touches || []) as unknown as Touch[];

    if (touches.length > 0) {
      // Update positions of existing touches on touch devices
      touches.forEach((touch: Touch) => {
        const touchId = touch.identifier;
        const existingPlayer = activeTouches.current.get(touchId);

        if (existingPlayer) {
          const t = touch as any;
          const x = t.pageX ?? t.clientX ?? 0;
          const y = t.pageY ?? t.clientY ?? 0;
          activeTouches.current.set(touchId, {
            ...existingPlayer,
            x,
            y,
            gender: mode === 'hetero' ? (x < screenWidth / 2 ? 'female' : 'male') : existingPlayer.gender,
          });
        }
      });
      setPlayers(Array.from(activeTouches.current.values()));
    } else if (activeMouseTouchId.current !== null && (typeof nativeEvt?.pageX === 'number' || typeof nativeEvt?.clientX === 'number')) {
      // Follow mouse cursor smoothly on desktop drag
      const existingPlayer = activeTouches.current.get(activeMouseTouchId.current);
      if (existingPlayer) {
        const x = nativeEvt.pageX ?? nativeEvt.clientX;
        const y = nativeEvt.pageY ?? nativeEvt.clientY;
        activeTouches.current.set(activeMouseTouchId.current, {
          ...existingPlayer,
          x,
          y,
          gender: mode === 'hetero' ? (x < screenWidth / 2 ? 'female' : 'male') : existingPlayer.gender,
        });
        setPlayers(Array.from(activeTouches.current.values()));
      }
    }
  };

  const handleTouchEnd = (evt: GestureResponderEvent) => {
    activeMouseTouchId.current = null;
    if (isSelecting) return;

    const nativeEvt = evt.nativeEvent as any;
    const changedTouches = (nativeEvt?.changedTouches || []) as unknown as Touch[];
    // On desktop mouse clicks, changedTouches is empty so keep pins placed
    if (changedTouches.length === 0) return;

    // Remove touches that ended on mobile
    changedTouches.forEach((touch: Touch) => {
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

  const handleRouletteComplete = (winner: Player, target?: Player) => {
    onPlayerSelected(winner, target);
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
    <Animated.View
      style={[styles.container, { opacity: fadeAnim }]}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderGrant={handleTouchStart}
      onResponderMove={handleTouchMove}
      onResponderRelease={handleTouchEnd}
      onResponderTerminationRequest={() => false}
    >
      {/* Animated Header */}
      <Animated.View style={[styles.header, { transform: [{ translateY: headerAnim }] }]}>
        <AccessibleTouchable
          style={styles.backButton}
          onPress={onBack}
          accessibilityLabel="Volver"
          accessibilityHint="Regresar a la selección de nivel"
          accessibilityRole="button"
        >
          <Text style={styles.backButtonText}>← Volver</Text>
        </AccessibleTouchable>

        <AccessibleTouchable
          style={styles.levelButton}
          onPress={onChangeLevel}
          accessibilityLabel={`Cambiar nivel de intensidad. Actual es ${level}`}
          accessibilityHint="Toca para cambiar la intensidad"
          accessibilityRole="button"
        >
          <GlowEffect color={getLevelColor()} intensity={15}>
            <Text style={[styles.levelText, { color: getLevelColor() }]}>
              {getLevelEmoji()} {level === 'mild' ? 'SUAVE' : level === 'spicy' ? 'PICANTE' : 'EXTREMO'}
            </Text>
          </GlowEffect>
        </AccessibleTouchable>
      </Animated.View>

      {/* Split screen divider for hetero mode */}
      {mode === 'hetero' && (
        <View style={[styles.divider, { left: screenWidth / 2 }]} pointerEvents="none">
          <View style={styles.dividerLine} />
          <Text style={styles.dividerTextLeft}>♀️</Text>
          <Text style={styles.dividerTextRight}>♂️</Text>
        </View>
      )}

      {/* Instruction text */}
      {players.length === 0 && !isSelecting && (
        <BounceAnimation trigger={true}>
          <View style={styles.instructionContainer} pointerEvents="none">
            <Text style={styles.instructionTitle}>¿Listos para jugar?</Text>
            <Text style={styles.instructionText}>
              {Platform.OS === 'web'
                ? 'Haz clic o toca la pantalla para colocar dedos (o teclas 1-0)'
                : 'Todos los jugadores coloquen un dedo en la pantalla'}
            </Text>
            <Text style={styles.instructionSubtext}>
              {Platform.OS === 'web'
                ? 'Mínimo 2 jugadores • Arrastra para mover • [C] limpiar'
                : 'Mínimo 2 jugadores para comenzar'}
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
          pointerEvents="none"
        >
          <GlowEffect color="#FF006E" intensity={20}>
            <Text style={styles.countdownText}>{countdown}</Text>
          </GlowEffect>
        </Animated.View>
      )}

      {/* Player touch indicators with pulse */}
      {players.map((player) => (
        <View key={player.id} pointerEvents="none">
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
            <View style={styles.touchInner}>
              <Text style={styles.touchKeyText}>
                {player.id >= 1001 && player.id <= 1010
                  ? (player.id === 1010 ? '0' : String(player.id - 1000))
                  : (player.gender === 'female' ? '♀️' : player.gender === 'male' ? '♂️' : '✋')}
              </Text>
            </View>
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
          mode={mode}
          onComplete={handleRouletteComplete}
        />
      )}

      {/* Player count */}
      {players.length > 0 && countdown === null && !showRoulette && (
        <Animated.View
          style={[
            styles.playerCountContainer,
            { transform: [{ translateY: playerCountAnim }] },
          ]}
          pointerEvents="none"
        >
          <Text style={styles.playerCountText}>
            {players.length === 0 ? 'Esperando jugadores...' :
               players.length === 1 ? '1 jugador detectado - ¡falta 1 más!' :
               `¡${players.length} jugadores listos! Mantengan la posición`}
          </Text>
          <Text style={styles.playerCountSubtext}>
            No se muevan...
          </Text>
        </Animated.View>
      )}

      {/* Desktop Keyboard HUD Bar */}
      {Platform.OS === 'web' && (
        <View style={styles.desktopHudContainer} pointerEvents="box-none">
          <View style={styles.desktopHudGroup}>
            <Text style={styles.desktopHudTitle}>
              {mode === 'hetero' ? '♀️ Izquierda' : 'Izquierda'} [1 - 5]
            </Text>
            <View style={styles.desktopKeyRow}>
              {[1, 2, 3, 4, 5].map((slot) => {
                const active = players.find((p) => p.id === 1000 + slot);
                return (
                  <TouchableOpacity
                    key={slot}
                    style={[
                      styles.desktopKeyButton,
                      active ? { backgroundColor: active.color, borderColor: '#fff' } : null,
                    ]}
                    onPress={() => toggleVirtualTouch(slot)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.desktopKeyText,
                        active ? styles.desktopKeyTextActive : null,
                      ]}
                    >
                      {slot}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {players.length > 0 && (
            <TouchableOpacity
              style={styles.desktopClearButton}
              onPress={handleClearTouches}
              activeOpacity={0.8}
            >
              <Text style={styles.desktopClearButtonText}>Limpiar (C)</Text>
            </TouchableOpacity>
          )}

          <View style={styles.desktopHudGroup}>
            <Text style={styles.desktopHudTitle}>
              {mode === 'hetero' ? '♂️ Derecha' : 'Derecha'} [6 - 0]
            </Text>
            <View style={styles.desktopKeyRow}>
              {[6, 7, 8, 9, 10].map((slot) => {
                const active = players.find((p) => p.id === 1000 + slot);
                const label = slot === 10 ? '0' : String(slot);
                return (
                  <TouchableOpacity
                    key={slot}
                    style={[
                      styles.desktopKeyButton,
                      active ? { backgroundColor: active.color, borderColor: '#fff' } : null,
                    ]}
                    onPress={() => toggleVirtualTouch(slot)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.desktopKeyText,
                        active ? styles.desktopKeyTextActive : null,
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      )}
    </Animated.View>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchKeyText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  playerCountContainer: {
    position: 'absolute',
    bottom: 110,
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
  desktopHudContainer: {
    position: 'absolute',
    bottom: 20,
    left: 18,
    right: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 30,
  },
  desktopHudGroup: {
    backgroundColor: 'rgba(18, 18, 26, 0.88)',
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  desktopHudTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: 0.6,
    opacity: 0.95,
  },
  desktopKeyRow: {
    flexDirection: 'row',
    gap: 8,
  },
  desktopKeyButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  desktopKeyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  desktopKeyTextActive: {
    color: '#fff',
    fontWeight: '900',
  },
  desktopClearButton: {
    backgroundColor: '#E50914',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    shadowColor: '#E50914',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  desktopClearButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
});
