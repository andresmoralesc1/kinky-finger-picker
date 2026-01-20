import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export type TransitionType =
  | 'fade'
  | 'slide-horizontal'
  | 'slide-vertical'
  | 'scale'
  | 'flip'
  | 'none';

export type TransitionDirection = 'forward' | 'backward';

interface ScreenTransitionProps {
  children: React.ReactNode;
  visible: boolean;
  type?: TransitionType;
  direction?: TransitionDirection;
  duration?: number;
  onTransitionEnd?: () => void;
}

/**
 * Screen transition component with multiple animation types
 *
 * Features:
 * - Multiple transition types (fade, slide, scale, flip)
 * - Direction-aware animations (forward/backward)
 * - Customizable duration
 * - Transition end callback
 * - Performance-optimized with native driver
 */
export const ScreenTransition: React.FC<ScreenTransitionProps> = ({
  children,
  visible,
  type = 'slide-horizontal',
  direction = 'forward',
  duration = 300,
  onTransitionEnd,
}) => {
  const [showContent, setShowContent] = useState(visible);
  const opacityAnim = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const translateXAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateYAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setShowContent(true);
      animateIn();
    } else {
      animateOut();
    }
  }, [visible]);

  const animateIn = () => {
    const animations: Animated.CompositeAnimation[] = [];

    // Reset values based on transition type and direction
    switch (type) {
      case 'fade':
        opacityAnim.setValue(0);
        animations.push(
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          })
        );
        break;

      case 'slide-horizontal':
        translateXAnim.setValue(direction === 'forward' ? SCREEN_WIDTH : -SCREEN_WIDTH * 0.3);
        opacityAnim.setValue(1);
        animations.push(
          Animated.timing(translateXAnim, {
            toValue: 0,
            duration,
            useNativeDriver: true,
          })
        );
        break;

      case 'slide-vertical':
        translateYAnim.setValue(direction === 'forward' ? SCREEN_HEIGHT : -SCREEN_HEIGHT * 0.3);
        opacityAnim.setValue(1);
        animations.push(
          Animated.timing(translateYAnim, {
            toValue: 0,
            duration,
            useNativeDriver: true,
          })
        );
        break;

      case 'scale':
        scaleAnim.setValue(0.9);
        opacityAnim.setValue(0);
        animations.push(
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 1,
              duration,
              useNativeDriver: true,
            }),
          ])
        );
        break;

      case 'flip':
        rotateYAnim.setValue(direction === 'forward' ? 90 : -90);
        opacityAnim.setValue(0);
        animations.push(
          Animated.parallel([
            Animated.timing(rotateYAnim, {
              toValue: 0,
              duration,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 1,
              duration: duration / 2,
              useNativeDriver: true,
            }),
          ])
        );
        break;

      case 'none':
        opacityAnim.setValue(1);
        break;
    }

    Animated.parallel(animations).start(() => onTransitionEnd?.());
  };

  const animateOut = () => {
    const animations: Animated.CompositeAnimation[] = [];

    switch (type) {
      case 'fade':
        animations.push(
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration,
            useNativeDriver: true,
          })
        );
        break;

      case 'slide-horizontal':
        animations.push(
          Animated.timing(translateXAnim, {
            toValue: direction === 'forward' ? -SCREEN_WIDTH * 0.3 : SCREEN_WIDTH,
            duration,
            useNativeDriver: true,
          })
        );
        break;

      case 'slide-vertical':
        animations.push(
          Animated.timing(translateYAnim, {
            toValue: direction === 'forward' ? -SCREEN_HEIGHT * 0.3 : SCREEN_HEIGHT,
            duration,
            useNativeDriver: true,
          })
        );
        break;

      case 'scale':
        animations.push(
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 0.9,
              duration,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0,
              duration,
              useNativeDriver: true,
            }),
          ])
        );
        break;

      case 'flip':
        animations.push(
          Animated.parallel([
            Animated.timing(rotateYAnim, {
              toValue: direction === 'forward' ? -90 : 90,
              duration,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0,
              duration: duration / 2,
              useNativeDriver: true,
            }),
          ])
        );
        break;

      case 'none':
        opacityAnim.setValue(0);
        break;
    }

    Animated.parallel(animations).start(() => {
      setShowContent(false);
      onTransitionEnd?.();
    });
  };

  const getTransform = () => {
    const perspective = 1000;

    switch (type) {
      case 'slide-horizontal':
        return [{ translateX: translateXAnim }];
      case 'slide-vertical':
        return [{ translateY: translateYAnim }];
      case 'scale':
        return [{ scale: scaleAnim }];
      case 'flip':
        return [
          { perspective },
          {
            rotateY: rotateYAnim.interpolate({
              inputRange: [-90, 0, 90],
              outputRange: ['-90deg', '0deg', '90deg'],
            }),
          },
        ];
      default:
        return [];
    }
  };

  const animatedStyle = {
    opacity: opacityAnim,
    transform: getTransform(),
  };

  if (!showContent && type !== 'none') {
    return null;
  }

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {showContent ? children : null}
    </Animated.View>
  );
};

interface PageTransitionProps {
  children: React.ReactNode;
  index: number;
  currentIndex: number;
  type?: TransitionType;
  duration?: number;
}

/**
 * Page transition for multi-step flows (wizards, onboarding, etc.)
 */
export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  index,
  currentIndex,
  type = 'slide-horizontal',
  duration = 300,
}) => {
  const direction = index > currentIndex ? 'backward' : 'forward';

  return (
    <ScreenTransition
      visible={index === currentIndex}
      type={type}
      direction={direction}
      duration={duration}
    >
      <View style={StyleSheet.absoluteFill}>{children}</View>
    </ScreenTransition>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
