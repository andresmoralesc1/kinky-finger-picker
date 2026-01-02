import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DailyChallengeProgress } from '../types';
import { getTotalXPReward } from '../utils/dailyChallenges';
import DailyChallengeCard from '../components/DailyChallengeCard';

interface Props {
  challengeProgress: DailyChallengeProgress;
  onBack: () => void;
}

export default function DailyChallengesScreen({
  challengeProgress,
  onBack,
}: Props) {
  const completedCount = challengeProgress.challenges.filter(
    c => c.completed
  ).length;
  const totalCount = challengeProgress.challenges.length;
  const allCompleted = completedCount === totalCount;
  const totalXP = getTotalXPReward(challengeProgress);

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#FB5607', '#FF006E']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Daily Challenges</Text>

        <View style={styles.headerStats}>
          <Text style={styles.headerStatsText}>
            {completedCount}/{totalCount}
          </Text>
        </View>
      </LinearGradient>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        {/* Streak */}
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🔥</Text>
          <Text style={styles.statValue}>{challengeProgress.streak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
          {challengeProgress.streak > 0 && (
            <Text style={styles.statBonus}>
              +{Math.min(challengeProgress.streak * 50, 500)} XP Bonus
            </Text>
          )}
        </View>

        {/* Total XP Today */}
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>⭐</Text>
          <Text style={styles.statValue}>{totalXP}</Text>
          <Text style={styles.statLabel}>Total XP</Text>
          {allCompleted && (
            <Text style={styles.statBonus}>All Completed! 🎉</Text>
          )}
        </View>

        {/* Total Challenges */}
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🏆</Text>
          <Text style={styles.statValue}>
            {challengeProgress.totalChallengesCompleted}
          </Text>
          <Text style={styles.statLabel}>All-Time</Text>
        </View>
      </View>

      {/* Challenges List */}
      <ScrollView
        style={styles.challengesContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.challengesList}>
          <Text style={styles.sectionTitle}>Today's Challenges</Text>
          <Text style={styles.sectionSubtitle}>
            Complete challenges to earn bonus XP! {'\n'}
            New challenges every day at midnight.
          </Text>

          {challengeProgress.challenges.map((challenge, index) => (
            <DailyChallengeCard
              key={challenge.id}
              challenge={challenge}
              index={index}
            />
          ))}

          {/* All Completed Message */}
          {allCompleted && (
            <View style={styles.completedCard}>
              <Text style={styles.completedEmoji}>🎊</Text>
              <Text style={styles.completedTitle}>
                All Challenges Completed!
              </Text>
              <Text style={styles.completedMessage}>
                You've completed all daily challenges! {'\n'}
                Come back tomorrow for new challenges.
              </Text>
              <Text style={styles.completedXP}>
                Total Earned Today: {totalXP} XP
              </Text>
            </View>
          )}

          {/* Tips Section */}
          <View style={styles.tipsSection}>
            <Text style={styles.tipsTitle}>💡 Tips</Text>
            <View style={styles.tip}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>
                Complete all challenges to maintain your streak
              </Text>
            </View>
            <View style={styles.tip}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>
                Streak bonus increases by +50 XP per day (max 500 XP)
              </Text>
            </View>
            <View style={styles.tip}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>
                Challenges reset at midnight local time
              </Text>
            </View>
            <View style={styles.tip}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>
                Epic challenges give the highest XP rewards
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerStats: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  headerStatsText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  statsSection: {
    flexDirection: 'row',
    padding: 20,
    gap: 10,
    backgroundColor: '#0a0a0a',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  statIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  statBonus: {
    fontSize: 10,
    color: '#06FFA5',
    marginTop: 4,
    fontWeight: '600',
    textAlign: 'center',
  },
  challengesContainer: {
    flex: 1,
  },
  challengesList: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
    lineHeight: 20,
  },
  completedCard: {
    backgroundColor: '#06FFA5',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginVertical: 20,
  },
  completedEmoji: {
    fontSize: 60,
    marginBottom: 15,
  },
  completedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  completedMessage: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 22,
  },
  completedXP: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  tipsSection: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 20,
    marginTop: 30,
    borderWidth: 1,
    borderColor: '#333',
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  tip: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  tipBullet: {
    color: '#06FFA5',
    fontSize: 16,
    marginRight: 10,
    fontWeight: 'bold',
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#bbb',
    lineHeight: 20,
  },
});
