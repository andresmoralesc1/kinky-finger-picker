import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IntensityLevel } from '../types';

interface Props {
  onSelectLevel: (level: IntensityLevel) => void;
  onBack: () => void;
}

export default function LevelSelectionScreen({ onSelectLevel, onBack }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Choose Intensity</Text>
      <Text style={styles.subtitle}>How kinky do you want to start?</Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => onSelectLevel('mild')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#06FFA5', '#00E676']}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.buttonEmoji}>🌶️</Text>
            <Text style={styles.buttonText}>Mild</Text>
            <Text style={styles.buttonSubtext}>Flirty & playful</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => onSelectLevel('spicy')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#FB5607', '#FF6D00']}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.buttonEmoji}>🌶️🌶️</Text>
            <Text style={styles.buttonText}>Spicy</Text>
            <Text style={styles.buttonSubtext}>Getting hot</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => onSelectLevel('extreme')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#FF006E', '#D500F9']}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.buttonEmoji}>🌶️🌶️🌶️</Text>
            <Text style={styles.buttonText}>Extreme</Text>
            <Text style={styles.buttonSubtext}>No limits! 18+</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <Text style={styles.note}>You can change level during the game</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FF006E',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 60,
    opacity: 0.8,
  },
  buttonsContainer: {
    width: '100%',
    gap: 20,
  },
  button: {
    width: '100%',
    height: 120,
    borderRadius: 20,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  buttonEmoji: {
    fontSize: 40,
    marginBottom: 5,
  },
  buttonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  buttonSubtext: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  note: {
    marginTop: 30,
    color: '#fff',
    opacity: 0.6,
    fontSize: 14,
  },
});
