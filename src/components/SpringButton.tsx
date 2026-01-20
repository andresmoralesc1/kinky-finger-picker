import React, { useRef } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  TouchableOpacityProps,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Responsive } from '../utils/responsive';

export interface SpringButtonProps extends TouchableOpacityProps {
  title: string;
  colors?: string[];
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

/**
 * Spring button with smooth press animations
 *
 * Features:
 * - Spring-based scale animation
 * - Multiple variants (primary, secondary, outline, ghost)
 * - Icon support
 * - Responsive sizing
 * - Gradient backgrounds
 * - Disabled state
 * - Full width option
 */
export const SpringButton: React.FC<SpringButtonProps> = {
  title,
  colors = ['#FF006E', '#8338EC'],
  variant = 'primary',
  size = 'medium',
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  onPress,
  ...props
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shimmerAnim = useRef(new Animated.Value(-1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.94,
      useNativeDriver: true,
      speed: 50,
      bounciness: 8,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 8,
    }).start();
  };

  // Shimmer effect for primary variant
  React.useEffect(() => {
    if (variant === 'primary' && !disabled) {
      const shimmerAnimation = Animated.loop(
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      );
      shimmerAnimation.start();
      return () => shimmerAnimation.stop();
    }
  }, [variant, disabled]);

  const sizeStyles = {
    small: {
      height: Responsive.fontSize(40),
      paddingHorizontal: Responsive.spacing(16),
      borderRadius: Responsive.fontSize(20),
      fontSize: Responsive.fontSize(14),
    },
    medium: {
      height: Responsive.fontSize(52),
      paddingHorizontal: Responsive.spacing(24),
      borderRadius: Responsive.fontSize(26),
      fontSize: Responsive.fontSize(16),
    },
    large: {
      height: Responsive.fontSize(60),
      paddingHorizontal: Responsive.spacing(32),
      borderRadius: Responsive.fontSize(30),
      fontSize: Responsive.fontSize(18),
    },
  };

  const currentSize = sizeStyles[size];

  const buttonContent = (
    <>
      {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
      <Text
        style={[
          styles.text,
          { fontSize: currentSize.fontSize },
          variant === 'outline' && styles.textOutline,
          variant === 'ghost' && styles.textGhost,
          disabled && styles.textDisabled,
        ]}
      >
        {title}
      </Text>
      {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
    </>
  );

  const animatedStyle = {
    transform: [{ scale: scaleAnim }],
  };

  const buttonStyle = [
    styles.button,
    {
      height: currentSize.height,
      paddingHorizontal: currentSize.paddingHorizontal,
      borderRadius: currentSize.borderRadius,
    },
    fullWidth && styles.fullWidth,
    variant === 'outline' && styles.outline,
    variant === 'ghost' && styles.ghost,
    disabled && styles.disabled,
    style,
  ];

  if (variant === 'primary' && !disabled) {
    return (
      <Animated.View style={[animatedStyle, fullWidth && styles.fullWidth]}>
        <TouchableOpacity
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled}
          activeOpacity={1}
          {...props}
        >
          <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={buttonStyle}
          >
            <Animated.View
              style={[
                styles.shimmer,
                {
                  transform: [
                    {
                      translateX: shimmerAnim.interpolate({
                        inputRange: [-1, 1],
                        outputRange: [-200, 200],
                      }),
                    },
                  ],
                },
              ]}
            />
            {buttonContent}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[animatedStyle, fullWidth && styles.fullWidth]}>
      <TouchableOpacity
        style={buttonStyle}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.8}
        {...props}
      >
        {buttonContent}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    color: '#fff',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  textOutline: {
    color: '#FF006E',
  },
  textGhost: {
    color: '#FF006E',
  },
  textDisabled: {
    color: '#666',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FF006E',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    backgroundColor: '#333',
    borderColor: '#444',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});
