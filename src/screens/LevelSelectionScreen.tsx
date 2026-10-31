import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IntensityLevel } from '../types';
import AccessibleTouchable from '../components/AccessibleTouchable';
import { SwipeableScreen } from '../components/SwipeGesture';

interface Props {
  onSelectLevel: (level: IntensityLevel) => void;
  onBack: () => void;
}

/**
 * Enhanced level selection screen with animations and micro-interactions
 *
 * Features:
 * - Staggered fade-in animations for buttons
 * - AccessibleTouchable for all interactive elements
 * - Improved accessibility labels
 * - Smooth hover/press states
 */
export default function LevelSelectionScreen({ onSelectLevel, onBack }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const mildAnim = useRef(new Animated.Value(0)).current;
  const spicyAnim = useRef(new Animated.Value(0)).current;
  const extremeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial fade-in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    // Staggered button animations
    const staggeredAnimations = [
      { anim: mildAnim, delay: 100 },
      { anim: spicyAnim, delay: 200 },
      { anim: extremeAnim, delay: 300 },
    ];

    staggeredAnimations.forEach(({ anim, delay }) => {
      Animated.timing(anim, {
        toValue: 1,
        delay,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  return (
    <SwipeableScreen onBack={onBack} canGoBack={true}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <AccessibleTouchable
          style={styles.backButton}
          onPress={onBack}
          accessibilityLabel="Volver"
          accessibilityHint="Regresar a la selección de modo"
          accessibilityRole="button"
        >
          <Text style={styles.backButtonText}>← Volver</Text>
        </AccessibleTouchable>

        <Text style={styles.title}>Elige la Intensidad</Text>
        <Text style={styles.subtitle}>¿Qué tan caliente quieres empezar?</Text>

        <View style={styles.buttonsContainer}>
          <Animated.View style={{ opacity: mildAnim, flex: 1 }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => onSelectLevel('mild')}
              activeOpacity={0.9}
              accessibilityRole="button"
              accessibilityLabel="Nivel Suave"
              accessibilityHint="Preguntas coquetas y divertidas para romper el hielo"
            >
              <LinearGradient
                colors={['#06FFA5', '#00B894'] as const}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.buttonEmoji}>🌶️</Text>
                <Text style={styles.buttonText}>Suave</Text>
                <Text style={styles.buttonSubtext}>Coqueto y divertido</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={{ opacity: spicyAnim, flex: 1 }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => onSelectLevel('spicy')}
              activeOpacity={0.9}
              accessibilityRole="button"
              accessibilityLabel="Nivel Picante"
              accessibilityHint="Subiendo la temperatura con besos y retos directos"
            >
              <LinearGradient
                colors={['#FF5722', '#D84315'] as const}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.buttonEmoji}>🌶️🌶️</Text>
                <Text style={styles.buttonText}>Picante</Text>
                <Text style={styles.buttonSubtext}>Subiendo el calor</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={{ opacity: extremeAnim, flex: 1 }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => onSelectLevel('extreme')}
              activeOpacity={0.9}
              accessibilityRole="button"
              accessibilityLabel="Nivel Extremo"
              accessibilityHint="¡Sin filtros ni límites! Solo adultos 18+"
            >
              <LinearGradient
                colors={['#E50914', '#8E0E00'] as const}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.buttonEmoji}>🌶️🌶️🌶️</Text>
                <Text style={styles.buttonText}>Extremo</Text>
                <Text style={styles.buttonSubtext}>Sin límites • +18</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <Text style={styles.note}>Puedes cambiar de nivel en cualquier momento del juego</Text>
      </Animated.View>
    </SwipeableScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 10,
    zIndex: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 38,
    fontWeight: '900',
    color: '#E50914',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 45,
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '100%',
    maxWidth: 720,
    flexDirection: 'row',
    gap: 16,
    alignSelf: 'center',
  },
  button: {
    flex: 1,
    height: 165,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  buttonEmoji: {
    fontSize: 40,
    marginBottom: 5,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  buttonSubtext: {
    fontSize: 13,
    color: '#fff',
    opacity: 0.9,
  },
  note: {
    marginTop: 30,
    color: '#fff',
    opacity: 0.6,
    fontSize: 14,
  },
});
