import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

interface Props {
  children: React.ReactNode;
  color: string;
  intensity?: number;
  speed?: number;
}

export default function GlowEffect({
  children,
  color,
  intensity = 10,
  speed = 1000
}: Props) {
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: speed,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: speed,
          useNativeDriver: false,
        }),
      ])
    );

    animation.start();
    return () => animation.stop();
  }, []);

  const shadowRadius = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [5, intensity],
  });

  const shadowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <Animated.View
      style={{
        shadowColor: color,
        shadowRadius,
        shadowOpacity,
        shadowOffset: { width: 0, height: 0 },
        elevation: 8,
      }}
    >
      {children}
    </Animated.View>
  );
}
