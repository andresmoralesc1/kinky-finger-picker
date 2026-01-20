import React, { useState } from 'react';
import { TouchableOpacity, TouchableOpacityProps, View, StyleSheet, Animated, Platform } from 'react-native';
import { AccessibilityService } from '../utils/accessibility';

interface Props extends TouchableOpacityProps {
  children: React.ReactNode;
  accessibilityLabel: string;
  accessibilityHint?: string;
  accessibilityRole?: 'button' | 'link' | 'header' | 'none';
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  announceOnPress?: string;
  scaleOnPress?: boolean;
  hapticFeedback?: boolean;
  pressDuration?: number;
}

/**
 * Accessible touchable component with enhanced accessibility features and micro-interactions
 *
 * Features:
 * - Scale animation on press
 * - Haptic feedback (vibration)
 * - Screen reader announcements
 * - Visual feedback for pressed/disabled states
 * - Long press support
 * - Customizable animation duration
 */
export default function AccessibleTouchable({
  children,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = 'button',
  onPress,
  onLongPress,
  disabled = false,
  announceOnPress,
  scaleOnPress = true,
  hapticFeedback = true,
  pressDuration = 150,
  style,
  ...props
}: Props) {
  const [isPressed, setIsPressed] = useState(false);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled) return;

    setIsPressed(true);

    // Scale animation
    if (scaleOnPress) {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
        speed: 50,
        bounciness: 4,
      }).start();
    }

    // Haptic feedback
    if (hapticFeedback && Platform.OS === 'ios') {
      // @ts-ignore - expo-haptics may not be typed
      import('expo-haptics').then(({ Haptics }) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      });
    }
  };

  const handlePressOut = () => {
    if (disabled) return;

    setIsPressed(false);

    // Scale back animation
    if (scaleOnPress) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 50,
        bounciness: 4,
      }).start();
    }
  };

  const handlePress = () => {
    if (disabled) return;

    // Announce to screen reader if specified
    if (announceOnPress) {
      AccessibilityService.announce(announceOnPress);
    }

    // Trigger press callback with delay for animation
    setTimeout(() => {
      onPress?.();
    }, pressDuration / 2);
  };

  const animatedStyle = {
    transform: [{ scale: scaleAnim }],
  };

  const containerStyle = [
    styles.container,
    isPressed && styles.pressed,
    disabled && styles.disabled,
    style,
  ];

  return (
    <Animated.View style={containerStyle}>
      <TouchableOpacity
        {...props}
        onPress={handlePress}
        onLongPress={onLongPress}
        onPressIn={(e) => {
          handlePressIn();
          props.onPressIn?.(e);
        }}
        onPressOut={(e) => {
          handlePressOut();
          props.onPressOut?.(e);
        }}
        disabled={disabled}
        activeOpacity={1} // We handle opacity ourselves
        accessibilityRole={accessibilityRole}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled, selected: isPressed }}
        accessible={true}
        style={scaleOnPress ? animatedStyle : undefined}
      >
        {typeof children === 'function' ? children(isPressed) : children}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.5,
  },
});
