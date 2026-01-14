import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GameMode } from '../types';

const { width, height } = Dimensions.get('window');

interface Props {
  onSelectMode: (mode: GameMode) => void;
  onQuickPlay?: () => void;
  onOpenSettings?: () => void;
  onOpenStats?: () => void;
  onOpenAchievements?: () => void;
  onOpenDailyChallenges?: () => void;
  onOpenAIChat?: () => void;
  onOpenAIGenerator?: () => void;
}

export default function ModeSelectionScreen({ onSelectMode, onQuickPlay, onOpenSettings, onOpenStats, onOpenAchievements, onOpenDailyChallenges, onOpenAIChat, onOpenAIGenerator }: Props) {
  return (
    <View style={styles.container}>
      {/* Header buttons */}
      <View style={styles.headerButtons}>
        {onOpenDailyChallenges && (
          <TouchableOpacity style={styles.iconButton} onPress={onOpenDailyChallenges}>
            <Text style={styles.iconButtonText}>🎯</Text>
          </TouchableOpacity>
        )}
        {onOpenAchievements && (
          <TouchableOpacity style={styles.iconButton} onPress={onOpenAchievements}>
            <Text style={styles.iconButtonText}>🏆</Text>
          </TouchableOpacity>
        )}
        {onOpenStats && (
          <TouchableOpacity style={styles.iconButton} onPress={onOpenStats}>
            <Text style={styles.iconButtonText}>📊</Text>
          </TouchableOpacity>
        )}
        {onOpenSettings && (
          <TouchableOpacity style={styles.iconButton} onPress={onOpenSettings}>
            <Text style={styles.iconButtonText}>⚙️</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.title}>Kinky Finger Picker</Text>

      {/* Logo */}
      <Image
        source={require('../../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Quick Play Button */}
      {onQuickPlay && (
        <TouchableOpacity
          style={styles.quickPlayButton}
          onPress={onQuickPlay}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Quick Play"
          accessibilityHint="Start a game immediately with Hetero mode and Mild level"
        >
          <LinearGradient
            colors={['#FF006E', '#8338EC']}
            style={styles.quickPlayGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.quickPlayEmoji}>🚀</Text>
            <Text style={styles.quickPlayText}>QUICK PLAY</Text>
            <Text style={styles.quickPlaySubtext}>Hetero • Mild</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}

      <Text style={styles.subtitle}>Or choose your mode</Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => onSelectMode('hetero')}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Hetero mode"
          accessibilityHint="Choose Hetero mode with split screen for female and male players"
        >
          <LinearGradient
            colors={['#FF006E', '#FF1744']}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.buttonEmoji}>♀️♂️</Text>
            <Text style={styles.buttonText}>Hetero</Text>
            <Text style={styles.buttonSubtext}>Split screen mode</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => onSelectMode('gay')}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Gay mode"
          accessibilityHint="Choose Gay mode with full screen for male players"
        >
          <LinearGradient
            colors={['#3A86FF', '#8338EC']}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.buttonEmoji}>♂️♂️</Text>
            <Text style={styles.buttonText}>Gay</Text>
            <Text style={styles.buttonSubtext}>Full screen mode</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => onSelectMode('lesbian')}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Lesbian mode"
          accessibilityHint="Choose Lesbian mode with full screen for female players"
        >
          <LinearGradient
            colors={['#FF6D00', '#FFBE0B']}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.buttonEmoji}>♀️♀️</Text>
            <Text style={styles.buttonText}>Lesbian</Text>
            <Text style={styles.buttonSubtext}>Full screen mode</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* AI Features Section */}
      <Text style={styles.subtitle}>🤖 AI-Powered Features</Text>

      <View style={styles.aiButtonsContainer}>
        {onOpenAIChat && (
          <TouchableOpacity
            style={styles.aiButton}
            onPress={onOpenAIChat}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="AI Chat Assistant"
            accessibilityHint="Chat with AI assistant for suggestions and advice"
          >
            <LinearGradient
              colors={['#8338EC', '#3A86FF']}
              style={styles.aiGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.aiEmoji}>💬</Text>
              <Text style={styles.aiText}>AI Chat</Text>
              <Text style={styles.aiSubtext}>Get suggestions & advice</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {onOpenAIGenerator && (
          <TouchableOpacity
            style={styles.aiButton}
            onPress={onOpenAIGenerator}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="AI Question Generator"
            accessibilityHint="Generate custom questions with AI"
          >
            <LinearGradient
              colors={['#FF006E', '#8338EC', '#3A86FF']}
              style={styles.aiGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.aiEmoji}>✨</Text>
              <Text style={styles.aiText}>AI Generator</Text>
              <Text style={styles.aiSubtext}>Create custom questions</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
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
  headerButtons: {
    position: 'absolute',
    top: 50,
    right: 20,
    flexDirection: 'row',
    gap: 10,
    zIndex: 10,
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonText: {
    fontSize: 24,
  },
  quickPlayButton: {
    width: '100%',
    height: 140,
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 30,
    shadowColor: '#FF006E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  quickPlayGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  quickPlayEmoji: {
    fontSize: 50,
    marginBottom: 8,
  },
  quickPlayText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    letterSpacing: 1,
  },
  quickPlaySubtext: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FF006E',
    marginBottom: 10,
    textAlign: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 30,
    opacity: 0.8,
  },
  buttonsContainer: {
    width: '100%',
    gap: 20,
  },
  aiButtonsContainer: {
    width: '100%',
    gap: 15,
    marginTop: 10,
  },
  aiButton: {
    width: '100%',
    height: 100,
    borderRadius: 20,
    overflow: 'hidden',
  },
  aiGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  aiEmoji: {
    fontSize: 30,
    marginBottom: 5,
  },
  aiText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 3,
  },
  aiSubtext: {
    fontSize: 13,
    color: '#fff',
    opacity: 0.9,
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
});
