import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, View, Text, StyleSheet } from 'react-native';
import { AccessibilityService } from '../utils/accessibility';

interface Props extends TouchableOpacityProps {
  children: React.ReactNode;
  accessibilityLabel: string;
  accessibilityHint?: string;
  accessibilityRole?: 'button' | 'link' | 'header' | 'none';
  onPress?: () => void;
  disabled?: boolean;
  announceOnPress?: string;
}

/**
 * Accessible touchable component with enhanced accessibility features
 */
export default function AccessibleTouchable({
  children,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = 'button',
  onPress,
  disabled = false,
  announceOnPress,
  ...props
}: Props) {
  const handlePress = () => {
    if (disabled) return;

    // Announce to screen reader if specified
    if (announceOnPress) {
      AccessibilityService.announce(announceOnPress);
    }

    onPress?.();
  };

  return (
    <TouchableOpacity
      {...props}
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      accessible={true}
    >
      {children}
    </TouchableOpacity>
  );
}
