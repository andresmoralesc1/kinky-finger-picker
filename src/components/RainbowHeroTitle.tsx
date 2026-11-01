import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, Dimensions } from 'react-native';

interface Props {
  title?: string;
  subtitle?: string;
  tagline?: string;
}

export default function RainbowHeroTitle({
  title = 'Kinky Finger Picker',
  subtitle,
  tagline = 'Pon tus dedos en la pantalla y rompe el hielo',
}: Props) {
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const updateDimensions = () => {
      const { width } = Dimensions.get('window');
      setIsNarrow(width <= 480);
    };

    updateDimensions();
    const subscription = Dimensions.addEventListener('change', updateDimensions);
    return () => subscription?.remove();
  }, []);

  // Multi-layered 3D shadow extrusion adapted to the Red & White dark aesthetic
  const desktopExtrusionShadow = `
    2px 4px #FF4D5A, 2px 6px #000, 
    4px 8px #E50914, 4px 10px #000, 
    6px 12px #B20710, 6px 14px #000, 
    8px 16px #8A000B, 8px 18px #000, 
    10px 20px #5E0007, 10px 22px #000
  `;

  const webTitleStyle = Platform.OS === 'web'
    ? {
        textShadow: isNarrow
          ? '2px 4px #E50914, 4px 8px #8A000B, 0 8px 20px rgba(229, 9, 20, 0.65)'
          : desktopExtrusionShadow,
        WebkitTextStroke: '1px rgba(0, 0, 0, 0.85)',
      }
    : {};

  return (
    <View style={styles.container}>
      <View style={styles.titleWrapper}>
        {/* Native fallback shadow layer for iOS/Android */}
        {Platform.OS !== 'web' && (
          <Text style={[styles.title, styles.nativeShadowLayer]} accessibilityElementsHidden={true}>
            {title}
          </Text>
        )}

        <Text
          style={[
            styles.title,
            isNarrow ? styles.titleMobile : styles.titleDesktop,
            webTitleStyle as any,
          ]}
        >
          {title}
        </Text>
      </View>

      {subtitle ? (
        <View style={styles.subtitleBadge}>
          <Text style={styles.subtitleText}>{subtitle}</Text>
        </View>
      ) : null}

      {tagline ? <Text style={styles.taglineText}>{tagline}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    width: '100%',
  },
  titleWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
    fontStyle: 'italic',
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  titleDesktop: {
    fontSize: 32,
    lineHeight: 38,
    marginBottom: 6,
  },
  titleMobile: {
    fontSize: 26,
    lineHeight: 32,
    marginBottom: 4,
  },
  nativeShadowLayer: {
    position: 'absolute',
    top: 3,
    left: 2,
    color: '#E50914',
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 3, height: 4 },
    textShadowRadius: 6,
  },
  subtitleBadge: {
    backgroundColor: 'rgba(229, 9, 20, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(229, 9, 20, 0.6)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginBottom: 4,
    shadowColor: '#E50914',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  subtitleText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  taglineText: {
    color: '#CCCCCC',
    fontSize: 13,
    textAlign: 'center',
    maxWidth: 380,
    marginTop: 2,
  },
});
