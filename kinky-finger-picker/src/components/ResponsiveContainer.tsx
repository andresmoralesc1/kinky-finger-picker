import React, { ReactNode } from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { Responsive } from '../utils/responsive';

interface Props {
  children: ReactNode;
  style?: ViewStyle;
  phoneStyle?: ViewStyle;
  tabletStyle?: ViewStyle;
  portraitStyle?: ViewStyle;
  landscapeStyle?: ViewStyle;
  maxWidth?: number;
  centered?: boolean;
}

/**
 * Container that adapts to different screen sizes and orientations
 */
export default function ResponsiveContainer({
  children,
  style,
  phoneStyle,
  tabletStyle,
  portraitStyle,
  landscapeStyle,
  maxWidth,
  centered = false,
}: Props) {
  const isTablet = Responsive.isTablet();
  const isLandscape = Responsive.isLandscape();
  const padding = Responsive.padding();

  const containerStyle: ViewStyle = {
    padding,
    ...(maxWidth && { maxWidth, alignSelf: 'center', width: '100%' }),
    ...(centered && { alignItems: 'center', justifyContent: 'center' }),
    ...style,
    ...(isTablet && tabletStyle),
    ...(!isTablet && phoneStyle),
    ...(isLandscape && landscapeStyle),
    ...(!isLandscape && portraitStyle),
  };

  return <View style={containerStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  // No static styles needed
});
