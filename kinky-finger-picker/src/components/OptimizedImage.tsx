import React, { useState, useEffect } from 'react';
import { Image, ImageProps, View, ActivityIndicator, StyleSheet } from 'react-native';
import { ImageOptimization } from '../utils/performance';

interface Props extends Omit<ImageProps, 'source'> {
  source: { uri: string } | number;
  width?: number;
  height?: number;
  placeholder?: string;
  showLoader?: boolean;
  onLoadEnd?: () => void;
}

/**
 * Optimized image component with progressive loading
 */
export default function OptimizedImage({
  source,
  width,
  height,
  placeholder,
  showLoader = true,
  onLoadEnd,
  style,
  ...props
}: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoading(false);
    setError(false);
    onLoadEnd?.();
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  const placeholderUri = placeholder || (width && height
    ? ImageOptimization.getPlaceholder(width, height)
    : undefined
  );

  return (
    <View style={[styles.container, style]}>
      {loading && showLoader && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color="#FF006E" />
        </View>
      )}

      {error && (
        <View style={[styles.errorContainer, { width, height }]}>
          <View style={styles.errorPlaceholder} />
        </View>
      )}

      {!error && (
        <Image
          {...props}
          source={source}
          style={[style, loading && styles.hidden]}
          onLoad={handleLoad}
          onError={handleError}
          resizeMode={props.resizeMode || 'cover'}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
  },
  errorPlaceholder: {
    width: 50,
    height: 50,
    backgroundColor: '#3a3a3a',
    borderRadius: 25,
  },
  hidden: {
    opacity: 0,
  },
});
