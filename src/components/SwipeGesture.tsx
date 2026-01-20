import React, { ReactNode, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, NativeEventSubscription } from 'react-native';
import {
  GestureDetector,
  Gesture,
} from 'react-native-gesture-handler';
import { Animated } from 'react-native';

// Dynamic swipe threshold (25% of screen width)
const getSwipeThreshold = () => Dimensions.get('window').width * 0.25;
const getScreenWidth = () => Dimensions.get('window').width;

export interface SwipeGestureProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  enabled?: boolean;
  enableLeftSwipe?: boolean;
  enableRightSwipe?: boolean;
  enableUpSwipe?: boolean;
  enableDownSwipe?: boolean;
}

/**
 * Swipe gesture component using react-native-gesture-handler
 *
 * Features:
 * - Configurable swipe directions
 * - Dynamic threshold that responds to orientation changes
 * - Visual feedback with opacity animation
 * - Enable/disable per direction
 *
 * Note: GestureHandlerRootView must be wrapped at the app level (App.tsx)
 *
 * @example
 * ```tsx
 * <SwipeGesture
 *   onSwipeRight={() => navigate('back')}
 *   onSwipeLeft={() => navigate('next')}
 *   enableRightSwipe
 *   enableLeftSwipe
 * >
 *   <ScreenContent />
 * </SwipeGesture>
 * ```
 */
export const SwipeGesture: React.FC<SwipeGestureProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  enabled = true,
  enableLeftSwipe = true,
  enableRightSwipe = true,
  enableUpSwipe = false,
  enableDownSwipe = false,
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  // Store dimensions in refs to avoid recreating gesture
  const swipeThresholdRef = useRef(getSwipeThreshold());
  const screenWidthRef = useRef(getScreenWidth());

  // Update dimensions on orientation change
  useEffect(() => {
    const updateDimensions = () => {
      swipeThresholdRef.current = getSwipeThreshold();
      screenWidthRef.current = getScreenWidth();
    };

    const subscription = Dimensions.addEventListener('change', updateDimensions);
    return () => subscription?.remove();
  }, []);

  const panGesture = Gesture.Pan()
    .enabled(enabled)
    .onStart(() => {
      // Reduce opacity during drag for visual feedback
      Animated.spring(opacity, {
        toValue: 0.85,
        useNativeDriver: true,
      }).start();
    })
    .onUpdate((event) => {
      translateX.setValue(event.translationX);
      translateY.setValue(event.translationY);
    })
    .onEnd((event) => {
      const { translationX, translationY } = event;
      const swipeThreshold = swipeThresholdRef.current;
      const screenWidth = screenWidthRef.current;

      // Reset opacity
      Animated.spring(opacity, {
        toValue: 1,
        useNativeDriver: true,
      }).start();

      // Check horizontal swipes
      if (Math.abs(translationX) > Math.abs(translationY)) {
        // Swipe Right
        if (translationX > swipeThreshold && enableRightSwipe && onSwipeRight) {
          onSwipeRight();
          Animated.spring(translateX, {
            toValue: screenWidth,
            useNativeDriver: true,
          }).start(() => translateX.setValue(0));
        }
        // Swipe Left
        else if (translationX < -swipeThreshold && enableLeftSwipe && onSwipeLeft) {
          onSwipeLeft();
          Animated.spring(translateX, {
            toValue: -screenWidth,
            useNativeDriver: true,
          }).start(() => translateX.setValue(0));
        }
        // Reset
        else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      }
      // Check vertical swipes
      else {
        // Swipe Down
        if (translationY > swipeThreshold && enableDownSwipe && onSwipeDown) {
          onSwipeDown();
          Animated.spring(translateY, {
            toValue: screenWidth,
            useNativeDriver: true,
          }).start(() => translateY.setValue(0));
        }
        // Swipe Up
        else if (translationY < -swipeThreshold && enableUpSwipe && onSwipeUp) {
          onSwipeUp();
          Animated.spring(translateY, {
            toValue: -screenWidth,
            useNativeDriver: true,
          }).start(() => translateY.setValue(0));
        }
        // Reset
        else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      }
    });

  const animatedStyle = {
    transform: [
      { translateX },
      { translateY },
    ],
    opacity,
  };

  return (
    <View style={styles.container}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.content, animatedStyle]}>
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

/**
 * Simplified swipeable wrapper for common navigation patterns
 */
export interface SwipeableScreenProps {
  children: ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  canGoBack?: boolean;
  canGoNext?: boolean;
}

export const SwipeableScreen: React.FC<SwipeableScreenProps> = ({
  children,
  onBack,
  onNext,
  canGoBack = true,
  canGoNext = false,
}) => {
  return (
    <SwipeGesture
      onSwipeRight={canGoBack ? onBack : undefined}
      onSwipeLeft={canGoNext ? onNext : undefined}
      enableRightSwipe={canGoBack}
      enableLeftSwipe={canGoNext}
    >
      {children}
    </SwipeGesture>
  );
};
