import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { IntensityLevel } from '../types';

interface ShareCardProps {
  title: string;
  subtitle?: string;
  emoji: string;
  stats?: {
    rounds?: number;
    level?: IntensityLevel;
    timesSelected?: number;
    completionRate?: number;
  };
  onClose: () => void;
}

export default function ShareCard({ title, subtitle, emoji, stats, onClose }: ShareCardProps) {
  const viewShotRef = useRef<ViewShot>(null);

  const LEVEL_LABELS: Record<IntensityLevel, string> = {
    mild: 'Suave',
    spicy: 'Picante',
    extreme: 'Extremo',
  };

  const getLevelEmoji = (level: IntensityLevel) => {
    switch (level) {
      case 'mild': return '🌶️';
      case 'spicy': return '🌶️🌶️';
      case 'extreme': return '🌶️🌶️🌶️';
    }
  };

  const handleShare = async () => {
    try {
      if (!viewShotRef.current?.capture) return;

      // Capture screenshot
      const uri = await viewShotRef.current.capture();

      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();

      if (isAvailable) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: '¡Comparte tu momento en Kinky Finger Picker!',
        });
      } else {
        Alert.alert('No disponible', 'No se puede compartir en este dispositivo');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Error', 'No se pudo compartir la imagen');
    }
  };

  return (
    <View style={styles.overlay}>
      <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 0.9 }}>
        <LinearGradient
          colors={['#E50914', '#9B0014']}
          style={styles.card}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Content */}
          <Text style={styles.emoji}>{emoji}</Text>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

          {/* Stats */}
          {stats && (
            <View style={styles.statsContainer}>
              {stats.rounds !== undefined && (
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{stats.rounds}</Text>
                  <Text style={styles.statLabel}>Rondas</Text>
                </View>
              )}
              {stats.level && (
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{getLevelEmoji(stats.level)}</Text>
                  <Text style={styles.statLabel}>{LEVEL_LABELS[stats.level] || stats.level}</Text>
                </View>
              )}
              {stats.timesSelected !== undefined && (
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{stats.timesSelected}x</Text>
                  <Text style={styles.statLabel}>Elegido</Text>
                </View>
              )}
              {stats.completionRate !== undefined && (
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{stats.completionRate}%</Text>
                  <Text style={styles.statLabel}>Completado</Text>
                </View>
              )}
            </View>
          )}

          {/* Branding */}
          <View style={styles.branding}>
            <Text style={styles.brandingText}>🌶️ Kinky Finger Picker</Text>
          </View>
        </LinearGradient>
      </ViewShot>

      {/* Action buttons (outside screenshot) */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.shareButtonText}>📱 Compartir</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  card: {
    width: 350,
    minHeight: 400,
    borderRadius: 30,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 16,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    marginTop: 20,
    marginBottom: 30,
  },
  statItem: {
    alignItems: 'center',
    minWidth: 80,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    textTransform: 'uppercase',
  },
  branding: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.3)',
  },
  brandingText: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  actions: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 30,
  },
  shareButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  shareButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E50914',
  },
  closeButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#fff',
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
