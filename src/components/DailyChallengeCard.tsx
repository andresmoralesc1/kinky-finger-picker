import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DailyChallenge } from '../types';
import { getDifficultyColor, getDifficultyText } from '../utils/dailyChallenges';

interface Props {
  challenge: DailyChallenge;
  index: number;
}

export default function DailyChallengeCard({ challenge, index }: Props) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const difficultyColor = getDifficultyColor(challenge.difficulty);
  const progressPercent = Math.min(
    (challenge.progress / challenge.requirement) * 100,
    100
  );

  useEffect(() => {
    // Entrance animation with delay based on index
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: progressPercent,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progressPercent]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <LinearGradient
        colors={
          challenge.completed
            ? ['#06FFA5', '#00D084']
            : ['#1a1a1a', '#2a2a2a']
        }
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Completed checkmark */}
        {challenge.completed && (
          <View style={styles.completedBadge}>
            <Text style={styles.completedIcon}>✓</Text>
          </View>
        )}

        {/* Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{challenge.icon}</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title and Difficulty */}
          <View style={styles.header}>
            <Text
              style={[
                styles.title,
                challenge.completed && styles.titleCompleted,
              ]}
            >
              {challenge.title}
            </Text>
            <View
              style={[
                styles.difficultyBadge,
                { backgroundColor: difficultyColor },
              ]}
            >
              <Text style={styles.difficultyText}>
                {getDifficultyText(challenge.difficulty)}
              </Text>
            </View>
          </View>

          {/* Description */}
          <Text
            style={[
              styles.description,
              challenge.completed && styles.descriptionCompleted,
            ]}
          >
            {challenge.description}
          </Text>

          {/* Progress */}
          <View style={styles.progressSection}>
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressBarFill,
                  {
                    width: progressWidth,
                    backgroundColor: challenge.completed
                      ? '#fff'
                      : difficultyColor,
                  },
                ]}
              />
            </View>
            <Text
              style={[
                styles.progressText,
                challenge.completed && styles.progressTextCompleted,
              ]}
            >
              {challenge.progress}/{challenge.requirement}
            </Text>
          </View>

          {/* XP Reward */}
          <View style={styles.rewardSection}>
            <Text
              style={[
                styles.rewardText,
                challenge.completed && styles.rewardTextCompleted,
              ]}
            >
              {challenge.completed ? '✓ ' : ''}+{challenge.xpReward} XP
            </Text>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333',
    position: 'relative',
    overflow: 'hidden',
  },
  completedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#06FFA5',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  icon: {
    fontSize: 32,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  titleCompleted: {
    color: '#000',
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginLeft: 10,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
  },
  description: {
    fontSize: 14,
    color: '#bbb',
    marginBottom: 12,
  },
  descriptionCompleted: {
    color: '#000',
    opacity: 0.7,
  },
  progressSection: {
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#333',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 5,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  },
  progressTextCompleted: {
    color: '#000',
    fontWeight: 'bold',
  },
  rewardSection: {
    marginTop: 5,
  },
  rewardText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#06FFA5',
  },
  rewardTextCompleted: {
    color: '#000',
  },
});
