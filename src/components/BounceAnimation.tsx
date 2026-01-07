import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

interface Props {
  children: React.ReactNode;
  trigger?: boolean;
  scale?: number;
  duration?: number;
}

export default function BounceAnimation({
  children,
  trigger = true,
  scale = 1.2,
  duration = 300
}: Props) {
  const bounceAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (trigger) {
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: scale,
          duration: duration / 2,
          useNativeDriver: true,
        }),
        Animated.spring(bounceAnim, {
          toValue: 1,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [trigger]);

  return (
    <Animated.View style={{ transform: [{ scale: bounceAnim }] }}>
      {children}
    </Animated.View>
  );
}
