import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface Props {
  onComplete: () => void;
}

const tutorialSteps = [
  {
    title: 'Welcome!',
    description: 'This is a party game for adults. Select a game mode and let the fun begin!',
    emoji: '🎉',
  },
  {
    title: 'Choose Your Mode',
    description: 'Hetero mode splits the screen. Gay/Lesbian modes use the full screen.',
    emoji: '👥',
  },
  {
    title: 'Pick Intensity',
    description: 'Start Mild and work your way up to Extreme. You can change levels anytime!',
    emoji: '🌶️',
  },
  {
    title: 'Finger Selection',
    description: 'All players place one finger on the screen. After 3 seconds, one player is randomly chosen!',
    emoji: '👆',
  },
  {
    title: 'Complete or Skip',
    description: 'Complete the dare/question, or skip it (limited skips). Timer adds pressure!',
    emoji: '⏱️',
  },
  {
    title: 'Respect Boundaries',
    description: 'This is a game! Always respect consent and boundaries. Have fun responsibly!',
    emoji: '❤️',
  },
];

export default function TutorialScreen({ onComplete }: Props) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const step = tutorialSteps[currentStep];

  return (
    <LinearGradient
      colors={['#8338EC', '#3A86FF']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.emoji}>{step.emoji}</Text>
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.description}>{step.description}</Text>

        <View style={styles.dotsContainer}>
          {tutorialSteps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentStep && styles.activeDot,
              ]}
            />
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>
          {currentStep === tutorialSteps.length - 1 ? "Let's Play!" : 'Next'}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  skipButton: {
    alignSelf: 'flex-end',
    marginTop: 50,
    padding: 10,
  },
  skipText: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 26,
    opacity: 0.9,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 50,
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 30,
  },
  nextButton: {
    backgroundColor: '#fff',
    paddingVertical: 18,
    paddingHorizontal: 50,
    borderRadius: 30,
    alignSelf: 'center',
    marginBottom: 50,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8338EC',
  },
});
