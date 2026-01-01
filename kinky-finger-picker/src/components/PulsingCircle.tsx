import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

interface Props {
  x: number;
  y: number;
  color: string;
}

export default function PulsingCircle({ x, y, color }: Props) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      style={[
        styles.circle,
        {
          left: x - 40,
          top: y - 40,
          backgroundColor: color,
          transform: [{ scale: pulseAnim }],
          opacity: pulseAnim.interpolate({
            inputRange: [1, 1.3],
            outputRange: [0.3, 0.1],
          }),
        },
      ]}
      pointerEvents="none"
    />
  );
}

const styles = StyleSheet.create({
  circle: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
  },
});
