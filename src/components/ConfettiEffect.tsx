import React, { useEffect, useRef } from 'react';
import { View, Animated, Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

interface Particle {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  rotation: Animated.Value;
  color: string;
  initialX: number;
}

interface Props {
  colors: string[];
  particleCount?: number;
  duration?: number;
}

export default function ConfettiEffect({ colors, particleCount = 50, duration = 2000 }: Props) {
  const particles = useRef<Particle[]>([]);

  useEffect(() => {
    // Create particles
    particles.current = Array.from({ length: particleCount }, (_, i) => {
      const initialX = Math.random() * width;
      return {
        id: i,
        x: new Animated.Value(initialX),
        y: new Animated.Value(-20),
        rotation: new Animated.Value(0),
        color: colors[Math.floor(Math.random() * colors.length)],
        initialX,
      };
    });

    // Animate particles
    const animations = particles.current.map(particle =>
      Animated.parallel([
        Animated.timing(particle.y, {
          toValue: height + 50,
          duration: duration + Math.random() * 1000,
          useNativeDriver: true,
        }),
        Animated.timing(particle.x, {
          toValue: particle.initialX + (Math.random() - 0.5) * 200,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(particle.rotation, {
          toValue: Math.random() * 360,
          duration: duration,
          useNativeDriver: true,
        }),
      ])
    );

    Animated.stagger(20, animations).start();
  }, []);

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.current.map(particle => (
        <Animated.View
          key={particle.id}
          style={[
            styles.particle,
            {
              backgroundColor: particle.color,
              transform: [
                { translateX: particle.x },
                { translateY: particle.y },
                {
                  rotate: particle.rotation.interpolate({
                    inputRange: [0, 360],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            },
          ]}
        />
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
  particle: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
